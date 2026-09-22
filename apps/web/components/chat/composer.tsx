import { useEffect, useRef } from "react";
import { IconCornerDownLeft, IconPaperclip } from "@tabler/icons-react";
import {
  Button,
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

const MAX_TEXTAREA_HEIGHT = 160;

export function Composer({
  value,
  onChange,
  onAttach,
  onSubmit,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    el.style.overflowY =
      el.scrollHeight > MAX_TEXTAREA_HEIGHT ? "auto" : "hidden";
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (el) resizeTextarea(el);
  }, [value]);

  return (
    <form
      className={`flex gap-2 rounded-xl border border-border-lighter bg-foreground-lighter/5 px-3 py-2 transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30 ${value.length ? "items-end" : "items-center"}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
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
          if (e.key === "Enter") {
            e.preventDefault();
            if (value.trim()) {
              onSubmit(value);
            }
          }
        }}
        placeholder="Ask anything about your documents..."
        rows={1}
        className="min-h-6 max-h-40 flex-1 resize-none border-none bg-transparent px-2 py-1.5 text-sm leading-relaxed outline-none placeholder:text-primary-foreground/60"
      />
      <Button
        type="submit"
        aria-label="Send message"
        className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg text-xs bg-primary-lighter px-2 font-medium text-foreground transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!value.trim()}
      >
        Submit
        <IconCornerDownLeft className="size-3" />
      </Button>
    </form>
  );
}
