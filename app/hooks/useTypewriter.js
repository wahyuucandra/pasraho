"use client";

import { useState, useEffect, useRef } from "react";

export function useTypewriter(text, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const prevTextRef = useRef("");

  useEffect(() => {
    if (!text) {
      setDisplayed("");
      setIsTyping(false);
      return;
    }

    // If text changed completely, restart
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
