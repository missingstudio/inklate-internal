import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@inklate/ui/command";
import {
  IconEdit,
  IconHeadphones,
  IconPhoto,
  IconPrompt,
  IconTextPlus,
  IconVideo
} from "@tabler/icons-react";
import { Panel } from "@xyflow/react";
import { DragEvent } from "react";

const categories = {
  text: {
    name: "Text",
    icon: <IconPrompt />
  },
  image: {
    name: "Image",
    icon: <IconPhoto />
  },
  audio: {
    name: "Audio",
    icon: <IconHeadphones />
  },
  video: {
    name: "Video",
    icon: <IconVideo />
  },
  editing: {
    name: "Editing",
    icon: <IconEdit />
  }
};

const nodes = [
  {
    category: "text",
    name: "LLM",
    type: "llm",
    description: "Run a prompt through an LLM.",
    icon: <IconPrompt />
  },
  {
    category: "text",
    name: "Display",
    type: "text",
    description: "Display text from connected nodes.",
    icon: <IconTextPlus />
  }
];

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
  return (
    <Panel position="top-left" onDragOver={onDragOver} onDrop={onDrop}>
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No nodes found.</CommandEmpty>
          <CommandGroup>
            {nodes.map((node) => (
              <CommandItem
                key={node.name}
                className="dndnode max-w-[220px] !px-0 active:opacity-90 aria-selected:bg-transparent"
                onDragStart={(event: DragEvent<HTMLDivElement>) => onDragStart(event, node.type)}
                draggable
              >
                <div
                  key={node.name}
                  className={`input cursor-grab ${node.name} border-foreground/1 flex h-fit w-full flex-row items-center gap-2 border-[1px] border-solid p-3`}
                >
                  <div className="text-foreground">{node.icon}</div>
                  <div>
                    <h6 className="text-foreground text-sm font-semibold">{node.name}</h6>
                    <p className="text-foreground/50 line-clamp-2 overflow-hidden text-xs leading-4">
                      {node.description}
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
