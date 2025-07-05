import { MetaFunction, redirect } from "react-router";
import { siteConfig } from "~/utils/site-config";
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

export default function HomePage({ loaderData }: Route.ComponentProps) {
  return <Home />;
}
