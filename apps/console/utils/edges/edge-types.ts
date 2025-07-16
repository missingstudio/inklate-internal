import { CustomEdge } from "~/components/edges/custom-edge";
import { EdgeTypeDefinition } from "~/types/edge";
import { addEdgeType } from "./edge-registry";

export const customEdgeType: EdgeTypeDefinition = {
  id: "custom",
  name: "Custom Edge",
  description: "A custom edge with gradient colors based on handle types",
  category: "default",
  component: CustomEdge,
  defaultData: {
    id: "",
    type: "custom",
    gradient: true,
    strokeWidth: 2,
    animated: false,
    dashed: false
  },
  color: "#6B7280",
  animated: false
};

export const simpleEdgeType: EdgeTypeDefinition = {
  id: "simple",
  name: "Simple Edge",
  description: "A simple edge without gradient",
  category: "basic",
  component: CustomEdge,
  defaultData: {
    id: "",
    type: "simple",
    gradient: false,
    strokeWidth: 2,
    animated: false,
    dashed: false,
    color: "#6B7280"
  },
  color: "#6B7280",
  animated: false
};

export const animatedEdgeType: EdgeTypeDefinition = {
  id: "animated",
  name: "Animated Edge",
  description: "An animated edge with gradient colors",
  category: "animated",
  component: CustomEdge,
  defaultData: {
    id: "",
    type: "animated",
    gradient: true,
    strokeWidth: 2,
    animated: true,
    dashed: false
  },
  color: "#3B82F6",
  animated: true
};

export const dashedEdgeType: EdgeTypeDefinition = {
  id: "dashed",
  name: "Dashed Edge",
  description: "A dashed edge with gradient colors",
  category: "styled",
  component: CustomEdge,
  defaultData: {
    id: "",
    type: "dashed",
    gradient: true,
    strokeWidth: 2,
    animated: false,
    dashed: true
  },
  color: "#EF4444",
  animated: false
};

export function registerEdgeTypes(): void {
  addEdgeType(customEdgeType);
  addEdgeType(simpleEdgeType);
  addEdgeType(animatedEdgeType);
  addEdgeType(dashedEdgeType);
}

export const edgeTypes = {
  custom: customEdgeType,
  simple: simpleEdgeType,
  animated: animatedEdgeType,
  dashed: dashedEdgeType
};
