import { columns } from "~/components/files/data-table/columns";
import { DataTable } from "~/components/files/data-table";
import { useTRPCClient } from "@inklate/common/trpc";
import { useQuery } from "@tanstack/react-query";
import { siteConfig } from "~/utils/site-config";
import { MetaFunction } from "react-router";
import type { Route } from "./+types/home";
import { useNavigate } from "react-router";
import * as React from "react";

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
  const trpcClient = useTRPCClient();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["files", "getAll"],
    queryFn: () => trpcClient.files.getAll.query()
  });

  const files = data?.map((file: any) => ({
    id: file.id,
    title: file.name
  }));

  return (
    <div className="hidden h-full flex-1 flex-col gap-8 p-8 md:flex">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">Here&apos;s a list of your files</p>
        </div>
      </div>
      <DataTable data={files} columns={columns} />
    </div>
  );
}
