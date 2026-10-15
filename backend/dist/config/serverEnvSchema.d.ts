import { z } from "zod";
export declare const serverEnvSchema: z.ZodObject<{
    PORT: z.ZodDefault<z.ZodNumber>;
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    GEMINI_API_KEY: z.ZodOptional<z.ZodString>;
    GEMINI_MODEL: z.ZodDefault<z.ZodString>;
    SUPABASE_URL: z.ZodOptional<z.ZodString>;
    SUPABASE_SERVICE_ROLE_KEY: z.ZodOptional<z.ZodString>;
    SUPABASE_STORAGE_BUCKET: z.ZodDefault<z.ZodString>;
    DATA_MODE: z.ZodDefault<z.ZodEnum<["local", "supabase"]>>;
    MAX_IMAGE_MB: z.ZodDefault<z.ZodNumber>;
    MAX_VIDEO_MB: z.ZodDefault<z.ZodNumber>;
    MAX_VIDEO_SECONDS: z.ZodDefault<z.ZodNumber>;
    CLIENT_URL: z.ZodDefault<z.ZodString>;
    DETECTOR_MODEL_PATH: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    PORT: number;
    NODE_ENV: "development" | "production" | "test";
    GEMINI_MODEL: string;
    SUPABASE_STORAGE_BUCKET: string;
    DATA_MODE: "local" | "supabase";
    MAX_IMAGE_MB: number;
    MAX_VIDEO_MB: number;
    MAX_VIDEO_SECONDS: number;
    CLIENT_URL: string;
    GEMINI_API_KEY?: string | undefined;
    SUPABASE_URL?: string | undefined;
    SUPABASE_SERVICE_ROLE_KEY?: string | undefined;
    DETECTOR_MODEL_PATH?: string | undefined;
}, {
    PORT?: number | undefined;
    NODE_ENV?: "development" | "production" | "test" | undefined;
    GEMINI_API_KEY?: string | undefined;
    GEMINI_MODEL?: string | undefined;
    SUPABASE_URL?: string | undefined;
    SUPABASE_SERVICE_ROLE_KEY?: string | undefined;
    SUPABASE_STORAGE_BUCKET?: string | undefined;
    DATA_MODE?: "local" | "supabase" | undefined;
    MAX_IMAGE_MB?: number | undefined;
    MAX_VIDEO_MB?: number | undefined;
    MAX_VIDEO_SECONDS?: number | undefined;
    CLIENT_URL?: string | undefined;
    DETECTOR_MODEL_PATH?: string | undefined;
}>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
//# sourceMappingURL=serverEnvSchema.d.ts.map