import React, { useState } from "react";
import {
  Finding,
  FindingCategory,
  Severity,
  ReviewStatus,
} from "@sitesentinel/shared";
import { SeverityBadge } from "../common/SeverityBadge";
import { CategoryChip } from "../common/CategoryChip";
import { ChangeBadge } from "../common/ChangeBadge";
import { CertaintyIndicator } from "../common/CertaintyIndicator";
import {
  Eye,
  Brain,
  Wrench,
  CheckCircle,
  XCircle,
  Edit3,
  Calculator,
  AlertTriangle,
  Info,
} from "lucide-react";

interface FindingDetailProps {
  finding: Finding;
  onReviewSubmit: (review: {
    findingId: string;
    decision: "confirmed" | "rejected" | "corrected";
    correctedCategory?: FindingCategory;
    correctedSeverity?: Severity;
    note?: string;
  }) => void;
  isSubmittingReview?: boolean;
}

export const FindingDetail: React.FC<FindingDetailProps> = ({
  finding,
  onReviewSubmit,
  isSubmittingReview = false,
}) => {
  const [showFormula, setShowFormula] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [correctedCategory, setCorrectedCategory] = useState<FindingCategory>(finding.category);
  const [correctedSeverity, setCorrectedSeverity] = useState<Severity>(finding.severity);
  const [reviewNote, setReviewNote] = useState("");

  const handleDecision = (decision: "confirmed" | "rejected" | "corrected") => {
    onReviewSubmit({
      findingId: finding.id,
      decision,
      correctedCategory: decision === "corrected" ? correctedCategory : undefined,
      correctedSeverity: decision === "corrected" ? correctedSeverity : undefined,
      note: reviewNote.trim() || undefined,
    });
    setIsCorrecting(false);
  };

  const urgencyColors: Record<string, string> = {
    immediate: "bg-red-950/80 text-red-400 border-red-700",
    within_7_days: "bg-orange-950/80 text-orange-400 border-orange-700",
    within_30_days: "bg-amber-950/80 text-amber-400 border-amber-700",
    monitor: "bg-sky-950/80 text-sky-400 border-sky-700",
    no_action: "bg-slate-900 text-slate-400 border-slate-700",
  };

  return (
    <div className="field-panel p-6 space-y-6">
      {/* Finding Title & Badges */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <SeverityBadge severity={finding.severity} size="lg" />
          <CategoryChip category={finding.category} />
          {finding.change && <ChangeBadge change={finding.change} />}
          <CertaintyIndicator
            certainty={finding.certainty}
            confidenceScore={finding.confidence_score}
          />
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">{finding.title}</h3>
      </div>

      {/* Priority Score Bar & Explainable Breakdown */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Deterministic Priority Score
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-mono font-extrabold text-white">
              {finding.priority_score}
              <span className="text-xs text-slate-500 font-sans">/100</span>
            </span>
            <button
              onClick={() => setShowFormula(!showFormula)}
              className="text-xs text-teal-400 hover:text-teal-300 underline font-medium ml-2"
            >
              {showFormula ? "Hide Math" : "Explain Math"}
            </button>
          </div>
        </div>

        {/* Priority Gauge Bar */}
        <div className="mt-2.5 w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            style={{ width: `${finding.priority_score}%` }}
            className={`h-full transition-all duration-500 ${
              finding.priority_score >= 80
                ? "bg-red-500"
                : finding.priority_score >= 60
                ? "bg-orange-500"
                : finding.priority_score >= 40
                ? "bg-amber-400"
                : "bg-teal-500"
            }`}
          />
        </div>

        {/* Explainable Factor Breakdown */}
        {showFormula && finding.priority_factors && (
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-1.5 font-mono">
            <p className="text-teal-400 font-semibold font-sans">
              Formula: {finding.priority_factors.formula}
            </p>
            <p className="text-slate-400">{finding.priority_factors.explanation}</p>
          </div>
        )}
      </div>

      {/* Core Innovation: Explicit Evidence Ledger Separation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Observed Physical Evidence */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-sky-800/40">
          <div className="flex items-center gap-2 text-sky-400 mb-2">
            <Eye className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Observed Physical Evidence
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {finding.evidence_observed}
          </p>
          <p className="mt-2 text-[10px] text-slate-500 italic">
            *Ground truth physical observations literally visible on asset surface.
          </p>
        </div>

        {/* Model Inference */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-800/40">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Brain className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Model Inference (Hypothesis)
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {finding.inference || "No secondary causal inference hypothesized."}
          </p>
          <p className="mt-2 text-[10px] text-slate-500 italic">
            *Model interpretation of underlying degradation mechanism or risk.
          </p>
        </div>
      </div>

      {/* Re-Inspection Progression Note */}
      {finding.change && finding.change !== "not_compared" && (
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-600/30 text-xs flex items-start gap-2.5 text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold uppercase tracking-wider">
              Re-Inspection Progression:
            </span>{" "}
            {finding.change_note || `Classified as ${finding.change} relative to baseline.`}
          </div>
        </div>
      )}

      {/* Recommended Advisory Actions */}
      <div>
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-3">
          <Wrench className="w-4 h-4 text-teal-400" />
          <span>Actionable Engineering Advisory ({finding.recommended_actions?.length || 0})</span>
        </h4>
        <div className="space-y-2.5">
          {finding.recommended_actions?.map((act, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start justify-between gap-4"
            >
              <div>
                <p className="text-sm font-semibold text-white">{act.action}</p>
                {act.rationale && (
                  <p className="mt-1 text-xs text-slate-400">{act.rationale}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                    urgencyColors[act.urgency] || urgencyColors.monitor
                  }`}
                >
                  {act.urgency.replace(/_/g, " ")}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Source: {act.source === "rule" ? "Advisory Rule" : "AI Proposed"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Human Review Workflow Controls */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Inspector Sign-off & Audit Review
          </h4>
          <span
            className={`text-xs px-2.5 py-0.5 rounded font-mono uppercase font-bold ${
              finding.review === "confirmed"
                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                : finding.review === "rejected"
                ? "bg-red-950 text-red-400 border border-red-800"
                : finding.review === "corrected"
                ? "bg-amber-950 text-amber-400 border border-amber-800"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            Review Status: {finding.review}
          </span>
        </div>

        {/* Correction Dropdowns */}
        {isCorrecting && (
          <div className="mb-4 p-4 rounded-xl bg-slate-900 border border-amber-500/40 space-y-3">
            <p className="text-xs font-semibold text-amber-300">
              Correct Finding Classification or Severity:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Corrected Category</label>
                <select
                  value={correctedCategory}
                  onChange={(e) => setCorrectedCategory(e.target.value as FindingCategory)}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs text-white"
                >
                  <option value="crack">Crack</option>
                  <option value="corrosion_rust">Corrosion / Rust</option>
                  <option value="water_damage_leak">Water Leak</option>
                  <option value="spalling_delamination">Spalling / Delamination</option>
                  <option value="deformation_misalignment">Deformation</option>
                  <option value="missing_or_damaged_component">Missing Hardware</option>
                  <option value="vegetation_or_debris">Vegetation / Debris</option>
                  <option value="safety_hazard">Safety Hazard</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Corrected Severity</label>
                <select
                  value={correctedSeverity}
                  onChange={(e) => setCorrectedSeverity(e.target.value as Severity)}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs text-white"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="moderate">Moderate</option>
                  <option value="low">Low</option>
                  <option value="informational">Informational</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Review Note */}
        <input
          type="text"
          value={reviewNote}
          onChange={(e) => setReviewNote(e.target.value)}
          placeholder="Inspector field verification notes (optional)..."
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 mb-3 focus:outline-none focus:border-teal-500"
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={isSubmittingReview}
            onClick={() => handleDecision("confirmed")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-semibold text-white shadow-md shadow-emerald-900/30 transition-all"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Confirm Finding</span>
          </button>

          <button
            type="button"
            disabled={isSubmittingReview}
            onClick={() => {
              if (!isCorrecting) {
                setIsCorrecting(true);
              } else {
                handleDecision("corrected");
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-xs font-semibold text-white shadow-md shadow-amber-900/30 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isCorrecting ? "Save Correction" : "Correct Finding"}</span>
          </button>

          <button
            type="button"
            disabled={isSubmittingReview}
            onClick={() => handleDecision("rejected")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-950 hover:bg-red-900 border border-red-700 text-red-300 disabled:opacity-50 text-xs font-semibold transition-all"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reject (False Positive)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
