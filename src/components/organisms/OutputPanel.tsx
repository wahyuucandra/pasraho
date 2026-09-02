"use client";

import React, { useState } from "react";
import { useTypewriter } from "../../hooks/useTypewriter";
import { EmptyState } from "../molecules/EmptyState";
import { CopyIcon, CheckIcon, SparklesIcon } from "../atoms/Icon";

export interface OutputPanelProps {
  rawText: string;
}

/**
 * Right side: shows translated + typewritten output with copy button
 */
export const OutputPanel: React.FC<OutputPanelProps> = ({ rawText }) => {
  const { displayed: outputTeks } = useTypewriter(rawText, 18);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    if (!rawText) return;
    await navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 mt-4 sm:mt-0">
      {outputTeks ? (
        <div className="glass-card rounded-xl sm:rounded-2xl shadow-xl overflow-hidden flex-1 animate-fade-up">
          {/* Header with copy button */}
          <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/70 dark:bg-gray-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
              <SparklesIcon size={16} className="text-emerald-500" />
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
                  <CheckIcon size={14} />
                  <span>Tercopy!</span>
                </>
              ) : (
                <>
                  <CopyIcon size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 pb-3 sm:pb-4">
            <p className="text-sm sm:text-[17px] leading-relaxed text-gray-900 dark:text-white whitespace-pre-wrap">
              {outputTeks}
            </p>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-xl sm:rounded-2xl flex-1 flex flex-col items-center justify-center p-6 sm:p-8 min-h-[300px]">
          <EmptyState />
          <p className="text-center text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">
            Hasil terjemahan akan muncul di sini
          </p>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-1">
            Tulis di kiri, lalu klik &quot;Terjemahkan&quot;
          </p>
        </div>
      )}
    </div>
  );
};

OutputPanel.displayName = "OutputPanel";
