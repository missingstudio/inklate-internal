import { createWithEqualityFn } from "zustand/traditional";
import { createConnectionSlice } from "./connection-slice";
import { createReactFlowSlice } from "./react-flow-slice";
import { createDragDropSlice } from "./drag-drop-slice";
import { createUtilitySlice } from "./utility-slice";
import { createNodeSlice } from "./node-slice";
import { createEdgeSlice } from "./edge-slice";
import { CanvasState } from "~/types/store";

export const useCanvasStore = createWithEqualityFn<CanvasState>((set, get, api) => ({
  ...createReactFlowSlice(set, get, api),
  ...createNodeSlice(set, get, api),
  ...createEdgeSlice(set, get, api),
  ...createConnectionSlice(set, get, api),
  ...createDragDropSlice(set, get, api),
  ...createUtilitySlice(set, get, api)
}));
