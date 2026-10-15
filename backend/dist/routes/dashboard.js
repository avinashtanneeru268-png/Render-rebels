import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { repository } from "../services/repository/index.js";
const router = Router();
router.get("/summary", authMiddleware, async (req, res, next) => {
    try {
        const user = req.user;
        const summary = await repository.getDashboardSummary(user.id);
        res.json(summary);
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=dashboard.js.map