import { IStorageProvider } from "./IStorageProvider.js";
export declare class LocalStorageProvider implements IStorageProvider {
    private baseDir;
    constructor();
    private getSafePath;
    saveFile(key: string, buffer: Buffer, _mimeType: string): Promise<string>;
    getFile(key: string): Promise<Buffer>;
    getSignedUrl(key: string, _expiresInSeconds?: number): Promise<string>;
    deleteFile(key: string): Promise<void>;
}
//# sourceMappingURL=LocalStorageProvider.d.ts.map