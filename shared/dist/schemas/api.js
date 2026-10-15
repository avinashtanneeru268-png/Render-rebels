import { z } from "zod";
export const apiErrorSchema = z.object({
    error: z.object({
        code: z.string(),
        message: z.string(),
        details: z.any().optional(),
        requestId: z.string().optional(),
    }),
});
export const healthResponseSchema = z.object({
    status: z.literal("ok"),
    mode: z.enum(["local", "supabase"]),
    aiConfigured: z.boolean(),
    version: z.string(),
    activeDetector: z.string(),
});
export const dashboardSummarySchema = z.object({
    totalAnalyses: z.number(),
    totalFindings: z.number(),
    unresolvedHighPriorityCount: z.number(),
    medianProcessingMs: z.number(),
    agreementRatePercent: z.number(), // AI-Human agreement %
    findingsBySeverity: z.record(z.string(), z.number()),
    findingsByCategory: z.record(z.string(), z.number()),
    changesCount: z.object({
        new: z.number(),
        worsened: z.number(),
        unchanged: z.number(),
        improved: z.number(),
        resolved: z.number(),
    }),
    recentAnalyses: z.array(z.any()),
    unresolvedHighPriorityQueue: z.array(z.any()),
    consistencyMetrics: z.object({
        totalReviewed: z.number(),
        confirmedCount: z.number(),
        rejectedCount: z.number(),
        correctedCount: z.number(),
        consistencyScorePercent: z.number(),
        estimatedHoursSaved: z.number(),
        hoursSavedFormula: z.string(),
    }),
});
export const assetSummarySchema = z.object({
    id: z.string(),
    asset_code: z.string(),
    name: z.string().nullable().optional(),
    asset_type: z.string(),
    criticality: z.string(),
    created_at: z.string(),
    inspection_count: z.number(),
    latest_inspection_at: z.string().nullable().optional(),
    latest_condition: z.string().nullable().optional(),
    active_findings_count: z.number(),
});
//# sourceMappingURL=api.js.map