import { handleRegistry } from "../handles/handle-registry";
import { HandleType } from "~/enums/handle-type.enum";

handleRegistry.register({
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
  defaultIcon: "🎥",
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
});
