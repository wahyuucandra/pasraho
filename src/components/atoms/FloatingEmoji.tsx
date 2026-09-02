import React from "react";
import type { FloatingEmoji as FloatingEmojiType } from "../../types";

export interface FloatingEmojiProps {
  emoji: FloatingEmojiType;
}

/**
 * Single floating emoji that animates upward from the bottom
 */
export const FloatingEmoji: React.FC<FloatingEmojiProps> = ({ emoji }) => {
  return (
    <span
      className="float-emoji"
      style={{ left: `${emoji.left}%`, bottom: 0 }}
    >
      {emoji.emoji}
    </span>
  );
};

FloatingEmoji.displayName = "FloatingEmoji";
