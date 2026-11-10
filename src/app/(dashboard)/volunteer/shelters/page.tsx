"use client";

import {
  Building2,
  CheckCircle2,
  Filter,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ShelterCard } from "@/components/volunteer";
import { useGetShelters } from "@/hooks";

export default function VolunteerSheltersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");

  const {
    data: sheltersData,
    isLoading,
    isFetching,
    refetch,
  } = useGetShelters();

  const shelterList = useMemo(() => {
    return Array.isArray(sheltersData?.data) ? sheltersData.data : [];
  }, [sheltersData]);

  // Unique districts for filter dropdown
  const districtList = useMemo(() => {
    const set = new Set<string>();
    for (const s of shelterList) {
      if (s.district?.trim()) {
        set.add(s.district.trim());
      }
    }
    return Array.from(set).sort();
  }, [shelterList]);

  // Filtered shelters
  const filteredShelters = useMemo(() => {
    return shelterList.filter((shelter) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const name = (shelter.name || "").toLowerCase();
        const address = (shelter.address || "").toLowerCase();
        const upazila = (shelter.upazila || "").toLowerCase();
        const district = (shelter.district || "").toLowerCase();
        const phone = (shelter.contactPhone || "").toLowerCase();
        if (
          !name.includes(query) &&
          !address.includes(query) &&
          !upazila.includes(query) &&
          !district.includes(query) &&
          !phone.includes(query)
        ) {
          return false;
        }
      }

      // District
      if (selectedDistrict && shelter.district !== selectedDistrict) {
        return false;
      }

      // Availability
      if (availabilityFilter) {
        const cap = shelter.capacity || 1;
        const cur = shelter.currentPeople || 0;
        const rate = (cur / cap) * 100;
        if (availabilityFilter === "AVAILABLE" && rate >= 90) return false;
        if (availabilityFilter === "ALMOST_FULL" && (rate < 75 || rate >= 95))
          return false;
        if (availabilityFilter === "FULL" && rate < 95) return false;
      }

      return true;
    });
  }, [shelterList, searchTerm, selectedDistrict, availabilityFilter]);

  // Overall Stats
  const stats = useMemo(() => {
    const totalShelters = shelterList.length;
    let totalCap = 0;
    let totalPeople = 0;

    for (const s of shelterList) {
      totalCap += s.capacity || 0;
      totalPeople += s.currentPeople || 0;
    }

    const totalVacancies = Math.max(0, totalCap - totalPeople);

    return { totalShelters, totalCap, totalPeople, totalVacancies };
  }, [shelterList]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                Nearby Emergency Shelters
              </h1>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                Real-time occupancy tracking, vacancies, and coordinator contact
                directory for field evacuation.
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
            <span>Refresh Shelters</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
        {/* Total Shelters */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Shelters
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.totalShelters}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Centers
            </span>
          </div>
        </div>

        {/* Total Capacity */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Capacity
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.totalCap.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-500">People</span>
          </div>
        </div>

        {/* Current Evacuees */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Current Occupants
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.totalPeople.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-amber-600">
              Sheltered
            </span>
          </div>
        </div>

        {/* Available Vacancies */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-4.5 shadow-xs bg-linear-to-br from-emerald-50/40 via-white to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Available Space
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700 tracking-tight">
              {stats.totalVacancies.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              Open Vacancies
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
            placeholder="Search by shelter name, address, upazila, or phone..."
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
          {/* District Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50/80 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="">All Districts</option>
              {districtList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50/80 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="">All Vacancies</option>
              <option value="AVAILABLE">
                Available Space (&gt;10% Vacant)
              </option>
              <option value="ALMOST_FULL">Nearly Full (75%-95%)</option>
              <option value="FULL">Fully Occupied (&gt;95%)</option>
            </select>
          </div>

          {(searchTerm || selectedDistrict || availabilityFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedDistrict("");
                setAvailabilityFilter("");
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700 underline px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Grid of Shelters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredShelters.map((shelter) => (
          <ShelterCard
            key={String(shelter.id || shelter._id)}
            shelter={shelter}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredShelters.length === 0 && !isLoading && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
          <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            No emergency shelters found
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different district
            filter.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600 mr-2" />
          <span>Locating nearby emergency shelters...</span>
        </div>
      )}
    </div>
  );
}
