"use client";

import { ArrowRight, Heart, History } from "lucide-react";
import Link from "next/link";
import { DonationsTable } from "@/components/donation";
import { useGetMe, useGetMyDonations } from "@/hooks";

export default function DonorDonationHistoryPage() {
  const { data: user } = useGetMe();
  const { data: donationsResponse, isLoading } = useGetMyDonations();

  const donations = donationsResponse?.data || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <History className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Donation History
            </h1>
            <p className="text-xs text-slate-500">
              Audit and track all historical contributions you have made to
              DurjogSheba emergency programs.
            </p>
          </div>
        </div>

        <Link
          href="/donor/donate"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition"
        >
          <Heart className="h-4 w-4 fill-white" />
          <span>Donate Now</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Main Table */}
      <DonationsTable
        donations={donations}
        isLoading={isLoading}
        donorName={user?.name}
        donorEmail={user?.email}
      />
    </div>
  );
}
