"use client";

import { useCallback, useRef } from "react";

/**
 * Hook: Web Audio API based unique sound effects
 * No external audio files needed — all synthesized in real-time!
 */

type SoundName =
  | "cameraShutter"
  | "smileDetected"
  | "smileSuccess"
  | "timeoutSad"
  | "noFaceWarning"
  | "emotionAngry"     // alarm tet tet
  | "emotionSad"       // violin sedih
  | "emotionFearful"   // heartbeat
  | "emotionSurprised" // boing
  | "emotionNeutral"   // typewriter tick

export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  /** Helper: play a tone with config */
  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.15, startDelay = 0) => {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + startDelay);
      gain.gain.setValueAtTime(volume, ctx.currentTime + startDelay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + startDelay);
      osc.stop(ctx.currentTime + startDelay + duration);
    },
    [getCtx]
  );

  /** Helper: play a noise burst (for shutter) */
  const playNoise = useCallback(
    (duration: number, volume = 0.08) => {
      const ctx = getCtx();
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2000, ctx.currentTime);
      filter.Q.setValueAtTime(0.5, ctx.currentTime);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(ctx.currentTime);
      source.stop(ctx.currentTime + duration);
    },
    [getCtx]
  );

  // ─── Sound: Camera Shutter ────────────────────────────────
  const playCameraShutter = useCallback(() => {
    // Short click + noise burst
    playTone(800, 0.08, "square", 0.06);
    playNoise(0.12, 0.06);
  }, [playTone, playNoise]);

  // ─── Sound: Smile Detected (ascending cheerful blips) ─────
  const playSmileDetected = useCallback(() => {
    // Three ascending blips: E5 → G#5 → B5 (happy triad)
    playTone(659.25, 0.1, "sine", 0.12, 0);
    playTone(830.61, 0.1, "sine", 0.12, 0.08);
    playTone(987.77, 0.15, "sine", 0.14, 0.16);
    // Sparkle: high triangle wave shimmer
    playTone(1318.51, 0.25, "triangle", 0.08, 0.2);
  }, [playTone]);

  // ─── Sound: Smile Success (victory jingle) ────────────────
  const playSmileSuccess = useCallback(() => {
    // Celebratory ascending arpeggio: C5 → E5 → G5 → C6
    playTone(523.25, 0.12, "sine", 0.12, 0);
    playTone(659.25, 0.12, "sine", 0.12, 0.1);
    playTone(783.99, 0.12, "sine", 0.12, 0.2);
    playTone(1046.5, 0.2, "sine", 0.14, 0.3);
    // Harmony third below
    playTone(392.0, 0.25, "triangle", 0.06, 0.15);
  }, [playTone]);

  // ─── Sound: Timeout Sad ───────────────────────────────────
  const playTimeoutSad = useCallback(() => {
    // Descending minor third: G4 → E4 → C4 (sad trombone vibes)
    playTone(392.0, 0.2, "sawtooth", 0.06, 0);
    playTone(329.63, 0.2, "sawtooth", 0.06, 0.18);
    playTone(261.63, 0.35, "sawtooth", 0.05, 0.35);
    // Tiny wah-wah effect
    playTone(200.0, 0.4, "sine", 0.04, 0.3);
  }, [playTone]);

  // ─── Sound: No Face Warning ───────────────────────────────
  const playNoFaceWarning = useCallback(() => {
    // Two subtle low beeps: like a gentle "attention" ping
    playTone(440.0, 0.1, "sine", 0.08, 0);
    playTone(440.0, 0.1, "sine", 0.08, 0.15);
  }, [playTone]);

  // ─── Sound: Angry — Alarm "tet tet" ──────────────────────
  const playEmotionAngry = useCallback(() => {
    // Classic alarm: two alternating high-pitched square wave beeps
    for (let i = 0; i < 3; i++) {
      playTone(880, 0.08, "square", 0.07, i * 0.22);
      playTone(660, 0.08, "square", 0.07, i * 0.22 + 0.11);
    }
  }, [playTone]);

  // ─── Sound: Sad — Melancholic violin bend ────────────────
  const playEmotionSad = useCallback(() => {
    // Gentle descending minor third on sawtooth (violin-like)
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(523.25, now);       // C5
    osc.frequency.linearRampToValueAtTime(440.0, now + 0.35); // A4
    osc.frequency.linearRampToValueAtTime(349.23, now + 0.7); // F4
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.9);
  }, [getCtx]);

  // ─── Sound: Fearful — Heartbeat ──────────────────────────
  const playEmotionFearful = useCallback(() => {
    // Low thump-thump like racing heartbeat
    for (let i = 0; i < 4; i++) {
      const delay = i * 0.25;
      // First beat
      playTone(60, 0.06, "sine", 0.1, delay);
      // Second beat follows quickly
      playTone(55, 0.05, "sine", 0.09, delay + 0.12);
    }
  }, [playTone]);

  // ─── Sound: Surprised — Boing! ───────────────────────────
  const playEmotionSurprised = useCallback(() => {
    // Cartoon boing: fast pitch sweep up
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
    gain.gain.setValueAtTime(0.13, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
    // Echo sparkle
    playTone(1600, 0.15, "sine", 0.05, 0.15);
  }, [getCtx, playTone]);

  // ─── Sound: Neutral — Typewriter tick ────────────────────
  const playEmotionNeutral = useCallback(() => {
    // Subtle tick-tick like keyboard typing
    playTone(1200, 0.02, "sine", 0.04, 0);
    playTone(1000, 0.02, "sine", 0.04, 0.12);
    playTone(1400, 0.02, "sine", 0.04, 0.2);
    playTone(1100, 0.02, "sine", 0.04, 0.28);
    playTone(1300, 0.02, "sine", 0.04, 0.36);
  }, [playTone]);

  const play = useCallback(
    (name: SoundName) => {
      switch (name) {
        case "cameraShutter":
          playCameraShutter();
          break;
        case "smileDetected":
          playSmileDetected();
          break;
        case "smileSuccess":
          playSmileSuccess();
          break;
        case "timeoutSad":
          playTimeoutSad();
          break;
        case "noFaceWarning":
          playNoFaceWarning();
          break;
        case "emotionAngry":
          playEmotionAngry();
          break;
        case "emotionSad":
          playEmotionSad();
          break;
        case "emotionFearful":
          playEmotionFearful();
          break;
        case "emotionSurprised":
          playEmotionSurprised();
          break;
        case "emotionNeutral":
          playEmotionNeutral();
          break;
      }
    },
    [playCameraShutter, playSmileDetected, playSmileSuccess, playTimeoutSad, playNoFaceWarning,
     playEmotionAngry, playEmotionSad, playEmotionFearful, playEmotionSurprised, playEmotionNeutral]
  );

  return { play };
}