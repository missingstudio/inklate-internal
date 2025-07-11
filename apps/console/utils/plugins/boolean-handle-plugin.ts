import { handleRegistry } from "../handles/handle-registry";
import { HandleType } from "~/enums/handle-type.enum";

handleRegistry.register({
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
  defaultIcon: "✅",
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
});
