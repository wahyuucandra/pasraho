import type { EmotionBarColors, EmotionLabels, EmotionColors, PasrahLevelRaw, Achievement, EmotionEmojisMap } from "../types";

// ─── Emotion Bar Colors (Tailwind classes) ───────────────────────────────────

export const EMOTION_BAR_COLORS: EmotionBarColors = {
  happy: "bg-emerald-500",
  sad: "bg-blue-500",
  angry: "bg-red-500",
  fearful: "bg-purple-500",
  surprised: "bg-pink-500",
  neutral: "bg-gray-500",
};

// ─── Emotion Labels (Indonesian) ─────────────────────────────────────────────

export const EMOTION_LABELS: EmotionLabels = {
  happy: "Senang",
  sad: "Sedih",
  angry: "Marah",
  fearful: "Takut",
  surprised: "Kaget",
  neutral: "Netral",
};

// ─── Emotion Colors (Hex for charts) ─────────────────────────────────────────

export const EMOTION_COLORS: EmotionColors = {
  happy: "#10b981",
  sad: "#3b82f6",
  angry: "#ef4444",
  fearful: "#a855f7",
  surprised: "#ec4899",
  neutral: "#9ca3af",
};

// ─── Emotion Comments (Funny & Professional) ─────────────────────────────────

export const EMOTION_COMMENTS: Record<string, string[]> = {
  angry: [
    "Emosi kuat terdeteksi, semangat yang luar biasa 💪",
    "Passion tinggi seperti ini bagus untuk inovasi 🚀",
    "Energi besar, mari kita salurkan dengan positif ✨",
    "Tekad yang kuat, siap menghadapi tantangan 🎯",
  ],
  sad: [
    "Hari yang menantang, tapi Anda tetap kuat 🌟",
    "Setiap langkah kecil tetap berarti 👣",
    "Bersama melewati ini, kita satu tim 🤝",
    "Kekuatan ada dalam ketenangan pikiran 🧘",
  ],
  fearful: [
    "Keberanian bukan tanpa rasa takut, tapi menghadapiinya 🦁",
    "Setiap tantangan adalah peluang tumbuh 🌱",
    "Anda lebih kuat dari yang Anda kira 💎",
    "Percaya pada kemampuan diri sendiri 🎯",
  ],
  surprised: [
    "Kejutan menyenangkan hari ini! 🎉",
    "Momen yang tidak terduga membawa semangat baru ✨",
    "Adaptasi yang baik menghadapi perubahan 🌟",
    "Fleksibilitas adalah kekuatan 💫",
  ],
  neutral: [
    "Fokus dan konsentrasi yang bagus 🎯",
    "Ketenangan yang mengagumkan 🧘‍♂️",
    "Kestabilan emosi yang profesional 💼",
    "Kontrol diri yang sangat baik 👍",
  ],
  happy: [
    "Senyum tulus yang menginspirasi! 😊",
    "Energi positif yang menular 🌟",
    "Semangat luar biasa, terus berkarya! ✨",
    "Aura cerah yang menyenangkan ☀️",
  ],
};

// ─── Loading Messages (Sarcastic) ────────────────────────────────────────────

export const LOADING_MESSAGES: string[] = [
  "Menghaluskan emosi Anda...",
  "Mengubah curhat jadi bullet points...",
  "Menambahkan 'Best Regards'...",
  "Menyusun kalimat yang HRD-friendly...",
  "Menerjemahkan 'saya benci' jadi 'dengan hormat'...",
  "Membungkus kekhilafan dengan bahasa korporat...",
  "Menghitung kadar kepasrahan optimal...",
  "Menambahkan 'semoga berkenan' di akhir...",
];

// ─── Pasrah Levels ───────────────────────────────────────────────────────────

export const PASRAH_LEVELS: PasrahLevelRaw[] = [
  { min: 0, title: "Newbie Pasrah", emoji: "🌱" },
  { min: 2, title: "Junior Pasrah", emoji: "🌿" },
  { min: 5, title: "Senior Pasrah", emoji: "🌳" },
  { min: 10, title: "Master Pasrah™", emoji: "🏆" },
  { min: 20, title: "Guru Besar Pasrah", emoji: "🎓" },
  { min: 50, title: "Legenda Pasrah Sejati", emoji: "👑" },
];

// ─── Achievements ────────────────────────────────────────────────────────────

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first",
    condition: (c: number) => c >= 1,
    icon: "🎯",
    title: "First Diplomasi",
    desc: "Translate pertama! Selamat datang di dunia korporat yang santun.",
  },
  {
    id: "five",
    condition: (c: number) => c >= 5,
    icon: "⚡",
    title: "Email Ninja x5",
    desc: "5 translate dilakukan. Skill diplomasi meningkat pesat.",
  },
  {
    id: "ten",
    condition: (c: number) => c >= 10,
    icon: "🔥",
    title: "Pasrah Veteran",
    desc: "10 translate. Anda resmi Senior Pasrah.",
  },
  {
    id: "twenty",
    condition: (c: number) => c >= 20,
    icon: "💎",
    title: "Diamond Pasrah",
    desc: "20 translate. Legend dimulai dari sini.",
  },
  {
    id: "fifty",
    condition: (c: number) => c >= 50,
    icon: "👑",
    title: "King of Pasrah",
    desc: "50 translate! Anda tak tertandingi.",
  },
];

// ─── Share Captions (Sarcastic) ──────────────────────────────────────────────

export const SHARE_CAPTIONS: string[] = [
  "Barusan baru aja pasrah sama kondisi.",
  "Diplomasi korporat level dewa, hasil terjemahan PasrahOMeter.",
  "Curhatku, tapi versi sopan buat dikirim ke grup WA kantor.",
  "Kalau email Anda terlalu jujur, pakai ini aja.",
  "Diselamatkan oleh yang lebih diplomatis dari saya.",
];

// ─── Emotion Emojis Map ─────────────────────────────────────────────────────

export const EMOTION_EMOJIS: EmotionEmojisMap = {
  happy: ["😊", "😄", "🥰", "😁", "🤗"],
  sad: ["😢", "😭", "💧", "😞", "😔"],
  angry: ["😠", "😤", "🔥", "💢", "⚡"],
  fearful: ["😨", "😰", "💀", "😱", "👻"],
  surprised: ["😲", "😮", "⚡", "🤯", "😳"],
};
