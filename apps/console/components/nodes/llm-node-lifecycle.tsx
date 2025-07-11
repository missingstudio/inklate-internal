"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@inklate/ui/select";
import { withLifecycle, lifecycleConfigs } from "./with-lifecycle";
import { BaseNodeData, LifecycleNodeProps } from "~/types/node";
import { type WrappedNodeProps, Node } from "./wrap-node";
import { useCanvasStore } from "~/store/canvas-store";
import { useTRPCClient } from "@inklate/common/trpc";
import React, { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@inklate/ui/textarea";
import { Button } from "@inklate/ui/button";
import { useChat } from "@ai-sdk/react";

interface LLMNodeData extends BaseNodeData {
  text: string;
  model?: string;
  updatedAt?: string;
  response?: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
}

// Enhanced LLM node with lifecycle management
export const LLMNodeBase = ({
  id,
  data,
  updateData,
  dragging,
  selected,
  deleteNode,
  lifecycle
}: WrappedNodeProps<LLMNodeData> & LifecycleNodeProps<LLMNodeData>) => {
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
        // Use lifecycle error handler
        lifecycle.handleError(new Error(error.message), "chat");
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

  // Handle LLM execution using lifecycle async operation tracking
  const handleLLM = useCallback(async () => {
    if (!data.text?.trim()) return;

    try {
      await lifecycle.trackAsyncOperation("llm-execution", async () => {
        updateData({ loading: true, error: null });

        // Use the append method from useChat to send the message
        await append({
          role: "user",
          content: data.text
        });
      });
    } catch (error) {
      lifecycle.handleError(
        error instanceof Error ? error : new Error("LLM execution failed"),
        "llm-execution"
      );
    }
  }, [data.text, append, updateData, lifecycle]);

  // Show lifecycle status in the UI
  const renderLifecycleStatus = () => {
    const { state } = lifecycle;

    if (!state.isInitialized) {
      return <div className="text-xs text-yellow-600">Initializing...</div>;
    }

    if (state.activeOperations.size > 0) {
      return (
        <div className="text-xs text-blue-600">
          Running: {Array.from(state.activeOperations).join(", ")}
        </div>
      );
    }

    if (lifecycle.hasErrors) {
      return <div className="text-xs text-red-600">Errors: {state.errors.join(", ")}</div>;
    }

    if (lifecycle.isHealthy) {
      return <div className="text-xs text-green-600">Ready</div>;
    }

    return null;
  };

  return (
    <Node className={dragging ? "opacity-70" : ""}>
      <Node.Header
        title="Anthropic (Enhanced)"
        subtitle="Run a prompt through an LLM with lifecycle management"
        loading={data.loading || isLoading || lifecycle.isLoading}
        error={data.error || error?.message}
        onClearError={handleClearError}
        icon={
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100">
            <span className="text-xs font-semibold text-orange-600">AI</span>
          </div>
        }
      />

      <Node.Content>
        <div className="mb-2">{renderLifecycleStatus()}</div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-700">PROMPT</label>
          <Textarea
            className="field-sizing-content max-h-60 min-h-20 resize-none"
            rows={4}
            placeholder="Enter your prompt for the LLM..."
            value={data.text || ""}
            onChange={onPromptChange}
            disabled={isLoading || data.loading || lifecycle.isLoading}
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

        {/* Performance metrics display */}
        {data._lifecycle?.performanceMetrics && (
          <div className="mt-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Operations: {data._lifecycle.performanceMetrics.operationCount}</span>
              <span>
                Avg time: {data._lifecycle.performanceMetrics.averageOperationTime.toFixed(1)}ms
              </span>
            </div>
          </div>
        )}
      </Node.Content>

      <Node.Footer
        updatedAt={data.updatedAt}
        usage={data.usage}
        actions={
          <Button
            size="sm"
            variant="secondary"
            onClick={handleLLM}
            disabled={isLoading || data.loading || lifecycle.isLoading || !data.text?.trim()}
            className="h-6 px-2 text-xs"
          >
            {isLoading || data.loading || lifecycle.isLoading ? "Running..." : "Run LLM"}
          </Button>
        }
      />
    </Node>
  );
};

// Create the lifecycle-enhanced LLM node
export const LLMNodeLifecycle = withLifecycle(LLMNodeBase, {
  displayName: "LLMNodeLifecycle",
  ...lifecycleConfigs.development,

  // Custom lifecycle hooks
  onMount: async (data) => {
    console.log("LLM Node mounted with data:", data);
  },

  onUnmount: async (data) => {
    console.log("LLM Node unmounting, cleaning up resources");
  },

  onDataChange: async (newData, prevData) => {
    if (newData.text !== prevData.text) {
      console.log("Prompt changed from:", prevData.text, "to:", newData.text);
    }
  },

  onError: (error, data) => {
    console.error("LLM Node error:", error, "with data:", data);
  },

  onValidate: (data) => {
    const errors: string[] = [];

    if (!data.text?.trim()) {
      errors.push("Prompt is required");
    }

    if (data.text && data.text.length > 10000) {
      errors.push("Prompt is too long (max 10000 characters)");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  onAsyncOperation: (operation, data) => {
    console.log(`Starting async operation: ${operation} with data:`, data);
  }
});

LLMNodeLifecycle.displayName = "LLMNodeLifecycle";
