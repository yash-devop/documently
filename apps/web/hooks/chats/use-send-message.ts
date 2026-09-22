"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatMessage, sendMessage } from "@/lib/query/api/messages";
import { queryKeys } from "@/lib/query/keys";
import { withMinDelay } from "@/lib/with-min-delay";

export function useSendMessage(chatId: string) {
  const queryClient = useQueryClient();

  const queryKey = queryKeys.chats.messages(chatId);

  return useMutation({
    mutationFn: (message: string) => withMinDelay(sendMessage(chatId, message)),
    onMutate: async (message: string) => {
      await queryClient.cancelQueries({ queryKey });

      const previousMessages =
        queryClient.getQueryData<ChatMessage[]>(queryKey) ?? [];

      const optimisticMessage: ChatMessage = {
        id: `optimistic-${Date.now()}`,
        chatId,
        role: "USER",
        message,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<ChatMessage[]>(
        queryKey,
        [optimisticMessage, ...previousMessages],
      );

      return { previousMessages };
    },
    onError: (_error, _message, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(queryKey, context.previousMessages);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}