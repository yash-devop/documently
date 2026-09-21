"use client";

import { useQuery } from "@tanstack/react-query";
import { getMessages } from "@/lib/query/api/messages";
import { queryKeys } from "@/lib/query/keys";
import { withMinDelay } from "@/lib/with-min-delay";

export function useMessages(chatId: string) {
  return useQuery({
    queryKey: queryKeys.chats.messages(chatId),
    queryFn: () => withMinDelay(getMessages(chatId)),
    select: (messages) => [...messages].reverse(),
    enabled: !!chatId,
  });
}
