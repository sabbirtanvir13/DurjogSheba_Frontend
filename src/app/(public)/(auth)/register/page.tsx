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
  Phone,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin, useRegister } from "@/hooks";
import { type RegisterFormData, RegisterZodSchema } from "@/validation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();

  const { mutate: register, isPending: registerPending } = useRegister();
  const { mutate: googleLoginMutation } = useGoogleLogin();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "VOLUNTEER",
    },
    validators: {
      onSubmit: RegisterZodSchema,
    },
    onSubmit: async ({ value }: { value: RegisterFormData }) => {
      const registerData = {
        name: value.name,
        email: value.email,
        phone: value.phone,
        password: value.password,
        role: value.role,
      };

      register(registerData, {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Account created successfully!");
          if (res?.data?.accessToken) {
            router.push("/");
          } else {
            router.push("/login");
          }
        },
        onError: (err: any) => {
          toast.error(
            err?.data?.message ||
              err?.message ||
              "Registration failed. Please try again."
          );
        },
      });
    },
  });

  const googleSuccess = (credentialsResponse: { credential?: string }) => {
    const idToken = credentialsResponse.credential;
    if (!idToken) {
      toast.error("Google sign up failed. Please try again.");
      return;
    }

    googleLoginMutation(
      { idToken },
      {
        onSuccess: () => {
          toast.success("Google sign up successful!");
          router.push("/");
        },
        onError: () => {
          toast.error("Google sign up failed. Please try again.");
        },
      }
    );
  };

  const googleError = () => {
    toast.error("Google sign up failed. Please try again.");
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
                <Users className="h-4 w-4 text-green-300" />A Community That
                Cares
              </span>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                Be Part of Something{" "}
                <span className="text-green-400">Meaningful.</span>
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-slate-200">
                Join a community dedicated to helping people in their most
                difficult moments.
              </p>

              <div className="mt-8 flex items-center gap-3 text-sm font-medium text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                  <Users className="h-5 w-5 text-green-300" />
                </span>
                Together, we can bring hope.
              </div>
            </div>

            <p className="text-xs text-slate-300">
              © {new Date().getFullYear()} DurjogSheba. Together for a safer
              tomorrow.
            </p>
          </div>
        </section>

        {/* Registration Form */}
        <section className="flex items-center justify-center px-5 py-8 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700 lg:hidden"
            >
              <HeartHandshake className="h-5 w-5" />
              DurjogSheba
            </Link>

            <div className="mb-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                <Users className="h-6 w-6" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Join DurjogSheba and be part of our humanitarian community.
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
              {/* Name Field */}
              <form.Field
                name="name"
                validators={{
                  onBlur: ({ value }) =>
                    !value
                      ? "Full name is required"
                      : value.trim().length < 2
                        ? "Name must be at least 2 characters"
                        : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Full Name
                    </label>

                    <div className="relative">
                      <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        id={field.name}
                        name={field.name}
                        type="text"
                        placeholder="Enter your full name"
                        autoComplete="name"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={!field.state.meta.isValid}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-600/10 aria-[invalid=true]:border-red-500"
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
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-600/10 aria-[invalid=true]:border-red-500"
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

              {/* Phone Field */}
              <form.Field
                name="phone"
                validators={{
                  onBlur: ({ value }) =>
                    !value
                      ? "Phone number is required"
                      : value.length < 10
                        ? "Phone number must be at least 10 digits"
                        : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        id={field.name}
                        name={field.name}
                        type="tel"
                        placeholder="+880 1XXXXXXXXX"
                        autoComplete="tel"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={!field.state.meta.isValid}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-600/10 aria-[invalid=true]:border-red-500"
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
                    !value
                      ? "Password is required"
                      : value.length < 6
                        ? "Password must be at least 6 characters"
                        : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        id={field.name}
                        name={field.name}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={!field.state.meta.isValid}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-600/10 aria-[invalid=true]:border-red-500"
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

              {/* Confirm Password Field */}
              <form.Field
                name="confirmPassword"
                validators={{
                  onBlur: ({ value }) =>
                    !value
                      ? "Please confirm your password"
                      : value !== form.getFieldValue("password")
                        ? "Passwords do not match"
                        : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Confirm Password
                    </label>

                    <div className="relative">
                      <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        id={field.name}
                        name={field.name}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={!field.state.meta.isValid}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-600/10 aria-[invalid=true]:border-red-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                      >
                        {showConfirmPassword ? (
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

              {/* Role Selection */}
              <form.Field name="role">
                {(field) => (
                  <div>
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Join as
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "VOLUNTEER", label: "Volunteer" },
                        { value: "DONOR", label: "Donor" },
                      ].map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => field.handleChange(item.value)}
                          aria-pressed={field.state.value === item.value}
                          className={`flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition ${
                            field.state.value === item.value
                              ? "border-green-700 bg-green-50 text-green-800 ring-2 ring-green-700/10"
                              : "border-slate-200 bg-white text-slate-600 hover:border-green-300"
                          }`}
                        >
                          <Users className="h-4 w-4" />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form.Field>

              {/* Terms and conditions */}
              <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-5 text-slate-600">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  required
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-green-700"
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-green-700 hover:underline"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="font-semibold text-green-700 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  !acceptedTerms ||
                  form.state.isSubmitting ||
                  registerPending
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-700 text-sm font-semibold text-white shadow-lg shadow-green-700/15 transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-green-700/20"
              >
                {form.state.isSubmitting || registerPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
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
                text="signup_with"
                shape="pill"
                onSuccess={googleSuccess}
                onError={googleError}
              />
            </div>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-green-700 hover:text-green-800"
              >
                Sign in
              </Link>
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-green-700" />
              Your information is protected and secure.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
