"use client";

import { ChevronDown, HelpCircle, LifeBuoy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    q: "How do I request emergency rescue for myself or my family?",
    a: "Click on 'Rescue Requests' in the navigation bar or top banner, then click 'Submit Rescue Request'. Enter your current landmark or GPS location, contact phone number, number of stranded individuals, and urgency level. Your SOS appeal is broadcasted immediately to nearby response squads and control room operators.",
  },
  {
    q: "How can I find active flood or cyclone shelters near me?",
    a: "Visit the 'Find Shelters' tab. You can filter by district and upazila across Bangladesh. Each shelter card displays live capacity, current occupancy, available relief supplies, and contact phone numbers for shelter coordinators.",
  },
  {
    q: "How are donations processed, and how do I know my money reached victims?",
    a: "All donations are processed securely via the official bKash Tokenized Checkout gateway. 100% of collected funds are allocated directly to verified shelter supplies, emergency rations, and water kits. Every completed transaction generates an official downloadable PDF receipt with a unique transaction reference.",
  },
  {
    q: "How can I sign up as a relief volunteer?",
    a: "Click 'Get Started' in the header and register with the role 'Volunteer'. Once registered, you will gain access to the Volunteer Dashboard where you can view available rescue tasks, self-assign rescue operations, and log operational milestones.",
  },
  {
    q: "What should I do if flood water is rising rapidly in my area?",
    a: "First, call 999 or 1090 immediately. If phone networks are congested, submit a 'CRITICAL' urgency SOS on DurjogSheba so volunteer boat teams in your district can locate your coordinates. Move immediately to high ground or the nearest verified concrete shelter listed on our shelter directory.",
  },
  {
    q: "Is DurjogSheba free to use for stranded victims and emergency coordinators?",
    a: "Yes. DurjogSheba is 100% free and open for all citizens, volunteers, community rescue organizers, and local authorities across Bangladesh.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-[#f7f9fc] py-10 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            <HelpCircle className="h-3.5 w-3.5 text-emerald-700" />
            Frequently Asked Questions
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Frequently Asked Questions & Answers
          </h1>
          <p className="mx-auto max-w-xl text-xs sm:text-sm text-slate-500">
            Everything you need to know about emergency rescue coordination,
            shelter tracking, and transparent relief donations.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="divide-y divide-slate-200/80 rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.q} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50/70"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-emerald-700" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-[13px] leading-relaxed text-slate-600 bg-slate-50/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need more help banner */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-6 text-center space-y-2 text-emerald-950">
          <p className="text-sm font-bold">Have More Questions?</p>
          <p className="text-xs text-emerald-800">
            Our disaster relief support coordinators are available 24/7.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-emerald-800 transition"
            >
              Contact Support
            </Link>
            <Link
              href="/rescue-requests"
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-700 shadow-2xs hover:bg-red-50 transition"
            >
              <LifeBuoy className="h-3.5 w-3.5" />
              Request Rescue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
