"use client";

import {
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  RefreshCw,
  Users,
} from "lucide-react";
import type { IRescueRequest } from "@/types";

export interface MyTaskCardProps {
  task: IRescueRequest;
  onUpdateStatus: (task: IRescueRequest) => void;
  onQuickStart?: (task: IRescueRequest) => void;
  onQuickComplete?: (task: IRescueRequest) => void;
}

export function MyTaskCard({
  task,
  onUpdateStatus,
  onQuickStart,
  onQuickComplete,
}: MyTaskCardProps) {
  const isCritical = task.urgency === "CRITICAL";
  const isHigh = task.urgency === "HIGH";
  const isRescued = task.status === "RESCUED";
  const isInProgress = task.status === "IN_PROGRESS";
  const isAssigned = task.status === "ASSIGNED" || task.status === "PENDING";

  return (
    <div
      className={`rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
        isRescued
          ? "border-teal-200 bg-linear-to-b from-teal-50/20 to-white"
          : isCritical
            ? "border-red-200 bg-linear-to-b from-red-50/20 to-white"
            : "border-slate-200/80 bg-white"
      }`}
    >
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          {/* Urgency */}
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
            <span>{task.urgency}</span>
          </span>

          {/* Status */}
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
              isRescued
                ? "bg-teal-50 text-teal-700 border-teal-200"
                : isInProgress
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {isRescued ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            <span>{task.status}</span>
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

        {/* Shelter Info if any */}
        {task.shelter && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Shelter: {task.shelter.name}</span>
          </div>
        )}

        {/* People Count & Contact Phone */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 font-bold text-slate-700">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <span>{task.peopleCount} People</span>
          </span>

          <a
            href={`tel:${task.contactPhone}`}
            className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
          >
            <Phone className="h-3.5 w-3.5 text-emerald-600" />
            <span>{task.contactPhone}</span>
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        {/* Quick Transition button */}
        {isAssigned && onQuickStart && (
          <button
            type="button"
            onClick={() => onQuickStart(task)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <span>Start Operation (অভিযান শুরু)</span>
          </button>
        )}

        {isInProgress && onQuickComplete && (
          <button
            type="button"
            onClick={() => onQuickComplete(task)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white py-2 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Mark as Rescued (উদ্ধার সম্পন্ন)</span>
          </button>
        )}

        {/* Update Status Button */}
        <button
          type="button"
          onClick={() => onUpdateStatus(task)}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 py-2 text-xs font-bold transition-all cursor-pointer"
        >
          <RefreshCw className="h-3 w-3 text-slate-500" />
          <span>Change Mission Status</span>
        </button>
      </div>
    </div>
  );
}
