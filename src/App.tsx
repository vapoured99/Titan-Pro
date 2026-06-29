import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ChevronDown,
  X,
  Dumbbell,
  Flame,
  Trophy,
  ArrowLeftRight,
  ArrowDown,
  ArrowUpDown,
  Activity,
  ArrowUp,
  ArrowUpCircle,
  RotateCw,
  Search,
  RefreshCw,
  LogOut,
  User as UserIcon,
  Loader2,
  History,
  Scale,
  TrendingUp,
  Plus,
  Trash2,
  ExternalLink,
  Percent,
  Save,
  Check,
  Layout,
  Medal,
  Award,
  Crown,
  Shield,
  Sparkles,
  BookOpen,
  Terminal,
  Workflow,
  PersonStanding,
  Cloud,
  Download,
  Upload,
  Repeat,
  Edit2,
  LayoutDashboard,
  LayoutGrid,
  List,
  Coins,
  Youtube,
  Compass,
  MapPin,
  FlaskConical,
  Zap,
  Target,
  Sliders,
  Brain,
  GripVertical,
  Play,
  Square,
  Timer,
  Clock,
  LineChart,
  Volume2,
  VolumeX,
  FileText,
  ClipboardList,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  LineChart as RechartsLineChart,
  Line,
} from "recharts";
import AnatomyChart from "./components/AnatomyChart";
import AnatomyDashboard from "./components/AnatomyDashboard";
import { ImmersiveLanding } from "./components/ImmersiveLanding";
import Sparkline from "./components/Sparkline";
import AICoach from "./components/AICoach";
import RadarChart from "./components/RadarChart";
import D3RadarChart from "./components/D3RadarChart";
import AvatarPanel, { OUTFITS, TITLES } from "./components/AvatarPanel";
import { AvatarDisplayCard } from "./components/AvatarDisplayCard";
import { TransparentCharacter } from "./components/TransparentCharacter";
import TacticalMap from "./components/TacticalMap";
import GymLocator from "./components/GymLocator";
import WorkoutCalendarHeatmap from "./components/WorkoutCalendarHeatmap";
import { SpinalDepletionWidget } from "./components/SpinalDepletionWidget";
import ConsoleIntelligencePanel from "./components/ConsoleIntelligencePanel";
import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  getDocs,
  addDoc,
  query,
  orderBy,
  handleFirestoreError,
  OperationType,
  serverTimestamp,
  collection,
  User,
  deleteDoc,
  writeBatch,
  onSnapshot,
} from "./lib/firebase";
import { Exercise, POOLS, getSecondaryMusclesForExercise } from "./data/exercises";

// --- Background Images ---
import ironTempleBg from "./assets/images/iron_temple_bg_1779282140548.png";
import neonPumpBg from "./assets/images/neon_pump_bg_1779282162002.png";
import beastModeBg from "./assets/images/beast_mode_bg_1779282188045.png";
import zenLifterBg from "./assets/images/zen_lifter_bg_1779282209692.png";
import midnightCityBg from "./assets/images/midnight_city_bg_1779282230526.png";
import voidEclipseBg from "./assets/images/void_eclipse_bg_1779447103424.png";
import celestialLightBg from "./assets/images/celestial_light_bg_1779447123837.png";
import lumenSentinelBg from "./assets/images/banner_lumen_sentinel_1779449818555.png";
import lumenSentinelBgNew from "./assets/images/lumen_sentinel_bg_1779719240506.png";
import solarAscentBg from "./assets/images/solar_ascent_bg_1779457047851.png";
import cosmicVortexBg from "./assets/images/cosmic_vortex_bg_new_1779719240506.png";
import overgrownCyberCityBg from "./assets/images/cyber_city_bg_new_1779719262117.png";

// --- Avatar Images & Screenshot Engine ---
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import imgVanguardDefault from "./assets/images/vanguard_default_1779362283869.png";
import imgNeonStrikerDefault from "./assets/images/neon_striker_1779356868324.png";
import imgShadowHunterDefault from "./assets/images/shadow_hunter_1779356889743.png";
import imgCyberBeastDefault from "./assets/images/cyber_beast_1779356910976.png";
import imgGoldenDiscipleDefault from "./assets/images/golden_disciple_1779356934562.png";
import imgOmegaPrimeDefault from "./assets/images/omega_prime_1779356957034.png";
import imgShadowWraithDefault from "./assets/images/shadow_wraith_cyber_1779445357447.png";
import imgLumenSentinelDefault from "./assets/images/lumen_sentinel_cyber_1779445373875.png";

// --- Types ---
interface GymTheme {
  id: string;
  name: string;
  description: string;
  accent: string;
  accentRgb: string;
  accentLight: string;
  accentDark: string;
  bg: string;
  bgImage?: string;
  opacity: string;
  textVibe: string;
  testPrimary: string;
  testMuted: string;
  testSubtle: string;
  isGradient?: boolean;
}

const GYM_THEMES: Record<string, GymTheme> = {
  default: {
    id: "default",
    name: "Titan Pro",
    description: "Golden highlights on dark canvas.",
    accent: "#D4AF37",
    accentRgb: "212, 175, 55",
    accentLight: "#F1E5AC",
    accentDark: "#C5A028",
    bg: "#050505",
    bgImage:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop",
    opacity: "opacity-25",
    textVibe: "Titan Gold. Original athletic layout.",
    testPrimary: "#ffffff",
    testMuted: "rgba(255, 255, 255, 0.45)",
    testSubtle: "rgba(255, 255, 255, 0.2)",
  },
  iron: {
    id: "iron",
    name: "Iron Temple",
    description: "Ancient stone & classical discipline.",
    accent: "#cdaa5c",
    accentRgb: "205, 170, 92",
    accentLight: "#f3e8cb",
    accentDark: "#8a6e30",
    bg: "#0b0a08",
    bgImage: ironTempleBg,
    opacity: "opacity-85",
    textVibe: "Ancient stone. Raw discipline. Unbreakable focus.",
    testPrimary: "#f3e8cb",
    testMuted: "rgba(243, 232, 203, 0.45)",
    testSubtle: "rgba(243, 232, 203, 0.2)",
  },
  neon: {
    id: "neon",
    name: "Neon Pump",
    description: "Vaporwave synth-lights & heavy pulses.",
    accent: "#ff007f",
    accentRgb: "255, 0, 127",
    accentLight: "#ff80bf",
    accentDark: "#b30059",
    bg: "#0b0112",
    bgImage: neonPumpBg,
    opacity: "opacity-85",
    textVibe: "Retro lights. High energy. Push harder than yesterday.",
    testPrimary: "#ffe6f2",
    testMuted: "rgba(255, 128, 191, 0.45)",
    testSubtle: "rgba(255, 128, 191, 0.2)",
  },
  beast: {
    id: "beast",
    name: "Beast Mode",
    description: "Aggressive crimson shadows & steel.",
    accent: "#ff3333",
    accentRgb: "255, 51, 51",
    accentLight: "#ff8888",
    accentDark: "#b30000",
    bg: "#060000",
    bgImage: beastModeBg,
    opacity: "opacity-80",
    textVibe: "Dark. Aggressive. Built for beasts who never skip leg day.",
    testPrimary: "#ffcccc",
    testMuted: "rgba(255, 136, 136, 0.45)",
    testSubtle: "rgba(255, 136, 136, 0.2)",
  },
  zen: {
    id: "zen",
    name: "Zen Lifter",
    description: "Calming forest mists & quiet focus.",
    accent: "#00d294",
    accentRgb: "0, 210, 148",
    accentLight: "#8cfcd7",
    accentDark: "#008f62",
    bg: "#080d09",
    bgImage: zenLifterBg,
    opacity: "opacity-40",
    textVibe: "Clean mind. Strong body. Balance is the ultimate progress.",
    testPrimary: "#e2fdf5",
    testMuted: "rgba(0, 210, 148, 0.45)",
    testSubtle: "rgba(0, 210, 148, 0.2)",
  },
  midnight: {
    id: "midnight",
    name: "Midnight City",
    description: "Late-night cyber skylines & cyber teal.",
    accent: "#00e5ff",
    accentRgb: "0, 229, 255",
    accentLight: "#80f2ff",
    accentDark: "#009aab",
    bg: "#010813",
    bgImage: midnightCityBg,
    opacity: "opacity-35",
    textVibe: "Late nights. Big goals. The city never stops, neither do you.",
    testPrimary: "#e0f7fa",
    testMuted: "rgba(128, 242, 255, 0.45)",
    testSubtle: "rgba(128, 242, 255, 0.2)",
  },
  void_eclipse: {
    id: "void_eclipse",
    name: "Void Eclipse",
    description: "Cosmic shadow eclipse & intense violet aura.",
    accent: "#a855f7",
    accentRgb: "168, 85, 247",
    accentLight: "#d8b4fe",
    accentDark: "#7e22ce",
    bg: "#050209",
    bgImage: voidEclipseBg,
    opacity: "opacity-80",
    textVibe: "Void Eclipse. Break through dimensions and training barriers.",
    testPrimary: "#faf5ff",
    testMuted: "rgba(216, 180, 254, 0.45)",
    testSubtle: "rgba(168, 85, 247, 0.2)",
  },
  celestial_light: {
    id: "celestial_light",
    name: "Celestial Light",
    description: "Pristine mountain peaks & orbital stardust halos.",
    accent: "#0ea5e9",
    accentRgb: "14, 165, 233",
    accentLight: "#bae6fd",
    accentDark: "#0369a1",
    bg: "#050c18",
    bgImage: celestialLightBg,
    opacity: "opacity-45",
    textVibe: "Celestial Spires. Mount the peak of ultimate execution.",
    testPrimary: "#f0f9ff",
    testMuted: "rgba(186, 230, 253, 0.45)",
    testSubtle: "rgba(14, 165, 233, 0.2)",
  },
  lumen_sentinel: {
    id: "lumen_sentinel",
    name: "Lumen Sentinel",
    description: "Pristine crystalline spires & orbital silver halo.",
    accent: "#38bdf8",
    accentRgb: "56, 189, 248",
    accentLight: "#bae6fd",
    accentDark: "#0284c7",
    bg: "#040b17",
    bgImage: lumenSentinelBgNew,
    opacity: "opacity-40",
    textVibe:
      "Lumen Sentinel. Ascend into the celestial light of flawless execution.",
    testPrimary: "#f0f9ff",
    testMuted: "rgba(186, 230, 253, 0.45)",
    testSubtle: "rgba(56, 189, 248, 0.2)",
  },
  solar_ascent: {
    id: "solar_ascent",
    name: "Solar Ascent",
    description: "Crystalline orbit rings & epic solar flares.",
    accent: "#f59e0b",
    accentRgb: "245, 158, 11",
    accentLight: "#fef08a",
    accentDark: "#b45309",
    bg: "#0a0601",
    bgImage: solarAscentBg,
    opacity: "opacity-45",
    textVibe: "Solar Ascent. Harness the power of cosmic fusion.",
    testPrimary: "#fffbeb",
    testMuted: "rgba(253, 224, 71, 0.45)",
    testSubtle: "rgba(245, 158, 11, 0.2)",
  },
  cosmic_vortex: {
    id: "cosmic_vortex",
    name: "Cosmic Vortex",
    description:
      "Swirling fiery paths & intense red-hot super-nebula landscapes.",
    accent: "#f97316",
    accentRgb: "249, 115, 22",
    accentLight: "#fed7aa",
    accentDark: "#c2410c",
    bg: "#050100",
    bgImage: cosmicVortexBg,
    opacity: "opacity-85",
    textVibe:
      "Cosmic Vortex. Unleash your inner furnace and burn through any limits.",
    testPrimary: "#fff5f5",
    testMuted: "rgba(254, 202, 202, 0.45)",
    testSubtle: "rgba(249, 115, 22, 0.2)",
  },
  overgrown_cyber_city: {
    id: "overgrown_cyber_city",
    name: "Overgrown Cyber City",
    description:
      "Lush green overgrown architectural spires & ambient neon teal skylines.",
    accent: "#10b981",
    accentRgb: "16, 185, 129",
    accentLight: "#a7f3d0",
    accentDark: "#047857",
    bg: "#010503",
    bgImage: overgrownCyberCityBg,
    opacity: "opacity-80",
    textVibe:
      "Overgrown Cyber City. Merging high-tech design with vibrant nature.",
    testPrimary: "#ecfdf5",
    testMuted: "rgba(167, 243, 208, 0.45)",
    testSubtle: "rgba(16, 185, 129, 0.2)",
  },
  gradient_red: {
    id: "gradient_red",
    name: "Crimson Eclipse",
    description: "Minimalist deep space crimson aura.",
    accent: "#ef4444",
    accentRgb: "239, 68, 68",
    accentLight: "#fca5a5",
    accentDark: "#991b1b",
    bg: "#000000",
    opacity: "opacity-0",
    textVibe: "Crimson Eclipse. Deep, aggressive dark training state.",
    testPrimary: "#ffffff",
    testMuted: "rgba(255, 255, 255, 0.45)",
    testSubtle: "rgba(239, 68, 68, 0.2)",
    isGradient: true,
  },
  gradient_orange: {
    id: "gradient_orange",
    name: "Volcanic Amber",
    description: "Minimalist volcanic fire aura.",
    accent: "#f97316",
    accentRgb: "249, 115, 22",
    accentLight: "#ffedd5",
    accentDark: "#9a3412",
    bg: "#000000",
    opacity: "opacity-0",
    textVibe: "Volcanic Amber. Heat-forged focus and raw drive.",
    testPrimary: "#ffffff",
    testMuted: "rgba(255, 255, 255, 0.45)",
    testSubtle: "rgba(249, 115, 22, 0.2)",
    isGradient: true,
  },
  gradient_gold: {
    id: "gradient_gold",
    name: "Aurum Eclipse",
    description: "Minimalist absolute premium gold aura.",
    accent: "#d4af37",
    accentRgb: "212, 175, 55",
    accentLight: "#f1e5ac",
    accentDark: "#c5a028",
    bg: "#000000",
    opacity: "opacity-0",
    textVibe: "Aurum Eclipse. Sophisticated champion-status pursuit.",
    testPrimary: "#ffffff",
    testMuted: "rgba(255, 255, 255, 0.45)",
    testSubtle: "rgba(212, 175, 55, 0.2)",
    isGradient: true,
  },
  gradient_green: {
    id: "gradient_green",
    name: "Jade Transcendence",
    description: "Minimalist forest emerald aura.",
    accent: "#10b981",
    accentRgb: "16, 185, 129",
    accentLight: "#a7f3d0",
    accentDark: "#065f46",
    bg: "#000000",
    opacity: "opacity-0",
    textVibe: "Jade Transcendence. Pure focus, tranquil execution.",
    testPrimary: "#ffffff",
    testMuted: "rgba(255, 255, 255, 0.45)",
    testSubtle: "rgba(16, 185, 129, 0.2)",
    isGradient: true,
  },
  gradient_cyan: {
    id: "gradient_cyan",
    name: "Cyan Absolution",
    description: "Minimalist neon electric cyber cyan aura.",
    accent: "#06b6d4",
    accentRgb: "6, 182, 212",
    accentLight: "#cffafe",
    accentDark: "#155e75",
    bg: "#000000",
    opacity: "opacity-0",
    textVibe: "Cyan Absolution. High-frequency digital training halo.",
    testPrimary: "#ffffff",
    testMuted: "rgba(255, 255, 255, 0.45)",
    testSubtle: "rgba(6, 182, 212, 0.2)",
    isGradient: true,
  },
  gradient_blue: {
    id: "gradient_blue",
    name: "Deep Cobalt",
    description: "Minimalist electric twilight wave aura.",
    accent: "#3b82f6",
    accentRgb: "59, 130, 246",
    accentLight: "#dbeafe",
    accentDark: "#1e40af",
    bg: "#000000",
    opacity: "opacity-0",
    textVibe: "Deep Cobalt. Dark ocean power, rhythmic discipline.",
    testPrimary: "#ffffff",
    testMuted: "rgba(255, 255, 255, 0.45)",
    testSubtle: "rgba(59, 130, 246, 0.2)",
    isGradient: true,
  },
  gradient_violet: {
    id: "gradient_violet",
    name: "Amethyst Singularity",
    description: "Minimalist deep galactic cosmic violet aura.",
    accent: "#a855f7",
    accentRgb: "168, 85, 247",
    accentLight: "#f3e8ff",
    accentDark: "#6b21a8",
    bg: "#000000",
    opacity: "opacity-0",
    textVibe: "Amethyst Singularity. Intense, mysterious dimension shift.",
    testPrimary: "#ffffff",
    testMuted: "rgba(255, 255, 255, 0.45)",
    testSubtle: "rgba(168, 85, 247, 0.2)",
    isGradient: true,
  },
  gradient_pink: {
    id: "gradient_pink",
    name: "Rose Hyperspace",
    description: "Minimalist vibrant hyper-synth-pink aura.",
    accent: "#ec4899",
    accentRgb: "236, 72, 153",
    accentLight: "#fce7f3",
    accentDark: "#9d174d",
    bg: "#000000",
    opacity: "opacity-0",
    textVibe: "Rose Hyperspace. Electric charge, limitless potential.",
    testPrimary: "#ffffff",
    testMuted: "rgba(255, 255, 255, 0.45)",
    testSubtle: "rgba(236, 72, 153, 0.2)",
    isGradient: true,
  },
  gradient_mono: {
    id: "gradient_mono",
    name: "Stark Obsidian",
    description: "Minimalist carbon metal neutral steel aura.",
    accent: "#94a3b8",
    accentRgb: "148, 163, 184",
    accentLight: "#cbd5e1",
    accentDark: "#334155",
    bg: "#000000",
    opacity: "opacity-0",
    textVibe: "Stark Obsidian. Zero noise, high performance layout.",
    testPrimary: "#ffffff",
    testMuted: "rgba(255, 255, 255, 0.45)",
    testSubtle: "rgba(148, 163, 184, 0.2)",
    isGradient: true,
  },
};

const getThemeBrightnessClass = (themeId: string): string => {
  if (["neon", "beast"].includes(themeId)) {
    return "brightness-[130%]";
  }
  if (["iron", "void_eclipse"].includes(themeId)) {
    return "brightness-[140%]";
  }
  return "brightness-110";
};

interface PB {
  lastWeight: number;
  lastReps: number;
  lastDate: string;
  bestWeight: number;
  bestReps: number;
  bestDate: string;
  exerciseName: string;
}

interface SessionSet {
  id?: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  timestamp: any;
  notes?: string;
  difficulty?: "easy" | "moderate" | "hard";
  source?: string;
}

interface WeightEntry {
  id?: string;
  weight: number;
  date: string;
  timestamp: any;
}

interface BodyFatEntry {
  id?: string;
  bodyFatPercent: number;
  date: string;
  timestamp: any;
}

export const DAY_CONFIG = [
  {
    label: "1",
    name: "Chest & Triceps",
    pools: [
      "upper_chest",
      "middle_chest",
      "lower_chest",
      "long_triceps",
      "lateral_triceps",
      "medial_triceps",
    ],
    icon: <Crown className="w-5 h-5 text-gym-accent" />,
    bg: "bg-white/[0.03]",
    border: "border-gym-accent/10",
    text: "text-white",
  },
  {
    label: "2",
    name: "Back & Biceps",
    pools: [
      "upper_back",
      "lower_back",
      "long_biceps",
      "short_biceps",
      "brachialis",
    ],
    icon: <ArrowUpDown className="w-5 h-5 text-gym-accent" />,
    bg: "bg-white/[0.03]",
    border: "border-gym-accent/10",
    text: "text-white",
  },
  {
    label: "3",
    name: "Shoulders & Forearms",
    pools: ["front_delts", "side_delts", "rear_delts", "forearms"],
    icon: <Target className="w-5 h-5 text-gym-accent" />,
    bg: "bg-white/[0.03]",
    border: "border-gym-accent/10",
    text: "text-white",
  },
  {
    label: "4",
    name: "Legs & Core",
    pools: ["quads", "hamstrings", "calves", "upper_core", "lower_core", "obliques"],
    icon: <ArrowDown className="w-5 h-5 text-gym-accent" />,
    bg: "bg-white/[0.03]",
    border: "border-gym-accent/10",
    text: "text-white",
  },
  {
    label: "5",
    name: "Cardio",
    pools: ["cardio"],
    icon: <Flame className="w-5 h-5 text-gym-accent" />,
    bg: "bg-white/[0.03]",
    border: "border-gym-accent/10",
    text: "text-white",
  },
  {
    label: "6",
    name: "Equipment",
    pools: ["equipment"],
    icon: <Sliders className="w-5 h-5 text-gym-accent" />,
    bg: "bg-white/[0.03]",
    border: "border-gym-accent/10",
    text: "text-white",
  },
];

export function getStopwatchDurationMs(profile: UserProfile | null): number {
  if (!profile) return 0;
  let totalMs = profile.timerAccumulatedMs || 0;
  if (profile.timerActive && profile.timerStartTime) {
    const startMs = Date.parse(profile.timerStartTime);
    if (!isNaN(startMs)) {
      totalMs += Date.now() - startMs;
    }
  } else if (!profile.timerActive && profile.timerStartTime && profile.timerEndTime && totalMs === 0) {
    const startMs = Date.parse(profile.timerStartTime);
    const endMs = Date.parse(profile.timerEndTime);
    if (!isNaN(startMs) && !isNaN(endMs) && endMs > startMs) {
      totalMs = endMs - startMs;
    }
  }
  return totalMs;
}

export const calculateCaloriesBurned = (
  sets: SessionSet[],
  userProfile: UserProfile | null,
) => {
  if (!sets || sets.length === 0) return 0;

  const bodyweight = userProfile?.bodyweight || 65; // kg
  const height = userProfile?.height || 175; // cm
  const age = userProfile?.age || 28; // years
  const sex = userProfile?.sex || "male";
  const bodyFat = userProfile?.bodyFatPercent;

  let bmr = 0;
  if (bodyFat && bodyFat > 0) {
    bmr = 370 + 21.6 * (bodyweight * (1 - bodyFat / 100));
  } else {
    if (sex === "male") {
      bmr = 10 * bodyweight + 6.25 * height - 5 * age + 5;
    } else if (sex === "female") {
      bmr = 10 * bodyweight + 6.25 * height - 5 * age - 161;
    } else {
      bmr = 10 * bodyweight + 6.25 * height - 5 * age - 78;
    }
  }

  const findExByName = (name: string): Exercise | null => {
    if (!name) return null;
    const searchName = name.trim().toLowerCase();
    try {
      const saved = localStorage.getItem("gym_custom_exercises");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const found = parsed.find(
            (e) => e.name?.trim().toLowerCase() === searchName,
          );
          if (found) return found;
        }
      }
    } catch (e) {
      console.error("Failed to parse custom exercises in findExByName:", e);
    }
    for (const pool of Object.values(POOLS)) {
      const ex = pool.find((e) => e.name.trim().toLowerCase() === searchName);
      if (ex) return ex;
    }
    return null;
  };

  const setsByExercise: Record<string, SessionSet[]> = {};
  sets.forEach((s) => {
    if (!s) return;
    if (!setsByExercise[s.exerciseName]) {
      setsByExercise[s.exerciseName] = [];
    }
    setsByExercise[s.exerciseName].push(s);
  });

  let totalActiveCalories = 0;
  let totalActiveTimeMin = 0;

  Object.entries(setsByExercise).forEach(([exName, exSets]) => {
    const ex = findExByName(exName);
    const isCardio = ex?.pool === "cardio";
    const isEquipment = ex?.pool === "equipment";

    exSets.forEach((s) => {
      // Use intensity-based MET if available
      let activeMET = isCardio ? 8.5 : isEquipment ? 6.5 : 5.5;
      if (s.difficulty === "hard") {
        activeMET += 1.0; // higher burn for struggle sets
      } else if (s.difficulty === "easy") {
        activeMET -= 1.0; // lower burn for easy sets
      }

      if (isCardio) {
        const durationMin = s.weight || 0;
        const activeCalPerMin = (activeMET * 3.5 * bodyweight) / 200;
        totalActiveCalories += durationMin * activeCalPerMin;
        totalActiveTimeMin += durationMin;
      } else {
        const reps = s.reps || 0;
        const activeTimeSec = reps * 4; // average 4 seconds per rep
        const activeTimeMin = activeTimeSec / 60;
        const activeCalPerMin = (activeMET * 3.5 * bodyweight) / 200;

        totalActiveCalories += activeTimeMin * activeCalPerMin;
        totalActiveTimeMin += activeTimeMin;
      }
    });
  });

  // Calculate total session duration in minutes
  let sessionDurationMin = 0;
  let hasValidDuration = false;

  if (userProfile?.timerManualDuration && userProfile.timerManualDuration > 0) {
    sessionDurationMin = userProfile.timerManualDuration;
    hasValidDuration = true;
  } else {
    const durationMs = getStopwatchDurationMs(userProfile);
    if (durationMs > 0) {
      const rawDuration = durationMs / 60000;
      if (rawDuration > 240) {
        sessionDurationMin = 180;
      } else {
        sessionDurationMin = rawDuration;
      }
      hasValidDuration = true;
    } else {
      // Fallback 1: If stopwatch is not active, calculate time elapsed since the first logged exercise set!
      const validTimestamps = sets
        .map((s) => getRestSetTimestamp(s))
        .filter((ts) => ts > 0);
      if (validTimestamps.length > 0) {
        const firstSetTimeMs = Math.min(...validTimestamps);
        const lastSetTimeMs = Math.max(...validTimestamps);
        // Add a 3-minute padding after the last set, capped between first set and Date.now()
        const endTimeMs = Math.min(Date.now(), lastSetTimeMs + 180000);
        const elapsedMin = (endTimeMs - firstSetTimeMs) / 60000;
        if (elapsedMin > 0.5) {
          sessionDurationMin = Math.min(240, elapsedMin);
          hasValidDuration = true;
        }
      }
    }
  }

  // Calculate rest period between consecutive sets and baseline/transition time
  let restTimeMin = 0;
  if (hasValidDuration && sessionDurationMin > 0) {
    restTimeMin = Math.max(0, sessionDurationMin - totalActiveTimeMin);
  } else {
    // Fallback 2: Estimate based on actual logged set timestamp gaps plus default rest period per set
    const sortedSets = [...sets].sort(
      (a, b) => getRestSetTimestamp(a) - getRestSetTimestamp(b),
    );
    let measuredRestMs = 0;
    for (let i = 0; i < sortedSets.length - 1; i++) {
      const currentTs = getRestSetTimestamp(sortedSets[i]);
      const nextTs = getRestSetTimestamp(sortedSets[i + 1]);
      const diffMs = nextTs - currentTs;
      // Normal rest interval is between 10 seconds and 15 minutes
      if (diffMs >= 10000 && diffMs <= 900000) {
        measuredRestMs += diffMs;
      }
    }

    if (measuredRestMs > 0) {
      restTimeMin = measuredRestMs / 60000;
    } else {
      // Fallback 3: Standard proportional rest time
      let estimatedRestTimeMin = 0;
      Object.entries(setsByExercise).forEach(([exName, exSets]) => {
        const ex = findExByName(exName);
        const isCardio = ex?.pool === "cardio";
        if (!isCardio) {
          estimatedRestTimeMin += exSets.length * 1.5; // average 1.5 minutes rest per set
        } else {
          estimatedRestTimeMin += 1.0;
        }
      });
      restTimeMin = estimatedRestTimeMin;
    }
  }

  const restMET = 1.5;
  const restCalPerMin = (restMET * 3.5 * bodyweight) / 200;
  const restCalories = restTimeMin * restCalPerMin;

  const totalCalories = totalActiveCalories + restCalories;

  return Math.round(totalCalories);
};

const iconMap: Record<string, any> = {
  Dumbbell,
  ArrowLeftRight,
  ArrowDown,
  Activity,
  ArrowUp,
  ArrowUpCircle,
  ArrowUpDown,
  RotateCw,
  RefreshCw,
  Plus,
  Flame,
  Shield,
  Crown,
  Target,
  Zap,
  Sliders,
  TrendingUp,
  Trophy,
};

// --- Helpers ---
const getRestSetTimestamp = (set: SessionSet) => {
  if (set && set.timestamp) {
    if (typeof set.timestamp.toMillis === "function") return set.timestamp.toMillis();
    if (set.timestamp.seconds) return set.timestamp.seconds * 1000;
  }
  if (set && set.date) {
    const parsed = Date.parse(set.date);
    if (!isNaN(parsed)) return parsed;
  }
  return Date.now();
};

// --- Components ---
const PBBlock = ({
  exName,
  pbs,
  showLatest = true,
  sessionSets = [],
  archivedWorkouts = [],
}: {
  exName: string;
  pbs: Record<string, PB>;
  showLatest?: boolean;
  sessionSets?: SessionSet[];
  archivedWorkouts?: any[];
}) => {
  const pb = pbs[exName];

  // Gather previous logged data
  const exerciseSets: { weight: number; reps: number; date?: string }[] = [];

  // 1. From archived sessions (completed and saved)
  archivedWorkouts.forEach((w) => {
    if (w && Array.isArray(w.sets)) {
      w.sets.forEach((s: any) => {
        if (
          s &&
          s.exerciseName &&
          s.exerciseName.trim().toLowerCase() === exName.trim().toLowerCase()
        ) {
          exerciseSets.push({
            weight: s.weight,
            reps: s.reps,
            date: s.date || w.date,
          });
        }
      });
    }
  });

  // 3. From PB if exists
  if (pb) {
    if (pb.bestWeight > 0 && pb.bestReps > 0) {
      exerciseSets.push({
        weight: pb.bestWeight,
        reps: pb.bestReps,
        date: pb.bestDate,
      });
    }
    if (pb.lastWeight > 0 && pb.lastReps > 0) {
      exerciseSets.push({
        weight: pb.lastWeight,
        reps: pb.lastReps,
        date: pb.lastDate,
      });
    }
  }

  // Find highest logged weight for this specific exercise
  let maxWeightAtBlock = -1;
  exerciseSets.forEach((s) => {
    if (s.weight > maxWeightAtBlock) {
      maxWeightAtBlock = s.weight;
    }
  });

  const setsAtMaxWith10PlusReps = exerciseSets.filter(
    (s) => s.weight === maxWeightAtBlock && s.reps >= 10
  );
  const completed3SetsOf10 = setsAtMaxWith10PlusReps.length >= 3;

  const isAssisted = exName.trim().toLowerCase().includes("assisted pull");

  // Calculate maximum 1 Rep Max (1RM) using Epley Formula
  let max1RM = isAssisted ? 999999 : 0;
  let maxBaseSet: { weight: number; reps: number; date?: string } | null = null;

  exerciseSets.forEach((set) => {
    if (set.reps > 0 && (isAssisted ? set.weight >= 0 : set.weight > 0)) {
      const base1RM =
        set.reps === 1 ? set.weight : set.weight * (1 + set.reps / 30);
      if (isAssisted) {
        if (base1RM < max1RM) {
          max1RM = base1RM;
          maxBaseSet = set;
        }
      } else {
        if (base1RM > max1RM) {
          max1RM = base1RM;
          maxBaseSet = set;
        }
      }
    }
  });

  if (isAssisted && max1RM === 999999) {
    max1RM = 0;
  }

  if (!pb && max1RM === 0) {
    return (
      <div className="mt-3 p-3 rounded-xl bg-black/60 border border-gym-accent/25">
        <div className="text-[10px] text-gym-accent font-bold uppercase mb-1 tracking-wider">
          No History
        </div>
        <div className="text-xs text-white/40">
          Save a set to track progress
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 p-4 rounded-md bg-black/55 border border-gym-accent/20">
      {pb && (
        <div
          className={`text-[10px] text-gym-accent font-bold uppercase tracking-wider flex items-center gap-2 ${showLatest ? "mb-4" : ""}`}
        >
          <Trophy className="w-3 h-3 text-gym-accent" /> Peak:{" "}
          <span className="text-gym-accent-light">
            {pb.bestWeight}kg × {pb.bestReps}
          </span>{" "}
          <span className="opacity-40 text-[9px] ml-1 tracking-normal font-light">
            ({pb.bestDate})
          </span>
        </div>
      )}

      {showLatest && pb && (
        <div className="flex items-end justify-between">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] opacity-40 uppercase tracking-widest mb-1">
                Weight
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-light text-white">
                  {pb.lastWeight}
                </span>
                <span className="text-[10px] text-white/30 uppercase font-medium">
                  kg
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] opacity-40 uppercase tracking-widest mb-1">
                Reps
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-light text-white">
                  {pb.lastReps}
                </span>
                <span className="text-[10px] text-white/30 uppercase font-medium">
                  reps
                </span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-white/20 uppercase tracking-tighter">
            Latest: {pb.lastDate}
          </div>
        </div>
      )}

    </div>
  );
};

interface UserProfile {
  displayName?: string;
  photoURL?: string;
  startDate?: string;
  streakCount?: number;
  lastWorkoutDate?: string;
  activeView?: string;
  themeId?: string;
  carbonBlack?: boolean;
  equippedBorder?: string;
  bodyweight?: number;
  sex?: "male" | "female" | "other";
  age?: number;
  bodyFatPercent?: number;
  height?: number;
  avatarLevel?: number;
  avatarXp?: number;
  avatarCredits?: number;
  unassignedPoints?: number;
  timerStartTime?: string;
  timerEndTime?: string;
  timerActive?: boolean;
  timerManualDuration?: number;
  timerAccumulatedMs?: number;
}

interface ProfileDisplayNameEditorProps {
  profile: UserProfile | null;
  currentUser: any;
  saveSettings: (settings: any) => Promise<void>;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setToast: (
    toast: { message: string; type: "success" | "pb" | "info" } | null,
  ) => void;
}

function ProfileDisplayNameEditor({
  profile,
  currentUser,
  saveSettings,
  setProfile,
  setToast,
}: ProfileDisplayNameEditorProps) {
  const initialName =
    profile?.displayName || currentUser?.displayName || "Athlete";
  const [name, setName] = useState(initialName);
  const [isSaved, setIsSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(profile?.displayName || currentUser?.displayName || "Athlete");
    setIsSaved(true);
  }, [profile?.displayName, currentUser?.displayName]);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setToast({ message: "Display name cannot be empty", type: "info" });
      return;
    }
    if (trimmed === profile?.displayName) {
      setIsSaved(true);
      return;
    }
    setIsSaving(true);
    try {
      await saveSettings({ displayName: trimmed });
      setProfile((prev) => (prev ? { ...prev, displayName: trimmed } : null));
      setIsSaved(true);
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to update identity", type: "info" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[9px] text-white/25 uppercase tracking-[0.25em] font-black">
        Display Name
      </span>
      <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-md p-2 text-sm focus-within:border-gym-accent focus-within:bg-white/[0.04] transition-all">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setIsSaved(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
          className="bg-transparent flex-1 text-sm font-medium tracking-wide focus:outline-none text-white font-sans py-1"
          placeholder="Choose display identity..."
        />

        <button
          onClick={handleSave}
          disabled={
            isSaving ||
            (isSaved &&
              name === (profile?.displayName || currentUser?.displayName))
          }
          className={`px-4 py-1.5 rounded-xs text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 ${
            isSaving
              ? "bg-white/5 text-white/40 cursor-not-allowed"
              : isSaved &&
                  name === (profile?.displayName || currentUser?.displayName)
                ? "bg-white/[0.02] text-white/20 cursor-default"
                : "bg-gym-accent text-black font-black hover:bg-gym-accent/80 hover:scale-[1.01] active:scale-[0.99]"
          }`}
        >
          {isSaving ? (
            <>
              <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Saving...
            </>
          ) : isSaved &&
            name === (profile?.displayName || currentUser?.displayName) ? (
            <>
              <Check className="w-3 h-3 stroke-[2.5]" /> Synced
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" /> Save
            </>
          )}
        </button>
      </div>
    </div>
  );
}

const mapPoolToMuscleGroup = (pool: string): string => {
  if (!pool) return "Other";
  const p = pool.toLowerCase().trim();
  if (p.includes("chest")) return "Chest";
  if (p.includes("triceps")) return "Triceps";
  if (p.includes("back") || p === "lats" || p === "rhomboids_traps" || p === "erector_spinae") return "Back";
  if (p.includes("biceps") || p === "brachialis") return "Biceps";
  if (p.includes("delts") || p === "shoulders") return "Shoulders";
  if (p === "forearms") return "Forearms";
  if (p === "legs" || p.includes("quad") || p.includes("hamstring") || p.includes("calf") || p.includes("glute") || p.includes("squat") || p.includes("leg")) return "Legs";
  if (p.includes("core") || p === "obliques" || p === "core" || p.includes("abs")) return "Core";
  if (p === "cardio") return "Cardio";
  if (p === "equipment") return "Equipment";
  return "Other";
};

const getMuscleGroupIcon = (group: string) => {
  switch (group.toLowerCase()) {
    case "chest":
    case "triceps":
      return <Crown className="w-3.5 h-3.5" />;
    case "back":
    case "biceps":
      return <ArrowUpDown className="w-3.5 h-3.5" />;
    case "shoulders":
    case "forearms":
      return <Target className="w-3.5 h-3.5" />;
    case "legs":
    case "core":
      return <ArrowDown className="w-3.5 h-3.5" />;
    case "cardio":
      return <Flame className="w-3.5 h-3.5" />;
    case "equipment":
      return <Sliders className="w-3.5 h-3.5" />;
    default:
      return <Dumbbell className="w-3.5 h-3.5" />;
  }
};

const getLibraryCategoryIcon = (key: string) => {
  switch (key.toLowerCase()) {
    case "chest":
      return <Crown className="w-5 h-5 text-gym-accent" />;
    case "back":
      return <ArrowUpDown className="w-5 h-5 text-gym-accent" />;
    case "shoulders":
      return <Target className="w-5 h-5 text-gym-accent" />;
    case "legs":
      return <ArrowDown className="w-5 h-5 text-gym-accent" />;
    case "biceps":
      return <RotateCw className="w-5 h-5 text-gym-accent" />;
    case "triceps":
      return <ArrowUpCircle className="w-5 h-5 text-gym-accent" />;
    case "forearms":
      return <GripVertical className="w-5 h-5 text-gym-accent" />;
    case "core":
      return <TrendingUp className="w-5 h-5 text-gym-accent" />;
    case "cardio":
      return <Flame className="w-5 h-5 text-gym-accent" />;
    case "equipment":
      return <Sliders className="w-5 h-5 text-gym-accent" />;
    default:
      return <Dumbbell className="w-5 h-5 text-gym-accent" />;
  }
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "reset">(
    "login",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  const [currentDays, setCurrentDays] = useState<Exercise[][]>([
    [],
    [],
    [],
    [],
    [],
    [],
  ]);
  const [workoutInnerTab, setWorkoutInnerTab] = useState<"builder" | "program">("builder");
  const [formattedProgram, setFormattedProgram] = useState<{ dayIndex: number; dayName: string; exercises: Exercise[] }[]>([]);
  const [sessionSummary, setSessionSummary] = useState<{
    totalVolume: number;
    peakWeight: number;
    peakExercise: string;
    totalSets: number;
    caloriesBurned: number;
    muscleGroups: { name: string; count: number; percentage: number }[];
    exercisesList: { name: string; setsCount: number; maxWeight: number; volume: number }[];
    date: string;
  } | null>(null);


  const [personalBests, setPersonalBests] = useState<Record<string, PB>>({});
  const [workoutsLoaded, setWorkoutsLoaded] = useState(false);
  const [pbsLoaded, setPbsLoaded] = useState(false);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [bodyFatHistory, setBodyFatHistory] = useState<BodyFatEntry[]>([]);
  const [sessionSets, setSessionSets] = useState<SessionSet[]>([]);
  const [archivedWorkouts, setArchivedWorkouts] = useState<any[]>([]);

  // Global Rest Tracker state
  const [restAudioEnabled, setRestAudioEnabled] = useState<boolean>(true);
  const [manualRestTime, setManualRestTime] = useState<number>(90);
  const [manualRestActive, setManualRestActive] = useState<boolean>(false);
  const [manualRestTarget, setManualRestTarget] = useState<number>(90);
  // State for session view selection
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null,
  );
  const [showHistoryMenu, setShowHistoryMenu] = useState(false);
  const [activeView, setActiveView] = useState<
    | "console"
    | "workout"
    | "library"
    | "progress"
    | "session"
    | "routines"
    | "map"
    | "gym_locator"
    | "profile"
    | "anatomy"
    | "avatar"
  >("console");
  const [showLandingPage, setShowLandingPage] = useState<boolean>(false);
  const [hasCheckedLanding, setHasCheckedLanding] = useState<boolean>(false);
  const [routines, setRoutines] = useState<any[]>([]);
  const [savingRoutineWorkout, setSavingRoutineWorkout] = useState<any | null>(
    null,
  );
  const [expandedRoutinesDays, setExpandedRoutinesDays] = useState<
    Record<number, boolean>
  >({});
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [editingRoutineName, setEditingRoutineName] = useState<string>("");
  const [guidanceEx, setGuidanceEx] = useState<Exercise | null>(null);
  const [loggingEx, setLoggingEx] = useState<Exercise | null>(null);
  const [popupWeight, setPopupWeight] = useState("");
  const [popupReps, setPopupReps] = useState("");
  const [popupNotes, setPopupNotes] = useState("");
  const [popupDifficulty, setPopupDifficulty] = useState<"easy" | "moderate" | "hard">("moderate");
  const [swappingExercise, setSwappingExercise] = useState<{
    dayIndex: number;
    exIndex: number;
    exercise: Exercise;
  } | null>(null);
  const [swapSearch, setSwapSearch] = useState("");
  const hasConsolidatedRef = useRef(false);

  // --- Custom Routine Builder States ---
  const [isCreatingRoutine, setIsCreatingRoutine] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");
  const [newRoutineCategory, setNewRoutineCategory] = useState(0);
  const [newRoutineExercises, setNewRoutineExercises] = useState<{
    id: string;
    exerciseName: string;
    sets: { weight: number; reps: number; notes: string }[];
  }[]>([]);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [builderSearch, setBuilderSearch] = useState("");
  const [newRoutinePeriodization, setNewRoutinePeriodization] = useState<"hypertrophy" | "strength" | "deload">("hypertrophy");
  const [shuffleTrigger, setShuffleTrigger] = useState(0);

  const [customExercises, setCustomExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem("gym_custom_exercises");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse local custom exercises:", e);
      }
    }
    return [];
  });

  const [favoriteExercises, setFavoriteExercises] = useState<string[]>(() => {
    const saved = localStorage.getItem("gym_favorite_exercises");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse local favorite exercises:", e);
      }
    }
    return [];
  });
  const [builderShowFavoritesOnly, setBuilderShowFavoritesOnly] = useState(false);
  const [builderFavDropdownOpen, setBuilderFavDropdownOpen] = useState(false);
  const [favoritesDropdownOpen, setFavoritesDropdownOpen] = useState(false);
  const [selectedFavorites, setSelectedFavorites] = useState<Record<string, boolean>>({});
  const [favoritesModalOpen, setFavoritesModalOpen] = useState(false);
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customExName, setCustomExName] = useState("");
  const [customExPool, setCustomExPool] = useState<
    | "chest"
    | "back"
    | "shoulders"
    | "legs"
    | "biceps"
    | "triceps"
    | "core"
    | "cardio"
    | "equipment"
    | "forearms"
    | "upper_back"
    | "lower_back"
    | "front_delts"
    | "side_delts"
    | "rear_delts"
    | "upper_core"
    | "lower_core"
    | "obliques"
    | "upper_chest"
    | "middle_chest"
    | "lower_chest"
    | "long_biceps"
    | "short_biceps"
    | "brachialis"
    | "long_triceps"
    | "lateral_triceps"
    | "medial_triceps"
  >("middle_chest");
  const [customExCategory, setCustomExCategory] = useState<
    "compound" | "isolation"
  >("compound");
  const [customExVideoUrl, setCustomExVideoUrl] = useState("");
  const [customGuidanceSteps, setCustomGuidanceSteps] = useState<string[]>([]);
  const [guidanceStepInput, setGuidanceStepInput] = useState("");
  const [creatingCustomForDay, setCreatingCustomForDay] = useState<
    number | null
  >(null);

  const cnsFatigueAnalysis = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const isWithin72Hours = (dateStr: string): boolean => {
      if (!dateStr) return false;
      try {
        const date = new Date(dateStr + 'T00:00:00');
        if (isNaN(date.getTime())) return false;
        const diffTime = today.getTime() - date.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 3;
      } catch {
        return false;
      }
    };

    const getDaysAgo = (dateStr: string): number => {
      if (!dateStr) return 0;
      try {
        const date = new Date(dateStr + 'T00:00:00');
        if (isNaN(date.getTime())) return 0;
        
        const tToday = new Date(today);
        tToday.setHours(0, 0, 0, 0);
        const tDate = new Date(date);
        tDate.setHours(0, 0, 0, 0);
        
        const diffTime = tToday.getTime() - tDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
      } catch {
        return 0;
      }
    };

    const getSpinalIntensity = (name: string): number => {
      const n = name.toLowerCase().trim();
      if (n.includes('deadlift') || n.includes('rack pull') || n.includes('good morning') || n.includes('deficit deadlift')) return 9.0;
      if (n.includes('squat') && (n.includes('barbell') || n.includes('back') || n.includes('front') || n.includes('safety'))) return 7.5;
      if (n.includes('row') && (n.includes('barbell') || n.includes('bent over') || n.includes('t-bar'))) return 5.0;
      if (n.includes('press') && (n.includes('overhead') || n.includes('military') || n.includes('standing') || n.includes('shoulder')) || n.includes('clean') || n.includes('snatch') || n.includes('thruster')) return 5.0;
      if (n.includes('squat') || n.includes('leg press') || n.includes('hack squat') || n.includes('lunges')) return 3.0;
      if (n.includes('bench press') || n.includes('chest press') || n.includes('dip') || n.includes('pullup') || n.includes('chin up') || n.includes('lat pulldown') || n.includes('dumbbell row')) return 2.0;
      if (n.includes('curl') || n.includes('extension') || n.includes('pushdown') || n.includes('fly') || n.includes('raise') || n.includes('shrug') || n.includes('crunch') || n.includes('plank')) return 0.4;
      return 0.5;
    };

    // We will group sets by exercise name and daysAgo to correctly apply set-diminishing fatigue
    const exerciseLoads: Record<string, Record<number, number>> = {};
    const registerSetCount = (exerciseName: string, daysAgo: number) => {
      const nameKey = exerciseName.toLowerCase().trim();
      if (!exerciseLoads[nameKey]) {
        exerciseLoads[nameKey] = {};
      }
      exerciseLoads[nameKey][daysAgo] = (exerciseLoads[nameKey][daysAgo] || 0) + 1;
    };

    // 1. Process active sets (today = 0 days ago)
    sessionSets.forEach(s => {
      registerSetCount(s.exerciseName, 0);
    });

    // 2. Process archived sets in last 72 hours
    archivedWorkouts.forEach(w => {
      if (w && isWithin72Hours(w.date) && w.sets && Array.isArray(w.sets)) {
        const daysAgo = getDaysAgo(w.date);
        if (daysAgo <= 3) {
          w.sets.forEach((s: any) => {
            registerSetCount(s.exerciseName, daysAgo);
          });
        }
      }
    });

    let totalSpinalLoad = 0;
    const contributors: { exercise: string; setsCount: number; loadingPerSet: number; totalContribution: number }[] = [];

    // Map to get the display title of the exercise
    const exerciseDisplayNames: Record<string, string> = {};
    sessionSets.forEach(s => {
      exerciseDisplayNames[s.exerciseName.toLowerCase().trim()] = s.exerciseName;
    });
    archivedWorkouts.forEach(w => {
      if (w && w.sets && Array.isArray(w.sets)) {
        w.sets.forEach((s: any) => {
          exerciseDisplayNames[s.exerciseName.toLowerCase().trim()] = s.exerciseName;
        });
      }
    });

    Object.entries(exerciseLoads).forEach(([nameKey, daysAgoRecord]) => {
      const baseIntensity = getSpinalIntensity(nameKey);
      const displayName = exerciseDisplayNames[nameKey] || nameKey;
      
      let exerciseTotalContribution = 0;
      let totalSetsCount = 0;

      Object.entries(daysAgoRecord).forEach(([daysAgoStr, setsCount]) => {
        const daysAgo = parseInt(daysAgoStr, 10);
        
        let timeDecay = 1.0;
        if (daysAgo === 1) timeDecay = 0.50;
        else if (daysAgo === 2) timeDecay = 0.25;
        else if (daysAgo >= 3) timeDecay = 0.10;

        let intervalContribution = 0;
        for (let setIndex = 0; setIndex < setsCount; setIndex++) {
          let setDecay = 1.0;
          if (setIndex === 1) setDecay = 0.5;
          else if (setIndex === 2) setDecay = 0.3;
          else if (setIndex >= 3) setDecay = 0.2;
          
          intervalContribution += baseIntensity * setDecay * timeDecay;
        }

        exerciseTotalContribution += intervalContribution;
        totalSetsCount += setsCount;
      });

      totalSpinalLoad += exerciseTotalContribution;

      contributors.push({
        exercise: displayName,
        setsCount: totalSetsCount,
        loadingPerSet: baseIntensity,
        totalContribution: exerciseTotalContribution
      });
    });

    contributors.sort((a, b) => b.totalContribution - a.totalContribution);

    // Dynamic CNS fatigue index capped at 100%
    // 30 load units represents heavy central fatigue safely and realistically with the diminishing loads model
    const score = Math.min(100, Math.round((totalSpinalLoad / 30) * 100));

    let label = 'FRESH & ENERGY CHARGED';
    let sublabel = 'Optimal neural efficiency. Ready for high-force motor recruitment.';
    let recommendations = 'CNS integrity is fully recovered. You are clear for high-load strength testing (3-5 rep max effort). Workouts targeting heavy compounds will be highly productive today.';
    let levelColor = 'text-green-400 bg-green-500/10 border-green-500/20';
    let barColor = 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
    let hexColor = '#22c55e';

    if (score > 85) {
      label = 'CRITICAL CNS NEURAL FRY';
      sublabel = 'Extremely high central fatigue detected. Joint shear risks elevated.';
      recommendations = 'Take an active deload day or full active rest. If training today, perform strictly low-impact single-joint isolation machines (reps 15+). Do not touch the vertical barbell.';
      levelColor = 'text-red-400 bg-red-950/40 border-red-500/20 animate-pulse';
      barColor = 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]';
      hexColor = '#ef4444';
    } else if (score > 55) {
      label = 'CNS TAXED & DAMPENED';
      sublabel = 'Substantial central nervous wear. Spinal stabilizers are under load.';
      recommendations = 'Rest highly advised or transition to mechanical tension / hypertrophy. Keep absolute load sub-maximal (<75% 1RM). Focus on unilateral dumbbell or machine work rather than heavy standing barbell lifts.';
      levelColor = 'text-amber-500 bg-amber-950/40 border-amber-500/20';
      barColor = 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]';
      hexColor = '#f59e0b';
    } else if (score > 25) {
      label = 'MODERATE SYSTEMIC WEAR';
      sublabel = 'Accumulating spinal load. Productive hypertrophy zoning.';
      recommendations = 'Standard capacity. Excellent window for mid-range hypertrophy loads (8-12 reps per set). Ensure correct structural patterns and core bracing prior to squats or rows.';
      levelColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      barColor = 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
      hexColor = '#10b981';
    }

    return {
      score,
      totalSpinalLoad,
      contributors,
      label,
      sublabel,
      recommendations,
      levelColor,
      barColor,
      hexColor
    };
  }, [sessionSets, archivedWorkouts]);

  const combinedPools: Record<string, Exercise[]> = useMemo(() => {
    const merged: Record<string, Exercise[]> = { ...POOLS };
    customExercises.forEach((ex) => {
      const poolKey = ex.pool;
      if (merged[poolKey]) {
        if (
          !merged[poolKey].some(
            (e) => e.name.trim().toLowerCase() === ex.name.trim().toLowerCase(),
          )
        ) {
          merged[poolKey] = [...merged[poolKey], ex];
        }
      } else {
        merged[poolKey] = [ex];
      }
    });
    return merged;
  }, [customExercises]);

  const toggleFavoriteExercise = async (exName: string) => {
    const isFav = favoriteExercises.includes(exName);
    let updated: string[];
    if (isFav) {
      updated = favoriteExercises.filter((name) => name !== exName);
    } else {
      updated = [...favoriteExercises, exName];
    }
    setFavoriteExercises(updated);
    localStorage.setItem("gym_favorite_exercises", JSON.stringify(updated));

    if (currentUser) {
      try {
        const idSafe = exName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
        const docRef = doc(db, `users/${currentUser.uid}/favorite_exercises`, idSafe);
        if (isFav) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { name: exName, isFavorite: true });
        }
      } catch (err) {
        console.error("Error toggling favorite in firestore:", err);
      }
    }
  };

  const getFavoriteExercisesByCategory = (): { categoryTitle: string; list: Exercise[] }[] => {
    const categoryOrder = [
      "chest",
      "triceps",
      "back",
      "biceps",
      "shoulders",
      "forearms",
      "legs",
      "core",
      "cardio",
      "equipment",
    ];

    return categoryOrder.map((catKey) => {
      let list: Exercise[] = [];
      if (catKey === "chest") {
        list = [
          ...(combinedPools["upper_chest"] || []),
          ...(combinedPools["middle_chest"] || []),
          ...(combinedPools["lower_chest"] || []),
        ];
      } else if (catKey === "back") {
        list = [
          ...(combinedPools["upper_back"] || []),
          ...(combinedPools["lower_back"] || []),
        ];
      } else if (catKey === "shoulders") {
        list = [
          ...(combinedPools["front_delts"] || []),
          ...(combinedPools["side_delts"] || []),
          ...(combinedPools["rear_delts"] || []),
        ];
      } else if (catKey === "biceps") {
        list = [
          ...(combinedPools["long_biceps"] || []),
          ...(combinedPools["short_biceps"] || []),
          ...(combinedPools["brachialis"] || []),
        ];
      } else if (catKey === "triceps") {
        list = [
          ...(combinedPools["long_triceps"] || []),
          ...(combinedPools["lateral_triceps"] || []),
          ...(combinedPools["medial_triceps"] || []),
        ];
      } else if (catKey === "legs") {
        list = [
          ...(combinedPools["quads"] || []),
          ...(combinedPools["hamstrings"] || []),
          ...(combinedPools["calves"] || []),
        ];
      } else if (catKey === "core") {
        list = [
          ...(combinedPools["upper_core"] || []),
          ...(combinedPools["lower_core"] || []),
          ...(combinedPools["obliques"] || []),
        ];
      } else {
        list = combinedPools[catKey] || [];
      }

      const favorited = list.filter((ex) =>
        favoriteExercises.some(
          (favName) => favName.toLowerCase() === ex.name.toLowerCase()
        )
      );

      return {
        categoryTitle: catKey.charAt(0).toUpperCase() + catKey.slice(1),
        list: favorited.sort((a, b) => a.name.localeCompare(b.name)),
      };
    }).filter((cat) => cat.list.length > 0);
  };

  const getTargetDayForExercise = (ex: Exercise): number => {
    const pool = ex.pool || "";
    const idx = DAY_CONFIG.findIndex(day => day.pools.includes(pool));
    return idx !== -1 ? idx : 4; // default to equipment/extra (Day 5)
  };

  const getExercisesForDay = (categoryIdx: number): Exercise[] => {
    const config = DAY_CONFIG[categoryIdx];
    if (!config) return [];
    const list: Exercise[] = [];
    config.pools.forEach((poolKey) => {
      const pool = combinedPools[poolKey] || [];
      pool.forEach((ex) => {
        if (!list.some((e) => e.name.toLowerCase() === ex.name.toLowerCase())) {
          list.push(ex);
        }
      });
    });
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  };

  const suggestedExercises = useMemo(() => {
    const config = DAY_CONFIG[newRoutineCategory];
    if (!config) return [];
    const suggested: Exercise[] = [];
    const pools = config.pools;

    // Helper to shuffle array (purely)
    const shuffle = <T,>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    // Shuffling the exercises in each pool
    const shuffledPools: Record<string, Exercise[]> = {};
    pools.forEach((poolKey) => {
      shuffledPools[poolKey] = shuffle(combinedPools[poolKey] || []);
    });

    // 1. Get at least 1 exercise from each pool to cover each muscle compartment (muscle section)
    pools.forEach((poolKey) => {
      const list = shuffledPools[poolKey] || [];
      if (list.length > 0) {
        suggested.push(list[0]);
      }
    });

    // 2. We want at least 7 exercises to cover a complete routine (user requested "at least 6-7 exercises")
    if (suggested.length < 7) {
      let poolIdx = 0;
      const poolIdxMap: Record<string, number> = {};
      pools.forEach(pk => { poolIdxMap[pk] = 1; }); // start looking from index 1

      let attempts = 0;
      while (suggested.length < 7 && attempts < 150) {
        attempts++;
        const poolKey = pools[poolIdx % pools.length];
        const list = shuffledPools[poolKey] || [];
        const nextIdx = poolIdxMap[poolKey] || 1;
        if (nextIdx < list.length) {
          const found = list[nextIdx];
          if (!suggested.some(s => s.name.toLowerCase() === found.name.toLowerCase())) {
            suggested.push(found);
          }
          poolIdxMap[poolKey] = nextIdx + 1;
        }
        poolIdx++;
      }
    }

    return suggested;
  }, [newRoutineCategory, combinedPools, shuffleTrigger]);

  const handleLoadSuggestedExercises = (exercisesToLoad: Exercise[]) => {
    const items = exercisesToLoad.map((ex) => ({
      id: Math.random().toString(36).substring(2, 9),
      exerciseName: ex.name.trim(),
      sets: [
        { weight: 20, reps: 10, notes: "" },
        { weight: 20, reps: 10, notes: "" },
        { weight: 20, reps: 10, notes: "" },
      ],
    }));

    setNewRoutineExercises(items);
    setToast({
      message: `Loaded ${items.length} suggested exercises covering all muscle sections!`,
      type: "success"
    });
  };

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "pb" | "info";
  } | null>(null);

  const [viewingNote, setViewingNote] = useState<string | null>(null);

  // Auto-dismiss any toast after exactly 3.0 seconds (3000ms)
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Global Rest Tracker audio helper
  const playRestBeep = (frequency = 880, duration = 0.15) => {
    if (!restAudioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context not allowed or supported yet.", e);
    }
  };

  const formattedProgramSets = useMemo(() => {
    return sessionSets.filter(s => s && s.source === "formatted_program");
  }, [sessionSets]);

  const prevRestSetsLengthRef = useRef(sessionSets.length);

  // Sound chime and start manual rest countdown on new set logged (any source)
  useEffect(() => {
    if (sessionSets.length > prevRestSetsLengthRef.current) {
      playRestBeep(1200, 0.1);
      setManualRestTime(manualRestTarget);
      setManualRestActive(true);
    }
    prevRestSetsLengthRef.current = sessionSets.length;
  }, [sessionSets.length, manualRestTarget]);

  // Manual timer countdown ticker
  useEffect(() => {
    let timer: any = null;
    if (manualRestActive && manualRestTime > 0) {
      timer = setInterval(() => {
        setManualRestTime((prev) => {
          if (prev <= 1) {
            setManualRestActive(false);
            playRestBeep(523.25, 0.3); // C5 alert
            setTimeout(() => playRestBeep(659.25, 0.2), 150); // E5
            setTimeout(() => playRestBeep(783.99, 0.4), 300); // G5
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [manualRestActive, manualRestTime]);

  // Reset/wipe Active Rest Tracker completely if formattedProgram is empty
  useEffect(() => {
    const totalExercises = formattedProgram.reduce((sum, item) => sum + item.exercises.length, 0);
    if (totalExercises === 0) {
      setManualRestTime(0);
      setManualRestActive(false);
    }
  }, [formattedProgram]);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const syncedProfile = useMemo(() => {
    if (!profile) return null;
    const latestWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : profile.bodyweight;
    const latestBodyFat = bodyFatHistory.length > 0 ? bodyFatHistory[bodyFatHistory.length - 1].bodyFatPercent : profile.bodyFatPercent;
    return {
      ...profile,
      bodyweight: latestWeight,
      bodyFatPercent: latestBodyFat
    };
  }, [profile, weightHistory, bodyFatHistory]);

  const profileRef = useRef<UserProfile | null>(null);
  const [timerTick, setTimerTick] = useState<number>(0);
  useEffect(() => {
    profileRef.current = syncedProfile;
  }, [syncedProfile]);
  useEffect(() => {
    let interval: any = null;
    if (profile?.timerActive) {
      interval = setInterval(() => {
        setTimerTick((prev) => prev + 1);
      }, 1000);
    } else {
      setTimerTick(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [profile?.timerActive]);

  // Reset stopwatch timer when there are no exercises in the active session
  useEffect(() => {
    if (currentUser && sessionSets.length === 0 && profile) {
      const hasActiveTimer = profile.timerActive || 
                             profile.timerStartTime || 
                             (profile.timerAccumulatedMs && profile.timerAccumulatedMs > 0) || 
                             (profile.timerManualDuration && profile.timerManualDuration > 0);
      
      if (hasActiveTimer) {
        saveSettings({
          timerStartTime: null,
          timerEndTime: null,
          timerActive: false,
          timerManualDuration: 0,
          timerAccumulatedMs: 0,
        }).catch((err) => console.error("Error resetting stopwatch on empty session sets:", err));
      }
    }
  }, [sessionSets, currentUser, profile]);
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    return localStorage.getItem("gym-theme-id") || "default";
  });
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});
  const [lastLoadedDayIndex, setLastLoadedDayIndex] = useState<number | null>(null);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [flashMessage, setFlashMessage] = useState<Record<string, string>>({});
  const [newWeight, setNewWeight] = useState<string>("");
  const [newWeightDate, setNewWeightDate] = useState<string>("");
  const [showWeightHistoryList, setShowWeightHistoryList] = useState(false);
  const [newBodyFat, setNewBodyFat] = useState<string>("");
  const [newBodyFatDate, setNewBodyFatDate] = useState<string>("");
  const [showBodyFatHistoryList, setShowBodyFatHistoryList] = useState(false);
  const [showCalorieHistoryList, setShowCalorieHistoryList] = useState(false);
  const [googleDriveToken, setGoogleDriveToken] = useState<string | null>(null);
  const [googleDriveBackups, setGoogleDriveBackups] = useState<any[]>([]);
  const [loadingDriveBackups, setLoadingDriveBackups] = useState(false);
  const [exportingToDrive, setExportingToDrive] = useState(false);
  const [driveConfirmAction, setDriveConfirmAction] = useState<{
    type: "delete" | "restore";
    fileId: string;
    fileName: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [addingToDay, setAddingToDay] = useState<number | null>(null);
  const [modalSearch, setModalSearch] = useState("");
  const [selectedModalExercises, setSelectedModalExercises] = useState<Exercise[]>([]);
  const [expandedProgressSections, setExpandedProgressSections] = useState<
    Record<string, boolean>
  >({
    weight: true,
    bodyFat: true,
    workoutCalendar: true,
    trending: false,
    personalRecords: true,
    exercises: false,
  });
  const [exerciseProgressSearchQuery, setExerciseProgressSearchQuery] = useState("");
  const [selectedExerciseProgress, setSelectedExerciseProgress] = useState<string | null>(null);
  const [pbSearchQuery, setPbSearchQuery] = useState("");
  const [rebuildingPBs, setRebuildingPBs] = useState(false);
  const [selectedHistoryChartExercise, setSelectedHistoryChartExercise] = useState<string | null>(null);
  const [pbSubTab, setPbSubTab] = useState<"pbs" | "progression">("pbs");
  const [pbSortKey, setPbSortKey] = useState<"name" | "weight" | "date">("date");
  const [pbSortOrder, setPbSortOrder] = useState<"asc" | "desc">("desc");
  const [deletingPbName, setDeletingPbName] = useState<string | null>(null);
  const [volumeTimeframe, setVolumeTimeframe] = useState<
    "day" | "week" | "month"
  >("day");
  const [expandedLibrarySections, setExpandedLibrarySections] = useState<
    Record<string, boolean>
  >({});
  const [libraryViewMode, setLibraryViewMode] = useState<"deck" | "list">(
    "deck",
  );
  const [selectedLibraryCategory, setSelectedLibraryCategory] =
    useState<string>("chest");
  const [showProgressReport, setShowProgressReport] = useState(false);
  const [isExportingReport, setIsExportingReport] = useState(false);
  const [reportCardScale, setReportCardScale] = useState(1);
  const [reportCardHeight, setReportCardHeight] = useState<number | null>(null);
  const [avatarImgBase64, setAvatarImgBase64] = useState<string | null>(null);
  const [setDifficulties, setSetDifficulties] = useState<Record<string, "easy" | "moderate" | "hard">>({});
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!showProgressReport) {
      setAvatarImgBase64(null);
      return;
    }

    const activeOutfitId = profile?.equippedOutfit || "vanguard_cadet";
    const equippedEmote = (profile as any)?.[`equippedEmote_${activeOutfitId}`] ?? "none";
    const activeOutfit = OUTFITS.find((o) => o.id === activeOutfitId) || OUTFITS[0];
    const imgUrl = activeOutfit.poseImages?.[equippedEmote as any] || activeOutfit.image;

    if (!imgUrl) return;

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL("image/png");
          if (isMounted) {
            setAvatarImgBase64(dataUrl);
          }
        }
      } catch (err) {
        console.error("Error converting avatar to base64:", err);
      }
    };
    img.onerror = (err) => {
      console.error("Failed to load avatar image for base64 conversion:", err);
    };
    img.src = imgUrl;

    return () => {
      isMounted = false;
    };
  }, [showProgressReport, profile]);

  useEffect(() => {
    if (!showProgressReport) return;
    const updateScale = () => {
      const container = document.getElementById("progress-report-container");
      const card = document.getElementById("progress-report-card");
      if (container && card) {
        const containerWidth = container.clientWidth;
        const cardWidth = 780; // fixed width of progress-report-card
        const scale =
          containerWidth < cardWidth ? containerWidth / cardWidth : 1;
        setReportCardScale(scale);

        // Measure natural, unscaled height
        const origTransform = card.style.transform;
        card.style.transform = "none";
        const height = card.offsetHeight;
        card.style.transform = origTransform;
        setReportCardHeight(height);
      }
    };

    const timer = setTimeout(updateScale, 150);
    window.addEventListener("resize", updateScale);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateScale);
    };
  }, [showProgressReport]);

  // Collapse all dropdowns and accordion lists when switching between tabs
  useEffect(() => {
    setShowHistoryMenu(false);
    setExpandedDays({});
    setExpandedRoutinesDays({});
    setShowWeightHistoryList(false);
    setShowBodyFatHistoryList(false);
    setShowCalorieHistoryList(false);
    setExpandedProgressSections({
      weight: false,
      bodyFat: false,
      workoutCalendar: false,
      trending: false,
      personalRecords: false,
      exercises: false,
      calorieTracker: false,
    });
    setExpandedLibrarySections({});
    setExpandedWorkouts({});
    setShowClearConfirm(false);
    setSelectedHistoryChartExercise(null);
  }, [activeView]);

  const findExerciseByName = (name: string): Exercise | null => {
    if (!name) return null;
    const searchName = name.trim().toLowerCase();
    for (const pool of Object.values(combinedPools)) {
      const ex = pool.find((e) => e.name.trim().toLowerCase() === searchName);
      if (ex) return ex;
    }
    return null;
  };

  const handleExportPdf = async () => {
    if (isExportingReport) return;
    setIsExportingReport(true);
    try {
      const card = document.getElementById("progress-report-card");
      if (!card) {
        setToast({ message: "Progress report card element not found.", type: "info" });
        setIsExportingReport(false);
        return;
      }

      // Helper function to safely replace oklch, oklab, color-mix and light-dark with valid simple rgb/hex colors to avoid crashing html2canvas parser
      const replaceColorFunctions = (cssText: string): string => {
        let result = cssText;

        // Replace all CSS color variables with standard physical hex/rgb values from the active color theme
        result = result
          .replace(/var\(--gym-accent\)/g, activeTheme.accent)
          .replace(/var\(--gym-accent-light\)/g, activeTheme.accentLight)
          .replace(/var\(--gym-accent-dark\)/g, activeTheme.accentDark)
          .replace(/var\(--gym-accent-rgb\)/g, activeTheme.accentRgb)
          .replace(/var\(--theme-text\)/g, activeTheme.testPrimary)
          .replace(/var\(--theme-text-muted\)/g, activeTheme.testMuted)
          .replace(/var\(--theme-text-subtle\)/g, activeTheme.testSubtle)
          .replace(/var\(--color-gym-accent\)/g, activeTheme.accent)
          .replace(/var\(--color-gym-accent-light\)/g, activeTheme.accentLight)
          .replace(/var\(--color-gym-accent-dark\)/g, activeTheme.accentDark)
          .replace(/var\(--color-theme-text\)/g, activeTheme.testPrimary)
          .replace(/var\(--color-theme-text-muted\)/g, activeTheme.testMuted)
          .replace(/var\(--color-theme-text-subtle\)/g, activeTheme.testSubtle);

        // Fallback for remaining unsupported raw modern color functions to dynamic active theme accents/texts
        const keywords = ["oklch(", "oklab(", "color-mix(", "light-dark("];
        for (const keyword of keywords) {
          let index = result.toLowerCase().indexOf(keyword);
          while (index !== -1) {
            let parenCount = 1;
            let j = index + keyword.length;
            while (j < result.length && parenCount > 0) {
              if (result[j] === '(') {
                parenCount++;
              } else if (result[j] === ')') {
                parenCount--;
              }
              j++;
            }
            
            if (parenCount === 0) {
              const before = result.substring(0, index);
              const after = result.substring(j);
              
              // Smart fallbacks based on context: if the keyword is near something, or default to general accent / primary
              let fallbackColor = activeTheme.accent;
              const snip = result.substring(Math.max(0, index - 40), index).toLowerCase();
              if (snip.includes("border") || snip.includes("stroke")) {
                fallbackColor = activeTheme.accent;
              } else if (snip.includes("background") || snip.includes("fill")) {
                fallbackColor = activeTheme.bg;
              } else if (snip.includes("color") || snip.includes("text")) {
                fallbackColor = activeTheme.testPrimary;
              }
              
              result = before + fallbackColor + after;
              index = result.toLowerCase().indexOf(keyword, index);
            } else {
              index = result.toLowerCase().indexOf(keyword, index + 1);
            }
          }
        }
        return result;
      };

      // Store original transform and scale
      const origTransform = card.style.transform;
      // Unset transform temporarily for crisp extraction
      card.style.transform = "none";

      const canvas = await html2canvas(card, {
        scale: 2, // 2x resolution for retina-sharp text and charts
        useCORS: true,
        backgroundColor: activeTheme.bg || "#050505", // Matches selected theme background perfectly
        logging: false,
        onclone: (clonedDoc) => {
          // Remove/replace unsupported modern CSS oklch, oklab, color-mix and light-dark colors from stylesheet content
          const styles = clonedDoc.getElementsByTagName("style");
          for (let i = 0; i < styles.length; i++) {
            const style = styles[i];
            if (style.textContent) {
              style.textContent = replaceColorFunctions(style.textContent);
            }
          }

          // Fetch external link stylesheets, replace color functions, and turn them into styled inline blocks
          const links = Array.from(clonedDoc.getElementsByTagName("link"));
          for (const link of links) {
            if (link.getAttribute("rel") === "stylesheet") {
              const href = link.getAttribute("href");
              if (href) {
                try {
                  const xhr = new XMLHttpRequest();
                  xhr.open("GET", href, false); // synchronous call to block safely inside onclone worker context
                  xhr.send();
                  if (xhr.status === 200) {
                    const cssContent = replaceColorFunctions(xhr.responseText);
                    const styleEl = clonedDoc.createElement("style");
                    styleEl.textContent = cssContent;
                    clonedDoc.head.appendChild(styleEl);
                    link.remove();
                  }
                } catch (e) {
                  console.error("Failed to replace link stylesheet color functions inside onclone:", href, e);
                }
              }
            }
          }

          // Scrub oklch/oklab from elements' inline style, fill, and stroke attributes
          const allElements = clonedDoc.getElementsByTagName("*");
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i];
            const styleAttr = el.getAttribute("style");
            if (styleAttr && (styleAttr.toLowerCase().includes("oklch") || styleAttr.toLowerCase().includes("oklab") || styleAttr.toLowerCase().includes("color-mix") || styleAttr.toLowerCase().includes("light-dark"))) {
              el.setAttribute("style", replaceColorFunctions(styleAttr));
            }

            const fillAttr = el.getAttribute("fill");
            if (fillAttr && (fillAttr.toLowerCase().includes("oklch") || fillAttr.toLowerCase().includes("oklab") || fillAttr.toLowerCase().includes("color-mix") || fillAttr.toLowerCase().includes("light-dark"))) {
              el.setAttribute("fill", replaceColorFunctions(fillAttr));
            }

            const strokeAttr = el.getAttribute("stroke");
            if (strokeAttr && (strokeAttr.toLowerCase().includes("oklch") || strokeAttr.toLowerCase().includes("oklab") || strokeAttr.toLowerCase().includes("color-mix") || strokeAttr.toLowerCase().includes("light-dark"))) {
              el.setAttribute("stroke", replaceColorFunctions(strokeAttr));
            }

            // Hide gradient overlays and decorative scans that break html2canvas/PDF output
            const cl = el.className;
            if (typeof cl === "string" && cl.includes("bg-gradient-") && cl.includes("pointer-events-none")) {
              const domEl = el as any;
              if (domEl.style) {
                domEl.style.display = "none";
              }
            }
          }
        },
      });

      // Restore original transform
      card.style.transform = origTransform;

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Create PDF in A4 size or dynamically scaled size to match layout aspect ratio perfectly
      const pdfWidth = 595; // base A4 width in pt
      const pdfHeight = (imgHeight / imgWidth) * pdfWidth;

      const doc = new jsPDF({
        orientation: pdfHeight > pdfWidth ? "portrait" : "landscape",
        unit: "pt",
        format: [pdfWidth, pdfHeight],
      });

      doc.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      doc.save(`Gym_${formattedDate}.pdf`);
      
      setToast({ message: "🏆 PDF Report exported successfully!", type: "success" });
    } catch (error) {
      console.error("PDF generation failed:", error);
      setToast({ message: "Failed to generate PDF. Please try again.", type: "info" });
    } finally {
      setIsExportingReport(false);
    }
  };

  // Pre-select first routine or reset if current is deleted/empty
  useEffect(() => {
    if (routines.length > 0) {
      const exists = routines.some(r => r.id === selectedRoutineId);
      if (!exists) {
        setSelectedRoutineId(routines[0].id || null);
      }
    } else {
      setSelectedRoutineId(null);
    }
  }, [routines, selectedRoutineId]);

  const selectedRoutine = useMemo(() => {
    return routines.find((r) => r.id === selectedRoutineId) || routines[0] || null;
  }, [routines, selectedRoutineId]);

  const selectedRoutineMuscleGroups = useMemo(() => {
    if (!selectedRoutine || !selectedRoutine.sets) return [];
    
    const uniqueExs = Array.from(
      new Set(selectedRoutine.sets.map((s: any) => s.exerciseName))
    ) as string[];
    
    const counts: Record<string, number> = {};
    let total = 0;
    
    uniqueExs.forEach((name) => {
      const ex = findExerciseByName(name);
      const pool = ex?.pool || "";
      const group = mapPoolToMuscleGroup(pool);
      counts[group] = (counts[group] || 0) + 1;
      total++;
    });
    
    if (total === 0) return [];
    
    return Object.entries(counts)
      .map(([group, count]) => ({
        group,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [selectedRoutine, combinedPools]);

  const selectedRoutineSecondaryMuscleGroups = useMemo(() => {
    if (!selectedRoutine || !selectedRoutine.sets) return [];
    
    const uniqueExs = Array.from(
      new Set(selectedRoutine.sets.map((s: any) => s.exerciseName))
    ) as string[];
    
    const counts: Record<string, number> = {};
    let total = 0;
    
    uniqueExs.forEach((name) => {
      const ex = findExerciseByName(name);
      if (!ex) return;
      const secondaries = getSecondaryMusclesForExercise(ex);
      secondaries.forEach((mus) => {
        counts[mus] = (counts[mus] || 0) + 1;
        total++;
      });
    });
    
    if (total === 0) return [];
    
    return Object.entries(counts)
      .map(([group, count]) => ({
        group,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [selectedRoutine, combinedPools]);

  const handleResetProfile = async () => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/profile/settings`;
    const isSpecialUser = currentUser.email === "d.castle@outlook.com";
    const startingLevel = isSpecialUser ? 3 : 1;
    const startingPoints = isSpecialUser ? 16 : 10;
    try {
      const resetData: UserProfile = {
        startDate: profile?.startDate || new Date().toISOString(),
        streakCount: profile?.streakCount || 0,
        activeView: "console",
        displayName:
          profile?.displayName || currentUser.displayName || "Athlete Specimen",
        photoURL: profile?.photoURL || currentUser.photoURL || "",
        avatarLevel: startingLevel,
        avatarXp: 0,
        avatarCredits: 5000,
        unassignedPoints: startingPoints,
        gridNodesUnlocked: ["p0"],
        unlockedOutfits: ["vanguard_cadet"],
        equippedOutfit: "vanguard_cadet",
        equippedAura: "none",
        equippedBackItem: "none",
        equippedEmote: "none",
        equippedTitle: "lifter",
        equippedBorder: "none",
        bodyweight: 75,
        height: 175,
        age: 28,
        bodyFatPercent: 15,
        sex: "male",
        avatarPower: 10,
        avatarKinetic: 10,
        avatarSymmetry: 10,
        avatarVelocity: 10,
        avatarRecovery: 10,
      } as any; // Cast as any because database has extended properties like avatarPower
      await setDoc(doc(db, path), {
        ...resetData,
        updatedAt: serverTimestamp(),
      });

      // Clear local pet states
      localStorage.removeItem(`gym_pet_levels_${currentUser.uid}`);
      localStorage.removeItem(`gym_pet_xps_${currentUser.uid}`);
      localStorage.removeItem(`gym_pet_names_${currentUser.uid}`);

      setProfile(resetData);

      setToast({
        message: `🧬 Profile and RPG character stats reset to Level ${startingLevel} successfully!`,
        type: "success",
      });
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };


  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Reset user-specific states when user accounts shift or log out
  useEffect(() => {
    setCurrentDays([[], [], [], [], [], []]);
    setPersonalBests({});
    setWorkoutsLoaded(false);
    setPbsLoaded(false);
    setWeightHistory([]);
    setBodyFatHistory([]);
    setSessionSets([]);
    setArchivedWorkouts([]);
    setRoutines([]);
    setProfile(null);
    hasConsolidatedRef.current = false;
    if (!currentUser) {
      const saved = localStorage.getItem("gym_custom_exercises");
      if (saved) {
        try {
          setCustomExercises(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse local custom exercises:", e);
        }
      } else {
        setCustomExercises([]);
      }
    }
  }, [currentUser]);

  // Landing Page Away Check
  useEffect(() => {
    if (currentUser && !hasCheckedLanding) {
      const lastActiveKey = `titan_last_active_${currentUser.uid}`;
      const lastActiveVal = localStorage.getItem(lastActiveKey);
      
      if (!lastActiveVal) {
        // First login or cleared local storage
        setShowLandingPage(true);
      } else {
        const lastActiveTime = parseInt(lastActiveVal, 10);
        const diffMs = Date.now() - lastActiveTime;
        const cutoffMs = 15 * 60 * 1000; // 15 minutes away-time cutoff
        
        if (diffMs > cutoffMs) {
          setShowLandingPage(true);
        } else {
          setShowLandingPage(false);
        }
      }
      setHasCheckedLanding(true);
    } else if (!currentUser) {
      setHasCheckedLanding(false);
      setShowLandingPage(false);
    }
  }, [currentUser, hasCheckedLanding]);

  // Heartbeat to update last active timestamp
  useEffect(() => {
    if (!currentUser) return;
    
    const lastActiveKey = `titan_last_active_${currentUser.uid}`;
    let lastSaved = 0;
    
    const updateLastActive = () => {
      const now = Date.now();
      if (now - lastSaved > 15000) { // Throttle updates: 15 seconds
        localStorage.setItem(lastActiveKey, now.toString());
        lastSaved = now;
      }
    };
    
    // Set immediate active timestamp
    updateLastActive();
    
    window.addEventListener("mousedown", updateLastActive);
    window.addEventListener("keydown", updateLastActive);
    window.addEventListener("touchstart", updateLastActive);
    
    const interval = setInterval(updateLastActive, 30000);
    
    return () => {
      window.removeEventListener("mousedown", updateLastActive);
      window.removeEventListener("keydown", updateLastActive);
      window.removeEventListener("touchstart", updateLastActive);
      clearInterval(interval);
    };
  }, [currentUser]);

  // Data Sync
  useEffect(() => {
    if (!currentUser) return;

    const workoutPath = `users/${currentUser.uid}/workout/current`;
    const settingsPath = `users/${currentUser.uid}/profile/settings`;
    const setsPath = `users/${currentUser.uid}/sets`;
    const pbsPath = `users/${currentUser.uid}/pbs`;
    const weightPath = `users/${currentUser.uid}/weightEntries`;
    const bodyFatPath = `users/${currentUser.uid}/bodyFatEntries`;

    // Real-time listener for Workout & Settings
    const unsubscribeWorkout = onSnapshot(
      doc(db, workoutPath),
      (wDoc) => {
        setFirebaseConnected(true);
        if (wDoc.exists()) {
          const data = wDoc.data() as {
            days: Record<string, Exercise[]>;
            version?: number;
          };
          if (data.days) {
            let daysArr: Exercise[][] = [];
            if (!Array.isArray(data.days)) {
              for (let i = 0; i < 6; i++)
                daysArr.push(data.days[`d${i}`] || []);
            } else {
              daysArr = data.days as Exercise[][];
            }
            setCurrentDays(daysArr);
          }
        }
      },
      (err) => console.error("Workout listener error:", err),
    );

    const unsubscribeSettings = onSnapshot(
      doc(db, settingsPath),
      (sDoc) => {
        if (sDoc.exists()) {
          const data = sDoc.data() as UserProfile;
          if (data.activeView) setActiveView(data.activeView as any);
          if (data.themeId) {
            setCurrentThemeId(data.themeId);
            localStorage.setItem("gym-theme-id", data.themeId);
          }
          setProfile(data);
        }
      },
      (err) => console.error("Settings listener error:", err),
    );

    // Remove loadStatic and integrate it into its own useEffect if needed, but onSnapshot handles initial load too.
    const initializeProfile = async () => {
      try {
        const sDoc = await getDoc(doc(db, settingsPath));
        if (!sDoc.exists()) {
          const isSpecialUser = currentUser.email === "d.castle@outlook.com";
          const startingLevel = isSpecialUser ? 3 : 1;
          const startingPoints = isSpecialUser ? 16 : 10;
          const initialProfile: UserProfile = {
            startDate: new Date().toISOString(),
            streakCount: 0,
            activeView: "console",
            displayName: currentUser.displayName || "Athlete Specimen",
            photoURL: currentUser.photoURL || "",
            avatarLevel: startingLevel,
            avatarXp: 0,
            avatarCredits: 5000,
            unassignedPoints: startingPoints,
            gridNodesUnlocked: ["p0"],
            unlockedOutfits: ["vanguard_cadet"],
            equippedOutfit: "vanguard_cadet",
            equippedAura: "none",
            equippedBackItem: "none",
            equippedEmote: "none",
            equippedTitle: "lifter",
            equippedBorder: "none",
            bodyweight: 75,
            height: 175,
            age: 28,
            bodyFatPercent: 15,
            sex: "male",
            avatarPower: 10,
            avatarKinetic: 10,
            avatarSymmetry: 10,
            avatarVelocity: 10,
            avatarRecovery: 10,
          } as any;
          await setDoc(doc(db, settingsPath), {
            ...initialProfile,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err: any) {
        console.warn(
          "Could not check/initialize profile from server (offline?):",
          err.message || err,
        );
      }
    };
    initializeProfile();

    // Real-time listeners for Session Data
    const unsubscribeSets = onSnapshot(
      collection(db, setsPath),
      (snapshot) => {
        const sets: SessionSet[] = [];
        snapshot.forEach((d) =>
          sets.push({ id: d.id, ...d.data() } as SessionSet),
        );
        setSessionSets(
          sets.sort(
            (a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0),
          ),
        );
      },
      (err) => console.error("Sets listener error:", err),
    );

    const unsubscribeWorkouts = onSnapshot(
      query(
        collection(db, `users/${currentUser.uid}/workouts`),
        orderBy("timestamp", "desc"),
      ),
      (snapshot) => {
        const rawWorkouts: any[] = [];
        snapshot.forEach((d) => rawWorkouts.push({ id: d.id, ...d.data() }));

        const workoutsByDate: Record<string, any[]> = {};
        rawWorkouts.forEach((w) => {
          const dateStr = w.date || (w.timestamp ? new Date(w.timestamp.seconds * 1000).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
          if (!workoutsByDate[dateStr]) {
            workoutsByDate[dateStr] = [];
          }
          workoutsByDate[dateStr].push(w);
        });

        const mergedWorkouts: any[] = [];
        const toDeleteIds: string[] = [];
        const toUpdate: { id: string; data: any }[] = [];

        Object.entries(workoutsByDate).forEach(([dateStr, list]) => {
          if (list.length <= 1) {
            const single = { ...list[0] };
            const recomputed = calculateCaloriesBurned(single.sets || [], profileRef.current);
            if (single.id && single.estimatedCalories !== recomputed) {
              single.estimatedCalories = recomputed;
              toUpdate.push({ id: single.id, data: { estimatedCalories: recomputed } });
            }
            mergedWorkouts.push(single);
            return;
          }

          // Sort so the oldest session keeps the ID
          list.sort((a, b) => {
            const timeA = a.timestamp?.seconds || 0;
            const timeB = b.timestamp?.seconds || 0;
            return timeA - timeB;
          });

          const primary = list[0];
          const duplicates = list.slice(1);

          // Combine all sets seamlessly
          const allSets = list.flatMap((w) => w.sets || []);

          // Recalculate total volume excluding cardio
          const totalVolume = allSets.reduce((sum, s) => {
            const searchName = s.exerciseName?.trim().toLowerCase();
            let isCardio = false;
            for (const pool of Object.values(POOLS)) {
              const found = pool.find(
                (e) => e.name.trim().toLowerCase() === searchName
              );
              if (found && found.pool === "cardio") {
                isCardio = true;
                break;
              }
            }
            return sum + (isCardio ? 0 : s.weight * s.reps);
          }, 0);

          // Combine estimated calories burned
          const newCalories = calculateCaloriesBurned(allSets, profileRef.current);

          const mergedData = {
            ...primary,
            sets: allSets,
            totalVolume,
            exercisesCount: new Set(allSets.map((s) => s.exerciseName)).size,
            totalSets: allSets.length,
            estimatedCalories: newCalories,
          };

          mergedWorkouts.push(mergedData);
          toUpdate.push({ id: primary.id, data: mergedData });
          duplicates.forEach((dup) => toDeleteIds.push(dup.id));
        });

        // Persist consolidated workouts in a single db write transaction
        if (toUpdate.length > 0 || toDeleteIds.length > 0) {
          const batch = writeBatch(db);
          toUpdate.forEach((item) => {
            const docRef = doc(db, `users/${currentUser.uid}/workouts/${item.id}`);
            batch.set(docRef, item.data, { merge: true });
          });
          toDeleteIds.forEach((id) => {
            const docRef = doc(db, `users/${currentUser.uid}/workouts/${id}`);
            batch.delete(docRef);
          });
          batch.commit().catch((err) => {
            console.error("Auto session merge write failed:", err);
          });
        }

        // Sort in descending order to keep recent workouts at the top of lists/charts
        mergedWorkouts.sort((a, b) => {
          const timeA = a.timestamp?.seconds || 0;
          const timeB = b.timestamp?.seconds || 0;
          return timeB - timeA;
        });

        setArchivedWorkouts(mergedWorkouts);
        setWorkoutsLoaded(true);
      },
      (err) => console.error("Workouts listener error:", err),
    );

    const unsubscribePbs = onSnapshot(
      collection(db, pbsPath),
      (snapshot) => {
        const pbs: Record<string, PB> = {};
        snapshot.forEach((d) => {
          pbs[d.id] = d.data() as PB;
        });
        setPersonalBests(pbs);
        setPbsLoaded(true);
      },
      (err) => console.error("PBs listener error:", err),
    );

    const unsubscribeWeight = onSnapshot(
      collection(db, weightPath),
      (snapshot) => {
        const weights: WeightEntry[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          if (data && typeof data.weight === "number") {
            weights.push({
              id: d.id,
              weight: data.weight,
              date: data.date || new Date().toISOString().split("T")[0],
              timestamp: data.timestamp,
            });
          }
        });

        const sorted = weights.sort((a, b) => {
          const dateA = new Date(a.date).getTime() || 0;
          const dateB = new Date(b.date).getTime() || 0;
          if (dateA !== dateB) return dateA - dateB;

          const getTs = (ts: any) => {
            if (!ts) return 0;
            if (typeof ts.toMillis === "function") return ts.toMillis();
            if (ts.seconds) return ts.seconds * 1000;
            return Date.now(); // Fallback to now if no timestamp yet (optimistic)
          };
          return getTs(a.timestamp) - getTs(b.timestamp);
        });

        console.log("Weight History Updated:", sorted);
        setWeightHistory([...sorted]);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, weightPath);
      },
    );

    const unsubscribeBodyFat = onSnapshot(
      collection(db, bodyFatPath),
      (snapshot) => {
        const bfs: BodyFatEntry[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          if (data && typeof data.bodyFatPercent === "number") {
            bfs.push({
              id: d.id,
              bodyFatPercent: data.bodyFatPercent,
              date: data.date || new Date().toISOString().split("T")[0],
              timestamp: data.timestamp,
            });
          }
        });

        const sorted = bfs.sort((a, b) => {
          const dateA = new Date(a.date).getTime() || 0;
          const dateB = new Date(b.date).getTime() || 0;
          if (dateA !== dateB) return dateA - dateB;

          const getTs = (ts: any) => {
            if (!ts) return 0;
            if (typeof ts.toMillis === "function") return ts.toMillis();
            if (ts.seconds) return ts.seconds * 1000;
            return Date.now();
          };
          return getTs(a.timestamp) - getTs(b.timestamp);
        });

        console.log("Body Fat History Updated:", sorted);
        setBodyFatHistory([...sorted]);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, bodyFatPath);
      },
    );

    const unsubscribeRoutines = onSnapshot(
      collection(db, `users/${currentUser.uid}/routines`),
      (snapshot) => {
        const routineList: any[] = [];
        snapshot.forEach((d) => {
          routineList.push({ id: d.id, ...d.data() });
        });
        setRoutines(
          routineList.sort(
            (a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0),
          ),
        );
      },
      (err) => console.error("Routines listener error:", err),
    );

    const unsubscribeCustomExercises = onSnapshot(
      collection(db, `users/${currentUser.uid}/custom_exercises`),
      (snapshot) => {
        const list: Exercise[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as Exercise);
        });
        setCustomExercises(list);
        localStorage.setItem("gym_custom_exercises", JSON.stringify(list));
      },
      (err) => console.error("Custom exercises listener error:", err),
    );

    const unsubscribeFavoriteExercises = onSnapshot(
      collection(db, `users/${currentUser.uid}/favorite_exercises`),
      (snapshot) => {
        const list: string[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          if (data && data.name) {
            list.push(data.name);
          }
        });
        setFavoriteExercises(list);
        localStorage.setItem("gym_favorite_exercises", JSON.stringify(list));
      },
      (err) => console.error("Favorite exercises listener error:", err),
    );

    return () => {
      unsubscribeWorkout();
      unsubscribeSettings();
      unsubscribeSets();
      unsubscribeWorkouts();
      unsubscribePbs();
      unsubscribeWeight();
      unsubscribeBodyFat();
      unsubscribeRoutines();
      unsubscribeCustomExercises();
      unsubscribeFavoriteExercises();
    };
  }, [currentUser]);

  // Background Automatic Rebuild of PBs from Captured Sessions
  useEffect(() => {
    if (!currentUser || !workoutsLoaded || !pbsLoaded) return;

    // 1. Compute correct PBs from raw archived workouts
    const computedPBs: Record<string, PB> = {};

    const sortedWorkouts = [...archivedWorkouts].sort((a, b) => {
      const dateA = a.date || "";
      const dateB = b.date || "";
      return dateA.localeCompare(dateB);
    });

    const exerciseData: Record<string, {
      allSets: Array<{ weight: number; reps: number; date: string; dateStrForPB: string }>;
    }> = {};

    sortedWorkouts.forEach((w) => {
      if (!w.sets || !Array.isArray(w.sets)) return;
      const wDate = w.date || "";

      let dateStrForPB = "";
      try {
        if (wDate) {
          const dateObj = new Date(wDate);
          dateStrForPB = dateObj.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          });
        }
      } catch (e) {
        dateStrForPB = wDate;
      }
      if (!dateStrForPB) {
        dateStrForPB = new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        });
      }

      w.sets.forEach((s: any) => {
        if (!s || !s.exerciseName) return;
        const exName = s.exerciseName.trim();
        if (!exName) return;

        if (!exerciseData[exName]) {
          exerciseData[exName] = { allSets: [] };
        }

        exerciseData[exName].allSets.push({
          weight: Number(s.weight) || 0,
          reps: Number(s.reps) || 0,
          date: wDate,
          dateStrForPB,
        });
      });
    });

    Object.entries(exerciseData).forEach(([exName, data]) => {
      const sets = data.allSets;
      if (sets.length === 0) return;

      const isAssisted = exName.toLowerCase().includes("assisted pull");
      const lastSet = sets[sets.length - 1];
      let bestSet = sets[0];

      for (let i = 1; i < sets.length; i++) {
        const current = sets[i];
        let isBetter = false;

        if (isAssisted) {
          if (current.weight < bestSet.weight) {
            isBetter = true;
          } else if (current.weight === bestSet.weight && current.reps > bestSet.reps) {
            isBetter = true;
          }
        } else {
          if (current.weight > bestSet.weight) {
            isBetter = true;
          } else if (current.weight === bestSet.weight && current.reps > bestSet.reps) {
            isBetter = true;
          }
        }

        if (isBetter) {
          bestSet = current;
        }
      }

      computedPBs[exName] = {
        exerciseName: exName,
        lastWeight: lastSet.weight,
        lastReps: lastSet.reps,
        lastDate: lastSet.dateStrForPB,
        bestWeight: bestSet.weight,
        bestReps: bestSet.reps,
        bestDate: bestSet.dateStrForPB,
      };
    });

    // 2. Identify differences between computedPBs and loaded personalBests
    const toUpdate: Record<string, PB> = {};
    const toDelete: string[] = [];

    // Check what to update or add
    Object.entries(computedPBs).forEach(([name, compPb]) => {
      const existing = personalBests[name];
      if (!existing ||
          existing.bestWeight !== compPb.bestWeight ||
          existing.bestReps !== compPb.bestReps ||
          existing.lastWeight !== compPb.lastWeight ||
          existing.lastReps !== compPb.lastReps) {
        toUpdate[name] = compPb;
      }
    });

    // Check what to delete (exists in Firestore but not in computed)
    Object.keys(personalBests).forEach((name) => {
      if (!computedPBs[name]) {
        toDelete.push(name);
      }
    });

    // 3. Execute batch write if changes exist
    if (Object.keys(toUpdate).length > 0 || toDelete.length > 0) {
      console.log("Auto-correcting/Syncing Personal Bests with captured sessions. Updates:", Object.keys(toUpdate), "Deletes:", toDelete);
      const batch = writeBatch(db);
      let hasChanges = false;

      Object.entries(toUpdate).forEach(([name, pb]) => {
        const pbRef = doc(db, `users/${currentUser.uid}/pbs/${name}`);
        batch.set(pbRef, {
          ...pb,
          updatedAt: serverTimestamp(),
        });
        hasChanges = true;
      });

      toDelete.forEach((name) => {
        const pbRef = doc(db, `users/${currentUser.uid}/pbs/${name}`);
        batch.delete(pbRef);
        hasChanges = true;
      });

      if (hasChanges) {
        batch.commit().catch((err) => {
          console.error("Failed to automatically sync PBs:", err);
        });
      }
    }
  }, [currentUser, workoutsLoaded, pbsLoaded, archivedWorkouts, personalBests]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const allSections = Object.keys(combinedPools).map(
        (k) => k.charAt(0).toUpperCase() + k.slice(1),
      );
      const newState: Record<string, boolean> = {};
      allSections.forEach((s) => (newState[s] = true));
      setExpandedLibrarySections(newState);
    }
  }, [searchQuery]);

  // Automatically consolidate existing archived workouts with matching duplicate dates
  useEffect(() => {
    if (!currentUser || archivedWorkouts.length === 0) {
      return;
    }

    if (hasConsolidatedRef.current) return;

    // Find duplicates based on workout 'date'
    const dateGroups: Record<string, any[]> = {};
    archivedWorkouts.forEach((w) => {
      if (w.date) {
        if (!dateGroups[w.date]) dateGroups[w.date] = [];
        dateGroups[w.date].push(w);
      }
    });

    const duplicates = Object.entries(dateGroups).filter(([_, list]) => list.length > 1);

    if (duplicates.length > 0) {
      hasConsolidatedRef.current = true; // prevent multiple execution triggers

      const mergeAllDuplicates = async () => {
        try {
          const batch = writeBatch(db);
          let mergedAny = false;

          for (const [date, list] of duplicates) {
            // Keep the first document as master
            const master = list[0];
            const others = list.slice(1);

            let combinedSets = [...(master.sets || [])];
            let extraCalories = 0;

            others.forEach((other) => {
              combinedSets = [...combinedSets, ...(other.sets || [])];
              extraCalories += other.estimatedCalories || 0;
            });

            // Recalculate totalVolume
            const totalVolume = combinedSets.reduce((sum, s) => {
              const searchName = s.exerciseName?.trim().toLowerCase();
              let isCardio = false;
              for (const pool of Object.values(combinedPools)) {
                const found = pool.find(
                  (e) => e.name.trim().toLowerCase() === searchName,
                );
                if (found && found.pool === "cardio") {
                  isCardio = true;
                  break;
                }
              }
              return sum + (isCardio ? 0 : s.weight * s.reps);
            }, 0);

            const estimatedCalories = (master.estimatedCalories || 0) + extraCalories;

            // Updated data for the master workout document
            const masterRef = doc(db, `users/${currentUser.uid}/workouts/${master.id}`);
            batch.set(
              masterRef,
              {
                sets: combinedSets,
                totalVolume,
                exercisesCount: new Set(combinedSets.map((s) => s.exerciseName)).size,
                totalSets: combinedSets.length,
                estimatedCalories,
              },
              { merge: true }
            );

            // Delete duplicates
            others.forEach((other) => {
              const otherRef = doc(db, `users/${currentUser.uid}/workouts/${other.id}`);
              batch.delete(otherRef);
            });

            mergedAny = true;
          }

          if (mergedAny) {
            await batch.commit();
            setToast({
              message: "Consolidated duplicate same-day workout logs securely in cloud archive!",
              type: "success",
            });
            setTimeout(() => setToast(null), 3500);
          }
        } catch (err) {
          console.error("Error background consolidating duplicate workouts:", err);
        }
      };

      mergeAllDuplicates();
    }
  }, [archivedWorkouts, currentUser]);

  const getVolumeData = () => {
    if (archivedWorkouts.length === 0) return [];

    const sorted = [...archivedWorkouts].sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return dateA - dateB;
    });

    if (volumeTimeframe === "day") {
      const grouped = sorted.reduce(
        (acc, w) => {
          const d = w.date;
          acc[d] = (acc[d] || 0) + (w.totalVolume || 0);
          return acc;
        },
        {} as Record<string, number>,
      );
      return Object.entries(grouped).map(([date, volume]) => ({
        date,
        volume,
      }));
    }

    if (volumeTimeframe === "week") {
      const grouped = sorted.reduce(
        (acc, w) => {
          const date = new Date(w.date);
          const day = date.getDay();
          const diff = date.getDate() - day + (day === 0 ? -6 : 1);
          const monday = new Date(date.setDate(diff));
          const weekStr = monday.toISOString().split("T")[0];
          acc[weekStr] = (acc[weekStr] || 0) + (w.totalVolume || 0);
          return acc;
        },
        {} as Record<string, number>,
      );
      return Object.entries(grouped).map(([date, volume]) => ({
        date,
        volume,
      }));
    }

    if (volumeTimeframe === "month") {
      const grouped = sorted.reduce(
        (acc, w) => {
          const d = w.date.substring(0, 7) + "-01";
          acc[d] = (acc[d] || 0) + (w.totalVolume || 0);
          return acc;
        },
        {} as Record<string, number>,
      );
      return Object.entries(grouped).map(([date, volume]) => ({
        date,
        volume,
      }));
    }

    return [];
  };

  const saveWorkout = async (days: Exercise[][]) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/workout/current`;
    try {
      // Map 2D array to object to avoid "Nested arrays are not supported" error in Firestore
      const daysObj: Record<string, Exercise[]> = {};
      days.forEach((day, i) => {
        daysObj[`d${i}`] = day;
      });

      await setDoc(doc(db, path), {
        days: daysObj,
        version: 2,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const saveSettings = async (settings: any) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/profile/settings`;
    try {
      await setDoc(
        doc(db, path),
        {
          ...settings,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const handleRecalculateProgress = async () => {
    if (!currentUser) return;
    try {
      let totalXp = 0;
      let totalCredits = 0;
      
      archivedWorkouts.forEach((w) => {
        totalXp += 400;
        totalCredits += 250;
        
        if (Array.isArray(w.sets)) {
          w.sets.forEach((s: any) => {
            const isNewPB = s.isNewPB || false;
            const xpEarned = Math.round((isNewPB ? 120 : 15) * 1.45);
            const creditsEarned = isNewPB ? 80 : 10;
            totalXp += xpEarned;
            totalCredits += creditsEarned;
          });
        }
      });
      
      const isSpecialUser = currentUser.email === "d.castle@outlook.com";
      const startingLevel = isSpecialUser ? 3 : 1;
      const startingPoints = isSpecialUser ? 16 : 10;
      
      let currentLevel = startingLevel;
      let remainingXp = totalXp;
      let unassignedPoints = startingPoints;
      
      const getXpNeeded = (lvl: number) => lvl * 500 + 2000;
      
      while (remainingXp >= getXpNeeded(currentLevel)) {
        remainingXp -= getXpNeeded(currentLevel);
        currentLevel += 1;
        unassignedPoints += 3;
      }
      
      const updatedData = {
        avatarLevel: currentLevel,
        avatarXp: remainingXp,
        avatarCredits: (profile?.avatarCredits ?? 5000) + totalCredits,
        unassignedPoints: unassignedPoints,
      };
      
      setProfile((prev) => (prev ? { ...prev, ...updatedData } : null));
      await saveSettings(updatedData);
      
      setToast({
        message: `⚡ REINSTATED: Recalculated Level ${currentLevel} and ${remainingXp} XP from ${archivedWorkouts.length} logged sessions!`,
        type: "success",
      });
      setTimeout(() => setToast(null), 5000);
    } catch (e) {
      console.error("Error recalculating progress:", e);
      setToast({
        message: "❌ Error recalculating progress from session history.",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthMessage("");
    if (!email || !password) return;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthMessage("");
    if (!email || !password) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthMessage("");
    if (!email) return;
    try {
      await sendPasswordResetEmail(auth, email);
      setAuthMessage("Password reset email sent!");
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    setGoogleDriveToken(null);
  };

  const handleGoogleLogin = async () => {
    setAuthError("");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleConnectGoogleDrive = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/drive.file");
    provider.addScope("https://www.googleapis.com/auth/drive.readonly");
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setGoogleDriveToken(credential.accessToken);
        setToast({
          message: "Google Drive connected successfully!",
          type: "success",
        });
      } else {
        throw new Error("No Google access token received");
      }
    } catch (err: any) {
      setToast({
        message: `Failed to connect Google Drive: ${err.message}`,
        type: "info",
      });
    }
  };

  const loadGoogleDriveBackups = async (token: string) => {
    setLoadingDriveBackups(true);
    try {
      const q = encodeURIComponent(
        "name contains 'GymArchive_Backup_' and trashed = false",
      );
      const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,createdTime)&orderBy=createdTime+desc`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setGoogleDriveBackups(data.files || []);
      } else {
        console.error("Failed to list backups from Drive", await res.text());
      }
    } catch (err) {
      console.error("Error listing Drive backups", err);
    } finally {
      setLoadingDriveBackups(false);
    }
  };

  const handleExportBackup = async () => {
    if (!currentUser || !googleDriveToken) return;
    setExportingToDrive(true);
    try {
      const backupData = {
        version: 1,
        backupDate: new Date().toISOString(),
        currentDays: currentDays,
        personalBests: personalBests,
        weightHistory: weightHistory,
        bodyFatHistory: bodyFatHistory,
        sessionSets: sessionSets,
        archivedWorkouts: archivedWorkouts,
        profile: profile,
      };

      const filename = `GymArchive_Backup_${new Date().toISOString().replace(/[:.]/g, "-")}.json`;

      const boundary = "gym_archive_boundary_unique";
      const delimiter = `\r\n--${boundary}\r\n`;
      const close_delim = `\r\n--${boundary}--`;

      const metadata = {
        name: filename,
        mimeType: "application/json",
      };

      const multipartRequestBody =
        delimiter +
        "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
        JSON.stringify(metadata) +
        delimiter +
        "Content-Type: application/json\r\n\r\n" +
        JSON.stringify(backupData) +
        close_delim;

      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${googleDriveToken}`,
            "Content-Type": `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        },
      );

      if (response.ok) {
        setToast({
          message: "Backup exported to Google Drive!",
          type: "success",
        });
        loadGoogleDriveBackups(googleDriveToken);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Upload failed");
      }
    } catch (err: any) {
      console.error(err);
      setToast({ message: `Export failed: ${err.message}`, type: "info" });
    } finally {
      setExportingToDrive(false);
    }
  };

  const handleRestoreBackup = (fileId: string, fileName: string) => {
    setDriveConfirmAction({ type: "restore", fileId, fileName });
  };

  const handleDeleteBackup = (fileId: string, fileName: string) => {
    setDriveConfirmAction({ type: "delete", fileId, fileName });
  };

  const executeRestoreBackup = async (fileId: string) => {
    if (!currentUser || !googleDriveToken) return;
    setLoadingDriveBackups(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: { Authorization: `Bearer ${googleDriveToken}` },
        },
      );
      if (!res.ok) {
        throw new Error(`Failed to download backup: ${res.statusText}`);
      }

      const backupData = await res.json();

      if (!backupData || typeof backupData !== "object") {
        throw new Error("Invalid backup file structure");
      }

      const batch = writeBatch(db);

      // 1. Current Days
      if (backupData.currentDays) {
        const workoutRef = doc(db, `users/${currentUser.uid}/workout/current`);
        batch.set(workoutRef, { days: backupData.currentDays });
      }

      // 2. Profile
      if (backupData.profile) {
        const settingsRef = doc(
          db,
          `users/${currentUser.uid}/profile/settings`,
        );
        batch.set(settingsRef, backupData.profile);
      }

      // 3. Weight History
      if (Array.isArray(backupData.weightHistory)) {
        for (const entry of backupData.weightHistory) {
          if (entry.id) {
            const ref = doc(
              db,
              `users/${currentUser.uid}/weightEntries/${entry.id}`,
            );
            batch.set(ref, {
              weight: entry.weight ?? "",
              date: entry.date ?? "",
              timestamp: entry.timestamp ?? serverTimestamp(),
            });
          }
        }
      }

      // 3b. Body Fat History
      if (Array.isArray(backupData.bodyFatHistory)) {
        for (const entry of backupData.bodyFatHistory) {
          if (entry.id) {
            const ref = doc(
              db,
              `users/${currentUser.uid}/bodyFatEntries/${entry.id}`,
            );
            batch.set(ref, {
              bodyFatPercent: entry.bodyFatPercent ?? "",
              date: entry.date ?? "",
              timestamp: entry.timestamp ?? serverTimestamp(),
            });
          }
        }
      }

      // 4. Session Sets
      if (Array.isArray(backupData.sessionSets)) {
        for (const set of backupData.sessionSets) {
          if (set.id) {
            const ref = doc(db, `users/${currentUser.uid}/sets/${set.id}`);
            batch.set(ref, set);
          }
        }
      }

      // 5. Personal Bests
      if (
        backupData.personalBests &&
        typeof backupData.personalBests === "object"
      ) {
        for (const [exName, pb] of Object.entries(backupData.personalBests)) {
          const ref = doc(db, `users/${currentUser.uid}/pbs/${exName}`);
          batch.set(ref, pb as any);
        }
      }

      // 6. Archived Workouts
      if (Array.isArray(backupData.archivedWorkouts)) {
        for (const w of backupData.archivedWorkouts) {
          if (w.id) {
            const ref = doc(db, `users/${currentUser.uid}/workouts/${w.id}`);
            batch.set(ref, w);
          }
        }
      }

      await batch.commit();
      setToast({ message: "Backup successfully restored!", type: "success" });
    } catch (err: any) {
      console.error(err);
      setToast({ message: `Restore failed: ${err.message}`, type: "info" });
    } finally {
      setDriveConfirmAction(null);
      if (googleDriveToken) {
        loadGoogleDriveBackups(googleDriveToken);
      } else {
        setLoadingDriveBackups(false);
      }
    }
  };

  const executeDeleteBackup = async (fileId: string) => {
    if (!googleDriveToken) return;
    setLoadingDriveBackups(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${googleDriveToken}` },
        },
      );
      if (res.ok) {
        setToast({ message: "Backup deleted successfully", type: "success" });
        loadGoogleDriveBackups(googleDriveToken);
      } else {
        const errorText = await res.text();
        throw new Error(errorText || "Delete failed");
      }
    } catch (err: any) {
      console.error(err);
      setToast({ message: `Delete failed: ${err.message}`, type: "info" });
    } finally {
      setDriveConfirmAction(null);
      if (googleDriveToken) {
        loadGoogleDriveBackups(googleDriveToken);
      } else {
        setLoadingDriveBackups(false);
      }
    }
  };

  useEffect(() => {
    if (googleDriveToken) {
      loadGoogleDriveBackups(googleDriveToken);
    } else {
      setGoogleDriveBackups([]);
    }
  }, [googleDriveToken]);

  const getSubcategoryPoolKey = (ex: Exercise): string | null => {
    let poolKey: string | null = ex.pool || null;
    if (poolKey && combinedPools[poolKey]) {
      return poolKey;
    }

    const lowerExName = ex.name.trim().toLowerCase();
    for (const [key, exercises] of Object.entries(combinedPools)) {
      if (
        exercises.some((e) => e.name.trim().toLowerCase() === lowerExName)
      ) {
        return key;
      }
    }

    if (
      lowerExName.includes("incline") &&
      (lowerExName.includes("bench") ||
        lowerExName.includes("chest") ||
        lowerExName.includes("press") ||
        lowerExName.includes("fly"))
    ) {
      return "upper_chest";
    }
    if (
      lowerExName.includes("decline") &&
      (lowerExName.includes("bench") ||
        lowerExName.includes("chest") ||
        lowerExName.includes("press") ||
        lowerExName.includes("fly"))
    ) {
      return "lower_chest";
    }
    if (
      lowerExName.includes("chest") ||
      lowerExName.includes("bench") ||
      lowerExName.includes("press") ||
      lowerExName.includes("fly")
    ) {
      return "middle_chest";
    }
    if (
      lowerExName.includes("lat pull") ||
      lowerExName.includes("chin") ||
      lowerExName.includes("pullup") ||
      lowerExName.includes("row")
    ) {
      return "upper_back";
    }
    if (
      lowerExName.includes("deadlift") ||
      lowerExName.includes("lower back") ||
      lowerExName.includes("back extension") ||
      lowerExName.includes("hyperextension") ||
      lowerExName.includes("good morning")
    ) {
      return "lower_back";
    }
    if (lowerExName.includes("bicep") || lowerExName.includes("curl")) {
      if (lowerExName.includes("incline") || lowerExName.includes("hammer")) {
        return "short_biceps";
      }
      return "long_biceps";
    }
    if (
      lowerExName.includes("tricep") ||
      lowerExName.includes("pushdown") ||
      lowerExName.includes("skull")
    ) {
      if (lowerExName.includes("overhead")) return "long_triceps";
      return "lateral_triceps";
    }
    if (
      lowerExName.includes("lateral raise") ||
      lowerExName.includes("side delt") ||
      lowerExName.includes("upright row")
    ) {
      return "side_delts";
    }
    if (
      lowerExName.includes("rear delt") ||
      lowerExName.includes("face pull") ||
      lowerExName.includes("reverse fly")
    ) {
      return "rear_delts";
    }
    if (
      lowerExName.includes("shoulder") ||
      lowerExName.includes("overhead press") ||
      lowerExName.includes("military") ||
      lowerExName.includes("arnold")
    ) {
      return "front_delts";
    }
    if (
      lowerExName.includes("calf") ||
      lowerExName.includes("calves") ||
      lowerExName.includes("heel raise")
    ) {
      return "calves";
    }
    if (
      lowerExName.includes("hamstring") ||
      lowerExName.includes("leg curl") ||
      lowerExName.includes("deadlift") ||
      lowerExName.includes("rdl") ||
      lowerExName.includes("posterior")
    ) {
      return "hamstrings";
    }
    if (
      lowerExName.includes("squat") ||
      lowerExName.includes("leg press") ||
      lowerExName.includes("lunge") ||
      lowerExName.includes("extensions") ||
      lowerExName.includes("quad") ||
      lowerExName.includes("leg")
    ) {
      return "quads";
    }
    if (
      lowerExName.includes("oblique") ||
      lowerExName.includes("twist") ||
      lowerExName.includes("side bend")
    ) {
      return "obliques";
    }
    if (
      lowerExName.includes("leg raise") ||
      lowerExName.includes("hanging") ||
      lowerExName.includes("lower ab")
    ) {
      return "lower_core";
    }
    if (
      lowerExName.includes("crunch") ||
      lowerExName.includes("situp") ||
      lowerExName.includes("plank") ||
      lowerExName.includes("ab")
    ) {
      return "upper_core";
    }

    return null;
  };

  const handleSwap = (dayIndex: number, exIndex: number) => {
    if (!currentDays[dayIndex]) return;
    const ex = currentDays[dayIndex][exIndex];
    if (!ex) return;
    setSwappingExercise({ dayIndex, exIndex, exercise: ex });
  };

  const executeSwap = (dayIndex: number, exIndex: number, newEx: Exercise) => {
    if (!currentDays[dayIndex]) return;
    const day = [...currentDays[dayIndex]];
    day[exIndex] = newEx;

    const nextCurrentDays = [...currentDays];
    nextCurrentDays[dayIndex] = day;
    setCurrentDays(nextCurrentDays);
    saveWorkout(nextCurrentDays);

    // Also swap in formattedProgram
    const nextFormattedProgram = formattedProgram.map(item => {
      if (item.dayIndex === dayIndex) {
        const nextExercises = [...item.exercises];
        if (nextExercises[exIndex]) {
          nextExercises[exIndex] = newEx;
        }
        return { ...item, exercises: nextExercises };
      }
      return item;
    });
    setFormattedProgram(nextFormattedProgram);

    // Provide immediate visual feedback
    setFlashMessage((prev) => ({ ...prev, [newEx.name]: "SWAPPED" }));
    setTimeout(() => {
      setFlashMessage((prev) => {
        const next = { ...prev };
        delete next[newEx.name];
        return next;
      });
    }, 2000);

    setSwappingExercise(null);
  };

  const extractYoutubeId = (url: string): string | undefined => {
    if (!url) return undefined;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : undefined;
  };

  const handleAddCustomExerciseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customExName.trim()) return;

    const name = customExName.trim();
    // Validate uniqueness across static and custom lists
    const existsInPools = Object.values(POOLS).some((pool) =>
      pool.some((ex) => ex.name.toLowerCase() === name.toLowerCase()),
    );
    const existsInCustom = customExercises.some(
      (ex) => ex.name.toLowerCase() === name.toLowerCase(),
    );

    if (existsInPools || existsInCustom) {
      setToast({
        message: `"${name}" is already in the exercise library`,
        type: "info",
      });
      return;
    }

    const videoId = extractYoutubeId(customExVideoUrl);
    const newEx: Exercise = {
      name,
      pool: customExPool,
      icon: "Dumbbell",
      category: customExCategory,
      instructions:
        customGuidanceSteps.length > 0
          ? customGuidanceSteps
          : ["Awaiting guidance steps"],
      ...(videoId ? { youtubeId: videoId } : {}),
      ...(customExVideoUrl.trim()
        ? { youtubeUrl: customExVideoUrl.trim() }
        : {}),
    };

    // Save to local hooks state and localstorage
    const updated = [...customExercises, newEx];
    setCustomExercises(updated);
    localStorage.setItem("gym_custom_exercises", JSON.stringify(updated));

    // Persist to user's custom_exercises directory in Firestore if logged in
    if (currentUser) {
      try {
        const idSafe = name.replace(/\//g, "-");
        await setDoc(
          doc(db, `users/${currentUser.uid}/custom_exercises`, idSafe),
          newEx,
        );
      } catch (err) {
        console.error("Failed to sync custom exercise to cloud:", err);
      }
    }

    if (creatingCustomForDay !== null) {
      handleAddExerciseToPlan(creatingCustomForDay, newEx);
      setCreatingCustomForDay(null);
    } else {
      setToast({
        message: `"${name}" added to Exercise Library`,
        type: "success",
      });
    }
    setCustomExName("");
    setCustomExVideoUrl("");
    setCustomGuidanceSteps([]);
    setGuidanceStepInput("");
    setShowAddCustomModal(false);
  };

  const handleAddMultipleExercisesToPlan = (dayIndex: number, exercises: Exercise[]) => {
    if (exercises.length === 0) return;
    const nextDays = [...currentDays];
    const existingNames = new Set(nextDays[dayIndex].map((e) => e.name.toLowerCase()));
    const toAdd = exercises.filter((ex) => !existingNames.has(ex.name.toLowerCase()));

    if (toAdd.length === 0) {
      alert("All selected exercises are already in the plan for this day.");
      return;
    }

    nextDays[dayIndex] = [...nextDays[dayIndex], ...toAdd];
    setCurrentDays(nextDays);
    saveWorkout(nextDays);
    setAddingToDay(null);
    setModalSearch("");
    setSelectedModalExercises([]);
  };

  const handleAddExerciseToPlan = (dayIndex: number, ex: Exercise) => {
    const nextDays = [...currentDays];
    // Prevent duplicates
    if (nextDays[dayIndex].some((e) => e.name === ex.name)) {
      alert("Exercise already in plan for this day.");
      return;
    }
    nextDays[dayIndex] = [...nextDays[dayIndex], ex];
    setCurrentDays(nextDays);
    saveWorkout(nextDays);
    setAddingToDay(null);
    setModalSearch("");
  };

  const handlePermanentlyDeleteCustomExercise = async (exName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${exName}" from your archive? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      // 1. Update state
      const updated = customExercises.filter(
        (e) => e.name.toLowerCase() !== exName.toLowerCase(),
      );
      setCustomExercises(updated);
      localStorage.setItem("gym_custom_exercises", JSON.stringify(updated));

      // 2. Sync deletion to firestore
      if (currentUser) {
        const idSafe = exName.replace(/\//g, "-");
        await deleteDoc(
          doc(db, `users/${currentUser.uid}/custom_exercises`, idSafe),
        );
      }

      setToast({
        message: `"${exName}" has been permanently deleted.`,
        type: "success",
      });
    } catch (err) {
      console.error("Failed to delete exercise:", err);
      setToast({
        message: "Error deleting exercise from cloud database",
        type: "error",
      });
    }
  };

  const handleRemoveExerciseFromPlan = (dayIndex: number, exIndex: number) => {
    if (!currentDays[dayIndex]) return;
    const targetEx = currentDays[dayIndex][exIndex];
    const targetExName = targetEx?.name;

    const nextDays = [...currentDays];
    nextDays[dayIndex] = nextDays[dayIndex].filter((_, i) => i !== exIndex);
    setCurrentDays(nextDays);
    saveWorkout(nextDays);

    // Also remove from formattedProgram (2. PLAN)
    if (targetExName) {
      setFormattedProgram(prev => prev.map(item => {
        if (item.dayIndex === dayIndex) {
          return {
            ...item,
            exercises: item.exercises.filter(ex => ex.name.toLowerCase() !== targetExName.toLowerCase())
          };
        }
        return item;
      }).filter(item => item.exercises.length > 0));

      // Filter out formatted_program sets for this deleted exercise from sessionSets
      setSessionSets(prev => prev.filter(s => !(s.exerciseName === targetExName && s.source === "formatted_program")));
    }
  };

  const handleRemoveExerciseFromFormattedProgram = (dayIndex: number, exIndex: number) => {
    const targetDay = formattedProgram.find(item => item.dayIndex === dayIndex);
    const targetEx = targetDay?.exercises[exIndex];
    const targetExName = targetEx?.name;

    const nextProgram = formattedProgram.map((item) => {
      if (item.dayIndex === dayIndex) {
        return {
          ...item,
          exercises: item.exercises.filter((_, i) => i !== exIndex)
        };
      }
      return item;
    }).filter(item => item.exercises.length > 0);
    setFormattedProgram(nextProgram);

    // Also remove from currentDays (Plan Builder)
    if (targetExName && currentDays[dayIndex]) {
      const nextDays = [...currentDays];
      nextDays[dayIndex] = nextDays[dayIndex].filter((ex) => ex.name.toLowerCase() !== targetExName.toLowerCase());
      setCurrentDays(nextDays);
      saveWorkout(nextDays);
    }

    // Filter out formatted_program sets for this deleted exercise from sessionSets
    if (targetExName) {
      setSessionSets(prev => prev.filter(s => !(s.exerciseName === targetExName && s.source === "formatted_program")));
    }

    // Wipe/reset manual rest tracker
    setManualRestTime(0);
    setManualRestActive(false);

    setToast({ message: "Exercise deleted from plan. Rest tracker reset to 0.", type: "success" });
  };

  const handleOrganizeMovementOrder = () => {
    const totalBuilder = currentDays.reduce((acc, val) => acc + val.length, 0);
    const totalFormatted = formattedProgram.reduce((acc, item) => acc + item.exercises.length, 0);

    if (totalBuilder === 0 && totalFormatted === 0) {
      setToast({ message: "No exercises selected to organize.", type: "info" });
      return;
    }

    if (totalBuilder > 0) {
      const nextDays = currentDays.map((day) => {
        return [...day].sort((a, b) => {
          const catA = a.category || "isolation";
          const catB = b.category || "isolation";
          if (catA === "compound" && catB !== "compound") return -1;
          if (catA !== "compound" && catB === "compound") return 1;
          return 0;
        });
      });
      setCurrentDays(nextDays);
      saveWorkout(nextDays);
    }

    if (totalFormatted > 0) {
      const nextFormatted = formattedProgram.map((item) => {
        const sortedExercises = [...item.exercises].sort((a, b) => {
          const catA = a.category || "isolation";
          const catB = b.category || "isolation";
          if (catA === "compound" && catB !== "compound") return -1;
          if (catA !== "compound" && catB === "compound") return 1;
          return 0;
        });
        return {
          ...item,
          exercises: sortedExercises
        };
      });
      setFormattedProgram(nextFormatted);
    }

    setToast({
      message: "Exercises reorganized: Compounds first, then Isolations!",
      type: "success",
    });
  };

  const handleClearAllExercises = () => {
    const totalBuilder = currentDays.reduce(
      (acc, val) => acc + (val ? val.length : 0),
      0,
    );
    const totalPlan = formattedProgram.reduce(
      (sum, item) => sum + item.exercises.length,
      0,
    );
    if (totalBuilder === 0 && totalPlan === 0) {
      setToast({ message: "No exercises in plan builder or plan to remove.", type: "info" });
      return;
    }

    const clearedDays: Exercise[][] = [[], [], [], [], [], [], []];
    setCurrentDays(clearedDays);
    setExpandedDays({});
    saveWorkout(clearedDays);
    setFormattedProgram([]);
    setToast({
      message: "All exercises have been cleared from plan builder and plan!",
      type: "success",
    });
  };

  const handleFormatProgram = () => {
    // 0. Incorporate any selected favorites into the plan builder
    let nextCurrentDays = [...currentDays];
    let favoritesAddedCount = 0;

    favoriteExercises.forEach(exName => {
      if (selectedFavorites[exName]) {
        const resolvedEx = findExerciseByName(exName);
        if (resolvedEx) {
          const pool = resolvedEx.pool || "";
          // Find which DAY_CONFIG index matches this pool
          const targetDayIdx = DAY_CONFIG.findIndex(day => day.pools.includes(pool));
          const dayIdx = targetDayIdx !== -1 ? targetDayIdx : 4; // default to equipment/extra (Day 5)

          if (!nextCurrentDays[dayIdx]) {
            nextCurrentDays[dayIdx] = [];
          }

          const alreadyAdded = nextCurrentDays[dayIdx].some(
            p => p.name.toLowerCase() === resolvedEx.name.toLowerCase()
          );

          if (!alreadyAdded) {
            nextCurrentDays[dayIdx] = [...nextCurrentDays[dayIdx], resolvedEx];
            favoritesAddedCount++;
          }
        }
      }
    });

    if (favoritesAddedCount > 0) {
      setCurrentDays(nextCurrentDays);
      saveWorkout(nextCurrentDays);
      setSelectedFavorites({}); // clear selection
    }

    // 1. Merge exercises from nextCurrentDays (plan builder) into formattedProgram
    const mergedProgram = DAY_CONFIG.map((day, idx) => {
      const existingItem = formattedProgram.find(item => item.dayIndex === idx);
      const existingExercises = existingItem ? [...existingItem.exercises] : [];
      const existingNames = new Set(existingExercises.map(ex => ex.name.toLowerCase()));

      const planExercises = nextCurrentDays[idx] || [];
      const newExercises = planExercises.filter(ex => !existingNames.has(ex.name.toLowerCase()));

      return {
        dayIndex: idx,
        dayName: day.name,
        exercises: [...existingExercises, ...newExercises],
      };
    }).filter(item => item.exercises.length > 0);

    const totalSelected = mergedProgram.reduce((sum, item) => sum + item.exercises.length, 0);
    if (totalSelected === 0) {
      setToast({ message: "No exercises currently selected in programming.", type: "info" });
      return;
    }

    // Count how many new exercises were actually added
    let newlyAddedCount = 0;
    DAY_CONFIG.forEach((day, idx) => {
      const existingItem = formattedProgram.find(item => item.dayIndex === idx);
      const existingCount = existingItem ? existingItem.exercises.length : 0;
      const mergedItem = mergedProgram.find(item => item.dayIndex === idx);
      const mergedCount = mergedItem ? mergedItem.exercises.length : 0;
      newlyAddedCount += Math.max(0, mergedCount - existingCount);
    });

    setFormattedProgram(mergedProgram);
    setWorkoutInnerTab("program");

    if (newlyAddedCount > 0) {
      setToast({
        message: `Successfully added ${newlyAddedCount} new exercise(s) to your program! Total: ${totalSelected}.`,
        type: "success",
      });
    } else {
      setToast({
        message: "No new exercises to add. Duplicates were ignored, and existing exercises were preserved.",
        type: "info",
      });
    }
  };

  const handleSaveSet = async (
    exName: string,
    weight: string,
    reps: string,
    notes: string = "",
    difficulty?: "easy" | "moderate" | "hard",
    source?: "formatted_program" | "session",
  ) => {
    if (!weight || !currentUser) return;
    const nWeight = parseFloat(weight) || 0;
    const nReps = parseInt(reps) || 0;
    const dateStr = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
    const fullDate = new Date().toISOString().split("T")[0];

    const existing = personalBests[exName];
    let isNewPB = false;
    const isAssisted = exName.toLowerCase().includes("assisted pull");

    if (!existing) {
      isNewPB = true;
    } else {
      if (isAssisted) {
        if (nWeight < existing.bestWeight) {
          isNewPB = true;
        } else if (nWeight === existing.bestWeight && nReps > existing.bestReps) {
          isNewPB = true;
        }
      } else {
        if (nWeight > existing.bestWeight) {
          isNewPB = true;
        } else if (nWeight === existing.bestWeight && nReps > existing.bestReps) {
          isNewPB = true;
        }
      }
    }

    const updatedPB: PB = {
      exerciseName: exName,
      lastWeight: nWeight,
      lastReps: nReps,
      lastDate: dateStr,
      bestWeight: isNewPB ? nWeight : existing?.bestWeight || nWeight,
      bestReps: isNewPB ? nReps : existing?.bestReps || nReps,
      bestDate: isNewPB ? dateStr : existing?.bestDate || dateStr,
    };

    setFlashMessage((prev) => ({
      ...prev,
      [exName]: isNewPB ? "🏆 NEW PB!" : "✓ SAVED",
    }));

    const setId = `${fullDate}-${exName}-${Date.now()}`;

    const newSet: SessionSet = {
      id: setId,
      exerciseName: exName,
      weight: nWeight,
      reps: nReps,
      date: fullDate,
      timestamp: { seconds: Math.floor(Date.now() / 1000) },
      notes: notes.trim(),
      source: source || "session",
      ...(difficulty ? { difficulty } : {}),
    };

    // Optimistic Update
    setSessionSets((prev) => [...prev, newSet]);

    const stopwatchWasInactive = !profile || !profile.timerActive;
    const isFirstStopwatchStart = stopwatchWasInactive && !(profile?.timerAccumulatedMs && profile.timerAccumulatedMs > 0);
    const stopwatchToastSuffix = stopwatchWasInactive 
      ? (isFirstStopwatchStart ? " (Stopwatch Started)" : " (Stopwatch Resumed)") 
      : "";

    setToast({
      message: isNewPB
        ? `New PB: ${exName}!${stopwatchToastSuffix}`
        : `Logged ${exName}: ${nWeight}kg × ${nReps}${stopwatchToastSuffix}`,
      type: isNewPB ? "pb" : "success",
    });
    setTimeout(() => setToast(null), 3000);

    try {
      const pbsPath = `users/${currentUser.uid}/pbs/${exName}`;
      const setsPath = `users/${currentUser.uid}/sets/${setId}`;
      const settingsPath = `users/${currentUser.uid}/profile/settings`;

      const today = new Date().toISOString().split("T")[0];
      let streakUpdate = {};
      if (profile && profile.lastWorkoutDate !== today) {
        const last = profile.lastWorkoutDate
          ? new Date(profile.lastWorkoutDate)
          : null;
        const t = new Date(today);
        const diffTime = last
          ? Math.abs(t.getTime() - last.getTime())
          : Infinity;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const newStreak = diffDays === 1 ? (profile.streakCount || 0) + 1 : 1;
        streakUpdate = { streakCount: newStreak, lastWorkoutDate: today };
      }

      // Automatically start/resume the stopwatch if it's not currently active/running
      let timerUpdate = {};
      if (stopwatchWasInactive) {
        timerUpdate = {
          timerStartTime: new Date().toISOString(),
          timerEndTime: null,
          timerActive: true,
          timerManualDuration: 0,
          timerAccumulatedMs: profile?.timerAccumulatedMs || 0,
        };
      }

      // Gamification Reward logic for completing a set.
      // Fetch current pet level to apply dynamic XP multiplier (+0.1 per pet level above Level 1)
      let activePetLevel = 1;
      try {
        const equippedOutfit = profile?.equippedOutfit ?? "vanguard_cadet";
        const petLevelsKey = `gym_pet_levels_${currentUser.uid}`;
        const savedLevels = localStorage.getItem(petLevelsKey);
        if (savedLevels) {
          const parsed = JSON.parse(savedLevels);
          activePetLevel = parsed[equippedOutfit] || 1;
        }
      } catch (e) {
        console.error("Error reading pet levels:", e);
      }

      const petMultiplier = 1.45 + (activePetLevel - 1) * 0.1;
      const xpEarned = Math.round((isNewPB ? 120 : 15) * petMultiplier);
      const creditsEarned = isNewPB ? 80 : 10;

      let nextLevel = profile?.avatarLevel ?? 1;
      let nextXp = (profile?.avatarXp ?? 0) + xpEarned;
      const nextCredits = (profile?.avatarCredits ?? 5000) + creditsEarned;
      let nextPoints = profile?.unassignedPoints ?? 10;

      const getXpNeeded = (lvl: number) => lvl * 500 + 2000;
      let leveledUp = false;

      while (nextXp >= getXpNeeded(nextLevel)) {
        nextXp -= getXpNeeded(nextLevel);
        nextLevel += 1;
        nextPoints += 3;
        leveledUp = true;
      }

      const avatarUpdate = {
        avatarLevel: nextLevel,
        avatarXp: nextXp,
        avatarCredits: nextCredits,
        unassignedPoints: nextPoints,
      };

      setProfile((prev) =>
        prev ? { ...prev, ...streakUpdate, ...avatarUpdate, ...timerUpdate } : null,
      );

      if (leveledUp) {
        setToast({
          message: `🔥 LEVEL UP! You are now Level ${nextLevel}!`,
          type: "success",
        });
        setTimeout(() => setToast(null), 3000);
      }

      const p2 = setDoc(doc(db, setsPath), {
        exerciseName: exName,
        weight: nWeight,
        reps: nReps,
        date: fullDate,
        timestamp: serverTimestamp(),
        notes: notes.trim(),
        ...(difficulty ? { difficulty } : {}),
      });

      const p3 = setDoc(
        doc(db, settingsPath),
        {
          ...streakUpdate,
          ...avatarUpdate,
          ...timerUpdate,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      await Promise.all([p2, p3]);
    } catch (err) {
      // Revert optimistic update if needed, but for now just log
      handleFirestoreError(
        err,
        OperationType.WRITE,
        `users/${currentUser.uid}/save-set`,
      );
    }

    setTimeout(
      () =>
        setFlashMessage((prev) => {
          const next = { ...prev };
          delete next[exName];
          return next;
        }),
      1500,
    );
  };

  const handleDeleteSet = async (setId: string) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, `users/${currentUser.uid}/sets/${setId}`));
    } catch (err) {
      handleFirestoreError(
        err,
        OperationType.DELETE,
        `users/${currentUser.uid}/sets/${setId}`,
      );
    }
  };

  const handleRebuildPBsFromHistory = async () => {
    if (!currentUser) return;
    if (archivedWorkouts.length === 0) {
      alert("No captured/archived sessions found to scan. Record and archive some workouts first!");
      return;
    }

    if (!window.confirm("Are you sure you want to scan all historical sessions and rebuild your Personal Best records? This will overwrite existing records with the actual highest loads performed in your session history.")) {
      return;
    }

    try {
      setRebuildingPBs(true);
      
      const sortedWorkouts = [...archivedWorkouts].sort((a, b) => {
        const dateA = a.date || "";
        const dateB = b.date || "";
        return dateA.localeCompare(dateB);
      });

      const exerciseData: Record<string, {
        allSets: Array<{ weight: number; reps: number; date: string; dateStrForPB: string }>;
      }> = {};

      sortedWorkouts.forEach((w) => {
        if (!w.sets || !Array.isArray(w.sets)) return;
        const wDate = w.date || "";
        
        let dateStrForPB = "";
        try {
          if (wDate) {
            const dateObj = new Date(wDate);
            dateStrForPB = dateObj.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            });
          }
        } catch (e) {
          dateStrForPB = wDate;
        }
        if (!dateStrForPB) {
          dateStrForPB = new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          });
        }

        w.sets.forEach((s: any) => {
          if (!s || !s.exerciseName) return;
          const exName = s.exerciseName.trim();
          if (!exName) return;

          if (!exerciseData[exName]) {
            exerciseData[exName] = { allSets: [] };
          }
          
          exerciseData[exName].allSets.push({
            weight: Number(s.weight) || 0,
            reps: Number(s.reps) || 0,
            date: wDate,
            dateStrForPB,
          });
        });
      });

      const newPBs: Record<string, PB> = {};
      
      Object.entries(exerciseData).forEach(([exName, data]) => {
        const sets = data.allSets;
        if (sets.length === 0) return;

        const isAssisted = exName.toLowerCase().includes("assisted pull");
        const lastSet = sets[sets.length - 1];
        let bestSet = sets[0];

        for (let i = 1; i < sets.length; i++) {
          const current = sets[i];
          let isBetter = false;
          
          if (isAssisted) {
            if (current.weight < bestSet.weight) {
              isBetter = true;
            } else if (current.weight === bestSet.weight && current.reps > bestSet.reps) {
              isBetter = true;
            }
          } else {
            if (current.weight > bestSet.weight) {
              isBetter = true;
            } else if (current.weight === bestSet.weight && current.reps > bestSet.reps) {
              isBetter = true;
            }
          }

          if (isBetter) {
            bestSet = current;
          }
        }

        newPBs[exName] = {
          exerciseName: exName,
          lastWeight: lastSet.weight,
          lastReps: lastSet.reps,
          lastDate: lastSet.dateStrForPB,
          bestWeight: bestSet.weight,
          bestReps: bestSet.reps,
          bestDate: bestSet.dateStrForPB,
        };
      });

      const batch = writeBatch(db);
      
      const existingPbNames = Object.keys(personalBests || {});
      existingPbNames.forEach((name) => {
        if (!newPBs[name]) {
          const pbRef = doc(db, `users/${currentUser.uid}/pbs/${name}`);
          batch.delete(pbRef);
        }
      });

      Object.entries(newPBs).forEach(([exName, pb]) => {
        const pbRef = doc(db, `users/${currentUser.uid}/pbs/${exName}`);
        batch.set(pbRef, pb);
      });

      await batch.commit();

      setToast({
        message: `Successfully rebuilt ${Object.keys(newPBs).length} Personal Bests from raw session history!`,
        type: "success",
      });
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      console.error("Error rebuilding PBs from history:", err);
      alert("Failed to rebuild PBs. Please try again.");
    } finally {
      setRebuildingPBs(false);
    }
  };

  const getExerciseHistoryData = (exName: string) => {
    if (!exName) return [];
    const searchName = exName.trim().toLowerCase();
    const bestSetPerSession: Record<
      string,
      { weight: number; reps: number; dateStr: string; timestamp: number }
    > = {};

    archivedWorkouts.forEach((w) => {
      if (!w.sets || !Array.isArray(w.sets)) return;
      const wDate = w.date || "";
      if (!wDate) return;

      const sessionKey = w.id || wDate;

      w.sets.forEach((s: any) => {
        if (!s || !s.exerciseName) return;
        if (s.exerciseName.trim().toLowerCase() === searchName) {
          const weight = Number(s.weight) || 0;
          const reps = Number(s.reps) || 0;

          const existing = bestSetPerSession[sessionKey];
          if (
            !existing ||
            weight > existing.weight ||
            (weight === existing.weight && reps > existing.reps)
          ) {
            bestSetPerSession[sessionKey] = {
              weight,
              reps,
              dateStr: wDate,
              timestamp: new Date(wDate).getTime() || 0,
            };
          }
        }
      });
    });

    const rawPoints = Object.values(bestSetPerSession);
    rawPoints.sort((a, b) => a.timestamp - b.timestamp);

    return rawPoints.map((p) => {
      let dateLabel = "";
      try {
        const d = new Date(p.dateStr);
        dateLabel = d.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        });
      } catch (err) {
        dateLabel = p.dateStr;
      }

      return {
        date: dateLabel || "Unknown",
        fullDate: p.dateStr,
        weight: p.weight,
        reps: p.reps,
        volume: p.weight * p.reps,
      };
    });
  };

  const trackingExercises = useMemo(() => {
    // 1. Gather all logged exercises
    const loggedSet = new Set<string>();
    archivedWorkouts.forEach((w) => {
      if (w.sets && Array.isArray(w.sets)) {
        w.sets.forEach((s: any) => {
          if (s && s.exerciseName) {
            loggedSet.add(s.exerciseName.trim());
          }
        });
      }
    });
    sessionSets.forEach((s) => {
      if (s && s.exerciseName) {
        loggedSet.add(s.exerciseName.trim());
      }
    });

    const loggedList = Array.from(loggedSet).map((name) => ({
      name,
      hasLogs: true,
    }));

    // 2. Gather all library exercises to allow selecting from database
    const librarySet = new Set<string>();
    for (const poolList of Object.values(combinedPools)) {
      poolList.forEach((ex) => {
        if (ex && ex.name) {
          librarySet.add(ex.name.trim());
        }
      });
    }

    const libraryList: typeof loggedList = [];
    librarySet.forEach((name) => {
      if (!loggedSet.has(name)) {
        libraryList.push({
          name,
          hasLogs: false,
        });
      }
    });

    // Combine them, placing logged exercises first, then remaining library exercises
    return [
      ...loggedList.sort((a, b) => a.name.localeCompare(b.name)),
      ...libraryList.sort((a, b) => a.name.localeCompare(b.name)),
    ];
  }, [archivedWorkouts, sessionSets, combinedPools]);

  const muscleGroupStrengthData = useMemo(() => {
    const muscleGroupExercises: Record<string, Record<string, number[]>> = {}; // group -> exercise -> array of peak 1RMs
    
    // Helper to extract 1RM
    const calculate1RM = (weight: number, reps: number) => {
      if (reps <= 0) return weight;
      if (reps === 1) return weight;
      return weight * (1 + reps / 30);
    };

    const allWorkouts = [...archivedWorkouts];

    const sortedWorkouts = [...allWorkouts].sort((a, b) => {
      const dA = a.date || "";
      const dB = b.date || "";
      return dA.localeCompare(dB);
    });

    sortedWorkouts.forEach((workout) => {
      if (!workout.sets || !Array.isArray(workout.sets)) return;
      
      const workoutExerciseMaxes: Record<string, number> = {};
      workout.sets.forEach((set: any) => {
        if (!set || !set.exerciseName) return;
        const exName = set.exerciseName.trim();
        const weight = Number(set.weight) || 0;
        const reps = Number(set.reps) || 0;
        const oneRM = calculate1RM(weight, reps);
        
        workoutExerciseMaxes[exName] = Math.max(workoutExerciseMaxes[exName] || 0, oneRM);
      });

      Object.entries(workoutExerciseMaxes).forEach(([exName, max1RM]) => {
        if (max1RM <= 0) return;
        
        const resolvedEx = findExerciseByName(exName);
        const poolName = resolvedEx ? resolvedEx.pool : "";
        const groupName = mapPoolToMuscleGroup(poolName);
        
        // Skip unmapped categories like "Other", "Cardio", etc. if they aren't standard weight lifting
        if (["Other", "Cardio", "Equipment"].includes(groupName)) return;
        
        if (!muscleGroupExercises[groupName]) {
          muscleGroupExercises[groupName] = {};
        }
        if (!muscleGroupExercises[groupName][exName]) {
          muscleGroupExercises[groupName][exName] = [];
        }
        
        muscleGroupExercises[groupName][exName].push(max1RM);
      });
    });

    const standardGroups = ["Chest", "Back", "Shoulders", "Legs", "Core", "Biceps", "Triceps"];
    
    return standardGroups.map((groupName) => {
      const groupExercises = muscleGroupExercises[groupName] || {};
      let totalRelativeGrowth = 0;
      let exerciseCountWithMultipleLogs = 0;
      let totalExerciseCount = 0;
      const detailsList: { name: string; growth: number }[] = [];

      Object.entries(groupExercises).forEach(([exName, oneRMs]) => {
        totalExerciseCount++;
        if (oneRMs.length >= 2) {
          const baseline = oneRMs[0];
          const latest = Math.max(...oneRMs);
          if (baseline > 0) {
            const ratio = (latest / baseline) * 100;
            totalRelativeGrowth += ratio;
            exerciseCountWithMultipleLogs++;
            detailsList.push({ name: exName, growth: ratio - 100 });
          }
        } else if (oneRMs.length === 1) {
          totalRelativeGrowth += 100;
          exerciseCountWithMultipleLogs++;
          detailsList.push({ name: exName, growth: 0 });
        }
      });

      const averageStrengthRatio = exerciseCountWithMultipleLogs > 0
        ? totalRelativeGrowth / exerciseCountWithMultipleLogs
        : 100;

      return {
        axis: groupName,
        value: Number(averageStrengthRatio.toFixed(1)),
        loggedExercisesCount: totalExerciseCount,
        details: detailsList.sort((a, b) => b.growth - a.growth)
      };
    });
  }, [archivedWorkouts, sessionSets]);

  const getExerciseProgressDetails = (exName: string) => {
    if (!exName) return null;
    const searchName = exName.trim().toLowerCase();
    const allSets: Array<{
      weight: number;
      reps: number;
      date: string;
      timestamp: number;
      workoutName: string;
      isCurrentSession?: boolean;
      difficulty?: string;
      notes?: string;
    }> = [];

    // 1. Accumulate from archives
    archivedWorkouts.forEach((w) => {
      if (w.sets && Array.isArray(w.sets)) {
        w.sets.forEach((s: any) => {
          if (s && s.exerciseName && s.exerciseName.trim().toLowerCase() === searchName) {
            allSets.push({
              weight: Number(s.weight) || 0,
              reps: Number(s.reps) || 0,
              date: w.date || "",
              timestamp: new Date(w.date || 0).getTime() || 0,
              workoutName: w.name || "Archived Workout",
              difficulty: s.difficulty,
              notes: s.notes,
            });
          }
        });
      }
    });

    // 2. Accumulate from current session
    sessionSets.forEach((s) => {
      if (s && s.exerciseName && s.exerciseName.trim().toLowerCase() === searchName) {
        const sDate = s.date || new Date().toISOString().split("T")[0];
        allSets.push({
          weight: Number(s.weight) || 0,
          reps: Number(s.reps) || 0,
          date: sDate,
          timestamp: new Date(sDate).getTime() || Date.now(),
          workoutName: "Today's Active Workout",
          isCurrentSession: true,
          difficulty: s.difficulty,
          notes: s.notes,
        });
      }
    });

    // Sort chronologically (earliest to latest)
    allSets.sort((a, b) => a.timestamp - b.timestamp);

    if (allSets.length === 0) return null;

    // Group by Date to get the highest weight logged for that day
    const groupedByDate: Record<string, typeof allSets[0]> = {};
    allSets.forEach((s) => {
      const dKey = s.date;
      if (!groupedByDate[dKey] || s.weight > groupedByDate[dKey].weight || (s.weight === groupedByDate[dKey].weight && s.reps > groupedByDate[dKey].reps)) {
        groupedByDate[dKey] = s;
      }
    });

    const dailyHighestSets = Object.values(groupedByDate).sort((a, b) => a.timestamp - b.timestamp);

    const firstSet = dailyHighestSets[0];
    const lastSet = dailyHighestSets[dailyHighestSets.length - 1];
    const weightDiff = lastSet.weight - firstSet.weight;
    const percentDiff = firstSet.weight > 0 ? (weightDiff / firstSet.weight) * 100 : 0;

    // Calculate peak weight
    const weights = dailyHighestSets.map((s) => s.weight);
    const maxWeight = Math.max(...weights);
    const totalVolume = dailyHighestSets.reduce((acc, s) => acc + s.weight * s.reps, 0);

    return {
      allSets: dailyHighestSets,
      firstSet,
      lastSet,
      weightDiff,
      percentDiff,
      maxWeight,
      totalVolume,
      count: dailyHighestSets.length,
    };
  };

  const handleDeletePB = async (exName: string) => {
    if (!currentUser) return;

    try {
      // Optimistically delete from state
      setPersonalBests((prev) => {
        const next = { ...prev };
        delete next[exName];
        return next;
      });

      const pbsPath = `users/${currentUser.uid}/pbs/${exName}`;
      await deleteDoc(doc(db, pbsPath));
      
      setToast({
        message: `Personal Best for "${exName}" deleted successfully.`,
        type: "success",
      });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      handleFirestoreError(
        err,
        OperationType.DELETE,
        `users/${currentUser.uid}/pbs/${exName}`
      );
    }
  };

  const handleArchiveWorkout = async () => {
    if (!currentUser || sessionSets.length === 0) return;

    try {
      setDataLoading(true);
      const batch = writeBatch(db);

      const dates = Array.from(new Set(sessionSets.map((s) => s.date))).sort(
        (a: string, b: string) => b.localeCompare(a),
      );
      const targetDate = dates[0] || new Date().toISOString().split("T")[0];

      const existingWorkoutForDay = archivedWorkouts.find(
        (w) => w.date === targetDate
      );

      const combinedSets = existingWorkoutForDay
        ? [...(existingWorkoutForDay.sets || []), ...sessionSets]
        : sessionSets;

      // Compute session metrics for the active performance summary modal
      const sessionVolume = sessionSets.reduce((sum, s) => {
        const searchName = s.exerciseName?.trim().toLowerCase();
        let isCardio = false;
        for (const pool of Object.values(combinedPools)) {
          const found = pool.find(
            (e) => e.name.trim().toLowerCase() === searchName,
          );
          if (found && found.pool === "cardio") {
            isCardio = true;
            break;
          }
        }
        return sum + (isCardio ? 0 : s.weight * s.reps);
      }, 0);

      let peakWt = 0;
      let peakEx = "";
      sessionSets.forEach((s) => {
        if (s.weight > peakWt) {
          peakWt = s.weight;
          peakEx = s.exerciseName;
        }
      });

      const rawMuscleCounts: Record<string, number> = {};
      const rawExerciseMap: Record<string, { setsCount: number; maxWeight: number; volume: number }> = {};

      sessionSets.forEach((s) => {
        const ex = findExerciseByName(s.exerciseName);
        const rawMuscle = ex?.muscleGroup || ex?.pool || "Other";
        const muscleName = rawMuscle.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        rawMuscleCounts[muscleName] = (rawMuscleCounts[muscleName] || 0) + 1;

        if (!rawExerciseMap[s.exerciseName]) {
          rawExerciseMap[s.exerciseName] = { setsCount: 0, maxWeight: 0, volume: 0 };
        }
        const ref = rawExerciseMap[s.exerciseName];
        ref.setsCount += 1;
        if (s.weight > ref.maxWeight) ref.maxWeight = s.weight;
        const sVolume = (ex && ex.pool === "cardio") ? 0 : s.weight * s.reps;
        ref.volume += sVolume;
      });

      const totalSetsInSession = sessionSets.length;
      const mGroups = Object.entries(rawMuscleCounts).map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalSetsInSession) * 100),
      })).sort((a, b) => b.count - a.count);

      const eList = Object.entries(rawExerciseMap).map(([name, data]) => ({
        name,
        ...data,
      }));

      const calsBurned = calculateCaloriesBurned(sessionSets, profile);

      const computedSummary = {
        totalVolume: sessionVolume,
        peakWeight: peakWt,
        peakExercise: peakEx || "None",
        totalSets: totalSetsInSession,
        caloriesBurned: calsBurned,
        muscleGroups: mGroups,
        exercisesList: eList,
        date: targetDate,
      };

      const totalVolume = combinedSets.reduce((sum, s) => {
        const searchName = s.exerciseName?.trim().toLowerCase();
        let isCardio = false;
        for (const pool of Object.values(combinedPools)) {
          const found = pool.find(
            (e) => e.name.trim().toLowerCase() === searchName,
          );
          if (found && found.pool === "cardio") {
            isCardio = true;
            break;
          }
        }
        return sum + (isCardio ? 0 : s.weight * s.reps);
      }, 0);

      const workoutRef = existingWorkoutForDay
        ? doc(db, `users/${currentUser.uid}/workouts/${existingWorkoutForDay.id}`)
        : doc(collection(db, `users/${currentUser.uid}/workouts`));

      const newCalories = calculateCaloriesBurned(sessionSets, profile);
      const estimatedCalories = (existingWorkoutForDay ? (existingWorkoutForDay.estimatedCalories || 0) : 0) + newCalories;

      const workoutData = {
        date: targetDate,
        timestamp: existingWorkoutForDay ? (existingWorkoutForDay.timestamp || serverTimestamp()) : serverTimestamp(),
        sets: combinedSets,
        totalVolume,
        exercisesCount: new Set(combinedSets.map((s) => s.exerciseName)).size,
        totalSets: combinedSets.length,
        estimatedCalories,
      };

      batch.set(workoutRef, workoutData);

      // Delete all current sets from Firestore
      sessionSets.forEach((s) => {
        if (s.id) {
          batch.delete(doc(db, `users/${currentUser.uid}/sets/${s.id}`));
        }
      });

      // Reward user upon successfully archiving a full workout: +250 Credits and +400 XP!
      const finalXpEarned = 400;
      const finalCreditsEarned = 250;

      let nextLevel = profile?.avatarLevel ?? 1;
      let nextXp = (profile?.avatarXp ?? 0) + finalXpEarned;
      const nextCredits = (profile?.avatarCredits ?? 5000) + finalCreditsEarned;
      let nextPoints = profile?.unassignedPoints ?? 10;

      const getXpNeeded = (lvl: number) => lvl * 500 + 2000;
      let leveledUp = false;

      while (nextXp >= getXpNeeded(nextLevel)) {
        nextXp -= getXpNeeded(nextLevel);
        nextLevel += 1;
        nextPoints += 3;
        leveledUp = true;
      }

      const avatarUpdate = {
        avatarLevel: nextLevel,
        avatarXp: nextXp,
        avatarCredits: nextCredits,
        unassignedPoints: nextPoints,
        // Reset stopwatch and manual timers so next session starts at 0
        timerStartTime: null,
        timerEndTime: null,
        timerActive: false,
        timerManualDuration: 0,
        timerAccumulatedMs: 0,
      };

      setProfile((prev) => (prev ? { ...prev, ...avatarUpdate } : null));

      if (leveledUp) {
        setToast({
          message: `🔥 LEVEL UP! You are now Level ${nextLevel}!`,
          type: "success",
        });
        setTimeout(() => setToast(null), 3000);
      }

      const settingsRef = doc(db, `users/${currentUser.uid}/profile/settings`);
      batch.set(
        settingsRef,
        {
          ...avatarUpdate,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      // Clear all categories in the programming tab
      const currentWorkoutRef = doc(
        db,
        `users/${currentUser.uid}/workout/current`,
      );
      const emptyDaysObj: Record<string, Exercise[]> = {};
      for (let i = 0; i < 6; i++) {
        emptyDaysObj[`d${i}`] = [];
      }
      batch.set(currentWorkoutRef, {
        days: emptyDaysObj,
        version: 2,
        updatedAt: serverTimestamp(),
      });

      await batch.commit();

      // Update local state for instant feedback
      setCurrentDays([[], [], [], [], [], []]);

      // Trigger the Session Summary Modal
      setSessionSummary(computedSummary);

      // sessionSets will be cleared via onSnapshot
      setSelectedWorkoutId(workoutRef.id);
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.WRITE,
        `users/${currentUser.uid}/workouts`,
      );
    } finally {
      setDataLoading(false);
    }
  };

  const handleDeleteWorkout = async (id: string | undefined) => {
    if (!currentUser || !id) return;

    try {
      setDataLoading(true);
      await deleteDoc(doc(db, `users/${currentUser.uid}/workouts/${id}`));

      // Update local state immediately for instant UI feedback
      setArchivedWorkouts((prev) => prev.filter((w) => w.id !== id));

      if (selectedWorkoutId === id) {
        setSelectedWorkoutId(null);
      }

      // We don't use alert() as it can be blocked in iframe
      console.log("Evolution Record permanently excluded from the archive.");
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSaveRoutine = async (workout: any, categoryIndex: number) => {
    if (!currentUser || !workout) return;
    try {
      setDataLoading(true);
      const categoryName = DAY_CONFIG[categoryIndex].name;
      const formattedDate = new Date(
        workout.timestamp?.seconds
          ? workout.timestamp.seconds * 1000
          : Date.now(),
      ).toLocaleDateString([], { day: "numeric", month: "short" });
      const defaultName = `${categoryName} Routine (${formattedDate})`;

      const routineRef = doc(
        collection(db, `users/${currentUser.uid}/routines`),
      );
      await setDoc(routineRef, {
        name: defaultName,
        date: workout.date || new Date().toISOString().split("T")[0],
        categoryIndex,
        sets: workout.sets || [],
        timestamp: serverTimestamp(),
      });

      setToast({
        message: `Routine saved under ${categoryName}!`,
        type: "success",
      });
      setSavingRoutineWorkout(null);
    } catch (error) {
      console.error("Error saving routine:", error);
      setToast({ message: "Failed to save routine.", type: "info" });
    } finally {
      setDataLoading(false);
    }
  };

  const handleDeleteRoutine = async (id: string) => {
    if (!currentUser || !id) return;
    try {
      setDataLoading(true);
      await deleteDoc(doc(db, `users/${currentUser.uid}/routines/${id}`));
      setToast({ message: "Routine deleted successfully", type: "success" });
    } catch (err) {
      console.error("Failed to delete routine:", err);
      setToast({ message: "Failed to delete routine", type: "info" });
    } finally {
      setDataLoading(false);
    }
  };

  const handleRenameRoutine = async (id: string, newName: string) => {
    if (!currentUser || !id || !newName.trim()) return;
    try {
      setDataLoading(true);
      await setDoc(
        doc(db, `users/${currentUser.uid}/routines/${id}`),
        {
          name: newName.trim(),
        },
        { merge: true },
      );
      setToast({ message: "Routine renamed successfully", type: "success" });
      setEditingRoutineId(null);
    } catch (err) {
      console.error("Failed to rename routine:", err);
      setToast({ message: "Failed to rename routine", type: "info" });
    } finally {
      setDataLoading(false);
    }
  };

  const handleSaveCustomRoutine = async () => {
    if (!currentUser) return;
    if (!newRoutineName.trim()) {
      setToast({ message: "Please enter a routine name.", type: "info" });
      return;
    }
    if (newRoutineExercises.length === 0) {
      setToast({ message: "Please add at least one exercise to the routine.", type: "info" });
      return;
    }

    // Flatten exercises and sets to fit db format:
    const flatSets: any[] = [];
    newRoutineExercises.forEach((exItem) => {
      exItem.sets.forEach((setItem) => {
        flatSets.push({
          exerciseName: exItem.exerciseName,
          weight: Number(setItem.weight) || 0,
          reps: Number(setItem.reps) || 0,
          notes: setItem.notes || "",
        });
      });
    });

    try {
      setDataLoading(true);
      const categoryName = DAY_CONFIG[newRoutineCategory].name;
      const formattedDate = new Date().toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });

      const routineRef = doc(
        collection(db, `users/${currentUser.uid}/routines`),
      );
      await setDoc(routineRef, {
        name: newRoutineName.trim(),
        date: formattedDate,
        categoryIndex: newRoutineCategory,
        sets: flatSets,
        periodization: newRoutinePeriodization || "hypertrophy",
        timestamp: serverTimestamp(),
      });

      setToast({
        message: `Custom routine "${newRoutineName.trim()}" saved under ${categoryName}!`,
        type: "success",
      });
      setIsCreatingRoutine(false);
      setNewRoutineName("");
      setNewRoutineCategory(0);
      setNewRoutineExercises([]);
    } catch (error) {
      console.error("Error creating custom routine:", error);
      setToast({ message: "Failed to save custom routine.", type: "info" });
    } finally {
      setDataLoading(false);
    }
  };

  const handleAddExercise = (exerciseName: string) => {
    if (!exerciseName.trim()) return;
    if (
      newRoutineExercises.some(
        (e) => e.exerciseName.toLowerCase() === exerciseName.toLowerCase()
      )
    ) {
      setToast({
        message: `"${exerciseName}" is already added to this routine!`,
        type: "info",
      });
      return;
    }

    let defaultReps = 10;
    let defaultNotes = "";
    if (newRoutinePeriodization === "strength") {
      defaultReps = 5;
      defaultNotes = "[RPE 9 - Strength Block]";
    } else if (newRoutinePeriodization === "deload") {
      defaultReps = 12;
      defaultNotes = "[RPE 5 - Deload Block]";
    } else {
      defaultReps = 10;
      defaultNotes = "[RPE 8 - Hypertrophy Block]";
    }

    setNewRoutineExercises((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        exerciseName: exerciseName.trim(),
        sets: [{ weight: 20, reps: defaultReps, notes: defaultNotes }],
      },
    ]);
  };

  const handleRemoveExercise = (id: string) => {
    setNewRoutineExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const handleMoveExerciseUp = (index: number) => {
    if (index === 0) return;
    setNewRoutineExercises((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index - 1];
      next[index - 1] = temp;
      return next;
    });
  };

  const handleMoveExerciseDown = (index: number) => {
    if (index === newRoutineExercises.length - 1) return;
    setNewRoutineExercises((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index + 1];
      next[index + 1] = temp;
      return next;
    });
  };

  const handleRoutineExDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleRoutineExDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleRoutineExDrop = (e: React.DragEvent, dIndex: number) => {
    e.preventDefault();
    const sIndex = Number(e.dataTransfer.getData("text/plain"));
    if (isNaN(sIndex) || sIndex === dIndex) return;

    setNewRoutineExercises((prev) => {
      const next = [...prev];
      const [removed] = next.splice(sIndex, 1);
      next.splice(dIndex, 0, removed);
      return next;
    });
    setDraggedIdx(null);
  };

  const handleAddSet = (exId: string) => {
    setNewRoutineExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exId) {
          const lastSet = ex.sets[ex.sets.length - 1];
          return {
            ...ex,
            sets: [
              ...ex.sets,
              {
                weight: lastSet ? lastSet.weight : 20,
                reps: lastSet ? lastSet.reps : 10,
                notes: "",
              },
            ],
          };
        }
        return ex;
      })
    );
  };

  const handleRemoveSet = (exId: string, setIdx: number) => {
    setNewRoutineExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exId) {
          const nextSets = [...ex.sets];
          nextSets.splice(setIdx, 1);
          return { ...ex, sets: nextSets };
        }
        return ex;
      })
    );
  };

  const handlePreloadToBuilder = (routine: any) => {
    if (!routine) return;
    setNewRoutineName(`${routine.name} Tweak`);
    setNewRoutineCategory(routine.categoryIndex !== undefined ? routine.categoryIndex : 0);
    
    const rawPeriod = routine.periodization;
    const period: "hypertrophy" | "strength" | "deload" =
      rawPeriod === "strength" || rawPeriod === "deload" || rawPeriod === "hypertrophy"
        ? rawPeriod
        : "hypertrophy";
    setNewRoutinePeriodization(period);
    
    // Group flat sets by exerciseName
    const grouped: Record<string, {
      id: string;
      exerciseName: string;
      sets: { weight: number; reps: number; notes: string }[];
    }> = {};

    const sets = routine.sets || [];
    sets.forEach((s: any) => {
      const exName = s.exerciseName || "Exercise";
      if (!grouped[exName]) {
        grouped[exName] = {
          id: Math.random().toString(36).substring(2, 9),
          exerciseName: exName,
          sets: [],
        };
      }
      grouped[exName].sets.push({
        weight: s.weight !== undefined ? Number(s.weight) : 20,
        reps: s.reps !== undefined ? Number(s.reps) : 10,
        notes: s.notes || "",
      });
    });

    setNewRoutineExercises(Object.values(grouped));
    setIsCreatingRoutine(true);
    setBuilderSearch("");
    setToast({
      message: `Preloaded "${routine.name}" into custom builder! Make your modifications now.`,
      type: "success",
    });
  };

  const handleLoadRoutineToActiveSession = async (routine: any) => {
    if (!currentUser || !routine) return;
    try {
      setDataLoading(true);

      const uniqueExNames: string[] = [];
      const sets = routine.sets || [];
      sets.forEach((set: any) => {
        if (set && set.exerciseName) {
          const trimmedName = set.exerciseName.trim();
          if (
            trimmedName &&
            !uniqueExNames.some(
              (name) => name.toLowerCase() === trimmedName.toLowerCase(),
            )
          ) {
            uniqueExNames.push(trimmedName);
          }
        }
      });

      const exercisesToSet: Exercise[] = uniqueExNames.map((name) => {
        let foundEx: Exercise | null = null;
        for (const [_, list] of Object.entries(combinedPools)) {
          const match = list.find(
            (e) => e.name.trim().toLowerCase() === name.toLowerCase(),
          );
          if (match) {
            foundEx = match;
            break;
          }
        }
        return (
          foundEx || {
            name: name,
            icon: "Dumbbell",
            pool: "chest",
          }
        );
      });

      const defaultCategory =
        typeof routine.categoryIndex === "number" ? routine.categoryIndex : 0;
      const nextCurrentDays = [...currentDays];

      // Group loaded exercises by their target day index based on the pool they belong to
      const routineExercisesByDay: { [key: number]: Exercise[] } = {};
      exercisesToSet.forEach((ex) => {
        let targetIndex = defaultCategory;
        if (ex.pool) {
          const matchedIdx = DAY_CONFIG.findIndex(day => day.pools.includes(ex.pool!));
          if (matchedIdx !== -1) {
            targetIndex = matchedIdx;
          }
        }
        if (!routineExercisesByDay[targetIndex]) {
          routineExercisesByDay[targetIndex] = [];
        }
        if (!routineExercisesByDay[targetIndex].some(e => e.name.toLowerCase() === ex.name.toLowerCase())) {
          routineExercisesByDay[targetIndex].push(ex);
        }
      });

      // Update nextCurrentDays
      DAY_CONFIG.forEach((_, idx) => {
        const newExsForDay = routineExercisesByDay[idx] || [];
        if (idx === defaultCategory) {
          // Replace exercises on the primary category day
          nextCurrentDays[idx] = newExsForDay;
        } else if (newExsForDay.length > 0) {
          // Merge/append into other days to prevent overwriting existing work
          const existing = nextCurrentDays[idx] || [];
          const existingNames = new Set(existing.map(e => e.name.toLowerCase()));
          const toAdd = newExsForDay.filter(e => !existingNames.has(e.name.toLowerCase()));
          nextCurrentDays[idx] = [...existing, ...toAdd];
        }
      });

      setCurrentDays(nextCurrentDays);
      await saveWorkout(nextCurrentDays);

      // Expand all days where routine exercises were loaded
      const updatedExpandedDays = { ...expandedDays };
      Object.keys(routineExercisesByDay).forEach((key) => {
        updatedExpandedDays[Number(key)] = true;
      });
      setExpandedDays(updatedExpandedDays);

      setLastLoadedDayIndex(defaultCategory);
      setTimeout(() => {
        setLastLoadedDayIndex(null);
      }, 5000);

      // Instantly load and format exercises into Plan tab (merging them cleanly without duplicate names)
      const mergedProgram = DAY_CONFIG.map((day, idx) => {
        const existingItem = formattedProgram.find(item => item.dayIndex === idx);
        const existingExercises = existingItem ? [...existingItem.exercises] : [];
        const existingNames = new Set(existingExercises.map(ex => ex.name.toLowerCase()));

        const planExercises = nextCurrentDays[idx] || [];
        const newExercises = planExercises.filter(ex => !existingNames.has(ex.name.toLowerCase()));

        return {
          dayIndex: idx,
          dayName: day.name,
          exercises: [...existingExercises, ...newExercises]
        };
      }).filter(item => item.exercises.length > 0);

      setFormattedProgram(mergedProgram);
      setWorkoutInnerTab("program");

      setActiveView("workout");
      await saveSettings({ activeView: "workout" });

      setToast({
        message: `Loaded ${exercisesToSet.length} exercises into your Programming and Plan!`,
        type: "success",
      });
    } catch (err) {
      console.error("Failed to load routine to Programming:", err);
      setToast({
        message: "Failed to load routine exercises into Programming",
        type: "info",
      });
    } finally {
      setDataLoading(false);
    }
  };

  const handleClearActiveSession = async () => {
    if (!currentUser || sessionSets.length === 0) return;

    try {
      setDataLoading(true);
      const batch = writeBatch(db);
      sessionSets.forEach((s) => {
        if (s.id) {
          batch.delete(doc(db, `users/${currentUser.uid}/sets/${s.id}`));
        }
      });

      const timerResetUpdate = {
        timerStartTime: null,
        timerEndTime: null,
        timerActive: false,
        timerManualDuration: 0,
        timerAccumulatedMs: 0,
      };

      setProfile((prev) => (prev ? { ...prev, ...timerResetUpdate } : null));

      const settingsRef = doc(db, `users/${currentUser.uid}/profile/settings`);
      batch.set(
        settingsRef,
        {
          ...timerResetUpdate,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await batch.commit();
      console.log("Active performance log cleared.");
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.DELETE,
        `users/${currentUser.uid}/sets`,
      );
    } finally {
      setDataLoading(false);
    }
  };

  const [expandedWorkouts, setExpandedWorkouts] = useState<
    Record<string, boolean>
  >({});
  const toggleWorkoutExpansion = (id: string) => {
    setExpandedWorkouts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const [isSavingWeight, setIsSavingWeight] = useState(false);
  const [weightFlash, setWeightFlash] = useState("");

  const handleSaveWeight = async () => {
    if (!newWeight || !newWeightDate || !currentUser || isSavingWeight) {
      if (!newWeightDate) {
        setWeightFlash("Enter date");
        setTimeout(() => setWeightFlash(""), 2000);
      }
      return;
    }

    const w = parseFloat(newWeight);
    if (isNaN(w) || w <= 0) {
      setWeightFlash("Invalid weight");
      setTimeout(() => setWeightFlash(""), 2000);
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(newWeightDate)) {
      setWeightFlash("Invalid date");
      setTimeout(() => setWeightFlash(""), 2000);
      return;
    }

    setIsSavingWeight(true);
    const date = newWeightDate;

    const entry: Omit<WeightEntry, "id"> = {
      weight: w,
      date,
      timestamp: serverTimestamp(),
    };

    try {
      const weightColPath = `users/${currentUser.uid}/weightEntries`;
      const docId = `w-${Date.now()}`;

      await setDoc(doc(db, weightColPath, docId), entry);

      // Persist in profile settings too!
      await saveSettings({ bodyweight: w });
      setProfile((prev) => prev ? { ...prev, bodyweight: w } : null);

      setNewWeight("");
      setNewWeightDate("");
      setWeightFlash("✓ SAVED");

      setTimeout(() => setWeightFlash(""), 2000);
    } catch (err) {
      handleFirestoreError(
        err,
        OperationType.WRITE,
        `users/${currentUser.uid}/weightEntries`,
      );
      setWeightFlash("Error saving");
      setTimeout(() => setWeightFlash(""), 3000);
    } finally {
      setIsSavingWeight(false);
    }
  };

  const [isSavingBodyFat, setIsSavingBodyFat] = useState(false);
  const [bodyFatFlash, setBodyFatFlash] = useState("");

  const handleSaveBodyFat = async () => {
    if (!newBodyFat || !newBodyFatDate || !currentUser || isSavingBodyFat) {
      if (!newBodyFatDate) {
        setBodyFatFlash("Enter date");
        setTimeout(() => setBodyFatFlash(""), 2000);
      }
      return;
    }

    const bf = parseFloat(newBodyFat);
    if (isNaN(bf) || bf <= 0 || bf > 100) {
      setBodyFatFlash("Invalid percent");
      setTimeout(() => setBodyFatFlash(""), 2000);
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(newBodyFatDate)) {
      setBodyFatFlash("Invalid date");
      setTimeout(() => setBodyFatFlash(""), 2000);
      return;
    }

    setIsSavingBodyFat(true);
    const date = newBodyFatDate;

    const entry: Omit<BodyFatEntry, "id"> = {
      bodyFatPercent: bf,
      date,
      timestamp: serverTimestamp(),
    };

    try {
      const bfColPath = `users/${currentUser.uid}/bodyFatEntries`;
      const docId = `bf-${Date.now()}`;

      await setDoc(doc(db, bfColPath, docId), entry);

      // Persist in profile settings too!
      await saveSettings({ bodyFatPercent: bf });
      setProfile((prev) => prev ? { ...prev, bodyFatPercent: bf } : null);

      setNewBodyFat("");
      setNewBodyFatDate("");
      setBodyFatFlash("✓ SAVED");

      setTimeout(() => setBodyFatFlash(""), 2000);
    } catch (err) {
      handleFirestoreError(
        err,
        OperationType.WRITE,
        `users/${currentUser.uid}/bodyFatEntries`,
      );
      setBodyFatFlash("Error saving");
      setTimeout(() => setBodyFatFlash(""), 3000);
    } finally {
      setIsSavingBodyFat(false);
    }
  };

  const handleClearHistory = async () => {
    if (!currentUser) return;

    try {
      setDataLoading(true);
      setShowClearConfirm(false);

      // Optimistically clear ONLY session sets from UI
      setSessionSets([]);

      const userId = currentUser.uid;
      const setsPath = `users/${userId}/sets`;

      // Only fetch sets to delete
      const snap = await getDocs(collection(db, setsPath));

      if (!snap.empty) {
        const batch = writeBatch(db);
        let count = 0;
        snap.forEach((d) => {
          batch.delete(d.ref);
          count++;
        });
        await batch.commit();
        console.log(`Cleared ${count} session recordings.`);
      }

      // Clear any temporary input values in elements
      const inputs = document.querySelectorAll("input");
      inputs.forEach((input: any) => {
        if (input.type === "number" || input.type === "text") {
          input.value = "";
        }
      });
    } catch (err) {
      console.error("Failed to clear session history:", err);
      handleFirestoreError(
        err,
        OperationType.DELETE,
        `users/${currentUser.uid}/sets-wipe`,
      );
    } finally {
      setDataLoading(false);
    }
  };

  const authTheme = GYM_THEMES[currentThemeId] || GYM_THEMES.default;
  const authStyles = {
    "--gym-accent": authTheme.accent,
    "--gym-accent-light": authTheme.accentLight,
    "--gym-accent-dark": authTheme.accentDark,
    "--gym-accent-rgb": authTheme.accentRgb,
    "--theme-text": authTheme.testPrimary,
    "--theme-text-muted": authTheme.testMuted,
    "--theme-text-subtle": authTheme.testSubtle,
    backgroundColor: authTheme.bg,
  } as React.CSSProperties;

  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-500"
        style={authStyles}
      >
        <style>{`
          :root {
            --gym-accent: ${authTheme.accent} !important;
            --gym-accent-light: ${authTheme.accentLight} !important;
            --gym-accent-dark: ${authTheme.accentDark} !important;
            --gym-accent-rgb: ${authTheme.accentRgb} !important;
            --theme-text: ${authTheme.testPrimary} !important;
            --theme-text-muted: ${authTheme.testMuted} !important;
            --theme-text-subtle: ${authTheme.testSubtle} !important;
          }
        `}</style>
        {/* Background Atmosphere */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {authTheme.isGradient ? (
            <div
              className="absolute inset-0 bg-[#000000]"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 30%, ${authTheme.accent}15 0%, #000000 85%)`,
              }}
            />
          ) : (
            <>
              <img
                key={authTheme.id}
                src={authTheme.bgImage}
                alt="Gym Background"
                className={`w-full h-full object-cover transition-all duration-700 ${getThemeBrightnessClass(authTheme.id)} ${authTheme.opacity}`}
                referrerPolicy="no-referrer"
              />
              <div
                className="absolute inset-0 transition-colors duration-500"
                style={{
                  background: `linear-gradient(to bottom, ${authTheme.bg}a0, ${authTheme.bg}40, ${authTheme.bg}ff)`,
                }}
              />
            </>
          )}
        </div>
        <Loader2 className="w-12 h-12 text-gym-accent animate-spin relative z-10" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div
        className="min-h-screen text-white flex items-center justify-center relative overflow-hidden transition-all duration-500"
        style={authStyles}
      >
        <style>{`
          :root {
            --gym-accent: ${authTheme.accent} !important;
            --gym-accent-light: ${authTheme.accentLight} !important;
            --gym-accent-dark: ${authTheme.accentDark} !important;
            --gym-accent-rgb: ${authTheme.accentRgb} !important;
            --theme-text: ${authTheme.testPrimary} !important;
            --theme-text-muted: ${authTheme.testMuted} !important;
            --theme-text-subtle: ${authTheme.testSubtle} !important;
          }
        `}</style>
        {/* Background Atmosphere */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {authTheme.isGradient ? (
            <div
              className="absolute inset-0 bg-[#000000]"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 30%, ${authTheme.accent}15 0%, #000000 85%)`,
              }}
            />
          ) : (
            <>
              <img
                key={authTheme.id}
                src={authTheme.bgImage}
                alt="Gym Background"
                className={`w-full h-full object-cover transition-all duration-700 ${getThemeBrightnessClass(authTheme.id)} ${authTheme.opacity} scale-105`}
                referrerPolicy="no-referrer"
              />
              <div
                className="absolute inset-0 transition-colors duration-500"
                style={{
                  background: `linear-gradient(to bottom, ${authTheme.bg}a0, ${authTheme.bg}60, ${authTheme.bg}ff)`,
                }}
              />
            </>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-md w-full p-10 border border-white/10 rounded-md bg-black/40 backdrop-blur-md"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-gym-accent mb-2 block font-bold">
            Est. 2026
          </span>
          <h1 className="text-4xl font-light italic font-serif tracking-widest mb-4 text-white">
            Titan <span className="text-gym-accent accent-glow">Pro</span>
          </h1>
          <p className="text-white/40 mb-10 text-sm font-light leading-relaxed">
            The sophisticated approach to physical excellence.
          </p>

          <form
            onSubmit={
              authMode === "login"
                ? handleEmailLogin
                : authMode === "signup"
                  ? handleEmailSignup
                  : handleResetPassword
            }
            className="space-y-4 text-left"
          >
            <div className="space-y-1">
              <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold ml-1">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-4 text-sm font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                placeholder="Ex. athlete@gympro.com"
                required
              />
            </div>

            {authMode !== "reset" && (
              <div className="space-y-1">
                <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold ml-1">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-4 text-sm font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                  placeholder="••••••••"
                  required={authMode !== "reset"}
                />
              </div>
            )}

            {authError && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">
                {authError}
              </p>
            )}
            {authMessage && (
              <p className="text-gym-accent text-[10px] font-bold uppercase tracking-widest ml-1">
                {authMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gym-accent text-black py-4 rounded-md font-bold uppercase tracking-widest hover:brightness-110 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-gym-accent/20 mt-6"
            >
              {authMode === "login"
                ? "Enter Archive"
                : authMode === "signup"
                  ? "Commence Training"
                  : "Recover Access"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-white/5 w-full"></div>
              <span className="absolute px-4 bg-[#0a0a0a] text-[8px] text-white/30 uppercase tracking-[0.3em] font-bold">
                Or Continue With
              </span>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white/5 border border-white/10 text-white/60 py-4 rounded-md font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Standard Google Identity
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-center px-2">
              {authMode === "login" ? (
                <>
                  <button
                    onClick={() => setAuthMode("signup")}
                    className="text-[10px] text-white/30 hover:text-gym-accent uppercase tracking-widest font-bold cursor-pointer"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => setAuthMode("reset")}
                    className="text-[10px] text-white/30 hover:text-gym-accent uppercase tracking-widest font-bold cursor-pointer"
                  >
                    Lost Password?
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setAuthMode("login")}
                  className="text-[10px] text-white/30 hover:text-gym-accent uppercase tracking-widest font-bold cursor-pointer w-full text-center"
                >
                  Return to Login
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const isCarbonBlack = profile?.carbonBlack ?? false;
  const rawTheme = GYM_THEMES[currentThemeId] || GYM_THEMES.default;
  const activeTheme = isCarbonBlack
    ? {
        ...rawTheme,
        id: "carbon_black",
        name: "Carbon Black",
        accent: "#FFFFFF",
        accentRgb: "255, 255, 255",
        accentLight: "#E5E5E0",
        accentDark: "#737373",
        bg: "#000000",
        isGradient: false,
        testPrimary: "#ffffff",
        testMuted: "rgba(255, 255, 255, 0.65)",
        testSubtle: "rgba(255, 255, 255, 0.35)",
        opacity: "opacity-0",
      }
    : rawTheme;

  const renderFullExerciseCard = (ex: Exercise, di: number, ei: number) => {
    const IconComponent = iconMap[ex.icon] || Dumbbell;
    const resolvedEx = findExerciseByName(ex.name);
    const poolKey = resolvedEx?.pool || ex.pool;
    const label = poolKey
      ? poolKey
          .split('_')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
      : "";

    return (
      <motion.div
        key={`${ei}-${ex.name}`}
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: ei * 0.04 }}
        className="bg-black/35 border border-white/10 hover:border-gym-accent/30 rounded-2xl p-6 flex flex-col group/card backdrop-blur-xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:bg-black/55"
      >
        {/* Top gradient glow line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gym-accent/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
        
        {/* Left brand indicator bar */}
        <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-gym-accent opacity-30 group-hover/card:opacity-100 transition-opacity duration-300" />

        {/* Header Block: Badges & Premium Utility Action Tray */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-gym-accent font-black tracking-widest font-mono bg-gym-accent/10 px-2 py-0.5 rounded-md border border-gym-accent/20">
              #{String(ei + 1).padStart(2, '0')}
            </span>
            {ex.category && (
              <span
                className={`text-[8px] px-2 py-0.5 rounded-md font-black uppercase tracking-[0.12em] border ${
                  ex.category === "compound"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-purple-500/10 text-purple-300 border-purple-500/20"
                }`}
                title={
                  ex.category === "compound"
                    ? "Compound movement engaging multiple muscle groups"
                    : "Isolation movement focusing on a specific muscle"
                }
              >
                {ex.category}
              </span>
            )}
            {label && (
              <span className="text-[8px] px-2 py-0.5 rounded-md font-bold uppercase tracking-[0.12em] bg-white/[0.03] text-white/50 border border-white/5">
                {label}
              </span>
            )}
          </div>

          <div className="flex gap-1.5 shrink-0 opacity-40 group-hover/card:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setGuidanceEx(ex)}
              className="p-1.5 bg-white/[0.03] border border-white/5 text-white/40 hover:text-gym-accent hover:bg-gym-accent/10 hover:border-gym-accent/20 transition-all cursor-pointer rounded-lg hover:scale-105 active:scale-95 animate-none"
              title="Guidance & Instructions"
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleSwap(di, ei)}
              className="p-1.5 bg-white/[0.03] border border-white/5 text-white/40 hover:text-gym-accent hover:bg-gym-accent/10 hover:border-gym-accent/20 transition-all cursor-pointer rounded-lg hover:scale-105 active:scale-95 animate-none"
              title="Swap Exercise"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() =>
                handleRemoveExerciseFromFormattedProgram(di, ei)
              }
              className="p-1.5 bg-red-500/[0.01] border border-red-500/10 text-red-500/50 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all cursor-pointer rounded-lg hover:scale-105 active:scale-95 animate-none"
              title="Remove"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Sparkline Segment */}
        <div className="flex flex-col gap-2.5 mb-4 pl-1">
          <h4 className="text-xl font-bold font-sans text-white tracking-tight leading-snug group-hover/card:text-gym-accent transition-colors duration-300 break-words">
            {ex.name}
          </h4>
          
          {/* Sparkline & Trend section */}
          <div className="flex items-center gap-3">
            <Sparkline
              exName={ex.name}
              sessionSets={sessionSets}
              archivedWorkouts={archivedWorkouts}
              width={75}
              height={15}
            />
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">progression trend</span>
          </div>
        </div>



        {/* Muscle Specs & Info Breakdown Grid */}
        <div className="pb-4 mb-4 border-b border-white/5 pl-1">
          <div className="flex flex-col">
            <span className="text-[7.5px] font-mono text-white/35 uppercase tracking-wider">PRIMARY TARGET</span>
            <span className="text-[10px] font-semibold text-white/85 mt-0.5 truncate">
              {resolvedEx?.muscleGroup ? resolvedEx.muscleGroup.toUpperCase() : label || "N/A"}
            </span>
          </div>
        </div>

        <div className="mt-auto flex flex-col w-full">
          {/* Training Console Box */}
          <div className="flex flex-col gap-3.5 mb-4 bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl w-full hover:bg-white/[0.04] transition-all duration-300">
            {/* Input Row: Weight & Reps */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <span className="text-[8px] text-white/35 uppercase tracking-widest mb-1.5 font-bold font-mono">
                  {ex.pool === "cardio"
                    ? "Time (min)"
                    : "Weight (kg)"}
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  id={`w-${di}-${ei}`}
                  className="w-full bg-black/20 border border-white/10 hover:border-white/20 focus:border-gym-accent focus:bg-black/40 rounded-xl py-2 px-3 text-sm font-semibold focus:outline-none transition-all text-white font-mono text-center"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-white/35 uppercase tracking-widest mb-1.5 font-bold font-mono">
                  {ex.pool === "cardio"
                    ? "Speed / Lvl"
                    : "Reps"}
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  id={`r-${di}-${ei}`}
                  className="w-full bg-black/20 border border-white/10 hover:border-white/20 focus:border-gym-accent focus:bg-black/40 rounded-xl py-2 px-3 text-sm font-semibold focus:outline-none transition-all text-white font-mono text-center"
                />
              </div>
            </div>

            {/* Input Row: Set Notes */}
            <div className="flex flex-col">
              <span className="text-[8px] text-white/35 uppercase tracking-widest mb-1.5 font-bold font-mono">
                Set Notes
              </span>
              <input
                type="text"
                placeholder="Warmup, RPE 9, drop set, etc."
                id={`notes-${di}-${ei}`}
                className="w-full bg-black/20 border border-white/10 hover:border-white/20 focus:border-gym-accent focus:bg-black/40 rounded-xl py-2 px-3 text-xs font-normal focus:outline-none transition-all text-white"
              />
            </div>

            {/* Difficulty Rating Grid */}
            <div className="flex flex-col">
              <span className="text-[8px] text-white/35 uppercase tracking-widest mb-1.5 font-bold font-mono">
                Set Intensity (How'd it feel?)
              </span>
              <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() =>
                    setSetDifficulties((prev) => ({
                      ...prev,
                      [ex.name]: "easy",
                    }))
                  }
                  className={`py-1.5 text-[8.5px] font-mono uppercase tracking-wider font-extrabold rounded-lg border transition-all cursor-pointer text-center ${
                    (setDifficulties[ex.name] || "moderate") === "easy"
                      ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-400 font-black shadow-[0_0_8px_rgba(16,185,129,0.1)]"
                      : "bg-transparent border-transparent text-white/40 hover:text-white/60 hover:bg-white/[0.02]"
                  }`}
                >
                  😊 Easy
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSetDifficulties((prev) => ({
                      ...prev,
                      [ex.name]: "moderate",
                    }))
                  }
                  className={`py-1.5 text-[8.5px] font-mono uppercase tracking-wider font-extrabold rounded-lg border transition-all cursor-pointer text-center ${
                    (setDifficulties[ex.name] || "moderate") === "moderate"
                      ? "bg-amber-500/15 border-amber-500/35 text-amber-400 font-bold shadow-[0_0_8px_rgba(245,158,11,0.1)]"
                      : "bg-transparent border-transparent text-white/40 hover:text-white/60 hover:bg-white/[0.02]"
                  }`}
                >
                  ⚡ Good
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSetDifficulties((prev) => ({
                      ...prev,
                      [ex.name]: "hard",
                    }))
                  }
                  className={`py-1.5 text-[8.5px] font-mono uppercase tracking-wider font-extrabold rounded-lg border transition-all cursor-pointer text-center ${
                    (setDifficulties[ex.name] || "moderate") === "hard"
                      ? "bg-rose-500/15 border-rose-500/35 text-rose-400 font-black shadow-[0_0_8px_rgba(244,63,94,0.1)]"
                      : "bg-transparent border-transparent text-white/40 hover:text-white/60 hover:bg-white/[0.02]"
                  }`}
                >
                  🔥 Struggle
                </button>
              </div>
            </div>

            {/* Ghost Set Target (Historical Overlay) */}
            {(() => {
              const loggedSetsForThisEx = sessionSets.filter(
                (s) =>
                  s &&
                  s.exerciseName &&
                  s.exerciseName.trim().toLowerCase() === ex.name.trim().toLowerCase()
              );
              const nextSetIndex = loggedSetsForThisEx.length;
              const previousWorkouts = archivedWorkouts
                .filter((w) =>
                  w.sets?.some(
                    (s: any) =>
                      s.exerciseName?.trim().toLowerCase() === ex.name.trim().toLowerCase()
                  )
                )
                .sort((a, b) => b.date.localeCompare(a.date));

              const lastWorkout = previousWorkouts[0];
              if (!lastWorkout) return null;

              const lastSets = lastWorkout.sets.filter(
                (s: any) =>
                  s.exerciseName?.trim().toLowerCase() === ex.name.trim().toLowerCase()
              );

              const ghostSet = lastSets[nextSetIndex];
              if (!ghostSet) return null;

              const dateFormatted = new Date(lastWorkout.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              });

              return (
                <div className="flex items-center justify-between bg-gym-accent/[0.02] border border-gym-accent/15 rounded-xl px-3 py-2 mt-1 text-[10px]">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-2">
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gym-accent/40 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gym-accent/70"></span>
                    </span>
                    <span className="text-white/40 font-mono truncate">
                      Ghost Set {nextSetIndex + 1} ({dateFormatted}):
                    </span>
                    <span className="text-gym-accent font-mono font-bold shrink-0">
                      {ghostSet.weight}kg × {ghostSet.reps}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const wInput = document.getElementById(`w-${di}-${ei}`) as HTMLInputElement;
                      const rInput = document.getElementById(`r-${di}-${ei}`) as HTMLInputElement;
                      if (wInput) wInput.value = ghostSet.weight.toString();
                      if (rInput) rInput.value = ghostSet.reps.toString();
                    }}
                    className="text-[9px] text-gym-accent/80 hover:text-gym-accent uppercase font-black tracking-wider bg-white/5 border border-white/10 hover:bg-gym-accent/10 hover:border-gym-accent/20 px-2 py-0.5 rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0"
                    title="Use ghost set target values"
                  >
                    Match
                  </button>
                </div>
              );
            })()}

            {/* Log Set Action Button */}
            <button
              onClick={() => {
                const wInput = document.getElementById(
                  `w-${di}-${ei}`,
                ) as HTMLInputElement;
                const rInput = document.getElementById(
                  `r-${di}-${ei}`,
                ) as HTMLInputElement;
                const nInput = document.getElementById(
                  `notes-${di}-${ei}`,
                ) as HTMLInputElement;
                const w = wInput?.value;
                const r = rInput?.value;
                const notes = nInput?.value || "";
                const diff = setDifficulties[ex.name] || "moderate";
                if (w && r) {
                  handleSaveSet(ex.name, w, r, notes, diff, "formatted_program");
                  if (wInput) wInput.value = "";
                  if (rInput) rInput.value = "";
                  if (nInput) nInput.value = "";
                  // Reset difficulty back to moderate for next set
                  setSetDifficulties((prev) => ({
                    ...prev,
                    [ex.name]: "moderate",
                  }));
                }
              }}
              className="w-full bg-gym-accent hover:bg-gym-accent-light text-black py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-[0_4px_20px_rgba(255,231,101,0.25)] active:scale-[0.98] cursor-pointer text-center font-bold mt-1"
            >
              Log Set
            </button>
          </div>
        </div>

        {/* Dynamic Progression Advisory Segment */}
        {(() => {
          const loggedSetsForThisEx =
            sessionSets.filter(
              (s) =>
                s &&
                s.exerciseName &&
                s.exerciseName
                  .trim()
                  .toLowerCase() ===
                  ex.name.trim().toLowerCase(),
            );
          if (loggedSetsForThisEx.length === 0)
            return null;

          // Check weight progression
          const weightGroups: Record<number, number[]> = {};
          loggedSetsForThisEx.forEach((set) => {
            const w = typeof set.weight === 'string' ? parseFloat(set.weight) : set.weight;
            const r = typeof set.reps === 'string' ? parseInt(set.reps, 10) : set.reps;
            if (!isNaN(w) && !isNaN(r)) {
              if (!weightGroups[w]) weightGroups[w] = [];
              weightGroups[w].push(r);
            }
          });

          let recommendWeight = 0;
          let targetWeight = 0;
          let hasStruggled = false;
          for (const [weightStr, repsList] of Object.entries(weightGroups)) {
            const weight = parseFloat(weightStr);
            const successfulSets = repsList.filter((r) => r >= 10).length;
            if (successfulSets >= 3) {
              targetWeight = weight;
              recommendWeight = weight + 2.5;
              hasStruggled = loggedSetsForThisEx.some((s) => {
                const sw = typeof s.weight === "string" ? parseFloat(s.weight) : s.weight;
                return sw === weight && s.difficulty === "hard";
              });
              break;
            }
          }

          return (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 p-3 rounded-xl bg-gym-accent/5 border border-gym-accent/20 overflow-hidden"
            >
              {recommendWeight > 0 && (
                hasStruggled ? (
                  <div className="mb-3.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 justify-between">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] font-mono text-amber-400 flex items-center gap-1.5 animate-pulse">
                        <Activity className="w-3.5 h-3.5" />
                        STRENGTH CONSOLIDATION RECOMMENDED
                      </span>
                      <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full font-mono font-bold">
                        Safety Loop Active
                      </span>
                    </div>
                    <p className="text-[9px] text-white/70 leading-relaxed font-sans">
                      You completed <strong className="text-white font-bold">3 sets of 10+ reps</strong> at <span className="text-amber-400 font-mono font-bold">{targetWeight}kg</span>! Since you noted that this was a struggle (🔥), our cybernetic engine recommends maintaining <strong className="text-white">{targetWeight}kg</strong> for another workout to solidify neural adaptation before loading further.
                    </p>
                  </div>
                ) : (
                  <div className="mb-3.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 justify-between">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] font-mono text-emerald-400 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 animate-bounce" />
                        PROGRESSION UPGRADE AVAILABLE
                      </span>
                      <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-mono font-bold">
                        +{2.5}kg Target
                      </span>
                    </div>
                    <p className="text-[9px] text-white/70 leading-relaxed font-sans">
                      You mastered <strong className="text-white font-bold">3 sets of 10+ reps</strong> at <span className="text-emerald-400 font-mono font-bold">{targetWeight}kg</span>. Apply recommendations below to stimulate higher hypertrophic output.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const wInput = document.getElementById(`w-${di}-${ei}`) as HTMLInputElement;
                        const rInput = document.getElementById(`r-${di}-${ei}`) as HTMLInputElement;
                        if (wInput) wInput.value = recommendWeight.toString();
                        if (rInput) rInput.value = "10";
                        setToast({
                          message: `Target set to ${recommendWeight}kg × 10 reps!`,
                          type: "success",
                        });
                        setTimeout(() => setToast(null), 3000);
                      }}
                      className="w-full mt-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold uppercase tracking-[0.15em] font-mono text-[8px] transition-all cursor-pointer shadow-sm rounded-md text-center"
                    >
                      Apply {recommendWeight}kg Next-Set Target
                    </button>
                  </div>
                )
              )}

              {/* Today's Logged Sets List header */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-black text-gym-accent uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-gym-accent animate-pulse" />{" "}
                  Today's Sets
                </span>
                <span className="text-[8px] text-white/50 font-bold bg-white/10 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  {loggedSetsForThisEx.length}{" "}
                  {loggedSetsForThisEx.length === 1
                    ? "Set"
                    : "Sets"}
                </span>
              </div>

              {/* Sets Log Feed with smooth exit animation */}
              <div className="max-h-36 overflow-y-auto pr-1 flex flex-col">
                <AnimatePresence initial={false}>
                  {loggedSetsForThisEx.map(
                    (set, sIdx) => (
                      <motion.div
                        key={set.id || `temp-${sIdx}`}
                        initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                        animate={{ height: "auto", opacity: 1, marginBottom: 6 }}
                        exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          className="flex items-center justify-between bg-black/55 border border-white/5 px-2.5 py-1.5 rounded-md hover:border-white/15 transition-colors group/setrow"
                        >
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <span className="text-[9px] font-bold text-white/30 tracking-wider">
                              SET {sIdx + 1}
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xs font-semibold text-white/95">
                                {set.weight}
                              </span>
                              <span className="text-[8px] text-white/40">
                                {ex.pool === "cardio"
                                  ? "min"
                                  : "kg"}
                              </span>
                            </div>
                            <span className="text-[9px] text-white/20">
                              ×
                            </span>
                            <div className="flex items-baseline gap-0.5">
                              <span className="text-xs font-semibold text-white/95">
                                {set.reps}
                              </span>
                              <span className="text-[8px] text-white/40">
                                {ex.pool === "cardio"
                                  ? "lvl"
                                  : "reps"}
                              </span>
                            </div>
                            {set.notes && (
                              <span
                                onClick={() => setViewingNote(set.notes)}
                                className="ml-1 px-1.5 py-0.5 bg-gym-accent/11 border border-gym-accent/20 text-gym-accent text-[8px] font-bold rounded-md uppercase tracking-wide truncate max-w-[120px] cursor-pointer hover:bg-gym-accent/30 hover:border-gym-accent/50 transition-all active:scale-95"
                                title="Click to view full note"
                              >
                                {set.notes}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-mono text-white/30 hidden sm:inline">
                              {set.timestamp?.seconds
                                ? new Date(
                                    set.timestamp
                                      .seconds * 1000,
                                  ).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )
                                : "Just now"}
                            </span>
                            <button
                              onClick={() => {
                                if (set.id)
                                  handleDeleteSet(set.id);
                              }}
                              className="p-1 text-red-500/50 hover:text-red-500 hover:bg-neutral-950 rounded transition-colors"
                              title="Delete set"
                            >
                              <Trash2 className="w-2.5 h-2.5 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ),
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })()}

        {/* Historical Peak & Last Logged PR Indicator block */}
        <PBBlock
          exName={ex.name}
          pbs={personalBests}
          sessionSets={sessionSets}
          archivedWorkouts={archivedWorkouts}
        />
      </motion.div>
    );
  };

  const dynamicStyles = {
    "--gym-accent": activeTheme.accent,
    "--gym-accent-light": activeTheme.accentLight,
    "--gym-accent-dark": activeTheme.accentDark,
    "--gym-accent-rgb": activeTheme.accentRgb,
    "--theme-text": activeTheme.testPrimary,
    "--theme-text-muted": activeTheme.testMuted,
    "--theme-text-subtle": activeTheme.testSubtle,
    backgroundColor: activeTheme.bg,
  } as React.CSSProperties;

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden transition-all duration-500"
      style={dynamicStyles}
    >
      <style>{`
        :root {
          --gym-accent: ${activeTheme.accent} !important;
          --gym-accent-light: ${activeTheme.accentLight} !important;
          --gym-accent-dark: ${activeTheme.accentDark} !important;
          --gym-accent-rgb: ${activeTheme.accentRgb} !important;
          --theme-text: ${activeTheme.testPrimary} !important;
          --theme-text-muted: ${activeTheme.testMuted} !important;
          --theme-text-subtle: ${activeTheme.testSubtle} !important;
        }
        @keyframes ecgPulse {
          0% { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0; }
        }
        ${isCarbonBlack ? `
          /* High Contrast Carbon Black Mode overrides */
          body, html, .min-h-screen {
            background-color: #000000 !important;
          }
          .border-white\\/10, .border-white\\/20, .border-white\\/15, .border-white\\/5 {
            border-color: rgba(255, 255, 255, 0.3) !important;
          }
          .bg-black\\/85, .bg-zinc-950, .bg-zinc-900\\/50, .bg-black\\/30, .bg-black\\/50 {
            background-color: #000000 !important;
            border-color: rgba(255, 255, 255, 0.3) !important;
            box-shadow: none !important;
          }
          .text-white\\/50, .text-theme-text-muted, .text-white\\/45 {
            color: rgba(255, 255, 255, 0.75) !important;
          }
          .text-white\\/30, .text-[#ffffff]\\/30 {
            color: rgba(255, 255, 255, 0.5) !important;
          }
          img {
            filter: grayscale(100%) brightness(85%) contrast(115%) !important;
          }
          /* Eliminate any background ambient neon lights and gradients */
          .bg-gradient-to-r, .bg-gradient-to-t, .bg-gradient-to-b, .bg-gradient-to-bl {
            background-image: none !important;
            background-color: #000000 !important;
          }
          /* Custom style for high contrast buttons */
          .bg-gym-accent\\/10 {
            background-color: rgba(255, 255, 255, 0.1) !important;
          }
        ` : ""}
      `}</style>
      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {isCarbonBlack ? (
          <div className="absolute inset-0 bg-[#000000]" />
        ) : activeTheme.isGradient ? (
          <div
            className="absolute inset-0 bg-[#000000]"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 40%, ${activeTheme.accent}20 0%, #000000 100%)`,
            }}
          />
        ) : (
          <>
            <img
              key={activeTheme.id}
              src={activeTheme.bgImage}
              alt="Gym Background"
              className={`w-full h-full object-cover transition-all duration-700 ${getThemeBrightnessClass(activeTheme.id)} ${activeTheme.opacity}`}
              referrerPolicy="no-referrer"
            />
            <div
              className="absolute inset-0 transition-colors duration-500"
              style={{
                background: `linear-gradient(to bottom, ${activeTheme.bg}a0, ${activeTheme.bg}40, ${activeTheme.bg}ff)`,
              }}
            />
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showLandingPage ? (
          <ImmersiveLanding
            key="immersive-landing"
            onEnter={() => setShowLandingPage(false)}
            profile={profile}
            currentUser={currentUser}
            archivedWorkouts={archivedWorkouts}
            currentDays={currentDays}
            activeTheme={activeTheme}
            playRestBeep={playRestBeep}
            sessionSets={sessionSets}
            cnsFatigueAnalysis={cnsFatigueAnalysis}
            syncedProfile={syncedProfile || profile}
            weightHistory={weightHistory}
            volumeData={getVolumeData()}
            setActiveView={setActiveView}
          />
        ) : (
          <motion.div
            key="workspace-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-5xl mx-auto px-6 py-12 pb-32"
          >
        {/* Header */}
        <header className="flex flex-col md:flex-row items-stretch md:items-end justify-between mb-16 gap-6 border-b border-gym-accent/20 pb-10">
          <div className="flex flex-col items-start gap-1 w-full md:w-auto">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gym-accent font-bold self-center md:self-start">
              Premium Session
            </span>
            <h1 className="text-5xl font-light italic font-serif tracking-widest text-theme-text leading-none self-start md:self-start">
              Titan{" "}
              <span className="text-gym-accent accent-glow-strong">Pro</span>
            </h1>
          </div>

          <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto">
            <div className="flex flex-col items-start md:items-end text-left md:text-right">
              <p className="text-[10px] text-theme-text-muted uppercase tracking-widest mb-0.5 flex items-center gap-2 justify-start md:justify-end">
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })}
                <span
                  className={`w-1.5 h-1.5 rounded-full ${firebaseConnected ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500 animate-pulse"}`}
                  title={
                    firebaseConnected
                      ? "Cloud Sync Active"
                      : "Connecting to Cloud..."
                  }
                />
              </p>
              <p className="text-lg font-medium text-theme-text">
                {profile?.displayName || currentUser.displayName || "Athlete"}
              </p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="flex gap-2">
              <button
                onClick={() => setShowLandingPage(true)}
                className="p-2.5 bg-white/5 border border-white/10 rounded-md text-theme-text-muted hover:text-theme-text hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center"
                title="Cinematic Portal"
              >
                <Compass className="w-4 h-4 text-gym-accent" />
              </button>
              <button
                onClick={() => {
                  setActiveView("profile");
                  saveSettings({ activeView: "profile" });
                }}
                className={`p-1 border rounded-full transition-all cursor-pointer flex items-center justify-center overflow-hidden w-10 h-10 ${activeView === "profile" ? "border-gym-accent bg-gym-accent/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}
                title="Profile"
              >
                {profile?.photoURL || currentUser.photoURL ? (
                  <img
                    src={profile?.photoURL || currentUser.photoURL || ""}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-theme-text-muted" />
                )}
              </button>
              <button
                onClick={handleLogout}
                className="p-2.5 bg-white/5 border border-white/10 rounded-md text-theme-text-muted hover:text-theme-text hover:bg-white/10 transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Tabs / Navigation */}
        <nav className="flex items-center mb-12 border-b border-white/10 pb-6 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth w-full">
          <div className="flex items-center gap-3 flex-nowrap w-full pr-8">
            {[
              { id: "console", label: "Console", icon: Terminal },
              { id: "workout", label: "Programming", icon: Workflow },
              { id: "library", label: "Library", icon: BookOpen },
              { id: "progress", label: "Progress", icon: TrendingUp },
              { id: "anatomy", label: "Anatomy", icon: PersonStanding },
              { id: "session", label: "Session", icon: Zap },
              { id: "routines", label: "Routines", icon: Repeat },
              { id: "map", label: "Tactical Map", icon: Compass },
              { id: "gym_locator", label: "Gym Locator", icon: MapPin },
            ].map((nav) => {
              const IconComponent = nav.icon;
              return (
                <button
                  key={nav.id}
                  onClick={() => {
                    setActiveView(nav.id as any);
                    saveSettings({ activeView: nav.id });
                  }}
                  className={`relative p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center shrink-0 select-none ${
                    activeView === nav.id
                      ? "border-gym-accent/30 bg-gym-accent/10 text-gym-accent"
                      : "border-white/5 bg-white/[0.02] text-theme-text-muted hover:text-theme-text hover:bg-white/5 hover:border-white/10"
                  }`}
                  title={nav.label}
                >
                  <IconComponent className="w-5 h-5" />
                  {activeView === nav.id && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-[25px] left-0 right-0 h-0.5 bg-gym-accent accent-shadow-nav"
                    />
                  )}
                </button>
              );
            })}

            {/* Flexible spacer to push Avatar to the right side on desktop while allowing elegant sliding */}
            <div className="flex-grow min-w-[12px] md:min-w-[24px]" />

            {[
              { id: "avatar", label: "Avatar", icon: Crown, isAvatar: true },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => {
                  setActiveView(nav.id as any);
                  saveSettings({ activeView: nav.id });
                }}
                className={`relative p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center shrink-0 select-none mr-2 md:mr-4 ${
                  activeView === nav.id
                    ? "border-gym-accent/30 bg-gym-accent/10 text-gym-accent"
                    : "border-white/5 bg-white/[0.02] text-theme-text-muted hover:text-theme-text hover:bg-white/5 hover:border-white/10"
                }`}
                title={nav.label}
              >
                <Crown className="w-5 h-5" />
                {activeView === nav.id && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-[25px] left-0 right-0 h-0.5 bg-gym-accent accent-shadow-nav"
                  />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="space-y-3">
          <AnimatePresence mode="wait">
            {dataLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center py-20"
              >
                <Loader2 className="w-8 h-8 text-gym-accent animate-spin" />
              </motion.div>
            ) : activeView === "console" ? (
              (() => {
                const level = profile?.avatarLevel ?? 1;
                const xp = profile?.avatarXp ?? 0;
                const credits = profile?.avatarCredits ?? 100000;
                const equippedOutfit =
                  profile?.equippedOutfit ?? "vanguard_cadet";
                const activeOutfit =
                  OUTFITS.find((o) => o.id === equippedOutfit) || OUTFITS[0];
                const equippedTitleId = profile?.equippedTitle ?? "lifter";
                const activeTitleName =
                  TITLES.find((t) => t.id === equippedTitleId)?.name ||
                  "Lifter";

                const getXpNeededForLevel = (lvl: number) => {
                  return lvl * 500 + 2000;
                };
                const xpNeeded = getXpNeededForLevel(level);
                const xpPercentage = Math.min(100, (xp / xpNeeded) * 100);

                const getWorkoutCalories = (w: any) => {
                  if (w.sets && w.sets.length > 0) {
                    return calculateCaloriesBurned(w.sets, profile);
                  }
                  return w.estimatedCalories || w.caloriesBurned || 0;
                };

                const dailyMapConsole: Record<
                  string,
                  { date: string; calories: number; count: number }
                > = {};
                archivedWorkouts.forEach((w) => {
                  const cal = getWorkoutCalories(w);
                  const d = w.date || new Date().toISOString().split("T")[0];
                  if (!dailyMapConsole[d]) {
                    dailyMapConsole[d] = { date: d, calories: 0, count: 0 };
                  }
                  dailyMapConsole[d].calories += cal;
                  dailyMapConsole[d].count += 1;
                });
                const sortedDaysConsole = Object.values(dailyMapConsole).sort(
                  (a, b) => b.date.localeCompare(a.date),
                );
                const chronologicalDaysConsole = [...sortedDaysConsole].sort(
                  (a, b) => a.date.localeCompare(b.date),
                );

                const scrollPopInVariant = {
                  hidden: { opacity: 0, scale: 0.92, y: 30 },
                  show: {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 150,
                      damping: 18,
                      mass: 0.8
                    },
                  },
                };

                const cardVariants = {
                  hidden: { opacity: 0, y: 15 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 260,
                      damping: 24,
                    },
                  },
                };

                return (
                  <motion.div
                    key="console-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-16 pb-16 animate-fade-in"
                  >
                    {/* Minimalist Ultra-Sleek Header */}
                    <div className="flex flex-row items-center justify-between border-b border-white/[0.03] pb-4 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gym-accent animate-pulse" />
                          <span className="text-[9px] text-gym-accent uppercase tracking-[0.4em] font-black font-mono">
                            TITAN METRIC SYSTEM
                          </span>
                        </div>
                      </div>
                    </div>



                    {/* Section 1: Biomechanical Balance & Anatomy Mapped Side-by-Side */}
                    <motion.div
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: false, margin: "-80px" }}
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.08,
                          },
                        },
                      }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
                    >
                      {/* Physiological Simulation Panel */}
                      <motion.div 
                        variants={scrollPopInVariant}
                        className="lg:col-span-8 bg-gradient-to-b from-[#090909] to-[#040404] border border-white/[0.04] rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-all duration-300"
                      >
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        
                        <div className="space-y-1 mb-6">
                          <span className="text-[9px] font-mono text-gym-accent uppercase tracking-widest font-black">
                            RECONSTRUCTED BIOMETRICS
                          </span>
                          <h3 className="text-2xl font-light tracking-tight text-white font-sans">
                            Physical <span className="font-serif italic font-light text-gym-accent">Symmetry</span>
                          </h3>
                          <p className="text-xs text-white/40 max-w-md leading-relaxed">
                            Dynamic load mapping and active physical recruitment ratios computed from your history.
                          </p>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-4">
                          <div 
                            className="flex items-center justify-center cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                            onClick={() => setActiveView("anatomy")}
                          >
                            <AnatomyChart
                               sets={sessionSets}
                               archivedWorkouts={archivedWorkouts}
                               compact={true}
                            />
                          </div>
                          <div 
                            className="flex items-center justify-center cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                            onClick={() => setActiveView("progress")}
                          >
                            <RadarChart
                               sessionSets={sessionSets}
                               archivedWorkouts={archivedWorkouts}
                               size={280}
                            />
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/[0.03] flex items-center justify-between text-[10px] text-white/30 font-mono">
                          <span>ACTIVE SETS DETECTED: {sessionSets.length}</span>
                          <button 
                            onClick={() => setActiveView("anatomy")}
                            className="text-gym-accent hover:text-white transition-colors uppercase tracking-wider font-bold"
                          >
                            DETAILED DIAGNOSTIC &rarr;
                          </button>
                        </div>
                      </motion.div>

                      {/* Training Agenda Mapped */}
                      <motion.div 
                        variants={scrollPopInVariant}
                        onClick={() => setActiveView("workout")}
                        className="lg:col-span-4 bg-gradient-to-b from-[#090909] to-[#040404] border border-white/[0.04] rounded-xl p-8 flex flex-col justify-between cursor-pointer hover:border-white/10 transition-all duration-300"
                      >
                        <div className="space-y-1 mb-6">
                          <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest font-black">
                            ROUTINE TIMELINE
                          </span>
                          <h3 className="text-2xl font-light tracking-tight text-white font-sans">
                            Upcoming <span className="font-serif italic font-light">Agenda</span>
                          </h3>
                          <p className="text-xs text-white/40">
                            Lifting schedule built around programmed kinetic clusters.
                          </p>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[220px] no-scrollbar space-y-4 pr-1">
                          {(() => {
                            const daysWithData = DAY_CONFIG.map((day, di) => ({
                              day,
                              di,
                              exercises: currentDays[di] || [],
                            })).filter((d) => d.exercises.length > 0);

                            if (daysWithData.length === 0) {
                              return (
                                <div className="h-full flex flex-col items-center justify-center py-8 text-center space-y-2">
                                  <Dumbbell className="w-6 h-6 text-white/10" />
                                  <p className="text-white/30 font-serif italic text-xs">
                                    No active routine mapped.
                                  </p>
                                </div>
                              );
                            }

                            return (
                              <div className="space-y-4">
                                {daysWithData.map(({ day, di, exercises }) => (
                                  <div key={di} className="border-l border-gym-accent/30 pl-3.5 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[8px] font-mono text-gym-accent uppercase tracking-widest font-black">
                                        DAY {day.label}
                                      </span>
                                      <span className="text-[10px] font-medium text-white/80">
                                        {day.name}
                                      </span>
                                    </div>
                                    <div className="space-y-1.5">
                                      {exercises.map((ex, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-xs text-white/60">
                                          <span className="font-light truncate max-w-[140px]">{ex.name}</span>
                                          <span className="text-[7px] font-mono text-white/30 tracking-wider uppercase font-black px-1.5 py-0.5 bg-white/[0.02] border border-white/[0.05] rounded">
                                            {ex.pool || "Target"}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/[0.03] flex items-center justify-between text-[10px] text-white/30 font-mono">
                          <span>NEXT SESSION PENDING</span>
                          <span className="text-gym-accent uppercase tracking-wider font-bold">CONFIGURE &rarr;</span>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Spinal Depletion & CNS Fatigue Gauge widget */}
                    <motion.div 
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: false, margin: "-60px" }}
                      variants={scrollPopInVariant}
                      className="cursor-pointer" 
                      onClick={() => setActiveView("progress")}
                    >
                      <SpinalDepletionWidget
                        cnsFatigueAnalysis={cnsFatigueAnalysis}
                        setActiveView={setActiveView}
                      />
                    </motion.div>

                    {/* Section 2: Performance Dynamism (Trends Grid) */}
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest font-black">
                          PERFORMANCE DYNAMICS
                        </span>
                        <h3 className="text-2xl font-light tracking-tight text-white font-sans">
                          Metric <span className="font-serif italic font-light text-gym-accent">Trends</span>
                        </h3>
                      </div>

                      <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, margin: "-80px" }}
                        variants={{
                          hidden: { opacity: 0 },
                          show: {
                            opacity: 1,
                            transition: {
                              staggerChildren: 0.08,
                            },
                          },
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                      >
                        {/* Graph 1: Weight Trend */}
                        <motion.div
                          variants={scrollPopInVariant}
                          onClick={() => setActiveView("profile")}
                          className="bg-gradient-to-b from-[#090909] to-[#040404] border border-white/[0.04] hover:border-white/10 rounded-xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300"
                        >
                          <div className="mb-6 flex justify-between items-start">
                            <div>
                              <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest font-black">
                                BODYWEIGHT
                              </span>
                              <h4 className="text-base font-light text-white mt-1">Weight Density</h4>
                            </div>
                            <span className="text-lg font-mono font-bold text-gym-accent">
                              {syncedProfile?.bodyweight
                                ? `${syncedProfile.bodyweight} KG`
                                : "N/A"}
                            </span>
                          </div>

                          <div className="h-[120px] w-full">
                            {weightHistory.length === 0 ? (
                              <div className="h-full flex flex-col items-center justify-center bg-white/[0.01] rounded-lg border border-dashed border-white/[0.05]">
                                <TrendingUp className="w-4 h-4 text-white/10 mb-1" />
                                <span className="text-[9px] text-white/20 font-bold">No weight logs</span>
                              </div>
                            ) : (
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                  data={(() => {
                                    const grouped = weightHistory.reduce(
                                      (acc, entry) => {
                                        acc[entry.date] = entry;
                                        return acc;
                                      },
                                      {} as Record<string, WeightEntry>,
                                    );
                                    return (
                                      Object.values(grouped) as WeightEntry[]
                                    ).sort(
                                      (a, b) =>
                                        new Date(a.date).getTime() -
                                        new Date(b.date).getTime(),
                                    );
                                  })()}
                                  margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                                >
                                  <defs>
                                    <linearGradient id="colorWeightConsole" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor={activeTheme.accent} stopOpacity={0.15} />
                                      <stop offset="95%" stopColor={activeTheme.accent} stopOpacity={0} />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                                  <XAxis dataKey="date" stroke="#ffffff10" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.2)" }} />
                                  <YAxis stroke="#ffffff10" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.2)" }} domain={["dataMin - 2", "dataMax + 2"]} />
                                  <Area
                                    type="monotonous"
                                    dataKey="weight"
                                    stroke={activeTheme.accent}
                                    strokeWidth={1.5}
                                    fillOpacity={1}
                                    fill="url(#colorWeightConsole)"
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            )}
                          </div>
                        </motion.div>

                        {/* Graph 2: Volume Trend */}
                        <motion.div
                          variants={scrollPopInVariant}
                          onClick={() => setActiveView("progress")}
                          className="bg-gradient-to-b from-[#090909] to-[#040404] border border-white/[0.04] hover:border-white/10 rounded-xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300"
                        >
                          <div className="mb-6 flex justify-between items-start">
                            <div>
                              <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest font-black">
                                OUTPUT
                              </span>
                              <h4 className="text-base font-light text-white mt-1">Lifting Volume</h4>
                            </div>
                            <span className="text-lg font-mono font-bold text-gym-accent">
                              {archivedWorkouts.length > 0
                                ? `${Math.round(archivedWorkouts.reduce((acc, w) => acc + (w.totalVolume || 0), 0) / archivedWorkouts.length)} KG`
                                : "0 KG"}
                            </span>
                          </div>

                          <div className="h-[120px] w-full">
                            {archivedWorkouts.length === 0 ? (
                              <div className="h-full flex flex-col items-center justify-center bg-white/[0.01] rounded-lg border border-dashed border-white/[0.05]">
                                <Activity className="w-4 h-4 text-white/10 mb-1" />
                                <span className="text-[9px] text-white/20 font-bold">No volume logs</span>
                              </div>
                            ) : (
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                  data={getVolumeData()}
                                  margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                                >
                                  <defs>
                                    <linearGradient id="colorVolumeConsole" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor={activeTheme.accent} stopOpacity={0.15} />
                                      <stop offset="95%" stopColor={activeTheme.accent} stopOpacity={0} />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                                  <XAxis dataKey="date" stroke="#ffffff10" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.2)" }} />
                                  <YAxis stroke="#ffffff10" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.2)" }} />
                                  <Area
                                    type="monotonous"
                                    dataKey="volume"
                                    stroke={activeTheme.accent}
                                    strokeWidth={1.5}
                                    fillOpacity={1}
                                    fill="url(#colorVolumeConsole)"
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            )}
                          </div>
                        </motion.div>

                        {/* Graph 3: Calorie Outflow Trend */}
                        <motion.div
                          variants={scrollPopInVariant}
                          onClick={() => setActiveView("progress")}
                          className="bg-gradient-to-b from-[#090909] to-[#040404] border border-white/[0.04] hover:border-white/10 rounded-xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300"
                        >
                          <div className="mb-6 flex justify-between items-start">
                            <div>
                              <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest font-black">
                                METABOLIC
                              </span>
                              <h4 className="text-base font-light text-white mt-1">Energy Burnout</h4>
                            </div>
                            <span className="text-lg font-mono font-bold text-gym-accent">
                              {archivedWorkouts.length > 0
                                ? `${Math.round(archivedWorkouts.reduce((sum, w) => sum + getWorkoutCalories(w), 0))} KCAL`
                                : "0 KCAL"}
                            </span>
                          </div>

                          <div className="h-[120px] w-full">
                            {chronologicalDaysConsole.length === 0 ? (
                              <div className="h-full flex flex-col items-center justify-center bg-white/[0.01] rounded-lg border border-dashed border-white/[0.05]">
                                <Flame className="w-4 h-4 text-white/10 mb-1" />
                                <span className="text-[9px] text-white/20 font-bold">No calorie logs</span>
                              </div>
                            ) : (
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                  data={chronologicalDaysConsole}
                                  margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                                >
                                  <defs>
                                    <linearGradient id="colorCalorieConsole" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor={activeTheme.accent} stopOpacity={0.15} />
                                      <stop offset="95%" stopColor={activeTheme.accent} stopOpacity={0} />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                                  <XAxis dataKey="date" stroke="#ffffff10" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.2)" }} />
                                  <YAxis stroke="#ffffff10" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.2)" }} />
                                  <Area
                                    type="monotonous"
                                    dataKey="calories"
                                    stroke={activeTheme.accent}
                                    strokeWidth={1.5}
                                    fillOpacity={1}
                                    fill="url(#colorCalorieConsole)"
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    </div>


                  </motion.div>
                );
              })()
            ) : activeView === "library" ? (
              <motion.div
                key="library"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="pb-12"
              >
                <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-white/5 pb-8 text-left">
                  <div>
                    <h3 className="text-xl font-light italic font-serif flex items-center gap-3 mb-1">
                      Exercise Archive
                    </h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold font-mono">
                      Tactical Fitness & Drill Hub
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 self-stretch xl:self-auto">
                    {/* View Mode Switcher */}
                    <div className="flex bg-black/60 border border-white/10 rounded-md p-1 inline-flex self-start sm:self-auto">
                      <button
                        onClick={() => setLibraryViewMode("deck")}
                        className={`flex items-center gap-2 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-md cursor-pointer ${libraryViewMode === "deck" ? "bg-gym-accent text-black font-black" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        Visual Deck
                      </button>
                      <button
                        onClick={() => setLibraryViewMode("list")}
                        className={`flex items-center gap-2 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-md cursor-pointer ${libraryViewMode === "list" ? "bg-gym-accent text-black font-black" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                      >
                        <List className="w-3.5 h-3.5" />
                        Classic List
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setCustomExName("");
                        setCustomExVideoUrl("");
                        setCustomGuidanceSteps([]);
                        setGuidanceStepInput("");
                        setCustomExPool("upper_chest");
                        setCustomExCategory("compound");
                        setShowAddCustomModal(true);
                      }}
                      className="flex items-center justify-center gap-2 px-5 py-3 border border-gym-accent/30 bg-gym-accent/5 hover:bg-gym-accent hover:text-black text-gym-accent rounded-[1px] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Custom
                    </button>

                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type="text"
                        placeholder="Search archive..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-black/60 border border-white/20 rounded-md pl-11 pr-4 py-3 text-sm font-light focus:outline-none focus:border-gym-accent transition-all w-full sm:w-64 text-white font-mono"
                      />
                      <div className="absolute top-full right-0 mt-2">
                        <a
                          href="https://www.puregym.com/exercises/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] text-gym-accent/60 hover:text-gym-accent uppercase tracking-[0.2em] font-bold transition-colors flex items-center gap-2"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          Official PureGym Guides
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Category Deck Selectors for Deck Mode */}
                {libraryViewMode === "deck" && !searchQuery && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8 text-left">
                    {[
                      {
                        key: "chest",
                        label: "Chest",
                        icon: Crown,
                        desc: "Chest Compound Lifts",
                      },
                      {
                        key: "triceps",
                        label: "Triceps",
                        icon: Crown,
                        desc: "Elbow Pushdowns & Extensions",
                      },
                      {
                        key: "back",
                        label: "Back",
                        icon: ArrowUpDown,
                        desc: "Lats, Rows & Pulls",
                      },
                      {
                        key: "biceps",
                        label: "Biceps",
                        icon: ArrowUpDown,
                        desc: "Arm Flexion & Pulldowns",
                      },
                      {
                        key: "shoulders",
                        label: "Shoulders",
                        icon: Target,
                        desc: "Delts & Broad Support",
                      },
                      {
                        key: "forearms",
                        label: "Forearms",
                        icon: Target,
                        desc: "Grip & Wrist Strength",
                      },
                      {
                        key: "legs",
                        label: "Legs",
                        icon: ArrowDown,
                        desc: "Quads, Calves & Glutes",
                      },
                      {
                        key: "core",
                        label: "Core",
                        icon: ArrowDown,
                        desc: "Abs & Rigid Bracing",
                      },
                      {
                        key: "cardio",
                        label: "Cardio",
                        icon: Flame,
                        desc: "Heart Rate & Conditioning",
                      },
                      {
                        key: "equipment",
                        label: "Equipment",
                        icon: Sliders,
                        desc: "Cables, Bands & Setups",
                      },
                    ].map((sec) => {
                      const MetaIcon = sec.icon;
                      const isActive = selectedLibraryCategory === sec.key;
                      let listCount = 0;
                      if (sec.key === "chest") {
                        listCount =
                          (combinedPools["upper_chest"]?.length || 0) +
                          (combinedPools["middle_chest"]?.length || 0) +
                          (combinedPools["lower_chest"]?.length || 0);
                      } else if (sec.key === "back") {
                        listCount =
                          (combinedPools["upper_back"]?.length || 0) +
                          (combinedPools["lower_back"]?.length || 0);
                      } else if (sec.key === "shoulders") {
                        listCount =
                          (combinedPools["front_delts"]?.length || 0) +
                          (combinedPools["side_delts"]?.length || 0) +
                          (combinedPools["rear_delts"]?.length || 0);
                      } else if (sec.key === "biceps") {
                        listCount =
                          (combinedPools["long_biceps"]?.length || 0) +
                          (combinedPools["short_biceps"]?.length || 0) +
                          (combinedPools["brachialis"]?.length || 0);
                      } else if (sec.key === "triceps") {
                        listCount =
                          (combinedPools["long_triceps"]?.length || 0) +
                          (combinedPools["lateral_triceps"]?.length || 0) +
                          (combinedPools["medial_triceps"]?.length || 0);
                      } else if (sec.key === "legs") {
                        listCount =
                          (combinedPools["quads"]?.length || 0) +
                          (combinedPools["hamstrings"]?.length || 0) +
                          (combinedPools["calves"]?.length || 0);
                      } else if (sec.key === "core") {
                        listCount =
                          (combinedPools["upper_core"]?.length || 0) +
                          (combinedPools["lower_core"]?.length || 0) +
                          (combinedPools["obliques"]?.length || 0);
                      } else {
                        listCount = combinedPools[sec.key]?.length || 0;
                      }

                      return (
                        <button
                          key={sec.key}
                          onClick={() => setSelectedLibraryCategory(sec.key)}
                          className={`text-left p-4 rounded-md border cursor-pointer transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-28 ${
                            isActive
                              ? "bg-black/90"
                              : "bg-black/40 border-white/10 hover:border-white/30 hover:bg-black/60"
                          }`}
                          style={
                            isActive
                              ? {
                                  borderColor: `rgba(${activeTheme.accentRgb}, 0.4)`,
                                  backgroundImage: `linear-gradient(to bottom right, rgba(${activeTheme.accentRgb}, 0.12), transparent)`,
                                  boxShadow: `0 0 15px rgba(${activeTheme.accentRgb}, 0.18)`,
                                }
                              : undefined
                          }
                        >
                          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-white/[0.015] to-transparent pointer-events-none" />

                          <div className="flex items-start justify-between">
                            <div
                              className={`w-8 h-8 rounded-md flex items-center justify-center border transition-all ${
                                isActive
                                  ? ""
                                  : "bg-white/5 border-white/10 text-white/45 group-hover:text-white"
                              }`}
                              style={
                                isActive
                                  ? {
                                      backgroundColor: `rgba(${activeTheme.accentRgb}, 0.1)`,
                                      borderColor: `rgba(${activeTheme.accentRgb}, 0.3)`,
                                      color: activeTheme.accent,
                                    }
                                  : undefined
                              }
                            >
                              <MetaIcon className="w-4 h-4" />
                            </div>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider transition-all ${
                                isActive
                                  ? "font-black"
                                  : "bg-white/10 text-white/50 font-bold"
                              }`}
                              style={
                                isActive
                                  ? {
                                      backgroundColor: `rgba(${activeTheme.accentRgb}, 0.2)`,
                                      color: activeTheme.accent,
                                    }
                                  : undefined
                              }
                            >
                              {listCount}
                            </span>
                          </div>

                          <div className="mt-auto">
                            <h4
                              className={`text-xs font-bold uppercase tracking-wider ${isActive ? "text-white" : "text-white/70 group-hover:text-white"}`}
                            >
                              {sec.label}
                            </h4>
                            <p className="text-[8px] text-white/40 tracking-wider font-light mt-0.5 truncate leading-none font-mono">
                              {sec.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="h-6" />

                {(() => {
                  const categoryOrder = [
                    "chest",
                    "back",
                    "shoulders",
                    "legs",
                    "biceps",
                    "triceps",
                    "forearms",
                    "core",
                    "cardio",
                    "equipment",
                  ];
                  const sectionsList = categoryOrder.map((catKey) => {
                    let list: Exercise[] = [];
                    if (catKey === "chest") {
                      list = [
                        ...(combinedPools["upper_chest"] || []),
                        ...(combinedPools["middle_chest"] || []),
                        ...(combinedPools["lower_chest"] || []),
                      ];
                    } else if (catKey === "back") {
                      list = [
                        ...(combinedPools["upper_back"] || []),
                        ...(combinedPools["lower_back"] || []),
                      ];
                    } else if (catKey === "shoulders") {
                      list = [
                        ...(combinedPools["front_delts"] || []),
                        ...(combinedPools["side_delts"] || []),
                        ...(combinedPools["rear_delts"] || []),
                      ];
                    } else if (catKey === "biceps") {
                      list = [
                        ...(combinedPools["long_biceps"] || []),
                        ...(combinedPools["short_biceps"] || []),
                        ...(combinedPools["brachialis"] || []),
                      ];
                    } else if (catKey === "triceps") {
                      list = [
                        ...(combinedPools["long_triceps"] || []),
                        ...(combinedPools["lateral_triceps"] || []),
                        ...(combinedPools["medial_triceps"] || []),
                      ];
                    } else if (catKey === "legs") {
                      list = [
                        ...(combinedPools["quads"] || []),
                        ...(combinedPools["hamstrings"] || []),
                        ...(combinedPools["calves"] || []),
                      ];
                    } else if (catKey === "core") {
                      list = [
                        ...(combinedPools["upper_core"] || []),
                        ...(combinedPools["lower_core"] || []),
                        ...(combinedPools["obliques"] || []),
                      ];
                    } else {
                      list = combinedPools[catKey] || [];
                    }

                    let filteredList = list.filter(
                      (ex) =>
                        ex.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        ex.pool
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        (ex.category &&
                          ex.category
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())),
                    );

                    return {
                      key: catKey,
                      title: catKey.charAt(0).toUpperCase() + catKey.slice(1),
                      list: filteredList.sort((a, b) => a.name.localeCompare(b.name)),
                    };
                  });

                  if (
                    searchQuery.trim().length > 0 ||
                    libraryViewMode === "list"
                  ) {
                    return sectionsList.filter((s) => s.list.length > 0);
                  } else {
                    return sectionsList.filter(
                      (s) => s.key === selectedLibraryCategory,
                    );
                  }
                })().map((section) => (
                  <div
                    key={section.title}
                    className={`mb-6 border border-white/15 rounded-md overflow-hidden bg-black/70 backdrop-blur-md ${libraryViewMode === "deck" && !searchQuery ? "p-2" : ""}`}
                  >
                    {libraryViewMode === "deck" && !searchQuery ? (
                      <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-white/5 mb-4 text-left">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-gym-accent animate-pulse" />
                          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80 font-mono">
                            {section.title} Registry (Showing{" "}
                            {section.list.length} Exercises)
                          </h3>
                        </div>
                        <span className="text-[9px] text-white/30 tracking-widest uppercase font-bold font-mono">
                          Archive Deck v2.5
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          setExpandedLibrarySections((prev) => ({
                            ...prev,
                            [section.title]: !prev[section.title],
                          }))
                        }
                        className="w-full text-left p-6 flex items-center justify-between hover:bg-white/[0.04] transition-all cursor-pointer group backdrop-blur-md"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-md bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center shrink-0 text-gym-accent group-hover:bg-gym-accent/20 group-hover:border-gym-accent/40 transition-all">
                            {getLibraryCategoryIcon(section.key)}
                          </div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-light italic font-serif text-white/90">
                              {section.title}
                            </h3>
                            <span className="text-[9px] text-white/10 px-2 py-0.5 border border-white/5 rounded-full uppercase tabular-nums">
                              {section.list.length} Ex.
                            </span>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-white/20 group-hover:text-gym-accent transition-all ${expandedLibrarySections[section.title] ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}

                    <AnimatePresence>
                      {(expandedLibrarySections[section.title] ||
                        (libraryViewMode === "deck" && !searchQuery)) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-8 pt-2">
                            {(() => {
                              const renderCard = (ex: Exercise) => {
                                const Icon = iconMap[ex.icon] || Dumbbell;
                                const isCustom = customExercises.some(
                                  (ce) => ce.name.toLowerCase() === ex.name.toLowerCase()
                                );
                                return (
                                  <div
                                    key={ex.name}
                                    className="bg-black/60 border border-white/10 rounded-md p-5 hover:border-white/35 transition-all group flex flex-col justify-between"
                                  >
                                    <div>
                                      {/* Title Row - full width, wraps nicely, no truncation cutoff */}
                                      <div className="flex items-start justify-between gap-3 mb-2.5">
                                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                          <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-md flex items-center justify-center shrink-0 mt-0.5 group-hover:border-gym-accent/30 transition-colors">
                                            <Icon className="w-4 h-4 text-white/30 group-hover:text-gym-accent transition-colors" />
                                          </div>
                                          <div className="flex flex-col min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                              <span className="font-semibold text-sm text-white/95 group-hover:text-white transition-colors leading-snug break-words">
                                                {ex.name}
                                              </span>
                                              <button
                                                onClick={() => toggleFavoriteExercise(ex.name)}
                                                className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer shrink-0"
                                                title={favoriteExercises.includes(ex.name) ? "Remove from Favorites" : "Add to Favorites"}
                                              >
                                                <Star
                                                  className={`w-3.5 h-3.5 transition-colors ${
                                                    favoriteExercises.includes(ex.name)
                                                      ? "text-amber-400 fill-amber-400"
                                                      : "text-white/20 hover:text-white/60"
                                                  }`}
                                                />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                        {isCustom && (
                                          <button
                                            onClick={() =>
                                              handlePermanentlyDeleteCustomExercise(
                                                ex.name,
                                              )
                                            }
                                            className="px-2 py-1 rounded-[1px] border border-red-500/35 bg-red-950/15 hover:bg-red-600 hover:text-white text-red-400 text-[8px] font-extrabold uppercase tracking-widest transition-all cursor-pointer shrink-0"
                                            title="Permanently Delete Movement"
                                          >
                                            Delete
                                          </button>
                                        )}
                                      </div>

                                      {/* Badges Row - separated below the title */}
                                      <div className="flex items-center gap-2 mb-3.5 ml-10 flex-wrap">
                                        {ex.category && (
                                          <span
                                            className={`text-[8px] px-1.5 py-0.2 rounded-md font-black uppercase tracking-widest ${
                                              ex.category === "compound"
                                                ? "bg-amber-500/10 text-amber-500/80 border border-amber-500/20"
                                                : "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                                            }`}
                                          >
                                            {ex.category}
                                          </span>
                                        )}
                                        {ex.pool && (
                                          <span className="text-[7.5px] font-mono uppercase tracking-widest px-1.5 py-0.3 rounded-md border border-white/5 text-white/30 bg-white/[0.01]">
                                            {ex.pool}
                                          </span>
                                        )}
                                      </div>

                                      {/* Dedicated Sparkline and Trend Panel */}
                                      <div className="ml-10 mb-2">
                                        <Sparkline
                                          exName={ex.name}
                                          sessionSets={sessionSets}
                                          archivedWorkouts={archivedWorkouts}
                                          width={75}
                                          height={16}
                                        />
                                        <AnimatePresence>
                                          {flashMessage[ex.name] && (
                                            <motion.span
                                              initial={{
                                                opacity: 0,
                                                scale: 0.8,
                                              }}
                                              animate={{
                                                opacity: 1,
                                                scale: 1,
                                              }}
                                              exit={{
                                                opacity: 0,
                                                scale: 0.8,
                                              }}
                                              className="text-[8px] font-bold text-gym-accent uppercase tracking-widest ml-1 animate-pulse block mt-1"
                                            >
                                              {flashMessage[ex.name]}
                                            </motion.span>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    </div>

                                    {/* Action buttons row */}
                                    <div className="flex items-center gap-2 mt-4 pt-1">
                                      <button
                                        onClick={() => setGuidanceEx(ex)}
                                        className="p-2.5 px-3.5 bg-white/5 border border-white/10 text-white/60 hover:text-gym-accent hover:border-gym-accent/30 hover:bg-gym-accent/5 transition-all text-[9.5px] tracking-wider uppercase font-extrabold rounded-md flex items-center justify-center gap-1.5 cursor-pointer basis-1/3"
                                        title="Guidance & Execution Instructions"
                                      >
                                        <BookOpen className="w-3.5 h-3.5" />
                                        <span>Guidance</span>
                                      </button>
                                      
                                      <button
                                        onClick={() => {
                                          setLoggingEx(ex);
                                          setPopupWeight("");
                                          setPopupReps("");
                                          setPopupNotes("");
                                          setPopupDifficulty("moderate");
                                        }}
                                        className="p-2.5 bg-gym-accent hover:bg-gym-accent/95 text-black text-[9.5px] uppercase font-black tracking-widest transition-all rounded-md flex-1 flex items-center justify-center gap-1.5 font-mono cursor-pointer shadow-md shadow-gym-accent/10 active:scale-[0.98]"
                                        title="Log a new completed set"
                                      >
                                        <Plus className="w-3.5 h-3.5 text-black stroke-[3px]" />
                                        <span>Log Set</span>
                                      </button>
                                    </div>
                                  </div>
                                );
                              };

                              if (section.key === "back") {
                                return (
                                  <div className="space-y-8 w-full">
                                    {/* Lats Subsegment */}
                                    {(() => {
                                      const latsLines = section.list.filter(
                                        (e) => e.muscleGroup === "lats",
                                      );
                                      if (latsLines.length === 0) return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-gym-accent rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Latissimus Dorsi (Lats)
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {latsLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Rhomboids & Traps Subsegment */}
                                    {(() => {
                                      const rhomboidsTrapsLines =
                                        section.list.filter(
                                          (e) =>
                                            e.muscleGroup === "rhomboids_traps",
                                        );
                                      if (rhomboidsTrapsLines.length === 0)
                                        return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-sky-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Rhomboids & Traps (Upper/Mid Back)
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {rhomboidsTrapsLines.map(
                                              renderCard,
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Lower Back Subsegment */}
                                    {(() => {
                                      const lowerBackLines =
                                        section.list.filter(
                                          (e) =>
                                            e.muscleGroup ===
                                              "erector_spinae" ||
                                            e.pool === "lower_back",
                                        );
                                      if (lowerBackLines.length === 0)
                                        return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-red-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Erector Spinae (Lower Back)
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {lowerBackLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                );
                              }

                              if (section.key === "shoulders") {
                                return (
                                  <div className="space-y-8 w-full">
                                    {/* Front Delts Subsegment */}
                                    {(() => {
                                      const frontLines = section.list.filter(
                                        (e) => e.pool === "front_delts",
                                      );
                                      if (frontLines.length === 0) return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-teal-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Front Delts (Anterior Head)
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {frontLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Side Delts Subsegment */}
                                    {(() => {
                                      const sideLines = section.list.filter(
                                        (e) => e.pool === "side_delts",
                                      );
                                      if (sideLines.length === 0) return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-blue-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Side Delts (Lateral Head)
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {sideLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Rear Delts Subsegment */}
                                    {(() => {
                                      const rearLines = section.list.filter(
                                        (e) => e.pool === "rear_delts",
                                      );
                                      if (rearLines.length === 0) return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-pink-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Rear Delts (Posterior Head)
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {rearLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                );
                              }

                              if (section.key === "core") {
                                return (
                                  <div className="space-y-8 w-full">
                                    {/* Upper Abs Subsegment */}
                                    {(() => {
                                      const upperLines = section.list.filter(
                                        (e) => e.pool === "upper_core",
                                      );
                                      if (upperLines.length === 0) return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-emerald-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Upper Abs
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {upperLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Lower Abs Subsegment */}
                                    {(() => {
                                      const lowerLines = section.list.filter(
                                        (e) => e.pool === "lower_core",
                                      );
                                      if (lowerLines.length === 0) return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-violet-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Lower Abs
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {lowerLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Obliques Subsegment */}
                                    {(() => {
                                      const obliquesLines = section.list.filter(
                                        (e) => e.pool === "obliques",
                                      );
                                      if (obliquesLines.length === 0)
                                        return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-amber-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Obliques
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {obliquesLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                );
                              }

                              if (section.key === "chest") {
                                return (
                                  <div className="space-y-8 w-full">
                                    {/* Upper Chest Subsegment */}
                                    {(() => {
                                      const upperLines = section.list.filter(
                                        (e) => e.pool === "upper_chest",
                                      );
                                      if (upperLines.length === 0) return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-red-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Upper Chest
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {upperLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Middle Chest Subsegment */}
                                    {(() => {
                                      const middleLines = section.list.filter(
                                        (e) => e.pool === "middle_chest",
                                      );
                                      if (middleLines.length === 0) return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-teal-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Middle Chest / General
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {middleLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Lower Chest Subsegment */}
                                    {(() => {
                                      const lowerLines = section.list.filter(
                                        (e) => e.pool === "lower_chest",
                                      );
                                      if (lowerLines.length === 0) return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-blue-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Lower Chest
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {lowerLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                );
                              }

                              if (section.key === "biceps") {
                                return (
                                  <div className="space-y-8 w-full">
                                    {/* Long Head Biceps Subsegment */}
                                    {(() => {
                                      const longLines = section.list.filter(
                                        (e) => e.pool === "long_biceps",
                                      );
                                      if (longLines.length === 0) return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-pink-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Long Head
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {longLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Short Head Biceps Subsegment */}
                                    {(() => {
                                      const shortLines = section.list.filter(
                                        (e) => e.pool === "short_biceps",
                                      );
                                      if (shortLines.length === 0) return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-emerald-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Short Head
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {shortLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Brachialis Subsegment */}
                                    {(() => {
                                      const brachialisLines =
                                        section.list.filter(
                                          (e) => e.pool === "brachialis",
                                        );
                                      if (brachialisLines.length === 0)
                                        return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-violet-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Brachialis
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {brachialisLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                );
                              }

                              if (section.key === "triceps") {
                                return (
                                  <div className="space-y-8 w-full">
                                    {/* Long Head Triceps Subsegment */}
                                    {(() => {
                                      const longLines = section.list.filter(
                                        (e) => e.pool === "long_triceps",
                                      );
                                      if (longLines.length === 0) return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-amber-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Long Head
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {longLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Lateral Head Triceps Subsegment */}
                                    {(() => {
                                      const lateralLines = section.list.filter(
                                        (e) => e.pool === "lateral_triceps",
                                      );
                                      if (lateralLines.length === 0)
                                        return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-teal-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Lateral Head
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {lateralLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Medial Head Triceps Subsegment */}
                                    {(() => {
                                      const medialLines = section.list.filter(
                                        (e) => e.pool === "medial_triceps",
                                      );
                                      if (medialLines.length === 0) return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-sky-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Medial Head / Compound
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {medialLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                );
                              }

                              if (section.key === "legs") {
                                return (
                                  <div className="space-y-8 w-full">
                                    {/* Quads Subsegment */}
                                    {(() => {
                                      const quadsLines = section.list.filter(
                                        (e) => e.muscleGroup === "quads",
                                      );
                                      if (quadsLines.length === 0) return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-emerald-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Quadriceps (Quads)
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {quadsLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Hamstrings Subsegment */}
                                    {(() => {
                                      const hamstringsLines =
                                        section.list.filter(
                                          (e) => e.muscleGroup === "hamstrings",
                                        );
                                      if (hamstringsLines.length === 0)
                                        return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-red-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Hamstrings (Ischiocrural)
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {hamstringsLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Glutes & Hips Subsegment */}
                                    {(() => {
                                      const glutesLines = section.list.filter(
                                        (e) => e.muscleGroup === "glutes",
                                      );
                                      if (glutesLines.length === 0) return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-blue-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Glutes & Posterior Chain
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {glutesLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Calves Subsegment */}
                                    {(() => {
                                      const calvesLines = section.list.filter(
                                        (e) => e.muscleGroup === "calves",
                                      );
                                      if (calvesLines.length === 0) return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-amber-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Calves (Lower Leg)
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {calvesLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* General/Other leg exercises */}
                                    {(() => {
                                      const otherLegLines = section.list.filter(
                                        (e) =>
                                          e.muscleGroup !== "quads" &&
                                          e.muscleGroup !== "hamstrings" &&
                                          e.muscleGroup !== "glutes" &&
                                          e.muscleGroup !== "calves",
                                      );
                                      if (otherLegLines.length === 0)
                                        return null;
                                      return (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div className="w-1.5 h-3 bg-teal-500 rounded-[1px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              Other Leg Exercises
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {otherLegLines.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                );
                              }

                              if (section.key === "equipment") {
                                const eqCategories = [
                                  "Kettlebells",
                                  "TRX",
                                  "Battle Ropes",
                                  "Resistance Bands",
                                  "Weight Plates",
                                  "Slam Balls",
                                  "Plyo Boxes",
                                  "Bosu Balls",
                                  "Sleds",
                                  "Other",
                                ];
                                const colors = [
                                  "bg-red-500",
                                  "bg-blue-500",
                                  "bg-teal-500",
                                  "bg-amber-500",
                                  "bg-emerald-500",
                                  "bg-pink-500",
                                  "bg-purple-500",
                                  "bg-violet-500",
                                  "bg-sky-500",
                                  "bg-white/30",
                                ];

                                return (
                                  <div className="space-y-8 w-full">
                                    {eqCategories.map((cat, idx) => {
                                      const catExercises = section.list.filter(
                                        (e) => {
                                          if (cat === "Other") {
                                            return (
                                              !e.equipmentCategory ||
                                              (!eqCategories.includes(
                                                e.equipmentCategory,
                                              ) &&
                                                e.equipmentCategory !== "Other")
                                            );
                                          }
                                          return e.equipmentCategory === cat;
                                        },
                                      );

                                      if (catExercises.length === 0)
                                        return null;

                                      return (
                                        <div key={cat} className="space-y-4">
                                          <div className="flex items-center gap-3 border-b border-white/5 pb-2 ml-2">
                                            <div
                                              className={`w-1.5 h-3 ${colors[idx % colors.length]} rounded-[1px]`}
                                            />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
                                              {cat} Equipment
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {catExercises.map(renderCard)}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              }

                              return (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {section.list.map(renderCard)}
                                </div>
                              );
                            })()}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            ) : activeView === "progress" ? (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Weight Tracking Section */}
                <div className="border border-white/15 rounded-md overflow-hidden bg-black/70 backdrop-blur-md">
                  <button
                    onClick={() =>
                      setExpandedProgressSections((prev) => ({
                        ...prev,
                        weight: !prev.weight,
                      }))
                    }
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-white/[0.04] transition-all cursor-pointer group backdrop-blur-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center text-gym-accent group-hover:bg-gym-accent/20 group-hover:border-gym-accent/40 transition-all shrink-0">
                        <Scale className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-light italic font-serif flex items-center gap-3 mb-1">
                          Weight Tracking
                        </h3>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                          Physical progression tracking
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-white/20 group-hover:text-gym-accent transition-all ${expandedProgressSections.weight ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {expandedProgressSections.weight && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-10 pt-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-10 pb-8 border-b border-white/5">
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="relative">
                                <input
                                  type="number"
                                  inputMode="decimal"
                                  placeholder="Weight (kg)"
                                  value={newWeight}
                                  onChange={(e) => setNewWeight(e.target.value)}
                                  disabled={isSavingWeight}
                                  className="bg-black/55 border border-white/20 rounded-md px-4 py-3 text-sm font-light focus:outline-none focus:border-gym-accent transition-all w-32 disabled:opacity-50 text-white"
                                />
                              </div>
                              <div className="relative">
                                <input
                                  type="date"
                                  value={newWeightDate}
                                  onChange={(e) =>
                                    setNewWeightDate(e.target.value)
                                  }
                                  disabled={isSavingWeight}
                                  className="bg-black/55 border border-white/20 rounded-md px-4 py-3 text-sm font-light focus:outline-none focus:border-gym-accent transition-all w-44 disabled:opacity-50 text-white [color-scheme:dark]"
                                />
                                <AnimatePresence>
                                  {weightFlash && (
                                    <motion.div
                                      initial={{
                                        opacity: 0,
                                        scale: 0.8,
                                        y: 10,
                                      }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                      className={`absolute -bottom-8 left-0 right-0 text-center text-[9px] font-bold uppercase tracking-widest ${weightFlash.includes("Error") || weightFlash.includes("Invalid") || weightFlash.includes("Enter") ? "text-red-500" : "text-gym-accent"}`}
                                    >
                                      {weightFlash}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              <button
                                onClick={handleSaveWeight}
                                disabled={
                                  isSavingWeight || !newWeight || !newWeightDate
                                }
                                className="bg-gym-accent text-black px-6 py-3 rounded-md font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-shadow-btn"
                              >
                                {isSavingWeight ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Plus className="w-3 h-3" />
                                )}
                                Record
                              </button>
                            </div>
                          </div>

                          <div className="h-[350px] w-full mb-10">
                            {weightHistory.length === 0 ? (
                              <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-md border border-white/5 border-dashed">
                                <TrendingUp className="w-12 h-12 text-white/10 mb-2" />
                                <p className="text-white/20 font-bold text-sm">
                                  Add your weight to see your progress data
                                </p>
                              </div>
                            ) : (
                              <motion.div
                                className="h-full w-full"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              >
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart
                                    data={(() => {
                                      const grouped = weightHistory.reduce(
                                        (acc, entry) => {
                                          acc[entry.date] = entry;
                                          return acc;
                                        },
                                        {} as Record<string, WeightEntry>,
                                      );
                                      return (
                                        Object.values(grouped) as WeightEntry[]
                                      ).sort(
                                        (a, b) =>
                                          new Date(a.date).getTime() -
                                          new Date(b.date).getTime(),
                                      );
                                    })()}
                                    margin={{
                                      top: 20,
                                      right: 30,
                                      left: 10,
                                      bottom: 20,
                                    }}
                                  >
                                    <defs>
                                      <linearGradient
                                        id="colorWeight"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                      >
                                        <stop
                                          offset="5%"
                                          stopColor={activeTheme.accent}
                                          stopOpacity={0.3}
                                        />
                                        <stop
                                          offset="95%"
                                          stopColor={activeTheme.accent}
                                          stopOpacity={0}
                                        />
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                      strokeDasharray="3 3"
                                      stroke="#ffffff05"
                                      vertical={false}
                                    />
                                    <XAxis
                                      dataKey="date"
                                      stroke="#ffffff33"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={false}
                                      dy={15}
                                      minTickGap={20}
                                      tickFormatter={(str) => {
                                        if (!str) return "";
                                        try {
                                          const [y, m, d] = str
                                            .split("-")
                                            .map(Number);
                                          const date = new Date(y, m - 1, d);
                                          return date.toLocaleDateString(
                                            "en-GB",
                                            { day: "numeric", month: "short" },
                                          );
                                        } catch (e) {
                                          return str;
                                        }
                                      }}
                                    />
                                    <YAxis
                                      domain={[
                                        (dataMin: number) =>
                                          Math.max(0, Math.floor(dataMin - 5)),
                                        (dataMax: number) =>
                                          Math.ceil(dataMax + 5),
                                      ]}
                                      stroke="#ffffff33"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={false}
                                      width={40}
                                      tickFormatter={(val) => `${val}kg`}
                                    />
                                    <Tooltip
                                      cursor={{
                                        stroke: activeTheme.accent,
                                        strokeWidth: 1,
                                        strokeDasharray: "4 4",
                                      }}
                                      contentStyle={{
                                        backgroundColor: "#0d0d0d",
                                        borderColor: "#ffffff10",
                                        borderRadius: "4px",
                                        boxShadow:
                                          "0 20px 40px rgba(0,0,0,0.5)",
                                        padding: "12px",
                                      }}
                                      itemStyle={{
                                        color: activeTheme.accent,
                                        fontWeight: "bold",
                                      }}
                                      labelStyle={{
                                        color: "#ffffff50",
                                        fontSize: "10px",
                                        textTransform: "uppercase",
                                        fontWeight: "900",
                                        marginBottom: "4px",
                                        letterSpacing: "0.1em",
                                      }}
                                      labelFormatter={(str) => {
                                        if (!str) return "Date";
                                        try {
                                          const [y, m, d] = str
                                            .split("-")
                                            .map(Number);
                                          const date = new Date(y, m - 1, d);
                                          return date.toLocaleDateString(
                                            "en-GB",
                                            {
                                              weekday: "long",
                                              day: "numeric",
                                              month: "long",
                                            },
                                          );
                                        } catch (e) {
                                          return str;
                                        }
                                      }}
                                      formatter={(value: any) => [
                                        `${value} kg`,
                                        "Weight",
                                      ]}
                                    />
                                    <Area
                                      type="basis"
                                      dataKey="weight"
                                      stroke={activeTheme.accent}
                                      strokeWidth={3}
                                      fillOpacity={1}
                                      fill="url(#colorWeight)"
                                      animationDuration={2500}
                                    />
                                    <Area
                                      type="basis"
                                      dataKey="weight"
                                      stroke="none"
                                      fill={activeTheme.accent}
                                      fillOpacity={0.05}
                                    />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </motion.div>
                            )}
                          </div>

                          <div className="mt-6">
                            <button
                              onClick={() =>
                                setShowWeightHistoryList(!showWeightHistoryList)
                              }
                              type="button"
                              className="w-full flex items-center justify-between px-6 py-4 bg-black/65 hover:bg-black/85 border border-white/10 rounded-md text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all cursor-pointer group"
                            >
                              <span className="flex items-center gap-2">
                                <History className="w-3.5 h-3.5 text-gym-accent group-hover:scale-110 transition-transform" />
                                {showWeightHistoryList
                                  ? "Hide Weight Logs"
                                  : `View Weight Logs (${weightHistory.length})`}
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 text-white/30 group-hover:text-gym-accent transition-transform duration-300 ${showWeightHistoryList ? "rotate-180" : ""}`}
                              />
                            </button>

                            <AnimatePresence>
                              {showWeightHistoryList && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden"
                                >
                                  {weightHistory.length === 0 ? (
                                    <div className="py-8 text-center text-xs text-white/20 italic bg-white/[0.01] border border-white/5 border-t-0 rounded-b-sm">
                                      No logged weight entries yet
                                    </div>
                                  ) : (
                                    <div className="mt-2 max-h-56 overflow-y-auto divide-y divide-white/5 border border-white/15 rounded-md bg-black">
                                      {[...weightHistory]
                                        .reverse()
                                        .map((entry, i) => (
                                          <div
                                            key={entry.id || i}
                                            className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.02] transition-colors group"
                                          >
                                            <div className="flex flex-col gap-0.5">
                                              <div className="flex items-baseline gap-1.5">
                                                <span className="text-base font-medium text-white">
                                                  {entry.weight}
                                                </span>
                                                <span className="text-[10px] text-white/40">
                                                  kg
                                                </span>
                                              </div>
                                              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                                                {(() => {
                                                  if (!entry.date)
                                                    return "Unknown Date";
                                                  const parts = entry.date
                                                    .split("-")
                                                    .map(Number);
                                                  if (parts.length !== 3)
                                                    return entry.date;
                                                  const date = new Date(
                                                    parts[0],
                                                    parts[1] - 1,
                                                    parts[2],
                                                  );
                                                  return date.toLocaleDateString(
                                                    "en-GB",
                                                    {
                                                      day: "numeric",
                                                      month: "short",
                                                      year: "numeric",
                                                    },
                                                  );
                                                })()}
                                              </span>
                                            </div>
                                            {entry.id && (
                                              <button
                                                onClick={async () => {
                                                  if (!currentUser) return;
                                                  try {
                                                    await deleteDoc(
                                                      doc(
                                                        db,
                                                        `users/${currentUser.uid}/weightEntries/${entry.id}`,
                                                      ),
                                                    );
                                                  } catch (err) {
                                                    handleFirestoreError(
                                                      err,
                                                      OperationType.DELETE,
                                                      `weightEntries/${entry.id}`,
                                                    );
                                                  }
                                                }}
                                                className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all cursor-pointer"
                                                title="Delete entry"
                                              >
                                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                              </button>
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Body Fat Tracking Section */}
                <div className="border border-white/15 rounded-md overflow-hidden bg-black/70 backdrop-blur-md">
                  <button
                    onClick={() =>
                      setExpandedProgressSections((prev) => ({
                        ...prev,
                        bodyFat: !prev.bodyFat,
                      }))
                    }
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-white/[0.04] transition-all cursor-pointer group backdrop-blur-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center text-gym-accent group-hover:bg-gym-accent/20 group-hover:border-gym-accent/40 transition-all shrink-0">
                        <Percent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-light italic font-serif flex items-center gap-3 mb-1">
                          Body Fat Tracking
                        </h3>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                          Body fat percentage progression
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-white/20 group-hover:text-gym-accent transition-all ${expandedProgressSections.bodyFat ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {expandedProgressSections.bodyFat && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-10 pt-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-10 pb-8 border-b border-white/5">
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="relative">
                                <input
                                  type="number"
                                  inputMode="decimal"
                                  placeholder="Body Fat (%)"
                                  value={newBodyFat}
                                  onChange={(e) =>
                                    setNewBodyFat(e.target.value)
                                  }
                                  disabled={isSavingBodyFat}
                                  className="bg-black/55 border border-white/20 rounded-md px-4 py-3 text-sm font-light focus:outline-none focus:border-gym-accent transition-all w-32 disabled:opacity-50 text-white"
                                />
                              </div>
                              <div className="relative">
                                <input
                                  type="date"
                                  value={newBodyFatDate}
                                  onChange={(e) =>
                                    setNewBodyFatDate(e.target.value)
                                  }
                                  disabled={isSavingBodyFat}
                                  className="bg-black/55 border border-white/20 rounded-md px-4 py-3 text-sm font-light focus:outline-none focus:border-gym-accent transition-all w-44 disabled:opacity-50 text-white [color-scheme:dark]"
                                />
                                <AnimatePresence>
                                  {bodyFatFlash && (
                                    <motion.div
                                      initial={{
                                        opacity: 0,
                                        scale: 0.8,
                                        y: 10,
                                      }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                      className={`absolute -bottom-8 left-0 right-0 text-center text-[9px] font-bold uppercase tracking-widest ${bodyFatFlash.includes("Error") || bodyFatFlash.includes("Invalid") || bodyFatFlash.includes("Enter") ? "text-red-500" : "text-gym-accent"}`}
                                    >
                                      {bodyFatFlash}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              <button
                                onClick={handleSaveBodyFat}
                                disabled={
                                  isSavingBodyFat ||
                                  !newBodyFat ||
                                  !newBodyFatDate
                                }
                                className="bg-gym-accent text-black px-6 py-3 rounded-md font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-shadow-btn"
                              >
                                {isSavingBodyFat ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Plus className="w-3 h-3" />
                                )}
                                Record
                              </button>
                            </div>
                          </div>

                          <div className="h-[350px] w-full mb-10">
                            {bodyFatHistory.length === 0 ? (
                              <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-md border border-white/5 border-dashed">
                                <Percent className="w-12 h-12 text-white/10 mb-2 animate-pulse" />
                                <p className="text-white/20 font-bold text-sm">
                                  Add your body fat % to see your progress data
                                </p>
                              </div>
                            ) : (
                              <motion.div
                                className="h-full w-full"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              >
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart
                                    data={(() => {
                                      const grouped = bodyFatHistory.reduce(
                                        (acc, entry) => {
                                          acc[entry.date] = entry;
                                          return acc;
                                        },
                                        {} as Record<string, BodyFatEntry>,
                                      );
                                      return (
                                        Object.values(grouped) as BodyFatEntry[]
                                      ).sort(
                                        (a, b) =>
                                          new Date(a.date).getTime() -
                                          new Date(b.date).getTime(),
                                      );
                                    })()}
                                    margin={{
                                      top: 20,
                                      right: 30,
                                      left: 10,
                                      bottom: 20,
                                    }}
                                  >
                                    <defs>
                                      <linearGradient
                                        id="colorBodyFat"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                      >
                                        <stop
                                          offset="5%"
                                          stopColor={activeTheme.accent}
                                          stopOpacity={0.3}
                                        />
                                        <stop
                                          offset="95%"
                                          stopColor={activeTheme.accent}
                                          stopOpacity={0}
                                        />
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                      strokeDasharray="3 3"
                                      stroke="#ffffff05"
                                      vertical={false}
                                    />
                                    <XAxis
                                      dataKey="date"
                                      stroke="#ffffff33"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={false}
                                      dy={15}
                                      minTickGap={20}
                                      tickFormatter={(str) => {
                                        if (!str) return "";
                                        try {
                                          const [y, m, d] = str
                                            .split("-")
                                            .map(Number);
                                          const date = new Date(y, m - 1, d);
                                          return date.toLocaleDateString(
                                            "en-GB",
                                            { day: "numeric", month: "short" },
                                          );
                                        } catch (e) {
                                          return str;
                                        }
                                      }}
                                    />
                                    <YAxis
                                      domain={[
                                        (dataMin: number) =>
                                          Math.max(0, Math.floor(dataMin - 2)),
                                        (dataMax: number) =>
                                          Math.ceil(dataMax + 2),
                                      ]}
                                      stroke="#ffffff33"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={false}
                                      width={40}
                                      tickFormatter={(val) => `${val}%`}
                                    />
                                    <Tooltip
                                      cursor={{
                                        stroke: activeTheme.accent,
                                        strokeWidth: 1,
                                        strokeDasharray: "4 4",
                                      }}
                                      contentStyle={{
                                        backgroundColor: "#0d0d0d",
                                        borderColor: "#ffffff10",
                                        borderRadius: "4px",
                                        boxShadow:
                                          "0 20px 40px rgba(0,0,0,0.5)",
                                        padding: "12px",
                                      }}
                                      itemStyle={{
                                        color: activeTheme.accent,
                                        fontWeight: "bold",
                                      }}
                                      labelStyle={{
                                        color: "#ffffff50",
                                        fontSize: "10px",
                                        textTransform: "uppercase",
                                        fontWeight: "900",
                                        marginBottom: "4px",
                                        letterSpacing: "0.1em",
                                      }}
                                      labelFormatter={(str) => {
                                        if (!str) return "Date";
                                        try {
                                          const [y, m, d] = str
                                            .split("-")
                                            .map(Number);
                                          const date = new Date(y, m - 1, d);
                                          return date.toLocaleDateString(
                                            "en-GB",
                                            {
                                              weekday: "long",
                                              day: "numeric",
                                              month: "long",
                                            },
                                          );
                                        } catch (e) {
                                          return str;
                                        }
                                      }}
                                      formatter={(value: any) => [
                                        `${value}%`,
                                        "Body Fat",
                                      ]}
                                    />
                                    <Area
                                      type="basis"
                                      dataKey="bodyFatPercent"
                                      stroke={activeTheme.accent}
                                      strokeWidth={3}
                                      fillOpacity={1}
                                      fill="url(#colorBodyFat)"
                                      animationDuration={2500}
                                    />
                                    <Area
                                      type="basis"
                                      dataKey="bodyFatPercent"
                                      stroke="none"
                                      fill={activeTheme.accent}
                                      fillOpacity={0.05}
                                    />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </motion.div>
                            )}
                          </div>

                          <div className="mt-6">
                            <button
                              onClick={() =>
                                setShowBodyFatHistoryList(
                                  !showBodyFatHistoryList,
                                )
                              }
                              type="button"
                              className="w-full flex items-center justify-between px-6 py-4 bg-black/65 hover:bg-black/85 border border-white/10 rounded-md text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all cursor-pointer group"
                            >
                              <span className="flex items-center gap-2">
                                <History className="w-3.5 h-3.5 text-gym-accent group-hover:scale-110 transition-transform" />
                                {showBodyFatHistoryList
                                  ? "Hide Body Fat Logs"
                                  : `View Body Fat Logs (${bodyFatHistory.length})`}
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 text-white/30 group-hover:text-gym-accent transition-transform duration-300 ${showBodyFatHistoryList ? "rotate-180" : ""}`}
                              />
                            </button>

                            <AnimatePresence>
                              {showBodyFatHistoryList && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden"
                                >
                                  {bodyFatHistory.length === 0 ? (
                                    <div className="py-8 text-center text-xs text-white/20 italic bg-white/[0.01] border border-white/5 border-t-0 rounded-b-sm">
                                      No logged body fat entries yet
                                    </div>
                                  ) : (
                                    <div className="mt-2 max-h-56 overflow-y-auto divide-y divide-white/5 border border-white/15 rounded-md bg-black">
                                      {[...bodyFatHistory]
                                        .reverse()
                                        .map((entry, i) => (
                                          <div
                                            key={entry.id || i}
                                            className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.02] transition-colors group"
                                          >
                                            <div className="flex flex-col gap-0.5">
                                              <div className="flex items-baseline gap-1.5">
                                                <span className="text-base font-medium text-white">
                                                  {entry.bodyFatPercent}
                                                </span>
                                                <span className="text-[10px] text-white/40">
                                                  %
                                                </span>
                                              </div>
                                              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                                                {(() => {
                                                  if (!entry.date)
                                                    return "Unknown Date";
                                                  const parts = entry.date
                                                    .split("-")
                                                    .map(Number);
                                                  if (parts.length !== 3)
                                                    return entry.date;
                                                  const date = new Date(
                                                    parts[0],
                                                    parts[1] - 1,
                                                    parts[2],
                                                  );
                                                  return date.toLocaleDateString(
                                                    "en-GB",
                                                    {
                                                      day: "numeric",
                                                      month: "short",
                                                      year: "numeric",
                                                    },
                                                  );
                                                })()}
                                              </span>
                                            </div>
                                            {entry.id && (
                                              <button
                                                onClick={async () => {
                                                  if (!currentUser) return;
                                                  try {
                                                    await deleteDoc(
                                                      doc(
                                                        db,
                                                        `users/${currentUser.uid}/bodyFatEntries/${entry.id}`,
                                                      ),
                                                    );
                                                  } catch (err) {
                                                    handleFirestoreError(
                                                      err,
                                                      OperationType.DELETE,
                                                      `bodyFatEntries/${entry.id}`,
                                                    );
                                                  }
                                                }}
                                                className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all cursor-pointer"
                                                title="Delete entry"
                                              >
                                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                              </button>
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Workout Frequency Heatmap Section */}
                <div className="border border-white/15 rounded-md overflow-hidden bg-black/70 backdrop-blur-md">
                  <button
                    onClick={() =>
                      setExpandedProgressSections((prev) => ({
                        ...prev,
                        workoutCalendar: !prev.workoutCalendar,
                      }))
                    }
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-white/[0.04] transition-all cursor-pointer group backdrop-blur-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center text-gym-accent group-hover:bg-gym-accent/20 group-hover:border-gym-accent/40 transition-all shrink-0">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-light italic font-serif flex items-center gap-3 mb-1">
                          Workout Frequency
                        </h3>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                          Past 3 months activity heatmap
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-white/20 group-hover:text-gym-accent transition-all ${expandedProgressSections.workoutCalendar ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {expandedProgressSections.workoutCalendar && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-10 pt-4">
                          <WorkoutCalendarHeatmap
                            archivedWorkouts={archivedWorkouts}
                            activeTheme={activeTheme}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Trending Section */}
                <div className="border border-white/15 rounded-md overflow-hidden bg-black/70 backdrop-blur-md">
                  <button
                    onClick={() =>
                      setExpandedProgressSections((prev) => ({
                        ...prev,
                        trending: !prev.trending,
                      }))
                    }
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-white/[0.04] transition-all cursor-pointer group backdrop-blur-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center text-gym-accent group-hover:bg-gym-accent/20 group-hover:border-gym-accent/40 transition-all shrink-0">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-light italic font-serif flex items-center gap-3 mb-1">
                          Trending
                        </h3>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                          Volume & Output Analysis
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-white/20 group-hover:text-gym-accent transition-all ${expandedProgressSections.trending ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {expandedProgressSections.trending && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-10 pt-4">
                          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                            <div className="flex bg-white/5 p-1 rounded-md">
                              {(["day", "week", "month"] as const).map((tf) => (
                                <button
                                  key={tf}
                                  onClick={() => setVolumeTimeframe(tf)}
                                  className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${volumeTimeframe === tf ? "bg-gym-accent text-black shadow-lg" : "text-white/40 hover:text-white"}`}
                                >
                                  {tf}
                                </button>
                              ))}
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] text-white/20 uppercase tracking-widest font-black mb-1">
                                Current Metric
                              </p>
                              <p className="text-sm font-light text-gym-accent italic font-serif">
                                Total Training Volume (kg)
                              </p>
                            </div>
                          </div>

                          <div className="h-[350px] w-full">
                            {archivedWorkouts.length === 0 ? (
                              <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-md border border-white/5 border-dashed">
                                <Activity className="w-12 h-12 text-white/10 mb-2" />
                                <p className="text-white/20 font-bold text-sm">
                                  Capture workouts to see your volume trending
                                </p>
                              </div>
                            ) : (
                              <motion.div
                                className="h-full w-full"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              >
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart
                                    data={getVolumeData()}
                                    margin={{
                                      top: 20,
                                      right: 30,
                                      left: 10,
                                      bottom: 20,
                                    }}
                                  >
                                    <defs>
                                      <linearGradient
                                        id="colorVol"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                      >
                                        <stop
                                          offset="5%"
                                          stopColor={activeTheme.accent}
                                          stopOpacity={0.3}
                                        />
                                        <stop
                                          offset="95%"
                                          stopColor={activeTheme.accent}
                                          stopOpacity={0}
                                        />
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                      strokeDasharray="3 3"
                                      stroke="#ffffff05"
                                      vertical={false}
                                    />
                                    <XAxis
                                      dataKey="date"
                                      stroke="#ffffff33"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={false}
                                      dy={15}
                                      tickFormatter={(str) => {
                                        if (!str) return "";
                                        try {
                                          if (volumeTimeframe === "month") {
                                            const [y, m] = str.split("-");
                                            const date = new Date(
                                              Number(y),
                                              Number(m) - 1,
                                              1,
                                            );
                                            return date.toLocaleDateString(
                                              "en-GB",
                                              {
                                                month: "short",
                                                year: "2-digit",
                                              },
                                            );
                                          }
                                          if (volumeTimeframe === "week")
                                            return `W/C ${str.split("-").slice(1).reverse().join("/")}`;
                                          const [y, m, d] = str
                                            .split("-")
                                            .map(Number);
                                          return new Date(
                                            y,
                                            m - 1,
                                            d,
                                          ).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                          });
                                        } catch (e) {
                                          return str;
                                        }
                                      }}
                                    />
                                    <YAxis
                                      stroke="#ffffff33"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={false}
                                      width={45}
                                      tickFormatter={(val) =>
                                        val >= 1000
                                          ? `${(val / 1000).toFixed(1)}t`
                                          : `${val}kg`
                                      }
                                    />
                                    <Tooltip
                                      cursor={{
                                        stroke: activeTheme.accent,
                                        strokeWidth: 1,
                                        strokeDasharray: "4 4",
                                      }}
                                      contentStyle={{
                                        backgroundColor: "#0d0d0d",
                                        borderColor: "#ffffff10",
                                        borderRadius: "4px",
                                        boxShadow:
                                          "0 20px 40px rgba(0,0,0,0.5)",
                                        padding: "12px",
                                      }}
                                      itemStyle={{
                                        color: activeTheme.accent,
                                        fontWeight: "bold",
                                      }}
                                      labelStyle={{
                                        color: "#ffffff50",
                                        fontSize: "10px",
                                        textTransform: "uppercase",
                                        fontWeight: "900",
                                        marginBottom: "4px",
                                        letterSpacing: "0.1em",
                                      }}
                                      formatter={(value: any) => [
                                        `${Number(value).toLocaleString()} kg`,
                                        "Volume",
                                      ]}
                                    />
                                    <Area
                                      type="basis"
                                      dataKey="volume"
                                      stroke={activeTheme.accent}
                                      strokeWidth={3}
                                      fillOpacity={1}
                                      fill="url(#colorVol)"
                                      animationDuration={2500}
                                    />
                                    <Area
                                      type="basis"
                                      dataKey="volume"
                                      stroke="none"
                                      fill={activeTheme.accent}
                                      fillOpacity={0.05}
                                    />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Personal Records Feed Section */}
                <div className="border border-white/15 rounded-md overflow-hidden bg-black/70 backdrop-blur-md">
                  <button
                    onClick={() =>
                      setExpandedProgressSections((prev) => ({
                        ...prev,
                        personalRecords: !prev.personalRecords,
                      }))
                    }
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-white/[0.04] transition-all cursor-pointer group backdrop-blur-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center text-gym-accent group-hover:bg-gym-accent/20 group-hover:border-gym-accent/40 transition-all shrink-0">
                        <Trophy className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-xl font-light italic font-serif flex items-center gap-3 mb-1">
                          Personal Records Feed
                        </h3>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                          PB accomplishments with date stamps and weight details
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-white/20 group-hover:text-gym-accent transition-all ${expandedProgressSections.personalRecords ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {expandedProgressSections.personalRecords && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-10 pt-4">
                          {/* Search & Sorting Toolbar */}
                          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 pb-6 border-b border-white/5">
                            {/* Search bar */}
                            <div className="relative w-full sm:w-72">
                              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                              <input
                                type="text"
                                placeholder="Search exercise PB..."
                                value={pbSearchQuery}
                                onChange={(e) => setPbSearchQuery(e.target.value)}
                                className="w-full bg-black/55 border border-white/10 rounded-md pl-11 pr-4 py-2.5 text-xs text-white placeholder-white/25 focus:outline-none focus:border-gym-accent transition-all font-sans"
                              />
                            </div>

                            {/* Sorting Controls */}
                            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-end">
                              <button
                                onClick={handleRebuildPBsFromHistory}
                                disabled={rebuildingPBs}
                                style={{
                                  color: activeTheme.accent,
                                  backgroundColor: `${activeTheme.accent}12`,
                                  borderColor: `${activeTheme.accent}40`,
                                }}
                                className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest disabled:opacity-40 rounded-md font-mono flex items-center gap-1.5 cursor-pointer transition-all hover:brightness-125 hover:border-white/30"
                                title="Scan raw session history and recalibrate correct personal bests"
                              >
                                <RefreshCw className={`w-3 h-3 ${rebuildingPBs ? 'animate-spin' : ''}`} />
                                <span>{rebuildingPBs ? "RECALIBRATING..." : "RECALIBRATE"}</span>
                              </button>

                              <span className="text-[9px] text-white/30 uppercase tracking-widest font-black font-mono">
                                Sort By
                              </span>
                              <div className="flex bg-white/5 p-1 rounded-md border border-white/5">
                                {[
                                  { key: "date", label: "Date" },
                                  { key: "weight", label: "Weight" },
                                  { key: "name", label: "A-Z" }
                                ].map((opt) => (
                                  <button
                                    key={opt.key}
                                    onClick={() => {
                                      if (pbSortKey === opt.key) {
                                        setPbSortOrder(prev => prev === "asc" ? "desc" : "asc");
                                      } else {
                                        setPbSortKey(opt.key as any);
                                        setPbSortOrder(opt.key === "name" ? "asc" : "desc");
                                      }
                                    }}
                                    className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                                      pbSortKey === opt.key
                                        ? "bg-gym-accent text-black font-extrabold shadow-sm"
                                        : "text-white/40 hover:text-white"
                                    }`}
                                  >
                                    {opt.label}
                                    {pbSortKey === opt.key && (
                                      pbSortOrder === "asc" ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* List container */}
                          {(() => {
                            const formatDate = (dateStr?: string) => {
                              if (!dateStr) return "Unknown Date";
                              try {
                                const parts = dateStr.split("-").map(Number);
                                if (parts.length !== 3 || parts.some(isNaN)) return dateStr;
                                const date = new Date(parts[0], parts[1] - 1, parts[2]);
                                return date.toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric"
                                });
                              } catch (e) {
                                return dateStr;
                              }
                            };

                            const allLoggedSets: SessionSet[] = [];
                            allLoggedSets.push(...sessionSets);
                            archivedWorkouts.forEach((w) => {
                              if (w.sets && Array.isArray(w.sets)) {
                                allLoggedSets.push(...w.sets);
                              }
                            });

                            const setsByExercise: Record<string, SessionSet[]> = {};
                            allLoggedSets.forEach((set) => {
                              if (!set || !set.exerciseName) return;
                              const name = set.exerciseName.trim();
                              if (!name) return;
                              if (!setsByExercise[name]) {
                                setsByExercise[name] = [];
                              }
                              setsByExercise[name].push(set);
                            });

                            const exercisesRequiringIncrease: Array<{
                              exerciseName: string;
                              highestWeight: number;
                              repsDone: number;
                              totalSetsAtMax: number;
                              setsOf10Plus: number;
                              completed3SetsOf10: boolean;
                              setDate: string;
                            }> = [];

                            Object.entries(setsByExercise).forEach(([exName, sets]) => {
                              if (sets.length === 0) return;
                              let maxWeight = -1;
                              sets.forEach((s) => {
                                if (s.weight > maxWeight) {
                                  maxWeight = s.weight;
                                }
                              });

                              const setsAtMaxWeight = sets.filter((s) => s.weight === maxWeight);
                              const setWith10Reps = setsAtMaxWeight.find((s) => s.reps >= 10);
                              const setsOf10Plus = setsAtMaxWeight.filter((s) => s.reps >= 10).length;
                              const completed3SetsOf10 = setsOf10Plus >= 3;

                              if (setWith10Reps) {
                                const dates = setsAtMaxWeight
                                  .filter((s) => s.reps >= 10 && s.date)
                                  .map((s) => s.date);
                                const latestDate = dates.sort().reverse()[0] || "";

                                exercisesRequiringIncrease.push({
                                  exerciseName: exName,
                                  highestWeight: maxWeight,
                                  repsDone: setWith10Reps.reps,
                                  totalSetsAtMax: setsAtMaxWeight.length,
                                  setsOf10Plus,
                                  completed3SetsOf10,
                                  setDate: latestDate,
                                });
                              }
                            });

                            const pbsList = Object.entries(personalBests || {}).map(([key, value]) => ({
                              ...(value as PB),
                              exerciseName: (value as PB).exerciseName || key,
                            }));
                            
                            // Filter lists
                            const filteredPbs = pbsList.filter((pb) =>
                              pb.exerciseName?.toLowerCase().includes(pbSearchQuery.toLowerCase())
                            );

                            const filteredProgression = exercisesRequiringIncrease.filter((item) =>
                              item.exerciseName?.toLowerCase().includes(pbSearchQuery.toLowerCase())
                            );

                            // Sort lists
                            const sortedPbs = [...filteredPbs].sort((a, b) => {
                              let comparison = 0;
                              if (pbSortKey === "name") {
                                comparison = (a.exerciseName || "").localeCompare(b.exerciseName || "");
                              } else if (pbSortKey === "weight") {
                                comparison = (a.bestWeight || 0) - (b.bestWeight || 0);
                              } else if (pbSortKey === "date") {
                                const tA = a.bestDate ? new Date(a.bestDate).getTime() : 0;
                                const tB = b.bestDate ? new Date(b.bestDate).getTime() : 0;
                                comparison = tA - tB;
                              }
                              return pbSortOrder === "desc" ? -comparison : comparison;
                            });

                            const sortedProgression = [...filteredProgression].sort((a, b) => {
                              let comparison = 0;
                              if (pbSortKey === "name") {
                                comparison = a.exerciseName.localeCompare(b.exerciseName);
                              } else if (pbSortKey === "weight") {
                                comparison = a.highestWeight - b.highestWeight;
                              } else if (pbSortKey === "date") {
                                const tA = a.setDate ? new Date(a.setDate).getTime() : 0;
                                const tB = b.setDate ? new Date(b.setDate).getTime() : 0;
                                comparison = tA - tB;
                              }
                              return pbSortOrder === "desc" ? -comparison : comparison;
                            });

                            return (
                              <div className="flex flex-col gap-4">
                                {/* Sub-Tab Navigation */}
                                <div className="flex border-b border-white/5 p-1 bg-white/[0.01] rounded-md gap-2">
                                  <button
                                    onClick={() => setPbSubTab("pbs")}
                                    className={`flex-1 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-center cursor-pointer transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                                      pbSubTab === "pbs"
                                        ? "text-gym-accent border-gym-accent font-black"
                                        : "text-white/40 border-transparent hover:text-white"
                                    }`}
                                  >
                                    🏆 Established PBs ({pbsList.length})
                                  </button>
                                  <button
                                    onClick={() => setPbSubTab("progression")}
                                    className={`flex-1 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-center cursor-pointer transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                                      pbSubTab === "progression"
                                        ? "text-gym-accent border-gym-accent font-black"
                                        : "text-white/40 border-transparent hover:text-white"
                                    }`}
                                  >
                                    🚀 Increase Weight Suggestions ({exercisesRequiringIncrease.length})
                                    {exercisesRequiringIncrease.length > 0 && (
                                      <span className="bg-emerald-500/20 text-[#34d399] font-extrabold text-[8px] px-1.5 py-0.5 rounded-full font-mono border border-emerald-500/30">
                                        {exercisesRequiringIncrease.length}
                                      </span>
                                    )}
                                  </button>
                                </div>

                                {pbSubTab === "pbs" ? (
                                  <>
                                    {pbsList.length === 0 ? (
                                      <div className="py-12 border border-dashed border-white/5 rounded-md bg-[#070707]/30 text-center flex flex-col items-center justify-center">
                                        <Trophy className="w-10 h-10 text-white/10 mb-3" />
                                        <p className="text-white/30 text-xs font-semibold uppercase tracking-wider">
                                          No Personal Bests Established
                                        </p>
                                        <p className="text-[10px] text-white/20 mt-1 max-w-[340px] leading-relaxed">
                                          Record your exercise sets in active workouts to calculate and persist your primary PB records automatically!
                                        </p>
                                      </div>
                                    ) : sortedPbs.length === 0 ? (
                                      <div className="py-12 border border-dashed border-white/5 rounded-md bg-[#070707]/30 text-center flex flex-col items-center justify-center">
                                        <p className="text-white/30 text-xs font-semibold">
                                          No matches found for "{pbSearchQuery}"
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="max-h-96 overflow-y-auto pr-1 space-y-2.5 divide-y divide-white/5 no-scrollbar">
                                        {sortedPbs.map((pb, index) => (
                                          <div
                                            key={pb.exerciseName || index}
                                            className={`pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-md bg-black/45 border border-white/5 hover:border-white/10 hover:bg-white/[0.01] transition-all group/pbitem ${
                                              index === 0 ? "pt-3.5" : ""
                                            }`}
                                          >
                                            {/* Left block containing details */}
                                            <div className="flex-1">
                                              <div className="flex items-center gap-2">
                                                <button
                                                  onClick={() => setSelectedHistoryChartExercise(pb.exerciseName)}
                                                  className="text-xs font-black tracking-widest text-[#ffffff] hover:text-gym-accent uppercase font-mono transition-colors flex items-center gap-1.5 cursor-pointer text-left focus:outline-none"
                                                  title={`View progress chart for ${pb.exerciseName}`}
                                                >
                                                  <span>{pb.exerciseName}</span>
                                                  <LineChart className="w-3.5 h-3.5 text-gym-accent opacity-0 group-hover/pbitem:opacity-100 transition-opacity" />
                                                </button>
                                              </div>
                                              
                                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[10px] text-white/40">
                                                <div className="flex items-center gap-1.5 font-mono">
                                                  <span className="text-[9px] text-[#ffffff]/30 uppercase font-black tracking-wider">
                                                    Achieved:
                                                  </span>
                                                  <span className="text-white/60 font-semibold">
                                                    {formatDate(pb.bestDate)}
                                                  </span>
                                                </div>
                                                {pb.lastDate && pb.lastDate !== pb.bestDate && (
                                                  <div className="flex items-center gap-1.5 font-mono border-l border-white/10 pl-4">
                                                    <span className="text-[9px] text-[#ffffff]/30 uppercase font-black tracking-wider">
                                                      Last Lifted:
                                                    </span>
                                                    <span className="text-white/40 font-semibold">
                                                      {formatDate(pb.lastDate)} ({pb.lastWeight}kg)
                                                    </span>
                                                  </div>
                                                )}
                                              </div>
                                            </div>

                                            {/* Right block containing visual weights and options */}
                                            <div className="flex items-center gap-4 shrink-0">
                                              <div className="flex flex-col text-right">
                                                <span className="text-[8px] text-[#ffffff]/20 font-black tracking-widest uppercase font-mono mb-0.5">
                                                  PERSONAL RECORD
                                                </span>
                                                <div className="bg-gym-accent/10 border border-gym-accent/20 rounded px-2.5 py-1 text-gym-accent font-mono text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 font-bold">
                                                  <Dumbbell className="w-3 h-3 text-gym-accent/70" />
                                                  <span>{pb.bestWeight} kg</span>
                                                  <span className="text-[9px] text-gym-accent/55">×</span>
                                                  <span>{pb.bestReps} reps</span>
                                                </div>
                                              </div>

                                              {deletingPbName === pb.exerciseName ? (
                                                <div className="flex items-center gap-2 bg-rose-950/40 border border-rose-500/20 rounded-md p-1 px-1.5">
                                                  <span className="text-[9px] text-rose-400 font-extrabold uppercase tracking-wide font-mono">
                                                    DEL?
                                                  </span>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      handleDeletePB(pb.exerciseName);
                                                      setDeletingPbName(null);
                                                    }}
                                                    className="p-1 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded transition-all cursor-pointer"
                                                    title="Confirm deletion"
                                                  >
                                                    <Check className="w-3.5 h-3.5" />
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() => setDeletingPbName(null)}
                                                    className="p-1 text-white/40 hover:text-white hover:bg-white/10 rounded transition-all cursor-pointer"
                                                    title="Cancel deletion"
                                                  >
                                                    <span className="text-xs font-bold leading-none px-1">×</span>
                                                  </button>
                                                </div>
                                              ) : (
                                                <button
                                                  type="button"
                                                  onClick={() => setDeletingPbName(pb.exerciseName)}
                                                  className="p-2 text-white/30 hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded transition-all cursor-pointer flex items-center justify-center self-center"
                                                  title={`Delete Personal Best for ${pb.exerciseName}`}
                                                >
                                                  <Trash2 className="w-4 h-4" />
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {exercisesRequiringIncrease.length === 0 ? (
                                      <div className="py-12 border border-dashed border-white/5 rounded-md bg-[#070707]/30 text-center flex flex-col items-center justify-center">
                                        <Flame className="w-10 h-10 text-white/10 mb-3" />
                                        <p className="text-white/30 text-xs font-semibold uppercase tracking-wider">
                                          No Progression Suggestions
                                        </p>
                                        <p className="text-[10px] text-white/20 mt-1 max-w-[340px] leading-relaxed">
                                          Complete 10 or more reps at your highest logged weight on any exercise to trigger progression suggestion!
                                        </p>
                                      </div>
                                    ) : sortedProgression.length === 0 ? (
                                      <div className="py-12 border border-dashed border-white/5 rounded-md bg-[#070707]/30 text-center flex flex-col items-center justify-center">
                                        <p className="text-white/30 text-xs font-semibold">
                                          No matches found for "{pbSearchQuery}"
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="max-h-96 overflow-y-auto pr-1 space-y-2.5 divide-y divide-white/5 no-scrollbar">
                                        {sortedProgression.map((item, index) => (
                                          <div
                                            key={item.exerciseName}
                                            className="pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-md bg-black/45 border border-emerald-500/10 hover:border-emerald-500/25 hover:bg-emerald-500/[0.01] transition-all group/progitem"
                                          >
                                            <div className="flex-1">
                                              <div className="flex items-center gap-2">
                                                <button
                                                  onClick={() => setSelectedHistoryChartExercise(item.exerciseName)}
                                                  className="text-xs font-black tracking-widest text-[#ffffff] hover:text-gym-accent uppercase font-mono transition-colors flex items-center gap-1.5 cursor-pointer text-left focus:outline-none"
                                                  title={`View progress chart for ${item.exerciseName}`}
                                                >
                                                  <span>{item.exerciseName}</span>
                                                  <LineChart className="w-3.5 h-3.5 text-gym-accent opacity-0 group-hover/progitem:opacity-100 transition-opacity" />
                                                </button>
                                                <span className="bg-emerald-500/10 border border-emerald-500/20 text-[#34d399] text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider flex items-center gap-1 font-mono">
                                                  <TrendingUp className="w-2.5 h-2.5" /> Weight Increase Needed
                                                </span>
                                              </div>
                                              
                                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[10px] text-white/40">
                                                <div className="flex items-center gap-1.5 font-mono">
                                                  <span className="text-[9px] text-[#ffffff]/30 uppercase font-black tracking-wider">
                                                    Peak Logged Weight:
                                                  </span>
                                                  <span className="text-white/80 font-bold">
                                                    {item.highestWeight} kg × {item.repsDone} reps
                                                  </span>
                                                </div>
                                                {item.setDate && (
                                                  <div className="flex items-center gap-1.5 font-mono border-l border-white/10 pl-4">
                                                    <span className="text-[9px] text-[#ffffff]/30 uppercase font-black tracking-wider">
                                                      Achieved On:
                                                    </span>
                                                    <span className="text-white/50 font-semibold">
                                                      {formatDate(item.setDate)}
                                                    </span>
                                                  </div>
                                                )}
                                              </div>

                                              <div className="mt-2.5 bg-emerald-950/20 border border-emerald-500/10 rounded-md p-2 text-[10px] text-emerald-400/90 font-mono leading-relaxed">
                                                {item.completed3SetsOf10 ? (
                                                  <div>
                                                    <strong>🔥 STRONGLY RECOMMENDED PROGRESSION</strong>
                                                    <p className="text-[9px] mt-0.5 text-emerald-400/70">
                                                      Completed {item.setsOf10Plus} sets of 10+ reps at {item.highestWeight}kg. Muscle adaptation reached. Increase weight by <strong>+2.5 kg</strong> immediately to continue progressive overload.
                                                    </p>
                                                  </div>
                                                ) : (
                                                  <div>
                                                    <strong>🚀 PROGRESSION SUGGESTION</strong>
                                                    <p className="text-[9px] mt-0.5 text-white/45">
                                                      Successfully completed 10 reps of your absolute heaviest logged load! Try a <strong>+2.5 kg load increase</strong> on your next workout to continue growth.
                                                    </p>
                                                  </div>
                                                )}
                                              </div>
                                            </div>

                                            <div className="flex flex-col text-right shrink-0">
                                              <span className="text-[8px] text-emerald-500/40 font-black tracking-widest uppercase font-mono mb-0.5">
                                                RECOM. INC.
                                              </span>
                                              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded px-2.5 py-1 text-emerald-400 font-mono text-[9px] font-black uppercase tracking-wider inline-flex items-center justify-center gap-1 font-bold">
                                                <span>+2.5 kg</span>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* Exercise Progression Tracker Section */}
                <div className="border border-white/15 rounded-md overflow-hidden bg-black/70 backdrop-blur-md">
                  <button
                    onClick={() =>
                      setExpandedProgressSections((prev) => ({
                        ...prev,
                        exercises: !prev.exercises,
                      }))
                    }
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-white/[0.04] transition-all cursor-pointer group backdrop-blur-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center text-gym-accent group-hover:bg-gym-accent/20 group-hover:border-gym-accent/40 transition-all shrink-0">
                        <Dumbbell className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-light italic font-serif flex items-center gap-3 mb-1">
                          Exercise Progression Tracker
                        </h3>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                          Database search & visual progress benchmarking across historical sets
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-white/20 group-hover:text-gym-accent transition-all ${expandedProgressSections.exercises ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {expandedProgressSections.exercises && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-10 pt-4">
                          {/* Search bar & selector */}
                          <div className="relative mb-6">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                              type="text"
                              placeholder="Search exercise in database..."
                              value={exerciseProgressSearchQuery}
                              onChange={(e) => setExerciseProgressSearchQuery(e.target.value)}
                              className="w-full bg-black/55 border border-white/10 rounded-md pl-11 pr-4 py-2.5 text-xs text-white placeholder-white/25 focus:outline-none focus:border-gym-accent transition-all font-sans"
                            />
                          </div>

                          {/* Matching exercises chips/list */}
                          {(() => {
                            const query = exerciseProgressSearchQuery.trim().toLowerCase();
                            // Filter matches
                            const matchedExercises = trackingExercises.filter((ex) =>
                              ex.name.toLowerCase().includes(query)
                            );

                            // Active exercise
                            const activeEx = selectedExerciseProgress || (matchedExercises.length > 0 ? matchedExercises[0].name : null);

                            return (
                              <div className="space-y-6">
                                {/* Search results list */}
                                {matchedExercises.length === 0 ? (
                                  <div className="py-8 bg-white/[0.01] border border-dashed border-white/5 rounded-md text-center">
                                    <Dumbbell className="w-8 h-8 text-white/10 mx-auto mb-2.5 animate-pulse" />
                                    <p className="text-white/45 text-[11px] font-mono">No matching exercise found in database</p>
                                  </div>
                                ) : (
                                  <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto p-2 bg-black/40 border border-white/5 rounded-md scrollbar-thin scrollbar-thumb-white/10">
                                    {matchedExercises.map((ex) => {
                                      const isSelected = activeEx === ex.name;
                                      return (
                                        <button
                                          key={ex.name}
                                          onClick={() => setSelectedExerciseProgress(ex.name)}
                                          className={`px-2.5 py-1 rounded-md text-[9px] font-mono uppercase tracking-wider transition-all border shrink-0 ${
                                            isSelected
                                              ? "bg-gym-accent/15 border-gym-accent/40 text-gym-accent font-black"
                                              : ex.hasLogs
                                              ? "bg-white/[0.02] border-white/10 text-white/80 hover:bg-white/5"
                                              : "bg-white/[0.005] border-white/5 text-white/40 hover:bg-white/5 hover:text-white/70"
                                          }`}
                                        >
                                          {ex.name}
                                          {ex.hasLogs && (
                                            <span className="ml-1.5 w-1.5 h-1.5 bg-gym-accent rounded-full inline-block animate-pulse" />
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}

                                {/* Progress stats & chart for active exercise */}
                                {activeEx && (() => {
                                  const stats = getExerciseProgressDetails(activeEx);

                                  if (!stats) {
                                    return (
                                      <div className="p-8 border border-white/5 bg-[#070707]/30 text-center rounded-md">
                                        <Dumbbell className="w-10 h-10 text-white/10 mx-auto mb-3 animate-pulse" />
                                        <p className="text-white/80 text-xs font-mono font-bold uppercase tracking-wider">
                                          Database Entry Found: 0 Sessions
                                        </p>
                                        <p className="text-[10px] text-white/40 mt-1 max-w-[420px] mx-auto leading-relaxed font-sans">
                                          "{activeEx}" is registered in the database, but you haven't recorded exercises for it yet. Complete and save a routine workout with sets of this exercise to populate this progress tracker!
                                        </p>
                                      </div>
                                    );
                                  }

                                  const { firstSet, lastSet, weightDiff, percentDiff, maxWeight, count, allSets } = stats;

                                  const isAssisted = activeEx.toLowerCase().includes("assisted");
                                  const weights = allSets.map((s) => s.weight);
                                  const displayWeightDiff = isAssisted ? (firstSet.weight - lastSet.weight) : weightDiff;
                                  const displayPercentDiff = isAssisted 
                                    ? (firstSet.weight > 0 ? (displayWeightDiff / firstSet.weight) * 100 : 0)
                                    : percentDiff;

                                  // Format data for chart
                                  const chartPoints = allSets.map((s, index) => {
                                    let label = "";
                                    try {
                                      const d = new Date(s.date);
                                      label = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
                                    } catch {
                                      label = s.date;
                                    }
                                    return {
                                      index: index + 1,
                                      weight: s.weight,
                                      reps: s.reps,
                                      date: label,
                                      fullDate: s.date,
                                      workout: s.workoutName,
                                      volume: s.weight * s.reps
                                    };
                                  });

                                  const trendColor = displayWeightDiff > 0 ? "text-gym-accent" : displayWeightDiff < 0 ? "text-rose-500" : "text-white/50";
                                  const trendBg = displayWeightDiff > 0 ? "bg-gym-accent/5 border-gym-accent/15" : displayWeightDiff < 0 ? "bg-rose-500/5 border-rose-500/15" : "bg-white/5 border-white/10";

                                  return (
                                    <div className="space-y-6 animate-fade-in">
                                      {/* Header for Active Exercise Tracker */}
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/5 pt-5">
                                        <div>
                                          <span className="text-[9px] font-mono text-gym-accent tracking-widest uppercase font-black animate-pulse">
                                            ACTIVE TARGET IN FOCUS
                                          </span>
                                          <h4 className="text-lg font-light text-white italic font-serif">
                                            {activeEx}
                                          </h4>
                                        </div>
                                        <div className="shrink-0 flex items-center gap-1.5">
                                          <span className="text-[9px] font-mono bg-white/[0.04] border border-white/10 text-white/55 px-2 py-0.5 rounded-md">
                                            {count} sets logged
                                          </span>
                                        </div>
                                      </div>

                                      {/* Compare stats grid */}
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {/* First Ever Set weight log */}
                                        <div className="bg-black/30 border border-white/5 rounded-md p-4 relative overflow-hidden flex flex-col justify-between min-h-[90px]">
                                          <div>
                                            <span className="text-[8px] text-white/30 uppercase tracking-wider font-bold block mb-1">
                                              First Ever Recorded Set
                                            </span>
                                            <span className="text-2xl font-light font-mono text-white/90">
                                              {firstSet.weight} <span className="text-xs text-white/40">KG</span>
                                            </span>
                                          </div>
                                          <div className="mt-2 text-[9px] text-white/50 font-mono tracking-tight flex items-center justify-between border-t border-white/[0.02] pt-1.5">
                                            <span>{firstSet.reps} reps</span>
                                            <span className="text-white/30 text-[8px]">{firstSet.date}</span>
                                          </div>
                                        </div>

                                        {/* Most Recent Set weight log */}
                                        <div className="bg-black/30 border border-white/5 rounded-md p-4 relative overflow-hidden flex flex-col justify-between min-h-[90px]">
                                          <div>
                                            <span className="text-[8px] text-white/30 uppercase tracking-wider font-bold block mb-1">
                                              Most Recent Recorded Set
                                            </span>
                                            <span className="text-2xl font-black font-mono text-white">
                                              {lastSet.weight} <span className="text-xs text-white/40">KG</span>
                                            </span>
                                          </div>
                                          <div className="mt-2 text-[9px] text-white/50 font-mono tracking-tight flex items-center justify-between border-t border-white/[0.02] pt-1.5">
                                            <span>{lastSet.reps} reps</span>
                                            <span className="text-[8px] text-gym-accent font-black">{lastSet.date}</span>
                                          </div>
                                        </div>

                                        {/* Absolute & relative progress delta */}
                                        <div className={`border rounded-md p-4 relative overflow-hidden flex flex-col justify-between min-h-[90px] ${trendBg}`}>
                                          <div>
                                            <span className="text-[8px] text-white/30 uppercase tracking-wider font-bold block mb-1">
                                              {isAssisted ? "Assistance reduction adaptation" : "Progression adaptation Delta"}
                                            </span>
                                            <span className={`text-2xl font-black font-mono ${trendColor}`}>
                                              {displayWeightDiff > 0 ? "+" : ""}{displayWeightDiff} <span className="text-xs font-normal font-sans">KG</span>
                                            </span>
                                          </div>
                                          <div className={`mt-2 text-[9px] font-mono tracking-tight flex items-center justify-between border-t border-white/[0.02] pt-1.5`}>
                                            <span className={trendColor}>
                                              {displayWeightDiff > 0 ? "+" : ""}{displayPercentDiff.toFixed(1)}%
                                            </span>
                                            <span className="text-white/30 text-[8px]">
                                              {isAssisted 
                                                ? (displayWeightDiff > 0 ? "Assistance Reduced" : displayWeightDiff < 0 ? "Assistance Added" : "Neutral State")
                                                : (displayWeightDiff > 0 ? "Overload Increase" : displayWeightDiff < 0 ? "Delift Adjustment" : "Neutral State")
                                              }
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Chart Section - Visual line graph showing progress */}
                                      <div className="bg-white/[0.005] border border-white/[0.03] p-4 rounded-md">
                                        <div className="flex justify-between items-center mb-3">
                                          <span className="text-[9px] text-white/40 font-mono uppercase tracking-wider">
                                            {isAssisted 
                                              ? "Chronological Assistance timeline (Less weight is higher progression)" 
                                              : "Chronological Load timeline (Daily Highest Weight)"}
                                          </span>
                                          <span className="text-[8px] text-white/20 font-mono uppercase">
                                            {isAssisted ? "Min assistance" : "Peak lift"}: {isAssisted ? Math.min(...weights) : maxWeight} KG
                                          </span>
                                        </div>

                                        {/* Chart plotting */}
                                        <div className="w-full h-[180px] font-mono text-[9px] relative z-10">
                                          <ResponsiveContainer width="100%" height="100%">
                                            <RechartsLineChart
                                              data={chartPoints}
                                              margin={{ top: 10, right: 15, left: -25, bottom: 0 }}
                                            >
                                              <XAxis 
                                                dataKey="date" 
                                                tickLine={false}
                                                axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }}
                                                tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 8 }}
                                              />
                                              <YAxis 
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 8 }}
                                                domain={[Math.max(0, Math.min(...chartPoints.map(c => c.weight)) - 5), Math.max(...chartPoints.map(c => c.weight)) + 5]}
                                                reversed={isAssisted}
                                              />
                                              <Tooltip 
                                                cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 1, strokeDasharray: '3 3' }}
                                                content={({ active, payload }) => {
                                                  if (active && payload && payload.length) {
                                                    const d = payload[0].payload;
                                                    return (
                                                      <div className="bg-zinc-950/95 border border-white/10 px-2.5 py-1.5 rounded-md font-mono text-[9px] shadow-xl">
                                                        <span className="text-white/30 block text-[7.5px] uppercase">{d.workout}</span>
                                                        <span className="text-white font-black block mt-0.5">{d.date}</span>
                                                        <span className="text-gym-accent font-black block mt-1">{d.weight} KG &times; {d.reps} reps</span>
                                                        <span className="text-white/45 block text-[8px] mt-0.5 font-sans">Vol: {d.volume} kg</span>
                                                      </div>
                                                    );
                                                  }
                                                  return null;
                                                }}
                                              />
                                              <Line 
                                                type="monotone"
                                                dataKey="weight" 
                                                stroke="#d4ff00" 
                                                strokeWidth={2}
                                                dot={{ r: 3, fill: '#0a0a0a', stroke: '#d4ff00', strokeWidth: 1.5 }}
                                                activeDot={{ r: 5, fill: '#d4ff00', stroke: '#0a0a0a', strokeWidth: 1.5 }}
                                              />
                                            </RechartsLineChart>
                                          </ResponsiveContainer>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            );
                          })()}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Calorie Tracker Section */}
                <div className="border border-white/15 rounded-md overflow-hidden bg-black/70 backdrop-blur-md">
                  <button
                    onClick={() =>
                      setExpandedProgressSections((prev) => ({
                        ...prev,
                        calorieTracker: !prev.calorieTracker,
                      }))
                    }
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-white/[0.04] transition-all cursor-pointer group backdrop-blur-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center text-gym-accent group-hover:bg-gym-accent/20 group-hover:border-gym-accent/40 transition-all shrink-0">
                        <Flame className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-xl font-light italic font-serif flex items-center gap-3 mb-1">
                          Calorie Tracker
                        </h3>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                          Comprehensive metabolic & training energy output
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-white/20 group-hover:text-gym-accent transition-all ${expandedProgressSections.calorieTracker ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {expandedProgressSections.calorieTracker && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-10 pt-4">
                          {(() => {
                            const getWorkoutCalories = (w: any) => {
                              if (w.sets && w.sets.length > 0) {
                                return calculateCaloriesBurned(w.sets, profile);
                              }
                              return w.estimatedCalories || w.caloriesBurned || 0;
                            };

                            // Aggregate total and daily
                            let totalCombinedCalories = 0;
                            const dailyMap: Record<
                              string,
                              { date: string; calories: number; count: number }
                            > = {};

                            archivedWorkouts.forEach((w) => {
                              const cal = getWorkoutCalories(w);
                              totalCombinedCalories += cal;

                              const d =
                                w.date ||
                                new Date().toISOString().split("T")[0];
                              if (!dailyMap[d]) {
                                dailyMap[d] = {
                                  date: d,
                                  calories: 0,
                                  count: 0,
                                };
                              }
                              dailyMap[d].calories += cal;
                              dailyMap[d].count += 1;
                            });

                            const sortedDays = Object.values(dailyMap).sort(
                              (a, b) => b.date.localeCompare(a.date),
                            );
                            const chronologicalDays = [...sortedDays].sort(
                              (a, b) => a.date.localeCompare(b.date),
                            );

                            return (
                              <div className="space-y-8">
                                {/* Total Combined Display Card */}
                                <div className="bg-[#0c0c0c] border border-white/5 rounded-md p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <Flame className="w-8 h-8 text-gym-accent animate-pulse shrink-0" />
                                    <div>
                                      <h4 className="text-sm font-semibold text-white tracking-widest uppercase mb-1">
                                        Total Everyday Combined
                                      </h4>
                                      <p className="text-[10px] text-white/40 tracking-wider">
                                        All-time active workout calories
                                        expended
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-center sm:text-right">
                                    <span className="text-4xl font-light text-gym-accent tracking-tighter tabular-nums">
                                      {totalCombinedCalories.toLocaleString()}{" "}
                                      <span className="text-sm font-serif italic text-white/50 lowercase">
                                        kcal
                                      </span>
                                    </span>
                                  </div>
                                </div>

                                {/* Active Calorie Track over Time (Graph) */}
                                <div className="space-y-3">
                                  <h4 className="text-[10px] text-white/40 font-bold uppercase tracking-[0.25em]">
                                    Output Distribution over Time
                                  </h4>
                                  <div className="h-[250px] w-full bg-[#050505]/40 border border-white/5 rounded-md p-4">
                                    {chronologicalDays.length === 0 ? (
                                      <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/5 rounded-md">
                                        <Flame className="w-8 h-8 text-white/10 mb-2" />
                                        <p className="text-white/20 text-xs">
                                          No active caloric progression logged
                                          yet
                                        </p>
                                      </div>
                                    ) : (
                                      <motion.div
                                        className="h-full w-full"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                          duration: 0.8,
                                          ease: "easeOut",
                                        }}
                                      >
                                        <ResponsiveContainer
                                          width="100%"
                                          height="100%"
                                        >
                                          <AreaChart
                                            data={chronologicalDays}
                                            margin={{
                                              top: 10,
                                              right: 10,
                                              left: -20,
                                              bottom: 0,
                                            }}
                                          >
                                            <defs>
                                              <linearGradient
                                                id="colorCalorieTracker"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                              >
                                                <stop
                                                  offset="5%"
                                                  stopColor={activeTheme.accent}
                                                  stopOpacity={0.25}
                                                />
                                                <stop
                                                  offset="95%"
                                                  stopColor={activeTheme.accent}
                                                  stopOpacity={0}
                                                />
                                              </linearGradient>
                                            </defs>
                                            <CartesianGrid
                                              strokeDasharray="3 3"
                                              stroke="#ffffff03"
                                              vertical={false}
                                            />
                                            <XAxis
                                              dataKey="date"
                                              stroke="#ffffff20"
                                              fontSize={9}
                                              tickLine={false}
                                              axisLine={false}
                                              dy={10}
                                              minTickGap={20}
                                              tickFormatter={(str) => {
                                                if (!str) return "";
                                                try {
                                                  const [y, m, d] = str
                                                    .split("-")
                                                    .map(Number);
                                                  const date = new Date(
                                                    y,
                                                    m - 1,
                                                    d,
                                                  );
                                                  return date.toLocaleDateString(
                                                    "en-GB",
                                                    {
                                                      day: "numeric",
                                                      month: "short",
                                                    },
                                                  );
                                                } catch (e) {
                                                  return str;
                                                }
                                              }}
                                            />
                                            <YAxis
                                              stroke="#ffffff20"
                                              fontSize={9}
                                              tickLine={false}
                                              axisLine={false}
                                              width={40}
                                              tickFormatter={(val) => `${val}`}
                                            />
                                            <Tooltip
                                              cursor={{
                                                stroke: activeTheme.accent,
                                                strokeWidth: 1,
                                                strokeDasharray: "3 3",
                                              }}
                                              contentStyle={{
                                                backgroundColor: "#0a0a0a",
                                                borderColor: "#ffffff10",
                                                borderRadius: "2px",
                                                boxShadow:
                                                  "0 10px 30px rgba(0,0,0,0.8)",
                                                padding: "10px",
                                              }}
                                              itemStyle={{
                                                color: activeTheme.accent,
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                              }}
                                              labelStyle={{
                                                color: "#ffffff40",
                                                fontSize: "9px",
                                                textTransform: "uppercase",
                                                fontWeight: "900",
                                                marginBottom: "2px",
                                              }}
                                              labelFormatter={(str) => {
                                                if (!str) return "Date";
                                                try {
                                                  const [y, m, d] = str
                                                    .split("-")
                                                    .map(Number);
                                                  const date = new Date(
                                                    y,
                                                    m - 1,
                                                    d,
                                                  );
                                                  return date.toLocaleDateString(
                                                    "en-GB",
                                                    {
                                                      weekday: "long",
                                                      day: "numeric",
                                                      month: "long",
                                                    },
                                                  );
                                                } catch (e) {
                                                  return str;
                                                }
                                              }}
                                              formatter={(value: any) => [
                                                `${value} kcal`,
                                                "Calories",
                                              ]}
                                            />
                                            <Area
                                              type="monotone"
                                              dataKey="calories"
                                              stroke={activeTheme.accent}
                                              strokeWidth={2}
                                              fillOpacity={1}
                                              fill="url(#colorCalorieTracker)"
                                              animationDuration={1500}
                                            />
                                          </AreaChart>
                                        </ResponsiveContainer>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>

                                {/* Collapsible Daily Breakdown List */}
                                <div>
                                  <div className="mt-6 flex justify-between items-center pb-2 border-b border-white/5">
                                    <h4 className="text-[10px] text-white/40 font-bold uppercase tracking-[0.25em]">
                                      Daily Energy Output History
                                    </h4>
                                    {sortedDays.length > 0 && (
                                      <button
                                        onClick={() =>
                                          setShowCalorieHistoryList(
                                            !showCalorieHistoryList,
                                          )
                                        }
                                        className="flex items-center gap-2 group cursor-pointer"
                                      >
                                        <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold group-hover:text-gym-accent transition-colors">
                                          {showCalorieHistoryList
                                            ? "Hide History Log"
                                            : `Show History Log (${sortedDays.length})`}
                                        </span>
                                        <ChevronDown
                                          className={`w-3.5 h-3.5 text-white/30 group-hover:text-gym-accent transition-transform duration-300 ${showCalorieHistoryList ? "rotate-180" : ""}`}
                                        />
                                      </button>
                                    )}
                                  </div>

                                  {sortedDays.length === 0 ? (
                                    <div className="text-center py-10 border border-dashed border-white/5 rounded-md bg-black/30 mt-4">
                                      <p className="text-xs text-white/30 font-light">
                                        No logged workout calorie telemetry
                                        found
                                      </p>
                                      <p className="text-[9px] text-white/20 mt-1 uppercase tracking-widest">
                                        Complete workout sessions in the Session
                                        tab to begin tracking
                                      </p>
                                    </div>
                                  ) : (
                                    <AnimatePresence>
                                      {showCalorieHistoryList && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{
                                            height: "auto",
                                            opacity: 1,
                                          }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.25 }}
                                          className="overflow-hidden mt-4"
                                        >
                                          <div className="divide-y divide-white/5 border border-white/10 rounded-md overflow-hidden bg-[#070707]/60 max-h-[300px] overflow-y-auto no-scrollbar">
                                            {sortedDays.map((day) => (
                                              <div
                                                key={day.date}
                                                className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
                                              >
                                                <div className="flex items-center gap-3">
                                                  <div className="w-1.5 h-1.5 rounded-full bg-gym-accent" />
                                                  <div>
                                                    <span className="text-xs font-semibold text-white/80 tracking-wider font-mono">
                                                      {day.date}
                                                    </span>
                                                    <span className="text-[9px] text-white/30 ml-3 uppercase tracking-widest">
                                                      ({day.count}{" "}
                                                      {day.count === 1
                                                        ? "evolution"
                                                        : "evolutions"}
                                                      )
                                                    </span>
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <span className="text-sm font-light text-gym-accent tabular-nums">
                                                    {day.calories.toLocaleString()}
                                                  </span>
                                                  <span className="text-[9px] font-serif italic text-white/40 lowercase">
                                                    kcal
                                                  </span>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Progress Report Trigger Button */}
                <div className="flex justify-center pt-8 pb-4">
                  <button
                    type="button"
                    onClick={() => setShowProgressReport(true)}
                    className="px-8 py-4 bg-gradient-to-r from-gym-accent to-gym-accent-light text-black hover:brightness-110 transition-all font-black uppercase tracking-widest text-xs rounded-md cursor-pointer accent-shadow-btn flex items-center gap-2.5 active:scale-[0.98]"
                  >
                    <Trophy className="w-4 h-4 text-black animate-pulse" />
                    Generate Progress Report
                  </button>
                </div>
              </motion.div>
            ) : activeView === "anatomy" ? (
              <motion.div
                key="anatomy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="border-b border-white/5 pb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-light italic font-serif flex items-center gap-3 mb-1">
                      Anatomical & Performance Matrix
                    </h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                      Dynamic Biomechanical Analysis & Power Standards
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] bg-gym-accent/10 border border-gym-accent/20 px-3 py-1 text-gym-accent font-mono uppercase tracking-widest">
                      Live Analyzer Active
                    </span>
                  </div>
                </div>

                <AnatomyDashboard
                  sessionSets={sessionSets}
                  archivedWorkouts={archivedWorkouts}
                  profile={syncedProfile || profile}
                  saveSettings={saveSettings}
                  setToast={setToast}
                  setActiveView={setActiveView}
                  routines={routines}
                  muscleGroupStrengthData={muscleGroupStrengthData}
                  activeTheme={activeTheme}
                />
              </motion.div>
            ) : activeView === "session" ? (
              <motion.div
                key="session"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8 pb-20"
              >
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-xl font-light italic font-serif flex items-center gap-3">
                      Session Records
                    </h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-1">
                      Archived workout intelligence
                    </p>
                  </div>

                  <div className="flex items-center gap-4"></div>
                </div>

                {archivedWorkouts.length === 0 && sessionSets.length === 0 ? (
                  <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <Dumbbell className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/30 font-medium">
                      No archived sessions found.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Active Performance Log Section */}
                    {sessionSets.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-12"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                          <h4 className="text-[10px] text-gym-accent font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                            <Activity className="w-4 h-4" />
                            Active Performance Log
                          </h4>
                          <button
                            onClick={() => {
                              setActiveView("workout");
                              setWorkoutInnerTab("program");
                              saveSettings({ activeView: "workout" });
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gym-accent/10 hover:bg-gym-accent/20 border border-gym-accent/30 hover:border-gym-accent/60 text-gym-accent text-[9px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer"
                          >
                            <ClipboardList className="w-3.5 h-3.5" />
                            Back to Plan
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(
                            sessionSets.reduce(
                              (acc, set) => {
                                if (!acc[set.exerciseName])
                                  acc[set.exerciseName] = [];
                                acc[set.exerciseName].push(set);
                                return acc;
                              },
                              {} as Record<string, SessionSet[]>,
                            ),
                          ).map(
                            ([name, exerciseSets]: [string, SessionSet[]]) => (
                              <div
                                key={name}
                                className="bg-black/65 border border-gym-accent/40 rounded-md p-4 relative overflow-hidden group backdrop-blur-md"
                              >
                                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-white/60 uppercase">
                                      {name}
                                    </span>
                                    <button
                                      onClick={() => {
                                        const ex = findExerciseByName(name);
                                        if (ex) setGuidanceEx(ex);
                                      }}
                                      className="p-1 text-white/10 hover:text-gym-accent transition-all cursor-pointer"
                                      title="View Guidance"
                                    >
                                      <BookOpen className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <span className="text-[9px] text-gym-accent font-black uppercase tracking-widest">
                                    {exerciseSets.length} Sets
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <AnimatePresence initial={false}>
                                    {exerciseSets.map((s, idx) => {
                                      const ex = findExerciseByName(name);
                                      const isCardio = ex?.pool === "cardio";
                                      return (
                                        <motion.div
                                          key={s.id || `session-${idx}`}
                                          initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                                          animate={{ height: "auto", opacity: 1, marginBottom: 8 }}
                                          exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                                          transition={{ duration: 0.2 }}
                                          style={{ overflow: "hidden" }}
                                        >
                                          <div
                                            className="flex items-center justify-between group/set"
                                          >
                                            <div className="flex items-center gap-3 flex-wrap min-w-0">
                                              {isCardio ? (
                                                <>
                                                  <span className="text-[11px] tabular-nums text-white/90">
                                                    {s.weight} min
                                                  </span>
                                                  <span className="text-[11px] tabular-nums text-white/40">
                                                    @
                                                  </span>
                                                  <span className="text-[11px] tabular-nums text-white/90">
                                                    Lvl {s.reps}
                                                  </span>
                                                </>
                                              ) : (
                                                <>
                                                  <span className="text-[11px] tabular-nums text-white/90">
                                                    {s.weight}kg
                                                  </span>
                                                  <span className="text-[11px] tabular-nums text-white/40">
                                                    ×
                                                  </span>
                                                  <span className="text-[11px] tabular-nums text-white/90">
                                                    {s.reps}
                                                  </span>
                                                </>
                                              )}
                                              {s.notes && (
                                                <span
                                                  onClick={() => setViewingNote(s.notes)}
                                                  className="px-1.5 py-0.5 bg-gym-accent/15 border border-gym-accent/35 text-gym-accent text-[8px] font-bold rounded-md uppercase tracking-wide truncate max-w-[120px] cursor-pointer hover:bg-gym-accent/30 hover:border-gym-accent/50 transition-all active:scale-95"
                                                  title="Click to view full note"
                                                >
                                                  {s.notes}
                                                </span>
                                              )}
                                            </div>
                                            <button
                                              onClick={() =>
                                                s.id && handleDeleteSet(s.id)
                                              }
                                              className="opacity-80 hover:opacity-100 p-1 text-red-500 hover:text-red-400 transition-all cursor-pointer"
                                              title="Delete set"
                                            >
                                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                            </button>
                                          </div>
                                        </motion.div>
                                      );
                                    })}
                                  </AnimatePresence>
                                </div>
                              </div>
                            ),
                          )}
                        </div>

                        {/* Console Intelligence HUD Widgets */}
                        <ConsoleIntelligencePanel
                          sessionSets={sessionSets}
                          archivedWorkouts={archivedWorkouts}
                          findExerciseByName={findExerciseByName}
                          currentDays={currentDays}
                          lastLoadedDayIndex={lastLoadedDayIndex}
                        />

                        {/* Dynamic Calorie Tracker progress bar under logged exercises */}
                        {(() => {
                          const estimatedCals = calculateCaloriesBurned(
                            sessionSets,
                            profile,
                          );
                          const targetCals = 600;
                          const pct = Math.min(
                            100,
                            Math.round((estimatedCals / targetCals) * 100),
                          );

                          return (
                            <div className="mt-8 bg-[#0a0a0a]/80 border border-white/10 rounded-md p-6 relative overflow-hidden backdrop-blur-md">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                  <Flame className="w-5 h-5 text-gym-accent animate-pulse" />
                                  <div>
                                    <h5 className="text-xs font-semibold text-white tracking-widest uppercase">
                                      Calorie Tracker Estimator
                                    </h5>
                                    <p className="text-[10px] text-white/40 tracking-wider">
                                      Dynamic energy assessment based on your
                                      bio-metrics & logged sets
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-3xl font-light text-gym-accent tracking-tighter tabular-nums">
                                    {estimatedCals}{" "}
                                    <span className="text-xs uppercase font-serif italic text-white/50">
                                      kcal
                                    </span>
                                  </span>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full bg-[#141414] h-2.5 rounded-full overflow-hidden border border-white/5 p-0.5 mb-2">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  className="h-full bg-gradient-to-r from-red-600 to-gym-accent rounded-full"
                                  transition={{
                                    duration: 0.5,
                                    ease: "easeOut",
                                  }}
                                />
                              </div>

                              <div className="flex justify-between items-center text-[8px] text-white/30 uppercase font-black tracking-widest pl-1">
                                <span>0 kcal</span>
                                <span>Target: {targetCals} kcal</span>
                              </div>

                              {/* Dynamic Session Stopwatch & Calibration Panel */}
                              <div className="mt-6 pt-5 border-t border-white/5 flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-md">
                                  <div className="flex items-center gap-2">
                                    <Timer className={`w-4 h-4 ${profile?.timerActive ? "text-gym-accent animate-spin" : "text-white/40"}`} style={{ animationDuration: "3s" }} />
                                    <div>
                                      <div className="text-[10px] font-black uppercase text-white/80 tracking-wider">Workout Session Stopwatch</div>
                                      <div className="text-[9px] text-white/40">Calibrate accurate rest time by logging session duration</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 animate-fade-in">
                                    {profile?.timerActive ? (
                                      <button
                                        onClick={async () => {
                                          const startMs = profile?.timerStartTime ? Date.parse(profile.timerStartTime) : NaN;
                                          const elapsed = !isNaN(startMs) ? (Date.now() - startMs) : 0;
                                          const newAccumulated = (profile?.timerAccumulatedMs || 0) + elapsed;
                                          await saveSettings({
                                            timerActive: false,
                                            timerEndTime: new Date().toISOString(),
                                            timerStartTime: null,
                                            timerAccumulatedMs: newAccumulated,
                                          });
                                          setToast({ message: "Workout session timer stopped!", type: "success" });
                                          setTimeout(() => setToast(null), 3000);
                                        }}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-650 hover:bg-red-500 text-white rounded-md text-[9px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors"
                                      >
                                        <Square className="w-2.5 h-2.5 fill-current" /> Stop Stopwatch
                                      </button>
                                    ) : (
                                      <button
                                        onClick={async () => {
                                          await saveSettings({
                                            timerActive: true,
                                            timerStartTime: new Date().toISOString(),
                                            timerEndTime: null,
                                            timerManualDuration: 0,
                                            timerAccumulatedMs: profile?.timerAccumulatedMs || 0,
                                          });
                                          setToast({ message: "Workout session timer started!", type: "success" });
                                          setTimeout(() => setToast(null), 3000);
                                        }}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gym-accent hover:bg-gym-accent-light text-black rounded-md text-[9px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors"
                                      >
                                        <Play className="w-2.5 h-2.5 fill-current animate-pulse" /> {profile?.timerAccumulatedMs && profile.timerAccumulatedMs > 0 ? "Resume Stopwatch" : "Start Stopwatch"}
                                      </button>
                                    )}
                                    
                                    {(profile?.timerStartTime || (profile?.timerManualDuration && profile.timerManualDuration > 0) || (profile?.timerAccumulatedMs && profile.timerAccumulatedMs > 0)) && (
                                      <button
                                        onClick={async () => {
                                          await saveSettings({
                                            timerStartTime: null,
                                            timerEndTime: null,
                                            timerActive: false,
                                            timerManualDuration: 0,
                                            timerAccumulatedMs: 0,
                                          });
                                          setToast({ message: "Workout session timing reset!", type: "info" });
                                          setTimeout(() => setToast(null), 3000);
                                        }}
                                        className="px-2.5 py-1.5 border border-white/10 hover:border-white/20 text-white/50 hover:text-white rounded-md text-[9px] font-mono font-bold uppercase cursor-pointer transition-colors"
                                        title="Reset timers and overrides"
                                      >
                                        Reset
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                  {/* Timing Status Readout */}
                                  <div className="flex flex-col justify-center bg-white/[0.01] border border-white/[0.03] p-3 rounded-md">
                                    <span className="text-[8px] text-white/30 uppercase tracking-widest font-black mb-1">Time Elapsed Status</span>
                                    <div className="flex items-baseline gap-1.5">
                                      {(() => {
                                        if (profile?.timerManualDuration && profile.timerManualDuration > 0) {
                                          return (
                                            <>
                                              <span className="text-lg font-mono text-emerald-400 font-bold">{profile.timerManualDuration}m</span>
                                              <span className="text-[9px] text-white/40">(Manual Override Mode)</span>
                                            </>
                                          );
                                        }
                                        const durationMs = getStopwatchDurationMs(profile);
                                        if (durationMs > 0) {
                                          const rawSecs = Math.max(0, Math.floor(durationMs / 1000));
                                          const mins = Math.floor(rawSecs / 60);
                                          const secs = rawSecs % 60;
                                          const formatMins = mins > 0 ? `${mins}m ` : "";
                                          const displayTime = `${formatMins}${secs}s`;
                                          return (
                                            <>
                                              <span className={`text-lg font-mono font-bold ${profile?.timerActive ? "text-gym-accent animate-pulse" : "text-white/85"}`}>
                                                {displayTime}
                                              </span>
                                              <span className="text-[8px] text-white/40 font-mono">
                                                ({profile?.timerActive ? "Stopwatch Active" : "Stopwatch Paused"})
                                              </span>
                                            </>
                                          );
                                        }
                                        return (
                                          <>
                                            <span className="text-xs font-mono text-white/30 italic">Not Tracked</span>
                                            <span className="text-[8px] text-white/35 font-mono">(Using Proportional Estimator)</span>
                                          </>
                                        );
                                      })()}
                                    </div>
                                  </div>

                                  {/* Fail-safe Manual override minutes input */}
                                  <div className="flex flex-col justify-center bg-white/[0.01] border border-white/[0.03] p-3 rounded-md">
                                    <label className="text-[8px] text-white/30 uppercase tracking-widest font-black mb-1.5 flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-white/30" /> Manual Override Calibration (Fail-safe)
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        min="1"
                                        max="360"
                                        value={profile?.timerManualDuration || ""}
                                        onChange={async (e) => {
                                          const val = parseInt(e.target.value, 10);
                                          await saveSettings({
                                            timerManualDuration: isNaN(val) ? 0 : val,
                                            timerActive: false, // overrides automatic timing immediately
                                          });
                                        }}
                                        placeholder="Enter exact session minutes directly (e.g. 45)"
                                        className="flex-1 bg-black/50 border border-white/10 rounded-md px-2 py-1 text-[10px] text-white focus:outline-none focus:border-gym-accent/30 font-mono placeholder:text-white/15"
                                      />
                                      <span className="text-[9px] font-mono text-white/30">min</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        <div className="mt-8 flex items-center justify-center gap-4">
                          <button
                            onClick={handleClearActiveSession}
                            className="px-6 py-4 border border-red-500/20 text-red-500/60 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-all cursor-pointer rounded-md"
                          >
                            Discard Session
                          </button>
                          <button
                            onClick={handleArchiveWorkout}
                            className="px-6 py-4 border border-gym-accent/30 text-gym-accent text-[10px] font-bold uppercase tracking-widest hover:bg-gym-accent/10 transition-all cursor-pointer rounded-md flex items-center gap-3"
                          >
                            <Save className="w-4 h-4 animate-pulse" />
                            Capture Workout Session
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Archived Sessions Section */}
                    {archivedWorkouts.length > 0 && (
                      <div className="space-y-8">
                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                          <h4 className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                            <History className="w-4 h-4 text-gym-accent" />
                            Archived Evolutions
                          </h4>

                          <div className="relative">
                            <button
                              onClick={() =>
                                setShowHistoryMenu(!showHistoryMenu)
                              }
                              className="bg-black/60 border border-white/20 px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest text-gym-accent hover:bg-black/80 transition-all flex items-center gap-3 cursor-pointer"
                            >
                              <History className="w-3 h-3" />
                              {selectedWorkoutId &&
                              archivedWorkouts.find(
                                (w) => w.id === selectedWorkoutId,
                              )
                                ? archivedWorkouts.find(
                                    (w) => w.id === selectedWorkoutId,
                                  )?.date
                                : "History Explorer"}
                              <ChevronDown
                                className={`w-3 h-3 transition-transform ${showHistoryMenu ? "rotate-180" : ""}`}
                              />
                            </button>

                            <AnimatePresence>
                              {showHistoryMenu && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  className="absolute top-full right-0 mt-2 w-64 bg-black border border-white/20 rounded-md shadow-2xl z-50 overflow-hidden"
                                >
                                  <div className="max-h-72 overflow-y-auto py-2">
                                    {archivedWorkouts.map((w) => {
                                      const d = new Date(w.date);
                                      return (
                                        <div
                                          key={w.id}
                                          className={`group/item w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center justify-between ${selectedWorkoutId === w.id ? "bg-gym-accent/10 border-l-2 border-gym-accent" : ""}`}
                                        >
                                          <div
                                            className="flex flex-col flex-grow cursor-pointer"
                                            onClick={() => {
                                              setSelectedWorkoutId(w.id);
                                              setShowHistoryMenu(false);
                                            }}
                                          >
                                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                                              {d.toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                              })}
                                            </span>
                                            <span className="text-[9px] text-white/20 uppercase">
                                              {d.toLocaleDateString("en-GB", {
                                                weekday: "long",
                                              })}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-3 font-mono">
                                            <div className="text-[10px] text-gym-accent/60 font-bold tabular-nums flex flex-col items-end">
                                              <span>{w.exercisesCount} Ex</span>
                                              <span className="text-[8px] text-white/40 font-normal">
                                                {Math.round(
                                                  w.estimatedCalories ||
                                                    calculateCaloriesBurned(
                                                      w.sets || [],
                                                      profile,
                                                    ),
                                                )}{" "}
                                                kcal
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Selected or Latest Workout Display */}
                        {(() => {
                          const workout = selectedWorkoutId
                            ? archivedWorkouts.find(
                                (w) => w.id === selectedWorkoutId,
                              )
                            : null;

                          if (!workout) {
                            return (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center p-20 border border-white/5 border-dashed rounded-md bg-white/[0.01]"
                              >
                                <History className="w-12 h-12 text-white/5 mb-6" />
                                <h3 className="text-xl font-serif italic text-white/40 text-center px-10">
                                  Sync Required: Select Another Session Date
                                  Above
                                </h3>
                                <p className="text-[10px] text-gym-accent/30 uppercase tracking-[0.4em] font-black mt-4">
                                  Evolutionary records are available in the
                                  history explorer
                                </p>
                              </motion.div>
                            );
                          }

                          const dateObj = new Date(workout.date);
                          return (
                            <motion.div
                              key={workout.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border border-white/15 rounded-md overflow-hidden bg-black/70 backdrop-blur-md"
                            >
                              <div className="p-8 border-b border-white/5 bg-black/45 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-8">
                                  <div className="w-16 h-16 bg-gym-accent/15 border border-gym-accent/30 rounded-md flex flex-col items-center justify-center">
                                    <span className="text-xl font-light text-gym-accent">
                                      {dateObj.getDate()}
                                    </span>
                                    <span className="text-[9px] font-black text-gym-accent/60 uppercase tracking-tighter">
                                      {dateObj.toLocaleDateString("en-GB", {
                                        month: "short",
                                      })}
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="text-3xl font-light italic font-serif text-white/90 mb-1">
                                      {dateObj.toLocaleDateString("en-GB", {
                                        weekday: "long",
                                      })}
                                    </h4>
                                    <div className="flex items-center gap-6 flex-wrap">
                                      <div className="flex items-center gap-2">
                                        <Activity className="w-3 h-3 text-gym-accent" />
                                        <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                                          {workout.totalVolume?.toLocaleString()}{" "}
                                          kg Volume
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Dumbbell className="w-3 h-3 text-gym-accent" />
                                        <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                                          {workout.exercisesCount} Exercises
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Flame className="w-3 h-3 text-gym-accent animate-pulse" />
                                        <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                                          {Math.round(
                                            workout.estimatedCalories ||
                                              calculateCaloriesBurned(
                                                workout.sets || [],
                                                profile,
                                              ),
                                          )}{" "}
                                          kcal
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() =>
                                      setSavingRoutineWorkout(workout)
                                    }
                                    className="flex items-center gap-2 px-6 py-3 border border-gym-accent/30 bg-gym-accent/5 hover:bg-gym-accent hover:text-black hover:border-gym-accent text-gym-accent text-[10px] font-bold uppercase tracking-[0.3em] transition-all cursor-pointer group shadow-lg shadow-gym-accent/5 rounded-md"
                                  >
                                    <Save className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                    Save Routine
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteWorkout(workout.id)
                                    }
                                    disabled={dataLoading}
                                    className={`flex items-center gap-2 px-6 py-3 border rounded-md text-[10px] font-bold uppercase tracking-[0.3em] transition-all cursor-pointer group shadow-lg ${dataLoading ? "bg-white/5 border-white/10 text-white/20" : "bg-red-500/5 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 shadow-red-500/5"}`}
                                  >
                                    {dataLoading ? (
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-3.5 h-3.5 text-red-500 group-hover:text-white group-hover:scale-110 transition-transform" />
                                    )}
                                    {dataLoading
                                      ? "Excluding..."
                                      : "Exclude Record"}
                                  </button>
                                </div>
                              </div>

                              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {Object.entries(
                                  workout.sets.reduce((acc: any, set: any) => {
                                    if (!acc[set.exerciseName])
                                      acc[set.exerciseName] = [];
                                    acc[set.exerciseName].push(set);
                                    return acc;
                                  }, {}),
                                ).map(([name, exerciseSets]: [string, any]) => (
                                  <div key={name} className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <h5 className="text-[10px] text-white/80 font-bold uppercase tracking-[0.2em]">
                                        {name}
                                      </h5>
                                      <span className="text-[9px] text-white/45 font-bold uppercase">
                                        {exerciseSets.length} Sets
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      {exerciseSets.map(
                                        (s: any, idx: number) => (
                                          <div
                                            key={idx}
                                            className="bg-black/60 border border-white/10 p-3 flex flex-col justify-between gap-1.5"
                                          >
                                            <div className="flex items-center justify-between w-full">
                                              <div className="flex flex-col">
                                                <span className="text-[7px] text-white/45 uppercase font-black">
                                                  {findExerciseByName(name)
                                                    ?.pool === "cardio"
                                                    ? "Time"
                                                    : "Weight"}
                                                </span>
                                                <span className="text-sm font-semibold text-white/95 tabular-nums">
                                                  {s.weight}
                                                  {findExerciseByName(name)
                                                    ?.pool === "cardio"
                                                    ? "m"
                                                    : "kg"}
                                                </span>
                                              </div>
                                              <div className="flex flex-col items-end">
                                                <span className="text-[7px] text-white/45 uppercase font-black">
                                                  {findExerciseByName(name)
                                                    ?.pool === "cardio"
                                                    ? "Speed"
                                                    : "Reps"}
                                                </span>
                                                <span className="text-sm font-semibold text-white/95 tabular-nums">
                                                  {s.reps}
                                                </span>
                                              </div>
                                            </div>
                                            {s.notes && (
                                              <div className="mt-1 pt-1 border-t border-white/5 text-left">
                                                <span
                                                  onClick={() => setViewingNote(s.notes)}
                                                  className="text-[8px] text-gym-accent font-semibold tracking-wider uppercase block truncate cursor-pointer hover:text-gym-accent/80 transition-all hover:translate-x-0.5 active:scale-95"
                                                  title="Click to view full note"
                                                >
                                                  ✎ {s.notes}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : activeView === "routines" ? (
              <motion.div
                key="routines-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3 pb-20"
              >
                {isCreatingRoutine ? (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="pb-6 border-b border-white/5 flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <button
                            onClick={() => setIsCreatingRoutine(false)}
                            className="text-xs text-gym-accent hover:text-gym-accent/80 flex items-center gap-1 transition-colors cursor-pointer font-semibold animate-none bg-transparent border-0 p-0"
                          >
                            ← Back to Routines
                          </button>
                        </div>
                        <h3 className="text-xl font-light italic font-serif text-white">
                          Build Custom Routine
                        </h3>
                        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
                          Configure a tailored, structured guide for automatic session tracking
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsCreatingRoutine(false)}
                          className="px-4 py-2 border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-md cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveCustomRoutine}
                          className="px-5 py-2 bg-gym-accent hover:bg-gym-accent/90 text-black text-[10px] font-black uppercase tracking-widest transition-all rounded-md cursor-pointer shadow-[0_0_15px_rgba(255,231,101,0.2)] font-semibold"
                        >
                          Save Routine
                        </button>
                      </div>
                    </div>

                    {/* Routine Info Form */}
                    <div className="bg-white/[0.01] border border-white/5 p-6 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name input */}
                        <div className="space-y-2">
                          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold block">
                            Routine Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Savage Chest & Arms, Powerhouse Legs..."
                            value={newRoutineName}
                            onChange={(e) => setNewRoutineName(e.target.value)}
                            className="w-full bg-black/60 border border-white/15 hover:border-white/25 focus:border-gym-accent rounded-md px-4 py-3 text-sm font-light focus:outline-none transition-all text-white"
                          />
                        </div>

                        {/* Preload Dropdown */}
                        {routines.length > 0 && (
                          <div className="space-y-2">
                            <label className="text-[10px] text-gym-accent uppercase tracking-widest font-bold block flex items-center gap-1.5 animate-none">
                              <span className="w-1.5 h-1.5 rounded-full bg-gym-accent animate-pulse" />
                              Preload Stored Routine (Optional)
                            </label>
                            <select
                              onChange={(e) => {
                                const selected = routines.find((r) => r.id === e.target.value);
                                if (selected) {
                                  handlePreloadToBuilder(selected);
                                }
                              }}
                              defaultValue=""
                              className="w-full bg-black/80 border border-white/15 hover:border-white/25 focus:border-gym-accent text-white text-xs font-bold uppercase tracking-widest rounded-md px-4 py-3 focus:outline-none transition-all cursor-pointer shadow-md"
                            >
                              <option value="" disabled>-- Select a routine to preload & tweak --</option>
                              {[...routines].sort((a, b) => a.name.localeCompare(b.name)).map((r, ri) => (
                                <option key={r.id || ri} value={r.id}>
                                  {r.name} ({DAY_CONFIG[r.categoryIndex]?.name || "Muscle Focus"})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Muscle Split Cards Panel */}
                    <div className="space-y-3 bg-white/[0.01] border border-white/5 p-5 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest text-[#ffffff]/80">
                            Quick Muscle Split Selector
                          </h4>
                          <p className="text-[10px] text-white/35 uppercase tracking-wider font-semibold mt-0.5">
                            Visual selector for your targeted routine day focus
                          </p>
                        </div>
                        <span className="text-[8px] font-mono font-bold bg-gym-accent/5 px-2.5 py-1 rounded-md border border-gym-accent/15 text-gym-accent uppercase tracking-wider">
                          Auto Synced
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                        {DAY_CONFIG.map((day, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setNewRoutineCategory(idx);
                              // Auto name default based on theme
                              if (!newRoutineName || DAY_CONFIG.some(d => newRoutineName.startsWith(d.name) || newRoutineName.includes("Routine"))) {
                                setNewRoutineName(`${day.name} Routine`);
                              }
                            }}
                            className={`p-3 rounded border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                              newRoutineCategory === idx
                                ? "bg-gym-accent/10 border-gym-accent text-gym-accent shadow-[0_0_15px_rgba(255,231,101,0.12)] scale-[1.01]"
                                : "bg-black/45 border-white/5 text-white/50 hover:bg-white/[0.02] hover:text-white"
                            }`}
                          >
                            <div className="opacity-85 scale-110">{day.icon}</div>
                            <span className="text-[9px] font-black uppercase tracking-widest leading-none text-center">
                              {day.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Integrated Muscle Section Suggestion Engine */}
                    <div className="bg-white/[0.01] border border-gym-accent/20 rounded-md p-5 space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-gym-accent animate-pulse" />
                            <h4 className="text-sm font-semibold italic font-serif text-white uppercase tracking-wider">
                              Sectional Suggestion Engine: {DAY_CONFIG[newRoutineCategory].name}
                            </h4>
                          </div>
                          <p className="text-[10px] text-white/50 max-w-2xl leading-normal uppercase tracking-wide">
                            We selected exactly <strong>{suggestedExercises.length}</strong> complementary movements to satisfy your request. This guarantees 100% full coverage of <strong>every target muscle section / compartment</strong> list for this focus day.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setShuffleTrigger(prev => prev + 1);
                              setToast({ message: "Suggestions shuffled!", type: "success" });
                            }}
                            className="px-4 py-2.5 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest transition-all rounded-md cursor-pointer"
                          >
                            🔄 Reshuffle
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLoadSuggestedExercises(suggestedExercises)}
                            className="px-4 py-2.5 bg-gym-accent hover:bg-gym-accent/90 text-black text-[9px] font-black uppercase tracking-widest transition-all rounded-md cursor-pointer shadow-[0_0_12px_rgba(255,231,101,0.2)] font-semibold"
                          >
                            ⚡ Load Suggestions (Replace All)
                          </button>
                        </div>
                      </div>

                      {/* Horizontal display of suggested exercises */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                        {suggestedExercises.map((ex, i) => {
                          const isAlreadyAdded = newRoutineExercises.some(r => r.exerciseName.toLowerCase() === ex.name.toLowerCase());
                          // Nicer pool labels
                          const poolLabel = ex.pool
                            .split('_')
                            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(' ');

                          return (
                            <div 
                              key={i} 
                              className={`p-3 rounded border text-left flex flex-col justify-between min-h-[90px] transition-all relative ${
                                isAlreadyAdded 
                                  ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
                                  : "bg-black/50 border-white/5 text-white/90 hover:bg-white/[0.02]"
                              }`}
                            >
                              <div className="min-w-0">
                                <span className="text-[8px] text-gym-accent font-mono block mb-1 uppercase tracking-wider font-extrabold">{poolLabel}</span>
                                <p className="text-[10px] font-bold leading-tight line-clamp-2">{ex.name}</p>
                              </div>
                              <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                                {!isAlreadyAdded ? (
                                  <button
                                    type="button"
                                    onClick={() => handleAddExercise(ex.name)}
                                    className="text-[9px] font-bold text-gym-accent hover:text-white uppercase tracking-wider cursor-pointer bg-transparent border-0 p-0"
                                  >
                                    + Quick Add
                                  </button>
                                ) : (
                                  <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">✓ Active</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Exercises Selection Block */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                      {/* Selector/Finder on the left */}
                      <div className="space-y-4 bg-white/[0.01] border border-white/5 p-6 rounded-md">
                        <div>
                          <h4 className="text-sm font-semibold italic font-serif text-white/90">
                            Add Exercises
                          </h4>
                          <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mt-0.5">
                            Search or select exercises from standard lists
                          </p>
                        </div>

                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <input
                            type="text"
                            placeholder="Type to filter exercises..."
                            value={builderSearch}
                            onChange={(e) => setBuilderSearch(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-md pl-10 pr-4 py-2.5 text-xs font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                          />
                        </div>

                        {/* Favorites Dropdown Select */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setBuilderFavDropdownOpen(!builderFavDropdownOpen)}
                            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-black/40 border border-white/10 rounded-md text-xs text-white/80 hover:bg-white/[0.02] hover:border-white/20 transition-all cursor-pointer select-none"
                            id="builder-favorites-dropdown-btn"
                          >
                            <div className="flex items-center gap-2">
                              <Star className={`w-3.5 h-3.5 ${favoriteExercises.length > 0 ? "text-amber-400 fill-amber-400/20" : "text-white/30"}`} />
                              <span className="font-medium text-white/90">
                                Favorites Quick-Add ({favoriteExercises.length})
                              </span>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-white/30 transition-transform duration-300 ${builderFavDropdownOpen ? "rotate-180" : ""}`} />
                          </button>

                          {builderFavDropdownOpen && (
                            <>
                              {/* Overlay for dismissing dropdown */}
                              <div 
                                className="fixed inset-0 z-40 cursor-default" 
                                onClick={() => setBuilderFavDropdownOpen(false)} 
                              />
                              <div className="absolute left-0 right-0 mt-1 bg-[#0f0f0f] border border-white/10 rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.8)] max-h-[280px] overflow-y-auto z-50 p-2 space-y-3 custom-scrollbar">
                                {(() => {
                                  const groupedFavs = getFavoriteExercisesByCategory();
                                  if (groupedFavs.length === 0) {
                                    return (
                                      <div className="text-center py-5 text-white/30 text-[10px] font-mono">
                                        No favorites saved yet.<br />
                                        <span className="text-[9px] text-white/15">Star exercises in the Library first.</span>
                                      </div>
                                    );
                                  }
                                  return groupedFavs.map((group) => (
                                    <div key={group.categoryTitle} className="space-y-1">
                                      <div className="flex items-center gap-1.5 border-b border-white/5 pb-1 ml-1 mt-1.5">
                                        <div className="w-1 h-2.5 bg-gym-accent rounded-[1px]" />
                                        <span className="text-[9px] font-black uppercase tracking-wider text-white/40 font-mono">
                                          {group.categoryTitle}
                                        </span>
                                      </div>
                                      <div className="space-y-0.5">
                                        {group.list.map((ex) => {
                                          const isAdded = newRoutineExercises.some(r => r.exerciseName.toLowerCase() === ex.name.toLowerCase());
                                          return (
                                            <button
                                              key={ex.name}
                                              type="button"
                                              onClick={() => {
                                                handleAddExercise(ex.name);
                                                setBuilderFavDropdownOpen(false);
                                              }}
                                              disabled={isAdded}
                                              className={`w-full text-left px-2 py-1.5 rounded-md text-[11px] transition-all flex items-center justify-between gap-3 ${
                                                isAdded 
                                                  ? "bg-emerald-500/5 text-emerald-400 opacity-60 cursor-not-allowed" 
                                                  : "hover:bg-white/5 text-white/80 cursor-pointer"
                                              }`}
                                            >
                                              <span className="truncate">{ex.name}</span>
                                              {isAdded ? (
                                                <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400">
                                                  Added
                                                </span>
                                              ) : (
                                                <Plus className="w-3 h-3 text-white/20" />
                                              )}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ));
                                })()}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Filter Toggle tabs: All vs Favorites */}
                        <div className="flex bg-black/60 border border-white/10 rounded-md p-0.5 inline-flex w-full">
                          <button
                            type="button"
                            onClick={() => setBuilderShowFavoritesOnly(false)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[9px] font-black uppercase tracking-widest transition-all rounded-md cursor-pointer ${!builderShowFavoritesOnly ? "bg-gym-accent text-black" : "text-white/40 hover:text-white"}`}
                          >
                            All Split Movements
                          </button>
                          <button
                            type="button"
                            onClick={() => setBuilderShowFavoritesOnly(true)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[9px] font-black uppercase tracking-widest transition-all rounded-md cursor-pointer ${builderShowFavoritesOnly ? "bg-gym-accent text-black" : "text-white/40 hover:text-white"}`}
                          >
                            <Star className={`w-3 h-3 ${builderShowFavoritesOnly ? "fill-current text-black" : "text-amber-400/85"}`} />
                            Favorites ({favoriteExercises.length})
                          </button>
                        </div>

                        {/* List exercises matching category pools or search */}
                        <div className="max-h-[350px] overflow-y-auto space-y-1.5 pr-1.5 custom-scrollbar">
                          {(() => {
                            const searchClean = builderSearch.trim().toLowerCase();

                            if (builderShowFavoritesOnly) {
                              const groupedFavs = getFavoriteExercisesByCategory();
                              const filteredGrouped = groupedFavs.map(group => {
                                const filteredList = group.list.filter(ex => 
                                  ex.name.toLowerCase().includes(searchClean)
                                );
                                return {
                                  categoryTitle: group.categoryTitle,
                                  list: filteredList
                                };
                              }).filter(group => group.list.length > 0);

                              if (filteredGrouped.length === 0) {
                                return (
                                  <div className="text-center py-6 text-white/20 text-xs font-mono">
                                    No favorited exercises found{searchClean ? " matching search" : ""}.
                                  </div>
                                );
                              }

                              return (
                                <div className="space-y-4">
                                  {filteredGrouped.map((group) => (
                                    <div key={group.categoryTitle} className="space-y-1.5">
                                      <div className="flex items-center gap-1.5 border-b border-white/5 pb-1 ml-1 mt-2">
                                        <div className="w-1 h-2.5 bg-gym-accent rounded-[1px]" />
                                        <span className="text-[9px] font-black uppercase tracking-wider text-white/40 font-mono">
                                          {group.categoryTitle}
                                        </span>
                                      </div>
                                      {group.list.map((ex) => {
                                        const isAdded = newRoutineExercises.some(r => r.exerciseName.toLowerCase() === ex.name.toLowerCase());
                                        return (
                                          <button
                                            key={ex.name}
                                            onClick={() => handleAddExercise(ex.name)}
                                            disabled={isAdded}
                                            className={`w-full text-left p-2.5 rounded-md border transition-all flex items-center justify-between gap-3 ${
                                              isAdded 
                                                ? "border-emerald-500/10 bg-emerald-500/5 text-emerald-400 opacity-60 cursor-not-allowed" 
                                                : "border-white/5 bg-black/40 hover:bg-white/[0.04] hover:border-white/10 text-white/80 cursor-pointer"
                                            }`}
                                          >
                                            <span className="text-xs font-medium truncate">{ex.name}</span>
                                            {isAdded ? (
                                              <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 px-1.5 py-0.5 rounded-md text-emerald-400">
                                                Added
                                              </span>
                                            ) : (
                                              <Plus className="w-3.5 h-3.5 text-white/30 animate-none" />
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  ))}
                                </div>
                              );
                            }

                            const availableExercises = getExercisesForDay(newRoutineCategory);
                            
                            // Filter by search text
                            let filtered = availableExercises;
                            if (searchClean) {
                              filtered = availableExercises.filter(ex => 
                                ex.name.toLowerCase().includes(searchClean)
                              );
                            }

                            // If search does not match any existing exercise perfectly, offer option to add as a custom exercise name
                            const exactMatch = availableExercises.some(ex => ex.name.toLowerCase() === searchClean);
                            
                            return (
                              <>
                                {searchClean && !exactMatch && (
                                  <button
                                    onClick={() => {
                                      const trimmedName = builderSearch.trim();
                                      if (trimmedName) {
                                        handleAddExercise(trimmedName);
                                        setBuilderSearch("");
                                      }
                                    }}
                                    className="w-full text-left p-3 rounded-md border border-gym-accent/20 bg-gym-accent/5 hover:bg-gym-accent hover:text-black transition-all cursor-pointer flex items-center justify-between"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <span className="text-xs font-bold text-gym-accent block truncate hover:text-inherit">
                                        + Add Custom: "{builderSearch.trim()}"
                                      </span>
                                    </div>
                                    <Plus className="w-3.5 h-3.5 animate-none text-gym-accent" />
                                  </button>
                                )}

                                {filtered.length === 0 && !searchClean && (
                                  <div className="text-center py-6 text-white/20 text-xs">
                                    No default exercises in pools.
                                  </div>
                                )}

                                {filtered.map((ex, idx) => {
                                  const isAdded = newRoutineExercises.some(r => r.exerciseName.toLowerCase() === ex.name.toLowerCase());
                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => handleAddExercise(ex.name)}
                                      disabled={isAdded}
                                      className={`w-full text-left p-2.5 rounded-md border transition-all flex items-center justify-between gap-3 ${
                                        isAdded 
                                          ? "border-emerald-500/10 bg-emerald-500/5 text-emerald-400 opacity-60 cursor-not-allowed" 
                                          : "border-white/5 bg-black/40 hover:bg-white/[0.04] hover:border-white/10 text-white/80 cursor-pointer"
                                      }`}
                                    >
                                      <span className="text-xs font-medium truncate">{ex.name}</span>
                                      {isAdded ? (
                                        <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 px-1.5 py-0.5 rounded-md text-emerald-400">
                                          Added
                                        </span>
                                      ) : (
                                        <Plus className="w-3.5 h-3.5 text-white/30 animate-none" />
                                      )}
                                    </button>
                                  );
                                })}
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Builder List and Sets Editor (Takes 2/3 space on large displays) */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold italic font-serif text-white/90">
                            Routine Structure ({newRoutineExercises.length} Exercises)
                          </h4>
                          {newRoutineExercises.length > 0 && (
                            <button
                              onClick={() => setNewRoutineExercises([])}
                              className="text-[9px] text-rose-400 hover:text-rose-300 font-bold uppercase tracking-wider cursor-pointer bg-transparent border-0 p-0"
                            >
                              Clear All
                            </button>
                          )}
                        </div>

                        {newRoutineExercises.length === 0 ? (
                          <div className="border border-dashed border-white/10 rounded-md p-12 text-center bg-black/20">
                            <Dumbbell className="w-8 h-8 text-white/10 mx-auto mb-3 animate-pulse" />
                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                              Routine is empty
                            </p>
                            <p className="text-[10px] text-white/20 uppercase tracking-wider mt-1.5 max-w-[280px] mx-auto leading-normal">
                              Select from the available exercises list or type to add custom targets to kickstart your plan
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {newRoutineExercises.map((exItem, exIdx) => (
                              <div
                                key={exItem.id}
                                draggable
                                onDragStart={(e) => handleRoutineExDragStart(e, exIdx)}
                                onDragOver={(e) => handleRoutineExDragOver(e, exIdx)}
                                onDrop={(e) => handleRoutineExDrop(e, exIdx)}
                                className={`transition-all rounded-md overflow-hidden border ${
                                  draggedIdx === exIdx
                                    ? "opacity-35 bg-gym-accent/5 border-gym-accent/40 border-dashed animate-pulse scale-[0.99]"
                                    : "bg-black/55 border-white/10 hover:border-white/20 hover:bg-black/70"
                                }`}
                              >
                                {/* Header of block */}
                                <div className="p-4 bg-white/[0.01] flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-2 min-w-0">
                                    {/* Grip Drag Handle */}
                                    <div 
                                      className="cursor-grab active:cursor-grabbing p-1.5 text-white/20 hover:text-gym-accent transition-colors shrink-0 rounded-md hover:bg-white/5" 
                                      title="Drag and drop to reorder exercise"
                                    >
                                      <GripVertical className="w-3.5 h-3.5" />
                                    </div>

                                    <span className="text-xs font-mono font-bold text-gym-accent bg-gym-accent/5 border border-gym-accent/20 px-2.5 py-0.5 rounded-md shrink-0">
                                      {exIdx + 1}
                                    </span>
                                    <div className="min-w-0">
                                      <h5 className="text-sm font-semibold text-white/95 leading-snug truncate">
                                        {exItem.exerciseName}
                                      </h5>
                                      {/* Muscle subcategory targeting */}
                                      {(() => {
                                        const resolvedEx = findExerciseByName(exItem.exerciseName);
                                        const subcat = resolvedEx?.pool || "custom";
                                        const subcatLabel = subcat
                                          .split('_')
                                          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                                          .join(' ');
                                        return (
                                          <span className="inline-block text-[9px] font-mono font-extrabold uppercase tracking-widest text-gym-accent/80 mt-1">
                                            Target Section: {subcatLabel}
                                          </span>
                                        );
                                      })()}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    {/* Move Up */}
                                    <button
                                      type="button"
                                      onClick={() => handleMoveExerciseUp(exIdx)}
                                      disabled={exIdx === 0}
                                      className={`p-1.5 rounded-md transition-all border border-transparent ${
                                        exIdx === 0
                                          ? "text-white/10 cursor-not-allowed"
                                          : "text-white/40 hover:text-gym-accent hover:bg-white/5 cursor-pointer"
                                      }`}
                                      title="Move Up"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Move Down */}
                                    <button
                                      type="button"
                                      onClick={() => handleMoveExerciseDown(exIdx)}
                                      disabled={exIdx === newRoutineExercises.length - 1}
                                      className={`p-1.5 rounded-md transition-all border border-transparent ${
                                        exIdx === newRoutineExercises.length - 1
                                          ? "text-white/10 cursor-not-allowed"
                                          : "text-white/40 hover:text-gym-accent hover:bg-white/5 cursor-pointer"
                                      }`}
                                      title="Move Down"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>

                                    <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />

                                    {/* Delete/Remove */}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveExercise(exItem.id)}
                                      className="p-1.5 text-white/30 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all cursor-pointer bg-transparent border-0"
                                      title="Remove exercise"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer bar */}
                    <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
                      <button
                        onClick={() => setIsCreatingRoutine(false)}
                        className="px-6 py-2.5 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-all rounded-md cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveCustomRoutine}
                        className="px-8 py-2.5 bg-gym-accent hover:bg-gym-accent/90 text-black text-xs font-black uppercase tracking-widest transition-all rounded-md cursor-pointer shadow-[0_0_20px_rgba(255,231,101,0.25)] font-semibold"
                      >
                        Create & Save Routine
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 pb-6 border-b border-white/5 flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h3 className="text-xl font-light italic font-serif">
                          Saved Workout Routines
                        </h3>
                        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
                          Instantly reload and execute your favorite workflows
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setNewRoutineName("");
                          setNewRoutineCategory(0);
                          setNewRoutineExercises([]);
                          setIsCreatingRoutine(true);
                          setBuilderSearch("");
                        }}
                        className="flex items-center gap-2 px-4 py-2 border border-gym-accent/30 bg-gym-accent/5 hover:bg-gym-accent hover:border-gym-accent hover:text-black text-gym-accent text-[10px] font-bold uppercase tracking-widest transition-all rounded-md cursor-pointer font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5 animate-none" />
                        Create Custom Routine
                      </button>
                    </div>

                    {/* Routine Analytics Summary View */}
                    {routines.length > 0 && selectedRoutine && (
                      <div className="mb-8 p-6 rounded-md bg-black/60 border border-white/10 backdrop-blur-md space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                          <div className="space-y-1">
                            <span className="text-[9px] text-gym-accent font-bold uppercase tracking-[0.2em] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-gym-accent animate-pulse" />
                              Routine Muscle Target Summary
                            </span>
                            <h4 className="text-base font-light italic font-serif text-white flex items-center gap-2">
                              Analyzing: <span className="font-semibold text-white/95 non-italic">{selectedRoutine.name}</span>
                              <span className="text-[9px] px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 uppercase non-italic text-white/60 font-mono tracking-wider">
                                {DAY_CONFIG[selectedRoutine.categoryIndex]?.name || "Custom"}
                              </span>
                            </h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold whitespace-nowrap">
                              Select Routine:
                            </label>
                            <select
                              value={selectedRoutineId || ""}
                              onChange={(e) => setSelectedRoutineId(e.target.value)}
                              className="bg-black/80 border border-white/15 hover:border-white/25 focus:border-gym-accent text-white text-xs font-bold uppercase tracking-widest rounded-md px-4 py-3 focus:outline-none transition-all cursor-pointer min-w-[200px] max-w-[320px] shadow-md"
                            >
                              {[...routines].sort((a, b) => a.name.localeCompare(b.name)).map((r, ri) => (
                                <option key={r.id || ri} value={r.id}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {selectedRoutineMuscleGroups.length === 0 ? (
                          <div className="text-center py-4">
                            <p className="text-xs text-white/40 italic font-bold">
                              This routine does not contain any exercises to analyze.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-5">
                            {/* Summary sentence */}
                            <div className="text-[11px] text-white/50 uppercase tracking-wider font-semibold flex flex-wrap gap-x-4 gap-y-1">
                              <span>Total Exercises: <strong className="text-white">{new Set(selectedRoutine.sets.map((s: any) => s.exerciseName)).size}</strong></span>
                              <span className="text-white/25">|</span>
                              <span>Total Sets: <strong className="text-white">{selectedRoutine.sets.length}</strong></span>
                              <span className="text-white/25">|</span>
                              <span>Primary Focus: <strong className="text-gym-accent">{selectedRoutineMuscleGroups[0]?.group} ({selectedRoutineMuscleGroups[0]?.percentage}%)</strong></span>
                              {selectedRoutineMuscleGroups.length > 1 && (
                                <>
                                  <span className="text-white/25">|</span>
                                  <span>Secondary Focus: <strong className="text-white/90">{selectedRoutineMuscleGroups[1]?.group} ({selectedRoutineMuscleGroups[1]?.percentage}%)</strong></span>
                                </>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                              {selectedRoutineMuscleGroups.map((item) => (
                                <div
                                  key={item.group}
                                  className="bg-white/[0.01] border border-white/5 rounded-md p-4 flex flex-col justify-between hover:bg-white/[0.03] hover:border-white/10 transition-all group/item"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <span className="text-gym-accent group-hover/item:text-gym-accent/80 shrink-0">
                                        {getMuscleGroupIcon(item.group)}
                                      </span>
                                      <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider truncate">
                                        {item.group}
                                      </span>
                                    </div>
                                    <span className="text-[9px] text-white/40 font-mono font-bold">
                                      x{item.count}
                                    </span>
                                  </div>

                                  <div>
                                    <div className="flex items-baseline justify-between mb-1.5">
                                      <span className="text-[15px] font-black text-white group-hover/item:text-gym-accent transition-colors font-mono tracking-tight">
                                        {item.percentage}%
                                      </span>
                                      <span className="text-[7px] text-white/20 uppercase tracking-widest font-bold">
                                        Emphasis
                                      </span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1 rounded-md overflow-hidden font-mono">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.percentage}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="bg-gym-accent h-full rounded-md shadow-[0_0_8px_rgba(255,231,101,0.35)]"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {selectedRoutineSecondaryMuscleGroups.length > 0 && (
                              <div className="pt-6 border-t border-white/5 space-y-3">
                                <div className="flex items-center gap-1.5">
                                  <Sliders className="w-3 h-3 text-gym-accent/60" />
                                  <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold">
                                    Secondary & Supportive Muscle Synergy
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                  {selectedRoutineSecondaryMuscleGroups.map((item) => (
                                    <div
                                      key={item.group}
                                      className="bg-white/[0.005] border border-white/5 rounded-md p-3.5 flex flex-col justify-between hover:bg-white/[0.02] hover:border-white/10 transition-all group/item"
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                          <span className="text-white/40 group-hover/item:text-gym-accent/60 shrink-0">
                                            {getMuscleGroupIcon(item.group)}
                                          </span>
                                          <span className="text-[9px] text-white/70 font-semibold uppercase tracking-wider truncate">
                                            {item.group}
                                          </span>
                                        </div>
                                        <span className="text-[8px] text-white/30 font-mono">
                                          x{item.count}
                                        </span>
                                      </div>

                                      <div>
                                        <div className="flex items-baseline justify-between mb-1">
                                          <span className="text-[12px] font-bold text-white/90 group-hover/item:text-gym-accent transition-colors font-mono">
                                            {item.percentage}%
                                          </span>
                                          <span className="text-[6px] text-white/20 uppercase tracking-widest font-bold">
                                            Synergy Contribution
                                          </span>
                                        </div>
                                        <div className="w-full bg-white/5 h-[3px] rounded-md overflow-hidden font-mono">
                                          <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percentage}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className="bg-white/40 h-full rounded-md"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {DAY_CONFIG.map((day, di) => {
                      const categoryRoutines = routines.filter(
                        (r) => r.categoryIndex === di,
                      );
                      const isOpen = !!expandedRoutinesDays[di];

                      return (
                        <div key={di} className="group">
                          <button
                            onClick={() =>
                              setExpandedRoutinesDays((prev) => ({
                                ...prev,
                                [di]: !isOpen,
                              }))
                            }
                            className="w-full flex items-center justify-between p-6 rounded-md bg-black/65 border border-white/15 hover:bg-black/80 hover:border-white/25 transition-all cursor-pointer group backdrop-blur-md"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-md bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center shrink-0">
                                {day.icon}
                              </div>
                              <div className="flex items-center gap-3">
                                <h3 className="text-lg font-light italic font-serif text-white/90">
                                  {day.name}
                                </h3>
                                <span className="text-[9px] text-white/10 px-2 py-0.5 border border-white/5 rounded-full uppercase tabular-nums">
                                  {categoryRoutines.length} Saved
                                </span>
                              </div>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-500 ${isOpen ? "rotate-180" : ""} text-white/20 group-hover:text-gym-accent`}
                            />
                          </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                              marginTop: 12,
                            }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-md space-y-4">
                              {categoryRoutines.length === 0 ? (
                                <div className="text-center py-8">
                                  <Repeat className="w-8 h-8 text-white/5 mx-auto mb-3 animate-pulse" />
                                  <p className="text-xs text-white/40 font-bold uppercase tracking-wide">
                                    No saved routines here yet.
                                  </p>
                                  <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1">
                                    To save a routine, click "Save Routine" on
                                    any archived session in the Session tab.
                                  </p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {categoryRoutines.map((routine, ri) => (
                                    <div
                                      key={routine.id || ri}
                                      onClick={() => setSelectedRoutineId(routine.id)}
                                      className={`border rounded-md overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                                        selectedRoutineId === routine.id
                                          ? "bg-gym-accent/[0.04] border-gym-accent shadow-lg shadow-gym-accent/5 ring-1 ring-gym-accent/20"
                                          : "bg-black/55 border-white/10 hover:border-white/20 hover:bg-black/65"
                                      }`}
                                    >
                                      <div className="p-5 border-b border-white/5 bg-white/[0.02]">
                                        <div className="flex items-start justify-between gap-4">
                                          <div className="flex-1 min-w-0">
                                            {editingRoutineId === routine.id ? (
                                              <div className="space-y-2">
                                                <input
                                                  type="text"
                                                  value={editingRoutineName}
                                                  onChange={(e) =>
                                                    setEditingRoutineName(
                                                      e.target.value,
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (e.key === "Enter")
                                                      handleRenameRoutine(
                                                        routine.id,
                                                        editingRoutineName,
                                                      );
                                                    if (e.key === "Escape")
                                                      setEditingRoutineId(null);
                                                  }}
                                                  className="w-full bg-black/90 border border-gym-accent/40 text-sm text-white px-2.5 py-1.5 rounded-md focus:outline-none focus:border-gym-accent/80 font-medium"
                                                  autoFocus
                                                />
                                                <div className="flex gap-2">
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleRenameRoutine(
                                                        routine.id,
                                                        editingRoutineName,
                                                      );
                                                    }}
                                                    className="px-2.5 py-1 bg-gym-accent hover:bg-gym-accent/90 text-black text-[9px] font-bold uppercase tracking-wider rounded-md cursor-pointer"
                                                  >
                                                    Save
                                                  </button>
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setEditingRoutineId(null);
                                                    }}
                                                    className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/70 text-[9px] font-bold uppercase tracking-wider rounded-md cursor-pointer"
                                                  >
                                                    Cancel
                                                  </button>
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="group/title flex items-center gap-1.5 flex-wrap">
                                                <h4 className="text-sm font-semibold text-white/95 leading-snug truncate max-w-[150px] sm:max-w-none">
                                                  {routine.name}
                                                </h4>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingRoutineId(
                                                      routine.id,
                                                    );
                                                    setEditingRoutineName(
                                                      routine.name,
                                                    );
                                                  }}
                                                  className="p-1 hover:text-gym-accent text-white/20 transition-colors cursor-pointer group-hover/title:text-white/40"
                                                  title="Rename Routine"
                                                >
                                                  <Edit2 className="w-3 h-3" />
                                                </button>
                                              </div>
                                            )}
                                            <div className="mt-1">
                                              <span className="text-[8px] text-white/30 uppercase tracking-widest font-mono">
                                                Recorded {routine.date}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleLoadRoutineToActiveSession(
                                                  routine,
                                                );
                                              }}
                                              className="px-2.5 py-1.5 bg-gym-accent/15 border border-gym-accent/25 hover:bg-gym-accent hover:text-black hover:border-gym-accent text-gym-accent text-[9px] font-bold uppercase tracking-wider transition-all rounded-md cursor-pointer"
                                              title="Load sets into today's active session"
                                            >
                                              Use Routine
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handlePreloadToBuilder(routine);
                                              }}
                                              className="px-2.5 py-1.5 bg-white/5 border border-white/10 hover:border-gym-accent/40 hover:text-gym-accent text-white/70 text-[9px] font-bold uppercase tracking-wider transition-all rounded-md cursor-pointer whitespace-nowrap"
                                              title="Tweak, edit, or adjust this routine in custom builder"
                                            >
                                              Modify & Tweak
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteRoutine(routine.id!);
                                              }}
                                              className="p-1.5 border border-red-500/10 hover:border-red-500/35 hover:bg-red-500/10 text-red-500/60 hover:text-red-500 transition-colors rounded-md cursor-pointer"
                                              title="Delete routine"
                                            >
                                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="p-5 space-y-3 max-h-48 overflow-y-auto no-scrollbar">
                                        {Object.entries(
                                          routine.sets.reduce(
                                            (acc: any, s: any) => {
                                              if (!acc[s.exerciseName])
                                                acc[s.exerciseName] = [];
                                              acc[s.exerciseName].push(s);
                                              return acc;
                                            },
                                            {},
                                          ),
                                        ).map(
                                          ([exName]: [string, any]) => (
                                            <div
                                              key={exName}
                                              className="flex justify-between items-center gap-4 pb-2 border-b border-white/5 last:border-0 last:pb-0"
                                            >
                                              <div className="flex flex-col gap-1 w-full min-w-0">
                                                <span
                                                  className="text-[10px] text-white/70 font-semibold uppercase tracking-wider break-words"
                                                  title={exName}
                                                >
                                                  {exName}
                                                </span>
                                                <div>
                                                  <Sparkline
                                                    exName={exName}
                                                    sessionSets={sessionSets}
                                                    archivedWorkouts={
                                                      archivedWorkouts
                                                    }
                                                    width={55}
                                                    height={12}
                                                  />
                                                </div>
                                              </div>
                                              
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
                  </>
                )}
              </motion.div>
            ) : activeView === "map" ? (
              <motion.div
                key="map-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3 pb-20"
              >
                <TacticalMap />
              </motion.div>
            ) : activeView === "gym_locator" ? (
              <motion.div
                key="gym-locator-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3 pb-20"
              >
                <GymLocator />
              </motion.div>
            ) : activeView === "avatar" ? (
              <motion.div
                key="avatar"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AvatarPanel
                  profile={syncedProfile || profile}
                  setProfile={setProfile}
                  saveSettings={saveSettings}
                  setToast={setToast}
                  archivedWorkouts={archivedWorkouts}
                  currentUser={currentUser}
                />
              </motion.div>
            ) : activeView === "profile" ? (
              (() => {
                const totalLifetimeVolume = archivedWorkouts.reduce(
                  (sum, w) => sum + (w.totalVolume || 0),
                  0,
                );
                const milestones = [
                  { target: 10000, label: "Novice", icon: Shield },
                  { target: 100000, label: "Warrior", icon: Medal },
                  { target: 500000, label: "Titan", icon: Award },
                  { target: 1000000, label: "Immortal", icon: Crown },
                ];
                const currentMilestoneIndex = milestones.findIndex(
                  (m) => totalLifetimeVolume < m.target,
                );
                const nextMilestone =
                  currentMilestoneIndex === -1
                    ? milestones[milestones.length - 1]
                    : milestones[currentMilestoneIndex];
                const isMaxed = currentMilestoneIndex === -1;
                const progressPercent = isMaxed
                  ? 100
                  : Math.min(
                      (totalLifetimeVolume / nextMilestone.target) * 100,
                      100,
                    );

                return (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-2xl mx-auto space-y-12 pb-20"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="relative group mb-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gym-accent/40 bg-black/85 flex items-center justify-center">
                          {profile?.photoURL || currentUser.photoURL ? (
                            <img
                              src={
                                profile?.photoURL || currentUser.photoURL || ""
                              }
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserIcon className="w-12 h-12 text-white/10" />
                          )}
                        </div>
                      </div>
                      <h3 className="text-3xl font-light italic font-serif text-white mb-2">
                        {profile?.displayName ||
                          currentUser.displayName ||
                          "Athlete Profile"}
                      </h3>
                      <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black">
                        Archive Identity
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-black/85 border border-white/20 rounded-lg p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                        <Flame className="w-8 h-8 text-gym-accent mb-4 relative z-10" />
                        <div className="text-4xl font-light text-white mb-1 relative z-10">
                          {profile?.streakCount || 0}
                        </div>
                        <div className="text-[10px] text-white/30 uppercase tracking-widest font-black relative z-10">
                          Current Streak
                        </div>
                        <div className="absolute top-0 right-0 p-2 opacity-5">
                          <Flame className="w-16 h-16 text-gym-accent" />
                        </div>
                      </div>
                      <div className="bg-black/85 border border-white/20 rounded-lg p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                        <Activity className="w-8 h-8 text-gym-accent mb-4 relative z-10" />
                        <div className="text-4xl font-light text-white mb-1 relative z-10">
                          {archivedWorkouts.length}
                        </div>
                        <div className="text-[10px] text-white/30 uppercase tracking-widest font-black relative z-10">
                          Captured Sessions
                        </div>
                        <div className="absolute top-0 right-0 p-2 opacity-5">
                          <Activity className="w-16 h-16 text-gym-accent" />
                        </div>
                      </div>
                    </div>


                    {/* Volume Gamification Section */}
                    <div className="bg-black/85 border border-gym-accent/25 rounded-lg p-8 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gym-accent/30 to-transparent" />

                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                          <h4 className="text-[10px] font-black text-gym-accent uppercase tracking-[0.3em] mb-2">
                            Volume Evolution
                          </h4>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-light text-white tracking-tighter tabular-nums">
                              {totalLifetimeVolume.toLocaleString()}
                            </span>
                            <span className="text-xs text-white/40 uppercase tracking-widest font-bold">
                              KG Lifted
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">
                            Status
                          </p>
                          <p className="text-lg font-serif italic text-gym-accent">
                            {isMaxed
                              ? "Immortal Legend"
                              : milestones[
                                  currentMilestoneIndex === -1
                                    ? 3
                                    : Math.max(0, currentMilestoneIndex - 1)
                                ].label}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">
                            Progress to {nextMilestone.label}
                          </span>
                          <span className="text-[10px] text-gym-accent font-black tracking-widest">
                            {isMaxed
                              ? "MAXED"
                              : `${nextMilestone.target.toLocaleString()} KG`}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-gym-accent/60 via-gym-accent to-gym-accent-light accent-shadow-bar"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mt-12">
                        {milestones.map((m, idx) => {
                          const isEarned = totalLifetimeVolume >= m.target;
                          const Icon = m.icon;
                          return (
                            <div
                              key={idx}
                              className="flex flex-col items-center gap-3"
                            >
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 ${
                                  isEarned
                                    ? "bg-gym-accent/15 border border-gym-accent/40 text-gym-accent accent-shadow-badge"
                                    : "bg-black/85 border border-white/15 text-white/10"
                                }`}
                              >
                                <Icon
                                  className={`w-5 h-5 ${isEarned ? "animate-pulse" : ""}`}
                                />
                              </div>
                              <div className="flex flex-col items-center text-center">
                                <span
                                  className={`text-[8px] font-black uppercase tracking-widest ${isEarned ? "text-white/80" : "text-white/10"}`}
                                >
                                  {m.label}
                                </span>
                                <span
                                  className={`text-[7px] font-bold ${isEarned ? "text-gym-accent/60" : "text-white/5"}`}
                                >
                                  {m.target / 1000}K
                                </span>
                              </div>
                              {isEarned && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="mt-1"
                                >
                                  <Trophy className="w-3 h-3 text-gym-accent" />
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-black/85 border border-white/20 rounded-lg p-8 space-y-8">
                      <div>
                        <h4 className="text-[10px] font-black text-gym-accent uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-4">
                          Personal Details
                        </h4>

                        <div className="space-y-6">
                          <ProfileDisplayNameEditor
                            profile={profile}
                            currentUser={currentUser}
                            saveSettings={saveSettings}
                            setProfile={setProfile}
                            setToast={setToast}
                          />
                          <div className="flex flex-col gap-2">
                            <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">
                              Avatar URL
                            </span>
                            <input
                              type="text"
                              defaultValue={
                                profile?.photoURL || currentUser.photoURL || ""
                              }
                              className="bg-transparent border-b border-white/10 py-2 text-sm font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                              placeholder="https://..."
                              onBlur={(e) => {
                                const url = e.target.value;
                                if (url && url !== profile?.photoURL) {
                                  saveSettings({ photoURL: url });
                                  setProfile((prev) =>
                                    prev ? { ...prev, photoURL: url } : null,
                                  );
                                }
                              }}
                            />
                          </div>

                          {/* Biometric details inputs */}
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-white/5">
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">
                                Bodyweight (kg)
                              </span>
                              <input
                                type="number"
                                step="0.1"
                                defaultValue={syncedProfile?.bodyweight || ""}
                                key={`bw-${syncedProfile?.bodyweight || ""}`}
                                placeholder="75"
                                className="bg-transparent border-b border-white/10 py-1.5 text-xl font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                                onBlur={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val)) {
                                    saveSettings({ bodyweight: val });
                                    setProfile((prev) =>
                                      prev
                                        ? { ...prev, bodyweight: val }
                                        : null,
                                    );
                                  }
                                }}
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">
                                Height (cm)
                              </span>
                              <input
                                type="number"
                                defaultValue={profile?.height || ""}
                                placeholder="175"
                                className="bg-transparent border-b border-white/10 py-1.5 text-xl font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                                onBlur={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val)) {
                                    saveSettings({ height: val });
                                    setProfile((prev) =>
                                      prev ? { ...prev, height: val } : null,
                                    );
                                  }
                                }}
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">
                                Age
                              </span>
                              <input
                                type="number"
                                defaultValue={profile?.age || ""}
                                placeholder="28"
                                className="bg-transparent border-b border-white/10 py-1.5 text-xl font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                                onBlur={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val)) {
                                    saveSettings({ age: val });
                                    setProfile((prev) =>
                                      prev ? { ...prev, age: val } : null,
                                    );
                                  }
                                }}
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">
                                Body Fat (%)
                              </span>
                              <input
                                type="number"
                                step="0.1"
                                defaultValue={syncedProfile?.bodyFatPercent || ""}
                                key={`bf-${syncedProfile?.bodyFatPercent || ""}`}
                                placeholder="15"
                                className="bg-transparent border-b border-white/10 py-1.5 text-xl font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                                onBlur={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val)) {
                                    saveSettings({ bodyFatPercent: val });
                                    setProfile((prev) =>
                                      prev
                                        ? { ...prev, bodyFatPercent: val }
                                        : null,
                                    );
                                  }
                                }}
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">
                                Sex
                              </span>
                              <select
                                value={profile?.sex || "male"}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  saveSettings({ sex: val });
                                  setProfile((prev) =>
                                    prev ? { ...prev, sex: val as any } : null,
                                  );
                                }}
                                className="w-full bg-black/80 border border-white/15 hover:border-white/25 focus:border-gym-accent text-white text-xs font-bold uppercase tracking-widest rounded-md px-4 py-3 focus:outline-none transition-all cursor-pointer shadow-md"
                              >
                                <option
                                  value="male"
                                  className="bg-[#0a0a0a] text-white"
                                >
                                  Male
                                </option>
                                <option
                                  value="female"
                                  className="bg-[#0a0a0a] text-white"
                                >
                                  Female
                                </option>
                                <option
                                  value="other"
                                  className="bg-[#0a0a0a] text-white"
                                >
                                  Other
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-8">
                        <h4 className="text-[10px] font-black text-gym-accent uppercase tracking-[0.3em] mb-4 flex items-center justify-between">
                          <span>App Atmosphere</span>
                          <span className="text-[8px] opacity-40 uppercase tracking-widest font-bold">
                            Theme Customizer
                          </span>
                        </h4>

                        {/* Global Toggle for Titan Pro vs Carbon Black */}
                        <div id="high-contrast-toggle-section" className="bg-zinc-950/40 border border-white/10 rounded-lg p-5 mb-8 relative overflow-hidden">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 font-sans">
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] bg-white/10 border border-white/20 text-white font-mono px-2 py-0.5 rounded uppercase font-black tracking-widest">
                                  CORE CALIBRATION
                                </span>
                              </div>
                              <h5 className="text-sm font-semibold text-white tracking-wide mt-1.5">
                                High Contrast Display Mode
                              </h5>
                              <p className="text-[11px] text-white/50 tracking-wide mt-0.5 max-w-[420px] leading-relaxed">
                                Switch between the ambient atmosphere of <strong className="text-gym-accent font-black">Titan Pro</strong> (and selected secondary themes) and a pure high-contrast flat <strong className="text-white font-black">Carbon Black</strong> performance layout.
                              </p>
                            </div>
                            
                            {/* Sliding segment controller */}
                            <div className="bg-zinc-950 p-1 border border-white/10 rounded-lg flex shrink-0 w-full sm:w-auto relative select-none">
                              <button
                                type="button"
                                onClick={async () => {
                                  const updated = { carbonBlack: false };
                                  setProfile(prev => prev ? { ...prev, ...updated } : prev);
                                  await saveSettings(updated);
                                  setToast({
                                    message: "⚡ Enabled Titan Pro Full Theme atmosphere!",
                                    type: "success"
                                  });
                                }}
                                className={`flex-1 sm:flex-none text-center px-4 py-2 font-mono text-[9px] uppercase tracking-widest font-black transition-all duration-200 cursor-pointer rounded ${
                                  !isCarbonBlack 
                                    ? "bg-gym-accent text-black font-extrabold shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                                    : "text-white/40 hover:text-white"
                                }`}
                              >
                                Titan Pro
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  const updated = { carbonBlack: true };
                                  setProfile(prev => prev ? { ...prev, ...updated } : prev);
                                  await saveSettings(updated);
                                  setToast({
                                    message: "🌑 Enabled Pure Carbon Black High-Contrast Mode!",
                                    type: "success"
                                  });
                                }}
                                className={`flex-1 sm:flex-none text-center px-4 py-2 font-mono text-[9px] uppercase tracking-widest font-black transition-all duration-200 cursor-pointer rounded ${
                                  isCarbonBlack 
                                    ? "bg-white text-black font-extrabold shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                                    : "text-white/40 hover:text-white"
                                }`}
                              >
                                Carbon Black
                              </button>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-white/40 mb-6 font-light leading-relaxed">
                          Select a visual theme to align with your training
                          mentality. Each atmosphere re-defines the color
                          scheme, accents, and deep focus background.
                        </p>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {Object.values(GYM_THEMES)
                            .filter((t) => !t.isGradient)
                            .map((theme) => {
                              const isActive = theme.id === currentThemeId;
                              return (
                                <button
                                  key={theme.id}
                                  onClick={async () => {
                                    setCurrentThemeId(theme.id);
                                    localStorage.setItem(
                                      "gym-theme-id",
                                      theme.id,
                                    );
                                    saveSettings({ themeId: theme.id });
                                    setToast({
                                      message: `🌌 Equipped Atmosphere: ${theme.name}!`,
                                      type: "success",
                                    });
                                  }}
                                  type="button"
                                  className={`relative text-left p-4 rounded-lg border cursor-pointer overflow-hidden transition-all duration-300 group flex flex-col justify-between h-24 ${
                                    isActive
                                      ? "border-gym-accent bg-gym-accent/[0.15] accent-shadow-card"
                                      : "border-white/20 bg-black/85 hover:border-white/40 hover:bg-white/[0.12]"
                                  }`}
                                >
                                  {/* Mini Background Preview */}
                                  <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-15 transition-opacity">
                                    <img
                                      key={theme.id}
                                      src={theme.bgImage}
                                      alt=""
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>

                                  <div className="relative z-10 w-full flex flex-col justify-between h-full">
                                    <div className="flex justify-between items-start">
                                      <span
                                        className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isActive ? "text-gym-accent font-black" : "text-white/60"}`}
                                      >
                                        {theme.name}
                                      </span>
                                      {isActive && (
                                        <span className="w-2 h-2 rounded-full bg-gym-accent accent-shadow-dot" />
                                      )}
                                    </div>

                                    <div>
                                      <p className="text-[8px] text-white/40 group-hover:text-white/60 transition-colors leading-tight font-light line-clamp-2">
                                        {theme.textVibe}
                                      </p>
                                      {/* Accent Color Pill */}
                                      <div className="flex gap-1 mt-1.5">
                                        <span
                                          className="w-2.5 h-1 rounded-full"
                                          style={{
                                            backgroundColor: theme.accent,
                                          }}
                                        />
                                        <span
                                          className="w-1.5 h-1 rounded-full"
                                          style={{
                                            backgroundColor: theme.accentLight,
                                          }}
                                        />
                                        <span
                                          className="w-1.5 h-1 rounded-full"
                                          style={{
                                            backgroundColor: theme.accentDark,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                        </div>

                        {/* Row of minimalist gradient theme circles */}
                        <div className="mt-8 pt-8 border-t border-white/5">
                          <h5 className="text-[10px] font-black text-gym-accent uppercase tracking-[0.3em] mb-3 flex items-center justify-between">
                            <span>Minimalist Aura Atmospheres</span>
                            <span className="text-[8px] opacity-40 uppercase tracking-widest font-bold">
                              Ambient Gradients
                            </span>
                          </h5>
                          <p className="text-xs text-white/40 mb-6 font-light leading-relaxed">
                            Prefer a distraction-free layout? Select a sleek
                            black/color gradient aura below.
                          </p>
                          <div className="flex flex-wrap items-center gap-4 sm:gap-5 py-2">
                            {Object.values(GYM_THEMES)
                              .filter((t) => t.isGradient)
                              .map((theme) => {
                                const isActive = theme.id === currentThemeId;
                                return (
                                  <div
                                    key={theme.id}
                                    className="group relative flex flex-col items-center"
                                  >
                                    <button
                                      onClick={async () => {
                                        setCurrentThemeId(theme.id);
                                        localStorage.setItem(
                                          "gym-theme-id",
                                          theme.id,
                                        );
                                        saveSettings({ themeId: theme.id });
                                        setToast({
                                          message: `🎯 Equipped Minimalist Aura: ${theme.name}!`,
                                          type: "success",
                                        });
                                      }}
                                      type="button"
                                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full cursor-pointer transition-all duration-300 relative flex items-center justify-center p-0.5 ${
                                        isActive
                                          ? "scale-110 ring-2 ring-gym-accent ring-offset-2 ring-offset-[#050505] shadow-lg shadow-gym-accent/25"
                                          : "hover:scale-105 border border-white/10 hover:border-white/35"
                                      }`}
                                      style={{
                                        background: `radial-gradient(circle, ${theme.accent} 0%, #0c0c0c 100%)`,
                                      }}
                                      aria-label={`Select ${theme.name}`}
                                    >
                                      {/* Inner accent core */}
                                      <span
                                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                                          isActive
                                            ? "scale-110 shadow-inner"
                                            : "scale-75 group-hover:scale-95"
                                        }`}
                                        style={{
                                          backgroundColor: theme.accent,
                                          boxShadow: isActive
                                            ? `0 0 8px ${theme.accent}`
                                            : "none",
                                        }}
                                      />
                                    </button>

                                    {/* Theme short label */}
                                    <span
                                      className={`text-[8px] font-mono tracking-wider mt-2.5 transition-colors duration-200 ${
                                        isActive
                                          ? "text-gym-accent font-black"
                                          : "text-white/35 group-hover:text-white/60"
                                      }`}
                                    >
                                      {theme.name.split(" ")[0]}
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-black text-gym-accent uppercase tracking-[0.3em] mb-4 border-b border-white/5 pb-4">
                          Lifecycle
                        </h4>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-[10px] text-white/30 uppercase tracking-widest">
                            Archive Created
                          </span>
                          <span className="text-sm font-light text-white/80">
                            {profile?.startDate
                              ? new Date(profile.startDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  },
                                )
                              : "---"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={handleLogout}
                        className="text-[10px] text-white/20 hover:text-red-500 uppercase tracking-[0.3em] font-black underline underline-offset-8 decoration-white/10 hover:decoration-red-500 transition-all cursor-pointer"
                      >
                        Deactivate Session
                      </button>
                    </div>
                  </motion.div>
                );
              })()
            ) : activeView === "workout" ? (
              <motion.div
                key="workout-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <div className="mb-6 pb-6 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-light italic font-serif">
                      Training Programming
                    </h3>
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
                      Curate your physical evolution
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleFormatProgram}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gym-accent hover:bg-gym-accent/90 text-black rounded-md text-[10px] font-black uppercase tracking-[0.15em] transition-all cursor-pointer shadow-md shadow-gym-accent/20 font-bold"
                      title="Format and capture all selected exercises into a clean list view"
                    >
                      <ClipboardList className="w-3.5 h-3.5" />
                      BUILD
                    </button>
                    <button
                      onClick={handleOrganizeMovementOrder}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gym-accent/10 border border-gym-accent/25 hover:border-gym-accent/50 hover:bg-gym-accent/20 text-gym-accent rounded-md text-[10px] font-black uppercase tracking-[0.15em] transition-all cursor-pointer shadow-sm shadow-gym-accent/5"
                      title="Prioritise compound exercises and move isolation movements to the end"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      Compounds First
                    </button>
                    <button
                      onClick={handleClearAllExercises}
                      className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/25 hover:border-red-500/50 hover:bg-red-500/20 text-red-400 rounded-md text-[10px] font-black uppercase tracking-[0.15em] transition-all cursor-pointer shadow-sm shadow-red-500/5"
                      title="Clear and de-select all exercises from weekly programming"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove All
                    </button>
                  </div>
                </div>

                {/* Programming Page Sub-Tabs */}
                <div className="flex items-center gap-3 border-b border-white/5 pb-2 mb-6">
                  <button
                    onClick={() => setWorkoutInnerTab("builder")}
                    className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] border-b-2 transition-all cursor-pointer ${
                      workoutInnerTab === "builder"
                        ? "border-gym-accent text-gym-accent"
                        : "border-transparent text-white/45 hover:text-white/75"
                    }`}
                  >
                    <Dumbbell className="w-3.5 h-3.5" />
                    1. Plan Builder
                  </button>
                  <button
                    onClick={() => setWorkoutInnerTab("program")}
                    className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] border-b-2 transition-all cursor-pointer ${
                      workoutInnerTab === "program"
                        ? "border-gym-accent text-gym-accent"
                        : "border-transparent text-white/45 hover:text-white/75"
                    }`}
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    2. Plan
                  </button>
                  <button
                    onClick={() => {
                      setActiveView("session");
                      saveSettings({ activeView: "session" });
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] border-b-2 border-transparent text-white/45 hover:text-white/75 transition-all cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5 text-gym-accent/70" />
                    3. Session
                  </button>
                </div>

                {workoutInnerTab === "program" ? (
                  <motion.div
                    key="formatted-program-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {/* Active Rest Chronometer Widget */}
                    <div className="bg-black/60 border border-gym-accent/20 rounded-md p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative overflow-hidden backdrop-blur-md">
                      <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-gym-accent" />
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-md bg-gym-accent/10 border border-gym-accent/20 flex items-center justify-center shrink-0">
                          <Clock className="w-6 h-6 text-gym-accent" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-[10px] font-black uppercase text-gym-accent tracking-[0.2em] font-mono leading-none">
                              Active Rest Chronometer
                            </h4>
                            <span className="text-white/20 font-mono text-[9px]">|</span>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/40">
                              {manualRestActive ? "COUNTDOWN ACTIVE" : "STANDBY"}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2 mt-1.5">
                            <span className="text-4xl font-black font-mono tracking-tight tabular-nums leading-none text-white">
                              {(() => {
                                const secs = manualRestTime;
                                const m = Math.floor(secs / 60);
                                const s = secs % 60;
                                return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
                              })()}
                            </span>
                            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest leading-none font-bold">
                              target {manualRestTarget}s
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:self-center shrink-0">
                        {/* Target config based on mode */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[8px] font-mono font-bold text-white/35 uppercase tracking-widest">
                            Manual Countdown
                          </span>
                          <div className="flex items-center gap-1.5 bg-black/40 p-0.5 rounded-md border border-white/5 h-[26px]">
                            <button
                              type="button"
                              onClick={() => {
                                setManualRestActive(!manualRestActive);
                                playRestBeep(880, 0.05);
                              }}
                              className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider transition-all border cursor-pointer leading-none h-full ${
                                manualRestActive
                                  ? "bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25"
                                  : "bg-cyan-500/15 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25"
                              }`}
                            >
                              {manualRestActive ? "Pause" : "Start"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setManualRestTime(manualRestTarget);
                                setManualRestActive(false);
                                playRestBeep(440, 0.08);
                              }}
                              className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 transition-all cursor-pointer leading-none h-full"
                            >
                              Reset
                            </button>
                            <select
                              value={manualRestTarget}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setManualRestTarget(val);
                                setManualRestTime(val);
                                setManualRestActive(false);
                              }}
                              className="bg-black/80 border border-white/10 text-white/70 rounded-md text-[9px] px-1 py-0.5 font-mono focus:outline-none cursor-pointer h-full"
                            >
                              {[30, 45, 60, 90, 120, 180].map((sec) => (
                                <option key={sec} value={sec}>
                                  {sec}s
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Audio controls */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[8px] font-mono font-bold text-white/35 uppercase tracking-widest">Audio Alerts</span>
                          <button
                            type="button"
                            onClick={() => setRestAudioEnabled(!restAudioEnabled)}
                            className={`h-[26px] px-2.5 rounded-md border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              restAudioEnabled
                                ? "bg-gym-accent/15 border-gym-accent/25 text-gym-accent animate-none"
                                : "bg-white/5 border-white/10 text-white/40 hover:text-white/60"
                            }`}
                            title={restAudioEnabled ? "Mute chimes" : "Unmute chimes"}
                          >
                            {restAudioEnabled ? (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span className="text-[8px] font-mono uppercase tracking-wider font-extrabold">On</span>
                              </>
                            ) : (
                              <>
                                <VolumeX className="w-3.5 h-3.5" />
                                <span className="text-[8px] font-mono uppercase tracking-wider font-extrabold">Muted</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {formattedProgram.length === 0 ? (
                      <div className="text-center py-12 bg-black/40 border border-white/5 rounded-md">
                        <Dumbbell className="w-8 h-8 text-white/10 mx-auto mb-3" />
                        <p className="text-sm text-white/40 mb-4">No exercises selected.</p>
                        <button
                          onClick={() => setWorkoutInnerTab("builder")}
                          className="px-4 py-2 bg-gym-accent text-black text-xs font-black uppercase tracking-widest rounded-md cursor-pointer hover:bg-gym-accent/90 transition-all"
                        >
                          Go to Plan Builder
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {formattedProgram.map((item, idx) => (
                          <div key={idx} className="space-y-4">
                            {/* Day Title Section */}
                            <div className="flex items-center gap-3 border-b border-white/10 pb-2 pl-1">
                              <div className="w-6 h-6 rounded-md bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center text-gym-accent text-xs">
                                {DAY_CONFIG[item.dayIndex]?.icon || <Dumbbell className="w-3.5 h-3.5" />}
                              </div>
                              <h3 className="text-lg font-light italic font-serif text-white/95">
                                {item.dayName}
                              </h3>
                              <span className="text-[9px] font-mono bg-gym-accent/10 text-gym-accent border border-gym-accent/20 px-2 py-0.5 rounded-full uppercase font-black tracking-wider ml-auto">
                                {item.exercises.length} Exercises
                              </span>
                            </div>

                            {/* Full widgets grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {item.exercises.map((ex, exIdx) => 
                                renderFullExerciseCard(ex, item.dayIndex, exIdx)
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-start gap-3 pt-4">
                      <button
                        onClick={() => setWorkoutInnerTab("builder")}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white/85 rounded-md text-[10px] font-black uppercase tracking-[0.15em] transition-all cursor-pointer"
                      >
                        <Dumbbell className="w-3.5 h-3.5" />
                        Modify Program in Builder
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <>

                {/* Progression Recognition Banner */}
                {(() => {
                  const progressions: { name: string; weight: number; rec: number }[] = [];
                  const setsByEx: Record<string, SessionSet[]> = {};
                  sessionSets.forEach((s) => {
                    if (!s || !s.exerciseName) return;
                    const name = s.exerciseName.trim();
                    if (!setsByEx[name]) setsByEx[name] = [];
                    setsByEx[name].push(s);
                  });

                  for (const [exName, sets] of Object.entries(setsByEx)) {
                    const weightGroups: Record<number, number[]> = {};
                    sets.forEach((set) => {
                      const w = typeof set.weight === 'string' ? parseFloat(set.weight) : set.weight;
                      const r = typeof set.reps === 'string' ? parseInt(set.reps, 10) : set.reps;
                      if (!isNaN(w) && !isNaN(r)) {
                        if (!weightGroups[w]) weightGroups[w] = [];
                        weightGroups[w].push(r);
                      }
                    });

                    for (const [weightStr, repsList] of Object.entries(weightGroups)) {
                      const weight = parseFloat(weightStr);
                      const successfulSets = repsList.filter((r) => r >= 10).length;
                      if (successfulSets >= 3) {
                        progressions.push({
                          name: exName,
                          weight: weight,
                          rec: weight + 2.5,
                        });
                        break;
                      }
                    }
                  }

                  if (progressions.length === 0) return null;

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 rounded-md border border-emerald-500/30 bg-emerald-950/20 bg-gradient-to-r from-emerald-500/10 to-transparent relative overflow-hidden accent-shadow-card"
                    >
                      <div className="absolute top-0 right-0 p-3 text-emerald-400 font-mono text-[11px] animate-pulse">⚡ PROGRESSION DETECTED</div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.25em] font-mono">
                          Adaptation Threshold Upgraded
                        </h4>
                      </div>
                      <p className="text-xs text-white/80 leading-relaxed max-w-2xl mb-3.5">
                        In today's training cycle, you executed <strong className="text-white font-bold">3 sets of 10+ reps</strong> on these movements. Neuromuscular overload achieved. For continued hypertrophic stimulus, increase target weight for next session:
                      </p>
                      <div className="flex flex-col gap-2">
                        {progressions.map((p, idx) => (
                          <div
                            key={idx}
                            className="flex flex-wrap items-center justify-between text-xs bg-black/45 border border-white/5 py-2.5 px-3 rounded-md hover:border-emerald-500/25 transition-colors"
                          >
                            <span className="font-semibold text-white/90 font-sans">
                              {p.name}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-mono text-white/40">
                                Completed Weight: <span className="text-white/80 font-bold">{p.weight}kg</span>
                              </span>
                              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                                Upgrade Recommendation: <span>{p.rec}kg</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })()}

                {DAY_CONFIG.map((day, di) => (
                  <div key={di} className="group">
                    <button
                      onClick={() =>
                        setExpandedDays((prev) => ({
                          ...prev,
                          [di]: !prev[di],
                        }))
                      }
                      className={`w-full flex items-center justify-between p-6 rounded-md border transition-all cursor-pointer group backdrop-blur-md ${
                        lastLoadedDayIndex === di
                          ? "bg-gym-accent/[0.04] border-gym-accent shadow-md shadow-gym-accent/10"
                          : "bg-black/70 border-white/15 hover:bg-white/[0.04] hover:border-white/25"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-md bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center shrink-0 text-gym-accent group-hover:bg-gym-accent/20 group-hover:border-gym-accent/40 transition-all">
                          {day.icon}
                        </div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-light italic font-serif text-white/90">
                            {day.name}
                          </h3>
                          <span className="text-[9px] text-white/10 px-2 py-0.5 border border-white/5 rounded-full uppercase tabular-nums">
                            {currentDays[di]?.length || 0} Ex.
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {!expandedDays[di] && currentDays[di]?.length === 0 && (
                          <span className="text-[9px] text-gym-accent font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">
                            Click to Create Plan
                          </span>
                        )}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-500 ${expandedDays[di] ? "rotate-180" : ""} text-white/20 group-hover:text-gym-accent`}
                        />
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedDays[di] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                            marginTop: 12,
                          }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          className="overflow-hidden"
                        >
                          <motion.div
                            key={lastLoadedDayIndex === di ? `grid-loaded-active-${di}` : `grid-loaded-idle-${di}`}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6"
                          >
                            {currentDays[di]?.map((ex, ei) => {
                              const resolvedEx = findExerciseByName(ex.name);
                              const poolKey = resolvedEx?.pool || ex.pool;
                              const label = poolKey
                                ? poolKey
                                    .split('_')
                                    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                                    .join(' ')
                                : "";

                              // Fetch peak weight dynamically for this exercise
                              const peakWeight = (() => {
                                const weights: number[] = [];
                                sessionSets?.forEach((s) => {
                                  if (s && s.exerciseName && s.exerciseName.trim().toLowerCase() === ex.name.trim().toLowerCase()) {
                                    const w = typeof s.weight === 'string' ? parseFloat(s.weight) : s.weight;
                                    if (w && !isNaN(w)) weights.push(w);
                                  }
                                });
                                archivedWorkouts?.forEach((w) => {
                                  w.sets?.forEach((s) => {
                                    if (s && s.exerciseName && s.exerciseName.trim().toLowerCase() === ex.name.trim().toLowerCase()) {
                                      const w = typeof s.weight === 'string' ? parseFloat(s.weight) : s.weight;
                                      if (w && !isNaN(w)) weights.push(w);
                                    }
                                  });
                                });
                                return weights.length > 0 ? Math.max(...weights) : null;
                              })();

                              return (
                                <motion.div
                                  key={`${ei}-${ex.name}`}
                                  layout
                                  initial={{ opacity: 0, y: 15 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="bg-black/35 border border-white/10 hover:border-gym-accent/30 rounded-xl p-5 flex flex-col justify-between backdrop-blur-xl relative overflow-hidden group/card transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:bg-black/55"
                                >
                                  {/* Top accent glow line */}
                                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gym-accent/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                                  
                                  {/* Left subtle indicator bar */}
                                  <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-gym-accent opacity-35 group-hover/card:opacity-100 transition-opacity duration-300" />

                                  <div className="space-y-4 pl-1">
                                    {/* Row 1: Badges & Actions */}
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[10px] text-gym-accent font-black tracking-widest font-mono bg-gym-accent/10 px-2 py-0.5 rounded-md border border-gym-accent/20">
                                          #{String(ei + 1).padStart(2, '0')}
                                        </span>
                                        {ex.category && (
                                          <span className={`text-[8px] px-2 py-0.5 rounded-md font-black uppercase tracking-[0.12em] border ${
                                            ex.category === "compound"
                                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                              : "bg-purple-500/10 text-purple-300 border-purple-500/20"
                                          }`}>
                                            {ex.category}
                                          </span>
                                        )}
                                        {label && (
                                          <span className="text-[8px] px-2 py-0.5 rounded-md font-bold uppercase tracking-[0.12em] bg-white/[0.03] text-white/50 border border-white/5">
                                            {label}
                                          </span>
                                        )}
                                      </div>

                                      {/* Premium Utility Action Tray */}
                                      <div className="flex gap-1.5 shrink-0 opacity-40 group-hover/card:opacity-100 transition-opacity duration-300">
                                        <button
                                          onClick={() => setGuidanceEx(ex)}
                                          className="p-1.5 bg-white/[0.03] border border-white/5 text-white/40 hover:text-gym-accent hover:bg-gym-accent/10 hover:border-gym-accent/20 transition-all cursor-pointer rounded-lg hover:scale-105 active:scale-95 animate-none"
                                          title="Guidance & Instructions"
                                        >
                                          <BookOpen className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleSwap(di, ei)}
                                          className="p-1.5 bg-white/[0.03] border border-white/5 text-white/40 hover:text-gym-accent hover:bg-gym-accent/10 hover:border-gym-accent/20 transition-all cursor-pointer rounded-lg hover:scale-105 active:scale-95 animate-none"
                                          title="Swap Exercise"
                                        >
                                          <RefreshCw className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleRemoveExerciseFromPlan(di, ei)}
                                          className="p-1.5 bg-red-500/[0.01] border border-red-500/10 text-red-500/50 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all cursor-pointer rounded-lg hover:scale-105 active:scale-95 animate-none"
                                          title="Remove from schedule"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Row 2: Exercise Name */}
                                    <div>
                                      <h4 className="text-base font-bold font-sans text-white tracking-tight leading-snug group-hover/card:text-gym-accent transition-colors duration-300" title={ex.name}>
                                        {ex.name}
                                      </h4>
                                    </div>



                                    {/* Row 4: Specifications & Live Stats */}
                                    <div className="pt-1 border-t border-white/5">
                                      {/* Secondary Target Badge */}
                                      <div className="flex flex-col">
                                        <span className="text-[7.5px] font-mono text-white/35 uppercase tracking-wider">PRIMARY TARGET</span>
                                        <span className="text-[10px] font-semibold text-white/80 mt-0.5 truncate">
                                          {resolvedEx?.muscleGroup ? resolvedEx.muscleGroup.toUpperCase() : label || "N/A"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Footer: Dynamic Peak Record & Trend Micro-sparkline */}
                                  <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between pl-1">
                                    <div className="flex flex-col">
                                      <span className="text-[7.5px] font-mono text-white/35 uppercase tracking-wider">PERSONAL BEST</span>
                                      <span className="text-[10.5px] font-bold font-mono text-gym-accent mt-0.5 flex items-center gap-1">
                                        {peakWeight ? (
                                          <>
                                            <Trophy className="w-3 h-3 text-gym-accent shrink-0" />
                                            <span>{peakWeight}kg</span>
                                          </>
                                        ) : (
                                          <span className="text-white/20 font-medium">Unrecorded</span>
                                        )}
                                      </span>
                                    </div>

                                    {/* High Tech Trend Sparkline Block */}
                                    <div className="flex flex-col items-end">
                                      <span className="text-[7.5px] font-mono text-white/35 uppercase tracking-wider mb-1">PROG. TREND</span>
                                      <div className="bg-black/40 border border-white/5 px-2 py-1 rounded-md flex items-center justify-center min-h-[22px]">
                                        <Sparkline
                                          exName={ex.name}
                                          sessionSets={sessionSets}
                                          archivedWorkouts={archivedWorkouts}
                                          width={65}
                                          height={14}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}

                            {/* Add Exercise Slot */}
                            <button
                              onClick={() => setAddingToDay(di)}
                              className="bg-black/30 border border-white/10 border-dashed rounded-md p-4 flex flex-col items-center justify-center gap-2 hover:bg-black/50 hover:border-gym-accent/30 transition-all cursor-pointer group/add min-h-[105px]"
                            >
                              <Plus className="w-4 h-4 text-white/40 group-hover/add:text-gym-accent transition-all animate-none" />
                              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover/add:text-white transition-all">
                                Add Exercise
                              </span>
                            </button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center opacity-40 px-8"
              >
                <div className="w-16 h-16 bg-gym-accent/10 rounded-full flex items-center justify-center mb-6">
                  <Flame className="w-8 h-8 text-gym-accent" />
                </div>
                <h2 className="text-xl font-bold mb-2">Ready to crush it?</h2>
                <p className="text-sm">
                  Select a category from the navigation above to start your
                  journey.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Add Favorite Exercise Modal */}
        <AnimatePresence>
          {favoritesModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 font-sans">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setFavoritesModalOpen(false);
                  setModalSearch("");
                }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-md overflow-hidden flex flex-col max-h-[80vh] shadow-2xl"
              >
                <div className="p-8 border-b border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-[0.3em] mb-1">
                        Select Favorite
                      </span>
                      <h3 className="text-xl font-light italic font-serif text-white">
                        Add from Favorites
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        setFavoritesModalOpen(false);
                        setModalSearch("");
                      }}
                      className="p-2 text-white/20 hover:text-white transition-all cursor-pointer text-sm font-semibold uppercase tracking-wider text-[10px]"
                    >
                      Close
                    </button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="text"
                      placeholder="Search favorite exercises..."
                      autoFocus
                      value={modalSearch}
                      onChange={(e) => setModalSearch(e.target.value)}
                      className="w-full bg-black/60 border border-white/20 rounded-md pl-12 pr-4 py-4 text-sm font-light focus:outline-none focus:border-amber-400 transition-all text-white"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {(() => {
                    const groupedFavs = getFavoriteExercisesByCategory()
                      .map(group => ({
                        ...group,
                        list: group.list.filter(ex => ex.name.toLowerCase().includes(modalSearch.toLowerCase()))
                      }))
                      .filter(group => group.list.length > 0);

                    const totalFilteredCount = groupedFavs.reduce((sum, g) => sum + g.list.length, 0);

                    if (totalFilteredCount === 0) {
                      return (
                        <div className="text-center py-12 text-white/30 text-sm flex flex-col items-center justify-center">
                          <Star className="w-8 h-8 text-white/10 mb-3" />
                          <p className="font-light">No matching favorites found.</p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-6">
                        {groupedFavs.map((group) => (
                          <div key={group.categoryTitle} className="space-y-3">
                            <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-4 ml-2 border-l border-amber-400/40 pl-3">
                              {group.categoryTitle}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {group.list.map((ex) => {
                                const isAdded = !!selectedFavorites[ex.name];
                                const subcatLabel = ex.pool
                                  ? ex.pool
                                      .split('_')
                                      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                                      .join(' ')
                                  : "";

                                return (
                                  <div key={ex.name} className="relative group">
                                    <button
                                      onClick={() => {
                                        setSelectedFavorites(prev => ({
                                          ...prev,
                                          [ex.name]: !prev[ex.name]
                                        }));
                                      }}
                                      className={`w-full flex items-center justify-between p-4 bg-black/65 border rounded-md hover:bg-black/85 transition-all text-left cursor-pointer group/inner ${
                                        isAdded
                                          ? "border-amber-500/30 text-amber-400 bg-amber-500/5"
                                          : "border-white/10 text-white/70 hover:border-amber-400/30"
                                      }`}
                                    >
                                      <div className="flex flex-col gap-1.5 min-w-0 pr-12">
                                        <span className={`text-xs font-semibold truncate transition-colors ${isAdded ? 'text-amber-400' : 'text-white/70 group-hover/inner:text-amber-400'}`}>
                                          {ex.name}
                                        </span>
                                        {subcatLabel && (
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-[8px] px-2 py-0.5 rounded font-bold uppercase tracking-[0.08em] bg-white/[0.04] text-white/40 border border-white/5">
                                              {subcatLabel}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="flex items-center shrink-0">
                                        {isAdded ? (
                                          <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/15 border border-amber-500/20 px-2.5 py-1 rounded-md text-amber-400 flex items-center gap-1">
                                            <Check className="w-2.5 h-2.5" /> Added
                                          </span>
                                        ) : (
                                          <div className="p-1 rounded bg-white/5 border border-white/10 group-hover/inner:border-amber-400/40 group-hover/inner:bg-amber-500/10 text-white/30 group-hover/inner:text-amber-400 transition-all">
                                            <Plus className="w-3.5 h-3.5 animate-none" />
                                          </div>
                                        )}
                                      </div>
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Add Exercise Modal */}
        <AnimatePresence>
          {addingToDay !== null && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setAddingToDay(null);
                  setModalSearch("");
                  setSelectedModalExercises([]);
                }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-md overflow-hidden flex flex-col max-h-[80vh] shadow-2xl"
              >
                <div className="p-8 border-b border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gym-accent font-bold uppercase tracking-[0.3em] mb-1">
                        Select Exercises (Multi-select)
                      </span>
                      <h3 className="text-xl font-light italic font-serif">
                        Add to {DAY_CONFIG[addingToDay].name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setCustomExName("");
                          setCustomExVideoUrl("");
                          setCustomGuidanceSteps([]);
                          setGuidanceStepInput("");
                          setCustomExPool(
                            DAY_CONFIG[addingToDay].pools[0] as any,
                          );
                          setCustomExCategory("compound");
                          setCreatingCustomForDay(addingToDay);
                          setShowAddCustomModal(true);
                        }}
                        className="flex items-center gap-2 px-3 py-2 border border-gym-accent/30 bg-gym-accent/5 hover:bg-gym-accent hover:text-black text-gym-accent rounded-md text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        Create Custom
                      </button>
                      <button
                        onClick={() => {
                          setAddingToDay(null);
                          setModalSearch("");
                          setSelectedModalExercises([]);
                        }}
                        className="p-2 text-white/20 hover:text-white transition-all cursor-pointer text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="text"
                      placeholder="Search relevant exercises..."
                      autoFocus
                      value={modalSearch}
                      onChange={(e) => setModalSearch(e.target.value)}
                      className="w-full bg-black/60 border border-white/20 rounded-md pl-12 pr-4 py-4 text-sm font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                    />
                  </div>

                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  {DAY_CONFIG[addingToDay].pools.map((poolKey) => {
                    const pool = combinedPools[poolKey] || [];
                    const filtered = pool.filter(
                      (ex) =>
                        ex.name
                          .toLowerCase()
                          .includes(modalSearch.toLowerCase()) &&
                        !currentDays[addingToDay].some(
                          (p) => p.name === ex.name,
                        ),
                    );

                    if (filtered.length === 0) return null;

                    const renderExercise = (ex: Exercise) => {
                      const isSelected = selectedModalExercises.some(e => e.name === ex.name);
                      return (
                        <div key={ex.name} className="relative group">
                          <button
                            onClick={() => {
                              if (isSelected) {
                                setSelectedModalExercises(prev => prev.filter(e => e.name !== ex.name));
                              } else {
                                setSelectedModalExercises(prev => [...prev, ex]);
                              }
                            }}
                            className={`w-full flex items-center justify-between p-4 bg-black/65 border rounded-md hover:bg-black/85 transition-all text-left cursor-pointer group/inner ${
                              isSelected
                                ? "border-gym-accent bg-gym-accent/5"
                                : "border-white/10 text-white/70 hover:border-gym-accent/30"
                            }`}
                          >
                            <div className="flex flex-col gap-1.5 min-w-0 pr-12">
                              <span className={`text-xs font-semibold truncate transition-colors ${isSelected ? 'text-gym-accent' : 'text-white/70 group-hover/inner:text-gym-accent'}`}>
                                {ex.name}
                              </span>
                              {ex.category && (
                                <span
                                  className={`text-[8px] font-bold tracking-wider uppercase ${
                                    isSelected
                                      ? "text-gym-accent"
                                      : ex.category === "compound"
                                        ? "text-amber-500/80"
                                        : "text-purple-400/80"
                                  }`}
                                >
                                  {ex.category === "compound" ? "C" : "I"} —{" "}
                                  {ex.category}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center shrink-0">
                              {isSelected ? (
                                <span className="text-[9px] font-black uppercase tracking-wider bg-gym-accent/15 border border-gym-accent/20 px-2.5 py-1 rounded-md text-gym-accent flex items-center gap-1">
                                  <Check className="w-2.5 h-2.5" /> Selected
                                </span>
                              ) : (
                                <div className="p-1 rounded bg-white/5 border border-white/10 group-hover/inner:border-gym-accent/40 group-hover/inner:bg-gym-accent/10 text-white/30 group-hover/inner:text-gym-accent transition-all">
                                  <Plus className="w-3.5 h-3.5 animate-none" />
                                </div>
                              )}
                            </div>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setGuidanceEx(ex);
                            }}
                            className={`absolute right-12 top-1/2 -translate-y-1/2 p-2 transition-all cursor-pointer z-10 ${
                              isSelected ? "text-gym-accent/40 hover:text-gym-accent" : "text-white/10 hover:text-gym-accent"
                            }`}
                            title="View Guidance"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    };

                    if (poolKey === "upper_back") {
                      const groups = [
                        { key: "lats", label: "Latissimus Dorsi (Lats)" },
                        { key: "rhomboids_traps", label: "Rhomboids & Traps" },
                      ] as const;

                      return (
                        <div key={poolKey} className="mb-8">
                          {groups.map((group) => {
                            const groupExercises = filtered.filter(
                              (e) =>
                                e.muscleGroup === group.key ||
                                (group.key === "rhomboids_traps" &&
                                  !e.muscleGroup),
                            ); // Fallback row
                            if (groupExercises.length === 0) return null;

                            return (
                              <div key={group.key} className="mb-6">
                                <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-2 border-l border-gym-accent/40 pl-3">
                                  {group.label} (Upper Back)
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {groupExercises.map(renderExercise)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }

                    if (poolKey === "lower_back") {
                      return (
                        <div key={poolKey} className="mb-8">
                          <div className="mb-6">
                            <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-2 border-l border-gym-accent/40 pl-3">
                              Erector Spinae & Spinal Erectors (Lower Back)
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {filtered.map(renderExercise)}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (poolKey === "legs") {
                      const groups = [
                        "quads",
                        "hamstrings",
                        "glutes",
                        "calves",
                      ] as const;

                      return (
                        <div key={poolKey} className="mb-8">
                          {groups.map((group) => {
                            const groupExercises = filtered.filter(
                              (e) => e.muscleGroup === group,
                            );
                            if (groupExercises.length === 0) return null;

                            return (
                              <div key={group} className="mb-6">
                                <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-2 border-l border-gym-accent/40 pl-3">
                                  {group} Assets
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {groupExercises.map(renderExercise)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }

                    if (poolKey === "core") {
                      return (
                        <div key={poolKey} className="mb-8">
                          <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-2 border-l border-gym-accent/40 pl-3">
                            Abs/Core Assets
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {filtered.map(renderExercise)}
                          </div>
                        </div>
                      );
                    }

                    if (poolKey === "equipment") {
                      const eqCategories = [
                        "Kettlebells",
                        "TRX",
                        "Battle Ropes",
                        "Resistance Bands",
                        "Weight Plates",
                        "Slam Balls",
                        "Plyo Boxes",
                        "Bosu Balls",
                        "Sleds",
                        "Other",
                      ];

                      return (
                        <div key={poolKey} className="mb-8">
                          {eqCategories.map((cat) => {
                            const catExercises = filtered.filter((e) => {
                              if (cat === "Other") {
                                return (
                                  !e.equipmentCategory ||
                                  (!eqCategories.includes(
                                    e.equipmentCategory,
                                  ) &&
                                    e.equipmentCategory !== "Other")
                                );
                              }
                              return e.equipmentCategory === cat;
                            });
                            if (catExercises.length === 0) return null;

                            return (
                              <div key={cat} className="mb-6">
                                <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-2 border-l border-gym-accent/40 pl-3">
                                  {cat} Equipment
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {catExercises.map(renderExercise)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }

                    return (
                      <div key={poolKey} className="mb-8">
                        <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-2 border-l border-gym-accent/40 pl-3">
                          {poolKey === "upper_back"
                            ? "Upper Back"
                            : poolKey === "lower_back"
                              ? "Lower Back"
                              : poolKey === "front_delts"
                                ? "Front Delts"
                                : poolKey === "side_delts"
                                  ? "Side Delts"
                                  : poolKey === "rear_delts"
                                    ? "Rear Delts"
                                    : poolKey === "upper_core"
                                      ? "Upper Abs"
                                      : poolKey === "lower_core"
                                        ? "Lower Abs"
                                        : poolKey === "obliques"
                                          ? "Obliques"
                                          : poolKey === "upper_chest"
                                            ? "Upper Chest"
                                            : poolKey === "middle_chest"
                                              ? "Middle Chest"
                                              : poolKey === "lower_chest"
                                                ? "Lower Chest"
                                                : poolKey === "long_biceps"
                                                  ? "Long Head Biceps"
                                                  : poolKey === "short_biceps"
                                                    ? "Short Head Biceps"
                                                    : poolKey === "brachialis"
                                                      ? "Brachialis"
                                                      : poolKey ===
                                                          "long_triceps"
                                                        ? "Long Head Triceps"
                                                        : poolKey ===
                                                            "lateral_triceps"
                                                          ? "Lateral Head Triceps"
                                                          : poolKey ===
                                                              "medial_triceps"
                                                            ? "Medial Head Triceps"
                                                            : poolKey}{" "}
                          Assets
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {filtered.map(renderExercise)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedModalExercises.length > 0 && (
                  <div className="p-6 border-t border-white/5 bg-[#080808] flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-mono">Multiselected</span>
                      <span className="text-xs font-bold text-gym-accent">
                        {selectedModalExercises.length} exercise{selectedModalExercises.length > 1 ? "s" : ""} selected
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedModalExercises([])}
                        className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all cursor-pointer"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => handleAddMultipleExercisesToPlan(addingToDay, selectedModalExercises)}
                        className="px-5 py-2.5 bg-gym-accent text-black hover:bg-white transition-all rounded-md text-[10px] font-bold uppercase tracking-widest cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 text-black animate-none" />
                        Add Selected ({selectedModalExercises.length})
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Save Routine Modal Prompt */}
        <AnimatePresence>
          {savingRoutineWorkout && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSavingRoutineWorkout(null)}
                className="absolute inset-0 bg-black/95 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-md overflow-hidden flex flex-col shadow-2xl z-50"
              >
                <div className="p-8 border-b border-white/5 relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gym-accent/5 rounded-full blur-3xl" />
                  <h3 className="text-2xl font-light italic font-serif text-white mb-1">
                    Save Routine
                  </h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">
                    Choose a category for this workout routine
                  </p>
                </div>

                <div className="p-8 space-y-4">
                  <p className="text-xs text-white/60 leading-relaxed">
                    Select 1 of the 4 exercise day categories to categorize this
                    routine. It will be saved under the corresponding section in
                    your Routines tab:
                  </p>

                  <div className="grid grid-cols-1 gap-2.5">
                    {DAY_CONFIG.map((day, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          handleSaveRoutine(savingRoutineWorkout, idx)
                        }
                        className="w-full text-left p-4 rounded-md border border-white/10 bg-white/[0.02] hover:bg-gym-accent hover:border-gym-accent hover:text-black transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-md bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center shrink-0 group-hover:bg-black/10 group-hover:border-black/20">
                            {day.icon}
                          </div>
                          <span className="text-sm font-medium font-serif italic text-white/90 group-hover:text-black">
                            {day.name}
                          </span>
                        </div>
                        <ChevronDown className="w-4 h-4 -rotate-90 text-white/20 group-hover:text-black transition-colors" />
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-end gap-2">
                    <button
                      onClick={() => setSavingRoutineWorkout(null)}
                      className="px-5 py-2.5 border border-white/10 hover:border-white/20 rounded-md text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Dynamic Exercise Progression Timeline Chart Modal */}
        <AnimatePresence>
          {selectedHistoryChartExercise && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 text-white font-sans">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedHistoryChartExercise(null)}
                className="absolute inset-0 bg-black/95 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 25 }}
                className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-md overflow-hidden flex flex-col shadow-2xl z-50 p-6 sm:p-8"
              >
                {/* Visual Glow */}
                <div
                  style={{ backgroundColor: `${activeTheme.accent}0d` }}
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none"
                />

                {/* Header */}
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div>
                    <span
                      style={{ color: activeTheme.accent }}
                      className="text-[9px] font-black uppercase tracking-[0.3em] block mb-1"
                    >
                      Performance Analytics
                    </span>
                    <h3 className="text-2xl font-light italic font-serif text-white uppercase tracking-wider">
                      {selectedHistoryChartExercise}
                    </h3>
                    <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest font-mono">
                      Logged Weight Progress Over Time
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedHistoryChartExercise(null)}
                    className="p-1.5 px-3 text-white/40 hover:text-white hover:bg-white/5 border border-white/10 rounded transition-all cursor-pointer font-mono text-xs uppercase tracking-wider"
                  >
                    Close &times;
                  </button>
                </div>

                {/* Content */}
                {(() => {
                  const chartData = getExerciseHistoryData(selectedHistoryChartExercise);

                  if (chartData.length === 0) {
                    return (
                      <div className="py-16 border border-dashed border-white/5 bg-[#070707]/30 text-center flex flex-col items-center justify-center rounded-md">
                        <Dumbbell className="w-12 h-12 text-white/10 mb-4 animate-pulse" />
                        <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                          No Chronological Logs
                        </p>
                        <p className="text-[10px] text-white/30 mt-2 max-w-[420px] leading-relaxed font-mono px-4">
                          We found no historical workout sets completed for{" "}
                          <span style={{ color: activeTheme.accent }}>
                            "{selectedHistoryChartExercise}"
                          </span>{" "}
                          in your session logs yet. Create a workout, add sets, and archive it to generate beautiful trends!
                        </p>
                      </div>
                    );
                  }

                  const first = chartData[0];
                  const last = chartData[chartData.length - 1];
                  const weights = chartData.map((d) => d.weight);
                  const maxVal = Math.max(...weights);
                  const minVal = Math.min(...weights);
                  const gap = last.weight - first.weight;

                  return (
                    <div className="space-y-6 relative z-10">
                      {/* Stats bento */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-black/40 border border-white/5 rounded-md p-3.5 flex flex-col justify-center">
                          <span className="text-[8px] text-white/30 uppercase font-black tracking-wider block mb-1">
                            Recorded lifts
                          </span>
                          <span className="text-lg font-light text-white font-mono">
                            {chartData.length}
                          </span>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-md p-3.5 flex flex-col justify-center">
                          <span className="text-[8px] text-white/30 uppercase font-black tracking-wider block mb-1">
                            Peak Weight Load
                          </span>
                          <span
                            style={{ color: activeTheme.accent }}
                            className="text-lg font-black font-mono"
                          >
                            {maxVal}{" "}
                            <span className="text-[10px] font-normal text-white/45 animate-pulse">
                              KG
                            </span>
                          </span>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-md p-3.5 flex flex-col justify-center">
                          <span className="text-[8px] text-white/30 uppercase font-black tracking-wider block mb-1">
                            Starting Load
                          </span>
                          <span className="text-lg font-light text-white/60 font-mono">
                            {first.weight}{" "}
                            <span className="text-[10px] font-normal text-white/45">
                              KG
                            </span>
                          </span>
                        </div>
                        <div
                          style={{
                            borderColor: `${activeTheme.accent}20`,
                            backgroundColor: `${activeTheme.accent}03`,
                          }}
                          className="border rounded-md p-3.5 flex flex-col justify-center"
                        >
                          <span
                            style={{ color: `${activeTheme.accent}70` }}
                            className="text-[8px] uppercase font-black tracking-wider block mb-1"
                          >
                            Absolute Growth
                          </span>
                          <span
                            style={{ color: gap >= 0 ? activeTheme.accent : "#f87171" }}
                            className="text-lg font-black font-mono flex items-center"
                          >
                            {gap >= 0 ? `+${gap}` : gap}{" "}
                            <span className="text-[10px] font-normal ml-1">
                              KG
                            </span>
                            {gap > 0 && (
                              <TrendingUp className="w-4 h-4 ml-1.5 shrink-0" />
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Line/Area Chart */}
                      <div className="w-full h-64 bg-black/35 border border-white/5 rounded-md p-4 pt-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: -22, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient
                                id="progressChartGlow"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor={activeTheme.accent}
                                  stopOpacity={0.25}
                                />
                                <stop
                                  offset="95%"
                                  stopColor={activeTheme.accent}
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="rgba(255,255,255,0.03)"
                              vertical={false}
                            />
                            <XAxis
                              dataKey="date"
                              stroke="rgba(255,255,255,0.2)"
                              fontSize={9}
                              tickLine={false}
                              axisLine={false}
                              dy={8}
                              fontFamily="monospace"
                            />
                            <YAxis
                              stroke="rgba(255,255,255,0.2)"
                              fontSize={9}
                              tickLine={false}
                              axisLine={false}
                              domain={[
                                Math.max(0, minVal - 5),
                                Math.max(10, maxVal + 5),
                              ]}
                              fontFamily="monospace"
                            />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0]
                                    .payload as any;
                                  return (
                                    <div className="bg-[#0c0c0c] border border-white/10 p-3 shadow-2xl rounded-md font-mono text-[10px]">
                                      <p className="text-white/40 mb-1 font-sans">
                                        {new Date(
                                          data.fullDate,
                                        ).toLocaleDateString("en-GB", {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                        })}
                                      </p>
                                      <p style={{ color: activeTheme.accent }} className="font-black">
                                        PEAK WEIGHT: {data.weight} kg
                                      </p>
                                      <p className="text-white/70">
                                        BEST REPS: {data.reps} reps
                                      </p>
                                      <p className="text-white/30 text-[9px] mt-0.5">
                                        SESSION VOL: {data.volume} kg
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="weight"
                              stroke={activeTheme.accent}
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#progressChartGlow)"
                              dot={{
                                r: 3,
                                fill: activeTheme.accent,
                                strokeWidth: 1,
                                stroke: "#000000",
                              }}
                              activeDot={{
                                r: 5,
                                fill: "#ffffff",
                                stroke: activeTheme.accent,
                                strokeWidth: 2,
                              }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Explanation */}
                      <p className="text-center text-[9px] text-white/20 font-mono tracking-wider uppercase">
                        • Plotted values trace your peak loaded sets per logged workout day •
                      </p>
                    </div>
                  );
                })()}

                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-white/5 flex justify-end relative z-10">
                  <button
                    onClick={() => setSelectedHistoryChartExercise(null)}
                    style={{
                      borderColor: `${activeTheme.accent}30`,
                      backgroundColor: `${activeTheme.accent}0a`,
                    }}
                    className="px-6 py-2.5 hover:bg-white/10 hover:border-white/20 rounded-md text-[10px] font-black uppercase tracking-widest text-white cursor-pointer transition-colors font-mono"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Add Custom Exercise Modal */}
        <AnimatePresence>
          {showAddCustomModal && (
            <div className="fixed inset-0 z-[105] flex items-center justify-center p-6 sm:p-12 font-sans text-white">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setShowAddCustomModal(false);
                  setCreatingCustomForDay(null);
                }}
                className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-md flex flex-col max-h-[90vh] overflow-y-auto shadow-2xl p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-[10px] text-gym-accent font-bold uppercase tracking-[0.3em] block mb-1">
                      {creatingCustomForDay !== null
                        ? `For ${DAY_CONFIG[creatingCustomForDay].name}`
                        : "Create Exercise"}
                    </span>
                    <h3 className="text-xl font-light italic font-serif">
                      Add Custom Movement
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddCustomModal(false);
                      setCreatingCustomForDay(null);
                    }}
                    className="p-2 text-white/20 hover:text-white transition-all cursor-pointer text-sm"
                  >
                    Close
                  </button>
                </div>

                <form
                  onSubmit={handleAddCustomExerciseSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">
                      Exercise Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Kettlebell Deadlift"
                      value={customExName}
                      onChange={(e) => setCustomExName(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 hover:border-white/25 focus:border-gym-accent rounded-md px-4 py-3 text-sm focus:outline-none transition-all text-white font-light"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">
                      Category (Muscle Group / Pool)
                    </label>
                    <select
                      value={customExPool}
                      onChange={(e) => setCustomExPool(e.target.value as any)}
                      className="w-full bg-black/80 border border-white/15 hover:border-white/25 focus:border-gym-accent text-white text-xs font-bold uppercase tracking-widest rounded-md px-4 py-3 focus:outline-none transition-all cursor-pointer shadow-md"
                    >
                      {creatingCustomForDay !== null ? (
                        DAY_CONFIG[creatingCustomForDay].pools.map(
                          (poolKey) => (
                            <option key={poolKey} value={poolKey}>
                              {poolKey === "upper_back"
                                ? "Upper Back"
                                : poolKey === "lower_back"
                                  ? "Lower Back"
                                  : poolKey === "front_delts"
                                    ? "Front Delts"
                                    : poolKey === "side_delts"
                                      ? "Side Delts"
                                      : poolKey === "rear_delts"
                                        ? "Rear Delts"
                                        : poolKey === "upper_core"
                                          ? "Upper Abs"
                                          : poolKey === "lower_core"
                                            ? "Lower Abs"
                                            : poolKey === "quads"
                                           ? "Quads"
                                         : poolKey === "hamstrings"
                                           ? "Hamstrings"
                                         : poolKey === "calves"
                                           ? "Calves"
                                         : poolKey === "quads"
                                           ? "Quads"
                                         : poolKey === "hamstrings"
                                           ? "Hamstrings"
                                         : poolKey === "calves"
                                           ? "Calves"
                                         : poolKey === "obliques"
                                              ? "Obliques"
                                              : poolKey === "upper_chest"
                                                ? "Upper Chest"
                                                : poolKey === "middle_chest"
                                                  ? "Middle Chest"
                                                  : poolKey === "lower_chest"
                                                    ? "Lower Chest"
                                                    : poolKey === "long_biceps"
                                                      ? "Long Head Biceps"
                                                      : poolKey ===
                                                          "short_biceps"
                                                        ? "Short Head Biceps"
                                                        : poolKey ===
                                                            "brachialis"
                                                          ? "Brachialis Biceps"
                                                          : poolKey ===
                                                              "long_triceps"
                                                            ? "Long Head Triceps"
                                                            : poolKey ===
                                                                "lateral_triceps"
                                                              ? "Lateral Head Triceps"
                                                              : poolKey ===
                                                                  "medial_triceps"
                                                                ? "Medial Head Triceps"
                                                                : poolKey
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                  poolKey.slice(
                                                                    1,
                                                                  )}
                            </option>
                          ),
                        )
                      ) : (
                        <>
                          <option value="upper_chest">Upper Chest</option>
                          <option value="middle_chest">Middle Chest</option>
                          <option value="lower_chest">Lower Chest</option>
                          <option value="upper_back">Upper Back</option>
                          <option value="lower_back">Lower Back</option>
                          <option value="front_delts">Front Delts</option>
                          <option value="side_delts">Side Delts</option>
                          <option value="rear_delts">Rear Delts</option>
                          <option value="legs">Legs</option>
                          <option value="long_biceps">Long Head Biceps</option>
                          <option value="short_biceps">
                            Short Head Biceps
                          </option>
                          <option value="brachialis">Brachialis Biceps</option>
                          <option value="long_triceps">
                            Long Head Triceps
                          </option>
                          <option value="lateral_triceps">
                            Lateral Head Triceps
                          </option>
                          <option value="medial_triceps">
                            Medial Head Triceps
                          </option>
                          <option value="forearms">Forearms</option>
                          <option value="upper_core">Upper Abs</option>
                          <option value="lower_core">Lower Abs</option>
                          <option value="obliques">Obliques</option>
                          <option value="cardio">Cardio</option>
                          <option value="equipment">Equipment</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">
                      Movement Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setCustomExCategory("compound")}
                        className={`py-3 rounded-md border text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                          customExCategory === "compound"
                            ? "border-gym-accent bg-gym-accent/10 text-gym-accent"
                            : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/25"
                        }`}
                      >
                        Compound
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomExCategory("isolation")}
                        className={`py-3 rounded-md border text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                          customExCategory === "isolation"
                            ? "border-gym-accent bg-gym-accent/10 text-gym-accent"
                            : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/25"
                        }`}
                      >
                        Isolation
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">
                      Video Demonstration URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="e.g., https://www.youtube.com/watch?v=..."
                      value={customExVideoUrl}
                      onChange={(e) => setCustomExVideoUrl(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 hover:border-white/25 focus:border-gym-accent rounded-md px-4 py-3 text-sm focus:outline-none transition-all text-white font-light"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">
                      Custom Guidance Steps
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add step (e.g., Keep back flat)"
                        value={guidanceStepInput}
                        onChange={(e) => setGuidanceStepInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (guidanceStepInput.trim()) {
                              setCustomGuidanceSteps([
                                ...customGuidanceSteps,
                                guidanceStepInput.trim(),
                              ]);
                              setGuidanceStepInput("");
                            }
                          }
                        }}
                        className="flex-1 bg-black/60 border border-white/15 hover:border-white/25 focus:border-gym-accent rounded-md px-4 py-3 text-sm focus:outline-none transition-all text-white font-light text-ellipsis overflow-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (guidanceStepInput.trim()) {
                            setCustomGuidanceSteps([
                              ...customGuidanceSteps,
                              guidanceStepInput.trim(),
                            ]);
                            setGuidanceStepInput("");
                          }
                        }}
                        className="px-4 bg-white/5 hover:bg-gym-accent hover:text-black border border-white/10 text-white/80 rounded-md text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                      >
                        Add
                      </button>
                    </div>

                    {customGuidanceSteps.length > 0 && (
                      <div className="mt-3 space-y-2 max-h-40 overflow-y-auto bg-black/45 border border-white/5 p-3 rounded-md">
                        {customGuidanceSteps.map((step, idx) => (
                          <div
                            key={idx}
                            className="flex items-start justify-between gap-3 text-xs font-light text-white/80"
                          >
                            <span className="leading-tight text-left">
                              <span className="text-gym-accent font-mono mr-1.5">
                                {idx + 1}.
                              </span>
                              {step}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setCustomGuidanceSteps(
                                  customGuidanceSteps.filter(
                                    (_, i) => i !== idx,
                                  ),
                                );
                              }}
                              className="p-1 text-white/30 hover:text-red-500 transition-all cursor-pointer text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-gym-accent text-black hover:bg-white hover:text-black font-black uppercase tracking-widest py-4 rounded-md text-sm transition-all focus:outline-none shadow-md shadow-gym-accent/5 cursor-pointer"
                    >
                      Add to Archive
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Guidance Modal */}
        <AnimatePresence>
          {guidanceEx &&
            (() => {
              const resolvedEx =
                findExerciseByName(guidanceEx.name) || guidanceEx;
              return (
                <div className="fixed inset-0 z-[110] flex justify-center overflow-y-auto p-4 sm:p-10 font-sans">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setGuidanceEx(null)}
                    className="fixed inset-0 bg-black/90 backdrop-blur-md"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-md flex flex-col shadow-2xl my-auto z-10"
                  >
                    <div className="p-10 border-b border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gym-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-md flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-gym-accent" />
                          </div>
                          <div>
                            <span className="text-[10px] text-gym-accent font-bold uppercase tracking-[0.4em] block mb-1">
                              Evolutionary Guidance
                            </span>
                            <h3 className="text-3xl font-light italic font-serif text-white tracking-tight pt-1.5 pb-1 leading-normal pr-1">
                              {resolvedEx.name}
                            </h3>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6">
                          <div className="flex flex-col">
                            <span className="text-[8px] text-white/20 uppercase tracking-widest font-black mb-1">
                              Focus Area
                            </span>
                            <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest border border-white/10 px-2 py-1 rounded-md bg-white/[0.02]">
                              {resolvedEx.pool}
                            </span>
                          </div>
                          {(() => {
                            const secondaries = getSecondaryMusclesForExercise(resolvedEx);
                            if (secondaries.length > 0) {
                              return (
                                <div className="flex flex-col">
                                  <span className="text-[8px] text-white/20 uppercase tracking-widest font-black mb-1">
                                    Synergistic Support
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {secondaries.map((mus) => (
                                      <span
                                        key={mus}
                                        className="text-[9px] text-white/50 font-bold uppercase tracking-widest border border-white/5 px-2 py-1 rounded-md bg-white/[0.01]"
                                      >
                                        {mus}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })()}
                          <div className="flex flex-col">
                            <span className="text-[8px] text-white/20 uppercase tracking-widest font-black mb-1">
                              Source
                            </span>
                            <span className="text-[10px] text-gym-accent font-black uppercase tracking-widest flex items-center gap-1">
                              PureGym Intelligence{" "}
                              <ExternalLink className="w-2 h-2" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Anatomy Mapping Section */}
                    <div className="p-10 pb-6 bg-white/[0.01] border-b border-white/5">
                      <h4 className="text-[9px] font-black text-gym-accent uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gym-accent/20" />
                        Target Muscular Activation
                        <div className="h-px flex-1 bg-gym-accent/20" />
                      </h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest text-center mb-6">
                        Primary target <span className="text-orange-500 font-bold">orange</span> / Synergistic support <span className="text-blue-400 font-bold">blue</span>
                      </p>
                      <div className="flex justify-center py-2 bg-black/40 border border-white/5 rounded-md overflow-hidden max-w-md mx-auto">
                        <AnatomyChart 
                          sets={[]} 
                          compact={true} 
                          focusedExerciseGuidance={resolvedEx} 
                        />
                      </div>
                    </div>

                    <div className="p-10 bg-white/[0.01]">
                      <h4 className="text-[9px] font-black text-gym-accent uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gym-accent/20" />
                        Execution Sequence
                        <div className="h-px flex-1 bg-gym-accent/20" />
                      </h4>

                      <div className="space-y-6">
                        {resolvedEx.instructions &&
                        resolvedEx.instructions.length > 0 ? (
                          resolvedEx.instructions.map((step, idx) => (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + idx * 0.1 }}
                              key={idx}
                              className="flex gap-6 group"
                            >
                              <div className="flex-shrink-0 w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-gym-accent group-hover:bg-gym-accent group-hover:text-black transition-all">
                                {idx + 1}
                              </div>
                              <p className="text-[14px] leading-relaxed text-white/70 font-light pt-1.5">
                                {step}
                              </p>
                            </motion.div>
                          ))
                        ) : (
                          <div className="py-12 flex flex-col items-center justify-center text-center opacity-30">
                            <RefreshCw className="w-10 h-10 animate-spin mb-4" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">
                              Compiling guide from PureGym archive...
                            </p>
                            <p className="text-[10px] uppercase tracking-widest mt-1 italic opacity-50">
                              This record is currently being indexed
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Video Demonstration Section */}
                    <div className="p-10 pb-5 bg-white/[0.01] border-t border-b border-white/5">
                      <h4 className="text-[9px] font-black text-gym-accent uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gym-accent/20" />
                        Video Demonstration
                        <div className="h-px flex-1 bg-gym-accent/20" />
                      </h4>

                      {resolvedEx.pool !== "cardio" &&
                        (resolvedEx.youtubeId ? (
                          <div className="rounded-md overflow-hidden border border-white/10 bg-black aspect-video relative shadow-lg">
                            <iframe
                              className="w-full h-full"
                              src={`https://www.youtube.com/embed/${resolvedEx.youtubeId}?rel=0`}
                              title={`PureGym Form Guide: ${resolvedEx.name}`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <div className="p-6 rounded-md border border-dashed border-white/10 bg-white/[0.005] flex flex-col items-center justify-center text-center gap-3 py-10">
                            <Youtube className="w-8 h-8 text-white/20" />
                            <div>
                              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                                Form Video Search Fallback
                              </span>
                              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                                No embedded database video. Accessing custom
                                YouTube channel queries
                              </p>
                            </div>
                          </div>
                        ))}

                      {resolvedEx.youtubeUrl && (
                        <div
                          className={`${resolvedEx.pool === "cardio" ? "" : "mt-4"} flex justify-center`}
                        >
                          <a
                            href={resolvedEx.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 border border-white/10 hover:border-gym-accent rounded-md text-white/60 hover:text-white hover:bg-gym-accent/5 transition-all cursor-pointer"
                          >
                            <Youtube className="w-4 h-4 text-red-500" />
                            Watch Tutorial on YouTube
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="p-8 border-t border-white/5 bg-white/[0.02] flex justify-end">
                      <button
                        onClick={() => setGuidanceEx(null)}
                        className="px-10 py-4 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-gym-accent hover:bg-gym-accent/5 transition-all text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer rounded-md"
                      >
                        Close Archive
                      </button>
                    </div>
                  </motion.div>
                </div>
              );
            })()}
        </AnimatePresence>

        {/* Log Set Pop-Up Modal */}
        <AnimatePresence>
          {loggingEx &&
            (() => {
              const resolvedEx = findExerciseByName(loggingEx.name) || loggingEx;
              const Icon = iconMap[resolvedEx.icon] || Dumbbell;
              return (
                <div className="fixed inset-0 z-[110] flex justify-center overflow-y-auto p-4 sm:p-10 font-sans">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                      setLoggingEx(null);
                      setPopupWeight("");
                      setPopupReps("");
                      setPopupNotes("");
                      setPopupDifficulty("moderate");
                    }}
                    className="fixed inset-0 bg-black/90 backdrop-blur-md"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-md flex flex-col shadow-2xl my-auto z-10 overflow-hidden"
                  >
                    <div className="p-6 border-b border-white/15 relative overflow-hidden bg-white/[0.01]">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gym-accent/5 rounded-full blur-2xl -mr-12 -mt-12" />
                      <div className="relative z-10 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-md flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-gym-accent" />
                          </div>
                          <div>
                            <span className="text-[8px] text-gym-accent font-black uppercase tracking-[0.3em] block mb-0.5">
                              Movement Entry Engine
                            </span>
                            <h3 className="text-lg font-light italic font-serif text-white tracking-tight leading-tight">
                              {resolvedEx.name}
                            </h3>
                            {resolvedEx.category && (
                              <span
                                className={`inline-block text-[7.5px] px-1.5 py-0.2 rounded-md font-black uppercase mt-1 tracking-widest ${
                                  resolvedEx.category === "compound"
                                    ? "bg-amber-500/10 text-amber-500/80 border border-amber-500/20"
                                    : "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                                }`}
                              >
                                {resolvedEx.category}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 ml-4 shrink-0 font-mono">
                          <Sparkline
                            exName={resolvedEx.name}
                            sessionSets={sessionSets}
                            archivedWorkouts={archivedWorkouts}
                            width={65}
                            height={16}
                          />
                          <button
                            onClick={() => {
                              setLoggingEx(null);
                              setPopupWeight("");
                              setPopupReps("");
                              setPopupNotes("");
                              setPopupDifficulty("moderate");
                            }}
                            className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white rounded-md transition-all cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                      {/* Form Inputs */}
                      <div className="flex flex-col gap-3 bg-white/[0.01] border border-white/[0.04] p-4 rounded-md w-full">
                        <div className="grid grid-cols-2 gap-3 w-full">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-white/30 uppercase tracking-widest mb-1 font-bold">
                              {resolvedEx.pool === "cardio" ? "Time (min)" : "Weight (kg)"}
                            </span>
                            <input
                              type="number"
                              inputMode="decimal"
                              placeholder="0"
                              value={popupWeight}
                              onChange={(e) => setPopupWeight(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-md py-1.5 px-2.5 text-sm font-light focus:outline-none focus:border-gym-accent focus:bg-black/60 transition-all text-white font-mono"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] text-white/30 uppercase tracking-widest mb-1 font-bold">
                              {resolvedEx.pool === "cardio" ? "Speed / Lvl" : "Reps"}
                            </span>
                            <input
                              type="number"
                              inputMode="numeric"
                              placeholder="0"
                              value={popupReps}
                              onChange={(e) => setPopupReps(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-md py-1.5 px-2.5 text-sm font-light focus:outline-none focus:border-gym-accent focus:bg-black/60 transition-all text-white font-mono"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col w-full">
                          <span className="text-[9px] text-white/30 uppercase tracking-widest mb-1 font-bold">
                            Set Notes
                          </span>
                          <input
                            type="text"
                            placeholder="Warmup, RPE 9, drop set, etc."
                            value={popupNotes}
                            onChange={(e) => setPopupNotes(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-md py-1.5 px-2.5 text-xs font-light focus:outline-none focus:border-gym-accent focus:bg-black/60 transition-all text-white"
                          />
                        </div>

                        {/* Intensity Choice */}
                        <div className="flex flex-col w-full">
                          <span className="text-[9px] text-white/30 uppercase tracking-widest mb-1 font-bold">
                            Set Intensity (How'd it feel?)
                          </span>
                          <div className="grid grid-cols-3 gap-1 p-0.5 bg-black/35 rounded-md border border-white/5">
                            <button
                              type="button"
                              onClick={() => setPopupDifficulty("easy")}
                              className={`py-1 text-[8.5px] font-mono uppercase tracking-wider font-extrabold rounded-md border transition-all cursor-pointer text-center ${
                                popupDifficulty === "easy"
                                  ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-400 font-black shadow-[0_0_8px_rgba(16,185,129,0.1)]"
                                  : "bg-transparent border-transparent text-white/40 hover:text-white/60 hover:bg-white/[0.02]"
                              }`}
                            >
                              😊 Easy
                            </button>
                            <button
                              type="button"
                              onClick={() => setPopupDifficulty("moderate")}
                              className={`py-1 text-[8.5px] font-mono uppercase tracking-wider font-extrabold rounded-md border transition-all cursor-pointer text-center ${
                                popupDifficulty === "moderate"
                                  ? "bg-amber-500/15 border-amber-500/35 text-amber-400 font-bold shadow-[0_0_8px_rgba(245,158,11,0.1)]"
                                  : "bg-transparent border-transparent text-white/40 hover:text-white/60 hover:bg-white/[0.02]"
                              }`}
                            >
                              ⚡ Good
                            </button>
                            <button
                              type="button"
                              onClick={() => setPopupDifficulty("hard")}
                              className={`py-1 text-[8.5px] font-mono uppercase tracking-wider font-extrabold rounded-md border transition-all cursor-pointer text-center ${
                                popupDifficulty === "hard"
                                  ? "bg-rose-500/15 border-rose-500/35 text-rose-400 font-black shadow-[0_0_8px_rgba(244,63,94,0.1)]"
                                  : "bg-transparent border-transparent text-white/40 hover:text-white/60 hover:bg-white/[0.02]"
                              }`}
                            >
                              🔥 Struggle
                            </button>
                          </div>
                        </div>

                        {/* Ghost set matcher */}
                        {(() => {
                          const loggedSetsForThisEx = sessionSets.filter(
                            (s) =>
                              s &&
                              s.exerciseName &&
                              s.exerciseName.trim().toLowerCase() === resolvedEx.name.trim().toLowerCase()
                          );
                          const nextSetIndex = loggedSetsForThisEx.length;
                          const previousWorkouts = archivedWorkouts
                            .filter((w) =>
                              w.sets?.some(
                                (s: any) =>
                                  s.exerciseName?.trim().toLowerCase() === resolvedEx.name.trim().toLowerCase()
                              )
                            )
                            .sort((a, b) => b.date.localeCompare(a.date));

                          const lastWorkout = previousWorkouts[0];
                          if (!lastWorkout) return null;

                          const lastSets = lastWorkout.sets.filter(
                            (s: any) =>
                              s.exerciseName?.trim().toLowerCase() === resolvedEx.name.trim().toLowerCase()
                          );

                          const ghostSet = lastSets[nextSetIndex];
                          if (!ghostSet) return null;

                          const dateFormatted = new Date(lastWorkout.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          });

                          return (
                            <div className="flex items-center justify-between bg-gym-accent/[0.02] border border-gym-accent/15 rounded-md px-2.5 py-1.5 mt-1 text-[10px] w-full font-sans">
                              <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-2">
                                <span className="relative flex h-1.5 w-1.5 shrink-0">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gym-accent/40 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gym-accent/70"></span>
                                </span>
                                <span className="text-white/40 font-mono truncate">
                                  Ghost Set {nextSetIndex + 1} ({dateFormatted}):
                                </span>
                                <span className="text-gym-accent font-mono font-bold shrink-0">
                                  {ghostSet.weight}kg × {ghostSet.reps}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setPopupWeight(ghostSet.weight.toString());
                                  setPopupReps(ghostSet.reps.toString());
                                }}
                                className="text-[9px] text-gym-accent/80 hover:text-gym-accent uppercase font-black tracking-wider bg-white/5 border border-white/10 hover:bg-gym-accent/10 hover:border-gym-accent/20 px-2 py-0.5 rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0"
                                title="Use ghost set target values"
                              >
                                Match
                              </button>
                            </div>
                          );
                        })()}

                        {/* Submit Button inside the popup */}
                        <button
                          onClick={async () => {
                            if (popupWeight && popupReps) {
                              await handleSaveSet(resolvedEx.name, popupWeight, popupReps, popupNotes, popupDifficulty, "session");
                              setPopupWeight("");
                              setPopupReps("");
                              setPopupNotes("");
                              setPopupDifficulty("moderate");
                              setToast({
                                message: `Log Entry successfully submitted for ${resolvedEx.name}!`,
                                type: "success",
                              });
                              setTimeout(() => setToast(null), 2500);
                            } else {
                              setToast({
                                message: "Please input both load weight and training reps.",
                                type: "error",
                              });
                              setTimeout(() => setToast(null), 3000);
                            }
                          }}
                          className="w-full bg-gym-accent hover:bg-gym-accent/90 text-black py-2.5 rounded-md text-[9.5px] font-black uppercase tracking-widest transition-all active:scale-[0.98] cursor-pointer text-center font-mono mt-1"
                        >
                          Submit entry Log set
                        </button>
                      </div>

                      {/* Progression Suggestion Card */}
                      {(() => {
                        if (resolvedEx.pool === "cardio") return null;
                        const exSets = sessionSets.filter(
                          (s) =>
                            s &&
                            s.exerciseName &&
                            s.exerciseName.trim().toLowerCase() === resolvedEx.name.trim().toLowerCase()
                        );
                        const weightGroups: Record<number, number[]> = {};
                        exSets.forEach((set) => {
                          const w = typeof set.weight === 'string' ? parseFloat(set.weight) : set.weight;
                          const r = typeof set.reps === 'string' ? parseInt(set.reps, 10) : set.reps;
                          if (!isNaN(w) && !isNaN(r)) {
                            if (!weightGroups[w]) weightGroups[w] = [];
                            weightGroups[w].push(r);
                          }
                        });

                        let recommendWeight = 0;
                        let targetWeight = 0;
                        let hasStruggled = false;
                        for (const [weightStr, repsList] of Object.entries(weightGroups)) {
                          const weight = parseFloat(weightStr);
                          const successfulSets = repsList.filter((r) => r >= 10).length;
                          if (successfulSets >= 3) {
                            targetWeight = weight;
                            recommendWeight = weight + 2.5;
                            hasStruggled = exSets.some((s) => {
                              const sw = typeof s.weight === "string" ? parseFloat(s.weight) : s.weight;
                              return sw === weight && s.difficulty === "hard";
                            });
                            break;
                          }
                        }

                        if (recommendWeight > 0) {
                          if (hasStruggled) {
                            return (
                              <div className="p-3.5 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-300 flex flex-col gap-2 shadow-[0_0_15px_rgba(245,158,11,0.08)]">
                                <div className="flex items-center gap-1.5 justify-between">
                                  <span className="text-[9px] font-black uppercase tracking-[0.2em] font-mono text-amber-400 flex items-center gap-1.5">
                                    <Activity className="w-3.5 h-3.5" />
                                    STRENGTH CONSOLIDATION RECOMMENDED
                                  </span>
                                  <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full font-mono font-bold">
                                    Safety Loop Active
                                  </span>
                                </div>
                                <p className="text-[10px] text-white/70 leading-relaxed font-sans">
                                  You completed <strong className="text-white">3 sets of 10+ reps</strong> at <span className="text-amber-400 font-mono font-bold">{targetWeight}kg</span>! Since you noted that this was a struggle (🔥), our cybernetic engine recommends maintaining <strong className="text-white">{targetWeight}kg</strong> for another workout to solidify neural adaptation before loading further.
                                </p>
                              </div>
                            );
                          }

                          return (
                            <div className="p-3.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex flex-col gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                              <div className="flex items-center gap-1.5 justify-between">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] font-mono text-emerald-400 flex items-center gap-1.5">
                                  <TrendingUp className="w-3.5 h-3.5" />
                                  PROGRESSION TARGET ACQUIRED
                                </span>
                                <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-mono font-bold">
                                  +{2.5}kg Target
                                </span>
                              </div>
                              <p className="text-[10px] text-white/70 leading-relaxed font-sans">
                                You completed <strong className="text-white">3 sets of 10+ reps</strong> at <span className="text-emerald-400 font-mono font-bold">{targetWeight}kg</span> today! Double-progression triggered. Upgrade your target weight.
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  setPopupWeight(recommendWeight.toString());
                                  setPopupReps("10");
                                  setToast({
                                    message: `Set ${resolvedEx.name} target weight to ${recommendWeight}kg × 10 reps!`,
                                    type: "success",
                                  });
                                  setTimeout(() => setToast(null), 2000);
                                }}
                                className="w-full mt-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-black font-semibold rounded-md text-[9px] font-black uppercase tracking-[0.15em] font-mono transition-all cursor-pointer shadow-md shadow-emerald-500/15 text-center"
                              >
                                Apply {recommendWeight}kg Recommendation
                              </button>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* Personal Bests & Submitted Sets History */}
                      <div className="border-t border-white/5 pt-4">
                        <span className="text-[8px] text-white/30 uppercase tracking-widest font-mono font-bold block mb-2">
                          Performance & History Registry
                        </span>
                        <PBBlock
                          exName={resolvedEx.name}
                          pbs={personalBests}
                          showLatest={true}
                          sessionSets={sessionSets}
                          archivedWorkouts={archivedWorkouts}
                        />
                      </div>
                    </div>

                    <div className="p-4 border-t border-white/5 bg-white/[0.01] flex justify-end">
                      <button
                        onClick={() => {
                          setLoggingEx(null);
                          setPopupWeight("");
                          setPopupReps("");
                          setPopupNotes("");
                          setPopupDifficulty("moderate");
                        }}
                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all text-[10px] font-black uppercase tracking-wider cursor-pointer rounded-md"
                      >
                        Done / Close
                      </button>
                    </div>
                  </motion.div>
                </div>
              );
            })()}
        </AnimatePresence>

        {/* Biomechanical Alternatives (Swapping) Modal */}
        <AnimatePresence>
          {swappingExercise &&
            (() => {
              const currentEx = swappingExercise.exercise;
              const poolKey = getSubcategoryPoolKey(currentEx);
              
              const pool = poolKey ? (combinedPools[poolKey] || []) : [];
              const currentDayIdx = swappingExercise.dayIndex;
              const currentDayExNames = new Set(
                (currentDays[currentDayIdx] || []).map((d) => d.name.trim().toLowerCase())
              );
              
              const alternatives = pool.filter((e) => {
                const normalizedEName = e.name.trim().toLowerCase();
                return (
                  normalizedEName !== currentEx.name.trim().toLowerCase() &&
                  !currentDayExNames.has(normalizedEName)
                );
              });

              const filteredAlternatives = alternatives
                .filter((alt) => alt.name.toLowerCase().includes(swapSearch.toLowerCase()))
                .sort((a, b) => a.name.localeCompare(b.name));

              const formattedCategoryName = poolKey
                ? poolKey
                    .split("_")
                    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")
                : "Unknown subcategory";

              return (
                <div className="fixed inset-0 z-[115] flex justify-center overflow-y-auto p-4 sm:p-10 font-sans">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                      setSwappingExercise(null);
                      setSwapSearch("");
                    }}
                    className="fixed inset-0 bg-black/95 backdrop-blur-md"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-md flex flex-col shadow-2xl my-auto z-10"
                  >
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gym-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-md flex items-center justify-center">
                            <ArrowLeftRight className="w-6 h-6 text-gym-accent" />
                          </div>
                          <div>
                            <span className="text-[10px] text-gym-accent font-bold uppercase tracking-[0.4em] block mb-1">
                              Biomechanical Alternatives Finder
                            </span>
                            <h3 className="text-3xl font-light italic font-serif text-white tracking-tight pt-1 leading-normal pr-1">
                              Swap: {currentEx.name}
                            </h3>
                          </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-md p-4 mt-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <span className="text-[8px] text-white/30 uppercase tracking-widest font-black block mb-0.5">
                                Target Section / Compartment
                              </span>
                              <span className="text-xs text-white/90 font-bold uppercase tracking-wider font-mono bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded-md inline-block">
                                {formattedCategoryName}
                              </span>
                            </div>
                            {alternatives.length > 0 && (
                              <button
                                onClick={() => {
                                  const randomEx = alternatives[Math.floor(Math.random() * alternatives.length)];
                                  executeSwap(swappingExercise.dayIndex, swappingExercise.exIndex, randomEx);
                                  setSwapSearch("");
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-gym-accent hover:bg-gym-accent/90 text-black text-[10px] font-black uppercase tracking-widest transition-all rounded-md cursor-pointer self-start sm:self-center"
                              >
                                <Zap className="w-3.5 h-3.5 fill-black" />
                                Surprise Me (Random Equivalent)
                              </button>
                            )}
                          </div>
                          <p className="text-[10px] text-white/40 leading-relaxed mt-3">
                            Direct replacements target the exact same muscle fibers and joint mechanics. Select an option below to keep your high-quality stimulus without waiting for blocked equipment.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Search inside alternatives */}
                    <div className="px-8 pt-6 pb-2 border-b border-white/5 bg-white/[0.01]">
                      <div className="relative">
                        <Search className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={swapSearch}
                          onChange={(e) => setSwapSearch(e.target.value)}
                          placeholder={`Search ${alternatives.length} biomechanical equivalents...`}
                          className="w-full bg-black/60 border border-white/10 focus:border-gym-accent rounded-md pl-11 pr-4 py-3 text-xs font-light focus:outline-none transition-all text-white placeholder-white/20 font-mono"
                        />
                      </div>
                    </div>

                    {/* Alternatives list */}
                    <div className="p-8 max-h-[350px] overflow-y-auto space-y-3">
                      {filteredAlternatives.length > 0 ? (
                        filteredAlternatives.map((alt) => {
                          return (
                            <div
                              key={alt.name}
                              onClick={() => {
                                executeSwap(swappingExercise.dayIndex, swappingExercise.exIndex, alt);
                                setSwapSearch("");
                              }}
                              className="group p-4 bg-white/[0.01] border border-white/5 hover:border-gym-accent/30 hover:bg-gym-accent/[0.02] rounded-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div className="space-y-1.5 flex-1 pr-4">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-base font-semibold text-white/90 group-hover:text-gym-accent transition-colors leading-snug">
                                    {alt.name}
                                  </h4>
                                  {alt.category && (
                                    <span
                                      className={`text-[8px] px-1.5 py-0.2 rounded-md font-black uppercase tracking-[0.1em] ${
                                        alt.category === "compound"
                                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                          : "bg-purple-500/15 text-purple-300 border border-purple-500/20"
                                      }`}
                                    >
                                      {alt.category}
                                    </span>
                                  )}
                                </div>
                                {alt.instructions && alt.instructions.length > 0 && (
                                  <p className="text-[10px] text-white/40 leading-relaxed font-light line-clamp-2">
                                    💡 {alt.instructions[0]}
                                  </p>
                                )}
                              </div>
                              <span className="shrink-0 px-4 py-2 border border-white/10 group-hover:border-gym-accent group-hover:bg-gym-accent group-hover:text-black hover:bg-gym-accent text-white/60 text-[9px] font-black uppercase tracking-widest transition-all rounded-md cursor-pointer whitespace-nowrap text-center">
                                Swap & Replace
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-8 rounded-md border border-dashed border-white/10 bg-white/[0.005] flex flex-col items-center justify-center text-center gap-3 py-10">
                          <Dumbbell className="w-8 h-8 text-white/20" />
                          <div>
                            <span className="text-xs font-bold text-white uppercase tracking-wider block">
                              No Matches Found
                            </span>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                              Try clearing filters or check the exercise name
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end">
                      <button
                        onClick={() => {
                          setSwappingExercise(null);
                          setSwapSearch("");
                        }}
                        className="px-8 py-3.5 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-gym-accent hover:bg-gym-accent/5 transition-all text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer rounded-md"
                      >
                        Cancel Swap
                      </button>
                    </div>
                  </motion.div>
                </div>
              );
            })()}
        </AnimatePresence>

        {/* Google Drive Action Confirmation Dialog */}
        <AnimatePresence>
          {driveConfirmAction && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDriveConfirmAction(null)}
                className="absolute inset-0 bg-black/95 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-md overflow-hidden flex flex-col shadow-2xl"
              >
                <div className="p-8 border-b border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gym-accent/5 rounded-full blur-2xl -mr-12 -mt-12" />
                  <div className="relative z-10 flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-md flex items-center justify-center border ${
                        driveConfirmAction.type === "delete"
                          ? "bg-red-500/10 border-red-500/25 text-red-500"
                          : "bg-gym-accent/10 border-gym-accent/20 text-gym-accent"
                      }`}
                    >
                      {driveConfirmAction.type === "delete" ? (
                        <Trash2 className="w-5 h-5 text-red-500" />
                      ) : (
                        <Download className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.4em] block mb-1">
                        {driveConfirmAction.type === "delete"
                          ? "Destructive Action"
                          : "System Restoration"}
                      </span>
                      <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                        {driveConfirmAction.type === "delete"
                          ? "Confirm Deletion"
                          : "Confirm Restore"}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <p className="text-xs text-white/60 leading-relaxed font-light">
                    {driveConfirmAction.type === "delete" ? (
                      <>
                        Are you sure you want to permanently delete{" "}
                        <span className="font-semibold text-white font-mono break-all">
                          {driveConfirmAction.fileName}
                        </span>{" "}
                        from your Google Drive? This action is irreversible.
                      </>
                    ) : (
                      <>
                        Are you sure you want to restore the backup file{" "}
                        <span className="font-semibold text-white font-mono break-all">
                          {driveConfirmAction.fileName}
                        </span>
                        ? This will overwrite your active training days,
                        progress logs, and personal best history.
                      </>
                    )}
                  </p>
                </div>

                <div className="p-6 border-t border-white/5 bg-white/[0.01] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setDriveConfirmAction(null)}
                    className="px-5 py-3 hover:text-white text-white/40 text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (driveConfirmAction.type === "delete") {
                        executeDeleteBackup(driveConfirmAction.fileId);
                      } else {
                        executeRestoreBackup(driveConfirmAction.fileId);
                      }
                    }}
                    className={`px-6 py-3 text-black text-[10px] font-black uppercase tracking-widest cursor-pointer rounded-md transition-all hover:brightness-110 ${
                      driveConfirmAction.type === "delete"
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/10"
                        : "bg-gym-accent text-black shadow-lg shadow-gym-accent/10"
                    }`}
                  >
                    {driveConfirmAction.type === "delete"
                      ? "Permanently Delete"
                      : "Confirm Restore"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Progress Report Modal Overlay */}
        <AnimatePresence>
          {showProgressReport &&
            (() => {
              const totalLifetimeVolume = archivedWorkouts.reduce(
                (sum, w) => sum + (w.totalVolume || 0),
                0,
              );
              const milestones = [
                { target: 10000, label: "Novice" },
                { target: 100000, label: "Warrior" },
                { target: 500000, label: "Titan" },
                { target: 1000000, label: "Immortal" },
              ];
              const currentMilestoneIndex = milestones.findIndex(
                (m) => totalLifetimeVolume < m.target,
              );
              const isMaxed = currentMilestoneIndex === -1;
              const currentRankName = isMaxed
                ? "Immortal Legend"
                : milestones[
                    currentMilestoneIndex === -1
                      ? 3
                      : Math.max(0, currentMilestoneIndex - 1)
                  ].label;

              const OUTFITS_MAP: Record<string, string> = {
                vanguard_cadet: "Vanguard Cadet",
                neon_striker: "Neon Striker",
                shadow_hunter: "Shadow Hunter",
                cyber_beast: "Cyber Beast",
                golden_disciple: "Golden Disciple",
                omega_prime: "Omega Prime",
                shadow_wraith: "Phantom Wraith",
                lumen_sentinel: "Lumen Sentinel",
              };

              const AVATAR_IMAGES: Record<string, string> = {
                vanguard_cadet: imgVanguardDefault,
                neon_striker: imgNeonStrikerDefault,
                shadow_hunter: imgShadowHunterDefault,
                cyber_beast: imgCyberBeastDefault,
                golden_disciple: imgGoldenDiscipleDefault,
                omega_prime: imgOmegaPrimeDefault,
                shadow_wraith: imgShadowWraithDefault,
                lumen_sentinel: imgLumenSentinelDefault,
              };

              const activeOutfitId =
                profile?.equippedOutfit || "vanguard_cadet";
              const avatarImg =
                avatarImgBase64 || AVATAR_IMAGES[activeOutfitId] || imgVanguardDefault;

              return (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-md overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowProgressReport(false)}
                    className="absolute inset-0 z-0 cursor-pointer"
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 40 }}
                    className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#050505] border border-white/10 rounded-md shadow-2xl overflow-hidden"
                  >
                    {/* Modal Top Ribbon Controls */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/50 backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-4 h-4 text-gym-accent animate-pulse" />
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-widest text-white">
                            Progress Report Card
                          </h3>
                          <p className="text-[9px] text-white/30 uppercase tracking-widest font-mono">
                            Archive Identity Sheet
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setShowProgressReport(false)}
                          className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest text-[10px] rounded-md transition-all hover:brightness-110 active:scale-95 flex items-center gap-2 cursor-pointer shadow-lg shadow-white/5"
                        >
                          Close
                        </button>
                      </div>
                    </div>

                    {/* Report Card Viewer */}
                    <div className="p-4 sm:p-6 flex-1 overflow-y-auto no-scrollbar bg-black/40 flex justify-center items-[normal]">
                      {/* Outer scaling wrapper for clean representation of the fixed widescreen poster */}
                      <div
                        id="progress-report-container"
                        className="w-full overflow-hidden flex justify-center items-start py-4"
                        style={
                          reportCardHeight
                            ? {
                                height: `${reportCardHeight * reportCardScale}px`,
                              }
                            : {}
                        }
                      >
                        {/* The snapshot report card container */}
                        <div
                          id="progress-report-card"
                          style={{
                            transform: `scale(${reportCardScale})`,
                            transformOrigin: "top center",
                            width: "780px",
                            backgroundColor: activeTheme.bg || "#050505",
                          }}
                          className="p-8 border border-gym-accent/25 rounded-md flex flex-col gap-6 font-sans shrink-0 text-white relative select-none"
                        >
                          {/* Corner Tech Anchors */}
                          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gym-accent/40" />
                          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gym-accent/40" />
                          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gym-accent/40" />
                          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gym-accent/40" />

                          {/* Poster Header */}
                          <div className="flex items-center justify-between border-b border-white/5 pb-5 relative">
                            <div className="absolute top-0 left-12 w-32 h-[1px] bg-gradient-to-r from-gym-accent/30 to-transparent" />
                            <div>
                              <span className="text-xs font-mono font-bold tracking-[0.4em] text-gym-accent uppercase block">
                                TEMPLE INTELLIGENCE RECORD
                              </span>
                              <h2 className="text-2xl font-light italic font-serif tracking-tight text-white uppercase mt-0.5">
                                THE IRON ARCHIVE
                              </h2>
                            </div>
                            <div className="text-right font-mono text-[11px] text-white leading-relaxed font-medium">
                              <div>
                                TIMESTAMP:{" "}
                                {new Date()
                                  .toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                  .toUpperCase()}
                              </div>
                              <div className="text-gym-accent font-bold">
                                ARCHIVE SEC : #
                                {Math.floor(Math.random() * 90000) + 10000}
                              </div>
                            </div>
                          </div>

                          {/* Metrics Card Row */}
                          <div className="grid grid-cols-12 gap-5 items-stretch">
                            {/* Avatar Column */}
                            <div className="col-span-4 bg-white/[0.015] border border-white/10 rounded-md p-4 flex flex-col items-center justify-between text-center relative overflow-hidden">
                              <span className="text-[10px] font-mono font-bold tracking-widest text-white uppercase block">
                                AVATAR SPECIMEN
                              </span>

                              {/* Image Box - Converted to elegant rectangular dossier avatar display card */}
                              <div className="w-[136px] h-[170px] rounded-md bg-black/50 border border-gym-accent/30 overflow-hidden flex items-center justify-center my-4 relative shadow-inner">
                                {avatarImg ? (
                                  <img
                                    src={avatarImg}
                                    alt="Avatar spec"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                    crossOrigin="anonymous"
                                  />
                                ) : (
                                  <UserIcon className="w-12 h-12 text-white/10" />
                                )}
                                {/* Technical scan lines overlay effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                                <div className="absolute top-0 inset-x-0 h-[1px] bg-gym-accent/20" />
                                <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gym-accent/20" />
                                
                                {/* Corner indicators inside the rectangle card */}
                                <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-gym-accent/40" />
                                <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-gym-accent/40" />
                                <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-gym-accent/40" />
                                <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-gym-accent/40" />

                                {/* Floating Level */}
                                <div className="absolute bottom-2 font-mono font-bold text-[11px] text-gym-accent tracking-widest uppercase">
                                  LVL {profile?.avatarLevel ?? 1}
                                </div>
                              </div>

                              <div className="space-y-0.5">
                                <h4 className="text-base font-light italic font-serif text-white">
                                  {profile?.displayName ||
                                    currentUser?.displayName ||
                                    "Athlete Specimen"}
                                </h4>
                                <span className="text-[11px] font-mono tracking-widest text-gym-accent uppercase block">
                                  {OUTFITS_MAP[activeOutfitId] ||
                                    "Vanguard Cadet"}
                                </span>
                              </div>
                            </div>

                            {/* Numeric Profile Matrix */}
                            <div className="col-span-8 bg-white/[0.015] border border-white/10 rounded-md p-5 flex flex-col justify-between relative overflow-hidden">
                              <div>
                                <span className="text-[10px] font-mono font-bold tracking-widest text-white uppercase block">
                                  METRIC CONSOLE
                                </span>

                                <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-4">
                                  <div className="space-y-0.5 pb-2 border-b border-white/5">
                                    <span className="text-[11px] font-mono font-bold tracking-widest text-white uppercase block">
                                      Captured Sessions
                                    </span>
                                    <span className="text-xl font-bold text-gym-accent font-sans">
                                      {archivedWorkouts.length} SECURED
                                    </span>
                                  </div>
                                  <div className="space-y-0.5 pb-2 border-b border-white/10">
                                    <span className="text-[11px] font-mono font-bold tracking-widest text-white uppercase block">
                                      Volume Lifted
                                    </span>
                                    <span className="text-xl font-bold text-gym-accent font-sans">
                                      {(
                                        totalLifetimeVolume || 0
                                      ).toLocaleString()}{" "}
                                      <span className="text-[11px] text-white font-semibold">
                                        kg
                                      </span>
                                    </span>
                                  </div>
                                  <div className="space-y-0.5">
                                    <span className="text-[11px] font-mono font-bold tracking-widest text-white uppercase block">
                                      Active Training Days
                                    </span>
                                    <span className="text-xl font-bold text-gym-accent font-sans">
                                      {profile?.streakCount || 0} Streak
                                    </span>
                                  </div>
                                  <div className="space-y-0.5">
                                    <span className="text-[11px] font-mono font-bold tracking-widest text-white uppercase block">
                                      Energy Reserves
                                    </span>
                                    <span className="text-xl font-bold text-gym-accent font-sans">
                                      {(
                                        profile?.avatarCredits || 0
                                      ).toLocaleString()}{" "}
                                      CR
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="border-t border-white/5 pt-4 mt-5 flex items-center justify-between">
                                <div>
                                  <span className="text-[10px] font-mono font-bold tracking-widest text-white uppercase block">
                                    RANKING CLASSIFICATION
                                  </span>
                                  <span className="text-lg font-serif italic text-gym-accent block leading-none mt-1">
                                    {currentRankName}
                                  </span>
                                </div>
                                <div className="w-10 h-10 rounded-full border border-gym-accent/20 bg-gym-accent/5 flex items-center justify-center">
                                  <Trophy className="w-5 h-5 text-gym-accent" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Chart Section 1: Physical Progress Area Chart */}
                          <div className="bg-white/[0.015] border border-white/10 rounded-md p-5 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-4 relative z-10">
                              <div>
                                <span className="text-[10px] font-mono font-bold tracking-widest text-gym-accent uppercase block">
                                  TIMELINE DATA _01
                                </span>
                                <span className="text-xs font-mono font-black text-white uppercase tracking-widest">
                                  Weight Log Analysis (kg)
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-gym-accent uppercase tracking-widest pt-1">
                                HISTORICAL ENTRIES: {weightHistory.length}
                              </span>
                            </div>
                            <div className="h-32 w-full">
                              {weightHistory.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center border border-white/5 border-dashed rounded-md bg-black/40">
                                  <TrendingUp className="w-6 h-6 text-white/10 mb-1" />
                                  <span className="text-[10px] text-white/55 uppercase tracking-widest">
                                    No physical logs archived
                                  </span>
                                </div>
                              ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart
                                    data={(() => {
                                      const grouped = weightHistory.reduce(
                                        (acc, entry) => {
                                          acc[entry.date] = entry;
                                          return acc;
                                        },
                                        {} as Record<string, WeightEntry>,
                                      );
                                      return (
                                        Object.values(grouped) as WeightEntry[]
                                      ).sort(
                                        (a, b) =>
                                          new Date(a.date).getTime() -
                                          new Date(b.date).getTime(),
                                      );
                                    })()}
                                    margin={{
                                      top: 10,
                                      right: 10,
                                      left: -25,
                                      bottom: 0,
                                    }}
                                  >
                                    <defs>
                                      <linearGradient
                                        id="reportWeightGrad"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                      >
                                        <stop
                                          offset="5%"
                                          stopColor={activeTheme.accent}
                                          stopOpacity={0.25}
                                        />
                                        <stop
                                          offset="95%"
                                          stopColor={activeTheme.accent}
                                          stopOpacity={0}
                                        />
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                      strokeDasharray="3 3"
                                      stroke="#ffffff03"
                                      vertical={false}
                                    />
                                    <XAxis
                                      dataKey="date"
                                      stroke="#ffffff60"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={false}
                                      tickFormatter={(str) => {
                                        if (!str) return "";
                                        try {
                                          const [y, m, d] = str
                                            .split("-")
                                            .map(Number);
                                          return new Date(
                                            y,
                                            m - 1,
                                            d,
                                          ).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                          });
                                        } catch (e) {
                                          return str;
                                        }
                                      }}
                                    />
                                    <YAxis
                                      domain={[
                                        (dataMin: number) =>
                                          Math.max(0, Math.floor(dataMin - 3)),
                                        (dataMax: number) =>
                                          Math.ceil(dataMax + 3),
                                      ]}
                                      stroke="#ffffff60"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={false}
                                    />
                                    <Area
                                      type="monotone"
                                      dataKey="weight"
                                      stroke={activeTheme.accent}
                                      strokeWidth={1.5}
                                      fillOpacity={1}
                                      fill="url(#reportWeightGrad)"
                                    />
                                  </AreaChart>
                                </ResponsiveContainer>
                              )}
                            </div>
                          </div>

                          {/* Chart Section 2: Volume Progression Timeline Area Chart */}
                          <div className="bg-white/[0.015] border border-white/10 rounded-md p-5 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-4 relative z-10">
                              <div>
                                <span className="text-[10px] font-mono font-bold tracking-widest text-gym-accent uppercase block">
                                  TIMELINE DATA _02
                                </span>
                                <span className="text-xs font-mono font-black text-white uppercase tracking-widest">
                                  Training Volume Trend (kg)
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-gym-accent uppercase tracking-widest pt-1">
                                TIMEFRAME: {volumeTimeframe.toUpperCase()}
                              </span>
                            </div>
                            <div className="h-32 w-full">
                              {archivedWorkouts.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center border border-white/5 border-dashed rounded-md bg-black/40">
                                  <Activity className="w-6 h-6 text-white/10 mb-1" />
                                  <span className="text-[10px] text-white/55 uppercase tracking-widest">
                                    No active training logs archived
                                  </span>
                                </div>
                              ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart
                                    data={getVolumeData()}
                                    margin={{
                                      top: 10,
                                      right: 10,
                                      left: -25,
                                      bottom: 0,
                                    }}
                                  >
                                    <defs>
                                      <linearGradient
                                        id="reportVolGrad"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                      >
                                        <stop
                                          offset="5%"
                                          stopColor={activeTheme.accent}
                                          stopOpacity={0.25}
                                        />
                                        <stop
                                          offset="95%"
                                          stopColor={activeTheme.accent}
                                          stopOpacity={0}
                                        />
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                      strokeDasharray="3 3"
                                      stroke="#ffffff03"
                                      vertical={false}
                                    />
                                    <XAxis
                                      dataKey="date"
                                      stroke="#ffffff60"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={false}
                                      tickFormatter={(str) => {
                                        if (!str) return "";
                                        try {
                                          if (volumeTimeframe === "month") {
                                            const [y, m] = str.split("-");
                                            return new Date(
                                              Number(y),
                                              Number(m) - 1,
                                              1,
                                            ).toLocaleDateString("en-GB", {
                                              month: "short",
                                              year: "2-digit",
                                            });
                                          }
                                          if (volumeTimeframe === "week")
                                            return `W/C ${str.split("-").slice(1).reverse().join("/")}`;
                                          const [y, m, d] = str
                                            .split("-")
                                            .map(Number);
                                          return new Date(
                                            y,
                                            m - 1,
                                            d,
                                          ).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                          });
                                        } catch (e) {
                                          return str;
                                        }
                                      }}
                                    />
                                    <YAxis
                                      stroke="#ffffff60"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={false}
                                      tickFormatter={(val) =>
                                        val >= 1000
                                          ? `${(val / 1000).toFixed(0)}t`
                                          : `${val}`
                                      }
                                    />
                                    <Area
                                      type="monotone"
                                      dataKey="volume"
                                      stroke={activeTheme.accent}
                                      strokeWidth={1.5}
                                      fillOpacity={1}
                                      fill="url(#reportVolGrad)"
                                    />
                                  </AreaChart>
                                </ResponsiveContainer>
                              )}
                            </div>
                          </div>

                          {/* Chart Section 3: Caloric Progression Timeline Area Chart */}
                          <div className="bg-white/[0.015] border border-white/10 rounded-md p-5 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-4 relative z-10">
                              <div>
                                <span className="text-[10px] font-mono font-bold tracking-widest text-gym-accent uppercase block">
                                  TIMELINE DATA _03
                                </span>
                                <span className="text-xs font-mono font-black text-white uppercase tracking-widest">
                                  Active Calorie Expenditure (kcal)
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-gym-accent uppercase tracking-widest pt-1">
                                HISTORICAL ENTRIES: {archivedWorkouts.length}
                              </span>
                            </div>
                            <div className="h-32 w-full">
                              {archivedWorkouts.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center border border-white/5 border-dashed rounded-md bg-black/40">
                                  <Flame className="w-5 h-5 text-white/10 mb-1 animate-pulse" />
                                  <span className="text-[10px] text-white/55 uppercase tracking-widest">
                                    No active training logs archived
                                  </span>
                                </div>
                              ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart
                                    data={(() => {
                                      const getWorkoutCalories = (w: any) => {
                                        if (w.sets && w.sets.length > 0) {
                                          return calculateCaloriesBurned(w.sets, profile);
                                        }
                                        return w.estimatedCalories || w.caloriesBurned || 0;
                                      };

                                      const dailyMap: Record<
                                        string,
                                        { date: string; calories: number }
                                      > = {};
                                      archivedWorkouts.forEach((w) => {
                                        const cal = getWorkoutCalories(w);
                                        const d =
                                          w.date ||
                                          new Date()
                                            .toISOString()
                                            .split("T")[0];
                                        if (!dailyMap[d]) {
                                          dailyMap[d] = {
                                            date: d,
                                            calories: 0,
                                          };
                                        }
                                        dailyMap[d].calories += cal;
                                      });

                                      return Object.values(dailyMap).sort(
                                        (a, b) => a.date.localeCompare(b.date),
                                      );
                                    })()}
                                    margin={{
                                      top: 10,
                                      right: 10,
                                      left: -25,
                                      bottom: 0,
                                    }}
                                  >
                                    <defs>
                                      <linearGradient
                                        id="reportCalGrad"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                      >
                                        <stop
                                          offset="5%"
                                          stopColor={activeTheme.accent}
                                          stopOpacity={0.25}
                                        />
                                        <stop
                                          offset="95%"
                                          stopColor={activeTheme.accent}
                                          stopOpacity={0}
                                        />
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                      strokeDasharray="3 3"
                                      stroke="#ffffff03"
                                      vertical={false}
                                    />
                                    <XAxis
                                      dataKey="date"
                                      stroke="#ffffff60"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={false}
                                      tickFormatter={(str) => {
                                        if (!str) return "";
                                        try {
                                          const [y, m, d] = str
                                            .split("-")
                                            .map(Number);
                                          return new Date(
                                            y,
                                            m - 1,
                                            d,
                                          ).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                          });
                                        } catch (e) {
                                          return str;
                                        }
                                      }}
                                    />
                                    <YAxis
                                      stroke="#ffffff60"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={false}
                                      width={25}
                                    />
                                    <Area
                                      type="monotone"
                                      dataKey="calories"
                                      stroke={activeTheme.accent}
                                      strokeWidth={1.5}
                                      fillOpacity={1}
                                      fill="url(#reportCalGrad)"
                                    />
                                  </AreaChart>
                                </ResponsiveContainer>
                              )}
                            </div>
                          </div>

                          {/* Chart Section 4: Body Fat Progression Timeline Area Chart */}
                          <div className="bg-white/[0.015] border border-white/10 rounded-md p-5 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-4 relative z-10">
                              <div>
                                <span className="text-[10px] font-mono font-bold tracking-widest text-gym-accent uppercase block">
                                  TIMELINE DATA _04
                                </span>
                                <span className="text-xs font-mono font-black text-white uppercase tracking-widest">
                                  Body Fat Percentage Trend (%)
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-gym-accent uppercase tracking-widest pt-1">
                                HISTORICAL ENTRIES: {bodyFatHistory.length}
                              </span>
                            </div>
                            <div className="h-32 w-full">
                              {bodyFatHistory.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center border border-white/5 border-dashed rounded-md bg-black/40">
                                  <Percent className="w-5 h-5 text-white/10 mb-1 animate-pulse" />
                                  <span className="text-[10px] text-white/55 uppercase tracking-widest">
                                    No body fat logs archived
                                  </span>
                                </div>
                              ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart
                                    data={(() => {
                                      const grouped = bodyFatHistory.reduce(
                                        (acc, entry) => {
                                          acc[entry.date] = entry;
                                          return acc;
                                        },
                                        {} as Record<string, BodyFatEntry>,
                                      );
                                      return (
                                        Object.values(grouped) as BodyFatEntry[]
                                      ).sort(
                                        (a, b) =>
                                          new Date(a.date).getTime() -
                                          new Date(b.date).getTime(),
                                      );
                                    })()}
                                    margin={{
                                      top: 10,
                                      right: 10,
                                      left: -25,
                                      bottom: 0,
                                    }}
                                  >
                                    <defs>
                                      <linearGradient
                                        id="reportBodyFatGrad"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                      >
                                        <stop
                                          offset="5%"
                                          stopColor={activeTheme.accent}
                                          stopOpacity={0.25}
                                        />
                                        <stop
                                          offset="95%"
                                          stopColor={activeTheme.accent}
                                          stopOpacity={0}
                                        />
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                      strokeDasharray="3 3"
                                      stroke="#ffffff03"
                                      vertical={false}
                                    />
                                    <XAxis
                                      dataKey="date"
                                      stroke="#ffffff60"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={false}
                                      tickFormatter={(str) => {
                                        if (!str) return "";
                                        try {
                                          const [y, m, d] = str
                                            .split("-")
                                            .map(Number);
                                          return new Date(
                                            y,
                                            m - 1,
                                            d,
                                          ).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                          });
                                        } catch (e) {
                                          return str;
                                        }
                                      }}
                                    />
                                    <YAxis
                                      domain={[
                                        (dataMin: number) =>
                                          Math.max(0, Math.floor(dataMin - 2)),
                                        (dataMax: number) =>
                                          Math.ceil(dataMax + 2),
                                      ]}
                                      stroke="#ffffff60"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={false}
                                      width={25}
                                      tickFormatter={(val) => `${val}%`}
                                    />
                                    <Area
                                      type="monotone"
                                      dataKey="bodyFatPercent"
                                      stroke={activeTheme.accent}
                                      strokeWidth={1.5}
                                      fillOpacity={1}
                                      fill="url(#reportBodyFatGrad)"
                                    />
                                  </AreaChart>
                                </ResponsiveContainer>
                              )}
                            </div>
                          </div>

                          {/* Tech Badge Footer */}
                          <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-2 relative">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full border border-gym-accent/40 flex items-center justify-center text-gym-accent text-[10px] font-mono font-bold font-black bg-gym-accent/5">
                                IA
                              </div>
                              <div>
                                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em] block">
                                  SECURE CLOUD STORAGE
                                </span>
                                <span className="text-[11px] text-white tracking-wider font-mono font-medium">
                                  ARCHIVE CORE ACCESS SIGN-OFF
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em] block">
                                SECURE VERIFIED SIGNATURE
                              </span>
                              <span className="text-sm font-serif italic text-gym-accent">
                                TEMPLE COMMAND ADMIN
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Floating Action Button (FAB) for PDF Export */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleExportPdf}
                      disabled={isExportingReport}
                      className="absolute bottom-6 right-6 z-[130] flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gym-accent to-gym-accent-light text-black font-black uppercase tracking-widest text-[10px] rounded-full shadow-2xl cursor-pointer hover:brightness-110 active:scale-95 transition-all outline-none border border-black/15 select-none group focus:ring-2 focus:ring-gym-accent/50"
                    >
                      {isExportingReport ? (
                        <Loader2 className="w-4.5 h-4.5 animate-spin text-black" />
                      ) : (
                        <Download className="w-4.5 h-4.5 text-black group-hover:translate-y-0.5 transition-transform" />
                      )}
                      <span>{isExportingReport ? "Generating PDF..." : "Export PDF Summary"}</span>
                    </motion.button>
                  </motion.div>
                </div>
              );
            })()}
        </AnimatePresence>

        {/* Floating Sticky Rest Timer Banner */}
        <AnimatePresence>
          {activeView === "workout" &&
            workoutInnerTab === "program" &&
            formattedProgram.length > 0 &&
            scrollY > 350 && (
              <motion.div
                initial={{ opacity: 0, y: 50, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: 50, x: "-50%" }}
                className="fixed bottom-6 left-1/2 z-[150] bg-black/90 border border-gym-accent/30 rounded-full py-1.5 pl-3.5 pr-2.5 flex items-center gap-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.85)] shadow-gym-accent/10 backdrop-blur-md"
              >
                {/* Visual state indicator dot */}
                <div className="relative flex h-2 w-2 shrink-0">
                  <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 bg-gym-accent ${manualRestActive ? "animate-ping" : ""}`}></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gym-accent"></span>
                </div>

                {/* Timer text */}
                <div className="flex items-center gap-2">
                  <span className="text-base font-black font-mono tracking-tight tabular-nums leading-none text-white">
                    {(() => {
                      const secs = manualRestTime;
                      const m = Math.floor(secs / 60);
                      const s = secs % 60;
                      return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
                    })()}
                  </span>
                  
                  <span className="text-[8px] font-mono font-bold text-white/40 uppercase tracking-widest leading-none">
                    {manualRestActive ? "COUNTDOWN" : "STANDBY"}
                  </span>
                </div>

                {/* Separator line */}
                <div className="h-4 w-[1px] bg-white/10" />

                {/* Minimal context/controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setManualRestActive(!manualRestActive);
                      playRestBeep(880, 0.05);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[8px] font-mono font-bold uppercase transition-all cursor-pointer ${
                      manualRestActive
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    }`}
                  >
                    {manualRestActive ? "Pause" : "Start"}
                  </button>
                  <button
                    onClick={() => {
                      setManualRestTime(manualRestTarget);
                      setManualRestActive(false);
                      playRestBeep(440, 0.08);
                    }}
                    className="px-2.5 py-1 rounded-full text-[8px] font-mono font-bold uppercase bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Reset
                  </button>

                  {/* Audio toggler icon button */}
                  <button
                    onClick={() => setRestAudioEnabled(!restAudioEnabled)}
                    className="p-1 hover:text-white transition-colors cursor-pointer"
                    title={restAudioEnabled ? "Mute" : "Unmute"}
                  >
                    {restAudioEnabled ? (
                      <Volume2 className="w-3.5 h-3.5 text-gym-accent" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 text-white/30" />
                    )}
                  </button>
                </div>
              </motion.div>
            )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 20, x: "-50%" }}
              className={`fixed bottom-10 left-1/2 z-[200] px-6 py-3 rounded-md border shadow-2xl flex items-center gap-3 min-w-[280px] ${
                toast.type === "pb"
                  ? "bg-gym-accent border-gym-accent text-black"
                  : "bg-[#0d0d0d] border-gym-accent/30 text-white"
              }`}
            >
              {toast.type === "pb" ? (
                <Trophy className="w-4 h-4" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-gym-accent animate-pulse" />
              )}
              <span className="text-[11px] font-bold uppercase tracking-widest">
                {toast.message}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Session Summary Modal */}
        <AnimatePresence>
          {sessionSummary && (
            <div
              className="fixed inset-0 z-[240] flex items-center justify-center overflow-y-auto p-4 sm:p-10 bg-black/90 backdrop-blur-md"
              onClick={() => setSessionSummary(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl bg-[#080808] border border-gym-accent/20 rounded-md flex flex-col shadow-2xl my-auto z-10 overflow-hidden"
              >
                {/* Visual Top Glow and Accent lines */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 via-gym-accent to-purple-600" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-gym-accent/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

                {/* Header */}
                <div className="p-8 border-b border-white/5 relative z-10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gym-accent/10 border border-gym-accent/30 rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(235,255,0,0.1)]">
                      <Award className="w-6 h-6 text-gym-accent" />
                    </div>
                    <div>
                      <span className="text-[9px] text-gym-accent font-black uppercase tracking-[0.3em] block mb-1">
                        Evolution Achieved
                      </span>
                      <h3 className="text-2xl font-light italic font-serif text-white leading-none">
                        Workout Session Completed!
                      </h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest block">
                      Session Date
                    </span>
                    <span className="text-xs font-bold text-white/90 uppercase tracking-widest font-mono">
                      {sessionSummary.date}
                    </span>
                  </div>
                </div>

                {/* Scrollable Body */}
                <div className="p-8 overflow-y-auto max-h-[70vh] space-y-8 relative z-10 custom-scrollbar">
                  {/* Grid of Key Performance Indicators */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Volume KPI */}
                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-md hover:border-gym-accent/20 transition-all flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[8px] text-white/40 uppercase tracking-widest font-black">
                          Total Volume
                        </span>
                        <Zap className="w-4 h-4 text-gym-accent/80" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold font-mono text-white tracking-tight">
                          {sessionSummary.totalVolume.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">
                          kg
                        </span>
                      </div>
                    </div>

                    {/* Peak Lift KPI */}
                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-md hover:border-gym-accent/20 transition-all flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[8px] text-white/40 uppercase tracking-widest font-black">
                          Peak Lift
                        </span>
                        <Trophy className="w-4 h-4 text-yellow-500/80" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold font-mono text-white tracking-tight">
                          {sessionSummary.peakWeight.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">
                          kg
                        </span>
                        <span className="text-[8px] text-white/50 block truncate uppercase tracking-widest mt-1" title={sessionSummary.peakExercise}>
                          {sessionSummary.peakExercise}
                        </span>
                      </div>
                    </div>

                    {/* Total Sets KPI */}
                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-md hover:border-gym-accent/20 transition-all flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[8px] text-white/40 uppercase tracking-widest font-black">
                          Completed Sets
                        </span>
                        <Activity className="w-4 h-4 text-cyan-400/80" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold font-mono text-white tracking-tight">
                          {sessionSummary.totalSets}
                        </span>
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">
                          sets
                        </span>
                        <span className="text-[8px] text-white/50 block uppercase tracking-widest mt-1">
                          Across {sessionSummary.exercisesList.length} movements
                        </span>
                      </div>
                    </div>

                    {/* Energy Output KPI */}
                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-md hover:border-gym-accent/20 transition-all flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[8px] text-white/40 uppercase tracking-widest font-black">
                          Energy Output
                        </span>
                        <Flame className="w-4 h-4 text-orange-500/80" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold font-mono text-white tracking-tight">
                          {sessionSummary.caloriesBurned}
                        </span>
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">
                          kcal
                        </span>
                        <span className="text-[8px] text-white/50 block uppercase tracking-widest mt-1">
                          Estimated Burn
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Muscle Groups Breakdown & Detailed Exercise list side-by-side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    {/* Left Panel: Muscle Groups targeted (visual horizontal bars) */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <Target className="w-3.5 h-3.5 text-gym-accent" />
                          Targeted Muscle Profiles
                        </h4>
                        
                        {sessionSummary.muscleGroups.length === 0 ? (
                          <p className="text-[10px] text-white/30 uppercase tracking-widest py-4">
                            No muscle data logged for this session.
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {sessionSummary.muscleGroups.map((muscle) => (
                              <div key={muscle.name} className="space-y-1.5">
                                <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest">
                                  <span className="text-white/80">{muscle.name}</span>
                                  <span className="text-gym-accent font-mono">{muscle.percentage}% ({muscle.count} sets)</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${muscle.percentage}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="h-full rounded-full bg-gradient-to-r from-gym-accent/60 to-gym-accent shadow-[0_0_8px_rgba(235,255,0,0.3)]"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Pure Rewards Section */}
                      <div className="bg-gym-accent/[0.02] border border-gym-accent/15 p-4 rounded-md space-y-3">
                        <h5 className="text-[8px] font-black text-gym-accent uppercase tracking-[0.25em] flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" />
                          Session Loot & Rewards
                        </h5>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-black/40 border border-white/5 p-2.5 rounded-md flex items-center gap-2">
                            <span className="text-gym-accent font-mono font-bold">+400</span>
                            <span className="text-[9px] text-white/40 uppercase font-black tracking-widest font-sans">XP GAINED</span>
                          </div>
                          <div className="bg-black/40 border border-white/5 p-2.5 rounded-md flex items-center gap-2">
                            <span className="text-gym-accent font-mono font-bold">+250</span>
                            <span className="text-[9px] text-white/40 uppercase font-black tracking-widest font-sans">CREDITS</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel: Detailed Exercises List */}
                    <div className="space-y-4">
                      <h4 className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Dumbbell className="w-3.5 h-3.5 text-gym-accent" />
                        Movement Performance Breakdown
                      </h4>

                      <div className="space-y-3 overflow-y-auto max-h-[320px] pr-2 custom-scrollbar">
                        {sessionSummary.exercisesList.map((exItem) => (
                          <div
                            key={exItem.name}
                            className="bg-white/[0.01] border border-white/5 hover:border-white/10 p-3.5 rounded-md space-y-2 transition-all"
                          >
                            <div className="flex items-start justify-between gap-4 font-sans">
                              <span className="text-xs font-bold text-white/90 leading-snug break-words max-w-[70%]">
                                {exItem.name}
                              </span>
                              <span className="text-[9px] font-mono text-gym-accent border border-gym-accent/20 px-2 py-0.5 rounded-md uppercase tracking-widest bg-gym-accent/5 shrink-0">
                                {exItem.setsCount} Sets
                              </span>
                            </div>

                            <div className="flex items-center gap-6 text-[10px] uppercase font-mono tracking-wider text-white/40">
                              <div>
                                <span className="block text-[8px] font-black tracking-widest text-white/20 uppercase mb-0.5">Peak Weight</span>
                                <span className="text-white/80 font-bold">{exItem.maxWeight} kg</span>
                              </div>
                              <div className="h-4 w-px bg-white/5" />
                              <div>
                                <span className="block text-[8px] font-black tracking-widest text-white/20 uppercase mb-0.5">Volume</span>
                                <span className="text-white/80 font-bold">{exItem.volume.toLocaleString()} kg</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-8 border-t border-white/5 bg-black/40 flex items-center justify-between gap-4 z-10">
                  <div className="hidden sm:block text-left">
                    <p className="text-[9px] text-white/20 uppercase tracking-widest font-black leading-normal">
                      PureGym Performance Engine
                    </p>
                    <p className="text-[8px] text-white/40 uppercase tracking-widest font-bold font-mono">
                      Evolution logged to database successfully.
                    </p>
                  </div>
                  <button
                    onClick={() => setSessionSummary(null)}
                    className="w-full sm:w-auto px-10 py-4 bg-gym-accent text-black hover:bg-white font-black uppercase tracking-[0.25em] text-[10px] cursor-pointer rounded-md transition-all duration-300 shadow-lg shadow-gym-accent/10 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4 stroke-[3px]" />
                    Acknowledge Evolution
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Full Note Overlay Modal */}
        <AnimatePresence>
          {viewingNote && (
            <div
              className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setViewingNote(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-[#0d0d0d] border border-gym-accent/30 rounded-md shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 bg-black/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gym-accent animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                      Set Note
                    </span>
                  </div>
                  <button
                    onClick={() => setViewingNote(null)}
                    className="text-white/40 hover:text-white/90 transition-all text-sm font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Body */}
                <div className="p-5 max-h-[300px] overflow-y-auto">
                  <p className="text-sm font-normal text-white/95 whitespace-pre-wrap leading-relaxed font-sans">
                    {viewingNote}
                  </p>
                </div>

                {/* Footer */}
                <div className="border-t border-white/5 px-4 py-3 bg-black/20 flex justify-end">
                  <button
                    onClick={() => setViewingNote(null)}
                    className="bg-gym-accent hover:bg-gym-accent/90 text-black px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all active:scale-[0.98] cursor-pointer font-mono"
                  >
                    Okay
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
