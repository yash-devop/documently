"use client";

import { useState } from "react";
import { authClient } from "../../lib/better-auth";
import { useRouter } from "next/navigation";

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
    <div>
      <div>
        GOOGLE AUTH
        <button onClick={handleGoogle}> GOOGLE</button>
        <button onClick={handleGithub}> GITHUB</button>
      </div>
      <br />

      <div>
        Email/Password
        <input
          type="text"
          placeholder="Name"
          onChange={(e) =>
            setCreds((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setCreds((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) =>
            setCreds((prev) => ({ ...prev, password: e.target.value }))
          }
        />
        <button onClick={handleEmailSignUp}>Signup</button>
      </div>
    </div>
  );
}
