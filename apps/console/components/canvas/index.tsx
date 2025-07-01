import {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Edge,
  Node,
  ReactFlow,
  useReactFlow
} from "@xyflow/react";
import { useGraphStore } from "~/store/graph-store";
import { wrapNode } from "../nodes/wrap-node";
import { BaseNode } from "../nodes/base-node";
import { useTheme } from "next-themes";
import "@xyflow/react/dist/style.css";
import { color } from "~/lib/colors";
import React from "react";

export function Canvas() {
  const { theme } = useTheme();
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const onNodesChange = useGraphStore((state) => state.onNodesChange);
  const onEdgesChange = useGraphStore((state) => state.onEdgesChange);

  const nodeTypes = React.useMemo(
    () => ({
      text: wrapNode(BaseNode)
    }),
    []
  );

  return (
    <div className="h-full w-full overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
        snapGrid={[10, 10]}
        connectionRadius={70}
        connectionLineType={ConnectionLineType.Bezier}
        deleteKeyCode={null}
        disableKeyboardA11y={true}
        proOptions={{ hideAttribution: true }}
        selectionOnDrag={false}
        selectNodesOnDrag={false}
      >
        <Background
          color={theme === "dark" ? color.Flow_Black_stroke : color.Flow_Black_stroke_light}
          variant={BackgroundVariant.Dots}
          id="react-flow-background"
        />
      </ReactFlow>
    </div>
  );
}
