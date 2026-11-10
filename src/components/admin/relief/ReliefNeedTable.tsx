"use client";

import {
  AlertTriangle,
  Building2,
  Edit2,
  Loader2,
  PackageCheck,
  Plus,
  Trash2,
} from "lucide-react";
import type { IReliefNeed } from "@/types";

export interface ReliefNeedTableProps {
  needs: IReliefNeed[];
  isLoading?: boolean;
  onUpdateFulfillment: (need: IReliefNeed) => void;
  onEdit: (need: IReliefNeed) => void;
  onDelete: (need: IReliefNeed) => void;
}

export function ReliefNeedTable({
  needs,
  isLoading,
  onUpdateFulfillment,
  onEdit,
  onDelete,
}: ReliefNeedTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                Item & Category
              </th>
              <th scope="col" className="px-4 py-3.5">
                Target Shelter
              </th>
              <th scope="col" className="px-4 py-3.5">
                Fulfillment Progress
              </th>
              <th scope="col" className="px-4 py-3.5">
                Urgency
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
            {needs.map((need) => {
              const total = need.quantity || 1;
              const fulfilled = need.fulfilled || 0;
              const percentage = Math.min(
                100,
                Math.round((fulfilled / total) * 100),
              );

              const isCritical = need.urgency === "CRITICAL";
              const isHigh = need.urgency === "HIGH";
              const isFulfilled = need.status === "FULFILLED";

              return (
                <tr
                  key={need.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Col 1: Item & Category */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 font-bold">
                        <PackageCheck className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate max-w-[200px]">
                          {need.itemName}
                        </p>
                        <span className="inline-block text-[11px] font-semibold text-slate-500">
                          {need.itemCategory}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Col 2: Target Shelter */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {need.shelter ? (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate max-w-[170px]">
                            {need.shelter.name}
                          </p>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {need.shelter.district || "Shelter"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        No shelter assigned
                      </span>
                    )}
                  </td>

                  {/* Col 3: Fulfillment Progress */}
                  <td className="px-4 py-4 min-w-[220px]">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-800">
                          {fulfilled.toLocaleString()} /{" "}
                          {total.toLocaleString()} {need.unit}
                        </span>
                        <span
                          className={`font-black text-[11px] ${
                            isFulfilled ? "text-teal-600" : "text-blue-600"
                          }`}
                        >
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${
                            isFulfilled
                              ? "bg-teal-500"
                              : percentage > 50
                                ? "bg-blue-600"
                                : "bg-amber-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Col 4: Urgency */}
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
                      <span>{need.urgency}</span>
                    </span>
                  </td>

                  {/* Col 5: Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border ${
                        isFulfilled
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : need.status === "IN_PROGRESS"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : need.status === "CANCELLED"
                              ? "bg-slate-100 text-slate-600 border-slate-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <span>{need.status}</span>
                    </span>
                  </td>

                  {/* Col 6: Actions */}
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onUpdateFulfillment(need)}
                        className="inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-100 transition-colors cursor-pointer"
                        title="Log newly received or distributed quantities"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Progress</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(need)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit details"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(need)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete demand"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {needs.length === 0 && !isLoading && (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertTriangle className="h-8 w-8 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-700">
                      No relief requirements found
                    </p>
                    <p className="text-xs text-slate-400">
                      Try adjusting your search criteria or post a new relief
                      demand.
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {isLoading && (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <span>Loading relief requirements...</span>
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
