import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "./trpc";
import type { TrpcContext } from "./trpc";
import { env } from "cloudflare:workers";
import { Context } from "hono";
import { getDb } from "~/db";

export const createTRPCContext = async (
  _: unknown,
  c: Context
): Promise<Omit<TrpcContext, "auth">> => {
  const db = getDb(env.DATABASE_URL);
  return { c, user: c.var["user"], db };
};

export const appRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return { greeting: "Hello world" };
  })
});

export type AppRouter = typeof appRouter;
export type Inputs = inferRouterInputs<AppRouter>;
export type Outputs = inferRouterOutputs<AppRouter>;
