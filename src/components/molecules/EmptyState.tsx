import React from "react";

/**
 * Empty state illustration for when there's no output yet
 */
export const EmptyState: React.FC = () => {
  return (
    <div className="relative w-40 h-40 sm:w-52 sm:h-52 mx-auto mb-4 opacity-60">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="emptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D1FAE5" />
            <stop offset="100%" stopColor="#A7F3D0" />
          </linearGradient>
        </defs>
        <rect
          x="50"
          y="80"
          width="100"
          height="70"
          rx="12"
          fill="url(#emptyGrad)"
          opacity="0.5"
        />
        <rect x="65" y="95" width="70" height="8" rx="4" fill="#9CA3AF" opacity="0.3" />
        <rect x="65" y="110" width="50" height="8" rx="4" fill="#9CA3AF" opacity="0.2" />
        <rect x="65" y="125" width="60" height="8" rx="4" fill="#9CA3AF" opacity="0.15" />
      </svg>
    </div>
  );
};

EmptyState.displayName = "EmptyState";
