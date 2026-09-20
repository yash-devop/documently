"use client";

import { useRef, useState } from "react";
import { Composer } from "./composer";
import { DocumentChips } from "./document-chips";
import type { SelectedFile } from "./types";

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

export function ChatComposer({
  value,
  onChange,
  onSubmit,
}: ChatComposerProps) {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const picked = Array.from(list).map((file) => ({
      id: `${file.name}-${file.size}`,
      name: file.name,
    }));
    setFiles((prev) =>
      [...prev, ...picked].filter(
        (file, index, all) =>
          all.findIndex((other) => other.id === file.id) === index,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.txt,.md,.doc,.docx"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {files.length > 0 && (
        <DocumentChips
          files={files}
          onRemove={(id) =>
            setFiles((prev) => prev.filter((file) => file.id !== id))
          }
        />
      )}
      <Composer
        value={value}
        onChange={onChange}
        onAttach={() => fileInputRef.current?.click()}
        onSubmit={onSubmit}
      />
    </div>
  );
}