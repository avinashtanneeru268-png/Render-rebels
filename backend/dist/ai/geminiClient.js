import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";
import { SYSTEM_PROMPT } from "./prompts/system.js";
import { buildPromptA, buildPromptC, } from "./prompts/prompts.js";
import { GEMINI_ANALYSIS_RESPONSE_SCHEMA, GEMINI_COMPARISON_RESPONSE_SCHEMA, } from "./schemas.js";
import { modelAnalysisResultSchema, modelComparisonResultSchema, } from "@sitesentinel/shared";
let aiInstance = null;
export function getGeminiClient() {
    if (!env.GEMINI_API_KEY) {
        return null;
    }
    if (!aiInstance) {
        aiInstance = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    }
    return aiInstance;
}
export function isGeminiConfigured() {
    return Boolean(env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim().length > 0);
}
// Exponential backoff helper for rate limits (429)
async function withRetry(fn, maxRetries = 3) {
    let attempt = 0;
    let delay = 1000;
    while (true) {
        try {
            return await fn();
        }
        catch (err) {
            attempt++;
            const isRateLimit = err?.status === 429 ||
                err?.status === 503 ||
                err?.message?.includes("429") ||
                err?.message?.includes("503") ||
                err?.message?.includes("RESOURCE_EXHAUSTED") ||
                err?.message?.includes("UNAVAILABLE") ||
                err?.message?.includes("high demand");
            if (isRateLimit && attempt < maxRetries) {
                const jitter = Math.random() * 500;
                console.warn(`[Gemini API] Temporary capacity/rate limit hit (${err?.status || '503'}). Retrying in ${Math.round(delay + jitter)}ms (attempt ${attempt}/${maxRetries})...`);
                await new Promise((r) => setTimeout(r, delay + jitter));
                delay *= 2;
                continue;
            }
            throw err;
        }
    }
}
const CANDIDATE_MODELS = [
    env.GEMINI_MODEL,
    "gemini-3.6-flash",
    "gemini-3.7-flash",
    "gemini-3-flash-preview",
    "gemini-3.5-flash",
    "gemini-3.8-flash",
].filter((m, i, arr) => m && arr.indexOf(m) === i);
export async function runGeminiAnalysis(imageBuffer, mimeType, promptInput) {
    const ai = getGeminiClient();
    if (!ai) {
        throw new Error("AI_UNAVAILABLE: Gemini API key is not configured.");
    }
    const base64Image = imageBuffer.toString("base64");
    const promptText = buildPromptA(promptInput);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout
    try {
        let lastError = null;
        for (const modelName of CANDIDATE_MODELS) {
            try {
                const executeCall = async (repairPrompt) => {
                    const contents = [
                        {
                            inlineData: {
                                data: base64Image,
                                mimeType: mimeType === "image/webp" ? "image/webp" : mimeType === "image/png" ? "image/png" : "image/jpeg",
                            },
                        },
                        {
                            text: repairPrompt ? `${promptText}\n\nIMPORTANT REPAIR: Previous output had validation error: ${repairPrompt}. Correct and adhere strictly to the JSON schema.` : promptText,
                        },
                    ];
                    const response = await ai.models.generateContent({
                        model: modelName,
                        contents,
                        config: {
                            systemInstruction: SYSTEM_PROMPT,
                            responseMimeType: "application/json",
                            responseSchema: GEMINI_ANALYSIS_RESPONSE_SCHEMA,
                            abortSignal: controller.signal,
                            temperature: 0.2,
                        },
                    });
                    const responseText = response.text;
                    if (!responseText) {
                        throw new Error("Empty response received from Gemini model.");
                    }
                    let parsedJson;
                    try {
                        parsedJson = JSON.parse(responseText);
                    }
                    catch (e) {
                        throw new Error(`Invalid JSON returned by model: ${e.message}`);
                    }
                    const validated = modelAnalysisResultSchema.safeParse(parsedJson);
                    if (!validated.success) {
                        throw new Error(`Schema validation error: ${validated.error.message}`);
                    }
                    return validated.data;
                };
                try {
                    return await withRetry(() => executeCall());
                }
                catch (firstErr) {
                    if (firstErr.message?.startsWith("Schema validation error") || firstErr.message?.startsWith("Invalid JSON")) {
                        console.warn(`[Gemini API] Primary response from ${modelName} failed schema validation. Attempting single repair retry...`);
                        return await withRetry(() => executeCall(firstErr.message));
                    }
                    throw firstErr;
                }
            }
            catch (err) {
                lastError = err;
                const isTemporary = err?.status === 503 ||
                    err?.status === 429 ||
                    err?.status === 404 ||
                    err?.message?.includes("503") ||
                    err?.message?.includes("429") ||
                    err?.message?.includes("404") ||
                    err?.message?.includes("high demand") ||
                    err?.message?.includes("UNAVAILABLE") ||
                    err?.message?.includes("RESOURCE_EXHAUSTED");
                if (isTemporary) {
                    console.warn(`[Gemini Failover] Model ${modelName} unavailable. Falling over to next candidate model...`);
                    continue;
                }
                throw err;
            }
        }
        throw lastError;
    }
    finally {
        clearTimeout(timeout);
    }
}
export async function runGeminiComparison(previousImageBuffer, currentImageBuffer, mimeType, promptInput) {
    const ai = getGeminiClient();
    if (!ai) {
        throw new Error("AI_UNAVAILABLE: Gemini API key is not configured.");
    }
    const prevBase64 = previousImageBuffer.toString("base64");
    const currBase64 = currentImageBuffer.toString("base64");
    const promptText = buildPromptC(promptInput);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    try {
        let lastError = null;
        for (const modelName of CANDIDATE_MODELS) {
            try {
                const response = await withRetry(async () => {
                    return await ai.models.generateContent({
                        model: modelName,
                        contents: [
                            {
                                text: "PREVIOUS INSPECTION IMAGE (Baseline):",
                            },
                            {
                                inlineData: {
                                    data: prevBase64,
                                    mimeType: mimeType,
                                },
                            },
                            {
                                text: "CURRENT INSPECTION IMAGE (Re-inspection):",
                            },
                            {
                                inlineData: {
                                    data: currBase64,
                                    mimeType: mimeType,
                                },
                            },
                            {
                                text: promptText,
                            },
                        ],
                        config: {
                            systemInstruction: SYSTEM_PROMPT,
                            responseMimeType: "application/json",
                            responseSchema: GEMINI_COMPARISON_RESPONSE_SCHEMA,
                            abortSignal: controller.signal,
                            temperature: 0.2,
                        },
                    });
                });
                const responseText = response.text;
                if (!responseText) {
                    throw new Error("Empty response received from Gemini model for comparison.");
                }
                const parsedJson = JSON.parse(responseText);
                const validated = modelComparisonResultSchema.safeParse(parsedJson);
                if (!validated.success) {
                    console.warn("[Gemini Comparison] Validation warning:", validated.error.message);
                    return {
                        comparable: false,
                        comparability_note: "Model output failed schema validation",
                        previous_finding_changes: [],
                        new_findings: [],
                    };
                }
                return validated.data;
            }
            catch (err) {
                lastError = err;
                const isTemporary = err?.status === 503 ||
                    err?.status === 429 ||
                    err?.status === 404 ||
                    err?.message?.includes("503") ||
                    err?.message?.includes("429") ||
                    err?.message?.includes("404") ||
                    err?.message?.includes("high demand") ||
                    err?.message?.includes("UNAVAILABLE") ||
                    err?.message?.includes("RESOURCE_EXHAUSTED");
                if (isTemporary) {
                    console.warn(`[Gemini Comparison Failover] Model ${modelName} unavailable. Falling over to next candidate model...`);
                    continue;
                }
                throw err;
            }
        }
        throw lastError;
    }
    finally {
        clearTimeout(timeout);
    }
}
//# sourceMappingURL=geminiClient.js.map