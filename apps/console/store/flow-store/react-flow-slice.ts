import { ReactFlowSlice, FlowState } from "~/types/store";
import { StateCreator } from "zustand";

export const createReactFlowSlice: StateCreator<FlowState, [], [], ReactFlowSlice> = (set) => ({
  reactFlowInstance: null,
  setReactFlowInstance: (instance: any) => {
    set({ reactFlowInstance: instance });
  },

  reactFlowWrapper: null,
  setReactFlowWrapper: (ref: HTMLDivElement | null) => {
    set({ reactFlowWrapper: ref });
  }
});
