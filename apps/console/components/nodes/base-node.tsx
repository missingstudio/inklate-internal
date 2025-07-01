"use client";
import { Handle, NodeProps, Position, useUpdateNodeInternals } from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";
import type { NodeId, BaseNodeData } from "./wrap-node";

// BaseNode: a visually appealing prompt input node for ReactFlow
export const BaseNode = ({ id, data, ...props }: { id: NodeId; data: BaseNodeData }) => {
  const updateNodeInternals = useUpdateNodeInternals();

  const [value, setValue] = useState("");
  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setValue(evt.target.value);
    // Optionally, update node data here
  }, []);

  useEffect(() => {
    // Recalculate node size after render or input change
    updateNodeInternals(id);
  }, [id, value, updateNodeInternals]);

  const { inputs, outputs, selected, children } = props as any;
  return (
    <div className="mx-auto max-w-[500px]">
      <div className="font-jetbrains-mono relative mt-2 flex w-72 flex-col rounded-lg border border-slate-200 bg-white shadow-sm dark:bg-black">
        <div className="p-4">
          <h5 className="mb-2 text-sm font-normal text-slate-800 dark:text-white">Base Node</h5>
          <p className="text-xs leading-normal font-light text-slate-600 dark:text-white">
            Surround yourself with angels. Life is what you make it, so let's make it. To be
            successful you've got to work hard, to make history, simple, you've got to make it.
          </p>
        </div>
      </div>
    </div>
  );
};

BaseNode.displayName = "BaseNode";

// wrapNode: HOC to wrap a node component with extra logic or props
export function wrapNode<T extends NodeProps>(
  NodeComponent: React.ComponentType<T>,
  extraProps?: Partial<T>
) {
  return function WrappedNode(props: T) {
    return <NodeComponent {...props} {...(extraProps as T)} />;
  };
}
