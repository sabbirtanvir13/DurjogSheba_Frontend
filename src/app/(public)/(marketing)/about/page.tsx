"use client";

import {
  Building2,
  CheckCircle2,
  Heart,
  LifeBuoy,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Districts Covered",
    value: "64",
    desc: "Nationwide disaster network",
  },
  {
    label: "Registered Volunteers",
    value: "8,500+",
    desc: "Vetted on-ground responders",
  },
  {
    label: "Active Shelters",
    value: "120+",
    desc: "Real-time occupancy tracking",
  },
  {
    label: "Direct Relief Delivered",
    value: "৳2.4 Cr+",
    desc: "100% verified aid",
  },
];

const pillars = [
  {
    icon: LifeBuoy,
    title: "Emergency Rescue Dispatch",
    desc: "Stranded individuals and families can broadcast SOS appeals with live location coordinates, instantly alerting response teams and nearby volunteers.",
    color: "bg-red-50 text-red-600 border-red-100",
  },
  {
    icon: Building2,
    title: "Smart Shelter Management",
    desc: "Real-time visibility into shelter capacity, current occupancy, safe drinking water, and essential medical supplies to prevent overcrowding.",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: Heart,
    title: "Direct & Transparent Donations",
    desc: "Powered directly by bKash tokenized gateway. Every Taka is allocated straight to essential supplies with instant downloadable official receipts.",
    color: "bg-pink-50 text-pink-600 border-pink-100",
  },
  {
    icon: Users,
    title: "Volunteer Coordination",
    desc: "Local community volunteers receive self-assignable tasks, milestone logs, and safety instructions to rapidly coordinate rescue and relief distribution.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#f7f9fc]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[800px] -translate-x-1/2 rounded-full bg-emerald-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            National Disaster Response & Humanitarian Tech Platform
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Bridging Tech & Compassion During{" "}
            <span className="text-emerald-700">Bangladesh's Emergencies.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            DurjogSheba (দুর্যোগ সেবা) is Bangladesh's unified disaster relief
            coordination network. We connect stranded flood and cyclone
            survivors directly with emergency shelters, vetted volunteer rescue
            squads, and transparent citizen donations.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/shelters"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-800 transition"
            >
              <Building2 className="h-4 w-4" />
              <span>Find Nearby Shelters</span>
            </Link>

            <Link
              href="/donate"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
            >
              <Heart className="h-4 w-4 text-emerald-700" />
              <span>Make a Donation</span>
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className="border-y border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black text-slate-900 sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs font-bold text-emerald-700">
                  {s.label}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              How DurjogSheba Coordinates Disaster Relief
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-slate-500">
              Our 4 pillars ensure no community is left stranded without food,
              water, or medical care.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-emerald-200 transition"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border ${p.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-white">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                <Sparkles className="h-3.5 w-3.5" />
                Our Commitment
              </span>
              <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl leading-snug">
                Transparent, Decentralized, and Rapid Disaster Response.
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                We believe that modern technology can eliminate delays during
                floods and cyclones. By connecting citizen donors, local
                shelters, and heroic volunteer responders in one single
                transparent platform, every vulnerable community receives aid
                when it matters most.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Zero Intermediary Fees
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Live Operational Audits
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  24/7 Response Readiness
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Support Bar */}
      <section className="py-12 bg-emerald-50 border-t border-emerald-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="text-base font-bold text-emerald-950">
              Need Emergency Flood or Cyclone Assistance?
            </h3>
            <p className="text-xs text-emerald-800">
              Call the national emergency hotlines or broadcast a direct rescue
              appeal.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/rescue-requests"
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition"
            >
              <LifeBuoy className="h-4 w-4" />
              <span>Request Rescue</span>
            </Link>
            <div className="rounded-xl bg-white border border-emerald-200 px-3.5 py-2 text-xs font-bold text-emerald-900 shadow-2xs">
              Hotline: 999 / 1090
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
