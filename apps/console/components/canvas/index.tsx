import {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  FitViewOptions,
  Panel,
  ReactFlow,
  useReactFlow
} from "@xyflow/react";
import React, { useEffect, useImperativeHandle, useRef } from "react";
import { CanvasState, useCanvasStore } from "~/store/canvas-store";
import { wrapNode } from "~/components/nodes/wrap-node";
import { BaseNode } from "~/components/nodes/base-node";
import { canvasConfig } from "~/utils/canvas-config";
import { TextNode } from "../nodes/text-node";
import { shallow } from "zustand/shallow";
import { color } from "~/utils/colors";
import { useTheme } from "next-themes";
import "@xyflow/react/dist/style.css";
import { Sidebar } from "./sidebar";

const selectGraphState = (state: CanvasState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  setReactFlowWrapper: state.setReactFlowWrapper,
  setReactFlowInstance: state.setReactFlowInstance,
  onDragOver: state.onDragOver,
  onDrop: state.onDrop
});

const fitViewOptions: FitViewOptions = {
  padding: 0.5,
  maxZoom: 1
};

export function Canvas() {
  const { theme } = useTheme();
  const flow = useReactFlow();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setReactFlowWrapper,
    setReactFlowInstance,
    ...rest
  } = useCanvasStore(selectGraphState, shallow);
  const reactFlowWrapperRef = useRef(null);

  useEffect(() => {
    setReactFlowWrapper(reactFlowWrapperRef.current);
  }, [setReactFlowWrapper, reactFlowWrapperRef]);

  useEffect(() => {
    flow?.fitView(fitViewOptions);
  }, [flow]);

  const nodeTypes = React.useMemo(
    () => ({
      text: wrapNode(BaseNode),
      llm: wrapNode(TextNode)
    }),
    []
  );

  return (
    <div ref={reactFlowWrapperRef} className="h-full w-full overflow-hidden">
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
        deleteKeyCode={canvasConfig.keybindings.delete}
        disableKeyboardA11y={true}
        proOptions={{ hideAttribution: true }}
        selectionOnDrag={false}
        selectNodesOnDrag={false}
        onInit={setReactFlowInstance}
        {...rest}
      >
        <Sidebar />
        <Background
          color={theme === "dark" ? color.Flow_Black_stroke : color.Flow_Black_stroke_light}
          variant={BackgroundVariant.Dots}
          id="react-flow-background"
        />
      </ReactFlow>
    </div>
  );
}
