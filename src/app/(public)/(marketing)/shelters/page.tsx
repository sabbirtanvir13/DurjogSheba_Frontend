"use client";

import { useGetShelters } from "@/hooks";
import type { IShelter, IReliefNeedItem } from "@/types";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  ChevronDown,
  House,
  MapPin,
  Phone,
  Search,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const bangladeshDistricts: Record<string, string[]> = {
  Khulna: [
    "Khulna",
    "Khulna Sadar",
    "Batiaghata",
    "Dacope",
    "Dumuria",
    "Dighalia",
    "Koyra",
    "Paikgachha",
    "Phultala",
    "Rupsha",
  ],
  Cumilla: [
    "Cumilla",
    "Cumilla Sadar",
    "Barura",
    "Brahmanpara",
    "Burichang",
    "Chandina",
    "Chauddagram",
    "Daudkandi",
    "Debidwar",
    "Homna",
    "Laksam",
    "Muradnagar",
  ],
  Dhaka: [
    "Mirpur",
    "Dhaka",
    "Dhanmondi",
    "Gulshan",
    "Mohammadpur",
    "Uttara",
    "Tejgaon",
    "Savar",
    "Keraniganj",
  ],
  Sylhet: [
    "Sylhet",
    "Sylhet Sadar",
    "Beanibazar",
    "Bishwanath",
    "Dakshin Surma",
    "Fenchuganj",
    "Golapganj",
    "Gowainghat",
    "Jaintiapur",
    "Kanaighat",
    "Companiganj",
    "Zakiganj",
  ],
  Sunamganj: [
    "Sunamganj",
    "Sunamganj Sadar",
    "Chhatak",
    "Derai",
    "Dharampasha",
    "Dowarabazar",
    "Jagannathpur",
    "Jamalganj",
    "Tahirpur",
  ],
  Feni: [
    "Feni",
    "Feni Sadar",
    "Chhagalnaiya",
    "Daganbhuiyan",
    "Parshuram",
    "Fulgazi",
    "Sonagazi",
  ],
  Noakhali: [
    "Noakhali",
    "Noakhali Sadar",
    "Begumganj",
    "Chatkhil",
    "Companiganj",
    "Hatiya",
    "Senbagh",
    "Subarnachar",
  ],
  Chittagong: [
    "Chittagong",
    "Pahartali",
    "Kotwali",
    "Panchlaish",
    "Bakalia",
    "Hathazari",
    "Sitakunda",
    "Mirsharai",
    "Raozan",
    "Anwara",
  ],
};

const defaultShelters: IShelter[] = [
  {
    _id: "khulna-community-shelter",
    id: "khulna-community-shelter",
    name: "Khulna Community Shelter live",
    district: "Khulna",
    upazila: "Khulna",
    address: "Section 10, Block A",
    capacity: 10000,
    currentPeople: 2500,
    contactPerson: "Super Admin",
    contactPhone: "01711223344",
    coordinator: {
      name: "Super Admin",
    },
    images: [
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    _id: "cumilla-community-shelter",
    id: "cumilla-community-shelter",
    name: "Cumilla Community Shelter",
    district: "Cumilla",
    upazila: "Cumilla",
    address: "Section 10, Block A",
    capacity: 1000,
    currentPeople: 250,
    contactPerson: "Super Admin",
    contactPhone: "01711223344",
    coordinator: {
      name: "Super Admin",
    },
    images: [
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    _id: "mirpur-community-shelter",
    id: "mirpur-community-shelter",
    name: "Mirpur Community Shelter",
    district: "Dhaka",
    upazila: "Mirpur",
    address: "Section 10, Block A",
    capacity: 500,
    currentPeople: 50,
    contactPerson: "Super Admin",
    contactPhone: "01711223344",
    coordinator: {
      name: "Super Admin",
    },
    images: [
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
    ],
    reliefNeeds: [
      {
        id: "1",
        name: "ORS",
        quantity: "(1000 PACKET)",
        urgency: "CRITICAL",
      },
      {
        id: "2",
        name: "Masoor Dal",
        quantity: "(150 KG)",
        urgency: "HIGH",
      },
      {
        id: "3",
        name: "Miniket Rice",
        quantity: "(500 KG)",
        urgency: "IN PROGRESS",
      },
    ],
  },
];

export default function SheltersPage() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");

  const [activeFilters, setActiveFilters] = useState<{
    searchTerm?: string;
    district?: string;
    upazila?: string;
  }>({});

  const { data: apiData, isPending } = useGetShelters(activeFilters);

  const availableUpazilas = useMemo(() => {
    if (!selectedDistrict) {
      const all: string[] = [];
      Object.values(bangladeshDistricts).forEach((list) => {
        list.forEach((item) => {
          if (!all.includes(item)) all.push(item);
        });
      });
      return all.sort();
    }
    return bangladeshDistricts[selectedDistrict] || [];
  }, [selectedDistrict]);

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedUpazila("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveFilters({
      searchTerm: searchInput.trim() || undefined,
      district: selectedDistrict || undefined,
      upazila: selectedUpazila || undefined,
    });
  };

  const sheltersList: IShelter[] = useMemo(() => {
    const rawList =
      (apiData as any)?.data && Array.isArray((apiData as any).data)
        ? ((apiData as any).data as IShelter[])
        : Array.isArray(apiData)
          ? (apiData as IShelter[])
          : defaultShelters;

    if (!activeFilters.searchTerm && !activeFilters.district && !activeFilters.upazila) {
      return rawList;
    }

    return rawList.filter((item) => {
      const matchesSearch =
        !activeFilters.searchTerm ||
        item.name.toLowerCase().includes(activeFilters.searchTerm.toLowerCase()) ||
        item.address?.toLowerCase().includes(activeFilters.searchTerm.toLowerCase());

      const matchesDistrict =
        !activeFilters.district ||
        item.district?.toLowerCase() === activeFilters.district.toLowerCase();

      const matchesUpazila =
        !activeFilters.upazila ||
        item.upazila?.toLowerCase() === activeFilters.upazila.toLowerCase();

      return matchesSearch && matchesDistrict && matchesUpazila;
    });
  }, [apiData, activeFilters]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Banner Section */}
      <section
        aria-label="Find Nearby Shelters"
        className="relative w-full overflow-hidden bg-[#0A1220]"
      >
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/hero-background.png"
            alt="DurjogSheba volunteer assisting disaster affected people"
            fill
            priority
            sizes="100vw"
            quality={90}
            className="object-cover object-[75%_center] sm:object-[70%_center] md:object-[65%_center] lg:object-center"
          />

          {/* Left-focused cinematic dark gradient for high contrast readability */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#0A1220] via-[#0A1220]/90 to-[#0A1220]/40 md:to-transparent"
            aria-hidden="true"
          />

          {/* Desktop gradient sweep */}
          <div
            className="hidden md:block absolute inset-0 bg-[linear-gradient(to_right,#0A1220_0%,#0A1220_35%,rgba(10,18,32,0.92)_50%,rgba(10,18,32,0.55)_70%,transparent_100%)]"
            aria-hidden="true"
          />

          {/* Top & bottom subtle vignette */}
          <div
            className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,18,32,0.35)_0%,transparent_20%,transparent_80%,rgba(10,18,32,0.5)_100%)]"
            aria-hidden="true"
          />
        </div>

        {/* Foreground Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20">
          <div className="max-w-2xl">
            {/* Title */}
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
              Find Nearby <span className="text-[#EF4444]">Shelters</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-3.5 text-sm sm:text-base text-slate-200/90 leading-relaxed font-normal">
              Get safe shelter and support during disasters.
              <br />
              Together, we can rebuild lives.
            </p>

            {/* Floating Search Bar (Pill Container) */}
            <form
              onSubmit={handleSearch}
              className="mt-8 flex flex-col md:flex-row items-stretch md:items-center bg-white rounded-2xl md:rounded-full p-2 md:p-1.5 shadow-2xl max-w-3xl border border-white/20"
            >
              {/* Field 1: Search shelter name */}
              <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search shelter name..."
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Vertical divider */}
              <div className="hidden md:block h-6 w-px bg-slate-200" />

              {/* Field 2: District dropdown */}
              <div className="flex items-center gap-2 px-3.5 py-2 relative border-t md:border-t-0 border-slate-100">
                <MapPin className="h-4 w-4 text-slate-600 shrink-0" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-medium text-slate-700 cursor-pointer focus:outline-none pr-5 appearance-none w-full"
                >
                  <option value="">All Districts</option>
                  {Object.keys(bangladeshDistricts).map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 pointer-events-none absolute right-3" />
              </div>

              {/* Vertical divider */}
              <div className="hidden md:block h-6 w-px bg-slate-200" />

              {/* Field 3: Upazila dropdown */}
              <div className="flex items-center gap-2 px-3.5 py-2 relative border-t md:border-t-0 border-slate-100">
                <Building2 className="h-4 w-4 text-slate-600 shrink-0" />
                <select
                  value={selectedUpazila}
                  onChange={(e) => setSelectedUpazila(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-medium text-slate-700 cursor-pointer focus:outline-none pr-5 appearance-none w-full"
                >
                  <option value="">All Upazilas</option>
                  {availableUpazilas.map((upazila) => (
                    <option key={upazila} value={upazila}>
                      {upazila}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 pointer-events-none absolute right-3" />
              </div>

              {/* Red Search Button */}
              <button
                type="submit"
                className="rounded-xl md:rounded-full bg-[#E11D48] hover:bg-rose-700 transition-colors text-white text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2.5 flex items-center justify-center gap-2 shadow-sm shrink-0 cursor-pointer mt-2 md:mt-0"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Shelters Grid Section */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {isPending ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse"
              >
                <div className="h-48 w-full bg-slate-200 rounded-xl" />
                <div className="mt-4 h-5 w-3/4 bg-slate-200 rounded" />
                <div className="mt-2 h-4 w-1/2 bg-slate-100 rounded" />
                <div className="mt-4 h-12 w-full bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : sheltersList.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <Building2 className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-3 text-lg font-bold text-slate-800">
              No shelters found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your search criteria or district filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setSelectedDistrict("");
                setSelectedUpazila("");
                setActiveFilters({});
              }}
              className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-start">
            {sheltersList.map((shelter, idx) => (
              <ShelterCard
                key={shelter._id || shelter.id || `shelter-${idx}`}
                shelter={shelter}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA Banner: Need Help? We're Here for You */}
        <div className="mt-12 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 sm:gap-4">
            {/* Custom Support Icon matching image */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50/80 shadow-xs">
              <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none">
                <path
                  d="M24 16C21.8 12 16.5 11.5 13.5 14.5C10.5 17.5 11 23 15 27L24 35L33 27C37 23 37.5 17.5 34.5 14.5C31.5 11.5 26.2 12 24 16Z"
                  fill="#DC2626"
                />
                <path
                  d="M12 28C8 30 6 34 6 38C6 40 8 41 11 41H20C21.5 41 22.5 40 23 38.5L20 34C18.5 31.8 15 30 12 28Z"
                  fill="#0B2545"
                />
                <path
                  d="M36 28C40 30 42 34 42 38C42 40 40 41 37 41H28C26.5 41 25.5 40 25 38.5L28 34C29.5 31.8 33 30 36 28Z"
                  fill="#0B2545"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                Need Help? We&apos;re Here for You
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Contact our team for support or report an emergency.
              </p>
            </div>
          </div>

          <a
            href="tel:0170000001"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B2545] hover:bg-[#081b33] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 shadow-sm transition-colors shrink-0"
          >
            <Phone className="h-4 w-4" />
            <span>Call 0170000001</span>
          </a>
        </div>
      </main>
    </div>
  );
}

function ShelterCard({ shelter }: { shelter: IShelter }) {
  const currentPeople = shelter.currentPeople ?? 0;
  const capacity = shelter.capacity ?? 0;

  const imageUrl =
    shelter.images && shelter.images.length > 0 && shelter.images[0]
      ? shelter.images[0]
      : "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80";

  const coordinatorName =
    typeof shelter.coordinator === "object" && shelter.coordinator?.name
      ? shelter.coordinator.name
      : typeof shelter.coordinator === "string"
        ? shelter.coordinator
        : shelter.contactPerson || "Super Admin";

  const shelterId = shelter._id || shelter.id || "details";

  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Top Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
        <Image
          src={imageUrl}
          alt={shelter.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating Capacity Pill Badge */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 rounded-full bg-slate-950/75 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-md border border-white/10">
          <Users className="h-3.5 w-3.5 text-white" />
          <span>
            {currentPeople.toLocaleString()} / {capacity.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title Row with red MapPin */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4.5 w-4.5 text-red-600 shrink-0 mt-0.5" />
            <h2 className="text-base font-bold text-slate-950 leading-snug">
              {shelter.name}
            </h2>
          </div>

          {/* District • Upazila Row */}
          <div className="mt-1 flex items-center gap-1.5 pl-6 text-xs font-medium text-slate-500">
            <MapPin className="h-3 w-3 text-red-600 shrink-0" />
            <span>
              {shelter.district} • {shelter.upazila}
            </span>
          </div>

          {/* Address Line with House icon */}
          <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-slate-700">
            <House className="h-3.5 w-3.5 text-slate-800 shrink-0" />
            <span>{shelter.address || "Section 10, Block A"}</span>
          </div>

          {/* Stats 3-column row */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-3 divide-x divide-slate-100 text-left">
            {/* Capacity */}
            <div className="flex items-center gap-2 pr-1">
              <Users className="h-4 w-4 text-blue-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-slate-400 leading-none">
                  Capacity
                </p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1 truncate">
                  {capacity.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Current People */}
            <div className="flex items-center gap-2 px-2">
              <Users className="h-4 w-4 text-blue-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-slate-400 leading-none">
                  Current People
                </p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1 truncate">
                  {currentPeople.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-2 pl-2">
              <Phone className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-slate-400 leading-none">
                  Contact
                </p>
                <p className="text-[11px] sm:text-xs font-bold text-slate-900 mt-1 truncate">
                  {shelter.contactPhone}
                </p>
              </div>
            </div>
          </div>

          {/* Relief Needs Items (if present) */}
          {shelter.reliefNeeds && shelter.reliefNeeds.length > 0 && (
            <div className="mt-4 rounded-xl bg-red-50/40 border border-red-100/70 p-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                <span>Relief Needs ({shelter.reliefNeeds.length} Items)</span>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2">
                {shelter.reliefNeeds.map((need: IReliefNeedItem, idx: number) => {
                  const isCritical =
                    need.urgency === "CRITICAL" ||
                    need.urgency?.toLowerCase().includes("crit");
                  const isHigh =
                    need.urgency === "HIGH" ||
                    need.urgency?.toLowerCase().includes("high");

                  return (
                    <div
                      key={need.id || `need-${idx}`}
                      className={`rounded-lg p-1.5 text-center flex flex-col justify-between items-center ${
                        isCritical
                          ? "bg-red-50/90 border border-red-100"
                          : isHigh
                            ? "bg-amber-50/90 border border-amber-100"
                            : "bg-blue-50/90 border border-blue-100"
                      }`}
                    >
                      <p className="text-[11px] font-bold text-slate-800 truncate w-full">
                        {need.name}
                      </p>
                      {need.quantity && (
                        <p className="text-[9px] text-slate-500 font-medium truncate w-full">
                          {need.quantity}
                        </p>
                      )}
                      <span
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider mt-1 ${
                          isCritical
                            ? "bg-red-500 text-white"
                            : isHigh
                              ? "bg-amber-500 text-white"
                              : "bg-blue-500 text-white"
                        }`}
                      >
                        {need.urgency || "HIGH"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer: Coordinator & View Details Button */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
          {/* Coordinator */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-400 leading-none">
                Coordinator
              </p>
              <p className="text-xs font-bold text-slate-800 mt-0.5 truncate max-w-[110px] sm:max-w-[130px]">
                {coordinatorName}
              </p>
            </div>
          </div>

          {/* View Details Button */}
          <Link
            href={`/shelters/${shelterId}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B2545] hover:bg-[#081b33] text-white text-xs font-bold px-4 py-2.5 shadow-sm transition-all hover:gap-2 shrink-0"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
