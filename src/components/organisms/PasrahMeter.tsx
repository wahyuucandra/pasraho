"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { PasrahMeterProps } from "../../types";
import { getPasrahLevel } from "../../utils/getPasrahLevel";
import { PASRAH_LEVELS } from "../../constants";

/**
 * Gamified progress meter showing pasrah level and count
 */
export const PasrahMeter: React.FC<PasrahMeterProps> = ({ count }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [showTiers, setShowTiers] = useState<boolean>(false);
  const [popoverRect, setPopoverRect] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const tiersRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate popover position based on trigger button
  const updatePopoverPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPopoverRect({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  };

  // Toggle popover with position calc
  const handleToggleTiers = () => {
    if (!showTiers) {
      updatePopoverPosition();
    }
    setShowTiers((p) => !p);
  };

  // Close tiers popover on outside click
  useEffect(() => {
    if (!showTiers) return;
    const handler = (e: MouseEvent) => {
      if (
        tiersRef.current &&
        !tiersRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setShowTiers(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showTiers]);

  const displayCount = isMounted ? count : 0;
  const level = getPasrahLevel(displayCount);

  return (
    <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all hover:scale-[1.01] relative">
      {!isMounted ? (
        /* ── Shimmer skeleton while loading persisted count ── */
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 shimmer-bg animate-shimmer bg-[length:200%_100%]" />
            <div className="space-y-1 sm:space-y-1.5">
              <div className="w-20 sm:w-28 h-3 sm:h-3.5 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 shimmer-bg animate-shimmer bg-[length:200%_100%]" />
              <div className="w-14 sm:w-20 h-2 sm:h-2.5 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 shimmer-bg animate-shimmer bg-[length:200%_100%] [animation-delay:200ms]" />
            </div>
          </div>
          <div className="w-10 sm:w-14 h-8 sm:h-10 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 shimmer-bg animate-shimmer bg-[length:200%_100%] [animation-delay:400ms]" />
        </div>
      ) : (
        <>
      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-lg sm:text-2xl">{level.emoji}</span>
          <div>
            <div className="text-xs sm:text-sm font-bold dark:text-white">
              {level.title}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
              {displayCount} kali pasrah
              {level.next ? ` · ${level.next.min - displayCount} lagi` : " · MAX!"}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg sm:text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {displayCount}
          </div>
          <div className="flex items-center justify-end gap-1">
            <div className="text-[8px] sm:text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Points
            </div>
            {/* Tier info trigger */}
            <button
              ref={triggerRef}
              onClick={handleToggleTiers}
              className="relative inline-flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors cursor-help"
              title="Lihat tingkatan"
            >
              <span className="text-[7px] sm:text-[8px] leading-none text-gray-500 dark:text-gray-400 font-bold">?</span>
            </button>
          </div>
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
        </>
      )}

      {/* ── Achievement Tiers Popover (Portal) ── */}
      {showTiers &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed z-[90] w-56 sm:w-64 animate-pop-in origin-top-right"
               style={{ top: `${popoverRect.top}px`, right: `${popoverRect.right}px` }}
               ref={tiersRef}
          >
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
              <div className="px-3.5 py-2.5 border-b border-emerald-100 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-900/20">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  🏅 Tingkatan Pasrah
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Semakin sering pasrah, semakin tinggi levelmu!
                </p>
              </div>
              <div className="px-1 py-1 max-h-52 overflow-y-auto">
                {PASRAH_LEVELS.map((tier) => {
                  const isCurrent = level.emoji === tier.emoji;
                  const isUnlocked = displayCount >= tier.min;
                  return (
                    <div
                      key={tier.min}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors ${
                        isCurrent
                          ? "bg-emerald-100 dark:bg-emerald-800/40 ring-1 ring-emerald-300 dark:ring-emerald-600"
                          : isUnlocked
                          ? "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          : "opacity-40"
                      }`}
                    >
                      <span className={`text-lg ${!isUnlocked ? "grayscale" : ""}`}>
                        {tier.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate ${
                          isCurrent
                            ? "text-emerald-800 dark:text-emerald-200"
                            : isUnlocked
                            ? "text-gray-800 dark:text-gray-200"
                            : "text-gray-400 dark:text-gray-500"
                        }`}>
                          {tier.title}
                          {isCurrent && (
                            <span className="ml-1.5 text-[9px] font-normal text-emerald-600 dark:text-emerald-400 italic">
                              ← kamu di sini
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          {tier.min === 0
                            ? "Level awal"
                            : isUnlocked
                            ? `Terbuka di ${tier.min} pasrah`
                            : `🔒 ${tier.min} pasrah`}
                        </p>
                      </div>
                      {isUnlocked && (
                        <span className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 flex-shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="px-3.5 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 italic text-center">
                  "Pasrah itu seni, bukan menyerah" 🧘
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

PasrahMeter.displayName = "PasrahMeter";
