"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useVerifyAccount } from "@/hooks";
import type { AuthApiResponse, VerifyAccountPayload } from "@/types";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { toast } from "../ui/toast";

const RESEND_COOLDOWN = 120;

export default function VerifyAccountForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);

  const { mutate: verify, isPending: verifyPending } = useVerifyAccount();

  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!email) {
      router.push("/");
    }
  }, [email, router]);

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleOTP = () => {
    if (otp.length !== 6) {
      setIsInvalid(true);
      return;
    }

    const verifyData: VerifyAccountPayload = {
      email,
      otp,
    };

    verify(verifyData, {
      onSuccess: (res: AuthApiResponse) => {
        if (res?.success === false) {
          toast.add({
            title: "Server Failure",
            description:
              res?.message || "Something went wrong. Please try again",
            type: "error",
          });
          return;
        }

        const dataObj = res?.data as Record<string, unknown> | undefined;
        const resObj = res as Record<string, unknown>;
        const token =
          (dataObj?.accessToken as string) ||
          (resObj?.accessToken as string) ||
          (dataObj?.token as string) ||
          (resObj?.token as string);

        if (token && typeof window !== "undefined") {
          localStorage.setItem("accessToken", token);
        }

        toast.add({
          title: "Verification Successful",
          description: token
            ? "Welcome onboard!"
            : "Account verified! Please sign in to continue.",
          type: "success",
        });

        if (token) {
          router.push("/");
        } else {
          router.push("/login");
        }
      },
      onError: (err: Error) => {
        toast.add({
          title: "Verification failure",
          description: err?.message || "Something went wrong. Please try again",
          type: "error",
        });
      },
    });
  };

  if (!email) {
    return null;
  }

  return (
    <Card className="border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="px-0 sm:px-6">
        <CardTitle className="text-2xl font-bold text-slate-900">
          Verify Account
        </CardTitle>
        <CardDescription className="text-slate-500">
          Please provide the OTP sent to{" "}
          <span className="font-semibold text-slate-800">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <form
          id="otp-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOTP();
          }}
          className="space-y-4"
        >
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor="otp">Enter 6-digit OTP</FieldLabel>
            <div className="flex justify-center py-2">
              <InputOTP
                maxLength={6}
                onChange={(value) => {
                  setOtp(value);
                  if (isInvalid) {
                    setIsInvalid(false);
                  }
                }}
                value={otp}
                autoComplete="one-time-code"
                name="otp"
                id="otp"
                pattern={REGEXP_ONLY_DIGITS}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot
                    index={0}
                    className="h-12 w-11 rounded-lg border text-lg font-semibold sm:h-14 sm:w-12"
                  />
                  <InputOTPSlot
                    index={1}
                    className="h-12 w-11 rounded-lg border text-lg font-semibold sm:h-14 sm:w-12"
                  />
                  <InputOTPSlot
                    index={2}
                    className="h-12 w-11 rounded-lg border text-lg font-semibold sm:h-14 sm:w-12"
                  />
                  <InputOTPSlot
                    index={3}
                    className="h-12 w-11 rounded-lg border text-lg font-semibold sm:h-14 sm:w-12"
                  />
                  <InputOTPSlot
                    index={4}
                    className="h-12 w-11 rounded-lg border text-lg font-semibold sm:h-14 sm:w-12"
                  />
                  <InputOTPSlot
                    index={5}
                    className="h-12 w-11 rounded-lg border text-lg font-semibold sm:h-14 sm:w-12"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {isInvalid && (
              <FieldError
                errors={[{ message: "Please enter the complete 6-digit code" }]}
              />
            )}
            <FieldDescription className="text-center text-xs">
              {resendTimer > 0
                ? `Resend available in ${resendTimer}s`
                : "You can now request a new code"}
            </FieldDescription>
          </Field>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 px-0 sm:flex-row sm:justify-between sm:px-6">
        <Button
          type="button"
          variant="outline"
          disabled={resendTimer > 0}
          onClick={() => {
            setResendTimer(RESEND_COOLDOWN);
            toast.add({
              title: "Code Resent",
              description: "A new OTP has been sent to your email",
              type: "info",
            });
          }}
          className="w-full sm:w-auto"
        >
          Resend OTP
        </Button>
        <Button
          type="submit"
          form="otp-form"
          disabled={verifyPending || otp.length !== 6}
          className="w-full bg-green-700 hover:bg-green-800 text-white sm:w-auto"
        >
          {verifyPending ? "Verifying..." : "Verify Account"}
        </Button>
      </CardFooter>
    </Card>
  );
}
