import { EdgeTypeDefinition, EdgeRegistry } from "~/types/edge";
import { generateId } from "@inklate/common/generate-id";
import { EdgeProps } from "@xyflow/react";
import React from "react";

class EdgeTypeRegistry implements EdgeRegistry {
  private edgeTypes = new Map<string, EdgeTypeDefinition>();

  register(definition: EdgeTypeDefinition): void {
    this.edgeTypes.set(definition.id, definition);
  }

  unregister(edgeTypeId: string): void {
    this.edgeTypes.delete(edgeTypeId);
  }

  get(edgeTypeId: string): EdgeTypeDefinition | undefined {
    return this.edgeTypes.get(edgeTypeId);
  }

  getAll(): EdgeTypeDefinition[] {
    return Array.from(this.edgeTypes.values());
  }

  getAllByCategory(category: string): EdgeTypeDefinition[] {
    return this.getAll().filter((edgeType) => edgeType.category === category);
  }

  getCategories(): string[] {
    return [...new Set(this.getAll().map((edgeType) => edgeType.category))];
  }

  getReactFlowEdgeTypes(): Record<string, any> {
    const edgeTypes: Record<string, React.ComponentType<EdgeProps>> = {};

    for (const [id, definition] of this.edgeTypes) {
      edgeTypes[id] = definition.component;
    }

    return edgeTypes;
  }

  createEdge(
    edgeTypeId: string,
    id: string,
    sourceId: string,
    targetId: string,
    sourceHandleId?: string,
    targetHandleId?: string
  ) {
    const definition = this.get(edgeTypeId);
    if (!definition) {
      throw new Error(`Edge type "${edgeTypeId}" not found in registry`);
    }

    const data = { ...definition.defaultData };

    return {
      id,
      type: edgeTypeId,
      source: sourceId,
      target: targetId,
      sourceHandle: sourceHandleId,
      targetHandle: targetHandleId,
      data: {
        ...data,
        id,
        type: edgeTypeId,
        lastUpdated: Date.now()
      }
    };
  }
}

export const edgeRegistry = new EdgeTypeRegistry();

export function addEdgeType(definition: EdgeTypeDefinition): void {
  edgeRegistry.register(definition);
}

export function removeEdgeType(edgeTypeId: string): void {
  edgeRegistry.unregister(edgeTypeId);
}

export function hasEdgeType(edgeTypeId: string): boolean {
  return edgeRegistry.get(edgeTypeId) !== undefined;
}

export function getAllEdgeTypes(): EdgeTypeDefinition[] {
  return edgeRegistry.getAll();
}

export function getEdgeTypesByCategory(category: string): EdgeTypeDefinition[] {
  return edgeRegistry.getAllByCategory(category);
}

export function getEdgeCategories(): string[] {
  return edgeRegistry.getCategories();
}

export function getReactFlowEdgeTypes(): Record<string, React.ComponentType<EdgeProps>> {
  return edgeRegistry.getReactFlowEdgeTypes();
}

export function createEdge(
  edgeTypeId: string,
  sourceId: string,
  targetId: string,
  sourceHandleId?: string,
  targetHandleId?: string
): any {
  const id = generateId({ use: "nanoid", kind: "edge" });
  return edgeRegistry.createEdge(
    edgeTypeId,
    id,
    sourceId,
    targetId,
    sourceHandleId,
    targetHandleId
  );
}
