import dotenv from "dotenv";
import path from "path";
import { serverEnvSchema } from "./serverEnvSchema.js";
// Load root .env file if available
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
dotenv.config(); // also check current dir
const parsed = serverEnvSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("❌ Environment configuration validation failed:");
    console.error(parsed.error.format());
    process.exit(1);
}
export const env = parsed.data;
if (env.DATA_MODE === "local") {
    console.log("ℹ️  SiteSentinel running in ZERO-CONFIG LOCAL MODE (single demo user, local file store).");
}
else {
    console.log("ℹ️  SiteSentinel running in SUPABASE PRODUCTION MODE.");
}
if (!env.GEMINI_API_KEY) {
    console.log("⚠️  GEMINI_API_KEY is not set. Real AI analyses will return AI_UNAVAILABLE; Demo Mode is fully functional.");
}
//# sourceMappingURL=env.js.map