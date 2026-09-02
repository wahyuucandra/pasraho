"use client";

import React, { useState, useEffect, useRef } from "react";
import type { SmileVerificationModalProps, ModalStatus, EmotionExpression } from "../../types";
import { EMOTION_COMMENTS, EMOTION_COLORS, EMOTION_LABELS } from "../../constants";
import { pickRandom } from "../../utils/pickRandom";
import { useFaceDetection } from "../../hooks/useFaceDetection";
import { EmotionDonutChart } from "../molecules/EmotionDonutChart";
import { EmotionLegend } from "../molecules/EmotionLegend";
import { ProgressBar } from "../atoms/ProgressBar";
import { CloseIcon, ClockIcon, VideoOffIcon } from "../atoms/Icon";

/**
 * Modal that asks user to smile at the camera before translating
 */
export const SmileVerificationModal: React.FC<SmileVerificationModalProps> = ({
  show,
  onSmileDetected,
  onClose,
  onTimeout,
}) => {
  const {
    videoRef,
    canvasRef,
    emotion,
    expressions,
    isSmiling,
    modelsLoaded,
    startWebcam,
    stopWebcam,
    cameraPermission,
  } = useFaceDetection();

  const [status, setStatus] = useState<ModalStatus>("idle");
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [funnyComment, setFunnyComment] = useState<string>("");
  const detectedRef = useRef<boolean>(false);
  const t1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stabilize callbacks
  const onSmileDetectedRef = useRef(onSmileDetected);
  const onCloseRef = useRef(onClose);
  const onTimeoutRef = useRef(onTimeout);
  useEffect(() => {
    onSmileDetectedRef.current = onSmileDetected;
    onCloseRef.current = onClose;
    onTimeoutRef.current = onTimeout;
  });

  // Reset on modal open/close
  useEffect(() => {
    if (!show) {
      setStatus("idle");
      setTimeLeft(30);
      if (t1Ref.current) clearTimeout(t1Ref.current);
      if (t2Ref.current) clearTimeout(t2Ref.current);
      return;
    }
    // Reset detection state every time modal opens
    detectedRef.current = false;
    if (modelsLoaded) {
      if (cameraPermission === "denied") {
        setStatus("denied");
      } else {
        startWebcam();
        setStatus("scanning");
      }
    }
    return () => {
      stopWebcam();
    };
  }, [show, modelsLoaded, startWebcam, stopWebcam]);

  // Update status when permission changes
  useEffect(() => {
    if (show && cameraPermission === "denied") {
      setStatus("denied");
    }
  }, [cameraPermission, show]);

  // Timeout countdown
  useEffect(() => {
    if (!show || status !== "scanning") return;
    if (timeLeft <= 0) {
      setStatus("timeout");
      stopWebcam();
      const t = setTimeout(() => {
        onTimeoutRef.current?.();
      }, 2000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [show, status, timeLeft, stopWebcam]);

  // Emotion list for visualization
  const emotionList: EmotionExpression[] = expressions
    ? Object.entries(expressions)
        .map(([emo, value]) => ({
          emotion: emo as EmotionExpression["emotion"],
          value: Math.round(value * 100),
        }))
        .filter((item) => item.value > 2)
        .sort((a, b) => b.value - a.value)
    : [];

  // Smile detection check
  useEffect(() => {
    if (!show || status !== "scanning") return;
    if (isSmiling && !detectedRef.current) {
      detectedRef.current = true;
      setStatus("detected");
      t1Ref.current = setTimeout(() => setStatus("success"), 400);
      t2Ref.current = setTimeout(() => {
        stopWebcam();
        onSmileDetectedRef.current?.();
      }, 1200);
    }
  }, [isSmiling, show, status, stopWebcam]);

  // Funny comment based on dominant emotion
  useEffect(() => {
    if (!show || status !== "scanning" || emotionList.length === 0) {
      setFunnyComment("");
      return;
    }
    const dominantEmotion = emotionList[0].emotion;
    const comments = EMOTION_COMMENTS[dominantEmotion];
    if (comments) {
      setFunnyComment(pickRandom(comments));
    }
  }, [emotion, show, status, emotionList]);

  if (!show) return null;

  // Encouragement by time remaining
  const getEncouragement = (): string => {
    if (timeLeft > 20) return "Santai aja, coba deh senyum bentar~";
    if (timeLeft > 10) return "Yuk senyum dikit, gak perlu gigi kok 😄";
    if (timeLeft > 5) return "Sedikit lagi, jangan nyerah!";
    return "Waktu mau habis, buruan senyum!";
  };

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="modal-content w-full max-w-[500px] rounded-3xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-6 pt-5 pb-3 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {status === "success"
                ? "Yeay, senyumnya cantik! ✨"
                : status === "detected"
                ? "Nah, itu dia! 🎉"
                : status === "timeout"
                ? "Yah, kehabisan waktu..."
                : status === "denied"
                ? "Kameranya gak bisa diakses nih"
                : "Senyum dulu yuk~ 📸"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {status === "success"
                ? "Siap menerjemahkan..."
                : status === "timeout"
                ? "Coba lagi ya, klik tombol di bawah"
                : status === "denied"
                ? "Izinkan akses kamera dulu ya"
                : status === "scanning"
                ? getEncouragement()
                : status === "detected"
                ? "Bentar, lagi prose..."
                : ""}
            </p>
          </div>
          {status !== "success" && status !== "timeout" && (
            <button
              onClick={() => {
                stopWebcam();
                onClose();
              }}
              className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors flex-shrink-0 ml-3"
              title="Tutup"
            >
              <CloseIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
          {status === "timeout" ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/20 mx-auto mb-4 flex items-center justify-center">
                <ClockIcon className="w-10 h-10 text-orange-500" />
              </div>
              <p className="text-base text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Waktu habis!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Jangan sedih, coba lagi yuk
              </p>
              <button
                onClick={() => {
                  detectedRef.current = false;
                  setTimeLeft(30);
                  setStatus("scanning");
                  startWebcam();
                }}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : status === "denied" ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/20 mx-auto mb-4 flex items-center justify-center">
                <VideoOffIcon className="w-10 h-10 text-orange-500" />
              </div>
              <p className="text-base text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Kamera gak bisa diakses
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Cek izin kamera di browser kamu ya
              </p>
              <button
                onClick={() => {
                  onClose();
                }}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
              >
                Oke, ngerti
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center pt-2 pb-4">
                {/* Camera with donut chart ring */}
                <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px]">
                  <div className="absolute inset-0">
                    <EmotionDonutChart emotionList={emotionList} />
                  </div>

                  <div className="absolute inset-[2%] rounded-full overflow-hidden bg-gray-900 shadow-2xl">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover mirror-x"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {(status === "detected" || status === "success") && (
                      <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center transition-all duration-300">
                        <div className="text-center">
                          <div className="text-5xl sm:text-6xl mb-2 animate-bounce">
                            {status === "success" ? "🎉" : "😊"}
                          </div>
                          <p className="text-white font-bold text-lg sm:text-xl drop-shadow-lg">
                            {status === "success" ? "Manis!" : "Dapat!"}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-bold tabular-nums shadow-lg">
                      {timeLeft}s
                    </div>
                  </div>
                </div>

                {funnyComment && status === "scanning" && (
                  <div className="mt-4 max-w-[280px] text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 px-4 py-2 rounded-xl border border-yellow-200 dark:border-yellow-800/50 shadow-sm">
                      {funnyComment}
                    </p>
                  </div>
                )}

                {emotionList.length > 0 && status === "scanning" && (
                  <EmotionLegend emotionList={emotionList} />
                )}

                {status === "scanning" && (
                  <div className="mt-4">
                    <ProgressBar
                      value={timeLeft}
                      max={30}
                      label={
                        timeLeft > 20
                          ? "Cari senyummu..."
                          : timeLeft > 10
                          ? "Yuk senyum dikit~"
                          : timeLeft > 5
                          ? "Ayo jangan malu!"
                          : "Buruan senyum!"
                      }
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

SmileVerificationModal.displayName = "SmileVerificationModal";
