import { createTRPCRouter, publicProcedure, TrpcContext } from "./trpc";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { waitlistRouter } from "./routers/waitlist";
import { Context } from "hono";

export const createTRPCContext = async (
  _: unknown,
  c: Context
): Promise<Omit<TrpcContext, "auth">> => {
  return { c, user: c.var["user"], session: c.var["session"] };
};

export const appRouter = createTRPCRouter({
  hello: publicProcedure.query(async () => {
    return { greeting: "Hello world" };
  }),
  waitlist: waitlistRouter
});

export type AppRouter = typeof appRouter;
export type Inputs = inferRouterInputs<AppRouter>;
export type Outputs = inferRouterOutputs<AppRouter>;
