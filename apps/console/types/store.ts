import { Node, Edge, NodeChange, EdgeChange, Connection } from "@xyflow/react";
import { BaseNodeData } from "~/types/node";
import { DragEvent } from "react";

export type NodeId = string;
export type EdgeId = string;

export interface ReactFlowSlice {
  reactFlowInstance: any;
  setReactFlowInstance: (instance: any) => void;
  reactFlowWrapper: null | HTMLDivElement;
  setReactFlowWrapper: (ref: HTMLDivElement | null) => void;
}

export interface NodeSlice {
  nodes: Node[];
  addNode: (node: Node) => void;
  removeNode: (nodeId: NodeId) => void;
  updateNode: (nodeId: NodeId, update: Partial<Node>) => void;
  getNode: (nodeId: NodeId) => Node | undefined;
  getNodeData: <T extends BaseNodeData>(id: string) => T | undefined;
  setNodeData: <T extends BaseNodeData>(id: string, data: Partial<T>) => void;
  onNodesChange: (changes: NodeChange[]) => void;
}

export interface EdgeSlice {
  edges: Edge[];
  addEdge: (edge: Edge) => void;
  removeEdge: (edgeId: EdgeId) => void;
  updateEdge: (edgeId: EdgeId, update: Partial<Edge>) => void;
  getEdge: (edgeId: EdgeId) => Edge | undefined;
  getEdgeData: <T = any>(id: string) => T | undefined;
  setEdgeData: <T = any>(id: string, data: Partial<T>) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
}

export interface ConnectionSlice {
  onConnect: (connection: Connection) => void;
  transferData: (sourceNodeId: string, targetNodeId: string) => void;
}

export interface DragDropSlice {
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
}

export interface UtilitySlice {
  getId: (type: string) => string;
}

export interface CanvasState
  extends ReactFlowSlice,
    NodeSlice,
    EdgeSlice,
    ConnectionSlice,
    DragDropSlice,
    UtilitySlice {}
