import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section
      aria-label="Disaster Relief and Recovery Mission"
      className="relative w-full overflow-hidden bg-[#0B131F]"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-background.png"
          alt="Humanitarian disaster relief and emergency response in Bangladesh"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-[75%_center] sm:object-[70%_center] md:object-[65%_center] lg:object-center"
        />

        {/* Cinematic Multi-stop Dark Gradient Overlay */}
        {/* On mobile: stronger full overlay for 100% text legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0B131F]/95 via-[#0B131F]/85 to-[#0B131F]/50 md:hidden"
          aria-hidden="true"
        />

        {/* On desktop: horizontal gradient concentrated on the left half */}
        <div
          className="hidden md:block absolute inset-0 bg-[linear-gradient(to_right,#0B131F_0%,#0B131F_28%,rgba(11,19,31,0.92)_40%,rgba(11,19,31,0.65)_55%,rgba(11,19,31,0.2)_75%,transparent_100%)]"
          aria-hidden="true"
        />

        {/* Subtle top/bottom edge vignette to match documentary photo finish */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,19,31,0.35)_0%,transparent_15%,transparent_85%,rgba(11,19,31,0.4)_100%)]"
          aria-hidden="true"
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 mx-auto flex min-h-[500px] sm:min-h-[540px] md:min-h-[580px] lg:min-h-[620px] xl:min-h-[660px] w-full max-w-7xl items-center px-5 sm:px-8 md:px-12 lg:px-16 py-16 sm:py-20 lg:py-24">
        <div className="flex max-w-xl flex-col items-start text-left lg:max-w-2xl">
          {/* Main Heading */}
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.14]">
            Together, We Can Help
            <br />
            Communities Recover.
          </h1>

          {/* Supporting Paragraph */}
          <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-slate-200/90 leading-relaxed font-normal max-w-lg">
            Bangladesh faces the challenge of recurring natural disasters.{" "}
            <br className="hidden sm:inline" />
            Together, we can help affected communities recover.
          </p>

          {/* CTAs */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            {/* Primary Action Button (Red) */}
            <Link
              href="/rescue-requests"
              className="inline-flex items-center justify-center rounded-md sm:rounded-lg bg-[#D52726] px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#B91C1C] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B131F] active:translate-y-px"
            >
              Request Emergency Help
            </Link>

            {/* Secondary Action Button (Green) */}
            <Link
              href="/donate"
              className="inline-flex items-center justify-center rounded-md sm:rounded-lg bg-[#21824F] px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#1A6B41] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B131F] active:translate-y-px"
            >
              Donate Now
            </Link>
          </div>

          {/* Supporting Trust & Status Line */}
          <div className="mt-5 sm:mt-6 flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-200/90">
            <span
              className="flex h-[18px] w-[18px] sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-full bg-[#21824F] text-white shadow-xs"
              aria-hidden="true"
            >
              <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[3]" />
            </span>
            <span>Community Compassion. Delivering Hope.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
