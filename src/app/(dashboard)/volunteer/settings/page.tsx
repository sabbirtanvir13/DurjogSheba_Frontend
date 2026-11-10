"use client";

import { Globe, Radio, Save, Settings, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { useGetMe } from "@/hooks";

export default function VolunteerSettingsPage() {
  const { data: user } = useGetMe();
  const [taskAlerts, setTaskAlerts] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState("en");

  const handleSave = () => {
    toast.success("Volunteer operational settings saved successfully!");
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
            Volunteer Settings
          </h1>
          <p className="text-xs text-slate-500">
            Configure rescue dispatch notifications and field response
            parameters.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Profile Card */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 text-lg font-bold text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : "V"}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {user?.name || "Field Responder"}
              </p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <Link
            href="/volunteer/profile"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span>View Profile</span>
          </Link>
        </div>

        {/* Dispatch Alerts */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            <Radio className="h-4 w-4 text-emerald-700" />
            <span>Field Dispatch & SOS Alerts</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-bold text-slate-800">
                  Instant Nearby SOS Task Notifications
                </p>
                <p className="text-slate-500">
                  Notify me immediately when an emergency rescue appeal is
                  broadcasted in my assigned district.
                </p>
              </div>
              <input
                type="checkbox"
                checked={taskAlerts}
                onChange={(e) => setTaskAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
              />
            </label>

            <div className="h-px bg-slate-100" />

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-bold text-slate-800">
                  Audible Alarm for Critical Rescues
                </p>
                <p className="text-slate-500">
                  Play priority alarm sound for level CRITICAL rescue requests.
                </p>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
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
              htmlFor="vol-lang"
              className="font-bold text-slate-700 block mb-1"
            >
              Interface Language
            </label>
            <select
              id="vol-lang"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10"
            >
              <option value="en">English</option>
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
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
}
