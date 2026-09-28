"use client";

import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatDocuments } from "@/components/chat/chat-documents";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import { DocumentStatusBanner } from "@/components/chat/document-status-banner";
import { Message } from "@/components/chat/message";
import { MessagesSkeleton } from "@/components/chat/messages-skeleton";
import { useChat } from "@/hooks/chats/use-chat";
import { useDocuments } from "@/hooks/chats/use-documents";
import { useMessages } from "@/hooks/chats/use-messages";
import { useSendMessage } from "@/hooks/chats/use-send-message";
import { cn } from "@/lib/cn";
import { takePendingPrompt } from "@/lib/pending-prompt";
import { IconArrowDown } from "@tabler/icons-react";
import { Button, Retry, SidebarTrigger, Skeleton, useSidebar } from "@repo/ui";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/** How close to the bottom still counts as "at the bottom". Without a
 *  tolerance, sub-pixel growth while an answer streams reads as the user
 *  scrolling up and kills autoscroll mid-sentence. */
const BOTTOM_TOLERANCE_PX = 48;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  return <ChatContentView chatId={id} />;
}

function ChatContentView({ chatId }: { chatId: string }) {
  const { data: chat, isLoading } = useChat(chatId);
  const {
    data: messages,
    isLoading: isLoadingMessages,
    isError: isMessagesError,
    isFetching: isFetchingMessages,
    refetch: refetchMessages,
  } = useMessages(chatId);
  const { isMobile, state } = useSidebar();
  const [value, setValue] = useState("");
  const { data: documents = [] } = useDocuments(chatId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: prefersReducedMotion() ? "auto" : behavior,
    });
    stickToBottomRef.current = true;
    setShowScrollToBottom(false);
  }, []);

  // Single source of truth for "is the user parked at the bottom". The old
  // IntersectionObserver sentinel flipped to false the moment a streaming
  // answer grew past it, which is exactly when autoscroll is most needed.
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.clientHeight - el.scrollTop;
    const atBottom = distance <= BOTTOM_TOLERANCE_PX;
    stickToBottomRef.current = atBottom;
    setShowScrollToBottom(!atBottom);
  }, []);

  // Pin on any content growth, not just a new `messages` array. Streaming
  // tokens, markdown tables, and late font metrics all change the content
  // height while the array identity stays the same, so keying off `messages`
  // alone left the view behind mid-answer.
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const pin = () => {
      const el = scrollRef.current;
      if (!el || !stickToBottomRef.current) return;
      el.scrollTop = el.scrollHeight;
    };
    const observer = new ResizeObserver(pin);
    observer.observe(content);
    // Container resizes (viewport change) don't resize the content, so watch
    // those separately to keep the last message in view.
    window.addEventListener("resize", pin);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", pin);
    };
  }, []);

  // Land at the newest message once history arrives, without animating past the
  // whole conversation on load.
  useEffect(() => {
    if (isLoadingMessages) return;
    scrollToBottom("auto");
  }, [chatId, isLoadingMessages, scrollToBottom]);

  const {
    mutate: sendMessage,
    isPending: isSending,
    variables: sendVariables,
  } = useSendMessage(chatId);

  const handleSubmit = () => {
    const message = value.trim();
    if (!message) return;
    setValue("");
    sendMessage(message, {
      onError: () => {
        setValue((current) => (current.trim() ? current : message));
      },
    });
    // The optimistic bubble grows the content, which the ResizeObserver picks
    // up and pins on its own.
  };

  // A brand new chat is created by the welcome screen, which parks the first
  // prompt for us. Send it from here so it streams like every other message
  // instead of going out as one blocking request. Gated on the history load
  // finishing: useSendMessage seeds its optimistic bubbles from the cached
  // list, and an in-flight fetch would land after it and wipe them out.
  useEffect(() => {
    if (isLoadingMessages) return;
    const pending = takePendingPrompt(chatId);
    if (pending) sendMessage(pending);
  }, [chatId, isLoadingMessages, sendMessage]);

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden">
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-20 flex h-12 items-center gap-2 border-b border-border-lighter bg-background px-4",
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
        <ChatDocuments chatId={chatId} documents={documents} />
      </div>

      {/* `h-0` + `flex-1` is the idiom for a flex-column child that fills the
          remaining space but is never sized by its own content, so the message
          area scrolls internally instead of growing the page. */}
      <div className="relative flex min-h-0 flex-1 flex-col pt-12">
        <DocumentStatusBanner documents={documents} />
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="no-scrollbar h-0 min-h-0 w-full flex-1 overflow-y-auto overscroll-contain"
        >
          <div
            ref={contentRef}
            className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 pb-28 pt-8"
          >
            {isMessagesError ? (
              <div className="flex min-h-[60vh] items-center justify-center">
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
                    message.message === (sendVariables as string | undefined)
                  }
                >
                  {message.message}
                </Message>
              ))
            )}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-20 bg-background",
          !isMobile &&
            (state === "expanded"
              ? "md:left-[var(--sidebar-width)]"
              : "md:left-[var(--sidebar-width-icon)]"),
        )}
      >
        <div className="flex justify-center p-4">
          <div className="relative w-full max-w-2xl">
            {showScrollToBottom && (
              <Button
                type="button"
                onClick={() => scrollToBottom()}
                aria-label="Scroll to bottom"
                variant="outline"
                size="icon"
                className="absolute -top-16 right-0 size-9 rounded-full border-border bg-background/80 shadow-lg backdrop-blur-sm"
              >
                <IconArrowDown className="size-5" />
              </Button>
            )}
            <ChatComposer
              chatId={chatId}
              value={value}
              onChange={setValue}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
