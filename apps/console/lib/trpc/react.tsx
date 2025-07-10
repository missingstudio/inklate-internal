import { hashKey, isServer, QueryCache, QueryClient } from "@tanstack/react-query";
import { signOut } from "~/lib/auth-client";

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
                if (window.location.href.includes("/login")) return;
                window.location.href = "/login?error=required_scopes_missing";
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
export function getQueryClient() {
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
