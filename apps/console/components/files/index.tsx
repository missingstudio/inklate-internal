import {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  FitViewOptions,
  ReactFlow,
  useReactFlow
} from "@xyflow/react";
import { edgeRegistry, registerEdgeTypes } from "~/utils/edges";
import { nodeRegistry } from "~/utils/nodes/node-registry";
import { registerHandleTypes } from "~/utils/handles";
import { useNavigate, useParams } from "react-router";
import { useTRPCClient } from "@inklate/common/trpc";
import { useFlowStore } from "~/store/flow-store";
import { registerNodeTypes } from "~/utils/nodes";
import { flowConfig } from "~/utils/flow-config";
import React, { useEffect, useRef } from "react";
import { toast } from "@inklate/ui/sonner";
import { shallow } from "zustand/shallow";
import { FlowState } from "~/types/store";
import { color } from "~/utils/colors";
import { useTheme } from "next-themes";
import "@xyflow/react/dist/style.css";
import { Sidebar } from "./sidebar";

registerEdgeTypes();
registerHandleTypes();
registerNodeTypes();

const selectGraphState = (state: FlowState) => ({
  nodes: state.nodes,
  edges: state.edges,
  setEdges: state.setEdges,
  setNodes: state.setNodes,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setReactFlowWrapper: state.setReactFlowWrapper,
  setReactFlowInstance: state.setReactFlowInstance,
  onDragOver: state.onDragOver,
  onDrop: state.onDrop
});

const fitViewOptions: FitViewOptions = {
  padding: 0.5,
  maxZoom: 1
};

type FIlesProps = {
  initialData: any;
};

export function Files({ initialData }: FIlesProps) {
  const { theme } = useTheme();
  const flow = useReactFlow();

  const trpcClient = useTRPCClient();
  const navigate = useNavigate();
  const params = useParams();

  const routeFilesId = params.fileId as string | undefined;
  const [fileId, setFileId] = React.useState<string | undefined>(routeFilesId);
  const [isCreating, setIsCreating] = React.useState(false);

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setReactFlowWrapper,
    setReactFlowInstance,
    ...rest
  } = useFlowStore(selectGraphState, shallow);
  const reactFlowWrapperRef = useRef(null);

  // Debounce utility (simple version)
  function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  useEffect(() => {
    if (initialData) {
      setNodes(initialData?.data?.nodes || []);
      setEdges(initialData?.data?.edges || []);
    }
  }, [initialData]);

  // Debounced save function
  const debouncedSave = React.useRef(
    debounce(async (nodes: any[], edges: any[], fileId: string) => {
      try {
        await trpcClient.files.update.mutate({
          id: fileId,
          data: { nodes, edges }
        });
      } catch (err) {
        toast.error("Failed to save file");
      }
    }, 1000)
  ).current;

  React.useEffect(() => {
    if (!fileId && !isCreating) {
      setIsCreating(true);

      (async () => {
        try {
          const file = await trpcClient.files.create.mutate({
            name: "Untitled file",
            data: { nodes: [], edges: [] }
          });

          setFileId(file.id);
          navigate(`/files/${file.id}`, { replace: true });
        } catch (err) {
          toast.error("Failed to create file");
        } finally {
          setIsCreating(false);
        }
      })();
    }
  }, [fileId, isCreating, navigate, trpcClient.files.create]);

  React.useEffect(() => {
    if (fileId) debouncedSave(nodes, edges, fileId);
  }, [nodes, edges, fileId]);

  useEffect(() => {
    setReactFlowWrapper(reactFlowWrapperRef.current);
  }, [setReactFlowWrapper, reactFlowWrapperRef]);

  useEffect(() => {
    flow?.fitView(fitViewOptions);
  }, [flow]);

  const nodeTypes = React.useMemo(() => nodeRegistry.getReactFlowNodeTypes(), []);
  const edgeTypes = React.useMemo(() => edgeRegistry.getReactFlowEdgeTypes(), []);

  return (
    <div ref={reactFlowWrapperRef} className="h-full w-full overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
        snapGrid={[10, 10]}
        connectionRadius={70}
        connectionLineType={ConnectionLineType.Bezier}
        deleteKeyCode={flowConfig.keybindings.delete}
        disableKeyboardA11y={true}
        proOptions={{ hideAttribution: true }}
        selectionOnDrag={false}
        selectNodesOnDrag={false}
        onInit={setReactFlowInstance}
        {...rest}
      >
        <Sidebar />
        <Background
          color={theme === "dark" ? color.Flow_Black_stroke : color.Flow_Black_stroke_light}
          variant={BackgroundVariant.Dots}
          id="react-flow-background"
        />
      </ReactFlow>
    </div>
  );
}
