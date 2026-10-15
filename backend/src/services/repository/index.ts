import { IRepository } from "./IRepository.js";
import { LocalRepository } from "./LocalRepository.js";
import { SupabaseRepository } from "./SupabaseRepository.js";
import { env } from "../../config/env.js";

let repository: IRepository;

if (env.DATA_MODE === "supabase" && env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
  repository = new SupabaseRepository();
} else {
  repository = new LocalRepository();
}

export { repository };
export * from "./IRepository.js";
export * from "./LocalRepository.js";
export * from "./SupabaseRepository.js";
