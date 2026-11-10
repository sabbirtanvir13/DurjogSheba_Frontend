"use client";

import {
  Building2,
  ExternalLink,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { IShelter } from "@/types";

export interface ShelterCardProps {
  shelter: IShelter;
}

export function ShelterCard({ shelter }: ShelterCardProps) {
  const capacity = shelter.capacity || 1;
  const current = shelter.currentPeople || 0;
  const vacancy = Math.max(0, capacity - current);
  const occupancyRate = Math.min(100, Math.round((current / capacity) * 100));

  const isFull = occupancyRate >= 95;
  const isCrowded = occupancyRate >= 75 && occupancyRate < 95;

  const mapQuery = encodeURIComponent(
    `${shelter.name}, ${shelter.upazila || ""}, ${shelter.district || ""}, Bangladesh`,
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 md:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      <div className="space-y-3.5">
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0 border border-emerald-100">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-slate-900 text-sm md:text-base leading-snug line-clamp-1">
                {shelter.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {shelter.upazila ? `${shelter.upazila}, ` : ""}
                {shelter.district}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full shrink-0 border ${
              isFull
                ? "bg-red-50 text-red-700 border-red-200"
                : isCrowded
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isFull
                  ? "bg-red-600"
                  : isCrowded
                    ? "bg-amber-500"
                    : "bg-emerald-500 animate-pulse"
              }`}
            />
            <span>{isFull ? "Full" : `${vacancy} Vacant`}</span>
          </span>
        </div>

        {/* Address */}
        {shelter.address && (
          <div className="flex items-start gap-1.5 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/70">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2 leading-relaxed">
              {shelter.address}
            </span>
          </div>
        )}

        {/* Live Occupancy Gauge */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              <span>
                Occupancy: {current.toLocaleString()} /{" "}
                {capacity.toLocaleString()}
              </span>
            </span>
            <span
              className={`font-black ${
                isFull
                  ? "text-red-600"
                  : isCrowded
                    ? "text-amber-600"
                    : "text-emerald-600"
              }`}
            >
              {occupancyRate}%
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isFull
                  ? "bg-red-500"
                  : isCrowded
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              }`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Contact Person & Phone */}
        <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
          {shelter.contactPerson && (
            <div className="flex items-center gap-1.5 text-slate-600">
              <User className="h-3.5 w-3.5 text-slate-400" />
              <span className="truncate">Contact: {shelter.contactPerson}</span>
            </div>
          )}

          {shelter.contactPhone && (
            <div className="flex items-center justify-between">
              <a
                href={`tel:${shelter.contactPhone}`}
                className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-600" />
                <span>{shelter.contactPhone}</span>
              </a>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <span>Map</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <a
          href={`tel:${shelter.contactPhone}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 py-2.5 text-xs font-bold transition-all"
        >
          <Phone className="h-3.5 w-3.5 text-emerald-600" />
          <span>Call Shelter</span>
        </a>

        <Link
          href={`/shelters/${shelter.id || shelter._id}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2.5 text-xs font-bold transition-all shadow-xs"
        >
          <span>Shelter Details</span>
        </Link>
      </div>
    </div>
  );
}
