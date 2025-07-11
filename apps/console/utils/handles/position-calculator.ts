import { HandleConfig, HandleLayoutConfig, HandlePositionCalculator } from "~/types/handle";

class DynamicHandlePositionCalculator implements HandlePositionCalculator {
  calculatePosition(
    handle: HandleConfig,
    index: number,
    totalHandles: number,
    isInput: boolean,
    layout?: HandleLayoutConfig
  ): { x: number; y: number } {
    const defaultSpacing = 30;
    const nodeWidth = 320; // Default node width
    const nodeHeight = 200; // Default node height
    const handleSize = 12; // Default handle size

    // Apply custom offset if provided
    const offset = handle.offset || { x: 0, y: 0 };

    // If handle has custom position, use it
    if (handle.position) {
      return {
        x: offset.x || 0,
        y: offset.y || 0
      };
    }

    // Use custom layout if provided
    if (layout?.customLayout) {
      const customPositions = layout.customLayout([handle]);
      const customPos = customPositions.find((pos) => pos.handleId === handle.id);
      if (customPos) {
        return {
          x: customPos.position.x + (offset.x || 0),
          y: customPos.position.y + (offset.y || 0)
        };
      }
    }

    const spacing = layout?.spacing || defaultSpacing;
    const alignment = layout?.alignment || "distributed";

    // Calculate base position
    let baseX = isInput ? -handleSize / 2 : nodeWidth + handleSize / 2;
    let baseY = 0;

    switch (alignment) {
      case "top":
        baseY = handleSize + index * spacing;
        break;

      case "center":
        const centerOffset = ((totalHandles - 1) * spacing) / 2;
        baseY = nodeHeight / 2 - centerOffset + index * spacing;
        break;

      case "bottom":
        baseY = nodeHeight - handleSize - (totalHandles - 1 - index) * spacing;
        break;

      case "distributed":
      default:
        if (totalHandles === 1) {
          baseY = nodeHeight / 2;
        } else {
          const availableSpace = nodeHeight - 2 * handleSize;
          baseY = handleSize + index * (availableSpace / (totalHandles - 1));
        }
        break;
    }

    return {
      x: baseX + (offset.x || 0),
      y: baseY + (offset.y || 0)
    };
  }

  // Group handles by type for better organization
  groupHandlesByType(handles: HandleConfig[]): Record<string, HandleConfig[]> {
    return handles.reduce(
      (groups, handle) => {
        const type = handle.type;
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type].push(handle);
        return groups;
      },
      {} as Record<string, HandleConfig[]>
    );
  }

  // Calculate positions for grouped handles
  calculateGroupedPositions(
    handles: HandleConfig[],
    isInput: boolean,
    layout?: HandleLayoutConfig
  ): Array<{ handleId: string; position: { x: number; y: number } }> {
    if (layout?.grouping === "by-type") {
      const groups = this.groupHandlesByType(handles);
      const positions: Array<{ handleId: string; position: { x: number; y: number } }> = [];

      let currentIndex = 0;
      Object.values(groups).forEach((groupHandles) => {
        groupHandles.forEach((handle, index) => {
          const position = this.calculatePosition(
            handle,
            currentIndex,
            handles.length,
            isInput,
            layout
          );
          positions.push({ handleId: handle.id, position });
          currentIndex++;
        });
      });

      return positions;
    } else {
      // Default: calculate positions for all handles
      return handles.map((handle, index) => ({
        handleId: handle.id,
        position: this.calculatePosition(handle, index, handles.length, isInput, layout)
      }));
    }
  }
}

export const handlePositionCalculator = new DynamicHandlePositionCalculator();

// Utility function to get handle positions
export const getHandlePositions = (
  handles: HandleConfig[],
  isInput: boolean,
  layout?: HandleLayoutConfig
): Array<{ handleId: string; position: { x: number; y: number } }> => {
  return handlePositionCalculator.calculateGroupedPositions(handles, isInput, layout);
};

// Utility function to get single handle position
export const getHandlePosition = (
  handle: HandleConfig,
  index: number,
  totalHandles: number,
  isInput: boolean,
  layout?: HandleLayoutConfig
): { x: number; y: number } => {
  return handlePositionCalculator.calculatePosition(handle, index, totalHandles, isInput, layout);
};
