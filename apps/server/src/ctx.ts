import type { env } from "cloudflare:workers";
import { Session } from "better-auth";
import { Auth } from "./lib/auth";
import { DB } from "./db";

export type User = NonNullable<Awaited<ReturnType<Auth["api"]["getSession"]>>>["user"];

export type HonoVariables = {
  auth: Auth;
  db: DB;
  user?: User;
  session?: Session;
};

export type HonoContext = { Variables: HonoVariables; Bindings: typeof env };
