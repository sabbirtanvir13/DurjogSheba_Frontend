import { HeartHandshake, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import VerifyAccountForm from "@/components/form/VerifyAccountForm";
import { Toaster } from "@/components/ui/toast";

export default function VerifyAccountPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-3 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-7xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/60 sm:min-h-[calc(100vh-48px)] lg:grid-cols-2">
        {/* Visual Side */}
        <section className="relative hidden overflow-hidden lg:flex">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/hero/hero-background.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/10" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-700">
                <HeartHandshake className="h-7 w-7 text-white" />
              </span>
              <span>
                <span className="block text-xl font-bold text-white">
                  DurjogSheba
                </span>
                <span className="text-sm font-medium text-green-200">
                  দুর্যোগ সেবা
                </span>
              </span>
            </Link>

            <div className="max-w-lg">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4 text-green-300" />
                Protecting People & Communities
              </span>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                Verify Your <span className="text-green-400">Account.</span>
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-slate-200">
                Ensure the authenticity and security of our disaster response
                network by completing your email verification.
              </p>

              <div className="mt-8 flex items-center gap-3 text-sm font-medium text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                  <HeartHandshake className="h-5 w-5 text-green-300" />
                </span>
                Every verified member makes relief operations faster.
              </div>
            </div>

            <p className="text-xs text-slate-300">
              © {new Date().getFullYear()} DurjogSheba. Together for a safer
              tomorrow.
            </p>
          </div>
        </section>

        {/* Form Side */}
        <section className="flex items-center justify-center px-5 py-8 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700 lg:hidden"
            >
              <HeartHandshake className="h-5 w-5" />
              DurjogSheba
            </Link>

            <Suspense
              fallback={
                <div className="flex h-48 items-center justify-center">
                  <p className="text-sm text-slate-500">
                    Loading verification...
                  </p>
                </div>
              }
            >
              <VerifyAccountForm />
            </Suspense>

            <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-green-700" />
              Your information is protected and secure.
            </div>
          </div>
        </section>
      </div>
      <Toaster />
    </main>
  );
}
