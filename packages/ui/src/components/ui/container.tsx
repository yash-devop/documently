import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/**
 * The auth surfaces use their own `max-w-md` wrapper, which is the right width
 * for a form and far too narrow for page-level marketing content. This is the
 * page-scale counterpart.
 */
const containerVariants = cva("mx-auto w-full px-5 sm:px-6 lg:px-8", {
  variants: {
    size: {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-6xl",
      full: "max-w-[88rem]",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

function Container({
  className,
  size = "lg",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof containerVariants>) {
  return (
    <div
      data-slot="container"
      className={cn(containerVariants({ size }), className)}
      {...props}
    />
  );
}

export { Container, containerVariants };
