import { HonoContext, HonoVariables, User } from "~/ctx";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { Context } from "hono";
import { DB } from "~/db";

export type TrpcContext = {
  db: DB;
  user: User;
  c: Context<HonoContext>;
} & HonoVariables;

const t = initTRPC.context<TrpcContext>().create({ transformer: superjson });

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
