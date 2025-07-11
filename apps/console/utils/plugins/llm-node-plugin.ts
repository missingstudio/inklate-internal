import { addNodeType } from "~/utils/nodes/add-node-type";
import { generateId } from "@inklate/common/generate-id";
import { LLMNode } from "~/components/nodes/llm-node";
import { HandleType } from "~/enums/handle-type.enum";

addNodeType({
  id: "llm",
  name: "LLM Node",
  description: "Run a prompt through an LLM.",
  category: "ai",
  component: LLMNode,
  defaultData: {
    version: 1,
    color: "#ffffff",
    type: "llm",
    handles: {
      input: {
        prompt: {
          id: `input-${generateId({ use: "nanoid", kind: "edge" })}`,
          description: "Prompt input",
          format: HandleType.Text,
          label: "Prompt",
          order: 0,
          required: true
        }
      },
      output: {
        response: {
          id: `output-${generateId({ use: "nanoid", kind: "edge" })}`,
          description: "LLM response",
          format: HandleType.Text,
          label: "Text",
          order: 0,
          required: false
        }
      }
    },
    loading: false,
    error: null,
    metadata: {},
    text: "",
    model: "gpt-4o"
  },
  color: "#10b981"
});
