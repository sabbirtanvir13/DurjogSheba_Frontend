"use client";

import { CheckCircle2, Loader2, PackageCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { IReliefNeed, ReliefStatus } from "@/types";

export interface UpdateFulfillmentModalProps {
  need: IReliefNeed | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    needId: string,
    fulfilled: number,
    status: ReliefStatus,
  ) => Promise<void>;
  isPending?: boolean;
}

export function UpdateFulfillmentModal({
  need,
  isOpen,
  onClose,
  onUpdate,
  isPending,
}: UpdateFulfillmentModalProps) {
  const [fulfilled, setFulfilled] = useState(0);
  const [status, setStatus] = useState<ReliefStatus>("PENDING");

  useEffect(() => {
    if (need) {
      setFulfilled(need.fulfilled || 0);
      setStatus(need.status || "PENDING");
    }
  }, [need]);

  if (!isOpen || !need) return null;

  const total = need.quantity || 1;
  const percentage = Math.min(100, Math.round((fulfilled / total) * 100));

  const handleQuickAdd = (amount: number) => {
    const updated = Math.min(total, fulfilled + amount);
    setFulfilled(updated);
    if (updated >= total) {
      setStatus("FULFILLED");
    } else if (updated > 0) {
      setStatus("IN_PROGRESS");
    }
  };

  const handleConfirm = () => {
    onUpdate(need.id, Number(fulfilled), status);
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
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Update Distribution Progress
              </h3>
              <p className="text-xs text-slate-500">
                Log newly received and distributed supplies.
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

        {/* Item Info Summary */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-900 text-sm">
              {need.itemName}
            </span>
            <span className="text-slate-500 font-semibold">
              {need.itemCategory}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>
              Target:{" "}
              <strong>
                {need.quantity} {need.unit}
              </strong>
            </span>
            <span>
              Delivered:{" "}
              <strong>
                {fulfilled} {need.unit} ({percentage}%)
              </strong>
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                percentage >= 100 ? "bg-teal-500" : "bg-blue-600"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Form Controls */}
        <div className="mt-4 space-y-3">
          <div>
            <label
              htmlFor="fulfilled-count-input"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Delivered Amount ({need.unit})
            </label>
            <input
              id="fulfilled-count-input"
              type="number"
              min="0"
              value={fulfilled}
              onChange={(e) => {
                const val = Number(e.target.value);
                setFulfilled(val);
                if (val >= total) setStatus("FULFILLED");
                else if (val > 0) setStatus("IN_PROGRESS");
              }}
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-bold"
            />
          </div>

          {/* Quick Increment Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500">
              Quick Add:
            </span>
            <button
              type="button"
              onClick={() => handleQuickAdd(25)}
              className="text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              +25
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(100)}
              className="text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              +100
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(500)}
              className="text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              +500
            </button>
            <button
              type="button"
              onClick={() => {
                setFulfilled(total);
                setStatus("FULFILLED");
              }}
              className="text-[11px] font-bold px-2 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 ml-auto transition-colors"
            >
              Mark Full
            </button>
          </div>

          <div>
            <label
              htmlFor="fulfillment-status-select"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Update Status
            </label>
            <select
              id="fulfillment-status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as ReliefStatus)}
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer"
            >
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="FULFILLED">FULFILLED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
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
            disabled={isPending}
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <CheckCircle2 className="h-4 w-4" />
            <span>Save Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
}
