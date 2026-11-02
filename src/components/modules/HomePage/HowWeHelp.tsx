"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";

const supportItems = [
  {
    id: "food",
    title: "Food",
    image: "🍲",
    description: "Nutritional food supplies",
    needed: "500 kits",
    progress: "68%",
    color: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    id: "water",
    title: "Clean Water",
    image: "💧",
    description: "Clean drinking water",
    needed: "500 kits",
    progress: "56%",
    color: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    id: "medicine",
    title: "Medicine",
    image: "🩺",
    description: "Essential medical supplies",
    needed: "500 kits",
    progress: "38%",
    color: "bg-emerald-600 hover:bg-emerald-700",
  },
];

export default function HowWeHelp() {
  return (
    <section id="how-we-help" className="w-full bg-[#f4f7fb] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-5 text-center text-xl font-bold tracking-tight text-[#243247] sm:text-2xl">
          How We Help
        </h2>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {supportItems.map((item) => (
            <article
              key={item.id}
              className="min-w-0 overflow-hidden rounded-md border border-[#e7edf3] bg-white p-2.5 shadow-[0_2px_8px_rgba(30,50,80,0.03)] transition-colors hover:border-emerald-200 sm:p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eff8f2] text-emerald-600">
                  <CheckCircle2 size={13} strokeWidth={2} />
                </div>

                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>

              <div className="flex h-[66px] items-center justify-center overflow-hidden sm:h-[90px]">
                <span
                  aria-hidden="true"
                  className="select-none text-4xl leading-none sm:text-6xl"
                >
                  {item.image}
                </span>
              </div>

              <h3 className="mt-2 truncate text-xs font-bold text-[#263449] sm:text-sm">
                {item.title}
              </h3>

              <p className="mt-1 min-h-[28px] text-[9px] leading-[1.5] text-slate-500 sm:min-h-[34px] sm:text-[11px]">
                {item.description}
              </p>

              <div className="mt-2 flex items-center justify-between gap-1 text-[9px] text-slate-500 sm:text-[10px]">
                <span className="truncate">Needed</span>
                <span className="font-semibold text-slate-700">
                  {item.needed}
                </span>
              </div>

              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: item.progress }}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("relief:support", {
                      detail: { id: item.id, title: item.title },
                    }),
                  );
                }}
                className={`mt-3 flex w-full items-center justify-center gap-1 rounded-sm px-1.5 py-2 text-[10px] font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:text-xs ${item.color}`}
              >
                Support
                <ArrowRight size={11} />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
