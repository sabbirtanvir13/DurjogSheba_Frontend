"use client";

import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Flame,
  HeartHandshake,
  House,
  Info,
  LifeBuoy,
  Mail,
  MapPin,
  Navigation,
  PackageCheck,
  Phone,
  PhoneCall,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useGetShelterById } from "@/hooks";
import type { IReliefNeedItem, IRescueRequestItem, IShelter } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ShelterDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetShelterById(id);

  // Extract shelter data from API response structure
  const shelter: IShelter | undefined = useMemo(() => {
    if (!apiResponse) return undefined;
    if ("data" in apiResponse && apiResponse.data) {
      return Array.isArray(apiResponse.data)
        ? apiResponse.data[0]
        : apiResponse.data;
    }
    return apiResponse as unknown as IShelter;
  }, [apiResponse]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const images = useMemo(() => {
    if (
      shelter?.images &&
      Array.isArray(shelter.images) &&
      shelter.images.length > 0
    ) {
      return shelter.images.filter(Boolean);
    }
    return [];
  }, [shelter?.images]);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => {
      setCopiedField((prev) => (prev === label ? null : prev));
    }, 2000);
  };

  // Share helper
  const handleShare = async () => {
    if (!shelter) return;
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shelter.name,
          text: `Emergency Shelter details for ${shelter.name} in ${shelter.upazila}, ${shelter.district}.`,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or share dismissed
      }
    }
    handleCopy(shareUrl, "Shelter link");
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb skeleton */}
          <div className="h-5 w-64 bg-slate-200 rounded animate-pulse mb-6" />

          {/* Header skeleton */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 mb-8 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="h-6 w-32 bg-slate-200 rounded-full animate-pulse" />
                <div className="h-10 w-3/4 bg-slate-200 rounded-xl animate-pulse" />
                <div className="h-5 w-1/2 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="flex gap-3">
                <div className="h-12 w-32 bg-slate-200 rounded-xl animate-pulse" />
                <div className="h-12 w-36 bg-slate-200 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="aspect-16/10 rounded-3xl bg-slate-200 animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-28 bg-slate-200 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
              <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
            </div>
            <div className="space-y-6">
              <div className="h-80 bg-slate-200 rounded-3xl animate-pulse" />
              <div className="h-60 bg-slate-200 rounded-3xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error / Not Found state
  if (isError || !shelter) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-5">
            <AlertCircle className="h-9 w-9" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Shelter Not Found
          </h1>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            The emergency shelter you are looking for does not exist or may have
            been removed from the registry.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shelters"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B2545] hover:bg-[#081b33] px-5 py-3 text-sm font-bold text-white transition-all shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Shelters</span>
            </Link>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition-all shadow-xs"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Derived metrics
  const capacity = shelter.capacity || 0;
  const currentPeople = shelter.currentPeople || 0;
  const availableSpaces = Math.max(0, capacity - currentPeople);
  const occupancyPercentage =
    capacity > 0
      ? Math.min(100, Math.round((currentPeople / capacity) * 100))
      : 0;

  const isFull = availableSpaces === 0 || occupancyPercentage >= 100;
  const isNearFull = occupancyPercentage >= 80 && !isFull;

  const coordinatorName =
    typeof shelter.coordinator === "object" && shelter.coordinator?.name
      ? shelter.coordinator.name
      : typeof shelter.coordinator === "string"
        ? shelter.coordinator
        : shelter.contactPerson || "Not Assigned";

  const coordinatorEmail =
    typeof shelter.coordinator === "object" && shelter.coordinator?.email
      ? shelter.coordinator.email
      : undefined;

  const coordinatorPhone =
    typeof shelter.coordinator === "object" &&
    (shelter.coordinator.phoneNumber || shelter.coordinator.phone)
      ? shelter.coordinator.phoneNumber || shelter.coordinator.phone
      : undefined;

  const fullAddress = [
    shelter.address,
    shelter.upazila,
    shelter.district,
    "Bangladesh",
  ]
    .filter(Boolean)
    .join(", ");

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${shelter.name}, ${fullAddress}`,
  )}`;

  const reliefNeeds: IReliefNeedItem[] = shelter.reliefNeeds || [];
  const rescueRequests: IRescueRequestItem[] = shelter.rescueRequests || [];

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      {/* Top Banner Navigation Bar */}
      <section className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 overflow-hidden"
          >
            <Link
              href="/"
              className="hover:text-slate-900 transition-colors shrink-0 flex items-center gap-1.5"
            >
              <House className="h-3.5 w-3.5 text-slate-400" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
            <Link
              href="/shelters"
              className="hover:text-slate-900 transition-colors shrink-0"
            >
              Shelters
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
            <span className="font-semibold text-slate-900 truncate">
              {shelter.name}
            </span>
          </nav>

          {/* Quick Back Button */}
          <Link
            href="/shelters"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg transition-colors shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Back to Shelters</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Top Header Card */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs mb-8">
          {/* Subtle Ambient Background Accents */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-red-100/30 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            {/* Title & Metadata */}
            <div className="space-y-3 flex-1 min-w-0">
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Live Status Pill */}
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase shadow-xs ${
                    isFull
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : isNearFull
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full animate-pulse ${
                      isFull
                        ? "bg-red-600"
                        : isNearFull
                          ? "bg-amber-500"
                          : "bg-emerald-600"
                    }`}
                  />
                  {isFull
                    ? "Shelter Full"
                    : isNearFull
                      ? "Limited Space"
                      : "Active & Available"}
                </span>

                {/* Location Badge */}
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  <MapPin className="h-3 w-3 text-red-600" />
                  {shelter.district} • {shelter.upazila}
                </span>

                {/* Verified Official Badge */}
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                  Verified Facility
                </span>
              </div>

              {/* Shelter Main Name */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {shelter.name}
              </h1>

              {/* Address with Click to Copy */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-sm text-slate-600">
                <House className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="font-medium">{shelter.address}</span>
                <span className="text-slate-300">•</span>
                <span>
                  {shelter.upazila}, {shelter.district}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(fullAddress, "Address")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline ml-1"
                >
                  <Copy className="h-3 w-3" />
                  {copiedField === "Address" ? "Copied!" : "Copy Address"}
                </button>
              </div>
            </div>

            {/* Quick Actions Action Bar */}
            <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 lg:pt-0">
              {/* Call Hotline Button */}
              {shelter.contactPhone && (
                <a
                  href={`tel:${shelter.contactPhone}`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-3 shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <PhoneCall className="h-4 w-4 animate-bounce" />
                  <span>Call {shelter.contactPhone}</span>
                </a>
              )}

              {/* Get Directions on Google Maps */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#0B2545] hover:bg-[#081b33] text-white font-bold text-sm px-5 py-3 shadow-md shadow-[#0B2545]/15 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <Navigation className="h-4 w-4" />
                <span>Get Directions</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </a>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-4 py-3 shadow-xs transition-colors"
                title="Share shelter info"
              >
                <Share2 className="h-4 w-4 text-slate-500" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </section>

        {/* Content Layout Grid: 2 Columns (Main Info 2/3, Sidebar 1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (2 spans): Gallery, Live Capacity, Relief Needs, Facilities */}
          <div className="lg:col-span-2 space-y-8">
            {/* Interactive Image Gallery */}
            <section className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs overflow-hidden">
              {images.length > 0 ? (
                <div>
                  {/* Hero Image Container */}
                  <div className="relative aspect-16/10 sm:aspect-16/9 w-full overflow-hidden rounded-2xl bg-slate-900 group">
                    <Image
                      src={images[activeImageIndex] || images[0]}
                      alt={`${shelter.name} photo ${activeImageIndex + 1}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-102"
                    />

                    {/* Floating Image Counter Badge */}
                    <div className="absolute bottom-4 right-4 rounded-full bg-slate-950/70 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-white border border-white/10 shadow-lg">
                      Photo {activeImageIndex + 1} of {images.length}
                    </div>

                    {/* Capacity Overlay Tag */}
                    <div className="absolute top-4 left-4 rounded-full bg-slate-950/70 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-white border border-white/10 shadow-lg flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-blue-400" />
                      <span>
                        {availableSpaces.toLocaleString()} Spaces Available
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail Row if Multiple Images */}
                  {images.length > 1 && (
                    <div className="mt-3.5 flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                      {images.map((imgUrl, idx) => (
                        <button
                          key={imgUrl}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative h-18 w-24 sm:h-20 sm:w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                            activeImageIndex === idx
                              ? "border-blue-600 ring-2 ring-blue-600/30 scale-102"
                              : "border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400"
                          }`}
                        >
                          <Image
                            src={imgUrl}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            sizes="120px"
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Fallback Hero Banner when No Image Uploaded */
                <div className="aspect-16/9 w-full rounded-2xl bg-gradient-to-br from-slate-900 via-[#0B2545] to-slate-950 flex flex-col items-center justify-center p-8 text-center text-white relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-blue-500/20 blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-red-500/10 blur-2xl" />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/10">
                      <Building2 className="h-8 w-8 text-blue-300" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-white">
                      {shelter.name}
                    </h2>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-md">
                      Verified government-designated emergency evacuation and
                      relief center in {shelter.upazila}, {shelter.district}.
                    </p>
                    <div className="mt-4 flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-white/90">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Operational Disaster Shelter</span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Core Metrics Grid (4 Key Cards) */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Card 1: Total Capacity */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    Total Capacity
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {capacity.toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Maximum intake limit
                </p>
              </div>

              {/* Card 2: Current Occupancy */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50">
                    <Users className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    Occupied
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {currentPeople.toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  People currently sheltered
                </p>
              </div>

              {/* Card 3: Vacancy Left */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    Vacancies
                  </span>
                </div>
                <p
                  className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                    isFull ? "text-red-600" : "text-emerald-700"
                  }`}
                >
                  {availableSpaces.toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isFull ? "No spaces remaining" : "Spaces available now"}
                </p>
              </div>

              {/* Card 4: Occupancy Rate */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
                <div className="flex items-center gap-2 text-amber-600 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50">
                    <Flame className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    Occupancy
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {occupancyPercentage}%
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Overall fill percentage
                </p>
              </div>
            </section>

            {/* Visual Capacity Meter Card */}
            <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Shelter Occupancy & Live Capacity
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time intake monitoring updated by the center
                    coordinator
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                      isFull
                        ? "bg-red-100 text-red-700"
                        : isNearFull
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {isFull
                      ? "100% Occupied"
                      : `${availableSpaces.toLocaleString()} Spaces Remaining`}
                  </span>
                </div>
              </div>

              {/* Dynamic Progress Bar */}
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200/60">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isFull
                        ? "bg-red-600"
                        : isNearFull
                          ? "bg-gradient-to-r from-amber-500 to-red-500"
                          : "bg-gradient-to-r from-emerald-500 to-teal-500"
                    }`}
                    style={{ width: `${occupancyPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-medium text-slate-500 pt-1">
                  <span>0 (Empty)</span>
                  <span className="font-bold text-slate-700">
                    {currentPeople.toLocaleString()} /{" "}
                    {capacity.toLocaleString()} Sheltered
                  </span>
                  <span>{capacity.toLocaleString()} (Max Limit)</span>
                </div>
              </div>
            </section>

            {/* Urgent Relief Needs Section (Direct from API) */}
            <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 shrink-0">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>Urgent Relief Needs</span>
                      <span className="rounded-full bg-red-100 text-red-700 text-xs font-bold px-2.5 py-0.5">
                        {reliefNeeds.length}{" "}
                        {reliefNeeds.length === 1 ? "Item" : "Items"}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Required supplies and essential materials requested by
                      this shelter
                    </p>
                  </div>
                </div>

                {reliefNeeds.length > 0 && (
                  <a
                    href={`tel:${shelter.contactPhone}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs px-4 py-2.5 transition-colors self-start sm:self-auto border border-red-200/70"
                  >
                    <HeartHandshake className="h-4 w-4" />
                    <span>Contribute Supplies</span>
                  </a>
                )}
              </div>

              {/* Items List or Reassuring Empty State */}
              {reliefNeeds.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reliefNeeds.map((need, idx) => {
                    const itemName =
                      need.itemName || need.name || `Relief Item #${idx + 1}`;
                    const category = need.itemCategory || "General Aid";
                    const neededQty =
                      typeof need.quantity === "number"
                        ? need.quantity
                        : parseFloat(String(need.quantity || 0)) || 0;
                    const fulfilledQty =
                      typeof need.fulfilled === "number"
                        ? need.fulfilled
                        : parseFloat(String(need.fulfilled || 0)) || 0;
                    const unit = need.unit || "Units";
                    const urgency = (need.urgency || "HIGH").toUpperCase();

                    const isCritical = urgency.includes("CRIT");
                    const isHigh = urgency.includes("HIGH");
                    const isMedium = urgency.includes("MED");

                    const fulfillmentPct =
                      neededQty > 0
                        ? Math.min(
                            100,
                            Math.round((fulfilledQty / neededQty) * 100),
                          )
                        : 0;

                    return (
                      <div
                        key={need.id || `${itemName}-${category}`}
                        className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4.5 flex flex-col justify-between hover:border-slate-300 transition-all hover:shadow-xs"
                      >
                        <div>
                          {/* Top Tag Row */}
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-white px-2 py-0.5 rounded-md border border-slate-200/70">
                              {category}
                            </span>

                            {/* Urgency Pill */}
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                isCritical
                                  ? "bg-red-500 text-white shadow-xs"
                                  : isHigh
                                    ? "bg-amber-500 text-white"
                                    : isMedium
                                      ? "bg-blue-500 text-white"
                                      : "bg-slate-500 text-white"
                              }`}
                            >
                              {urgency}
                            </span>
                          </div>

                          {/* Item Name */}
                          <h3 className="text-base font-bold text-slate-900 leading-snug">
                            {itemName}
                          </h3>

                          {/* Quantities Row */}
                          <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                            <span>
                              Requested:{" "}
                              <strong className="text-slate-900">
                                {neededQty.toLocaleString()} {unit}
                              </strong>
                            </span>
                            <span>
                              Fulfilled:{" "}
                              <strong className="text-emerald-700">
                                {fulfilledQty.toLocaleString()} {unit}
                              </strong>
                            </span>
                          </div>

                          {/* Fulfillment Progress Bar */}
                          <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                fulfillmentPct >= 100
                                  ? "bg-emerald-500"
                                  : isCritical
                                    ? "bg-red-500"
                                    : "bg-blue-600"
                              }`}
                              style={{ width: `${fulfillmentPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Status Footer */}
                        <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            Status:{" "}
                            <span className="text-slate-800">
                              {need.status || "Pending"}
                            </span>
                          </span>
                          <span className="text-slate-700 font-bold">
                            {fulfillmentPct}% Met
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty Relief Needs State */
                <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 mb-3">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold text-emerald-900">
                    No Urgent Relief Supplies Required
                  </h3>
                  <p className="mt-1 text-xs text-emerald-700 max-w-md mx-auto">
                    Currently, this shelter has sufficient essential dry food,
                    clean drinking water, and first-aid medical supplies in
                    stock.
                  </p>
                </div>
              )}
            </section>

            {/* Active Rescue Operations (if linked in API) */}
            {rescueRequests.length > 0 && (
              <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shrink-0">
                    <LifeBuoy className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Associated Rescue Missions ({rescueRequests.length})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Rescue efforts currently affiliated with or coordinated by
                      this relief point
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {rescueRequests.map((req, idx) => (
                    <div
                      key={
                        req.id ||
                        `${req.location || "zone"}-${req.contactPhone || idx}`
                      }
                      className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            {req.location || "Evacuation Zone"}
                          </span>
                          <span className="rounded-full bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 uppercase">
                            {req.urgency || "CRITICAL"}
                          </span>
                        </div>
                        {req.description && (
                          <p className="text-xs text-slate-600">
                            {req.description}
                          </p>
                        )}
                        <p className="text-xs text-slate-500">
                          People in need:{" "}
                          <strong className="text-slate-800">
                            {req.peopleCount ?? "N/A"}
                          </strong>
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <span className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">
                          Status: {req.status || "Assigned"}
                        </span>
                        {req.contactPhone && (
                          <a
                            href={`tel:${req.contactPhone}`}
                            className="rounded-lg bg-blue-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-blue-700 transition-colors"
                          >
                            Call
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Standard Shelter Facilities & Verified Amenities */}
            <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Shelter Facilities & Amenities
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Verified provisions and services available on-site for evacuees
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  {
                    title: "Clean Drinking Water",
                    desc: "Dedicated tube-wells & water purification tablets available.",
                    icon: LifeBuoy,
                    color: "text-blue-600 bg-blue-50",
                  },
                  {
                    title: "Medical First-Aid Station",
                    desc: "Trained community health volunteers & emergency supplies.",
                    icon: ShieldAlert,
                    color: "text-red-600 bg-red-50",
                  },
                  {
                    title: "Women & Child Safe Zone",
                    desc: "Separated private quarters for mothers, infants, and female evacuees.",
                    icon: Users,
                    color: "text-purple-600 bg-purple-50",
                  },
                  {
                    title: "Emergency Power & Lights",
                    desc: "Backup solar panels and generator support for phone charging.",
                    icon: Sparkles,
                    color: "text-amber-600 bg-amber-50",
                  },
                  {
                    title: "Sanitation & Washrooms",
                    desc: "Designated hygienic latrines and hygiene kit distribution.",
                    icon: PackageCheck,
                    color: "text-emerald-600 bg-emerald-50",
                  },
                  {
                    title: "24/7 Security & Police",
                    desc: "Local police and volunteer night patrols ensuring security.",
                    icon: ShieldCheck,
                    color: "text-indigo-600 bg-indigo-50",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 hover:border-slate-200 transition-colors"
                    >
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center ${item.color} mb-3`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Evacuee Guidelines / What to Bring */}
            <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Important Information for Arriving Evacuees
                  </h2>
                  <p className="text-xs text-slate-500">
                    Please keep these guidelines in mind when seeking shelter
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p>
                    <strong>Carry Identification:</strong> Bring National ID
                    card, birth certificates, or emergency contacts sealed in
                    waterproof plastic packets.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p>
                    <strong>Medical Prescriptions:</strong> Carry any continuous
                    personal medication (insulin, heart pills, inhalers) for
                    yourself or elderly family members.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p>
                    <strong>Registration upon Arrival:</strong> Check in
                    immediately with Coordinator{" "}
                    <strong>{coordinatorName}</strong> or the shelter desk to
                    record family members and receive food tokens.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (1 span): Contacts, Administration, Emergency Hotlines */}
          <aside className="space-y-6">
            {/* Contact Person Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shrink-0">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    On-Site Contact Person
                  </p>
                  <h3 className="text-base font-bold text-slate-900">
                    {shelter.contactPerson || "Primary Contact"}
                  </h3>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {/* Phone */}
                {shelter.contactPhone ? (
                  <div>
                    <p className="text-xs text-slate-500 font-medium">
                      Direct Phone Hotline
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <a
                        href={`tel:${shelter.contactPhone}`}
                        className="text-base font-extrabold text-[#0B2545] hover:text-blue-600 transition-colors tracking-wide"
                      >
                        {shelter.contactPhone}
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(shelter.contactPhone, "Phone Number")
                        }
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Copy Phone Number"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>

                    <a
                      href={`tel:${shelter.contactPhone}`}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 transition-colors shadow-sm"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Call On-Site Contact</span>
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No direct phone listed
                  </p>
                )}
              </div>
            </div>

            {/* Shelter Coordinator Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    Shelter Coordinator
                  </p>
                  <h3 className="text-base font-bold text-slate-900 truncate max-w-[180px]">
                    {coordinatorName}
                  </h3>
                </div>
              </div>

              <div className="mt-4 space-y-3.5 text-xs">
                {coordinatorEmail && (
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                    <a
                      href={`mailto:${coordinatorEmail}`}
                      className="font-medium text-slate-800 hover:text-blue-600 truncate underline"
                    >
                      {coordinatorEmail}
                    </a>
                  </div>
                )}

                {coordinatorPhone &&
                  coordinatorPhone !== shelter.contactPhone && (
                    <div className="flex items-center justify-between gap-2 text-slate-600">
                      <div className="flex items-center gap-2.5 truncate">
                        <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-800">
                          {coordinatorPhone}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(coordinatorPhone, "Coordinator Phone")
                        }
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Copy
                      </button>
                    </div>
                  )}

                <div className="rounded-xl bg-blue-50/60 border border-blue-100/70 p-3 text-[11px] text-blue-900 leading-relaxed">
                  The coordinator is appointed to oversee safety, logistics,
                  volunteer delegation, and relief aid distribution for this
                  shelter.
                </div>
              </div>
            </div>

            {/* National Emergency Helplines Quick Card */}
            <div className="rounded-3xl border border-red-200/80 bg-linear-to-b from-red-50/60 to-white p-6 shadow-xs">
              <div className="flex items-center gap-2.5 mb-3 text-red-700">
                <PhoneCall className="h-5 w-5" />
                <h3 className="text-sm font-extrabold uppercase tracking-wide">
                  Emergency Helplines (24/7)
                </h3>
              </div>
              <p className="text-xs text-slate-600 mb-4">
                Direct government emergency contact numbers in Bangladesh:
              </p>

              <div className="space-y-2.5">
                {[
                  {
                    name: "National Emergency Service",
                    number: "999",
                    desc: "Police, Fire, Ambulance",
                  },
                  {
                    name: "Disaster Early Warning",
                    number: "1090",
                    desc: "Weather & Cyclone Alert",
                  },
                  {
                    name: "Flood Warning Center",
                    number: "10941",
                    desc: "Flood forecast & water levels",
                  },
                  {
                    name: "Red Crescent Society",
                    number: "02-49349911",
                    desc: "Disaster Emergency Cell",
                  },
                ].map((item) => (
                  <div
                    key={item.number}
                    className="flex items-center justify-between rounded-xl bg-white border border-red-100/80 p-2.5 shadow-xs"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-500">{item.desc}</p>
                    </div>
                    <a
                      href={`tel:${item.number.replace(/-/g, "")}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-2.5 py-1.5 transition-colors shrink-0"
                    >
                      <span>{item.number}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Facility Registry Metadata Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4.5 text-xs text-slate-500 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Facility Registered:
                </span>
                <span className="font-semibold text-slate-700">
                  {shelter.createdAt
                    ? new Date(shelter.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Official Record"}
                </span>
              </div>

              {shelter.updatedAt && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    Last Updated:
                  </span>
                  <span className="font-semibold text-slate-700">
                    {new Date(shelter.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Shelter ID:</span>
                <span
                  className="font-mono text-slate-600 truncate max-w-[140px]"
                  title={String(shelter.id || shelter._id)}
                >
                  {String(shelter.id || shelter._id)}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
