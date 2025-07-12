"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@inklate/ui/select";
import { NodeContainer } from "~/components/nodes/base/node-container";
import { NodeContent } from "~/components/nodes/base/node-content";
import { NodeHeader } from "~/components/nodes/base/node-header";
import { NodeFooter } from "~/components/nodes/base/node-footer";
import { WrappedNodeProps } from "~/components/nodes/wrap-node";
import { useLLMExecution } from "~/hooks/use-llm-execution";
import { useTRPCClient } from "@inklate/common/trpc";
import React, { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@inklate/ui/textarea";
import { Button } from "@inklate/ui/button";
import { BaseNodeData } from "~/types/node";

interface LLMFormProps {
  prompt: string;
  onPromptChange: (evt: React.ChangeEvent<HTMLTextAreaElement>) => void;
  model: string;
  onModelChange: (value: string) => void;
  models?: Array<{ id: string; label: string; disabled?: boolean }>;
  response?: string;
  onExecute: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const LLMForm = ({
  prompt,
  onPromptChange,
  model,
  onModelChange,
  models = [],
  response,
  onExecute,
  isLoading,
  disabled
}: LLMFormProps) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-gray-700">PROMPT</label>
      <div className="relative">
        <Textarea
          className="field-sizing-content max-h-60 min-h-32 resize-none pb-10" // Add padding to make room
          rows={4}
          placeholder="Enter your prompt for the LLM..."
          value={prompt}
          onChange={onPromptChange}
          disabled={disabled}
        />

        <div className="absolute right-0 bottom-0 left-0 flex items-center justify-between space-x-2 rounded px-2 py-2 shadow">
          <Select value={model} onValueChange={onModelChange}>
            <SelectTrigger className="h-7 w-28 text-xs">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((modelOption) => (
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
          <Button
            size="sm"
            variant="secondary"
            onClick={onExecute}
            disabled={isLoading || !prompt?.trim()}
            className="h-6 px-2 text-xs"
          >
            {isLoading ? "Running..." : "Run LLM"}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface LLMNodeData extends BaseNodeData {
  text: string;
  model?: string;
  response?: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
}

export const LLMNode = ({
  id,
  data,
  selected,
  dragging,
  updateData
}: WrappedNodeProps<LLMNodeData>) => {
  const [model, setModel] = useState(data.model || "gpt-4o");

  // API data
  const trpcClient = useTRPCClient();
  const { data: modelsData } = useQuery({
    queryKey: ["models", "getModelList"],
    queryFn: () => trpcClient.models.getModelList.query()
  });

  // LLM execution logic
  const { input, setInput, handleInputChange, executeLLM, isLoading, error, latestResponse } =
    useLLMExecution(id, data, updateData);

  // Event handlers
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

  const handleError = data.error || error?.message;
  const clearError = () => updateData({ error: null });

  return (
    <NodeContainer
      className={dragging ? "opacity-70" : ""}
      selected={selected}
      dragging={dragging}
      error={handleError}
      onClearError={clearError}
    >
      <NodeHeader
        title="Anthropic"
        subtitle="Run a prompt through an LLM"
        loading={data.loading || isLoading}
        error={handleError}
        onClearError={clearError}
        icon={
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100">
            <span className="text-xs font-semibold text-orange-600">AI</span>
          </div>
        }
      />

      <NodeContent>
        <LLMForm
          prompt={data.text || ""}
          onPromptChange={onPromptChange}
          model={model}
          onModelChange={onModelChange}
          models={modelsData?.models}
          response={latestResponse}
          onExecute={executeLLM}
          isLoading={isLoading || data.loading}
          disabled={isLoading || data.loading}
        />
      </NodeContent>

      <NodeFooter
        updatedAt={data.lastUpdated ? new Date(data.lastUpdated).toISOString() : undefined}
        usage={data.usage}
      />
    </NodeContainer>
  );
};

LLMNode.displayName = "LLMNode";
