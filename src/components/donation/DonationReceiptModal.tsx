"use client";

import { CheckCircle2, Download, Printer, ShieldCheck, X } from "lucide-react";
import Image from "next/image";
import type { IDonation } from "@/types";

export interface DonationReceiptModalProps {
  donation: IDonation | null;
  donorName?: string | null;
  donorEmail?: string | null;
  onClose: () => void;
}

export function DonationReceiptModal({
  donation,
  donorName,
  donorEmail,
  onClose,
}: DonationReceiptModalProps) {
  if (!donation) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(donation.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const displayName = donation.donor?.name || donorName || "Valued Supporter";
  const displayEmail =
    donation.donor?.email || donorEmail || "donor@durjogsheba.gov.bd";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs print:p-0 print:bg-white animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 print:border-none print:shadow-none">
        {/* Modal Top Bar (hidden when printing) */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4 print:hidden">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Official Donation Receipt
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition"
              aria-label="Close receipt"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6 print:p-8">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <Image
                src="/Logo.png"
                alt="DurjogSheba Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  DurjogSheba Foundation
                </h2>
                <p className="text-xs text-slate-500">
                  National Disaster Relief & Emergency Aid
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Paid & Verified
              </span>
              <p className="mt-1 text-[11px] font-mono text-slate-400">
                Receipt #{donation.transactionId}
              </p>
            </div>
          </div>

          {/* Donor & Payment Summary Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-xs">
            <div>
              <p className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                Donor Information
              </p>
              <p className="mt-1 font-bold text-slate-900 text-sm">
                {displayName}
              </p>
              <p className="text-slate-500">{displayEmail}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                Date & Time
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                {formattedDate}
              </p>
              <p className="text-slate-500">
                Gateway: {donation.paymentGateway}
              </p>
            </div>
          </div>

          {/* Line Item Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Purpose / Fund Description</th>
                  <th className="px-4 py-2.5 text-right">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">
                      Disaster Relief Emergency Fund
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Emergency food supplies, medical kits, and rehabilitation
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900 text-sm">
                    ৳{donation.amount.toLocaleString("en-US")}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-xs">
                <tr>
                  <td className="px-4 py-2.5 text-slate-700">
                    Total Contributed
                  </td>
                  <td className="px-4 py-2.5 text-right text-emerald-700 text-base">
                    ৳{donation.amount.toLocaleString("en-US")} BDT
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Transaction Metadata */}
          <div className="space-y-1.5 text-[11px] text-slate-500 border-t border-slate-100 pt-4">
            <div className="flex justify-between">
              <span>Transaction Reference:</span>
              <span className="font-mono font-medium text-slate-700">
                {donation.transactionId}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Payment Gateway:</span>
              <span className="font-medium text-slate-700">
                {donation.paymentGateway}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-semibold text-emerald-700">
                {donation.status}
              </span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-center text-xs text-emerald-800">
            Thank you for standing with Bangladesh during emergency crisis
            situations. Your compassion saves lives.
          </div>
        </div>

        {/* Modal Action Buttons (hidden when printing) */}
        <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-3 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition"
          >
            <Download className="h-3.5 w-3.5" />
            Print / Save
          </button>
        </div>
      </div>
    </div>
  );
}
