import { nodeRegistry } from "~/utils/nodes/node-registry";
import { DragDropSlice, CanvasState } from "./types";
import { StateCreator } from "zustand";
import { Node } from "@xyflow/react";
import { DragEvent } from "react";
import { produce } from "immer";

export const createDragDropSlice: StateCreator<CanvasState, [], [], DragDropSlice> = (
  set,
  get
) => ({
  onDragOver: (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  },

  onDrop: async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const reactFlowBounds = get().reactFlowWrapper?.getBoundingClientRect();
    const type = event.dataTransfer?.getData("application/reactflow");

    if (typeof type === "undefined" || !type) return;
    if (!reactFlowBounds) return;

    const position = get().reactFlowInstance?.screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top
    });

    // Use the node registry to create node with default data
    const nodeDefinition = nodeRegistry.get(type);
    if (!nodeDefinition) {
      console.error(`Unknown node type: ${type}`);
      return;
    }

    const newNode: Node = {
      id: get().getId(type),
      type: type,
      position,
      data: {
        ...nodeDefinition.defaultData,
        id: get().getId(type),
        type: type,
        name: nodeDefinition.name,
        description: nodeDefinition.description,
        lastUpdated: Date.now()
      }
    };

    set(
      produce((state) => {
        state.nodes.push(newNode);
      })
    );
  }
});
