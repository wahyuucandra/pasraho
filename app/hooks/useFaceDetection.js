"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import * as faceapi from "face-api.js";

const HAPPY_THRESHOLD = 0.6; // Minimum happy confidence untuk unlock
const CONFIDENCE_THRESHOLD = 0.4;
const DETECTION_INTERVAL = 1000;

export function useFaceDetection() {
  const [faceStatus, setFaceStatus] = useState("Loading models...");
  const [emotion, setEmotion] = useState("neutral");
  const [isSmiling, setIsSmiling] = useState(false);
  const [forceSmile, setForceSmile] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  const effectiveSmile = forceSmile !== null ? forceSmile : isSmiling;
  const locked = !effectiveSmile;

  // Load models dari /public/models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        setFaceStatus("Mendeteksi wajah...");
      } catch (error) {
        setFaceStatus("Error loading AI models");
      }
    };
    loadModels();
  }, []);

  const analyzeFrame = useCallback(async () => {
    const video = videoRef.current;
    if (!video || video.paused || video.ended || !modelsLoaded) return;

    try {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({
          inputSize: 320,
          scoreThreshold: CONFIDENCE_THRESHOLD,
        }))
        .withFaceExpressions();

      if (detection) {
        const { expressions } = detection;
        const { happy, angry, sad, neutral } = expressions;

        console.log(
          `%c[FaceAPI] ${new Date().toLocaleTimeString()}%c  Happy:${(happy * 100).toFixed(1)}%  Angry:${(angry * 100).toFixed(1)}%  Sad:${(sad * 100).toFixed(1)}%  Neutral:${(neutral * 100).toFixed(1)}%`,
          "color:#059669;font-weight:bold", "color:#475569"
        );

        // Tentukan emosi dominan
        let detected = "neutral";
        const emotions = Object.entries(expressions);
        const [dominantEmotion] = emotions.reduce(
          (max, [emotion, score]) => score > max[1] ? [emotion, score] : max,
          ["", 0]
        );
        detected = dominantEmotion;

        setEmotion(detected);
        setIsSmiling(happy >= HAPPY_THRESHOLD);
        setFaceStatus("Face detected");

        return { emotion: detected, happy: Math.round(happy * 100) };
      } else {
        setEmotion("neutral");
        setIsSmiling(false);
        setFaceStatus("No face detected");
      }
    } catch (error) {
      console.error("[FaceAPI] Detection error:", error);
    }
  }, [modelsLoaded]);

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(analyzeFrame, DETECTION_INTERVAL);
    } catch {
      setFaceStatus("Izin kamera diperlukan");
    }
  }, [analyzeFrame]);

  const stopWebcam = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => {
    if (modelsLoaded) {
      startWebcam();
    }
    return () => stopWebcam();
  }, [startWebcam, stopWebcam, modelsLoaded]);

  return {
    videoRef,
    canvasRef,
    faceStatus,
    setFaceStatus,
    emotion,
    isSmiling: effectiveSmile,
    locked,
    forceSmile,
    toggleForce: () => setForceSmile((p) => (p === null ? true : p ? false : null)),
    analyzeFrame,
  };
}
