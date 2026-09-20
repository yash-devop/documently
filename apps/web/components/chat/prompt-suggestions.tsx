interface PromptSuggestionsProps {
  prompts: string[];
  onSelect: (prompt: string) => void;
}

export function PromptSuggestions({
  prompts,
  onSelect,
}: PromptSuggestionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          className="cursor-pointer rounded-lg border border-border-lighter px-3 py-1.5 text-xs text-foreground-lighter transition-colors hover:border-primary-500 hover:text-foreground"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}