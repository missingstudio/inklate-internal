import React, {
  memo,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  createContext,
  useContext
} from "react";
import { type NodeProps, Handle, Position } from "@xyflow/react";
import { useCanvasStore } from "~/store/canvas-store";
import { Button } from "@inklate/ui/button";
import { BaseNodeData } from "~/types/node";
import { cn } from "@inklate/ui/lib/utils";

export type NodeId = string;

interface NodeContextType<T extends BaseNodeData = BaseNodeData> {
  id: NodeId;
  data: T;
  selected: boolean;
  dragging: boolean;
  updateData: (updates: Partial<T>) => void;
  deleteNode: () => void;
}

const NodeContext = createContext<NodeContextType<any> | null>(null);
const useNodeContext = <T extends BaseNodeData = BaseNodeData>(): NodeContextType<T> => {
  const context = useContext(NodeContext);
  if (!context) {
    throw new Error("Node compound components must be used within a Node component");
  }
  return context as NodeContextType<T>;
};

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

export interface NodeHeaderProps {
  title?: string;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
  onClearError?: () => void;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export interface NodeFooterProps {
  updatedAt?: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
  customInfo?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export interface NodeContentProps {
  className?: string;
  children: React.ReactNode;
}

interface NodeComponentProps {
  className?: string;
  children: React.ReactNode;
}

const NodeComponent = ({ className, children }: NodeComponentProps) => {
  const { data, selected, dragging } = useNodeContext();

  const childrenArray = React.Children.toArray(children);
  const headerChild = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === NodeHeader
  );
  const footerChild = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === NodeFooter
  );
  const contentChildren = childrenArray.filter(
    (child) => React.isValidElement(child) && child.type !== NodeHeader && child.type !== NodeFooter
  );
  const contentChild = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === NodeContent
  );

  const content =
    contentChild ||
    (contentChildren.length > 0 ? <NodeContent>{contentChildren}</NodeContent> : null);

  if (data.error) {
    return (
      <div
        className={cn(
          "w-80 max-w-sm rounded-xl border border-red-300 bg-red-50 p-4 shadow-sm",
          className
        )}
      >
        {headerChild || (
          <NodeHeader
            title={data.name || "Node"}
            subtitle="Error occurred"
            error={data.error}
            onClearError={() => {}} // Will be handled by context
          />
        )}
        <div className="py-4 text-center">
          <p className="mb-3 text-sm text-red-600">{data.error}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {}} // Will be handled by context
            className="border-red-300 text-red-600 hover:bg-red-100"
          >
            Clear Error & Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-80 max-w-sm rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200",
        selected && "border-t-2 border-t-blue-500",
        dragging && "opacity-80",
        className
      )}
    >
      <div className="p-4">
        {headerChild}
        {content}
        {footerChild}
      </div>
    </div>
  );
};

const NodeHeader = ({
  title,
  subtitle,
  loading,
  error,
  onClearError,
  icon,
  className,
  children
}: NodeHeaderProps) => {
  const { data, updateData } = useNodeContext();

  const finalTitle = title || data.name || "Node";
  const finalSubtitle = subtitle || data.description;
  const finalLoading = loading !== undefined ? loading : data.loading;
  const finalError = error !== undefined ? error : data.error;
  const finalOnClearError = onClearError || (() => updateData({ error: null }));

  if (children) {
    return <div className={cn("mb-3 border-b border-gray-100 pb-3", className)}>{children}</div>;
  }

  return (
    <div
      className={cn(
        "mb-3 flex items-center justify-between border-b border-gray-100 pb-3",
        className
      )}
    >
      <div className="flex items-center space-x-2">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold text-gray-800">{finalTitle}</h2>
          {finalSubtitle && <p className="truncate text-xs text-gray-500">{finalSubtitle}</p>}
        </div>
        {finalLoading && (
          <div className="h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        )}
      </div>
      {finalError && (
        <div className="flex flex-shrink-0 items-center space-x-2">
          <span className="rounded bg-red-50 px-2 py-1 text-xs text-red-600">Error</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={finalOnClearError}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
          >
            ×
          </Button>
        </div>
      )}
    </div>
  );
};

const NodeFooter = ({
  updatedAt,
  usage,
  customInfo,
  actions,
  className,
  children
}: NodeFooterProps) => {
  const { data } = useNodeContext();
  const finalUpdatedAt =
    updatedAt || (data.lastUpdated ? new Date(data.lastUpdated).toISOString() : undefined);

  if (children) {
    return <div className={cn("mt-4 border-t border-gray-100 pt-3", className)}>{children}</div>;
  }

  return (
    <div className={cn("mt-4 border-t border-gray-100 pt-3", className)}>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex min-w-0 flex-1 items-center space-x-3">
          {finalUpdatedAt && (
            <span className="truncate">
              Updated: {new Date(finalUpdatedAt).toLocaleTimeString()}
            </span>
          )}
          {customInfo && <div className="truncate">{customInfo}</div>}
        </div>
        {actions && <div className="ml-2 flex-shrink-0">{actions}</div>}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        {usage && usage.totalTokens && (
          <span className="truncate">
            Tokens: {usage.totalTokens} ({usage.inputTokens}↑ {usage.outputTokens}↓)
          </span>
        )}
      </div>
    </div>
  );
};

const NodeContent = ({ className, children }: NodeContentProps) => {
  return <div className={cn("space-y-4", className)}>{children}</div>;
};

class NodeErrorBoundary extends React.Component<
  { children: React.ReactNode; nodeId: string; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in node ${this.props.nodeId}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback = ({ error }: { error: Error }) => (
  <div className="flex min-h-[60px] min-w-[200px] items-center justify-center rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
    <div className="text-center">
      <p className="font-medium">Node Error</p>
      <p className="text-xs opacity-80">{error.message}</p>
    </div>
  </div>
);

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

  const contextValue = useMemo(
    (): NodeContextType<T> => ({
      id,
      data: enhancedData!,
      selected: nodeProps.selected || false,
      dragging: nodeProps.dragging || false,
      updateData,
      deleteNode
    }),
    [id, enhancedData, nodeProps.selected, nodeProps.dragging, updateData, deleteNode]
  );

  if (!enhancedData) return null;

  const NodeComponent = renderNode;
  const nodeElement = (
    <NodeContext.Provider value={contextValue}>
      <div
        style={{
          minWidth,
          minHeight,
          ...style
        }}
      >
        <NodeComponent
          id={id}
          data={enhancedData}
          selected={nodeProps.selected || false}
          dragging={nodeProps.dragging || false}
          updateData={updateData}
          deleteNode={deleteNode}
        />

        {enhancedData.handles && (
          <>
            {/* Enhanced handle system with proper positioning and styling */}
            {enhancedData.handles.input?.handles &&
              Object.entries(enhancedData.handles.input.handles).map(([handleId, handle]) => (
                <Handle
                  key={`input-${handleId}`}
                  type="target"
                  position={Position.Left}
                  id={handleId}
                  style={{
                    top: `${handle.order * 30 + 20}px`,
                    backgroundColor: handle.style?.backgroundColor || "#dbeafe",
                    borderColor: handle.style?.borderColor || "#3b82f6",
                    width:
                      handle.style?.size === "large"
                        ? "16px"
                        : handle.style?.size === "small"
                          ? "8px"
                          : "12px",
                    height:
                      handle.style?.size === "large"
                        ? "16px"
                        : handle.style?.size === "small"
                          ? "8px"
                          : "12px",
                    borderRadius:
                      handle.style?.shape === "square"
                        ? "2px"
                        : handle.style?.shape === "diamond"
                          ? "2px"
                          : "50%",
                    transform: handle.style?.shape === "diamond" ? "rotate(45deg)" : undefined
                  }}
                />
              ))}

            {enhancedData.handles.output?.handles &&
              Object.entries(enhancedData.handles.output.handles).map(([handleId, handle]) => (
                <Handle
                  key={`output-${handleId}`}
                  type="source"
                  position={Position.Right}
                  id={handleId}
                  style={{
                    top: `${handle.order * 30 + 20}px`,
                    backgroundColor: handle.style?.backgroundColor || "#d1fae5",
                    borderColor: handle.style?.borderColor || "#10b981",
                    width:
                      handle.style?.size === "large"
                        ? "16px"
                        : handle.style?.size === "small"
                          ? "8px"
                          : "12px",
                    height:
                      handle.style?.size === "large"
                        ? "16px"
                        : handle.style?.size === "small"
                          ? "8px"
                          : "12px",
                    borderRadius:
                      handle.style?.shape === "square"
                        ? "2px"
                        : handle.style?.shape === "diamond"
                          ? "2px"
                          : "50%",
                    transform: handle.style?.shape === "diamond" ? "rotate(45deg)" : undefined
                  }}
                />
              ))}
          </>
        )}
      </div>
    </NodeContext.Provider>
  );

  if (enableErrorBoundary) {
    return <NodeErrorBoundary nodeId={id}>{nodeElement}</NodeErrorBoundary>;
  }

  return nodeElement;
}

const Node = Object.assign(NodeComponent, {
  Header: NodeHeader,
  Footer: NodeFooter,
  Content: NodeContent
});

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

// Utility function to create a node with default data
export function createNodeWithDefaults<T extends BaseNodeData>(
  id: string,
  type: string,
  position: { x: number; y: number },
  data: T
): { id: string; type: string; position: { x: number; y: number }; data: T } {
  return {
    id,
    type,
    position,
    data
  };
}

export function useNodeData<T extends BaseNodeData = BaseNodeData>(nodeId: string) {
  const data = useCanvasStore((state) => state.getNodeData<T>(nodeId));
  const setNodeData = useCanvasStore((state) => state.setNodeData);

  const updateData = useCallback(
    (updates: Partial<T>) => {
      setNodeData(nodeId, { ...updates, lastUpdated: Date.now() });
    },
    [nodeId, setNodeData]
  );

  return { data, updateData };
}

export function debugNode(nodeId: string) {
  if (process.env.NODE_ENV === "development") {
    const store = useCanvasStore.getState();
    console.group(`🔍 Node Debug: ${nodeId}`);
    console.log("Node data:", store.getNodeData(nodeId));
    console.log("Full node:", store.getNode(nodeId));
    console.groupEnd();
  }
}

export { Node, useNodeContext };
export type { NodeContextType, NodeComponentProps };
