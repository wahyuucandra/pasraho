"use client";

import { useState, useEffect } from "react";
import { useFaceDetection } from "./hooks/useFaceDetection";

// Status messages dengan styling
const STATUS_CONFIG = {
  happy: {
    emoji: "😊",
    label: "Senyum terdeteksi!",
    messages: [
      "Aura positif terpancar ({pct}%)",
      "Wajah siap diplomasi ({pct}%)",
      "Senyum korporat palsu terdeteksi — AMAN! ({pct}%)",
      "Mode 'saya baik-baik saja' aktif ({pct}%)",
      "Inner peace (palsu) level maksimal ({pct}%)",
      "Siap meeting tanpa drama ({pct}%)",
      "Pura-pura bahagia berhasil ({pct}%)",
    ],
    tip: "🎉 Sempurna! Karier Anda aman untuk sekarang.",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
  },
  neutral: {
    emoji: "😐",
    label: "Belum cukup senyum",
    messages: [
      "Wajah netral, coba senyum dikit ({pct}%)",
      "Mode robot kantoran ({pct}%)",
      "Dataramu masih flat, bro ({pct}%)",
      "Ekspresi 'lagi scroll email' ({pct}%)",
      "Muka 'masih Senin' padahal udah Jumat ({pct}%)",
      "Wajah meeting pagi ({pct}%)",
      "Deteksi: mikirin cicilan ({pct}%)",
    ],
    tip: "💡 Senyum dikit aja kok. Anggap lagi selfie.",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
  },
  angry: {
    emoji: "😤",
    label: "Emosi tinggi terdeteksi!",
    messages: [
      "Tekanan darah naik nih ({pct}%)",
      "Mode ngamuk aktif ({pct}%)",
      "Muka pengen resign TAPI butuh gaji ({pct}%)",
      "Level sabar tersisa 2% ({pct}%)",
      "Terlihat ingin banting keyboard ({pct}%)",
      "Aura 'siapa suruh revisi lagi?' ({pct}%)",
      "Wajah setelah baca email dari klien ({pct}%)",
      "Mode Hulk: LOADING ({pct}%)",
    ],
    tip: "🧊 Tarik napas dulu. Keyboard mahal, jangan dibanting.",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
  },
  sad: {
    emoji: "😢",
    label: "Terdeteksi lelah/stres",
    messages: [
      "Wajah capek banget ({pct}%)",
      "Butuh cuti mendadak ({pct}%)",
      "Menghitung hari menuju weekend ({pct}%)",
      "Galau karena sprint retro ({pct}%)",
      "Deteksi: kangen WFH ({pct}%)",
      "Muka 'kenapa gue kerja di sini ya' ({pct}%)",
      "Overthinking deadline detected ({pct}%)",
      "Wajah setelah meeting 3 jam ({pct}%)",
    ],
    tip: "☕ Mungkin butuh kopi. Atau cuti. Atau dua-duanya.",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
  },
};

// Saran random untuk popup
const SARAN_POOL = [
  { icon: "🧘", text: "Tarik napas dalam-dalam, hitung sampai 5" },
  { icon: "☕", text: "Minum teh atau kopi dulu sebentar" },
  { icon: "🎵", text: "Putar lagu 'Goyang Dumang' biar semangat" },
  { icon: "🌳", text: "Bayangkan sedang jalan-jalan di taman (atau Bali)" },
  { icon: "💰", text: "Pikirkan bonus tahunan yang (semoga) cair" },
  { icon: "🏖️", text: "Ingat: Sabtu tinggal beberapa hari lagi" },
  { icon: "🍕", text: "Nanti makan siang pesen yang enak, reward diri sendiri" },
  { icon: "😌", text: "Senyum tipis dulu aja, kayak difoto KTP" },
  { icon: "🐱", text: "Buka video kucing lucu di YouTube, 30 detik aja" },
  { icon: "💸", text: "Ingat cicilan motor, jadi senyum terpaksa pun gapapa" },
  { icon: "🧃", text: "Ambil minum yang seger, adem dulu" },
  { icon: "📱", text: "Chat bestie, ngobrolin hal random biar lupa" },
  { icon: "🍜", text: "Bayangin lagi makan mie ayam favorit" },
  { icon: "🎪", text: "Anggap ini cuma game, yang menang dapet THR" },
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSaran(count = 3) {
  const shuffled = [...SARAN_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Komponen FaceStatus
function FaceStatus({ emotion, locked }) {
  const config = STATUS_CONFIG[emotion] || STATUS_CONFIG.neutral;

  // Client-only rendering untuk menghindari hydration error
  const [isClient, setIsClient] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsClient(true);
    // Generate pesan random waktu client mount
    setMessage(pick(config.messages).replace("{pct}", Math.round(70 + Math.random() * 25)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emotion]);

  // Render placeholder waktu server, baru render konten waktu client
  if (!isClient) {
    return (
      <div className={`rounded-2xl border-2 ${config.borderColor} ${config.bgColor} p-5 transition-all duration-500`}>
        <div className="flex items-start gap-3">
          <span className="text-3xl">{config.emoji}</span>
          <div className="flex-1">
            <div className={`text-lg font-bold ${config.textColor}`}>{config.label}</div>
            <div className={`text-sm ${config.textColor} opacity-80`}>Analyzing...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border-2 ${config.borderColor} ${config.bgColor} p-5 transition-all duration-500`}>
      <div className="flex items-start gap-3">
        <span className="text-3xl">{config.emoji}</span>
        <div className="flex-1">
          <div className={`text-lg font-bold ${config.textColor}`}>{config.label}</div>
          <div className={`text-sm ${config.textColor} opacity-80`}>{message}</div>
          {locked && (
            <div className="mt-2 text-xs text-gray-600 bg-white/50 rounded-lg px-3 py-1.5 inline-block">
              {config.tip}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Komponen Header dengan webcam mini
function Header({ videoRef, canvasRef, locked, onToggleForce, faceStatus }) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="relative">
          <div className={`h-12 w-12 overflow-hidden rounded-full border-[3px] shadow-md transition-all ${
            locked ? "border-red-400 shadow-red-200" : "border-emerald-400 shadow-emerald-200"
          }`}>
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
            locked ? "bg-red-500" : "bg-emerald-500"
          }`} />
        </div>

        <div className="flex-1 px-4">
          <h1 className="text-xl font-bold tracking-tight">PasrahOMeter</h1>
          <p className="text-xs text-gray-500">Kata-kata Anda, disampaikan dengan santun</p>
        </div>

        <button
          onClick={onToggleForce}
          className="ml-3 h-3 w-3 rounded-full bg-gray-300 opacity-15 hover:opacity-40 transition-opacity"
          title="Force smile toggle"
        />
      </div>
    </header>
  );
}

// Komponen SmilePopup — BLOCKER, tidak bisa ditutup manual
function SmilePopup({ show }) {
  if (!show) return null;
  const saran = getRandomSaran();

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="modal-content w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="mb-4 text-center">
          <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-orange-100 text-3xl sm:text-4xl animate-pulse">
            😤
          </div>
        </div>
        <h3 className="mb-2 text-center text-xl sm:text-2xl font-bold text-gray-900">
          Wajah Tidak Sesuai
        </h3>
        <p className="mb-5 text-center text-sm sm:text-base text-gray-500">
          Akses ditahan demi keselamatan karier Anda.
          Yuk senyum dulu baru bisa lanjut:
        </p>

        <div className="mb-5 space-y-2">
          {saran.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl bg-stone-50 p-3 sm:p-4"
            >
              <span className="text-xl sm:text-2xl">{item.icon}</span>
              <p className="text-sm text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-gray-400 italic mt-2">
          ✨ Popup akan hilang otomatis saat senyum terdeteksi
        </div>
      </div>
    </div>
  );
}

// Komponen utama
export default function HomePage() {
  const [inputTeks, setInputTeks] = useState("");
  const [outputTeks, setOutputTeks] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Pakai hook face-api.js
  const { videoRef, canvasRef, faceStatus, emotion, isSmiling, locked, toggleForce } = useFaceDetection();

  // Delay sebelum auto-popup mulai bekerja
  useEffect(() => {
    const initTimer = setTimeout(() => setHasInitialized(true), 2500);
    return () => clearTimeout(initTimer);
  }, []);

  // AUTO-POPUP: muncul kalau tidak senyum, hilang jika senyum
  useEffect(() => {
    if (!hasInitialized) return;

    if (!locked) {
      setShowPopup(false);
      return;
    }

    // Debounce 600ms biar tidak flicker
    const showTimer = setTimeout(() => {
      if (locked) setShowPopup(true);
    }, 600);
    return () => clearTimeout(showTimer);
  }, [locked, hasInitialized]);

  const handleTranslate = async () => {
    if (locked || !inputTeks.trim() || isLoading) return;

    setIsLoading(true);
    setApiError("");
    setOutputTeks("");

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
        setOutputTeks(data.hasil);
      }
    } catch (err) {
      setApiError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header
        videoRef={videoRef}
        canvasRef={canvasRef}
        locked={locked}
        onToggleForce={toggleForce}
      />

      <main className="mx-auto max-w-2xl px-6 py-12">
        <section className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Tulis apa saja,{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              biar kami yang diplomasi
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Kami ubah uneg-uneg Anda jadi bahasa korporat yang elegan. Tapi ingat,
            senyum dulu ya sebelum mulai.
          </p>
        </section>

        <section className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Apa yang mau disampaikan?
          </label>
          <textarea
            value={inputTeks}
            onChange={(e) => setInputTeks(e.target.value)}
            placeholder="Contoh: Pak, kenapa font-nya minta ganti lagi? Ini revisi ke-15 loh!"
            rows={6}
            className="w-full resize-none rounded-xl border-2 border-gray-300 bg-white px-5 py-4 text-base focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          />
        </section>

        <button
          onClick={handleTranslate}
          disabled={!inputTeks.trim() || isLoading}
          className={`w-full rounded-xl py-4 text-lg font-semibold shadow-lg transition-all ${
            locked || !inputTeks.trim()
              ? "cursor-not-allowed bg-gray-200 text-gray-500"
              : "bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-xl active:scale-[0.98]"
          } ${isLoading ? "pointer-events-none opacity-60" : ""}`}
        >
          {isLoading ? "Menerjemahkan..." : locked ? "🔒 Senyum Dulu Ya!" : "✨ Terjemahkan Sekarang"}
        </button>

        {apiError && (
          <div className="mt-6 animate-slide-down rounded-xl border-2 border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
            {apiError}
          </div>
        )}

        {outputTeks && (
          <section className="mt-8 animate-fade-up">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
              <p className="text-lg leading-relaxed text-gray-900">{outputTeks}</p>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
        <p className="max-w-2xl mx-auto mb-2 mx-2">
          <strong>Disclaimer:</strong> Aplikasi ini dibuat untuk hiburan semata dan tidak benar-benar
          mendeteksi emosi wajah secara akurat. Deteksi senyum hanya berdasarkan analisis warna piksel
          sederhana. Jangan gunakan hasil terjemahan untuk komunikasi profesional yang serius.
          <em> No hard feelings, ini cuma bercanda kok!</em> 😄
        </p>
        <p>Made with 😤 at the office · PasrahOMeter 2026</p>
      </footer>

      <SmilePopup show={showPopup} />
    </div>
  );
}
