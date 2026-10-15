import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import {
  FolderKanban,
  ArrowLeft,
  ArrowRight,
  Scan,
  Clock,
  Layers,
  GitCompare,
  AlertTriangle,
} from "lucide-react";
import { SeverityBadge } from "../components/common/SeverityBadge";

export const AssetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["assetDetail", id],
    queryFn: () => api.getAssetById(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-64" />
        <div className="h-44 bg-slate-900 rounded-xl" />
        <div className="h-72 bg-slate-900 rounded-xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="field-panel p-12 text-center text-red-400">
        <AlertTriangle className="w-10 h-10 mx-auto mb-2" />
        <p className="text-sm font-semibold">Asset #{id} not found.</p>
        <Link to="/assets" className="mt-4 inline-block text-xs text-teal-400">
          Return to Assets Directory
        </Link>
      </div>
    );
  }

  const { asset, timeline } = data;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <Link
          to="/assets"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Assets</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-base font-bold text-teal-400 bg-slate-800 px-2.5 py-0.5 rounded">
                {asset.asset_code}
              </span>
              <h1 className="text-2xl font-black text-white">{asset.name || asset.asset_code}</h1>
            </div>
            <p className="text-xs text-slate-400 capitalize mt-1">
              {asset.asset_type.replace(/_/g, " ")} • {asset.criticality} Criticality
            </p>
          </div>

          <Link
            to={`/analyze?asset_id=${asset.asset_code}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all flex-shrink-0"
          >
            <Scan className="w-4 h-4" />
            <span>Re-Inspect This Asset</span>
          </Link>
        </div>
      </div>

      {/* Asset Timeline */}
      <div className="field-panel p-6">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-400" />
          <span>Longitudinal Inspection Timeline ({timeline.length} audits)</span>
        </h3>

        {timeline.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No inspection cycles recorded yet for this asset.
          </div>
        ) : (
          <div className="relative pl-6 border-l-2 border-slate-800 space-y-8">
            {timeline.map((item, idx) => (
              <div key={item.id} className="relative group">
                {/* Timeline Node Icon */}
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-teal-500 group-hover:scale-125 transition-transform" />

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-white">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                        {item.inspection_type}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold text-teal-300 bg-teal-950/80 border border-teal-800">
                        {item.overall_condition || "Completed"}
                      </span>
                      {item.previous_analysis_id && (
                        <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                          <GitCompare className="w-3 h-3" />
                          <span>Re-inspection</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 max-w-xl">
                      {item.summary || "Inspection audit completed successfully."}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Findings documented: {item.findings?.length || 0} defects
                    </p>
                  </div>

                  <Link
                    to={`/results/${item.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex-shrink-0"
                  >
                    <span>View Inspection</span>
                    <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
