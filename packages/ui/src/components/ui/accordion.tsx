import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";

import { cn } from "../../lib/utils";

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "border-b border-border-lighter last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders base-ui's `Header`, which owns the heading level and the
 * trigger/panel association. Compose as
 * `Accordion > AccordionItem > AccordionHeader > AccordionTrigger` + `AccordionContent`.
 */
function AccordionHeader({
  className,
  ...props
}: AccordionPrimitive.Header.Props) {
  return (
    <AccordionPrimitive.Header
      data-slot="accordion-header"
      className={cn("flex", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Trigger
      data-slot="accordion-trigger"
      className={cn(
        "flex flex-1 cursor-pointer items-start justify-between gap-4 py-4 text-left text-sm font-medium outline-none transition-colors duration-[var(--duration-ui)] ease-[var(--ease-out-ui)] select-none hover:text-primary-500 focus-visible:text-primary-500",
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden
        data-slot="accordion-trigger-icon"
        className="mt-0.5 shrink-0 text-foreground-lighter transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out-ui)] group-data-[slot=accordion-trigger]/open:rotate-45"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 1V13M1 7H13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </AccordionPrimitive.Trigger>
  );
}

/**
 * Panel height is animated by CSS, not by keyframes: base-ui exposes
 * `data-starting-style` / `data-ending-style`, so the transition is interruptible
 * — reversing mid-open resumes from the current height instead of restarting.
 */
function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-sm text-foreground-lighter transition-[height,opacity] duration-[var(--duration-ui)] ease-[var(--ease-out-ui)] data-ending-style:opacity-0 data-starting-style:opacity-0",
        className,
      )}
      {...props}
    >
      <div className="pb-4 pr-8 leading-relaxed">{children}</div>
    </AccordionPrimitive.Panel>
  );
}

export {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
};
