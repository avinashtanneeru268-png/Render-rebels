import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

interface CategoryBarProps {
  data: Record<string, number>;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({ data }) => {
  const chartData = Object.entries(data)
    .map(([cat, count]) => ({
      category: cat.replace(/_/g, " "),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-500">
        No category data available
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={chartData} margin={{ top: 10, right: 20, left: 40, bottom: 5 }}>
          <XAxis type="number" stroke="#64748b" fontSize={11} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="category"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#121824",
              borderColor: "#1f293d",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#f8fafc",
            }}
          />
          <Bar dataKey="count" fill="#14b8a6" radius={[0, 4, 4, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? "#14b8a6" : "#0d9488"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
