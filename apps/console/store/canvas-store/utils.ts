import { ulid } from "ulid";

export const generateNodeId = (type: string): string => {
  const id = ulid();
  return `dndnode_${type}_${id}`;
};

export const generateEdgeId = (source: string, target: string): string => {
  return `edge-${source}-${target}-${ulid()}`;
};
