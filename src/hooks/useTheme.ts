"use client";

import { useState, useEffect, useCallback } from "react";

interface UseThemeReturn {
  dark: boolean;
  toggle: () => void;
}

export function useTheme(): UseThemeReturn {
  const [dark, setDark] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("pasraho-theme");
    if (stored === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggle = useCallback(() => {
    setDark((prev: boolean) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("pasraho-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("pasraho-theme", "light");
      }
      return next;
    });
  }, []);

  return { dark, toggle };
}
