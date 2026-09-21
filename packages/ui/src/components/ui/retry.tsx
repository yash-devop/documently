import { RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

export interface RetryProps extends React.ComponentProps<"div"> {
  onRetry: () => void;
  retrying?: boolean;
  message?: string;
  label?: string;
}

function Retry({
  onRetry,
  retrying = false,
  message = "Something went wrong.",
  label = "Retry",
  className,
  ...props
}: RetryProps) {
  return (
    <div
      data-slot="retry"
      className={cn("flex flex-col items-center gap-2", className)}
      {...props}
    >
      {message && (
        <p className="text-xs text-muted-foreground" data-slot="retry-message">
          {message}
        </p>
      )}
      <Button
        size="sm"
        variant="outline"
        disabled={retrying}
        onClick={onRetry}
        className={"gap-2"}
      >
        <RefreshCw className={retrying ? "animate-spin" : undefined} />
        {label}
      </Button>
    </div>
  );
}

export { Retry };
