"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DocumentApiResponse,
  UploadedDocument,
  uploadDocuments,
} from "@/lib/query/api/documents";
import { getApiError } from "@/lib/axios";
import { toast } from "@/components/toasts/index";
import { queryKeys } from "@/lib/query/keys";

export function useUploadDocuments(chatId?: string) {
  const queryClient = useQueryClient();

  const noChatResponse: DocumentApiResponse<UploadedDocument[]> = {
    status: 200,
    data: [],
    message: "Documents uploaded successfully",
    error: null,
  };

  return useMutation({
    mutationFn: (files: File[]) =>
      chatId
        ? uploadDocuments(chatId, files)
        : Promise.resolve(noChatResponse),
    onSuccess: (result) => {
      toast({ title: result.message, type: "success" });
    },
    onError: (error) => {
      toast({ title: getApiError(error).message, type: "error" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.documents(chatId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all() });
    },
  });
}