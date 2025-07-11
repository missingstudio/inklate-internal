import { NodeContainer } from "~/components/nodes/base/node-container";
import { NodeErrorBoundary } from "~/providers/node-error-boundary";
import { useTextCalculations } from "~/hooks/use-text-calculations";
import { TextDisplay } from "~/components/nodes/base/text-display";
import { NodeContent } from "~/components/nodes/base/node-content";
import { NodeHeader } from "~/components/nodes/base/node-header";
import { NodeFooter } from "~/components/nodes/base/node-footer";
import { NodeProvider } from "~/providers/node-provider";
import { useNodeData } from "~/hooks/use-node-data";
import { type NodeProps } from "@xyflow/react";
import { BaseNodeData } from "~/types/node";
import React from "react";

interface TextNodeData extends BaseNodeData {
  text: string;
  wordCount?: number;
  characterCount?: number;
}

const TextNodeComponent = ({ id, selected, dragging }: NodeProps) => {
  const { data, updateData, deleteNode, clearError } = useNodeData<TextNodeData>(id);
  const { clearText } = useTextCalculations(data, updateData);

  return (
    <NodeProvider
      id={id}
      data={data}
      selected={selected}
      dragging={dragging}
      updateData={updateData}
      deleteNode={deleteNode}
    >
      <NodeContainer
        className={dragging ? "opacity-70" : ""}
        selected={selected}
        dragging={dragging}
        error={data.error}
        onClearError={clearError}
      >
        <NodeHeader
          title="Display Node"
          subtitle="Displays text from connected nodes"
          loading={data.loading}
          error={data.error}
          onClearError={clearError}
          icon={
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <span className="text-xs font-semibold text-green-600">D</span>
            </div>
          }
        />

        <NodeContent>
          <TextDisplay
            text={data.text}
            wordCount={data.wordCount}
            characterCount={data.characterCount}
            onClear={clearText}
            placeholder="No text received. Connect a text output from another node."
          />
        </NodeContent>

        <NodeFooter
          updatedAt={data.lastUpdated ? new Date(data.lastUpdated).toISOString() : undefined}
          customInfo={
            <div className="flex items-center space-x-3">
              {data.wordCount !== undefined && <span>Words: {data.wordCount}</span>}
              {data.characterCount !== undefined && <span>Chars: {data.characterCount}</span>}
            </div>
          }
        />
      </NodeContainer>
    </NodeProvider>
  );
};

export const TextNode = (props: NodeProps) => (
  <NodeErrorBoundary nodeId={props.id}>
    <TextNodeComponent {...props} />
  </NodeErrorBoundary>
);

TextNode.displayName = "TextNode";
export const DisplayNode = TextNode;
