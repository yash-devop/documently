"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attachDocument } from "@/lib/query/api/documents";
import { getApiError } from "@/lib/axios";
import { toast } from "@/components/toasts/index";
import { queryKeys } from "@/lib/query/keys";

export function useAttachDocument(chatId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) =>
      chatId
        ? attachDocument(chatId, documentId)
        : Promise.reject(new Error("No chat selected")),
    onSuccess: (result) => {
      toast({ title: result.message, type: "success" });
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.documents(chatId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all() });
    },
    onError: (error) => {
      toast({ title: getApiError(error).message, type: "error" });
    },
  });
}
