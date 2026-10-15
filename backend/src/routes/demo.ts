import { Router, Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { DEMO_CASES } from "../demo/demoCases.js";
import { authMiddleware } from "../middleware/auth.js";
import { repository } from "../services/repository/index.js";
import { storageProvider } from "../services/storage/index.js";
import { calculatePriorityScore } from "../analysis/priority.js";

const router = Router();

// GET /api/demo/cases (Public list)
router.get("/", (_req: Request, res: Response) => {
  const publicCases = DEMO_CASES.map((c) => ({
    id: c.id,
    asset_code: c.asset_code,
    asset_name: c.asset_name,
    asset_type: c.asset_type,
    asset_criticality: c.asset_criticality,
    inspection_type: c.inspection_type,
    title: c.title,
    description: c.description,
    isPair: c.isPair,
    pairRole: c.pairRole,
    findingsCount: c.result.findings.length,
    overallCondition: c.result.overall_condition,
  }));
  res.json(publicCases);
});

// POST /api/demo/cases/:caseId/run (Run simulated demo inspection)
router.post(
  "/:caseId/run",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const caseId = req.params.caseId;
      const demoCase = DEMO_CASES.find((c) => c.id === caseId);

      if (!demoCase) {
        res.status(404).json({
          error: {
            code: "NOT_FOUND",
            message: `Demo case with ID ${caseId} does not exist.`,
            requestId: req.requestId,
          },
        });
        return;
      }

      // Ensure Asset
      const asset = await repository.createAsset(user.id, {
        asset_code: demoCase.asset_code,
        name: demoCase.asset_name,
        asset_type: demoCase.asset_type,
        criticality: demoCase.asset_criticality,
      });

      // Find previous baseline if this is a reinspection
      let previousAnalysisId: string | null = null;
      if (demoCase.pairRole === "reinspection") {
        const prev = await repository.getPreviousAnalysis(user.id, asset.id);
        if (prev) {
          previousAnalysisId = prev.id;
        }
      }

      // Create Analysis
      const analysis = await repository.createAnalysis(user.id, {
        asset_id: asset.id,
        inspection_type: demoCase.inspection_type,
        source: "demo",
        is_simulated: true,
        location_note: demoCase.description,
        context_notes: "Demonstration inspection run from bundled dataset.",
        status: "completed",
        previous_analysis_id: previousAnalysisId,
      });

      // Load and store image
      const demoImagePath = path.resolve(process.cwd(), "..", "demo", "images", demoCase.imageFileName);
      let imageBuffer: Buffer;
      if (fs.existsSync(demoImagePath)) {
        imageBuffer = fs.readFileSync(demoImagePath);
      } else {
        const fallbackPath = path.resolve(process.cwd(), "demo", "images", demoCase.imageFileName);
        if (fs.existsSync(fallbackPath)) {
          imageBuffer = fs.readFileSync(fallbackPath);
        } else {
          imageBuffer = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#1e293b"/></svg>`);
        }
      }

      const storageKey = `${user.id}/${analysis.id}/${demoCase.imageFileName}`;
      await storageProvider.saveFile(storageKey, imageBuffer, "image/svg+xml");

      const media = await repository.createMediaFile({
        analysis_id: analysis.id,
        owner_id: user.id,
        storage_path: storageKey,
        media_type: "image",
        mime_type: "image/svg+xml",
        size_bytes: imageBuffer.length,
        width: 1200,
        height: 900,
      });

      // Create findings
      const findingsToInsert: any[] = [];
      for (const rawF of demoCase.result.findings) {
        const priority = calculatePriorityScore(
          rawF.severity as any,
          rawF.change as any,
          rawF.certainty as any,
          demoCase.asset_criticality
        );

        findingsToInsert.push({
          id: `find-${uuidv4().substring(0, 8)}`,
          analysis_id: analysis.id,
          media_file_id: media.id,
          category: rawF.category,
          severity: rawF.severity,
          certainty: rawF.certainty,
          confidence_score: null,
          title: rawF.title,
          evidence_observed: rawF.evidence_observed,
          inference: rawF.inference,
          approx_region: rawF.approx_region,
          region_source: "ai_estimated",
          change: rawF.change,
          change_note: rawF.change_note,
          priority_score: priority.score,
          priority_factors: priority.factors,
          requires_human_review: true,
          review: "pending",
          recommended_actions: rawF.recommended_actions.map((ra) => ({
            id: `act-${uuidv4().substring(0, 8)}`,
            action: ra.action,
            urgency: ra.urgency as any,
            source: ra.source as any,
            rationale: ra.rationale,
          })),
          created_at: new Date().toISOString(),
        });
      }

      await repository.createFindings(findingsToInsert);

      await repository.updateAnalysis(analysis.id, {
        summary: demoCase.result.summary,
        overall_condition: demoCase.result.overall_condition,
        limitations: demoCase.result.limitations,
        model_name: "gemini-2.5-flash (simulated)",
        detector_kind: "ai_estimated",
        processing_ms: 1240,
        completed_at: new Date().toISOString(),
      });

      res.status(202).json({
        analysisId: analysis.id,
        status: "completed",
        isSimulated: true,
        message: "Simulated demo inspection completed successfully.",
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
