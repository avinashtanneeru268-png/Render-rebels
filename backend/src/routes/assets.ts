import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { repository } from "../services/repository/index.js";

const router = Router();

// GET /api/assets
router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const assets = await repository.getAssets(user.id);
      res.json(assets);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/assets/:id (Asset Details + Inspection Timeline)
router.get(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const id = req.params.id;
      const asset = await repository.getAssetById(user.id, id);

      if (!asset) {
        res.status(404).json({
          error: {
            code: "NOT_FOUND",
            message: `Asset ${id} was not found.`,
            requestId: req.requestId,
          },
        });
        return;
      }

      // Fetch all inspections for this asset to form the timeline
      const inspections = await repository.getAnalyses(user.id, {
        assetId: asset.id,
        page: 1,
        pageSize: 50,
        sort: "created_desc",
      });

      res.json({
        asset,
        timeline: inspections.items,
        totalInspections: inspections.total,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
