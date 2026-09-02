export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
  },
  users: {
    all: ["users"] as const,
    detail: (id: string) => [...queryKeys.users.all, id] as const,
  },
} as const;
