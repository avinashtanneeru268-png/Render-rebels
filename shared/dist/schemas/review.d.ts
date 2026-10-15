import { z } from "zod";
export declare const reviewItemSchema: z.ZodEffects<z.ZodObject<{
    findingId: z.ZodString;
    decision: z.ZodEffects<z.ZodEnum<["pending", "confirmed", "rejected", "corrected"]>, "confirmed" | "rejected" | "corrected", "pending" | "confirmed" | "rejected" | "corrected">;
    correctedCategory: z.ZodOptional<z.ZodEnum<["crack", "corrosion_rust", "water_damage_leak", "spalling_delamination", "deformation_misalignment", "missing_or_damaged_component", "vegetation_or_debris", "coating_paint_failure", "thermal_or_discoloration_anomaly", "safety_hazard", "other"]>>;
    correctedSeverity: z.ZodOptional<z.ZodEnum<["informational", "low", "moderate", "high", "critical"]>>;
    note: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    findingId: string;
    decision: "confirmed" | "rejected" | "corrected";
    note: string;
    correctedCategory?: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other" | undefined;
    correctedSeverity?: "informational" | "low" | "moderate" | "high" | "critical" | undefined;
}, {
    findingId: string;
    decision: "pending" | "confirmed" | "rejected" | "corrected";
    correctedCategory?: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other" | undefined;
    correctedSeverity?: "informational" | "low" | "moderate" | "high" | "critical" | undefined;
    note?: string | undefined;
}>, {
    findingId: string;
    decision: "confirmed" | "rejected" | "corrected";
    note: string;
    correctedCategory?: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other" | undefined;
    correctedSeverity?: "informational" | "low" | "moderate" | "high" | "critical" | undefined;
}, {
    findingId: string;
    decision: "pending" | "confirmed" | "rejected" | "corrected";
    correctedCategory?: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other" | undefined;
    correctedSeverity?: "informational" | "low" | "moderate" | "high" | "critical" | undefined;
    note?: string | undefined;
}>;
export declare const reviewSubmissionSchema: z.ZodObject<{
    reviews: z.ZodArray<z.ZodEffects<z.ZodObject<{
        findingId: z.ZodString;
        decision: z.ZodEffects<z.ZodEnum<["pending", "confirmed", "rejected", "corrected"]>, "confirmed" | "rejected" | "corrected", "pending" | "confirmed" | "rejected" | "corrected">;
        correctedCategory: z.ZodOptional<z.ZodEnum<["crack", "corrosion_rust", "water_damage_leak", "spalling_delamination", "deformation_misalignment", "missing_or_damaged_component", "vegetation_or_debris", "coating_paint_failure", "thermal_or_discoloration_anomaly", "safety_hazard", "other"]>>;
        correctedSeverity: z.ZodOptional<z.ZodEnum<["informational", "low", "moderate", "high", "critical"]>>;
        note: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        findingId: string;
        decision: "confirmed" | "rejected" | "corrected";
        note: string;
        correctedCategory?: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other" | undefined;
        correctedSeverity?: "informational" | "low" | "moderate" | "high" | "critical" | undefined;
    }, {
        findingId: string;
        decision: "pending" | "confirmed" | "rejected" | "corrected";
        correctedCategory?: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other" | undefined;
        correctedSeverity?: "informational" | "low" | "moderate" | "high" | "critical" | undefined;
        note?: string | undefined;
    }>, {
        findingId: string;
        decision: "confirmed" | "rejected" | "corrected";
        note: string;
        correctedCategory?: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other" | undefined;
        correctedSeverity?: "informational" | "low" | "moderate" | "high" | "critical" | undefined;
    }, {
        findingId: string;
        decision: "pending" | "confirmed" | "rejected" | "corrected";
        correctedCategory?: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other" | undefined;
        correctedSeverity?: "informational" | "low" | "moderate" | "high" | "critical" | undefined;
        note?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    reviews: {
        findingId: string;
        decision: "confirmed" | "rejected" | "corrected";
        note: string;
        correctedCategory?: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other" | undefined;
        correctedSeverity?: "informational" | "low" | "moderate" | "high" | "critical" | undefined;
    }[];
}, {
    reviews: {
        findingId: string;
        decision: "pending" | "confirmed" | "rejected" | "corrected";
        correctedCategory?: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other" | undefined;
        correctedSeverity?: "informational" | "low" | "moderate" | "high" | "critical" | undefined;
        note?: string | undefined;
    }[];
}>;
export type ReviewItem = z.infer<typeof reviewItemSchema>;
export type ReviewSubmission = z.infer<typeof reviewSubmissionSchema>;
//# sourceMappingURL=review.d.ts.map