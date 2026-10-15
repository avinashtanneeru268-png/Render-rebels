import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface SeverityDonutProps {
  data: Record<string, number>;
}

export const SeverityDonut: React.FC<SeverityDonutProps> = ({ data }) => {
  const chartData = [
    { name: "Critical", value: data.critical || 0, color: "#ef4444" },
    { name: "High", value: data.high || 0, color: "#f97316" },
    { name: "Moderate", value: data.moderate || 0, color: "#eab308" },
    { name: "Low", value: data.low || 0, color: "#0ea5e9" },
    { name: "Informational", value: data.informational || 0, color: "#64748b" },
  ].filter((d) => d.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-500">
        No defect data recorded
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#0b0f17" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#121824",
              borderColor: "#1f293d",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#f8fafc",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
