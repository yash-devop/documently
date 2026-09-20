"use client";

import { useQuery } from "@tanstack/react-query";
import { getChat } from "../../lib/query/api/chats";
import { queryKeys } from "../../lib/query/keys";

export function useChat(id: string) {
  return useQuery({
    queryKey: queryKeys.chats.detail(id),
    queryFn: () => getChat(id),
    enabled: !!id,
  });
}