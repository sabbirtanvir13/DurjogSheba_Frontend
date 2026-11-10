"use client";

import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Home,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const donationId = searchParams.get("donationId");
  const trxID = searchParams.get("trxID");
  const amount = searchParams.get("amount");

  const formattedAmount = amount
    ? `৳${Number(amount).toLocaleString("en-US")}`
    : "৳--";

  return (
    <div className="mx-auto max-w-xl text-center">
      {/* Celebration Icon */}
      <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-xl shadow-emerald-500/10 ring-8 ring-emerald-50/50">
        <CheckCircle2 className="h-12 w-12 stroke-[2.5]" />
        <div className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
          <Heart className="h-4 w-4 fill-white" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-semibold text-emerald-800">
        <ShieldCheck className="h-3.5 w-3.5" />
        Payment Verified & Received
      </div>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Thank You for Your Generosity!
      </h1>
      <p className="mt-2 text-sm text-slate-600 sm:text-base">
        Your donation has been successfully processed and directly aids relief
        operations for disaster-affected families across Bangladesh.
      </p>

      {/* Transaction Details Box */}
      <div className="mt-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm text-left text-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="text-slate-500 font-medium">Amount Donated</span>
          <span className="text-xl font-black text-emerald-700">
            {formattedAmount}
          </span>
        </div>

        {trxID && (
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Transaction ID</span>
            <span className="font-mono font-bold text-slate-800">{trxID}</span>
          </div>
        )}

        {donationId && (
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Donation Reference</span>
            <span className="font-mono text-slate-600">{donationId}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-slate-500">Payment Gateway</span>
          <span className="font-bold text-[#D12053]">bKash Verified</span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-slate-500">Status</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            COMPLETED
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/donor/donations"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-800 transition"
        >
          <Receipt className="h-4 w-4" />
          <span>View My Donations</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
        >
          <Home className="h-4 w-4 text-slate-500" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="mx-auto max-w-md py-20 text-center text-slate-400">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <p className="mt-3 text-sm">Verifying payment status...</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
