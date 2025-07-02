import {
  Node,
  Edge,
  applyNodeChanges,
  NodeChange,
  applyEdgeChanges,
  EdgeChange
} from "@xyflow/react";
import { createWithEqualityFn } from "zustand/traditional";
import { ReadyState } from "react-use-websocket";
import { BaseNodeData } from "~/types/node";
import { DragEvent } from "react";
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
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  getId: (type: string) => string;
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
  nodes: [{ id: "1", type: "text", position: { x: 100, y: 100 }, data: { label: "1" } }],
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

  onDragOver: (event: any) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  },
  onDrop: (event: any) => {
    event.preventDefault();
    const reactFlowBounds = get().reactFlowWrapper?.getBoundingClientRect();
    const type = event.dataTransfer?.getData("application/reactflow");

    // check if the dropped element is valid
    if (typeof type === "undefined" || !type) {
      console.log("Invalid type");
      return;
    }

    if (!reactFlowBounds) {
      console.log("Invalid reactFlowBounds");
      return;
    }

    const position = get().reactFlowInstance?.screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top
    });

    const newNode = {
      id: get().getId(type),
      type: type,
      position,
      data: {}
    };

    set({
      nodes: (get().nodes ?? []).concat(newNode)
    });
  },

  getId: (type: string) => {
    let id = ulid();
    return `dndnode_${type}_${id}`;
  }
}));
