"use client";

import {
  AlertCircle,
  AlertTriangle,
  Building2,
  ChevronDown,
  ExternalLink,
  Flame,
  House,
  Loader2,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import CreateShelter from "@/components/form/CreateShelter";
import { useDeleteShelter, useGetShelters } from "@/hooks";
import type { IShelter } from "@/types";

const bangladeshDistricts = [
  "Khulna",
  "Cumilla",
  "Dhaka",
  "Sylhet",
  "Sunamganj",
  "Feni",
  "Noakhali",
  "Chittagong",
];

export default function AdminShelterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [shelterToDelete, setShelterToDelete] = useState<IShelter | null>(null);

  const { data: apiData, isPending, refetch } = useGetShelters();
  const { mutateAsync: deleteShelterFn, isPending: isDeleting } =
    useDeleteShelter();

  // Extract raw shelters list from API response
  const allShelters: IShelter[] = useMemo(() => {
    if (!apiData) return [];
    if ("data" in apiData && Array.isArray(apiData.data)) {
      return apiData.data as IShelter[];
    }
    if (Array.isArray(apiData)) {
      return apiData as IShelter[];
    }
    return [];
  }, [apiData]);

  // Client-side filtered list
  const filteredShelters = useMemo(() => {
    return allShelters.filter((item) => {
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        item.name?.toLowerCase().includes(search) ||
        item.address?.toLowerCase().includes(search) ||
        item.upazila?.toLowerCase().includes(search) ||
        item.contactPerson?.toLowerCase().includes(search);

      const matchesDistrict =
        !selectedDistrict ||
        item.district?.toLowerCase() === selectedDistrict.toLowerCase();

      return matchesSearch && matchesDistrict;
    });
  }, [allShelters, searchTerm, selectedDistrict]);

  // Aggregate Metrics
  const stats = useMemo(() => {
    const totalShelters = allShelters.length;
    const totalCapacity = allShelters.reduce(
      (acc, s) => acc + (s.capacity || 0),
      0,
    );
    const totalOccupied = allShelters.reduce(
      (acc, s) => acc + (s.currentPeople || 0),
      0,
    );
    const totalReliefItems = allShelters.reduce(
      (acc, s) => acc + (s.reliefNeeds?.length || 0),
      0,
    );

    return { totalShelters, totalCapacity, totalOccupied, totalReliefItems };
  }, [allShelters]);

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!shelterToDelete) return;
    const id = String(shelterToDelete.id || shelterToDelete._id);
    try {
      await deleteShelterFn(id);
      toast.success(`Shelter "${shelterToDelete.name}" deleted successfully.`);
      setShelterToDelete(null);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "data" in err
          ? (err.data as { message?: string })?.message
          : err instanceof Error
            ? err.message
            : "Failed to delete shelter";
      toast.error(errorMsg || "Failed to delete shelter.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Shelters Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time management, capacity intake, and evacuation logistics for
            all shelters.
          </p>
        </div>

        {/* Top Right Corner Action Button */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refetch()}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-xs transition-colors"
            title="Refresh list"
          >
            <RefreshCw
              className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
            />
          </button>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B2545] hover:bg-[#081b33] text-white font-bold text-xs sm:text-sm px-4.5 py-2.5 shadow-md shadow-[#0B2545]/20 transition-all hover:shadow-lg hover:-translate-y-0.5 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Create Shelter</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards (4 KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Shelters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Shelters
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {stats.totalShelters.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Active disaster hubs
          </p>
        </div>

        {/* Total Capacity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Capacity
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {stats.totalCapacity.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Max evacuee spaces
          </p>
        </div>

        {/* Total Sheltered */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <Flame className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Currently Sheltered
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {stats.totalOccupied.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">People registered</p>
        </div>

        {/* Active Relief Needs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <div className="h-8 w-8 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Relief Needs
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {stats.totalReliefItems.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Urgent supply requests
          </p>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search shelter by name, address, upazila, or contact..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-xs sm:text-sm text-slate-900 outline-none transition focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 placeholder:text-slate-400"
          />
        </div>

        {/* District Dropdown Filter */}
        <div className="relative shrink-0 sm:w-48">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-8 text-xs sm:text-sm font-medium text-slate-700 outline-none transition focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 appearance-none cursor-pointer"
          >
            <option value="">All Districts</option>
            {bangladeshDistricts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Shelters Data Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {isPending ? (
          <div className="p-8 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">
              Loading shelter database...
            </p>
          </div>
        ) : filteredShelters.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              No shelters found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm || selectedDistrict
                ? "Try clearing your search term or district filter."
                : "No emergency shelters have been added yet. Click 'Create Shelter' above to get started."}
            </p>
            {searchTerm || selectedDistrict ? (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDistrict("");
                }}
                className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
              >
                Reset Filters
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#0B2545] px-4 py-2 text-xs font-bold text-white hover:bg-[#081b33] transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add First Shelter</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3.5">
                    Shelter
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Location
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Intake & Capacity
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Contact Person
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Relief Needs
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredShelters.map((shelter) => {
                  const capacity = shelter.capacity || 0;
                  const currentPeople = shelter.currentPeople || 0;
                  const available = Math.max(0, capacity - currentPeople);
                  const occupancy =
                    capacity > 0
                      ? Math.min(
                          100,
                          Math.round((currentPeople / capacity) * 100),
                        )
                      : 0;

                  const isFull = available <= 0 || occupancy >= 100;
                  const isNearFull = occupancy >= 80 && !isFull;

                  const shelterId = String(shelter.id || shelter._id || "");
                  const imageUrl =
                    shelter.images && shelter.images.length > 0
                      ? shelter.images[0]
                      : null;

                  return (
                    <tr
                      key={shelterId || shelter.name}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Column 1: Shelter Name & Image */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={shelter.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-blue-50 text-blue-600">
                                <Building2 className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[240px]">
                              {shelter.name}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">
                              <House className="h-3 w-3 shrink-0 text-slate-400" />
                              <span className="truncate">
                                {shelter.address || "No address specified"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Location */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          <MapPin className="h-3 w-3 text-red-600 shrink-0" />
                          {shelter.district} • {shelter.upazila}
                        </span>
                      </td>

                      {/* Column 3: Capacity & Progress */}
                      <td className="px-4 py-4 min-w-[170px]">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800">
                              {currentPeople.toLocaleString()} /{" "}
                              {capacity.toLocaleString()}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                isFull
                                  ? "bg-red-100 text-red-700"
                                  : isNearFull
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {occupancy}%
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isFull
                                  ? "bg-red-500"
                                  : isNearFull
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                              }`}
                              style={{ width: `${occupancy}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {available.toLocaleString()} spaces available
                          </p>
                        </div>
                      </td>

                      {/* Column 4: Contact Person */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-semibold text-slate-800 text-xs">
                            {shelter.contactPerson || "Not Assigned"}
                          </p>
                          {shelter.contactPhone && (
                            <a
                              href={`tel:${shelter.contactPhone}`}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:underline mt-0.5"
                            >
                              <Phone className="h-3 w-3" />
                              <span>{shelter.contactPhone}</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Column 5: Relief Needs */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {shelter.reliefNeeds &&
                        shelter.reliefNeeds.length > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 text-xs font-bold">
                            <AlertTriangle className="h-3 w-3" />
                            {shelter.reliefNeeds.length} Needed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs font-semibold">
                            Stocked
                          </span>
                        )}
                      </td>

                      {/* Column 6: Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-2">
                          {/* Public Details View Link */}
                          <Link
                            href={`/shelters/${shelterId}`}
                            target="_blank"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
                            title="View Public Details"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>

                          {/* Delete Action Button */}
                          <button
                            type="button"
                            onClick={() => setShelterToDelete(shelter)}
                            className="p-1.5 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                            title="Delete Shelter"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* POPUP MODAL: Create New Shelter Form */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop Blur Overlay */}
          <button
            type="button"
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in cursor-default w-full h-full border-none p-0"
            onClick={() => setIsCreateOpen(false)}
            aria-label="Close modal overlay"
          />

          {/* Modal Content Box */}
          <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0B2545] text-white px-6 py-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold tracking-tight">
                    Create Emergency Shelter
                  </h2>
                  <p className="text-xs text-slate-300">
                    Add a shelter facility to the national disaster response
                    directory.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto">
              <CreateShelter
                onSuccess={() => setIsCreateOpen(false)}
                onCancel={() => setIsCreateOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {shelterToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in cursor-default w-full h-full border-none p-0"
            onClick={() => setShelterToDelete(null)}
            aria-label="Close modal overlay"
          />

          <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Delete Emergency Shelter?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This action is permanent and will remove the facility from all
                  registries.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700 mb-5">
              <p>
                <strong>Shelter:</strong> {shelterToDelete.name}
              </p>
              <p className="mt-1 text-slate-500">
                {shelterToDelete.upazila}, {shelterToDelete.district}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShelterToDelete(null)}
                className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 shadow-md shadow-red-600/20 transition-colors disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Shelter</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
