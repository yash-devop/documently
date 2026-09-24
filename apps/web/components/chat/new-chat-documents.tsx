"use client";

import { useMemo, useRef, useState } from "react";
import {
  IconChevronDown,
  IconFileText,
  IconLink,
  IconLinkOff,
  IconPaperclip,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui";
import { cn } from "@/lib/cn";
import { useAllDocuments } from "@/hooks/chats/use-all-documents";
import type { DocumentStatus } from "@/lib/query/api/documents";

const statusStyles: Record<DocumentStatus, string> = {
  PROCESSING: "bg-amber-500/10 text-amber-600",
  READY: "bg-emerald-500/10 text-emerald-600",
  FAILED: "bg-red-500/10 text-red-600",
};

const statusLabels: Record<DocumentStatus, string> = {
  PROCESSING: "Processing",
  READY: "Ready",
  FAILED: "Failed",
};

function StatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-1.5 py-px text-[10px] font-medium border cursor-default select-none",
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

interface NewChatDocumentsProps {
  files: File[];
  libraryIds: string[];
  onFilesChange: (files: File[]) => void;
  onLibraryIdsChange: (ids: string[]) => void;
}

export function NewChatDocuments({
  files,
  libraryIds,
  onFilesChange,
  onLibraryIdsChange,
}: NewChatDocumentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const { data: library = [] } = useAllDocuments();

  const total = files.length + libraryIds.length;

  const stagedLibraryDocs = useMemo(
    () => library.filter((doc) => libraryIds.includes(doc.id)),
    [library, libraryIds],
  );

  const attachableLibraryDocs = useMemo(
    () => library.filter((doc) => !libraryIds.includes(doc.id)),
    [library, libraryIds],
  );

  const handleFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const pdfs = Array.from(list).filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf"),
    );
    if (pdfs.length > 0) onFilesChange([...files, ...pdfs]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleLibraryDoc = (id: string) => {
    onLibraryIdsChange(
      libraryIds.includes(id)
        ? libraryIds.filter((value) => value !== id)
        : [...libraryIds, id],
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label="Documents"
            className={cn(
              "flex h-7 max-w-56 cursor-pointer items-center gap-1.5 rounded-md border border-border-lighter bg-foreground-lighter/5 px-2 text-xs text-foreground-light transition-colors hover:bg-foreground-lighter/15 hover:text-foreground",
              total === 0 && "border-dashed",
            )}
          />
        }
      >
        <IconFileText className="size-3.5 shrink-0" />
        {total > 0 ? (
          <span className="truncate">
            {total} document{total === 1 ? "" : "s"}
          </span>
        ) : (
          <span className="truncate">No documents</span>
        )}
        <IconChevronDown
          className={cn(
            "size-3.5 shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border-lighter px-3 py-2">
          <span className="text-xs font-medium">Documents ({total})</span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex cursor-pointer items-center gap-1 rounded-sm px-1.5 py-0.5 text-xxs text-foreground-lighter transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <IconPaperclip className="size-3" />
            Upload
          </Button>
        </div>

        {total === 0 ? (
          <div className="flex flex-col items-center gap-2.5 px-4 py-6">
            <p className="text-center text-xs text-muted-foreground">
              No documents attached yet.
              <br />
              Upload a PDF or pick from your library.
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <IconUpload className="size-3.5" />
              Upload documents
            </Button>
          </div>
        ) : (
          <ul className="max-h-56 overflow-y-auto p-1">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="group flex items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
              >
                <IconFileText className="size-4 shrink-0 text-foreground-lighter" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs">{file.name}</p>
                  <p className="text-xxs text-foreground-lighter/70">
                    New upload
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() =>
                    onFilesChange(files.filter((_, item) => item !== index))
                  }
                  className="cursor-pointer rounded-sm p-1 text-foreground-lighter transition-colors hover:text-red-600"
                >
                  <IconTrash className="size-3.5" />
                </button>
              </li>
            ))}
            {stagedLibraryDocs.map((doc) => (
              <li
                key={doc.id}
                className="group flex items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
              >
                <IconFileText className="size-4 shrink-0 text-foreground-lighter" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs">{doc.originalName}</p>
                  <p className="flex items-center gap-1.5">
                    <StatusBadge status={doc.status} />
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${doc.originalName}`}
                  onClick={() => toggleLibraryDoc(doc.id)}
                  className="cursor-pointer rounded-sm p-1 text-foreground-lighter transition-colors hover:text-red-600"
                >
                  <IconLinkOff className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {attachableLibraryDocs.length > 0 && (
          <>
            <div className="border-t border-border-lighter px-3 py-2 text-xxs font-medium uppercase tracking-wide text-foreground-lighter">
              Attach from library
            </div>
            <ul className="max-h-40 overflow-y-auto p-1">
              {attachableLibraryDocs.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
                >
                  <IconFileText className="size-4 shrink-0 text-foreground-lighter" />
                  <span className="min-w-0 flex-1 truncate text-xs">
                    {doc.originalName}
                  </span>
                  <StatusBadge status={doc.status} />
                  <TooltipProvider delay={300}>
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <button
                            type="button"
                            aria-label={`Attach ${doc.originalName}`}
                            onClick={() => toggleLibraryDoc(doc.id)}
                            className="cursor-pointer rounded-sm p-1 text-foreground-lighter transition-colors hover:text-foreground"
                          />
                        }
                      >
                        <IconLink className="size-3.5" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Attach to new chat
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="border-t border-border-lighter px-3 py-2 text-xxs text-foreground-lighter">
          Attached to your chat when you send your first message.
        </div>
      </PopoverContent>
    </Popover>
  );
}