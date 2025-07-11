import { wrapNode, type WrappedNodeProps } from "~/components/nodes/wrap-node";
import { generateId } from "@inklate/common/generate-id";
import { BaseNodeData } from "~/types/node";
import React from "react";

export interface NodeTypeDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  component: React.ComponentType<WrappedNodeProps<any>>;
  defaultData: Partial<BaseNodeData>;
  icon?: React.ReactNode;
  color?: string;
}

class NodeRegistry {
  private nodeTypes = new Map<string, NodeTypeDefinition>();

  register(definition: NodeTypeDefinition) {
    this.nodeTypes.set(definition.id, definition);
  }

  unregister(nodeTypeId: string) {
    this.nodeTypes.delete(nodeTypeId);
  }

  get(nodeTypeId: string): NodeTypeDefinition | undefined {
    return this.nodeTypes.get(nodeTypeId);
  }

  getAll(): NodeTypeDefinition[] {
    return Array.from(this.nodeTypes.values());
  }

  getAllByCategory(category: string): NodeTypeDefinition[] {
    return this.getAll().filter((nodeType) => nodeType.category === category);
  }

  getCategories(): string[] {
    return [...new Set(this.getAll().map((nodeType) => nodeType.category))];
  }

  // Get React Flow compatible node types object
  getReactFlowNodeTypes() {
    const nodeTypes: Record<string, any> = {};

    for (const [id, definition] of this.nodeTypes) {
      nodeTypes[id] = wrapNode(definition.component);
    }

    return nodeTypes;
  }

  // Create a new node with default data and unique handle IDs
  createNode(nodeTypeId: string, id: string, position: { x: number; y: number }) {
    const definition = this.get(nodeTypeId);
    if (!definition) {
      throw new Error(`Node type "${nodeTypeId}" not found in registry`);
    }

    // Clone default data and generate unique handle IDs
    const data = { ...definition.defaultData };

    // Generate unique handle IDs if handles exist
    if (data.handles) {
      data.handles = { ...data.handles };

      if (
        data.handles.input &&
        typeof data.handles.input === "object" &&
        !Array.isArray(data.handles.input)
      ) {
        data.handles.input = { ...data.handles.input };
        Object.keys(data.handles.input).forEach((handleKey) => {
          const handle = data.handles!.input![handleKey];
          if (handle && typeof handle === "object") {
            (data.handles!.input as any)[handleKey] = {
              ...handle,
              id: `${handleKey}-${generateId({ use: "nanoid", kind: "edge" })}`
            };
          }
        });
      }

      if (
        data.handles.output &&
        typeof data.handles.output === "object" &&
        !Array.isArray(data.handles.output)
      ) {
        data.handles.output = { ...data.handles.output };
        Object.keys(data.handles.output).forEach((handleKey) => {
          const handle = data.handles!.output![handleKey];
          if (handle && typeof handle === "object") {
            (data.handles!.output as any)[handleKey] = {
              ...handle,
              id: `${handleKey}-${generateId({ use: "nanoid", kind: "edge" })}`
            };
          }
        });
      }
    }

    return {
      id,
      type: nodeTypeId,
      position,
      data: {
        ...data,
        id,
        type: nodeTypeId,
        name: definition.name,
        description: definition.description,
        lastUpdated: Date.now()
      }
    };
  }
}

export const nodeRegistry = new NodeRegistry();

// Helper hook for getting node types in components
export function useNodeRegistry() {
  return {
    getNodeTypes: () => nodeRegistry.getAll(),
    getNodeTypesByCategory: (category: string) => nodeRegistry.getAllByCategory(category),
    getCategories: () => nodeRegistry.getCategories(),
    createNode: nodeRegistry.createNode.bind(nodeRegistry)
  };
}
