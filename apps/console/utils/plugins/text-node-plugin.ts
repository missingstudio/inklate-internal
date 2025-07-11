import { addNodeType } from "~/utils/nodes/add-node-type";
import { generateId } from "@inklate/common/generate-id";
import { TextNode } from "~/components/nodes/text-node";
import { HandleType } from "~/enums/handle-type.enum";

addNodeType({
  id: "text",
  name: "Display Node",
  description: "A node that displays text received from other nodes.",
  category: "basic",
  component: TextNode,
  defaultData: {
    version: 1,
    color: "#ffffff",
    type: "display",
    handles: {
      input: {
        text: {
          id: `input-${generateId({ use: "nanoid", kind: "edge" })}`,
          description: "Response input to display",
          format: HandleType.Text,
          label: "Text",
          order: 1,
          required: false
        }
      },
      output: {}
    },
    loading: false,
    error: null,
    metadata: {},
    text: ""
  },
  color: "#6366f1"
});
