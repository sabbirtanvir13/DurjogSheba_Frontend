"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { IUser } from "@/types";

interface UserDistributionChartProps {
  users: IUser[];
  title?: string;
  subtitle?: string;
}

const ROLE_COLORS: Record<string, { label: string; color: string }> = {
  VOLUNTEER: { label: "Volunteers", color: "#10b981" },
  DONOR: { label: "Donors", color: "#3b82f6" },
  ADMIN: { label: "Administrators", color: "#6366f1" },
};

export function UserDistributionChart({
  users,
  title = "User Community & Role Distribution",
  subtitle = "Breakdown of human resources across platform roles",
}: UserDistributionChartProps) {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {
      VOLUNTEER: 0,
      DONOR: 0,
      ADMIN: 0,
    };

    for (const u of users) {
      const role = u.role?.toUpperCase();
      if (counts[role] !== undefined) {
        counts[role] += 1;
      }
    }

    const total = users.length || 1;

    return (["VOLUNTEER", "DONOR", "ADMIN"] as const).map((role) => ({
      key: role,
      name: ROLE_COLORS[role].label,
      value: counts[role],
      percentage: Math.round((counts[role] / total) * 100),
      color: ROLE_COLORS[role].color,
    }));
  }, [users]);

  const activeCount = useMemo(() => {
    return users.filter((u) => u.status === "ACTIVE").length;
  }, [users]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 sm:text-base">
            {title}
          </h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {activeCount} Active Accounts
        </span>
      </div>

      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-12 flex-1">
        <div className="relative h-56 w-full sm:col-span-6 sm:h-60">
          {users.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-xs text-slate-400">
                No users found in database.
              </p>
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
                              {data.value} users ({data.percentage}%)
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
                      <Cell key={`pie-user-${entry.key}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900">
                  {users.length}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total Users
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
                  {d.name}
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
