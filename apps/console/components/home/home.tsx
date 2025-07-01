import { useTRPC } from "~/providers/query-provider";
import { useQuery } from "@tanstack/react-query";

export function Home() {
  const trpc = useTRPC();
  const { data: hello, isLoading: isLoadingLabels } = useQuery(trpc.hello.queryOptions());
  return null;
}
