import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { MetricCard } from "../components/common/MetricCard";
import { SeverityDonut } from "../components/dashboard/SeverityDonut";
import { CategoryBar } from "../components/dashboard/CategoryBar";
import { ConsistencyGauge } from "../components/dashboard/ConsistencyGauge";
import { UnresolvedQueue } from "../components/dashboard/UnresolvedQueue";
import {
  LayoutDashboard,
  Scan,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Clock,
  ArrowRight,
  GitCompare,
} from "lucide-react";
import { SeverityBadge } from "../components/common/SeverityBadge";

export const DashboardPage: React.FC = () => {
  const { data: summary, isLoading, error } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: api.getDashboardSummary,
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-900 rounded-xl border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="field-panel p-8 text-center text-red-400">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
        <p className="text-sm font-semibold">Failed to load operational dashboard summary.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <LayoutDashboard className="w-6 h-6 text-teal-400" />
            <span>Operational Inspection Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time fleet telemetry, defect triage distribution, and certified inspector consistency.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all flex-shrink-0"
        >
          <Scan className="w-4 h-4" />
          <span>New Asset Inspection</span>
        </Link>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Inspections"
          value={summary.totalAnalyses}
          subtitle="Processed asset audits"
          icon={<FileCheck className="w-5 h-5 text-teal-400" />}
        />
        <MetricCard
          title="Unresolved High-Risk"
          value={summary.unresolvedHighPriorityCount}
          subtitle="Pending inspector confirmation"
          icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
          accentColor={summary.unresolvedHighPriorityCount > 0 ? "border-red-900/60 bg-red-950/10" : ""}
          trendColor="text-red-400"
        />
        <MetricCard
          title="Median Triage Latency"
          value={`${(summary.medianProcessingMs / 1000).toFixed(1)}s`}
          subtitle="Upload to structured results"
          icon={<Clock className="w-5 h-5 text-cyan-400" />}
        />
        <MetricCard
          title="Consistency Score"
          value={`${summary.consistencyMetrics.consistencyScorePercent}%`}
          subtitle="Agreement & reliability"
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          trend="+94% calibrated"
        />
      </div>

      {/* Re-Inspection Progression Strip */}
      <div className="field-panel p-4 flex flex-wrap items-center justify-between gap-4 bg-slate-900/40">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <GitCompare className="w-4 h-4 text-teal-400" />
          <span>Re-Inspection Progression Tracking:</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono flex-wrap">
          <span className="px-2.5 py-1 rounded bg-red-950/70 border border-red-700/60 text-red-300 font-bold">
            {summary.changesCount.worsened} Worsened
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-950/70 border border-amber-700/60 text-amber-300 font-bold">
            {summary.changesCount.new} New Defects
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
            {summary.changesCount.unchanged} Unchanged
          </span>
          <span className="px-2.5 py-1 rounded bg-teal-950/70 border border-teal-700/60 text-teal-300">
            {summary.changesCount.improved} Improved
          </span>
        </div>
      </div>

      {/* Charts & Consistency Metric Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Severity Donut Chart */}
        <div className="field-panel p-6">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Defect Severity Breakdown
          </h3>
          <SeverityDonut data={summary.findingsBySeverity} />
        </div>

        {/* Category Bar Chart */}
        <div className="field-panel p-6">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Top Anomaly Categories
          </h3>
          <CategoryBar data={summary.findingsByCategory} />
        </div>

        {/* Consistency & Agreement Gauge */}
        <ConsistencyGauge
          metrics={summary.consistencyMetrics}
          agreementRatePercent={summary.agreementRatePercent}
        />
      </div>

      {/* Unresolved Queue */}
      <UnresolvedQueue queue={summary.unresolvedHighPriorityQueue} />

      {/* Recent Inspections Table */}
      <div className="field-panel p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Recent Inspection Audits
          </h3>
          <Link
            to="/history"
            className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-semibold"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Asset Code</th>
                <th className="py-2.5 px-3">Protocol</th>
                <th className="py-2.5 px-3">Condition</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {summary.recentAnalyses.map((an: any) => (
                <tr key={an.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-teal-400">
                    {an.asset_code || an.asset_id}
                  </td>
                  <td className="py-3 px-3 capitalize text-slate-300">
                    {an.inspection_type}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                      {an.overall_condition || "N/A"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono">
                    {new Date(an.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/results/${an.id}`}
                      className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 font-semibold"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
