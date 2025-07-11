import { useCanvasStore } from "~/store/canvas-store";
import { BaseNodeData } from "~/types/node";
import { useCallback } from "react";

export function useNodeData<T extends BaseNodeData>(nodeId: string) {
  const nodes = useCanvasStore((state) => state.nodes);
  const updateNode = useCanvasStore((state) => state.updateNode);
  const removeNode = useCanvasStore((state) => state.removeNode);

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
