import { handleRegistry } from "../handles/handle-registry";
import { HandleType } from "~/enums/handle-type.enum";

handleRegistry.register({
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
  defaultIcon: "🎲",
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
});
