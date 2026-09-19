"use client";

import {
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
import {
  IconFileText,
  IconHome,
  IconMessages,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "../lib/better-auth";
import { DocumentlyLogo } from "./logos/documently-long";
import { DocumentlySolo } from "./logos/documently-solo";
import { cn } from "../lib/cn";

const navItems = [
  {
    label: "Home",
    icon: IconHome,
    href: "/dashboard",
  },
  {
    label: "Documents",
    icon: IconFileText,
    href: "/dashboard/documents",
  },
  {
    label: "Chats",
    icon: IconMessages,
    href: "/dashboard/chats",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = authClient.useSession();
  const { isMobile, state } = useSidebar();

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
                state === "collapsed" && "justify-center",
              )}
              onClick={() => router.push("/dashboard")}
            >
              {state === "collapsed" ? (
                <DocumentlySolo className="w-7" />
              ) : (
                <DocumentlyLogo className="w-30" />
              )}
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
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      onClick={() => router.push(item.href)}
                    >
                      <item.icon className="text-sidebar-foreground" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              onClick={() => router.push("/dashboard/settings")}
            >
              <IconSettings className="text-sidebar-foreground" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
