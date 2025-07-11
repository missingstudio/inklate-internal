import { env, WorkerEntrypoint } from "cloudflare:workers";
import { HonoContext } from "./ctx";
import { Hono } from "hono";

import { appRouter, createTRPCContext } from "./trpc";
import { modelsRouter } from "./routers/models";
import { trpcServer } from "@hono/trpc-server";
import { chatsRouter } from "./routers/chats";
import { authRouter } from "./routers/auth";
import { webSocketHandler } from "./ws";
import { getAuth } from "~/lib/auth";
import { cors } from "hono/cors";

export default class extends WorkerEntrypoint<typeof env> {
  private api = new Hono<HonoContext>()
    .use("*", async (c, next) => {
      const auth = getAuth(env.DATABASE_URL);
      const session = await auth.api.getSession({ headers: c.req.raw.headers });

      c.set("auth", auth);
      c.set("session", session?.session);
      c.set("user", session?.user);

      await next();

      c.set("user", undefined);
      c.set("auth", undefined as any);
    })
    .get("/ws", webSocketHandler)
    .route("/auth", authRouter)
    .route("/v1/chats", chatsRouter)
    .route("/v1/models", modelsRouter)
    .use(
      trpcServer({
        endpoint: "/api/trpc",
        router: appRouter,
        createContext: createTRPCContext,
        allowMethodOverride: true,
        onError: (opts) => {
          console.error("Error in TRPC handler:", opts.error);
        }
      })
    );

  private app = new Hono<HonoContext>()
    .use(
      "*",
      cors({
        origin: (c) => {
          if (c.includes(env.COOKIE_DOMAIN)) return c;
          return null;
        },
        credentials: true,
        allowHeaders: ["Content-Type", "Authorization"]
      })
    )
    .get("/", (c) => c.redirect(`${env.VITE_PUBLIC_APP_URL}`))
    .get("/health", (c) => c.json({ message: "Inklate Server is up and running!" }))
    .route("/api", this.api);

  // Expose the app for handling requests
  async fetch(request: Request) {
    return this.app.fetch(request, this.env, this.ctx);
  }
}
