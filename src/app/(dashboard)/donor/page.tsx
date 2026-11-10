"use client";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Heart,
  HeartHandshake,
  PackageCheck,
  Receipt,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DonationReceiptModal } from "@/components/donation";
import { useGetMe, useGetMyDonations } from "@/hooks";
import type { IDonation } from "@/types";

export default function DonorDashboardPage() {
  const { data: user } = useGetMe();
  const { data: donationsResponse, isLoading } = useGetMyDonations();
  const [selectedDonation, setSelectedDonation] = useState<IDonation | null>(
    null,
  );

  const donations = donationsResponse?.data || [];
  const completedDonations = donations.filter((d) => d.status === "COMPLETED");
  const totalAmount = completedDonations.reduce(
    (acc, cur) => acc + (cur.amount || 0),
    0,
  );
  const recentDonations = donations.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-emerald-100 border border-emerald-400/30">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            Verified Donor Portal
          </div>
          <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
            Welcome Back, {user?.name || "Compassionate Donor"}!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Your generous financial contributions provide essential food
            rations, clean drinking water, emergency medical care, and shelter
            support to flood and cyclone survivors in Bangladesh.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/donor/donate"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-emerald-900 shadow-md hover:bg-emerald-50 transition"
            >
              <Heart className="h-4 w-4 fill-emerald-800 text-emerald-800" />
              <span>Make a Donation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/donor/donations"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-900/40 border border-emerald-400/30 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-900/60 transition"
            >
              <Receipt className="h-4 w-4" />
              <span>View History</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Donated */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Contributed
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">
            ৳{totalAmount.toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-[11px] text-emerald-700 font-medium">
            Lifetime verified donations
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
            Official receipts generated
          </p>
        </div>

        {/* Impact Metric */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Estimated Lives Impacted
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <HeartHandshake className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">
            {Math.max(1, Math.round(totalAmount / 350))}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Emergency meal days provided
          </p>
        </div>

        {/* Active Shelters */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              National Relief Grid
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">Active</p>
          <p className="mt-1 text-[11px] text-teal-700 font-medium">
            Connected across districts
          </p>
        </div>
      </div>

      {/* Recent Donations and Quick Action Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Recent Contributions */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-emerald-700" />
              <h2 className="text-sm font-bold text-slate-900">
                Recent Contributions
              </h2>
            </div>
            <Link
              href="/donor/donations"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View all
            </Link>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Loading recent transactions...
            </div>
          ) : recentDonations.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <HeartHandshake className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 font-medium text-slate-600">
                No donations yet
              </p>
              <p className="text-slate-400">
                Your future donations will be listed here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentDonations.map((item) => {
                const dateStr = new Date(item.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                );

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 text-xs"
                  >
                    <div>
                      <p className="font-mono font-bold text-slate-800">
                        {item.transactionId}
                      </p>
                      <p className="text-slate-400 text-[11px]">
                        {dateStr} via {item.paymentGateway}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-900 text-sm">
                        ৳{item.amount.toLocaleString("en-US")}
                      </span>

                      {item.status === "COMPLETED" ? (
                        <button
                          type="button"
                          onClick={() => setSelectedDonation(item)}
                          className="rounded-lg border border-slate-200 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-50 text-[11px]"
                        >
                          Receipt
                        </button>
                      ) : item.status === "PENDING" ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-[11px]">
                          <Clock className="h-3 w-3" />
                          Pending
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold text-[11px]">
                          Failed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Relief Explorer */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs lg:col-span-4 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            Emergency Relief Quick Links
          </h2>
          <div className="space-y-3">
            <Link
              href="/shelters"
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 transition"
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-700" />
                <span>Find Nearby Shelters</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>

            <Link
              href="/relief-needs"
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 transition"
            >
              <div className="flex items-center gap-2">
                <PackageCheck className="h-4 w-4 text-emerald-700" />
                <span>Critical Relief Needs</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>

            <Link
              href="/rescue-requests"
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 transition"
            >
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-600" />
                <span>Emergency Rescue Feed</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      <DonationReceiptModal
        donation={selectedDonation}
        donorName={user?.name}
        donorEmail={user?.email}
        onClose={() => setSelectedDonation(null)}
      />
    </div>
  );
}
