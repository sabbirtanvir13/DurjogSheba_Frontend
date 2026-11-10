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
import type { IAdminTopAffectedLocation, IRescueRequest } from "@/types";

interface TopLocationsChartProps {
  topAffectedLocations?: IAdminTopAffectedLocation[];
  rescueRequests?: IRescueRequest[];
  title?: string;
  subtitle?: string;
}

const BAR_COLORS = [
  "#ef4444", // Red - highest
  "#f97316", // Orange
  "#f59e0b", // Amber
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#8b5cf6", // Purple
];

export function TopLocationsChart({
  topAffectedLocations,
  rescueRequests,
  title = "Disaster Hotspots (Top Affected Locations)",
  subtitle = "Regions with the highest density of emergency rescue distress signals",
}: TopLocationsChartProps) {
  const chartData = useMemo(() => {
    if (topAffectedLocations && topAffectedLocations.length > 0) {
      return topAffectedLocations.map((item, index) => ({
        location: item.location || "Unknown",
        count: item._count?.id || 0,
        color: BAR_COLORS[index % BAR_COLORS.length],
      }));
    }

    if (rescueRequests && rescueRequests.length > 0) {
      const locMap = new Map<string, number>();
      for (const r of rescueRequests) {
        const loc = r.location?.trim() || "Unknown";
        locMap.set(loc, (locMap.get(loc) || 0) + 1);
      }
      return Array.from(locMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([location, count], index) => ({
          location,
          count,
          color: BAR_COLORS[index % BAR_COLORS.length],
        }));
    }

    return [];
  }, [topAffectedLocations, rescueRequests]);

  const maxCount = useMemo(() => {
    return chartData.reduce((max, d) => Math.max(max, d.count), 0);
  }, [chartData]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 sm:text-base">
            {title}
          </h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <span className="text-[11px] font-semibold text-slate-500">
          Ranked by Call Volume
        </span>
      </div>

      <div className="h-64 w-full sm:h-72">
        {chartData.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-xs text-slate-400">
              No geographical incident hotspots recorded yet.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#f1f5f9"
              />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                domain={[0, Math.max(maxCount + 2, 5)]}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="location"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#334155", fontSize: 11, fontWeight: 500 }}
                width={90}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-lg">
                        <p className="text-xs font-semibold text-slate-500">
                          Hotspot
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-slate-900">
                          {data.location}
                        </p>
                        <p className="text-xs font-medium text-red-600 mt-1">
                          {data.count} emergency distress calls
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {chartData.map((entry) => (
                  <Cell key={`loc-cell-${entry.location}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
