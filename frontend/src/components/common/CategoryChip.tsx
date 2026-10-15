import React from "react";
import { FindingCategory } from "@sitesentinel/shared";
import {
  Activity,
  Flame,
  Droplet,
  Layers,
  Maximize2,
  Wrench,
  Trees,
  Paintbrush,
  Zap,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

interface CategoryChipProps {
  category: FindingCategory;
  size?: "sm" | "md";
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ category, size = "md" }) => {
  const configs: Record<
    FindingCategory,
    { label: string; icon: React.ReactNode; bg: string; text: string }
  > = {
    crack: {
      label: "Crack",
      icon: <Activity className="w-3.5 h-3.5" />,
      bg: "bg-purple-950/40 border-purple-800/50",
      text: "text-purple-300",
    },
    corrosion_rust: {
      label: "Corrosion / Rust",
      icon: <Flame className="w-3.5 h-3.5" />,
      bg: "bg-amber-950/40 border-amber-800/50",
      text: "text-amber-300",
    },
    water_damage_leak: {
      label: "Water Leak / Moisture",
      icon: <Droplet className="w-3.5 h-3.5" />,
      bg: "bg-blue-950/40 border-blue-800/50",
      text: "text-blue-300",
    },
    spalling_delamination: {
      label: "Spalling / Delamination",
      icon: <Layers className="w-3.5 h-3.5" />,
      bg: "bg-orange-950/40 border-orange-800/50",
      text: "text-orange-300",
    },
    deformation_misalignment: {
      label: "Deformation / Deflection",
      icon: <Maximize2 className="w-3.5 h-3.5" />,
      bg: "bg-rose-950/40 border-rose-800/50",
      text: "text-rose-300",
    },
    missing_or_damaged_component: {
      label: "Missing / Damaged Hardware",
      icon: <Wrench className="w-3.5 h-3.5" />,
      bg: "bg-yellow-950/40 border-yellow-800/50",
      text: "text-yellow-300",
    },
    vegetation_or_debris: {
      label: "Vegetation / Debris",
      icon: <Trees className="w-3.5 h-3.5" />,
      bg: "bg-emerald-950/40 border-emerald-800/50",
      text: "text-emerald-300",
    },
    coating_paint_failure: {
      label: "Coating Failure",
      icon: <Paintbrush className="w-3.5 h-3.5" />,
      bg: "bg-teal-950/40 border-teal-800/50",
      text: "text-teal-300",
    },
    thermal_or_discoloration_anomaly: {
      label: "Thermal / Discoloration",
      icon: <Zap className="w-3.5 h-3.5" />,
      bg: "bg-amber-950/40 border-amber-800/50",
      text: "text-amber-300",
    },
    safety_hazard: {
      label: "Safety Hazard",
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      bg: "bg-red-950/50 border-red-700/60",
      text: "text-red-300 font-semibold",
    },
    other: {
      label: "Other Defect",
      icon: <HelpCircle className="w-3.5 h-3.5" />,
      bg: "bg-slate-900 border-slate-700",
      text: "text-slate-300",
    },
  };

  const conf = configs[category] || configs.other;
  const padding = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${conf.bg} ${conf.text} ${padding}`}
    >
      {conf.icon}
      <span>{conf.label}</span>
    </span>
  );
};
