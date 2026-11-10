"use client";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Filter,
  Heart,
  Package,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useGetReliefNeeds } from "@/hooks";

const CATEGORIES = [
  "ALL",
  "FOOD",
  "WATER",
  "MEDICINE",
  "CLOTHING",
  "SHELTER_MATERIAL",
  "HYGIENE",
];

export default function PublicReliefNeedsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("ALL");

  const { data: response, isLoading, refetch } = useGetReliefNeeds();
  const reliefNeeds = response?.data || [];

  const filtered = useMemo(() => {
    return reliefNeeds.filter((item) => {
      const matchesSearch =
        item.itemName.toLowerCase().includes(search.toLowerCase()) ||
        Boolean(
          item.shelter?.name?.toLowerCase().includes(search.toLowerCase()),
        ) ||
        Boolean(
          item.shelter?.district?.toLowerCase().includes(search.toLowerCase()),
        );

      const matchesCategory =
        selectedCategory === "ALL"
          ? true
          : item.itemCategory.toUpperCase().includes(selectedCategory);

      const matchesUrgency =
        urgencyFilter === "ALL" ? true : item.urgency === urgencyFilter;

      return matchesSearch && matchesCategory && matchesUrgency;
    });
  }, [reliefNeeds, search, selectedCategory, urgencyFilter]);

  const urgentCount = reliefNeeds.filter((r) => r.urgency === "HIGH").length;
  const totalItemsNeeded = reliefNeeds.reduce(
    (acc, cur) => acc + (cur.quantity || 0),
    0,
  );
  const totalItemsFulfilled = reliefNeeds.reduce(
    (acc, cur) => acc + (cur.fulfilled || 0),
    0,
  );
  const overallPercentage =
    totalItemsNeeded > 0
      ? Math.round((totalItemsFulfilled / totalItemsNeeded) * 100)
      : 0;

  return (
    <div className="bg-[#f7f9fc] py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-400/30">
                <Sparkles className="h-3.5 w-3.5" />
                Live Shelter Supply Grid
              </div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Critical Relief Requirements
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Emergency shelters report real-time material shortages. Check
                what is urgently required on the ground and help fulfill
                verified relief needs.
              </p>
            </div>

            <Link
              href="/donate"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs sm:text-sm font-bold text-emerald-900 shadow-md hover:bg-emerald-50 transition shrink-0"
            >
              <Heart className="h-4 w-4 fill-emerald-800 text-emerald-800" />
              <span>Donate Relief Funds</span>
            </Link>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Relief Demands
            </span>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {reliefNeeds.length}
            </p>
            <p className="text-[11px] text-slate-500">Categorized supplies</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Urgent Priority
            </span>
            <p className="mt-2 text-2xl font-black text-red-600">
              {urgentCount}
            </p>
            <p className="text-[11px] text-red-700 font-medium">
              High urgency supplies
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Delivered
            </span>
            <p className="mt-2 text-2xl font-black text-emerald-700">
              {totalItemsFulfilled.toLocaleString("en-US")}
            </p>
            <p className="text-[11px] text-slate-500">Units distributed</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Fulfillment Rate
            </span>
            <p className="mt-2 text-2xl font-black text-teal-700">
              {overallPercentage}%
            </p>
            <p className="text-[11px] text-slate-500">Overall platform goal</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search item, shelter, or district..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              <Filter className="h-3.5 w-3.5 text-slate-400 mr-1 shrink-0" />
              {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setUrgencyFilter(lvl)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    urgencyFilter === lvl
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  {lvl}
                </button>
              ))}
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                title="Refresh relief needs"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat === "ALL"
                  ? "All Categories"
                  : cat.replace("_", " ").toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Relief Needs Grid */}
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center text-slate-400">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <p className="mt-3 text-xs">Loading verified relief demands...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center text-slate-400">
            <Package className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-2 text-sm font-bold text-slate-700">
              No matching relief items found
            </p>
            <p className="text-xs text-slate-400">
              Try adjusting your category or search filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              const req = item.quantity || 0;
              const ful = item.fulfilled || 0;
              const percent =
                req > 0 ? Math.min(100, Math.round((ful / req) * 100)) : 0;
              const remaining = Math.max(0, req - ful);

              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-emerald-200 hover:shadow-md"
                >
                  <div>
                    {/* Header: Urgency + Category */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${
                          item.urgency === "HIGH"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : item.urgency === "MEDIUM"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.urgency} Urgency
                      </span>

                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        {item.itemCategory}
                      </span>
                    </div>

                    {/* Item Details */}
                    <div className="mt-4 space-y-1.5">
                      <h2 className="text-base font-bold text-slate-900 leading-snug">
                        {item.itemName}
                      </h2>
                      {item.shelter && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Building2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate">
                            {item.shelter.name}
                            {item.shelter.district
                              ? ` (${item.shelter.district})`
                              : ""}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Fulfillment Progress */}
                    <div className="mt-5 space-y-1.5 border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Fulfilled:</span>
                        <span className="font-bold text-slate-900">
                          {ful} / {req} {item.unit}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{percent}% Complete</span>
                        {remaining > 0 ? (
                          <span className="font-bold text-red-600">
                            Still needed: {remaining} {item.unit}
                          </span>
                        ) : (
                          <span className="font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Fully Fulfilled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={
                        item.shelterId
                          ? `/shelters/${item.shelterId}`
                          : "/shelters"
                      }
                      className="text-xs font-semibold text-slate-600 hover:text-emerald-700"
                    >
                      View Shelter
                    </Link>
                    <Link
                      href="/donate"
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-800 transition"
                    >
                      <span>Donate Aid</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
