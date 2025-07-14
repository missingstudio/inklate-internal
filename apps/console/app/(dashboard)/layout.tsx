import { SidebarInset, SidebarProvider } from "@inklate/ui/sidebar";
import { AppNavigationBar } from "~/components/navigation-bar";
import type { Route } from "../(dashboard)/+types/layout";
import { AppSidebar } from "~/components/sidebar";
import { authProxy } from "~/lib/auth-client";
import { Outlet } from "react-router";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const session = await authProxy.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.redirect(`${import.meta.env.VITE_PUBLIC_APP_URL}/login`);
  }

  return null;
}

export default function RootLayout() {
  return (
    <div className="relative flex max-h-screen w-full overflow-hidden">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 60)",
            "--header-height": "calc(var(--spacing) * 12)"
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <AppNavigationBar />
          <div className="flex flex-1 flex-col overflow-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
