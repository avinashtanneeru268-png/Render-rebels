import { IDetector } from "./IDetector.js";
import { ModelAnalysisResult, RegionSource } from "@sitesentinel/shared";
import { PromptAInput } from "../prompts/prompts.js";
export declare class GeminiVisionDetector implements IDetector {
    readonly name = "Gemini Vision Multimodal Understanding";
    readonly kind: RegionSource;
    readonly supportsNumericConfidence = false;
    detect(imageBuffer: Buffer, mimeType: string, context: PromptAInput): Promise<ModelAnalysisResult>;
}
//# sourceMappingURL=GeminiVisionDetector.d.ts.map