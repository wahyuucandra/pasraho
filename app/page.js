"use client";

import { useState, useEffect, useRef } from "react";
import { useFaceDetection } from "./hooks/useFaceDetection";
import { useTheme } from "./hooks/useTheme";
import { useTypewriter } from "./hooks/useTypewriter";
import { useAppStore } from "./store/useAppStore";
import "./globals.css";

// Emotion bar colors
const EMOTION_BAR_COLORS = {
  happy: "bg-emerald-500",
  sad: "bg-blue-500",
  angry: "bg-red-500",
  fearful: "bg-purple-500",
  surprised: "bg-pink-500",
  neutral: "bg-gray-500",
};

// Emotion labels in Indonesian
const EMOTION_LABELS = {
  happy: "Senang",
  sad: "Sedih",
  angry: "Marah",
  fearful: "Takut",
  surprised: "Kaget",
  neutral: "Netral",
};

// Emotion colors for donut chart
const EMOTION_COLORS = {
  happy: "#10b981",
  sad: "#3b82f6",
  angry: "#ef4444",
  fearful: "#a855f7",
  surprised: "#ec4899",
  neutral: "#9ca3af",
};

// Funny comments per emotion - Professional & Supportive
const EMOTION_COMMENTS = {
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

// Loading messages sarkastik yang berputar
const LOADING_MESSAGES = [
  "Menghaluskan emosi Anda...",
  "Mengubah curhat jadi bullet points...",
  "Menambahkan 'Best Regards'...",
  "Menyusun kalimat yang HRD-friendly...",
  "Menerjemahkan 'saya benci' jadi 'dengan hormat'...",
  "Membungkus kekhilafan dengan bahasa korporat...",
  "Menghitung kadar kepasrahan optimal...",
  "Menambahkan 'semoga berkenan' di akhir...",
];

// Level kepasrahan berdasarkan jumlah translate
const PASRAH_LEVELS = [
  { min: 0, title: "Newbie Pasrah", emoji: "🌱" },
  { min: 2, title: "Junior Pasrah", emoji: "🌿" },
  { min: 5, title: "Senior Pasrah", emoji: "🌳" },
  { min: 10, title: "Master Pasrah™", emoji: "🏆" },
  { min: 20, title: "Guru Besar Pasrah", emoji: "🎓" },
  { min: 50, title: "Legenda Pasrah Sejati", emoji: "👑" },
];

// Achievement definitions
const ACHIEVEMENTS = [
  { id: "first", condition: (c) => c >= 1, icon: "🎯", title: "First Diplomasi", desc: "Translate pertama! Selamat datang di dunia korporat yang santun." },
  { id: "five", condition: (c) => c >= 5, icon: "⚡", title: "Email Ninja x5", desc: "5 translate dilakukan. Skill diplomasi meningkat pesat." },
  { id: "ten", condition: (c) => c >= 10, icon: "🔥", title: "Pasrah Veteran", desc: "10 translate. Anda resmi Senior Pasrah." },
  { id: "twenty", condition: (c) => c >= 20, icon: "💎", title: "Diamond Pasrah", desc: "20 translate. Legend dimulai dari sini." },
  { id: "fifty", condition: (c) => c >= 50, icon: "👑", title: "King of Pasrah", desc: "50 translate! Anda tak tertandingi." },
];

// Share caption sarkastik per level
const SHARE_CAPTIONS = [
  "Barusan baru aja pasrah sama kondisi.",
  "Diplomasi korporat level dewa, hasil terjemahan PasrahOMeter.",
  "Curhatku, tapi versi sopan buat dikirim ke grup WA kantor.",
  "Kalau email Anda terlalu jujur, pakai ini aja.",
  "Diselamatkan oleh yang lebih diplomatis dari saya.",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getPasrahLevel(count) {
  let level = PASRAH_LEVELS[0];
  for (const l of PASRAH_LEVELS) {
    if (count >= l.min) level = l;
  }
  const idx = PASRAH_LEVELS.indexOf(level);
  const next = PASRAH_LEVELS[idx + 1];
  const progress = next
    ? ((count - level.min) / (next.min - level.min)) * 100
    : 100;
  return { ...level, progress, next };
}

// ——————————————————————————————————
// Header
// ——————————————————————————————————
function Header({ darkMode, onToggleDarkMode }) {
  return (
    <header className="sticky top-0 z-40 glass-card border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight dark:text-white leading-snug">
            PasrahOMeter
          </h1>
        </div>

        <button
          onClick={onToggleDarkMode}
          className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
          title="Toggle dark mode"
        >
          {darkMode ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}

// ——————————————————————————————————
// Smile Verification Modal
// ——————————————————————————————————
// Donut chart component for emotion visualization (responsive via viewBox)
function EmotionDonutChart({ emotionList }) {
  const size = 100; // logical size via viewBox
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate segments (ensure percentages sum to ~100)
  const total = emotionList.reduce((sum, e) => sum + e.value, 0) || 1;
  let currentOffset = 0;
  const segments = emotionList.slice(0, 5).map(({ emotion, value }) => {
    const normalizedValue = (value / total);
    const segmentLength = normalizedValue * circumference;
    const seg = {
      emotion,
      value,
      offset: currentOffset,
      length: segmentLength,
      gap: circumference - segmentLength,
      color: EMOTION_COLORS[emotion] || "#9ca3af",
    };
    currentOffset += segmentLength;
    return seg;
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
      {segments.map((seg, idx) => (
        <circle
          key={idx}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={seg.color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${seg.length} ${seg.gap}`}
          strokeDashoffset={-seg.offset}
          strokeLinecap="butt"
          className="transition-all duration-700 ease-out emotion-ring-segment"
          style={{ animationDelay: `${idx * 80}ms` }}
        />
      ))}
      {segments.length === 0 && (
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          className="dark:stroke-gray-700"
        />
      )}
    </svg>
  );
}

function SmileVerificationModal({ show, onSmileDetected, onClose, onTimeout }) {
  const { videoRef, canvasRef, emotion, expressions, isSmiling, modelsLoaded, startWebcam, stopWebcam, cameraPermission } = useFaceDetection();
  const [status, setStatus] = useState("idle"); // idle | scanning | detected | success | denied | timeout
  const [timeLeft, setTimeLeft] = useState(30); // 30 second timeout
  const [funnyComment, setFunnyComment] = useState("");
  const detectedRef = useRef(false);
  const t1Ref = useRef(null);
  const t2Ref = useRef(null);

  // Stabilize callbacks to avoid re-trigger effects
  const onSmileDetectedRef = useRef(onSmileDetected);
  const onCloseRef = useRef(onClose);
  const onTimeoutRef = useRef(onTimeout);
  useEffect(() => {
    onSmileDetectedRef.current = onSmileDetected;
    onCloseRef.current = onClose;
    onTimeoutRef.current = onTimeout;
  });

  // Reset on modal open/close
  useEffect(() => {
    if (!show) {
      setStatus("idle");
      setTimeLeft(30);
      detectedRef.current = false;
      // Clear any pending timers
      if (t1Ref.current) clearTimeout(t1Ref.current);
      if (t2Ref.current) clearTimeout(t2Ref.current);
      return;
    }
    if (modelsLoaded) {
      if (cameraPermission === "denied") {
        setStatus("denied");
      } else {
        startWebcam();
        setStatus("scanning");
      }
    }
    return () => {
      stopWebcam();
    };
  }, [show, modelsLoaded, startWebcam, stopWebcam]);

  // Update status when permission changes
  useEffect(() => {
    if (show && cameraPermission === "denied") {
      setStatus("denied");
    }
  }, [cameraPermission, show]);

  // Timeout countdown (only when scanning)
  useEffect(() => {
    if (!show || status !== "scanning") return;
    if (timeLeft <= 0) {
      setStatus("timeout");
      stopWebcam();
      const t = setTimeout(() => {
        onTimeoutRef.current?.();
      }, 2000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [show, status, timeLeft, stopWebcam]);

  // Build emotion bars - MOVED UP before useEffect that uses it
  const emotionList = expressions
    ? Object.entries(expressions)
        .map(([emo, value]) => ({ emotion: emo, value: Math.round(value * 100) }))
        .filter((item) => item.value > 2)
        .sort((a, b) => b.value - a.value)
    : [];

  // Check smile detection — use refs to prevent cleanup from killing timers
  useEffect(() => {
    if (!show || status !== "scanning") return;
    if (isSmiling && !detectedRef.current) {
      detectedRef.current = true;
      setStatus("detected");
      // Show success briefly, then close and trigger translate
      // Timers stored in refs so they survive status changes
      t1Ref.current = setTimeout(() => setStatus("success"), 400);
      t2Ref.current = setTimeout(() => {
        stopWebcam();
        onSmileDetectedRef.current?.();
      }, 1200);
    }
  }, [isSmiling, show, status, stopWebcam]);

  // Update funny comment when dominant emotion changes
  useEffect(() => {
    if (!show || status !== "scanning" || emotionList.length === 0) {
      setFunnyComment("");
      return;
    }
    
    const dominantEmotion = emotionList[0].emotion;
    const comments = EMOTION_COMMENTS[dominantEmotion];
    if (comments) {
      setFunnyComment(pick(comments));
    }
  }, [emotion, show, status, emotionList]);

  if (!show) return null;

  // Fun messages based on time left
  const getEncouragement = () => {
    if (timeLeft > 20) return "Santai aja, coba deh senyum bentar~";
    if (timeLeft > 10) return "Yuk senyum dikit, gak perlu gigi kok 😄";
    if (timeLeft > 5) return "Sedikit lagi, jangan nyerah!";
    return "Waktu mau habis, buruan senyum!";
  };

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="modal-content w-full max-w-[500px] rounded-3xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
        {/* Header - Playful & Clean */}
        <div className="px-5 sm:px-6 pt-5 pb-3 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {status === "success"
                ? "Yeay, senyumnya cantik! ✨"
                : status === "detected"
                ? "Nah, itu dia! 🎉"
                : status === "timeout"
                ? "Yah, kehabisan waktu..."
                : status === "denied"
                ? "Kameranya gak bisa diakses nih"
                : "Senyum dulu yuk~ 📸"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {status === "success"
                ? "Siap menerjemahkan..."
                : status === "timeout"
                ? "Coba lagi ya, klik tombol di bawah"
                : status === "denied"
                ? "Izinkan akses kamera dulu ya"
                : status === "scanning"
                ? getEncouragement()
                : status === "detected"
                ? "Bentar, lagi proses..."
                : ""}
            </p>
          </div>
          {status !== "success" && status !== "timeout" && (
            <button
              onClick={() => { stopWebcam(); onClose(); }}
              className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors flex-shrink-0 ml-3"
              title="Tutup"
            >
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
          {status === "timeout" ? (
            // Timeout state
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/20 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-base text-gray-700 dark:text-gray-300 font-semibold mb-2">Waktu habis!</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Jangan sedih, coba lagi yuk</p>
              <button
                onClick={() => {
                  detectedRef.current = false;
                  setTimeLeft(30);
                  setStatus("scanning");
                  startWebcam();
                }}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : status === "denied" ? (
            // Camera denied state
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/20 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  <line x1="2" y1="2" x2="22" y2="22" strokeWidth={2} />
                </svg>
              </div>
              <p className="text-base text-gray-700 dark:text-gray-300 font-semibold mb-2">Kamera gak bisa diakses</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Cek izin kamera di browser kamu ya</p>
              <button
                onClick={() => { onClose(); }}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
              >
                Oke, ngerti
              </button>
            </div>
          ) : (
            // Camera active state with donut chart
            <>
              <div className="flex flex-col items-center pt-2 pb-4">
                {/* Camera with donut chart ring */}
                <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px]">
                  {/* Donut chart ring - SVG fills entire container */}
                  <div className="absolute inset-0">
                    <EmotionDonutChart emotionList={emotionList} />
                  </div>
                  
                  {/* Inner camera circle - inset matches stroke inner edge (2% for strokeWidth=2) */}
                  <div className="absolute inset-[2%] rounded-full overflow-hidden bg-gray-900 shadow-2xl">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover mirror-x"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Success overlay */}
                    {(status === "detected" || status === "success") && (
                      <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center transition-all duration-300">
                        <div className="text-center">
                          <div className="text-5xl sm:text-6xl mb-2 animate-bounce">{status === "success" ? "🎉" : "😊"}</div>
                          <p className="text-white font-bold text-lg sm:text-xl drop-shadow-lg">
                            {status === "success" ? "Manis!" : "Dapat!"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Timer badge (bottom center) */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-bold tabular-nums shadow-lg">
                      {timeLeft}s
                    </div>
                  </div>
                </div>

                {/* Funny comment based on dominant emotion */}
                {funnyComment && status === "scanning" && (
                  <div className="mt-4 max-w-[280px] text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 px-4 py-2 rounded-xl border border-yellow-200 dark:border-yellow-800/50 shadow-sm">
                      {funnyComment}
                    </p>
                  </div>
                )}

                {/* Emotion legend (small) */}
                {emotionList.length > 0 && status === "scanning" && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2 max-w-[320px]">
                    {emotionList.slice(0, 4).map(({ emotion, value }) => {
                      const color = EMOTION_COLORS[emotion] || "#9ca3af";
                      const label = EMOTION_LABELS[emotion] || emotion;
                      return (
                        <div key={emotion} className="flex items-center gap-1 text-xs">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-gray-600 dark:text-gray-400">{label}</span>
                          <span className="font-bold text-gray-900 dark:text-white tabular-nums">{value}%</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Progress bar for timeout */}
                {status === "scanning" && (
                  <div className="mt-4 w-full max-w-[280px]">
                    <div className="text-center text-xs text-gray-400 dark:text-gray-500 mb-2 font-medium">
                      {timeLeft > 20 ? "Cari senyummu..." : timeLeft > 10 ? "Yuk senyum dikit~" : timeLeft > 5 ? "Ayo jangan malu!" : "Buruan senyum!"}
                    </div>
                    <div className="h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full transition-all duration-1000 ease-linear"
                        style={{ width: `${(timeLeft / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ——————————————————————————————————
// PasrahMeter
// ——————————————————————————————————
function PasrahMeter({ count }) {
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch: use count=0 during SSR, real count after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const displayCount = isMounted ? count : 0;
  const level = getPasrahLevel(displayCount);

  return (
    <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all hover:scale-[1.01]">
      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-lg sm:text-2xl">{level.emoji}</span>
          <div>
            <div className="text-xs sm:text-sm font-bold dark:text-white">{level.title}</div>
            <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
              {displayCount} kali pasrah{level.next ? ` · ${level.next.min - displayCount} lagi` : " · MAX!"}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg sm:text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{displayCount}</div>
          <div className="text-[8px] sm:text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400">Points</div>
        </div>
      </div>
      {level.next && (
        <div className="h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 meter-glow transition-all duration-700"
            style={{ width: `${Math.min(100, level.progress)}%` }}
          />
        </div>
      )}
    </div>
  );
}

// ——————————————————————————————————
// FloatingEmojis
// ——————————————————————————————————
function FloatingEmojis({ emojis }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {emojis.map(({ id, emoji, left }) => (
        <span key={id} className="float-emoji" style={{ left: `${left}%`, bottom: 0 }}>
          {emoji}
        </span>
      ))}
    </div>
  );
}

// ——————————————————————————————————
// AchievementToast
// ——————————————————————————————————
function AchievementToast({ toast }) {
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
}

// ——————————————————————————————————
// Empty state illustration
// ——————————————————————————————————
const EmptyStateIllustration = () => (
  <div className="relative w-40 h-40 sm:w-52 sm:h-52 mx-auto mb-4 opacity-60">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id="emptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D1FAE5" />
          <stop offset="100%" stopColor="#A7F3D0" />
        </linearGradient>
      </defs>
      <rect x="50" y="80" width="100" height="70" rx="12" fill="url(#emptyGrad)" opacity="0.5" />
      <rect x="65" y="95" width="70" height="8" rx="4" fill="#9CA3AF" opacity="0.3" />
      <rect x="65" y="110" width="50" height="8" rx="4" fill="#9CA3AF" opacity="0.2" />
      <rect x="65" y="125" width="60" height="8" rx="4" fill="#9CA3AF" opacity="0.15" />
    </svg>
  </div>
);

// ——————————————————————————————————
// Footer
// ——————————————————————————————————
function Footer() {
  return (
    <footer className="relative z-10 mt-12 sm:mt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="border-t border-gray-200/60 dark:border-gray-800/60 pt-6 pb-8 sm:pt-8 sm:pb-10">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
              <span>Dibuat dengan sepenuh hati dan secangkir kopi</span>
              <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />
              <span>© 2026</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ——————————————————————————————————
// Main page
// ——————————————————————————————————
export default function HomePage() {
  const [inputTeks, setInputTeks] = useState("");
  const [outputRaw, setOutputRaw] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [apiError, setApiError] = useState("");
  const [achieveToast, setAchieveToast] = useState(null);
  const [floaters, setFloaters] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showSmileModal, setShowSmileModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentCaption, setCurrentCaption] = useState(pick(SHARE_CAPTIONS));
  const isInitialMount = useRef(true);
  const pendingTranslateRef = useRef(false);

  // Zustand store
  const { count, achievementIds, incrementCount } = useAppStore();

  // Dark mode
  const { dark: darkMode, toggle: toggleDarkMode } = useTheme();

  // Typewriter
  const { displayed: outputTeks } = useTypewriter(outputRaw, 18);

  // For floating emojis
  const [lastEmotion, setLastEmotion] = useState("neutral");

  // Rotating loading messages
  useEffect(() => {
    if (!isLoading) return;
    setLoadingMsgIndex(0);
    const interval = setInterval(() => {
      setLoadingMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 900);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Floating emojis: hanya trigger saat lastEmotion berubah ke happy (bukan neutral)
  useEffect(() => {
    if (!lastEmotion || lastEmotion !== "happy") return;
    
    const EMOTION_EMOJIS = {
      happy: ["😊", "😄", "🥰", "😁", "🤗"],
      sad: ["😢", "😭", "💧", "😞", "😔"],
      angry: ["😠", "😤", "🔥", "💢", "⚡"],
      fearful: ["😨", "😰", "💀", "😱", "👻"],
      surprised: ["😲", "😮", "⚡", "🤯", "😳"],
    };
    
    const pool = EMOTION_EMOJIS.happy;
    const newFloaters = Array.from({ length: 3 }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      emoji: pool[Math.floor(Math.random() * pool.length)],
      left: 20 + Math.random() * 60,
    }));
    setFloaters(newFloaters);
    
    const t = setTimeout(() => {
      setFloaters([]);
      setLastEmotion("neutral");
    }, 1600);
    
    return () => clearTimeout(t);
  }, [lastEmotion]); 

  const doTranslate = async () => {
    if (!inputTeks.trim()) return;
    setIsLoading(true);
    setApiError("");
    setOutputRaw("");

    try {
      const res = await fetch("/api/pasrah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teksEmosi: inputTeks }),
      });
      const data = await res.json();
      if (data.error) {
        setApiError(data.error);
      } else {
        setOutputRaw(data.hasil);
        const newlyUnlocked = incrementCount();
        setCurrentCaption(pick(SHARE_CAPTIONS));
        setLastEmotion("happy");
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        // Reset emosi setelah floating emojis selesai tampil
        setTimeout(() => setLastEmotion("neutral"), 1800);
        
        // Fire achievement toast for newly unlocked achievements
        if (newlyUnlocked.length > 0) {
          newlyUnlocked.forEach((achId) => {
            const ach = ACHIEVEMENTS.find((a) => a.id === achId);
            if (ach) {
              setAchieveToast(ach);
              setTimeout(() => setAchieveToast(null), 3600);
            }
          });
        }
      }
    } catch (err) {
      setApiError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Click translate → open smile modal
  const handleTranslateClick = () => {
    if (!inputTeks.trim() || isLoading) return;
    pendingTranslateRef.current = true;
    setShowSmileModal(true);
  };

  // Smile detected → close modal & translate
  const handleSmileDetected = () => {
    setShowSmileModal(false);
    // lastEmotion sudah di-set "happy" saat handleTranslateClick, tidak perlu set ulang
    if (pendingTranslateRef.current) {
      pendingTranslateRef.current = false;
      doTranslate();
    }
  };

  // Timeout → close modal & cancel
  const handleSmileTimeout = () => {
    setShowSmileModal(false);
    pendingTranslateRef.current = false;
  };

  const handleCopy = async () => {
    if (!outputRaw) return;
    await navigator.clipboard.writeText(outputRaw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 bg-cream dark:bg-gray-950 transition-colors duration-700">
      {/* Confetti */}
      {showConfetti && (
        <div className="confetti-container fixed inset-0 pointer-events-none z-[60]">
          {Array.from({ length: 50 }).map((_, i) => (
            <span key={i} className="confetti" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }} />
          ))}
        </div>
      )}

      {/* Header + floating emojis */}
      <div className="relative z-10">
        <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
        <FloatingEmojis emojis={floaters} />
      </div>

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-12 lg:py-16 entrance">
        <section className="mb-6 sm:mb-10">
          <h2 className="mb-2 sm:mb-4 text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white leading-snug sm:leading-tight md:text-5xl">
            Tulis apa saja,{" "}
            <span className="bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
              biar kami yang diplomasi
            </span>
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
            Kami ubah uneg-uneg Anda jadi bahasa korporat yang elegan —{" "}
            <span className="italic">senyum dulu sebelum mulai.</span>
          </p>
        </section>

        {/* Side-by-side: Input (left) + Output (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* LEFT — Input panel */}
          <div className="flex flex-col gap-3 sm:gap-6">
            <div className="flex-1">
              <label className="mb-2 sm:mb-3 block text-md font-semibold text-gray-700 dark:text-gray-300">
                Apa yang mau disampaikan?
              </label>
              <textarea
                value={inputTeks}
                onChange={(e) => setInputTeks(e.target.value)}
                placeholder="Contoh: Pak, kenapa font-nya minta ganti lagi? Ini revisi ke-15 loh!"
                rows={5}
                className="w-full resize-none rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-emerald-400 dark:focus:border-emerald-500 bg-emerald-50/30 dark:bg-gray-800/60 px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-50/40 dark:focus:ring-emerald-500/20 transition-all"
              />
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                <span>Tulis sejujur-jujurnya. Kami yang diplomasi.</span>
              </div>
            </div>

            {/* Translate Button */}
            <button
              onClick={handleTranslateClick}
              disabled={!inputTeks.trim() || isLoading}
              className={`w-full rounded-xl sm:rounded-2xl py-3 sm:py-5 text-base sm:text-lg font-bold transition-all relative overflow-hidden ${
                !inputTeks.trim()
                  ? "cursor-not-allowed bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                  : "btn-primary-gradient text-white shadow-lg hover:shadow-xl active:scale-[0.98]"
              } ${isLoading ? "pointer-events-none opacity-80" : ""}`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    <span className="text-sm sm:text-lg">{LOADING_MESSAGES[loadingMsgIndex]}</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg sm:text-xl">✨</span>
                    <span>Terjemahkan Sekarang</span>
                  </>
                )}
              </span>
            </button>
          </div>

          {/* RIGHT — Output panel */}
          <div className="flex flex-col gap-4 sm:gap-6 mt-4 sm:mt-0">
            {outputTeks ? (
              <div className="glass-card rounded-xl sm:rounded-2xl shadow-xl overflow-hidden flex-1 animate-fade-up">
                {/* Header with copy button */}
                <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/70 dark:bg-gray-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                    </svg>
                    <span>Hasil terjemahan</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    disabled={copied}
                    title={copied ? "Sudah dicopy!" : "Copy hasil"}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all active:scale-[0.96] ${
                      copied
                        ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                        : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm"
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span>Tercopy!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6 pb-3 sm:pb-4">
                  <p className="text-sm sm:text-[17px] leading-relaxed text-gray-900 dark:text-white whitespace-pre-wrap">{outputTeks}</p>
                </div>

                {/* Caption */}
                <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                  <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 italic">
                    {currentCaption}
                  </span>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 flex-1 flex flex-col items-center justify-center text-center min-h-[160px] sm:min-h-[280px]">
                <EmptyStateIllustration />
                <p className="text-gray-400 dark:text-gray-600 text-xs sm:text-sm">
                  Ketik sesuatu di sebelah kiri lalu klik{" "}
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Terjemahkan</span>
                </p>
              </div>
            )}

            {/* Error */}
            {apiError && (
              <div className="animate-slide-down rounded-xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-5 text-center">
                <div className="text-red-400 mb-1">⚠️</div>
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">{apiError}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Pasrah Level Meter - Bottom section for clean mobile layout */}
      <section className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 pb-6">
        <PasrahMeter count={count} />
      </section>

      <Footer />

      {/* Smile Verification Modal */}
      <SmileVerificationModal
        show={showSmileModal}
        onSmileDetected={handleSmileDetected}
        onTimeout={handleSmileTimeout}
        onClose={() => {
          setShowSmileModal(false);
          pendingTranslateRef.current = false;
        }}
      />

      <AchievementToast toast={achieveToast} />
    </div>
  );
}
