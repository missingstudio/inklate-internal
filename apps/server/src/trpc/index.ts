import { createTRPCRouter, publicProcedure, TrpcContext } from "./trpc";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { waitlistRouter } from "./routers/waitlist";
import { modelsRouter } from "./routers/models";
import { filesRouter } from "./routers/files";
import { Context } from "hono";

export const createTRPCContext = async (
  _: unknown,
  c: Context
): Promise<Omit<TrpcContext, "auth">> => {
  return { c, user: c.var["user"], session: c.var["session"], db: c.var["db"] };
};

export const appRouter = createTRPCRouter({
  hello: publicProcedure.query(async () => {
    return { greeting: "Hello world" };
  }),
  waitlist: waitlistRouter,
  models: modelsRouter,
  files: filesRouter
});

export type AppRouter = typeof appRouter;
export type Inputs = inferRouterInputs<AppRouter>;
export type Outputs = inferRouterOutputs<AppRouter>;
