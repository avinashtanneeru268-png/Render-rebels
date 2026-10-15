export interface MagicByteValidationResult {
    isValid: boolean;
    detectedMime?: string;
    isImage: boolean;
    isVideo: boolean;
}
export declare function validateMagicBytes(buffer: Buffer): MagicByteValidationResult;
export interface ExtractedFrame {
    frameIndex: number;
    timestampMs: number;
    buffer: Buffer;
    mimeType: string;
}
export declare function extractVideoFrames(videoBuffer: Buffer, maxFrames?: number, frameIntervalSeconds?: number): Promise<ExtractedFrame[]>;
//# sourceMappingURL=mediaPreprocessor.d.ts.map