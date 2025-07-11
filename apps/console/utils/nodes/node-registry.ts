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
      const handles = { ...data.handles };

      if (handles.input && typeof handles.input === "object" && !Array.isArray(handles.input)) {
        handles.input = { ...handles.input };
        if (handles.input.handles) {
          Object.keys(handles.input.handles).forEach((handleKey) => {
            const handle = handles.input?.handles[handleKey];
            if (handle && typeof handle === "object" && handles.input?.handles) {
              handles.input.handles[handleKey] = {
                ...handle,
                id: `${handleKey}-${generateId({ use: "nanoid", kind: "edge" })}`
              };
            }
          });
        }
      }

      if (handles.output && typeof handles.output === "object" && !Array.isArray(handles.output)) {
        handles.output = { ...handles.output };
        if (handles.output.handles) {
          Object.keys(handles.output.handles).forEach((handleKey) => {
            const handle = handles.output?.handles[handleKey];
            if (handle && typeof handle === "object" && handles.output?.handles) {
              handles.output.handles[handleKey] = {
                ...handle,
                id: `${handleKey}-${generateId({ use: "nanoid", kind: "edge" })}`
              };
            }
          });
        }
      }

      data.handles = handles;
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

export function addNodeType(definition: NodeTypeDefinition): void {
  nodeRegistry.register(definition);
}

export function removeNodeType(nodeTypeId: string): void {
  nodeRegistry.unregister(nodeTypeId);
}

export function hasNodeType(nodeTypeId: string): boolean {
  return nodeRegistry.get(nodeTypeId) !== undefined;
}

export function getAllNodeTypes(): NodeTypeDefinition[] {
  return nodeRegistry.getAll();
}

export function getCategories(): string[] {
  return nodeRegistry.getCategories();
}

export function getNodeTypes(): NodeTypeDefinition[] {
  return nodeRegistry.getAll();
}

export function getNodeTypesByCategory(category: string): NodeTypeDefinition[] {
  return nodeRegistry.getAllByCategory(category);
}
