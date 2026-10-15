import {
  Finding,
  RecommendedAction,
  AnalysisDetail,
  AssetSummary,
  DashboardSummary,
  AnalysesFilterQuery,
} from "@sitesentinel/shared";

export interface CreateAssetInput {
  asset_code: string;
  name?: string;
  asset_type: string;
  criticality?: string;
}

export interface CreateAnalysisInput {
  asset_id: string;
  inspection_type: string;
  source: "upload" | "camera" | "demo";
  is_simulated?: boolean;
  location_note?: string;
  context_notes?: string;
  status?: string;
  previous_analysis_id?: string | null;
}

export interface StoredMediaFile {
  id: string;
  analysis_id: string;
  owner_id: string;
  storage_path: string;
  media_type: "image" | "video" | "frame";
  mime_type: string;
  size_bytes: number;
  width?: number | null;
  height?: number | null;
  frame_timestamp_ms?: number | null;
  sha256?: string;
  created_at: string;
}

export interface IRepository {
  // Assets
  getAssets(ownerId: string): Promise<AssetSummary[]>;
  getAssetById(ownerId: string, id: string): Promise<any | null>;
  getAssetByCode(ownerId: string, code: string): Promise<any | null>;
  createAsset(ownerId: string, input: CreateAssetInput): Promise<any>;

  // Analyses
  getAnalyses(ownerId: string, filters: AnalysesFilterQuery): Promise<{ items: AnalysisDetail[]; total: number }>;
  getAnalysisById(ownerId: string, id: string): Promise<AnalysisDetail | null>;
  getPreviousAnalysis(ownerId: string, assetId: string, excludeId?: string): Promise<AnalysisDetail | null>;
  createAnalysis(ownerId: string, input: CreateAnalysisInput): Promise<any>;
  updateAnalysis(id: string, patch: Partial<AnalysisDetail>): Promise<void>;
  deleteAnalysis(ownerId: string, id: string): Promise<void>;

  // Media
  createMediaFile(media: Omit<StoredMediaFile, "id" | "created_at">): Promise<StoredMediaFile>;
  getMediaFilesByAnalysisId(analysisId: string): Promise<StoredMediaFile[]>;

  // Findings
  createFindings(findings: Finding[]): Promise<void>;
  getFindingsByAnalysisId(analysisId: string): Promise<Finding[]>;
  updateFinding(id: string, patch: Partial<Finding>): Promise<void>;

  // Recommended Actions
  createActions(actions: RecommendedAction[]): Promise<void>;
  getActionsByFindingId(findingId: string): Promise<RecommendedAction[]>;

  // Reviews
  createReview(review: {
    finding_id: string;
    owner_id: string;
    decision: string;
    corrected_category?: string;
    corrected_severity?: string;
    note?: string;
  }): Promise<void>;
  getReviewsByFindingId(findingId: string): Promise<any[]>;

  // Reports
  createReport(report: {
    analysis_id: string;
    owner_id: string;
    storage_path: string;
    format: "pdf" | "json";
  }): Promise<any>;
  getReports(ownerId: string): Promise<any[]>;

  // Dashboard
  getDashboardSummary(ownerId: string): Promise<DashboardSummary>;
}
