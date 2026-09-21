import { SidebarMenuSkeleton } from "@repo/ui";

interface ChatsSkeletonProps {
  count?: number;
}

export function ChatsSkeleton({ count = 5 }: ChatsSkeletonProps) {
  return (
    <div className="flex flex-col gap-px" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <SidebarMenuSkeleton key={index} />
      ))}
    </div>
  );
}
