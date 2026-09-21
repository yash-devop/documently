import { Skeleton } from "@repo/ui";

interface MessagesSkeletonProps {
  count?: number;
}

export function MessagesSkeleton({ count = 4 }: MessagesSkeletonProps) {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => {
        const isUser = index % 2 === 1;
        return (
          <Skeleton
            key={index}
            className={
              isUser
                ? "h-9 w-48 self-end rounded-2xl"
                : "h-16 w-3/4 self-start rounded-2xl"
            }
          />
        );
      })}
    </div>
  );
}