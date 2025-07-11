import { getHandleTypeDefinition } from "~/utils/handles/handle-registry";
import { getHandlePositions } from "~/utils/handles/position-calculator";
import { HandleConfig, HandleLayoutConfig } from "~/types/handle";
import React, { useState, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@inklate/ui/lib/utils";

interface NodeHandleProps {
  handle: HandleConfig;
  position: { x: number; y: number };
  isInput: boolean;
  nodeId: string;
  onConnect?: (handleId: string, targetHandleId: string) => void;
  onDisconnect?: (handleId: string) => void;
  onHover?: (handleId: string) => void;
  onLeave?: (handleId: string) => void;
}

export const NodeHandle: React.FC<NodeHandleProps> = ({
  handle,
  position,
  isInput,
  nodeId,
  onConnect,
  onDisconnect,
  onHover,
  onLeave
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleTypeDefinition = getHandleTypeDefinition(handle.type);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onHover?.(handle.id);
  }, [handle.id, onHover]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onLeave?.(handle.id);
  }, [handle.id, onLeave]);

  // Get style configuration
  const style = {
    ...handleTypeDefinition?.defaultStyle,
    ...handle.style
  };

  // Size mapping
  const sizeMap = {
    small: 8,
    medium: 12,
    large: 16
  };

  const handleSize = sizeMap[style.size || "medium"];

  // Shape styles
  const getShapeStyles = () => {
    const baseStyles = {
      width: handleSize,
      height: handleSize,
      backgroundColor: style.backgroundColor,
      borderColor: style.borderColor,
      borderWidth: 2,
      borderStyle: "solid",
      position: "absolute" as const,
      left: position.x - handleSize / 2,
      top: position.y - handleSize / 2,
      zIndex: 10,
      cursor: "crosshair",
      transition: "all 0.2s ease",
      boxShadow: isHovered ? "0 0 8px rgba(0, 0, 0, 0.3)" : "none"
    };

    switch (style.shape) {
      case "square":
        return {
          ...baseStyles,
          borderRadius: "2px"
        };
      case "diamond":
        return {
          ...baseStyles,
          borderRadius: "2px",
          transform: "rotate(45deg)"
        };
      case "circle":
      default:
        return {
          ...baseStyles,
          borderRadius: "50%"
        };
    }
  };

  return (
    <>
      <Handle
        type={isInput ? "target" : "source"}
        position={isInput ? Position.Left : Position.Right}
        id={handle.id}
        style={{
          ...getShapeStyles(),
          opacity: isHovered ? 0.9 : 0.8
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "node-handle",
          isInput ? "input-handle" : "output-handle",
          `handle-${handle.type}`,
          isHovered && "hovered"
        )}
      />

      {/* Handle Icon */}
      {handleTypeDefinition?.defaultIcon && (
        <div
          style={{
            position: "absolute",
            left: position.x - 6,
            top: position.y - 6,
            width: 12,
            height: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "8px",
            pointerEvents: "none",
            zIndex: 11,
            color: style.color || "#666"
          }}
        >
          {handleTypeDefinition.defaultIcon}
        </div>
      )}

      {/* Handle Label */}
      {handle.label && (
        <div
          style={{
            position: "absolute",
            left: isInput ? position.x - 60 : position.x + 20,
            top: position.y - 8,
            fontSize: "10px",
            color: "#666",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "2px 6px",
            borderRadius: "4px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 9,
            opacity: isHovered ? 1 : 0.7,
            transition: "opacity 0.2s ease"
          }}
        >
          {handle.label}
        </div>
      )}

      {/* Tooltip */}
      {isHovered && handle.tooltip && (
        <div
          style={{
            position: "absolute",
            left: isInput ? position.x - 120 : position.x + 20,
            top: position.y + 15,
            backgroundColor: "#333",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "10px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 20,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
          }}
        >
          {handle.tooltip}
        </div>
      )}
    </>
  );
};

interface HandleGroupProps {
  handles: HandleConfig[];
  isInput: boolean;
  nodeId: string;
  layout?: HandleLayoutConfig;
  onConnect?: (handleId: string, targetHandleId: string) => void;
  onDisconnect?: (handleId: string) => void;
  onHover?: (handleId: string) => void;
  onLeave?: (handleId: string) => void;
}

export const HandleGroup: React.FC<HandleGroupProps> = ({
  handles,
  isInput,
  nodeId,
  layout,
  onConnect,
  onDisconnect,
  onHover,
  onLeave
}) => {
  const positions = getHandlePositions(handles, isInput, layout);

  return (
    <>
      {handles.map((handle, index) => {
        const position = positions.find(
          (p: { handleId: string; position: { x: number; y: number } }) => p.handleId === handle.id
        )?.position || { x: 0, y: 0 };
        return (
          <NodeHandle
            key={handle.id}
            handle={handle}
            position={position}
            isInput={isInput}
            nodeId={nodeId}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
            onHover={onHover}
            onLeave={onLeave}
          />
        );
      })}
    </>
  );
};

// Hook for handle management
export const useHandleManager = (nodeId: string) => {
  const [hoveredHandle, setHoveredHandle] = useState<string | null>(null);
  const [activeConnections, setActiveConnections] = useState<string[]>([]);

  const handleConnect = useCallback((handleId: string, targetHandleId: string) => {
    setActiveConnections((prev) => [...prev, `${handleId}-${targetHandleId}`]);
  }, []);

  const handleDisconnect = useCallback((handleId: string) => {
    setActiveConnections((prev) => prev.filter((conn) => !conn.startsWith(handleId)));
  }, []);

  const handleHover = useCallback((handleId: string) => {
    setHoveredHandle(handleId);
  }, []);

  const handleLeave = useCallback((handleId: string) => {
    setHoveredHandle(null);
  }, []);

  return {
    hoveredHandle,
    activeConnections,
    handleConnect,
    handleDisconnect,
    handleHover,
    handleLeave
  };
};
