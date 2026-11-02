
import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  HandHeart,
} from "lucide-react";

export default function BecomeVolunteerSection() {
  return (
    <section
      id="become-volunteer"
      className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="group relative isolate min-h-[400px] overflow-hidden rounded-3xl bg-slate-900 sm:min-h-[460px] lg:min-h-[500px]">
          {/* Background image */}
          <img
            src="/images/volunteer/volunteer-hero.jpg"
            alt="Volunteers helping communities affected by disasters"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
          />

          {/* Dark overlay for readable text */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/15" />

          {/* Bottom gradient */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

          <div className="flex min-h-[400px] items-center px-6 py-12 sm:min-h-[460px] sm:px-10 sm:py-16 lg:min-h-[500px] lg:px-16">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md sm:text-sm">
                <HeartHandshake size={17} className="text-emerald-300" />
                Be Part of Something Meaningful
              </div>

              {/* Heading */}
              <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-6xl">
                Become a Volunteer.
                <br />
                <span className="text-emerald-300">
                  Make a Real Impact.
                </span>
              </h2>

              {/* Description */}
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base sm:leading-8 lg:text-lg">
                Your time, skills, and compassion can change lives.
                Join our community to support disaster relief,
                deliver essential supplies, and help families
                rebuild with hope.
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/become-a-volunteer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  Become a Volunteer
                  <ArrowRight size={17} />
                </a>

                <a
                  href="#donation-campaigns"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/20"
                >
                  <HandHeart size={17} />
                  Support Our Mission
                </a>
              </div>

              {/* Trust detail */}
              <div className="mt-8 flex items-center gap-2 text-xs text-white/70 sm:text-sm">
                <ShieldCheck
                  size={17}
                  className="shrink-0 text-emerald-300"
                />
                <span>
                  Together, we can bring hope to communities in need.
                </span>
              </div>
            </div>
          </div>

          {/* Decorative accent */}
          <div className="absolute bottom-0 left-0 h-1 w-1/3 bg-emerald-500" />
        </div>
      </div>
    </section>
  );
}
