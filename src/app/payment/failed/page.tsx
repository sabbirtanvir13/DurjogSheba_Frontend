"use client";

import { AlertTriangle, HelpCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FailedContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const donationId = searchParams.get("donationId");

  const displayMessage =
    message ||
    (status === "cancel"
      ? "Payment was cancelled before completion."
      : status === "failure"
        ? "Payment could not be processed by bKash."
        : "The payment transaction could not be completed.");

  return (
    <div className="mx-auto max-w-xl text-center">
      {/* Alert Icon */}
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 shadow-xl shadow-rose-500/10 ring-8 ring-rose-50/50">
        <AlertTriangle className="h-10 w-10 stroke-[2]" />
      </div>

      <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100/70 px-3 py-1 text-xs font-semibold text-rose-800">
        Payment Unsuccessful
      </div>

      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        Payment Was Not Completed
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        {displayMessage} No money was charged, or any held amount will be
        automatically released by bKash.
      </p>

      {/* Transaction Details Box */}
      <div className="mt-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm text-left text-xs space-y-3">
        {donationId && (
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Donation Reference</span>
            <span className="font-mono text-slate-700">{donationId}</span>
          </div>
        )}

        {status && (
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Gateway Status</span>
            <span className="font-semibold uppercase text-rose-700">
              {status}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-slate-500">Payment Gateway</span>
          <span className="font-semibold text-slate-800">bKash</span>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500">
          <p className="flex items-start gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              If your bKash account was debited due to an intermittent network
              issue, bKash usually reverses the balance within 24 to 72 hours.
            </span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/donor/donate"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-800 transition"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
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

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="mx-auto max-w-md py-20 text-center text-slate-400">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-rose-600 border-t-transparent" />
            <p className="mt-3 text-sm">Loading details...</p>
          </div>
        }
      >
        <FailedContent />
      </Suspense>
    </div>
  );
}
