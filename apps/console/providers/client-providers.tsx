import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { Toaster } from "@inklate/ui/sonner";

export function ClientProviders({ children }: React.PropsWithChildren) {
  return (
    <NuqsAdapter>
      {children}
      <Toaster />
    </NuqsAdapter>
  );
}
