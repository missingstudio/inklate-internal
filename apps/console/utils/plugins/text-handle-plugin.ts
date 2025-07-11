import { handleRegistry } from "../handles/handle-registry";
import { HandleType } from "~/enums/handle-type.enum";

handleRegistry.register({
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
  defaultIcon: "📝",
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
});
