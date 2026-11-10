"use client";

import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Filter,
  Heart,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  UserCog,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useGetUsers, useUpdateUserStatus } from "@/hooks";
import type { IUser, UserRole, UserStatus } from "@/types";

const ROLES: UserRole[] = ["ADMIN", "VOLUNTEER", "DONOR"];
const STATUSES: UserStatus[] = ["ACTIVE", "BLOCKED", "PENDING", "SUSPENDED"];

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusModalUser, setStatusModalUser] = useState<IUser | null>(null);
  const [newStatus, setNewStatus] = useState<UserStatus | "">("");

  const { data: apiData, isPending, refetch } = useGetUsers();
  const { mutateAsync: updateStatusFn, isPending: isUpdating } =
    useUpdateUserStatus();

  // Extract raw users list from API
  const allUsers: IUser[] = useMemo(() => {
    if (!apiData) return [];
    if ("data" in apiData && Array.isArray(apiData.data)) {
      return apiData.data as IUser[];
    }
    if (Array.isArray(apiData)) {
      return apiData as IUser[];
    }
    return [];
  }, [apiData]);

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.phoneNumber?.toLowerCase().includes(search);

      const matchesRole =
        !selectedRole ||
        user.role?.toUpperCase() === selectedRole.toUpperCase();

      const matchesStatus =
        !selectedStatus ||
        user.status?.toUpperCase() === selectedStatus.toUpperCase();

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [allUsers, searchTerm, selectedRole, selectedStatus]);

  // Aggregate Metrics
  const stats = useMemo(() => {
    const total = allUsers.length;
    const admins = allUsers.filter((u) => u.role === "ADMIN").length;
    const volunteers = allUsers.filter((u) => u.role === "VOLUNTEER").length;
    const donors = allUsers.filter((u) => u.role === "DONOR").length;
    const active = allUsers.filter((u) => u.status === "ACTIVE").length;
    const blocked = allUsers.filter((u) => u.status === "BLOCKED").length;

    return { total, admins, volunteers, donors, active, blocked };
  }, [allUsers]);

  // Status Update Handler
  const handleStatusChangeSubmit = async () => {
    if (!statusModalUser || !newStatus) return;

    try {
      await updateStatusFn({
        id: statusModalUser.id,
        status: newStatus as UserStatus,
      });
      toast.success(
        `User ${statusModalUser.name}'s status changed to ${newStatus} successfully!`,
      );
      setStatusModalUser(null);
      setNewStatus("");
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "data" in err
          ? (err.data as { message?: string })?.message
          : err instanceof Error
            ? err.message
            : "Failed to update user status";
      toast.error(errorMsg || "Failed to update user status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Oversee user accounts, role authorizations, and operational
            membership statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition-colors cursor-pointer"
          title="Refresh user list"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Top Metric Cards (4 KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Users
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {stats.total.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {stats.active} Active accounts
          </p>
        </div>

        {/* Admins */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <div className="h-8 w-8 rounded-xl bg-purple-50 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Admins
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {stats.admins.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            System administrators
          </p>
        </div>

        {/* Volunteers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Heart className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Volunteers
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {stats.volunteers.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Field relief workers
          </p>
        </div>

        {/* Donors */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center">
              <UserCheck className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Donors
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {stats.donors.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Aid contributors</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, email, or phone..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-xs sm:text-sm text-slate-900 outline-none transition focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 placeholder:text-slate-400"
          />
        </div>

        {/* Role Filter */}
        <div className="relative shrink-0 sm:w-40">
          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-8.5 pr-8 text-xs font-semibold text-slate-700 outline-none transition focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 appearance-none cursor-pointer"
          >
            <option value="">All Roles</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative shrink-0 sm:w-40">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-8.5 pr-8 text-xs font-semibold text-slate-700 outline-none transition focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Users Data Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {isPending ? (
          <div className="p-10 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">
              Loading user directory from database...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              No users found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm || selectedRole || selectedStatus
                ? "Try clearing your search query or role/status filters."
                : "No registered users in the database yet."}
            </p>
            {(searchTerm || selectedRole || selectedStatus) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRole("");
                  setSelectedStatus("");
                }}
                className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3.5">
                    User
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Phone
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Role
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Verification
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Joined
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3.5 text-right min-w-[140px]"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const role = (user.role || "DONOR").toUpperCase();
                  const status = (user.status || "ACTIVE").toUpperCase();

                  const isRoleAdmin = role === "ADMIN";
                  const isRoleVolunteer = role === "VOLUNTEER";

                  const isStatusActive = status === "ACTIVE";
                  const isStatusBlocked = status === "BLOCKED";
                  const isStatusSuspended = status === "SUSPENDED";

                  const initials = (user.name || "User")
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Column 1: User Profile */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-slate-800 to-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs border border-slate-700">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate max-w-[180px] sm:max-w-[220px]">
                              {user.name}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">
                              <Mail className="h-3 w-3 shrink-0 text-slate-400" />
                              <span className="truncate">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Phone */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs">
                        {user.phoneNumber ? (
                          <a
                            href={`tel:${user.phoneNumber}`}
                            className="inline-flex items-center gap-1.5 font-medium text-slate-800 hover:text-blue-600 transition-colors"
                          >
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            <span>{user.phoneNumber}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">Not set</span>
                        )}
                      </td>

                      {/* Column 3: Role Badge */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border shadow-xs ${
                            isRoleAdmin
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : isRoleVolunteer
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {isRoleAdmin ? (
                            <Shield className="h-3 w-3" />
                          ) : isRoleVolunteer ? (
                            <Heart className="h-3 w-3" />
                          ) : (
                            <UserCheck className="h-3 w-3" />
                          )}
                          <span>{role}</span>
                        </span>
                      </td>

                      {/* Column 4: Verification */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs">
                        {user.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                            <XCircle className="h-3.5 w-3.5 text-slate-400" />
                            <span>Unverified</span>
                          </span>
                        )}
                      </td>

                      {/* Column 5: Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border ${
                            isStatusActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isStatusBlocked
                                ? "bg-red-50 text-red-700 border-red-200"
                                : isStatusSuspended
                                  ? "bg-orange-50 text-orange-700 border-orange-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isStatusActive
                                ? "bg-emerald-600 animate-pulse"
                                : isStatusBlocked
                                  ? "bg-red-600"
                                  : "bg-amber-500"
                            }`}
                          />
                          <span>{status}</span>
                        </span>
                      </td>

                      {/* Column 6: Joined Date */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "N/A"}
                        </span>
                      </td>

                      {/* Column 7: Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setStatusModalUser(user);
                            setNewStatus(user.status);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-bold px-3 py-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <UserCog className="h-3.5 w-3.5 text-slate-500" />
                          <span>Change Status</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* POPUP MODAL: Change User Status */}
      {statusModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in cursor-default w-full h-full border-none p-0"
            onClick={() => setStatusModalUser(null)}
            aria-label="Close modal overlay"
          />

          <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserCog className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Update User Status
                  </h3>
                  <p className="text-xs text-slate-500">
                    Modify account access and authorization status.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStatusModalUser(null)}
                className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Target User Info */}
            <div className="my-4 rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-1">
              <p className="text-xs font-bold text-slate-800">
                {statusModalUser.name}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Mail className="h-3 w-3 text-slate-400" />
                {statusModalUser.email}
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px]">
                <span className="text-slate-500">Current Role:</span>
                <strong className="text-slate-700">
                  {statusModalUser.role}
                </strong>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">Current Status:</span>
                <strong className="text-slate-700">
                  {statusModalUser.status}
                </strong>
              </div>
            </div>

            {/* Status Selection */}
            <div className="space-y-2">
              <label
                htmlFor="user-status-select"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Select New Status
              </label>

              <div className="grid grid-cols-2 gap-2">
                {STATUSES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setNewStatus(st)}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                      newStatus === st
                        ? "border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-600/20"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{st}</span>
                      {newStatus === st && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => setStatusModalUser(null)}
                className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdating || newStatus === statusModalUser.status}
                onClick={handleStatusChangeSubmit}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B2545] hover:bg-[#081b33] text-white font-bold text-xs px-5 py-2.5 shadow-md shadow-[#0B2545]/20 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Apply Status</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
