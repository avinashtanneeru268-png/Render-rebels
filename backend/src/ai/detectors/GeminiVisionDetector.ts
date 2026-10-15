import { IDetector } from "./IDetector.js";
import { ModelAnalysisResult, RegionSource } from "@sitesentinel/shared";
import { runGeminiAnalysis } from "../geminiClient.js";
import { PromptAInput } from "../prompts/prompts.js";

export class GeminiVisionDetector implements IDetector {
  readonly name = "Gemini Vision Multimodal Understanding";
  readonly kind: RegionSource = "ai_estimated";
  readonly supportsNumericConfidence = false;

  async detect(
    imageBuffer: Buffer,
    mimeType: string,
    context: PromptAInput
  ): Promise<ModelAnalysisResult> {
    return await runGeminiAnalysis(imageBuffer, mimeType, context);
  }
}
