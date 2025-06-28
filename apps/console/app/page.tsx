import { MetaFunction, redirect } from "react-router";
import { siteConfig } from "~/lib/site-config";
import { Home } from "~/components/home/home";
import { authProxy } from "~/lib/auth-client";
import type { Route } from "./+types/page";

export const meta: MetaFunction = () => {
  return [
    { title: siteConfig.name },
    { name: "description", content: siteConfig.description },
    { property: "og:title", content: siteConfig.name },
    { property: "og:description", content: siteConfig.description },
    { property: "og:type", content: "website" }
  ];
};

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const session = await authProxy.api.getSession({ headers: request.headers });
  if (!session?.user?.id) throw redirect("/signin");

  return null;
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  return <Home />;
}
