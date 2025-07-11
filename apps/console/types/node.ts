import { NodeHandleConfig } from "./handle";
export type HandleSide = "source" | "target";

export interface BaseNodeData {
  version?: number;
  color: string;

  name: string;
  description: string;
  type: string;

  // New extensible handle system
  handles: NodeHandleConfig;
  input?: Record<string, any> | any[];
  output?: Record<string, any> | any[];
  result?: unknown;

  isLocked?: boolean;
  initialData?: Record<string, any> | null;

  // Enhanced properties for the wrapper
  loading?: boolean;
  error?: string | null;
  selected?: boolean;
  dragging?: boolean;
  lastUpdated?: number;
  metadata?: Record<string, any>;

  // Node-specific properties
  [key: string]: any;
}
