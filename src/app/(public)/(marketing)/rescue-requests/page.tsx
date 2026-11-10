"use client";

import {
  AlertTriangle,
  Clock,
  Filter,
  LifeBuoy,
  Loader2,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useCreateRescueRequest, useGetRescueRequests } from "@/hooks";
import type { ICreateRescueRequestInput, UrgencyLevel } from "@/types";

export default function PublicRescueRequestsPage() {
  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [location, setLocation] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const [urgency, setUrgency] = useState<UrgencyLevel>("HIGH");
  const [description, setDescription] = useState("");

  const { data: response, isLoading, refetch } = useGetRescueRequests();
  const { mutate: createRescue, isPending: isCreating } =
    useCreateRescueRequest();

  const rescues = response?.data || [];

  const filtered = rescues.filter((r) => {
    const matchesSearch =
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      Boolean(r.description?.toLowerCase().includes(search.toLowerCase())) ||
      r.contactPhone.includes(search);

    const matchesUrgency =
      urgencyFilter === "ALL" ? true : r.urgency === urgencyFilter;

    return matchesSearch && matchesUrgency;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !contactPhone.trim()) {
      toast.error("Please provide both location and contact phone number");
      return;
    }

    const payload: ICreateRescueRequestInput = {
      location: location.trim(),
      contactPhone: contactPhone.trim(),
      peopleCount: Number(peopleCount) || 1,
      urgency,
      description: description.trim() || undefined,
    };

    createRescue(payload, {
      onSuccess: () => {
        toast.success(
          "Rescue request broadcasted successfully! Responders have been notified.",
        );
        setIsModalOpen(false);
        setLocation("");
        setContactPhone("");
        setPeopleCount(1);
        setDescription("");
        setUrgency("HIGH");
      },
      onError: (err: unknown) => {
        const apiErr = err as {
          data?: { message?: string };
          message?: string;
        };
        toast.error(
          apiErr?.data?.message ||
            apiErr?.message ||
            "Failed to submit rescue request",
        );
      },
    });
  };

  return (
    <div className="bg-[#f7f9fc] py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Emergency Action Header */}
        <div className="rounded-3xl border border-red-200/90 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-6 sm:p-8 text-white shadow-xl shadow-red-950/10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                <ShieldAlert className="h-4 w-4" />
                Live Emergency Assistance Network
              </div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Emergency Rescue Requests
              </h1>
              <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
                Stranded due to flood waters, cyclone damage, or landslide?
                Broadcast an instant SOS appeal so our nearby volunteer units
                and relief coordinators can deploy immediately.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs sm:text-sm font-black text-red-700 shadow-md hover:bg-red-50 transition"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>Submit Rescue Request</span>
              </button>
              <div className="rounded-xl bg-red-900/40 border border-white/20 px-3.5 py-2 text-center text-xs font-bold text-white">
                Emergency Call: 999 / 1090
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by area, phone, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="h-3.5 w-3.5 text-slate-400 mr-1 shrink-0" />
            {(["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map(
              (lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setUrgencyFilter(lvl)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    urgencyFilter === lvl
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  {lvl}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() => refetch()}
              className="ml-2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              title="Refresh requests"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Rescue Feed Grid */}
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center text-slate-400">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
            <p className="mt-3 text-xs">Loading live rescue requests...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center text-slate-400">
            <LifeBuoy className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-2 text-sm font-bold text-slate-700">
              No rescue appeals found
            </p>
            <p className="text-xs text-slate-400">
              {search || urgencyFilter !== "ALL"
                ? "Try adjusting your search criteria."
                : "Active rescue requests will appear in this real-time feed."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => {
              const isHigh = r.urgency === "CRITICAL" || r.urgency === "HIGH";
              const dateStr = new Date(r.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={r.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-red-200 hover:shadow-md"
                >
                  <div>
                    {/* Header badge */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-black ${
                          isHigh
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {isHigh && <AlertTriangle className="h-3 w-3" />}
                        {r.urgency}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          r.status === "RESCUED"
                            ? "text-emerald-700"
                            : r.status === "IN_PROGRESS"
                              ? "text-blue-700"
                              : "text-slate-500"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>

                    {/* Location & Details */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-start gap-2 text-xs text-slate-800">
                        <MapPin className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                        <span className="font-bold leading-snug">
                          {r.location}
                        </span>
                      </div>

                      {r.description && (
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                          {r.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer info */}
                  <div className="mt-4 border-t border-slate-100 pt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <strong className="text-slate-900">
                          {r.peopleCount}
                        </strong>{" "}
                        Stranded
                      </span>
                      <span className="flex items-center gap-1 font-bold text-emerald-800">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {r.contactPhone}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {dateStr}
                      </span>
                      {r.shelter && (
                        <span className="truncate max-w-[120px] text-slate-500">
                          To: {r.shelter.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Emergency Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-base">
                <AlertTriangle className="h-5 w-5" />
                Submit Emergency Rescue SOS
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label
                  htmlFor="rescue-location"
                  className="font-bold text-slate-700"
                >
                  Specific Location (Village / Union / Upazila / Landmark) *
                </label>
                <input
                  id="rescue-location"
                  type="text"
                  required
                  placeholder="e.g. Ward 3, South Char, Batiaghata, Khulna"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-red-600 focus:outline-hidden focus:ring-2 focus:ring-red-600/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="rescue-phone"
                    className="font-bold text-slate-700"
                  >
                    Contact Phone Number *
                  </label>
                  <input
                    id="rescue-phone"
                    type="tel"
                    required
                    placeholder="e.g. 017xxxxxxxx"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-red-600 focus:outline-hidden focus:ring-2 focus:ring-red-600/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="rescue-people"
                    className="font-bold text-slate-700"
                  >
                    People Trapped / Stranded *
                  </label>
                  <input
                    id="rescue-people"
                    type="number"
                    min={1}
                    required
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-red-600 focus:outline-hidden focus:ring-2 focus:ring-red-600/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="rescue-urgency"
                  className="font-bold text-slate-700"
                >
                  Urgency Level *
                </label>
                <select
                  id="rescue-urgency"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-red-600 focus:outline-hidden focus:ring-2 focus:ring-red-600/10"
                >
                  <option value="CRITICAL">
                    CRITICAL (Immediate danger to life / rising water)
                  </option>
                  <option value="HIGH">
                    HIGH (Stranded on rooftop / without food or water)
                  </option>
                  <option value="MEDIUM">
                    MEDIUM (Needs evacuation assistance within 12h)
                  </option>
                  <option value="LOW">
                    LOW (Assistance needed for relocation)
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="rescue-desc"
                  className="font-bold text-slate-700"
                >
                  Situation Description (Elderly, pregnant, children, medical
                  condition)
                </label>
                <textarea
                  id="rescue-desc"
                  rows={3}
                  placeholder="Provide any critical info for rescue boats and medical volunteers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-red-600 focus:outline-hidden focus:ring-2 focus:ring-red-600/10"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-5 py-2 font-bold text-white shadow-xs hover:bg-red-700 transition disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Broadcasting SOS...</span>
                    </>
                  ) : (
                    <span>Submit Request</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
