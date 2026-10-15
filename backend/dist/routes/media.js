import { Router } from "express";
import crypto from "crypto";
import { storageProvider } from "../services/storage/index.js";
const router = Router();
router.get("/", async (req, res, next) => {
    try {
        const key = req.query.key;
        const token = req.query.token;
        if (!key || !token) {
            res.status(403).json({ error: { code: "FORBIDDEN", message: "Missing media key or security token." } });
            return;
        }
        // Verify token
        const expected = crypto
            .createHmac("sha256", "local-sitesentinel-secret")
            .update(key)
            .digest("hex")
            .substring(0, 16);
        if (token !== expected) {
            res.status(403).json({ error: { code: "FORBIDDEN", message: "Invalid or expired media token." } });
            return;
        }
        const buffer = await storageProvider.getFile(key);
        // Determine content type
        let contentType = "application/octet-stream";
        if (key.endsWith(".jpg") || key.endsWith(".jpeg"))
            contentType = "image/jpeg";
        else if (key.endsWith(".png"))
            contentType = "image/png";
        else if (key.endsWith(".webp"))
            contentType = "image/webp";
        else if (key.endsWith(".svg"))
            contentType = "image/svg+xml";
        else if (key.endsWith(".mp4"))
            contentType = "video/mp4";
        else if (key.endsWith(".webm"))
            contentType = "video/webm";
        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "public, max-age=86400");
        res.send(buffer);
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=media.js.map