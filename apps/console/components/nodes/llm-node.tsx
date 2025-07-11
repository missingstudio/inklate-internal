"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@inklate/ui/select";
import React, { useCallback, useState, useEffect } from "react";
import { type WrappedNodeProps, Node } from "./wrap-node";
import { generateId } from "@inklate/common/generate-id";
import { HandleType } from "~/enums/handle-type.enum";
import { useCanvasStore } from "~/store/canvas-store";
import { useTRPCClient } from "@inklate/common/trpc";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@inklate/ui/textarea";
import type { JSONContent } from "@tiptap/core";
import { Button } from "@inklate/ui/button";
import { BaseNodeData } from "~/types/node";
import { useChat } from "@ai-sdk/react";

interface LLMNodeData extends BaseNodeData {
  text: string;
  content?: JSONContent;
  model?: string;
  updatedAt?: string;
  response?: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
}

export function createLLMNodeData(): LLMNodeData {
  return {
    version: 1,
    color: "#ffffff",
    name: "LLM Node",
    description: "Run a prompt through an LLM.",
    type: "llm",
    handles: {
      input: {
        prompt: {
          id: `input-${generateId({ use: "nanoid", kind: "edge" })}`,
          description: "Prompt input",
          format: HandleType.Text,
          label: "Prompt",
          order: 0,
          required: true
        }
      },
      output: {
        response: {
          id: `output-${generateId({ use: "nanoid", kind: "edge" })}`,
          description: "LLM response",
          format: HandleType.Text,
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
    text: "",
    model: "gpt-4o"
  };
}

export const LLMNode = ({
  id,
  data,
  updateData,
  dragging,
  selected,
  deleteNode
}: WrappedNodeProps<LLMNodeData>) => {
  const [model, setModel] = useState(data.model || "gpt-4o");

  // Get canvas store for data transfer
  const edges = useCanvasStore((state) => state.edges);
  const transferData = useCanvasStore((state) => state.transferData);

  const trpcClient = useTRPCClient();
  const { data: modelsData } = useQuery({
    queryKey: ["models", "getModelList"],
    queryFn: () => trpcClient.models.getModelList.query()
  });

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, append, setInput } =
    useChat({
      api: `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/v1/chats`,
      body: {
        model: model,
        temperature: 0.7,
        maxTokens: 1000
      },
      onFinish: (message) => {
        updateData({
          response: message.content,
          usage: {
            inputTokens: Math.floor(data.text.length / 4),
            outputTokens: Math.floor(message.content.length / 4),
            totalTokens: Math.floor((data.text.length + message.content.length) / 4)
          },
          loading: false,
          updatedAt: new Date().toISOString()
        });

        // Transfer data to connected display nodes
        const connectedEdges = edges.filter(
          (edge) => edge.source === id && edge.sourceHandle === "response"
        );

        connectedEdges.forEach((edge) => {
          if (edge.target && edge.targetHandle) {
            transferData(id, edge.target);
          }
        });
      },
      onError: (error) => {
        updateData({
          error: error.message,
          loading: false
        });
      }
    });

  const latestResponse =
    messages.filter((m) => m.role === "assistant").pop()?.content || data.response;
  const onPromptChange = useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = evt.target.value;
      updateData({ text: value });
      setInput(value);
    },
    [updateData, setInput]
  );

  const onModelChange = useCallback(
    (value: string) => {
      setModel(value);
      updateData({ model: value });
    },
    [updateData]
  );

  const handleClearError = useCallback(() => {
    updateData({ error: null });
  }, [updateData]);

  // Sync input with node data on mount
  useEffect(() => {
    if (data.text) {
      setInput(data.text);
    }
  }, [data.text, setInput]);

  // Handle LLM execution using useChat
  const handleLLM = useCallback(async () => {
    if (!data.text?.trim()) return;
    updateData({ loading: true, error: null });

    // Use the append method from useChat to send the message
    await append({
      role: "user",
      content: data.text
    });
  }, [data.text, append, updateData]);

  return (
    <Node className={dragging ? "opacity-70" : ""}>
      <Node.Header
        title="Anthropic"
        subtitle="Run a prompt through an LLM"
        loading={data.loading || isLoading}
        error={data.error || error?.message}
        onClearError={handleClearError}
        icon={
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100">
            <span className="text-xs font-semibold text-orange-600">AI</span>
          </div>
        }
      />

      <Node.Content>
        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-700">PROMPT</label>
          <Textarea
            className="field-sizing-content max-h-60 min-h-20 resize-none"
            rows={4}
            placeholder="Enter your prompt for the LLM..."
            value={data.text || ""}
            onChange={onPromptChange}
            disabled={isLoading || data.loading}
          />
        </div>

        {latestResponse && (
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-700">RESPONSE</label>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
              {latestResponse}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <label className="text-xs font-semibold text-gray-700">MODEL</label>
            <Select value={model} onValueChange={onModelChange}>
              <SelectTrigger className="h-7 w-32">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {modelsData?.models?.map((modelOption) => (
                  <SelectItem
                    key={modelOption.id}
                    value={modelOption.id}
                    disabled={modelOption.disabled}
                  >
                    {modelOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Node.Content>

      <Node.Footer
        updatedAt={data.updatedAt}
        usage={data.usage}
        actions={
          <Button
            size="sm"
            variant="secondary"
            onClick={handleLLM}
            disabled={isLoading || data.loading || !data.text?.trim()}
            className="h-6 px-2 text-xs"
          >
            {isLoading || data.loading ? "Running..." : "Run LLM"}
          </Button>
        }
      />
    </Node>
  );
};

LLMNode.displayName = "LLMNode";
