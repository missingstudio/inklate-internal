import { UtilitySlice, CanvasState } from "./types";
import { generateNodeId } from "./utils";
import { StateCreator } from "zustand";

export const createUtilitySlice: StateCreator<CanvasState, [], [], UtilitySlice> = () => ({
  getId: (type: string) => generateNodeId(type)
});
