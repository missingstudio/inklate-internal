import { useNodeLifecycle, NodeLifecycleConfig } from "~/hooks/use-node-lifecycle";
import { BaseNodeData, NodeLifecycleUtilities } from "~/types/node";
import React, { useCallback, useMemo } from "react";
import { WrappedNodeProps } from "./wrap-node";

export interface WithLifecycleConfig<T extends BaseNodeData>
  extends Omit<NodeLifecycleConfig<T>, "nodeId"> {
  // Additional HOC-specific options
  displayName?: string;
  enableLifecycleIndicators?: boolean;
  enablePerformanceDisplay?: boolean;
}

export function withLifecycle<T extends BaseNodeData>(
  WrappedComponent: React.ComponentType<
    WrappedNodeProps<T> & { lifecycle: NodeLifecycleUtilities }
  >,
  config: WithLifecycleConfig<T> = {}
) {
  const {
    displayName = WrappedComponent.displayName || WrappedComponent.name || "Component",
    enableLifecycleIndicators = true,
    enablePerformanceDisplay = false,
    ...lifecycleConfig
  } = config;

  const WithLifecycleComponent = (props: WrappedNodeProps<T>) => {
    const { id, data, updateData, ...restProps } = props;

    const {
      nodeData,
      lifecycleState,
      updateNodeData,
      trackAsyncOperation,
      handleError,
      validateNode,
      cleanup,
      isLoading,
      hasErrors,
      isHealthy
    } = useNodeLifecycle<T>({
      nodeId: id,
      ...lifecycleConfig
    });

    // Enhanced update function that goes through lifecycle
    const enhancedUpdateData = useCallback(
      (updates: Partial<T>) => {
        updateNodeData(updates);
      },
      [updateNodeData]
    );

    // Enhanced data with lifecycle state
    const enhancedData = useMemo(() => {
      if (!nodeData) return data;

      return {
        ...nodeData,

        // Add lifecycle state to data
        _lifecycle: {
          isInitialized: lifecycleState.isInitialized,
          isValid: lifecycleState.isValid,
          errors: lifecycleState.errors,
          performanceMetrics: lifecycleState.performanceMetrics,
          activeOperations: Array.from(lifecycleState.activeOperations),
          isLoading,
          hasErrors,
          isHealthy
        },
        // Override loading state if we have active operations
        loading: isLoading || nodeData.loading,
        // Combine errors
        error: hasErrors ? lifecycleState.errors.join(", ") : nodeData.error
      } as T;
    }, [nodeData, data, lifecycleState, isLoading, hasErrors, isHealthy]);

    // Add lifecycle utilities to props
    const enhancedProps = useMemo(
      () => ({
        ...restProps,
        id,
        data: enhancedData,
        updateData: enhancedUpdateData,
        // Add lifecycle utilities
        lifecycle: {
          trackAsyncOperation,
          handleError,
          validateNode,
          cleanup,
          state: lifecycleState,
          isLoading,
          hasErrors,
          isHealthy
        }
      }),
      [
        restProps,
        id,
        enhancedData,
        enhancedUpdateData,
        trackAsyncOperation,
        handleError,
        validateNode,
        cleanup,
        lifecycleState,
        isLoading,
        hasErrors,
        isHealthy
      ]
    );

    // Render lifecycle indicators if enabled
    const renderLifecycleIndicators = () => {
      if (!enableLifecycleIndicators) return null;

      return (
        <div className="absolute -top-2 -right-2 flex space-x-1">
          {!lifecycleState.isInitialized && (
            <div className="h-2 w-2 rounded-full bg-yellow-400" title="Initializing..." />
          )}
          {isLoading && (
            <div
              className="h-2 w-2 animate-pulse rounded-full bg-blue-400"
              title={`Loading: ${Array.from(lifecycleState.activeOperations).join(", ")}`}
            />
          )}
          {hasErrors && (
            <div
              className="h-2 w-2 rounded-full bg-red-400"
              title={`Errors: ${lifecycleState.errors.join(", ")}`}
            />
          )}
          {!lifecycleState.isValid && (
            <div className="h-2 w-2 rounded-full bg-orange-400" title="Validation failed" />
          )}
          {isHealthy && lifecycleState.isInitialized && (
            <div className="h-2 w-2 rounded-full bg-green-400" title="Healthy" />
          )}
        </div>
      );
    };

    // Render performance display if enabled
    const renderPerformanceDisplay = () => {
      if (!enablePerformanceDisplay) return null;

      const { performanceMetrics } = lifecycleState;

      return (
        <div className="absolute right-0 -bottom-6 left-0 rounded bg-gray-50 px-2 py-1 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Ops: {performanceMetrics.operationCount}</span>
            <span>Avg: {performanceMetrics.averageOperationTime.toFixed(1)}ms</span>
            <span>Active: {lifecycleState.activeOperations.size}</span>
          </div>
        </div>
      );
    };

    return (
      <div className="relative">
        <WrappedComponent {...enhancedProps} />
        {renderLifecycleIndicators()}
        {renderPerformanceDisplay()}
      </div>
    );
  };

  WithLifecycleComponent.displayName = `withLifecycle(${displayName})`;

  return WithLifecycleComponent;
}

// Convenience function for creating lifecycle-enabled nodes
export function createLifecycleNode<T extends BaseNodeData>(
  component: React.ComponentType<WrappedNodeProps<T> & { lifecycle: NodeLifecycleUtilities }>,
  config: WithLifecycleConfig<T> = {}
) {
  return withLifecycle(component, config);
}

// Common lifecycle configurations
export const lifecycleConfigs = {
  // Basic lifecycle with error handling and validation
  basic: {
    enablePerformanceMonitoring: true,
    enableValidation: true,
    enableAutoCleanup: true,
    enableDebug: false
  },

  // Development lifecycle with debug logging
  development: {
    enablePerformanceMonitoring: true,
    enableValidation: true,
    enableAutoCleanup: true,
    enableDebug: true,
    enableLifecycleIndicators: true,
    enablePerformanceDisplay: true
  },

  // Production lifecycle with optimizations
  production: {
    enablePerformanceMonitoring: true,
    enableValidation: false,
    enableAutoCleanup: true,
    enableDebug: false,
    enableLifecycleIndicators: false,
    enablePerformanceDisplay: false
  },

  // Performance-focused lifecycle
  performance: {
    enablePerformanceMonitoring: true,
    performanceThreshold: 100,
    enableValidation: false,
    enableAutoCleanup: true,
    enableDebug: false,
    enableLifecycleIndicators: false,
    enablePerformanceDisplay: true
  }
};
