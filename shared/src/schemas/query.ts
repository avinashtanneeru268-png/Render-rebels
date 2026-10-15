import { z } from "zod";
import {
  findingCategorySchema,
  severitySchema,
  reviewStatusSchema,
  analysisStatusSchema,
} from "./taxonomy.js";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
});

export const analysesFilterSchema = paginationSchema.extend({
  q: z.string().optional(),
  category: findingCategorySchema.optional(),
  severity: severitySchema.optional(),
  status: analysisStatusSchema.optional(),
  review: reviewStatusSchema.optional(),
  assetId: z.string().optional(),
  from: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
  to: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
  sort: z.enum(["created_desc", "created_asc", "priority_desc"]).default("created_desc"),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;
export type AnalysesFilterQuery = z.infer<typeof analysesFilterSchema>;
