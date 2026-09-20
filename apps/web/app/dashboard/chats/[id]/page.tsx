"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { SidebarTrigger, useSidebar } from "@repo/ui";
import { ChatComposer } from "../../../../components/chat/chat-composer";
import { useChat } from "../../../../hooks/chats/use-chat";

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const { data: chat, isLoading } = useChat(id);
  const { isMobile, state } = useSidebar();
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    setValue("");
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border-lighter px-4">
        {(isMobile || state === "collapsed") && (
          <SidebarTrigger className="-ml-1" />
        )}
        <span className="truncate text-sm font-medium">
          {isLoading ? "Loading..." : chat?.title ?? "Untitled chat"}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-4 overflow-hidden p-4">
        <div className="mx-auto w-full max-w-2xl">
          <ChatComposer
            value={value}
            onChange={setValue}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}