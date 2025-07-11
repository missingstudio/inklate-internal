import { NodeProvider, type NodeId } from "~/providers/node-provider";
import { NodeErrorBoundary } from "~/providers/node-error-boundary";
import { type NodeProps, Handle, Position } from "@xyflow/react";
import React, { memo, useCallback, useMemo } from "react";
import { useCanvasStore } from "~/store/canvas-store";
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

export interface NodeWrapperConfig {
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
}

const NodeHandles = ({ data }: NodeHandlesProps) => {
  if (!data.handles) return null;

  const inputHandles = data.handles.input?.handles || {};
  const outputHandles = data.handles.output?.handles || {};

  const getHandleStyle = (handle: any) => {
    const baseSize = handle.style?.size === "large" ? 16 : handle.style?.size === "small" ? 8 : 12;
    const isSquare = handle.style?.shape === "square";
    const isDiamond = handle.style?.shape === "diamond";

    return {
      backgroundColor:
        handle.style?.backgroundColor || (handle.type === "input" ? "#dbeafe" : "#d1fae5"),
      borderColor: handle.style?.borderColor || (handle.type === "input" ? "#3b82f6" : "#10b981"),
      width: `${baseSize}px`,
      height: `${baseSize}px`,
      borderRadius: isSquare ? "2px" : isDiamond ? "2px" : "50%",
      transform: isDiamond ? "rotate(45deg)" : undefined,
      border: "2px solid",
      zIndex: 10
    };
  };

  const getHandlePosition = (handle: any, index: number) => {
    const baseOffset = 20;
    const spacing = 30;
    return `${baseOffset + (handle.order || index) * spacing}px`;
  };

  return (
    <>
      {/* Input Handles */}
      {Object.entries(inputHandles).map(([handleId, handle], index) => (
        <Handle
          key={`input-${handleId}`}
          type="target"
          position={Position.Left}
          id={handleId}
          style={{
            top: getHandlePosition(handle, index),
            ...getHandleStyle({ ...handle, type: "input" })
          }}
          className="transition-all duration-200 hover:scale-110"
        />
      ))}

      {/* Output Handles */}
      {Object.entries(outputHandles).map(([handleId, handle], index) => (
        <Handle
          key={`output-${handleId}`}
          type="source"
          position={Position.Right}
          id={handleId}
          style={{
            top: getHandlePosition(handle, index),
            ...getHandleStyle({ ...handle, type: "output" })
          }}
          className="transition-all duration-200 hover:scale-110"
        />
      ))}
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
      <div className={cn("relative", className)} style={{ minWidth, minHeight, ...style }}>
        <NodeComponent
          id={id}
          data={enhancedData}
          selected={nodeProps.selected || false}
          dragging={nodeProps.dragging || false}
          updateData={updateData}
          deleteNode={deleteNode}
        />

        <NodeHandles data={enhancedData} />
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
