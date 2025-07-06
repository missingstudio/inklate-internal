import type { Route } from "../(dashboard)/+types/layout";
import { Outlet, redirect } from "react-router";
import { authProxy } from "~/lib/auth-client";

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
      <Outlet />
    </div>
  );
}
