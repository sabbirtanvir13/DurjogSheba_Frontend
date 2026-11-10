"use client";

import { CheckCircle2, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { useGetMe, useGetMyAssignedRescues } from "@/hooks";
import type { IRescueRequest } from "@/types";

export default function VolunteerProfilePage() {
  const { data: user } = useGetMe();
  const { data: tasksResponse } = useGetMyAssignedRescues();

  const myTasks: IRescueRequest[] = tasksResponse?.data || [];
  const rescuedCount = myTasks.filter(
    (t: IRescueRequest) => t.status === "RESCUED",
  ).length;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <User className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Volunteer Profile
          </h1>
          <p className="text-xs text-slate-500">
            Emergency field responder credentials and deployment metrics.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-2xl font-bold text-white shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : "V"}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                {user?.name || "Field Volunteer"}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Verified Responder
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Role:{" "}
              <span className="font-semibold text-slate-700">
                {user?.role || "VOLUNTEER"}
              </span>
            </p>
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
            <Mail className="h-5 w-4 text-slate-400" />
            <div>
              <p className="text-[11px] font-semibold uppercase text-slate-400">
                Email Address
              </p>
              <p className="text-xs font-bold text-slate-800">
                {user?.email || "volunteer@durjogsheba.gov.bd"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
            <Phone className="h-5 w-4 text-slate-400" />
            <div>
              <p className="text-[11px] font-semibold uppercase text-slate-400">
                Contact Phone
              </p>
              <p className="text-xs font-bold text-slate-800">
                {user?.phoneNumber || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Operational Statistics */}
        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
            Field Operations Track Record
          </p>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-[11px] text-slate-500">Assigned Tasks</p>
              <p className="text-xl font-black text-slate-900">
                {myTasks.length}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Completed Rescues</p>
              <p className="text-xl font-black text-emerald-700">
                {rescuedCount}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Status</p>
              <p className="text-xs font-bold text-emerald-700 mt-1 inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Ready for Dispatch
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
