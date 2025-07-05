import { AsyncStatusUnauthorizedError } from "~/errors";
import { HonoContext } from "~/ctx";
import { Hono } from "hono";

export const authRouter = new Hono<HonoContext>()
  .get("/session", (c) => {
    const user = c.get("user");
    if (!user) {
      throw new AsyncStatusUnauthorizedError({
        message: "Unauthorized"
      });
    }

    return c.json(user);
  })
  .on(["GET", "POST", "OPTIONS"], "*", (c) => c.var.auth.handler(c.req.raw));
