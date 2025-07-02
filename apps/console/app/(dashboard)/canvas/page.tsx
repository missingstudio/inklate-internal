import { Route } from "../../(dashboard)/canvas/+types/page";
import { MetaFunction, redirect } from "react-router";
import { siteConfig } from "~/utils/site-config";
import { Canvas } from "~/components/canvas";

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
  const canvasId = "new";
  return redirect(`/canvas/${canvasId}`);
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  return <Canvas />;
}
