import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none cursor-pointer focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary-lighter text-foreground border-primary hover:bg-primary-light hover:border-primary-500",
        outline:
          "border-border hover:bg-input/50 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-input/30",
        secondary:
          "border-foreground-lighter/30 text-foreground hover:border-foreground-lighter/60 hover:bg-foreground-lighter/15 aria-expanded:bg-foreground-lighter/15 aria-expanded:text-foreground",
        ghost:
          "border-transparent hover:bg-foreground-lighter/15 hover:text-foreground aria-expanded:bg-foreground-lighter/15 aria-expanded:text-foreground",
        destructive:
          "bg-destructive-lighter border-destructive text-foreground-light hover:bg-destructive-light hover:border-destructive focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        link: "border-transparent text-primary underline-offset-4 hover:underline hover:bg-transparent",
      },
      size: {
        default:
          "h-[35px] px-4 pb-1 pt-1 text-sm [&_svg:not([class*='size-'])]:size-4",
        xs: "h-[26px] px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-[30px] px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        md: "h-9 px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 px-4 text-sm [&_svg:not([class*='size-'])]:size-4",
        icon: "size-9 stroke-current shrink-0 p-0 [&_svg:not([class*='size-'])]:size-5",
        "icon-sm":
          "size-6 stroke-current shrink-0 p-0 [&_svg:not([class*='size-'])]:size-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
