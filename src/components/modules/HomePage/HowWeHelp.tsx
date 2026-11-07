"use client";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Droplets,
  HeartHandshake,
  HeartPulse,
  Home,
  LifeBuoy,
  PhoneCall,
  ShieldCheck,
  Siren,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ReliefPillar {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: typeof LifeBuoy;
  description: string;
  impactStat: string;
  features: string[];
  theme: {
    lightBg: string;
    border: string;
    accent: string;
    button: string;
    badgeBg: string;
    gradient: string;
    ring: string;
  };
  ctaLabel: string;
  ctaHref: string;
  isModal: boolean;
}

const reliefPillars: ReliefPillar[] = [
  {
    id: "rescue",
    title: "Emergency Rescue & Evacuation",
    subtitle: "Speedboat & Ground Rescue Squads",
    badge: "24/7 Rapid Action",
    icon: LifeBuoy,
    description:
      "Rapid mobilization of motorized rescue boats, life jackets, and trained volunteer teams to evacuate families trapped in floodwaters and cyclone zones.",
    impactStat: "4,250+ People Evacuated",
    features: [
      "GPS-guided rescue boat dispatch",
      "Special priority for children, elderly & sick",
      "Direct link with Fire Service & Navy units",
    ],
    theme: {
      lightBg: "bg-amber-50 text-amber-700",
      border: "hover:border-amber-300",
      accent: "text-amber-600",
      button: "bg-amber-600 hover:bg-amber-700 text-white",
      badgeBg: "bg-amber-100/90 text-amber-800",
      gradient: "from-amber-500/10 to-transparent",
      ring: "focus-visible:ring-amber-500",
    },
    ctaLabel: "Request Rescue",
    ctaHref: "/rescue-requests",
    isModal: false,
  },
  {
    id: "water-food",
    title: "Safe Drinking Water & Food Kits",
    subtitle: "Nutritional Family Survival Packs",
    badge: "Direct Distribution",
    icon: Droplets,
    description:
      "Supplying emergency dry rations, sealed drinking water canisters, and water purification tablets directly to isolated villages and cut-off haor communities.",
    impactStat: "32,000+ Survival Kits Delivered",
    features: [
      "7-day family dry ration survival pack",
      "Halazone water purification tablets (1,000L)",
      "Infant nutritional formula & therapeutic foods",
    ],
    theme: {
      lightBg: "bg-sky-50 text-sky-700",
      border: "hover:border-sky-300",
      accent: "text-sky-600",
      button: "bg-sky-600 hover:bg-sky-700 text-white",
      badgeBg: "bg-sky-100/90 text-sky-800",
      gradient: "from-sky-500/10 to-transparent",
      ring: "focus-visible:ring-sky-500",
    },
    ctaLabel: "Support Food & Water",
    ctaHref: "#",
    isModal: true,
  },
  {
    id: "medical",
    title: "Field Medicine & First Aid Care",
    subtitle: "Paramedic Teams & Mobile Clinics",
    badge: "Healthcare Relief",
    icon: HeartPulse,
    description:
      "Deploying volunteer physicians, emergency paramedics, trauma dressing, and life-saving medicines to prevent waterborne disease outbreaks in flooded zones.",
    impactStat: "8,900+ Patients Treated",
    features: [
      "Sterile wound trauma dressing & antiseptic kits",
      "Cholera, diarrhea & oral rehydration solutions",
      "Snakebite anti-venom & vital prescription drugs",
    ],
    theme: {
      lightBg: "bg-rose-50 text-rose-700",
      border: "hover:border-rose-300",
      accent: "text-rose-600",
      button: "bg-rose-600 hover:bg-rose-700 text-white",
      badgeBg: "bg-rose-100/90 text-rose-800",
      gradient: "from-rose-500/10 to-transparent",
      ring: "focus-visible:ring-rose-500",
    },
    ctaLabel: "Support Medical Aid",
    ctaHref: "#",
    isModal: true,
  },
  {
    id: "shelter",
    title: "Safe Shelters & Rehabilitation",
    subtitle: "150+ Verified Relief Centers",
    badge: "Temporary Accommodation",
    icon: Home,
    description:
      "Directing displaced families to verified safe shelters, providing clean bedding, emergency solar lights, sanitary facilities, and post-flood rebuilding aid.",
    impactStat: "120+ Safe Centers Active",
    features: [
      "Live shelter bed & capacity tracking",
      "Heavy-duty waterproof tarpaulins & mats",
      "Post-disaster home rebuilding support",
    ],
    theme: {
      lightBg: "bg-emerald-50 text-emerald-700",
      border: "hover:border-emerald-300",
      accent: "text-emerald-600",
      button: "bg-emerald-600 hover:bg-emerald-700 text-white",
      badgeBg: "bg-emerald-100/90 text-emerald-800",
      gradient: "from-emerald-500/10 to-transparent",
      ring: "focus-visible:ring-emerald-500",
    },
    ctaLabel: "Find Safe Shelters",
    ctaHref: "/shelters",
    isModal: false,
  },
];

const responseSteps = [
  {
    step: "01",
    title: "SOS Distress Alert",
    tag: "Instant Logging",
    description:
      "Affected citizens, relatives, or local spotters submit emergency location coordinates and family headcount.",
    icon: Siren,
  },
  {
    step: "02",
    title: "Verification & Triage",
    tag: "< 10 Min Response",
    description:
      "Central crisis coordination desk verifies urgency, cross-references with local administrations, and issues triage dispatch.",
    icon: ShieldCheck,
  },
  {
    step: "03",
    title: "Ground Squad Mobilization",
    tag: "Field Deployment",
    description:
      "Speedboats and volunteer squads deploy with ready-to-distribute dry rations, water purifiers, and trauma first-aid kits.",
    icon: LifeBuoy,
  },
  {
    step: "04",
    title: "Shelter & Continuing Care",
    tag: "Recovery Support",
    description:
      "Displaced families are transported to safe verified shelters with continuous healthcare and rebuilding assistance.",
    icon: HeartHandshake,
  },
];

const donationKits = [
  {
    id: "water-kit",
    title: "Water Purification & Hydration Kit",
    amount: "800",
    desc: "Provides 1,000 liters of purified safe water for two flood-affected families.",
  },
  {
    id: "food-pack",
    title: "7-Day Family Food Survival Pack",
    amount: "1500",
    desc: "Includes flattened rice (chira), molasses, dry biscuits, milk, and high-protein canned food.",
  },
  {
    id: "medical-kit",
    title: "Emergency First Aid & Trauma Box",
    amount: "2500",
    desc: "Supplies essential sterile bandages, antiseptics, oral saline, and anti-diarrheal medicines.",
  },
  {
    id: "combo-pack",
    title: "Complete Emergency Lifeline Pack",
    amount: "5000",
    desc: "Food, pure water, medical aid, and emergency waterproof tarpaulin for an entire household.",
  },
];

export default function HowWeHelp() {
  const [modalItem, setModalItem] = useState<ReliefPillar | null>(null);
  const [selectedKit, setSelectedKit] = useState<string>("food-pack");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!modalItem) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalItem(null);
        setIsSuccess(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalItem]);

  const handleSupportClick = (item: ReliefPillar) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("relief:support", {
          detail: { id: item.id, title: item.title },
        }),
      );
    }

    if (item.isModal) {
      setModalItem(item);
      setIsSuccess(false);
    }
  };

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setModalItem(null);
      setIsSuccess(false);
      setCustomAmount("");
    }, 2400);
  };

  return (
    <section
      id="how-we-help"
      aria-label="How Durjog Sheba Delivers Disaster Relief"
      className="relative overflow-hidden bg-gradient-to-b from-[#f7f9fc] via-white to-[#f4f7fa] py-16 sm:py-24"
    >
      {/* Decorative ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-blue-200/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-100/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-4 py-1.5 text-xs font-semibold text-emerald-800 shadow-xs backdrop-blur-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
            </span>
            <Sparkles size={13} className="text-emerald-600" />
            <span>Comprehensive Relief Ecosystem</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            How We Deliver{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">
              Lifesaving Relief
            </span>
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base lg:text-lg">
            When disasters hit Bangladesh, every second determines a life. Our
            volunteer-powered network coordinates swift rescue operations,
            delivers survival rations, provides field medical care, and ensures
            safe shelter for affected families.
          </p>
        </div>

        {/* 4 Core Relief Pillars Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {reliefPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${pillar.theme.border}`}
              >
                {/* Top card gradient accent */}
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${pillar.theme.gradient}`}
                />

                <div>
                  {/* Top Header Row with Icon and Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-xs transition-transform duration-300 group-hover:scale-105 ${pillar.theme.lightBg}`}
                    >
                      <Icon size={24} strokeWidth={2} />
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${pillar.theme.badgeBg}`}
                    >
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mt-5">
                    <h3 className="text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-700">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {pillar.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                    {pillar.description}
                  </p>

                  {/* Impact Stat Pill */}
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 p-2 text-xs font-semibold text-slate-800">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>{pillar.impactStat}</span>
                  </div>

                  {/* Key Features Bullet List */}
                  <ul className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                    {pillar.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2
                          size={14}
                          className={`mt-0.5 shrink-0 ${pillar.theme.accent}`}
                        />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Button */}
                <div className="mt-6 pt-2">
                  {pillar.isModal ? (
                    <button
                      type="button"
                      onClick={() => handleSupportClick(pillar)}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-xs transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${pillar.theme.button} ${pillar.theme.ring}`}
                    >
                      <span>{pillar.ctaLabel}</span>
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  ) : (
                    <Link
                      href={pillar.ctaHref}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-xs transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${pillar.theme.button} ${pillar.theme.ring}`}
                    >
                      <span>{pillar.ctaLabel}</span>
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* 4-Step Response Framework Pipeline */}
        <div className="mt-16 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-10 lg:p-12">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-8 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600">
                <Clock size={14} />
                <span>Rapid Response Pipeline</span>
              </div>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                From SOS Alert to Ground Delivery
              </h3>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-slate-500 sm:text-sm">
              Our streamlined protocol ensures every distress call is verified,
              dispatched, and resolved with total operational transparency.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {responseSteps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div key={step.step} className="relative flex flex-col">
                  {/* Step indicator */}
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 font-mono text-sm font-bold text-white shadow-sm">
                      {step.step}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                      {step.tag}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <StepIcon size={16} />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      {step.title}
                    </h4>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {step.description}
                  </p>

                  {/* Visual Arrow for desktop except last step */}
                  {idx < responseSteps.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="hidden lg:absolute lg:-right-4 lg:top-5 lg:block lg:text-slate-300"
                    >
                      <ArrowRight size={18} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Emergency Helpline & Quick SOS Banner */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-[#132338] to-slate-900 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-600/20 text-red-400 ring-1 ring-red-500/30">
                <PhoneCall size={26} className="animate-pulse" />
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-red-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    24/7 Disaster Helpline
                  </span>
                  <span className="text-xs text-slate-400">
                    Toll-Free National Response
                  </span>
                </div>
                <h4 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Need Immediate Emergency Help? Call{" "}
                  <a
                    href="tel:1090"
                    className="text-emerald-300 underline-offset-4 hover:underline"
                  >
                    1090
                  </a>{" "}
                  or{" "}
                  <a
                    href="tel:+8809612387564"
                    className="text-emerald-300 underline-offset-4 hover:underline"
                  >
                    +880 9612-387564
                  </a>
                </h4>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/rescue-requests"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-red-950/40 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 sm:text-sm"
              >
                <Siren size={16} />
                <span>Submit Rescue SOS</span>
              </Link>
              <Link
                href="/shelters"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-semibold text-white backdrop-blur-xs transition-all duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-sm"
              >
                <Home size={16} />
                <span>View Safe Shelters</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Support / Contribution Modal */}
      {modalItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop Button */}
          <button
            type="button"
            aria-label="Close modal backdrop"
            onClick={() => setModalItem(null)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all sm:p-8">
            <button
              type="button"
              aria-label="Close modal"
              onClick={() => setModalItem(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <X size={18} />
            </button>

            {isSuccess ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check size={32} />
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  Thank You for Your Support!
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Your commitment to support{" "}
                  <strong>{modalItem.title}</strong> has been logged. Our ground
                  team will allocate these supplies to high-priority disaster
                  zones immediately.
                </p>
                <div className="mt-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 size={13} />
                    Verified Relief Allocation
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePledgeSubmit}>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${modalItem.theme.lightBg}`}
                  >
                    <modalItem.icon size={22} />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Direct Humanitarian Contribution
                    </span>
                    <h3
                      id="modal-title"
                      className="text-lg font-bold text-slate-900"
                    >
                      Support {modalItem.title}
                    </h3>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {modalItem.description} Select a pre-assembled emergency kit
                  or enter a custom donation amount to dispatch immediate
                  provisions.
                </p>

                {/* Kit Options */}
                <div className="mt-4 space-y-2.5">
                  {donationKits.map((kit) => (
                    <label
                      key={kit.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                        selectedKit === kit.id
                          ? "border-emerald-600 bg-emerald-50/50 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="donation-kit"
                        value={kit.id}
                        checked={selectedKit === kit.id}
                        onChange={() => {
                          setSelectedKit(kit.id);
                          setCustomAmount("");
                        }}
                        className="mt-1 accent-emerald-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 sm:text-sm">
                            {kit.title}
                          </span>
                          <span className="font-mono text-xs font-bold text-emerald-700 sm:text-sm">
                            ৳{kit.amount}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                          {kit.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Custom Amount Field */}
                <div className="mt-4">
                  <label
                    htmlFor="custom-amount"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Or Custom Support Amount (BDT)
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 font-mono text-xs font-bold text-slate-400">
                      ৳
                    </span>
                    <input
                      id="custom-amount"
                      type="number"
                      min="100"
                      placeholder="e.g. 3500"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedKit("");
                      }}
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-8 pr-3 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModalItem(null)}
                    className="w-1/3 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 focus-visible:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                  >
                    <span>Confirm Emergency Support</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
