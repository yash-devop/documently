"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Retry,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useSidebar,
} from "@repo/ui";
import {
  IconDots,
  IconLogout2,
  IconMessageCircle,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/better-auth";
import { DocumentlyLogo } from "./logos/documently-long";
import { DocumentlySolo } from "./logos/documently-solo";
import { cn } from "@/lib/cn";
import { type Chat } from "@/lib/query/api/chats";
import { useChats } from "@/hooks/chats/use-chats";
import { useDeleteChat } from "@/hooks/chats/use-delete-chat";
import { useRenameChat } from "@/hooks/chats/use-rename-chat";
import { ChatsSkeleton } from "./chat/chats-skeleton";

const rowColor =
  "text-foreground-light peer-data-active/menu-button:text-foreground";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = authClient.useSession();
  const { isMobile, state } = useSidebar();
  const { data: chats, isLoading, isError, isFetching, refetch } = useChats();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameMutation = useRenameChat();
  const deleteMutation = useDeleteChat();

  const isNewChatActive = pathname === "/dashboard";

  const handleLogout = async () => {
    setIsSigningOut(true);
    await authClient.signOut();
    router.push("/login");
    router.refresh();
    setIsSigningOut(false);
  };

  const startRename = (chat: Chat) => {
    setRenamingChatId(chat.id);
    setRenameValue(chat.title);
  };

  const cancelRename = () => {
    setRenamingChatId(null);
    setRenameValue("");
  };

  const commitRename = (chatId: string) => {
    const title = renameValue.trim();
    setRenamingChatId(null);
    setRenameValue("");
    if (!title) return;
    renameMutation.mutate({ id: chatId, title });
  };

  const handleDelete = async (chat: Chat) => {
    await deleteMutation.mutateAsync(chat.id);
    if (pathname === `/dashboard/chats/${chat.id}`) {
      router.push("/dashboard");
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className={cn(`px-1`, state === "collapsed" && "px-0")}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={cn(
                `flex items-center justify-between w-full hover:bg-transparent py-2.5`,
                !isMobile && state === "collapsed" && "justify-center",
              )}
            >
              <div
                onClick={() => router.push("/dashboard")}
                className="flex items-center"
              >
                {!isMobile && state === "collapsed" ? (
                  <DocumentlySolo className="w-7" />
                ) : (
                  <DocumentlyLogo className="w-30" />
                )}
              </div>
              {(isMobile || state === "expanded") && (
                <SidebarTrigger className="-ml-1" />
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-2 rounded-lg border border-sidebar-border px-2 focus-within:border-ring">
          <IconSearch className="size-4 shrink-0 text-sidebar-foreground/60" />
          <SidebarInput
            className="border-none bg-transparent shadow-none focus-visible:ring-0"
            placeholder="Search..."
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="New chat"
                  variant="default"
                  isActive={isNewChatActive}
                  onClick={() => router.push("/dashboard")}
                >
                  <IconPlus className={rowColor} />
                  <span className={rowColor}>New chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isError ? (
                <Retry
                  className="px-3 py-1.5"
                  message="Something went wrong while loading chats."
                  retrying={isFetching}
                  onRetry={() => refetch()}
                />
              ) : isLoading ? (
                <ChatsSkeleton />
              ) : chats && chats.length === 0 ? (
                <p className="px-3 py-1.5 text-xs text-muted-foreground">
                  No chats found
                </p>
              ) : (
                chats?.map((chat) => {
                  const isActive = pathname === `/dashboard/chats/${chat.id}`;
                  const isRenaming = renamingChatId === chat.id;
                  return (
                    <SidebarMenuItem key={chat.id}>
                      {isRenaming ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            commitRename(chat.id);
                          }}
                          className="px-1 py-0.5"
                        >
                          <Input
                            autoFocus
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={() => commitRename(chat.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Escape") cancelRename();
                            }}
                            placeholder="Chat title"
                            aria-label="Rename chat"
                            className="h-8 w-full px-2 text-xs"
                          />
                        </form>
                      ) : (
                        <>
                          <SidebarMenuButton
                            isActive={isActive}
                            tooltip={chat.title}
                            onClick={() =>
                              router.push(`/dashboard/chats/${chat.id}`)
                            }
                          >
                            <IconMessageCircle className={rowColor} />
                            <span className={cn("truncate", rowColor)}>
                              {chat.title}
                            </span>
                          </SidebarMenuButton>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <SidebarMenuAction
                                  showOnHover
                                  aria-label={`Actions for ${chat.title}`}
                                />
                              }
                            >
                              <IconDots />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" side="right">
                              <DropdownMenuItem
                                onClick={() => startRename(chat)}
                              >
                                <IconPencil />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive!"
                                onClick={() => handleDelete(chat)}
                              >
                                <IconTrash />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="mx-2 w-auto bg-sidebar-border" />
        <div className="flex min-w-0 items-center gap-2.5 px-1 py-1.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-lighter text-xs font-medium text-primary-500">
            {(data?.user?.name ?? data?.user?.email ?? "?")
              .charAt(0)
              .toUpperCase()}
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-xs font-medium">
              {data?.user?.name ?? "User"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {data?.user?.email}
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    type="button"
                    aria-label="Logout"
                    disabled={isSigningOut}
                    onClick={handleLogout}
                    className={"text-destructive"}
                  >
                    <IconLogout2 />
                  </Button>
                }
              />
              <TooltipContent side="top">Logout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
