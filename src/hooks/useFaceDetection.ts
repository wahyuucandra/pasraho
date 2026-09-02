"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import * as faceapi from "face-api.js";
import type { CameraPermission, UseFaceDetectionReturn } from "../types";

const HAPPY_THRESHOLD = 0.6;
const CONFIDENCE_THRESHOLD = 0.4;
const DETECTION_INTERVAL = 1000;

export function useFaceDetection(): UseFaceDetectionReturn {
  const [faceStatus, setFaceStatus] = useState<string>("Loading models...");
  const [emotion, setEmotion] = useState<string>("neutral");
  const [isSmiling, setIsSmiling] = useState<boolean>(false);
  const [forceSmile, setForceSmile] = useState<boolean | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState<boolean>(false);
  const [expressions, setExpressions] = useState<Record<string, number> | null>(null);
  const [cameraPermission, setCameraPermission] = useState<CameraPermission>("prompt");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const effectiveSmile = forceSmile !== null ? forceSmile : isSmiling;
  const locked = !effectiveSmile;

  // Load models from /public/models
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
      } catch {
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
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320,
            scoreThreshold: CONFIDENCE_THRESHOLD,
          })
        )
        .withFaceExpressions();

      if (detection) {
        const { expressions } = detection;
        const { happy } = expressions;

        console.log(
          `%c[FaceAPI] ${new Date().toLocaleTimeString()}%c  Happy:${(happy * 100).toFixed(1)}%`,
          "color:#059669;font-weight:bold",
          "color:#475569"
        );

        // Determine dominant emotion
        const emotions = Object.entries(expressions);
        const [dominantEmotion] = emotions.reduce(
          (max, [emotion, score]) => (score > max[1] ? [emotion, score] : max),
          ["", 0]
        );

        setEmotion(dominantEmotion);
        setIsSmiling(happy >= HAPPY_THRESHOLD);
        setExpressions({ ...expressions } as Record<string, number>);
        setFaceStatus("Face detected");

        return { emotion: dominantEmotion, happy: Math.round(happy * 100) };
      } else {
        setEmotion("neutral");
        setIsSmiling(false);
        setExpressions(null);
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
      setCameraPermission("granted");
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(analyzeFrame, DETECTION_INTERVAL);
    } catch {
      setCameraPermission("denied");
      setFaceStatus("Izin kamera diperlukan");
    }
  }, [analyzeFrame]);

  const stopWebcam = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t: MediaStreamTrack) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  // Cleanup only
  useEffect(() => {
    return () => stopWebcam();
  }, [stopWebcam]);

  useEffect(() => {
    if (modelsLoaded) console.log("[FaceAPI] Models loaded & ready");
  }, [modelsLoaded]);

  return {
    videoRef,
    canvasRef,
    faceStatus,
    setFaceStatus,
    emotion,
    isSmiling: effectiveSmile,
    locked,
    forceSmile,
    expressions,
    toggleForce: () => setForceSmile((p) => (p === null ? true : p ? false : null)),
    analyzeFrame,
    modelsLoaded,
    startWebcam,
    stopWebcam,
    cameraPermission,
  };
}
