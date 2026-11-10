"use client";

import {
  AlertTriangle,
  Building2,
  Loader2,
  MapPin,
  Phone,
  RefreshCw,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import type { IRescueRequest } from "@/types";

export interface RescueTableProps {
  rescues: IRescueRequest[];
  isLoading?: boolean;
  onAssignClick: (rescue: IRescueRequest) => void;
  onStatusClick: (rescue: IRescueRequest) => void;
  onDeleteClick: (rescue: IRescueRequest) => void;
}

export function RescueTable({
  rescues,
  isLoading,
  onAssignClick,
  onStatusClick,
  onDeleteClick,
}: RescueTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                Location & Details
              </th>
              <th scope="col" className="px-4 py-3.5">
                People Affected
              </th>
              <th scope="col" className="px-4 py-3.5">
                Urgency
              </th>
              <th scope="col" className="px-4 py-3.5">
                Emergency Contact
              </th>
              <th scope="col" className="px-4 py-3.5">
                Assigned Volunteer
              </th>
              <th scope="col" className="px-4 py-3.5">
                Status
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rescues.map((rescue) => {
              const isUnassigned = !rescue.assignedToId;
              const isCritical = rescue.urgency === "CRITICAL";
              const isHigh = rescue.urgency === "HIGH";

              return (
                <tr
                  key={rescue.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    isUnassigned ? "bg-red-50/20" : ""
                  }`}
                >
                  {/* Location & Details */}
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                        <span className="truncate max-w-[240px] sm:max-w-[280px]">
                          {rescue.location}
                        </span>
                      </div>
                      {rescue.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 max-w-[320px]">
                          {rescue.description}
                        </p>
                      )}
                      {rescue.shelter && (
                        <div className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md mt-1">
                          <Building2 className="h-3 w-3 text-slate-400" />
                          <span>Shelter: {rescue.shelter.name}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* People Count */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 font-extrabold text-slate-800 text-xs px-2.5 py-1 bg-slate-100 rounded-lg">
                      <Users className="h-3.5 w-3.5 text-slate-500" />
                      <span>{rescue.peopleCount} People</span>
                    </span>
                  </td>

                  {/* Urgency */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                        isCritical
                          ? "bg-red-100/80 text-red-700 border-red-300 animate-pulse"
                          : isHigh
                            ? "bg-amber-100/70 text-amber-800 border-amber-300"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isCritical
                            ? "bg-red-600"
                            : isHigh
                              ? "bg-amber-600"
                              : "bg-blue-600"
                        }`}
                      />
                      <span>{rescue.urgency}</span>
                    </span>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-4 whitespace-nowrap text-xs">
                    <a
                      href={`tel:${rescue.contactPhone}`}
                      className="inline-flex items-center gap-1.5 font-bold text-slate-800 hover:text-emerald-600 transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{rescue.contactPhone}</span>
                    </a>
                  </td>

                  {/* Assigned Volunteer */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {rescue.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0">
                          {rescue.assignedTo.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                            {rescue.assignedTo.name}
                          </p>
                          {rescue.assignedTo.phoneNumber && (
                            <span className="text-[11px] text-slate-500 block truncate">
                              {rescue.assignedTo.phoneNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Unassigned</span>
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border ${
                        rescue.status === "RESCUED"
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : rescue.status === "IN_PROGRESS"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : rescue.status === "ASSIGNED"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : rescue.status === "CANCELLED"
                                ? "bg-slate-100 text-slate-600 border-slate-200"
                                : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      <span>{rescue.status}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onAssignClick(rescue)}
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                        title="Assign or reassign volunteer"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>
                          {rescue.assignedToId ? "Reassign" : "Assign"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onStatusClick(rescue)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Update rescue status"
                      >
                        <RefreshCw className="h-3 w-3 text-slate-500" />
                        <span>Status</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteClick(rescue)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete request"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {rescues.length === 0 && !isLoading && (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertTriangle className="h-8 w-8 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-700">
                      No rescue requests found
                    </p>
                    <p className="text-xs text-slate-400">
                      Try adjusting your search criteria or create a new
                      request.
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
                    <span>Loading emergency rescue requests...</span>
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
