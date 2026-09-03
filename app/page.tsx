"use client";

import { useState, useEffect, useRef } from "react";
import type { FloatingEmoji as FloatingEmojiType, Achievement } from "../src/types";
import { ACHIEVEMENTS } from "../src/constants";
import { useTheme } from "../src/hooks/useTheme";
import { useAppStore } from "../src/store/useAppStore";
import {
  Header,
  FloatingEmojis,
  PasrahMeter,
  TextEditor,
  OutputPanel,
  SmileVerificationModal,
  TranslateLoadingPopup,
  Footer,
} from "../src/components/organisms";
import { AchievementToast } from "../src/components/molecules/AchievementToast";
import "./globals.css";

export default function HomePage() {
  const [inputTeks, setInputTeks] = useState<string>("");
  const [outputRaw, setOutputRaw] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");
  const [achieveToast, setAchieveToast] = useState<Achievement | null>(null);
  const [showAchieveShimmer, setShowAchieveShimmer] = useState<boolean>(false);
  const [floaters, setFloaters] = useState<FloatingEmojiType[]>([]);
  const [showSmileModal, setShowSmileModal] = useState<boolean>(false);
  const [showTranslateLoading, setShowTranslateLoading] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const pendingTranslateRef = useRef<boolean>(false);

  // Zustand store
  const { count, incrementCount } = useAppStore();

  // Dark mode
  const { dark: darkMode, toggle: toggleDarkMode } = useTheme();

  // Floating emojis: trigger on translation
  useEffect(() => {
    if (!showConfetti) return;

    const EMOJIS = ["😊", "😄", "🥰", "😁", "🤗"];
    const newFloaters: FloatingEmojiType[] = Array.from({ length: 3 }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      left: 20 + Math.random() * 60,
    }));
    setFloaters(newFloaters);

    const t = setTimeout(() => {
      setFloaters([]);
    }, 1600);

    return () => clearTimeout(t);
  }, [showConfetti]);

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
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);

        // Achievement toast
        if (newlyUnlocked.length > 0) {
          // Show shimmer first
          setShowAchieveShimmer(true);

          // After shimmer delay, show real toast
          setTimeout(() => {
            setShowAchieveShimmer(false);
            newlyUnlocked.forEach((achId) => {
              const ach = ACHIEVEMENTS.find((a) => a.id === achId);
              if (ach) {
                setAchieveToast(ach);
                setTimeout(() => setAchieveToast(null), 3600);
              }
            });
          }, 1200);
        }
      }
    } catch (err) {
      setApiError(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
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

  // Smile detected → show fun loading popup, then translate
  const handleSmileDetected = () => {
    setShowSmileModal(false);
    pendingTranslateRef.current = false;
    setShowTranslateLoading(true);
  };

  // Loading popup done → proceed to translate
  const handleTranslateLoadingDone = () => {
    setShowTranslateLoading(false);
    doTranslate();
  };

  // Timeout → close modal & cancel
  const handleSmileTimeout = () => {
    setShowSmileModal(false);
    pendingTranslateRef.current = false;
  };

  return (
    <div className="min-h-screen scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 bg-cream dark:bg-gray-950 transition-colors duration-700">
      {/* Confetti */}
      {showConfetti && (
        <div className="confetti-container fixed inset-0 pointer-events-none z-[60]">
          {Array.from({ length: 50 }).map((_, i) => (
            <span
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
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

        <div className="mb-4 sm:mb-6">
          <PasrahMeter count={count} />
        </div>

        {/* Side-by-side: Input (left) + Output (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* LEFT — Input panel */}
          <TextEditor
            value={inputTeks}
            onChange={setInputTeks}
            onTranslate={handleTranslateClick}
            isLoading={isLoading}
          />

          {/* RIGHT — Output panel */}
          <OutputPanel rawText={outputRaw} />
        </div>

        {/* Error display */}
        {apiError && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
          </div>
        )}
      </main>

      <Footer />

      {/* Smile verification modal */}
      <SmileVerificationModal
        show={showSmileModal}
        onSmileDetected={handleSmileDetected}
        onClose={() => setShowSmileModal(false)}
        onTimeout={handleSmileTimeout}
      />

      {/* Translate loading popup (after smile detect, before translate) */}
      <TranslateLoadingPopup
        show={showTranslateLoading}
        onDone={handleTranslateLoadingDone}
      />

      {/* Achievement shimmer + toast */}
      <AchievementToast toast={achieveToast} shimmer={showAchieveShimmer} />
    </div>
  );
}
