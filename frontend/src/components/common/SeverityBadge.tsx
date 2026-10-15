import React from "react";
import { Severity } from "@sitesentinel/shared";
import { AlertOctagon, AlertTriangle, AlertCircle, Info, ShieldCheck } from "lucide-react";

interface SeverityBadgeProps {
  severity: Severity;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = "md",
  showIcon = true,
}) => {
  const configs: Record<
    Severity,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    critical: {
      label: "Critical",
      bg: "bg-red-950/80",
      text: "text-red-400",
      border: "border-red-600/60",
      icon: <AlertOctagon className="w-3.5 h-3.5 text-red-400" />,
    },
    high: {
      label: "High",
      bg: "bg-orange-950/80",
      text: "text-orange-400",
      border: "border-orange-600/60",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />,
    },
    moderate: {
      label: "Moderate",
      bg: "bg-amber-950/80",
      text: "text-amber-400",
      border: "border-amber-600/60",
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />,
    },
    low: {
      label: "Low",
      bg: "bg-sky-950/80",
      text: "text-sky-400",
      border: "border-sky-600/60",
      icon: <Info className="w-3.5 h-3.5 text-sky-400" />,
    },
    informational: {
      label: "Info",
      bg: "bg-slate-900/80",
      text: "text-slate-400",
      border: "border-slate-700/60",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />,
    },
  };

  const conf = configs[severity] || configs.informational;
  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5"
      : size === "lg"
      ? "text-sm px-3.5 py-1.5 font-semibold"
      : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium uppercase tracking-wider ${conf.bg} ${conf.text} ${conf.border} ${sizeClasses}`}
      title={`Severity triage: ${conf.label}`}
    >
      {showIcon && conf.icon}
      <span>{conf.label}</span>
    </span>
  );
};
