import React from "react";
import { CertaintyLevel } from "@sitesentinel/shared";
import { Gauge, HelpCircle } from "lucide-react";

interface CertaintyIndicatorProps {
  certainty: CertaintyLevel;
  confidenceScore?: number | null;
}

export const CertaintyIndicator: React.FC<CertaintyIndicatorProps> = ({
  certainty,
  confidenceScore,
}) => {
  // If specialized detector output real numeric confidence
  if (typeof confidenceScore === "number" && !isNaN(confidenceScore)) {
    const percent = Math.round(confidenceScore * 100);
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-mono">
        <Gauge className="w-3 h-3 text-emerald-400" />
        <span>{percent}%</span>
        <span className="text-[10px] text-emerald-500 font-sans">(Detector-calibrated)</span>
      </div>
    );
  }

  // Qualitative self-assessed certainty
  const configs: Record<CertaintyLevel, { color: string; label: string; dot: string }> = {
    high: { color: "text-emerald-400", label: "High certainty", dot: "bg-emerald-400" },
    medium: { color: "text-amber-400", label: "Medium certainty", dot: "bg-amber-400" },
    low: { color: "text-red-400", label: "Low certainty (Review required)", dot: "bg-red-400 animate-pulse" },
  };

  const conf = configs[certainty] || configs.medium;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs text-slate-300"
      title="Qualitative certainty self-assessed by vision-language model, not calibrated probability"
    >
      <span className={`w-2 h-2 rounded-full ${conf.dot}`} />
      <span className={conf.color}>{conf.label}</span>
      <span className="text-[10px] text-slate-500 hover:text-slate-300 cursor-help" title="Model qualitative self-assessment (uncalibrated)">
        <HelpCircle className="w-3 h-3" />
      </span>
    </div>
  );
};
