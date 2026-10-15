import { createClient } from "@supabase/supabase-js";
import { env } from "../../config/env.js";
export class SupabaseStorageProvider {
    client = null;
    bucket;
    constructor() {
        this.bucket = env.SUPABASE_STORAGE_BUCKET || "inspection-media";
        if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
            this.client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
        }
    }
    getClient() {
        if (!this.client) {
            throw new Error("Supabase Storage is not configured. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
        }
        return this.client;
    }
    async saveFile(key, buffer, mimeType) {
        const client = this.getClient();
        const { error } = await client.storage
            .from(this.bucket)
            .upload(key, buffer, { contentType: mimeType, upsert: true });
        if (error) {
            throw new Error(`Supabase Storage upload error: ${error.message}`);
        }
        return key;
    }
    async getFile(key) {
        const client = this.getClient();
        const { data, error } = await client.storage.from(this.bucket).download(key);
        if (error || !data) {
            throw new Error(`Supabase Storage download error: ${error?.message}`);
        }
        const arrayBuffer = await data.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
    async getSignedUrl(key, expiresInSeconds = 300) {
        const client = this.getClient();
        const { data, error } = await client.storage
            .from(this.bucket)
            .createSignedUrl(key, expiresInSeconds);
        if (error || !data?.signedUrl) {
            throw new Error(`Failed to generate signed URL: ${error?.message}`);
        }
        return data.signedUrl;
    }
    async deleteFile(key) {
        const client = this.getClient();
        const { error } = await client.storage.from(this.bucket).remove([key]);
        if (error) {
            console.warn(`Supabase Storage delete warning: ${error.message}`);
        }
    }
}
//# sourceMappingURL=SupabaseStorageProvider.js.map