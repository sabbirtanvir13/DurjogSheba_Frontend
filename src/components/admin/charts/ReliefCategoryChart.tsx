"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { IReliefNeed } from "@/types";

interface ReliefCategoryChartProps {
  reliefNeeds: IReliefNeed[];
  title?: string;
  subtitle?: string;
}

export function ReliefCategoryChart({
  reliefNeeds,
  title = "Relief Supplies Demand & Fulfillment",
  subtitle = "Comparative volume of requested humanitarian goods vs fulfilled deliveries",
}: ReliefCategoryChartProps) {
  const chartData = useMemo(() => {
    if (reliefNeeds.length === 0) return [];

    const categoryMap = new Map<
      string,
      { requested: number; fulfilled: number; count: number }
    >();

    for (const item of reliefNeeds) {
      const cat = (item.itemCategory || "General Supplies").trim();
      const current = categoryMap.get(cat) || {
        requested: 0,
        fulfilled: 0,
        count: 0,
      };

      categoryMap.set(cat, {
        requested: current.requested + Number(item.quantity || 0),
        fulfilled: current.fulfilled + Number(item.fulfilled || 0),
        count: current.count + 1,
      });
    }

    return Array.from(categoryMap.entries()).map(([category, val]) => {
      const fulfillmentPct =
        val.requested > 0
          ? Math.min(100, Math.round((val.fulfilled / val.requested) * 100))
          : 0;
      return {
        category,
        requested: val.requested,
        fulfilled: val.fulfilled,
        remaining: Math.max(0, val.requested - val.fulfilled),
        fulfillmentPct,
        appeals: val.count,
      };
    });
  }, [reliefNeeds]);

  const overallStats = useMemo(() => {
    const totalRequested = reliefNeeds.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0,
    );
    const totalFulfilled = reliefNeeds.reduce(
      (sum, item) => sum + Number(item.fulfilled || 0),
      0,
    );
    const overallRate =
      totalRequested > 0
        ? Math.min(100, Math.round((totalFulfilled / totalRequested) * 100))
        : 0;

    return { totalRequested, totalFulfilled, overallRate };
  }, [reliefNeeds]);

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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
            Fulfillment Rate: {overallStats.overallRate}%
          </span>
        </div>
      </div>

      <div className="h-64 w-full sm:h-72">
        {chartData.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-xs text-slate-400">
              No relief supply requests recorded yet.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="category"
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
                        <p className="text-xs font-bold text-slate-900">
                          {data.category}
                        </p>
                        <div className="mt-1.5 space-y-1 text-xs">
                          <p className="text-amber-600 font-medium">
                            Demanded: {Number(data.requested).toLocaleString()}{" "}
                            units
                          </p>
                          <p className="text-emerald-600 font-medium">
                            Supplied: {Number(data.fulfilled).toLocaleString()}{" "}
                            units ({data.fulfillmentPct}%)
                          </p>
                          <p className="text-slate-400 text-[11px]">
                            {data.appeals} total shelter requests
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 10, fontSize: 11 }}
              />
              <Bar
                name="Requested Units"
                dataKey="requested"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                name="Fulfilled Deliveries"
                dataKey="fulfilled"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

