"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarTrigger, useSidebar } from "@repo/ui";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import { PromptSuggestions } from "@/components/chat/prompt-suggestions";
import { useCreateChat } from "@/hooks/chats/use-create-chat";

const suggestions = [
  "Summarize my latest document",
  "What are the key takeaways?",
  "Draft a follow-up email",
];

export default function DashboardPage() {
  const router = useRouter();
  const { isMobile, state } = useSidebar();
  const [value, setValue] = useState("");
  const createChat = useCreateChat();

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
      <ChatWelcome />

      <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
        <ChatComposer
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
        />

        <PromptSuggestions prompts={suggestions} onSelect={setValue} />
      </div>
    </div>
  );
}