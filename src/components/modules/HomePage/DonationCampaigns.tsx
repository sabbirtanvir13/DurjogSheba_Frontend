"use client";

import {
  ArrowRight,
  CheckCircle2,
  HandHeart,
  Heart,
  HeartPulse,
  House,
  Users,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const campaigns = [
  {
    id: 1,
    category: "Food & Safe Water",
    title: "Emergency Food & Safe Water Relief",
    description:
      "Providing emergency food rations, pure drinking water, and purification kits to stranded flood victims.",
    image: "/images/hero/hero-background.png",
    icon: Utensils,
    raised: 1850000,
    target: 2500000,
    donors: 289,
    badgeColor: "bg-emerald-600 text-white",
  },
  {
    id: 2,
    category: "Shelter Recovery",
    title: "Rebuild Homes for Cyclone Survivors",
    description:
      "Supplying emergency shelter materials, corrugated tin, and rebuilding aid for displaced coastal families.",
    image: "/images/hero/hero-background.png",
    icon: House,
    raised: 3200000,
    target: 5000000,
    donors: 412,
    badgeColor: "bg-amber-600 text-white",
  },
  {
    id: 3,
    category: "Medical Support",
    title: "Emergency Healthcare & First Aid",
    description:
      "Deploying mobile medical teams, vital prescription medicines, and first-aid kits in affected districts.",
    image: "/images/hero/hero-background.png",
    icon: HeartPulse,
    raised: 950000,
    target: 1500000,
    donors: 178,
    badgeColor: "bg-blue-600 text-white",
  },
  {
    id: 4,
    category: "Children & Winter Aid",
    title: "Warm Clothing & Child Care Kits",
    description:
      "Delivering warm blankets, thermal clothes, and baby nutrition kits for vulnerable families in disaster areas.",
    image: "/images/hero/hero-background.png",
    icon: HandHeart,
    raised: 680000,
    target: 1000000,
    donors: 134,
    badgeColor: "bg-rose-600 text-white",
  },
];

const formatBDT = (amount: number) => `৳${amount.toLocaleString("en-US")}`;

export default function DonationCampaigns() {
  return (
    <section
      id="donation-campaigns"
      className="relative overflow-hidden bg-[#f7f9fc] px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800">
            <Heart size={14} fill="currentColor" />
            Every Contribution Saves Lives
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Make an Impact Today:{" "}
            <span className="text-emerald-700">Support Relief Efforts.</span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Your donation directly aids vulnerable communities across Bangladesh
            facing natural disasters. Every Taka counts.
          </p>
        </header>

        {/* 4 Cards in 1 Row / Serial on Desktop */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 xl:gap-6">
          {campaigns.map((campaign) => {
            const Icon = campaign.icon;
            const percentage = Math.min(
              100,
              Math.round((campaign.raised / campaign.target) * 100),
            );

            return (
              <article
                key={campaign.id}
                className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
              >
                {/* Compact Card Header Image */}
                <div className="relative h-44 w-full overflow-hidden sm:h-48">
                  <Image
                    src={campaign.image}
                    alt={campaign.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/20 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-800 shadow-sm backdrop-blur-md">
                    <Icon size={13} className="text-emerald-700" />
                    <span>{campaign.category}</span>
                  </div>

                  {/* Funding Percentage Tag on Image */}
                  <div className="absolute bottom-2.5 right-3 rounded-md bg-slate-950/70 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-xs">
                    {percentage}% Funded
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h3 className="line-clamp-2 min-h-[44px] text-base font-bold leading-snug tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {campaign.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 min-h-[36px] text-xs leading-5 text-slate-500">
                    {campaign.description}
                  </p>

                  {/* Progress Section */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                          Raised
                        </span>
                        <p className="text-sm font-bold text-emerald-700">
                          {formatBDT(campaign.raised)}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                          Goal
                        </span>
                        <p className="text-xs font-semibold text-slate-600">
                          {formatBDT(campaign.target)}
                        </p>
                      </div>
                    </div>

                    <div
                      className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
                      role="progressbar"
                      aria-label={`${campaign.title} funding progress`}
                      aria-valuenow={percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Users size={14} className="text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700">
                        {campaign.donors}
                      </span>
                      <span className="text-[11px] text-slate-400">donors</span>
                    </div>

                    <Link
                      href={`/donate?campaign=${campaign.id}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                    >
                      <span>Donate</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-slate-500 sm:text-sm">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
          Every donation can help deliver essential relief to families.
        </div>
      </div>
    </section>
  );
}
