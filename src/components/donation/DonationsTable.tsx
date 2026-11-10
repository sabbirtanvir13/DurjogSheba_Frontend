"use client";

import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  Filter,
  HeartHandshake,
  Search,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import type { IDonation, PaymentStatus } from "@/types";
import { DonationReceiptModal } from "./DonationReceiptModal";

export interface DonationsTableProps {
  donations: IDonation[];
  isLoading?: boolean;
  showDonorInfo?: boolean;
  donorName?: string | null;
  donorEmail?: string | null;
}

export function DonationsTable({
  donations,
  isLoading,
  showDonorInfo = false,
  donorName,
  donorEmail,
}: DonationsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedDonationForReceipt, setSelectedDonationForReceipt] =
    useState<IDonation | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyTrx = (trxId: string) => {
    navigator.clipboard.writeText(trxId);
    setCopiedId(trxId);
    toast.success("Transaction ID copied to clipboard");
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filtered = donations.filter((item) => {
    const matchesSearch =
      item.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      Boolean(item.donor?.name?.toLowerCase().includes(search.toLowerCase())) ||
      Boolean(item.donor?.email?.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" ? true : item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
            <Clock className="h-3.5 w-3.5" />
            Pending
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200">
            <XCircle className="h-3.5 w-3.5" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {/* Controls Header */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Trx ID or donor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="h-3.5 w-3.5 text-slate-400 mr-1 shrink-0" />
            {(["ALL", "COMPLETED", "PENDING", "FAILED"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  statusFilter === st
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {st === "ALL"
                  ? "All"
                  : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Transaction ID</th>
                {showDonorInfo && <th className="px-4 py-3.5">Donor</th>}
                <th className="px-4 py-3.5">Amount</th>
                <th className="px-4 py-3.5">Gateway</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={showDonorInfo ? 7 : 6}
                    className="py-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                      <span>Loading donation records...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={showDonorInfo ? 7 : 6}
                    className="py-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <HeartHandshake className="h-8 w-8 text-slate-300" />
                      <p className="font-medium text-slate-600">
                        No donations found
                      </p>
                      <p className="text-xs text-slate-400">
                        {search || statusFilter !== "ALL"
                          ? "Try adjusting your search or filters."
                          : "Contributions will appear here once initiated."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((donation) => {
                  const dateStr = new Date(donation.createdAt).toLocaleString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  );

                  return (
                    <tr
                      key={donation.id}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      {/* Trx ID with Copy button */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 font-mono font-medium text-slate-800">
                          <span>{donation.transactionId}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyTrx(donation.transactionId)
                            }
                            className="rounded p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition"
                            title="Copy Transaction ID"
                          >
                            {copiedId === donation.transactionId ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Donor Info (for admin) */}
                      {showDonorInfo && (
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {donation.donor?.name || "Unknown Donor"}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {donation.donor?.email}
                            </p>
                            {donation.donor?.phoneNumber && (
                              <p className="text-[10px] text-slate-400">
                                {donation.donor.phoneNumber}
                              </p>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Amount */}
                      <td className="px-4 py-4 font-bold text-slate-900">
                        ৳{donation.amount.toLocaleString("en-US")}
                      </td>

                      {/* Gateway */}
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-0.5 text-xs font-bold text-[#D12053] border border-pink-100">
                          {donation.paymentGateway}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        {getStatusBadge(donation.status)}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        {donation.status === "COMPLETED" ? (
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedDonationForReceipt(donation)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-emerald-700 transition"
                          >
                            <FileText className="h-3.5 w-3.5 text-emerald-600" />
                            Receipt
                          </button>
                        ) : (
                          <span className="text-slate-300 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Receipt Modal */}
      <DonationReceiptModal
        donation={selectedDonationForReceipt}
        donorName={donorName}
        donorEmail={donorEmail}
        onClose={() => setSelectedDonationForReceipt(null)}
      />
    </>
  );
}
