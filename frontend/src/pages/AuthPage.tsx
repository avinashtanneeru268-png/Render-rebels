import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { Shield, ArrowRight, UserCheck } from "lucide-react";

export const AuthPage: React.FC = () => {
  const { data: health } = useQuery({
    queryKey: ["health"],
    queryFn: api.getHealth,
  });

  const isLocalMode = health?.mode === "local";

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="field-panel p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 mx-auto shadow-inner">
          <UserCheck className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-white">Inspector Authentication</h2>

        {isLocalMode ? (
          <div className="space-y-4 text-xs text-slate-300">
            <p>
              SiteSentinel is currently operating in <span className="text-teal-400 font-bold font-mono">Zero-Config Local Mode</span>.
            </p>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-left font-mono text-[11px] space-y-1">
              <p><span className="text-slate-500">User:</span> Lead Field Inspector</p>
              <p><span className="text-slate-500">Role:</span> Certified Level III Asset Auditor</p>
              <p><span className="text-slate-500">Session:</span> Auto-Authenticated</p>
            </div>
            <Link
              to="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition-all"
            >
              <span>Continue to Operational Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4 text-xs text-slate-400">
            <p>Supabase Authentication Mode</p>
            <input
              type="email"
              placeholder="inspector@company.com"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white"
            />
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white"
            />
            <button className="w-full py-2.5 rounded-xl bg-teal-600 text-white font-bold">
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
