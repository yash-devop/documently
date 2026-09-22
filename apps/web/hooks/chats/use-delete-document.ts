"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteDocument,
  DocumentApiResponse,
} from "@/lib/query/api/documents";
import { getApiError } from "@/lib/axios";
import { toast } from "@/components/toasts/index";
import { queryKeys } from "@/lib/query/keys";

export function useDeleteDocument(chatId?: string) {
  const queryClient = useQueryClient();

  const noChatResponse: DocumentApiResponse<{ id: string }> = {
    status: 200,
    data: { id: "" },
    message: "Document deleted successfully",
    error: null,
  };

  return useMutation({
    mutationFn: (documentId: string) =>
      chatId ? deleteDocument(chatId, documentId) : Promise.resolve(noChatResponse),
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