import { IconCirclePlusFilled } from "@tabler/icons-react";
import { Button } from "@inklate/ui/button";
import { useNavigate } from "react-router";

function ColorfulPlusIcon() {
  return (
    <div className="relative h-8 w-8">
      <div className="absolute top-0 left-0 h-2 w-2 rounded-sm bg-teal-400"></div>
      <div className="absolute top-0 right-0 h-2 w-2 rounded-sm bg-pink-400"></div>
      <div className="absolute bottom-0 left-0 h-2 w-2 rounded-sm bg-orange-400"></div>
      <div className="absolute right-0 bottom-0 h-2 w-2 rounded-sm bg-yellow-400"></div>
      <div className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-blue-400"></div>
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="mx-4 flex max-w-lg flex-col items-center justify-center text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <ColorfulPlusIcon />
          </div>

          <div className="mb-4 space-y-2">
            <h1 className="text-xl font-semibold">It's empty here</h1>
            <p className="text-sm text-gray-600">Create a new file now</p>
          </div>

          <Button size="sm" onClick={() => navigate("/files/new")}>
            <IconCirclePlusFilled />
            Create new file
          </Button>
        </div>
      </div>
    </div>
  );
}
