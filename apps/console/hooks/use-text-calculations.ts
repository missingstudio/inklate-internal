import { useEffect, useCallback } from "react";
import { BaseNodeData } from "~/types/node";

interface TextNodeData extends BaseNodeData {
  text: string;
  wordCount?: number;
  characterCount?: number;
}

export function useTextCalculations(
  data: TextNodeData,
  updateData: (updates: Partial<TextNodeData>) => void
) {
  const calculateStats = useCallback((text: string) => {
    const wordCount = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const characterCount = text.length;

    return { wordCount, characterCount };
  }, []);

  const clearText = useCallback(() => {
    updateData({ text: "", wordCount: 0, characterCount: 0 });
  }, [updateData]);

  // Calculate word and character counts when text changes
  useEffect(() => {
    if (data.text) {
      const stats = calculateStats(data.text);

      if (data.wordCount !== stats.wordCount || data.characterCount !== stats.characterCount) {
        updateData({
          ...stats,
          lastUpdated: Date.now()
        });
      }
    }
  }, [data.text, data.wordCount, data.characterCount, updateData, calculateStats]);

  return {
    clearText,
    calculateStats
  };
}
