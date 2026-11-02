"use client";

import {
  ArrowRight,
  CheckCircle2,
  Droplets,
  HandHeart,
  HeartPulse,
  Package,
} from "lucide-react";
import { useEffect, useState } from "react";

const reliefItems = [
  {
    id: "food",
    title: "Food",
    subtitle: "Nutritional food supplies",
    icon: Package,
    needed: 500,
    received: 340,
    unit: "food kits",
    color: "emerald",
  },
  {
    id: "water",
    title: "Clean Water",
    subtitle: "Safe drinking water",
    icon: Droplets,
    needed: 500,
    received: 280,
    unit: "water kits",
    color: "blue",
  },
  {
    id: "medicine",
    title: "Medicine",
    subtitle: "Essential medical supplies",
    icon: HeartPulse,
    needed: 500,
    received: 190,
    unit: "medical kits",
    color: "rose",
  },
];

export default function UrgentReliefNeeds() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const selected = reliefItems.find((item) => item.id === selectedItem);

  useEffect(() => {
    if (!selected) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedItem(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  return (
    <section
      id="urgent-relief-needs"
      className="w-full bg-[#f4f7fb] px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 text-center">
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            Community Support
          </span>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Urgent Relief Needs
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            Help provide essential supplies to communities in need. Every
            contribution makes a difference.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reliefItems.map((item) => {
            const Icon = item.icon;
            const progress = Math.min(
              100,
              Math.round((item.received / item.needed) * 100),
            );

            const colors = {
              emerald: {
                icon: "bg-emerald-50 text-emerald-600",
                bar: "bg-emerald-500",
                button: "bg-emerald-600 hover:bg-emerald-700",
              },
              blue: {
                icon: "bg-blue-50 text-blue-600",
                bar: "bg-blue-500",
                button: "bg-blue-600 hover:bg-blue-700",
              },
              rose: {
                icon: "bg-rose-50 text-rose-600",
                bar: "bg-rose-500",
                button: "bg-rose-600 hover:bg-rose-700",
              },
            } as const;

            const theme = colors[item.color as keyof typeof colors];

            return (
              <article
                key={item.id}
                className="group rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-5"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme.icon}`}
                    >
                      <Icon size={19} strokeWidth={1.8} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <CheckCircle2
                    size={17}
                    className="shrink-0 text-emerald-500"
                    aria-label="Relief category"
                  />
                </div>

                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">
                    {item.received} {item.unit} received
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {progress}%
                  </span>
                </div>

                <div
                  className="h-1.5 overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                  aria-label={`${item.title} target progress`}
                  aria-valuemin={0}
                  aria-valuemax={item.needed}
                  aria-valuenow={item.received}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${theme.bar}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                  <span>Received: {item.received}</span>
                  <span>Target: {item.needed}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedItem(item.id)}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${theme.button}`}
                >
                  <HandHeart size={15} />
                  Support This Need
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              </article>
            );
          })}
        </div>

        <div className="mt-5 text-center">
          <a
            href="#how-we-help"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-700"
          >
            See how we help
            <ArrowRight size={15} />
          </a>
        </div>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Accessible Backdrop button */}
            <button
              type="button"
              aria-label="Close dialog"
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity"
              onClick={() => setSelectedItem(null)}
            />

            {/* Dialog Container */}
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="relief-dialog-title"
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <HandHeart size={24} />
              </div>

              <h3
                id="relief-dialog-title"
                className="text-xl font-bold text-slate-900"
              >
                Support {selected.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your contribution can help provide{" "}
                {selected.subtitle.toLowerCase()} to people in need.
              </p>

              <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                Connect this action to your verified donation workflow before
                accepting real contributions.
              </p>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}