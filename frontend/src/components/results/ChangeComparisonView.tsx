import React, { useState } from "react";
import { Finding, MediaFile } from "@sitesentinel/shared";
import { GitCompare, TrendingUp, PlusCircle, CheckCheck, RefreshCw, AlertCircle } from "lucide-react";
import { ChangeBadge } from "../common/ChangeBadge";
import { SeverityBadge } from "../common/SeverityBadge";

interface ChangeComparisonViewProps {
  currentFindings: Finding[];
  currentMedia: MediaFile[];
  previousAnalysis: any;
}

export const ChangeComparisonView: React.FC<ChangeComparisonViewProps> = ({
  currentFindings,
  currentMedia,
  previousAnalysis,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<"side_by_side" | "table">("side_by_side");

  if (!previousAnalysis) {
    return (
      <div className="field-panel p-8 text-center bg-slate-900/60">
        <GitCompare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-white">Baseline Inspection Established</h4>
        <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
          This is the first documented inspection for this asset ID. Subsequent re-inspections of this asset will automatically trigger side-by-side visual change comparison and deterioration progression tracking.
        </p>
      </div>
    );
  }

  // Count changes
  const counts = {
    worsened: currentFindings.filter((f) => f.change === "worsened").length,
    new: currentFindings.filter((f) => f.change === "new").length,
    unchanged: currentFindings.filter((f) => f.change === "unchanged").length,
    improved: currentFindings.filter((f) => f.change === "improved").length,
  };

  const prevMedia = previousAnalysis.media && previousAnalysis.media[0];
  const currMedia = currentMedia[0];

  return (
    <div className="field-panel p-6 space-y-6">
      {/* Header and KPI strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-white">
              Change-Aware Re-Inspection Intelligence
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking defect progression from Baseline (Inspection #{previousAnalysis.id.substring(0, 8)}) to Current Re-inspection.
          </p>
        </div>

        {/* Change Stats */}
        <div className="flex items-center gap-2 flex-wrap">
          {counts.worsened > 0 && (
            <span className="px-3 py-1 rounded-lg bg-red-950/80 border border-red-700/60 text-red-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{counts.worsened} Worsened</span>
            </span>
          )}
          {counts.new > 0 && (
            <span className="px-3 py-1 rounded-lg bg-amber-950/80 border border-amber-700/60 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{counts.new} New Defects</span>
            </span>
          )}
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono font-bold">
            {counts.unchanged} Unchanged
          </span>
        </div>
      </div>

      {/* Side-by-Side Visual View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous Baseline View */}
        <div className="field-panel p-4 bg-slate-950 border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Previous Inspection (Baseline)
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {new Date(previousAnalysis.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
            {prevMedia?.signed_url || prevMedia?.storage_path ? (
              <img
                src={prevMedia.signed_url || `/api/media?key=${encodeURIComponent(prevMedia.storage_path)}`}
                alt="Previous baseline"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-xs text-slate-600">Baseline photo on record</div>
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-400">
              BASELINE
            </div>
          </div>
        </div>

        {/* Current Re-Inspection View */}
        <div className="field-panel p-4 bg-slate-950 border-teal-500/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              Current Re-Inspection
            </span>
            <span className="text-[10px] font-mono text-teal-500 font-bold">
              LATEST AUDIT
            </span>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-teal-500/30 flex items-center justify-center">
            {currMedia?.signed_url ? (
              <img
                src={currMedia.signed_url}
                alt="Current re-inspection"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-xs text-slate-600">Current visual capture</div>
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-teal-950/80 border border-teal-700/60 text-[10px] font-mono text-teal-300 font-bold">
              RE-INSPECTION
            </div>
          </div>
        </div>
      </div>

      {/* Re-Inspection Progression Ledger Table */}
      <div>
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          Defect Progression Matrix
        </h4>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Finding Title</th>
                <th className="py-2.5 px-3">Current Severity</th>
                <th className="py-2.5 px-3">Progression Status</th>
                <th className="py-2.5 px-3">Visual Progression Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
              {currentFindings.map((f) => (
                <tr key={f.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white max-w-xs truncate">
                    {f.title}
                  </td>
                  <td className="py-3 px-3">
                    <SeverityBadge severity={f.severity} size="sm" />
                  </td>
                  <td className="py-3 px-3">
                    <ChangeBadge change={f.change} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-slate-300 max-w-md">
                    {f.change_note || f.evidence_observed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
