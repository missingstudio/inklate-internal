import { HandleType } from "~/enums/handle-type.enum";
import { Position } from "@xyflow/react";

// Base handle configuration interface
export interface HandleConfig {
  id: string;
  type: HandleType;
  label?: string;
  description: string;
  required: boolean;
  order: number;
  position?: Position;

  // Visual customization
  style?: {
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    size?: "small" | "medium" | "large";
    shape?: "circle" | "square" | "diamond";
  };

  // Custom positioning
  offset?: {
    x?: number;
    y?: number;
  };

  // Handle behavior
  maxConnections?: number;
  validation?: {
    allowedTypes?: HandleType[];
    customValidator?: (sourceType: HandleType, targetType: HandleType) => boolean;
  };

  // UI elements
  icon?: string;
  tooltip?: string;

  // Advanced configuration
  metadata?: Record<string, any>;
}

// Handle layout configuration
export interface HandleLayoutConfig {
  spacing?: number;
  grouping?: "none" | "by-type" | "custom";
  alignment?: "top" | "center" | "bottom" | "distributed";
  customLayout?: (handles: HandleConfig[]) => Array<{
    handleId: string;
    position: { x: number; y: number };
  }>;
}

// Node handle configuration
export interface NodeHandleConfig {
  input?: {
    handles: Record<string, HandleConfig>;
    layout?: HandleLayoutConfig;
  };
  output?: {
    handles: Record<string, HandleConfig>;
    layout?: HandleLayoutConfig;
  };
}

// Handle type definition for extensibility
export interface HandleTypeDefinition {
  type: HandleType;
  name: string;
  description: string;
  defaultStyle: HandleConfig["style"];
  defaultIcon?: string;

  // Compatibility rules
  compatibleWith: HandleType[];
  customCompatibilityCheck?: (sourceType: HandleType, targetType: HandleType) => boolean;

  // Validation
  validator?: (data: any) => boolean;
  transformer?: (data: any, targetType: HandleType) => any;

  // Visual representation
  renderIcon?: () => React.ReactNode;
  renderPreview?: (data: any) => React.ReactNode;
}

// Handle registry interface
export interface HandleRegistry {
  register: (definition: HandleTypeDefinition) => void;
  get: (type: HandleType) => HandleTypeDefinition | undefined;
  getAll: () => HandleTypeDefinition[];
  isCompatible: (sourceType: HandleType, targetType: HandleType) => boolean;
  transform: (data: any, sourceType: HandleType, targetType: HandleType) => any;
}

// Handle position calculator
export interface HandlePositionCalculator {
  calculatePosition: (
    handle: HandleConfig,
    index: number,
    totalHandles: number,
    isInput: boolean,
    layout?: HandleLayoutConfig
  ) => { x: number; y: number };
}

// Handle event handlers
export interface HandleEventHandlers {
  onConnect?: (sourceHandle: HandleConfig, targetHandle: HandleConfig) => void;
  onDisconnect?: (sourceHandle: HandleConfig, targetHandle: HandleConfig) => void;
  onHover?: (handle: HandleConfig) => void;
  onLeave?: (handle: HandleConfig) => void;
}
