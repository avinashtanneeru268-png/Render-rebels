import { Router } from "express";
import { env } from "../config/env.js";
import { isGeminiConfigured } from "../ai/geminiClient.js";
import { getActiveDetector } from "../ai/detectors/index.js";
const router = Router();
router.get("/", (_req, res) => {
    const detector = getActiveDetector();
    res.json({
        status: "ok",
        mode: env.DATA_MODE,
        aiConfigured: isGeminiConfigured(),
        version: "1.0.0",
        activeDetector: detector.name,
    });
});
export default router;
//# sourceMappingURL=health.js.map