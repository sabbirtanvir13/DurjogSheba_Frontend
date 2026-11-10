"use client";

import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Filter,
  Heart,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
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

export default function AdminVolunteerManagementPage() {
  const [activeTab, setActiveTab] = useState<"rescues" | "volunteers">(
    "rescues",
  );

  // Rescue filter states
  const [rescueSearch, setRescueSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [rescueStatusFilter, setRescueStatusFilter] = useState("");

  // Volunteer filter states
  const [volunteerSearch, setVolunteerSearch] = useState("");
  const [volunteerStatusFilter, setVolunteerStatusFilter] = useState("");

  // Modals state
  const [assignModalRescue, setAssignModalRescue] =
    useState<IRescueRequest | null>(null);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string>("");

  const [statusModalRescue, setStatusModalRescue] =
    useState<IRescueRequest | null>(null);
  const [newRescueStatus, setNewRescueStatus] = useState<RescueStatus | "">("");

  const [userStatusModalUser, setUserStatusModalUser] = useState<IUser | null>(
    null,
  );
  const [newUserStatus, setNewUserStatus] = useState<UserStatus | "">("");

  const [isCreateRescueOpen, setIsCreateRescueOpen] = useState(false);
  const [newRescueForm, setNewRescueForm] = useState<ICreateRescueRequestInput>(
    {
      location: "",
      contactPhone: "",
      peopleCount: 1,
      urgency: "CRITICAL",
      description: "",
      shelterId: "",
    },
  );

  // Queries (100% Real API data)
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

  // Compute tasks per volunteer map
  const volunteerTaskCountMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rescueList) {
      if (r.assignedToId) {
        map.set(r.assignedToId, (map.get(r.assignedToId) || 0) + 1);
      }
    }
    return map;
  }, [rescueList]);

  // Stat Calculations
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

  const handleOpenAssignModal = (rescue: IRescueRequest) => {
    setAssignModalRescue(rescue);
    setSelectedVolunteerId(rescue.assignedToId || "");
  };

  const handleConfirmAssignment = async () => {
    if (!assignModalRescue) return;
    if (!selectedVolunteerId) {
      toast.error("Please select a volunteer from the list");
      return;
    }

    try {
      await assignMutation.mutateAsync({
        id: assignModalRescue.id,
        assignedToId: selectedVolunteerId,
      });
      toast.success("Volunteer assigned to rescue request successfully!");
      setAssignModalRescue(null);
      setSelectedVolunteerId("");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to assign volunteer";
      toast.error(errorMsg);
    }
  };

  const handleOpenStatusModal = (rescue: IRescueRequest) => {
    setStatusModalRescue(rescue);
    setNewRescueStatus(rescue.status);
  };

  const handleConfirmRescueStatus = async () => {
    if (!statusModalRescue || !newRescueStatus) return;

    try {
      await updateRescueStatusMutation.mutateAsync({
        id: statusModalRescue.id,
        status: newRescueStatus,
      });
      toast.success(`Rescue status updated to ${newRescueStatus}`);
      setStatusModalRescue(null);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update status";
      toast.error(errorMsg);
    }
  };

  const handleDeleteRescue = async (id: string, location: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete rescue request at "${location}"?`,
      )
    ) {
      return;
    }

    try {
      await deleteRescueMutation.mutateAsync(id);
      toast.success("Rescue request deleted successfully");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete rescue request";
      toast.error(errorMsg);
    }
  };

  const handleCreateRescueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRescueForm.location.trim()) {
      toast.error("Location is required");
      return;
    }
    if (!newRescueForm.contactPhone.trim()) {
      toast.error("Contact phone number is required");
      return;
    }

    try {
      await createRescueMutation.mutateAsync({
        location: newRescueForm.location.trim(),
        contactPhone: newRescueForm.contactPhone.trim(),
        peopleCount: Number(newRescueForm.peopleCount) || 1,
        urgency: newRescueForm.urgency,
        description: newRescueForm.description?.trim() || undefined,
        shelterId: newRescueForm.shelterId || undefined,
      });
      toast.success("Emergency rescue request submitted successfully!");
      setIsCreateRescueOpen(false);
      setNewRescueForm({
        location: "",
        contactPhone: "",
        peopleCount: 1,
        urgency: "CRITICAL",
        description: "",
        shelterId: "",
      });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create rescue request";
      toast.error(errorMsg);
    }
  };

  const handleConfirmUserStatus = async () => {
    if (!userStatusModalUser || !newUserStatus) return;

    try {
      await updateUserStatusMutation.mutateAsync({
        id: userStatusModalUser.id,
        status: newUserStatus,
      });
      toast.success(
        `Volunteer ${userStatusModalUser.name} status updated to ${newUserStatus}`,
      );
      setUserStatusModalUser(null);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to update volunteer status";
      toast.error(errorMsg);
    }
  };

  const isGlobalLoading = isLoadingRescues || isLoadingUsers;
  const isGlobalFetching = isFetchingRescues || isFetchingUsers;

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 md:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
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
        {/* Card 1: Total Volunteers */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
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

        {/* Card 2: Active Volunteers */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
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

        {/* Card 3: Unassigned Rescues */}
        <div className="bg-white rounded-2xl border border-red-200/90 p-4.5 shadow-xs relative overflow-hidden group hover:shadow-md transition-all bg-linear-to-br from-red-50/40 via-white to-white">
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

        {/* Card 4: In Progress Rescues */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
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

        {/* Card 5: Completed Rescues */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs relative overflow-hidden group hover:shadow-md transition-all col-span-2 lg:col-span-1">
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

      {/* Tab Navigation */}
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

      {/* TAB 1: RESCUE OPERATIONS & ASSIGNMENT */}
      {activeTab === "rescues" && (
        <div className="space-y-4">
          {/* Rescue Filter Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
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

            {/* Filter Dropdowns */}
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

          {/* Rescue Table */}
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
                  {rescueList.map((rescue) => {
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
                        {/* Col 1: Location & Details */}
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

                        {/* Col 2: People Count */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 font-extrabold text-slate-800 text-xs px-2.5 py-1 bg-slate-100 rounded-lg">
                            <Users className="h-3.5 w-3.5 text-slate-500" />
                            <span>{rescue.peopleCount} People</span>
                          </span>
                        </td>

                        {/* Col 3: Urgency */}
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

                        {/* Col 4: Contact */}
                        <td className="px-4 py-4 whitespace-nowrap text-xs">
                          <a
                            href={`tel:${rescue.contactPhone}`}
                            className="inline-flex items-center gap-1.5 font-bold text-slate-800 hover:text-emerald-600 transition-colors"
                          >
                            <Phone className="h-3.5 w-3.5 text-emerald-600" />
                            <span>{rescue.contactPhone}</span>
                          </a>
                        </td>

                        {/* Col 5: Assigned Volunteer */}
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

                        {/* Col 6: Status */}
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

                        {/* Col 7: Actions */}
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {/* Assign Volunteer Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenAssignModal(rescue)}
                              className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                              title="Assign or reassign volunteer"
                            >
                              <UserPlus className="h-3.5 w-3.5" />
                              <span>
                                {rescue.assignedToId ? "Reassign" : "Assign"}
                              </span>
                            </button>

                            {/* Change Status Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenStatusModal(rescue)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                              title="Update rescue status"
                            >
                              <RefreshCw className="h-3 w-3 text-slate-500" />
                              <span>Status</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteRescue(rescue.id, rescue.location)
                              }
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

                  {rescueList.length === 0 && !isGlobalLoading && (
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

                  {isGlobalLoading && (
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
        </div>
      )}

      {/* TAB 2: VOLUNTEERS DIRECTORY */}
      {activeTab === "volunteers" && (
        <div className="space-y-4">
          {/* Volunteer Filter Controls */}
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

          {/* Volunteers Table */}
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
                  {volunteerList.map((vol) => {
                    const initials = (vol.name || "Volunteer")
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase();

                    const assignedCount =
                      volunteerTaskCountMap.get(vol.id) || 0;
                    const isActive = vol.status === "ACTIVE";

                    return (
                      <tr
                        key={vol.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        {/* Col 1: Profile */}
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

                        {/* Col 2: Phone */}
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

                        {/* Col 3: Verification */}
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

                        {/* Col 4: Account Status */}
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

                        {/* Col 5: Active Tasks */}
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

                        {/* Col 6: Joined */}
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500">
                          {vol.createdAt
                            ? new Date(vol.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>

                        {/* Col 7: Actions */}
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setUserStatusModalUser(vol);
                              setNewUserStatus(vol.status || "ACTIVE");
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <Shield className="h-3 w-3 text-slate-500" />
                            <span>Change Status</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {volunteerList.length === 0 && !isGlobalLoading && (
                    <tr>
                      <td colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Users className="h-8 w-8 text-slate-300" />
                          <p className="text-sm font-semibold text-slate-700">
                            No volunteers found
                          </p>
                          <p className="text-xs text-slate-400">
                            No volunteer accounts match the search or filter
                            query.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {isGlobalLoading && (
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
        </div>
      )}

      {/* MODAL 1: ASSIGN VOLUNTEER MODAL */}
      {assignModalRescue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close modal overlay"
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity cursor-default border-none w-full h-full"
            onClick={() => setAssignModalRescue(null)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Assign Volunteer to Rescue
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select an active volunteer to handle this emergency distress
                    call.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAssignModalRescue(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Rescue Overview summary */}
            <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span>{assignModalRescue.location}</span>
                </div>
                <span className="font-extrabold text-red-600 uppercase">
                  {assignModalRescue.urgency}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Affected: {assignModalRescue.peopleCount} People</span>
                <span>Contact: {assignModalRescue.contactPhone}</span>
              </div>
            </div>

            {/* Volunteer Selection List */}
            <div className="mt-4 space-y-2">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Volunteer ({volunteerList.length} Available)
              </span>

              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 border border-slate-200 rounded-xl p-2 bg-slate-50/50">
                {volunteerList.map((vol) => {
                  const isSelected = selectedVolunteerId === vol.id;
                  const activeTasks = volunteerTaskCountMap.get(vol.id) || 0;
                  const isReady = vol.status === "ACTIVE";

                  return (
                    <button
                      key={vol.id}
                      type="button"
                      onClick={() => setSelectedVolunteerId(vol.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {vol.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {vol.name}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {vol.phoneNumber || vol.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isReady
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {vol.status || "ACTIVE"}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {activeTasks} tasks
                        </span>
                      </div>
                    </button>
                  );
                })}

                {volunteerList.length === 0 && (
                  <p className="text-xs text-center text-slate-400 py-4">
                    No registered volunteers found.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setAssignModalRescue(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedVolunteerId || assignMutation.isPending}
                onClick={handleConfirmAssignment}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {assignMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span>Confirm Assignment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: UPDATE RESCUE STATUS */}
      {statusModalRescue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close modal overlay"
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity cursor-default border-none w-full h-full"
            onClick={() => setStatusModalRescue(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Update Rescue Status
                  </h3>
                  <p className="text-xs text-slate-500">
                    Change operational status of this rescue operation.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStatusModalRescue(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                New Status
              </span>

              <div className="grid grid-cols-1 gap-2">
                {RESCUE_STATUSES.map((status) => {
                  const isSelected = newRescueStatus === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setNewRescueStatus(status)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
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
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setStatusModalRescue(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  !newRescueStatus || updateRescueStatusMutation.isPending
                }
                onClick={handleConfirmRescueStatus}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {updateRescueStatusMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span>Update Status</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE NEW RESCUE REQUEST */}
      {isCreateRescueOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close modal overlay"
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity cursor-default border-none w-full h-full"
            onClick={() => setIsCreateRescueOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    New Emergency Rescue Request
                  </h3>
                  <p className="text-xs text-slate-500">
                    Log distress location and assign field rescue team.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateRescueOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateRescueSubmit}
              className="mt-4 space-y-4"
            >
              <div>
                <label
                  htmlFor="location"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  type="text"
                  required
                  value={newRescueForm.location}
                  onChange={(e) =>
                    setNewRescueForm((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="e.g. Uttara Sector 11, Bridge 3, Dhaka"
                  className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="contactPhone"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                  >
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contactPhone"
                    type="text"
                    required
                    value={newRescueForm.contactPhone}
                    onChange={(e) =>
                      setNewRescueForm((prev) => ({
                        ...prev,
                        contactPhone: e.target.value,
                      }))
                    }
                    placeholder="e.g. 01712345678"
                    className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="peopleCount"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                  >
                    People Count <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="peopleCount"
                    type="number"
                    min="1"
                    required
                    value={newRescueForm.peopleCount}
                    onChange={(e) =>
                      setNewRescueForm((prev) => ({
                        ...prev,
                        peopleCount: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="urgency"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                  >
                    Urgency Level
                  </label>
                  <select
                    id="urgency"
                    value={newRescueForm.urgency}
                    onChange={(e) =>
                      setNewRescueForm((prev) => ({
                        ...prev,
                        urgency: e.target.value as UrgencyLevel,
                      }))
                    }
                    className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all cursor-pointer"
                  >
                    {URGENCIES.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="shelterId"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                  >
                    Target Shelter (Optional)
                  </label>
                  <select
                    id="shelterId"
                    value={newRescueForm.shelterId}
                    onChange={(e) =>
                      setNewRescueForm((prev) => ({
                        ...prev,
                        shelterId: e.target.value,
                      }))
                    }
                    className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all cursor-pointer"
                  >
                    <option value="">No Shelter Linked</option>
                    {shelterList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.district || "Shelter"})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Description & Situation Details
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={newRescueForm.description}
                  onChange={(e) =>
                    setNewRescueForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Explain water levels, elderly or children trapped, immediate medical help needed..."
                  className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateRescueOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createRescueMutation.isPending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {createRescueMutation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <span>Create Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: VOLUNTEER USER STATUS MODAL */}
      {userStatusModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close modal overlay"
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity cursor-default border-none w-full h-full"
            onClick={() => setUserStatusModalUser(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Volunteer Account Status
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update status for {userStatusModalUser.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUserStatusModalUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select New Status
              </span>

              <div className="grid grid-cols-1 gap-2">
                {USER_STATUSES.map((status) => {
                  const isSelected = newUserStatus === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setNewUserStatus(status)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-purple-50 border-purple-500 text-purple-800 ring-2 ring-purple-500/20"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <span>{status}</span>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-purple-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setUserStatusModalUser(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!newUserStatus || updateUserStatusMutation.isPending}
                onClick={handleConfirmUserStatus}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {updateUserStatusMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span>Save Status</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
