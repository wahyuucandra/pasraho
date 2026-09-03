"use client";

import React, { useState } from "react";
import type { SmileGuideModalProps } from "../../types";
import { CloseIcon } from "../atoms/Icon";

/**
 * Modal panduan yang muncul setiap page dibuka.
 * Menjelaskan KENAPA user harus senyum dulu sebelum teks diterjemahkan.
 * Ada opsi "Jangan tampilkan lagi" supaya tidak muncul lagi di kunjungan selanjutnya.
 */
export const SmileGuideModal: React.FC<SmileGuideModalProps> = ({
  show,
  onStart,
  onClose,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!show) return null;

  const steps = [
    {
      emoji: "😤",
      title: "Tulis uneg-unegmu",
      desc: "Curhat bebas dulu di kolom input. Marah, kesel, capek — semuanya boleh.",
    },
    {
      emoji: "😊",
      title: "Senyum dulu ke kamera",
      desc: "Kami minta kamu senyum biar emosi negatifnya luruh duluan. Senyum itu obat gratis!",
    },
    {
      emoji: "🤝",
      title: "Kami diplomasi-kan",
      desc: "Setelah senyum, tulisanmu diubah jadi bahasa korporat yang sopan & elegan.",
    },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden entrance">
        {/* Close button */}
        <button
          onClick={() => onClose(dontShowAgain)}
          className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
          title="Tutup"
        >
          <CloseIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Header */}
        <div className="px-6 pt-8 pb-4 text-center">
          {/* App branding */}
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">🤝</span>
            <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              PasrahOMeter
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Kenapa harus senyum dulu?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
            Karena diplomasi dimulai dari hati yang tenang — dan senyum adalah langkah pertamamu.
          </p>
        </div>

        {/* Steps */}
        <div className="px-6 pb-6 space-y-3">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-2xl">
                {step.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Langkah {idx + 1}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                  {step.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mx-6 mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/40">
          <p className="text-[11px] text-amber-800 dark:text-amber-300 text-center leading-relaxed">
            💡 <span className="font-medium">Tenang aja</span>, kameranya cuma baca ekspresi —
            gak ada yang direkam atau disimpan.
          </p>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          {/* Don't show again checkbox */}
          <label className="flex items-center gap-2 mb-3 cursor-pointer select-none group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-4 w-4 rounded border-2 border-gray-300 dark:border-gray-600 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 transition-colors flex items-center justify-center">
                {dontShowAgain && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
              Jangan tampilkan lagi
            </span>
          </label>

          <button
            onClick={() => onStart(dontShowAgain)}
            className="w-full py-3 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Oke, siap senyum! 😊
          </button>
        </div>
      </div>
    </div>
  );
};
