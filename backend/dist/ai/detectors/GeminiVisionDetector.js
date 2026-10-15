import { runGeminiAnalysis } from "../geminiClient.js";
export class GeminiVisionDetector {
    name = "Gemini Vision Multimodal Understanding";
    kind = "ai_estimated";
    supportsNumericConfidence = false;
    async detect(imageBuffer, mimeType, context) {
        return await runGeminiAnalysis(imageBuffer, mimeType, context);
    }
}
//# sourceMappingURL=GeminiVisionDetector.js.map