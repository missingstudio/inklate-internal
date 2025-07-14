import type { Route } from "../../(dashboard)/files/+types/layout";
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
  return <Outlet />;
}
