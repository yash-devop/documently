"use client";

import { authClient } from "../../lib/better-auth";

export default function DashboardPage() {
  const { data } = authClient.useSession();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-medium">
          Welcome back, {data?.user?.name ?? "there"}!
        </h1>
        <p className="text-sm text-foreground-lighter">
          Ask questions about your documents and keep your chats organized.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Documents", value: "0" },
          { label: "Chats", value: "0" },
          { label: "Messages", value: "0" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 rounded-lg border border-border-lighter p-4"
          >
            <span className="text-xs text-foreground-lighter">{stat.label}</span>
            <span className="text-2xl font-medium">{stat.value}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border-lighter p-12">
        <p className="text-sm text-foreground-lighter">
          Your documents and chat history will appear here.
        </p>
      </div>
    </div>
  );
}