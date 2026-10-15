import React from "react";
import { ChangeStatus } from "@sitesentinel/shared";
import { TrendingUp, PlusCircle, CheckCircle2, MinusCircle, CheckCheck, HelpCircle } from "lucide-react";

interface ChangeBadgeProps {
  change: ChangeStatus;
  size?: "sm" | "md";
}

export const ChangeBadge: React.FC<ChangeBadgeProps> = ({ change, size = "md" }) => {
  const configs: Record<
    ChangeStatus,
    { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
  > = {
    worsened: {
      label: "Worsened",
      icon: <TrendingUp className="w-3.5 h-3.5 text-red-400" />,
      bg: "bg-red-950/80",
      text: "text-red-300",
      border: "border-red-600/70",
    },
    new: {
      label: "New Defect",
      icon: <PlusCircle className="w-3.5 h-3.5 text-amber-400" />,
      bg: "bg-amber-950/80",
      text: "text-amber-300",
      border: "border-amber-600/70",
    },
    unchanged: {
      label: "Unchanged",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />,
      bg: "bg-slate-900",
      text: "text-slate-300",
      border: "border-slate-700",
    },
    improved: {
      label: "Improved",
      icon: <MinusCircle className="w-3.5 h-3.5 text-teal-400" />,
      bg: "bg-teal-950/80",
      text: "text-teal-300",
      border: "border-teal-600/70",
    },
    resolved: {
      label: "Resolved",
      icon: <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />,
      bg: "bg-emerald-950/80",
      text: "text-emerald-300",
      border: "border-emerald-600/70",
    },
    not_compared: {
      label: "Baseline",
      icon: <HelpCircle className="w-3.5 h-3.5 text-slate-400" />,
      bg: "bg-slate-900/60",
      text: "text-slate-400",
      border: "border-slate-800",
    },
  };

  const conf = configs[change] || configs.not_compared;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${conf.bg} ${conf.text} ${conf.border} ${sizeClasses}`}
      title={`Re-inspection progression: ${conf.label}`}
    >
      {conf.icon}
      <span>{conf.label}</span>
    </span>
  );
};
