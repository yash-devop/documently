"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconChevronDown,
  IconDownload,
  IconFileText,
  IconLink,
  IconLoader2,
  IconPaperclip,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@repo/ui";
import { cn } from "@/lib/cn";
import { useAllDocuments } from "@/hooks/chats/use-all-documents";
import { useAttachDocument } from "@/hooks/chats/use-attach-document";
import { useDeleteDocument } from "@/hooks/chats/use-delete-document";
import { useUploadDocuments } from "@/hooks/chats/use-upload-documents";
import {
  downloadDocument,
  type ChatDocument,
  type DocumentStatus,
} from "@/lib/query/api/documents";
import { getApiError } from "@/lib/axios";
import { toast } from "@/components/toasts/index";

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
        "shrink-0 rounded-full px-1.5 py-px text-[10px] font-medium",
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

const CAROUSEL_INTERVAL_MS = 3000;

interface ChatDocumentsProps {
  chatId: string;
  documents: ChatDocument[];
}

export function ChatDocuments({ chatId, documents }: ChatDocumentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const uploadDocs = useUploadDocuments(chatId);
  const deleteDoc = useDeleteDocument(chatId);
  const attachDoc = useAttachDocument(chatId);
  const { data: library = [] } = useAllDocuments();

  useEffect(() => {
    if (documents.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % documents.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [documents.length]);

  const activeDocument =
    documents.length <= 1 ? documents[0] : documents[activeIndex];

  const attachableDocuments = useMemo(
    () => library.filter((doc) => !documents.some((d) => d.id === doc.id)),
    [library, documents],
  );

  const handleFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const pdfs = Array.from(list).filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf"),
    );
    if (pdfs.length > 0) uploadDocs.mutate(pdfs);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = async (document: ChatDocument) => {
    try {
      const result = await downloadDocument(chatId, document.id);
      window.open(result.data.url, "_blank");
      toast({ title: result.message, type: "success" });
    } catch (error) {
      toast({ title: getApiError(error).message, type: "error" });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
              "ml-auto flex h-7 max-w-56 cursor-pointer items-center gap-1.5 rounded-md border border-border-lighter/60 bg-foreground-lighter/5 px-2 text-xs text-foreground-lighter transition-colors hover:bg-foreground-lighter/15 hover:text-foreground",
              documents.length === 0 && "border-dashed",
            )}
          />
        }
      >
        <IconFileText className="size-3.5 shrink-0" />
        {activeDocument ? (
          <span
            key={activeDocument.id}
            className="flex min-w-0 items-center gap-1.5 animate-in fade-in-0"
          >
            <span className="truncate">{activeDocument.originalName}</span>
            <span className="hidden items-center md:flex">
              <StatusBadge status={activeDocument.status} />
            </span>
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
          <span className="text-xs font-medium">
            Documents ({documents.length})
          </span>
          {documents.length > 0 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex cursor-pointer items-center gap-1 rounded-sm px-1.5 py-0.5 text-xxs text-foreground-lighter transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <IconPaperclip className="size-3" />
              Upload
            </button>
          )}
        </div>

        {documents.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 px-4 py-6">
            <p className="text-center text-xs text-muted-foreground">
              No documents attached yet.
              <br />
              Upload a PDF to start asking questions.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <IconUpload className="size-3.5" />
              Upload documents
            </Button>
            {uploadDocs.isPending && (
              <span className="inline-flex items-center gap-1.5 text-xxs text-foreground-lighter/70">
                <IconLoader2 className="size-3 animate-spin" />
                Uploading…
              </span>
            )}
          </div>
        ) : (
          <ul className="max-h-56 overflow-y-auto p-1">
            {documents.map((doc) => {
              const isDeleting =
                deleteDoc.isPending && deleteDoc.variables === doc.id;
              return (
                <li
                  key={doc.id}
                  className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent"
                >
                  <IconFileText className="size-4 shrink-0 text-foreground-lighter" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs">{doc.originalName}</p>
                    <p className="flex items-center gap-1.5">
                      <StatusBadge status={doc.status} />
                      {doc.status === "FAILED" && doc.errorMessage && (
                        <span className="truncate text-xxs text-red-600">
                          {doc.errorMessage}
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Download ${doc.originalName}`}
                    onClick={() => handleDownload(doc)}
                    className="cursor-pointer rounded-sm p-1 text-foreground-lighter transition-colors hover:text-foreground"
                  >
                    <IconDownload className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${doc.originalName}`}
                    onClick={() => deleteDoc.mutate(doc.id)}
                    disabled={isDeleting}
                    className="cursor-pointer rounded-sm p-1 text-foreground-lighter transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <IconLoader2 className="size-3.5 animate-spin" />
                    ) : (
                      <IconTrash className="size-3.5" />
                    )}
                  </button>
                </li>
              );
            })}
            {uploadDocs.isPending && (
              <li className="flex items-center gap-2 px-2 py-1.5 text-xxs text-foreground-lighter/70">
                <IconLoader2 className="size-3 animate-spin" />
                Uploading…
              </li>
            )}
          </ul>
        )}

        {attachableDocuments.length > 0 && (
          <>
            <div className="border-t border-border-lighter px-3 py-2 text-xxs font-medium uppercase tracking-wide text-foreground-lighter">
              Attach from library
            </div>
            <ul className="max-h-40 overflow-y-auto p-1">
              {attachableDocuments.map((doc) => {
                const isAttaching =
                  attachDoc.isPending && attachDoc.variables === doc.id;
                return (
                  <li
                    key={doc.id}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent"
                  >
                    <IconFileText className="size-4 shrink-0 text-foreground-lighter" />
                    <span className="min-w-0 flex-1 truncate text-xs">
                      {doc.originalName}
                    </span>
                    <StatusBadge status={doc.status} />
                    <button
                      type="button"
                      aria-label={`Attach ${doc.originalName}`}
                      onClick={() => attachDoc.mutate(doc.id)}
                      disabled={isAttaching}
                      className="cursor-pointer rounded-sm p-1 text-foreground-lighter transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isAttaching ? (
                        <IconLoader2 className="size-3.5 animate-spin" />
                      ) : (
                        <IconLink className="size-3.5" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}