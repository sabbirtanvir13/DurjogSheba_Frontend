"use client";

import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  Users,
  X,
} from "lucide-react";
import type { IRescueRequest } from "@/types";

export interface TaskConfirmationModalProps {
  task: IRescueRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (taskId: string) => Promise<void>;
  isPending?: boolean;
}

export function TaskConfirmationModal({
  task,
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: TaskConfirmationModalProps) {
  if (!isOpen || !task) return null;

  const isCritical = task.urgency === "CRITICAL";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal overlay"
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity cursor-default border-none w-full h-full"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Accept Rescue Mission
              </h3>
              <p className="text-xs text-slate-500">
                You are about to self-assign this emergency response mission.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Task Details Summary */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <MapPin className="h-4 w-4 text-red-500 shrink-0" />
              <span>{task.location}</span>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black border ${
                isCritical
                  ? "bg-red-100 text-red-700 border-red-300 animate-pulse"
                  : "bg-amber-100 text-amber-800 border-amber-300"
              }`}
            >
              <AlertTriangle className="h-3 w-3" />
              <span>{task.urgency}</span>
            </span>
          </div>

          {task.description && (
            <p className="text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200">
              {task.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-slate-400" />
              <span>
                People: <strong>{task.peopleCount} individuals</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-emerald-600" />
              <span>
                Contact: <strong>{task.contactPhone}</strong>
              </span>
            </div>
          </div>

          {task.shelter && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-emerald-50/60 text-emerald-800 p-2 rounded-lg border border-emerald-200">
              <Building2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                Designated Shelter: {task.shelter.name} (
                {task.shelter.district || "Shelter"})
              </span>
            </div>
          )}
        </div>

        {/* Commitment Notice */}
        <div className="mt-4 p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 text-xs text-amber-900">
          <p className="font-semibold">⚠️ Important Field Protocol:</p>
          <p className="text-[11px] text-amber-800 mt-0.5">
            By accepting, you confirm you are prepared to coordinate immediate
            response. Please call the emergency contact number right away upon
            assignment.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => onConfirm(task.id)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <CheckCircle2 className="h-4 w-4" />
            <span>Confirm & Take Mission</span>
          </button>
        </div>
      </div>
    </div>
  );
}
