"use client";

import { useQuery } from "@tanstack/react-query";
import { ChatDocument, getDocuments } from "@/lib/query/api/documents";
import { queryKeys } from "@/lib/query/keys";

const PROCESSING_POLL_MS = 3000;

export function useDocuments(chatId?: string) {
  return useQuery({
    queryKey: queryKeys.chats.documents(chatId),
    queryFn: () => (chatId ? getDocuments(chatId) : []),
    enabled: !!chatId,
    refetchInterval: (query) => {
      const docs = query.state.data as ChatDocument[] | undefined;
      return docs?.some((doc) => doc.status === "PROCESSING")
        ? PROCESSING_POLL_MS
        : false;
    },
  });
}