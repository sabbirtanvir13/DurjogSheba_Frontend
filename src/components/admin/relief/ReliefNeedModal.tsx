"use client";

import { Loader2, PackageCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  ICreateReliefNeedInput,
  IReliefNeed,
  IShelter,
  ReliefStatus,
  Unit,
  UrgencyLevel,
} from "@/types";

const CATEGORIES = [
  "Food Supplies",
  "Dry Food",
  "Drinking Water",
  "Medical Supplies",
  "Hygiene & Sanitation",
  "Clothing & Bedding",
  "Baby Food & Essentials",
  "Emergency Equipment",
];

const UNITS: Unit[] = ["KG", "LITER", "PACKET", "PIECE", "BOX"];
const URGENCIES: UrgencyLevel[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const STATUSES: ReliefStatus[] = [
  "PENDING",
  "IN_PROGRESS",
  "FULFILLED",
  "CANCELLED",
];

export interface ReliefNeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  shelters?: IShelter[];
  initialData?: IReliefNeed | null;
  onSubmit: (data: ICreateReliefNeedInput) => Promise<void>;
  isPending?: boolean;
}

export function ReliefNeedModal({
  isOpen,
  onClose,
  shelters = [],
  initialData,
  onSubmit,
  isPending,
}: ReliefNeedModalProps) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState<ICreateReliefNeedInput>({
    shelterId: "",
    itemCategory: "Food Supplies",
    itemName: "",
    quantity: 100,
    fulfilled: 0,
    unit: "KG",
    urgency: "HIGH",
    status: "PENDING",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        shelterId: initialData.shelterId || "",
        itemCategory: initialData.itemCategory || "Food Supplies",
        itemName: initialData.itemName || "",
        quantity: initialData.quantity || 1,
        fulfilled: initialData.fulfilled || 0,
        unit: initialData.unit || "KG",
        urgency: initialData.urgency || "HIGH",
        status: initialData.status || "PENDING",
      });
    } else {
      setFormData({
        shelterId: String(shelters[0]?.id || ""),
        itemCategory: "Food Supplies",
        itemName: "",
        quantity: 100,
        fulfilled: 0,
        unit: "KG",
        urgency: "HIGH",
        status: "PENDING",
      });
    }
  }, [initialData, shelters]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shelterId || !formData.itemName.trim()) return;

    await onSubmit({
      ...formData,
      itemName: formData.itemName.trim(),
      quantity: Number(formData.quantity) || 1,
      fulfilled: Number(formData.fulfilled) || 0,
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
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isEditing
                  ? "Edit Relief Requirement"
                  : "Add Relief Requirement"}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? "Update required supplies, targets, and urgency level."
                  : "Post new relief demand requested by shelter coordinators."}
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
          {/* Shelter Selector */}
          <div>
            <label
              htmlFor="relief-shelterId"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Shelter Location <span className="text-red-500">*</span>
            </label>
            <select
              id="relief-shelterId"
              required
              value={formData.shelterId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, shelterId: e.target.value }))
              }
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="" disabled>
                Select Target Shelter
              </option>
              {shelters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.district || "Shelter"})
                </option>
              ))}
            </select>
          </div>

          {/* Item Category & Item Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="relief-category"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="relief-category"
                required
                value={formData.itemCategory}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    itemCategory: e.target.value,
                  }))
                }
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="relief-itemName"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                id="relief-itemName"
                type="text"
                required
                value={formData.itemName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, itemName: e.target.value }))
                }
                placeholder="e.g. Miniket Rice, ORS, Water Filter"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="relief-quantity"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Total Quantity Needed <span className="text-red-500">*</span>
              </label>
              <input
                id="relief-quantity"
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Number(e.target.value),
                  }))
                }
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="relief-unit"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Unit
              </label>
              <select
                id="relief-unit"
                value={formData.unit}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    unit: e.target.value as Unit,
                  }))
                }
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fulfilled so far & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="relief-fulfilled"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Already Fulfilled / Delivered
              </label>
              <input
                id="relief-fulfilled"
                type="number"
                min="0"
                value={formData.fulfilled}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fulfilled: Number(e.target.value),
                  }))
                }
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="relief-urgency"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Urgency Level
              </label>
              <select
                id="relief-urgency"
                value={formData.urgency}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    urgency: e.target.value as UrgencyLevel,
                  }))
                }
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                {URGENCIES.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="relief-status"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Progress Status
            </label>
            <select
              id="relief-status"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as ReliefStatus,
                }))
              }
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isEditing ? "Save Changes" : "Create Demand"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
