"use client";

const STATUS_CONFIG = {
  happy: {
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    label: "Senyum terdeteksi!",
    emoji: "😊",
    messages: [
      "Aura positif terpancar ({pct}%)",
      "Wajah siap diplomasi ({pct}%)",
      "Energi senyum maksimal ({pct}%)",
    ],
  },
  neutral: {
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    label: "Belum cukup senyum",
    emoji: "😐",
    messages: [
      "Wajah netral, coba senyum dikit ({pct}%)",
      "Mode flat corporate ({pct}%)",
      "Fokus banget ya? Senyum dong ({pct}%)",
    ],
  },
  angry: {
    bg: "bg-red-50 border-red-200",
    text: "text-red-700",
    label: "Terdeteksi emosi tinggi!",
    emoji: "😤",
    messages: [
      "Tekanan darah naik nih ({pct}%)",
      "Waspada: Mode ngamuk aktif ({pct}%)",
      "Kontrol emosi dulu ya ({pct}%)",
    ],
  },
  sad: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    label: "Terdeteksi lelah/stres",
    emoji: "😢",
    messages: [
      "Wajah terlihat capek ({pct}%)",
      "Butuh istirahat nih sepertinya ({pct}%)",
      "Deadline emang berat, sabar ya ({pct}%)",
    ],
  },
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function FaceStatus({ emotion, locked }) {
  const config = STATUS_CONFIG[emotion] || STATUS_CONFIG.neutral;

  return (
    <div
      className={`rounded-xl border px-4 py-3 transition-all duration-700 ${config.bg}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{config.emoji}</span>
        <div>
          <p className={`text-sm font-semibold ${config.text}`}>{config.label}</p>
          <p className={`text-xs opacity-80 ${config.text}`}>
            {locked
              ? "Senyum dulu untuk membuka fitur terjemahan"
              : "Semua aman, silakan lanjut!"}
          </p>
        </div>
      </div>
    </div>
  );
}

export { STATUS_CONFIG, pick };
