import fs from "fs";
import path from "path";
import os from "os";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { v4 as uuidv4 } from "uuid";
if (ffmpegStatic) {
    ffmpeg.setFfmpegPath(typeof ffmpegStatic === "string" ? ffmpegStatic : ffmpegStatic.default || String(ffmpegStatic));
}
export function validateMagicBytes(buffer) {
    if (buffer.length < 12) {
        return { isValid: false, isImage: false, isVideo: false };
    }
    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        return { isValid: true, detectedMime: "image/jpeg", isImage: true, isVideo: false };
    }
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a) {
        return { isValid: true, detectedMime: "image/png", isImage: true, isVideo: false };
    }
    // WebP: RIFF ... WEBP
    const riff = buffer.toString("ascii", 0, 4);
    const webp = buffer.toString("ascii", 8, 12);
    if (riff === "RIFF" && webp === "WEBP") {
        return { isValid: true, detectedMime: "image/webp", isImage: true, isVideo: false };
    }
    // MP4: ftyp in first 4-12 bytes
    const ftyp = buffer.toString("ascii", 4, 8);
    if (ftyp === "ftyp") {
        return { isValid: true, detectedMime: "video/mp4", isImage: false, isVideo: true };
    }
    // WebM: 1A 45 DF A3
    if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
        return { isValid: true, detectedMime: "video/webm", isImage: false, isVideo: true };
    }
    return { isValid: false, isImage: false, isVideo: false };
}
export async function extractVideoFrames(videoBuffer, maxFrames = 8, frameIntervalSeconds = 2) {
    const tempId = uuidv4();
    const tempDir = path.join(os.tmpdir(), `sitesentinel_video_${tempId}`);
    await fs.promises.mkdir(tempDir, { recursive: true });
    const tempVideoPath = path.join(tempDir, "input.mp4");
    await fs.promises.writeFile(tempVideoPath, videoBuffer);
    const outputPattern = path.join(tempDir, "frame_%03d.jpg");
    try {
        await new Promise((resolve, reject) => {
            ffmpeg(tempVideoPath)
                .outputOptions([
                `-vf fps=1/${frameIntervalSeconds}`,
                `-vframes ${maxFrames}`,
                "-q:v 2",
            ])
                .output(outputPattern)
                .on("end", () => resolve())
                .on("error", (err) => reject(err))
                .run();
        });
        const files = await fs.promises.readdir(tempDir);
        const frameFiles = files
            .filter((f) => f.startsWith("frame_") && f.endsWith(".jpg"))
            .sort();
        const frames = [];
        for (let i = 0; i < frameFiles.length; i++) {
            const fName = frameFiles[i];
            const framePath = path.join(tempDir, fName);
            const buf = await fs.promises.readFile(framePath);
            frames.push({
                frameIndex: i + 1,
                timestampMs: i * frameIntervalSeconds * 1000,
                buffer: buf,
                mimeType: "image/jpeg",
            });
        }
        return frames;
    }
    finally {
        // Clean up temporary files
        try {
            await fs.promises.rm(tempDir, { recursive: true, force: true });
        }
        catch (e) {
            // Ignore temporary directory cleanup failure
        }
    }
}
//# sourceMappingURL=mediaPreprocessor.js.map