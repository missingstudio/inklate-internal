import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { createTRPCContext } from "@inklate/server/trpc";

import { appRouter } from "@inklate/server/trpc";
import { getQueryClient } from "./react";

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  queryClient: getQueryClient,
  router: appRouter
});
