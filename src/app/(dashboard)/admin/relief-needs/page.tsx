"use client";

import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Filter,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  Truck,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  ReliefNeedModal,
  ReliefNeedTable,
  UpdateFulfillmentModal,
} from "@/components/admin";
import {
  useCreateReliefNeed,
  useDeleteReliefNeed,
  useGetReliefNeeds,
  useGetShelters,
  useUpdateReliefNeed,
} from "@/hooks";
import type {
  ICreateReliefNeedInput,
  IReliefNeed,
  ReliefStatus,
  UrgencyLevel,
} from "@/types";

const URGENCIES: UrgencyLevel[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const STATUSES: ReliefStatus[] = [
  "PENDING",
  "IN_PROGRESS",
  "FULFILLED",
  "CANCELLED",
];

export default function AdminReliefNeedsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [shelterFilter, setShelterFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingNeed, setEditingNeed] = useState<IReliefNeed | null>(null);
  const [progressNeed, setProgressNeed] = useState<IReliefNeed | null>(null);

  // Queries
  const {
    data: reliefData,
    isLoading: isLoadingNeeds,
    isFetching: isFetchingNeeds,
    refetch: refetchNeeds,
  } = useGetReliefNeeds({
    searchTerm: searchTerm.trim() || undefined,
    shelterId: shelterFilter || undefined,
    urgency: urgencyFilter || undefined,
    status: statusFilter || undefined,
  });

  const { data: sheltersData } = useGetShelters();

  // Mutations
  const createMutation = useCreateReliefNeed();
  const updateMutation = useUpdateReliefNeed();
  const deleteMutation = useDeleteReliefNeed();

  // Normalized data lists
  const reliefList = useMemo(() => {
    return Array.isArray(reliefData?.data) ? reliefData.data : [];
  }, [reliefData]);

  const shelterList = useMemo(() => {
    return Array.isArray(sheltersData?.data) ? sheltersData.data : [];
  }, [sheltersData]);

  // Overall Stats
  const stats = useMemo(() => {
    const total = reliefList.length;
    const critical = reliefList.filter(
      (n) => n.urgency === "CRITICAL" && n.status !== "FULFILLED",
    ).length;
    const fulfilledCount = reliefList.filter(
      (n) => n.status === "FULFILLED",
    ).length;
    const inProgress = reliefList.filter(
      (n) => n.status === "IN_PROGRESS",
    ).length;

    let totalRequired = 0;
    let totalDelivered = 0;
    for (const n of reliefList) {
      totalRequired += n.quantity || 0;
      totalDelivered += n.fulfilled || 0;
    }

    const overallRate =
      totalRequired > 0
        ? Math.min(100, Math.round((totalDelivered / totalRequired) * 100))
        : 0;

    return { total, critical, fulfilledCount, inProgress, overallRate };
  }, [reliefList]);

  // Handlers
  const handleCreateSubmit = async (payload: ICreateReliefNeedInput) => {
    try {
      await createMutation.mutateAsync(payload);
      toast.success("New relief requirement created successfully!");
      setIsCreateOpen(false);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create requirement";
      toast.error(errorMsg);
    }
  };

  const handleEditSubmit = async (payload: ICreateReliefNeedInput) => {
    if (!editingNeed) return;
    try {
      await updateMutation.mutateAsync({ id: editingNeed.id, payload });
      toast.success("Relief requirement updated successfully!");
      setEditingNeed(null);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update requirement";
      toast.error(errorMsg);
    }
  };

  const handleFulfillmentSubmit = async (
    needId: string,
    fulfilled: number,
    status: ReliefStatus,
  ) => {
    try {
      await updateMutation.mutateAsync({
        id: needId,
        payload: { fulfilled, status },
      });
      toast.success("Distribution progress updated successfully!");
      setProgressNeed(null);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update progress";
      toast.error(errorMsg);
    }
  };

  const handleDeleteNeed = async (need: IReliefNeed) => {
    if (
      !window.confirm(
        `Are you sure you want to delete relief requirement for "${need.itemName}"?`,
      )
    ) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(need.id);
      toast.success("Relief requirement deleted successfully");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete requirement";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 md:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <PackageCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Relief Needs Management
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Live disaster shelter relief demands, supply fulfillment tracking,
              and emergency logistics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refetchNeeds()}
            disabled={isFetchingNeeds}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 text-slate-500 ${
                isFetchingNeeds ? "animate-spin text-blue-600" : ""
              }`}
            />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 text-xs md:text-sm font-semibold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Post Relief Demand</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 md:gap-4">
        {/* Card 1: Total Demands */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Requirements
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <PackageCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.total}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Items Listed
            </span>
          </div>
        </div>

        {/* Card 2: Critical Urgency */}
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
            <span className="text-xs font-bold text-red-500">Needs Action</span>
          </div>
        </div>

        {/* Card 3: In Progress Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              In Delivery
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Truck className="h-4 w-4" />
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

        {/* Card 4: Fulfilled Needs */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Fulfilled Demands
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.fulfilledCount}
            </span>
            <span className="text-xs font-semibold text-teal-600">
              Completed
            </span>
          </div>
        </div>

        {/* Card 5: Overall Supply Fulfillment Rate */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Overall Fulfillment
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 tracking-tight">
              {stats.overallRate}%
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Supply Met
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items or categories (e.g. Rice, Water, Medical)..."
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
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
          {/* Shelter Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50/80 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={shelterFilter}
              onChange={(e) => setShelterFilter(e.target.value)}
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

          {/* Urgency Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50/80 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
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

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50/80 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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

          {(searchTerm || shelterFilter || urgencyFilter || statusFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setShelterFilter("");
                setUrgencyFilter("");
                setStatusFilter("");
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700 underline px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Modular Relief Need Table */}
      <ReliefNeedTable
        needs={reliefList}
        isLoading={isLoadingNeeds}
        onUpdateFulfillment={(need) => setProgressNeed(need)}
        onEdit={(need) => setEditingNeed(need)}
        onDelete={handleDeleteNeed}
      />

      {/* Create Modal */}
      <ReliefNeedModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        shelters={shelterList}
        onSubmit={handleCreateSubmit}
        isPending={createMutation.isPending}
      />

      {/* Edit Modal */}
      <ReliefNeedModal
        isOpen={Boolean(editingNeed)}
        onClose={() => setEditingNeed(null)}
        shelters={shelterList}
        initialData={editingNeed}
        onSubmit={handleEditSubmit}
        isPending={updateMutation.isPending}
      />

      {/* Update Progress Modal */}
      <UpdateFulfillmentModal
        need={progressNeed}
        isOpen={Boolean(progressNeed)}
        onClose={() => setProgressNeed(null)}
        onUpdate={handleFulfillmentSubmit}
        isPending={updateMutation.isPending}
      />
    </div>
  );
}
