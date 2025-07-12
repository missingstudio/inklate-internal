import { HandleType } from "~/enums/handle-type.enum";
import { HandleTypeDefinition } from "~/types/handle";
import { handleRegistry } from "./handle-registry";

export const textHandleType: HandleTypeDefinition = {
  type: HandleType.Text,
  name: "Text",
  description: "String data type",
  defaultStyle: {
    color: "#3b82f6",
    backgroundColor: "#dbeafe",
    borderColor: "#3b82f6",
    size: "medium",
    shape: "circle"
  },
  compatibleWith: [HandleType.Text, HandleType.Number, HandleType.Boolean],
  validator: (data) => typeof data === "string",
  transformer: (data, targetType) => {
    switch (targetType) {
      case HandleType.Number:
        return parseFloat(data) || 0;
      case HandleType.Boolean:
        return Boolean(data && data.toLowerCase() !== "false");
      default:
        return String(data);
    }
  }
};

export const numberHandleType: HandleTypeDefinition = {
  type: HandleType.Number,
  name: "Number",
  description: "Numeric data type",
  defaultStyle: {
    color: "#10b981",
    backgroundColor: "#d1fae5",
    borderColor: "#10b981",
    size: "medium",
    shape: "circle"
  },
  compatibleWith: [HandleType.Text, HandleType.Number, HandleType.Boolean],
  validator: (data) => typeof data === "number" && !isNaN(data),
  transformer: (data, targetType) => {
    switch (targetType) {
      case HandleType.Text:
        return String(data);
      case HandleType.Boolean:
        return Boolean(data && data !== 0);
      default:
        return Number(data);
    }
  }
};

export const booleanHandleType: HandleTypeDefinition = {
  type: HandleType.Boolean,
  name: "Boolean",
  description: "Boolean data type",
  defaultStyle: {
    color: "#8b5cf6",
    backgroundColor: "#ede9fe",
    borderColor: "#8b5cf6",
    size: "medium",
    shape: "circle"
  },
  compatibleWith: [HandleType.Text, HandleType.Number, HandleType.Boolean],
  validator: (data) => typeof data === "boolean",
  transformer: (data, targetType) => {
    switch (targetType) {
      case HandleType.Text:
        return String(data);
      case HandleType.Number:
        return data ? 1 : 0;
      default:
        return Boolean(data);
    }
  }
};

export const arrayHandleType: HandleTypeDefinition = {
  type: HandleType.Array,
  name: "Array",
  description: "Array data type",
  defaultStyle: {
    color: "#f59e0b",
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
    size: "medium",
    shape: "square"
  },
  compatibleWith: [HandleType.Array, HandleType.Text],
  validator: (data) => Array.isArray(data),
  transformer: (data, targetType) => {
    switch (targetType) {
      case HandleType.Text:
        return JSON.stringify(data);
      default:
        return data;
    }
  }
};

export const imageHandleType: HandleTypeDefinition = {
  type: HandleType.Image,
  name: "Image",
  description: "Image data type",
  defaultStyle: {
    color: "#ec4899",
    backgroundColor: "#fce7f3",
    borderColor: "#ec4899",
    size: "medium",
    shape: "diamond"
  },
  compatibleWith: [HandleType.Image, HandleType.Text],
  validator: (data) => {
    if (typeof data === "string") {
      return data.startsWith("data:image/") || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(data);
    }
    return data instanceof File && data.type.startsWith("image/");
  },
  transformer: (data, targetType) => {
    switch (targetType) {
      case HandleType.Text:
        return data instanceof File ? data.name : String(data);
      default:
        return data;
    }
  }
};

export const videoHandleType: HandleTypeDefinition = {
  type: HandleType.Video,
  name: "Video",
  description: "Video data type",
  defaultStyle: {
    color: "#dc2626",
    backgroundColor: "#fee2e2",
    borderColor: "#dc2626",
    size: "medium",
    shape: "diamond"
  },
  compatibleWith: [HandleType.Video, HandleType.Text],
  validator: (data) => {
    if (typeof data === "string") {
      return data.startsWith("data:video/") || /\.(mp4|webm|ogg|avi|mov)$/i.test(data);
    }
    return data instanceof File && data.type.startsWith("video/");
  },
  transformer: (data, targetType) => {
    switch (targetType) {
      case HandleType.Text:
        return data instanceof File ? data.name : String(data);
      default:
        return data;
    }
  }
};

export const audioHandleType: HandleTypeDefinition = {
  type: HandleType.Audio,
  name: "Audio",
  description: "Audio data type",
  defaultStyle: {
    color: "#06b6d4",
    backgroundColor: "#cffafe",
    borderColor: "#06b6d4",
    size: "medium",
    shape: "diamond"
  },
  compatibleWith: [HandleType.Audio, HandleType.Text],
  validator: (data) => {
    if (typeof data === "string") {
      return data.startsWith("data:audio/") || /\.(mp3|wav|ogg|m4a|flac)$/i.test(data);
    }
    return data instanceof File && data.type.startsWith("audio/");
  },
  transformer: (data, targetType) => {
    switch (targetType) {
      case HandleType.Text:
        return data instanceof File ? data.name : String(data);
      default:
        return data;
    }
  }
};

export const threeDHandleType: HandleTypeDefinition = {
  type: HandleType.ThreeD,
  name: "3D Model",
  description: "3D model data type",
  defaultStyle: {
    color: "#7c3aed",
    backgroundColor: "#f3e8ff",
    borderColor: "#7c3aed",
    size: "medium",
    shape: "diamond"
  },
  compatibleWith: [HandleType.ThreeD, HandleType.Text],
  validator: (data) => {
    if (typeof data === "string") {
      return /\.(obj|fbx|gltf|glb|dae|3ds|blend)$/i.test(data);
    }
    return (
      data instanceof File &&
      ["model/obj", "model/gltf+json", "model/gltf-binary"].includes(data.type)
    );
  },
  transformer: (data, targetType) => {
    switch (targetType) {
      case HandleType.Text:
        return data instanceof File ? data.name : String(data);
      default:
        return data;
    }
  }
};

export function registerHandleTypes(): void {
  handleRegistry.register(textHandleType);
  handleRegistry.register(numberHandleType);
  handleRegistry.register(booleanHandleType);
  handleRegistry.register(arrayHandleType);
  handleRegistry.register(imageHandleType);
  handleRegistry.register(videoHandleType);
  handleRegistry.register(audioHandleType);
  handleRegistry.register(threeDHandleType);
}
