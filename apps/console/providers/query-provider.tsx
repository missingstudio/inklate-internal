import {
  PersistQueryClientProvider,
  type PersistedClient,
  type Persister
} from "@tanstack/react-query-persist-client";
import { hashKey, isServer, QueryCache, QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { AppRouter } from "@inklate/server/trpc";
import { signOut } from "~/lib/auth-client";
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

export const makeQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: (err, { meta }) => {
        if (meta && meta.noGlobalError === true) return;
        if (meta && typeof meta.customError === "string") console.error(meta.customError);
        else if (err.message === "Required scopes missing") {
          signOut({
            fetchOptions: {
              onSuccess: () => {
                if (window.location.href.includes("/signin")) return;
                window.location.href = "/signin?error=required_scopes_missing";
              }
            }
          });
        } else console.error(err.message || "Something went wrong");
      }
    }),
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        queryKeyHashFn: (queryKey) => hashKey(queryKey),
        gcTime: 1000 * 60 * 60 * 24
      },
      mutations: {
        onError: (err) => console.error(err.message)
      }
    }
  });

let browserQueryClient: QueryClient | undefined;
function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  }

  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();

  return browserQueryClient;
}

const getUrl = () => import.meta.env.VITE_PUBLIC_BACKEND_URL + "/api/trpc";
export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink({ enabled: () => true }),
    httpBatchLink({
      transformer: superjson,
      url: getUrl(),
      methodOverride: "POST",
      maxItems: 1
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
