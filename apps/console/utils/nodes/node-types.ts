import { createNodeHandleConfig } from "~/utils/handles/handle-converter";
import { generateId } from "@inklate/common/generate-id";
import { TextNode, LLMNode } from "~/components/nodes";
import { HandleType } from "~/enums/handle-type.enum";
import { NodeTypeDefinition } from "./node-registry";
import { nodeRegistry } from "./node-registry";

export const textNodeType: NodeTypeDefinition = {
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
};

export const llmNodeType: NodeTypeDefinition = {
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
};

export function registerNodeTypes(): void {
  nodeRegistry.register(textNodeType);
  nodeRegistry.register(llmNodeType);
}
