import React from "react";
import { cn } from "../lib/cn";

export const ContainerWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("max-w-md px-3 mx-auto", className)}>{children}</div>
  );
};
