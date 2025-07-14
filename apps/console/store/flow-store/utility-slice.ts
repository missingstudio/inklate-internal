import { UtilitySlice, FlowState } from "~/types/store";
import { generateNodeId } from "~/utils/store";
import { StateCreator } from "zustand";

export const createUtilitySlice: StateCreator<FlowState, [], [], UtilitySlice> = () => ({
  getId: (type: string) => generateNodeId(type)
});
