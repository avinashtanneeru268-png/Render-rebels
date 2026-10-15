import {
  HealthResponse,
  DashboardSummary,
  AnalysisDetail,
  AssetSummary,
  ReviewSubmission,
  AnalysesFilterQuery,
} from "@sitesentinel/shared";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "https://render-rebels-1.onrender.com" : "");

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = new Headers(options.headers || {});

  // If local token or auth token exists, attach
  const token = localStorage.getItem("sitesentinel_auth_token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data?.error?.message || `Request failed with status ${response.status}`;
    const err: any = new Error(errorMsg);
    err.code = data?.error?.code;
    err.details = data?.error?.details;
    throw err;
  }

  return data as T;
}

export const api = {
  // Health
  getHealth: () => request<HealthResponse>("/api/health"),

  // Dashboard
  getDashboardSummary: () => request<DashboardSummary>("/api/dashboard/summary"),

  // Analyses
  getAnalyses: (params: Partial<AnalysesFilterQuery> = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.pageSize) query.set("pageSize", String(params.pageSize));
    if (params.q) query.set("q", params.q);
    if (params.category) query.set("category", params.category);
    if (params.severity) query.set("severity", params.severity);
    if (params.status) query.set("status", params.status);
    if (params.review) query.set("review", params.review);
    if (params.assetId) query.set("assetId", params.assetId);
    if (params.sort) query.set("sort", params.sort);

    return request<{ items: AnalysisDetail[]; total: number; page: number; pageSize: number; totalPages: number }>(
      `/api/analyses?${query.toString()}`
    );
  },

  getAnalysisById: (id: string) => request<AnalysisDetail>(`/api/analyses/${id}`),

  deleteAnalysis: (id: string) => request<void>(`/api/analyses/${id}`, { method: "DELETE" }),

  submitReviews: (analysisId: string, reviews: ReviewSubmission["reviews"]) =>
    request<{ message: string; findings: any[] }>(`/api/analyses/${analysisId}/review`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviews }),
    }),

  submitAnalysis: async (formData: FormData): Promise<{ analysisId: string; status: string; assetId: string }> => {
    const url = `${API_BASE}/api/analyze`;
    const token = localStorage.getItem("sitesentinel_auth_token");
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      const err: any = new Error(data?.error?.message || "Analysis upload failed");
      err.code = data?.error?.code;
      err.details = data?.error?.details;
      throw err;
    }
    return data;
  },

  // Assets
  getAssets: () => request<AssetSummary[]>("/api/assets"),
  getAssetById: (id: string) => request<{ asset: any; timeline: AnalysisDetail[]; totalInspections: number }>(`/api/assets/${id}`),

  // Reports
  getReports: () => request<any[]>("/api/reports"),
  getReportPdfUrl: (analysisId: string) => `${API_BASE}/api/reports/${analysisId}?format=pdf`,
  getReportJsonUrl: (analysisId: string) => `${API_BASE}/api/reports/${analysisId}?format=json`,

  // Demo Cases
  getDemoCases: () => request<any[]>("/api/demo/cases"),
  runDemoCase: (caseId: string) =>
    request<{ analysisId: string; status: string; isSimulated: boolean; message: string }>(
      `/api/demo/cases/${caseId}/run`,
      { method: "POST" }
    ),
};
