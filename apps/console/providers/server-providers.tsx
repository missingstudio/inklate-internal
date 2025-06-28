import { QueryProvider } from "./query-provider";

export function ServerProviders({ children }: React.PropsWithChildren) {
  return <QueryProvider>{children}</QueryProvider>;
}
