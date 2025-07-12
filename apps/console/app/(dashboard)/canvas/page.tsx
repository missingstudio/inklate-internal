import type { Route } from "../../(dashboard)/canvas/+types/page";
import { MetaFunction, redirect } from "react-router";
import { siteConfig } from "~/utils/site-config";
import { Home } from "~/components/home";

export const meta: MetaFunction = () => {
  return [
    { title: siteConfig.name },
    { name: "description", content: siteConfig.description },
    { property: "og:title", content: siteConfig.name },
    { property: "og:description", content: siteConfig.description },
    { property: "og:type", content: "website" }
  ];
};

export default function HomePage({ loaderData }: Route.ComponentProps) {
  return <Home />;
}
