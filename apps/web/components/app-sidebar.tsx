"use client";

import {
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@repo/ui";
import { IconMessageCircle, IconPlus, IconSearch } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "../lib/better-auth";
import { DocumentlyLogo } from "./logos/documently-long";
import { DocumentlySolo } from "./logos/documently-solo";
import { cn } from "../lib/cn";
import { useChats } from "../hooks/chats/use-chats";
import { ChatsSkeleton } from "./chat/chats-skeleton";

const rowColor =
  "text-foreground-light peer-data-active/menu-button:text-foreground";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = authClient.useSession();
  const { isMobile, state } = useSidebar();
  const {
    data: chats,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useChats();

  const isNewChatActive = pathname === "/dashboard";

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
                  return (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={chat.title}
                        onClick={() =>
                          router.push(`/dashboard/chats/${chat.id}`)
                        }
                      >
                        <IconMessageCircle className={rowColor} />
                        <span className={cn("truncate", rowColor)}>{chat.title}</span>
                      </SidebarMenuButton>
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
        <div className="flex min-w-0 items-center gap-2.5 px-2 py-1.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-lighter text-xs font-medium text-primary-500">
            {(data?.user?.name ?? data?.user?.email ?? "?")
              .charAt(0)
              .toUpperCase()}
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="truncate text-xs font-medium">
              {data?.user?.name ?? "User"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {data?.user?.email}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
