"use client";

import { useState } from "react";
import { authClient } from "../../lib/better-auth";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  Field,
  FieldSet,
  FieldLabel,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
  Separator,
} from "@repo/ui";
import {
  IconBrandGithubFilled,
  IconBrandGoogle,
  IconBrandGoogleFilled,
} from "@tabler/icons-react";

export default function LoginPage() {
  const router = useRouter();
  const [creds, setCreds] = useState({
    name: "",
    email: "",
    password: "",
  });
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

  const handleEmailSignUp = async () => {
    const data = await authClient.signUp.email({
      name: "",
      email: creds.email,
      password: creds.password,
    });

    if (data.data?.user.id) {
      router.push("/");
    }
  };
  return (
    <div className="max-w-md mx-auto mt-40">
      <FieldSet className="w-full ">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Username</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Max Leiter"
              onChange={(e) =>
                setCreds((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="text"
              placeholder="max@leiter.com"
              onChange={(e) =>
                setCreds((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              onChange={(e) =>
                setCreds((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </Field>
          <Field>
            <Button
              onClick={handleGoogle}
              variant="default"
              className={"w-full"}
            >
              Sign up
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
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
              className={"w-full"}
            >
              <IconBrandGoogleFilled />
              Google
            </Button>
          </Field>
          <Field orientation={"horizontal"}>
            <Button
              onClick={handleGithub}
              variant="secondary"
              className="gap-1.5 w-full"
            >
              <IconBrandGithubFilled />
              Github
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
