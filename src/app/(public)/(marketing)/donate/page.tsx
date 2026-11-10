"use client";

import { CheckCircle2, Heart, PhoneCall, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { DonationCheckoutCard } from "@/components/donation";

function DonateContent() {
  const searchParams = useSearchParams();
  const campaignParam = searchParams.get("campaign");
  const amountParam = searchParams.get("amount");

  const campaignMap: Record<string, string> = {
    "1": "Emergency Food & Safe Water Relief",
    "2": "Rebuild Homes for Cyclone Survivors",
    "3": "Emergency Healthcare & First Aid",
    "4": "Warm Clothing & Child Care Kits",
  };

  const campaignTitle = campaignParam
    ? campaignMap[campaignParam] || "Disaster Emergency Relief Fund"
    : "Disaster Emergency Relief Fund";

  const initialAmount = amountParam ? Number(amountParam) || 1000 : 1000;

  return (
    <div className="relative overflow-hidden bg-[#f7f9fc] py-12 sm:py-16">
      {/* Background ambient blur */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800">
            <Heart size={14} className="fill-emerald-700" />
            100% Tax Deductible & Emergency Verified
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Save Lives With Your{" "}
            <span className="text-emerald-700">Relief Donation.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Every contribution directly funds emergency rations, life-saving
            medicines, purified drinking water, and dry temporary shelters for
            disaster victims across Bangladesh.
          </p>
        </div>

        {/* Content Layout */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Checkout Card */}
          <div className="lg:col-span-7 xl:col-span-8">
            <DonationCheckoutCard
              campaignTitle={campaignTitle}
              initialAmount={initialAmount}
            />
          </div>

          {/* Side Info & FAQ */}
          <div className="space-y-6 lg:col-span-5 xl:col-span-4">
            {/* Direct Impact Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span>Government & Community Verified</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Instant Deployment:</strong> Relief coordinators and
                    vetted volunteers on the ground distribute food packets and
                    medical kits within 6 hours.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero Intermediary Leakage:</strong> Monitored
                    digitally via transaction receipts and verifiable emergency
                    shelter allocations.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Official bKash Gateway:</strong> Pay securely using
                    your personal bKash PIN through the tokenized bKash merchant
                    gateway.
                  </span>
                </li>
              </ul>
            </div>

            {/* Helpline Card */}
            <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-emerald-100/30 p-6 space-y-3 text-emerald-950">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-800">
                <PhoneCall className="h-4 w-4 text-emerald-700" />
                Need Emergency Assistance?
              </div>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                Our national control room is active 24 hours daily during
                natural disaster operations.
              </p>
              <div className="pt-1 text-sm font-black text-emerald-900">
                Hotline: +880 9612-DURJOG (387564)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicDonatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        </div>
      }
    >
      <DonateContent />
    </Suspense>
  );
}
