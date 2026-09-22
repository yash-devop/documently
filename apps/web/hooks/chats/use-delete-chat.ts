"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChat } from "@/lib/query/api/chats";
import { queryKeys } from "@/lib/query/keys";

export function useDeleteChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteChat(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.chats.detail(id) });
      queryClient.removeQueries({ queryKey: queryKeys.chats.messages(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.lists() });
    },
  });
}