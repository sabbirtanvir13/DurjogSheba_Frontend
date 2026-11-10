"use client";

import { Mail, Phone, ShieldCheck, User } from "lucide-react";
import { useGetMe } from "@/hooks";

export default function AdminProfilePage() {
  const { data: user } = useGetMe();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <User className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Admin Profile
          </h1>
          <p className="text-xs text-slate-500">
            System administration credentials and platform coordinator
            privileges.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold text-white shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                {user?.name || "System Administrator"}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Root Administrator
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Role:{" "}
              <span className="font-semibold text-slate-700">
                {user?.role || "ADMIN"}
              </span>
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
            <Mail className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-[11px] font-semibold uppercase text-slate-400">
                Email Address
              </p>
              <p className="text-xs font-bold text-slate-800">
                {user?.email || "admin@durjogsheba.gov.bd"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
            <Phone className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-[11px] font-semibold uppercase text-slate-400">
                Phone Number
              </p>
              <p className="text-xs font-bold text-slate-800">
                {user?.phoneNumber || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Privileges Badge */}
        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Administrative Access Permissions
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-lg bg-white border border-slate-200 px-3 py-1 font-semibold text-slate-700 shadow-2xs">
              User Management & Verification
            </span>
            <span className="rounded-lg bg-white border border-slate-200 px-3 py-1 font-semibold text-slate-700 shadow-2xs">
              Shelter Allocation & Inventory
            </span>
            <span className="rounded-lg bg-white border border-slate-200 px-3 py-1 font-semibold text-slate-700 shadow-2xs">
              Rescue Dispatch & Live Feed
            </span>
            <span className="rounded-lg bg-white border border-slate-200 px-3 py-1 font-semibold text-slate-700 shadow-2xs">
              Financial Audit & Receipts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
