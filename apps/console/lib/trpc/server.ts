import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { AppRouter, createTRPCContext } from "@inklate/server/trpc";

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { appRouter } from "@inklate/server/trpc";
import { getQueryClient } from "./react";
import superjson from "superjson";

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  queryClient: getQueryClient,
  router: appRouter
});

const getUrl = () => import.meta.env.VITE_PUBLIC_BACKEND_URL + "/api/trpc";
export const getServerTrpc = (req: Request) =>
  createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        maxItems: 1,
        url: getUrl(),
        transformer: superjson,
        headers: req.headers
      })
    ]
  });
