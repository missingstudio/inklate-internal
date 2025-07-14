import { useEffect, useRef, useCallback, useState } from "react";
import { useFlowStore } from "~/store/flow-store";
import { BaseNodeData } from "~/types/node";

export interface NodeLifecycleConfig<T extends BaseNodeData> {
  nodeId: string;

  // Lifecycle hooks
  onMount?: (data: T) => void | Promise<void>;
  onUnmount?: (data: T) => void | Promise<void>;
  onDataChange?: (newData: T, prevData: T) => void | Promise<void>;
  onError?: (error: Error, data: T) => void;
  onValidate?: (data: T) => { isValid: boolean; errors?: string[] };
  onAsyncOperation?: (operation: string, data: T) => void;

  // Performance monitoring
  enablePerformanceMonitoring?: boolean;
  performanceThreshold?: number; // ms

  // Validation
  enableValidation?: boolean;
  validationInterval?: number; // ms

  // Cleanup
  enableAutoCleanup?: boolean;
  cleanupTimeout?: number; // ms

  // Debug
  enableDebug?: boolean;
}

export interface NodeLifecycleState {
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
}

export function useNodeLifecycle<T extends BaseNodeData>(config: NodeLifecycleConfig<T>) {
  const {
    nodeId,
    onMount,
    onUnmount,
    onDataChange,
    onError,
    onValidate,
    onAsyncOperation,
    enablePerformanceMonitoring = true,
    performanceThreshold = 1000,
    enableValidation = true,
    validationInterval = 5000,
    enableAutoCleanup = true,
    cleanupTimeout = 30000,
    enableDebug = false
  } = config;

  const nodeData = useFlowStore((state) => state.getNodeData<T>(nodeId));
  const setNodeData = useFlowStore((state) => state.setNodeData);
  const removeNode = useFlowStore((state) => state.removeNode);

  const [lifecycleState, setLifecycleState] = useState<NodeLifecycleState>({
    isInitialized: false,
    isValid: true,
    errors: [],
    performanceMetrics: {
      mountTime: 0,
      lastUpdateTime: 0,
      operationCount: 0,
      averageOperationTime: 0
    },
    activeOperations: new Set()
  });

  const previousDataRef = useRef<T | null>(null);
  const mountTimeRef = useRef<number>(0);
  const operationTimesRef = useRef<number[]>([]);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeOperationsRef = useRef<Set<string>>(new Set());

  // Debug logging
  const debugLog = useCallback(
    (message: string, data?: any) => {
      if (enableDebug) {
        console.log(`[NodeLifecycle:${nodeId}] ${message}`, data);
      }
    },
    [enableDebug, nodeId]
  );

  // Performance monitoring
  const measurePerformance = useCallback(
    <R>(operation: string, fn: () => R | Promise<R>): R | Promise<R> => {
      if (!enablePerformanceMonitoring) return fn();

      const startTime = performance.now();
      debugLog(`Starting operation: ${operation}`);

      const result = fn();

      if (result instanceof Promise) {
        return result.finally(() => {
          const endTime = performance.now();
          const duration = endTime - startTime;

          operationTimesRef.current.push(duration);
          if (operationTimesRef.current.length > 100) {
            operationTimesRef.current.shift();
          }

          const averageTime =
            operationTimesRef.current.reduce((a, b) => a + b, 0) / operationTimesRef.current.length;

          setLifecycleState((prev) => ({
            ...prev,
            performanceMetrics: {
              ...prev.performanceMetrics,
              lastUpdateTime: endTime,
              operationCount: prev.performanceMetrics.operationCount + 1,
              averageOperationTime: averageTime
            }
          }));

          if (duration > performanceThreshold) {
            debugLog(`⚠️  Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
          }

          debugLog(`Completed operation: ${operation} (${duration.toFixed(2)}ms)`);
        });
      } else {
        const endTime = performance.now();
        const duration = endTime - startTime;

        operationTimesRef.current.push(duration);
        if (operationTimesRef.current.length > 100) {
          operationTimesRef.current.shift();
        }

        const averageTime =
          operationTimesRef.current.reduce((a, b) => a + b, 0) / operationTimesRef.current.length;

        setLifecycleState((prev) => ({
          ...prev,
          performanceMetrics: {
            ...prev.performanceMetrics,
            lastUpdateTime: endTime,
            operationCount: prev.performanceMetrics.operationCount + 1,
            averageOperationTime: averageTime
          }
        }));

        if (duration > performanceThreshold) {
          debugLog(`⚠️  Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
        }

        debugLog(`Completed operation: ${operation} (${duration.toFixed(2)}ms)`);
        return result;
      }
    },
    [enablePerformanceMonitoring, performanceThreshold, debugLog]
  );

  // Validation
  const validateNode = useCallback(() => {
    if (!enableValidation || !onValidate || !nodeData) return;

    try {
      const validationResult = onValidate(nodeData);
      setLifecycleState((prev) => ({
        ...prev,
        isValid: validationResult.isValid,
        errors: validationResult.errors || []
      }));

      if (!validationResult.isValid) {
        debugLog("Validation failed", validationResult.errors);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Validation error";
      setLifecycleState((prev) => ({
        ...prev,
        isValid: false,
        errors: [errorMessage]
      }));
      debugLog("Validation error", error);
    }
  }, [enableValidation, onValidate, nodeData, debugLog]);

  // Async operation tracking
  const trackAsyncOperation = useCallback(
    async <R>(operationName: string, operation: () => Promise<R>): Promise<R> => {
      activeOperationsRef.current.add(operationName);
      setLifecycleState((prev) => ({
        ...prev,
        activeOperations: new Set(activeOperationsRef.current)
      }));

      debugLog(`Starting async operation: ${operationName}`);
      onAsyncOperation?.(operationName, nodeData!);

      try {
        const result = await measurePerformance(operationName, operation);
        return result;
      } finally {
        activeOperationsRef.current.delete(operationName);
        setLifecycleState((prev) => ({
          ...prev,
          activeOperations: new Set(activeOperationsRef.current)
        }));
        debugLog(`Completed async operation: ${operationName}`);
      }
    },
    [measurePerformance, debugLog, onAsyncOperation, nodeData]
  );

  // Error handling
  const handleError = useCallback(
    (error: Error, context?: string) => {
      debugLog(`Error occurred${context ? ` in ${context}` : ""}`, error);

      setLifecycleState((prev) => ({
        ...prev,
        errors: [...prev.errors, error.message]
      }));

      // Update node data with error
      if (nodeData) {
        setNodeData(nodeId, {
          error: error.message,
          lastUpdated: Date.now()
        });
      }

      onError?.(error, nodeData!);
    },
    [debugLog, setNodeData, nodeId, nodeData, onError]
  );

  // Data update with lifecycle hooks
  const updateNodeData = useCallback(
    (updates: Partial<T>) => {
      if (!nodeData) return;

      measurePerformance("updateNodeData", () => {
        setNodeData(nodeId, {
          ...updates,
          lastUpdated: Date.now()
        });
      });
    },
    [nodeData, measurePerformance, setNodeData, nodeId]
  );

  // Cleanup
  const cleanup = useCallback(() => {
    debugLog("Cleaning up node");

    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
    }

    activeOperationsRef.current.clear();

    if (onUnmount && nodeData) {
      try {
        measurePerformance("onUnmount", () => onUnmount(nodeData));
      } catch (error) {
        handleError(error instanceof Error ? error : new Error("Unmount error"), "onUnmount");
      }
    }
  }, [debugLog, onUnmount, nodeData, measurePerformance, handleError]);

  // Mount effect
  useEffect(() => {
    if (!nodeData) return;

    mountTimeRef.current = performance.now();

    measurePerformance("onMount", async () => {
      try {
        await onMount?.(nodeData);
        setLifecycleState((prev) => ({
          ...prev,
          isInitialized: true,
          performanceMetrics: {
            ...prev.performanceMetrics,
            mountTime: performance.now()
          }
        }));
        debugLog("Node mounted successfully");
      } catch (error) {
        handleError(error instanceof Error ? error : new Error("Mount error"), "onMount");
      }
    });

    // Set up validation interval
    if (enableValidation && validationInterval > 0) {
      validationTimeoutRef.current = setInterval(validateNode, validationInterval);
    }

    // Set up cleanup timeout
    if (enableAutoCleanup && cleanupTimeout > 0) {
      cleanupTimeoutRef.current = setTimeout(() => {
        debugLog("Auto cleanup triggered");
        cleanup();
      }, cleanupTimeout);
    }

    return cleanup;
  }, [
    nodeData,
    onMount,
    measurePerformance,
    handleError,
    debugLog,
    enableValidation,
    validationInterval,
    validateNode,
    enableAutoCleanup,
    cleanupTimeout,
    cleanup
  ]);

  // Data change effect
  useEffect(() => {
    if (!nodeData || !previousDataRef.current) {
      previousDataRef.current = nodeData || null;
      return;
    }

    if (onDataChange && nodeData !== previousDataRef.current) {
      measurePerformance("onDataChange", async () => {
        try {
          await onDataChange(nodeData, previousDataRef.current!);
          debugLog("Data change handled");
        } catch (error) {
          handleError(
            error instanceof Error ? error : new Error("Data change error"),
            "onDataChange"
          );
        }
      });
    }

    previousDataRef.current = nodeData || null;
  }, [nodeData, onDataChange, measurePerformance, handleError, debugLog]);

  // Validation effect
  useEffect(() => {
    if (enableValidation) {
      validateNode();
    }
  }, [enableValidation, validateNode]);

  return {
    nodeData,
    lifecycleState,
    updateNodeData,
    trackAsyncOperation,
    handleError,
    validateNode,
    cleanup,

    // Computed properties
    isLoading: lifecycleState.activeOperations.size > 0,
    hasErrors: lifecycleState.errors.length > 0,
    isHealthy: lifecycleState.isValid && lifecycleState.errors.length === 0
  };
}
