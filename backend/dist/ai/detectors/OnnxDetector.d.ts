import { IDetector } from "./IDetector.js";
import { ModelAnalysisResult, RegionSource } from "@sitesentinel/shared";
import { PromptAInput } from "../prompts/prompts.js";
export declare class OnnxDetector implements IDetector {
    readonly name = "Local ONNX Certified Detector (YOLO/Segmentation)";
    readonly kind: RegionSource;
    readonly supportsNumericConfidence = true;
    private readonly fallbackDetector;
    isModelAvailable(): boolean;
    detect(imageBuffer: Buffer, mimeType: string, context: PromptAInput): Promise<ModelAnalysisResult>;
}
//# sourceMappingURL=OnnxDetector.d.ts.map