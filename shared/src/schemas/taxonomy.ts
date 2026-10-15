import { z } from "zod";

export const findingCategorySchema = z.enum([
  "crack",
  "corrosion_rust",
  "water_damage_leak",
  "spalling_delamination",
  "deformation_misalignment",
  "missing_or_damaged_component",
  "vegetation_or_debris",
  "coating_paint_failure",
  "thermal_or_discoloration_anomaly",
  "safety_hazard",
  "other",
]);
export type FindingCategory = z.infer<typeof findingCategorySchema>;

export const severitySchema = z.enum([
  "informational",
  "low",
  "moderate",
  "high",
  "critical",
]);
export type Severity = z.infer<typeof severitySchema>;

export const reviewStatusSchema = z.enum([
  "pending",
  "confirmed",
  "rejected",
  "corrected",
]);
export type ReviewStatus = z.infer<typeof reviewStatusSchema>;

export const changeStatusSchema = z.enum([
  "new",
  "worsened",
  "unchanged",
  "improved",
  "resolved",
  "not_compared",
]);
export type ChangeStatus = z.infer<typeof changeStatusSchema>;

export const analysisStatusSchema = z.enum([
  "queued",
  "processing",
  "completed",
  "failed",
]);
export type AnalysisStatus = z.infer<typeof analysisStatusSchema>;

export const certaintyLevelSchema = z.enum(["low", "medium", "high"]);
export type CertaintyLevel = z.infer<typeof certaintyLevelSchema>;

export const assetTypeSchema = z.enum([
  "building_facade",
  "bridge",
  "pipeline",
  "roof",
  "industrial_equipment",
  "road_surface",
  "utility_structure",
  "other",
]);
export type AssetType = z.infer<typeof assetTypeSchema>;

export const criticalityLevelSchema = z.enum(["low", "medium", "high"]);
export type CriticalityLevel = z.infer<typeof criticalityLevelSchema>;

export const inspectionTypeSchema = z.enum(["routine", "post_event", "follow_up"]);
export type InspectionType = z.infer<typeof inspectionTypeSchema>;

export const urgencyLevelSchema = z.enum([
  "immediate",
  "within_7_days",
  "within_30_days",
  "monitor",
  "no_action",
]);
export type UrgencyLevel = z.infer<typeof urgencyLevelSchema>;

export const regionSourceSchema = z.enum(["ai_estimated", "detector_verified"]);
export type RegionSource = z.infer<typeof regionSourceSchema>;

export const approxRegionSchema = z
  .object({
    x: z.number().min(0).max(1),
    y: z.number().min(0).max(1),
    w: z.number().gt(0).max(1),
    h: z.number().gt(0).max(1),
  })
  .refine((r) => r.x + r.w <= 1.001 && r.y + r.h <= 1.001 && r.w * r.h >= 0.0005, {
    message: "Region must be within image bounds with valid area",
  });
export type ApproxRegion = z.infer<typeof approxRegionSchema>;

export const overallConditionSchema = z.enum([
  "good",
  "fair",
  "poor",
  "critical",
  "indeterminate",
]);
export type OverallCondition = z.infer<typeof overallConditionSchema>;

export const STANDING_ADVISORY_DISCLAIMER =
  "SiteSentinel visual assessments and recommendations are designed to assist qualified inspection personnel and do not constitute certified structural engineering, code compliance, or safety certification.";
