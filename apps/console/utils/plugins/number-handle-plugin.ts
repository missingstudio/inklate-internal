import { handleRegistry } from "../handles/handle-registry";
import { HandleType } from "~/enums/handle-type.enum";

handleRegistry.register({
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
  defaultIcon: "🔢",
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
});
