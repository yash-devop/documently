"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarTrigger, useSidebar } from "@repo/ui";
import { Composer } from "../../components/chat/composer";
import { DocumentChips } from "../../components/chat/document-chips";
import { PromptSuggestions } from "../../components/chat/prompt-suggestions";
import type { SelectedFile } from "../../components/chat/types";
import { useCreateChat } from "../../hooks/chats/use-create-chat";

const suggestions = [
  "Summarize my latest document",
  "What are the key takeaways?",
  "Draft a follow-up email",
];

export default function DashboardPage() {
  const router = useRouter();
  const { isMobile, state } = useSidebar();
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createChat = useCreateChat();

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const picked = Array.from(list).map((file) => ({
      id: `${file.name}-${file.size}`,
      name: file.name,
    }));
    setFiles((prev) =>
      [...prev, ...picked].filter(
        (file, index, all) =>
          all.findIndex((other) => other.id === file.id) === index,
      ),
    );
  };

  const handleSubmit = () => {
    const prompt = value.trim();
    if (!prompt) return;
    setValue("");
    createChat.mutate("Untitled chat", {
      onSuccess: (chat) => router.push(`/dashboard/chats/${chat.id}`),
    });
  };

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      {(isMobile || state === "collapsed") && (
        <div className="flex h-10 items-center">
          <SidebarTrigger className="-ml-1" />
        </div>
      )}
      <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-10 text-center">
        <h1 className="max-w-xl text-balance text-2xl font-medium tracking-tight md:text-3xl">
          What can I help you with?
        </h1>
        <p className="max-w-md text-sm text-foreground-lighter">
          Upload your documents and ask questions — get instant answers. Your
          chats stay saved in the sidebar.
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.md,.doc,.docx"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {files.length > 0 && (
          <DocumentChips
            files={files}
            onRemove={(id) =>
              setFiles((prev) => prev.filter((file) => file.id !== id))
            }
          />
        )}

        <Composer
          value={value}
          onChange={setValue}
          onAttach={() => fileInputRef.current?.click()}
          onSubmit={handleSubmit}
        />

        <PromptSuggestions prompts={suggestions} onSelect={setValue} />
      </div>
    </div>
  );
}