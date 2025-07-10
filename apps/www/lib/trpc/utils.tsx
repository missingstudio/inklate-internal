import type { TRPCQueryOptions } from "@trpc/tanstack-react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "./react";

export function HydrateClient(props: React.PropsWithChildren) {
  const queryClient = getQueryClient();
  return <HydrationBoundary state={dehydrate(queryClient)}>{props.children}</HydrationBoundary>;
}
export function prefetch<TQueryOptions extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: TQueryOptions
) {
  const queryClient = getQueryClient();

  if (queryOptions.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
