import { Button } from "@inklate/ui/button";
import { cn } from "@inklate/ui/lib/utils";
import React from "react";

export interface NodeContainerProps {
  className?: string;
  selected?: boolean;
  dragging?: boolean;
  error?: string | null;
  onClearError?: () => void;
  children: React.ReactNode;
}

export const NodeContainer = ({
  className,
  selected,
  dragging,
  error,
  onClearError,
  children
}: NodeContainerProps) => {
  if (error) {
    return (
      <div
        className={cn(
          "w-80 max-w-sm rounded-xl border border-red-300 bg-red-50 p-4 shadow-sm",
          className
        )}
      >
        <div className="py-4 text-center">
          <p className="mb-3 text-sm text-red-600">{error}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={onClearError}
            className="border-red-300 text-red-600 hover:bg-red-100"
          >
            Clear Error & Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-80 max-w-sm rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200",
        selected && "border-t-2 border-t-blue-500",
        dragging && "opacity-80",
        className
      )}
    >
      <div className="p-4">{children}</div>
    </div>
  );
};
