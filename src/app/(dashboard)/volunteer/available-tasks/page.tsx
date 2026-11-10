"use client";

import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ClipboardList,
  Filter,
  LifeBuoy,
  Loader2,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  AvailableTaskCard,
  TaskConfirmationModal,
} from "@/components/volunteer";
import {
  useGetRescueRequests,
  useGetShelters,
  useSelfAssignRescue,
} from "@/hooks";
import type { IRescueRequest, UrgencyLevel } from "@/types";

const URGENCIES: UrgencyLevel[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

export default function AvailableTasksPage() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState("");
  const [selectedShelterId, setSelectedShelterId] = useState("");

  const [selectedTask, setSelectedTask] = useState<IRescueRequest | null>(null);

  // Queries (100% Real API)
  const {
    data: rescueData,
    isLoading: isLoadingRescues,
    isFetching: isFetchingRescues,
    refetch: refetchRescues,
  } = useGetRescueRequests({
    status: "PENDING",
    searchTerm: searchTerm.trim() || undefined,
    urgency: selectedUrgency || undefined,
    shelterId: selectedShelterId || undefined,
  });

  const { data: sheltersData } = useGetShelters();

  // Self Assign Mutation
  const selfAssignMutation = useSelfAssignRescue();

  // Filter only unassigned tasks
  const availableTasks = useMemo(() => {
    const list = Array.isArray(rescueData?.data) ? rescueData.data : [];
    return list.filter((r) => !r.assignedToId);
  }, [rescueData]);

  const shelterList = useMemo(() => {
    return Array.isArray(sheltersData?.data) ? sheltersData.data : [];
  }, [sheltersData]);

  // Stats
  const stats = useMemo(() => {
    const total = availableTasks.length;
    const critical = availableTasks.filter(
      (t) => t.urgency === "CRITICAL",
    ).length;
    const high = availableTasks.filter((t) => t.urgency === "HIGH").length;
    const totalPeople = availableTasks.reduce(
      (sum, t) => sum + (t.peopleCount || 0),
      0,
    );

    return { total, critical, high, totalPeople };
  }, [availableTasks]);

  // Handlers
  const handleConfirmTask = async (taskId: string) => {
    try {
      await selfAssignMutation.mutateAsync(taskId);
      toast.success("Mission accepted! You are now the designated responder.");
      setSelectedTask(null);
      // Give volunteer prompt to view their assigned missions
      toast.info(
        "Task moved to 'My Tasks'. You can view it on your dashboard.",
        {
          onClick: () => router.push("/volunteer"),
        },
      );
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
            <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                Available Rescue Tasks
              </h1>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                Open emergency distress calls requiring field volunteers.
                Self-assign to coordinate response.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refetchRescues()}
            disabled={isFetchingRescues}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 text-slate-500 ${
                isFetchingRescues ? "animate-spin text-emerald-600" : ""
              }`}
            />
            <span>Refresh Tasks</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
        {/* Total Available */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Open Calls
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
              Available
            </span>
          </div>
        </div>

        {/* Critical Calls */}
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
            <span className="text-xs font-bold text-red-500">Immediate</span>
          </div>
        </div>

        {/* High Urgency */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              High Priority
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.high}
            </span>
            <span className="text-xs font-semibold text-amber-600">Urgent</span>
          </div>
        </div>

        {/* People In Need */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              People Affected
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.totalPeople}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              Waiting for Aid
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
            placeholder="Search location, phone number, or distress details..."
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
          {/* Urgency Filter */}
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

          {/* Shelter Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50/80 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedShelterId}
              onChange={(e) => setSelectedShelterId(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer max-w-[150px] truncate"
            >
              <option value="">All Shelters</option>
              {shelterList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedUrgency || selectedShelterId) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedUrgency("");
                setSelectedShelterId("");
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700 underline px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Grid of Available Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableTasks.map((task) => (
          <AvailableTaskCard
            key={task.id}
            task={task}
            onAccept={(t) => setSelectedTask(t)}
            isPending={selfAssignMutation.isPending}
          />
        ))}
      </div>

      {/* Empty State */}
      {availableTasks.length === 0 && !isLoadingRescues && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            No pending rescue tasks right now
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            All registered distress calls are currently handled by response
            teams. Check back soon or monitor notifications.
          </p>
          <button
            type="button"
            onClick={() => refetchRescues()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Check for New Calls</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoadingRescues && (
        <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600 mr-2" />
          <span>Searching for available emergency missions...</span>
        </div>
      )}

      {/* Confirmation Modal */}
      <TaskConfirmationModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onConfirm={handleConfirmTask}
        isPending={selfAssignMutation.isPending}
      />
    </div>
  );
}
