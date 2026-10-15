import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { repository } from "../services/repository/index.js";

const router = Router();

router.get(
  "/summary",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const summary = await repository.getDashboardSummary(user.id);
      res.json(summary);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
