import React, { createContext, useContext } from "react";
import { BaseNodeData } from "~/types/node";

export type NodeId = string;

export interface NodeContextType<T extends BaseNodeData = BaseNodeData> {
  id: NodeId;
  data: T;
  selected: boolean;
  dragging: boolean;
  updateData: (updates: Partial<T>) => void;
  deleteNode: () => void;
}

const NodeContext = createContext<NodeContextType<any> | null>(null);

export const useNodeContext = <T extends BaseNodeData = BaseNodeData>(): NodeContextType<T> => {
  const context = useContext(NodeContext);
  if (!context) {
    throw new Error("Node compound components must be used within a NodeProvider");
  }
  return context as NodeContextType<T>;
};

export interface NodeProviderProps<T extends BaseNodeData = BaseNodeData> {
  id: NodeId;
  data: T;
  selected: boolean;
  dragging: boolean;
  updateData: (updates: Partial<T>) => void;
  deleteNode: () => void;
  children: React.ReactNode;
}

export const NodeProvider = <T extends BaseNodeData = BaseNodeData>({
  children,
  ...contextValue
}: NodeProviderProps<T>) => {
  return <NodeContext.Provider value={contextValue}>{children}</NodeContext.Provider>;
};
