import { IStorageProvider } from "./IStorageProvider.js";
export declare class SupabaseStorageProvider implements IStorageProvider {
    private client;
    private bucket;
    constructor();
    private getClient;
    saveFile(key: string, buffer: Buffer, mimeType: string): Promise<string>;
    getFile(key: string): Promise<Buffer>;
    getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
    deleteFile(key: string): Promise<void>;
}
//# sourceMappingURL=SupabaseStorageProvider.d.ts.map