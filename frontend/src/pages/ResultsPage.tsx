import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { MediaViewer } from "../components/results/MediaViewer";
import { FindingsList } from "../components/results/FindingsList";
import { FindingDetail } from "../components/results/FindingDetail";
import { ChangeComparisonView } from "../components/results/ChangeComparisonView";
import { SimulatedBadge } from "../components/common/SimulatedBadge";
import {
  FileText,
  Download,
  Code,
  ArrowLeft,
  AlertTriangle,
  Layers,
  Sparkles,
  GitCompare,
  Info,
} from "lucide-react";
import { ReviewStatus, FindingCategory, Severity } from "@sitesentinel/shared";

export const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [hoveredFindingId, setHoveredFindingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"findings" | "comparison">("findings");

  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ["analysis", id],
    queryFn: () => api.getAnalysisById(id!),
    enabled: Boolean(id),
  });

  // Default select first finding once loaded
  React.useEffect(() => {
    if (analysis?.findings && analysis.findings.length > 0 && !selectedFindingId) {
      setSelectedFindingId(analysis.findings[0].id);
    }
  }, [analysis, selectedFindingId]);

  // Review submission mutation
  const reviewMutation = useMutation({
    mutationFn: (review: {
      findingId: string;
      decision: "confirmed" | "rejected" | "corrected";
      correctedCategory?: FindingCategory;
      correctedSeverity?: Severity;
      note?: string;
    }) => api.submitReviews(id!, [review as any]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analysis", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-72" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[540px] bg-slate-900 rounded-xl" />
          <div className="h-[540px] bg-slate-900 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="field-panel p-12 text-center text-red-400">
        <AlertTriangle className="w-10 h-10 mx-auto mb-3" />
        <h3 className="text-base font-bold">Analysis Not Found</h3>
        <p className="text-xs text-slate-400 mt-1">
          Inspection analysis #{id} could not be retrieved.
        </p>
        <Link
          to="/dashboard"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  const selectedFinding =
    analysis.findings.find((f) => f.id === selectedFindingId) || analysis.findings[0];

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link
              to="/history"
              className="text-slate-400 hover:text-white flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>History</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="font-mono text-xs text-teal-400 font-bold">
              {analysis.asset_code || analysis.asset_id}
            </span>
            {analysis.is_simulated && <SimulatedBadge size="sm" />}
          </div>

          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <span>{analysis.asset_name || analysis.asset_code || "Inspection Detail"}</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded uppercase font-bold bg-slate-800 text-slate-300">
              {analysis.overall_condition || "indeterminate"}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspected {new Date(analysis.created_at).toLocaleString()} • Model:{" "}
            {analysis.model_name || "gemini-2.5-flash"}
          </p>
        </div>

        {/* Report Exports */}
        <div className="flex items-center gap-2.5">
          <a
            href={api.getReportPdfUrl(analysis.id)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white shadow-md shadow-teal-900/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF Report</span>
          </a>

          <a
            href={api.getReportJsonUrl(analysis.id)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 transition-all"
          >
            <Code className="w-3.5 h-3.5" />
            <span>JSON</span>
          </a>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("findings")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "findings"
              ? "bg-teal-600 text-white shadow-md shadow-teal-900/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Visual Findings & Evidence Ledger ({analysis.findings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("comparison")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "comparison"
              ? "bg-teal-600 text-white shadow-md shadow-teal-900/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <GitCompare className="w-4 h-4" />
          <span>Change-Aware Re-Inspection Matrix</span>
          {analysis.previous_analysis_id && (
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse ml-1" />
          )}
        </button>
      </div>

      {/* Tab 1: Visual Findings & Evidence */}
      {activeTab === "findings" ? (
        <div className="space-y-6">
          {/* Main Inspection Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Media Viewer with Overlays */}
            <div className="lg:col-span-2">
              <MediaViewer
                media={analysis.media}
                findings={analysis.findings}
                selectedFindingId={selectedFindingId}
                onSelectFinding={setSelectedFindingId}
                hoveredFindingId={hoveredFindingId}
              />
            </div>

            {/* Findings List Ledger */}
            <div>
              <FindingsList
                findings={analysis.findings}
                selectedFindingId={selectedFindingId}
                onSelectFinding={setSelectedFindingId}
                onHoverFinding={setHoveredFindingId}
              />
            </div>
          </div>

          {/* Selected Finding Detail & Evidence Ledger */}
          {selectedFinding ? (
            <FindingDetail
              finding={selectedFinding}
              onReviewSubmit={(rev) => reviewMutation.mutate(rev)}
              isSubmittingReview={reviewMutation.isPending}
            />
          ) : (
            <div className="field-panel p-8 text-center text-xs text-slate-500">
              No defect finding selected.
            </div>
          )}
        </div>
      ) : (
        /* Tab 2: Change Comparison */
        <ChangeComparisonView
          currentFindings={analysis.findings}
          currentMedia={analysis.media}
          previousAnalysis={analysis.previous_analysis}
        />
      )}

      {/* Executive Summary & Limitations Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Executive Summary */}
        <div className="field-panel p-5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Executive Condition Synthesis
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {analysis.summary || "No executive summary available."}
          </p>
        </div>

        {/* Limitations */}
        <div className="field-panel p-5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Inspection Environmental Limitations</span>
          </h4>
          {analysis.limitations && analysis.limitations.length > 0 ? (
            <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
              {analysis.limitations.map((lim, i) => (
                <li key={i}>{lim}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500">
              Standard lighting and visual resolution; no occlusion limitations reported.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
