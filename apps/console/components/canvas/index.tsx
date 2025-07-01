import {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Edge,
  Node,
  ReactFlow
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { color } from "~/lib/colors";

export function Canvas() {
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];

  return (
    <div className="h-full w-full overflow-hidden">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
        snapToGrid
        snapGrid={[10, 10]}
        connectionRadius={70}
        connectionLineType={ConnectionLineType.Bezier}
        deleteKeyCode={null}
        disableKeyboardA11y={true}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color={color.Flow_Black_stroke}
          variant={BackgroundVariant.Dots}
          id="react-flow-background"
        />
      </ReactFlow>
    </div>
  );
}
