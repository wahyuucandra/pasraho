import React from "react";
import type { ProgressBarProps } from "../../types";

/**
 * Simple progress bar with gradient fill
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, label }) => {
  const percentage = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className="w-full max-w-[280px]">
      {label && (
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 mb-2 font-medium">
          {label}
        </div>
      )}
      <div className="h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

ProgressBar.displayName = "ProgressBar";
