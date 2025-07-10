import {
  hashKey,
  isServer,
  QueryCache,
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { TRPCProvider } from "@inklate/common/trpc";
import { getQueryClient } from "~/lib/trpc/react";
import { AppRouter } from "@inklate/server/trpc";
import superjson from "superjson";

const getUrl = () => import.meta.env.VITE_PUBLIC_BACKEND_URL + "/api/trpc";
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink({ enabled: () => false }),
    httpBatchLink({
      transformer: superjson,
      url: getUrl(),
      methodOverride: "POST",
      maxItems: 1,
      fetch: (url, options) => fetch(url, { ...options, credentials: "include" })
    })
  ]
});

export function QueryProvider({ children }: React.PropsWithChildren) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
