"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  LifeBuoy,
  Plus,
  RefreshCw,
  Search,
  UserCheck,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  AssignVolunteerModal,
  CreateRescueModal,
  RescueTable,
  UpdateRescueStatusModal,
} from "@/components/admin";
import {
  useAssignVolunteerToRescue,
  useCreateRescueRequest,
  useDeleteRescueRequest,
  useGetRescueRequests,
  useGetShelters,
  useGetUsers,
  useUpdateRescueStatus,
} from "@/hooks";
import type {
  ICreateRescueRequestInput,
  IRescueRequest,
  RescueStatus,
  UrgencyLevel,
} from "@/types";

const URGENCIES: UrgencyLevel[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const RESCUE_STATUSES: RescueStatus[] = [
  "PENDING",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESCUED",
  "CANCELLED",
];

export default function AdminRescueRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Modals state
  const [assignModalRescue, setAssignModalRescue] =
    useState<IRescueRequest | null>(null);
  const [statusModalRescue, setStatusModalRescue] =
    useState<IRescueRequest | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Queries
  const {
    data: rescueData,
    isLoading: isLoadingRescues,
    isFetching: isFetchingRescues,
    refetch: refetchRescues,
  } = useGetRescueRequests({
    searchTerm: searchTerm.trim() || undefined,
    urgency: selectedUrgency || undefined,
    status: selectedStatus || undefined,
  });

  const { data: usersData } = useGetUsers({ role: "VOLUNTEER" });
  const { data: sheltersData } = useGetShelters();

  // Mutations
  const assignMutation = useAssignVolunteerToRescue();
  const updateStatusMutation = useUpdateRescueStatus();
  const deleteMutation = useDeleteRescueRequest();
  const createMutation = useCreateRescueRequest();

  // Normalized data lists
  const rescueList = useMemo(() => {
    return Array.isArray(rescueData?.data) ? rescueData.data : [];
  }, [rescueData]);

  const volunteerList = useMemo(() => {
    return Array.isArray(usersData?.data) ? usersData.data : [];
  }, [usersData]);

  const shelterList = useMemo(() => {
    return Array.isArray(sheltersData?.data) ? sheltersData.data : [];
  }, [sheltersData]);

  // Tasks per volunteer map
  const volunteerTaskCountMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rescueList) {
      if (r.assignedToId) {
        map.set(r.assignedToId, (map.get(r.assignedToId) || 0) + 1);
      }
    }
    return map;
  }, [rescueList]);

  // Stats
  const stats = useMemo(() => {
    const total = rescueList.length;
    const pending = rescueList.filter(
      (r) => !r.assignedToId || r.status === "PENDING",
    ).length;
    const inProgress = rescueList.filter(
      (r) => r.status === "ASSIGNED" || r.status === "IN_PROGRESS",
    ).length;
    const rescued = rescueList.filter((r) => r.status === "RESCUED").length;
    const critical = rescueList.filter(
      (r) => r.urgency === "CRITICAL" && r.status !== "RESCUED",
    ).length;

    return { total, pending, inProgress, rescued, critical };
  }, [rescueList]);

  // Handlers
  const handleAssignSubmit = async (rescueId: string, volunteerId: string) => {
    try {
      await assignMutation.mutateAsync({
        id: rescueId,
        assignedToId: volunteerId,
      });
      toast.success("Volunteer assigned to rescue request successfully!");
      setAssignModalRescue(null);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to assign volunteer";
      toast.error(errorMsg);
    }
  };

  const handleUpdateStatusSubmit = async (
    rescueId: string,
    status: RescueStatus,
  ) => {
    try {
      await updateStatusMutation.mutateAsync({ id: rescueId, status });
      toast.success(`Rescue status updated to ${status}`);
      setStatusModalRescue(null);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update status";
      toast.error(errorMsg);
    }
  };

  const handleDeleteRescue = async (rescue: IRescueRequest) => {
    if (
      !window.confirm(
        `Are you sure you want to delete rescue request at "${rescue.location}"?`,
      )
    ) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(rescue.id);
      toast.success("Rescue request deleted successfully");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete rescue request";
      toast.error(errorMsg);
    }
  };

  const handleCreateSubmit = async (payload: ICreateRescueRequestInput) => {
    try {
      await createMutation.mutateAsync(payload);
      toast.success("Emergency rescue request submitted successfully!");
      setIsCreateOpen(false);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create rescue request";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 md:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-red-500/20">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Emergency Rescue Requests
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Live distress monitoring, volunteer dispatch, and rescue lifecycle
              management.
            </p>
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
                isFetchingRescues ? "animate-spin text-red-600" : ""
              }`}
            />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2.5 text-xs md:text-sm font-semibold shadow-md shadow-red-500/25 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Rescue Request</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 md:gap-4">
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
            <span className="text-xs font-bold text-red-500">Urgent</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Unassigned
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.pending}
            </span>
            <span className="text-xs font-semibold text-amber-600">
              Needs Team
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              In Operation
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.inProgress}
            </span>
            <span className="text-xs font-semibold text-blue-600">
              En Route
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs col-span-2 lg:col-span-1">
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
            placeholder="Search by location, description, or phone..."
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
          <div className="flex items-center gap-1.5 bg-slate-50/80 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600">Urgency:</span>
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

          <div className="flex items-center gap-1.5 bg-slate-50/80 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="font-semibold text-slate-600">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="">All Statuses</option>
              {RESCUE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedUrgency || selectedStatus) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedUrgency("");
                setSelectedStatus("");
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700 underline px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Modular Rescue Table */}
      <RescueTable
        rescues={rescueList}
        isLoading={isLoadingRescues}
        onAssignClick={(rescue) => setAssignModalRescue(rescue)}
        onStatusClick={(rescue) => setStatusModalRescue(rescue)}
        onDeleteClick={handleDeleteRescue}
      />

      {/* Reusable Modals */}
      <AssignVolunteerModal
        rescue={assignModalRescue}
        volunteers={volunteerList}
        volunteerTaskCountMap={volunteerTaskCountMap}
        isOpen={Boolean(assignModalRescue)}
        onClose={() => setAssignModalRescue(null)}
        onAssign={handleAssignSubmit}
        isPending={assignMutation.isPending}
      />

      <UpdateRescueStatusModal
        rescue={statusModalRescue}
        isOpen={Boolean(statusModalRescue)}
        onClose={() => setStatusModalRescue(null)}
        onUpdateStatus={handleUpdateStatusSubmit}
        isPending={updateStatusMutation.isPending}
      />

      <CreateRescueModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        shelters={shelterList}
        onCreate={handleCreateSubmit}
        isPending={createMutation.isPending}
      />
    </div>
  );
}
