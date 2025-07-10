import {
  PersistQueryClientProvider,
  type PersistedClient,
  type Persister
} from "@tanstack/react-query-persist-client";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { TRPCProvider } from "@inklate/common/trpc";
import { getQueryClient } from "~/lib/trpc/react";
import { AppRouter } from "@inklate/server/trpc";
import { get, set, del } from "idb-keyval";
import superjson from "superjson";

/**
 * Creates an Indexed DB persister
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
export function createIDBPersister(idbValidKey: IDBValidKey = "reactQuery") {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey);
    },
    removeClient: async () => {
      await del(idbValidKey);
    }
  } as Persister;
}

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

export const CACHE_BURST_KEY = "cache-burst:v0.0.1";
export function QueryProvider({ children }: React.PropsWithChildren) {
  const persister = createIDBPersister("default");
  const queryClient = getQueryClient();

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, buster: CACHE_BURST_KEY, maxAge: 1000 * 60 * 60 * 24 * 3 }}
    >
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </PersistQueryClientProvider>
  );
}
