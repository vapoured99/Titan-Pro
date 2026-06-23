import React, { useState, useMemo, useEffect } from "react";
import { POOLS } from "../data/exercises";
import { 
  Info, 
  Dumbbell, 
  ArrowUpRight, 
  ShieldCheck, 
  Layers, 
  Scale, 
  Flame, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Sliders,
  HelpCircle
} from "lucide-react";

interface RadarDataPoint {
  axis: string;
  value: number; // percentage of baseline (e.g., 100, 115)
  loggedExercisesCount: number;
  details: { name: string; growth: number }[];
}

interface D3RadarChartProps {
  data: RadarDataPoint[];
  activeTheme: {
    accent: string;
    accentLight: string;
    accentDark: string;
    accentRgb: string;
  };
  profile: any;
  sessionSets: any[];
  archivedWorkouts: any[];
}

// 1-Rep Max Epley Calculation helper
const calc1RM = (weight: number, reps: number): number => {
  if (reps <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
};

interface QualifyingExercise {
  id: string;
  name: string;
  category: string;
  keys: string[];
  maleTiers: { novice: number; intermediate: number; advanced: number; elite: number };
  femaleTiers: { novice: number; intermediate: number; advanced: number; elite: number };
}

const QUALIFYING_EXERCISES: QualifyingExercise[] = [
  {
    id: "bench_press",
    name: "Barbell Bench Press",
    category: "Chest / Upper Push",
    keys: ["barbell bench press", "bench press"],
    maleTiers: { novice: 0.75, intermediate: 1.1, advanced: 1.5, elite: 2.0 },
    femaleTiers: { novice: 0.5, intermediate: 0.75, advanced: 1.0, elite: 1.25 }
  },
  {
    id: "incline_bench_press",
    name: "Barbell Incline Bench Press",
    category: "Chest / Upper Push",
    keys: ["barbell incline bench", "incline bench press", "incline bench"],
    maleTiers: { novice: 0.65, intermediate: 0.95, advanced: 1.3, elite: 1.75 },
    femaleTiers: { novice: 0.4, intermediate: 0.65, advanced: 0.85, elite: 1.1 }
  },
  {
    id: "dumbbell_chest_press",
    name: "Dumbbell Bench Press",
    category: "Chest / Upper Push",
    keys: ["dumbbell bench press", "dumbbell press", "db bench", "db press"],
    maleTiers: { novice: 0.6, intermediate: 0.9, advanced: 1.2, elite: 1.6 },
    femaleTiers: { novice: 0.35, intermediate: 0.6, advanced: 0.8, elite: 1.0 }
  },
  {
    id: "overhead_press",
    name: "Military Press",
    category: "Shoulders / Vertical Push",
    keys: ["military press", "overhead press", "shoulder press", "ohp"],
    maleTiers: { novice: 0.5, intermediate: 0.75, advanced: 1.0, elite: 1.25 },
    femaleTiers: { novice: 0.35, intermediate: 0.5, advanced: 0.7, elite: 0.9 }
  },
  {
    id: "back_squat",
    name: "Barbell Back Squat",
    category: "Quads / Lower Push",
    keys: ["barbell back squat", "back squat", "squat", "safety bar squat"],
    maleTiers: { novice: 1.0, intermediate: 1.5, advanced: 2.0, elite: 2.5 },
    femaleTiers: { novice: 0.75, intermediate: 1.1, advanced: 1.5, elite: 1.8 }
  },
  {
    id: "front_squat",
    name: "Barbell Front Squat",
    category: "Quads / Lower Push",
    keys: ["barbell front squat", "front squat"],
    maleTiers: { novice: 0.8, intermediate: 1.2, advanced: 1.6, elite: 2.1 },
    femaleTiers: { novice: 0.6, intermediate: 0.9, advanced: 1.2, elite: 1.5 }
  },
  {
    id: "hack_squat",
    name: "Hack Squat",
    category: "Quads / Lower Push",
    keys: ["hack squat", "hack squats"],
    maleTiers: { novice: 1.2, intermediate: 1.8, advanced: 2.4, elite: 3.0 },
    femaleTiers: { novice: 0.9, intermediate: 1.3, advanced: 1.8, elite: 2.2 }
  },
  {
    id: "leg_press",
    name: "Seated Leg Press",
    category: "Lower Body / Push",
    keys: ["seated leg press", "leg press"],
    maleTiers: { novice: 2.5, intermediate: 3.5, advanced: 4.5, elite: 5.5 },
    femaleTiers: { novice: 1.8, intermediate: 2.7, advanced: 3.6, elite: 4.5 }
  },
  {
    id: "deadlift",
    name: "Barbell Deadlifts",
    category: "Posterior Chain / Heavy Pull",
    keys: ["barbell deadlifts", "barbell deadlift", "conventional deadlift", "deadlift", "sumo deadlift"],
    maleTiers: { novice: 1.2, intermediate: 1.75, advanced: 2.3, elite: 2.8 },
    femaleTiers: { novice: 0.9, intermediate: 1.35, advanced: 1.85, elite: 2.25 }
  },
  {
    id: "hex_bar_deadlift",
    name: "Hex Bar Deadlift",
    category: "Posterior / Lower Pull",
    keys: ["hex bar deadlift", "hexbar lift", "trap bar deadlift", "hex deallift"],
    maleTiers: { novice: 1.3, intermediate: 1.85, advanced: 2.4, elite: 2.9 },
    femaleTiers: { novice: 1.0, intermediate: 1.4, advanced: 1.9, elite: 2.3 }
  },
  {
    id: "weighted_pullup",
    name: "Pull Ups",
    category: "Back / Vertical Pull",
    keys: ["pull ups", "pullups", "weighted pullup", "weighted pull-up", "chinup", "chin-up", "pull-up", "pullup"],
    maleTiers: { novice: 1.0, intermediate: 1.2, advanced: 1.4, elite: 1.6 },
    femaleTiers: { novice: 0.8, intermediate: 1.0, advanced: 1.15, elite: 1.3 }
  },
  {
    id: "weighted_dip",
    name: "Weighted Chest Dips",
    category: "Chest & Triceps / Push",
    keys: ["weighted chest dips", "chest dips", "weighted dip", "weighted dips", "dips"],
    maleTiers: { novice: 1.1, intermediate: 1.35, advanced: 1.6, elite: 1.9 },
    femaleTiers: { novice: 0.9, intermediate: 1.1, advanced: 1.25, elite: 1.4 }
  },
  {
    id: "barbell_row",
    name: "Barbell Bent Over Row",
    category: "Back / Horizontal Pull",
    keys: ["barbell bent over row", "barbell row", "bent over row"],
    maleTiers: { novice: 0.6, intermediate: 0.9, advanced: 1.15, elite: 1.4 },
    femaleTiers: { novice: 0.4, intermediate: 0.6, advanced: 0.8, elite: 1.0 }
  }
];

export default function D3RadarChart({ 
  data, 
  activeTheme, 
  profile, 
  sessionSets = [], 
  archivedWorkouts = [] 
}: D3RadarChartProps) {
  // 1. PIN INTERACTIVITY STATE (instead of only hover)
  const [selectedNode, setSelectedNode] = useState<RadarDataPoint | null>(null);
  const [hoveredNode, setHoveredNode] = useState<RadarDataPoint | null>(null);

  // Set default selection to first axis if loaded
  useEffect(() => {
    if (data && data.length > 0 && !selectedNode) {
      setSelectedNode(data[0]);
    }
  }, [data, selectedNode]);

  // 2. LAYER VISIBILITY CONTROL STATES
  const [activeLayers, setActiveLayers] = useState({
    gridWeb: true,
    baseline: true,
    currentProgress: true,
    targetStandard: true,
    innerGlow: true,
  });

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  // 3. BODYWEIGHT & LIFT CALCULATOR SCANNER
  const userBodyweight = useMemo(() => {
    return Number(profile?.bodyweight) || 80;
  }, [profile?.bodyweight]);

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("bench_press");
  const [simulatorWeightInput, setSimulatorWeightInput] = useState<string>("");

  // Scan history to locate true maximums of compound lifts
  const exercisePowerMetrics = useMemo(() => {
    // Initialize results
    const results: Record<string, {
      id: string;
      name: string;
      category: string;
      bestWeight: number;
      reps: number;
      est1RM: number;
      date: string;
      ratio: number;
      rankTitle: string;
      rankColor: string;
      nextTitle: string;
      nextMult: number;
      exerciseObj: QualifyingExercise;
    }> = {};

    QUALIFYING_EXERCISES.forEach(ex => {
      results[ex.id] = {
        id: ex.id,
        name: ex.name,
        category: ex.category,
        bestWeight: 0,
        reps: 0,
        est1RM: 0,
        date: "",
        ratio: 0,
        rankTitle: "No Data",
        rankColor: "text-zinc-500",
        nextTitle: "",
        nextMult: 0,
        exerciseObj: ex
      };
    });

    const normalizeMatch = (exName: string, keys: string[]) => {
      const name = exName.toLowerCase().trim();
      return keys.some(key => {
        const k = key.toLowerCase();
        if (!name.includes(k)) return false;
        
        // Exclude specific mismatch groups
        if (k === "bench" && (name.includes("incline") || name.includes("decline") || name.includes("dumbbell"))) {
          if (!keys.some(x => x.includes("incline") || x.includes("dumbbell"))) {
            return false;
          }
        }
        if (k === "squat" && (name.includes("jump") || name.includes("curtsey") || name.includes("pistol") || name.includes("bulgarian") || name.includes("front") || name.includes("hack"))) {
          if (!keys.some(x => x.includes("front") || x.includes("hack"))) {
            return false;
          }
        }
        if (k === "deadlift" && (name.includes("romanian") || name.includes("stiff-leg") || name.includes("single leg") || name.includes("hex"))) {
          if (!keys.some(x => x.includes("hex"))) {
            return false;
          }
        }
        if (k === "pull-up" || k === "pullup" || k === "chinup" || k === "chin-up") {
          if (name.includes("assisted")) return false;
        }
        return true;
      });
    };

    const isFemale = profile?.sex === "female";

    const inspectSet = (set: any, dateString: string) => {
      if (!set || !set.exerciseName) return;
      const weight = Number(set.weight) || 0;
      const reps = Number(set.reps) || 0;
      const est = calc1RM(weight, reps);

      QUALIFYING_EXERCISES.forEach(ex => {
        if (normalizeMatch(set.exerciseName, ex.keys)) {
          const res = results[ex.id];
          if (est > res.est1RM) {
            res.bestWeight = weight;
            res.reps = reps;
            res.est1RM = est;
            res.date = dateString || set.date || "Today";
          }
        }
      });
    };

    // Scan active sets
    sessionSets.forEach(s => inspectSet(s, "Active Today"));

    // Scan archiving records
    archivedWorkouts.forEach(w => {
      if (w?.sets) {
        w.sets.forEach((s: any) => inspectSet(s, w.date));
      }
    });

    // Compute ratios, ranks, and standards
    QUALIFYING_EXERCISES.forEach(ex => {
      const res = results[ex.id];
      if (res.est1RM > 0 && userBodyweight > 0) {
        res.ratio = res.est1RM / userBodyweight;
        
        const tiers = isFemale ? ex.femaleTiers : ex.maleTiers;
        
        if (res.ratio < tiers.novice) {
          res.rankTitle = "Untrained";
          res.rankColor = "text-zinc-500";
          res.nextTitle = "Novice";
          res.nextMult = tiers.novice;
        } else if (res.ratio < tiers.intermediate) {
          res.rankTitle = "Novice";
          res.rankColor = "text-blue-400";
          res.nextTitle = "Intermediate";
          res.nextMult = tiers.intermediate;
        } else if (res.ratio < tiers.advanced) {
          res.rankTitle = "Intermediate";
          res.rankColor = "text-yellow-500";
          res.nextTitle = "Advanced";
          res.nextMult = tiers.advanced;
        } else if (res.ratio < tiers.elite) {
          res.rankTitle = "Advanced";
          res.rankColor = "text-indigo-400";
          res.nextTitle = "Elite Veteran";
          res.nextMult = tiers.elite;
        } else {
          res.rankTitle = "Elite Master 👑";
          res.rankColor = "text-gym-accent font-black tracking-widest";
          res.nextTitle = "";
          res.nextMult = 0;
        }
      }
    });

    return results;
  }, [sessionSets, archivedWorkouts, userBodyweight, profile?.sex]);

  // Filter qualifying exercises to show those that exist in either POOLS or customExercises!
  // This satisfies the request to pull strictly from "my exercises in the app... not any exercise from the internet"
  const displayedExercises = useMemo(() => {
    // Collect all built-in exercise names (lowercased)
    const builtInNames = new Set<string>();
    Object.values(POOLS).forEach(pool => {
      pool.forEach(ex => {
        if (ex.name) {
          builtInNames.add(ex.name.trim().toLowerCase());
        }
      });
    });

    // Also collect custom exercises from local storage
    const customNames = new Set<string>();
    try {
      const saved = localStorage.getItem("gym_custom_exercises");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach((ex: any) => {
            if (ex && ex.name) {
              customNames.add(ex.name.trim().toLowerCase());
            }
          });
        }
      }
    } catch (e) {
      console.error("Failed to parse custom exercises in D3RadarChart:", e);
    }

    // Filter Qualifying Exercises: keep an exercise if its name or any of its keys
    // matches a built-in or custom exercise in the app
    return QUALIFYING_EXERCISES.filter(ex => {
      const lowerName = ex.name.trim().toLowerCase();
      if (builtInNames.has(lowerName) || customNames.has(lowerName)) {
        return true;
      }
      return ex.keys.some(key => builtInNames.has(key.trim().toLowerCase()) || customNames.has(key.trim().toLowerCase()));
    });
  }, []);

  // Handle auto-default selection based on the active qualifying exercises list
  useEffect(() => {
    if (displayedExercises.length > 0) {
      const activeIds = displayedExercises.map(e => e.id);
      if (!activeIds.includes(selectedExerciseId)) {
        const firstLogged = displayedExercises.find(ex => {
          const metrics = exercisePowerMetrics[ex.id];
          return metrics && metrics.est1RM > 0;
        });
        setSelectedExerciseId(firstLogged ? firstLogged.id : displayedExercises[0].id);
      }
    } else {
      setSelectedExerciseId("");
    }
  }, [displayedExercises, selectedExerciseId, exercisePowerMetrics]);

  // Synchronize simulator target weight suggestion when user switches selected exercise
  useEffect(() => {
    const metrics = exercisePowerMetrics[selectedExerciseId];
    if (metrics && metrics.est1RM > 0) {
      setSimulatorWeightInput(metrics.est1RM.toString());
    } else {
      setSimulatorWeightInput("");
    }
  }, [selectedExerciseId, exercisePowerMetrics]);

  // SVG parameters for Radar Diagram
  const width = 400;
  const height = 400;
  const cx = width / 2;
  const cy = height / 2;
  const padding = 36;
  const radius = (width - padding * 2) / 2;

  const numAxes = data.length;
  const angleSlice = (Math.PI * 2) / numAxes;

  // Find maximum data scale (cap at 150-200 minimum to fit boundaries nicely)
  const maxVal = Math.max(160, ...data.map((d) => d.value));

  // Concentric spider-web levels
  const levels = [50, 100, 150, 200].filter((l) => l <= maxVal || l === 200);

  // Obtain projection coordinate for a given index and value
  const getCoordinates = (i: number, value: number) => {
    // Offset by -Math.PI / 2 to start at 12 o'clock (top)
    const angle = i * angleSlice - Math.PI / 2;
    const r = (value / maxVal) * radius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      angle
    };
  };

  // Build boundary projection vectors
  const baselinePoints = data.map((_, i) => getCoordinates(i, 100));
  const baselinePath = baselinePoints.map((p) => `${p.x},${p.y}`).join(" ");

  const currentPoints = data.map((d, i) => getCoordinates(i, d.value));
  const currentPath = currentPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const targetPoints = data.map((_, i) => getCoordinates(i, 150));
  const targetPath = targetPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Custom athletic rank calculator
  const getRankByMultiplier = (ratio: number, compound: string) => {
    if (ratio <= 0) return { title: "Unlogged", color: "text-zinc-500", nextMult: 0.5 };
    
    let tiers = { novice: 0.75, intermediate: 1.1, advanced: 1.5, elite: 2.0 };
    if (compound === "squat") tiers = { novice: 1.0, intermediate: 1.5, advanced: 2.0, elite: 2.5 };
    if (compound === "deadlift") tiers = { novice: 1.2, intermediate: 1.75, advanced: 2.3, elite: 2.8 };
    if (compound === "ohp") tiers = { novice: 0.5, intermediate: 0.75, advanced: 1.0, elite: 1.25 };

    if (ratio < tiers.novice) return { title: "Untrained", color: "text-zinc-500", nextTitle: "Novice", nextMult: tiers.novice };
    if (ratio < tiers.intermediate) return { title: "Novice", color: "text-blue-400", nextTitle: "Intermediate", nextMult: tiers.intermediate };
    if (ratio < tiers.advanced) return { title: "Intermediate", color: "text-yellow-500", nextTitle: "Advanced", nextMult: tiers.advanced };
    if (ratio < tiers.elite) return { title: "Advanced", color: "text-indigo-400", nextTitle: "Elite Veteran", nextMult: tiers.elite };
    return { title: "Elite Master 👑", color: "text-gym-accent font-black tracking-widest", nextTitle: "", nextMult: 0 };
  };

  const getAverageOverallValue = (): number => {
    const validValues = data.filter((d) => d.loggedExercisesCount > 0);
    if (validValues.length === 0) return 100;
    const total = validValues.reduce((sum, current) => sum + current.value, 0);
    return Number((total / validValues.length).toFixed(1));
  };

  const calculateDeltaPercentage = (value: number): string => {
    const d = value - 100;
    return d >= 0 ? `+${d.toFixed(1)}%` : `${d.toFixed(1)}%`;
  };

  // Simulator results
  const simulated1RM = parseFloat(simulatorWeightInput) || 0;
  const simulatedRatio = userBodyweight > 0 ? (simulated1RM / userBodyweight) : 0;
  const simulatedDiff = simulated1RM - userBodyweight;

  return (
    <div className="space-y-6">
      
      {/* 🔮 MULTI-LAYER CONTROLLER CHIPS PANEL */}
      <div className="bg-[#0c0c0c]/90 border border-white/5 rounded-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-gym-accent" />
            <h5 className="text-[10px] font-black uppercase text-white/90 tracking-widest font-mono">
              Radar Visualization Layers ({Object.values(activeLayers).filter(Boolean).length}/5)
            </h5>
          </div>
          <span className="text-[8.5px] uppercase font-mono text-white/30 tracking-widest">
            Toggle chips to inspect depth structures
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => toggleLayer("gridWeb")}
            className={`px-3 py-1.5 rounded-sm border text-[9px] font-mono font-bold uppercase transition-all tracking-wider flex items-center gap-1.5 cursor-pointer ${
              activeLayers.gridWeb 
                ? "bg-white/5 border-white/20 text-white" 
                : "bg-black/50 border-white/5 text-white/25 hover:text-white/45"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeLayers.gridWeb ? "bg-white/50" : "bg-white/10"}`} />
            Spider Grid Webs
          </button>

          <button
            onClick={() => toggleLayer("baseline")}
            className={`px-3 py-1.5 rounded-sm border text-[9px] font-mono font-bold uppercase transition-all tracking-wider flex items-center gap-1.5 cursor-pointer ${
              activeLayers.baseline 
                ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500" 
                : "bg-black/50 border-white/5 text-white/25 hover:text-white/45"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeLayers.baseline ? "bg-yellow-500" : "bg-white/10"}`} />
            Baseline Goal bound (100%)
          </button>

          <button
            onClick={() => toggleLayer("currentProgress")}
            className={`px-3 py-1.5 rounded-sm border text-[9px] font-mono font-bold uppercase transition-all tracking-wider flex items-center gap-1.5 cursor-pointer ${
              activeLayers.currentProgress 
                ? "bg-gym-accent/15 border-gym-accent/30 text-gym-accent" 
                : "bg-black/50 border-white/5 text-white/25 hover:text-white/45"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeLayers.currentProgress ? "bg-gym-accent" : "bg-white/10"}`} />
            My Progress Output
          </button>

          <button
            onClick={() => toggleLayer("targetStandard")}
            className={`px-3 py-1.5 rounded-sm border text-[9px] font-mono font-bold uppercase transition-all tracking-wider flex items-center gap-1.5 cursor-pointer ${
              activeLayers.targetStandard 
                ? "bg-purple-500/15 border-purple-500/30 text-purple-400" 
                : "bg-black/50 border-white/5 text-white/25 hover:text-white/45"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeLayers.targetStandard ? "bg-purple-500" : "bg-white/10"}`} />
            Mastery Ring (150%)
          </button>

          <button
            onClick={() => toggleLayer("innerGlow")}
            className={`px-3 py-1.5 rounded-sm border text-[9px] font-mono font-bold uppercase transition-all tracking-wider flex items-center gap-1.5 cursor-pointer ${
              activeLayers.innerGlow 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" 
                : "bg-black/50 border-white/5 text-white/25 hover:text-white/45"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeLayers.innerGlow ? "bg-emerald-400" : "bg-white/10"}`} />
            Aura Backdrop
          </button>
        </div>
      </div>

      {/* 📊 INTERACTIVE RADAR & PIN DISPLAY PANEL */}
      <div className="bg-[#080808]/40 border border-white/5 rounded-sm p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Radar SVG Area */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          <div className="text-center mb-1">
            <span className="text-[8px] bg-gym-accent/15 border border-gym-accent/20 text-gym-accent font-mono px-2 py-0.5 rounded-sm uppercase tracking-widest font-black inline-block mb-1.5">
              Interactive Canvas
            </span>
            <h4 className="text-sm font-black text-white/95 tracking-wider uppercase font-sans">
              Dynamic Symmetrical Spider Lens
            </h4>
            <p className="text-[9.5px] text-white/45 uppercase tracking-wide font-mono mt-0.5 leading-relaxed max-w-sm mx-auto">
              Click any node or muscle label to lock details down inside the adjacent analyst report.
            </p>
          </div>

          <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center mt-3">
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${width} ${height}`}
              className="overflow-visible select-none"
            >
              {/* Defs/Gradients */}
              <defs>
                <radialGradient id="radarInnerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={activeTheme.accent} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={activeTheme.accent} stopOpacity={0} />
                </radialGradient>
                <linearGradient id="currentAreaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={activeTheme.accent} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={activeTheme.accentLight || activeTheme.accent} stopOpacity={0.15} />
                </linearGradient>
              </defs>

              {/* 1. Aura Backdrop Layer */}
              {activeLayers.innerGlow && (
                <circle cx={cx} cy={cy} r={radius} fill="url(#radarInnerGlow)" />
              )}

              {/* 2. Concentric Grid Spider Web Lines */}
              {activeLayers.gridWeb && levels.map((level) => {
                const levelPoints = data.map((_, i) => getCoordinates(i, level));
                const pathString = levelPoints.map((p) => `${p.x},${p.y}`).join(" ");
                const isBaseline = level === 100;

                return (
                  <g key={`level-${level}`}>
                    <polygon
                      points={pathString}
                      fill="none"
                      stroke={isBaseline ? "#eab308" : "rgba(255, 255, 255, 0.05)"}
                      strokeDasharray={isBaseline ? "4 3" : "none"}
                      strokeWidth={isBaseline ? 1.5 : 0.75}
                      className="transition-all duration-300"
                    />
                    <text
                      x={cx + 6}
                      y={cy - (level / maxVal) * radius + 3.5}
                      className="font-mono text-[7px]"
                      fill={isBaseline ? "#eab308" : "rgba(255,255,255,0.22)"}
                      fontWeight={isBaseline ? "bold" : "normal"}
                    >
                      {level}% {isBaseline ? " (Base)" : ""}
                    </text>
                  </g>
                );
              })}

              {/* Spoke axis separator lines */}
              {data.map((d, i) => {
                const outerCoord = getCoordinates(i, maxVal);
                return (
                  <line
                    key={`spoke-axis-${i}`}
                    x1={cx}
                    y1={cy}
                    x2={outerCoord.x}
                    y2={outerCoord.y}
                    stroke="rgba(255, 255, 255, 0.04)"
                    strokeWidth={1}
                  />
                );
              })}

              {/* 3. Standard Baseline Boundary (100%) Polygons */}
              {activeLayers.baseline && (
                <polygon
                  points={baselinePath}
                  fill="none"
                  stroke="#eab308"
                  strokeWidth={1.5}
                  strokeOpacity={0.7}
                  strokeDasharray="3 3"
                />
              )}

              {/* 4. Target Mastery Outer boundary Ring (150%) */}
              {activeLayers.targetStandard && (
                <polygon
                  points={targetPath}
                  fill="none"
                  stroke="rgba(168, 85, 247, 0.3)"
                  strokeWidth={1}
                  strokeDasharray="4 2"
                />
              )}

              {/* 5. Current Progress Area Polygon */}
              {activeLayers.currentProgress && (
                <polygon
                  points={currentPath}
                  fill="url(#currentAreaGrad)"
                  stroke={activeTheme.accent}
                  strokeWidth={2.5}
                  className="transition-all duration-500 ease-out"
                />
              )}

              {/* Interactive nodes and handles */}
              {data.map((d, i) => {
                const coord = getCoordinates(i, d.value);
                const isSelected = selectedNode?.axis === d.axis;
                const isHovered = hoveredNode?.axis === d.axis;

                return (
                  <g
                    key={`interactive-node-${i}`}
                    className="cursor-pointer"
                    onClick={() => setSelectedNode(d)}
                    onMouseEnter={() => setHoveredNode(d)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Ring highlight halo */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r={isSelected ? 11 : 8}
                        fill={activeTheme.accent}
                        fillOpacity={isSelected ? 0.3 : 0.15}
                        className={isSelected ? "" : "animate-pulse"}
                      />
                    )}

                    {/* Core vertex circle */}
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={isSelected ? 6 : 4}
                      fill={isSelected ? "#ffffff" : isHovered ? activeTheme.accentLight : activeTheme.accent}
                      stroke={isSelected ? activeTheme.accent : "#030303"}
                      strokeWidth={2}
                      className="transition-all duration-150"
                    />

                    {/* Invisible detectors */}
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={18}
                      fill="transparent"
                    />
                  </g>
                );
              })}

              {/* Text Axis Labels */}
              {data.map((d, i) => {
                const labelRadius = maxVal + 18;
                const angle = i * angleSlice - Math.PI / 2;
                const x = cx + ((labelRadius / maxVal) * radius) * Math.cos(angle);
                const y = cy + ((labelRadius / maxVal) * radius) * Math.sin(angle);

                let textAnchor = "middle";
                if (Math.cos(angle) > 0.1) textAnchor = "start";
                if (Math.cos(angle) < -0.1) textAnchor = "end";

                let dy = "0.35em";
                if (Math.sin(angle) > 0.5) dy = "0.9em";
                if (Math.sin(angle) < -0.5) dy = "-0.2em";

                const isSelected = selectedNode?.axis === d.axis;
                const isHovered = hoveredNode?.axis === d.axis;

                return (
                  <text
                    key={`label-text-${i}`}
                    x={x}
                    y={y}
                    textAnchor={textAnchor}
                    dy={dy}
                    onClick={() => setSelectedNode(d)}
                    className={`text-[8.5px] uppercase tracking-widest font-mono font-bold cursor-pointer transition-all ${
                      isSelected 
                        ? "fill-gym-accent font-black scale-110 shadow-lg text-[9.5px]" 
                        : isHovered 
                        ? "fill-white" 
                        : "fill-white/45 hover:fill-white"
                    }`}
                  >
                    {isSelected ? `📌 ${d.axis}` : d.axis}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* 📋 ANALYST DISCOVERY SIDE PANEL */}
        <div className="lg:col-span-5 h-full flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            
            {/* Display Category */}
            <div className="border-b border-white/5 pb-2">
              <div className="flex items-center justify-between text-[10px] text-white/30 uppercase tracking-widest font-mono font-bold">
                <span>Pinned Muscle Analyst Target</span>
                {selectedNode && (
                  <span className="text-gym-accent/80 flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3 h-3 text-gym-accent animate-spin" />
                    Locked Output
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-black font-sans text-white uppercase tracking-wide">
                  {selectedNode ? selectedNode.axis : "Overall Score"}
                </span>
                <span
                  className="text-xs font-mono font-bold"
                  style={{
                    color: (selectedNode ? selectedNode.value : getAverageOverallValue()) >= 100 
                      ? activeTheme.accent 
                      : "#ef4444"
                  }}
                >
                  {selectedNode 
                    ? calculateDeltaPercentage(selectedNode.value) 
                    : calculateDeltaPercentage(getAverageOverallValue())
                  }
                </span>
              </div>
            </div>

            {/* Display Body Details */}
            {selectedNode ? (
              <div className="space-y-3">
                
                {/* Specific Score Card */}
                <div className="bg-[#0c0c0c]/90 border border-white/5 rounded-sm p-4 space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gym-accent/5 rounded-full blur-xl pointer-events-none" />
                  <div className="flex justify-between items-center text-[10.5px] font-mono border-b border-white/[0.04] pb-2">
                    <span className="text-white/40">Relative adaptation index:</span>
                    <span style={{ color: activeTheme.accent }} className="font-extrabold">{selectedNode.value}%</span>
                  </div>
                  <div className="flex justify-between items-center text-[10.5px] font-mono">
                    <span className="text-white/40">Total logged exercises:</span>
                    <span className="font-extrabold text-white">{selectedNode.loggedExercisesCount} movements</span>
                  </div>
                </div>

                {/* Sub-exercises Contribution */}
                <div className="space-y-2.5">
                  <span className="text-[8.5px] uppercase font-bold tracking-widest font-mono text-white/30 block">
                    Exercise Contributions & Delta Shifts
                  </span>

                  {selectedNode.details.length === 0 ? (
                    <div className="p-4 bg-white/[0.01] border border-dashed border-white/5 rounded text-center">
                      <HelpCircle className="w-5 h-5 text-white/10 mx-auto mb-1.5" />
                      <p className="text-[9.5px] italic text-white/40 leading-relaxed max-w-xs mx-auto">
                        No custom logs parsed for {selectedNode.axis} yet. Log regular sets to start computing development ratios!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[175px] overflow-y-auto no-scrollbar pr-1">
                      {selectedNode.details.map((item, idx) => (
                        <div
                          key={`sub-ex-${idx}`}
                          className="bg-white/[0.015] border border-white/5 p-2.5 rounded-sm flex items-center justify-between text-[10px] hover:border-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-2 max-w-[70%]">
                            <Dumbbell style={{ color: activeTheme.accent }} className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-white/70 truncate uppercase font-mono font-semibold tracking-wide">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 font-mono">
                            <span 
                              className="font-bold text-[10.5px]"
                              style={{ color: item.growth >= 0 ? activeTheme.accent : "#ef4444" }}
                            >
                              {item.growth >= 0 ? "+" : ""}{item.growth.toFixed(1)}%
                            </span>
                            <ArrowUpRight 
                              className="w-2.5 h-2.5 shrink-0" 
                              style={{ color: item.growth >= 0 ? activeTheme.accent : "#ef4444" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="p-4 bg-[#0c0c0c]/70 border border-white/5 rounded text-center">
                <p className="text-xs text-white/40 font-mono uppercase tracking-wider">
                  No Muscle Selected
                </p>
              </div>
            )}

            {/* Quick Helper reset pin button */}
            {selectedNode && (
              <button 
                onClick={() => setSelectedNode(null)}
                className="w-full py-2 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center gap-2 text-[9px] uppercase font-bold tracking-widest border border-white/5 rounded-sm cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3 text-gym-accent" />
                Deselect Channel & Reset Map
              </button>
            )}

          </div>
        </div>

      </div>

      {/* 🏋️ ────────────────── REVISIONS: POWER-TO-WEIGHT ANALYST EXPLORER ────────────────── */}
      <div className="border border-white/10 rounded-sm overflow-hidden bg-black/95 p-5 space-y-5">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gym-accent/10 border border-gym-accent/30 rounded text-gym-accent">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Titan Power-To-Weight Analyst
              </h4>
              <p className="text-[9.5px] text-white/35 uppercase tracking-wider mt-0.5 font-mono">
                Current Logged Bodyweight: <strong className="text-gym-accent font-mono">{userBodyweight} kg</strong>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[8.5px] bg-white/5 font-mono text-white/50 border border-white/10 px-2.5 py-1 text-center font-bold rounded-sm uppercase tracking-wider">
              Gender bracket: {profile?.sex === "female" ? "Female standards" : "Male standards"}
            </span>
          </div>
        </div>

        {/* Dual pane layout: left side is list of exercises, right side is detail and simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* LEFT SIDE: List of Qualifying Exercises */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-[9px] uppercase font-bold tracking-widest font-mono text-white/30 block mb-1">
              Select Qualifying Movement
            </span>
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1 no-scrollbar border border-white/5 rounded p-2.5 bg-[#030303]/80">
              {displayedExercises.length === 0 ? (
                <div className="text-center p-4 py-8 rounded bg-[#080808]/50 border border-white/5 space-y-2">
                  <Dumbbell className="w-8 h-8 text-white/15 mx-auto animate-pulse" />
                  <p className="text-[10px] uppercase font-black tracking-widest text-white/60">No Logged Compound Movements</p>
                  <p className="text-[8.5px] text-white/35 uppercase tracking-wider leading-relaxed">
                    Log at least one set with weight under your workout tracker for any built-in compound lift (like Barbell Bench Press, Barbell Back Squat, Conventional Deadlift, or Hex Bar Deadlift) to activate power-to-weight relative metrics.
                  </p>
                </div>
              ) : (
                displayedExercises.map((ex) => {
                  const metrics = exercisePowerMetrics[ex.id];
                  const isSelected = selectedExerciseId === ex.id;
                  const hasLogged = metrics.est1RM > 0;

                  return (
                    <button
                      key={ex.id}
                      onClick={() => setSelectedExerciseId(ex.id)}
                      className={`w-full text-left p-2.5 border rounded-sm transition-all cursor-pointer flex flex-col justify-between relative group ${
                        isSelected
                          ? "bg-gym-accent/10 border-gym-accent text-white"
                          : "bg-[#080808] border-white/5 text-white/60 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] font-black uppercase tracking-wider truncate mr-1">
                          {ex.name}
                        </span>
                        {hasLogged ? (
                          <span className="text-[8px] px-1.5 py-0.5 bg-gym-accent/15 border border-gym-accent/30 text-gym-accent font-mono font-bold rounded-sm uppercase shrink-0">
                            {metrics.ratio.toFixed(2)}x
                          </span>
                        ) : (
                          <span className="text-[8px] px-1.5 py-0.5 bg-white/5 text-white/35 font-mono rounded-sm uppercase shrink-0">
                            Unlogged
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between w-full mt-1">
                        <span className="text-[7.5px] font-mono text-white/30 uppercase tracking-wider">
                          {ex.category}
                        </span>
                        {hasLogged && (
                          <span className={`text-[7.5px] font-mono font-bold uppercase tracking-wide truncate max-w-[50%] ${metrics.rankColor}`}>
                            {metrics.rankTitle}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT SIDE: Detail Analysis & Live Simulator Panel */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
            {(() => {
              const currentEx = QUALIFYING_EXERCISES.find(e => e.id === selectedExerciseId);
              if (!currentEx) {
                return (
                  <div className="bg-[#050505] border border-white/5 rounded-sm p-8 relative w-full h-full flex flex-col items-center justify-center text-center space-y-4 min-h-[350px]">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gym-accent/30 animate-pulse" />
                    <Scale className="w-12 h-12 text-gym-accent/30 animate-bounce" />
                    <div className="space-y-1 max-w-md">
                      <h4 className="text-sm font-black uppercase tracking-wider text-white">Power-To-Weight Ratio Analyst Active</h4>
                      <p className="text-[10px] text-white/50 uppercase tracking-wider leading-relaxed">
                        Ready to evaluate your anatomical relative strength metrics.
                      </p>
                      <p className="text-[9.5px] text-white/30 uppercase tracking-widest mt-2 leading-relaxed font-mono">
                        Once you log non-zero weight sets in your current workout for compound movements (like bench press or deadlifts), they will instantly qualify and appear here for relative multiplier and rank scoring.
                      </p>
                    </div>
                  </div>
                );
              }
              
              const metrics = exercisePowerMetrics[selectedExerciseId];
              const isFemale = profile?.sex === "female";
              const tiers = isFemale ? currentEx.femaleTiers : currentEx.maleTiers;

              // Live simulator variables
              const simulated1RM = parseFloat(simulatorWeightInput) || 0;
              const simulatedRatio = userBodyweight > 0 ? (simulated1RM / userBodyweight) : 0;
              const simulatedDiff = simulated1RM - userBodyweight;

              const getSimulatedRank = (ratio: number) => {
                if (ratio <= 0) return { title: "Enter input", color: "text-zinc-500", nextTitle: "", nextMult: 0 };
                if (ratio < tiers.novice) return { title: "Untrained", color: "text-zinc-500", nextTitle: "Novice", nextMult: tiers.novice };
                if (ratio < tiers.intermediate) return { title: "Novice", color: "text-blue-400", nextTitle: "Intermediate", nextMult: tiers.intermediate };
                if (ratio < tiers.advanced) return { title: "Intermediate", color: "text-yellow-500", nextTitle: "Advanced", nextMult: tiers.advanced };
                if (ratio < tiers.elite) return { title: "Advanced", color: "text-indigo-400", nextTitle: "Elite Veteran", nextMult: tiers.elite };
                return { title: "Elite Master 👑", color: "text-gym-accent font-black tracking-widest", nextTitle: "", nextMult: 0 };
              };

              const simRankObj = getSimulatedRank(simulatedRatio);

              // Difference from bodyweight
              const dbWeightDiff = metrics.est1RM - userBodyweight;
              const dbDifferenceText = dbWeightDiff >= 0 
                ? `+${dbWeightDiff.toFixed(1)} kg heavier than BW` 
                : `${dbWeightDiff.toFixed(1)} kg below BW`;

              return (
                <div className="bg-[#050505] border border-white/5 rounded-sm p-4.5 space-y-4 relative w-full h-full flex flex-col justify-between">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gym-accent/30" />

                  {/* Top Exercise Block */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <span className="text-[9px] text-gym-accent font-black tracking-widest font-mono uppercase">
                        {currentEx.category}
                      </span>
                      <h4 className="text-base font-black text-white uppercase tracking-wider">
                        {currentEx.name}
                      </h4>
                      <p className="text-[9.5px] text-white/40 leading-relaxed font-sans mt-1">
                        Select a movement category on the left to review metrics or input simulated weights below.
                      </p>
                    </div>

                    <div className="bg-black/40 border border-white/5 p-3 rounded-sm flex flex-col justify-center">
                      {metrics.est1RM > 0 ? (
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div>
                            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Peak Est 1RM</span>
                            <span className="text-lg font-mono font-black text-white">{metrics.est1RM} kg</span>
                            <span className="text-[7px] text-white/20 font-mono block mt-0.5 uppercase tracking-wide">
                              best: {metrics.bestWeight}kg × {metrics.reps}
                            </span>
                          </div>
                          <div className="border-l border-white/5">
                            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Logged Ratio</span>
                            <span className="text-lg font-mono font-black text-gym-accent">{metrics.ratio.toFixed(2)}x</span>
                            <span className={`text-[8px] font-bold uppercase block mt-1 tracking-wider ${metrics.rankColor}`}>
                              {metrics.rankTitle}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-1 text-white/35 italic font-sans text-[10px] space-y-1">
                          <p>No logged history found for {currentEx.name}.</p>
                          <p className="text-[8px] font-mono uppercase tracking-widest text-gym-accent">
                            Keys: {currentEx.keys.slice(0, 3).join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Standard Multipliers Bracket Display */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[8.5px] uppercase font-bold tracking-widest font-mono text-white/30 block mb-1">
                        Power-to-weight relative standards
                      </span>
                      {metrics.est1RM > 0 && (
                        <span className="text-[8.5px] font-mono font-bold text-gym-accent uppercase tracking-wider">
                          Bw Margin: {dbDifferenceText}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(tiers).map(([tierName, multiplier]) => {
                        const requiredWeight = Math.round(userBodyweight * multiplier);
                        const isHit = metrics.est1RM > 0 && metrics.ratio >= multiplier;
                        
                        return (
                          <div 
                            key={tierName}
                            className={`p-2.5 border rounded-sm text-center flex flex-col justify-between ${
                              isHit 
                                ? "bg-gym-accent/5 border-gym-accent/30" 
                                : "bg-black/20 border-white/[0.03]"
                            }`}
                          >
                            <span className={`text-[8.5px] font-black uppercase tracking-wider font-mono ${
                              tierName === "novice" ? "text-blue-400" :
                              tierName === "intermediate" ? "text-yellow-500" :
                              tierName === "advanced" ? "text-indigo-400" :
                              "text-gym-accent"
                            }`}>
                              {tierName}
                            </span>
                            <span className="text-xs font-mono font-bold text-white mt-1">
                              {multiplier.toFixed(2)}x
                            </span>
                            <span className="text-[8px] font-mono text-white/35 mt-0.5 font-bold">
                              {requiredWeight} kg
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Simulator Integration */}
                  <div className="border-t border-white/5 pt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-gym-accent" />
                      <h5 className="text-[10px] font-black uppercase text-white/90 tracking-widest font-mono">
                        Hypothetical target weights projection
                      </h5>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      
                      {/* Interactive Inputs */}
                      <div className="md:col-span-5 bg-[#0a0a0a] p-3 border border-white/5 rounded-sm space-y-2">
                        <label className="text-[8px] uppercase font-black text-white/40 tracking-wider font-mono block">
                          Target 1RM Load
                        </label>
                        <div className="flex gap-1.5 leading-none">
                          <div className="flex-1 flex items-center bg-[#101010] border border-white/10 rounded-sm overflow-hidden px-2.5 h-8">
                            <input
                              type="number"
                              placeholder="e.g. 100"
                              value={simulatorWeightInput}
                              onChange={(e) => setSimulatorWeightInput(e.target.value)}
                              className="w-full bg-transparent text-white text-xs py-1 focus:outline-none focus:ring-0 font-mono font-bold"
                            />
                            <span className="text-[8px] font-black text-white/20 font-mono shrink-0">KG</span>
                          </div>
                          
                          {metrics.est1RM > 0 && (
                            <button
                              onClick={() => setSimulatorWeightInput(metrics.est1RM.toString())}
                              className="px-2.5 bg-white/5 border border-white/5 hover:bg-white/10 text-white font-mono text-[8px] uppercase tracking-wider font-bold rounded-sm h-8 transition-all cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Math Result Engine */}
                      <div className="md:col-span-7 bg-[#080808] p-3 border border-white/5 rounded-sm flex flex-col justify-between min-h-[90px]">
                        {simulated1RM > 0 ? (
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <p className="text-[8px] uppercase font-mono text-white/40 tracking-wider">mult ratio</p>
                              <p className="text-xs font-mono font-black text-gym-accent mt-0.5">{simulatedRatio.toFixed(2)}x</p>
                            </div>

                            <div className="border-x border-white/5 px-2">
                              <p className="text-[8px] uppercase font-mono text-white/40 tracking-wider">vs bodyweight</p>
                              <p className={`text-xs font-mono font-black mt-0.5 ${simulatedDiff >= 0 ? "text-gym-accent" : "text-amber-500"}`}>
                                {simulatedDiff >= 0 ? `+${simulatedDiff.toFixed(1)}` : simulatedDiff.toFixed(1)} kg
                              </p>
                            </div>

                            <div>
                              <p className="text-[8px] uppercase font-mono text-white/40 tracking-wider">tier rank</p>
                              <p className={`text-xs font-mono font-extrabold mt-0.5 uppercase truncate ${simRankObj.color}`}>
                                {simRankObj.title}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-1 text-white/20 text-[9px] font-mono leading-relaxed">
                            Enter any hypothetical target weight load to compute multipliers.
                          </div>
                        )}

                        <div className="bg-black/30 p-1.5 rounded-sm text-[8.5px] text-white/35 flex items-center gap-1.5 border border-white/[0.02] mt-2">
                          <Info className="w-3 h-3 text-gym-accent shrink-0" />
                          <span className="font-mono truncate">
                            {simulated1RM > 0 
                              ? `Simulating ${simulated1RM} kg puts you in the ${simRankObj.title} rank bracket.`
                              : `Standards auto-adjust on current bodyweight index: ${userBodyweight} kg.`
                            }
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              );
            })()}
          </div>

        </div>

      </div>

    </div>
  );
}
