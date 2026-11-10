"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Heart,
  Receipt,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { DonationsTable } from "@/components/donation";
import { useGetMe, useGetMyDonations } from "@/hooks";

export default function DonorDonationsPage() {
  const { data: user } = useGetMe();
  const { data: donationsResponse, isLoading } = useGetMyDonations();

  const donations = donationsResponse?.data || [];

  const completedDonations = donations.filter((d) => d.status === "COMPLETED");
  const totalAmount = completedDonations.reduce(
    (acc, cur) => acc + (cur.amount || 0),
    0,
  );
  const pendingCount = donations.filter((d) => d.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Receipt className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              My Donations
            </h1>
            <p className="text-xs text-slate-500">
              Track your financial contributions, view transaction IDs, and
              download official receipts.
            </p>
          </div>
        </div>

        <Link
          href="/donor/donate"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition"
        >
          <Heart className="h-4 w-4 fill-white" />
          <span>Make a New Donation</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Contributed */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Donated
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">
            ৳{totalAmount.toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-[11px] text-emerald-700 font-medium">
            All confirmed relief contributions
          </p>
        </div>

        {/* Successful Donations */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
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
            Official tax-deductible receipts available
          </p>
        </div>

        {/* Pending Operations */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pending / Unfinished
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">
            {pendingCount}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Awaiting gateway verification or retry
          </p>
        </div>
      </div>

      {/* Donations Table Component */}
      <DonationsTable
        donations={donations}
        isLoading={isLoading}
        donorName={user?.name}
        donorEmail={user?.email}
      />
    </div>
  );
}
