import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { ReactFlowProvider } from "@xyflow/react";
import { Provider as JotaiProvider } from "jotai";
import { Toaster } from "@inklate/ui/sonner";
import { ThemeProvider } from "next-themes";

export function ClientProviders({ children }: React.PropsWithChildren) {
  return (
    <NuqsAdapter>
      <JotaiProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ReactFlowProvider>{children}</ReactFlowProvider>
          <Toaster />
        </ThemeProvider>
      </JotaiProvider>
    </NuqsAdapter>
  );
}
