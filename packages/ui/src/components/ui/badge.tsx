import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/**
 * The status pill the chat surfaces have been hand-rolling in two places
 * (`chat-documents.tsx`, `new-chat-documents.tsx`). Promoted here so the
 * colours stay in one place, and so the landing page can reuse the exact
 * treatment the product already ships.
 */
const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1 rounded-full border font-medium select-none",
  {
    variants: {
      variant: {
        default: "border-border bg-muted text-foreground-light",
        outline: "border-border-lighter bg-transparent text-foreground-light",
        success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
        warning: "border-amber-500/20 bg-amber-500/10 text-amber-600",
        destructive: "border-red-500/20 bg-red-500/10 text-red-600",
        primary: "border-primary/30 bg-primary-lighter text-primary-500",
      },
      size: {
        sm: "px-1.5 py-px text-[10px]",
        default: "px-2 py-0.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

function Badge({
  className,
  variant = "default",
  size = "sm",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
