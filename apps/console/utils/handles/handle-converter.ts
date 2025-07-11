import { HandleConfig, NodeHandleConfig } from "~/types/handle";
import { getHandleTypeDefinition } from "./handle-registry";
import { HandleType } from "~/enums/handle-type.enum";

// Get handles as HandleConfig array
export function getHandleConfigs(handles: NodeHandleConfig): {
  input: HandleConfig[];
  output: HandleConfig[];
} {
  return {
    input: Object.values(handles.input?.handles || {}),
    output: Object.values(handles.output?.handles || {})
  };
}

// Create a new handle config with default values
export function createHandleConfig(
  id: string,
  type: HandleType,
  options: Partial<HandleConfig> = {}
): HandleConfig {
  const typeDefinition = getHandleTypeDefinition(type);

  return {
    id,
    type,
    description: options.description || `${type} handle`,
    required: options.required || false,
    order: options.order || 0,
    style: {
      ...typeDefinition?.defaultStyle,
      ...options.style
    },
    icon: options.icon || typeDefinition?.defaultIcon,
    tooltip: options.tooltip || options.description || `${type} handle`,
    ...options
  };
}

// Create a basic node handle configuration
export function createNodeHandleConfig(
  inputHandles: Record<string, Partial<HandleConfig> & { type: HandleType }> = {},
  outputHandles: Record<string, Partial<HandleConfig> & { type: HandleType }> = {}
): NodeHandleConfig {
  const input: Record<string, HandleConfig> = {};
  const output: Record<string, HandleConfig> = {};

  // Create input handles
  Object.entries(inputHandles).forEach(([key, config]) => {
    input[key] = createHandleConfig(config.id || key, config.type, config);
  });

  // Create output handles
  Object.entries(outputHandles).forEach(([key, config]) => {
    output[key] = createHandleConfig(config.id || key, config.type, config);
  });

  return {
    input: {
      handles: input,
      layout: {
        spacing: 30,
        alignment: "distributed",
        grouping: "none"
      }
    },
    output: {
      handles: output,
      layout: {
        spacing: 30,
        alignment: "distributed",
        grouping: "none"
      }
    }
  };
}
