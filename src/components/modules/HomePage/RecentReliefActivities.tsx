"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Camera,
  Film,
  MapPin,
  Pause,
  Play,
  Sparkles,
  Video,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Activity = {
  id: number;
  type: "video" | "photo";
  category: string;
  date: string;
  location: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  duration?: string;
  photoCount?: string;
  tag: string;
  stats: string;
};

const activities: Activity[] = [
  {
    id: 1,
    type: "video",
    category: "RESCUE OPERATION",
    date: "October 28, 2026",
    location: "Sylhet, Bangladesh",
    title: "Ground Rescue: Evacuating Stranded Families from Floodwaters",
    description:
      "Watch verified field dispatch footage as volunteer boat rescue teams navigate raging floodwaters in Sylhet to safely evacuate stranded children and families to emergency shelters.",
    thumbnail:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=85",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: "02:18",
    tag: "Verified Video Report",
    stats: "340+ Evacuated",
  },
  {
    id: 2,
    type: "photo",
    category: "RELIEF DISTRIBUTION",
    date: "October 22, 2026",
    location: "Cumilla, Bangladesh",
    title: "Essential Food and Clean Drinking Water Reaches 1,200 Families",
    description:
      "Humanitarian teams transported over 1,200 dry-ration food kits and 10,000 liters of potable water by hand and wooden boats across inundated village pathways in Cumilla.",
    thumbnail:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=85",
    photoCount: "24 Photos",
    tag: "Field Photography",
    stats: "1,200+ Kits Delivered",
  },
  {
    id: 3,
    type: "video",
    category: "MEDICAL RELIEF",
    date: "October 16, 2026",
    location: "Sunamganj, Bangladesh",
    title: "Medical Boat Flotilla Delivering Emergency Saline & Antibiotics",
    description:
      "Video coverage of healthcare volunteers establishing mobile floating clinics across the Haor basin to treat waterborne illnesses and distribute medical kits.",
    thumbnail:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=85",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: "03:42",
    tag: "Mobile Health Camp",
    stats: "18 Villages Covered",
  },
  {
    id: 4,
    type: "photo",
    category: "SHELTER REBUILDING",
    date: "October 10, 2026",
    location: "Khulna, Bangladesh",
    title: "Community Youth Join Hands to Rebuild Coastal Embankments",
    description:
      "Local community youth, volunteers, and disaster specialists collaborated to reinforce breached coastal dams and install waterproof tin roofs for displaced families.",
    thumbnail:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=85",
    photoCount: "18 Photos",
    tag: "Community Recovery",
    stats: "85 Shelters Repaired",
  },
];

export default function RecentReliefActivities() {
  const [activeTab, setActiveTab] = useState<"all" | "video" | "photo">("all");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [activeModal, setActiveModal] = useState<Activity | null>(null);

  const filteredActivities =
    activeTab === "all"
      ? activities
      : activities.filter((item) => item.type === activeTab);

  const safeIndex = active < filteredActivities.length ? active : 0;
  const current = filteredActivities[safeIndex] || activities[0];

  const next = useCallback(() => {
    setActive((index) => (index + 1) % filteredActivities.length);
  }, [filteredActivities.length]);

  const previous = useCallback(() => {
    setActive(
      (index) =>
        (index - 1 + filteredActivities.length) % filteredActivities.length,
    );
  }, [filteredActivities.length]);

  // Keyboard navigation & escape listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeModal && event.key === "Escape") {
        setActiveModal(null);
      }
      if (!activeModal) {
        if (event.key === "ArrowLeft") previous();
        if (event.key === "ArrowRight") next();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal, next, previous]);

  // Slideshow auto-advance
  useEffect(() => {
    if (paused || activeModal !== null) return;

    const timer = window.setInterval(next, 6000);
    return () => window.clearInterval(timer);
  }, [paused, activeModal, next]);

  return (
    <section
      id="recent-relief-activities"
      aria-labelledby="activities-heading"
      className="relative overflow-hidden bg-[#F7F9FC] py-16 sm:py-24"
    >
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-10 h-[500px] w-[500px] rounded-full bg-blue-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-xs">
              <Sparkles size={14} className="text-emerald-700" />
              <span>Our Impact in Action</span>
            </div>

            <h2
              id="activities-heading"
              className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
            >
              Recent Relief{" "}
              <span className="font-serif italic text-emerald-700">
                Activities
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Verified field rescue operations, humanitarian video dispatches,
              and emergency supplies reaching families in need.
            </p>

            {/* Media Filter Tabs */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("all");
                  setActive(0);
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "all"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                All Stories ({activities.length})
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("video");
                  setActive(0);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "video"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Video size={13} />
                <span>Video Reports (2)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("photo");
                  setActive(0);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "photo"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Camera size={13} />
                <span>Photo Stories (2)</span>
              </button>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center gap-3">
            <span className="mr-1 text-xs font-semibold text-slate-500">
              <span className="text-slate-900 font-bold">
                {String(safeIndex + 1).padStart(2, "0")}
              </span>
              {" / "}
              {String(filteredActivities.length).padStart(2, "0")}
            </span>

            <button
              type="button"
              onClick={previous}
              aria-label="Previous activity"
              className="flex size-10 sm:size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <ArrowLeft size={17} />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next activity"
              className="flex size-10 sm:size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
              className="flex size-10 sm:size-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-xs transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {paused ? <Play size={16} /> : <Pause size={16} />}
            </button>
          </div>
        </div>

        {/* Featured Main Interactive Card */}
        <div
          key={current.id}
          className="group grid overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-md shadow-slate-950/5 transition-all duration-300 lg:grid-cols-[1.1fr_0.9fr]"
        >
          {/* Visual Media Container */}
          <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[480px] overflow-hidden bg-slate-950">
            <Image
              src={current.thumbnail}
              alt={current.title}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Dark gradient wash */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-slate-950/40" />

            {/* Top Category and Media Badges */}
            <div className="absolute left-4 top-4 right-4 flex items-center justify-between gap-2 sm:left-6 sm:top-6 sm:right-6">
              <span className="rounded-full border border-white/20 bg-slate-950/60 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-white backdrop-blur-md">
                {current.category}
              </span>

              {current.type === "video" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
                  <Video size={13} />
                  <span>Video ({current.duration})</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/90 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
                  <Camera size={13} />
                  <span>{current.photoCount}</span>
                </span>
              )}
            </div>

            {/* Center Play Button for Video with animated pulsing wave */}
            {current.type === "video" ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setActiveModal(current)}
                  aria-label={`Play video: ${current.title}`}
                  className="group/play relative flex size-18 sm:size-20 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400"
                >
                  <span className="absolute inset-0 -z-10 rounded-full bg-emerald-400 animate-ping opacity-35" />
                  <Play size={28} className="fill-white translate-x-0.5" />
                </button>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setActiveModal(current)}
                  aria-label={`View photo story: ${current.title}`}
                  className="group/photo flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-black/60 hover:scale-105"
                >
                  <Camera size={16} />
                  <span>View Photo Gallery</span>
                </button>
              </div>
            )}

            {/* Bottom Status Bar */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 sm:bottom-6 sm:left-6 sm:right-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
                <span>Field Dispatch</span>
              </span>

              <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">
                {current.stats}
              </span>
            </div>
          </div>

          {/* Content & Narrative Side */}
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            {/* Meta Tags */}
            <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} className="text-emerald-700" />
                {current.date}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} className="text-emerald-700" />
                {current.location}
              </span>
            </div>

            <span className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
              {current.tag}
            </span>

            <h3 className="text-xl font-bold leading-snug tracking-tight text-slate-950 sm:text-2xl lg:text-3xl">
              {current.title}
            </h3>

            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              {current.description}
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {current.type === "video" ? (
                <button
                  type="button"
                  onClick={() => setActiveModal(current)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <Play size={15} className="fill-white" />
                  <span>Watch Video ({current.duration})</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveModal(current)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <Camera size={15} />
                  <span>View Photos ({current.photoCount})</span>
                </button>
              )}

              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <span>Read Full Story</span>
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            {/* Slide Progress Dots */}
            <div className="mt-8 flex items-center gap-2">
              {filteredActivities.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Go to activity ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    safeIndex === index
                      ? "w-10 bg-emerald-700"
                      : "w-4 bg-slate-200 hover:bg-emerald-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Thumbnail Strip */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {filteredActivities.map((item, index) => {
            const isSelected = safeIndex === index;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                className={`group flex items-center gap-3 overflow-hidden rounded-xl border p-2.5 text-left transition-all ${
                  isSelected
                    ? "border-emerald-600 bg-white shadow-sm ring-1 ring-emerald-600"
                    : "border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-slate-900">
                  <Image
                    src={item.thumbnail}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    {item.type === "video" ? (
                      <span className="flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <Play
                          size={10}
                          className="fill-white translate-x-0.2"
                        />
                      </span>
                    ) : (
                      <span className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-white">
                        <Camera size={10} />
                      </span>
                    )}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-emerald-700">
                    <span>{item.type === "video" ? "Video" : "Photo"}</span>
                    <span>·</span>
                    <span className="text-slate-400 font-normal">
                      {item.location.split(",")[0]}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs font-semibold text-slate-800">
                    {item.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live News Ticker */}
        <div className="mt-8 flex items-center gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white py-3 px-4 shadow-xs">
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            <Film size={12} />
            <span>Latest Updates</span>
          </span>

          <div className="ticker-track flex min-w-0 gap-10 whitespace-nowrap text-xs text-slate-600">
            {[...activities, ...activities].map((item, index) => (
              <button
                key={`${item.id}-${index}`}
                type="button"
                onClick={() => {
                  const targetIndex = filteredActivities.findIndex(
                    (act) => act.id === item.id,
                  );
                  if (targetIndex !== -1) setActive(targetIndex);
                }}
                className="inline-flex items-center gap-2.5 transition hover:text-emerald-700 font-medium"
              >
                <span className="size-1.5 rounded-full bg-emerald-600" />
                <span>{item.title}</span>
                <span className="text-slate-400 text-[10px]">
                  ({item.location})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Video & Photo Viewer Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Accessible Backdrop Button */}
          <button
            type="button"
            aria-label="Close modal backdrop"
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity cursor-default"
            onClick={() => setActiveModal(null)}
          />

          {/* Modal Container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl text-white"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  {activeModal.type === "video" ? (
                    <Video size={16} />
                  ) : (
                    <Camera size={16} />
                  )}
                </span>
                <div>
                  <h3
                    id="modal-title"
                    className="text-sm font-bold text-white truncate max-w-md"
                  >
                    {activeModal.title}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {activeModal.location} · {activeModal.date}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
                className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <X size={17} />
              </button>
            </div>

            {/* Modal Media Body */}
            <div className="p-4 sm:p-6">
              {activeModal.type === "video" && activeModal.videoUrl ? (
                <div className="overflow-hidden rounded-xl bg-black aspect-video shadow-inner">
                  <video
                    controls
                    autoPlay
                    className="size-full object-cover"
                    src={activeModal.videoUrl}
                  >
                    <track
                      kind="captions"
                      srcLang="en"
                      label="English captions"
                    />
                    Your browser does not support HTML5 video playback.
                  </video>
                </div>
              ) : (
                <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-900">
                  <Image
                    src={activeModal.thumbnail}
                    alt={activeModal.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-5">
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {activeModal.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Modal Description Footer */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
                <p className="flex-1 text-slate-300">
                  {activeModal.description}
                </p>

                <Link
                  href="/about"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-500"
                >
                  <span>Explore More Reports</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Marquee Animation Styles */}
      <style jsx>{`
        .ticker-track {
          width: max-content;
          animation: tickerMove 38s linear infinite;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes tickerMove {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
