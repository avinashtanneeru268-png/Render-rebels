import { z } from "zod";

export const clientEnvSchema = z.object({
  VITE_API_BASE_URL: z.string().default("http://localhost:5000"),
  VITE_SUPABASE_URL: z.string().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),
});
export type ClientEnv = z.infer<typeof clientEnvSchema>;
