"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { SidebarTrigger, Skeleton, useSidebar } from "@repo/ui";
import { ChatComposer } from "@/components/chat/chat-composer";
import { useChat } from "@/hooks/chats/use-chat";
import { cn } from "@/lib/cn";

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
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-10 flex h-12 items-center gap-2 border-b border-border-lighter bg-background px-4",
          !isMobile &&
            (state === "expanded"
              ? "md:left-[var(--sidebar-width)]"
              : "md:left-[var(--sidebar-width-icon)]"),
        )}
      >
        {(isMobile || state === "collapsed") && (
          <SidebarTrigger className="-ml-1" />
        )}
        <span className="truncate text-sm font-medium">
          {isLoading ? (
            <Skeleton className="h-4 w-40 rounded-md" />
          ) : (
            (chat?.title ?? "Untitled chat")
          )}
        </span>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="no-scrollbar mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 overflow-y-auto px-4 pt-16 pb-28"></div>
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-10 border-t border-border-lighter bg-background",
            !isMobile &&
              (state === "expanded"
                ? "md:left-[var(--sidebar-width)]"
                : "md:left-[var(--sidebar-width-icon)]"),
          )}
        >
          <div className="flex justify-center p-4">
            <div className="w-full max-w-2xl">
              <ChatComposer
                value={value}
                onChange={setValue}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
