"use client";

import { FileCheck2, Printer, Receipt, Search } from "lucide-react";
import { useState } from "react";
import { DonationReceiptModal } from "@/components/donation";
import { useGetMe, useGetMyDonations } from "@/hooks";
import type { IDonation } from "@/types";

export default function DonorReceiptsPage() {
  const { data: user } = useGetMe();
  const { data: donationsResponse, isLoading } = useGetMyDonations();

  const [selectedDonation, setSelectedDonation] = useState<IDonation | null>(
    null,
  );
  const [search, setSearch] = useState("");

  const donations = (donationsResponse?.data || []).filter(
    (d) => d.status === "COMPLETED",
  );

  const filtered = donations.filter((item) =>
    item.transactionId.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <FileCheck2 className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Donation Receipts
          </h1>
          <p className="text-xs text-slate-500">
            View, print, and save official tax-deductible contribution receipts
            for your completed donations.
          </p>
        </div>
      </div>

      {/* Search Header */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10"
          />
        </div>
        <p className="text-xs text-slate-500 font-medium">
          {filtered.length} receipt{filtered.length === 1 ? "" : "s"} available
        </p>
      </div>

      {/* Receipts Grid / List */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center text-slate-400">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <p className="mt-3 text-xs">Loading receipts...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center text-slate-400">
          <Receipt className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-2 text-sm font-semibold text-slate-600">
            No completed receipts found
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Receipts are automatically generated as soon as a bKash donation
            completes successfully.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
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
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-emerald-200 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="font-mono text-xs font-bold text-slate-800">
                      #{item.transactionId}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      Paid
                    </span>
                  </div>

                  <div className="mt-4 space-y-1">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                      Contribution
                    </p>
                    <p className="text-2xl font-black text-slate-900">
                      ৳{item.amount.toLocaleString("en-US")}
                    </p>
                    <p className="text-xs text-slate-500">{dateStr}</p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    via {item.paymentGateway}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedDonation(item)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-800 transition"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>View Receipt</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Official Receipt Modal */}
      <DonationReceiptModal
        donation={selectedDonation}
        donorName={user?.name}
        donorEmail={user?.email}
        onClose={() => setSelectedDonation(null)}
      />
    </div>
  );
}
