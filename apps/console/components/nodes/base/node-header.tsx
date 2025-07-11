import { Button } from "@inklate/ui/button";
import { cn } from "@inklate/ui/lib/utils";
import React from "react";

export interface NodeHeaderProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
  onClearError?: () => void;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const NodeHeader = ({
  title,
  subtitle,
  loading,
  error,
  onClearError,
  icon,
  className,
  children
}: NodeHeaderProps) => {
  if (children) {
    return <div className={cn("mb-3 border-b border-gray-100 pb-3", className)}>{children}</div>;
  }

  return (
    <div
      className={cn(
        "mb-3 flex items-center justify-between border-b border-gray-100 pb-3",
        className
      )}
    >
      <div className="flex items-center space-x-2">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold text-gray-800">{title}</h2>
          {subtitle && <p className="truncate text-xs text-gray-500">{subtitle}</p>}
        </div>
        {loading && (
          <div className="h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        )}
      </div>
      {error && (
        <div className="flex flex-shrink-0 items-center space-x-2">
          <span className="rounded bg-red-50 px-2 py-1 text-xs text-red-600">Error</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClearError}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
          >
            ×
          </Button>
        </div>
      )}
    </div>
  );
};
