import { Edge, applyEdgeChanges, EdgeChange } from "@xyflow/react";
import { EdgeSlice, FlowState, EdgeId } from "~/types/store";
import { StateCreator } from "zustand";
import { produce } from "immer";

export const createEdgeSlice: StateCreator<FlowState, [], [], EdgeSlice> = (set, get) => ({
  edges: [],

  getEdge: (edgeId: EdgeId) => get().edges.find((e: Edge) => e.id === edgeId),

  addEdge: (edge: Edge) =>
    set(
      produce((state) => {
        state.edges.push(edge);
      })
    ),

  setEdges: (edges: Edge[]) =>
    set(
      produce((state) => {
        state.edges = edges;
      })
    ),

  removeEdge: (edgeId: EdgeId) =>
    set(
      produce((state) => {
        const index = state.edges.findIndex((e: Edge) => e.id === edgeId);
        if (index !== -1) {
          state.edges.splice(index, 1);
        }
      })
    ),

  updateEdge: (edgeId: EdgeId, update: Partial<Edge>) =>
    set(
      produce((state) => {
        const edgeIndex = state.edges.findIndex((e: Edge) => e.id === edgeId);
        if (edgeIndex !== -1) {
          Object.assign(state.edges[edgeIndex], update);
        }
      })
    ),

  getEdgeData: <T = any>(id: string) => {
    const edge = get().getEdge(id);
    if (!edge) return undefined;
    return edge.data as T | undefined;
  },

  setEdgeData: <T = any>(id: string, data: Partial<T>) => {
    set(
      produce((state) => {
        const edgeIndex = state.edges.findIndex((e: Edge) => e.id === id);
        if (edgeIndex !== -1 && state.edges[edgeIndex].data) {
          Object.assign(state.edges[edgeIndex].data, data);
        }
      })
    );
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set(
      produce((state) => {
        state.edges = applyEdgeChanges(changes, state.edges);
      })
    );
  }
});
