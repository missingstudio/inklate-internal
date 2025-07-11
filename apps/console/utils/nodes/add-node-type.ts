import { nodeRegistry, type NodeTypeDefinition } from "./node-registry";

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

export function getNodeTypesByCategory(category: string): NodeTypeDefinition[] {
  return nodeRegistry.getAllByCategory(category);
}
