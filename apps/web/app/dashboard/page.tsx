"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { IconLoader2 } from "@tabler/icons-react";
import { SidebarTrigger, useSidebar } from "@repo/ui";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import { NewChatDocuments } from "@/components/chat/new-chat-documents";
import { PromptSuggestions } from "@/components/chat/prompt-suggestions";
import { useCreateChat } from "@/hooks/chats/use-create-chat";
import { getApiError } from "@/lib/axios";
import { stashPendingPrompt } from "@/lib/pending-prompt";
import {
  attachDocument,
  type ChatDocument,
  uploadDocuments,
  waitForDocumentsReady,
} from "@/lib/query/api/documents";
import { queryKeys } from "@/lib/query/keys";
import { toast } from "@/components/toasts/index";

const suggestions = [
  "Summarize my latest document",
  "What are the key takeaways?",
  "Draft a follow-up email",
];

type SubmitPhase = { label: string; pending: number } | null;

export default function DashboardPage() {
  const router = useRouter();
  const { isMobile, state } = useSidebar();
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [libraryIds, setLibraryIds] = useState<string[]>([]);
  const [phase, setPhase] = useState<SubmitPhase>(null);
  const isSubmitting = phase !== null;
  const createChat = useCreateChat();
  const queryClient = useQueryClient();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleSubmit = async () => {
    const prompt = value.trim();
    if (!prompt || isSubmitting) return;
    setValue("");
    setPhase({ label: "Creating chat...", pending: 0 });
    try {
      const chat = await createChat.mutateAsync("Untitled chat");

      if (files.length > 0) {
        setPhase({ label: "Uploading documents...", pending: 0 });
        try {
          await uploadDocuments(chat.id, files);
        } catch (error) {
          // The chat already exists, so abandon it here rather than sending a
          // message that has no documents to ground it in.
          toast({ title: getApiError(error).message, type: "error" });
          setValue((current) => (current.trim() ? current : prompt));
          router.replace(`/dashboard/chats/${chat.id}`);
          return;
        }
      }

      if (libraryIds.length > 0) {
        setPhase({ label: "Attaching documents...", pending: 0 });
        const results = await Promise.allSettled(
          libraryIds.map((id) => attachDocument(chat.id, id)),
        );
        for (const result of results) {
          if (result.status === "rejected") {
            toast({ title: getApiError(result.reason).message, type: "error" });
          }
        }
      }

      // Retrieval only sees READY documents, and the upload above resolved on
      // enqueue rather than on completion. Hold here until the worker has
      // actually indexed everything, or the first answer has no context to
      // ground itself in and the model refuses to answer.
      let documents: ChatDocument[] = [];
      if (files.length > 0) {
        setPhase({ label: "Indexing documents...", pending: 0 });
        documents = await waitForDocumentsReady(chat.id, {
          onPendingChange: (pending) => {
            if (!mountedRef.current) return;
            setPhase({ label: "Indexing documents...", pending });
          },
        });
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.chats.documents(chat.id),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.documents.all(),
      });

      const failed = documents.filter((doc) => doc.status === "FAILED").length;
      if (failed > 0) {
        toast({
          title: `${failed} document${failed > 1 ? "s" : ""} failed to process`,
          description: "The answer may be missing those documents.",
          type: "error",
        });
      }

      setPhase({ label: "Opening chat...", pending: 0 });
      stashPendingPrompt(chat.id, prompt);
      // replace, not push: Back should not return to a welcome screen whose
      // composer and staged files are already gone.
      router.replace(`/dashboard/chats/${chat.id}`);
    } catch (error) {
      if (mountedRef.current) {
        setValue((current) => (current.trim() ? current : prompt));
        toast({ title: getApiError(error).message, type: "error" });
      }
    } finally {
      if (mountedRef.current) setPhase(null);
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

        {phase && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-center gap-2 text-xs text-foreground-light"
          >
            <IconLoader2 className="size-3.5 animate-spin" />
            <span>{phase.label}</span>
            {phase.pending > 0 && (
              <span className="text-foreground-lighter">
                {phase.pending} remaining
              </span>
            )}
          </div>
        )}

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
