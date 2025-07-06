import { MetaFunction, redirect } from "react-router";
import { Route } from "../(settings)/+types/page";
import { siteConfig } from "~/utils/site-config";

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
  return <div>Personal</div>;
}
