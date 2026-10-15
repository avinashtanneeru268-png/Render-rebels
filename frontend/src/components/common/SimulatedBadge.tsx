import React from "react";
import { Sparkles } from "lucide-react";

export const SimulatedBadge: React.FC<{ size?: "sm" | "md" }> = ({ size = "md" }) => {
  const classes =
    size === "sm"
      ? "text-[10px] px-2 py-0.5"
      : "text-xs px-2.5 py-1 font-semibold";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 uppercase tracking-wider ${classes}`}
      title="Simulated demo result bundled for offline judging without live camera or API dependencies"
    >
      <Sparkles className="w-3 h-3 text-amber-400" />
      <span>Simulated Demo Result</span>
    </span>
  );
};
