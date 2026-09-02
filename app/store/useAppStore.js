import { create } from "zustand";

const ACHIEVEMENTS_DEFS = [
  { id: "first", min: 1 },
  { id: "five", min: 5 },
  { id: "ten", min: 10 },
  { id: "twenty", min: 20 },
  { id: "fifty", min: 50 },
];

// Load persisted state
const loadState = () => {
  if (typeof window === "undefined") return {};
  try {
    const saved = JSON.parse(localStorage.getItem("pasraho-state") || "{}");
    return {
      count: saved.count || 0,
      achievementIds: saved.achievements ? new Set(saved.achievements) : new Set(),
    };
  } catch {
    return {};
  }
};

const initial = loadState();

export const useAppStore = create((set, get) => ({
  // Session-only: resets on refresh
  hasSmiledOnce: false,

  // Persisted across refreshes
  count: initial.count || 0,
  achievementIds: initial.achievementIds || new Set(),

  markSmiled: () => {
    if (!get().hasSmiledOnce) {
      set({ hasSmiledOnce: true });
    }
  },

  incrementCount: () => {
    const { count, achievementIds } = get();
    const newCount = count + 1;
    const newAchievements = new Set(achievementIds);

    ACHIEVEMENTS_DEFS.forEach((a) => {
      if (newCount >= a.min) newAchievements.add(a.id);
    });

    set({
      count: newCount,
      achievementIds: newAchievements,
    });

    // Persist
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "pasraho-state",
        JSON.stringify({ count: newCount, achievements: [...newAchievements] })
      );
    }

    // Return newly unlocked achievements
    const oldIds = achievementIds;
    const newlyUnlocked = [...newAchievements].filter((id) => !oldIds.has(id));
    return newlyUnlocked;
  },
}));
