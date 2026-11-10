"use client";

import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Heart,
  LifeBuoy,
  Loader2,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  useGetMe,
  useGetMyAssignedRescues,
  useGetRescueRequests,
  useGetVolunteerStats,
  useSelfAssignRescue,
  useUpdateMyRescueStatus,
} from "@/hooks";
import type { IRescueRequest, RescueStatus } from "@/types";

export default function VolunteerDashboardPage() {
  const [activeTab, setActiveTab] = useState<"my-tasks" | "open-calls">(
    "my-tasks",
  );
  const [statusModalRescue, setStatusModalRescue] =
    useState<IRescueRequest | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<RescueStatus | "">("");

  // Current user info
  const { data: meData } = useGetMe();
  const user = meData?.data ?? meData;

  // Volunteer stats & assigned rescues
  const { data: statsData, refetch: refetchStats } = useGetVolunteerStats();

  const {
    data: myRescuesData,
    isLoading: isLoadingMyRescues,
    isFetching: isFetchingMyRescues,
    refetch: refetchMyRescues,
  } = useGetMyAssignedRescues();

  // Open distress calls for self-assignment
  const {
    data: allRescuesData,
    isLoading: isLoadingAllRescues,
    refetch: refetchAllRescues,
  } = useGetRescueRequests({ status: "PENDING" });

  // Mutations
  const selfAssignMutation = useSelfAssignRescue();
  const updateStatusMutation = useUpdateMyRescueStatus();

  // Normalized lists
  const myRescues = useMemo(() => {
    return Array.isArray(myRescuesData?.data) ? myRescuesData.data : [];
  }, [myRescuesData]);

  const openCalls = useMemo(() => {
    const list = Array.isArray(allRescuesData?.data) ? allRescuesData.data : [];
    return list.filter((r) => !r.assignedToId);
  }, [allRescuesData]);

  const stats = statsData?.data || {
    totalAssigned: myRescues.length,
    pending: myRescues.filter(
      (r) => r.status === "ASSIGNED" || r.status === "PENDING",
    ).length,
    inProgress: myRescues.filter((r) => r.status === "IN_PROGRESS").length,
    completed: myRescues.filter((r) => r.status === "RESCUED").length,
  };

  const handleRefreshAll = () => {
    refetchStats();
    refetchMyRescues();
    refetchAllRescues();
    toast.info("Refreshed mission tasks");
  };

  const handleSelfAssign = async (rescue: IRescueRequest) => {
    try {
      await selfAssignMutation.mutateAsync(rescue.id);
      toast.success("Rescue mission assigned to you successfully!");
      setActiveTab("my-tasks");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to self-assign rescue";
      toast.error(errorMsg);
    }
  };

  const handleOpenStatusModal = (rescue: IRescueRequest) => {
    setStatusModalRescue(rescue);
    setSelectedStatus(rescue.status);
  };

  const handleConfirmStatus = async () => {
    if (!statusModalRescue || !selectedStatus) return;
    try {
      await updateStatusMutation.mutateAsync({
        rescueId: statusModalRescue.id,
        status: selectedStatus,
      });
      toast.success(`Mission status updated to ${selectedStatus}`);
      setStatusModalRescue(null);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update mission status";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-linear-to-r from-emerald-700 via-emerald-600 to-teal-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide">
            <ShieldCheck className="h-4 w-4 text-emerald-200" />
            <span>Field Volunteer Operations</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || "Volunteer"}!
          </h1>
          <p className="text-emerald-100 text-xs md:text-sm max-w-xl">
            Track your emergency rescue tasks, respond to distress calls, and
            update live operation milestones.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRefreshAll}
            disabled={isFetchingMyRescues}
            className="inline-flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetchingMyRescues ? "animate-spin" : ""}`}
            />
            <span>Refresh Missions</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
        {/* Total Assigned */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Assigned
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <LifeBuoy className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.totalAssigned}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Missions
            </span>
          </div>
        </div>

        {/* Pending / En Route */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Action
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.pending}
            </span>
            <span className="text-xs font-semibold text-amber-600">Ready</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Operation
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.inProgress}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              Ongoing
            </span>
          </div>
        </div>

        {/* Rescued / Completed */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Rescued Safely
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.completed}
            </span>
            <span className="text-xs font-semibold text-teal-600">
              Completed
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 space-x-2">
        <button
          type="button"
          onClick={() => setActiveTab("my-tasks")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "my-tasks"
              ? "border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <UserCheck className="h-4 w-4 text-emerald-600" />
          <span>My Assigned Missions</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-extrabold bg-slate-200 text-slate-700">
            {myRescues.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("open-calls")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "open-calls"
              ? "border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span>Open Distress Calls (Available)</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
              openCalls.length > 0
                ? "bg-red-500 text-white animate-pulse"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {openCalls.length}
          </span>
        </button>
      </div>

      {/* TAB 1: MY ASSIGNED RESCUES */}
      {activeTab === "my-tasks" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myRescues.map((rescue) => {
              const isCritical = rescue.urgency === "CRITICAL";
              const isCompleted = rescue.status === "RESCUED";

              return (
                <div
                  key={rescue.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                          isCritical
                            ? "bg-red-100/80 text-red-700 border-red-300 animate-pulse"
                            : "bg-amber-100/70 text-amber-800 border-amber-300"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isCritical ? "bg-red-600" : "bg-amber-600"
                          }`}
                        />
                        <span>{rescue.urgency}</span>
                      </span>

                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          isCompleted
                            ? "bg-teal-50 text-teal-700 border-teal-200"
                            : rescue.status === "IN_PROGRESS"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {rescue.status}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                        <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                        <span className="line-clamp-1">{rescue.location}</span>
                      </div>
                      {rescue.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {rescue.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-1 font-bold">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <span>{rescue.peopleCount} People</span>
                      </div>
                      <a
                        href={`tel:${rescue.contactPhone}`}
                        className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                      >
                        <Phone className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{rescue.contactPhone}</span>
                      </a>
                    </div>

                    {rescue.shelter && (
                      <div className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                        <Building2 className="h-3 w-3 text-slate-400" />
                        <span>Shelter: {rescue.shelter.name}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenStatusModal(rescue)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2 text-xs font-bold transition-all cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Update Mission Status</span>
                  </button>
                </div>
              );
            })}
          </div>

          {myRescues.length === 0 && !isLoadingMyRescues && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
              <Heart className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">
                No active missions assigned to you
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Check the &quot;Open Distress Calls&quot; tab to self-assign a
                pending emergency rescue mission.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("open-calls")}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold transition-all cursor-pointer"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Browse Open Distress Calls</span>
              </button>
            </div>
          )}

          {isLoadingMyRescues && (
            <div className="flex items-center justify-center py-16 text-slate-500 text-sm">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-600 mr-2" />
              <span>Loading your rescue missions...</span>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: OPEN DISTRESS CALLS */}
      {activeTab === "open-calls" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {openCalls.map((rescue) => {
              const isCritical = rescue.urgency === "CRITICAL";

              return (
                <div
                  key={rescue.id}
                  className="bg-white rounded-2xl border border-red-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 bg-linear-to-b from-red-50/20 to-white"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold border ${
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

                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        Unassigned
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                        <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                        <span className="line-clamp-1">{rescue.location}</span>
                      </div>
                      {rescue.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {rescue.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-1 font-bold">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <span>{rescue.peopleCount} People</span>
                      </div>
                      <a
                        href={`tel:${rescue.contactPhone}`}
                        className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                      >
                        <Phone className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{rescue.contactPhone}</span>
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelfAssign(rescue)}
                    disabled={selfAssignMutation.isPending}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2.5 text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {selfAssignMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                    <span>Self-Assign (Take Mission)</span>
                  </button>
                </div>
              );
            })}
          </div>

          {openCalls.length === 0 && !isLoadingAllRescues && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">
                All distress calls currently handled!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                There are currently no open unassigned emergency calls. Great
                job team!
              </p>
            </div>
          )}
        </div>
      )}

      {/* UPDATE STATUS MODAL */}
      {statusModalRescue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close modal overlay"
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity cursor-default border-none w-full h-full"
            onClick={() => setStatusModalRescue(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-slate-900">
              Update Mission Status
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Location: <strong>{statusModalRescue.location}</strong>
            </p>

            <div className="mt-4 space-y-2">
              {(
                [
                  "ASSIGNED",
                  "IN_PROGRESS",
                  "RESCUED",
                  "CANCELLED",
                ] as RescueStatus[]
              ).map((status) => {
                const isSelected = selectedStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span>{status}</span>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setStatusModalRescue(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedStatus || updateStatusMutation.isPending}
                onClick={handleConfirmStatus}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                Save Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
