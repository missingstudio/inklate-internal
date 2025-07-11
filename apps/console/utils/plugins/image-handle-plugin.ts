import { handleRegistry } from "../handles/handle-registry";
import { HandleType } from "~/enums/handle-type.enum";

handleRegistry.register({
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
  defaultIcon: "🖼️",
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
});
