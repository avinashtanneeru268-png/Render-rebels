import { Router } from "express";
import { analysesFilterSchema, reviewSubmissionSchema } from "@sitesentinel/shared";
import { authMiddleware } from "../middleware/auth.js";
import { repository } from "../services/repository/index.js";
import { storageProvider } from "../services/storage/index.js";
const router = Router();
// GET /api/analyses (Filterable, Paginated)
router.get("/", authMiddleware, async (req, res, next) => {
    try {
        const user = req.user;
        const filter = analysesFilterSchema.parse(req.query);
        const result = await repository.getAnalyses(user.id, filter);
        res.json({
            items: result.items,
            total: result.total,
            page: filter.page,
            pageSize: filter.pageSize,
            totalPages: Math.ceil(result.total / filter.pageSize),
        });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/analyses/:id (Detail view with signed URLs)
router.get("/:id", authMiddleware, async (req, res, next) => {
    try {
        const user = req.user;
        const id = req.params.id;
        const analysis = await repository.getAnalysisById(user.id, id);
        if (!analysis) {
            res.status(404).json({
                error: {
                    code: "NOT_FOUND",
                    message: `Inspection analysis with ID ${id} was not found or access is denied.`,
                    requestId: req.requestId,
                },
            });
            return;
        }
        // Generate signed URLs for all attached media files
        const mediaWithSignedUrls = await Promise.all(analysis.media.map(async (m) => {
            try {
                const signedUrl = await storageProvider.getSignedUrl(m.storage_path, 900); // 15 min expiration
                return { ...m, signed_url: signedUrl };
            }
            catch (e) {
                return m;
            }
        }));
        res.json({
            ...analysis,
            media: mediaWithSignedUrls,
        });
    }
    catch (err) {
        next(err);
    }
});
// DELETE /api/analyses/:id
router.delete("/:id", authMiddleware, async (req, res, next) => {
    try {
        const user = req.user;
        const id = req.params.id;
        const existing = await repository.getAnalysisById(user.id, id);
        if (!existing) {
            res.status(404).json({
                error: {
                    code: "NOT_FOUND",
                    message: `Inspection analysis with ID ${id} was not found.`,
                    requestId: req.requestId,
                },
            });
            return;
        }
        // Clean up storage media files
        for (const m of existing.media) {
            try {
                await storageProvider.deleteFile(m.storage_path);
            }
            catch (e) {
                // Continue deleting
            }
        }
        await repository.deleteAnalysis(user.id, id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
// PATCH /api/analyses/:id/review (Human Review Workflow)
router.patch("/:id/review", authMiddleware, async (req, res, next) => {
    try {
        const user = req.user;
        const id = req.params.id;
        const analysis = await repository.getAnalysisById(user.id, id);
        if (!analysis) {
            res.status(404).json({
                error: {
                    code: "NOT_FOUND",
                    message: `Inspection analysis with ID ${id} was not found.`,
                    requestId: req.requestId,
                },
            });
            return;
        }
        const body = reviewSubmissionSchema.parse(req.body);
        for (const rev of body.reviews) {
            await repository.createReview({
                finding_id: rev.findingId,
                owner_id: user.id,
                decision: rev.decision,
                corrected_category: rev.correctedCategory,
                corrected_severity: rev.correctedSeverity,
                note: rev.note,
            });
        }
        // Return updated findings list
        const updatedFindings = await repository.getFindingsByAnalysisId(id);
        res.json({
            message: "Human review decisions recorded successfully.",
            findings: updatedFindings,
        });
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=analyses.js.map