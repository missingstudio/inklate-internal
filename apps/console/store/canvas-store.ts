import {
  validateDataTransfer,
  areHandleTypesCompatible,
  HandleSchema,
  convertToNodeData,
  type ValidatedHandle
} from "~/utils/nodes/node-data-schemas";
import {
  Node,
  Edge,
  applyNodeChanges,
  NodeChange,
  applyEdgeChanges,
  EdgeChange,
  Connection,
  addEdge
} from "@xyflow/react";
import { createWithEqualityFn } from "zustand/traditional";
import { HandleType } from "~/enums/handle-type.enum";
import { ReadyState } from "react-use-websocket";
import { BaseNodeData } from "~/types/node";
import { DragEvent } from "react";
import { toast } from "sonner";
import { ulid } from "ulid";

export type NodeId = string;
export type EdgeId = string;

export interface CanvasState {
  reactFlowInstance: any;
  setReactFlowInstance: (instance: any) => void;
  reactFlowWrapper: null | HTMLDivElement;
  setReactFlowWrapper: (ref: HTMLDivElement | null) => void;

  nodes: Node[];
  edges: Edge[];
  addNode: (node: Node) => void;
  removeNode: (nodeId: NodeId) => void;
  updateNode: (nodeId: NodeId, update: Partial<Node>) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (edgeId: EdgeId) => void;
  updateEdge: (edgeId: EdgeId, update: Partial<Edge>) => void;
  getNode: (nodeId: NodeId) => Node | undefined;
  getEdge: (edgeId: EdgeId) => Edge | undefined;
  getNodeData: <T extends BaseNodeData>(id: string) => T | undefined;
  setNodeData: <T extends BaseNodeData>(id: string, data: Partial<T>) => void;
  getEdgeData: <T = any>(id: string) => T | undefined;
  setEdgeData: <T = any>(id: string, data: Partial<T>) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  getId: (type: string) => string;
  transferData: (sourceNodeId: string, targetNodeId: string) => void;
}

export const useCanvasStore = createWithEqualityFn<CanvasState>((set, get) => ({
  reactFlowInstance: null,
  setReactFlowInstance: (instance: any) => {
    set({ reactFlowInstance: instance });
  },

  reactFlowWrapper: null,
  setReactFlowWrapper: (ref: HTMLDivElement | null) => {
    set({ reactFlowWrapper: ref });
  },

  webSocketConnectionStatus: ReadyState.UNINSTANTIATED,

  // reactflow state
  nodes: [],
  edges: [],

  getNode: (nodeId) => get().nodes.find((n: Node) => n.id === nodeId),
  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node]
    })),
  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((n: Node) => n.id !== nodeId)
    })),
  updateNode: (nodeId, update) =>
    set((state) => ({
      nodes: state.nodes.map((n: Node) => (n.id === nodeId ? { ...n, ...update } : n))
    })),
  getNodeData: <T extends BaseNodeData>(id: string) => {
    const node = get().getNode(id);
    if (!node) return undefined;
    return node.data as T | undefined;
  },
  setNodeData: <T extends BaseNodeData>(id: string, data: Partial<T>) => {
    set((state) => ({
      nodes: state.nodes.map((n: Node) =>
        n.id === id && n.data ? { ...n, data: { ...n.data, ...data } } : n
      )
    }));
  },
  onNodesChange: (changes: NodeChange[]) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes)
    }));
  },

  getEdge: (edgeId) => get().edges.find((e: Edge) => e.id === edgeId),
  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, edge]
    })),
  removeEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((e: Edge) => e.id !== edgeId)
    })),
  updateEdge: (edgeId, update) =>
    set((state) => ({
      edges: state.edges.map((e: Edge) => (e.id === edgeId ? { ...e, ...update } : e))
    })),
  getEdgeData: <T = any>(id: string) => {
    const edge = get().getEdge(id);
    if (!edge) return undefined;
    return edge.data as T | undefined;
  },
  setEdgeData: <T = any>(id: string, data: Partial<T>) => {
    set((state) => ({
      edges: state.edges.map((e: Edge) =>
        e.id === id && e.data ? { ...e, data: { ...e.data, ...data } } : e
      )
    }));
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges)
    }));
  },

  onConnect: (connection: Connection) => {
    if (!connection.source || !connection.target) return;

    // Get source and target nodes
    const sourceNode = get().getNode(connection.source);
    const targetNode = get().getNode(connection.target);

    if (!sourceNode || !targetNode) {
      toast.error("Connection failed", {
        description: "Source or target node not found"
      });
      return;
    }

    // Get source and target handles
    const sourceNodeData = sourceNode.data as BaseNodeData;
    const targetNodeData = targetNode.data as BaseNodeData;

    // Extract handle information
    const sourceHandles = sourceNodeData.handles?.output;
    const targetHandles = targetNodeData.handles?.input;

    if (!sourceHandles || !targetHandles) {
      toast.error("Connection failed", {
        description: "Node handles not properly configured"
      });
      return;
    }

    // Check if handles are objects (not arrays) and get specific handles
    if (Array.isArray(sourceHandles) || Array.isArray(targetHandles)) {
      toast.error("Connection failed", {
        description: "Array based handles are not supported yet"
      });
      return;
    }

    // Type assertion after array check
    const sourceHandlesRecord = sourceHandles as Record<string, any>;
    const targetHandlesRecord = targetHandles as Record<string, any>;

    const sourceHandle = sourceHandlesRecord[connection.sourceHandle!];
    const targetHandle = targetHandlesRecord[connection.targetHandle!];

    if (!sourceHandle || !targetHandle) {
      toast.error("Connection failed", {
        description: "Specific connection points not found on nodes"
      });
      return;
    }

    // Validate handles using zod schema
    try {
      const validatedSourceHandle = HandleSchema.parse(sourceHandle) as ValidatedHandle;
      const validatedTargetHandle = HandleSchema.parse(targetHandle) as ValidatedHandle;

      // Check if handle types are compatible
      if (!areHandleTypesCompatible(validatedSourceHandle.format, validatedTargetHandle.format)) {
        toast.error(
          `Connection failed: Cannot connect ${validatedSourceHandle.format} output to ${validatedTargetHandle.format} input`,
          {
            description:
              "These handle types are not compatible. Check node documentation for supported connections."
          }
        );
        return;
      }

      // Validate data transfer if there's existing data
      const sourceData = sourceNodeData?.[connection.sourceHandle!];
      if (sourceData) {
        const validationResult = validateDataTransfer(
          sourceData,
          validatedSourceHandle,
          validatedTargetHandle
        );

        console.log("validationResult", validationResult);

        if (!validationResult.isValid) {
          toast.error("Data transfer validation failed", {
            description: validationResult.error || "Unable to transfer data between these handles"
          });
          return;
        }
      }

      // If validation passes, create the edge
      const newEdge: Edge = {
        id: `edge-${connection.source}-${connection.target}-${ulid()}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        data: {
          sourceHandleType: validatedSourceHandle.format,
          targetHandleType: validatedTargetHandle.format,
          validated: true
        }
      };

      set((state) => ({
        edges: addEdge(newEdge, state.edges)
      }));

      // Transfer data from source to target node
      get().transferData(connection.source, connection.target);
    } catch (error) {
      toast.error("Connection validation failed", {
        description:
          error instanceof Error ? error.message : "Unable to validate connection between nodes"
      });
      return;
    }
  },

  onDragOver: (event: any) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  },
  onDrop: async (event: any) => {
    event.preventDefault();
    const reactFlowBounds = get().reactFlowWrapper?.getBoundingClientRect();
    const type = event.dataTransfer?.getData("application/reactflow");

    if (typeof type === "undefined" || !type) return;
    if (!reactFlowBounds) return;

    const position = get().reactFlowInstance?.screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top
    });

    const createNodeData = async (nodeType: string) => {
      switch (nodeType) {
        case "llm":
          const { createLLMNodeData } = await import("~/components/nodes/llm-node");
          return createLLMNodeData();
        case "text":
          const { createTextNodeData } = await import("~/components/nodes/text-node");
          return createTextNodeData();
      }
    };

    const data = await createNodeData(type);
    const newNode: Node = {
      id: get().getId(type),
      type: type,
      position,
      data: data ?? {}
    };

    set({
      nodes: (get().nodes ?? []).concat(newNode)
    });
  },

  transferData: (sourceNodeId: string, targetNodeId: string) => {
    const sourceNode = get().getNode(sourceNodeId);
    const targetNode = get().getNode(targetNodeId);
    if (!sourceNode || !targetNode) return;

    // Get the edge connecting these nodes to understand handle types
    const connectingEdge = get().edges.find(
      (edge) => edge.source === sourceNodeId && edge.target === targetNodeId
    );

    if (!connectingEdge || !connectingEdge.data?.validated) {
      console.warn("No validated edge found for data transfer");
      return;
    }

    const sourceData = sourceNode.data as any;
    const targetData = targetNode.data as any;

    try {
      const convertedData = convertToNodeData(sourceData.response, HandleType.Text);
      get().setNodeData(targetNodeId, {
        text: convertedData.value,
        lastUpdated: Date.now()
      });
    } catch (error) {
      console.error("Data transfer failed:", error);
    }
  },

  getId: (type: string) => {
    let id = ulid();
    return `dndnode_${type}_${id}`;
  }
}));
