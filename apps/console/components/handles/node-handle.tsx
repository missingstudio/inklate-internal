import { getHandleTypeDefinition } from "~/utils/handles/handle-registry";
import { HandleConfig, HandleLayoutConfig } from "~/types/handle";
import React, { useState, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@inklate/ui/lib/utils";

interface NodeHandleProps {
  handle: HandleConfig;
  isInput: boolean;
  nodeId: string;
  onConnect?: (handleId: string, targetHandleId: string) => void;
  onDisconnect?: (handleId: string) => void;
  onHover?: (handleId: string) => void;
  onLeave?: (handleId: string) => void;
}

export const NodeHandle: React.FC<NodeHandleProps> = ({
  handle,
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
  return (
    <>
      {handles.map((handle, index) => {
        return (
          <NodeHandle
            key={handle.id}
            handle={handle}
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
