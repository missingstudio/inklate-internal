import { HandleType } from "~/enums/handle-type.enum";

type HandleFormat = string;
export type HandleSide = "source" | "target";

export interface Handle {
  description: string;
  format: HandleFormat;
  label?: string;
  id: string;
  order: number;
  required: boolean;
  type?: HandleType;
}

export interface BaseNodeData {
  version?: number;
  color: string;

  name: string;
  description: string;
  type: string;

  handles: { input: Record<string, Handle>; output: Record<string, Handle> };
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
