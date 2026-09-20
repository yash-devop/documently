"use client";

import { useQuery } from "@tanstack/react-query";
import { getChats } from "../../lib/query/api/chats";
import { queryKeys } from "../../lib/query/keys";

export function useChats() {
  return useQuery({
    queryKey: queryKeys.chats.lists(),
    queryFn: getChats,
  });
}