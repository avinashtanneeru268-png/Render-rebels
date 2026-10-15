import { z } from "zod";
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    pageSize: number;
}, {
    page?: number | undefined;
    pageSize?: number | undefined;
}>;
export declare const analysesFilterSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
} & {
    q: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<["crack", "corrosion_rust", "water_damage_leak", "spalling_delamination", "deformation_misalignment", "missing_or_damaged_component", "vegetation_or_debris", "coating_paint_failure", "thermal_or_discoloration_anomaly", "safety_hazard", "other"]>>;
    severity: z.ZodOptional<z.ZodEnum<["informational", "low", "moderate", "high", "critical"]>>;
    status: z.ZodOptional<z.ZodEnum<["queued", "processing", "completed", "failed"]>>;
    review: z.ZodOptional<z.ZodEnum<["pending", "confirmed", "rejected", "corrected"]>>;
    assetId: z.ZodOptional<z.ZodString>;
    from: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodString>]>;
    to: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodString>]>;
    sort: z.ZodDefault<z.ZodEnum<["created_desc", "created_asc", "priority_desc"]>>;
}, "strip", z.ZodTypeAny, {
    sort: "created_desc" | "created_asc" | "priority_desc";
    page: number;
    pageSize: number;
    status?: "queued" | "processing" | "completed" | "failed" | undefined;
    category?: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other" | undefined;
    severity?: "informational" | "low" | "moderate" | "high" | "critical" | undefined;
    review?: "pending" | "confirmed" | "rejected" | "corrected" | undefined;
    q?: string | undefined;
    assetId?: string | undefined;
    from?: string | undefined;
    to?: string | undefined;
}, {
    sort?: "created_desc" | "created_asc" | "priority_desc" | undefined;
    status?: "queued" | "processing" | "completed" | "failed" | undefined;
    category?: "crack" | "corrosion_rust" | "water_damage_leak" | "spalling_delamination" | "deformation_misalignment" | "missing_or_damaged_component" | "vegetation_or_debris" | "coating_paint_failure" | "thermal_or_discoloration_anomaly" | "safety_hazard" | "other" | undefined;
    severity?: "informational" | "low" | "moderate" | "high" | "critical" | undefined;
    review?: "pending" | "confirmed" | "rejected" | "corrected" | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
    q?: string | undefined;
    assetId?: string | undefined;
    from?: string | undefined;
    to?: string | undefined;
}>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type AnalysesFilterQuery = z.infer<typeof analysesFilterSchema>;
//# sourceMappingURL=query.d.ts.map