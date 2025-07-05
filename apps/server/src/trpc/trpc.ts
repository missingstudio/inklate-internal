import { HonoContext, HonoVariables, User } from "~/ctx";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { Context } from "hono";

export type TrpcContext = {
  c: Context<HonoContext>;
} & HonoVariables;

const t = initTRPC.context<TrpcContext>().create({ transformer: superjson });

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next();
});
