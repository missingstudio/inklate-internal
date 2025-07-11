import { handleRegistry } from "../handles/handle-registry";
import { HandleType } from "~/enums/handle-type.enum";

handleRegistry.register({
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
  defaultIcon: "🔊",
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
});
