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

  handles: { input: Record<string, Handle> | string[]; output: Record<string, Handle> | string[] };
  input?: Record<string, any> | any[];
  output?: Record<string, any> | any[];
  result?: unknown;

  isLocked?: boolean;
  initialData?: Record<string, any> | null;
}
