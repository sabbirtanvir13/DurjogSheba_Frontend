"use client";

import {
  Heart,
  HelpCircle,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { DonationCheckoutCard } from "@/components/donation";

export default function DonorDonatePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Heart className="h-5 w-5 fill-emerald-600" />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Make a Relief Donation
            </h1>
            <p className="text-xs text-slate-500">
              Provide direct financial relief to flood, cyclone, and
              disaster-affected communities in Bangladesh.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Main Checkout Section */}
        <div className="lg:col-span-7">
          <DonationCheckoutCard initialAmount={1000} />
        </div>

        {/* Sidebar Information */}
        <div className="space-y-4 lg:col-span-5">
          {/* Trust Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Transparent & Accountable</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>
                  <strong>100% Direct Allocation:</strong> Relief funds are
                  dispatched immediately to local shelters and emergency teams.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>
                  <strong>Official Receipts:</strong> Every transaction
                  generates a downloadable PDF receipt with tracking reference.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>
                  <strong>Safe & Secure:</strong> All transactions are powered
                  directly through bKash Tokenized Checkout.
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Stats Impact */}
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
              <Sparkles className="h-4 w-4 text-emerald-700" />
              Our Shared Impact
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="rounded-xl bg-white/80 p-2.5 shadow-2xs">
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  Families Fed
                </p>
                <p className="text-base font-black text-slate-900">12,450+</p>
              </div>
              <div className="rounded-xl bg-white/80 p-2.5 shadow-2xs">
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  Shelters Active
                </p>
                <p className="text-base font-black text-slate-900">
                  84 Centers
                </p>
              </div>
            </div>
          </div>

          {/* Helpline */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <HelpCircle className="h-4 w-4 text-slate-400" />
              Need Assistance?
            </div>
            <p className="text-xs text-slate-500">
              Contact our 24/7 relief support team if you experience any issue.
            </p>
            <div className="flex items-center gap-2 pt-1 font-bold text-xs text-emerald-700">
              <PhoneCall className="h-3.5 w-3.5" />
              <span>+880 9612-DURJOG (387564)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
