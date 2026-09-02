import React from "react";
import type { Achievement } from "../../types";

export interface AchievementToastProps {
  toast: Achievement | null;
}

/**
 * Achievement unlocked notification toast
 */
export const AchievementToast: React.FC<AchievementToastProps> = ({ toast }) => {
  if (!toast) return null;

  return (
    <div className="achievement-toast fixed right-4 top-4 z-[100] flex max-w-xs items-center gap-3 rounded-2xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 dark:border-yellow-600 p-4 shadow-xl backdrop-blur-sm">
      <div className="badge-unlock text-3xl">{toast.icon}</div>
      <div className="flex-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Achievement Unlocked!
        </div>
        <div className="text-sm font-bold dark:text-white">{toast.title}</div>
        <div className="text-xs text-gray-600 dark:text-gray-300">{toast.desc}</div>
      </div>
    </div>
  );
};

AchievementToast.displayName = "AchievementToast";
