"use client";

import React from "react";
import type { FloatingEmojisProps } from "../../types";
import { FloatingEmoji } from "../atoms/FloatingEmoji";

/**
 * Container that renders floating animated emoji elements
 */
export const FloatingEmojis: React.FC<FloatingEmojisProps> = ({ emojis }) => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {emojis.map((emoji) => (
        <FloatingEmoji key={emoji.id} emoji={emoji} />
      ))}
    </div>
  );
};

FloatingEmojis.displayName = "FloatingEmojis";
