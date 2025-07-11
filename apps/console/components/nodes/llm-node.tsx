"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@inklate/ui/select";
import { NodeContainer } from "~/components/nodes/base/node-container";
import { NodeErrorBoundary } from "~/providers/node-error-boundary";
import { NodeContent } from "~/components/nodes/base/node-content";
import { NodeHeader } from "~/components/nodes/base/node-header";
import { NodeFooter } from "~/components/nodes/base/node-footer";
import { useLLMExecution } from "~/hooks/use-llm-execution";
import { NodeProvider } from "~/providers/node-provider";
import { useTRPCClient } from "@inklate/common/trpc";
import React, { useCallback, useState } from "react";
import { useNodeData } from "~/hooks/use-node-data";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@inklate/ui/textarea";
import { type NodeProps } from "@xyflow/react";
import { Button } from "@inklate/ui/button";
import { BaseNodeData } from "~/types/node";

export interface LLMFormProps {
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

export const LLMForm = ({
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
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-xs font-semibold text-gray-700">PROMPT</label>
        <Textarea
          className="field-sizing-content max-h-60 min-h-20 resize-none"
          rows={4}
          placeholder="Enter your prompt for the LLM..."
          value={prompt}
          onChange={onPromptChange}
          disabled={disabled}
        />
      </div>

      {response && (
        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-700">RESPONSE</label>
          <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">{response}</div>
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
        </div>
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

const LLMNodeComponent = ({ id, selected, dragging }: NodeProps) => {
  const { data, updateData, deleteNode, clearError } = useNodeData<LLMNodeData>(id);
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

  return (
    <NodeProvider
      id={id}
      data={data}
      selected={selected}
      dragging={dragging}
      updateData={updateData}
      deleteNode={deleteNode}
    >
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

        <NodeFooter updatedAt={data.updatedAt} usage={data.usage} />
      </NodeContainer>
    </NodeProvider>
  );
};

export const LLMNode = (props: NodeProps) => (
  <NodeErrorBoundary nodeId={props.id}>
    <LLMNodeComponent {...props} />
  </NodeErrorBoundary>
);

LLMNode.displayName = "LLMNode";
