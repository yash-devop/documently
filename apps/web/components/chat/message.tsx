import { cn } from "@/lib/cn";

export type MessageRole = "user" | "assistant";

const roleStyles: Record<MessageRole, string> = {
  user: "self-end rounded-br-md border border-primary/40 bg-primary-lighter px-4 py-2.5 text-primary-foreground",
  assistant: "self-start bg-transparent text-foreground",
};

interface MessageProps extends React.ComponentProps<"div"> {
  role?: MessageRole;
}

export function Message({
  role = "assistant",
  className,
  ...props
}: MessageProps) {
  return (
    <div
      data-role={role}
      className={cn(
        "max-w-[75%] rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
        roleStyles[role],
        className,
        role === "assistant" && "max-w-full",
      )}
      {...props}
    />
  );
}
