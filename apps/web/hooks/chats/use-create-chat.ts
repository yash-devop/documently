"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChat } from "../../lib/query/api/chats";
import { queryKeys } from "../../lib/query/keys";

export function useCreateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => createChat(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.lists() });
    },
  });
}