import type { env } from "cloudflare:workers";

export type HonoVariables = {};
export type HonoContext = { Variables: HonoVariables; Bindings: typeof env };
