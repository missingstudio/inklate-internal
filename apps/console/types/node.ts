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

  // Lifecycle state (optional, added when using withLifecycle)
  _lifecycle?: {
    isInitialized: boolean;
    isValid: boolean;
    errors: string[];
    performanceMetrics: {
      mountTime: number;
      lastUpdateTime: number;
      operationCount: number;
      averageOperationTime: number;
    };
    activeOperations: string[];
    isLoading: boolean;
    hasErrors: boolean;
    isHealthy: boolean;
  };

  // Node-specific properties
  [key: string]: any;
}

// Enhanced node data interface for lifecycle-enabled nodes
export interface LifecycleNodeData extends BaseNodeData {
  _lifecycle: NonNullable<BaseNodeData["_lifecycle"]>;
}

// Lifecycle utilities interface
export interface NodeLifecycleUtilities {
  trackAsyncOperation: <R>(operationName: string, operation: () => Promise<R>) => Promise<R>;
  handleError: (error: Error, context?: string) => void;
  validateNode: () => void;
  cleanup: () => void;
  state: {
    isInitialized: boolean;
    isValid: boolean;
    errors: string[];
    performanceMetrics: {
      mountTime: number;
      lastUpdateTime: number;
      operationCount: number;
      averageOperationTime: number;
    };
    activeOperations: Set<string>;
  };
  isLoading: boolean;
  hasErrors: boolean;
  isHealthy: boolean;
}

// Enhanced props interface for lifecycle-enabled nodes
export interface LifecycleNodeProps<T extends BaseNodeData = BaseNodeData> {
  lifecycle: NodeLifecycleUtilities;
}
