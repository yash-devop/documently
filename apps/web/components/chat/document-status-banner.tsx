import { IconFileAlert, IconLoader2 } from "@tabler/icons-react";
import type { ChatDocument } from "@/lib/query/api/documents";

interface DocumentStatusBannerProps {
  documents: ChatDocument[];
}

export function DocumentStatusBanner({ documents }: DocumentStatusBannerProps) {
  const processingCount = documents.filter(
    (doc) => doc.status === "PROCESSING",
  ).length;
  const failedCount = documents.filter((doc) => doc.status === "FAILED").length;

  if (processingCount === 0 && failedCount === 0) return null;

  return (
    <div className="border-b border-border-lighter bg-background">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-2 px-4 py-1.5 text-xxs">
        {processingCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-amber-600">
            <IconLoader2 className="size-3 animate-spin" />
            {processingCount} document{processingCount > 1 ? "s" : ""} still
            processing — answers may be incomplete.
          </span>
        ) : null}
        {failedCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-red-600">
            <IconFileAlert className="size-3" />
            {failedCount} document{failedCount > 1 ? "s" : ""} failed to process
            — check the documents menu.
          </span>
        ) : null}
      </div>
    </div>
  );
}
