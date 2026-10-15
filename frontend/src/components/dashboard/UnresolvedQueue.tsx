import React from "react";
import { Link } from "react-router-dom";
import { Finding } from "@sitesentinel/shared";
import { AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import { SeverityBadge } from "../common/SeverityBadge";
import { CategoryChip } from "../common/CategoryChip";

interface UnresolvedQueueProps {
  queue: Finding[];
}

export const UnresolvedQueue: React.FC<UnresolvedQueueProps> = ({ queue }) => {
  return (
    <div className="field-panel p-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Unresolved High-Priority Triage Queue
          </h3>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300 font-bold">
          {queue.length} Pending Actions
        </span>
      </div>

      {queue.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500">
          No critical or high severity defects currently pending human review.
        </div>
      ) : (
        <div className="space-y-3">
          {queue.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <SeverityBadge severity={item.severity} size="sm" />
                  <CategoryChip category={item.category} size="sm" />
                  <span className="text-xs font-mono text-slate-400">
                    Priority: <span className="font-bold text-white">{item.priority_score}p</span>
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                <p className="mt-1 text-xs text-slate-400 line-clamp-1">
                  {item.evidence_observed}
                </p>
              </div>

              <Link
                to={`/results/${item.analysis_id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex-shrink-0"
              >
                <span>Triage Finding</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
