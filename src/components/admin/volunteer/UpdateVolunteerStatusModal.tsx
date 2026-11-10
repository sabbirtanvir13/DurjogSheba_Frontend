"use client";

import { CheckCircle2, Loader2, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { IUser, UserStatus } from "@/types";

const USER_STATUSES: UserStatus[] = [
  "ACTIVE",
  "BLOCKED",
  "PENDING",
  "SUSPENDED",
];

export interface UpdateVolunteerStatusModalProps {
  volunteer: IUser | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (userId: string, status: UserStatus) => Promise<void>;
  isPending?: boolean;
}

export function UpdateVolunteerStatusModal({
  volunteer,
  isOpen,
  onClose,
  onUpdateStatus,
  isPending,
}: UpdateVolunteerStatusModalProps) {
  const [newStatus, setNewStatus] = useState<UserStatus | "">("");

  useEffect(() => {
    if (volunteer) {
      setNewStatus(volunteer.status || "ACTIVE");
    }
  }, [volunteer]);

  if (!isOpen || !volunteer) return null;

  const handleConfirm = () => {
    if (!newStatus) return;
    onUpdateStatus(volunteer.id, newStatus);
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
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Volunteer Account Status
              </h3>
              <p className="text-xs text-slate-500">
                Update status for {volunteer.name}
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

        <div className="mt-4 space-y-2">
          <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select New Status
          </span>

          <div className="grid grid-cols-1 gap-2">
            {USER_STATUSES.map((status) => {
              const isSelected = newStatus === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setNewStatus(status)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-50 border-purple-500 text-purple-800 ring-2 ring-purple-500/20"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span>{status}</span>
                  {isSelected && (
                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Save Status</span>
          </button>
        </div>
      </div>
    </div>
  );
}
