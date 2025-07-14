import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@inklate/ui/table";
import { useTRPCClient } from "@inklate/common/trpc";
import { useQuery } from "@tanstack/react-query";
import { siteConfig } from "~/utils/site-config";
import { Button } from "@inklate/ui/button";
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
  const {
    data: files,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["files", "getAll"],
    queryFn: () => trpcClient.files.getAll.query()
  });

  return (
    <div className="mx-auto w-full max-w-4xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-bold">Your files</h1>
        <Button onClick={() => navigate("/files/new")}>Create new file</Button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">Error loading files</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files && files.length > 0 ? (
              files.map((file: any) => (
                <TableRow key={file.id}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>
                    {file.createdAt ? new Date(file.createdAt).toLocaleString() : "-"}
                  </TableCell>
                  <TableCell>
                    {file.updatedAt ? new Date(file.updatedAt).toLocaleString() : "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/files/${file.id}`)}
                    >
                      Open
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No files found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
