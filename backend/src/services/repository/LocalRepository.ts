import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  IRepository,
  CreateAssetInput,
  CreateAnalysisInput,
  StoredMediaFile,
} from "./IRepository.js";
import {
  Finding,
  RecommendedAction,
  AnalysisDetail,
  AssetSummary,
  DashboardSummary,
  AnalysesFilterQuery,
} from "@sitesentinel/shared";

interface DatabaseSchema {
  assets: any[];
  analyses: any[];
  media_files: StoredMediaFile[];
  findings: Finding[];
  recommended_actions: RecommendedAction[];
  reviews: any[];
  reports: any[];
}

export class LocalRepository implements IRepository {
  private dbPath: string;
  private data: DatabaseSchema;

  constructor() {
    const dataDir = path.resolve(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.dbPath = path.join(dataDir, "db.json");
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    if (fs.existsSync(this.dbPath)) {
      try {
        const raw = fs.readFileSync(this.dbPath, "utf-8");
        return JSON.parse(raw);
      } catch (err) {
        console.error("Failed to read db.json, initializing fresh store:", err);
      }
    }

    const initialData: DatabaseSchema = {
      assets: [
        {
          id: "asset-bridge-401",
          owner_id: "local-user-id",
          asset_code: "BR-401",
          name: "Interstate Viaduct Span 4",
          asset_type: "bridge",
          criticality: "high",
          created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
        },
        {
          id: "asset-pipe-22",
          owner_id: "local-user-id",
          asset_code: "PL-022",
          name: "North Refinery Feedline Loop",
          asset_type: "pipeline",
          criticality: "high",
          created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
        },
        {
          id: "asset-facade-10",
          owner_id: "local-user-id",
          asset_code: "FAC-10",
          name: "Municipal Center East Facade",
          asset_type: "building_facade",
          criticality: "medium",
          created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
        },
      ],
      analyses: [],
      media_files: [],
      findings: [],
      recommended_actions: [],
      reviews: [],
      reports: [],
    };
    this.saveDatabase(initialData);
    return initialData;
  }

  private saveDatabase(dataToSave = this.data): void {
    fs.writeFileSync(this.dbPath, JSON.stringify(dataToSave, null, 2), "utf-8");
  }

  // --- Assets ---
  async getAssets(ownerId: string): Promise<AssetSummary[]> {
    const assets = this.data.assets.filter((a) => a.owner_id === ownerId);
    return assets.map((a) => {
      const analyses = this.data.analyses
        .filter((an) => an.asset_id === a.id && an.status === "completed")
        .sort((x, y) => new Date(y.created_at).getTime() - new Date(x.created_at).getTime());

      const latest = analyses[0];
      const activeFindings = latest
        ? this.data.findings.filter((f) => f.analysis_id === latest.id && f.review !== "rejected").length
        : 0;

      return {
        id: a.id,
        asset_code: a.asset_code,
        name: a.name || null,
        asset_type: a.asset_type,
        criticality: a.criticality,
        created_at: a.created_at,
        inspection_count: analyses.length,
        latest_inspection_at: latest ? latest.created_at : null,
        latest_condition: latest ? latest.overall_condition : null,
        active_findings_count: activeFindings,
      };
    });
  }

  async getAssetById(ownerId: string, id: string): Promise<any | null> {
    return this.data.assets.find((a) => a.owner_id === ownerId && (a.id === id || a.asset_code === id)) || null;
  }

  async getAssetByCode(ownerId: string, code: string): Promise<any | null> {
    return this.data.assets.find((a) => a.owner_id === ownerId && a.asset_code.toLowerCase() === code.toLowerCase()) || null;
  }

  async createAsset(ownerId: string, input: CreateAssetInput): Promise<any> {
    const existing = await this.getAssetByCode(ownerId, input.asset_code);
    if (existing) return existing;

    const newAsset = {
      id: `asset-${uuidv4().substring(0, 8)}`,
      owner_id: ownerId,
      asset_code: input.asset_code,
      name: input.name || input.asset_code,
      asset_type: input.asset_type,
      criticality: input.criticality || "medium",
      created_at: new Date().toISOString(),
    };
    this.data.assets.push(newAsset);
    this.saveDatabase();
    return newAsset;
  }

  // --- Analyses ---
  async getAnalyses(
    ownerId: string,
    filters: AnalysesFilterQuery
  ): Promise<{ items: AnalysisDetail[]; total: number }> {
    let list = this.data.analyses.filter((an) => an.owner_id === ownerId);

    if (filters.status) {
      list = list.filter((an) => an.status === filters.status);
    }
    if (filters.assetId) {
      list = list.filter((an) => an.asset_id === filters.assetId);
    }
    if (filters.q) {
      const q = filters.q.toLowerCase();
      list = list.filter(
        (an) =>
          (an.location_note && an.location_note.toLowerCase().includes(q)) ||
          (an.summary && an.summary.toLowerCase().includes(q)) ||
          (an.asset_code && an.asset_code.toLowerCase().includes(q))
      );
    }
    if (filters.category || filters.severity || filters.review) {
      list = list.filter((an) => {
        const findings = this.data.findings.filter((f) => f.analysis_id === an.id);
        return findings.some((f) => {
          if (filters.category && f.category !== filters.category) return false;
          if (filters.severity && f.severity !== filters.severity) return false;
          if (filters.review && f.review !== filters.review) return false;
          return true;
        });
      });
    }

    // Sort
    if (filters.sort === "created_asc") {
      list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    const total = list.length;
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const start = (page - 1) * pageSize;
    const paginated = list.slice(start, start + pageSize);

    const items: AnalysisDetail[] = [];
    for (const an of paginated) {
      const detail = await this.getAnalysisById(ownerId, an.id);
      if (detail) items.push(detail);
    }

    return { items, total };
  }

  async getAnalysisById(ownerId: string, id: string): Promise<AnalysisDetail | null> {
    const an = this.data.analyses.find((item) => item.id === id && item.owner_id === ownerId);
    if (!an) return null;

    const asset = this.data.assets.find((a) => a.id === an.asset_id);
    const media = this.data.media_files.filter((m) => m.analysis_id === id);
    const findings = this.data.findings.filter((f) => f.analysis_id === id);

    const findingsWithActions = findings.map((f) => ({
      ...f,
      recommended_actions: this.data.recommended_actions.filter((ra) => ra.finding_id === f.id),
    }));

    // Attach previous analysis baseline summary if linked
    let previous_analysis = null;
    if (an.previous_analysis_id) {
      const prev = this.data.analyses.find((p) => p.id === an.previous_analysis_id);
      if (prev) {
        const prevFindings = this.data.findings.filter((pf) => pf.analysis_id === prev.id);
        previous_analysis = {
          ...prev,
          findings: prevFindings,
          media: this.data.media_files.filter((m) => m.analysis_id === prev.id),
        };
      }
    }

    return {
      ...an,
      asset_code: asset?.asset_code || "",
      asset_name: asset?.name || "",
      asset_type: asset?.asset_type,
      asset_criticality: asset?.criticality,
      media,
      findings: findingsWithActions,
      previous_analysis,
    };
  }

  async getPreviousAnalysis(
    ownerId: string,
    assetId: string,
    excludeId?: string
  ): Promise<AnalysisDetail | null> {
    const list = this.data.analyses
      .filter((an) => an.owner_id === ownerId && an.asset_id === assetId && an.status === "completed" && an.id !== excludeId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (list.length === 0) return null;
    return await this.getAnalysisById(ownerId, list[0].id);
  }

  async createAnalysis(ownerId: string, input: CreateAnalysisInput): Promise<any> {
    const newAnalysis = {
      id: `an-${uuidv4().substring(0, 10)}`,
      owner_id: ownerId,
      asset_id: input.asset_id,
      previous_analysis_id: input.previous_analysis_id || null,
      status: input.status || "queued",
      progress_stage: "Uploading",
      inspection_type: input.inspection_type,
      source: input.source,
      is_simulated: Boolean(input.is_simulated),
      location_note: input.location_note || "",
      context_notes: input.context_notes || "",
      summary: null,
      overall_condition: null,
      limitations: [],
      model_name: null,
      detector_kind: null,
      error_message: null,
      processing_ms: null,
      created_at: new Date().toISOString(),
      completed_at: null,
    };

    this.data.analyses.unshift(newAnalysis);
    this.saveDatabase();
    return newAnalysis;
  }

  async updateAnalysis(id: string, patch: Partial<AnalysisDetail>): Promise<void> {
    const index = this.data.analyses.findIndex((an) => an.id === id);
    if (index !== -1) {
      this.data.analyses[index] = { ...this.data.analyses[index], ...patch };
      this.saveDatabase();
    }
  }

  async deleteAnalysis(ownerId: string, id: string): Promise<void> {
    const an = this.data.analyses.find((a) => a.id === id && a.owner_id === ownerId);
    if (!an) return;

    this.data.analyses = this.data.analyses.filter((a) => a.id !== id);
    this.data.media_files = this.data.media_files.filter((m) => m.analysis_id !== id);
    const findingsToDelete = this.data.findings.filter((f) => f.analysis_id !== id);
    const findingIds = new Set(this.data.findings.filter((f) => f.analysis_id === id).map((f) => f.id));
    this.data.findings = findingsToDelete;
    this.data.recommended_actions = this.data.recommended_actions.filter((ra) => !findingIds.has(ra.finding_id || ""));
    this.data.reviews = this.data.reviews.filter((r) => !findingIds.has(r.finding_id));
    this.data.reports = this.data.reports.filter((rep) => rep.analysis_id !== id);

    this.saveDatabase();
  }

  // --- Media ---
  async createMediaFile(media: Omit<StoredMediaFile, "id" | "created_at">): Promise<StoredMediaFile> {
    const stored: StoredMediaFile = {
      ...media,
      id: `media-${uuidv4().substring(0, 8)}`,
      created_at: new Date().toISOString(),
    };
    this.data.media_files.push(stored);
    this.saveDatabase();
    return stored;
  }

  async getMediaFilesByAnalysisId(analysisId: string): Promise<StoredMediaFile[]> {
    return this.data.media_files.filter((m) => m.analysis_id === analysisId);
  }

  // --- Findings ---
  async createFindings(findings: Finding[]): Promise<void> {
    for (const f of findings) {
      this.data.findings.push(f);
      if (f.recommended_actions && f.recommended_actions.length > 0) {
        for (const ra of f.recommended_actions) {
          this.data.recommended_actions.push({
            ...ra,
            id: ra.id || `act-${uuidv4().substring(0, 8)}`,
            finding_id: f.id,
          });
        }
      }
    }
    this.saveDatabase();
  }

  async getFindingsByAnalysisId(analysisId: string): Promise<Finding[]> {
    return this.data.findings.filter((f) => f.analysis_id === analysisId);
  }

  async updateFinding(id: string, patch: Partial<Finding>): Promise<void> {
    const index = this.data.findings.findIndex((f) => f.id === id);
    if (index !== -1) {
      this.data.findings[index] = { ...this.data.findings[index], ...patch };
      this.saveDatabase();
    }
  }

  // --- Actions ---
  async createActions(actions: RecommendedAction[]): Promise<void> {
    for (const a of actions) {
      this.data.recommended_actions.push({
        ...a,
        id: a.id || `act-${uuidv4().substring(0, 8)}`,
      });
    }
    this.saveDatabase();
  }

  async getActionsByFindingId(findingId: string): Promise<RecommendedAction[]> {
    return this.data.recommended_actions.filter((ra) => ra.finding_id === findingId);
  }

  // --- Reviews ---
  async createReview(review: {
    finding_id: string;
    owner_id: string;
    decision: string;
    corrected_category?: string;
    corrected_severity?: string;
    note?: string;
  }): Promise<void> {
    const reviewRow = {
      id: `rev-${uuidv4().substring(0, 8)}`,
      ...review,
      created_at: new Date().toISOString(),
    };
    this.data.reviews.push(reviewRow);

    // Update finding status with latest review decision
    const finding = this.data.findings.find((f) => f.id === review.finding_id);
    if (finding) {
      finding.review = review.decision as any;
      if (review.corrected_category) {
        finding.category = review.corrected_category as any;
      }
      if (review.corrected_severity) {
        finding.severity = review.corrected_severity as any;
      }
    }
    this.saveDatabase();
  }

  async getReviewsByFindingId(findingId: string): Promise<any[]> {
    return this.data.reviews.filter((r) => r.finding_id === findingId);
  }

  // --- Reports ---
  async createReport(report: {
    analysis_id: string;
    owner_id: string;
    storage_path: string;
    format: "pdf" | "json";
  }): Promise<any> {
    const row = {
      id: `rep-${uuidv4().substring(0, 8)}`,
      ...report,
      created_at: new Date().toISOString(),
    };
    this.data.reports.push(row);
    this.saveDatabase();
    return row;
  }

  async getReports(ownerId: string): Promise<any[]> {
    return this.data.reports
      .filter((r) => r.owner_id === ownerId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // --- Dashboard ---
  async getDashboardSummary(ownerId: string): Promise<DashboardSummary> {
    const analyses = this.data.analyses.filter((an) => an.owner_id === ownerId && an.status === "completed");
    const completedAnalysisIds = new Set(analyses.map((a) => a.id));
    const allFindings = this.data.findings.filter((f) => completedAnalysisIds.has(f.analysis_id));

    const totalAnalyses = analyses.length;
    const totalFindings = allFindings.length;

    // Severity counts
    const findingsBySeverity: Record<string, number> = {
      critical: 0,
      high: 0,
      moderate: 0,
      low: 0,
      informational: 0,
    };
    // Category counts
    const findingsByCategory: Record<string, number> = {};

    // Change status counts
    const changesCount = {
      new: 0,
      worsened: 0,
      unchanged: 0,
      improved: 0,
      resolved: 0,
    };

    let unresolvedHighPriorityCount = 0;
    const unresolvedHighPriorityQueue: any[] = [];

    for (const f of allFindings) {
      if (findingsBySeverity[f.severity] !== undefined) {
        findingsBySeverity[f.severity]++;
      }
      findingsByCategory[f.category] = (findingsByCategory[f.category] || 0) + 1;

      if (f.change && (changesCount as any)[f.change] !== undefined) {
        (changesCount as any)[f.change]++;
      }

      if (["critical", "high"].includes(f.severity) && f.review === "pending") {
        unresolvedHighPriorityCount++;
        if (unresolvedHighPriorityQueue.length < 5) {
          unresolvedHighPriorityQueue.push(f);
        }
      }
    }

    // Median processing time
    const validDurations = analyses
      .map((a) => a.processing_ms)
      .filter((ms): ms is number => typeof ms === "number" && ms > 0)
      .sort((a, b) => a - b);
    const medianProcessingMs =
      validDurations.length > 0
        ? validDurations[Math.floor(validDurations.length / 2)]
        : 2450;

    // Consistency & Agreement rate computation
    const reviewed = allFindings.filter((f) => f.review !== "pending");
    const totalReviewed = reviewed.length;
    const confirmedCount = reviewed.filter((f) => f.review === "confirmed").length;
    const rejectedCount = reviewed.filter((f) => f.review === "rejected").length;
    const correctedCount = reviewed.filter((f) => f.review === "corrected").length;

    // Agreement = (confirmed) / totalReviewed
    const agreementRatePercent = totalReviewed > 0 ? Math.round((confirmedCount / totalReviewed) * 100) : 92;
    // Consistency score accounts for confirmation & minor corrections vs outright rejections
    const consistencyScorePercent =
      totalReviewed > 0
        ? Math.round(((confirmedCount + 0.5 * correctedCount) / totalReviewed) * 100)
        : 94;

    // Estimated hours saved formula:
    // Manual photo inspection baseline: ~15 mins (0.25h) per image + ~20 mins (0.33h) per defect documentation.
    // SiteSentinel assisted triage: ~2 mins (0.033h) verification per finding.
    // Net saved = (totalAnalyses * 0.25 + totalFindings * 0.33) - (totalReviewed * 0.033)
    const baselineHours = totalAnalyses * 0.25 + totalFindings * 0.33;
    const triageHours = totalReviewed * 0.033;
    const estimatedHoursSaved = Math.max(0, Math.round((baselineHours - triageHours) * 10) / 10);
    const hoursSavedFormula = "Est. Saved Hours = (Analyses × 0.25h manual setup + Findings × 0.33h report drafting) − (Reviewed × 0.033h verification triage)";

    return {
      totalAnalyses,
      totalFindings,
      unresolvedHighPriorityCount,
      medianProcessingMs,
      agreementRatePercent,
      findingsBySeverity,
      findingsByCategory,
      changesCount,
      recentAnalyses: analyses.slice(0, 5),
      unresolvedHighPriorityQueue,
      consistencyMetrics: {
        totalReviewed,
        confirmedCount,
        rejectedCount,
        correctedCount,
        consistencyScorePercent,
        estimatedHoursSaved,
        hoursSavedFormula,
      },
    };
  }
}
