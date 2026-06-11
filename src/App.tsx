import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
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
  BookOpen,
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
  FlaskConical,
  Zap,
  Target,
  Sliders,
  Brain,
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
} from "recharts";
import AnatomyChart from "./components/AnatomyChart";
import AnatomyDashboard from "./components/AnatomyDashboard";
import Sparkline from "./components/Sparkline";
import AICoach from "./components/AICoach";
import RadarChart from "./components/RadarChart";
import AvatarPanel, { OUTFITS, TITLES } from "./components/AvatarPanel";
import { AvatarDisplayCard } from "./components/AvatarDisplayCard";
import { TransparentCharacter } from "./components/TransparentCharacter";
import TacticalMap from "./components/TacticalMap";
import WorkoutCalendarHeatmap from "./components/WorkoutCalendarHeatmap";
import { SpinalDepletionWidget } from "./components/SpinalDepletionWidget";
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
import { Exercise, POOLS } from "./data/exercises";
import { getProTipsForExercise } from "./data/proTips";

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

const DAY_CONFIG = [
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
    pools: ["legs", "upper_core", "lower_core", "obliques"],
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

const calculateCaloriesBurned = (
  sets: SessionSet[],
  userProfile: UserProfile | null,
) => {
  if (!sets || sets.length === 0) return 0;

  const bodyweight = userProfile?.bodyweight || 75; // kg
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

  let totalCalories = 0;
  const numExercises = Object.keys(setsByExercise).length;

  Object.entries(setsByExercise).forEach(([exName, exSets]) => {
    const ex = findExByName(exName);
    const isCardio = ex?.pool === "cardio";
    const isEquipment = ex?.pool === "equipment";

    const activeMET = isCardio ? 8.0 : isEquipment ? 6.5 : 5.5;
    const restMET = 1.5;

    if (isCardio) {
      exSets.forEach((s) => {
        const durationMin = s.weight || 0;
        const activeCalPerMin = (activeMET * 3.5 * bodyweight) / 200;
        totalCalories += durationMin * activeCalPerMin;
      });
    } else {
      exSets.forEach((s) => {
        const reps = s.reps || 0;
        const activeTimeSec = reps * 4;
        const restTimeSec = 45;

        const activeTimeMin = activeTimeSec / 60;
        const restTimeMin = restTimeSec / 60;

        const activeCalPerMin = (activeMET * 3.5 * bodyweight) / 200;
        const restCalPerMin = (restMET * 3.5 * bodyweight) / 200;

        totalCalories +=
          activeTimeMin * activeCalPerMin + restTimeMin * restCalPerMin;
      });
    }
  });

  if (numExercises > 1) {
    const transitionMin = ((numExercises - 1) * 90) / 60;
    const transitionCalPerMin = (1.3 * 3.5 * bodyweight) / 200;
    totalCalories += transitionMin * transitionCalPerMin;
  }

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

  // 1. From active session
  sessionSets.forEach((s) => {
    if (
      s &&
      s.exerciseName &&
      s.exerciseName.trim().toLowerCase() === exName.trim().toLowerCase()
    ) {
      exerciseSets.push({ weight: s.weight, reps: s.reps, date: s.date });
    }
  });

  // 2. From archived sessions
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

  // Calculate maximum 1 Rep Max (1RM) using Epley Formula
  let max1RM = 0;
  let maxBaseSet: { weight: number; reps: number; date?: string } | null = null;

  exerciseSets.forEach((set) => {
    if (set.weight > 0 && set.reps > 0) {
      const base1RM =
        set.reps === 1 ? set.weight : set.weight * (1 + set.reps / 30);
      if (base1RM > max1RM) {
        max1RM = base1RM;
        maxBaseSet = set;
      }
    }
  });

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
    <div className="mt-3 p-4 rounded-sm bg-black/55 border border-gym-accent/20">
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

      {max1RM > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] opacity-40 uppercase tracking-widest flex items-center gap-1">
              <Flame className="w-3 h-3 text-gym-accent animate-pulse" /> Est. 1
              Rep Max
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-semibold text-gym-accent">
                {max1RM.toFixed(1)}
              </span>
              <span className="text-[10px] text-gym-accent-light uppercase font-medium">
                kg
              </span>
            </div>
          </div>
          {maxBaseSet && (
            <div className="text-right flex flex-col justify-end">
              <span className="text-[9px] text-white/20 uppercase tracking-tighter">
                Based on
              </span>
              <span className="text-[10px] text-white/50 font-mono">
                {maxBaseSet.weight}kg × {maxBaseSet.reps}
              </span>
              {maxBaseSet.date && (
                <span className="text-[8px] text-white/30">
                  (
                  {(() => {
                    if (maxBaseSet.date.includes("-")) {
                      const parts = maxBaseSet.date.split("-").map(Number);
                      if (parts.length === 3) {
                        const d = new Date(parts[0], parts[1] - 1, parts[2]);
                        return d.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        });
                      }
                    }
                    return maxBaseSet.date;
                  })()}
                  )
                </span>
              )}
            </div>
          )}
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
      <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-sm p-2 text-sm focus-within:border-gym-accent focus-within:bg-white/[0.04] transition-all">
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
  const [personalBests, setPersonalBests] = useState<Record<string, PB>>({});
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [bodyFatHistory, setBodyFatHistory] = useState<BodyFatEntry[]>([]);
  const [sessionSets, setSessionSets] = useState<SessionSet[]>([]);
  const [archivedWorkouts, setArchivedWorkouts] = useState<any[]>([]);
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
    | "profile"
    | "anatomy"
    | "avatar"
  >("console");
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

  // --- Custom Routine Builder States ---
  const [isCreatingRoutine, setIsCreatingRoutine] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");
  const [newRoutineCategory, setNewRoutineCategory] = useState(0);
  const [newRoutineExercises, setNewRoutineExercises] = useState<{
    id: string;
    exerciseName: string;
    sets: { weight: number; reps: number; notes: string }[];
  }[]>([]);
  const [builderSearch, setBuilderSearch] = useState("");
  const [newRoutinePeriodization, setNewRoutinePeriodization] = useState<"hypertrophy" | "strength" | "deload">("hypertrophy");

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
    return list;
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

  const [profile, setProfile] = useState<UserProfile | null>(null);
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
  const [expandedProgressSections, setExpandedProgressSections] = useState<
    Record<string, boolean>
  >({
    weight: true,
    bodyFat: true,
    workoutCalendar: true,
    trending: false,
  });
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
  const [reportCardScale, setReportCardScale] = useState(1);
  const [reportCardHeight, setReportCardHeight] = useState<number | null>(null);

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

  const findExerciseByName = (name: string): Exercise | null => {
    if (!name) return null;
    const searchName = name.trim().toLowerCase();
    for (const pool of Object.values(combinedPools)) {
      const ex = pool.find((e) => e.name.trim().toLowerCase() === searchName);
      if (ex) return ex;
    }
    return null;
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

  // Trigger automatic profile leveling reset to Level 3 on first load for the logged-in user
  useEffect(() => {
    if (!currentUser) return;
    const hasBeenReset =
      localStorage.getItem(`gym_profile_reset_v4_${currentUser.uid}`) ===
      "true";
    if (!hasBeenReset) {
      handleResetProfile().then(() => {
        localStorage.setItem(`gym_profile_reset_v4_${currentUser.uid}`, "true");
      });
    }
  }, [currentUser]);

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
    setWeightHistory([]);
    setBodyFatHistory([]);
    setSessionSets([]);
    setArchivedWorkouts([]);
    setRoutines([]);
    setProfile(null);
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
          const initialProfile: UserProfile = {
            startDate: new Date().toISOString(),
            streakCount: 0,
            activeView: "console",
            displayName: currentUser.displayName || "",
            photoURL: currentUser.photoURL || "",
          };
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
        const workouts: any[] = [];
        snapshot.forEach((d) => workouts.push({ id: d.id, ...d.data() }));
        setArchivedWorkouts(workouts);
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
    };
  }, [currentUser]);

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

  const handleSwap = (dayIndex: number, exIndex: number) => {
    if (!currentDays[dayIndex]) return;
    const day = [...currentDays[dayIndex]];
    const ex = day[exIndex];
    if (!ex) return;

    let poolKey = ex.pool;
    if (!poolKey || !combinedPools[poolKey]) {
      const lowerExName = ex.name.trim().toLowerCase();
      // Search across ALL pools to find which one contains this exercise
      for (const [key, exercises] of Object.entries(combinedPools)) {
        if (
          exercises.some((e) => e.name.trim().toLowerCase() === lowerExName)
        ) {
          poolKey = key as any;
          break;
        }
      }
    }

    if (!poolKey || !combinedPools[poolKey]) {
      console.warn(
        "Could not find pool for exercise:",
        ex.name,
        "poolKey:",
        poolKey,
      );
      // Fallback: If we still can't find it, try to guess from common strings or default to chest
      const low = ex.name.toLowerCase();
      if (
        low.includes("chest") ||
        low.includes("press") ||
        low.includes("bench") ||
        low.includes("fly")
      )
        poolKey = "chest";
      else if (
        low.includes("rack pull") ||
        low.includes("exten") ||
        low.includes("good morning")
      )
        poolKey = "lower_back";
      else if (
        low.includes("row") ||
        low.includes("lat") ||
        low.includes("back") ||
        low.includes("pull") ||
        low.includes("chin")
      )
        poolKey = "upper_back";
      else if (low.includes("bicep") || low.includes("curl"))
        poolKey = "biceps";
      else if (
        low.includes("tricep") ||
        low.includes("skull") ||
        low.includes("dip")
      )
        poolKey = "triceps";
      else if (
        low.includes("squat") ||
        low.includes("leg") ||
        low.includes("deadlift") ||
        low.includes("hamstring")
      )
        poolKey = "legs";
      else if (low.includes("lateral raise")) poolKey = "side_delts";
      else if (low.includes("rear delt") || low.includes("face pull"))
        poolKey = "rear_delts";
      else if (
        low.includes("shoulder") ||
        low.includes("raise") ||
        low.includes("press") ||
        low.includes("arnold")
      )
        poolKey = "front_delts";
      else if (
        low.includes("oblique") ||
        low.includes("twist") ||
        low.includes("side plank") ||
        low.includes("heel tap") ||
        low.includes("bicycle")
      )
        poolKey = "obliques";
      else if (
        low.includes("leg raise") ||
        low.includes("flutter") ||
        low.includes("reverse crunch") ||
        low.includes("deadbug")
      )
        poolKey = "lower_core";
      else if (
        low.includes("ab") ||
        low.includes("crunch") ||
        low.includes("core") ||
        low.includes("sit up") ||
        low.includes("plank")
      )
        poolKey = "upper_core";

      if (!poolKey) {
        alert(
          `Cannot determine exercise category for "${ex.name}". Please manually swap via Library.`,
        );
        return;
      }
    }

    const pool = combinedPools[poolKey];
    // Filter out current exercise and any other exercise already in the day
    const currentDayExNames = new Set(
      day.map((d) => d.name.trim().toLowerCase()),
    );
    const otherExercises = pool.filter((e) => {
      const normalizedEName = e.name.trim().toLowerCase();
      return (
        normalizedEName !== ex.name.trim().toLowerCase() &&
        !currentDayExNames.has(normalizedEName)
      );
    });

    if (otherExercises.length === 0) {
      alert("No more unique exercises left in this category to swap!");
      return;
    }

    const newEx =
      otherExercises[Math.floor(Math.random() * otherExercises.length)];
    day[exIndex] = newEx;

    const nextCurrentDays = [...currentDays];
    nextCurrentDays[dayIndex] = day;
    setCurrentDays(nextCurrentDays);
    saveWorkout(nextCurrentDays);

    // Provide immediate visual feedback
    setFlashMessage((prev) => ({ ...prev, [newEx.name]: "SWAPPED" }));
    setTimeout(() => {
      setFlashMessage((prev) => {
        const next = { ...prev };
        delete next[newEx.name];
        return next;
      });
    }, 2000);
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
    const nextDays = [...currentDays];
    nextDays[dayIndex] = nextDays[dayIndex].filter((_, i) => i !== exIndex);
    setCurrentDays(nextDays);
    saveWorkout(nextDays);
  };

  const handleOrganizeMovementOrder = () => {
    const totalExercises = currentDays.reduce(
      (acc, val) => acc + val.length,
      0,
    );
    if (totalExercises === 0) {
      setToast({ message: "No exercises selected to organize.", type: "info" });
      return;
    }

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
    setToast({
      message: "Exercises reorganized: Compounds first, then Isolations!",
      type: "success",
    });
  };

  const handleSaveSet = async (
    exName: string,
    weight: string,
    reps: string,
    notes: string = "",
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

    if (!existing) {
      isNewPB = true;
    } else {
      if (nWeight > existing.bestWeight) {
        isNewPB = true;
      } else if (nWeight === existing.bestWeight && nReps > existing.bestReps) {
        isNewPB = true;
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

    setPersonalBests((prev) => ({ ...prev, [exName]: updatedPB }));
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
    };

    // Optimistic Update
    setSessionSets((prev) => [...prev, newSet]);

    setToast({
      message: isNewPB
        ? `New PB: ${exName}!`
        : `Logged ${exName}: ${nWeight}kg × ${nReps}`,
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
        prev ? { ...prev, ...streakUpdate, ...avatarUpdate } : null,
      );

      if (leveledUp) {
        setToast({
          message: `🔥 LEVEL UP! You are now Level ${nextLevel}!`,
          type: "success",
        });
        setTimeout(() => setToast(null), 3000);
      }

      const p1 = setDoc(doc(db, pbsPath), {
        ...updatedPB,
        updatedAt: serverTimestamp(),
      });

      const p2 = setDoc(doc(db, setsPath), {
        exerciseName: exName,
        weight: nWeight,
        reps: nReps,
        date: fullDate,
        timestamp: serverTimestamp(),
        notes: notes.trim(),
      });

      const p3 = setDoc(
        doc(db, settingsPath),
        {
          ...streakUpdate,
          ...avatarUpdate,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      await Promise.all([p1, p2, p3]);
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

  const handleArchiveWorkout = async () => {
    if (!currentUser || sessionSets.length === 0) return;

    try {
      setDataLoading(true);
      const batch = writeBatch(db);

      const dates = Array.from(new Set(sessionSets.map((s) => s.date))).sort(
        (a: string, b: string) => b.localeCompare(a),
      );
      const targetDate = dates[0] || new Date().toISOString().split("T")[0];

      const totalVolume = sessionSets.reduce((sum, s) => {
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
      const workoutRef = doc(
        collection(db, `users/${currentUser.uid}/workouts`),
      );

      const estimatedCalories = calculateCaloriesBurned(sessionSets, profile);

      const workoutData = {
        date: targetDate,
        timestamp: serverTimestamp(),
        sets: sessionSets,
        totalVolume,
        exercisesCount: new Set(sessionSets.map((s) => s.exerciseName)).size,
        totalSets: sessionSets.length,
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

      // sessionSets will be cleared via onSnapshot
      setSelectedWorkoutId(workoutRef.id);
      alert(`Workout session from ${targetDate} captured and archived!`);
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

      const categoryIndex =
        typeof routine.categoryIndex === "number" ? routine.categoryIndex : 0;
      const nextCurrentDays = [...currentDays];
      nextCurrentDays[categoryIndex] = exercisesToSet;

      setCurrentDays(nextCurrentDays);
      await saveWorkout(nextCurrentDays);

      setExpandedDays((prev) => ({ ...prev, [categoryIndex]: true }));
      setLastLoadedDayIndex(categoryIndex);
      setTimeout(() => {
        setLastLoadedDayIndex(null);
      }, 5000);

      setActiveView("workout");
      await saveSettings({ activeView: "workout" });

      setToast({
        message: `Loaded ${exercisesToSet.length} exercises into ${DAY_CONFIG[categoryIndex].name}!`,
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
          className="relative z-10 max-w-md w-full p-10 border border-white/10 rounded-sm bg-black/40 backdrop-blur-md"
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
                className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-4 text-sm font-light focus:outline-none focus:border-gym-accent transition-all text-white"
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
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-4 text-sm font-light focus:outline-none focus:border-gym-accent transition-all text-white"
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
              className="w-full bg-gym-accent text-black py-4 rounded-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-gym-accent/20 mt-6"
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
              className="w-full bg-white/5 border border-white/10 text-white/60 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
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

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 pb-32">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 border-b border-gym-accent/20 pb-10">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gym-accent font-bold">
              Premium Session
            </span>
            <h1 className="text-5xl font-light italic font-serif tracking-widest text-theme-text leading-none">
              Titan{" "}
              <span className="text-gym-accent accent-glow-strong">Pro</span>
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end text-right">
              <p className="text-[10px] text-theme-text-muted uppercase tracking-widest mb-0.5 flex items-center gap-2 justify-end">
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
                className="p-2.5 bg-white/5 border border-white/10 rounded-sm text-theme-text-muted hover:text-theme-text hover:bg-white/10 transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Tabs / Navigation */}
        <nav className="flex items-center mb-12 border-b border-white/10 pb-6 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth w-full">
          <div className="flex items-center gap-6 md:gap-8 flex-nowrap w-full">
            {[
              { id: "console", label: "Console", icon: LayoutDashboard },
              { id: "workout", label: "Programming", icon: Dumbbell },
              { id: "library", label: "Library", icon: Search },
              { id: "progress", label: "Progress", icon: Scale },
              { id: "anatomy", label: "Anatomy", icon: Layout },
              { id: "session", label: "Session", icon: History },
              { id: "routines", label: "Routines", icon: Repeat },
              { id: "map", label: "Tactical Map", icon: Compass },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => {
                  setActiveView(nav.id as any);
                  saveSettings({ activeView: nav.id });
                }}
                className={`relative text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer pb-1 flex items-center gap-1.5 shrink-0 select-none ${
                  activeView === nav.id
                    ? "text-theme-text"
                    : "text-theme-text-muted hover:text-theme-text"
                }`}
                title={nav.id === "routines" ? "Routines" : nav.label}
              >
                {nav.id === "routines" ? (
                  <Repeat
                    className={`w-4 h-4 shrink-0 ${activeView === "routines" ? "text-gym-accent" : ""}`}
                  />
                ) : null}
                {nav.id === "map" ? (
                  <Compass
                    className={`w-4 h-4 shrink-0 ${activeView === "map" ? "text-gym-accent" : "text-theme-text-muted/65 hover:text-white"}`}
                  />
                ) : null}
                {nav.id !== "routines" && nav.id !== "map" && nav.label}
                {activeView === nav.id && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-[25px] left-0 right-0 h-0.5 bg-gym-accent accent-shadow-nav"
                  />
                )}
              </button>
            ))}

            {/* Flexible spacer to push Avatar to the right side on desktop while allowing elegant sliding */}
            <div className="flex-grow min-w-[24px] md:min-w-[48px]" />

            {[
              { id: "avatar", label: "Avatar", icon: Crown, isAvatar: true },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => {
                  setActiveView(nav.id as any);
                  saveSettings({ activeView: nav.id });
                }}
                className={`relative text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer pb-1 flex items-center gap-1.5 shrink-0 select-none ${
                  activeView === nav.id
                    ? "text-theme-text"
                    : "text-theme-text-muted hover:text-theme-text"
                }`}
                title={nav.label}
              >
                <Crown
                  className={`w-4 h-4 shrink-0 ${activeView === "avatar" ? "text-gym-accent" : "text-theme-text-muted/65"}`}
                />
                {nav.label}
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
                  if (
                    w.estimatedCalories !== undefined &&
                    w.estimatedCalories > 0
                  ) {
                    return w.estimatedCalories;
                  }
                  return calculateCaloriesBurned(w.sets || [], profile);
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
                    className="space-y-8 pb-16 animate-fade-in"
                  >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                      <div>
                        <h3 className="text-xl font-light italic font-serif flex items-center gap-3">
                          Athlete Command Console
                        </h3>
                        <p className="text-xs text-white/90 uppercase tracking-[0.25em] font-bold">
                          Biometric &amp; Combat Readiness Command Center
                        </p>
                      </div>
                      <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-sm text-xs font-mono text-white/60">
                        <span className="w-2 h-2 rounded-full bg-gym-accent animate-pulse" />
                        <span>SYS_STATUS: ONLINE</span>
                        <div className="w-14 h-5 relative flex items-center justify-center opacity-75 border-l border-white/10 pl-3">
                          <svg
                            className="w-full h-full text-gym-accent"
                            viewBox="0 0 100 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M 0,15 L 20,15 L 24,10 L 27,24 L 32,2 L 36,20 L 39,15 L 100,15"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{
                                strokeDasharray: "280",
                                animation: "ecgPulse 2.5s linear infinite",
                              }}
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Bento Grid */}
                    <motion.div
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-50px" }}
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
                      {/* Card 1: Radar Chart */}
                      <motion.div
                        variants={cardVariants}
                        className="flex flex-col gap-4 h-full"
                      >
                        {/* Level & XP Progression Info */}
                        <motion.div
                          whileHover={{
                            y: -3,
                            scale: 1.01,
                            borderColor: activeTheme.accent + "35",
                            boxShadow: `0 8px 24px -10px ${activeTheme.accent}15`,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 25,
                          }}
                          className="bg-black/70 border border-white/10 rounded-sm p-4 backdrop-blur-md cursor-pointer"
                        >
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-xs font-bold text-white tracking-widest font-mono uppercase">
                              LVL. {level}
                            </span>
                            <span className="text-[9px] text-white/40 font-mono font-bold">
                              {xp} / {xpNeeded} XP
                            </span>
                          </div>
                          <div className="w-full bg-white/5 border border-white/10 h-2 rounded-sm overflow-hidden p-0.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${xpPercentage}%` }}
                              className="h-full bg-gradient-to-r from-gym-accent to-gym-accent-light rounded-sm"
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </motion.div>

                        {/* Biomechanical Balance Star Radar Chart */}
                        <div className="flex-1">
                          <RadarChart
                            sessionSets={sessionSets}
                            archivedWorkouts={archivedWorkouts}
                            size={330}
                          />
                        </div>
                      </motion.div>

                      {/* Card 2: Anatomy */}
                      <motion.div
                        variants={cardVariants}
                        whileHover={{
                          y: -5,
                          scale: 1.015,
                          borderColor: activeTheme.accent + "35",
                          boxShadow: `0 12px 30px -10px ${activeTheme.accent}20`,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                        className="bg-black/70 border border-white/10 rounded-sm p-6 flex flex-col justify-between h-full min-h-[380px] backdrop-blur-md cursor-pointer"
                      >
                        <div>
                          <h4 className="text-[10px] text-white uppercase font-black tracking-widest mb-1 font-mono">
                            Physiological Evolution
                          </h4>
                          <p className="text-sm text-white/90 font-light leading-snug">
                            Real-time dynamic muscle density simulation. Dark
                            sectors denote untapped muscle pools.
                          </p>
                        </div>

                        <div className="flex-1 flex items-center justify-center my-2">
                          <AnatomyChart
                            sets={sessionSets}
                            archivedWorkouts={archivedWorkouts}
                            compact={true}
                          />
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                          <div className="text-[9px] uppercase tracking-widest text-white/30 font-mono font-bold leading-tight">
                            Recruited: {sessionSets.length} Sets Recorded
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveView("anatomy")}
                            className="text-[9px] text-gym-accent uppercase tracking-widest font-bold font-mono border-b border-gym-accent/20 hover:border-gym-accent transition-all cursor-pointer"
                          >
                            ANATOMY_REPORT &rarr;
                          </button>
                        </div>
                      </motion.div>

                      {/* Card 3: Next Exercises */}
                      <motion.div
                        variants={cardVariants}
                        whileHover={{
                          y: -5,
                          scale: 1.015,
                          borderColor: activeTheme.accent + "35",
                          boxShadow: `0 12px 30px -10px ${activeTheme.accent}20`,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                        className="bg-black/70 border border-white/10 rounded-sm p-6 flex flex-col justify-between h-full min-h-[380px] backdrop-blur-md cursor-pointer"
                      >
                        <div>
                          <h4 className="text-[10px] text-white uppercase font-black tracking-widest mb-1 font-mono">
                            Next Active Exercises
                          </h4>
                          <p className="text-sm text-white/90 font-light leading-snug">
                            Mapped from training programming active modules.
                          </p>
                        </div>

                        <div className="flex-1 my-4 overflow-y-auto max-h-[190px] no-scrollbar pr-1">
                          {(() => {
                            const daysWithData = DAY_CONFIG.map((day, di) => ({
                              day,
                              di,
                              exercises: currentDays[di] || [],
                            })).filter((d) => d.exercises.length > 0);

                            if (daysWithData.length === 0) {
                              return (
                                <div className="h-full flex flex-col items-center justify-center py-6 text-center">
                                  <Dumbbell className="w-8 h-8 text-white/10 mb-2" />
                                  <p className="text-white/40 font-light font-serif italic text-xs leading-normal">
                                    No active routine mapped.
                                  </p>
                                  <button
                                    onClick={() => setActiveView("workout")}
                                    className="mt-3 text-[9px] text-gym-accent font-bold uppercase tracking-widest border-b border-gym-accent/30 hover:border-gym-accent transition-all cursor-pointer"
                                  >
                                    Load Routine In Programming
                                  </button>
                                </div>
                              );
                            }

                            return (
                              <div className="space-y-4">
                                {daysWithData.map(({ day, di, exercises }) => (
                                  <div
                                    key={di}
                                    className="border-l border-gym-accent/20 pl-3"
                                  >
                                    <div className="flex items-center justify-between mb-1.5">
                                      <span className="text-[8px] font-mono text-gym-accent uppercase tracking-widest font-bold">
                                        DAY {day.label}
                                      </span>
                                      <span className="text-[9px] font-light text-white/70 italic font-serif">
                                        {day.name}
                                      </span>
                                    </div>
                                    <div className="space-y-1">
                                      {exercises.map((ex, idx) => (
                                        <div
                                          key={idx}
                                          className="flex justify-between items-center text-xs text-white/80 py-0.5 hover:text-white transition-colors"
                                        >
                                          <span className="font-light truncate max-w-[150px]">
                                            {ex.name}
                                          </span>
                                          <span className="text-[8px] font-mono text-white/30 tracking-wider uppercase font-bold px-1.5 py-0.5 bg-white/[0.02] border border-white/5 rounded-sm">
                                            {ex.pool || ex.muscleGroup || "Gym"}
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

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                          <div className="text-[9px] uppercase tracking-widest text-white/30 font-mono font-bold leading-tight">
                            Tactical Agenda Mapped
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveView("workout")}
                            className="text-[9px] text-gym-accent uppercase tracking-widest font-bold font-mono border-b border-gym-accent/20 hover:border-gym-accent transition-all cursor-pointer"
                          >
                            EDIT_PROGRAM &rarr;
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Spinal Depletion & CNS Fatigue Gauge widget */}
                    <SpinalDepletionWidget
                      cnsFatigueAnalysis={cnsFatigueAnalysis}
                      setActiveView={setActiveView}
                    />

                    {/* Third Row: Micro Progress Graphs */}
                    <motion.div
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-50px" }}
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
                        variants={cardVariants}
                        whileHover={{
                          y: -5,
                          scale: 1.015,
                          borderColor: activeTheme.accent + "35",
                          boxShadow: `0 12px 30px -10px ${activeTheme.accent}20`,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                        className="bg-black/70 border border-white/10 rounded-sm p-5 flex flex-col justify-between backdrop-blur-md cursor-pointer"
                      >
                        <div className="mb-4">
                          <div className="flex justify-between items-baseline">
                            <h4 className="text-[10px] text-white uppercase font-black tracking-widest font-mono">
                              Weight Density
                            </h4>
                            <span className="text-xs font-bold text-gym-accent font-mono tabular-nums">
                              {profile?.bodyweight
                                ? `${profile.bodyweight} KG`
                                : "N/A"}
                            </span>
                          </div>
                          <p className="text-xs text-white/80 font-normal tracking-wide mt-0.5">
                            Dynamic change tracking over time
                          </p>
                        </div>

                        <div className="h-[120px] w-full">
                          {weightHistory.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center bg-white/[0.02] rounded-sm border border-dashed border-white/5">
                              <TrendingUp className="w-5 h-5 text-white/10 mb-1" />
                              <span className="text-[9px] text-white/20 font-bold">
                                No weight logs recorded
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
                                  top: 5,
                                  right: 5,
                                  left: -25,
                                  bottom: 5,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="colorWeightConsole"
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
                                  stroke="#ffffff15"
                                  tick={{ fontSize: 8 }}
                                />
                                <YAxis
                                  stroke="#ffffff15"
                                  tick={{ fontSize: 8 }}
                                  domain={["dataMin - 2", "dataMax + 2"]}
                                />
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
                        variants={cardVariants}
                        whileHover={{
                          y: -5,
                          scale: 1.015,
                          borderColor: activeTheme.accent + "35",
                          boxShadow: `0 12px 30px -10px ${activeTheme.accent}20`,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                        className="bg-black/70 border border-white/10 rounded-sm p-5 flex flex-col justify-between backdrop-blur-md cursor-pointer"
                      >
                        <div className="mb-4">
                          <div className="flex justify-between items-baseline">
                            <h4 className="text-[10px] text-white uppercase font-black tracking-widest font-mono">
                              Volume Progression
                            </h4>
                            <span className="text-xs font-bold text-gym-accent font-mono tabular-nums">
                              {archivedWorkouts.length > 0
                                ? `${Math.round(archivedWorkouts.reduce((acc, w) => acc + (w.totalVolume || 0), 0) / archivedWorkouts.length)} KG (avg)`
                                : "0 KG"}
                            </span>
                          </div>
                          <p className="text-xs text-white/80 font-normal tracking-wide mt-0.5">
                            Lifting volumes across physical cycles
                          </p>
                        </div>

                        <div className="h-[120px] w-full">
                          {archivedWorkouts.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center bg-white/[0.02] rounded-sm border border-dashed border-white/5">
                              <Activity className="w-5 h-5 text-white/10 mb-1" />
                              <span className="text-[9px] text-white/20 font-bold">
                                No sessions completed yet
                              </span>
                            </div>
                          ) : (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={getVolumeData()}
                                margin={{
                                  top: 5,
                                  right: 5,
                                  left: -25,
                                  bottom: 5,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="colorVolumeConsole"
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
                                  stroke="#ffffff15"
                                  tick={{ fontSize: 8 }}
                                />
                                <YAxis
                                  stroke="#ffffff15"
                                  tick={{ fontSize: 8 }}
                                />
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
                        variants={cardVariants}
                        whileHover={{
                          y: -5,
                          scale: 1.015,
                          borderColor: activeTheme.accent + "35",
                          boxShadow: `0 12px 30px -10px ${activeTheme.accent}20`,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                        className="bg-black/70 border border-white/10 rounded-sm p-5 flex flex-col justify-between backdrop-blur-md cursor-pointer"
                      >
                        <div className="mb-4">
                          <div className="flex justify-between items-baseline">
                            <h4 className="text-[10px] text-white uppercase font-black tracking-widest font-mono">
                              Caloric Expenditure
                            </h4>
                            <span className="text-xs font-bold text-gym-accent font-mono tabular-nums">
                              {archivedWorkouts.length > 0
                                ? `${Math.round(archivedWorkouts.reduce((sum, w) => sum + getWorkoutCalories(w), 0))} KCAL`
                                : "0 KCAL"}
                            </span>
                          </div>
                          <p className="text-xs text-white/80 font-normal tracking-wide mt-0.5">
                            Dynamic active energy burnout
                          </p>
                        </div>

                        <div className="h-[120px] w-full">
                          {chronologicalDaysConsole.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center bg-white/[0.02] rounded-sm border border-dashed border-white/5">
                              <Flame className="w-5 h-5 text-white/10 mb-1" />
                              <span className="text-[9px] text-white/20 font-bold">
                                No calories burned logged yet
                              </span>
                            </div>
                          ) : (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={chronologicalDaysConsole}
                                margin={{
                                  top: 5,
                                  right: 5,
                                  left: -25,
                                  bottom: 5,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="colorCalorieConsole"
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
                                  stroke="#ffffff15"
                                  tick={{ fontSize: 8 }}
                                />
                                <YAxis
                                  stroke="#ffffff15"
                                  tick={{ fontSize: 8 }}
                                />
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

                    {/* AI Tactical Operative Coach (extended to full width) */}
                    <motion.div
                      variants={cardVariants}
                      whileHover={{
                        y: -3,
                        borderColor: activeTheme.accent + "35",
                        boxShadow: `0 8px 24px -10px ${activeTheme.accent}12`,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 25,
                      }}
                      className="mt-8 cursor-pointer"
                    >
                      <AICoach
                        sets={sessionSets}
                        archivedWorkouts={archivedWorkouts}
                        userId={profile?.id || "anonymous"}
                      />
                    </motion.div>
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
                    <div className="flex bg-black/60 border border-white/10 rounded-sm p-1 inline-flex self-start sm:self-auto">
                      <button
                        onClick={() => setLibraryViewMode("deck")}
                        className={`flex items-center gap-2 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-sm cursor-pointer ${libraryViewMode === "deck" ? "bg-gym-accent text-black font-black" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        Visual Deck
                      </button>
                      <button
                        onClick={() => setLibraryViewMode("list")}
                        className={`flex items-center gap-2 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-sm cursor-pointer ${libraryViewMode === "list" ? "bg-gym-accent text-black font-black" : "text-white/40 hover:text-white hover:bg-white/5"}`}
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
                        className="bg-black/60 border border-white/20 rounded-sm pl-11 pr-4 py-3 text-sm font-light focus:outline-none focus:border-gym-accent transition-all w-full sm:w-64 text-white font-mono"
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
                          className={`text-left p-4 rounded-sm border cursor-pointer transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-28 ${
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
                              className={`w-8 h-8 rounded-sm flex items-center justify-center border transition-all ${
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
                    } else if (catKey === "core") {
                      list = [
                        ...(combinedPools["upper_core"] || []),
                        ...(combinedPools["lower_core"] || []),
                        ...(combinedPools["obliques"] || []),
                      ];
                    } else {
                      list = combinedPools[catKey] || [];
                    }

                    return {
                      key: catKey,
                      title: catKey.charAt(0).toUpperCase() + catKey.slice(1),
                      list: list.filter(
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
                      ),
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
                    className={`mb-6 border border-white/15 rounded-sm overflow-hidden bg-black/70 backdrop-blur-md ${libraryViewMode === "deck" && !searchQuery ? "p-2" : ""}`}
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
                        className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-white/[0.04] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <h3 className="text-[10px] font-black text-gym-accent uppercase tracking-[0.4em]">
                            {section.title}
                          </h3>
                          <span className="text-[10px] text-white/60 font-bold bg-white/15 px-2 py-0.5 rounded-full uppercase tracking-widest">
                            {section.list.length} Exercises
                          </span>
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
                                return (
                                  <div
                                    key={ex.name}
                                    className="bg-black/60 border border-white/10 rounded-sm p-5 hover:border-white/35 transition-all group flex flex-col justify-between"
                                  >
                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex flex-col gap-1">
                                          <div className="flex items-center gap-3">
                                            <Icon className="w-4 h-4 text-white/30 group-hover:text-gym-accent transition-colors" />
                                            <span className="font-medium text-sm text-white/90 group-hover:text-white transition-colors">
                                              {ex.name}
                                            </span>
                                          </div>
                                          {ex.category && (
                                            <div className="flex items-center gap-1.5 mt-0.5 ml-7">
                                              <span
                                                className={`text-[8px] px-1.5 py-0.2 rounded-sm font-black uppercase tracking-widest ${
                                                  ex.category === "compound"
                                                    ? "bg-amber-500/10 text-amber-500/80 border border-amber-500/20"
                                                    : "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                                                }`}
                                              >
                                                {ex.category}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                          {customExercises.some(
                                            (ce) =>
                                              ce.name.toLowerCase() ===
                                              ex.name.toLowerCase(),
                                          ) && (
                                            <button
                                              onClick={() =>
                                                handlePermanentlyDeleteCustomExercise(
                                                  ex.name,
                                                )
                                              }
                                              className="px-2 py-1 rounded-[1px] border border-red-500/35 bg-red-950/15 hover:bg-red-600 hover:text-white text-red-400 text-[8px] font-extrabold uppercase tracking-widest transition-all cursor-pointer mr-1"
                                              title="Permanently Delete Movement"
                                            >
                                              Delete
                                            </button>
                                          )}
                                          <Sparkline
                                            exName={ex.name}
                                            sessionSets={sessionSets}
                                            archivedWorkouts={archivedWorkouts}
                                            width={65}
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
                                                className="text-[8px] font-bold text-gym-accent uppercase tracking-widest"
                                              >
                                                {flashMessage[ex.name]}
                                              </motion.span>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      </div>

                                      <div className="flex flex-col gap-3 mt-4 mb-2 bg-white/[0.02] border border-white/[0.04] p-3 rounded-sm w-full">
                                        {/* Row 1: Weight & Reps side by side */}
                                        <div className="grid grid-cols-2 gap-3 w-full">
                                          <div className="flex flex-col">
                                            <span className="text-[9px] text-white/30 uppercase tracking-widest mb-1 font-bold">
                                              {ex.pool === "cardio" ? "Time (min)" : "Weight (kg)"}
                                            </span>
                                            <input
                                              type="number"
                                              inputMode="decimal"
                                              placeholder="0"
                                              id={`lib-w-${ex.name.replace(/\s+/g, "-")}`}
                                              className="w-full bg-black/40 border border-white/10 rounded-sm py-1.5 px-2.5 text-sm font-light focus:outline-none focus:border-gym-accent focus:bg-black/60 transition-all text-white font-mono"
                                            />
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-[9px] text-white/30 uppercase tracking-widest mb-1 font-bold">
                                              {ex.pool === "cardio" ? "Speed / Lvl" : "Reps"}
                                            </span>
                                            <input
                                              type="number"
                                              inputMode="numeric"
                                              placeholder="0"
                                              id={`lib-r-${ex.name.replace(/\s+/g, "-")}`}
                                              className="w-full bg-black/40 border border-white/10 rounded-sm py-1.5 px-2.5 text-sm font-light focus:outline-none focus:border-gym-accent focus:bg-black/60 transition-all text-white font-mono"
                                            />
                                          </div>
                                        </div>

                                        {/* Row 2: Set Notes */}
                                        <div className="flex flex-col w-full">
                                          <span className="text-[9px] text-white/30 uppercase tracking-widest mb-1 font-bold">
                                            Set Notes
                                          </span>
                                          <input
                                            type="text"
                                            placeholder="Warmup, RPE 9, drop set, etc."
                                            id={`lib-n-${ex.name.replace(/\s+/g, "-")}`}
                                            className="w-full bg-black/40 border border-white/10 rounded-sm py-1.5 px-2.5 text-xs font-light focus:outline-none focus:border-gym-accent focus:bg-black/60 transition-all text-white"
                                          />
                                        </div>

                                        {/* Row 3: Log button */}
                                        <button
                                          onClick={() => {
                                            const idSafe = ex.name.replace(/\s+/g, "-");
                                            const wInput = document.getElementById(`lib-w-${idSafe}`) as HTMLInputElement;
                                            const rInput = document.getElementById(`lib-r-${idSafe}`) as HTMLInputElement;
                                            const nInput = document.getElementById(`lib-n-${idSafe}`) as HTMLInputElement;
                                            const w = wInput?.value;
                                            const r = rInput?.value;
                                            const notes = nInput?.value || "";
                                            if (w && r) {
                                              handleSaveSet(ex.name, w, r, notes);
                                              if (wInput) wInput.value = "";
                                              if (rInput) rInput.value = "";
                                              if (nInput) nInput.value = "";
                                            }
                                          }}
                                          className="w-full bg-gym-accent hover:bg-gym-accent/90 text-black py-2 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all active:scale-[0.98] cursor-pointer text-center font-mono mt-1"
                                        >
                                          Log Set
                                        </button>
                                      </div>
                                    </div>

                                    <PBBlock
                                      exName={ex.name}
                                      pbs={personalBests}
                                      showLatest={true}
                                      sessionSets={sessionSets}
                                      archivedWorkouts={archivedWorkouts}
                                    />
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
                <div className="border border-white/15 rounded-sm overflow-hidden bg-black/70 backdrop-blur-md">
                  <button
                    onClick={() =>
                      setExpandedProgressSections((prev) => ({
                        ...prev,
                        weight: !prev.weight,
                      }))
                    }
                    className="w-full text-left px-8 py-6 flex items-center justify-between hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-gym-accent/5 border border-gym-accent/10 rounded-sm text-gym-accent group-hover:bg-gym-accent/10 transition-colors">
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
                        <div className="px-8 pb-10 pt-4">
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
                                  className="bg-black/55 border border-white/20 rounded-sm px-4 py-3 text-sm font-light focus:outline-none focus:border-gym-accent transition-all w-32 disabled:opacity-50 text-white"
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
                                  className="bg-black/55 border border-white/20 rounded-sm px-4 py-3 text-sm font-light focus:outline-none focus:border-gym-accent transition-all w-44 disabled:opacity-50 text-white [color-scheme:dark]"
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
                                className="bg-gym-accent text-black px-6 py-3 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-shadow-btn"
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
                              <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-sm border border-white/5 border-dashed">
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
                              className="w-full flex items-center justify-between px-6 py-4 bg-black/65 hover:bg-black/85 border border-white/10 rounded-sm text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all cursor-pointer group"
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
                                    <div className="mt-2 max-h-56 overflow-y-auto divide-y divide-white/5 border border-white/15 rounded-sm bg-black">
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
                                                className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-all cursor-pointer"
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
                <div className="border border-white/15 rounded-sm overflow-hidden bg-black/70 backdrop-blur-md">
                  <button
                    onClick={() =>
                      setExpandedProgressSections((prev) => ({
                        ...prev,
                        bodyFat: !prev.bodyFat,
                      }))
                    }
                    className="w-full text-left px-8 py-6 flex items-center justify-between hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-gym-accent/5 border border-gym-accent/10 rounded-sm text-gym-accent group-hover:bg-gym-accent/10 transition-colors">
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
                        <div className="px-8 pb-10 pt-4">
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
                                  className="bg-black/55 border border-white/20 rounded-sm px-4 py-3 text-sm font-light focus:outline-none focus:border-gym-accent transition-all w-32 disabled:opacity-50 text-white"
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
                                  className="bg-black/55 border border-white/20 rounded-sm px-4 py-3 text-sm font-light focus:outline-none focus:border-gym-accent transition-all w-44 disabled:opacity-50 text-white [color-scheme:dark]"
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
                                className="bg-gym-accent text-black px-6 py-3 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-shadow-btn"
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
                              <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-sm border border-white/5 border-dashed">
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
                              className="w-full flex items-center justify-between px-6 py-4 bg-black/65 hover:bg-black/85 border border-white/10 rounded-sm text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all cursor-pointer group"
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
                                    <div className="mt-2 max-h-56 overflow-y-auto divide-y divide-white/5 border border-white/15 rounded-sm bg-black">
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
                                                className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-all cursor-pointer"
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
                <div className="border border-white/15 rounded-sm overflow-hidden bg-black/70 backdrop-blur-md">
                  <button
                    onClick={() =>
                      setExpandedProgressSections((prev) => ({
                        ...prev,
                        workoutCalendar: !prev.workoutCalendar,
                      }))
                    }
                    className="w-full text-left px-8 py-6 flex items-center justify-between hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-gym-accent/5 border border-gym-accent/10 rounded-sm text-gym-accent group-hover:bg-gym-accent/10 transition-colors">
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
                        <div className="px-8 pb-10 pt-4">
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
                <div className="border border-white/15 rounded-sm overflow-hidden bg-black/70 backdrop-blur-md">
                  <button
                    onClick={() =>
                      setExpandedProgressSections((prev) => ({
                        ...prev,
                        trending: !prev.trending,
                      }))
                    }
                    className="w-full text-left px-8 py-6 flex items-center justify-between hover:bg-[#0c0c0c]/80 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-gym-accent/5 border border-gym-accent/10 rounded-sm text-gym-accent group-hover:bg-gym-accent/10 transition-colors">
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
                        <div className="px-8 pb-10 pt-4">
                          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                            <div className="flex bg-white/5 p-1 rounded-sm">
                              {(["day", "week", "month"] as const).map((tf) => (
                                <button
                                  key={tf}
                                  onClick={() => setVolumeTimeframe(tf)}
                                  className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-sm transition-all ${volumeTimeframe === tf ? "bg-gym-accent text-black shadow-lg" : "text-white/40 hover:text-white"}`}
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
                              <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-sm border border-white/5 border-dashed">
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

                {/* Calorie Tracker Section */}
                <div className="border border-white/15 rounded-sm overflow-hidden bg-black/70 backdrop-blur-md">
                  <button
                    onClick={() =>
                      setExpandedProgressSections((prev) => ({
                        ...prev,
                        calorieTracker: !prev.calorieTracker,
                      }))
                    }
                    className="w-full text-left px-8 py-6 flex items-center justify-between hover:bg-[#0c0c0c]/80 transition-colors cursor-pointer group"
                  >
                    <div>
                      <h3 className="text-xl font-light italic font-serif flex items-center gap-3 mb-1">
                        <Flame className="w-5 h-5 text-gym-accent animate-pulse" />
                        Calorie Tracker
                      </h3>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                        Comprehensive metabolic & training energy output
                      </p>
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
                        <div className="px-8 pb-10 pt-4">
                          {(() => {
                            const getWorkoutCalories = (w: any) => {
                              if (
                                w.estimatedCalories !== undefined &&
                                w.estimatedCalories > 0
                              ) {
                                return w.estimatedCalories;
                              }
                              return calculateCaloriesBurned(
                                w.sets || [],
                                profile,
                              );
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
                                <div className="bg-[#0c0c0c] border border-white/5 rounded-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gym-accent/10 border border-gym-accent/20 rounded-sm">
                                      <Flame className="w-8 h-8 text-gym-accent animate-pulse" />
                                    </div>
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
                                  <div className="h-[250px] w-full bg-[#050505]/40 border border-white/5 rounded-sm p-4">
                                    {chronologicalDays.length === 0 ? (
                                      <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/5 rounded-sm">
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
                                    <div className="text-center py-10 border border-dashed border-white/5 rounded-sm bg-black/30 mt-4">
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
                                          <div className="divide-y divide-white/5 border border-white/10 rounded-sm overflow-hidden bg-[#070707]/60 max-h-[300px] overflow-y-auto no-scrollbar">
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
                    className="px-8 py-4 bg-gradient-to-r from-gym-accent to-gym-accent-light text-black hover:brightness-110 transition-all font-black uppercase tracking-widest text-xs rounded-sm cursor-pointer accent-shadow-btn flex items-center gap-2.5 active:scale-[0.98]"
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
                  profile={profile}
                  saveSettings={saveSettings}
                  setToast={setToast}
                  setActiveView={setActiveView}
                  routines={routines}
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
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-[10px] text-gym-accent font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                            <Activity className="w-4 h-4" />
                            Active Performance Log
                          </h4>
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
                                className="bg-black/65 border border-gym-accent/40 rounded-sm p-4 relative overflow-hidden group backdrop-blur-md"
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
                                <div className="space-y-2">
                                  {exerciseSets.map((s, idx) => {
                                    const ex = findExerciseByName(name);
                                    const isCardio = ex?.pool === "cardio";
                                    return (
                                      <div
                                        key={idx}
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
                                              className="px-1.5 py-0.5 bg-gym-accent/15 border border-gym-accent/35 text-gym-accent text-[8px] font-bold rounded-sm uppercase tracking-wide truncate max-w-[120px] cursor-pointer hover:bg-gym-accent/30 hover:border-gym-accent/50 transition-all active:scale-95"
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
                                    );
                                  })}
                                </div>
                              </div>
                            ),
                          )}
                        </div>

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
                            <div className="mt-8 bg-[#0a0a0a]/80 border border-white/10 rounded-sm p-6 relative overflow-hidden backdrop-blur-md">
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
                            </div>
                          );
                        })()}

                        <div className="mt-8 flex items-center justify-center gap-4">
                          <button
                            onClick={handleClearActiveSession}
                            className="px-6 py-4 border border-red-500/20 text-red-500/60 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-all cursor-pointer rounded-sm"
                          >
                            Discard Session
                          </button>
                          <button
                            onClick={handleArchiveWorkout}
                            className="px-6 py-4 border border-gym-accent/30 text-gym-accent text-[10px] font-bold uppercase tracking-widest hover:bg-gym-accent/10 transition-all cursor-pointer rounded-sm flex items-center gap-3"
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
                              className="bg-black/60 border border-white/20 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest text-gym-accent hover:bg-black/80 transition-all flex items-center gap-3 cursor-pointer"
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
                                  className="absolute top-full right-0 mt-2 w-64 bg-black border border-white/20 rounded-sm shadow-2xl z-50 overflow-hidden"
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
                                className="flex flex-col items-center justify-center p-20 border border-white/5 border-dashed rounded-sm bg-white/[0.01]"
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
                              className="border border-white/15 rounded-sm overflow-hidden bg-black/70 backdrop-blur-md"
                            >
                              <div className="p-8 border-b border-white/5 bg-black/45 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-8">
                                  <div className="w-16 h-16 bg-gym-accent/15 border border-gym-accent/30 rounded-sm flex flex-col items-center justify-center">
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
                                    className="flex items-center gap-2 px-6 py-3 border border-gym-accent/30 bg-gym-accent/5 hover:bg-gym-accent hover:text-black hover:border-gym-accent text-gym-accent text-[10px] font-bold uppercase tracking-[0.3em] transition-all cursor-pointer group shadow-lg shadow-gym-accent/5 rounded-sm"
                                  >
                                    <Save className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                    Save Routine
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteWorkout(workout.id)
                                    }
                                    disabled={dataLoading}
                                    className={`flex items-center gap-2 px-6 py-3 border rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] transition-all cursor-pointer group shadow-lg ${dataLoading ? "bg-white/5 border-white/10 text-white/20" : "bg-red-500/5 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 shadow-red-500/5"}`}
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
                          className="px-4 py-2 border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveCustomRoutine}
                          className="px-5 py-2 bg-gym-accent hover:bg-gym-accent/90 text-black text-[10px] font-black uppercase tracking-widest transition-all rounded-sm cursor-pointer shadow-[0_0_15px_rgba(255,231,101,0.2)] font-semibold"
                        >
                          Save Routine
                        </button>
                      </div>
                    </div>

                    {/* Routine Info Form */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white/[0.01] border border-white/5 p-6 rounded-sm">
                      {/* Name input */}
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold block">
                          Routine Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Savage Chest & Arms, Powerhouse Legs..."
                          value={newRoutineName}
                          onChange={(e) => setNewRoutineName(e.target.value)}
                          className="w-full bg-black/60 border border-white/15 hover:border-white/25 focus:border-gym-accent rounded-sm px-4 py-3 text-sm font-light focus:outline-none transition-all text-white"
                        />
                      </div>

                      {/* Day category selector */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold block">
                          Day / Focus Category
                        </label>
                        <select
                          value={newRoutineCategory}
                          onChange={(e) => {
                            setNewRoutineCategory(Number(e.target.value));
                          }}
                          className="w-full bg-black/60 border border-white/15 hover:border-white/25 focus:border-gym-accent rounded-sm px-4 py-3 text-sm font-medium focus:outline-none transition-all text-white cursor-pointer"
                        >
                          {DAY_CONFIG.map((day, idx) => (
                            <option key={idx} value={idx} className="bg-black text-white">
                              {day.name} (Day {idx + 1})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Micro-Periodization Block */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-gym-accent uppercase tracking-widest font-bold block">
                          Micro-Periodization Phase
                        </label>
                        <select
                          value={newRoutinePeriodization}
                          onChange={(e) => {
                            const val = e.target.value as "hypertrophy" | "strength" | "deload";
                            setNewRoutinePeriodization(val);
                            
                            // Auto adjust reps/notes for and exercises currently loaded in builder
                            setNewRoutineExercises(prev => {
                              return prev.map(exItem => {
                                return {
                                  ...exItem,
                                  sets: exItem.sets.map(setItem => {
                                    let r = 10;
                                    let note = setItem.notes || "";
                                    if (val === "strength") {
                                      r = 5;
                                      note = "[RPE 9 - Strength Block]";
                                    } else if (val === "deload") {
                                      r = 12;
                                      note = "[RPE 5 - Deload Block]";
                                    } else {
                                      r = 10;
                                      note = "[RPE 8 - Hypertrophy Block]";
                                    }
                                    return {
                                      ...setItem,
                                      reps: r,
                                      notes: note
                                    };
                                  })
                                };
                              });
                            });
                          }}
                          className="w-full bg-black/60 border border-gym-accent/25 hover:border-gym-accent/50 focus:border-gym-accent rounded-sm px-4 py-3 text-sm font-semibold focus:outline-none transition-all text-gym-accent cursor-pointer fill-gym-accent"
                        >
                          <option value="hypertrophy" className="bg-black text-white">Hypertrophy (8-12 reps)</option>
                          <option value="strength" className="bg-black text-white">Strength Phase (1-5 reps)</option>
                          <option value="deload" className="bg-black text-white">Active Deload (12-15 reps)</option>
                        </select>
                      </div>
                    </div>

                    {/* Exercises Selection Block */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                      {/* Selector/Finder on the left */}
                      <div className="space-y-4 bg-white/[0.01] border border-white/5 p-6 rounded-sm">
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
                            className="w-full bg-black/40 border border-white/10 rounded-sm pl-10 pr-4 py-2.5 text-xs font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                          />
                        </div>

                        {/* List exercises matching category pools or search */}
                        <div className="max-h-[350px] overflow-y-auto space-y-1.5 pr-1.5 custom-scrollbar">
                          {(() => {
                            const availableExercises = getExercisesForDay(newRoutineCategory);
                            const searchClean = builderSearch.trim().toLowerCase();
                            
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
                                    className="w-full text-left p-3 rounded-sm border border-gym-accent/20 bg-gym-accent/5 hover:bg-gym-accent hover:text-black transition-all cursor-pointer flex items-center justify-between"
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
                                      className={`w-full text-left p-2.5 rounded-sm border transition-all flex items-center justify-between gap-3 ${
                                        isAdded 
                                          ? "border-emerald-500/10 bg-emerald-500/5 text-emerald-400 opacity-60 cursor-not-allowed" 
                                          : "border-white/5 bg-black/40 hover:bg-white/[0.04] hover:border-white/10 text-white/80 cursor-pointer"
                                      }`}
                                    >
                                      <span className="text-xs font-medium truncate">{ex.name}</span>
                                      {isAdded ? (
                                        <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 px-1.5 py-0.5 rounded-sm text-emerald-400">
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
                          <div className="border border-dashed border-white/10 rounded-sm p-12 text-center bg-black/20">
                            <Dumbbell className="w-8 h-8 text-white/10 mx-auto mb-3 animate-pulse" />
                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                              Routine is empty
                            </p>
                            <p className="text-[10px] text-white/20 uppercase tracking-wider mt-1.5 max-w-[280px] mx-auto leading-normal">
                              Select from the available exercises list or type to add custom targets to kickstart your plan
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {newRoutineExercises.map((exItem, exIdx) => (
                              <div
                                key={exItem.id}
                                className="bg-black/55 border border-white/10 rounded-sm overflow-hidden"
                              >
                                {/* Header of block */}
                                <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono font-bold text-gym-accent bg-gym-accent/5 border border-gym-accent/20 px-2 py-0.5 rounded-sm">
                                      {exIdx + 1}
                                    </span>
                                    <h5 className="text-sm font-semibold text-white/95 truncate max-w-[250px] sm:max-w-none">
                                      {exItem.exerciseName}
                                    </h5>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveExercise(exItem.id)}
                                    className="p-1.5 text-white/30 hover:text-red-400 transition-colors cursor-pointer bg-transparent border-0"
                                    title="Remove exercise"
                                  >
                                    <Trash2 className="w-4 h-4 text-white/30" />
                                  </button>
                                </div>

                                {/* Sets of block */}
                                <div className="p-4 space-y-2.5">
                                  {exItem.sets.map((set, setIdx) => (
                                    <div
                                      key={setIdx}
                                      className="flex flex-wrap items-center gap-3 bg-white/[0.01] p-2.5 rounded-sm border border-white/5"
                                    >
                                      {/* Set badge */}
                                      <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider min-w-[45px]">
                                        Set {setIdx + 1}
                                      </span>

                                      {/* Weight input */}
                                      <div className="flex items-center gap-1.5 min-w-[100px] flex-1">
                                        <input
                                          type="number"
                                          value={set.weight || ""}
                                          onChange={(e) => {
                                            const val = Number(e.target.value) || 0;
                                            setNewRoutineExercises(prev => prev.map(ex => {
                                              if (ex.id === exItem.id) {
                                                const next = [...ex.sets];
                                                next[setIdx] = { ...next[setIdx], weight: val };
                                                return { ...ex, sets: next };
                                              }
                                              return ex;
                                            }));
                                          }}
                                          placeholder="Weight"
                                          className="w-16 bg-black/60 border border-white/15 focus:border-gym-accent rounded-sm px-2 py-1 text-xs text-center font-medium font-mono focus:outline-none transition-all text-white"
                                        />
                                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                          {findExerciseByName(exItem.exerciseName)?.pool === "cardio" ? "m" : "kg"}
                                        </span>
                                      </div>

                                      {/* Reps input */}
                                      <div className="flex items-center gap-1.5 min-w-[100px] flex-1">
                                        <input
                                          type="number"
                                          value={set.reps || ""}
                                          onChange={(e) => {
                                            const val = Number(e.target.value) || 0;
                                            setNewRoutineExercises(prev => prev.map(ex => {
                                              if (ex.id === exItem.id) {
                                                const next = [...ex.sets];
                                                next[setIdx] = { ...next[setIdx], reps: val };
                                                return { ...ex, sets: next };
                                              }
                                              return ex;
                                            }));
                                          }}
                                          placeholder="Reps"
                                          className="w-16 bg-black/60 border border-white/15 focus:border-gym-accent rounded-sm px-2 py-1 text-xs text-center font-medium font-mono focus:outline-none transition-all text-white"
                                        />
                                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                          {findExerciseByName(exItem.exerciseName)?.pool === "cardio" ? "speed" : "reps"}
                                        </span>
                                      </div>

                                      {/* Notes input */}
                                      <div className="flex-1 min-w-[180px]">
                                        <input
                                          type="text"
                                          value={set.notes || ""}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            setNewRoutineExercises(prev => prev.map(ex => {
                                              if (ex.id === exItem.id) {
                                                const next = [...ex.sets];
                                                next[setIdx] = { ...next[setIdx], notes: val };
                                                return { ...ex, sets: next };
                                              }
                                              return ex;
                                            }));
                                          }}
                                          placeholder="Optional cue (e.g. drop set, stretch focus)"
                                          className="w-full bg-black/60 border border-white/15 focus:border-gym-accent rounded-sm px-3 py-1 text-xs font-light focus:outline-none transition-all text-white placeholder-white/25"
                                        />
                                      </div>

                                      {/* Delete set button */}
                                      {exItem.sets.length > 1 && (
                                        <button
                                          onClick={() => handleRemoveSet(exItem.id, setIdx)}
                                          className="p-1 text-white/20 hover:text-rose-400 transition-colors cursor-pointer bg-transparent border-0"
                                          title="Remove set"
                                        >
                                          ✕
                                        </button>
                                      )}
                                    </div>
                                  ))}

                                  {/* Add set trigger row */}
                                  <div className="flex items-center justify-between pt-1 border-t border-white/5 mt-2">
                                    <button
                                      onClick={() => handleAddSet(exItem.id)}
                                      className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 hover:text-white text-white/70 text-[9px] font-bold uppercase tracking-wider rounded-sm cursor-pointer transition-all border border-white/5"
                                    >
                                      <Plus className="w-3 h-3 text-gym-accent animate-none" />
                                      Add Set
                                    </button>
                                    <span className="text-[8px] text-white/30 font-mono">
                                      {exItem.sets.length} total set(s)
                                    </span>
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
                        className="px-6 py-2.5 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-all rounded-sm cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveCustomRoutine}
                        className="px-8 py-2.5 bg-gym-accent hover:bg-gym-accent/90 text-black text-xs font-black uppercase tracking-widest transition-all rounded-sm cursor-pointer shadow-[0_0_20px_rgba(255,231,101,0.25)] font-semibold"
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
                        className="flex items-center gap-2 px-4 py-2 border border-gym-accent/30 bg-gym-accent/5 hover:bg-gym-accent hover:border-gym-accent hover:text-black text-gym-accent text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm cursor-pointer font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5 animate-none" />
                        Create Custom Routine
                      </button>
                    </div>

                    {/* Routine Analytics Summary View */}
                    {routines.length > 0 && selectedRoutine && (
                      <div className="mb-8 p-6 rounded-sm bg-black/60 border border-white/10 backdrop-blur-md space-y-5">
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
                              className="bg-black/80 border border-white/15 hover:border-white/25 focus:border-gym-accent text-white text-[11px] font-bold uppercase tracking-wider rounded-sm px-3.5 py-2 focus:outline-none transition-all cursor-pointer min-w-[180px] max-w-[280px]"
                            >
                              {routines.map((r, ri) => (
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
                                  className="bg-white/[0.01] border border-white/5 rounded-sm p-4 flex flex-col justify-between hover:bg-white/[0.03] hover:border-white/10 transition-all group/item"
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
                                    <div className="w-full bg-white/5 h-1 rounded-sm overflow-hidden font-mono">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.percentage}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="bg-gym-accent h-full rounded-sm shadow-[0_0_8px_rgba(255,231,101,0.35)]"
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
                            className="w-full flex items-center justify-between p-6 rounded-sm bg-black/65 border border-white/15 hover:bg-black/80 hover:border-white/25 transition-all cursor-pointer group backdrop-blur-md"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-sm bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center shrink-0">
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
                            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-sm space-y-4">
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
                                      className={`border rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer ${
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
                                                  className="w-full bg-black/90 border border-gym-accent/40 text-sm text-white px-2.5 py-1.5 rounded-sm focus:outline-none focus:border-gym-accent/80 font-medium"
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
                                                    className="px-2.5 py-1 bg-gym-accent hover:bg-gym-accent/90 text-black text-[9px] font-bold uppercase tracking-wider rounded-sm cursor-pointer"
                                                  >
                                                    Save
                                                  </button>
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setEditingRoutineId(null);
                                                    }}
                                                    className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/70 text-[9px] font-bold uppercase tracking-wider rounded-sm cursor-pointer"
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
                                              className="px-3 py-1.5 bg-gym-accent/10 border border-gym-accent/30 hover:bg-gym-accent hover:text-black hover:border-gym-accent text-gym-accent text-[9px] font-bold uppercase tracking-wider transition-all rounded-sm cursor-pointer"
                                              title="Load sets into today's active session"
                                            >
                                              Use Routine
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteRoutine(routine.id!);
                                              }}
                                              className="p-1.5 border border-red-500/10 hover:border-red-500/35 hover:bg-red-500/10 text-red-500/60 hover:text-red-500 transition-colors rounded-sm cursor-pointer"
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
                                              <div className="flex items-center gap-2 w-full min-w-0">
                                                <span
                                                  className="text-[10px] text-white/70 font-semibold uppercase tracking-wider truncate"
                                                  title={exName}
                                                >
                                                  {exName}
                                                </span>
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
            ) : activeView === "avatar" ? (
              <motion.div
                key="avatar"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AvatarPanel
                  profile={profile}
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
                                defaultValue={profile?.bodyweight || ""}
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
                                defaultValue={profile?.bodyFatPercent || ""}
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
                                className="bg-transparent border-b border-white/10 py-2.5 text-sm font-light focus:outline-none focus:border-gym-accent transition-all text-white cursor-pointer select-none"
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
                  <button
                    onClick={handleOrganizeMovementOrder}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gym-accent/10 border border-gym-accent/25 hover:border-gym-accent/50 hover:bg-gym-accent/20 text-gym-accent rounded-md text-[10px] font-black uppercase tracking-[0.15em] transition-all cursor-pointer shadow-sm shadow-gym-accent/5"
                    title="Prioritise compound exercises and move isolation movements to the end"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    Compounds First
                  </button>
                </div>

                {DAY_CONFIG.map((day, di) => (
                  <div key={di} className="group">
                    <button
                      onClick={() =>
                        setExpandedDays((prev) => ({
                          ...prev,
                          [di]: !prev[di],
                        }))
                      }
                      className={`w-full flex items-center justify-between p-6 rounded-sm border transition-all cursor-pointer group backdrop-blur-md ${
                        lastLoadedDayIndex === di
                          ? "bg-gym-accent/[0.04] border-gym-accent shadow-md shadow-gym-accent/10"
                          : "bg-black/65 border-white/15 hover:bg-black/80 hover:border-white/25"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-sm bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center shrink-0">
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
                              const Icon = iconMap[ex.icon] || Dumbbell;
                              return (
                                <motion.div
                                  key={`${ei}-${ex.name}`}
                                  layout
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: ei * 0.05 }}
                                  className="bg-black/75 border border-white/15 rounded-sm p-6 flex flex-col group/card backdrop-blur-md"
                                >
                                  <div className="flex items-center justify-between mb-6">
                                    <div className="flex flex-col">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-gym-accent font-bold uppercase tracking-widest">
                                          Exercise {ei + 1}
                                        </span>
                                        {ex.category && (
                                          <span
                                            className={`text-[8px] px-1.5 py-0.2 rounded-sm font-black uppercase tracking-[0.1em] ${
                                              ex.category === "compound"
                                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                : "bg-purple-500/15 text-purple-300 border border-purple-500/20"
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
                                      </div>
                                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                                        <h4 className="text-2xl font-light italic font-serif text-gym-accent pt-0.5 pb-1 leading-none drop-shadow-sm">
                                          {ex.name}
                                        </h4>
                                        <Sparkline
                                          exName={ex.name}
                                          sessionSets={sessionSets}
                                          archivedWorkouts={archivedWorkouts}
                                          width={65}
                                          height={16}
                                        />
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => setGuidanceEx(ex)}
                                        className="p-3 bg-white/5 border border-white/10 text-white/40 hover:text-gym-accent hover:bg-gym-accent/5 transition-all cursor-pointer rounded-sm"
                                        title="Guidance & Instructions"
                                      >
                                        <BookOpen className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleSwap(di, ei)}
                                        className="p-3 bg-white/5 border border-white/10 text-white/40 hover:text-gym-accent hover:bg-gym-accent/5 transition-all cursor-pointer rounded-sm"
                                        title="Swap Exercise"
                                      >
                                        <RefreshCw className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleRemoveExerciseFromPlan(di, ei)
                                        }
                                        className="p-3 bg-red-500/[0.03] border border-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer rounded-sm"
                                        title="Remove"
                                      >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex flex-col gap-3 mt-auto mb-4 bg-white/[0.02] border border-white/[0.04] p-3 rounded-sm w-full">
                                    {/* Row 1: Weight & Reps side by side */}
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="flex flex-col">
                                        <span className="text-[9px] text-white/30 uppercase tracking-widest mb-1 font-bold">
                                          {ex.pool === "cardio"
                                            ? "Time (min)"
                                            : "Weight (kg)"}
                                        </span>
                                        <input
                                          type="number"
                                          inputMode="decimal"
                                          placeholder="0"
                                          id={`w-${di}-${ei}`}
                                          className="w-full bg-black/40 border border-white/10 rounded-sm py-1.5 px-2.5 text-base font-medium focus:outline-none focus:border-gym-accent focus:bg-black/60 transition-all text-white font-mono"
                                        />
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-[9px] text-white/30 uppercase tracking-widest mb-1 font-bold">
                                          {ex.pool === "cardio"
                                            ? "Speed / Lvl"
                                            : "Reps"}
                                        </span>
                                        <input
                                          type="number"
                                          inputMode="numeric"
                                          placeholder="0"
                                          id={`r-${di}-${ei}`}
                                          className="w-full bg-black/40 border border-white/10 rounded-sm py-1.5 px-2.5 text-base font-medium focus:outline-none focus:border-gym-accent focus:bg-black/60 transition-all text-white font-mono"
                                        />
                                      </div>
                                    </div>

                                    {/* Row 2: Set Notes */}
                                    <div className="flex flex-col">
                                      <span className="text-[9px] text-white/30 uppercase tracking-widest mb-1 font-bold">
                                        Set Notes
                                      </span>
                                      <input
                                        type="text"
                                        placeholder="Warmup, RPE 9, drop set, etc."
                                        id={`notes-${di}-${ei}`}
                                        className="w-full bg-black/40 border border-white/10 rounded-sm py-1.5 px-2.5 text-xs font-light focus:outline-none focus:border-gym-accent focus:bg-black/60 transition-all text-white"
                                      />
                                    </div>

                                    {/* Row 3: Log button */}
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
                                        if (w && r) {
                                          handleSaveSet(ex.name, w, r, notes);
                                          if (wInput) wInput.value = "";
                                          if (rInput) rInput.value = "";
                                          if (nInput) nInput.value = "";
                                        }
                                      }}
                                      className="w-full bg-gym-accent hover:bg-gym-accent/90 text-black py-2 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all active:scale-[0.98] cursor-pointer text-center font-mono mt-1"
                                    >
                                      Log Set
                                    </button>
                                  </div>

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
                                    return (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mb-4 p-3 rounded-sm bg-gym-accent/5 border border-gym-accent/20 overflow-hidden"
                                      >
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
                                        <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
                                          {loggedSetsForThisEx.map(
                                            (set, sIdx) => (
                                              <div
                                                key={set.id || sIdx}
                                                className="flex items-center justify-between bg-black/55 border border-white/5 px-2.5 py-1.5 rounded-sm hover:border-white/15 transition-colors group/setrow"
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
                                                      className="ml-1 px-1.5 py-0.5 bg-gym-accent/11 border border-gym-accent/20 text-gym-accent text-[8px] font-bold rounded-sm uppercase tracking-wide truncate max-w-[120px] cursor-pointer hover:bg-gym-accent/30 hover:border-gym-accent/50 transition-all active:scale-95"
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
                                            ),
                                          )}
                                        </div>
                                      </motion.div>
                                    );
                                  })()}

                                  <PBBlock
                                    exName={ex.name}
                                    pbs={personalBests}
                                    sessionSets={sessionSets}
                                    archivedWorkouts={archivedWorkouts}
                                  />
                                </motion.div>
                              );
                            })}

                            {/* Add Exercise Slot */}
                            <button
                              onClick={() => setAddingToDay(di)}
                              className="bg-black/45 border border-white/10 border-dashed rounded-sm p-8 flex flex-col items-center justify-center gap-3 hover:bg-black/60 hover:border-gym-accent/30 transition-all cursor-pointer group/add min-h-[280px]"
                            >
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover/add:bg-gym-accent group-hover/add:text-black transition-all">
                                <Plus className="w-4 h-4" />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover/add:text-white transition-all">
                                Add Exercise
                              </span>
                            </button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
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
                }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden flex flex-col max-h-[80vh] shadow-2xl"
              >
                <div className="p-8 border-b border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gym-accent font-bold uppercase tracking-[0.3em] mb-1">
                        Select Exercise
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
                        className="flex items-center gap-2 px-3 py-2 border border-gym-accent/30 bg-gym-accent/5 hover:bg-gym-accent hover:text-black text-gym-accent rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        Create Custom
                      </button>
                      <button
                        onClick={() => {
                          setAddingToDay(null);
                          setModalSearch("");
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
                      className="w-full bg-black/60 border border-white/20 rounded-sm pl-12 pr-4 py-4 text-sm font-light focus:outline-none focus:border-gym-accent transition-all text-white"
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

                    const renderExercise = (ex: Exercise) => (
                      <div key={ex.name} className="relative group">
                        <button
                          onClick={() =>
                            handleAddExerciseToPlan(addingToDay, ex)
                          }
                          className="w-full flex items-center justify-between p-4 bg-black/65 border border-white/10 rounded-sm hover:bg-black/85 hover:border-gym-accent/30 transition-all text-left cursor-pointer group/inner"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-white/70 group-hover/inner:text-gym-accent transition-colors">
                              {ex.name}
                            </span>
                            {ex.category && (
                              <span
                                className={`text-[8px] font-bold tracking-wider uppercase ${
                                  ex.category === "compound"
                                    ? "text-amber-500/80"
                                    : "text-purple-400/80"
                                }`}
                              >
                                {ex.category === "compound" ? "C" : "I"} —{" "}
                                {ex.category}
                              </span>
                            )}
                          </div>
                          <Plus className="w-3 h-3 text-white/10 group-hover/inner:text-gym-accent" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setGuidanceEx(ex);
                          }}
                          className="absolute right-12 top-1/2 -translate-y-1/2 p-2 text-white/10 hover:text-gym-accent transition-all cursor-pointer"
                          title="View Guidance"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );

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
                className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden flex flex-col shadow-2xl z-50"
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
                        className="w-full text-left p-4 rounded-sm border border-white/10 bg-white/[0.02] hover:bg-gym-accent hover:border-gym-accent hover:text-black transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-sm bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center shrink-0 group-hover:bg-black/10 group-hover:border-black/20">
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
                      className="px-5 py-2.5 border border-white/10 hover:border-white/20 rounded-sm text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
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
                className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-sm flex flex-col max-h-[90vh] overflow-y-auto shadow-2xl p-8"
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
                      className="w-full bg-black/60 border border-white/15 hover:border-white/25 focus:border-gym-accent rounded-sm px-4 py-3 text-sm focus:outline-none transition-all text-white font-light"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">
                      Category (Muscle Group / Pool)
                    </label>
                    <select
                      value={customExPool}
                      onChange={(e) => setCustomExPool(e.target.value as any)}
                      className="w-full bg-black border border-white/15 hover:border-white/25 focus:border-gym-accent rounded-sm px-4 py-3 text-sm focus:outline-none transition-all text-white cursor-pointer font-light"
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
                        className={`py-3 rounded-sm border text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
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
                        className={`py-3 rounded-sm border text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
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
                      className="w-full bg-black/60 border border-white/15 hover:border-white/25 focus:border-gym-accent rounded-sm px-4 py-3 text-sm focus:outline-none transition-all text-white font-light"
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
                        className="flex-1 bg-black/60 border border-white/15 hover:border-white/25 focus:border-gym-accent rounded-sm px-4 py-3 text-sm focus:outline-none transition-all text-white font-light text-ellipsis overflow-hidden"
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
                        className="px-4 bg-white/5 hover:bg-gym-accent hover:text-black border border-white/10 text-white/80 rounded-sm text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                      >
                        Add
                      </button>
                    </div>

                    {customGuidanceSteps.length > 0 && (
                      <div className="mt-3 space-y-2 max-h-40 overflow-y-auto bg-black/45 border border-white/5 p-3 rounded-sm">
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
                      className="w-full bg-gym-accent text-black hover:bg-white hover:text-black font-black uppercase tracking-widest py-4 rounded-sm text-sm transition-all focus:outline-none shadow-md shadow-gym-accent/5 cursor-pointer"
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
                    className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-sm flex flex-col shadow-2xl my-auto z-10"
                  >
                    <div className="p-10 border-b border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gym-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center">
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

                        <div className="flex items-center gap-6">
                          <div className="flex flex-col">
                            <span className="text-[8px] text-white/20 uppercase tracking-widest font-black mb-1">
                              Focus Area
                            </span>
                            <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest border border-white/10 px-2 py-1 rounded-sm bg-white/[0.02]">
                              {resolvedEx.pool}
                            </span>
                          </div>
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
                              <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-gym-accent group-hover:bg-gym-accent group-hover:text-black transition-all">
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

                    {/* Pro Tips Section */}
                    {(() => {
                      const proTipsObj = getProTipsForExercise(resolvedEx.name, resolvedEx.pool, resolvedEx.muscleGroup);
                      return (
                        <div className="p-10 bg-[#070707] border-t border-b border-white/5 text-left">
                          <h4 className="text-[9px] font-black text-gym-accent uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                            <div className="h-px flex-1 bg-gym-accent/20" />
                            Elite Performance Guide
                            <div className="h-px flex-1 bg-gym-accent/20" />
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Pro Tips (What to do) */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-emerald-500/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono">
                                  Pro Tips (Max Effectiveness)
                                </span>
                              </div>
                              <ul className="space-y-3">
                                {proTipsObj.tips.map((tip, idx) => (
                                  <li key={idx} className="flex gap-3 items-start text-xs font-light text-white/80 leading-relaxed">
                                    <span className="text-emerald-500 select-none font-bold font-mono">✓</span>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* What to Avoid (Pitfalls) */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-rose-500/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest font-mono">
                                  Mistakes to Avoid
                                </span>
                              </div>
                              <ul className="space-y-3">
                                {proTipsObj.avoid.map((dont, idx) => (
                                  <li key={idx} className="flex gap-3 items-start text-xs font-light text-white/80 leading-relaxed">
                                    <span className="text-rose-500 select-none font-bold font-mono">✕</span>
                                    <span>{dont}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Video Demonstration Section */}
                    <div className="p-10 pb-5 bg-white/[0.01] border-t border-b border-white/5">
                      <h4 className="text-[9px] font-black text-gym-accent uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gym-accent/20" />
                        Video Demonstration
                        <div className="h-px flex-1 bg-gym-accent/20" />
                      </h4>

                      {resolvedEx.pool !== "cardio" &&
                        (resolvedEx.youtubeId ? (
                          <div className="rounded-sm overflow-hidden border border-white/10 bg-black aspect-video relative shadow-lg">
                            <iframe
                              className="w-full h-full"
                              src={`https://www.youtube.com/embed/${resolvedEx.youtubeId}?rel=0`}
                              title={`PureGym Form Guide: ${resolvedEx.name}`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <div className="p-6 rounded-sm border border-dashed border-white/10 bg-white/[0.005] flex flex-col items-center justify-center text-center gap-3 py-10">
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
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 border border-white/10 hover:border-gym-accent rounded-sm text-white/60 hover:text-white hover:bg-gym-accent/5 transition-all cursor-pointer"
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
                        className="px-10 py-4 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-gym-accent hover:bg-gym-accent/5 transition-all text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer rounded-sm"
                      >
                        Close Archive
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
                className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden flex flex-col shadow-2xl"
              >
                <div className="p-8 border-b border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gym-accent/5 rounded-full blur-2xl -mr-12 -mt-12" />
                  <div className="relative z-10 flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-sm flex items-center justify-center border ${
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
                    className={`px-6 py-3 text-black text-[10px] font-black uppercase tracking-widest cursor-pointer rounded-sm transition-all hover:brightness-110 ${
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
                AVATAR_IMAGES[activeOutfitId] || imgVanguardDefault;

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
                    className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#050505] border border-white/10 rounded-sm shadow-2xl overflow-hidden"
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
                          className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest text-[10px] rounded-sm transition-all hover:brightness-110 active:scale-95 flex items-center gap-2 cursor-pointer shadow-lg shadow-white/5"
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
                          }}
                          className="bg-[#050505] p-8 border border-gym-accent/25 rounded-sm flex flex-col gap-6 font-sans shrink-0 text-white relative select-none"
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
                            <div className="col-span-4 bg-white/[0.015] border border-white/10 rounded-sm p-4 flex flex-col items-center justify-between text-center relative overflow-hidden">
                              <span className="text-[10px] font-mono font-bold tracking-widest text-white uppercase block">
                                AVATAR SPECIMEN
                              </span>

                              {/* Image Box */}
                              <div className="w-32 h-32 rounded-full bg-black/40 border border-gym-accent/20 overflow-hidden flex items-center justify-center my-4 relative">
                                {avatarImg ? (
                                  <img
                                    src={avatarImg}
                                    alt="Avatar spec"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <UserIcon className="w-12 h-12 text-white/15" />
                                )}
                                {/* XP Progress Arc Outline */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                                {/* Floating Level */}
                                <div className="absolute bottom-1 bg-black/90 border border-gym-accent/50 text-[11px] font-mono font-black text-gym-accent px-2.5 py-0.5 rounded-full scale-95 tracking-widest">
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
                            <div className="col-span-8 bg-white/[0.015] border border-white/10 rounded-sm p-5 flex flex-col justify-between relative overflow-hidden">
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
                          <div className="bg-white/[0.015] border border-white/10 rounded-sm p-5 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-4 relative z-10">
                              <div>
                                <span className="text-[10px] font-mono font-bold tracking-widest text-gym-accent uppercase block">
                                  TIMELINE DATA _01
                                </span>
                                <span className="text-xs font-mono font-black text-white uppercase tracking-widest">
                                  Weight Log Analysis (kg)
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-semibold text-white bg-white/10 px-2 py-0.5 border border-white/10 rounded-sm">
                                HISTORICAL ENTRIES: {weightHistory.length}
                              </span>
                            </div>
                            <div className="h-32 w-full">
                              {weightHistory.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center border border-white/5 border-dashed rounded-sm bg-black/40">
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
                          <div className="bg-white/[0.015] border border-white/10 rounded-sm p-5 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-4 relative z-10">
                              <div>
                                <span className="text-[10px] font-mono font-bold tracking-widest text-gym-accent uppercase block">
                                  TIMELINE DATA _02
                                </span>
                                <span className="text-xs font-mono font-black text-white uppercase tracking-widest">
                                  Training Volume Trend (kg)
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-semibold text-white bg-white/10 px-2 py-0.5 border border-white/10 rounded-sm">
                                TIMEFRAME: {volumeTimeframe.toUpperCase()}
                              </span>
                            </div>
                            <div className="h-32 w-full">
                              {archivedWorkouts.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center border border-white/5 border-dashed rounded-sm bg-black/40">
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
                          <div className="bg-white/[0.015] border border-white/10 rounded-sm p-5 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-4 relative z-10">
                              <div>
                                <span className="text-[10px] font-mono font-bold tracking-widest text-gym-accent uppercase block">
                                  TIMELINE DATA _03
                                </span>
                                <span className="text-xs font-mono font-black text-white uppercase tracking-widest">
                                  Active Calorie Expenditure (kcal)
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-semibold text-white bg-white/10 px-2 py-0.5 border border-white/10 rounded-sm">
                                HISTORICAL ENTRIES: {archivedWorkouts.length}
                              </span>
                            </div>
                            <div className="h-32 w-full">
                              {archivedWorkouts.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center border border-white/5 border-dashed rounded-sm bg-black/40">
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
                                        if (
                                          w.estimatedCalories !== undefined &&
                                          w.estimatedCalories > 0
                                        ) {
                                          return w.estimatedCalories;
                                        }
                                        return calculateCaloriesBurned(
                                          w.sets || [],
                                          profile,
                                        );
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
                          <div className="bg-white/[0.015] border border-white/10 rounded-sm p-5 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-4 relative z-10">
                              <div>
                                <span className="text-[10px] font-mono font-bold tracking-widest text-gym-accent uppercase block">
                                  TIMELINE DATA _04
                                </span>
                                <span className="text-xs font-mono font-black text-white uppercase tracking-widest">
                                  Body Fat Percentage Trend (%)
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-semibold text-white bg-white/10 px-2 py-0.5 border border-white/10 rounded-sm">
                                HISTORICAL ENTRIES: {bodyFatHistory.length}
                              </span>
                            </div>
                            <div className="h-32 w-full">
                              {bodyFatHistory.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center border border-white/5 border-dashed rounded-sm bg-black/40">
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
                  </motion.div>
                </div>
              );
            })()}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 20, x: "-50%" }}
              className={`fixed bottom-10 left-1/2 z-[200] px-6 py-3 rounded-sm border shadow-2xl flex items-center gap-3 min-w-[280px] ${
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
                className="w-full max-w-md bg-[#0d0d0d] border border-gym-accent/30 rounded-sm shadow-2xl overflow-hidden"
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
                    className="bg-gym-accent hover:bg-gym-accent/90 text-black px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all active:scale-[0.98] cursor-pointer font-mono"
                  >
                    Okay
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
