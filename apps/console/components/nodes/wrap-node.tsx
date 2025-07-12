import { HandleGroup, useHandleManager } from "~/components/handles/node-handle";
import { NodeProvider, type NodeId } from "~/providers/node-provider";
import { NodeErrorBoundary } from "~/providers/node-error-boundary";
import React, { memo, useCallback, useMemo, useRef } from "react";
import { useCanvasStore } from "~/store/canvas-store";
import { type NodeProps } from "@xyflow/react";
import { BaseNodeData } from "~/types/node";
import { cn } from "@inklate/ui/lib/utils";

export interface WrappedNodeProps<T extends BaseNodeData = BaseNodeData> {
  id: NodeId;
  data: T;
  selected: boolean;
  dragging: boolean;
  updateData: (updates: Partial<T>) => void;
  deleteNode: () => void;
  children?: React.ReactNode;
}

interface NodeWrapperConfig {
  enableErrorBoundary?: boolean;
  enableLoadingState?: boolean;
  enableSelection?: boolean;
  enableDragging?: boolean;
  className?: string;
  style?: React.CSSProperties;
  minWidth?: number;
  minHeight?: number;
}

interface NodeHandlesProps {
  data: BaseNodeData;
  nodeId: string;
}

const NodeHandles = ({ data, nodeId }: NodeHandlesProps) => {
  if (!data.handles) return null;

  const { handleConnect, handleDisconnect, handleHover, handleLeave } = useHandleManager(nodeId);

  const inputHandles = data.handles.input?.handles || {};
  const outputHandles = data.handles.output?.handles || {};

  // Convert handle objects to arrays for HandleGroup
  const inputHandleArray = Object.entries(inputHandles).map(([handleId, handle]) => ({
    ...handle,
    id: handleId
  }));

  const outputHandleArray = Object.entries(outputHandles).map(([handleId, handle]) => ({
    ...handle,
    id: handleId
  }));

  return (
    <>
      {inputHandleArray.length > 0 && (
        <HandleGroup
          handles={inputHandleArray}
          isInput={true}
          nodeId={nodeId}
          layout={data.handles.input?.layout}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onHover={handleHover}
          onLeave={handleLeave}
        />
      )}

      {outputHandleArray.length > 0 && (
        <HandleGroup
          handles={outputHandleArray}
          isInput={false}
          nodeId={nodeId}
          layout={data.handles.output?.layout}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onHover={handleHover}
          onLeave={handleLeave}
        />
      )}
    </>
  );
};

function NodeWrapper<T extends BaseNodeData = BaseNodeData>({
  id,
  renderNode,
  config = {},
  ...nodeProps
}: {
  id: NodeId;
  renderNode: React.ComponentType<WrappedNodeProps<T>>;
  config?: NodeWrapperConfig;
} & NodeProps) {
  const {
    enableErrorBoundary = true,
    enableLoadingState = true,
    enableSelection = true,
    enableDragging = true,
    className,
    style,
    minWidth = 200,
    minHeight = 60
  } = config;

  const nodeRef = useRef<HTMLDivElement>(null);
  const nodeData = useCanvasStore((state) => state.getNodeData<T>(id));
  const setNodeData = useCanvasStore((state) => state.setNodeData);
  const removeNode = useCanvasStore((state) => state.removeNode);

  const updateData = useCallback(
    (updates: Partial<T>) => {
      setNodeData(id, { ...updates, lastUpdated: Date.now() });
    },
    [id, setNodeData]
  );

  const deleteNode = useCallback(() => {
    removeNode(id);
  }, [id, removeNode]);

  const enhancedData = useMemo(() => {
    if (!nodeData) return null;

    return {
      ...nodeData,
      selected: enableSelection ? nodeProps.selected : false,
      dragging: enableDragging ? nodeProps.dragging : false
    } as T;
  }, [nodeData, nodeProps.selected, nodeProps.dragging, enableSelection, enableDragging]);

  if (!enhancedData) return null;

  const NodeComponent = renderNode;
  const nodeElement = (
    <NodeProvider
      id={id}
      data={enhancedData}
      selected={nodeProps.selected || false}
      dragging={nodeProps.dragging || false}
      updateData={updateData}
      deleteNode={deleteNode}
    >
      <div
        ref={nodeRef}
        className={cn("relative", className)}
        style={{ minWidth, minHeight, ...style }}
      >
        <NodeComponent
          id={id}
          data={enhancedData}
          selected={nodeProps.selected || false}
          dragging={nodeProps.dragging || false}
          updateData={updateData}
          deleteNode={deleteNode}
        />

        <NodeHandles data={enhancedData} nodeId={id} />
      </div>
    </NodeProvider>
  );

  if (enableErrorBoundary) {
    return <NodeErrorBoundary nodeId={id}>{nodeElement}</NodeErrorBoundary>;
  }

  return nodeElement;
}

const MemoizedNodeWrapper = memo(NodeWrapper) as typeof NodeWrapper;

export function wrapNode<T extends BaseNodeData = BaseNodeData>(
  renderNode: React.ComponentType<WrappedNodeProps<T>>,
  config?: NodeWrapperConfig
) {
  const WrappedComponent = (props: NodeProps) => {
    const { id, ...rest } = props;
    return <MemoizedNodeWrapper id={id} renderNode={renderNode} config={config} {...rest} />;
  };

  WrappedComponent.displayName = `wrapNode(${renderNode.displayName || renderNode.name || "Component"})`;
  return WrappedComponent;
}
