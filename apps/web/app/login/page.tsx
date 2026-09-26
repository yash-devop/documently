"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@repo/schemas";
import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  Input,
  Separator,
} from "@repo/ui";
import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ContainerWrapper } from "@/components/container-wrapper";
import { DocumentlySolo } from "@/components/logos/documently-solo";
import { toast } from "@/components/toasts/index";
import { authClient } from "@/lib/better-auth";

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}`,
      errorCallbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/login`,
    });
  };

  const handleGithub = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}`,
      errorCallbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/login`,
    });
  };

  const handleEmailLogin = async (values: LoginValues) => {
    setIsPending(true);
    try {
      const { error, data } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        // better-auth refuses sign-in for unverified accounts (403
        // EMAIL_NOT_VERIFIED). Send them to the resend screen instead of
        // showing a dead-end error.
        if (error.code === "EMAIL_NOT_VERIFIED") {
          toast({
            type: "error",
            title: "Email not verified",
            description: "Check your inbox for the verification link.",
          });

          router.push(
            `/verify-email?email=${encodeURIComponent(values.email)}`,
          );
          return;
        }

        console.log("Err", error);
        console.log("data", data);
        toast({
          type: "error",
          title: `${error.statusText ?? "Error while login"} (${error.status})`,
          description: error.message ?? error.statusText,
          dismissible: false,
          action: {
            label: "Retry",
            onClick: async () => {
              setIsPending(true);
              await handleEmailLogin(values);
            },
          },
          cancel: {
            label: "Dismiss",
            onClick: () => {},
          },
        });
        return;
      }

      if (data) {
        toast({
          type: "success",
          title: "Logged in successfully",
          description: "Welcome back to Documently!",
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 999);
      }
    } finally {
      setIsPending(false);
    }
  };
  return (
    <ContainerWrapper className="mt-40">
      <form onSubmit={handleSubmit(handleEmailLogin)}>
        <FieldSet className="w-full">
          <FieldGroup>
            <Field>
              <div className="pb-4 flex flex-col items-center justify-center gap-0.5">
                <DocumentlySolo />
                <div className="pt-4 text-center">
                  <h2 className="font-medium">Welcome back to Documently</h2>
                  <h1 className="font-normal text-foreground-light inline text-sm">
                    Don&apos;t have an account ?
                    <Link href={"/signup"}>
                      <span className="underline pl-1 underline-offset-2 text-primary font-medium">
                        Sign up
                      </span>
                    </Link>
                  </h1>
                </div>
              </div>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="text"
                placeholder="max@leiter.com"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pr-10"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-1 my-auto text-muted-foreground hover:bg-transparent focus-visible:ring-0 ring-0 focus-visible:border-none border-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </Button>
              </div>
              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
              )}
            </Field>
            <Field>
              <Button
                type="submit"
                variant="default"
                className={"w-full"}
                disabled={isPending}
              >
                {isPending ? "Logging in..." : "Log in"}
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
      <div className="flex items-center gap-3 py-4">
        <Separator className="flex-1 h-[0.5px] bg-foreground-lighter/30" />
        <span className="text-xs text-foreground-lighter uppercase">or</span>
        <Separator className="flex-1 h-[0.5px] bg-foreground-lighter/30" />
      </div>
      <FieldSet>
        <FieldGroup className="flex flex-row gap-2 ">
          <Field orientation={"horizontal"}>
            <Button
              onClick={handleGoogle}
              variant="secondary"
              className={"w-full gap-1.5"}
            >
              <IconBrandGoogleFilled />
              <span className="pt-px">Google</span>
            </Button>
          </Field>
          <Field orientation={"horizontal"}>
            <Button
              onClick={handleGithub}
              variant="secondary"
              className="gap-1.5 w-full"
            >
              <IconBrandGithubFilled />
              <span className="pt-px">Github</span>
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </ContainerWrapper>
  );
}
