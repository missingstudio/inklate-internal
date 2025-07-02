import {
  Node,
  Edge,
  applyNodeChanges,
  NodeChange,
  applyEdgeChanges,
  EdgeChange
} from "@xyflow/react";
import { createWithEqualityFn } from "zustand/traditional";
import { BaseNodeData } from "~/types/node";

export type NodeId = string;
export type EdgeId = string;

export type GraphState = {
  nodes: Node[];
  edges: Edge[];
};

export interface GraphStore extends GraphState {
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
}

export const useGraphStore = createWithEqualityFn<GraphStore>((set, get) => ({
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
  }
}));
