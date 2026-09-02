"use client";

import { useState, useEffect, useRef } from "react";

interface UseTypewriterReturn {
  displayed: string;
  isTyping: boolean;
  fullText: string;
}

export function useTypewriter(text: string, speed: number = 18): UseTypewriterReturn {
  const [displayed, setDisplayed] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const prevTextRef = useRef<string>("");

  useEffect(() => {
    if (!text) {
      setDisplayed("");
      setIsTyping(false);
      return;
    }

    if (text !== prevTextRef.current) {
      prevTextRef.current = text;
      setDisplayed("");
      setIsTyping(true);

      let index = 0;
      const interval = setInterval(() => {
        index++;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, speed);

      return () => clearInterval(interval);
    }
  }, [text, speed]);

  return { displayed, isTyping, fullText: text };
}
