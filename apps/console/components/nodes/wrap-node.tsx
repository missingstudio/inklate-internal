import { type NodeProps } from "@xyflow/react";
import { useSyncExternalStore } from "react";
import React from "react";
// TODO: Update the import path for useFlowContext to the correct location in your project
// import { useFlowContext } from "../canvas/flow-context";

// Define types if not already present
export type NodeId = string;
export type BaseNodeData = Record<string, any>;

type NodeWrapperProps = {
  id: NodeId;
  renderNode: (props: any) => React.JSX.Element;
} & Record<string, any>;

// TODO: Uncomment and update the import path for useFlowContext when available
/*
export function useNodeDataNullable<T extends BaseNodeData>(id: NodeId): T | undefined {
  const { graph } = useFlowContext();
  return useSyncExternalStore(
    (f) => graph.store.addNodeListener(id, f),
    () => graph.store.getNodeDataNullable<T>(id),
  );
}
*/

// Provide node data to node components + prevent rendering node when deleted
function NodeWrapper({ id, renderNode, ...otherProps }: NodeWrapperProps) {
  // const data = useNodeDataNullable(id); // Use this when useNodeDataNullable is available
  // For now, fallback to always rendering (or return null)
  // Remove the next line when useNodeDataNullable is implemented
  const data = {}; // placeholder
  if (!data) return null;
  return renderNode({ id, data, ...otherProps });
}

export function wrapNode(renderNode: (props: any) => React.JSX.Element) {
  // eslint-disable-next-line react/display-name
  return (props: NodeProps) => {
    const { id, ...rest } = props;
    return <NodeWrapper id={id} renderNode={renderNode} {...rest} />;
  };
}
