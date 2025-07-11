import { ReactFlowSlice, CanvasState } from "./types";
import { StateCreator } from "zustand";

export const createReactFlowSlice: StateCreator<CanvasState, [], [], ReactFlowSlice> = (set) => ({
  reactFlowInstance: null,
  setReactFlowInstance: (instance: any) => {
    set({ reactFlowInstance: instance });
  },

  reactFlowWrapper: null,
  setReactFlowWrapper: (ref: HTMLDivElement | null) => {
    set({ reactFlowWrapper: ref });
  }
});
