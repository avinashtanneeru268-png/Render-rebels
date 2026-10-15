import { z } from "zod";
export declare const findingCategorySchema: z.ZodEnum<["crack", "corrosion_rust", "water_damage_leak", "spalling_delamination", "deformation_misalignment", "missing_or_damaged_component", "vegetation_or_debris", "coating_paint_failure", "thermal_or_discoloration_anomaly", "safety_hazard", "other"]>;
export type FindingCategory = z.infer<typeof findingCategorySchema>;
export declare const severitySchema: z.ZodEnum<["informational", "low", "moderate", "high", "critical"]>;
export type Severity = z.infer<typeof severitySchema>;
export declare const reviewStatusSchema: z.ZodEnum<["pending", "confirmed", "rejected", "corrected"]>;
export type ReviewStatus = z.infer<typeof reviewStatusSchema>;
export declare const changeStatusSchema: z.ZodEnum<["new", "worsened", "unchanged", "improved", "resolved", "not_compared"]>;
export type ChangeStatus = z.infer<typeof changeStatusSchema>;
export declare const analysisStatusSchema: z.ZodEnum<["queued", "processing", "completed", "failed"]>;
export type AnalysisStatus = z.infer<typeof analysisStatusSchema>;
export declare const certaintyLevelSchema: z.ZodEnum<["low", "medium", "high"]>;
export type CertaintyLevel = z.infer<typeof certaintyLevelSchema>;
export declare const assetTypeSchema: z.ZodEnum<["building_facade", "bridge", "pipeline", "roof", "industrial_equipment", "road_surface", "utility_structure", "other"]>;
export type AssetType = z.infer<typeof assetTypeSchema>;
export declare const criticalityLevelSchema: z.ZodEnum<["low", "medium", "high"]>;
export type CriticalityLevel = z.infer<typeof criticalityLevelSchema>;
export declare const inspectionTypeSchema: z.ZodEnum<["routine", "post_event", "follow_up"]>;
export type InspectionType = z.infer<typeof inspectionTypeSchema>;
export declare const urgencyLevelSchema: z.ZodEnum<["immediate", "within_7_days", "within_30_days", "monitor", "no_action"]>;
export type UrgencyLevel = z.infer<typeof urgencyLevelSchema>;
export declare const regionSourceSchema: z.ZodEnum<["ai_estimated", "detector_verified"]>;
export type RegionSource = z.infer<typeof regionSourceSchema>;
export declare const approxRegionSchema: z.ZodEffects<z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
    w: z.ZodNumber;
    h: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    x: number;
    y: number;
    w: number;
    h: number;
}, {
    x: number;
    y: number;
    w: number;
    h: number;
}>, {
    x: number;
    y: number;
    w: number;
    h: number;
}, {
    x: number;
    y: number;
    w: number;
    h: number;
}>;
export type ApproxRegion = z.infer<typeof approxRegionSchema>;
export declare const overallConditionSchema: z.ZodEnum<["good", "fair", "poor", "critical", "indeterminate"]>;
export type OverallCondition = z.infer<typeof overallConditionSchema>;
export declare const STANDING_ADVISORY_DISCLAIMER = "SiteSentinel visual assessments and recommendations are designed to assist qualified inspection personnel and do not constitute certified structural engineering, code compliance, or safety certification.";
//# sourceMappingURL=taxonomy.d.ts.map