import { IconBrandEmber } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@inklate/common/trpc";
import { Button } from "@inklate/ui/button";
import { useNavigate } from "react-router";

export function Home() {
  const trpc = useTRPC();
  const helloQuery = trpc.hello.queryOptions();
  const { data, isLoading, error } = useQuery(helloQuery);

  const navigate = useNavigate();
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-4 flex h-[280px] w-full max-w-lg flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300">
        <IconBrandEmber size={64} className="mb-4 text-gray-300" />
        <Button
          onClick={() => navigate("/canvas/new")}
          size="sm"
          variant="default"
          className="cursor-pointer"
        >
          Create a new canvas {data?.greeting}
        </Button>
      </div>
    </div>
  );
}
