import React from "react";
import type { EmotionExpression } from "../../types";
import { EMOTION_COLORS } from "../../constants";

export interface EmotionDonutChartProps {
  emotionList: EmotionExpression[];
}

/**
 * SVG donut chart visualizing emotion distribution
 */
export const EmotionDonutChart: React.FC<EmotionDonutChartProps> = ({
  emotionList,
}) => {
  const size = 100;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const total = emotionList.reduce((sum, e) => sum + e.value, 0) || 1;
  let currentOffset = 0;

  const segments = emotionList.slice(0, 5).map(({ emotion, value }) => {
    const normalizedValue = value / total;
    const segmentLength = normalizedValue * circumference;
    const seg = {
      emotion,
      value,
      offset: currentOffset,
      length: segmentLength,
      gap: circumference - segmentLength,
      color: EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS] || "#9ca3af",
    };
    currentOffset += segmentLength;
    return seg;
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
      {segments.map((seg, idx) => (
        <circle
          key={idx}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={seg.color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${seg.length} ${seg.gap}`}
          strokeDashoffset={-seg.offset}
          strokeLinecap="butt"
          className="transition-all duration-700 ease-out emotion-ring-segment"
          style={{ animationDelay: `${idx * 80}ms` }}
        />
      ))}
      {segments.length === 0 && (
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          className="dark:stroke-gray-700"
        />
      )}
    </svg>
  );
};

EmotionDonutChart.displayName = "EmotionDonutChart";
