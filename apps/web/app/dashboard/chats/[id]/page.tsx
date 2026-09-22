"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Retry, SidebarTrigger, Skeleton, useSidebar } from "@repo/ui";
import { ChatDocuments } from "@/components/chat/chat-documents";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import { DocumentStatusBanner } from "@/components/chat/document-status-banner";
import { Message } from "@/components/chat/message";
import { MessagesSkeleton } from "@/components/chat/messages-skeleton";
import { useChat } from "@/hooks/chats/use-chat";
import { useDocuments } from "@/hooks/chats/use-documents";
import { useMessages } from "@/hooks/chats/use-messages";
import { useSendMessage } from "@/hooks/chats/use-send-message";
import { cn } from "@/lib/cn";

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const { data: chat, isLoading } = useChat(id);
  const {
    data: messages,
    isLoading: isLoadingMessages,
    isError: isMessagesError,
    isFetching: isFetchingMessages,
    refetch: refetchMessages,
  } = useMessages(id);
  const { isMobile, state } = useSidebar();
  const [value, setValue] = useState("");
  const { data: documents = [] } = useDocuments(id);
  const {
    mutate: sendMessage,
    isPending: isSending,
    variables: sendVariables,
  } = useSendMessage(id);

  const handleSubmit = () => {
    const message = value.trim();
    if (!message) return;
    setValue("");
    sendMessage(message, {
      onError: () => {
        setValue((current) => (current.trim() ? current : message));
      },
    });
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
        <ChatDocuments chatId={id} documents={documents} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden pt-12">
        <DocumentStatusBanner documents={documents} />
        <div className="no-scrollbar mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 overflow-y-auto px-4 pb-28">
          {isMessagesError ? (
            <div className="flex items-center justify-center h-full">
              <Retry
                message="Something went wrong while loading messages."
                retrying={isFetchingMessages}
                onRetry={() => refetchMessages()}
              />
            </div>
          ) : isLoadingMessages ? (
            <MessagesSkeleton />
          ) : messages && messages.length === 0 ? (
            <ChatWelcome />
          ) : (
            messages?.map((message) => (
              <Message
                key={message.id}
                role={message.role === "USER" ? "user" : "assistant"}
                pending={
                  isSending &&
                  message.id.startsWith("optimistic-") &&
                  message.message ===
                    (sendVariables as string | undefined)
                }
              >
                {message.message}
              </Message>
            ))
          )}
        </div>
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
                chatId={id}
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