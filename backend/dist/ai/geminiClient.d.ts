import { GoogleGenAI } from "@google/genai";
import { PromptAInput, PromptCInput } from "./prompts/prompts.js";
import { ModelAnalysisResult, ModelComparisonResult } from "@sitesentinel/shared";
export declare function getGeminiClient(): GoogleGenAI | null;
export declare function isGeminiConfigured(): boolean;
export declare function runGeminiAnalysis(imageBuffer: Buffer, mimeType: string, promptInput: PromptAInput): Promise<ModelAnalysisResult>;
export declare function runGeminiComparison(previousImageBuffer: Buffer, currentImageBuffer: Buffer, mimeType: string, promptInput: PromptCInput): Promise<ModelComparisonResult>;
//# sourceMappingURL=geminiClient.d.ts.map