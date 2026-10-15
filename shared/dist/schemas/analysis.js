import { z } from "zod";
import { findingCategorySchema, severitySchema, reviewStatusSchema, changeStatusSchema, analysisStatusSchema, certaintyLevelSchema, assetTypeSchema, criticalityLevelSchema, inspectionTypeSchema, urgencyLevelSchema, regionSourceSchema, approxRegionSchema, overallConditionSchema, } from "./taxonomy.js";
// Analysis Request Schema (supports multipart form string coersions)
export const analyzeRequestSchema = z.object({
    asset_id: z
        .string()
        .min(1, "Asset ID is required")
        .max(64, "Asset ID must be 64 characters or fewer")
        .regex(/^[A-Za-z0-9_\-\.]+$/, "Asset ID may only contain letters, numbers, _, -, ."),
    asset_name: z.string().max(120).optional().default(""),
    asset_type: assetTypeSchema.default("building_facade"),
    asset_criticality: criticalityLevelSchema.default("medium"),
    inspection_type: inspectionTypeSchema.default("routine"),
    location_note: z.string().max(200, "Location note must be 200 chars or fewer").optional().default(""),
    context_notes: z.string().max(1000, "Context notes must be 1000 chars or fewer").optional().default(""),
    min_severity_to_flag: severitySchema.default("low"),
    compare_with_previous: z
        .union([z.boolean(), z.string().transform((val) => val === "true" || val === "1")])
        .default(true),
    source: z.enum(["upload", "camera", "demo"]).default("upload"),
});
export const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
];
export const fileMetaSchema = z.object({
    mimeType: z.enum(allowedMimeTypes),
    sizeBytes: z.number().max(50 * 1024 * 1024, "File size exceeds 50MB limit"),
    isImage: z.boolean(),
    isVideo: z.boolean(),
});
// Recommended Action Schema
export const recommendedActionSchema = z.object({
    id: z.string().optional(),
    finding_id: z.string().optional(),
    action: z.string().min(1),
    urgency: urgencyLevelSchema,
    source: z.enum(["rule", "model"]),
    rationale: z.string().optional().default(""),
});
// Finding Schema
export const findingSchema = z.object({
    id: z.string(),
    analysis_id: z.string(),
    media_file_id: z.string().nullable().optional(),
    category: findingCategorySchema,
    severity: severitySchema,
    certainty: certaintyLevelSchema,
    confidence_score: z.number().min(0).max(1).nullable().optional(), // only from specialized detectors
    title: z.string().max(120),
    evidence_observed: z.string().max(1000),
    inference: z.string().max(1000).nullable().optional(),
    approx_region: approxRegionSchema.nullable().optional(),
    region_source: regionSourceSchema.nullable().optional(),
    change: changeStatusSchema.default("not_compared"),
    change_note: z.string().nullable().optional(),
    priority_score: z.number().default(0),
    priority_factors: z.record(z.any()).default({}),
    requires_human_review: z.boolean().default(true),
    review: reviewStatusSchema.default("pending"),
    recommended_actions: z.array(recommendedActionSchema).default([]),
    created_at: z.string().optional(),
});
// Model raw output schema for AI response parsing & validation
export const modelActionProposalSchema = z.object({
    action: z.string(),
    urgency: urgencyLevelSchema,
    rationale: z.string(),
});
export const rawApproxRegionSchema = z.object({
    x: z.number(),
    y: z.number(),
    w: z.number(),
    h: z.number(),
});
export const modelFindingItemSchema = z.object({
    title: z.string().max(120),
    category: findingCategorySchema,
    severity: severitySchema,
    certainty: certaintyLevelSchema,
    evidence_observed: z.string().max(800),
    inference: z.string().max(800).nullable().optional(),
    approx_region: rawApproxRegionSchema.nullable().optional(),
    recommended_actions: z.array(modelActionProposalSchema).min(1).max(3),
    requires_human_review: z.boolean(),
});
export const modelAnalysisResultSchema = z.object({
    analysis_summary: z.string().max(1200),
    overall_condition: overallConditionSchema,
    image_quality: z.object({
        adequate: z.boolean(),
        issues: z.array(z.string()).default([]),
    }),
    findings: z.array(modelFindingItemSchema).max(25),
    limitations: z.array(z.string()).default([]),
});
// Change Comparison Schema
export const previousFindingChangeSchema = z.object({
    previous_finding_id: z.string(),
    still_present: z.boolean(),
    change: changeStatusSchema,
    change_evidence: z.string(),
});
export const modelComparisonResultSchema = z.object({
    comparable: z.boolean(),
    comparability_note: z.string(),
    previous_finding_changes: z.array(previousFindingChangeSchema).default([]),
    new_findings: z.array(modelFindingItemSchema).default([]),
});
// Full Analysis Model
export const mediaFileSchema = z.object({
    id: z.string(),
    analysis_id: z.string(),
    storage_path: z.string(),
    media_type: z.enum(["image", "video", "frame"]),
    mime_type: z.string(),
    size_bytes: z.number(),
    width: z.number().nullable().optional(),
    height: z.number().nullable().optional(),
    frame_timestamp_ms: z.number().nullable().optional(),
    signed_url: z.string().optional(),
    created_at: z.string().optional(),
});
export const analysisDetailSchema = z.object({
    id: z.string(),
    asset_id: z.string(),
    asset_code: z.string().optional(),
    asset_name: z.string().optional(),
    asset_type: assetTypeSchema.optional(),
    asset_criticality: criticalityLevelSchema.optional(),
    previous_analysis_id: z.string().nullable().optional(),
    status: analysisStatusSchema,
    progress_stage: z.string().optional(), // 'Uploading' | 'Preprocessing' | 'Analyzing' | 'Comparing' | 'Finalizing' | 'Completed'
    inspection_type: inspectionTypeSchema,
    source: z.enum(["upload", "camera", "demo"]),
    is_simulated: z.boolean(),
    location_note: z.string().nullable().optional(),
    context_notes: z.string().nullable().optional(),
    summary: z.string().nullable().optional(),
    overall_condition: overallConditionSchema.nullable().optional(),
    limitations: z.array(z.string()).default([]),
    model_name: z.string().nullable().optional(),
    detector_kind: z.string().nullable().optional(),
    error_message: z.string().nullable().optional(),
    processing_ms: z.number().nullable().optional(),
    created_at: z.string(),
    completed_at: z.string().nullable().optional(),
    media: z.array(mediaFileSchema).default([]),
    findings: z.array(findingSchema).default([]),
    previous_analysis: z.any().nullable().optional(),
});
//# sourceMappingURL=analysis.js.map