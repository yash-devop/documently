"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllDocuments } from "@/lib/query/api/documents";
import { queryKeys } from "@/lib/query/keys";

export function useAllDocuments() {
  return useQuery({
    queryKey: queryKeys.documents.all(),
    queryFn: getAllDocuments,
  });
}