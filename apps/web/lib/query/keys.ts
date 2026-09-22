export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
  },
  users: {
    all: ["users"] as const,
    detail: (id: string) => [...queryKeys.users.all, id] as const,
  },
  chats: {
    lists: () => ["chats", "list"] as const,
    details: () => ["chats", "detail"] as const,
    detail: (id: string) => [...queryKeys.chats.details(), id] as const,
    messages: (chatId: string) =>
      [...queryKeys.chats.detail(chatId), "messages"] as const,
    documents: (chatId?: string) =>
      [...queryKeys.chats.detail(chatId ?? ""), "documents"] as const,
  },
  documents: {
    all: () => ["documents", "all"] as const,
  },
} as const;