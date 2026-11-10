"use client";

import { Loader2, MapPin, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { IRescueRequest, IUser } from "@/types";

export interface AssignVolunteerModalProps {
  rescue: IRescueRequest | null;
  volunteers: IUser[];
  volunteerTaskCountMap?: Map<string, number>;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (rescueId: string, volunteerId: string) => Promise<void>;
  isPending?: boolean;
}

export function AssignVolunteerModal({
  rescue,
  volunteers,
  volunteerTaskCountMap,
  isOpen,
  onClose,
  onAssign,
  isPending,
}: AssignVolunteerModalProps) {
  const [selectedVolunteerId, setSelectedVolunteerId] = useState("");

  useEffect(() => {
    if (rescue) {
      setSelectedVolunteerId(rescue.assignedToId || "");
    }
  }, [rescue]);

  if (!isOpen || !rescue) return null;

  const handleConfirm = () => {
    if (!selectedVolunteerId) return;
    onAssign(rescue.id, selectedVolunteerId);
  };

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
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Assign Volunteer to Rescue
              </h3>
              <p className="text-xs text-slate-500">
                Select an active volunteer to handle this emergency distress
                call.
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

        {/* Rescue Details Summary */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <MapPin className="h-4 w-4 text-red-500" />
              <span>{rescue.location}</span>
            </div>
            <span className="font-extrabold text-red-600 uppercase">
              {rescue.urgency}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>Affected: {rescue.peopleCount} People</span>
            <span>Contact: {rescue.contactPhone}</span>
          </div>
        </div>

        {/* Volunteer Selection List */}
        <div className="mt-4 space-y-2">
          <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select Volunteer ({volunteers.length} Available)
          </span>

          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 border border-slate-200 rounded-xl p-2 bg-slate-50/50">
            {volunteers.map((vol) => {
              const isSelected = selectedVolunteerId === vol.id;
              const activeTasks = volunteerTaskCountMap?.get(vol.id) || 0;
              const isReady = vol.status === "ACTIVE";

              return (
                <button
                  key={vol.id}
                  type="button"
                  onClick={() => setSelectedVolunteerId(vol.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {vol.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {vol.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {vol.phoneNumber || vol.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isReady
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {vol.status || "ACTIVE"}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {activeTasks} tasks
                    </span>
                  </div>
                </button>
              );
            })}

            {volunteers.length === 0 && (
              <p className="text-xs text-center text-slate-400 py-4">
                No registered volunteers found.
              </p>
            )}
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
            disabled={!selectedVolunteerId || isPending}
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Confirm Assignment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
