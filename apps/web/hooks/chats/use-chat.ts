"use client";

import { useQuery } from "@tanstack/react-query";
import { getChat } from "@/lib/query/api/chats";
import { queryKeys } from "@/lib/query/keys";
import { withMinDelay } from "@/lib/with-min-delay";

export function useChat(id: string) {
  return useQuery({
    queryKey: queryKeys.chats.detail(id),
    queryFn: () => withMinDelay(getChat(id)),
    enabled: !!id,
  });
}