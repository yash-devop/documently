"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renameChat } from "@/lib/query/api/chats";
import { queryKeys } from "@/lib/query/keys";

export function useRenameChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      renameChat(id, title),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.detail(id) });
    },
  });
}