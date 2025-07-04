"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@inklate/ui/select";
import { NodeProps, useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Editor, EditorEvents, JSONContent } from "@tiptap/core";
import type { NodeId, BaseNodeData } from "./wrap-node";
import { Textarea } from "@inklate/ui/textarea";
import { Button } from "@inklate/ui/button";

type TextNodeData = BaseNodeData & {
  text: string;
  content?: JSONContent;
  model?: string;
  updatedAt?: string;
  response?: {
    text: string;
  };
};
type TextNodeProps = NodeProps & { data: TextNodeData };
export const TextNode = ({ id, data, ...props }: TextNodeProps) => {
  const { updateNodeData } = useReactFlow();
  const editor = useRef<Editor | null>(null);
  const [model, setModel] = useState("claude-opus-4");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const onPromptChange = useCallback((evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { text: evt.target.value });
  }, []);

  const onModelChange = useCallback((value: string) => {
    setModel(value);
  }, []);

  // Placeholder for LLM call
  const handleLLM = async () => {
    setLoading(true);
    setResult(null);

    // TODO: Replace with actual LLM API call
    setTimeout(() => {
      setLoading(false);
      updateNodeData(id, { text: "Done" });
    }, 1200);
  };

  return (
    <div className="w-80 max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center space-x-2">
        <h2 className="font-semibold text-gray-800">Anthropic</h2>
      </div>

      {/* Description */}
      <p className="mb-4 text-sm text-gray-600">Run a prompt through an LLM.</p>

      {/* Prompt box */}
      <div className="mb-4">
        <span className="mb-1 block text-xs font-semibold text-gray-700">PROMPT</span>
        <Textarea
          className="field-sizing-content max-h-60 min-h-20 resize-none py-1.75"
          rows={4}
          placeholder="Enter your prompt for the LLM..."
          value={data.text}
          onChange={onPromptChange}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
        <span className="flex items-center space-x-1">
          <div className="*:not-first:mt-2">
            <Select defaultValue="claude-opus-4">
              <SelectTrigger id={id} className="m-0 h-7.5">
                <SelectValue placeholder="Select framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="claude-opus-4">claude-opus-4</SelectItem>
                <SelectItem value="gpt-4">gpt-4</SelectItem>
                <SelectItem value="llama-3">llama-3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </span>
        <Button size="sm" variant="secondary" onClick={handleLLM} disabled={loading || !prompt}>
          {loading ? "Running..." : "Run LLM"}
        </Button>
      </div>
    </div>
  );
};

TextNode.displayName = "TextNode";
