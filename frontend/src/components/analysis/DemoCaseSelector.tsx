import React from "react";
import { Sparkles, ArrowRight, GitCompare, ShieldAlert } from "lucide-react";
import { SeverityBadge } from "../common/SeverityBadge";

interface DemoCaseItem {
  id: string;
  asset_code: string;
  asset_name: string;
  asset_type: string;
  asset_criticality: string;
  inspection_type: string;
  title: string;
  description: string;
  isPair?: boolean;
  pairRole?: string;
  findingsCount: number;
  overallCondition: string;
}

interface DemoCaseSelectorProps {
  cases: DemoCaseItem[];
  onSelectCase: (caseId: string) => void;
  isRunningId: string | null;
}

export const DemoCaseSelector: React.FC<DemoCaseSelectorProps> = ({
  cases,
  onSelectCase,
  isRunningId,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Select Bundled Inspection Case (Offline Demo Mode)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-world asset defect scenarios precomputed and validated for immediate testing without API keys or camera.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cases.map((c) => {
          const isSelected = isRunningId === c.id;
          return (
            <div
              key={c.id}
              className={`field-panel p-4 flex flex-col justify-between transition-all hover:border-teal-500/60 ${
                c.isPair ? "border-amber-500/40 bg-amber-950/10" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-teal-400 bg-slate-800 px-2 py-0.5 rounded">
                    {c.asset_code}
                  </span>
                  {c.isPair && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <GitCompare className="w-3 h-3" />
                      <span>{c.pairRole === "baseline" ? "Baseline Pair" : "Re-Inspection Pair"}</span>
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-semibold text-white line-clamp-1">{c.title}</h4>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">{c.description}</p>

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded capitalize">
                    {c.asset_type.replace(/_/g, " ")}
                  </span>
                  <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                    {c.findingsCount} findings
                  </span>
                  <span className="text-[11px] font-mono uppercase text-slate-400">
                    Cond: {c.overallCondition}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-400/80">Simulated Result</span>
                <button
                  type="button"
                  disabled={isSelected}
                  onClick={() => onSelectCase(c.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-xs font-semibold text-white transition-all shadow-md shadow-teal-900/30"
                >
                  <span>{isSelected ? "Loading..." : "Test Case"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
