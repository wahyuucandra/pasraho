import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  colorHex?: string;
  className?: string;
}

/**
 * Small pill badge, used for emotion labels and similar tags
 */
export const Badge: React.FC<BadgeProps> = ({ children, colorHex, className = "" }) => {
  return (
    <div className={`flex items-center gap-1 text-xs ${className}`}>
      {colorHex && (
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: colorHex }}
        />
      )}
      <span>{children}</span>
    </div>
  );
};

Badge.displayName = "Badge";
