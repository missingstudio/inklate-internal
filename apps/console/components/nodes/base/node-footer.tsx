import { cn } from "@inklate/ui/lib/utils";
import React from "react";

export interface NodeFooterProps {
  updatedAt?: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
  customInfo?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const NodeFooter = ({
  updatedAt,
  usage,
  customInfo,
  actions,
  className,
  children
}: NodeFooterProps) => {
  if (children) {
    return <div className={cn("mt-4 border-t border-gray-100 pt-3", className)}>{children}</div>;
  }

  return (
    <div className={cn("mt-4 border-t border-gray-100 pt-3", className)}>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex min-w-0 flex-1 items-center space-x-3">
          {updatedAt && (
            <span className="truncate">Updated: {new Date(updatedAt).toLocaleTimeString()}</span>
          )}
          {customInfo && <div className="truncate">{customInfo}</div>}
        </div>
        {actions && <div className="ml-2 flex-shrink-0">{actions}</div>}
      </div>
      {usage && usage.totalTokens && (
        <div className="mt-1 text-xs text-gray-500">
          <span className="truncate">
            Tokens: {usage.totalTokens} ({usage.inputTokens}↑ {usage.outputTokens}↓)
          </span>
        </div>
      )}
    </div>
  );
};
