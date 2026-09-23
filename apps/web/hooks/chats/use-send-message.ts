"use client";

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatMessage, streamMessage } from "@/lib/query/api/messages";
import { queryKeys } from "@/lib/query/keys";

export function useSendMessage(chatId: string) {
  const queryClient = useQueryClient();
  const streamingIdRef = useRef<string | null>(null);

  const queryKey = queryKeys.chats.messages(chatId);

  const upsertStreamingToken = (delta: string) => {
    const streamingId = streamingIdRef.current;
    if (!streamingId) return;
    queryClient.setQueryData<ChatMessage[]>(queryKey, (current = []) => {
      const index = current.findIndex((m) => m.id === streamingId);
      if (index === -1) {
        const placeholder: ChatMessage = {
          id: streamingId,
          chatId,
          role: "ASSISTANT",
          message: delta,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return [placeholder, ...current];
      }
      const copy = [...current];
      const target = copy[index];
      if (!target) return copy;
      copy[index] = {
        ...target,
        message: target.message + delta,
      };
      return copy;
    });
  };

  return useMutation({
    mutationFn: (message: string) =>
      streamMessage(chatId, message, upsertStreamingToken),
    onMutate: async (message: string) => {
      await queryClient.cancelQueries({ queryKey });

      const previousMessages =
        queryClient.getQueryData<ChatMessage[]>(queryKey) ?? [];
      const now = new Date().toISOString();

      const optimisticMessage: ChatMessage = {
        id: `optimistic-${Date.now()}`,
        chatId,
        role: "USER",
        message,
        createdAt: now,
        updatedAt: now,
      };

      const streamingId = `streaming-${Date.now()}`;
      streamingIdRef.current = streamingId;

      const streamingPlaceholder: ChatMessage = {
        id: streamingId,
        chatId,
        role: "ASSISTANT",
        message: "",
        createdAt: now,
        updatedAt: now,
      };

      queryClient.setQueryData<ChatMessage[]>(queryKey, [
        streamingPlaceholder,
        optimisticMessage,
        ...previousMessages,
      ]);

      return { previousMessages, streamingId };
    },
    onSuccess: (result, _message, context) => {
      if (result && context?.streamingId) {
        queryClient.setQueryData<ChatMessage[]>(queryKey, (current = []) =>
          current.map((m) =>
            m.id === context.streamingId ? result.assistantMessage : m,
          ),
        );
      }
      streamingIdRef.current = null;
    },
    onError: (_error, _message, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(queryKey, context.previousMessages);
      }
      streamingIdRef.current = null;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}