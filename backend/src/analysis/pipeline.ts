import { v4 as uuidv4 } from "uuid";
import {
  Finding,
  ModelAnalysisResult,
  ApproxRegion,
} from "@sitesentinel/shared";
import { repository } from "../services/repository/index.js";
import { storageProvider } from "../services/storage/index.js";
import { getActiveDetector } from "../ai/detectors/index.js";
import { runGeminiComparison, isGeminiConfigured } from "../ai/geminiClient.js";
import { calculatePriorityScore } from "./priority.js";
import { generateRuleBasedActions, mergeRecommendations } from "./advisory.js";
import { applyChangeDetection } from "./changeDetection.js";
import { extractVideoFrames, validateMagicBytes } from "./mediaPreprocessor.js";
import { env } from "../config/env.js";

export interface PipelineJobInput {
  analysisId: string;
  ownerId: string;
  assetId: string;
  assetType: any;
  assetCriticality: any;
  inspectionType: any;
  contextNotes?: string;
  compareWithPrevious: boolean;
  mediaBuffer: Buffer;
  mimeType: string;
  originalFileName: string;
  isSimulated?: boolean;
}

// In-process background job runner
export class InspectionPipeline {
  private activeJobs = new Map<string, Promise<void>>();

  enqueue(jobInput: PipelineJobInput): void {
    const jobPromise = this.execute(jobInput).finally(() => {
      this.activeJobs.delete(jobInput.analysisId);
    });
    this.activeJobs.set(jobInput.analysisId, jobPromise);
  }

  async execute(job: PipelineJobInput): Promise<void> {
    const startTime = Date.now();
    const {
      analysisId,
      ownerId,
      assetId,
      assetType,
      assetCriticality,
      inspectionType,
      contextNotes,
      compareWithPrevious,
      mediaBuffer,
      mimeType,
      isSimulated,
    } = job;

    try {
      // Stage 1: Preprocessing
      await repository.updateAnalysis(analysisId, {
        status: "processing",
        progress_stage: "Preprocessing",
      });

      const magic = validateMagicBytes(mediaBuffer);
      let framesToAnalyze: Array<{ buffer: Buffer; mime: string; timestampMs?: number }> = [];

      if (magic.isVideo) {
        const extracted = await extractVideoFrames(mediaBuffer, 6, 2);
        framesToAnalyze = extracted.map((f) => ({
          buffer: f.buffer,
          mime: f.mimeType,
          timestampMs: f.timestampMs,
        }));
      } else {
        framesToAnalyze = [{ buffer: mediaBuffer, mime: mimeType }];
      }

      // Save primary media file to storage
      const ext = magic.isVideo ? "mp4" : mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
      const storageKey = `${ownerId}/${analysisId}/primary.${ext}`;
      await storageProvider.saveFile(storageKey, mediaBuffer, mimeType);

      const primaryMedia = await repository.createMediaFile({
        analysis_id: analysisId,
        owner_id: ownerId,
        storage_path: storageKey,
        media_type: magic.isVideo ? "video" : "image",
        mime_type: mimeType,
        size_bytes: mediaBuffer.length,
      });

      // Stage 2: Analyzing
      await repository.updateAnalysis(analysisId, {
        progress_stage: "Analyzing",
      });

      const detector = getActiveDetector();
      let analysisResult: ModelAnalysisResult;

      try {
        analysisResult = await detector.detect(
          framesToAnalyze[0].buffer,
          framesToAnalyze[0].mime,
          {
            asset_type: assetType,
            criticality: assetCriticality,
            inspection_type: inspectionType,
            context_notes: contextNotes,
            imageIndex: 1,
            totalImages: framesToAnalyze.length,
            frameTimestampMs: framesToAnalyze[0].timestampMs,
          }
        );
      } catch (err: any) {
        // If AI is not configured and not simulated, rethrow
        throw err;
      }

      // Stage 3: Normalization & Region Validation
      const rawFindings = analysisResult.findings || [];
      const validatedFindings: Finding[] = [];

      for (const raw of rawFindings) {
        // Validate approx_region
        let validatedRegion: ApproxRegion | null = null;
        if (raw.approx_region) {
          const { x, y, w, h } = raw.approx_region;
          const isValidCoords =
            typeof x === "number" &&
            typeof y === "number" &&
            typeof w === "number" &&
            typeof h === "number" &&
            x >= 0 &&
            y >= 0 &&
            w > 0 &&
            h > 0 &&
            x + w <= 1.001 &&
            y + h <= 1.001 &&
            w * h >= 0.0005;

          if (isValidCoords) {
            validatedRegion = {
              x: Math.max(0, Math.min(1, x)),
              y: Math.max(0, Math.min(1, y)),
              w: Math.max(0.01, Math.min(1 - x, w)),
              h: Math.max(0.01, Math.min(1 - y, h)),
            };
          }
        }

        // Force human review on critical/high or low certainty
        const requiresReview =
          raw.requires_human_review ||
          raw.severity === "critical" ||
          raw.severity === "high" ||
          raw.certainty === "low";

        const findingId = `find-${uuidv4().substring(0, 10)}`;

        // Advisory recommendations
        const ruleActions = generateRuleBasedActions(
          raw.category,
          raw.severity,
          "not_compared",
          assetType
        );
        const mergedActions = mergeRecommendations(ruleActions, raw.recommended_actions || []);

        validatedFindings.push({
          id: findingId,
          analysis_id: analysisId,
          media_file_id: primaryMedia.id,
          category: raw.category,
          severity: raw.severity,
          certainty: raw.certainty,
          confidence_score: null, // Gemini vision is qualitative; numeric only from specialized detector
          title: raw.title,
          evidence_observed: raw.evidence_observed,
          inference: raw.inference || null,
          approx_region: validatedRegion,
          region_source: validatedRegion ? detector.kind : null,
          change: "not_compared",
          change_note: null,
          priority_score: 0,
          priority_factors: {},
          requires_human_review: requiresReview,
          review: "pending",
          recommended_actions: mergedActions,
          created_at: new Date().toISOString(),
        });
      }

      // Stage 4: Change Comparison
      let finalFindings = validatedFindings;
      let linkedPreviousId: string | null = null;

      if (compareWithPrevious) {
        await repository.updateAnalysis(analysisId, {
          progress_stage: "Comparing",
        });

        const previousAnalysis = await repository.getPreviousAnalysis(ownerId, assetId, analysisId);
        if (previousAnalysis && previousAnalysis.findings) {
          linkedPreviousId = previousAnalysis.id;
          let modelCompResult = null;

          // If AI configured and both images available, attempt visual comparison
          if (isGeminiConfigured() && previousAnalysis.media && previousAnalysis.media[0]) {
            try {
              const prevBuf = await storageProvider.getFile(previousAnalysis.media[0].storage_path);
              modelCompResult = await runGeminiComparison(
                prevBuf,
                framesToAnalyze[0].buffer,
                framesToAnalyze[0].mime,
                {
                  asset_id: assetId,
                  asset_type: assetType,
                  previousFindings: previousAnalysis.findings.map((f) => ({
                    id: f.id,
                    title: f.title,
                    category: f.category,
                    severity: f.severity,
                    evidence_observed: f.evidence_observed,
                  })),
                }
              );
            } catch (compErr) {
              console.warn("[Pipeline] Visual comparison step warning:", compErr);
            }
          }

          const changeResult = applyChangeDetection(
            validatedFindings,
            previousAnalysis.findings,
            modelCompResult
          );
          finalFindings = changeResult.updatedCurrentFindings;
        }
      }

      // Stage 5: Priority Scoring (Deterministic)
      for (const finding of finalFindings) {
        const priority = calculatePriorityScore(
          finding.severity,
          finding.change,
          finding.certainty,
          assetCriticality
        );
        finding.priority_score = priority.score;
        finding.priority_factors = priority.factors;
      }

      // Stage 6: Finalizing & Persist
      await repository.updateAnalysis(analysisId, {
        progress_stage: "Finalizing",
      });

      await repository.createFindings(finalFindings);

      const processingMs = Date.now() - startTime;
      await repository.updateAnalysis(analysisId, {
        status: "completed",
        progress_stage: "Completed",
        summary: analysisResult.analysis_summary,
        overall_condition: analysisResult.overall_condition,
        limitations: analysisResult.limitations || [],
        model_name: env.GEMINI_MODEL,
        detector_kind: detector.kind,
        previous_analysis_id: linkedPreviousId,
        processing_ms: processingMs,
        completed_at: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error(`[Pipeline Error in analysis ${analysisId}]:`, err);
      const processingMs = Date.now() - startTime;
      let cleanMessage = err.message || "Analysis failed during processing.";
      try {
        if (typeof cleanMessage === "string" && cleanMessage.includes("{")) {
          const startIdx = cleanMessage.indexOf("{");
          const endIdx = cleanMessage.lastIndexOf("}");
          if (startIdx !== -1 && endIdx !== -1) {
            const parsed = JSON.parse(cleanMessage.substring(startIdx, endIdx + 1));
            if (parsed.error?.message) {
              cleanMessage = parsed.error.message;
            }
          }
        }
      } catch (_) {}

      await repository.updateAnalysis(analysisId, {
        status: "failed",
        error_message: cleanMessage,
        processing_ms: processingMs,
        completed_at: new Date().toISOString(),
      });
    }
  }

  // Safety cleanup on server boot
  async recoverOrphanedAnalyses(): Promise<void> {
    console.log("[Pipeline] Checking for orphaned in-progress analyses...");
    // Any analysis left in 'processing' on boot is cleanly transitioned to 'failed'
    // Handled in server startup
  }
}

export const pipeline = new InspectionPipeline();
