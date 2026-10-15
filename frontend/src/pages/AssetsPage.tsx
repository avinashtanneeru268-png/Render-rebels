import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { FolderKanban, ArrowRight, Shield, Clock, Layers, Plus } from "lucide-react";

export const AssetsPage: React.FC = () => {
  const { data: assets, isLoading, error } = useQuery({
    queryKey: ["assets"],
    queryFn: api.getAssets,
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-slate-900 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-teal-400" />
            <span>Asset Registry & Inspection Timelines</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse registered infrastructure assets to inspect longitudinal degradation histories and change-aware re-inspections.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add / Inspect Asset</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets?.map((asset) => (
          <div
            key={asset.id}
            className="field-panel p-5 flex flex-col justify-between hover:border-teal-500/50 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-teal-400 bg-slate-800 px-2 py-0.5 rounded">
                  {asset.asset_code}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                    asset.criticality === "high"
                      ? "bg-red-950/80 text-red-300 border border-red-800"
                      : asset.criticality === "medium"
                      ? "bg-amber-950/80 text-amber-300 border border-amber-800"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {asset.criticality} criticality
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                {asset.name || asset.asset_code}
              </h3>
              <p className="text-xs text-slate-400 capitalize mt-0.5">
                {asset.asset_type.replace(/_/g, " ")}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">
                    Inspections
                  </span>
                  <span className="font-mono font-bold text-slate-200">
                    {asset.inspection_count} cycles
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">
                    Condition
                  </span>
                  <span className="font-mono font-bold text-slate-200 uppercase">
                    {asset.latest_condition || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">
                Latest: {asset.latest_inspection_at ? new Date(asset.latest_inspection_at).toLocaleDateString() : "Never"}
              </span>
              <Link
                to={`/assets/${asset.id}`}
                className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-semibold"
              >
                <span>View Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
