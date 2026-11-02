"use client";
"use client";

import {
  AlertCircle,
  BellRing,
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  ShieldAlert,
} from "lucide-react";

type EmergencyAlert = {
  id: string;
  title: string;
  location: string;
  description: string;
  date: string;
  priority: "High" | "Medium";
};

const alerts: EmergencyAlert[] = [
  {
    id: "EA-001",
    title: "Flood Relief Emergency",
    location: "Affected communities, Bangladesh",
    description:
      "Emergency relief support is needed for families affected by flooding.",
    date: "Active now",
    priority: "High",
  },
  {
    id: "EA-002",
    title: "Urgent Emergency Assistance",
    location: "Local response area",
    description:
      "Community members can review the latest assistance requirements.",
    date: "Recently updated",
    priority: "Medium",
  },
];

export default function EmergencyAlerts() {
  return (
    <section
      aria-labelledby="emergency-alerts-heading"
      className="w-full bg-[#f5f8fc] px-4 py-10 sm:px-6 sm:py-14"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-7 flex flex-col items-center text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-100">
            <BellRing size={19} aria-hidden="true" />
          </div>

          <h2
            id="emergency-alerts-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Emergency Alerts
          </h2>

          <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
            Stay informed about urgent situations and community assistance
            needs.
          </p>
        </header>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 bg-[#d92d36] px-4 py-3 text-white sm:px-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                <ShieldAlert size={16} aria-hidden="true" />
              </span>

              <div>
                <h3 className="text-sm font-bold">Active Emergency Alerts</h3>
                <p className="mt-0.5 text-[11px] text-red-100">
                  Review important community updates
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-full border border-white/30 bg-white/10 px-2.5 py-1 text-[11px] font-semibold">
              {alerts.length} Alerts
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {alerts.map((alert) => (
              <article
                key={alert.id}
                className="group p-4 transition-colors hover:bg-slate-50/80 sm:px-5 sm:py-5"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      alert.priority === "High"
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    <AlertCircle size={19} aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-800">
                        {alert.title}
                      </h4>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          alert.priority === "High"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {alert.priority} Priority
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs leading-5 text-slate-500">
                      {alert.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={13} aria-hidden="true" />
                        {alert.location}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 size={13} aria-hidden="true" />
                        {alert.date}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("emergency-alert:details", {
                          detail: alert,
                        }),
                      );
                    }}
                    aria-label={`View details for ${alert.title}`}
                    className="mt-1 inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    <span className="hidden sm:inline">View Details</span>
                    <ChevronRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <footer className="border-t border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-5">
            <p className="flex items-center gap-2 text-xs leading-5 text-slate-500">
              <CalendarDays size={14} className="shrink-0" aria-hidden="true" />
              Please verify alert information with your authorized emergency
              response team.
            </p>
          </footer>
        </div>
      </div>
    </section>
  );
}
