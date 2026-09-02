import React from "react";
import type { EmotionExpression } from "../../types";
import { EMOTION_COLORS, EMOTION_LABELS } from "../../constants";
import { Badge } from "../atoms/Badge";

export interface EmotionLegendProps {
  emotionList: EmotionExpression[];
  maxItems?: number;
}

/**
 * Shows top emotions as colored badges
 */
export const EmotionLegend: React.FC<EmotionLegendProps> = ({
  emotionList,
  maxItems = 4,
}) => {
  if (!emotionList.length) return null;

  return (
    <div className="mt-3 flex flex-wrap justify-center gap-2 max-w-[320px]">
      {emotionList.slice(0, maxItems).map(({ emotion, value }) => {
        const color = EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS] || "#9ca3af";
        const label = EMOTION_LABELS[emotion as keyof typeof EMOTION_LABELS] || emotion;
        return (
          <Badge key={emotion} colorHex={color}>
            <span className="text-gray-600 dark:text-gray-400">{label}</span>
            <span className="font-bold text-gray-900 dark:text-white tabular-nums">
              {value}%
            </span>
          </Badge>
        );
      })}
    </div>
  );
};

EmotionLegend.displayName = "EmotionLegend";
