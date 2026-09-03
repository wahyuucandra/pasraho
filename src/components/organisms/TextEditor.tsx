"use client";

import React from "react";
import { LOADING_MESSAGES } from "../../constants";
import { SparklesIcon } from "../atoms/Icon";

export interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onTranslate: () => void;
  isLoading: boolean;
  loadingMsgIndex: number;
}

/**
 * Text input panel with translate button
 */
export const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  onTranslate,
  isLoading,
  loadingMsgIndex,
}) => {
  const disabled = !value.trim() || isLoading;

  return (
    <div className="flex flex-col gap-3 sm:gap-6">
      <div className="flex-1">
        <label className="mb-2 sm:mb-3 block text-md font-semibold text-gray-700 dark:text-gray-300">
          Apa yang mau disampaikan?
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Contoh: Pak, kenapa font-nya minta ganti lagi? Ini revisi ke-15 loh!"
          rows={5}
          className="w-full resize-none rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-emerald-400 dark:focus:border-emerald-500 bg-emerald-50/30 dark:bg-gray-800/60 px-4 sm:px-5 py-3 sm:py-4 text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-50/40 dark:focus:ring-emerald-500/20 transition-all font-sans"
          style={{
            fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: '16px',
          }}
        />
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <SparklesIcon size={14} className="text-gray-400" />
          <span>Tulis sejujur-jujurnya. Kami yang diplomasi.</span>
        </div>
      </div>

      {/* Translate Button */}
      <button
        onClick={onTranslate}
        disabled={disabled}
        className={`w-full rounded-xl sm:rounded-2xl py-3 sm:py-5 text-base sm:text-lg font-bold transition-all relative overflow-hidden ${
          !value.trim()
            ? "cursor-not-allowed bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
            : "btn-primary-gradient text-white shadow-lg hover:shadow-xl active:scale-[0.98]"
        } ${isLoading ? "pointer-events-none opacity-80" : ""}`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
          {isLoading ? (
            <>
              <span className="spinner" />
              <span className="text-sm sm:text-lg">
                {LOADING_MESSAGES[loadingMsgIndex]}
              </span>
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
  );
};

TextEditor.displayName = "TextEditor";
