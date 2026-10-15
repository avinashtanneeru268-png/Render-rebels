import React, { useState } from "react";
import { Server, Sparkles, AlertCircle, X, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";

export const ModeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { data: health } = useQuery({
    queryKey: ["health"],
    queryFn: api.getHealth,
    staleTime: 30000,
  });

  if (dismissed) return null;

  const isLocalMode = health?.mode === "local";
  const isAiConfigured = health?.aiConfigured;

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-slate-300">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Mode Tag */}
        <div className="flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5 text-teal-400" />
          <span className="font-semibold text-slate-200">Mode:</span>
          <span className="px-2 py-0.5 rounded bg-teal-950/60 border border-teal-800/60 text-teal-300 font-mono">
            {isLocalMode ? "Zero-Config Local Mode" : "Supabase Cloud Mode"}
          </span>
        </div>

        {/* AI Engine Status */}
        <div className="flex items-center gap-1.5">
          {isAiConfigured ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Gemini 2.5 Vision Multimodal Active</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400 font-medium">
                Offline Demo Mode: 6 precomputed inspection cases ready
              </span>
              <span className="text-slate-500 hidden sm:inline">
                (Configure server environment key for live uploads)
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] text-slate-400 font-mono">
          Detector: {health?.activeDetector || "Gemini Vision"}
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-500 hover:text-slate-300 transition-colors"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
