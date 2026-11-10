"use client";

import {
  Loader2,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import type { IUser } from "@/types";

export interface VolunteerTableProps {
  volunteers: IUser[];
  isLoading?: boolean;
  taskCountMap?: Map<string, number>;
  onStatusClick: (volunteer: IUser) => void;
}

export function VolunteerTable({
  volunteers,
  isLoading,
  taskCountMap,
  onStatusClick,
}: VolunteerTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                Volunteer Info
              </th>
              <th scope="col" className="px-4 py-3.5">
                Contact Phone
              </th>
              <th scope="col" className="px-4 py-3.5">
                Verification
              </th>
              <th scope="col" className="px-4 py-3.5">
                Account Status
              </th>
              <th scope="col" className="px-4 py-3.5">
                Active Tasks
              </th>
              <th scope="col" className="px-4 py-3.5">
                Joined Date
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {volunteers.map((vol) => {
              const initials = (vol.name || "Volunteer")
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              const assignedCount = taskCountMap?.get(vol.id) || 0;
              const isActive = vol.status === "ACTIVE";

              return (
                <tr
                  key={vol.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Profile */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-linear-to-br from-emerald-600 to-teal-700 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate max-w-[200px]">
                          {vol.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Mail className="h-3 w-3 shrink-0 text-slate-400" />
                          <span className="truncate max-w-[180px]">
                            {vol.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-4 whitespace-nowrap text-xs">
                    {vol.phoneNumber ? (
                      <a
                        href={`tel:${vol.phoneNumber}`}
                        className="inline-flex items-center gap-1.5 font-semibold text-slate-800 hover:text-emerald-600"
                      >
                        <Phone className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{vol.phoneNumber}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">
                        Not provided
                      </span>
                    )}
                  </td>

                  {/* Verification */}
                  <td className="px-4 py-4 whitespace-nowrap text-xs">
                    {vol.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                        <XCircle className="h-3.5 w-3.5 text-slate-400" />
                        <span>Unverified</span>
                      </span>
                    )}
                  </td>

                  {/* Account Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : vol.status === "BLOCKED"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive
                            ? "bg-emerald-600 animate-pulse"
                            : "bg-amber-500"
                        }`}
                      />
                      <span>{vol.status || "ACTIVE"}</span>
                    </span>
                  </td>

                  {/* Active Tasks */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                        assignedCount > 0
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <span>{assignedCount} Tasks</span>
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500">
                    {vol.createdAt
                      ? new Date(vol.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <button
                      type="button"
                      onClick={() => onStatusClick(vol)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Shield className="h-3 w-3 text-slate-500" />
                      <span>Change Status</span>
                    </button>
                  </td>
                </tr>
              );
            })}

            {volunteers.length === 0 && !isLoading && (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Users className="h-8 w-8 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-700">
                      No volunteers found
                    </p>
                    <p className="text-xs text-slate-400">
                      No volunteer accounts match the search or filter query.
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {isLoading && (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                    <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                    <span>Loading volunteers roster...</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
