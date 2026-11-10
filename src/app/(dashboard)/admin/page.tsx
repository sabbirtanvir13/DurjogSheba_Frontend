"use client";

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  HeartHandshake,
  LifeBuoy,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import {
  DonationTrendChart,
  RescueStatusChart,
  ShelterCapacityChart,
  TopLocationsChart,
} from "@/components/admin/charts";
import {
  useGetAdminDashboardStats,
  useGetAllDonationsAdmin,
  useGetRescueRequests,
  useGetShelters,
  useGetUsers,
} from "@/hooks";
import type { IDonation, IRescueRequest, IShelter, IUser } from "@/types";

export default function AdminDashboardPage() {
  const {
    data: statsResponse,
    refetch: refetchStats,
    isRefetching: statsRefetching,
  } = useGetAdminDashboardStats();

  const { data: donationsResponse, refetch: refetchDonations } =
    useGetAllDonationsAdmin();

  const { data: rescuesResponse, refetch: refetchRescues } =
    useGetRescueRequests();

  const { data: sheltersResponse, refetch: refetchShelters } = useGetShelters();

  const { data: usersResponse, refetch: refetchUsers } = useGetUsers();

  const handleRefreshAll = () => {
    refetchStats();
    refetchDonations();
    refetchRescues();
    refetchShelters();
    refetchUsers();
  };

  const isRefreshing = statsRefetching;

  // Process data safely
  const stats = statsResponse?.data;

  const donations: IDonation[] = useMemo(() => {
    return donationsResponse?.data || [];
  }, [donationsResponse]);

  const rescueRequests: IRescueRequest[] = useMemo(() => {
    const raw = rescuesResponse?.data;
    if (Array.isArray(raw)) return raw;
    return [];
  }, [rescuesResponse]);

  const shelters: IShelter[] = useMemo(() => {
    const raw = sheltersResponse?.data;
    if (Array.isArray(raw)) return raw;
    return [];
  }, [sheltersResponse]);

  const users: IUser[] = useMemo(() => {
    const raw = usersResponse?.data;
    if (Array.isArray(raw)) return raw;
    return [];
  }, [usersResponse]);

  // Donations calculations
  const completedDonations = useMemo(
    () => donations.filter((d) => d.status === "COMPLETED"),
    [donations],
  );
  const totalRaised = useMemo(
    () => completedDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0),
    [completedDonations],
  );
  const avgDonation = useMemo(
    () =>
      completedDonations.length > 0
        ? Math.round(totalRaised / completedDonations.length)
        : 0,
    [completedDonations, totalRaised],
  );

  // Shelters calculations
  const totalShelterCapacity = useMemo(
    () => shelters.reduce((sum, s) => sum + Number(s.capacity || 0), 0),
    [shelters],
  );
  const totalShelterOccupancy = useMemo(
    () => shelters.reduce((sum, s) => sum + Number(s.currentPeople || 0), 0),
    [shelters],
  );
  const shelterOccupancyRate = useMemo(
    () =>
      totalShelterCapacity > 0
        ? Math.round((totalShelterOccupancy / totalShelterCapacity) * 100)
        : 0,
    [totalShelterCapacity, totalShelterOccupancy],
  );

  // Rescue calculations
  const pendingRescuesCount = useMemo(
    () =>
      stats?.overview?.pendingRescues ??
      rescueRequests.filter((r) => r.status === "PENDING").length,
    [stats, rescueRequests],
  );
  const rescuedCount = useMemo(
    () => rescueRequests.filter((r) => r.status === "RESCUED").length,
    [rescueRequests],
  );
  const rescueSuccessRate = useMemo(
    () =>
      rescueRequests.length > 0
        ? Math.round((rescuedCount / rescueRequests.length) * 100)
        : 0,
    [rescueRequests, rescuedCount],
  );

  // Users breakdown
  const volunteerCount = useMemo(
    () => users.filter((u) => u.role === "VOLUNTEER").length,
    [users],
  );
  const donorCount = useMemo(
    () => users.filter((u) => u.role === "DONOR").length,
    [users],
  );

  // Recent 5 rescue calls
  const recentRescues = useMemo(() => {
    return [...rescueRequests]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [rescueRequests]);

  // Recent 5 donations
  const recentDonations = useMemo(() => {
    return [...donations]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [donations]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Emergency Operations Center · Live Active
            </span>
          </div>
          <h1 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Command & Control Overview
          </h1>
          <p className="font-[family-name:var(--font-bengali)] text-xs text-slate-500">
            জাতীয় দুর্যোগ সাড়াদান, উদ্ধার কার্যক্রম ও মানবিক ত্রাণ সমন্বয় ড্যাশবোর্ড
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-slate-500 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span>{isRefreshing ? "Syncing..." : "Sync Live Data"}</span>
          </button>

          <Link
            href="/admin/analytics"
            className="inline-flex items-center gap-1.5 rounded-xl bg-green-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-green-800 transition"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Analytics & Reports</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Total Users */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Community Users
            </p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Users className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
              {stats?.overview?.totalUsers ?? users.length}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-emerald-600">
                {volunteerCount} Volunteers
              </span>
              <span>·</span>
              <span className="font-semibold text-blue-600">
                {donorCount} Donors
              </span>
            </p>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3">
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <span>Manage User Base</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* KPI 2: Emergency Rescues */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Emergency Rescues
            </p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <LifeBuoy className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
              {stats?.overview?.totalRescueRequests ?? rescueRequests.length}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200/60">
                <AlertTriangle className="h-3 w-3" />
                {pendingRescuesCount} Pending
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                {rescueSuccessRate}% Rescued
              </span>
            </div>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3">
            <Link
              href="/admin/rescue-requests"
              className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
            >
              <span>Rescue Command Center</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* KPI 3: Verified Shelters */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Shelter Network
            </p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Building2 className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
              {stats?.overview?.totalShelters ?? shelters.length}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Capacity:{" "}
              <strong className="text-slate-900">
                {totalShelterOccupancy.toLocaleString()}
              </strong>{" "}
              / {totalShelterCapacity.toLocaleString()} ({shelterOccupancyRate}
              %)
            </p>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3">
            <Link
              href="/admin/shelters"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              <span>Manage Shelter Facilities</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* KPI 4: Total Donations */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Disaster Relief Funds
            </p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <HeartHandshake className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
              ৳{totalRaised.toLocaleString()}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-teal-700">
                {completedDonations.length} Contributions
              </span>
              <span>·</span>
              <span>Avg: ৳{avgDonation.toLocaleString()}</span>
            </p>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3">
            <Link
              href="/admin/donations"
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              <span>Audit Financial Donations</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Graphs Row: 2 Main Visualizations */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <DonationTrendChart donations={donations} />
        <RescueStatusChart rescueRequests={rescueRequests} />
      </div>

      {/* Secondary Graphs Row: Hotspots & Shelters */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <TopLocationsChart
          topAffectedLocations={stats?.topAffectedLocations}
          rescueRequests={rescueRequests}
        />
        <ShelterCapacityChart shelters={shelters} />
      </div>

      {/* Operational Quick Actions */}
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-3">
          Tactical Operations Quick Dispatch
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Link
            href="/admin/volunteers"
            className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-2xs hover:border-green-600 hover:shadow-xs transition group"
          >
            <ShieldCheck className="h-5 w-5 text-green-700 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">
              Deploy Volunteers
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Field Force
            </span>
          </Link>

          <Link
            href="/admin/rescue-requests"
            className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-2xs hover:border-red-500 hover:shadow-xs transition group"
          >
            <LifeBuoy className="h-5 w-5 text-red-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">
              Rescue Command
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Live SOS Calls
            </span>
          </Link>

          <Link
            href="/admin/relief-needs"
            className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-2xs hover:border-amber-500 hover:shadow-xs transition group"
          >
            <TrendingUp className="h-5 w-5 text-amber-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">
              Relief Supply
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Demand & Allocation
            </span>
          </Link>

          <Link
            href="/admin/shelters"
            className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-2xs hover:border-emerald-600 hover:shadow-xs transition group"
          >
            <Building2 className="h-5 w-5 text-emerald-700 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">
              Shelters Registry
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Bed Capacity
            </span>
          </Link>

          <Link
            href="/admin/analytics"
            className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center rounded-xl border border-emerald-300 bg-emerald-50/60 p-3.5 text-center shadow-2xs hover:border-emerald-600 hover:shadow-xs transition group"
          >
            <BarChart3 className="h-5 w-5 text-emerald-800 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-emerald-950">
              Full Analytics
            </span>
            <span className="text-[10px] text-emerald-700 mt-0.5">
              Deep Reports
            </span>
          </Link>
        </div>
      </div>

      {/* Live Operational Activity Feeds: Recent Rescues & Recent Donations */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Left: Recent Emergency Rescue Calls */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <LifeBuoy className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Recent Distress Appeals
                </h3>
                <p className="text-[11px] text-slate-500">
                  Latest emergency rescue requests
                </p>
              </div>
            </div>
            <Link
              href="/admin/rescue-requests"
              className="text-xs font-semibold text-green-700 hover:text-green-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentRescues.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">
                No recent rescue requests reported.
              </p>
            ) : (
              recentRescues.map((rescue) => (
                <div
                  key={rescue.id}
                  className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50 transition"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                          rescue.urgency === "CRITICAL"
                            ? "bg-red-100 text-red-800"
                            : rescue.urgency === "HIGH"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {rescue.urgency}
                      </span>
                      <p className="truncate text-xs font-bold text-slate-900">
                        {rescue.location}
                      </p>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {rescue.peopleCount} people stranded · Contact:{" "}
                      {rescue.contactPhone}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        rescue.status === "RESCUED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : rescue.status === "IN_PROGRESS"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : rescue.status === "ASSIGNED"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {rescue.status}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(rescue.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Recent Fund Contributions */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <HeartHandshake className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Recent Donations
                </h3>
                <p className="text-[11px] text-slate-500">
                  Real-time relief contributions
                </p>
              </div>
            </div>
            <Link
              href="/admin/donations"
              className="text-xs font-semibold text-green-700 hover:text-green-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentDonations.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">
                No recent donations recorded.
              </p>
            ) : (
              recentDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50 transition"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-900">
                      {donation.donor?.name || "Anonymous Humanitarian Donor"}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {donation.donor?.email || "Direct Online Portal"} · TxID:{" "}
                      <span className="font-mono text-slate-700">
                        {donation.transactionId || "N/A"}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1">
                    <span className="text-sm font-black text-emerald-700">
                      ৳{Number(donation.amount || 0).toLocaleString()}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        donation.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : donation.status === "PENDING"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
