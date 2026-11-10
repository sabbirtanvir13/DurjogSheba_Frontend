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
    <div className="relative overflow-hidden bg-[#f7f9fc] py-10 sm:py-14">
      {/* Background ambient blur */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[600px] -translate-x-1/2 rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            <Heart size={13} className="fill-emerald-700" />
            100% Tax Deductible & Verified Aid
          </div>

          <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Save Lives With Your{" "}
            <span className="text-emerald-700">Relief Donation.</span>
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-600">
            Every contribution directly funds emergency rations, life-saving
            medicines, purified drinking water, and dry temporary shelters for
            disaster victims in Bangladesh.
          </p>
        </div>

        {/* Content Layout */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Main Checkout Card */}
          <div className="lg:col-span-7">
            <DonationCheckoutCard
              campaignTitle={campaignTitle}
              initialAmount={initialAmount}
            />
          </div>

          {/* Side Info & FAQ */}
          <div className="space-y-4 lg:col-span-5">
            {/* Direct Impact Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Government & Community Verified</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Instant Deployment:</strong> Relief coordinators and
                    vetted volunteers on the ground distribute food packets and
                    medical kits within hours.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero Intermediary Leakage:</strong> Monitored
                    digitally via transaction receipts and verifiable emergency
                    shelter allocations.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Official bKash Gateway:</strong> Pay securely using
                    your personal bKash PIN through the tokenized bKash merchant
                    gateway.
                  </span>
                </li>
              </ul>
            </div>

            {/* Helpline Card */}
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-emerald-100/30 p-4 space-y-2 text-emerald-950">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-800">
                <PhoneCall className="h-3.5 w-3.5 text-emerald-700" />
                Need Emergency Assistance?
              </div>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                Our national control room is active 24 hours daily during
                natural disaster operations.
              </p>
              <div className="pt-1 text-xs font-bold text-emerald-900">
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
