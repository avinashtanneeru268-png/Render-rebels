import React, { useState } from "react";
import { Finding } from "@sitesentinel/shared";
import { SeverityBadge } from "../common/SeverityBadge";
import { ChangeBadge } from "../common/ChangeBadge";
import { CheckCircle2, AlertOctagon, Filter } from "lucide-react";

interface FindingsListProps {
  findings: Finding[];
  selectedFindingId: string | null;
  onSelectFinding: (id: string) => void;
  onHoverFinding: (id: string | null) => void;
}

export const FindingsList: React.FC<FindingsListProps> = ({
  findings,
  selectedFindingId,
  onSelectFinding,
  onHoverFinding,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const filtered = findings.filter((f) => {
    if (filterSeverity !== "all" && f.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="field-panel p-4 flex flex-col h-[540px]">
      {/* Header and Filter */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-teal-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Findings Ledger ({findings.length})
          </h3>
        </div>

        {/* Severity Filter */}
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="moderate">Moderate</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No findings match the current filter criteria.
          </div>
        ) : (
          filtered.map((f, idx) => {
            const isSelected = selectedFindingId === f.id;
            return (
              <div
                key={f.id}
                onClick={() => onSelectFinding(f.id)}
                onMouseEnter={() => onHoverFinding(f.id)}
                onMouseLeave={() => onHoverFinding(null)}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  isSelected
                    ? "bg-teal-950/40 border-teal-500 shadow-md ring-1 ring-teal-500/50"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{idx + 1}
                    </span>
                    <SeverityBadge severity={f.severity} size="sm" />
                    {f.change && f.change !== "not_compared" && (
                      <ChangeBadge change={f.change} size="sm" />
                    )}
                  </div>
                  <span className="font-mono text-xs font-bold text-white px-1.5 py-0.5 rounded bg-slate-800">
                    {f.priority_score}p
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-white line-clamp-1">{f.title}</h4>
                <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                  {f.evidence_observed}
                </p>

                {/* Review status indicator */}
                <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                  <span className="font-mono text-slate-500 capitalize">
                    {f.category.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`font-mono font-semibold ${
                      f.review === "confirmed"
                        ? "text-emerald-400"
                        : f.review === "rejected"
                        ? "text-red-400"
                        : f.review === "corrected"
                        ? "text-amber-400"
                        : "text-slate-500"
                    }`}
                  >
                    ● {f.review}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
