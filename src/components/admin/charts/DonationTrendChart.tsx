"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { IDonation } from "@/types";

interface DonationTrendChartProps {
  donations: IDonation[];
  title?: string;
  subtitle?: string;
}

export function DonationTrendChart({
  donations,
  title = "Donation Inflow Trajectory",
  subtitle = "Chronological tracking of verified relief funds (BDT)",
}: DonationTrendChartProps) {
  const chartData = useMemo(() => {
    const completed = donations.filter((d) => d.status === "COMPLETED");

    if (completed.length === 0) {
      return [];
    }

    // Sort by createdAt ascending
    const sorted = [...completed].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    // Group by date (e.g. "DD MMM")
    const dateMap = new Map<string, { total: number; count: number }>();
    for (const d of sorted) {
      const dateKey = new Date(d.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const current = dateMap.get(dateKey) || { total: 0, count: 0 };
      dateMap.set(dateKey, {
        total: current.total + Number(d.amount || 0),
        count: current.count + 1,
      });
    }

    let runningTotal = 0;
    return Array.from(dateMap.entries()).map(([date, val]) => {
      runningTotal += val.total;
      return {
        date,
        dailyAmount: val.total,
        cumulativeAmount: runningTotal,
        contributions: val.count,
      };
    });
  }, [donations]);

  const totalCompletedAmount = useMemo(() => {
    return donations
      .filter((d) => d.status === "COMPLETED")
      .reduce((sum, d) => sum + Number(d.amount || 0), 0);
  }, [donations]);

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
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Total: ৳{totalCompletedAmount.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="h-64 w-full sm:h-72">
        {chartData.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-xs text-slate-400">
              No completed donations recorded yet.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="donationFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(val) => `৳${Number(val).toLocaleString()}`}
                width={70}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                        <p className="text-xs font-semibold text-slate-500">
                          {data.date}
                        </p>
                        <p className="mt-1 text-sm font-bold text-emerald-600">
                          ৳{Number(data.dailyAmount).toLocaleString()}{" "}
                          <span className="text-xs font-normal text-slate-500">
                            ({data.contributions} donors)
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Cumulative: ৳
                          {Number(data.cumulativeAmount).toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="dailyAmount"
                stroke="#059669"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#donationFlow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

