"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Heart,
  Plus,
  RefreshCw,
  Search,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  AssignVolunteerModal,
  CreateRescueModal,
  RescueTable,
  UpdateRescueStatusModal,
  UpdateVolunteerStatusModal,
  VolunteerTable,
} from "@/components/admin";
import {
  useAssignVolunteerToRescue,
  useCreateRescueRequest,
  useDeleteRescueRequest,
  useGetRescueRequests,
  useGetShelters,
  useGetUsers,
  useUpdateRescueStatus,
  useUpdateUserStatus,
} from "@/hooks";
import type {
  ICreateRescueRequestInput,
  IRescueRequest,
  IUser,
  RescueStatus,
  UrgencyLevel,
  UserStatus,
} from "@/types";

const URGENCIES: UrgencyLevel[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const RESCUE_STATUSES: RescueStatus[] = [
  "PENDING",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESCUED",
  "CANCELLED",
];
const USER_STATUSES: UserStatus[] = [
  "ACTIVE",
  "BLOCKED",
  "PENDING",
  "SUSPENDED",
];

export default function AdminVolunteersPage() {
  const [activeTab, setActiveTab] = useState<"rescues" | "volunteers">(
    "rescues",
  );

  // Filters
  const [rescueSearch, setRescueSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [rescueStatusFilter, setRescueStatusFilter] = useState("");

  const [volunteerSearch, setVolunteerSearch] = useState("");
  const [volunteerStatusFilter, setVolunteerStatusFilter] = useState("");

  // Modals state
  const [assignModalRescue, setAssignModalRescue] =
    useState<IRescueRequest | null>(null);
  const [statusModalRescue, setStatusModalRescue] =
    useState<IRescueRequest | null>(null);
  const [userStatusModalUser, setUserStatusModalUser] = useState<IUser | null>(
    null,
  );
  const [isCreateRescueOpen, setIsCreateRescueOpen] = useState(false);

  // Queries
  const {
    data: rescueData,
    isLoading: isLoadingRescues,
    isFetching: isFetchingRescues,
    refetch: refetchRescues,
  } = useGetRescueRequests({
    searchTerm: rescueSearch.trim() || undefined,
    urgency: urgencyFilter || undefined,
    status: rescueStatusFilter || undefined,
  });

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
    refetch: refetchUsers,
  } = useGetUsers({
    role: "VOLUNTEER",
    searchTerm: volunteerSearch.trim() || undefined,
    status: volunteerStatusFilter || undefined,
  });

  const { data: sheltersData } = useGetShelters();

  // Mutations
  const assignMutation = useAssignVolunteerToRescue();
  const updateRescueStatusMutation = useUpdateRescueStatus();
  const deleteRescueMutation = useDeleteRescueRequest();
  const createRescueMutation = useCreateRescueRequest();
  const updateUserStatusMutation = useUpdateUserStatus();

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
    const totalVolunteers = volunteerList.length;
    const activeVolunteers = volunteerList.filter(
      (v) => (v.status || "").toUpperCase() === "ACTIVE",
    ).length;
    const totalRescues = rescueList.length;
    const unassignedRescues = rescueList.filter(
      (r) => !r.assignedToId || r.status === "PENDING",
    ).length;
    const inProgressRescues = rescueList.filter(
      (r) => r.status === "ASSIGNED" || r.status === "IN_PROGRESS",
    ).length;
    const rescuedRescues = rescueList.filter(
      (r) => r.status === "RESCUED",
    ).length;

    return {
      totalVolunteers,
      activeVolunteers,
      totalRescues,
      unassignedRescues,
      inProgressRescues,
      rescuedRescues,
    };
  }, [volunteerList, rescueList]);

  // Handlers
  const handleRefreshAll = () => {
    refetchRescues();
    refetchUsers();
    toast.info("Refreshed volunteer and rescue data");
  };

  const handleAssignVolunteer = async (
    rescueId: string,
    volunteerId: string,
  ) => {
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

  const handleUpdateRescueStatus = async (
    rescueId: string,
    status: RescueStatus,
  ) => {
    try {
      await updateRescueStatusMutation.mutateAsync({ id: rescueId, status });
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
      await deleteRescueMutation.mutateAsync(rescue.id);
      toast.success("Rescue request deleted successfully");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete rescue request";
      toast.error(errorMsg);
    }
  };

  const handleCreateRescue = async (payload: ICreateRescueRequestInput) => {
    try {
      await createRescueMutation.mutateAsync(payload);
      toast.success("Emergency rescue request submitted successfully!");
      setIsCreateRescueOpen(false);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create rescue request";
      toast.error(errorMsg);
    }
  };

  const handleUpdateUserStatus = async (userId: string, status: UserStatus) => {
    try {
      await updateUserStatusMutation.mutateAsync({ id: userId, status });
      toast.success("Volunteer status updated successfully!");
      setUserStatusModalUser(null);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to update volunteer status";
      toast.error(errorMsg);
    }
  };

  const isGlobalFetching = isFetchingRescues || isFetchingUsers;

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 md:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Volunteer & Field Management
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Real-time emergency rescue task allocation, active volunteer
              roster, and response tracking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRefreshAll}
            disabled={isGlobalFetching}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer disabled:opacity-60"
            title="Refresh Live Data"
          >
            <RefreshCw
              className={`h-4 w-4 text-slate-500 ${
                isGlobalFetching ? "animate-spin text-emerald-600" : ""
              }`}
            />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateRescueOpen(true)}
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
              Total Volunteers
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.totalVolunteers}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              Registered
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active & Ready
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.activeVolunteers}
            </span>
            <span className="text-xs font-medium text-slate-500">
              Available
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-red-200/90 p-4.5 shadow-xs bg-linear-to-br from-red-50/40 via-white to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700">
              Needs Volunteer
            </span>
            <div className="p-2 rounded-xl bg-red-100/80 text-red-600 animate-pulse">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-600 tracking-tight">
              {stats.unassignedRescues}
            </span>
            <span className="text-xs font-bold text-red-500">Pending</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              In Operation
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.inProgressRescues}
            </span>
            <span className="text-xs font-semibold text-amber-600">Active</span>
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
              {stats.rescuedRescues}
            </span>
            <span className="text-xs font-semibold text-teal-600">
              Completed
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-2">
        <button
          type="button"
          onClick={() => setActiveTab("rescues")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "rescues"
              ? "border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span>Rescue Operations & Tasks</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
              stats.unassignedRescues > 0
                ? "bg-red-500 text-white animate-pulse"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {rescueList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("volunteers")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "volunteers"
              ? "border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <Users className="h-4 w-4 text-emerald-600" />
          <span>Volunteers Roster</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-extrabold bg-slate-200 text-slate-700">
            {volunteerList.length}
          </span>
        </button>
      </div>

      {/* TAB 1: RESCUE OPERATIONS */}
      {activeTab === "rescues" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={rescueSearch}
                onChange={(e) => setRescueSearch(e.target.value)}
                placeholder="Search by location, description, or phone..."
                className="w-full pl-10 pr-4 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
              />
              {rescueSearch && (
                <button
                  type="button"
                  onClick={() => setRescueSearch("")}
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
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
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
                  value={rescueStatusFilter}
                  onChange={(e) => setRescueStatusFilter(e.target.value)}
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

              {(rescueSearch || urgencyFilter || rescueStatusFilter) && (
                <button
                  type="button"
                  onClick={() => {
                    setRescueSearch("");
                    setUrgencyFilter("");
                    setRescueStatusFilter("");
                  }}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 underline px-2 py-1 cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <RescueTable
            rescues={rescueList}
            isLoading={isLoadingRescues}
            onAssignClick={(rescue) => setAssignModalRescue(rescue)}
            onStatusClick={(rescue) => setStatusModalRescue(rescue)}
            onDeleteClick={handleDeleteRescue}
          />
        </div>
      )}

      {/* TAB 2: VOLUNTEERS DIRECTORY */}
      {activeTab === "volunteers" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={volunteerSearch}
                onChange={(e) => setVolunteerSearch(e.target.value)}
                placeholder="Search volunteer by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
              />
              {volunteerSearch && (
                <button
                  type="button"
                  onClick={() => setVolunteerSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-slate-50/80 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
                <span className="font-semibold text-slate-600">Status:</span>
                <select
                  value={volunteerStatusFilter}
                  onChange={(e) => setVolunteerStatusFilter(e.target.value)}
                  className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  {USER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {(volunteerSearch || volunteerStatusFilter) && (
                <button
                  type="button"
                  onClick={() => {
                    setVolunteerSearch("");
                    setVolunteerStatusFilter("");
                  }}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 underline px-2 py-1 cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <VolunteerTable
            volunteers={volunteerList}
            isLoading={isLoadingUsers}
            taskCountMap={volunteerTaskCountMap}
            onStatusClick={(vol) => setUserStatusModalUser(vol)}
          />
        </div>
      )}

      {/* Reusable Modals */}
      <AssignVolunteerModal
        rescue={assignModalRescue}
        volunteers={volunteerList}
        volunteerTaskCountMap={volunteerTaskCountMap}
        isOpen={Boolean(assignModalRescue)}
        onClose={() => setAssignModalRescue(null)}
        onAssign={handleAssignVolunteer}
        isPending={assignMutation.isPending}
      />

      <UpdateRescueStatusModal
        rescue={statusModalRescue}
        isOpen={Boolean(statusModalRescue)}
        onClose={() => setStatusModalRescue(null)}
        onUpdateStatus={handleUpdateRescueStatus}
        isPending={updateRescueStatusMutation.isPending}
      />

      <CreateRescueModal
        isOpen={isCreateRescueOpen}
        onClose={() => setIsCreateRescueOpen(false)}
        shelters={shelterList}
        onCreate={handleCreateRescue}
        isPending={createRescueMutation.isPending}
      />

      <UpdateVolunteerStatusModal
        volunteer={userStatusModalUser}
        isOpen={Boolean(userStatusModalUser)}
        onClose={() => setUserStatusModalUser(null)}
        onUpdateStatus={handleUpdateUserStatus}
        isPending={updateUserStatusMutation.isPending}
      />
    </div>
  );
}
