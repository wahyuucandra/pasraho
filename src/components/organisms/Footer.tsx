import React from "react";

/**
 * Footer component
 */
export const Footer: React.FC = () => {
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
};

Footer.displayName = "Footer";
