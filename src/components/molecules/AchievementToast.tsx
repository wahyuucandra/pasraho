import React from "react";
import type { Achievement } from "../../types";

export interface AchievementToastProps {
  toast: Achievement | null;
  shimmer?: boolean;
}

/**
 * Achievement unlocked notification toast with optional shimmer loading state
 */
export const AchievementToast: React.FC<AchievementToastProps> = ({ toast, shimmer }) => {
  if (!toast && !shimmer) return null;

  return (
    <div
      className={`achievement-toast fixed right-4 top-4 z-[100] flex max-w-xs items-center gap-3 rounded-2xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 dark:border-yellow-600 p-4 shadow-xl backdrop-blur-sm ${
        shimmer ? "animate-shimmer-pulse" : ""
      }`}
    >
      {/* Icon: shimmer skeleton or real emoji */}
      <div className={`text-3xl ${shimmer ? "skeleton-icon" : "badge-unlock"}`}>
        {shimmer ? (
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-200 dark:from-yellow-700/40 dark:via-amber-600/40 dark:to-yellow-700/40 shimmer-bg animate-shimmer bg-[length:200%_100%]" />
        ) : (
          toast?.icon
        )}
      </div>

      <div className="flex-1">
        {shimmer ? (
          <>
            <div className="w-24 h-3 mb-2 rounded bg-gradient-to-r from-amber-200/80 via-amber-300 to-amber-200/80 dark:from-amber-700/30 dark:via-amber-500/30 dark:to-amber-700/30 shimmer-bg animate-shimmer bg-[length:200%_100%]" />
            <div className="w-32 h-4 mb-1 rounded bg-gradient-to-r from-yellow-200/80 via-yellow-300 to-yellow-200/80 dark:from-yellow-700/30 dark:via-yellow-500/30 dark:to-yellow-700/30 shimmer-bg animate-shimmer bg-[length:200%_100%]" />
            <div className="w-20 h-3 rounded bg-gradient-to-r from-amber-200/60 via-amber-300 to-amber-200/60 dark:from-amber-700/20 dark:via-amber-500/20 dark:to-amber-700/20 shimmer-bg animate-shimmer bg-[length:200%_100%]" />
          </>
        ) : toast ? (
          <>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Achievement Unlocked!
            </div>
            <div className="text-sm font-bold dark:text-white">{toast.title}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">{toast.desc}</div>
          </>
        ) : null}
      </div>
    </div>
  );
};

AchievementToast.displayName = "AchievementToast";
