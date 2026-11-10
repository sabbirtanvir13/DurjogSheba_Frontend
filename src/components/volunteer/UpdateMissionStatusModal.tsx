"use client";

import { CheckCircle2, Loader2, RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { IRescueRequest, RescueStatus } from "@/types";

const MISSION_STATUSES: {
  value: RescueStatus;
  label: string;
  desc: string;
  colorClass: string;
}[] = [
  {
    value: "ASSIGNED",
    label: "Assigned (অ্যাসাইন করা হয়েছে)",
    desc: "Mission accepted, preparing equipment and heading to field.",
    colorClass: "border-blue-500 text-blue-700 bg-blue-50/50",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress (অভিযান চলমান)",
    desc: "Currently on-site actively conducting rescue operations.",
    colorClass: "border-amber-500 text-amber-800 bg-amber-50/50",
  },
  {
    value: "RESCUED",
    label: "Rescued Safely (সফলভাবে উদ্ধার)",
    desc: "All affected individuals evacuated and delivered to safe shelter/medical unit.",
    colorClass: "border-teal-500 text-teal-800 bg-teal-50/50",
  },
  {
    value: "CANCELLED",
    label: "Cancelled (বাতিল)",
    desc: "Situation was resolved by another team or false alarm.",
    colorClass: "border-slate-400 text-slate-700 bg-slate-50",
  },
];

export interface UpdateMissionStatusModalProps {
  task: IRescueRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (taskId: string, status: RescueStatus) => Promise<void>;
  isPending?: boolean;
}

export function UpdateMissionStatusModal({
  task,
  isOpen,
  onClose,
  onUpdateStatus,
  isPending,
}: UpdateMissionStatusModalProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<RescueStatus>("ASSIGNED");

  useEffect(() => {
    if (task) {
      setSelectedStatus(task.status);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleConfirm = () => {
    onUpdateStatus(task.id, selectedStatus);
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
                Update Mission Status
              </h3>
              <p className="text-xs text-slate-500">
                Location: <strong>{task.location}</strong>
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

        {/* Status Options */}
        <div className="mt-4 space-y-2.5">
          <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select Current Mission Milestone
          </span>

          <div className="space-y-2">
            {MISSION_STATUSES.map((item) => {
              const isSelected = selectedStatus === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setSelectedStatus(item.value)}
                  className={`w-full flex items-start justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? `${item.colorClass} ring-2 ring-emerald-500/20`
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold">{item.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
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
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <CheckCircle2 className="h-4 w-4" />
            <span>Save Status</span>
          </button>
        </div>
      </div>
    </div>
  );
}
