"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { IRescueRequest } from "@/types";

interface RescueStatusChartProps {
  rescueRequests: IRescueRequest[];
  title?: string;
  subtitle?: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PENDING: { label: "Pending", color: "#f59e0b", bg: "#fef3c7" },
  ASSIGNED: { label: "Assigned", color: "#3b82f6", bg: "#dbeafe" },
  IN_PROGRESS: { label: "In Progress", color: "#8b5cf6", bg: "#ede9fe" },
  RESCUED: { label: "Rescued", color: "#10b981", bg: "#d1fae5" },
  CANCELLED: { label: "Cancelled", color: "#94a3b8", bg: "#f1f5f9" },
};

export function RescueStatusChart({
  rescueRequests,
  title = "Rescue Operations by Status",
  subtitle = "Breakdown of emergency rescue appeals across operational stages",
}: RescueStatusChartProps) {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {
      PENDING: 0,
      ASSIGNED: 0,
      IN_PROGRESS: 0,
      RESCUED: 0,
      CANCELLED: 0,
    };

    for (const req of rescueRequests) {
      const statusKey = req.status || "PENDING";
      if (counts[statusKey] !== undefined) {
        counts[statusKey] += 1;
      } else {
        counts[statusKey] = 1;
      }
    }

    const total = rescueRequests.length || 1;

    return Object.entries(counts).map(([key, count]) => ({
      key,
      name: STATUS_CONFIG[key]?.label || key,
      count,
      percentage: Math.round((count / total) * 100),
      color: STATUS_CONFIG[key]?.color || "#64748b",
    }));
  }, [rescueRequests]);

  const totalRescues = rescueRequests.length;
  const rescuedCount = chartData.find((d) => d.key === "RESCUED")?.count || 0;
  const successRate =
    totalRescues > 0 ? Math.round((rescuedCount / totalRescues) * 100) : 0;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 sm:text-base">
            {title}
          </h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className="mt-1 sm:mt-0 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200/60">
            Success Rate: {successRate}%
          </span>
        </div>
      </div>

      <div className="h-64 w-full sm:h-72">
        {totalRescues === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-xs text-slate-400">
              No rescue requests reported yet.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                        <p className="text-xs font-semibold text-slate-500">
                          {data.name}
                        </p>
                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {data.count} requests{" "}
                          <span className="text-xs font-normal text-slate-500">
                            ({data.percentage}%)
                          </span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.key}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend pills */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-100">
        {chartData.map((d) => (
          <div
            key={d.key}
            className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span>
              {d.name}: <strong>{d.count}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
