"use client";

import { Globe, Save, Server, Settings, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { useGetMe } from "@/hooks";

export default function AdminSettingsPage() {
  const { data: user } = useGetMe();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoVerifyVolunteers, setAutoVerifyVolunteers] = useState(false);
  const [language, setLanguage] = useState("en");

  const handleSave = () => {
    toast.success("System & platform settings updated successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Settings className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            System & Admin Settings
          </h1>
          <p className="text-xs text-slate-500">
            Platform governance, automated dispatch rules, and coordinator
            preferences.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Profile Card */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {user?.name || "Root Admin"}
              </p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <Link
            href="/admin/profile"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span>View Profile</span>
          </Link>
        </div>

        {/* Global Platform Controls */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            <Server className="h-4 w-4 text-emerald-700" />
            <span>Platform Governance Rules</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-bold text-slate-800">
                  Auto-Approve Certified Volunteers
                </p>
                <p className="text-slate-500">
                  Allow volunteers with verified NID or humanitarian credentials
                  to immediately self-assign rescue tasks.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoVerifyVolunteers}
                onChange={(e) => setAutoVerifyVolunteers(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
              />
            </label>

            <div className="h-px bg-slate-100" />

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-bold text-slate-800">Maintenance Mode</p>
                <p className="text-slate-500">
                  Restrict platform access to emergency operators only during
                  database maintenance.
                </p>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
              />
            </label>
          </div>
        </div>

        {/* Language */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            <Globe className="h-4 w-4 text-emerald-700" />
            <span>Language</span>
          </div>

          <div className="max-w-xs text-xs">
            <label
              htmlFor="admin-lang"
              className="font-bold text-slate-700 block mb-1"
            >
              Default Language
            </label>
            <select
              id="admin-lang"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10"
            >
              <option value="en">English (Official)</option>
              <option value="bn">বাংলা (Bengali)</option>
            </select>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
