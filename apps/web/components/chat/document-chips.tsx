import { IconX } from "@tabler/icons-react";
import type { SelectedFile } from "./types";

const MAX_VISIBLE_FILES = 3;

interface DocumentChipsProps {
  files: SelectedFile[];
  onRemove: (id: string) => void;
}

export function DocumentChips({ files, onRemove }: DocumentChipsProps) {
  const visibleFiles = files.slice(0, MAX_VISIBLE_FILES);
  const extraFiles = files.slice(MAX_VISIBLE_FILES);
  const extraNames = extraFiles.map((file) => file.name).join(", ");

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visibleFiles.map((file) => (
        <span
          key={file.id}
          title={file.name}
          className="inline-flex max-w-44 items-center gap-1.5 rounded-md border border-border-lighter/60 bg-foreground-lighter/5 px-2 py-0.5 text-xxs text-foreground-lighter"
        >
          <span className="truncate">{file.name}</span>
          <button
            type="button"
            aria-label={`Remove ${file.name}`}
            onClick={() => onRemove(file.id)}
            className="-mr-0.5 cursor-pointer text-foreground-lighter/70 transition-colors hover:text-foreground"
          >
            <IconX className="size-3" />
          </button>
        </span>
      ))}
      {extraFiles.length > 0 && (
        <span
          title={extraNames}
          className="inline-flex cursor-default items-center rounded-full border border-dashed border-border-lighter/50 px-2 py-0.5 text-xxs text-foreground-lighter/70"
        >
          +{extraFiles.length} more
        </span>
      )}
    </div>
  );
}