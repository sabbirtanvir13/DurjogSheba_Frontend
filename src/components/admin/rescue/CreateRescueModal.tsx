"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import { useState } from "react";
import type {
  ICreateRescueRequestInput,
  IShelter,
  UrgencyLevel,
} from "@/types";

const URGENCIES: UrgencyLevel[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

export interface CreateRescueModalProps {
  isOpen: boolean;
  onClose: () => void;
  shelters?: IShelter[];
  onCreate: (payload: ICreateRescueRequestInput) => Promise<void>;
  isPending?: boolean;
}

export function CreateRescueModal({
  isOpen,
  onClose,
  shelters = [],
  onCreate,
  isPending,
}: CreateRescueModalProps) {
  const [formData, setFormData] = useState<ICreateRescueRequestInput>({
    location: "",
    contactPhone: "",
    peopleCount: 1,
    urgency: "CRITICAL",
    description: "",
    shelterId: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location.trim() || !formData.contactPhone.trim()) return;

    await onCreate({
      location: formData.location.trim(),
      contactPhone: formData.contactPhone.trim(),
      peopleCount: Number(formData.peopleCount) || 1,
      urgency: formData.urgency,
      description: formData.description?.trim() || undefined,
      shelterId: formData.shelterId || undefined,
    });

    setFormData({
      location: "",
      contactPhone: "",
      peopleCount: 1,
      urgency: "CRITICAL",
      description: "",
      shelterId: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal overlay"
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity cursor-default border-none w-full h-full"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                New Emergency Rescue Request
              </h3>
              <p className="text-xs text-slate-500">
                Log distress location and assign field rescue team.
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="create-rescue-location"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="create-rescue-location"
              type="text"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="e.g. Uttara Sector 11, Bridge 3, Dhaka"
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="create-rescue-phone"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Contact Phone <span className="text-red-500">*</span>
              </label>
              <input
                id="create-rescue-phone"
                type="text"
                required
                value={formData.contactPhone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactPhone: e.target.value,
                  }))
                }
                placeholder="e.g. 01712345678"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="create-rescue-count"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                People Count <span className="text-red-500">*</span>
              </label>
              <input
                id="create-rescue-count"
                type="number"
                min="1"
                required
                value={formData.peopleCount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    peopleCount: Number(e.target.value),
                  }))
                }
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="create-rescue-urgency"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Urgency Level
              </label>
              <select
                id="create-rescue-urgency"
                value={formData.urgency}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    urgency: e.target.value as UrgencyLevel,
                  }))
                }
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all cursor-pointer"
              >
                {URGENCIES.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="create-rescue-shelter"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Target Shelter (Optional)
              </label>
              <select
                id="create-rescue-shelter"
                value={formData.shelterId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shelterId: e.target.value,
                  }))
                }
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all cursor-pointer"
              >
                <option value="">No Shelter Linked</option>
                {shelters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.district || "Shelter"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="create-rescue-desc"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Description & Situation Details
            </label>
            <textarea
              id="create-rescue-desc"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Explain water levels, elderly or children trapped, immediate medical help needed..."
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Create Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
