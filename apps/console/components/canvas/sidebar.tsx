import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@inklate/ui/command";
import { IconEdit, IconHeadphones, IconPhoto, IconPrompt, IconVideo } from "@tabler/icons-react";
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
    name: "Prompt",
    type: "text",
    description: "Large Language Model",
    icon: <IconPrompt />
  },
  {
    category: "image",
    name: "GPT Image",
    type: "text",
    description: "Generate images with GPT",
    icon: <IconPhoto />
  },
  {
    category: "audio",
    name: "GPT Audio",
    type: "text",
    description: "Generate audio with GPT",
    icon: <IconHeadphones />
  }
];

const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
  event.dataTransfer.setData("application/reactflow", nodeType);
  event.dataTransfer.effectAllowed = "move";
};

export const Sidebar = () => {
  return (
    <Panel position="top-left">
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No nodes found.</CommandEmpty>
          <CommandGroup>
            {nodes.map((node) => (
              <CommandItem
                key={node.name}
                className="dndnode max-w-[220px] !px-0 aria-selected:bg-transparent"
                onDragStart={(event: DragEvent<HTMLDivElement>) => onDragStart(event, node.type)}
                draggable
              >
                <div
                  key={node.name}
                  className={`input cursor-grab ${node.name} border-foreground/1 flex h-fit w-full flex-row items-center gap-2 rounded-md border-[1px] border-solid p-3`}
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
