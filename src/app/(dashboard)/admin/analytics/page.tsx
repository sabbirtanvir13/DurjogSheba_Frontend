"use client";

import {
  HeartHandshake,
  LifeBuoy,
  Printer,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  DonationTrendChart,
  ReliefCategoryChart,
  RescueStatusChart,
  ShelterCapacityChart,
  TopLocationsChart,
  UrgencyDistributionChart,
  UserDistributionChart,
} from "@/components/admin/charts";
import {
  useGetAdminDashboardStats,
  useGetAllDonationsAdmin,
  useGetReliefNeeds,
  useGetRescueRequests,
  useGetShelters,
  useGetUsers,
} from "@/hooks";
import type {
  IDonation,
  IReliefNeed,
  IRescueRequest,
  IShelter,
  IUser,
} from "@/types";

type TimeRange = "7d" | "30d" | "all";

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("all");

  const {
    data: statsResponse,
    refetch: refetchStats,
    isRefetching: statsRefetching,
  } = useGetAdminDashboardStats();

  const { data: donationsResponse, refetch: refetchDonations } =
    useGetAllDonationsAdmin();

  const { data: rescuesResponse, refetch: refetchRescues } =
    useGetRescueRequests();

  const { data: reliefResponse, refetch: refetchRelief } = useGetReliefNeeds();

  const { data: sheltersResponse, refetch: refetchShelters } = useGetShelters();

  const { data: usersResponse, refetch: refetchUsers } = useGetUsers();

  const handleRefresh = () => {
    refetchStats();
    refetchDonations();
    refetchRescues();
    refetchRelief();
    refetchShelters();
    refetchUsers();
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Base raw data
  const rawDonations: IDonation[] = useMemo(() => {
    return donationsResponse?.data || [];
  }, [donationsResponse]);

  const rawRescues: IRescueRequest[] = useMemo(() => {
    const raw = rescuesResponse?.data;
    if (Array.isArray(raw)) return raw;
    return [];
  }, [rescuesResponse]);

  const rawRelief: IReliefNeed[] = useMemo(() => {
    const raw = reliefResponse?.data;
    if (Array.isArray(raw)) return raw;
    return [];
  }, [reliefResponse]);

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

  // Filter based on timeRange
  const donations = useMemo(() => {
    if (timeRange === "all") return rawDonations;
    const days = timeRange === "7d" ? 7 : 30;
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
    return rawDonations.filter((item) => {
      if (!item.createdAt) return true;
      return new Date(item.createdAt).getTime() >= threshold;
    });
  }, [rawDonations, timeRange]);

  const rescueRequests = useMemo(() => {
    if (timeRange === "all") return rawRescues;
    const days = timeRange === "7d" ? 7 : 30;
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
    return rawRescues.filter((item) => {
      if (!item.createdAt) return true;
      return new Date(item.createdAt).getTime() >= threshold;
    });
  }, [rawRescues, timeRange]);

  const reliefNeeds = useMemo(() => {
    if (timeRange === "all") return rawRelief;
    const days = timeRange === "7d" ? 7 : 30;
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
    return rawRelief.filter((item) => {
      if (!item.createdAt) return true;
      return new Date(item.createdAt).getTime() >= threshold;
    });
  }, [rawRelief, timeRange]);

  // Key Aggregated Metrics
  const completedDonations = useMemo(
    () => donations.filter((d) => d.status === "COMPLETED"),
    [donations],
  );
  const totalDonationAmount = useMemo(
    () => completedDonations.reduce((acc, d) => acc + Number(d.amount || 0), 0),
    [completedDonations],
  );
  const avgDonation = useMemo(
    () =>
      completedDonations.length > 0
        ? Math.round(totalDonationAmount / completedDonations.length)
        : 0,
    [completedDonations, totalDonationAmount],
  );

  const totalPeopleStranded = useMemo(
    () =>
      rescueRequests.reduce((acc, r) => acc + Number(r.peopleCount || 0), 0),
    [rescueRequests],
  );
  const rescuedCases = useMemo(
    () => rescueRequests.filter((r) => r.status === "RESCUED"),
    [rescueRequests],
  );
  const rescueSuccessRate = useMemo(
    () =>
      rescueRequests.length > 0
        ? Math.round((rescuedCases.length / rescueRequests.length) * 100)
        : 0,
    [rescuedCases, rescueRequests],
  );

  const totalRequestedSupplies = useMemo(
    () => reliefNeeds.reduce((acc, r) => acc + Number(r.quantity || 0), 0),
    [reliefNeeds],
  );
  const totalFulfilledSupplies = useMemo(
    () => reliefNeeds.reduce((acc, r) => acc + Number(r.fulfilled || 0), 0),
    [reliefNeeds],
  );
  const reliefFulfillmentRate = useMemo(
    () =>
      totalRequestedSupplies > 0
        ? Math.min(
            100,
            Math.round((totalFulfilledSupplies / totalRequestedSupplies) * 100),
          )
        : 0,
    [totalRequestedSupplies, totalFulfilledSupplies],
  );

  // Regional Impact Summary Table Data
  const regionalSummary = useMemo(() => {
    const locMap = new Map<
      string,
      {
        totalCalls: number;
        peopleCount: number;
        criticalCount: number;
        rescuedCount: number;
        pendingCount: number;
      }
    >();

    for (const r of rescueRequests) {
      const loc = r.location?.trim() || "Unspecified Region";
      const cur = locMap.get(loc) || {
        totalCalls: 0,
        peopleCount: 0,
        criticalCount: 0,
        rescuedCount: 0,
        pendingCount: 0,
      };

      locMap.set(loc, {
        totalCalls: cur.totalCalls + 1,
        peopleCount: cur.peopleCount + Number(r.peopleCount || 0),
        criticalCount: cur.criticalCount + (r.urgency === "CRITICAL" ? 1 : 0),
        rescuedCount: cur.rescuedCount + (r.status === "RESCUED" ? 1 : 0),
        pendingCount: cur.pendingCount + (r.status === "PENDING" ? 1 : 0),
      });
    }

    return Array.from(locMap.entries())
      .map(([location, data]) => ({
        location,
        ...data,
        resolutionRate:
          data.totalCalls > 0
            ? Math.round((data.rescuedCount / data.totalCalls) * 100)
            : 0,
      }))
      .sort((a, b) => b.totalCalls - a.totalCalls);
  }, [rescueRequests]);

  return (
    <div className="space-y-6">
      {/* Analytics Header & Controls */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              National Disaster Intelligence & Reporting
            </span>
          </div>
          <h1 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Analytics & Operations Intelligence
          </h1>
          <p className="font-[family-name:var(--font-bengali)] text-xs text-slate-500">
            রিয়েল-টাইম গ্রাফ, আর্থিক বিশ্লেষণ, উদ্ধার কার্যকারিতা ও ত্রাণ চাহিদা প্রতিবেদন
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time range filter buttons */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => setTimeRange("7d")}
              className={`rounded-lg px-3 py-1.5 transition ${
                timeRange === "7d"
                  ? "bg-white font-bold text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange("30d")}
              className={`rounded-lg px-3 py-1.5 transition ${
                timeRange === "30d"
                  ? "bg-white font-bold text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Last 30 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange("all")}
              className={`rounded-lg px-3 py-1.5 transition ${
                timeRange === "all"
                  ? "bg-white font-bold text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Time
            </button>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={statsRefetching}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-slate-500 ${statsRefetching ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Print-only title */}
      <div className="hidden print:block mb-4 text-center">
        <h1 className="text-2xl font-bold">
          Durjog Sheba · Executive Disaster Relief Report
        </h1>
        <p className="text-xs text-slate-600">
          Generated on {new Date().toLocaleString()} · Scope:{" "}
          {timeRange === "all"
            ? "Complete Historical Archive"
            : timeRange === "30d"
              ? "Past 30 Days"
              : "Past 7 Days"}
        </p>
      </div>

      {/* 4 Summary Performance Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Rescue Efficiency */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Rescue Resolution Rate
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <LifeBuoy className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-black text-slate-900">
              {rescueSuccessRate}%
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              <strong className="text-emerald-700 font-bold">
                {rescuedCases.length}
              </strong>{" "}
              rescued out of {rescueRequests.length} total appeals (
              {totalPeopleStranded.toLocaleString()} evacuees)
            </p>
          </div>
        </div>

        {/* Metric 2: Relief Supplies Fulfillment */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Relief Fulfillment Rate
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <TrendingUp className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-black text-slate-900">
              {reliefFulfillmentRate}%
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              <strong className="text-amber-700 font-bold">
                {totalFulfilledSupplies.toLocaleString()}
              </strong>{" "}
              delivered / {totalRequestedSupplies.toLocaleString()} units
              demanded
            </p>
          </div>
        </div>

        {/* Metric 3: Total Funds Raised */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Relief Donations
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <HeartHandshake className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-black text-slate-900">
              ৳{totalDonationAmount.toLocaleString()}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              From {completedDonations.length} donors · Avg donation: ৳
              {avgDonation.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Metric 4: Human Mobilization */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Mobilized Human Force
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-black text-slate-900">
              {users.length}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {users.filter((u) => u.role === "VOLUNTEER").length} Ground
              Volunteers · {users.filter((u) => u.status === "ACTIVE").length}{" "}
              Active
            </p>
          </div>
        </div>
      </div>

      {/* Row 1: Financial & Logistics Trajectories */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <DonationTrendChart
          donations={donations}
          title="Financial Inflow Trajectory (BDT)"
          subtitle={`Verified disaster relief contributions over selected period (${timeRange})`}
        />
        <ReliefCategoryChart
          reliefNeeds={reliefNeeds}
          title="Relief Needs & Logistics Delivery"
          subtitle="Direct comparison of emergency supply requests versus delivered goods"
        />
      </div>

      {/* Row 2: Rescue Severity & Operational Status */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RescueStatusChart
          rescueRequests={rescueRequests}
          title="Rescue Mission Operational Stages"
          subtitle="Real-time monitoring of live rescue tickets from pending to resolved"
        />
        <UrgencyDistributionChart
          rescueRequests={rescueRequests}
          title="Disaster Severity & Urgency Distribution"
          subtitle="Classification of incoming distress signals by threat severity"
        />
      </div>

      {/* Row 3: Community Demographics & Hotspots */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <UserDistributionChart
          users={users}
          title="Community Ecosystem & Role Ratios"
          subtitle="Human resource availability across volunteers, donors, and management"
        />
        <TopLocationsChart
          topAffectedLocations={statsResponse?.data?.topAffectedLocations}
          rescueRequests={rescueRequests}
          title="Regional Disaster Severity Hotspots"
          subtitle="Districts and areas with the highest concentrated SOS volume"
        />
      </div>

      {/* Row 4: Shelter Capacity Monitoring */}
      <div className="grid grid-cols-1">
        <ShelterCapacityChart
          shelters={shelters}
          title="Nationwide Shelter Facility Utilization"
          subtitle="Real-time bed availability and capacity buffer for displaced evacuees"
        />
      </div>

      {/* Regional Operations Audit Breakdown Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Regional Operations Breakdown & Distress Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Granular district-level audit of reported distress calls, evacuee
              numbers, and resolution rates
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {regionalSummary.length} Impacted Locations
          </span>
        </div>

        <div className="overflow-x-auto">
          {regionalSummary.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No regional incident data available for the selected filter.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="py-3 px-4">Affected Location</th>
                  <th className="py-3 px-4">Total SOS Calls</th>
                  <th className="py-3 px-4">People Stranded</th>
                  <th className="py-3 px-4">Critical Cases</th>
                  <th className="py-3 px-4">Pending Rescues</th>
                  <th className="py-3 px-4">Rescued / Resolved</th>
                  <th className="py-3 px-4 text-right">Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {regionalSummary.map((item) => (
                  <tr
                    key={item.location}
                    className="hover:bg-slate-50/80 transition"
                  >
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {item.location}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {item.totalCalls}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.peopleCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {item.criticalCount > 0 ? (
                        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-200">
                          {item.criticalCount} Critical
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {item.pendingCount > 0 ? (
                        <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                          {item.pendingCount} Pending
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-700">
                      {item.rescuedCount}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${item.resolutionRate}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-900 text-xs w-8 text-right">
                          {item.resolutionRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
