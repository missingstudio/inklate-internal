import { AsyncStatusUnauthorizedError } from "~/errors";
import { textModels } from "~/lib/models/text";
import { HonoContext } from "~/ctx";
import { Hono } from "hono";

export const modelsRouter = new Hono<HonoContext>().get("/", async (c) => {
  const user = c.get("user");
  if (!user) {
    throw new AsyncStatusUnauthorizedError({
      message: "Unauthorized"
    });
  }

  try {
    const models = Object.entries(textModels).map(([key, model]) => ({
      id: key,
      label: model.label,
      provider: model.provider.name,
      priceIndicator: model.priceIndicator,
      default: model.default,
      disabled: model.disabled
    }));

    return c.json({ models });
  } catch (error) {
    console.error("Models API error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});
