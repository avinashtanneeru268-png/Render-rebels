import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendColor?: string;
  accentColor?: string;
  isSimulatedDemo?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendColor = "text-emerald-400",
  accentColor = "border-slate-800",
  isSimulatedDemo = false,
}) => {
  return (
    <div className={`field-panel p-5 relative overflow-hidden transition-all hover:border-slate-700 ${accentColor}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">{value}</span>
            {trend && <span className={`text-xs font-medium ${trendColor}`}>{trend}</span>}
          </div>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        {icon && (
          <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
            {icon}
          </div>
        )}
      </div>
      {isSimulatedDemo && (
        <div className="mt-3 pt-2 border-t border-slate-800/60">
          <span className="text-[10px] text-amber-400/80 font-mono tracking-wide">
            [Demo benchmark data]
          </span>
        </div>
      )}
    </div>
  );
};
