import { HotkeysProvider } from "react-hotkeys-hook";
import { Toaster } from "@inklate/ui/sonner";
import { ThemeProvider } from "next-themes";

export function ClientProviders({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <HotkeysProvider>{children}</HotkeysProvider>
      <Toaster />
    </ThemeProvider>
  );
}
