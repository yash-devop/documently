"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/better-auth";

type SessionState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  email: string | null;
};

/**
 * Reads the current better-auth session.
 *
 * Deliberately a small hand-rolled hook rather than a shared query cache: the
 * session is read by the route guards, which run before any query provider is
 * mounted, and it must never be served stale.
 */
export const useSession = (): SessionState => {
  const [state, setState] = useState<SessionState>({
    isLoading: true,
    isAuthenticated: false,
    isEmailVerified: false,
    email: null,
  });

  useEffect(() => {
    let active = true;

    void authClient.getSession().then(({ data }) => {
      if (!active) return;

      setState({
        isLoading: false,
        isAuthenticated: Boolean(data?.user),
        isEmailVerified: Boolean(data?.user?.emailVerified),
        email: data?.user?.email ?? null,
      });
    });

    return () => {
      active = false;
    };
  }, []);

  return state;
};
