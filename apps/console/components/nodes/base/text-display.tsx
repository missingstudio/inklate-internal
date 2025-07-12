import { Button } from "@inklate/ui/button";
import React from "react";

export interface TextDisplayProps {
  text: string;
  onClear?: () => void;
  placeholder?: string;
}

export const TextDisplay = ({
  text,
  onClear,
  placeholder = "No text received. Connect a text output from another node."
}: TextDisplayProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-xs font-semibold text-gray-700">DISPLAY CONTENT</label>
        <div className="max-h-40 min-h-20 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
          {text ? (
            <div className="break-words whitespace-pre-wrap text-gray-900">{text}</div>
          ) : (
            <div className="text-gray-400 italic">{placeholder}</div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end text-xs text-gray-500">
        {text && onClear && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};
