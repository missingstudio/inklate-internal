import { createNodeHandleConfig } from "~/utils/handles/handle-converter";
import { addNodeType } from "~/utils/nodes/node-registry";
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
    handles: createNodeHandleConfig(
      {
        // Input handles
        text: {
          id: `input-${generateId({ use: "nanoid", kind: "edge" })}`,
          type: HandleType.Text,
          description: "Text input to display",
          label: "Text",
          order: 1,
          required: false,
          tooltip: "Connect text output from other nodes to display here"
        }
      },
      {
        // Output handles - none for display node
      }
    ),
    loading: false,
    error: null,
    metadata: {},
    text: ""
  },
  color: "#6366f1"
});
