"use client";

import { SidebarInset, SidebarProvider } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { useSession } from "@/hooks/use-session";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { isLoading, isAuthenticated, isEmailVerified } = useSession();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // A valid session is not enough: unverified users are held at the
    // verification screen, matching the 403 the API returns for them.
    if (!isEmailVerified) {
      router.replace("/verify-email");
    }
  }, [isLoading, isAuthenticated, isEmailVerified, router]);

  if (isLoading || !isAuthenticated || !isEmailVerified) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
