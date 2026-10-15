import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import {
  History,
  Search,
  Filter,
  Trash2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { SeverityBadge } from "../components/common/SeverityBadge";

export const HistoryPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [severity, setSeverity] = useState<string>("");
  const [sort, setSort] = useState<"created_desc" | "created_asc" | "priority_desc">("created_desc");

  const { data, isLoading } = useQuery({
    queryKey: ["analysesHistory", page, q, severity, sort],
    queryFn: () =>
      api.getAnalyses({
        page,
        pageSize: 10,
        q: q.trim() || undefined,
        severity: (severity as any) || undefined,
        sort,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteAnalysis(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analysesHistory"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this inspection record and its media?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <History className="w-6 h-6 text-teal-400" />
            <span>Inspection Audit History</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, and review all processed visual inspection records across your facility fleet.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="field-panel p-4 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search by asset code, location, or notes..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <select
            value={severity}
            onChange={(e) => {
              setSeverity(e.target.value);
              setPage(1);
            }}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="created_desc">Newest First</option>
            <option value="created_asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="field-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Asset Code</th>
                <th className="py-3 px-4">Inspection Type</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Findings</th>
                <th className="py-3 px-4">Inspection Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading records...
                  </td>
                </tr>
              ) : data?.items?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No inspection records found.
                  </td>
                </tr>
              ) : (
                data?.items?.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-400">
                      {item.asset_code || item.asset_id}
                    </td>
                    <td className="py-3.5 px-4 capitalize text-slate-300">
                      {item.inspection_type}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                        {item.overall_condition || "Completed"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {item.findings?.length || 0} defects
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/results/${item.id}`}
                          className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 font-semibold mr-2"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {data && data.totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing {data.items.length} of {data.total} inspections
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="p-1.5 rounded bg-slate-800 disabled:opacity-40 text-slate-300 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-slate-200">
                Page {page} of {data.totalPages}
              </span>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, data.totalPages))}
                className="p-1.5 rounded bg-slate-800 disabled:opacity-40 text-slate-300 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
