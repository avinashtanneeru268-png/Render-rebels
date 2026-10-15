import { z } from "zod";
export const serverEnvSchema = z.object({
    PORT: z.coerce.number().default(5000),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    GEMINI_API_KEY: z.string().optional(),
    GEMINI_MODEL: z.string().default("gemini-3.5-flash"),
    SUPABASE_URL: z.string().url().optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
    SUPABASE_STORAGE_BUCKET: z.string().default("inspection-media"),
    DATA_MODE: z.enum(["local", "supabase"]).default("local"),
    MAX_IMAGE_MB: z.coerce.number().default(10),
    MAX_VIDEO_MB: z.coerce.number().default(50),
    MAX_VIDEO_SECONDS: z.coerce.number().default(60),
    CLIENT_URL: z.string().default("http://localhost:5173"),
    DETECTOR_MODEL_PATH: z.string().optional(),
});
//# sourceMappingURL=serverEnvSchema.js.map