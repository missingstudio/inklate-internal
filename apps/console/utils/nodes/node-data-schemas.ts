import { HandleType } from "~/enums/handle-type.enum";
import { z } from "zod";

// Base schemas for different data types
export const TextDataSchema = z.object({
  type: z.literal("text"),
  value: z.string(),
  metadata: z.record(z.any()).optional()
});

export const NumberDataSchema = z.object({
  type: z.literal("number"),
  value: z.number(),
  metadata: z.record(z.any()).optional()
});

export const BooleanDataSchema = z.object({
  type: z.literal("boolean"),
  value: z.boolean(),
  metadata: z.record(z.any()).optional()
});

export const ArrayDataSchema = z.object({
  type: z.literal("array"),
  value: z.array(z.any()),
  metadata: z.record(z.any()).optional()
});

export const ImageDataSchema = z.object({
  type: z.literal("image"),
  value: z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional()
  }),
  metadata: z.record(z.any()).optional()
});

export const AudioDataSchema = z.object({
  type: z.literal("audio"),
  value: z.object({
    url: z.string().url(),
    duration: z.number().optional(),
    format: z.string().optional()
  }),
  metadata: z.record(z.any()).optional()
});

export const VideoDataSchema = z.object({
  type: z.literal("video"),
  value: z.object({
    url: z.string().url(),
    duration: z.number().optional(),
    format: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional()
  }),
  metadata: z.record(z.any()).optional()
});

export const ThreeDDataSchema = z.object({
  type: z.literal("3d"),
  value: z.object({
    url: z.string().url(),
    format: z.string().optional()
  }),
  metadata: z.record(z.any()).optional()
});

// Union schema for all data types
export const NodeDataSchema = z.union([
  TextDataSchema,
  NumberDataSchema,
  BooleanDataSchema,
  ArrayDataSchema,
  ImageDataSchema,
  AudioDataSchema,
  VideoDataSchema,
  ThreeDDataSchema
]);

export type NodeData = z.infer<typeof NodeDataSchema>;
export type TextData = z.infer<typeof TextDataSchema>;
export type NumberData = z.infer<typeof NumberDataSchema>;
export type BooleanData = z.infer<typeof BooleanDataSchema>;
export type ArrayData = z.infer<typeof ArrayDataSchema>;
export type ImageData = z.infer<typeof ImageDataSchema>;
export type AudioData = z.infer<typeof AudioDataSchema>;
export type VideoData = z.infer<typeof VideoDataSchema>;
export type ThreeDData = z.infer<typeof ThreeDDataSchema>;

// LLM specific schemas
export const LLMResponseSchema = z.object({
  text: z.string(),
  tokens: z
    .object({
      input: z.number().optional(),
      output: z.number().optional(),
      total: z.number().optional()
    })
    .optional(),
  model: z.string().optional(),
  timestamp: z.string().optional()
});

export type LLMResponse = z.infer<typeof LLMResponseSchema>;

// Handle validation schema
export const HandleSchema = z.object({
  id: z.string(),
  description: z.string(),
  format: z.nativeEnum(HandleType),
  label: z.string().optional(),
  order: z.number(),
  required: z.boolean()
});

export type ValidatedHandle = z.infer<typeof HandleSchema>;

// Connection validation schema
export const ConnectionValidationSchema = z.object({
  sourceNodeType: z.string(),
  targetNodeType: z.string(),
  sourceHandle: HandleSchema,
  targetHandle: HandleSchema,
  data: NodeDataSchema
});

export type ConnectionValidation = z.infer<typeof ConnectionValidationSchema>;

// Helper functions for data conversion
export const convertToNodeData = (value: any, type: HandleType): NodeData => {
  switch (type) {
    case HandleType.Text:
      return { type: "text", value: String(value) };
    case HandleType.Number:
      return { type: "number", value: Number(value) };
    case HandleType.Boolean:
      return { type: "boolean", value: Boolean(value) };
    case HandleType.Array:
      return { type: "array", value: Array.isArray(value) ? value : [value] };
    case HandleType.Image:
      return {
        type: "image",
        value: typeof value === "string" ? { url: value } : value
      };
    case HandleType.Audio:
      return {
        type: "audio",
        value: typeof value === "string" ? { url: value } : value
      };
    case HandleType.Video:
      return {
        type: "video",
        value: typeof value === "string" ? { url: value } : value
      };
    case HandleType.ThreeD:
      return {
        type: "3d",
        value: typeof value === "string" ? { url: value } : value
      };
    default:
      return { type: "text", value: String(value) };
  }
};

// Function to convert LLM response to text data
export const convertLLMResponseToText = (response: LLMResponse): TextData => {
  return {
    type: "text",
    value: response.text,
    metadata: {
      tokens: response.tokens,
      model: response.model,
      timestamp: response.timestamp
    }
  };
};

// Validation functions
export const validateDataTransfer = (
  sourceData: any,
  sourceHandle: ValidatedHandle,
  targetHandle: ValidatedHandle
): { isValid: boolean; convertedData?: NodeData; error?: string } => {
  try {
    // Check if handle types are compatible
    if (!areHandleTypesCompatible(sourceHandle.format, targetHandle.format)) {
      return {
        isValid: false,
        error: `Incompatible handle types: ${sourceHandle.format} -> ${targetHandle.format}`
      };
    }

    // Convert source data to target format
    const convertedData = convertToNodeData(sourceData, targetHandle.format);
    console.log(sourceData, targetHandle.format, convertedData);

    // Validate the converted data
    const validatedData = NodeDataSchema.parse(convertedData);

    return {
      isValid: true,
      convertedData: validatedData
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Validation failed"
    };
  }
};

// Function to check if handle types are compatible
export const areHandleTypesCompatible = (
  sourceType: HandleType,
  targetType: HandleType
): boolean => {
  // Direct type match
  if (sourceType === targetType) return true;

  // Text can be converted to most types
  if (sourceType === HandleType.Text) {
    return [HandleType.Text, HandleType.Number, HandleType.Boolean].includes(targetType);
  }

  // Numbers can be converted to text or boolean
  if (sourceType === HandleType.Number) {
    return [HandleType.Text, HandleType.Number, HandleType.Boolean].includes(targetType);
  }

  // Booleans can be converted to text or number
  if (sourceType === HandleType.Boolean) {
    return [HandleType.Text, HandleType.Number, HandleType.Boolean].includes(targetType);
  }

  // Arrays are only compatible with arrays or text (as JSON)
  if (sourceType === HandleType.Array) {
    return [HandleType.Array, HandleType.Text].includes(targetType);
  }

  // Media types are only compatible with same type or text (as URL)
  if (
    [HandleType.Image, HandleType.Audio, HandleType.Video, HandleType.ThreeD].includes(sourceType)
  ) {
    return sourceType === targetType || targetType === HandleType.Text;
  }

  return false;
};
