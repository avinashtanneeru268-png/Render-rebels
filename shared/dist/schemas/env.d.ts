import { z } from "zod";
export declare const clientEnvSchema: z.ZodObject<{
    VITE_API_BASE_URL: z.ZodDefault<z.ZodString>;
    VITE_SUPABASE_URL: z.ZodOptional<z.ZodString>;
    VITE_SUPABASE_ANON_KEY: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    VITE_API_BASE_URL: string;
    VITE_SUPABASE_URL?: string | undefined;
    VITE_SUPABASE_ANON_KEY?: string | undefined;
}, {
    VITE_API_BASE_URL?: string | undefined;
    VITE_SUPABASE_URL?: string | undefined;
    VITE_SUPABASE_ANON_KEY?: string | undefined;
}>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
//# sourceMappingURL=env.d.ts.map