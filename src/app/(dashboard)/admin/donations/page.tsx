"use client";

import {
  Banknote,
  CheckCircle2,
  Clock,
  HeartHandshake,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { DonationsTable } from "@/components/donation";
import { useGetAllDonationsAdmin } from "@/hooks";

export default function AdminDonationsPage() {
  const {
    data: donationsResponse,
    isLoading,
    refetch,
  } = useGetAllDonationsAdmin();

  const donations = donationsResponse?.data || [];

  const completedDonations = donations.filter((d) => d.status === "COMPLETED");
  const totalRaised = completedDonations.reduce(
    (acc, cur) => acc + (cur.amount || 0),
    0,
  );
  const pendingCount = donations.filter((d) => d.status === "PENDING").length;
  const avgDonation =
    completedDonations.length > 0
      ? Math.round(totalRaised / completedDonations.length)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <HeartHandshake className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Donation Management
            </h1>
            <p className="text-xs text-slate-500">
              Audit real-time platform transactions, donor contributions, and
              fund collections.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
        >
          <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Funds Raised */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Funds Raised
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Banknote className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">
            ৳{totalRaised.toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-[11px] text-emerald-700 font-medium">
            Verified across all campaigns
          </p>
        </div>

        {/* Completed Transactions */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Completed Donations
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">
            {completedDonations.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Successful gateway checkouts
          </p>
        </div>

        {/* Pending / In-flight */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pending Checkouts
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">
            {pendingCount}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Awaiting bKash callback confirmation
          </p>
        </div>

        {/* Average Contribution */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Average Donation
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">
            ৳{avgDonation.toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Per completed donor session
          </p>
        </div>
      </div>

      {/* Main Table */}
      <DonationsTable
        donations={donations}
        isLoading={isLoading}
        showDonorInfo={true}
      />
    </div>
  );
}
