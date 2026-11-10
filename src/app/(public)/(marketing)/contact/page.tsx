"use client";

import {
  Clock,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        "Thank you! Your message has been routed to the DurjogSheba central response team.",
      );
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    }, 600);
  };

  return (
    <div className="bg-[#f7f9fc] py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            <PhoneCall className="h-3.5 w-3.5 text-emerald-700" />
            24/7 National Emergency Control Desk
          </div>
          <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Get in Touch With{" "}
            <span className="text-emerald-700">DurjogSheba.</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Reach out for disaster coordination, institutional shelter
            onboarding, media inquiries, or volunteer partnership.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Contact Info Side */}
          <div className="space-y-4 lg:col-span-5">
            {/* National Hotlines Box */}
            <div className="rounded-2xl border border-red-200 bg-red-50/70 p-5 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-red-700">
                Immediate Crisis Hotlines
              </span>
              <div className="space-y-2 text-xs text-red-950">
                <div className="flex items-center justify-between font-bold">
                  <span>National Emergency Police & Fire:</span>
                  <span className="text-sm font-black text-red-700">999</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span>Disaster Early Warning (MoDMR):</span>
                  <span className="text-sm font-black text-red-700">1090</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span>Government Citizen Helpline:</span>
                  <span className="text-sm font-black text-red-700">333</span>
                </div>
              </div>
            </div>

            {/* DurjogSheba HQ */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                DurjogSheba National Desk
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  Disaster Management Directorate Complex, Mohakhali,
                  Dhaka-1212, Bangladesh
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-emerald-700 shrink-0" />
                <span>support@durjogsheba.gov.bd</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-emerald-700 shrink-0" />
                <span>+880 9612-DURJOG (387564)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-emerald-700 shrink-0" />
                <span>Operational 24 Hours / 7 Days a Week</span>
              </div>
            </div>
          </div>

          {/* Direct Message Form */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-7">
            <h2 className="text-base font-bold text-slate-900">
              Send Us a Message
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Fill out the form below and our operations team will respond
              promptly.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="font-bold text-slate-700"
                  >
                    Your Full Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="font-bold text-slate-700"
                  >
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="tanvir@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="font-bold text-slate-700"
                  >
                    Contact Phone
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="017xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="font-bold text-slate-700"
                  >
                    Subject *
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    placeholder="e.g. Volunteer Group Registration"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-msg"
                  className="font-bold text-slate-700"
                >
                  Message *
                </label>
                <textarea
                  id="contact-msg"
                  rows={4}
                  required
                  placeholder="How can our relief response team assist you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 font-bold text-white shadow-xs hover:bg-emerald-800 transition disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
