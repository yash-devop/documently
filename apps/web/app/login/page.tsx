"use client";

import { useState } from "react";
import { authClient } from "../../lib/better-auth";
import { useRouter } from "next/navigation";
import { Input, Button } from "@repo/ui";

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
    <div className="max-w-4xl mx-auto flex flex-col gap-10">
      <div className="mx-auto flex w-full items-start justify-center gap-14 pt-32">
        {/* Default */}
        <div className="flex w-fit flex-col items-start gap-3">
          <Button variant="default" size="default">
            Default
          </Button>
          <Button variant="default" size="xs">
            Default
          </Button>
          <Button variant="default" size="sm">
            Default
          </Button>
          <Button variant="default" size="md">
            Default
          </Button>
          <Button variant="default" size="lg">
            Default
          </Button>
          <Button variant="default" size="icon">
            D
          </Button>
        </div>

        {/* Secondary */}
        <div className="flex w-fit flex-col items-start gap-3">
          <Button variant="secondary" size="default">
            Secondary
          </Button>
          <Button variant="secondary" size="xs">
            Secondary
          </Button>
          <Button variant="secondary" size="sm">
            Secondary
          </Button>
          <Button variant="secondary" size="md">
            Secondary
          </Button>
          <Button variant="secondary" size="lg">
            Secondary
          </Button>
          <Button variant="secondary" size="icon">
            S
          </Button>
        </div>

        {/* Outline */}
        <div className="flex w-fit flex-col items-start gap-3">
          <Button variant="outline" size="default">
            Outline
          </Button>
          <Button variant="outline" size="xs">
            Outline
          </Button>
          <Button variant="outline" size="sm">
            Outline
          </Button>
          <Button variant="outline" size="md">
            Outline
          </Button>
          <Button variant="outline" size="lg">
            Outline
          </Button>
          <Button variant="outline" size="icon">
            O
          </Button>
        </div>

        {/* Ghost */}
        <div className="flex w-fit flex-col items-start gap-3">
          <Button variant="ghost" size="default">
            Ghost
          </Button>
          <Button variant="ghost" size="xs">
            Ghost
          </Button>
          <Button variant="ghost" size="sm">
            Ghost
          </Button>
          <Button variant="ghost" size="md">
            Ghost
          </Button>
          <Button variant="ghost" size="lg">
            Ghost
          </Button>
          <Button variant="ghost" size="icon">
            G
          </Button>
        </div>

        {/* Link */}
        <div className="flex w-fit flex-col items-start gap-3">
          <Button variant="link" size="default">
            Link
          </Button>
          <Button variant="link" size="xs">
            Link
          </Button>
          <Button variant="link" size="sm">
            Link
          </Button>
          <Button variant="link" size="md">
            Link
          </Button>
          <Button variant="link" size="lg">
            Link
          </Button>
          <Button variant="link" size="icon">
            L
          </Button>
        </div>

        {/* Destructive */}
        <div className="flex w-fit flex-col items-start gap-3">
          <Button variant="destructive" size="default">
            Destructive
          </Button>
          <Button variant="destructive" size="xs">
            Destructive
          </Button>
          <Button variant="destructive" size="sm">
            Destructive
          </Button>
          <Button variant="destructive" size="md">
            Destructive
          </Button>
          <Button variant="destructive" size="lg">
            Destructive
          </Button>
          <Button variant="destructive" size="icon">
            D
          </Button>
          <Button variant="destructive" size="icon-sm">
            D
          </Button>
        </div>
      </div>
      <div className="mx-auto flex flex-col w-100 items-start justify-center gap-2">
        <Input placeholder="Enter Placeholder" />
        <Input type="file" placeholder="Enter Placeholder" />
        <Input type="text" placeholder="Enter Placeholder" disabled={true} />
      </div>
    </div>
  );
}

{
  /* <div>
      <Button onClick={handleGoogle}> GOOGLE</Button>
      <Button onClick={handleGithub}> GITHUB</Button>
      <div className="max-w-xl mx-auto">
        Email/Password
        <Input
          type="text"
          placeholder="Name"
          onChange={(e) =>
            setCreds((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <Input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setCreds((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <Input
          type="password"
          placeholder="password"
          onChange={(e) =>
            setCreds((prev) => ({ ...prev, password: e.target.value }))
          }
        />
        <Button onClick={handleEmailSignUp}>Signup</Button>
      </div>
    </div> */
}
