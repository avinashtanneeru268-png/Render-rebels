import { IRepository, CreateAssetInput, CreateAnalysisInput, StoredMediaFile } from "./IRepository.js";
import { Finding, RecommendedAction, AnalysisDetail, AssetSummary, DashboardSummary, AnalysesFilterQuery } from "@sitesentinel/shared";
export declare class SupabaseRepository implements IRepository {
    private client;
    constructor();
    getAssets(ownerId: string): Promise<AssetSummary[]>;
    getAssetById(ownerId: string, id: string): Promise<any | null>;
    getAssetByCode(ownerId: string, code: string): Promise<any | null>;
    createAsset(ownerId: string, input: CreateAssetInput): Promise<any>;
    getAnalyses(ownerId: string, filters: AnalysesFilterQuery): Promise<{
        items: AnalysisDetail[];
        total: number;
    }>;
    getAnalysisById(ownerId: string, id: string): Promise<AnalysisDetail | null>;
    getPreviousAnalysis(ownerId: string, assetId: string, excludeId?: string): Promise<AnalysisDetail | null>;
    createAnalysis(ownerId: string, input: CreateAnalysisInput): Promise<any>;
    updateAnalysis(id: string, patch: Partial<AnalysisDetail>): Promise<void>;
    deleteAnalysis(ownerId: string, id: string): Promise<void>;
    createMediaFile(media: Omit<StoredMediaFile, "id" | "created_at">): Promise<StoredMediaFile>;
    getMediaFilesByAnalysisId(analysisId: string): Promise<StoredMediaFile[]>;
    createFindings(findings: Finding[]): Promise<void>;
    getFindingsByAnalysisId(analysisId: string): Promise<Finding[]>;
    updateFinding(id: string, patch: Partial<Finding>): Promise<void>;
    createActions(actions: RecommendedAction[]): Promise<void>;
    getActionsByFindingId(findingId: string): Promise<RecommendedAction[]>;
    createReview(review: any): Promise<void>;
    getReviewsByFindingId(findingId: string): Promise<any[]>;
    createReport(report: any): Promise<any>;
    getReports(ownerId: string): Promise<any[]>;
    getDashboardSummary(ownerId: string): Promise<DashboardSummary>;
}
//# sourceMappingURL=SupabaseRepository.d.ts.map