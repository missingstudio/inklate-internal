import { Background, BackgroundVariant, ConnectionLineType, ReactFlow } from "@xyflow/react";
import { GraphStore, useGraphStore } from "~/store/graph-store";
import { wrapNode } from "../nodes/wrap-node";
import { BaseNode } from "../nodes/base-node";
import { shallow } from "zustand/shallow";
import { color } from "~/utils/colors";
import { useTheme } from "next-themes";
import "@xyflow/react/dist/style.css";
import React from "react";

const selectGraphState = (state: GraphStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange
});

export function Canvas() {
  const { theme } = useTheme();
  const { nodes, edges, onNodesChange, onEdgesChange } = useGraphStore(selectGraphState, shallow);

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
