"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useForm } from "@tanstack/react-form";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Heart,
  HeartHandshake,
  LifeBuoy,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "react-toastify";
import { useGoogleLogin, useLogin } from "@/hooks";
import { type LoginFormData, LoginZodSchema } from "@/validation";

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [activeDemoRole, setActiveDemoRole] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const { mutate: login, isPending: loginPending } = useLogin();
  const { mutate: googleLoginMutation } = useGoogleLogin();

  const handleRedirectByRole = (role?: string) => {
    if (redirectParam) {
      router.push(redirectParam);
      return;
    }
    switch (role) {
      case "ADMIN":
        router.push("/admin");
        break;
      case "VOLUNTEER":
        router.push("/volunteer");
        break;
      case "DONOR":
        router.push("/donor");
        break;
      default:
        router.push("/");
    }
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: LoginZodSchema,
    },
    onSubmit: async ({ value }: { value: LoginFormData }) => {
      login(
        { email: value.email, password: value.password },
        {
          onSuccess: (res: unknown) => {
            const apiRes = res as {
              message?: string;
              data?: { user?: { role?: string }; role?: string };
              user?: { role?: string };
            };
            toast.success(apiRes?.message || "Logged in successfully!");
            const role =
              apiRes?.data?.user?.role ||
              apiRes?.user?.role ||
              apiRes?.data?.role;
            handleRedirectByRole(role);
          },
          onError: (err: unknown) => {
            const apiErr = err as {
              data?: { message?: string };
              message?: string;
            };
            toast.error(
              apiErr?.data?.message ||
                apiErr?.message ||
                "Login failed. Please try again.",
            );
          },
        },
      );
    },
  });

  const handleDemoLogin = (role: "DONOR" | "VOLUNTEER" | "ADMIN") => {
    let email = "";
    let password = "";

    if (role === "DONOR") {
      email = "donor@durjogsheba.com";
      password = "Donor@123456";
    } else if (role === "VOLUNTEER") {
      email = "volunteer@durjogsheba.com";
      password = "Volunteer@123456";
    } else {
      email = "admin@durjogsheba.com";
      password = "Admin@123456";
    }

    form.setFieldValue("email", email);
    form.setFieldValue("password", password);
    setActiveDemoRole(role);

    login(
      { email, password },
      {
        onSuccess: (res: unknown) => {
          const apiRes = res as {
            message?: string;
            data?: { user?: { role?: string }; role?: string };
            user?: { role?: string };
          };
          toast.success(`Logged in as Demo ${role}!`);
          setActiveDemoRole(null);
          const userRole =
            apiRes?.data?.user?.role ||
            apiRes?.user?.role ||
            apiRes?.data?.role ||
            role;
          handleRedirectByRole(userRole);
        },
        onError: (err: unknown) => {
          setActiveDemoRole(null);
          const apiErr = err as {
            data?: { message?: string };
            message?: string;
          };
          toast.error(
            apiErr?.data?.message ||
              apiErr?.message ||
              `Demo login for ${role} failed`,
          );
        },
      },
    );
  };

  const googleSuccess = (credentialsResponse: { credential?: string }) => {
    const idToken = credentialsResponse.credential;
    if (!idToken) {
      toast.error("Google login failed. Please try again.");
      return;
    }

    googleLoginMutation(
      { idToken },
      {
        onSuccess: () => {
          toast.success("Google login successful!");
          router.push("/");
        },
        onError: () => {
          toast.error("Google login failed. Please try again.");
        },
      },
    );
  };

  const googleError = () => {
    toast.error("Google login failed. Please try again.");
  };

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
                <HeartHandshake className="h-4 w-4 text-green-300" />
                Connecting Communities. Delivering Hope.
              </span>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                Together, We Can Make a{" "}
                <span className="text-green-400">Difference.</span>
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-slate-200">
                Your commitment helps us connect communities with emergency
                assistance and essential resources.
              </p>

              <div className="mt-8 flex items-center gap-3 text-sm font-medium text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                  <HeartHandshake className="h-5 w-5 text-green-300" />
                </span>
                Every helping hand brings hope.
              </div>
            </div>

            <p className="text-xs text-slate-300">
              © {new Date().getFullYear()} DurjogSheba. Together for a safer
              tomorrow.
            </p>
          </div>
        </section>

        {/* Form Side */}
        <section className="flex items-center justify-center px-5 py-8 sm:px-10 lg:px-12 xl:px-16 overflow-y-auto">
          <div className="w-full max-w-md my-auto">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700 lg:hidden"
            >
              <HeartHandshake className="h-5 w-5" />
              DurjogSheba
            </Link>

            <div className="mb-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>

              <p className="mt-1.5 text-xs sm:text-sm leading-6 text-slate-500">
                Sign in to your DurjogSheba account and continue making a
                difference.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              {/* Email Field */}
              <form.Field
                name="email"
                validators={{
                  onBlur: ({ value }) =>
                    !value
                      ? "Email is required"
                      : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                        ? "Invalid email address"
                        : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor={field.name}
                      className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={!field.state.meta.isValid}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-xs sm:text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-600/10 aria-[invalid=true]:border-red-500"
                      />
                    </div>

                    {field.state.meta.isTouched &&
                      !field.state.meta.isValid && (
                        <p className="mt-1 text-xs text-red-600">
                          {field.state.meta.errors.join(", ")}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>

              {/* Password Field */}
              <form.Field
                name="password"
                validators={{
                  onBlur: ({ value }) =>
                    !value ? "Password is required" : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label
                        htmlFor={field.name}
                        className="text-xs font-bold uppercase tracking-wider text-slate-600"
                      >
                        Password
                      </label>

                      <Link
                        href="/forgot-password"
                        className="text-xs font-semibold text-green-700 hover:text-green-800"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="relative">
                      <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        id={field.name}
                        name={field.name}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={!field.state.meta.isValid}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-xs sm:text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-600/10 aria-[invalid=true]:border-red-500"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {field.state.meta.isTouched &&
                      !field.state.meta.isValid && (
                        <p className="mt-1 text-xs text-red-600">
                          {field.state.meta.errors.join(", ")}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>

              {/* Remember Me */}
              <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-green-700"
                />
                Remember me
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={form.state.isSubmitting || loginPending}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-700 text-xs sm:text-sm font-bold text-white shadow-md shadow-green-700/15 transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-green-700/20"
              >
                {form.state.isSubmitting || loginPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Google Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                text="continue_with"
                shape="pill"
                onSuccess={googleSuccess}
                onError={googleError}
              />
            </div>

            {/* ========================================= */}
            {/* 3 DEMO ACCOUNTS: Donor, Volunteer, Admin */}
            {/* ========================================= */}
            <div className="mt-6 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/70 to-slate-100/40 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-2xs">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      Instant Demo Logins
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Explore the platform as any user role
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-100/80 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  ⚡ 1-Click Access
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {/* 1. DONOR DEMO */}
                <button
                  type="button"
                  disabled={loginPending}
                  onClick={() => handleDemoLogin("DONOR")}
                  className="group relative flex flex-col items-center justify-between rounded-xl border border-slate-200/90 bg-white p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-300 hover:bg-pink-50/30 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-600 border border-pink-100 transition-transform group-hover:scale-105">
                    <Heart className="h-4 w-4 fill-pink-600 text-pink-600" />
                  </div>
                  <div className="mt-2 space-y-0.5">
                    <p className="text-xs font-bold text-slate-800 transition-colors group-hover:text-pink-700">
                      Donor
                    </p>
                    <p className="text-[10px] font-medium text-slate-400">
                      Relief Funder
                    </p>
                  </div>
                  <div className="mt-2.5 inline-flex w-full items-center justify-center gap-1 rounded-lg bg-slate-100 py-1 text-[10px] font-bold text-slate-600 transition-colors group-hover:bg-pink-600 group-hover:text-white">
                    {activeDemoRole === "DONOR" ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <span>Enter</span>
                        <ArrowRight className="h-2.5 w-2.5" />
                      </>
                    )}
                  </div>
                </button>

                {/* 2. VOLUNTEER DEMO */}
                <button
                  type="button"
                  disabled={loginPending}
                  onClick={() => handleDemoLogin("VOLUNTEER")}
                  className="group relative flex flex-col items-center justify-between rounded-xl border border-slate-200/90 bg-white p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 transition-transform group-hover:scale-105">
                    <LifeBuoy className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="mt-2 space-y-0.5">
                    <p className="text-xs font-bold text-slate-800 transition-colors group-hover:text-blue-700">
                      Volunteer
                    </p>
                    <p className="text-[10px] font-medium text-slate-400">
                      Rescue Squad
                    </p>
                  </div>
                  <div className="mt-2.5 inline-flex w-full items-center justify-center gap-1 rounded-lg bg-slate-100 py-1 text-[10px] font-bold text-slate-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    {activeDemoRole === "VOLUNTEER" ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <span>Enter</span>
                        <ArrowRight className="h-2.5 w-2.5" />
                      </>
                    )}
                  </div>
                </button>

                {/* 3. ADMIN DEMO */}
                <button
                  type="button"
                  disabled={loginPending}
                  onClick={() => handleDemoLogin("ADMIN")}
                  className="group relative flex flex-col items-center justify-between rounded-xl border border-slate-200/90 bg-white p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/30 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 transition-transform group-hover:scale-105">
                    <ShieldAlert className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div className="mt-2 space-y-0.5">
                    <p className="text-xs font-bold text-slate-800 transition-colors group-hover:text-emerald-800">
                      Admin
                    </p>
                    <p className="text-[10px] font-medium text-slate-400">
                      HQ Control
                    </p>
                  </div>
                  <div className="mt-2.5 inline-flex w-full items-center justify-center gap-1 rounded-lg bg-slate-100 py-1 text-[10px] font-bold text-slate-600 transition-colors group-hover:bg-emerald-700 group-hover:text-white">
                    {activeDemoRole === "ADMIN" ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <span>Enter</span>
                        <ArrowRight className="h-2.5 w-2.5" />
                      </>
                    )}
                  </div>
                </button>
              </div>

              <p className="mt-2.5 text-center text-[10px] text-slate-400">
                Click any role to auto-authenticate and access its live
                dashboard
              </p>

              <p className="mt-2.5 text-center text-[10px] text-slate-400">
                Click any role to auto-authenticate and access its live dashboard
              </p>
            </div>

            <p className="mt-5 text-center text-xs text-slate-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-green-700 hover:text-green-800"
              >
                Create account
              </Link>
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-4 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-green-700" />
              Secure 256-bit encrypted authentication
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-700 border-t-transparent" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
