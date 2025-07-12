import { Node, applyNodeChanges, NodeChange } from "@xyflow/react";
import { NodeSlice, CanvasState, NodeId } from "~/types/store";
import { BaseNodeData } from "~/types/node";
import { StateCreator } from "zustand";
import { produce } from "immer";

export const createNodeSlice: StateCreator<CanvasState, [], [], NodeSlice> = (set, get) => ({
  nodes: [],
  getNode: (nodeId: NodeId) => get().nodes.find((n: Node) => n.id === nodeId),

  addNode: (node: Node) =>
    set(
      produce((state) => {
        state.nodes.push(node);
      })
    ),

  removeNode: (nodeId: NodeId) =>
    set(
      produce((state) => {
        const index = state.nodes.findIndex((n: Node) => n.id === nodeId);
        if (index !== -1) {
          state.nodes.splice(index, 1);
        }
      })
    ),

  updateNode: (nodeId: NodeId, update: Partial<Node>) =>
    set(
      produce((state) => {
        const nodeIndex = state.nodes.findIndex((n: Node) => n.id === nodeId);
        if (nodeIndex !== -1) {
          Object.assign(state.nodes[nodeIndex], update);
        }
      })
    ),

  getNodeData: <T extends BaseNodeData>(id: string) => {
    const node = get().getNode(id);
    if (!node) return undefined;
    return node.data as T | undefined;
  },

  setNodeData: <T extends BaseNodeData>(id: string, data: Partial<T>) => {
    set(
      produce((state) => {
        const nodeIndex = state.nodes.findIndex((n: Node) => n.id === id);
        if (nodeIndex !== -1 && state.nodes[nodeIndex].data) {
          Object.assign(state.nodes[nodeIndex].data, data);
        }
      })
    );
  },

  onNodesChange: (changes: NodeChange[]) => {
    set(
      produce((state) => {
        state.nodes = applyNodeChanges(changes, state.nodes);
      })
    );
  }
});
