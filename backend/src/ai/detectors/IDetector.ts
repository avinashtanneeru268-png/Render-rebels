import { ModelAnalysisResult, RegionSource } from "@sitesentinel/shared";
import { PromptAInput } from "../prompts/prompts.js";

export interface IDetector {
  readonly name: string;
  readonly kind: RegionSource;
  readonly supportsNumericConfidence: boolean;
  detect(
    imageBuffer: Buffer,
    mimeType: string,
    context: PromptAInput
  ): Promise<ModelAnalysisResult>;
}
