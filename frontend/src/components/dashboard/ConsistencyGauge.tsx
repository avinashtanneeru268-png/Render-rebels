import React, { useState } from "react";
import { CheckCheck, HelpCircle, ShieldCheck, Clock, CheckCircle2, Edit3, XCircle } from "lucide-react";

interface ConsistencyMetrics {
  totalReviewed: number;
  confirmedCount: number;
  rejectedCount: number;
  correctedCount: number;
  consistencyScorePercent: number;
  estimatedHoursSaved: number;
  hoursSavedFormula: string;
}

interface ConsistencyGaugeProps {
  metrics: ConsistencyMetrics;
  agreementRatePercent: number;
}

export const ConsistencyGauge: React.FC<ConsistencyGaugeProps> = ({
  metrics,
  agreementRatePercent,
}) => {
  const [showFormula, setShowFormula] = useState(false);

  return (
    <div className="field-panel p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Verification Consistency
            </h3>
          </div>
          <span className="text-[10px] font-mono text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/60">
            Computed from {metrics.totalReviewed} Human Audits
          </span>
        </div>

        {/* Big Dual Scores */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {agreementRatePercent}%
            </span>
            <p className="text-xs text-slate-400 mt-1 font-medium">AI-Human Agreement</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Direct Confirmations</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-teal-500/30 text-center">
            <span className="text-3xl font-extrabold font-mono text-teal-400 tracking-tight">
              {metrics.consistencyScorePercent}%
            </span>
            <p className="text-xs text-slate-300 mt-1 font-medium">Consistency Metric</p>
            <p className="text-[10px] text-teal-500/80 mt-0.5">Reliability Index</p>
          </div>
        </div>

        {/* Audit Decision Distribution */}
        <div className="space-y-2 mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Inspector Audit Actions
          </p>
          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirmed</span>
            </span>
            <span className="font-mono font-bold text-white">{metrics.confirmedCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Corrected (Severity/Category)</span>
            </span>
            <span className="font-mono font-bold text-white">{metrics.correctedCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="flex items-center gap-1.5 text-red-400">
              <XCircle className="w-3.5 h-3.5" />
              <span>Rejected (False Positive)</span>
            </span>
            <span className="font-mono font-bold text-white">{metrics.rejectedCount}</span>
          </div>
        </div>
      </div>

      {/* Verifiable Saved Time Formula */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Clock className="w-4 h-4 text-teal-400" />
            <span>Est. Review Time Saved:</span>
          </span>
          <span className="text-base font-extrabold font-mono text-teal-400">
            ~{metrics.estimatedHoursSaved} hrs
          </span>
        </div>
        <button
          onClick={() => setShowFormula(!showFormula)}
          className="mt-2 text-[11px] text-slate-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
        >
          <HelpCircle className="w-3 h-3" />
          <span>{showFormula ? "Hide Formula Assumptions" : "View Computation Formula"}</span>
        </button>

        {showFormula && (
          <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono space-y-1">
            <p>{metrics.hoursSavedFormula}</p>
            <p className="text-slate-500 font-sans">
              Assumes ~15m manual photo setup + ~20m manual defect note drafting vs ~2m verification triage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
