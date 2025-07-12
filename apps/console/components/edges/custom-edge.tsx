import { getHandleColor } from "~/utils/handles/handle-colors";
import { getBezierPath, EdgeProps } from "@xyflow/react";
import { CustomEdgeData } from "~/types/edge";
import React from "react";

export const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  selected = false,
  data,
  markerEnd
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  const gradientId = `gradient-${id}`;
  const customData = data as CustomEdgeData | undefined;

  const sourceColor = customData?.sourceHandleType
    ? getHandleColor(customData.sourceHandleType)
    : "#6B7280";
  const targetColor = customData?.targetHandleType
    ? getHandleColor(customData.targetHandleType)
    : "#6B7280";

  const clickStyle: React.CSSProperties = {
    strokeWidth: 20,
    stroke: "transparent",
    cursor: "pointer",
    pointerEvents: "auto",
    fill: "none"
  };

  const edgeStyle: React.CSSProperties = {
    ...style,
    strokeWidth: selected ? (customData?.strokeWidth || 2) + 1 : customData?.strokeWidth || 2,
    cursor: "pointer",
    pointerEvents: "auto",
    stroke:
      customData?.gradient !== false ? `url(#${gradientId})` : customData?.color || sourceColor,
    strokeDasharray: customData?.dashed ? "5,5" : undefined,
    opacity: customData?.animated ? 0.8 : 1
  };

  return (
    <>
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={sourceX}
          y1={sourceY}
          x2={targetX}
          y2={targetY}
        >
          <stop offset="0%" stopColor={sourceColor} />
          <stop offset="100%" stopColor={targetColor} />
        </linearGradient>
      </defs>

      <path d={edgePath} style={clickStyle} />

      <path
        id={id}
        d={edgePath}
        style={edgeStyle}
        markerEnd={markerEnd}
        fill="none"
        className={customData?.animated ? "animate-pulse" : ""}
      />

      {customData?.label && (
        <text>
          <textPath
            href={`#${id}`}
            startOffset="50%"
            textAnchor="middle"
            className="fill-current text-xs text-gray-600 dark:text-gray-400"
          >
            {customData.label}
          </textPath>
        </text>
      )}
    </>
  );
};
