import React from "react";
import { Finding } from "@sitesentinel/shared";

interface OverlayLayerProps {
  findings: Finding[];
  selectedFindingId: string | null;
  onSelectFinding: (id: string) => void;
  hoveredFindingId: string | null;
}

export const OverlayLayer: React.FC<OverlayLayerProps> = ({
  findings,
  selectedFindingId,
  onSelectFinding,
  hoveredFindingId,
}) => {
  const severityColors: Record<string, { border: string; bg: string; text: string }> = {
    critical: {
      border: "border-red-500",
      bg: "bg-red-500/20",
      text: "bg-red-950 text-red-300 border-red-500",
    },
    high: {
      border: "border-orange-500",
      bg: "bg-orange-500/20",
      text: "bg-orange-950 text-orange-300 border-orange-500",
    },
    moderate: {
      border: "border-amber-400",
      bg: "bg-amber-400/20",
      text: "bg-amber-950 text-amber-300 border-amber-400",
    },
    low: {
      border: "border-sky-400",
      bg: "bg-sky-400/20",
      text: "bg-sky-950 text-sky-300 border-sky-400",
    },
    informational: {
      border: "border-slate-400",
      bg: "bg-slate-400/20",
      text: "bg-slate-950 text-slate-300 border-slate-400",
    },
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {findings.map((f, idx) => {
        if (!f.approx_region) return null;
        const { x, y, w, h } = f.approx_region;
        const isSelected = selectedFindingId === f.id;
        const isHovered = hoveredFindingId === f.id;
        const colors = severityColors[f.severity] || severityColors.moderate;

        const left = `${x * 100}%`;
        const top = `${y * 100}%`;
        const width = `${w * 100}%`;
        const height = `${h * 100}%`;

        const isVerified = f.region_source === "detector_verified";
        const labelText = isVerified
          ? `#${idx + 1} Detector-verified`
          : `#${idx + 1} Approximate region (AI-estimated)`;

        return (
          <div
            key={f.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectFinding(f.id);
            }}
            style={{ left, top, width, height }}
            className={`absolute border-2 pointer-events-auto cursor-pointer transition-all ${
              colors.border
            } ${
              isSelected
                ? `${colors.bg} ring-2 ring-white scale-[1.01] z-20`
                : isHovered
                ? `${colors.bg} ring-1 ring-white/60 z-10`
                : "bg-transparent hover:bg-white/10"
            }`}
          >
            {/* Tag Badge */}
            <div
              className={`absolute -top-6 left-0 px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap border shadow-md flex items-center gap-1 ${colors.text}`}
            >
              <span className="font-bold">{labelText}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
