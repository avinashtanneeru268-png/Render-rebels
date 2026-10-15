import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { analyzeRequestSchema, allowedMimeTypes } from "@sitesentinel/shared";
import { authMiddleware } from "../middleware/auth.js";
import { repository } from "../services/repository/index.js";
import { pipeline } from "../analysis/pipeline.js";
import { validateMagicBytes } from "../analysis/mediaPreprocessor.js";
import { isGeminiConfigured } from "../ai/geminiClient.js";

const router = Router();

// Upload middleware (memory storage with 50MB limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

// Rate limiting for inspection submissions: 15 per min
const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Analysis submission rate limit exceeded. Please wait 1 minute before submitting again.",
    },
  },
});

router.post(
  "/",
  authMiddleware as any,
  analyzeLimiter as any,
  upload.single("file") as any,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const file = req.file;

      if (!file) {
        res.status(400).json({
          error: {
            code: "MISSING_FILE",
            message: "No inspection photo or video file was provided in the upload request.",
            requestId: req.requestId,
          },
        });
        return;
      }

      // Magic byte verification first
      const magic = validateMagicBytes(file.buffer);
      if (!magic.isValid) {
        res.status(415).json({
          error: {
            code: "UNSUPPORTED_MEDIA_TYPE",
            message: "The uploaded file format does not match allowed types (JPEG, PNG, WebP, MP4, WebM). File content magic bytes check failed.",
            requestId: req.requestId,
          },
        });
        return;
      }

      // Check AI configured unless source is demo
      const parsedBody = analyzeRequestSchema.parse(req.body);
      if (parsedBody.source !== "demo" && !isGeminiConfigured()) {
        res.status(503).json({
          error: {
            code: "AI_UNAVAILABLE",
            message: "Gemini Vision AI key is not configured on this server. Please provide a GEMINI_API_KEY in .env or evaluate using precomputed Demo Cases.",
            requestId: req.requestId,
          },
        });
        return;
      }

      // Ensure Asset exists or is created
      const asset = await repository.createAsset(user.id, {
        asset_code: parsedBody.asset_id,
        name: parsedBody.asset_name || parsedBody.asset_id,
        asset_type: parsedBody.asset_type,
        criticality: parsedBody.asset_criticality,
      });

      // Create Analysis in database with status 'queued'
      const analysis = await repository.createAnalysis(user.id, {
        asset_id: asset.id,
        inspection_type: parsedBody.inspection_type,
        source: parsedBody.source,
        is_simulated: false,
        location_note: parsedBody.location_note,
        context_notes: parsedBody.context_notes,
        status: "queued",
      });

      // Enqueue async processing in background job queue
      pipeline.enqueue({
        analysisId: analysis.id,
        ownerId: user.id,
        assetId: asset.id,
        assetType: parsedBody.asset_type,
        assetCriticality: parsedBody.asset_criticality,
        inspectionType: parsedBody.inspection_type,
        contextNotes: parsedBody.context_notes,
        compareWithPrevious: Boolean(parsedBody.compare_with_previous),
        mediaBuffer: file.buffer,
        mimeType: magic.detectedMime || file.mimetype,
        originalFileName: file.originalname,
        isSimulated: false,
      });

      // Return 202 Accepted immediately
      res.status(202).json({
        analysisId: analysis.id,
        status: "queued",
        assetId: asset.id,
        assetCode: asset.asset_code,
        message: "Visual inspection enqueued successfully for multimodal understanding.",
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
