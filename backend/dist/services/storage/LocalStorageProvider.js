import fs from "fs";
import path from "path";
import crypto from "crypto";
export class LocalStorageProvider {
    baseDir;
    constructor() {
        this.baseDir = process.env.VERCEL
            ? path.join("/tmp", "data", "uploads")
            : path.resolve(process.cwd(), "data", "uploads");
        if (!fs.existsSync(this.baseDir)) {
            fs.mkdirSync(this.baseDir, { recursive: true });
        }
    }
    getSafePath(key) {
        const sanitizedKey = key.replace(/\.\./g, "").replace(/^[/\\]+/, "");
        const fullPath = path.join(this.baseDir, sanitizedKey);
        const resolved = path.resolve(fullPath);
        if (!resolved.startsWith(this.baseDir)) {
            throw new Error("Security violation: Path traversal attempt.");
        }
        return resolved;
    }
    async saveFile(key, buffer, _mimeType) {
        const targetPath = this.getSafePath(key);
        const parentDir = path.dirname(targetPath);
        if (!fs.existsSync(parentDir)) {
            fs.mkdirSync(parentDir, { recursive: true });
        }
        await fs.promises.writeFile(targetPath, buffer);
        return key;
    }
    async getFile(key) {
        const targetPath = this.getSafePath(key);
        if (!fs.existsSync(targetPath)) {
            throw new Error(`File not found: ${key}`);
        }
        return await fs.promises.readFile(targetPath);
    }
    async getSignedUrl(key, _expiresInSeconds = 300) {
        // Generate signed token for local verification
        const token = crypto
            .createHmac("sha256", "local-sitesentinel-secret")
            .update(key)
            .digest("hex")
            .substring(0, 16);
        return `/api/media?key=${encodeURIComponent(key)}&token=${token}`;
    }
    async deleteFile(key) {
        const targetPath = this.getSafePath(key);
        if (fs.existsSync(targetPath)) {
            await fs.promises.unlink(targetPath);
        }
    }
}
//# sourceMappingURL=LocalStorageProvider.js.map