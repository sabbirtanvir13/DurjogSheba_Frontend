"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { IShelter } from "@/types";

interface ShelterCapacityChartProps {
  shelters: IShelter[];
  title?: string;
  subtitle?: string;
}

export function ShelterCapacityChart({
  shelters,
  title = "Shelter Network Occupancy",
  subtitle = "Real-time bed availability and capacity utilization across registered facilities",
}: ShelterCapacityChartProps) {
  const { totalCapacity, totalOccupied, available, occupancyRate, chartData } =
    useMemo(() => {
      let cap = 0;
      let occ = 0;

      for (const s of shelters) {
        cap += Number(s.capacity || 0);
        occ += Number(s.currentPeople || 0);
      }

      const avail = Math.max(0, cap - occ);
      const rate = cap > 0 ? Math.round((occ / cap) * 100) : 0;

      const data = [
        {
          name: "Occupied Beds",
          value: occ,
          color: "#3b82f6",
        },
        {
          name: "Available Beds",
          value: avail,
          color: "#10b981",
        },
      ];

      return {
        totalCapacity: cap,
        totalOccupied: occ,
        available: avail,
        occupancyRate: rate,
        chartData: data,
      };
    }, [shelters]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 sm:text-base">
            {title}
          </h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {shelters.length} Shelters Monitored
        </span>
      </div>

      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-12 flex-1">
        <div className="relative h-56 w-full sm:col-span-6 sm:h-60">
          {totalCapacity === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-xs text-slate-400">
                No shelter facilities registered.
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
                              {Number(data.value).toLocaleString()} people
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
                        key={`pie-shelter-${entry.name}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900">
                  {occupancyRate}%
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Capacity Used
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col justify-center gap-2.5 sm:col-span-6">
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-blue-900">
                Currently Sheltered
              </span>
              <span className="font-bold text-blue-700">
                {totalOccupied.toLocaleString()} evacuees
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-emerald-900">
                Available Spaces
              </span>
              <span className="font-bold text-emerald-700">
                {available.toLocaleString()} beds
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600">
                Total Bed Capacity
              </span>
              <span className="font-bold text-slate-900">
                {totalCapacity.toLocaleString()} total
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
