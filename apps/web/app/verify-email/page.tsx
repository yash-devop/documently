"use client";

import { Button, Field, FieldGroup, FieldSet, Input } from "@repo/ui";
import { IconMailOpened } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { ContainerWrapper } from "@/components/container-wrapper";
import { DocumentlySolo } from "@/components/logos/documently-solo";
import { toast } from "@/components/toasts/index";
import { authClient } from "@/lib/better-auth";

const RESEND_COOLDOWN_SECONDS = 60;
const EMAIL_STORAGE_KEY = "documently:pending-verification-email";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // With requireEmailVerification on, better-auth issues NO session at sign-up
  // and refuses sign-in until the address is verified. So this screen cannot
  // rely on a session: the email arrives as a query param from sign-up/login,
  // with a stored copy as a fallback for direct navigation.
  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") return "";

    const fromQuery = new URLSearchParams(window.location.search).get("email");
    if (fromQuery) return fromQuery;

    return window.localStorage.getItem(EMAIL_STORAGE_KEY) ?? "";
  });

  const [isPending, setIsPending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!email) return;
    window.localStorage.setItem(EMAIL_STORAGE_KEY, email);
  }, [email]);

  // If they are verified and signed in, there is nothing to do here.
  useEffect(() => {
    let active = true;

    void authClient.getSession().then(({ data }) => {
      if (!active) return;
      if (data?.user?.emailVerified) router.replace("/dashboard");
    });

    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    if (cooldown <= 0) return;

    cooldownTimer.current = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    };
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    const parsed = z.email().safeParse(email);
    if (!parsed.success) {
      toast({
        type: "error",
        title: "Enter a valid email address",
        description: "We need an email to send the verification link to.",
      });
      return;
    }

    setIsPending(true);
    try {
      // Works without a session. The endpoint always reports success so it
      // cannot be used to discover which addresses have accounts.
      const { error } = await authClient.sendVerificationEmail({
        email: parsed.data,
        callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard`,
      });

      if (error) {
        toast({
          type: "error",
          title: "Could not send the email",
          description: error.message ?? error.statusText,
        });
        return;
      }

      window.localStorage.setItem(EMAIL_STORAGE_KEY, parsed.data);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      toast({
        type: "success",
        title: "Verification email sent",
        description: `Check ${parsed.data} for the link.`,
      });
    } finally {
      setIsPending(false);
    }
  }, [email]);

  const errorParam = searchParams.get("error");

  return (
    <ContainerWrapper className="mt-40">
      <FieldSet className="w-full">
        <FieldGroup>
          <div className="pb-2 flex flex-col items-center justify-center gap-3">
            <DocumentlySolo />
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <IconMailOpened className="size-6 text-muted-foreground" />
            </div>
            <div className="pt-2 text-center space-y-1">
              <h2 className="font-medium">Verify your email</h2>
              <p className="text-sm text-foreground-light font-normal">
                {email
                  ? "Open the link we emailed you to finish setting up your account."
                  : "Enter your email and we will send you a verification link."}
              </p>
            </div>
          </div>

          {errorParam && (
            <p className="text-sm text-destructive text-center">
              That verification link is invalid or has expired. Send yourself a
              new one below.
            </p>
          )}

          <Field>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={!!errorParam}
            />
          </Field>

          <Field>
            <Button
              type="button"
              variant="default"
              className="w-full"
              onClick={handleResend}
              disabled={isPending || cooldown > 0 || !email}
            >
              {cooldown > 0
                ? `Resend in ${cooldown}s`
                : isPending
                  ? "Sending..."
                  : "Send verification email"}
            </Button>
          </Field>

          <Field>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-foreground-light"
              onClick={() => {
                window.localStorage.removeItem(EMAIL_STORAGE_KEY);
                router.replace("/login");
              }}
            >
              Back to login
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </ContainerWrapper>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
