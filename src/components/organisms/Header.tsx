import React from "react";
import type { HeaderProps } from "../../types";

/**
 * Sticky header with brand + dark mode toggle
 */
export const Header: React.FC<HeaderProps> = ({ darkMode, onToggleDarkMode }) => {
  return (
    <header className="sticky top-0 z-40 glass-card border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight dark:text-white leading-snug">
            PasrahOMeter
          </h1>
          <p className="text-xs text-gray-500">Kata-kata Anda, disampaikan dengan santun</p>
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
};

Header.displayName = "Header";
