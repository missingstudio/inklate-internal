import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { HotkeysProvider } from "react-hotkeys-hook";
import { ReactFlowProvider } from "@xyflow/react";
import { Toaster } from "@inklate/ui/sonner";
import { ThemeProvider } from "next-themes";

export function ClientProviders({ children }: React.PropsWithChildren) {
  return (
    <NuqsAdapter>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <ReactFlowProvider>
          <HotkeysProvider>{children}</HotkeysProvider>
        </ReactFlowProvider>
        <Toaster />
      </ThemeProvider>
    </NuqsAdapter>
  );
}
