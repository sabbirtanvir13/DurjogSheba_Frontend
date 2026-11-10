"use client";

import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Filter,
  LifeBuoy,
  Loader2,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { TaskConfirmationModal } from "@/components/volunteer";
import {
  useGetMe,
  useGetRescueRequests,
  useGetShelters,
  useSelfAssignRescue,
} from "@/hooks";
import type { IRescueRequest, RescueStatus, UrgencyLevel } from "@/types";

const URGENCIES: UrgencyLevel[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const STATUSES: RescueStatus[] = [
  "PENDING",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESCUED",
  "CANCELLED",
];

export default function VolunteerRescueRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedShelterId, setSelectedShelterId] = useState("");

  const [confirmTask, setConfirmTask] = useState<IRescueRequest | null>(null);

  // Current user
  const { data: meData } = useGetMe();
  const currentUser = meData?.data ?? meData;

  // Queries
  const {
    data: rescueData,
    isLoading,
    isFetching,
    refetch,
  } = useGetRescueRequests({
    searchTerm: searchTerm.trim() || undefined,
    urgency: selectedUrgency || undefined,
    status: selectedStatus || undefined,
    shelterId: selectedShelterId || undefined,
  });

  const { data: sheltersData } = useGetShelters();

  // Mutation
  const selfAssignMutation = useSelfAssignRescue();

  // Normalized lists
  const allRescues = useMemo(() => {
    return Array.isArray(rescueData?.data) ? rescueData.data : [];
  }, [rescueData]);

  const shelterList = useMemo(() => {
    return Array.isArray(sheltersData?.data) ? sheltersData.data : [];
  }, [sheltersData]);

  // Stats
  const stats = useMemo(() => {
    const total = allRescues.length;
    const critical = allRescues.filter((r) => r.urgency === "CRITICAL").length;
    const unassigned = allRescues.filter((r) => !r.assignedToId).length;
    const myAssigned = allRescues.filter(
      (r) => currentUser && r.assignedToId === currentUser.id,
    ).length;

    return { total, critical, unassigned, myAssigned };
  }, [allRescues, currentUser]);

  const handleSelfAssignConfirm = async (taskId: string) => {
    try {
      await selfAssignMutation.mutateAsync(taskId);
      toast.success("Rescue mission assigned to you successfully!");
      setConfirmTask(null);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to self-assign mission";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-red-500/20">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                All Emergency Rescue Requests
              </h1>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                Real-time emergency distress feed across disaster-affected
                zones.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 text-slate-500 ${
                isFetching ? "animate-spin text-red-600" : ""
              }`}
            />
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
        {/* Total Calls */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Distress Calls
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <LifeBuoy className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.total}
            </span>
            <span className="text-xs font-semibold text-slate-500">Logged</span>
          </div>
        </div>

        {/* Critical */}
        <div className="bg-white rounded-2xl border border-red-200 p-4.5 shadow-xs bg-linear-to-br from-red-50/40 via-white to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700">
              Critical Urgency
            </span>
            <div className="p-2 rounded-xl bg-red-100/80 text-red-600 animate-pulse">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-600 tracking-tight">
              {stats.critical}
            </span>
            <span className="text-xs font-bold text-red-500">
              Urgent Action
            </span>
          </div>
        </div>

        {/* Unassigned */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Needs Volunteer
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <UserPlus className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.unassigned}
            </span>
            <span className="text-xs font-semibold text-amber-600">Open</span>
          </div>
        </div>

        {/* My Assigned */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              My Assigned
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.myAssigned}
            </span>
            <span className="text-xs font-semibold text-emerald-600">Mine</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by location, phone, description..."
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Urgency */}
          <div className="flex items-center gap-1.5 bg-slate-50/80 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="">All Urgencies</option>
              {URGENCIES.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5 bg-slate-50/80 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Shelter */}
          <div className="flex items-center gap-1.5 bg-slate-50/80 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedShelterId}
              onChange={(e) => setSelectedShelterId(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer max-w-[140px] truncate"
            >
              <option value="">All Shelters</option>
              {shelterList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm ||
            selectedUrgency ||
            selectedStatus ||
            selectedShelterId) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedUrgency("");
                setSelectedStatus("");
                setSelectedShelterId("");
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700 underline px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Rescue Requests Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allRescues.map((rescue) => {
          const isCritical = rescue.urgency === "CRITICAL";
          const isUnassigned = !rescue.assignedToId;
          const isMine = currentUser && rescue.assignedToId === currentUser.id;

          return (
            <div
              key={rescue.id}
              className={`rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                isMine
                  ? "border-emerald-300 bg-emerald-50/20 ring-1 ring-emerald-400/30"
                  : isUnassigned
                    ? "border-red-200 bg-linear-to-b from-red-50/25 to-white"
                    : "border-slate-200/80 bg-white"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border ${
                      isCritical
                        ? "bg-red-100 text-red-700 border-red-300 animate-pulse"
                        : "bg-amber-100 text-amber-800 border-amber-300"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isCritical ? "bg-red-600" : "bg-amber-600"
                      }`}
                    />
                    <span>{rescue.urgency}</span>
                  </span>

                  {isMine ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      Assigned to You
                    </span>
                  ) : isUnassigned ? (
                    <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                      Needs Volunteer
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      Assigned
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-start gap-1.5 font-bold text-slate-900 text-sm">
                    <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{rescue.location}</span>
                  </div>

                  {rescue.description && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {rescue.description}
                    </p>
                  )}
                </div>

                {rescue.shelter && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      Shelter: {rescue.shelter.name}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>{rescue.peopleCount} People</span>
                  </span>

                  <a
                    href={`tel:${rescue.contactPhone}`}
                    className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{rescue.contactPhone}</span>
                  </a>
                </div>
              </div>

              {/* Action */}
              <div>
                {isUnassigned ? (
                  <button
                    type="button"
                    onClick={() => setConfirmTask(rescue)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2.5 text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Self-Assign (Take Mission)</span>
                  </button>
                ) : isMine ? (
                  <span className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>You are leading this mission</span>
                  </span>
                ) : (
                  <span className="w-full inline-flex items-center justify-center py-2 text-xs font-semibold text-slate-400 bg-slate-50 rounded-xl">
                    Assigned to:{" "}
                    {rescue.assignedTo?.name || "Another Volunteer"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {allRescues.length === 0 && !isLoading && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
          <LifeBuoy className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            No rescue requests found
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search criteria or refresh the feed.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
          <Loader2 className="h-6 w-6 animate-spin text-red-600 mr-2" />
          <span>Loading rescue requests...</span>
        </div>
      )}

      {/* Confirmation Modal */}
      <TaskConfirmationModal
        task={confirmTask}
        isOpen={Boolean(confirmTask)}
        onClose={() => setConfirmTask(null)}
        onConfirm={handleSelfAssignConfirm}
        isPending={selfAssignMutation.isPending}
      />
    </div>
  );
}
