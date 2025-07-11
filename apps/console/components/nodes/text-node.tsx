import { type WrappedNodeProps, Node } from "./wrap-node";
import { Textarea } from "@inklate/ui/textarea";
import { Button } from "@inklate/ui/button";
import { BaseNodeData } from "~/types/node";
import React, { useCallback } from "react";

interface TextNodeData extends BaseNodeData {
  text: string;
  wordCount?: number;
  characterCount?: number;
}

export function createTextNodeData(): TextNodeData {
  return {
    version: 1,
    color: "#ffffff",
    name: "Text Node",
    description: "A simple text input node.",
    type: "text",
    handles: {
      input: {},
      output: {
        text: {
          id: "text",
          description: "Text output",
          format: "text",
          label: "Text",
          order: 0,
          required: false
        }
      }
    },
    loading: false,
    error: null,
    lastUpdated: Date.now(),
    metadata: {},
    text: ""
  };
}

export const TextNode = ({
  id,
  data,
  updateData,
  selected,
  dragging
}: WrappedNodeProps<TextNodeData>) => {
  const onTextChange = useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = evt.target.value;
      updateData({
        text: newText,
        wordCount: newText
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0).length,
        characterCount: newText.length
      });
    },
    [updateData]
  );

  const clearText = useCallback(() => {
    updateData({ text: "", wordCount: 0, characterCount: 0 });
  }, [updateData]);

  return (
    <Node className={dragging ? "opacity-70" : ""}>
      <Node.Header
        title="Text Node"
        subtitle="Simple text input and output"
        loading={data.loading}
        error={data.error}
        onClearError={() => updateData({ error: null })}
        icon={
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
            <span className="text-xs font-semibold text-blue-600">T</span>
          </div>
        }
      />

      <Node.Content>
        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-700">TEXT CONTENT</label>
          <Textarea
            className="field-sizing-content max-h-40 min-h-20 resize-none"
            rows={3}
            placeholder="Enter your text here..."
            value={data.text || ""}
            onChange={onTextChange}
            disabled={data.loading}
          />
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

TextNode.displayName = "TextNode";
