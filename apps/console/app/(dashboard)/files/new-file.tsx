import { Route } from "../../(dashboard)/files/+types/new-file";
import { MetaFunction, redirect } from "react-router";
import { getServerTrpc } from "~/lib/trpc/server";
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

export async function loader({ request }: Route.LoaderArgs) {
  const trpc = getServerTrpc(request);
  const file = await trpc.files.create.mutate({
    name: "Untitled file",
    data: { nodes: [], edges: [] }
  });
  return redirect(`/files/${file.id}`);
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  return <></>;
}
