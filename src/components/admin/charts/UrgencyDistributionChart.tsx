"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { IRescueRequest } from "@/types";

interface UrgencyDistributionChartProps {
  rescueRequests: IRescueRequest[];
  title?: string;
  subtitle?: string;
}

const URGENCY_CONFIG: Record<
  string,
  { label: string; color: string; badge: string }
> = {
  CRITICAL: {
    label: "Critical (Life-Threatening)",
    color: "#ef4444",
    badge: "bg-red-50 text-red-700 border-red-200",
  },
  HIGH: {
    label: "High Priority",
    color: "#f97316",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
  },
  MEDIUM: {
    label: "Medium Priority",
    color: "#eab308",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  LOW: {
    label: "Low Priority",
    color: "#10b981",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

export function UrgencyDistributionChart({
  rescueRequests,
  title = "Urgency Level Breakdown",
  subtitle = "Emergency severity classification for active and logged appeals",
}: UrgencyDistributionChartProps) {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    };

    for (const r of rescueRequests) {
      const u = (r.urgency || "MEDIUM").toUpperCase();
      if (counts[u] !== undefined) {
        counts[u] += 1;
      } else {
        counts.MEDIUM += 1;
      }
    }

    const total = rescueRequests.length || 1;

    return (["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map((level) => ({
      key: level,
      name: URGENCY_CONFIG[level]?.label || level,
      value: counts[level],
      percentage: Math.round((counts[level] / total) * 100),
      color: URGENCY_CONFIG[level]?.color || "#64748b",
      badge: URGENCY_CONFIG[level]?.badge || "",
    }));
  }, [rescueRequests]);

  const totalRequests = rescueRequests.length;
  const criticalCount = chartData.find((d) => d.key === "CRITICAL")?.value || 0;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 sm:text-base">
            {title}
          </h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        {criticalCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200/70">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
            {criticalCount} Critical SOS
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-12 flex-1">
        <div className="relative h-56 w-full sm:col-span-6 sm:h-60">
          {totalRequests === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-xs text-slate-400">No rescue calls logged.</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-lg">
                            <p className="text-xs font-semibold text-slate-700">
                              {data.name}
                            </p>
                            <p className="text-sm font-bold text-slate-900">
                              {data.value} cases ({data.percentage}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry) => (
                      <Cell
                        key={`pie-urgency-${entry.key}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900">
                  {totalRequests}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total SOS
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col justify-center gap-2 sm:col-span-6">
          {chartData.map((d) => (
            <div
              key={d.key}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2 text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="truncate font-medium text-slate-700">
                  {d.key}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-slate-900">{d.value}</span>
                <span className="text-[11px] font-medium text-slate-400">
                  ({d.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
