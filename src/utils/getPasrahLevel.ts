import { PASRAH_LEVELS } from "../constants";
import type { PasrahLevel, PasrahLevelRaw } from "../types";

/**
 * Calculate pasrah level based on count
 */
export function getPasrahLevel(count: number): PasrahLevel {
  let level: PasrahLevelRaw = PASRAH_LEVELS[0];
  for (const l of PASRAH_LEVELS) {
    if (count >= l.min) level = l;
  }
  const idx = PASRAH_LEVELS.indexOf(level);
  const next = PASRAH_LEVELS[idx + 1];
  const progress = next ? ((count - level.min) / (next.min - level.min)) * 100 : 100;
  return { ...level, progress, next };
}
