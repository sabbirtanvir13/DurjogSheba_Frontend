"use client";

import {
  Check,
  CreditCard,
  Heart,
  Info,
  Loader2,
  Lock,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useGetMe, useInitiateDonation } from "@/hooks";
import { cn } from "@/lib/utils";

const PRESET_AMOUNTS = [200, 500, 1000, 2500, 5000, 10000];

function getImpactDescription(amount: number): string {
  if (amount < 500) {
    return "Provides clean drinking water & oral rehydration solutions for victims.";
  }
  if (amount < 1000) {
    return "Delivers a 3-day emergency dry food pack (rice, pulses, oil, biscuits) for 1 family.";
  }
  if (amount < 2500) {
    return "Provides a full family emergency relief kit including food and hygiene supplies.";
  }
  if (amount < 5000) {
    return "Supplies vital medicines, first-aid kits, baby nutrition packs, and warm clothing.";
  }
  return "Funds emergency shelter rebuilding materials and critical rehabilitation for flood survivors.";
}

export interface DonationCheckoutCardProps {
  initialAmount?: number;
  campaignTitle?: string;
  className?: string;
}

export function DonationCheckoutCard({
  initialAmount = 1000,
  campaignTitle,
  className,
}: DonationCheckoutCardProps) {
  const router = useRouter();
  const { data: user, isLoading: isUserLoading } = useGetMe();
  const { mutate: initiate, isPending } = useInitiateDonation();

  const [amount, setAmount] = useState<number>(initialAmount);
  const [customAmount, setCustomAmount] = useState<string>(
    PRESET_AMOUNTS.includes(initialAmount) ? "" : String(initialAmount),
  );
  const [selectedGateway] = useState<string>("bKash");

  const activeAmount = customAmount ? Number(customAmount) || 0 : amount;

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(val);
    if (val) {
      setAmount(Number(val));
    }
  };

  const handleDonate = () => {
    if (activeAmount < 10) {
      toast.error("Please enter a donation amount of at least ৳10");
      return;
    }

    if (!isUserLoading && !user) {
      toast.info("Please login to proceed with your donation");
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }

    initiate(
      {
        amount: activeAmount,
        paymentGateway: selectedGateway,
      },
      {
        onSuccess: (res) => {
          const bkashURL = res?.data?.bkashURL;
          if (bkashURL) {
            toast.info("Redirecting to secure bKash payment gateway...");
            window.location.href = bkashURL;
          } else {
            toast.error("Could not obtain payment gateway URL");
          }
        },
        onError: (err: unknown) => {
          const apiErr = err as {
            data?: { message?: string };
            message?: string;
          };
          const message =
            apiErr?.data?.message ||
            apiErr?.message ||
            "Failed to initiate payment. Please try again.";
          toast.error(message);
        },
      },
    );
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-xl mx-auto rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-md shadow-slate-900/5",
        className,
      )}
    >
      {/* Top Banner / Heading */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Heart className="h-5 w-5 fill-emerald-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base sm:text-lg font-bold tracking-tight text-slate-900">
            {campaignTitle || "Emergency Relief Donation"}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500">
            100% directly allocated to verified disaster victims
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4 sm:space-y-5">
        {/* Preset Amount Pills (2 rows of 3 on all screens) */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Select Donation Amount (BDT)
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {PRESET_AMOUNTS.map((val) => {
              const isSelected = !customAmount && amount === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleSelectPreset(val)}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-xl border py-2 px-2 text-xs sm:text-sm font-bold transition-all",
                    isSelected
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-2xs ring-2 ring-emerald-600/20"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  <span>৳{val.toLocaleString("en-US")}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Amount Input */}
        <div>
          <label
            htmlFor="custom-amount"
            className="text-[11px] font-bold uppercase tracking-wider text-slate-500"
          >
            Or Enter Custom Amount
          </label>
          <div className="relative mt-1.5">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 font-bold text-slate-400 text-sm">
              ৳
            </span>
            <input
              id="custom-amount"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 1500"
              value={customAmount}
              onChange={handleCustomChange}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-8 pr-3 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10"
            />
          </div>
        </div>

        {/* Dynamic Impact Display */}
        {activeAmount > 0 && (
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 text-xs text-emerald-950">
            <Sparkles className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
            <div className="leading-snug">
              <span className="font-bold text-emerald-900">Your Impact: </span>
              <span className="text-emerald-800">
                {getImpactDescription(activeAmount)}
              </span>
            </div>
          </div>
        )}

        {/* Payment Gateway Selector */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Payment Method
          </p>
          <div className="mt-1.5">
            <div
              className={cn(
                "relative flex items-center justify-between rounded-xl border-2 p-3 transition-all",
                selectedGateway === "bKash"
                  ? "border-[#D12053] bg-pink-50/30 shadow-2xs"
                  : "border-slate-200 bg-white",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-14 items-center justify-center rounded-lg bg-white border border-pink-100 shadow-2xs">
                  <span className="text-xs font-black tracking-tight text-[#D12053]">
                    bKash
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    bKash Tokenized Checkout
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Pay securely using your personal bKash account
                  </p>
                </div>
              </div>
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D12053] text-white">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
            </div>
          </div>
        </div>

        {/* Security and Trust Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3 w-3 text-emerald-600" />
            <span>256-bit Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CreditCard className="h-3 w-3 text-slate-400" />
            <span>Instant Verification</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Info className="h-3 w-3 text-slate-400" />
            <span>Official Receipt</span>
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="button"
          disabled={isPending || activeAmount <= 0}
          onClick={handleDonate}
          className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 px-5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-800 focus:outline-hidden focus:ring-4 focus:ring-emerald-700/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Connecting to bKash Gateway...</span>
            </>
          ) : (
            <>
              <Heart className="h-4 w-4 fill-white" />
              <span>
                Donate ৳{activeAmount.toLocaleString("en-US")} with bKash
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
