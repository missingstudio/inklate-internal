import { type WrappedNodeProps, Node } from "./wrap-node";
import { Button } from "@inklate/ui/button";
import { BaseNodeData } from "~/types/node";
import React, { useCallback } from "react";

interface DisplayNodeData extends BaseNodeData {
  text: string;
  wordCount?: number;
  characterCount?: number;
}

export const DisplayNode = ({
  id,
  data,
  updateData,
  selected,
  dragging
}: WrappedNodeProps<DisplayNodeData>) => {
  const clearText = useCallback(() => {
    updateData({ text: "", wordCount: 0, characterCount: 0 });
  }, [updateData]);

  // Calculate word and character counts when text changes
  React.useEffect(() => {
    if (data.text) {
      const wordCount = data.text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      const characterCount = data.text.length;

      if (data.wordCount !== wordCount || data.characterCount !== characterCount) {
        updateData({
          wordCount,
          characterCount,
          lastUpdated: Date.now()
        });
      }
    }
  }, [data.text, data.wordCount, data.characterCount, updateData]);

  return (
    <Node className={dragging ? "opacity-70" : ""}>
      <Node.Header
        title="Display Node"
        subtitle="Displays text from connected nodes"
        loading={data.loading}
        error={data.error}
        onClearError={() => updateData({ error: null })}
        icon={
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <span className="text-xs font-semibold text-green-600">D</span>
          </div>
        }
      />

      <Node.Content>
        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-700">DISPLAY CONTENT</label>
          <div className="max-h-40 min-h-20 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
            {data.text ? (
              <div className="break-words whitespace-pre-wrap text-gray-900">{data.text}</div>
            ) : (
              <div className="text-gray-400 italic">
                No text received. Connect a text output from another node.
              </div>
            )}
          </div>
        </div>
      </Node.Content>

      <Node.Footer
        updatedAt={data.lastUpdated ? new Date(data.lastUpdated).toISOString() : undefined}
        customInfo={
          <div className="flex items-center space-x-3">
            {data.wordCount !== undefined && <span>Words: {data.wordCount}</span>}
            {data.characterCount !== undefined && <span>Chars: {data.characterCount}</span>}
          </div>
        }
        actions={
          data.text ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={clearText}
              className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </Button>
          ) : undefined
        }
      />
    </Node>
  );
};

DisplayNode.displayName = "DisplayNode";

// Export both the old TextNode name for backward compatibility and new DisplayNode name
export const TextNode = DisplayNode;
