import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { IStorageProvider } from "./IStorageProvider.js";
import { env } from "../../config/env.js";

export class SupabaseStorageProvider implements IStorageProvider {
  private client: SupabaseClient | null = null;
  private bucket: string;

  constructor() {
    this.bucket = env.SUPABASE_STORAGE_BUCKET || "inspection-media";
    if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
      this.client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    }
  }

  private getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error("Supabase Storage is not configured. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    }
    return this.client;
  }

  async saveFile(key: string, buffer: Buffer, mimeType: string): Promise<string> {
    const client = this.getClient();
    const { error } = await client.storage
      .from(this.bucket)
      .upload(key, buffer, { contentType: mimeType, upsert: true });

    if (error) {
      throw new Error(`Supabase Storage upload error: ${error.message}`);
    }
    return key;
  }

  async getFile(key: string): Promise<Buffer> {
    const client = this.getClient();
    const { data, error } = await client.storage.from(this.bucket).download(key);
    if (error || !data) {
      throw new Error(`Supabase Storage download error: ${error?.message}`);
    }
    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async getSignedUrl(key: string, expiresInSeconds = 300): Promise<string> {
    const client = this.getClient();
    const { data, error } = await client.storage
      .from(this.bucket)
      .createSignedUrl(key, expiresInSeconds);

    if (error || !data?.signedUrl) {
      throw new Error(`Failed to generate signed URL: ${error?.message}`);
    }
    return data.signedUrl;
  }

  async deleteFile(key: string): Promise<void> {
    const client = this.getClient();
    const { error } = await client.storage.from(this.bucket).remove([key]);
    if (error) {
      console.warn(`Supabase Storage delete warning: ${error.message}`);
    }
  }
}
