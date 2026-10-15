import { z } from "zod";
export declare const apiErrorSchema: z.ZodObject<{
    error: z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodAny>;
        requestId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: any;
        requestId?: string | undefined;
    }, {
        code: string;
        message: string;
        details?: any;
        requestId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    error: {
        code: string;
        message: string;
        details?: any;
        requestId?: string | undefined;
    };
}, {
    error: {
        code: string;
        message: string;
        details?: any;
        requestId?: string | undefined;
    };
}>;
export type ApiError = z.infer<typeof apiErrorSchema>;
export declare const healthResponseSchema: z.ZodObject<{
    status: z.ZodLiteral<"ok">;
    mode: z.ZodEnum<["local", "supabase"]>;
    aiConfigured: z.ZodBoolean;
    version: z.ZodString;
    activeDetector: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "ok";
    mode: "local" | "supabase";
    aiConfigured: boolean;
    version: string;
    activeDetector: string;
}, {
    status: "ok";
    mode: "local" | "supabase";
    aiConfigured: boolean;
    version: string;
    activeDetector: string;
}>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
export declare const dashboardSummarySchema: z.ZodObject<{
    totalAnalyses: z.ZodNumber;
    totalFindings: z.ZodNumber;
    unresolvedHighPriorityCount: z.ZodNumber;
    medianProcessingMs: z.ZodNumber;
    agreementRatePercent: z.ZodNumber;
    findingsBySeverity: z.ZodRecord<z.ZodString, z.ZodNumber>;
    findingsByCategory: z.ZodRecord<z.ZodString, z.ZodNumber>;
    changesCount: z.ZodObject<{
        new: z.ZodNumber;
        worsened: z.ZodNumber;
        unchanged: z.ZodNumber;
        improved: z.ZodNumber;
        resolved: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        new: number;
        worsened: number;
        unchanged: number;
        improved: number;
        resolved: number;
    }, {
        new: number;
        worsened: number;
        unchanged: number;
        improved: number;
        resolved: number;
    }>;
    recentAnalyses: z.ZodArray<z.ZodAny, "many">;
    unresolvedHighPriorityQueue: z.ZodArray<z.ZodAny, "many">;
    consistencyMetrics: z.ZodObject<{
        totalReviewed: z.ZodNumber;
        confirmedCount: z.ZodNumber;
        rejectedCount: z.ZodNumber;
        correctedCount: z.ZodNumber;
        consistencyScorePercent: z.ZodNumber;
        estimatedHoursSaved: z.ZodNumber;
        hoursSavedFormula: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        totalReviewed: number;
        confirmedCount: number;
        rejectedCount: number;
        correctedCount: number;
        consistencyScorePercent: number;
        estimatedHoursSaved: number;
        hoursSavedFormula: string;
    }, {
        totalReviewed: number;
        confirmedCount: number;
        rejectedCount: number;
        correctedCount: number;
        consistencyScorePercent: number;
        estimatedHoursSaved: number;
        hoursSavedFormula: string;
    }>;
}, "strip", z.ZodTypeAny, {
    totalAnalyses: number;
    totalFindings: number;
    unresolvedHighPriorityCount: number;
    medianProcessingMs: number;
    agreementRatePercent: number;
    findingsBySeverity: Record<string, number>;
    findingsByCategory: Record<string, number>;
    changesCount: {
        new: number;
        worsened: number;
        unchanged: number;
        improved: number;
        resolved: number;
    };
    recentAnalyses: any[];
    unresolvedHighPriorityQueue: any[];
    consistencyMetrics: {
        totalReviewed: number;
        confirmedCount: number;
        rejectedCount: number;
        correctedCount: number;
        consistencyScorePercent: number;
        estimatedHoursSaved: number;
        hoursSavedFormula: string;
    };
}, {
    totalAnalyses: number;
    totalFindings: number;
    unresolvedHighPriorityCount: number;
    medianProcessingMs: number;
    agreementRatePercent: number;
    findingsBySeverity: Record<string, number>;
    findingsByCategory: Record<string, number>;
    changesCount: {
        new: number;
        worsened: number;
        unchanged: number;
        improved: number;
        resolved: number;
    };
    recentAnalyses: any[];
    unresolvedHighPriorityQueue: any[];
    consistencyMetrics: {
        totalReviewed: number;
        confirmedCount: number;
        rejectedCount: number;
        correctedCount: number;
        consistencyScorePercent: number;
        estimatedHoursSaved: number;
        hoursSavedFormula: string;
    };
}>;
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;
export declare const assetSummarySchema: z.ZodObject<{
    id: z.ZodString;
    asset_code: z.ZodString;
    name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    asset_type: z.ZodString;
    criticality: z.ZodString;
    created_at: z.ZodString;
    inspection_count: z.ZodNumber;
    latest_inspection_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    latest_condition: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    active_findings_count: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    asset_type: string;
    id: string;
    created_at: string;
    asset_code: string;
    criticality: string;
    inspection_count: number;
    active_findings_count: number;
    name?: string | null | undefined;
    latest_inspection_at?: string | null | undefined;
    latest_condition?: string | null | undefined;
}, {
    asset_type: string;
    id: string;
    created_at: string;
    asset_code: string;
    criticality: string;
    inspection_count: number;
    active_findings_count: number;
    name?: string | null | undefined;
    latest_inspection_at?: string | null | undefined;
    latest_condition?: string | null | undefined;
}>;
export type AssetSummary = z.infer<typeof assetSummarySchema>;
//# sourceMappingURL=api.d.ts.map