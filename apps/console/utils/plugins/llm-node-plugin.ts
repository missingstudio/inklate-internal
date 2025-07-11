import { createNodeHandleConfig } from "~/utils/handles/handle-converter";
import { addNodeType } from "~/utils/nodes/node-registry";
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
    version: 2, // Updated version to indicate new handle system
    color: "#ffffff",
    type: "llm",
    handles: createNodeHandleConfig(
      {
        // Input handles
        prompt: {
          id: `input-${generateId({ use: "nanoid", kind: "edge" })}`,
          type: HandleType.Text,
          description: "Prompt input for the LLM",
          label: "Prompt",
          order: 0,
          required: true,
          tooltip: "Enter or connect the prompt text for the LLM to process",
          style: {
            color: "#3b82f6",
            backgroundColor: "#dbeafe",
            borderColor: "#3b82f6"
          }
        }
      },
      {
        // Output handles
        response: {
          id: `output-${generateId({ use: "nanoid", kind: "edge" })}`,
          type: HandleType.Text,
          description: "LLM response output",
          label: "Response",
          order: 0,
          required: false,
          tooltip: "The generated response from the LLM",
          style: {
            color: "#10b981",
            backgroundColor: "#d1fae5",
            borderColor: "#10b981"
          }
        }
      }
    ),
    loading: false,
    error: null,
    metadata: {},
    text: "",
    model: "gpt-4o"
  },
  color: "#10b981"
});
