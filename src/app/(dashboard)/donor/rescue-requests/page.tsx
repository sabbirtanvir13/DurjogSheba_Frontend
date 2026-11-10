"use client";

import { LifeBuoy, MapPin, Phone, RefreshCw, Users } from "lucide-react";
import { useState } from "react";
import { useGetRescueRequests } from "@/hooks";

export default function DonorRescueRequestsPage() {
  const [filterUrgency, setFilterUrgency] = useState<string>("ALL");
  const { data: response, isLoading, refetch } = useGetRescueRequests();

  const rescues = response?.data || [];
  const filtered = rescues.filter((r) =>
    filterUrgency === "ALL" ? true : r.urgency === filterUrgency,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <LifeBuoy className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Emergency Rescue Feed
            </h1>
            <p className="text-xs text-slate-500">
              Live status of reported emergency rescue operations and community
              appeals.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
        >
          <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Urgency Filter */}
      <div className="flex items-center gap-2">
        {(["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map(
          (urgency) => (
            <button
              key={urgency}
              type="button"
              onClick={() => setFilterUrgency(urgency)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filterUrgency === urgency
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {urgency}
            </button>
          ),
        )}
      </div>

      {/* Grid of Rescues */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center text-slate-400">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <p className="mt-3 text-xs">Loading rescue operations...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center text-slate-400">
          <LifeBuoy className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-2 text-sm font-semibold text-slate-600">
            No rescue requests found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                      r.urgency === "CRITICAL" || r.urgency === "HIGH"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {r.urgency} Urgency
                  </span>
                  <span className="text-[11px] font-bold uppercase text-slate-500">
                    {r.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <MapPin className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="font-semibold">{r.location}</span>
                  </div>
                  {r.description && (
                    <p className="text-xs text-slate-500 line-clamp-3">
                      {r.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-50">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      {r.peopleCount} People
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {r.contactPhone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
