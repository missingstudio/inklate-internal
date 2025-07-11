import { AsyncStatusUnauthorizedError } from "~/errors";
import { textModels } from "~/lib/models/text";
import { HonoContext } from "~/ctx";
import { streamText } from "ai";
import { Hono } from "hono";
import { z } from "zod";

const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string()
    })
  ),
  model: z.string().optional().default("gpt-4o"),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  maxTokens: z.number().min(1).max(4000).optional().default(1000)
});

export const chatsRouter = new Hono<HonoContext>().post("/", async (c) => {
  const user = c.get("user");
  if (user) {
    throw new AsyncStatusUnauthorizedError({
      message: "Unauthorized"
    });
  }

  try {
    const body = await c.req.json();
    const { messages, model: modelName, temperature, maxTokens } = ChatRequestSchema.parse(body);

    const modelConfig = textModels[modelName];
    if (!modelConfig) {
      console.error("Invalid model specified:", modelName);
      return c.json({ error: `Invalid model specified: ${modelName}` }, 400);
    }

    const provider = modelConfig.providers[0];
    if (!provider) {
      console.error("No provider available for model:", modelName);
      return c.json({ error: "No provider available for this model" }, 500);
    }

    console.log("Attempting to stream text with model:", provider.model);
    const result = await streamText({
      model: provider.model,
      messages,
      temperature,
      maxTokens,
      system:
        "You are a helpful AI assistant. Provide accurate and helpful responses to user questions.",
      onFinish: async ({ usage }) => {
        const cost = provider.getCost({
          input: usage.promptTokens,
          output: usage.completionTokens
        });
        console.log(`Total cost for this request: $${cost.toFixed(2)}`);
      }
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    if (error instanceof z.ZodError) {
      return c.json(
        {
          error: "Invalid request format",
          details: error.errors
        },
        400
      );
    }

    return c.json({ error: "Internal server error" }, 500);
  }
});
