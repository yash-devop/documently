import { cn } from "@/lib/cn";
import { MarkdownContent } from "./markdown-content";

export type MessageRole = "user" | "assistant";

const roleStyles: Record<MessageRole, string> = {
  user: "self-end rounded-br-md border border-primary/40 bg-primary-lighter px-4 py-2.5 text-primary-foreground",
  assistant: "self-start bg-transparent text-foreground",
};

interface MessageProps extends React.ComponentProps<"div"> {
  role?: MessageRole;
  pending?: boolean;
}

export function Message({
  role = "assistant",
  pending = false,
  className,
  children,
  ...props
}: MessageProps) {
  return (
    <div
      data-role={role}
      className={cn(
        "rounded-2xl text-sm leading-relaxed",
        roleStyles[role],
        className,
        role === "user" && "max-w-[75%] whitespace-pre-wrap",
        role === "assistant" && "max-w-full",
      )}
      {...props}
    >
      {role === "user" ? (
        pending ? (
          <span className="bg-clip-text bg-gradient-to-r from-primary-foreground via-primary-foreground/25 to-primary-foreground text-transparent animate-shimmer [background-size:200%_auto]">
            {children}
          </span>
        ) : (
          children
        )
      ) : (
        <MarkdownContent content={String(children ?? "")} />
      )}
    </div>
  );
}
