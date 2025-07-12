import { UtilitySlice, CanvasState } from "~/types/store";
import { generateNodeId } from "~/utils/store";
import { StateCreator } from "zustand";

export const createUtilitySlice: StateCreator<CanvasState, [], [], UtilitySlice> = () => ({
  getId: (type: string) => generateNodeId(type)
});
