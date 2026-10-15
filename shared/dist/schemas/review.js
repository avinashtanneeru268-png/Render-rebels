import { z } from "zod";
import { findingCategorySchema, severitySchema, reviewStatusSchema, } from "./taxonomy.js";
export const reviewItemSchema = z
    .object({
    findingId: z.string().min(1, "Finding ID is required"),
    decision: reviewStatusSchema.refine((d) => d !== "pending", {
        message: "Decision cannot be pending",
    }),
    correctedCategory: findingCategorySchema.optional(),
    correctedSeverity: severitySchema.optional(),
    note: z.string().max(2000, "Review note must be 2000 characters or fewer").optional().default(""),
})
    .refine((item) => {
    if (item.decision === "corrected") {
        return item.correctedCategory !== undefined || item.correctedSeverity !== undefined;
    }
    return true;
}, {
    message: "When decision is 'corrected', either correctedCategory or correctedSeverity must be provided",
    path: ["decision"],
});
export const reviewSubmissionSchema = z.object({
    reviews: z.array(reviewItemSchema).min(1, "At least one review item must be submitted"),
});
//# sourceMappingURL=review.js.map