import { handleRegistry } from "../handles/handle-registry";
import { HandleType } from "~/enums/handle-type.enum";

handleRegistry.register({
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
  defaultIcon: "📋",
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
});
