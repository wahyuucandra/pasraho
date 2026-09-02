// ─── Emotion Types ───────────────────────────────────────────────────────────

export type Emotion = "happy" | "sad" | "angry" | "fearful" | "surprised" | "neutral";

export interface EmotionExpression {
  emotion: Emotion;
  value: number;
}

// ─── Emotion Maps ────────────────────────────────────────────────────────────

export interface EmotionBarColors {
  happy: string;
  sad: string;
  angry: string;
  fearful: string;
  surprised: string;
  neutral: string;
}

export interface EmotionLabels {
  happy: string;
  sad: string;
  angry: string;
  fearful: string;
  surprised: string;
  neutral: string;
}

export interface EmotionColors {
  happy: string;
  sad: string;
  angry: string;
  fearful: string;
  surprised: string;
  neutral: string;
}

// ─── Pasrah Level ────────────────────────────────────────────────────────────

export interface PasrahLevel {
  min: number;
  title: string;
  emoji: string;
  progress: number;
  next?: PasrahLevelRaw;
}

export interface PasrahLevelRaw {
  min: number;
  title: string;
  emoji: string;
}

// ─── Achievement ─────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  condition: (count: number) => boolean;
  icon: string;
  title: string;
  desc: string;
}

// ─── Modal Status ────────────────────────────────────────────────────────────

export type ModalStatus = "idle" | "scanning" | "detected" | "success" | "denied" | "timeout";

// ─── Floating Emoji ─────────────────────────────────────────────────────────

export interface FloatingEmoji {
  id: string;
  emoji: string;
  left: number;
}

// ─── Toast ───────────────────────────────────────────────────────────────────

export interface AchievementToast {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

// ─── Component Props ─────────────────────────────────────────────────────────

export interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export interface PasrahMeterProps {
  count: number;
}

export interface FloatingEmojisProps {
  emojis: FloatingEmoji[];
}

export interface AchievementToastProps {
  toast: Achievement | null;
}

export interface EmotionDonutChartProps {
  emotionList: EmotionExpression[];
}

export interface SmileVerificationModalProps {
  show: boolean;
  onSmileDetected: () => void;
  onClose: () => void;
  onTimeout: () => void;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
}

export interface EmotionLegendProps {
  emotionList: EmotionExpression[];
  maxItems?: number;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export interface AppState {
  hasSmiledOnce: boolean;
  count: number;
  achievementIds: Set<string>;
  markSmiled: () => void;
  incrementCount: () => string[];
}

// ─── Emotion Emojis Map ─────────────────────────────────────────────────────

export type EmotionEmojisMap = Record<string, string[]>;

// ─── Camera Permission ───────────────────────────────────────────────────────

export type CameraPermission = "granted" | "denied" | "prompt";

// ─── Face Detection Hook Return ─────────────────────────────────────────────

export interface UseFaceDetectionReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  faceStatus: string;
  setFaceStatus: React.Dispatch<React.SetStateAction<string>>;
  emotion: string;
  isSmiling: boolean;
  locked: boolean;
  forceSmile: boolean | null;
  expressions: Record<string, number> | null;
  toggleForce: () => void;
  analyzeFrame: () => Promise<{ emotion: string; happy: number } | undefined>;
  modelsLoaded: boolean;
  startWebcam: () => Promise<void>;
  stopWebcam: () => void;
  cameraPermission: CameraPermission;
}
