import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AuthHeroPanel } from "@/components/layout/AuthHeroPanel";
import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/schemas/authSchemas";
import { useAuth } from "@/hooks/useAuth";

const OTP_LENGTH = 6;

const getDigitsFromValue = (value: string) =>
  value.replace(/\D/g, "").slice(0, OTP_LENGTH);

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, verifyOtp, resendOtp } = useAuth();
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<"resend" | "preview">(
    "preview",
  );
  const [otpDigits, setOtpDigits] = useState<string[]>(
    Array(OTP_LENGTH).fill(""),
  );
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpInfoMessage, setOtpInfoMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const otpValue = useMemo(() => otpDigits.join(""), [otpDigits]);

  const focusOtpInput = (index: number) => {
    otpInputRefs.current[index]?.focus();
  };

  useEffect(() => {
    if (isOtpOpen) {
      const timer = window.setTimeout(() => {
        focusOtpInput(0);
      }, 30);

      return () => window.clearTimeout(timer);
    }
  }, [isOtpOpen]);

  const onSubmit = async (values: RegisterFormData) => {
    const { confirmPassword, ...payload } = values;

    const response = await registerUser.mutateAsync(payload);
    setRegistrationEmail(response.email);
    setPreviewUrl(response.previewUrl || null);
    setDeliveryMode(response.previewUrl ? "preview" : "resend");
    setOtpDigits(Array(OTP_LENGTH).fill(""));
    setOtpError(null);
    setOtpInfoMessage(response.message);
    setIsOtpOpen(true);
  };

  const handleOtpChange = (index: number, value: string) => {
    const digits = getDigitsFromValue(value);

    if (!digits) {
      setOtpDigits((current) =>
        current.map((digit, digitIndex) => (digitIndex === index ? "" : digit)),
      );
      setOtpError(null);
      return;
    }

    setOtpDigits((current) => {
      const next = [...current];
      digits.split("").forEach((digit, offset) => {
        const targetIndex = index + offset;
        if (targetIndex < OTP_LENGTH) {
          next[targetIndex] = digit;
        }
      });
      return next;
    });

    setOtpError(null);

    const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
    focusOtpInput(nextIndex);
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "ArrowLeft" && index > 0) {
      focusOtpInput(index - 1);
      return;
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      focusOtpInput(index + 1);
      return;
    }

    const shouldMoveBackward =
      event.key === "Backspace" && !otpDigits[index] && index > 0;
    if (shouldMoveBackward) {
      focusOtpInput(index - 1);
    }
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const digits = getDigitsFromValue(event.clipboardData.getData("text"));
    if (!digits) {
      return;
    }

    const next = Array(OTP_LENGTH)
      .fill("")
      .map((_, index) => digits[index] || "");
    setOtpDigits(next);
    setOtpError(null);
    focusOtpInput(Math.min(digits.length, OTP_LENGTH) - 1);
  };

  const closeOtpModal = () => {
    setIsOtpOpen(false);
    setOtpError(null);
    setOtpInfoMessage(null);
    setPreviewUrl(null);
    setDeliveryMode("preview");
    setOtpDigits(Array(OTP_LENGTH).fill(""));
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== OTP_LENGTH) {
      setOtpError("Enter the 6-digit verification code");
      return;
    }

    setOtpError(null);

    try {
      await verifyOtp.mutateAsync({ email: registrationEmail, otp: otpValue });
      closeOtpModal();
      reset();
      navigate("/dashboard");
    } catch (error) {
      setOtpError((error as Error).message);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendOtp.mutateAsync({
        email: registrationEmail,
      });
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setOtpError(null);
      setOtpInfoMessage(response.message);
      setPreviewUrl(response.previewUrl || null);
      setDeliveryMode(response.previewUrl ? "preview" : "resend");
      focusOtpInput(0);
    } catch (error) {
      setOtpError((error as Error).message);
    }
  };

  return (
    <>
      <div className="flex h-screen w-full overflow-hidden">
        <AuthHeroPanel />

        <div className="flex w-full flex-col items-center justify-center bg-[linear-gradient(135deg,_rgba(230,247,243,0.72)_0%,_#ffffff_40%,_rgba(230,247,243,0.38)_100%)] px-8 dark:bg-[linear-gradient(135deg,_rgba(30,41,59,1)_0%,_rgba(15,23,42,1)_40%,_rgba(30,41,59,1)_100%)] md:w-1/2 md:px-16">
          <div className="mb-10 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-brand text-white">
              TL
            </div>
            <h1 className="text-2xl font-semibold">
              <span className="text-slate-800 dark:text-slate-100">TRACK</span>
              <span className="text-brand">LEADS</span>
            </h1>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-sm space-y-4"
          >
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password with at least 8 characters"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {registerUser.error && !isOtpOpen && (
              <p className="text-sm text-red-600">
                {(registerUser.error as Error).message || "Registration failed"}
              </p>
            )}

            <Button
              className="w-full bg-brand hover:bg-brand-dark"
              disabled={registerUser.isPending}
            >
              {registerUser.isPending ? "Sending code..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              <Link
                to="/login"
                className="font-medium text-brand hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      {isOtpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-md">
          <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-brand/15 bg-[radial-gradient(circle_at_top,_rgba(60,184,154,0.18),_transparent_38%),linear-gradient(180deg,_#ffffff_0%,_#f7fffc_100%)] p-8 shadow-[0_35px_120px_rgba(46,158,131,0.22)] dark:bg-[radial-gradient(circle_at_top,_rgba(60,184,154,0.12),_transparent_38%),linear-gradient(180deg,_#1e293b_0%,_#0f172a_100%)] dark:border-brand/25 sm:p-10">
            <div className="absolute inset-x-10 top-0 h-1 rounded-full bg-gradient-to-r from-brand/40 via-brand to-brand/40" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />

            <button
              type="button"
              onClick={closeOtpModal}
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-brand dark:text-slate-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </button>

            <div className="mx-auto mb-8 grid h-20 w-20 place-items-center rounded-[28px] border border-brand/15 bg-brand-light text-brand shadow-[0_16px_40px_rgba(60,184,154,0.18)]">
              <ShieldCheck className="h-10 w-10" />
            </div>

            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand/80">
                Secure Onboarding
              </p>
              <div className="mt-5 flex justify-center">
                <span
                  className={
                    deliveryMode === "resend"
                      ? "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700"
                      : "inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700"
                  }
                >
                  {deliveryMode === "resend" ? "Resend Active" : "Preview Mode"}
                </span>
              </div>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                Verify your email
              </h2>
              <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-slate-500 dark:text-slate-400">
                We&apos;ve sent a 6-digit code to{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {registrationEmail}
                </span>
              </p>
            </div>

            <div className="mt-10 flex justify-center gap-2 sm:gap-3">
              {otpDigits.map((digit, index) => (
                <Input
                  key={index}
                  ref={(element) => {
                    otpInputRefs.current[index] = element;
                  }}
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  onChange={(event) =>
                    handleOtpChange(index, event.target.value)
                  }
                  onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  onPaste={handleOtpPaste}
                  className="h-14 w-12 rounded-2xl border-brand/20 bg-white/90 px-0 text-center text-2xl font-semibold text-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.06)] focus-visible:border-brand focus-visible:ring-brand/30 dark:bg-slate-800/90 dark:text-slate-100 sm:h-16 sm:w-14"
                />
              ))}
            </div>

            <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400"></p>

            {otpInfoMessage && (
              <div className="mt-5 rounded-2xl border border-brand/15 bg-brand-light/70 px-4 py-3 text-center text-sm text-brand-dark">
                {otpInfoMessage}
              </div>
            )}

            {previewUrl && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-900">
                <p className="font-semibold">Development email preview</p>
                <p className="mt-1 text-amber-800/90">
                  SMTP is not configured, so this OTP was not sent to your real
                  inbox. Open the preview instead.
                </p>
                <a
                  className="mt-2 inline-flex font-semibold text-brand underline underline-offset-4"
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open preview email
                </a>
              </div>
            )}

            {(otpError || verifyOtp.error) && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                {otpError || (verifyOtp.error as Error).message}
              </div>
            )}

            <Button
              type="button"
              onClick={handleVerifyOtp}
              className="mt-8 h-12 w-full rounded-2xl bg-brand text-base font-semibold text-white shadow-[0_18px_35px_rgba(60,184,154,0.3)] hover:bg-brand-dark"
              disabled={verifyOtp.isPending}
            >
              {verifyOtp.isPending ? "Verifying..." : "Verify email"}
            </Button>

            <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={handleResendOtp}
                className="font-semibold text-brand underline-offset-4 hover:underline disabled:opacity-60"
                disabled={resendOtp.isPending}
              >
                {resendOtp.isPending ? "Resending..." : "Resend"}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};
