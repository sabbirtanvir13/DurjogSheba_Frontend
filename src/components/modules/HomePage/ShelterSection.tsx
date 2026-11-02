"use client";

import { ArrowRight, House, MapPin, Users } from "lucide-react";

const shelters = [
  {
    id: 1,
    name: "Community Relief Shelter",
    location: "Sylhet, Bangladesh",
    available: 85,
    capacity: 150,
  },
  {
    id: 2,
    name: "Flood Rescue Center",
    location: "Sunamganj, Bangladesh",
    available: 24,
    capacity: 100,
  },
  {
    id: 3,
    name: "Emergency Safe Shelter",
    location: "Cumilla, Bangladesh",
    available: 0,
    capacity: 80,
  },
];

export default function ShelterSection() {
  return (
    <section className="bg-[#f5f8fc] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Find Safe Accommodation
          </span>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Available Shelters
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Explore emergency shelters and check available capacity for people
            affected by disasters.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shelters.map((shelter) => {
            const full = shelter.available === 0;
            const occupied = shelter.capacity - shelter.available;
            const occupancy = Math.round((occupied / shelter.capacity) * 100);

            return (
              <article
                key={shelter.id}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <House size={23} strokeWidth={1.7} />
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      full
                        ? "bg-red-50 text-red-600"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {full ? "Full" : "Available"}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {shelter.name}
                </h3>

                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={16} className="shrink-0 text-emerald-600" />
                  {shelter.location}
                </p>

                <div className="mt-6 rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm text-slate-600">
                      <Users size={16} />
                      Available Capacity
                    </span>

                    <span className="text-lg font-bold text-slate-900">
                      {shelter.available}
                      <span className="text-xs font-medium text-slate-400">
                        {" "}
                        / {shelter.capacity}
                      </span>
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${
                        full ? "bg-red-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${occupancy}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    {occupied} occupied · {shelter.available} spaces available
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    alert(
                      `${shelter.name}\n${shelter.location}\nAvailable spaces: ${shelter.available}\n\nDemo only — details page coming soon.`,
                    )
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  View Shelter
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </article>
            );
          })}
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Demo preview · Shelter names and capacity figures are illustrative.
        </p>
      </div>
    </section>
  );
}
