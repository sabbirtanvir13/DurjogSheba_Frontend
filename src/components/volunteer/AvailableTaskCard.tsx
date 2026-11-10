"use client";

import {
  Building2,
  Calendar,
  MapPin,
  Phone,
  UserPlus,
  Users,
} from "lucide-react";
import type { IRescueRequest } from "@/types";

export interface AvailableTaskCardProps {
  task: IRescueRequest;
  onAccept: (task: IRescueRequest) => void;
  isPending?: boolean;
}

export function AvailableTaskCard({
  task,
  onAccept,
  isPending,
}: AvailableTaskCardProps) {
  const isCritical = task.urgency === "CRITICAL";
  const isHigh = task.urgency === "HIGH";

  return (
    <div
      className={`rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
        isCritical
          ? "border-red-200/90 bg-linear-to-b from-red-50/30 via-white to-white"
          : "border-slate-200/80 bg-white"
      }`}
    >
      <div className="space-y-3">
        {/* Card Header: Urgency Badge + People Count */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border ${
              isCritical
                ? "bg-red-100 text-red-700 border-red-300 animate-pulse"
                : isHigh
                  ? "bg-amber-100 text-amber-800 border-amber-300"
                  : "bg-blue-50 text-blue-700 border-blue-200"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isCritical
                  ? "bg-red-600"
                  : isHigh
                    ? "bg-amber-600"
                    : "bg-blue-600"
              }`}
            />
            <span>{task.urgency} Urgency</span>
          </span>

          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
            <Users className="h-3.5 w-3.5 text-slate-500" />
            <span>{task.peopleCount} People</span>
          </span>
        </div>

        {/* Location & Details */}
        <div>
          <div className="flex items-start gap-1.5 font-bold text-slate-900 text-sm">
            <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{task.location}</span>
          </div>

          {task.description && (
            <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        {/* Shelter details if any */}
        {task.shelter && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              Target Shelter: {task.shelter.name}
            </span>
          </div>
        )}

        {/* Contact Phone & Timestamp */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <a
            href={`tel:${task.contactPhone}`}
            className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800"
          >
            <Phone className="h-3.5 w-3.5 text-emerald-600" />
            <span>{task.contactPhone}</span>
          </a>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar className="h-3 w-3" />
            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        disabled={isPending}
        onClick={() => onAccept(task)}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2.5 text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
      >
        <UserPlus className="h-4 w-4" />
        <span>Accept & Take Mission</span>
      </button>
    </div>
  );
}
