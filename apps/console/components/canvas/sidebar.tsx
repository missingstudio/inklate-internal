import {
  IconEdit,
  IconHeadphones,
  IconPhoto,
  IconPrompt,
  IconTextPlus,
  IconVideo,
  IconCpu
} from "@tabler/icons-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@inklate/ui/command";
import { getNodeTypes } from "~/utils/nodes/node-registry";
import { Panel } from "@xyflow/react";
import { DragEvent } from "react";

const categoryIcons = {
  basic: <IconPrompt />,
  ai: <IconCpu />,
  text: <IconTextPlus />,
  image: <IconPhoto />,
  audio: <IconHeadphones />,
  video: <IconVideo />,
  editing: <IconEdit />
};

const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
  event.dataTransfer.setData("application/reactflow", nodeType);
  event.dataTransfer.effectAllowed = "move";
};

const onDragOver = (event: DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "none";
};

const onDrop = (event: DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  event.stopPropagation();
};

export const Sidebar = () => {
  const nodeTypes = getNodeTypes();

  return (
    <Panel position="top-left" onDragOver={onDragOver} onDrop={onDrop}>
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No nodes found.</CommandEmpty>
          <CommandGroup>
            {nodeTypes.map((nodeType) => (
              <CommandItem
                key={nodeType.id}
                className="dndnode max-w-[220px] !px-0 active:opacity-90 aria-selected:bg-transparent"
                onDragStart={(event: DragEvent<HTMLDivElement>) => onDragStart(event, nodeType.id)}
                draggable
              >
                <div
                  key={nodeType.id}
                  className={`input cursor-grab ${nodeType.id} border-foreground/1 flex h-fit w-full flex-row items-center gap-2 border-[1px] border-solid p-3`}
                >
                  <div className="text-foreground">
                    {nodeType.icon || (categoryIcons as any)[nodeType.category] || <IconPrompt />}
                  </div>
                  <div>
                    <h6 className="text-foreground text-sm font-semibold">{nodeType.name}</h6>
                    <p className="text-foreground/50 line-clamp-2 overflow-hidden text-xs leading-4">
                      {nodeType.description}
                    </p>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </Panel>
  );
};
