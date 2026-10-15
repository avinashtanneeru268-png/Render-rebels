import { LocalStorageProvider } from "./LocalStorageProvider.js";
import { SupabaseStorageProvider } from "./SupabaseStorageProvider.js";
import { env } from "../../config/env.js";
let storageProvider;
if (env.DATA_MODE === "supabase" && env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    storageProvider = new SupabaseStorageProvider();
}
else {
    storageProvider = new LocalStorageProvider();
}
export { storageProvider };
export * from "./IStorageProvider.js";
export * from "./LocalStorageProvider.js";
export * from "./SupabaseStorageProvider.js";
//# sourceMappingURL=index.js.map