import { isHandleCompatible, transformHandleData } from "~/utils/handles/handle-registry";
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

    // Get source and target handles using new handle system
    const sourceNodeData = sourceNode.data as BaseNodeData;
    const targetNodeData = targetNode.data as BaseNodeData;

    // Extract handle information from new handle system
    const sourceHandles = sourceNodeData.handles?.output?.handles;
    const targetHandles = targetNodeData.handles?.input?.handles;

    if (!sourceHandles || !targetHandles) {
      toast.error("Connection failed", {
        description: "Node handles not properly configured"
      });
      return;
    }

    const sourceHandle = sourceHandles[connection.sourceHandle!];
    const targetHandle = targetHandles[connection.targetHandle!];

    if (!sourceHandle || !targetHandle) {
      toast.error("Connection failed", {
        description: "Specific connection points not found on nodes"
      });
      return;
    }

    // Validate handle compatibility using the new handle registry
    if (!isHandleCompatible(sourceHandle.type, targetHandle.type)) {
      toast.error(
        `Connection failed: Cannot connect ${sourceHandle.type} output to ${targetHandle.type} input`,
        {
          description:
            "These handle types are not compatible. Check node documentation for supported connections."
        }
      );
      return;
    }

    // Create the edge
    const newEdge: Edge = {
      id: generateEdgeId(connection.source, connection.target),
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      data: {
        sourceHandleType: sourceHandle.type,
        targetHandleType: targetHandle.type,
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
      // Use the new handle registry for data transformation
      const sourceHandleType =
        (connectingEdge.data?.sourceHandleType as HandleType) || HandleType.Text;
      const targetHandleType =
        (connectingEdge.data?.targetHandleType as HandleType) || HandleType.Text;

      const transformedData = transformHandleData(
        sourceData.response || sourceData.text,
        sourceHandleType,
        targetHandleType
      );

      get().setNodeData(targetNodeId, {
        text: transformedData,
        lastUpdated: Date.now()
      });
    } catch (error) {
      console.error("Data transfer failed:", error);
    }
  }
});
