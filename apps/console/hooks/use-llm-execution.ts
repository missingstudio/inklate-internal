import { useFlowStore } from "~/store/flow-store";
import { useCallback, useEffect } from "react";
import { BaseNodeData } from "~/types/node";
import { useChat } from "@ai-sdk/react";

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

export function useLLMExecution(
  nodeId: string,
  data: LLMNodeData,
  updateData: (updates: Partial<LLMNodeData>) => void
) {
  const edges = useFlowStore((state) => state.edges);
  const transferData = useFlowStore((state) => state.transferData);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, append, setInput } =
    useChat({
      api: `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/v1/chats`,
      body: {
        model: data.model || "gpt-4o",
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
          (edge) => edge.source === nodeId && edge.sourceHandle === "response"
        );

        connectedEdges.forEach((edge) => {
          if (edge.target && edge.targetHandle) {
            transferData(nodeId, edge.target);
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

  // Sync input with node data on mount
  useEffect(() => {
    if (data.text) {
      setInput(data.text);
    }
  }, [data.text, setInput]);

  const executeLLM = useCallback(async () => {
    if (!data.text?.trim()) return;
    updateData({ loading: true, error: null });

    await append({
      role: "user",
      content: data.text
    });
  }, [data.text, append, updateData]);

  return {
    input,
    setInput,
    handleInputChange,
    executeLLM,
    isLoading,
    error,
    latestResponse
  };
}
