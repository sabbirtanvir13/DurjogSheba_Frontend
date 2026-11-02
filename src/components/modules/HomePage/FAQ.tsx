"use client";

import {
  ArrowRight,
  ChevronDown,
  HelpCircle,
  Mail,
  MessageCircleQuestion,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type FAQItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

const categories = [
  "All",
  "Emergency Help",
  "Donations",
  "Volunteering",
  "Shelters",
];

const faqs: FAQItem[] = [
  {
    id: "faq-1",
    category: "Emergency Help",
    question: "How do I submit an emergency rescue or relief request?",
    answer:
      "Click the 'Request Emergency Help' button on the homepage or navigate to Rescue Requests. Provide your current location, number of stranded individuals, immediate needs (boat rescue, medical, food), and an active contact number. Local volunteer rescue teams and field coordinators are alerted immediately.",
  },
  {
    id: "faq-2",
    category: "Donations",
    question: "How are financial donations utilized and tracked?",
    answer:
      "100% of public donations go directly towards purchasing dry food rations, clean drinking water, emergency medical supplies, and temporary shelter materials for affected families. We publish verified distribution logs and financial summaries on our platform for complete transparency.",
  },
  {
    id: "faq-3",
    category: "Volunteering",
    question: "How can I join as a rescue or relief volunteer?",
    answer:
      "Anyone willing to support can sign up through our 'Become a Volunteer' section. You can choose your operational role—including ground rescue, relief packaging, medical first-aid assistance, or digital coordination. We connect you with local regional chapters based on your district.",
  },
  {
    id: "faq-4",
    category: "Shelters",
    question: "How is emergency shelter capacity monitored and updated?",
    answer:
      "Shelter managers and certified field volunteers update real-time accommodation figures, sanitation availability, and flood safety status directly through the DurjogSheba shelter portal, ensuring displaced families know where safe space is available before traveling.",
  },
  {
    id: "faq-5",
    category: "Emergency Help",
    question: "How do you ensure aid reaches remote and cut-off flood zones?",
    answer:
      "We partner with local rescue boat operators, community youth networks, and verified regional NGOs who have deep navigational knowledge of waterlogged rivers and rural char areas, ensuring relief kits reach families who cannot access main highways.",
  },
  {
    id: "faq-6",
    category: "Donations",
    question: "Can organizations or student clubs partner with DurjogSheba?",
    answer:
      "Yes. University clubs, humanitarian NGOs, and corporate CSR teams can register as organizational response partners. We provide shared logistics tracking, request verification queues, and field coordination data to prevent duplication of relief efforts.",
  },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const filteredFaqs =
    activeCategory === "All"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  const toggleFAQ = (id: string) => {
    setOpenId((previous) => (previous === id ? null : id));
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative overflow-hidden bg-[#F8FAFC] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      {/* Decorative ambient background accents */}
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        {/* Section Header */}
        <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-xs">
            <HelpCircle size={14} className="text-emerald-700" />
            Frequently Asked Questions
          </div>

          <h2
            id="faq-heading"
            className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.6rem] leading-[1.18]"
          >
            Everything You Need to Know{" "}
            <span className="text-emerald-700">About DurjogSheba</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Find clear answers on how emergency rescue requests, verified
            donations, volunteer coordination, and emergency shelters operate.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                    isActive
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </header>

        {/* Accordion Questions List */}
        <div className="space-y-3.5 sm:space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <article
                key={faq.id}
                className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                  isOpen
                    ? "border-emerald-500/40 shadow-md shadow-emerald-950/5 ring-1 ring-emerald-500/20"
                    : "border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <h3>
                  <button
                    id={`${faq.id}-button`}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${faq.id}-content`}
                    onClick={() => toggleFAQ(faq.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left text-base sm:text-lg font-bold text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:p-6"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                          isOpen
                            ? "bg-emerald-700 text-white"
                            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                        }`}
                        aria-hidden="true"
                      >
                        <MessageCircleQuestion size={15} />
                      </span>
                      <span className="truncate-2-lines">{faq.question}</span>
                    </div>

                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${
                        isOpen
                          ? "rotate-180 bg-emerald-50 text-emerald-700"
                          : "bg-slate-50 text-slate-400"
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown size={17} strokeWidth={2.2} />
                    </span>
                  </button>
                </h3>

                {isOpen && (
                  <div
                    id={`${faq.id}-content`}
                    className="border-t border-slate-100/90 px-5 pb-6 pt-4 sm:px-6"
                  >
                    <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                      {faq.answer}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-700">
                      <ShieldCheck size={14} className="shrink-0" />
                      <span>Verified community disaster relief protocol</span>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Still Have Questions? Banner */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div>
              <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                Still have questions or facing an emergency?
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
                Our support team and volunteer dispatch units are ready to
                assist 24/7 across disaster-affected zones in Bangladesh.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
              <Link
                href="/rescue-requests"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              >
                <PhoneCall size={15} />
                <span>Emergency Help</span>
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                <Mail size={15} />
                <span>Contact Us</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
