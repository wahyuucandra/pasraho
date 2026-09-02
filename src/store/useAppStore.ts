import { create } from "zustand";
import type { AppState } from "../types";

interface AchievementDef {
  id: string;
  min: number;
}

const ACHIEVEMENTS_DEFS: AchievementDef[] = [
  { id: "first", min: 1 },
  { id: "five", min: 5 },
  { id: "ten", min: 10 },
  { id: "twenty", min: 20 },
  { id: "fifty", min: 50 },
];

interface PersistedState {
  count?: number;
  achievements?: string[];
}

const loadState = (): Partial<Pick<AppState, "count" | "achievementIds">> => {
  if (typeof window === "undefined") return {};
  try {
    const saved: PersistedState = JSON.parse(
      localStorage.getItem("pasraho-state") || "{}"
    );
    return {
      count: saved.count || 0,
      achievementIds: saved.achievements
        ? new Set(saved.achievements)
        : new Set<string>(),
    };
  } catch {
    return {};
  }
};

const initial = loadState();

export const useAppStore = create<AppState>((set, get) => ({
  hasSmiledOnce: false,
  count: initial.count || 0,
  achievementIds: initial.achievementIds || new Set<string>(),

  markSmiled: () => {
    if (!get().hasSmiledOnce) {
      set({ hasSmiledOnce: true });
    }
  },

  incrementCount: () => {
    const { count, achievementIds } = get();
    const newCount = count + 1;
    const newAchievements = new Set<string>(achievementIds);

    ACHIEVEMENTS_DEFS.forEach((a) => {
      if (newCount >= a.min) newAchievements.add(a.id);
    });

    set({
      count: newCount,
      achievementIds: newAchievements,
    });

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "pasraho-state",
        JSON.stringify({ count: newCount, achievements: [...newAchievements] })
      );
    }

    const oldIds = achievementIds;
    const newlyUnlocked = [...newAchievements].filter(
      (id: string) => !oldIds.has(id)
    );
    return newlyUnlocked;
  },
}));
