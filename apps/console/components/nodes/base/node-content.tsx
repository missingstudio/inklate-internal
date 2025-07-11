import { cn } from "@inklate/ui/lib/utils";
import React from "react";

export interface NodeContentProps {
  className?: string;
  children: React.ReactNode;
}

export const NodeContent = ({ className, children }: NodeContentProps) => {
  return <div className={cn("space-y-4", className)}>{children}</div>;
};
