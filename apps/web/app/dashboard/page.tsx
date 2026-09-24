"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SidebarTrigger, useSidebar } from "@repo/ui";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import { NewChatDocuments } from "@/components/chat/new-chat-documents";
import { PromptSuggestions } from "@/components/chat/prompt-suggestions";
import { useCreateChat } from "@/hooks/chats/use-create-chat";
import { getApiError } from "@/lib/axios";
import { attachDocument, uploadDocuments } from "@/lib/query/api/documents";
import { sendMessage } from "@/lib/query/api/messages";
import { queryKeys } from "@/lib/query/keys";
import { withMinDelay } from "@/lib/with-min-delay";
import { toast } from "@/components/toasts/index";

const suggestions = [
  "Summarize my latest document",
  "What are the key takeaways?",
  "Draft a follow-up email",
];

export default function DashboardPage() {
  const router = useRouter();
  const { isMobile, state } = useSidebar();
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [libraryIds, setLibraryIds] = useState<string[]>([]);
  const createChat = useCreateChat();
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    const prompt = value.trim();
    if (!prompt) return;
    setValue("");
    try {
      const chat = await createChat.mutateAsync("Untitled chat");

      if (files.length > 0) {
        try {
          await uploadDocuments(chat.id, files);
        } catch (error) {
          toast({ title: getApiError(error).message, type: "error" });
        }
      }
      if (libraryIds.length > 0) {
        const results = await Promise.allSettled(
          libraryIds.map((id) => attachDocument(chat.id, id)),
        );
        for (const result of results) {
          if (result.status === "rejected") {
            toast({ title: getApiError(result.reason).message, type: "error" });
          }
        }
      }
      await queryClient.invalidateQueries({
        queryKey: queryKeys.chats.documents(chat.id),
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.documents.all() });

      await withMinDelay(sendMessage(chat.id, prompt));
      await queryClient.invalidateQueries({
        queryKey: queryKeys.chats.messages(chat.id),
      });
      router.push(`/dashboard/chats/${chat.id}`);
    } catch {
      setValue((current) => (current.trim() ? current : prompt));
    }
  };

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      {(isMobile || state === "collapsed") && (
        <div className="flex h-10 items-center">
          <SidebarTrigger className="-ml-1" />
        </div>
      )}
      <ChatWelcome />

      <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
        <div className="flex justify-end">
          <NewChatDocuments
            files={files}
            libraryIds={libraryIds}
            onFilesChange={setFiles}
            onLibraryIdsChange={setLibraryIds}
          />
        </div>

        <ChatComposer
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          onStageFiles={setFiles}
        />

        <PromptSuggestions prompts={suggestions} onSelect={setValue} />
      </div>
    </div>
  );
}