import { HandleType } from "~/enums/handle-type.enum";
import { EdgeProps } from "@xyflow/react";
import React from "react";

// Base edge data interface
export interface BaseEdgeData {
  id: string;
  type: string;
  sourceHandleType?: HandleType;
  targetHandleType?: HandleType;
  label?: string;
  description?: string;
  animated?: boolean;
  color?: string;
  style?: React.CSSProperties;
  metadata?: Record<string, any>;
  lastUpdated?: number;
  gradient?: boolean;
  strokeWidth?: number;
  dashed?: boolean;
  userRole?: string;
}

// Edge type definition for registry
export interface EdgeTypeDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  component: React.ComponentType<EdgeProps>;
  defaultData: Partial<BaseEdgeData>;
  icon?: React.ReactNode;
  color?: string;
  animated?: boolean;
  style?: React.CSSProperties;
}

// Edge registry interface
export interface EdgeRegistry {
  register: (definition: EdgeTypeDefinition) => void;
  unregister: (edgeTypeId: string) => void;
  get: (edgeTypeId: string) => EdgeTypeDefinition | undefined;
  getAll: () => EdgeTypeDefinition[];
  getAllByCategory: (category: string) => EdgeTypeDefinition[];
  getCategories: () => string[];
  getReactFlowEdgeTypes: () => Record<string, React.ComponentType<EdgeProps>>;
}

// Custom edge data interface extending base edge data
export interface CustomEdgeData extends BaseEdgeData {
  sourceHandleType: HandleType;
  targetHandleType: HandleType;
  gradient?: boolean;
  strokeWidth?: number;
  animated?: boolean;
  dashed?: boolean;
  userRole?: string;
}

// Edge style configuration
export interface EdgeStyleConfig {
  strokeWidth?: number;
  strokeDasharray?: string;
  opacity?: number;
  cursor?: string;
  pointerEvents?: string;
  markerEnd?: string;
  filter?: string;
}

// Edge interaction handlers
export interface EdgeEventHandlers {
  onEdgeClick?: (event: React.MouseEvent, edge: EdgeProps) => void;
  onEdgeMouseEnter?: (event: React.MouseEvent, edge: EdgeProps) => void;
  onEdgeMouseLeave?: (event: React.MouseEvent, edge: EdgeProps) => void;
  onEdgeDoubleClick?: (event: React.MouseEvent, edge: EdgeProps) => void;
  onEdgeContextMenu?: (event: React.MouseEvent, edge: EdgeProps) => void;
}
