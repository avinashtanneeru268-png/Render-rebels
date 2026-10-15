import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { FileText, Download, Code, ExternalLink, ArrowRight } from "lucide-react";

export const ReportsPage: React.FC = () => {
  const { data: analyses, isLoading } = useQuery({
    queryKey: ["reportsList"],
    queryFn: () => api.getAnalyses({ pageSize: 50, sort: "created_desc" }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <FileText className="w-6 h-6 text-teal-400" />
          <span>Work-Order-Ready Inspection Reports</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Export certified visual inspection records as server-generated PDFs with observed evidence, inspector sign-off blocks, and JSON structured payloads.
        </p>
      </div>

      <div className="field-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Asset Code</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Inspection Date</th>
                <th className="py-3 px-4">Findings Documented</th>
                <th className="py-3 px-4 text-right">Export Formats</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Loading reports...
                  </td>
                </tr>
              ) : analyses?.items?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No inspection reports generated yet.
                  </td>
                </tr>
              ) : (
                analyses?.items?.map((an) => (
                  <tr key={an.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-400">
                      {an.asset_code || an.asset_id}
                    </td>
                    <td className="py-3.5 px-4 capitalize text-slate-300">
                      {an.asset_type?.replace(/_/g, " ") || "Structural"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {new Date(an.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {an.findings?.length || 0} localized defects
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <a
                          href={api.getReportPdfUrl(an.id)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white shadow-sm transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF Report</span>
                        </a>

                        <a
                          href={api.getReportJsonUrl(an.id)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 transition-all"
                        >
                          <Code className="w-3.5 h-3.5" />
                          <span>JSON</span>
                        </a>

                        <Link
                          to={`/results/${an.id}`}
                          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 ml-1"
                          title="View In Inspector"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
