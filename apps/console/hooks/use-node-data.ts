import { useFlowStore } from "~/store/flow-store";
import { BaseNodeData } from "~/types/node";
import { useCallback } from "react";

export function useNodeData<T extends BaseNodeData>(nodeId: string) {
  const nodes = useFlowStore((state) => state.nodes);
  const updateNode = useFlowStore((state) => state.updateNode);
  const removeNode = useFlowStore((state) => state.removeNode);

  const node = nodes.find((n) => n.id === nodeId);
  const data = node?.data as T;

  const updateData = useCallback(
    (updates: Partial<T>) => {
      updateNode(nodeId, { data: { ...data, ...updates } });
    },
    [nodeId, data, updateNode]
  );

  const handleDelete = useCallback(() => {
    removeNode(nodeId);
  }, [nodeId, removeNode]);

  const clearError = useCallback(() => {
    updateData({ error: null } as Partial<T>);
  }, [updateData]);

  return {
    data,
    updateData,
    deleteNode: handleDelete,
    clearError
  };
}
