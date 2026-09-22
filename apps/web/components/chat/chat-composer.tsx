"use client";

import { useRef } from "react";
import { Composer } from "./composer";
import { useUploadDocuments } from "@/hooks/chats/use-upload-documents";

interface ChatComposerProps {
  chatId?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

export function ChatComposer({
  chatId,
  value,
  onChange,
  onSubmit,
}: ChatComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadDocs = useUploadDocuments(chatId);

  const handleFiles = (list: FileList | null) => {
    if (!chatId || !list || list.length === 0) return;
    const pdfs = Array.from(list).filter(
      (file) =>
        file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"),
    );
    if (pdfs.length > 0) uploadDocs.mutate(pdfs);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Composer
        value={value}
        onChange={onChange}
        onAttach={() => fileInputRef.current?.click()}
        onSubmit={onSubmit}
      />
    </div>
  );
}