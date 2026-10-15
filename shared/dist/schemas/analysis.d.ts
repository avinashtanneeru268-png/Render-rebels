import { z } from "zod";
export declare const analyzeRequestSchema: z.ZodObject<{
    asset_id: z.ZodString;
    asset_name: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    asset_type: z.ZodDefault<z.ZodEnum<["building_facade", "bridge", "pipeline", "roof", "industrial_equipment", "road_surface", "utility_structure", "other"]>>;
    asset_criticality: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
    inspection_type: z.ZodDefault<z.ZodEnum<["routine", "post_event", "follow_up"]>>;
    location_note: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    context_notes: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    min_severity_to_flag: z.ZodDefault<z.ZodEnum<["informational", "low", "moderate", "high", "critical"]>>;
    compare_with_previous: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodEffects<z.ZodString, boolean, string>]>>;
    source: z.ZodDefault<z.ZodEnum<["upload", "camera", "demo"]>>;
}, "strip", z.ZodTypeAny, {
    asset_id: string;
    asset_name: string;
    asset_type: "other" | "building_facade" | "bridge" | "pipeline" | "roof" | "industrial_equipment" | "road_surface" | "utility_structure";
    asset_criticality: "low" | "high" | "medium";
    inspection_type: "routine" | "post_event" | "follow_up";
    location_note: string;
    context_notes: string;
    min_severity_to_flag: "informational" | "low" | "moderate" | "high" | "critical";
    compare_with_previous: boolean;
    source: "upload" | "camera" | "demo";
}, {
    asset_id: string;
    asset_name?: string | undefined;
    asset_type?: "other" | "building_facade" | "bridge" | "pipeline" | "roof" | "industrial_equipment" | "road_surface" | "utility_structure" | undefined;
    asset_criticality?: "low" | "high" | "medium" | undefined;
    inspection_type?: "routine" | "post_event" | "follow_up" | undefined;
    location_note?: string | undefined;
    context_notes?: string | undefined;
    min_severity_to_flag?: "informational" | "low" | "moderate" | "high" | "critical" | undefined;
    compare_with_previous?: string | boolean | undefined;
    source?: "upload" | "camera" | "demo" | undefined;
}>;
export type AnalyzeRequestInput = z.infer<typeof analyzeRequestSchema>;
export declare const allowedMimeTypes: readonly ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"];
export declare const fileMetaSchema: z.ZodObject<{
    mimeType: z.ZodEnum<["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"]>;
    sizeBytes: z.ZodNumber;
    isImage: z.ZodBoolean;
    isVideo: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    mimeType: "image/jpeg" | "image/png" | "image/webp" | "video/mp4" | "video/webm";
    sizeBytes: number;
    isImage: boolean;
    isVideo: boolean;
}, {
    mimeType: "image/jpeg" | "image/png" | "image/webp" | "video/mp4" | "video/webm";
    sizeBytes: number;
    isImage: boolean;
    isVideo: boolean;
}>;
export type FileMeta = z.infer<typeof fileMetaSchema>;
export declare const recommendedActionSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    finding_id: z.ZodOptional<z.ZodString>;
    action: z.ZodString;
    urgency: z.ZodEnum<["immediate", "within_7_days", "within_30_days", "monitor", "no_action"]>;
    source: z.ZodEnum<["rule", "model"]>;
    rationale: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    source: "rule" | "model";
    action: string;
    urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
    rationale: string;
    id?: string | undefined;
    finding_id?: string | undefined;
}, {
    source: "rule" | "model";
    action: string;
    urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
    id?: string | undefined;
    finding_id?: string | undefined;
    rationale?: string | undefined;
}>;
export type RecommendedAction = z.infer<typeof recommendedActionSchema>;
export declare const findingSchema: z.ZodObject<{
    id: z.ZodString;
    analysis_id: z.ZodString;
    media_file_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    category: z.ZodEnum<["crack", "corrosion_rust", "water_damage_leak", "spalling_delamination", "deformation_misalignment", "missing_or_damaged_component", "vegetation_or_debris", "coating_paint_failure", "thermal_or_discoloration_anomaly", "safety_hazard", "other"]>;
    severity: z.ZodEnum<["informational", "low", "moderate", "high", "critical"]>;
    certainty: z.ZodEnum<["low", "medium", "high"]>;
    confidence_score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    title: z.ZodString;
    evidence_observed: z.ZodString;
    inference: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    approx_region: z.ZodOptional<z.ZodNullable<z.ZodEffects<z.ZodObject<{
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
    }>>>;
    region_source: z.ZodOptional<z.ZodNullable<z.ZodEnum<["ai_estimated", "detector_verified"]>>>;
    change: z.ZodDefault<z.ZodEnum<["new", "worsened", "unchanged", "improved", "resolved", "not_compared"]>>;
    change_note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    priority_score: z.ZodDefault<z.ZodNumber>;
    priority_factors: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
    requires_human_review: z.ZodDefault<z.ZodBoolean>;
    review: z.ZodDefault<z.ZodEnum<["pending", "confirmed", "rejected", "corrected"]>>;
    recommended_actions: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        finding_id: z.ZodOptional<z.ZodString>;
        action: z.ZodString;
        urgency: z.ZodEnum<["immediate", "within_7_days", "within_30_days", "monitor", "no_action"]>;
        source: z.ZodEnum<["rule", "model"]>;
        rationale: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        source: "rule" | "model";
        action: string;
        urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
        rationale: string;
        id?: string | undefined;
        finding_id?: string | undefined;
    }, {
        source: "rule" | "model";
        action: string;
        urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
        id?: string | undefined;
        finding_id?: string | undefined;
        rationale?: string | undefined;
    }>, "many">>;
    created_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    analysis_id: string;
    category: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other";
    severity: "informational" | "low" | "moderate" | "high" | "critical";
    certainty: "low" | "high" | "medium";
    title: string;
    evidence_observed: string;
    change: "new" | "worsened" | "unchanged" | "improved" | "resolved" | "not_compared";
    priority_score: number;
    priority_factors: Record<string, any>;
    requires_human_review: boolean;
    review: "pending" | "confirmed" | "rejected" | "corrected";
    recommended_actions: {
        source: "rule" | "model";
        action: string;
        urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
        rationale: string;
        id?: string | undefined;
        finding_id?: string | undefined;
    }[];
    media_file_id?: string | null | undefined;
    confidence_score?: number | null | undefined;
    inference?: string | null | undefined;
    approx_region?: {
        x: number;
        y: number;
        w: number;
        h: number;
    } | null | undefined;
    region_source?: "ai_estimated" | "detector_verified" | null | undefined;
    change_note?: string | null | undefined;
    created_at?: string | undefined;
}, {
    id: string;
    analysis_id: string;
    category: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other";
    severity: "informational" | "low" | "moderate" | "high" | "critical";
    certainty: "low" | "high" | "medium";
    title: string;
    evidence_observed: string;
    media_file_id?: string | null | undefined;
    confidence_score?: number | null | undefined;
    inference?: string | null | undefined;
    approx_region?: {
        x: number;
        y: number;
        w: number;
        h: number;
    } | null | undefined;
    region_source?: "ai_estimated" | "detector_verified" | null | undefined;
    change?: "new" | "worsened" | "unchanged" | "improved" | "resolved" | "not_compared" | undefined;
    change_note?: string | null | undefined;
    priority_score?: number | undefined;
    priority_factors?: Record<string, any> | undefined;
    requires_human_review?: boolean | undefined;
    review?: "pending" | "confirmed" | "rejected" | "corrected" | undefined;
    recommended_actions?: {
        source: "rule" | "model";
        action: string;
        urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
        id?: string | undefined;
        finding_id?: string | undefined;
        rationale?: string | undefined;
    }[] | undefined;
    created_at?: string | undefined;
}>;
export type Finding = z.infer<typeof findingSchema>;
export declare const modelActionProposalSchema: z.ZodObject<{
    action: z.ZodString;
    urgency: z.ZodEnum<["immediate", "within_7_days", "within_30_days", "monitor", "no_action"]>;
    rationale: z.ZodString;
}, "strip", z.ZodTypeAny, {
    action: string;
    urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
    rationale: string;
}, {
    action: string;
    urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
    rationale: string;
}>;
export declare const rawApproxRegionSchema: z.ZodObject<{
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
}>;
export declare const modelFindingItemSchema: z.ZodObject<{
    title: z.ZodString;
    category: z.ZodEnum<["crack", "corrosion_rust", "water_damage_leak", "spalling_delamination", "deformation_misalignment", "missing_or_damaged_component", "vegetation_or_debris", "coating_paint_failure", "thermal_or_discoloration_anomaly", "safety_hazard", "other"]>;
    severity: z.ZodEnum<["informational", "low", "moderate", "high", "critical"]>;
    certainty: z.ZodEnum<["low", "medium", "high"]>;
    evidence_observed: z.ZodString;
    inference: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    approx_region: z.ZodOptional<z.ZodNullable<z.ZodObject<{
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
    }>>>;
    recommended_actions: z.ZodArray<z.ZodObject<{
        action: z.ZodString;
        urgency: z.ZodEnum<["immediate", "within_7_days", "within_30_days", "monitor", "no_action"]>;
        rationale: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        action: string;
        urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
        rationale: string;
    }, {
        action: string;
        urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
        rationale: string;
    }>, "many">;
    requires_human_review: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    category: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other";
    severity: "informational" | "low" | "moderate" | "high" | "critical";
    certainty: "low" | "high" | "medium";
    title: string;
    evidence_observed: string;
    requires_human_review: boolean;
    recommended_actions: {
        action: string;
        urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
        rationale: string;
    }[];
    inference?: string | null | undefined;
    approx_region?: {
        x: number;
        y: number;
        w: number;
        h: number;
    } | null | undefined;
}, {
    category: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other";
    severity: "informational" | "low" | "moderate" | "high" | "critical";
    certainty: "low" | "high" | "medium";
    title: string;
    evidence_observed: string;
    requires_human_review: boolean;
    recommended_actions: {
        action: string;
        urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
        rationale: string;
    }[];
    inference?: string | null | undefined;
    approx_region?: {
        x: number;
        y: number;
        w: number;
        h: number;
    } | null | undefined;
}>;
export type ModelFindingItem = z.infer<typeof modelFindingItemSchema>;
export declare const modelAnalysisResultSchema: z.ZodObject<{
    analysis_summary: z.ZodString;
    overall_condition: z.ZodEnum<["good", "fair", "poor", "critical", "indeterminate"]>;
    image_quality: z.ZodObject<{
        adequate: z.ZodBoolean;
        issues: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        issues: string[];
        adequate: boolean;
    }, {
        adequate: boolean;
        issues?: string[] | undefined;
    }>;
    findings: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        category: z.ZodEnum<["crack", "corrosion_rust", "water_damage_leak", "spalling_delamination", "deformation_misalignment", "missing_or_damaged_component", "vegetation_or_debris", "coating_paint_failure", "thermal_or_discoloration_anomaly", "safety_hazard", "other"]>;
        severity: z.ZodEnum<["informational", "low", "moderate", "high", "critical"]>;
        certainty: z.ZodEnum<["low", "medium", "high"]>;
        evidence_observed: z.ZodString;
        inference: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        approx_region: z.ZodOptional<z.ZodNullable<z.ZodObject<{
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
        }>>>;
        recommended_actions: z.ZodArray<z.ZodObject<{
            action: z.ZodString;
            urgency: z.ZodEnum<["immediate", "within_7_days", "within_30_days", "monitor", "no_action"]>;
            rationale: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            action: string;
            urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
            rationale: string;
        }, {
            action: string;
            urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
            rationale: string;
        }>, "many">;
        requires_human_review: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        category: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other";
        severity: "informational" | "low" | "moderate" | "high" | "critical";
        certainty: "low" | "high" | "medium";
        title: string;
        evidence_observed: string;
        requires_human_review: boolean;
        recommended_actions: {
            action: string;
            urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
            rationale: string;
        }[];
        inference?: string | null | undefined;
        approx_region?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
    }, {
        category: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other";
        severity: "informational" | "low" | "moderate" | "high" | "critical";
        certainty: "low" | "high" | "medium";
        title: string;
        evidence_observed: string;
        requires_human_review: boolean;
        recommended_actions: {
            action: string;
            urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
            rationale: string;
        }[];
        inference?: string | null | undefined;
        approx_region?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
    }>, "many">;
    limitations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    analysis_summary: string;
    overall_condition: "critical" | "good" | "fair" | "poor" | "indeterminate";
    image_quality: {
        issues: string[];
        adequate: boolean;
    };
    findings: {
        category: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other";
        severity: "informational" | "low" | "moderate" | "high" | "critical";
        certainty: "low" | "high" | "medium";
        title: string;
        evidence_observed: string;
        requires_human_review: boolean;
        recommended_actions: {
            action: string;
            urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
            rationale: string;
        }[];
        inference?: string | null | undefined;
        approx_region?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
    }[];
    limitations: string[];
}, {
    analysis_summary: string;
    overall_condition: "critical" | "good" | "fair" | "poor" | "indeterminate";
    image_quality: {
        adequate: boolean;
        issues?: string[] | undefined;
    };
    findings: {
        category: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other";
        severity: "informational" | "low" | "moderate" | "high" | "critical";
        certainty: "low" | "high" | "medium";
        title: string;
        evidence_observed: string;
        requires_human_review: boolean;
        recommended_actions: {
            action: string;
            urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
            rationale: string;
        }[];
        inference?: string | null | undefined;
        approx_region?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
    }[];
    limitations?: string[] | undefined;
}>;
export type ModelAnalysisResult = z.infer<typeof modelAnalysisResultSchema>;
export declare const previousFindingChangeSchema: z.ZodObject<{
    previous_finding_id: z.ZodString;
    still_present: z.ZodBoolean;
    change: z.ZodEnum<["new", "worsened", "unchanged", "improved", "resolved", "not_compared"]>;
    change_evidence: z.ZodString;
}, "strip", z.ZodTypeAny, {
    change: "new" | "worsened" | "unchanged" | "improved" | "resolved" | "not_compared";
    previous_finding_id: string;
    still_present: boolean;
    change_evidence: string;
}, {
    change: "new" | "worsened" | "unchanged" | "improved" | "resolved" | "not_compared";
    previous_finding_id: string;
    still_present: boolean;
    change_evidence: string;
}>;
export declare const modelComparisonResultSchema: z.ZodObject<{
    comparable: z.ZodBoolean;
    comparability_note: z.ZodString;
    previous_finding_changes: z.ZodDefault<z.ZodArray<z.ZodObject<{
        previous_finding_id: z.ZodString;
        still_present: z.ZodBoolean;
        change: z.ZodEnum<["new", "worsened", "unchanged", "improved", "resolved", "not_compared"]>;
        change_evidence: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        change: "new" | "worsened" | "unchanged" | "improved" | "resolved" | "not_compared";
        previous_finding_id: string;
        still_present: boolean;
        change_evidence: string;
    }, {
        change: "new" | "worsened" | "unchanged" | "improved" | "resolved" | "not_compared";
        previous_finding_id: string;
        still_present: boolean;
        change_evidence: string;
    }>, "many">>;
    new_findings: z.ZodDefault<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        category: z.ZodEnum<["crack", "corrosion_rust", "water_damage_leak", "spalling_delamination", "deformation_misalignment", "missing_or_damaged_component", "vegetation_or_debris", "coating_paint_failure", "thermal_or_discoloration_anomaly", "safety_hazard", "other"]>;
        severity: z.ZodEnum<["informational", "low", "moderate", "high", "critical"]>;
        certainty: z.ZodEnum<["low", "medium", "high"]>;
        evidence_observed: z.ZodString;
        inference: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        approx_region: z.ZodOptional<z.ZodNullable<z.ZodObject<{
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
        }>>>;
        recommended_actions: z.ZodArray<z.ZodObject<{
            action: z.ZodString;
            urgency: z.ZodEnum<["immediate", "within_7_days", "within_30_days", "monitor", "no_action"]>;
            rationale: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            action: string;
            urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
            rationale: string;
        }, {
            action: string;
            urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
            rationale: string;
        }>, "many">;
        requires_human_review: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        category: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other";
        severity: "informational" | "low" | "moderate" | "high" | "critical";
        certainty: "low" | "high" | "medium";
        title: string;
        evidence_observed: string;
        requires_human_review: boolean;
        recommended_actions: {
            action: string;
            urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
            rationale: string;
        }[];
        inference?: string | null | undefined;
        approx_region?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
    }, {
        category: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other";
        severity: "informational" | "low" | "moderate" | "high" | "critical";
        certainty: "low" | "high" | "medium";
        title: string;
        evidence_observed: string;
        requires_human_review: boolean;
        recommended_actions: {
            action: string;
            urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
            rationale: string;
        }[];
        inference?: string | null | undefined;
        approx_region?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    comparable: boolean;
    comparability_note: string;
    previous_finding_changes: {
        change: "new" | "worsened" | "unchanged" | "improved" | "resolved" | "not_compared";
        previous_finding_id: string;
        still_present: boolean;
        change_evidence: string;
    }[];
    new_findings: {
        category: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other";
        severity: "informational" | "low" | "moderate" | "high" | "critical";
        certainty: "low" | "high" | "medium";
        title: string;
        evidence_observed: string;
        requires_human_review: boolean;
        recommended_actions: {
            action: string;
            urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
            rationale: string;
        }[];
        inference?: string | null | undefined;
        approx_region?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
    }[];
}, {
    comparable: boolean;
    comparability_note: string;
    previous_finding_changes?: {
        change: "new" | "worsened" | "unchanged" | "improved" | "resolved" | "not_compared";
        previous_finding_id: string;
        still_present: boolean;
        change_evidence: string;
    }[] | undefined;
    new_findings?: {
        category: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other";
        severity: "informational" | "low" | "moderate" | "high" | "critical";
        certainty: "low" | "high" | "medium";
        title: string;
        evidence_observed: string;
        requires_human_review: boolean;
        recommended_actions: {
            action: string;
            urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
            rationale: string;
        }[];
        inference?: string | null | undefined;
        approx_region?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
    }[] | undefined;
}>;
export type ModelComparisonResult = z.infer<typeof modelComparisonResultSchema>;
export declare const mediaFileSchema: z.ZodObject<{
    id: z.ZodString;
    analysis_id: z.ZodString;
    storage_path: z.ZodString;
    media_type: z.ZodEnum<["image", "video", "frame"]>;
    mime_type: z.ZodString;
    size_bytes: z.ZodNumber;
    width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    frame_timestamp_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    signed_url: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    analysis_id: string;
    storage_path: string;
    media_type: "image" | "video" | "frame";
    mime_type: string;
    size_bytes: number;
    created_at?: string | undefined;
    width?: number | null | undefined;
    height?: number | null | undefined;
    frame_timestamp_ms?: number | null | undefined;
    signed_url?: string | undefined;
}, {
    id: string;
    analysis_id: string;
    storage_path: string;
    media_type: "image" | "video" | "frame";
    mime_type: string;
    size_bytes: number;
    created_at?: string | undefined;
    width?: number | null | undefined;
    height?: number | null | undefined;
    frame_timestamp_ms?: number | null | undefined;
    signed_url?: string | undefined;
}>;
export type MediaFile = z.infer<typeof mediaFileSchema>;
export declare const analysisDetailSchema: z.ZodObject<{
    id: z.ZodString;
    asset_id: z.ZodString;
    asset_code: z.ZodOptional<z.ZodString>;
    asset_name: z.ZodOptional<z.ZodString>;
    asset_type: z.ZodOptional<z.ZodEnum<["building_facade", "bridge", "pipeline", "roof", "industrial_equipment", "road_surface", "utility_structure", "other"]>>;
    asset_criticality: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
    previous_analysis_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodEnum<["queued", "processing", "completed", "failed"]>;
    progress_stage: z.ZodOptional<z.ZodString>;
    inspection_type: z.ZodEnum<["routine", "post_event", "follow_up"]>;
    source: z.ZodEnum<["upload", "camera", "demo"]>;
    is_simulated: z.ZodBoolean;
    location_note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    context_notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    summary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    overall_condition: z.ZodOptional<z.ZodNullable<z.ZodEnum<["good", "fair", "poor", "critical", "indeterminate"]>>>;
    limitations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    model_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    detector_kind: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    error_message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    processing_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    created_at: z.ZodString;
    completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    media: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        analysis_id: z.ZodString;
        storage_path: z.ZodString;
        media_type: z.ZodEnum<["image", "video", "frame"]>;
        mime_type: z.ZodString;
        size_bytes: z.ZodNumber;
        width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        frame_timestamp_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        signed_url: z.ZodOptional<z.ZodString>;
        created_at: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        analysis_id: string;
        storage_path: string;
        media_type: "image" | "video" | "frame";
        mime_type: string;
        size_bytes: number;
        created_at?: string | undefined;
        width?: number | null | undefined;
        height?: number | null | undefined;
        frame_timestamp_ms?: number | null | undefined;
        signed_url?: string | undefined;
    }, {
        id: string;
        analysis_id: string;
        storage_path: string;
        media_type: "image" | "video" | "frame";
        mime_type: string;
        size_bytes: number;
        created_at?: string | undefined;
        width?: number | null | undefined;
        height?: number | null | undefined;
        frame_timestamp_ms?: number | null | undefined;
        signed_url?: string | undefined;
    }>, "many">>;
    findings: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        analysis_id: z.ZodString;
        media_file_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        category: z.ZodEnum<["crack", "corrosion_rust", "water_damage_leak", "spalling_delamination", "deformation_misalignment", "missing_or_damaged_component", "vegetation_or_debris", "coating_paint_failure", "thermal_or_discoloration_anomaly", "safety_hazard", "other"]>;
        severity: z.ZodEnum<["informational", "low", "moderate", "high", "critical"]>;
        certainty: z.ZodEnum<["low", "medium", "high"]>;
        confidence_score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodString;
        evidence_observed: z.ZodString;
        inference: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        approx_region: z.ZodOptional<z.ZodNullable<z.ZodEffects<z.ZodObject<{
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
        }>>>;
        region_source: z.ZodOptional<z.ZodNullable<z.ZodEnum<["ai_estimated", "detector_verified"]>>>;
        change: z.ZodDefault<z.ZodEnum<["new", "worsened", "unchanged", "improved", "resolved", "not_compared"]>>;
        change_note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority_score: z.ZodDefault<z.ZodNumber>;
        priority_factors: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
        requires_human_review: z.ZodDefault<z.ZodBoolean>;
        review: z.ZodDefault<z.ZodEnum<["pending", "confirmed", "rejected", "corrected"]>>;
        recommended_actions: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            finding_id: z.ZodOptional<z.ZodString>;
            action: z.ZodString;
            urgency: z.ZodEnum<["immediate", "within_7_days", "within_30_days", "monitor", "no_action"]>;
            source: z.ZodEnum<["rule", "model"]>;
            rationale: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            source: "rule" | "model";
            action: string;
            urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
            rationale: string;
            id?: string | undefined;
            finding_id?: string | undefined;
        }, {
            source: "rule" | "model";
            action: string;
            urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
            id?: string | undefined;
            finding_id?: string | undefined;
            rationale?: string | undefined;
        }>, "many">>;
        created_at: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        analysis_id: string;
        category: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other";
        severity: "informational" | "low" | "moderate" | "high" | "critical";
        certainty: "low" | "high" | "medium";
        title: string;
        evidence_observed: string;
        change: "new" | "worsened" | "unchanged" | "improved" | "resolved" | "not_compared";
        priority_score: number;
        priority_factors: Record<string, any>;
        requires_human_review: boolean;
        review: "pending" | "confirmed" | "rejected" | "corrected";
        recommended_actions: {
            source: "rule" | "model";
            action: string;
            urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
            rationale: string;
            id?: string | undefined;
            finding_id?: string | undefined;
        }[];
        media_file_id?: string | null | undefined;
        confidence_score?: number | null | undefined;
        inference?: string | null | undefined;
        approx_region?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
        region_source?: "ai_estimated" | "detector_verified" | null | undefined;
        change_note?: string | null | undefined;
        created_at?: string | undefined;
    }, {
        id: string;
        analysis_id: string;
        category: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other";
        severity: "informational" | "low" | "moderate" | "high" | "critical";
        certainty: "low" | "high" | "medium";
        title: string;
        evidence_observed: string;
        media_file_id?: string | null | undefined;
        confidence_score?: number | null | undefined;
        inference?: string | null | undefined;
        approx_region?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
        region_source?: "ai_estimated" | "detector_verified" | null | undefined;
        change?: "new" | "worsened" | "unchanged" | "improved" | "resolved" | "not_compared" | undefined;
        change_note?: string | null | undefined;
        priority_score?: number | undefined;
        priority_factors?: Record<string, any> | undefined;
        requires_human_review?: boolean | undefined;
        review?: "pending" | "confirmed" | "rejected" | "corrected" | undefined;
        recommended_actions?: {
            source: "rule" | "model";
            action: string;
            urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
            id?: string | undefined;
            finding_id?: string | undefined;
            rationale?: string | undefined;
        }[] | undefined;
        created_at?: string | undefined;
    }>, "many">>;
    previous_analysis: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    status: "queued" | "processing" | "completed" | "failed";
    asset_id: string;
    inspection_type: "routine" | "post_event" | "follow_up";
    source: "upload" | "camera" | "demo";
    id: string;
    created_at: string;
    findings: {
        id: string;
        analysis_id: string;
        category: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other";
        severity: "informational" | "low" | "moderate" | "high" | "critical";
        certainty: "low" | "high" | "medium";
        title: string;
        evidence_observed: string;
        change: "new" | "worsened" | "unchanged" | "improved" | "resolved" | "not_compared";
        priority_score: number;
        priority_factors: Record<string, any>;
        requires_human_review: boolean;
        review: "pending" | "confirmed" | "rejected" | "corrected";
        recommended_actions: {
            source: "rule" | "model";
            action: string;
            urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
            rationale: string;
            id?: string | undefined;
            finding_id?: string | undefined;
        }[];
        media_file_id?: string | null | undefined;
        confidence_score?: number | null | undefined;
        inference?: string | null | undefined;
        approx_region?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
        region_source?: "ai_estimated" | "detector_verified" | null | undefined;
        change_note?: string | null | undefined;
        created_at?: string | undefined;
    }[];
    limitations: string[];
    is_simulated: boolean;
    media: {
        id: string;
        analysis_id: string;
        storage_path: string;
        media_type: "image" | "video" | "frame";
        mime_type: string;
        size_bytes: number;
        created_at?: string | undefined;
        width?: number | null | undefined;
        height?: number | null | undefined;
        frame_timestamp_ms?: number | null | undefined;
        signed_url?: string | undefined;
    }[];
    asset_name?: string | undefined;
    asset_type?: "other" | "building_facade" | "bridge" | "pipeline" | "roof" | "industrial_equipment" | "road_surface" | "utility_structure" | undefined;
    asset_criticality?: "low" | "high" | "medium" | undefined;
    location_note?: string | null | undefined;
    context_notes?: string | null | undefined;
    overall_condition?: "critical" | "good" | "fair" | "poor" | "indeterminate" | null | undefined;
    asset_code?: string | undefined;
    previous_analysis_id?: string | null | undefined;
    progress_stage?: string | undefined;
    summary?: string | null | undefined;
    model_name?: string | null | undefined;
    detector_kind?: string | null | undefined;
    error_message?: string | null | undefined;
    processing_ms?: number | null | undefined;
    completed_at?: string | null | undefined;
    previous_analysis?: any;
}, {
    status: "queued" | "processing" | "completed" | "failed";
    asset_id: string;
    inspection_type: "routine" | "post_event" | "follow_up";
    source: "upload" | "camera" | "demo";
    id: string;
    created_at: string;
    is_simulated: boolean;
    asset_name?: string | undefined;
    asset_type?: "other" | "building_facade" | "bridge" | "pipeline" | "roof" | "industrial_equipment" | "road_surface" | "utility_structure" | undefined;
    asset_criticality?: "low" | "high" | "medium" | undefined;
    location_note?: string | null | undefined;
    context_notes?: string | null | undefined;
    overall_condition?: "critical" | "good" | "fair" | "poor" | "indeterminate" | null | undefined;
    findings?: {
        id: string;
        analysis_id: string;
        category: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other";
        severity: "informational" | "low" | "moderate" | "high" | "critical";
        certainty: "low" | "high" | "medium";
        title: string;
        evidence_observed: string;
        media_file_id?: string | null | undefined;
        confidence_score?: number | null | undefined;
        inference?: string | null | undefined;
        approx_region?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
        region_source?: "ai_estimated" | "detector_verified" | null | undefined;
        change?: "new" | "worsened" | "unchanged" | "improved" | "resolved" | "not_compared" | undefined;
        change_note?: string | null | undefined;
        priority_score?: number | undefined;
        priority_factors?: Record<string, any> | undefined;
        requires_human_review?: boolean | undefined;
        review?: "pending" | "confirmed" | "rejected" | "corrected" | undefined;
        recommended_actions?: {
            source: "rule" | "model";
            action: string;
            urgency: "immediate" | "within_7_days" | "within_30_days" | "monitor" | "no_action";
            id?: string | undefined;
            finding_id?: string | undefined;
            rationale?: string | undefined;
        }[] | undefined;
        created_at?: string | undefined;
    }[] | undefined;
    limitations?: string[] | undefined;
    asset_code?: string | undefined;
    previous_analysis_id?: string | null | undefined;
    progress_stage?: string | undefined;
    summary?: string | null | undefined;
    model_name?: string | null | undefined;
    detector_kind?: string | null | undefined;
    error_message?: string | null | undefined;
    processing_ms?: number | null | undefined;
    completed_at?: string | null | undefined;
    media?: {
        id: string;
        analysis_id: string;
        storage_path: string;
        media_type: "image" | "video" | "frame";
        mime_type: string;
        size_bytes: number;
        created_at?: string | undefined;
        width?: number | null | undefined;
        height?: number | null | undefined;
        frame_timestamp_ms?: number | null | undefined;
        signed_url?: string | undefined;
    }[] | undefined;
    previous_analysis?: any;
}>;
export type AnalysisDetail = z.infer<typeof analysisDetailSchema>;
//# sourceMappingURL=analysis.d.ts.map