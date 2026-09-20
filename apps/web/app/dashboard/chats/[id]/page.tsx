"use client";

import { useParams } from "next/navigation";
import { SidebarTrigger, useSidebar } from "@repo/ui";
import { useChat } from "../../../../hooks/chats/use-chat";

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const { data: chat, isLoading } = useChat(id);
  const { isMobile, state } = useSidebar();

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
      <div className="flex-1" />
    </div>
  );
}