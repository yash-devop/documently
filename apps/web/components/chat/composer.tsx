import { useRef } from "react";
import { IconCornerDownLeft, IconPaperclip } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui";

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onAttach: () => void;
  onSubmit: (value: string) => void;
}

export function Composer({
  value,
  onChange,
  onAttach,
  onSubmit,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    const maxHeight = 160;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  return (
    <form
      className={`flex gap-2 rounded-xl border border-border-lighter bg-foreground-lighter/5 px-3 py-2 transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30 ${value.length ? "items-end" : "items-center"}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
        const el = textareaRef.current;
        if (el) resizeTextarea(el);
      }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                aria-label="Attach documents"
                onClick={onAttach}
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground-lighter transition-colors hover:bg-foreground-lighter/15 hover:text-foreground"
              />
            }
          >
            <IconPaperclip className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="top">Attach documents</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          resizeTextarea(e.target);
        }}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            if (value.trim()) {
              onSubmit(value);
              const el = textareaRef.current;
              if (el) resizeTextarea(el);
            }
          }
        }}
        placeholder="Ask anything about your documents..."
        rows={1}
        className="min-h-6 max-h-40 flex-1 resize-none border-none bg-transparent px-2 py-1.5 text-sm leading-relaxed outline-none placeholder:text-primary-foreground/60"
      />
      <button
        type="submit"
        aria-label="Send message"
        className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg bg-primary-lighter px-2 text-xs font-medium text-foreground transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!value.trim()}
      >
        Ctrl + <IconCornerDownLeft className="size-4" />
      </button>
    </form>
  );
}
