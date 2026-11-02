
import {
  UsersRound,
  Handshake,
  PackageCheck,
  HandCoins,
} from "lucide-react";

const impactStats = [
  {
    title: "People Helped",
    description:
      "Families helped & people whose lives improved through our support.",
    icon: UsersRound,
  },
  {
    title: "Active Volunteers",
    description:
      "Active members committed to organizing relief efforts.",
    icon: Handshake,
  },
  {
    title: "Relief Operations",
    description:
      "Relief operations and community support delivered where needed.",
    icon: PackageCheck,
  },
  {
    title: "Total Donations",
    description:
      "Donations received and used to support affected communities.",
    icon: HandCoins,
  },
];

export default function ImpactStatistics() {
  return (
    <section
      aria-labelledby="impact-heading"
      className="w-full bg-[#f5f8fc] px-4 py-12 sm:px-6 sm:py-14 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 text-center sm:mb-8">
          <h2
            id="impact-heading"
            className="text-2xl font-bold tracking-tight text-[#172337] sm:text-3xl"
          >
            Impact Statistics
          </h2>

          <p className="mt-1.5 text-xs font-medium text-[#758195] sm:text-sm">
            Community Impact, Every Helping Hand
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {impactStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.title}
                className="group min-h-[150px] rounded-md border border-[#e6ebf2] bg-white p-4 transition-colors duration-200 hover:border-[#cbd8e8] sm:p-5"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f4fa] text-[#536b88] transition-colors duration-200 group-hover:bg-[#e3edf9]">
                  <Icon
                    size={16}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="text-sm font-semibold leading-5 text-[#263449]">
                  {stat.title}
                </h3>

                <p className="mt-1.5 text-xs leading-[1.65] text-[#7a8494]">
                  {stat.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
