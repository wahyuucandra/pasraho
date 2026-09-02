"use client";

import React, { useState, useEffect } from "react";
import type { PasrahMeterProps } from "../../types";
import { getPasrahLevel } from "../../utils/getPasrahLevel";

/**
 * Gamified progress meter showing pasrah level and count
 */
export const PasrahMeter: React.FC<PasrahMeterProps> = ({ count }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const displayCount = isMounted ? count : 0;
  const level = getPasrahLevel(displayCount);

  return (
    <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all hover:scale-[1.01]">
      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-lg sm:text-2xl">{level.emoji}</span>
          <div>
            <div className="text-xs sm:text-sm font-bold dark:text-white">
              {level.title}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
              {displayCount} kali pasrah
              {level.next ? ` · ${level.next.min - displayCount} lagi` : " · MAX!"}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg sm:text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {displayCount}
          </div>
          <div className="text-[8px] sm:text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400">
            Points
          </div>
        </div>
      </div>
      {level.next && (
        <div className="h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 meter-glow transition-all duration-700"
            style={{ width: `${Math.min(100, level.progress)}%` }}
          />
        </div>
      )}
    </div>
  );
};

PasrahMeter.displayName = "PasrahMeter";
