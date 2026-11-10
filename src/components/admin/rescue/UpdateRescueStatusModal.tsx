"use client";

import { CheckCircle2, Loader2, RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { IRescueRequest, RescueStatus } from "@/types";

const RESCUE_STATUSES: RescueStatus[] = [
  "PENDING",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESCUED",
  "CANCELLED",
];

export interface UpdateRescueStatusModalProps {
  rescue: IRescueRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (rescueId: string, status: RescueStatus) => Promise<void>;
  isPending?: boolean;
}

export function UpdateRescueStatusModal({
  rescue,
  isOpen,
  onClose,
  onUpdateStatus,
  isPending,
}: UpdateRescueStatusModalProps) {
  const [newStatus, setNewStatus] = useState<RescueStatus | "">("");

  useEffect(() => {
    if (rescue) {
      setNewStatus(rescue.status);
    }
  }, [rescue]);

  if (!isOpen || !rescue) return null;

  const handleConfirm = () => {
    if (!newStatus) return;
    onUpdateStatus(rescue.id, newStatus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal overlay"
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity cursor-default border-none w-full h-full"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Update Rescue Status
              </h3>
              <p className="text-xs text-slate-500">
                Change operational status of this rescue operation.
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

        <div className="mt-4 space-y-3">
          <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            New Status
          </span>

          <div className="grid grid-cols-1 gap-2">
            {RESCUE_STATUSES.map((status) => {
              const isSelected = newStatus === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setNewStatus(status)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span>{status}</span>
                  {isSelected && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

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
            disabled={!newStatus || isPending}
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Update Status</span>
          </button>
        </div>
      </div>
    </div>
  );
}

