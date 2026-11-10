"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  LifeBuoy,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  UserCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { MyTaskCard, UpdateMissionStatusModal } from "@/components/volunteer";
import { useGetMyAssignedRescues, useUpdateMyRescueStatus } from "@/hooks";
import type { IRescueRequest, RescueStatus, UrgencyLevel } from "@/types";

const URGENCIES: UrgencyLevel[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const STATUSES: RescueStatus[] = [
  "ASSIGNED",
  "IN_PROGRESS",
  "RESCUED",
  "CANCELLED",
];

export default function MyTasksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState("");

  const [statusModalTask, setStatusModalTask] = useState<IRescueRequest | null>(
    null,
  );

  // Queries (100% Real API)
  const {
    data: myRescuesData,
    isLoading,
    isFetching,
    refetch,
  } = useGetMyAssignedRescues();

  // Mutation
  const updateStatusMutation = useUpdateMyRescueStatus();

  // Normalized list
  const allMyTasks = useMemo(() => {
    return Array.isArray(myRescuesData?.data) ? myRescuesData.data : [];
  }, [myRescuesData]);

  // Filtered list
  const filteredTasks = useMemo(() => {
    return allMyTasks.filter((task) => {
      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const loc = (task.location || "").toLowerCase();
        const desc = (task.description || "").toLowerCase();
        const phone = (task.contactPhone || "").toLowerCase();
        if (
          !loc.includes(query) &&
          !desc.includes(query) &&
          !phone.includes(query)
        ) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus && task.status !== selectedStatus) {
        return false;
      }

      // Urgency filter
      if (selectedUrgency && task.urgency !== selectedUrgency) {
        return false;
      }

      return true;
    });
  }, [allMyTasks, searchTerm, selectedStatus, selectedUrgency]);

  // Stats
  const stats = useMemo(() => {
    const total = allMyTasks.length;
    const inProgress = allMyTasks.filter(
      (t) => t.status === "IN_PROGRESS",
    ).length;
    const pending = allMyTasks.filter(
      (t) => t.status === "ASSIGNED" || t.status === "PENDING",
    ).length;
    const rescued = allMyTasks.filter((t) => t.status === "RESCUED").length;

    return { total, inProgress, pending, rescued };
  }, [allMyTasks]);

  // Handlers
  const handleUpdateStatusSubmit = async (
    taskId: string,
    status: RescueStatus,
  ) => {
    try {
      await updateStatusMutation.mutateAsync({ rescueId: taskId, status });
      toast.success(`Mission status updated to ${status}`);
      setStatusModalTask(null);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update mission status";
      toast.error(errorMsg);
    }
  };

  const handleQuickStart = async (task: IRescueRequest) => {
    try {
      await updateStatusMutation.mutateAsync({
        rescueId: task.id,
        status: "IN_PROGRESS",
      });
      toast.success("Mission started! Status set to In Progress.");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to start mission";
      toast.error(errorMsg);
    }
  };

  const handleQuickComplete = async (task: IRescueRequest) => {
    try {
      await updateStatusMutation.mutateAsync({
        rescueId: task.id,
        status: "RESCUED",
      });
      toast.success("Congratulations! Mission marked as Rescued Safely.");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to complete mission";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                My Assigned Tasks
              </h1>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                Track, coordinate, and update your active field rescue missions.
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
                isFetching ? "animate-spin text-emerald-600" : ""
              }`}
            />
            <span>Refresh</span>
          </button>

          <Link
            href="/volunteer/available-tasks"
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 text-xs md:text-sm font-semibold shadow-md shadow-emerald-600/25 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Find Open Tasks</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
        {/* Total Assigned */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assigned To Me
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <LifeBuoy className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.total}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Missions
            </span>
          </div>
        </div>

        {/* Ongoing Operations */}
        <div className="bg-white rounded-2xl border border-blue-200 p-4.5 shadow-xs bg-linear-to-br from-blue-50/30 via-white to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              In Operation
            </span>
            <div className="p-2 rounded-xl bg-blue-100/80 text-blue-600 animate-pulse">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-600 tracking-tight">
              {stats.inProgress}
            </span>
            <span className="text-xs font-semibold text-blue-500">
              Active Now
            </span>
          </div>
        </div>

        {/* Pending Action */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Action
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.pending}
            </span>
            <span className="text-xs font-semibold text-amber-600">Ready</span>
          </div>
        </div>

        {/* Completed */}
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
              {stats.rescued}
            </span>
            <span className="text-xs font-semibold text-teal-600">
              Completed
            </span>
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
            placeholder="Search location, description, or phone..."
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
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
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50/80 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
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

          {/* Urgency Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50/80 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
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

          {(searchTerm || selectedStatus || selectedUrgency) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus("");
                setSelectedUrgency("");
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700 underline px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Grid of My Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <MyTaskCard
            key={task.id}
            task={task}
            onUpdateStatus={(t) => setStatusModalTask(t)}
            onQuickStart={handleQuickStart}
            onQuickComplete={handleQuickComplete}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && !isLoading && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
          <UserCheck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            {allMyTasks.length === 0
              ? "You have no assigned tasks yet"
              : "No missions match your filter"}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {allMyTasks.length === 0
              ? "Check out the available tasks to self-assign emergency missions and help affected citizens."
              : "Try resetting your search query or status filter."}
          </p>
          {allMyTasks.length === 0 && (
            <Link
              href="/volunteer/available-tasks"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
            >
              <Plus className="h-4 w-4" />
              <span>Browse Open Tasks</span>
            </Link>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600 mr-2" />
          <span>Loading your assigned missions...</span>
        </div>
      )}

      {/* Update Status Modal */}
      <UpdateMissionStatusModal
        task={statusModalTask}
        isOpen={Boolean(statusModalTask)}
        onClose={() => setStatusModalTask(null)}
        onUpdateStatus={handleUpdateStatusSubmit}
        isPending={updateStatusMutation.isPending}
      />
    </div>
  );
}
