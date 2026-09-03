"use client";

import React, { useEffect, useState } from "react";

export interface TranslateLoadingPopupProps {
  show: boolean;
}

const FUNNY_QUOTES = [
  "Memoles kata-kata kasar jadi 'dengan hormat'...",
  "Mengubah emosi jadi bullet points...",
  "Menyelipkan 'Best Regards' di ujung sana...",
  "Menghitung kadar kepasrahan...",
  "Bismillah, semoga gak kena tegur HRD...",
  "Nyalon dulu bentar, biar hasilnya glowing ✨",
  "Mandi dulu, biar seger pas baca hasilnya...",
  "Nyeduh kopi dulu ya, ini agak panjang...",
];

/**
 * Fun loading popup shown during translation (API fetch).
 * Shows a bouncing logo with rotating funny quotes.
 * Controlled entirely by parent via `show` prop — no auto-dismiss.
 */
export const TranslateLoadingPopup: React.FC<TranslateLoadingPopupProps> = ({
  show,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Rotate quotes while visible
  useEffect(() => {
    if (!show) return;
    setQuoteIndex(0);
    const interval = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % FUNNY_QUOTES.length);
    }, 700);
    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-5 p-8 rounded-3xl bg-white/95 dark:bg-gray-900/95 shadow-2xl border border-emerald-100 dark:border-emerald-800/30 max-w-[320px] w-full mx-4 animate-pop-in">
        {/* Bouncing logo */}
        <div className="relative">
          <div className="text-5xl sm:text-6xl animate-logo-bounce">
            ✨
          </div>
          {/* Shadow below the bouncing logo */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-emerald-200/60 dark:bg-emerald-700/30 rounded-full animate-logo-shadow" />
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-dot-bounce [animation-delay:0ms]" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-dot-bounce [animation-delay:150ms]" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-dot-bounce [animation-delay:300ms]" />
        </div>

        {/* Rotating quote */}
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center min-h-[40px] transition-all duration-300 italic">
          {FUNNY_QUOTES[quoteIndex]}
        </p>
      </div>
    </div>
  );
};

TranslateLoadingPopup.displayName = "TranslateLoadingPopup";