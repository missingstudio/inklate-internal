import { Route } from "../../(dashboard)/settings/+types/page";
import { MetaFunction, redirect } from "react-router";
import { siteConfig } from "~/utils/site-config";

export const meta: MetaFunction = () => {
  return [
    { title: `Settings - ${siteConfig.name}` },
    { name: "description", content: "Manage your personal settings and preferences" },
    { property: "og:title", content: `Settings - ${siteConfig.name}` },
    { property: "og:description", content: "Manage your personal settings and preferences" },
    { property: "og:type", content: "website" }
  ];
};

export async function loader() {
  // Redirect to profile page by default
  return redirect("/settings/profile");
}

export default function SettingsPage({ loaderData }: Route.ComponentProps) {
  return null;
}
