import {
  validateDataTransfer,
  areHandleTypesCompatible,
  HandleSchema,
  convertToNodeData,
  type ValidatedHandle
} from "~/utils/nodes/node-data-schemas";
import { Connection, Edge, addEdge } from "@xyflow/react";
import { ConnectionSlice, CanvasState } from "./types";
import { HandleType } from "~/enums/handle-type.enum";
import { BaseNodeData } from "~/types/node";
import { generateEdgeId } from "./utils";
import { StateCreator } from "zustand";
import { produce } from "immer";
import { toast } from "sonner";

export const createConnectionSlice: StateCreator<CanvasState, [], [], ConnectionSlice> = (
  set,
  get
) => ({
  onConnect: (connection: Connection) => {
    if (!connection.source || !connection.target) return;

    // Get source and target nodes
    const sourceNode = get().getNode(connection.source);
    const targetNode = get().getNode(connection.target);

    if (!sourceNode || !targetNode) {
      toast.error("Connection failed", {
        description: "Source or target node not found"
      });
      return;
    }

    // Get source and target handles
    const sourceNodeData = sourceNode.data as BaseNodeData;
    const targetNodeData = targetNode.data as BaseNodeData;

    // Extract handle information
    const sourceHandles = sourceNodeData.handles?.output;
    const targetHandles = targetNodeData.handles?.input;

    if (!sourceHandles || !targetHandles) {
      toast.error("Connection failed", {
        description: "Node handles not properly configured"
      });
      return;
    }

    // Check if handles are objects (not arrays) and get specific handles
    if (Array.isArray(sourceHandles) || Array.isArray(targetHandles)) {
      toast.error("Connection failed", {
        description: "Array based handles are not supported yet"
      });
      return;
    }

    // Type assertion after array check
    const sourceHandlesRecord = sourceHandles as Record<string, any>;
    const targetHandlesRecord = targetHandles as Record<string, any>;

    const sourceHandle = sourceHandlesRecord[connection.sourceHandle!];
    const targetHandle = targetHandlesRecord[connection.targetHandle!];

    if (!sourceHandle || !targetHandle) {
      toast.error("Connection failed", {
        description: "Specific connection points not found on nodes"
      });
      return;
    }

    // Validate handles using zod schema
    try {
      const validatedSourceHandle = HandleSchema.parse(sourceHandle) as ValidatedHandle;
      const validatedTargetHandle = HandleSchema.parse(targetHandle) as ValidatedHandle;

      // Check if handle types are compatible
      if (!areHandleTypesCompatible(validatedSourceHandle.format, validatedTargetHandle.format)) {
        toast.error(
          `Connection failed: Cannot connect ${validatedSourceHandle.format} output to ${validatedTargetHandle.format} input`,
          {
            description:
              "These handle types are not compatible. Check node documentation for supported connections."
          }
        );
        return;
      }

      // Validate data transfer if there's existing data
      const sourceData = sourceNodeData?.[connection.sourceHandle!];
      if (sourceData) {
        const validationResult = validateDataTransfer(
          sourceData,
          validatedSourceHandle,
          validatedTargetHandle
        );

        console.log("validationResult", validationResult);

        if (!validationResult.isValid) {
          toast.error("Data transfer validation failed", {
            description: validationResult.error || "Unable to transfer data between these handles"
          });
          return;
        }
      }

      // If validation passes, create the edge
      const newEdge: Edge = {
        id: generateEdgeId(connection.source, connection.target),
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        data: {
          sourceHandleType: validatedSourceHandle.format,
          targetHandleType: validatedTargetHandle.format,
          validated: true
        }
      };

      set(
        produce((state) => {
          state.edges = addEdge(newEdge, state.edges);
        })
      );

      // Transfer data from source to target node
      get().transferData(connection.source, connection.target);
    } catch (error) {
      toast.error("Connection validation failed", {
        description:
          error instanceof Error ? error.message : "Unable to validate connection between nodes"
      });
      return;
    }
  },

  transferData: (sourceNodeId: string, targetNodeId: string) => {
    const sourceNode = get().getNode(sourceNodeId);
    const targetNode = get().getNode(targetNodeId);
    if (!sourceNode || !targetNode) return;

    // Get the edge connecting these nodes to understand handle types
    const connectingEdge = get().edges.find(
      (edge) => edge.source === sourceNodeId && edge.target === targetNodeId
    );

    if (!connectingEdge || !connectingEdge.data?.validated) {
      console.warn("No validated edge found for data transfer");
      return;
    }

    const sourceData = sourceNode.data as any;

    try {
      const convertedData = convertToNodeData(sourceData.response, HandleType.Text);
      get().setNodeData(targetNodeId, {
        text: convertedData.value,
        lastUpdated: Date.now()
      });
    } catch (error) {
      console.error("Data transfer failed:", error);
    }
  }
});
