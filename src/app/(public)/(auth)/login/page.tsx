"use client";

import { useForm } from "@tanstack/react-form";
import {
  ArrowRight,
  Eye,
  EyeOff,
  HeartHandshake,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { type LoginFormData, LoginZodSchema } from "@/validation";
import { useGoogleLogin, useLogin } from "@/hooks";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const { mutate: login, isPending: loginpending } = useLogin();
  const { mutate: googleLoginMutation, isPending: isGooglePending } = useGoogleLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: LoginZodSchema,
    },
    onSubmit: async ({ value }: { value: LoginFormData }) => {
      const loginData: LoginFormData = {
        email: value.email,
        password: value.password,
      };

      login(loginData, {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Logged in successfully!");
          router.push("/");
        },
        onError: (err: any) => {
          toast.error(
            err?.data?.message || err?.message || "Login failed. Please try again."
          );
        },
      });
    },
  });


  const googleSuccess = (credentialsResponse: { credential?: string }) => {
    const idToken = credentialsResponse.credential
    if (!idToken) {
      toast.error("Google login failed. Please try again.");
      return;
    }

    googleLoginMutation({ idToken }, {
      onSuccess: () => {
        toast.success("Google login successful!");
        router.push("/");
      },
      onError: () => {
        toast.error("Google login failed. Please try again.")
      }
    })


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
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-green-700 lg:hidden"
            >
              <HeartHandshake className="h-5 w-5" />
              DurjogSheba
            </Link>

            <div className="mb-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                <ShieldCheck className="h-7 w-7" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to your DurjogSheba account and continue making a difference.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-5"
            >
              {/* Email Field */}
              <form.Field
                name="email"
                validators={{
                  onBlur: ({ value }) =>
                    !value
                      ? "Email is required"
                      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                        ? "Please enter a valid email"
                        : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

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
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-600/10 aria-[invalid=true]:border-red-500"
                      />
                    </div>

                    {field.state.meta.isTouched &&
                      !field.state.meta.isValid && (
                        <p className="mt-1.5 text-xs text-red-600">
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
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor={field.name}
                        className="text-sm font-semibold text-slate-700"
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
                      <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

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
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-600/10 aria-[invalid=true]:border-red-500"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {field.state.meta.isTouched &&
                      !field.state.meta.isValid && (
                        <p className="mt-1.5 text-xs text-red-600">
                          {field.state.meta.errors.join(", ")}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>

              {/* Remember Me */}
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
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
                disabled={form.state.isSubmitting || loginpending}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-700 text-sm font-semibold text-white shadow-lg shadow-green-700/15 transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-green-700/20"
              >
                {form.state.isSubmitting || loginpending ? (
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

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
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

              >

              </GoogleLogin>


            </div>

            <p className="mt-7 text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-green-700 hover:text-green-800"
              >
                Create account
              </Link>
            </p>

            <div className="mt-8 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-green-700" />
              Your information is protected and secure.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
