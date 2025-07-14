import { Route } from "../../../(dashboard)/files/[fileId]/+types/page";
import { getServerTrpc } from "~/lib/trpc/server";
import { data, MetaFunction } from "react-router";
import { siteConfig } from "~/utils/site-config";
import { Files } from "~/components/files";

export const meta: MetaFunction = () => {
  return [
    { title: siteConfig.name },
    { name: "description", content: siteConfig.description },
    { property: "og:title", content: siteConfig.name },
    { property: "og:description", content: siteConfig.description },
    { property: "og:type", content: "website" }
  ];
};

export async function loader({ request, params }: Route.LoaderArgs) {
  const trpc = getServerTrpc(request);
  const file = await trpc.files.getById.query({ id: params.fileId as string });

  if (!file) throw data("Not Found", { status: 404 });
  return { file };
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  return <Files initialData={loaderData.file} />;
}
