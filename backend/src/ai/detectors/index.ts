import { IDetector } from "./IDetector.js";
import { GeminiVisionDetector } from "./GeminiVisionDetector.js";
import { OnnxDetector } from "./OnnxDetector.js";
import { env } from "../../config/env.js";

const geminiDetector = new GeminiVisionDetector();
const onnxDetector = new OnnxDetector();

export function getActiveDetector(): IDetector {
  if (env.DETECTOR_MODEL_PATH && onnxDetector.isModelAvailable()) {
    return onnxDetector;
  }
  return geminiDetector;
}

export * from "./IDetector.js";
export * from "./GeminiVisionDetector.js";
export * from "./OnnxDetector.js";
