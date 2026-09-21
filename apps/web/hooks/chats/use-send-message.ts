"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "@/lib/query/api/messages";
import { queryKeys } from "@/lib/query/keys";
import { withMinDelay } from "@/lib/with-min-delay";

export function useSendMessage(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (message: string) => withMinDelay(sendMessage(chatId, message)),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.messages(chatId),
      });
    },
  });
}