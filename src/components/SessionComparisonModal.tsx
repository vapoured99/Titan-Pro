import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Award,
  Zap,
  Flame,
  Dumbbell,
  Layers,
  Calendar,
  CheckCircle2,
  ChevronDown,
  BarChart2,
  Activity,
  Target,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SessionComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  archivedWorkouts: any[];
  findExerciseByName: (name: string) => any;
  getWorkoutMuscleTags: (workout: any, findFn?: any) => string;
  getExerciseMuscleGroup: (name: string, findFn?: any) => string | null;
}

export const SessionComparisonModal: React.FC<SessionComparisonModalProps> = ({
  isOpen,
  onClose,
  archivedWorkouts = [],
  findExerciseByName,
  getWorkoutMuscleTags,
  getExerciseMuscleGroup,
}) => {
  // Sort workouts by date descending (newest first)
  const sortedWorkouts = useMemo(() => {
    return [...archivedWorkouts].sort((a, b) => {
      const dateA = new Date(a.date || a.timestamp || 0).getTime();
      const dateB = new Date(b.date || b.timestamp || 0).getTime();
      return dateB - dateA;
    });
  }, [archivedWorkouts]);

  // Default Session A: 2nd most recent (index 1), Default Session B: most recent (index 0)
  const [sessionAId, setSessionAId] = useState<string>("");
  const [sessionBId, setSessionBId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"breakdown" | "charts" | "insights">("breakdown");

  // Initialize selected session IDs when modal opens or sortedWorkouts updates
  React.useEffect(() => {
    if (sortedWorkouts.length > 0) {
      if (!sessionBId || !sortedWorkouts.some((w) => w.id === sessionBId)) {
        setSessionBId(sortedWorkouts[0]?.id || "");
      }
      if (!sessionAId || !sortedWorkouts.some((w) => w.id === sessionAId)) {
        setSessionAId(
          sortedWorkouts.length > 1
            ? sortedWorkouts[1]?.id
            : sortedWorkouts[0]?.id || ""
        );
      }
    }
  }, [sortedWorkouts, isOpen]);

  const workoutA = useMemo(
    () => sortedWorkouts.find((w) => w.id === sessionAId) || sortedWorkouts[1] || sortedWorkouts[0],
    [sortedWorkouts, sessionAId]
  );

  const workoutB = useMemo(
    () => sortedWorkouts.find((w) => w.id === sessionBId) || sortedWorkouts[0],
    [sortedWorkouts, sessionBId]
  );

  // Helper to calculate detailed metrics for a workout
  const getWorkoutDetails = (workout: any) => {
    if (!workout) {
      return {
        dateStr: "N/A",
        totalVolume: 0,
        totalSets: 0,
        exercisesCount: 0,
        calories: 0,
        tags: "",
        peakWeight: 0,
        peakExercise: "N/A",
        exercisesMap: new Map<
          string,
          {
            sets: any[];
            maxWeight: number;
            totalVolume: number;
            totalReps: number;
            bestSet: { weight: number; reps: number };
          }
        >(),
        muscleGroupVolume: {} as Record<string, number>,
      };
    }

    const sets = workout.sets || [];
    let totalVol = 0;
    let totalS = sets.length;
    let maxW = 0;
    let maxEx = "N/A";
    const exMap = new Map<
      string,
      {
        sets: any[];
        maxWeight: number;
        totalVolume: number;
        totalReps: number;
        bestSet: { weight: number; reps: number };
      }
    >();

    const mgVolume: Record<string, number> = {
      Chest: 0,
      Triceps: 0,
      Back: 0,
      Biceps: 0,
      Legs: 0,
      Core: 0,
      Shoulders: 0,
      Forearms: 0,
    };

    sets.forEach((s: any) => {
      const exName = s.exerciseName || s.name || "Exercise";
      const w = Number(s.weight) || 0;
      const r = Number(s.reps) || 0;
      const vol = w * r;
      totalVol += vol;

      if (w > maxW) {
        maxW = w;
        maxEx = exName;
      }

      // Map by exercise
      if (!exMap.has(exName)) {
        exMap.set(exName, {
          sets: [],
          maxWeight: 0,
          totalVolume: 0,
          totalReps: 0,
          bestSet: { weight: 0, reps: 0 },
        });
      }

      const item = exMap.get(exName)!;
      item.sets.push(s);
      item.totalVolume += vol;
      item.totalReps += r;

      if (w > item.maxWeight || (w === item.maxWeight && r > item.bestSet.reps)) {
        item.maxWeight = w;
        item.bestSet = { weight: w, reps: r };
      }

      // Muscle group breakdown
      const mg = getExerciseMuscleGroup
        ? getExerciseMuscleGroup(exName, findExerciseByName)
        : null;
      if (mg && mgVolume[mg] !== undefined) {
        mgVolume[mg] += vol;
      }
    });

    const tags = getWorkoutMuscleTags
      ? getWorkoutMuscleTags(workout, findExerciseByName)
      : "";

    // Format date string
    let dateStr = workout.date || workout.formattedDate || "Session";
    try {
      const parsed = new Date(workout.date || workout.timestamp);
      if (!isNaN(parsed.getTime())) {
        dateStr = parsed.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    } catch (_) {}

    return {
      dateStr,
      totalVolume: workout.totalVolume || totalVol,
      totalSets: workout.totalSets || totalS,
      exercisesCount: workout.exercisesCount || exMap.size,
      calories: workout.estimatedCalories || workout.caloriesBurned || 0,
      tags,
      peakWeight: workout.peakWeight || maxW,
      peakExercise: workout.peakExercise || maxEx,
      exercisesMap: exMap,
      muscleGroupVolume: mgVolume,
    };
  };

  const detailsA = useMemo(() => getWorkoutDetails(workoutA), [workoutA]);
  const detailsB = useMemo(() => getWorkoutDetails(workoutB), [workoutB]);

  // Combined list of unique exercises across both sessions
  const allExerciseNames = useMemo(() => {
    const set = new Set<string>();
    detailsA.exercisesMap.forEach((_, name) => set.add(name));
    detailsB.exercisesMap.forEach((_, name) => set.add(name));
    return Array.from(set);
  }, [detailsA, detailsB]);

  // Calculate percentage delta helper (rounded to avoid floating point precision artifacts)
  const getDelta = (valA: number, valB: number) => {
    const rawDiff = valB - valA;
    const diff = Math.round(rawDiff * 10) / 10;
    const pct = valA > 0 ? (diff / valA) * 100 : valB > 0 ? 100 : 0;
    return { diff, pct };
  };

  const volumeDelta = getDelta(detailsA.totalVolume, detailsB.totalVolume);
  const setsDelta = getDelta(detailsA.totalSets, detailsB.totalSets);
  const calsDelta = getDelta(detailsA.calories, detailsB.calories);
  const peakDelta = getDelta(detailsA.peakWeight, detailsB.peakWeight);

  // Prepare chart data for exercise comparison
  const exerciseChartData = useMemo(() => {
    return allExerciseNames.map((name) => {
      const exA = detailsA.exercisesMap.get(name);
      const exB = detailsB.exercisesMap.get(name);
      return {
        name: name.length > 20 ? name.slice(0, 18) + "…" : name,
        fullName: name,
        "Baseline (A)": exA ? exA.totalVolume : 0,
        "Target (B)": exB ? exB.totalVolume : 0,
      };
    });
  }, [allExerciseNames, detailsA, detailsB]);

  // Prepare chart data for muscle group volume
  const muscleGroupChartData = useMemo(() => {
    const groups = [
      "Chest",
      "Triceps",
      "Back",
      "Biceps",
      "Legs",
      "Core",
      "Shoulders",
      "Forearms",
    ];
    return groups
      .map((g) => ({
        group: g,
        "Baseline (A)": detailsA.muscleGroupVolume[g] || 0,
        "Target (B)": detailsB.muscleGroupVolume[g] || 0,
      }))
      .filter((d) => d["Baseline (A)"] > 0 || d["Target (B)"] > 0);
  }, [detailsA, detailsB]);

  // Swap Sessions button handler
  const handleSwapSessions = () => {
    const temp = sessionAId;
    setSessionAId(sessionBId);
    setSessionBId(temp);
  };

  // Quick Preset Handlers
  const handlePresetRecent = () => {
    if (sortedWorkouts.length >= 2) {
      setSessionBId(sortedWorkouts[0].id);
      setSessionAId(sortedWorkouts[1].id);
    }
  };

  const handlePresetBestVolume = () => {
    if (sortedWorkouts.length >= 2) {
      const best = [...sortedWorkouts].sort(
        (a, b) => (b.totalVolume || 0) - (a.totalVolume || 0)
      )[0];
      setSessionBId(sortedWorkouts[0].id);
      setSessionAId(best.id);
    }
  };

  const handlePresetSameRoutine = () => {
    if (!workoutB || sortedWorkouts.length < 2) return;
    const tagB = detailsB.tags;
    const matching = sortedWorkouts.find(
      (w) => w.id !== workoutB.id && getWorkoutMuscleTags(w, findExerciseByName) === tagB
    );
    if (matching) {
      setSessionAId(matching.id);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[250] flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl overflow-hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 26, stiffness: 220 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl bg-[#0a0a0a] border-0 sm:border border-white/15 rounded-none sm:rounded-2xl flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] h-[100dvh] sm:h-[88vh] sm:max-h-[92vh] overflow-hidden"
        >
          {/* Top Decorative Glow Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500 via-gym-accent to-cyan-500" />

          {/* Modal Header */}
          <div className="p-3 sm:p-5 border-b border-white/10 bg-black/80 flex flex-col gap-2.5 sm:gap-4 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gym-accent/10 border border-gym-accent/30 flex items-center justify-center text-gym-accent shadow-[0_0_15px_rgba(235,255,0,0.15)] shrink-0">
                  <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[8px] sm:text-[9px] font-black tracking-[0.2em] text-gym-accent uppercase">
                      PureGym Analytics Studio
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[7px] sm:text-[8px] font-mono text-white/60 font-bold uppercase hidden sm:inline-block">
                      Session Head-To-Head
                    </span>
                  </div>
                  <h3 className="text-base sm:text-2xl font-black italic tracking-tight text-white uppercase font-sans leading-none">
                    Evolution Comparison
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Session Selectors Bar */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 sm:gap-3 bg-white/[0.02] border border-white/10 p-2 sm:p-3 rounded-xl backdrop-blur-md">
              {/* Baseline Session (A) */}
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[8px] sm:text-[9px] font-mono font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_6px_#22d3ee]" />
                    Baseline (A)
                  </span>
                  {detailsA.tags && (
                    <span className="px-1 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[7px] sm:text-[9px] font-black truncate hidden sm:inline-block">
                      {detailsA.tags}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <select
                    value={sessionAId}
                    onChange={(e) => setSessionAId(e.target.value)}
                    className="w-full bg-black/80 border border-white/20 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-400 cursor-pointer appearance-none truncate pr-6"
                  >
                    {sortedWorkouts.map((w, idx) => {
                      const tag = getWorkoutMuscleTags(w, findExerciseByName);
                      return (
                        <option key={`a-${w.id}`} value={w.id} className="bg-black text-white">
                          {idx === 0 ? "🔥 " : ""}{w.date || w.formattedDate} ({w.totalVolume || 0} kg {tag ? `• ${tag}` : ""})
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="w-3 h-3 text-white/40 absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center shrink-0 pt-3 sm:pt-0">
                <button
                  onClick={handleSwapSessions}
                  title="Swap Baseline (A) and Target (B)"
                  className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/5 border border-white/15 text-white/70 hover:text-gym-accent hover:border-gym-accent/40 hover:bg-gym-accent/10 transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Target Session (B) */}
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[8px] sm:text-[9px] font-mono font-black text-gym-accent uppercase tracking-wider flex items-center gap-1 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-gym-accent shrink-0 shadow-[0_0_6px_#ebff00]" />
                    Target (B)
                  </span>
                  {detailsB.tags && (
                    <span className="px-1 py-0.2 rounded bg-gym-accent/10 border border-gym-accent/30 text-gym-accent font-mono text-[7px] sm:text-[9px] font-black truncate hidden sm:inline-block">
                      {detailsB.tags}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <select
                    value={sessionBId}
                    onChange={(e) => setSessionBId(e.target.value)}
                    className="w-full bg-black/80 border border-white/20 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-mono font-bold text-white focus:outline-none focus:border-gym-accent cursor-pointer appearance-none truncate pr-6"
                  >
                    {sortedWorkouts.map((w, idx) => {
                      const tag = getWorkoutMuscleTags(w, findExerciseByName);
                      return (
                        <option key={`b-${w.id}`} value={w.id} className="bg-black text-white">
                          {idx === 0 ? "🔥 " : ""}{w.date || w.formattedDate} ({w.totalVolume || 0} kg {tag ? `• ${tag}` : ""})
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="w-3 h-3 text-white/40 absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Quick Presets & Tab Navigation */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-0.5">
              {/* Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-[8px] sm:text-[9px] font-mono no-scrollbar">
                <span className="font-bold text-white/30 uppercase tracking-widest shrink-0">
                  Presets:
                </span>
                <button
                  onClick={handlePresetRecent}
                  className="px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-white/30 font-bold text-white/80 hover:text-white transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  ⚡ Last 2
                </button>
                <button
                  onClick={handlePresetBestVolume}
                  className="px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-white/30 font-bold text-white/80 hover:text-white transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  🏆 Best Volume
                </button>
                <button
                  onClick={handlePresetSameRoutine}
                  className="px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-white/30 font-bold text-white/80 hover:text-white transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  🔄 Same Tag
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 bg-black p-1 rounded-xl border border-white/10 justify-between sm:justify-start w-full sm:w-auto shrink-0">
                <button
                  onClick={() => setActiveTab("breakdown")}
                  className={`flex-1 sm:flex-initial text-center px-2.5 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "breakdown"
                      ? "bg-gym-accent text-black shadow-[0_0_10px_rgba(235,255,0,0.3)]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Movement Breakdown
                </button>
                <button
                  onClick={() => setActiveTab("charts")}
                  className={`flex-1 sm:flex-initial text-center px-2.5 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "charts"
                      ? "bg-gym-accent text-black shadow-[0_0_10px_rgba(235,255,0,0.3)]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Visual Analytics
                </button>
                <button
                  onClick={() => setActiveTab("insights")}
                  className={`flex-1 sm:flex-initial text-center px-2.5 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "insights"
                      ? "bg-gym-accent text-black shadow-[0_0_10px_rgba(235,255,0,0.3)]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Tactical Insights
                </button>
              </div>
            </div>
          </div>

          {/* Modal Body (Scrollable) */}
          <div className="p-3 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-4 sm:space-y-6 custom-scrollbar bg-black/40">
            {/* Top KPI Comparison Matrix */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              {/* Total Volume KPI */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-2.5 sm:p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-gym-accent/30 transition-all">
                <div>
                  <span className="text-[8px] sm:text-[9px] font-mono font-black text-white/40 uppercase tracking-widest block mb-0.5 sm:mb-1">
                    Total Volume
                  </span>
                  <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <span className="text-base sm:text-xl font-mono font-black text-white tabular-nums">
                      {detailsB.totalVolume.toLocaleString()}{" "}
                      <span className="text-[9px] sm:text-[10px] text-white/40 font-normal">kg</span>
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-white/30 block mt-0.5">
                    vs {detailsA.totalVolume.toLocaleString()} kg
                  </span>
                </div>

                <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-white/5 flex items-center justify-between">
                  {volumeDelta.diff >= 0 ? (
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-black text-emerald-400">
                      <TrendingUp className="w-3 h-3" />+{volumeDelta.diff.toLocaleString()} kg (+
                      {volumeDelta.pct.toFixed(1)}%)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-black text-rose-400">
                      <TrendingDown className="w-3 h-3" />
                      {volumeDelta.diff.toLocaleString()} kg ({volumeDelta.pct.toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Total Sets KPI */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-2.5 sm:p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-gym-accent/30 transition-all">
                <div>
                  <span className="text-[8px] sm:text-[9px] font-mono font-black text-white/40 uppercase tracking-widest block mb-0.5 sm:mb-1">
                    Total Sets
                  </span>
                  <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <span className="text-base sm:text-xl font-mono font-black text-white tabular-nums">
                      {detailsB.totalSets}{" "}
                      <span className="text-[9px] sm:text-[10px] text-white/40 font-normal">sets</span>
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-white/30 block mt-0.5">
                    vs {detailsA.totalSets} sets
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                  {setsDelta.diff >= 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black text-emerald-400">
                      <TrendingUp className="w-3 h-3" />+{setsDelta.diff} sets (+
                      {setsDelta.pct.toFixed(0)}%)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black text-rose-400">
                      <TrendingDown className="w-3 h-3" />
                      {setsDelta.diff} sets ({setsDelta.pct.toFixed(0)}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Peak Weight KPI */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-gym-accent/30 transition-all">
                <div>
                  <span className="text-[9px] font-mono font-black text-white/40 uppercase tracking-widest block mb-1 truncate">
                    Peak Load ({detailsB.peakExercise})
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-mono font-black text-white tabular-nums">
                      {detailsB.peakWeight}{" "}
                      <span className="text-[10px] text-white/40 font-normal">kg</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/30 block mt-0.5 truncate">
                    vs {detailsA.peakWeight} kg ({detailsA.peakExercise})
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                  {peakDelta.diff >= 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black text-emerald-400">
                      <TrendingUp className="w-3 h-3" />+{peakDelta.diff} kg (+
                      {peakDelta.pct.toFixed(1)}%)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black text-rose-400">
                      <TrendingDown className="w-3 h-3" />
                      {peakDelta.diff} kg ({peakDelta.pct.toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Calories KPI */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-gym-accent/30 transition-all">
                <div>
                  <span className="text-[9px] font-mono font-black text-white/40 uppercase tracking-widest block mb-1">
                    Est. Energy Output
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-mono font-black text-white tabular-nums">
                      {detailsB.calories}{" "}
                      <span className="text-[10px] text-white/40 font-normal">kcal</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/30 block mt-0.5">
                    vs {detailsA.calories} kcal
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                  {calsDelta.diff >= 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black text-emerald-400">
                      <TrendingUp className="w-3 h-3" />+{calsDelta.diff} kcal
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black text-rose-400">
                      <TrendingDown className="w-3 h-3" />
                      {calsDelta.diff} kcal
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* TAB 1: MOVEMENT BREAKDOWN TABLE */}
            {activeTab === "breakdown" && (
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-gym-accent" />
                      Exercise-by-Exercise Head-To-Head
                    </h4>
                    <p className="text-[10px] text-white/40 font-mono">
                      Comparing top set weights, total volume, and overload status
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-white/50">
                    {allExerciseNames.length} Total Exercises
                  </span>
                </div>

                <div className="overflow-x-auto custom-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
                  <table className="w-full min-w-[560px] text-left font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[9px] font-black text-white/40 uppercase tracking-widest">
                        <th className="py-2.5 px-3 w-[32%]">Movement</th>
                        <th className="py-2.5 px-3 text-cyan-400 w-[23%] whitespace-nowrap">Baseline (A)</th>
                        <th className="py-2.5 px-3 text-gym-accent w-[23%] whitespace-nowrap">Target (B)</th>
                        <th className="py-2.5 px-3 text-right w-[22%] whitespace-nowrap">Progression Delta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {allExerciseNames.map((exName) => {
                        const exA = detailsA.exercisesMap.get(exName);
                        const exB = detailsB.exercisesMap.get(exName);
                        const mg = getExerciseMuscleGroup
                          ? getExerciseMuscleGroup(exName, findExerciseByName)
                          : null;

                        // Progression logic
                        let deltaContent = null;
                        if (exA && exB) {
                          const wDiff = Math.round((exB.maxWeight - exA.maxWeight) * 10) / 10;
                          const volDiff = Math.round((exB.totalVolume - exA.totalVolume) * 10) / 10;
                          const pct = exA.maxWeight > 0 ? (wDiff / exA.maxWeight) * 100 : 0;

                          if (wDiff > 0) {
                            deltaContent = (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black shadow-[0_0_8px_rgba(16,185,129,0.2)] whitespace-nowrap">
                                <TrendingUp className="w-3 h-3 shrink-0" />+{wDiff} kg (+{pct.toFixed(1)}%)
                              </span>
                            );
                          } else if (wDiff < 0) {
                            deltaContent = (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-black whitespace-nowrap">
                                <TrendingDown className="w-3 h-3 shrink-0" />
                                {wDiff} kg ({pct.toFixed(1)}%)
                              </span>
                            );
                          } else if (volDiff > 0) {
                            deltaContent = (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-[10px] font-black whitespace-nowrap">
                                <TrendingUp className="w-3 h-3 shrink-0" /> Vol +{volDiff} kg
                              </span>
                            );
                          } else {
                            deltaContent = (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold whitespace-nowrap">
                                <Minus className="w-3 h-3 shrink-0" /> Equal Load
                              </span>
                            );
                          }
                        } else if (!exA && exB) {
                          deltaContent = (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-black whitespace-nowrap">
                              ✨ New Movement
                            </span>
                          );
                        } else if (exA && !exB) {
                          deltaContent = (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/30 text-[10px] whitespace-nowrap">
                              Omitted in B
                            </span>
                          );
                        }

                        return (
                          <tr
                            key={exName}
                            className="hover:bg-white/[0.02] transition-colors"
                          >
                            {/* Movement Name */}
                            <td className="py-3 px-3">
                              <div className="font-bold text-white text-xs">{exName}</div>
                              {mg && (
                                <span className="text-[8px] uppercase tracking-widest font-black text-white/30 block mt-0.5">
                                  {mg}
                                </span>
                              )}
                            </td>

                            {/* Session A */}
                            <td className="py-3 px-3 text-white/80">
                              {exA ? (
                                <div>
                                  <div className="font-bold text-cyan-300 text-xs">
                                    {exA.bestSet.weight} kg × {exA.bestSet.reps} reps
                                  </div>
                                  <div className="text-[9px] text-white/40">
                                    {exA.sets.length} sets • {exA.totalVolume} kg
                                  </div>
                                </div>
                              ) : (
                                <span className="text-white/20 italic text-[10px]">-</span>
                              )}
                            </td>

                            {/* Session B */}
                            <td className="py-3 px-3 text-white/80">
                              {exB ? (
                                <div>
                                  <div className="font-bold text-gym-accent text-xs">
                                    {exB.bestSet.weight} kg × {exB.bestSet.reps} reps
                                  </div>
                                  <div className="text-[9px] text-white/40">
                                    {exB.sets.length} sets • {exB.totalVolume} kg
                                  </div>
                                </div>
                              ) : (
                                <span className="text-white/20 italic text-[10px]">-</span>
                              )}
                            </td>

                            {/* Delta */}
                            <td className="py-3 px-3 text-right">{deltaContent}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: VISUAL ANALYTICS CHARTS */}
            {activeTab === "charts" && (
              <div className="space-y-6">
                {/* Exercise Volume Comparison Chart */}
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-gym-accent" />
                        Volume per Exercise (KG)
                      </h4>
                      <p className="text-[10px] text-white/40 font-mono">
                        Side-by-side total tonnage moved per movement
                      </p>
                    </div>
                    {exerciseChartData.length > 4 && (
                      <span className="text-[9px] font-mono font-bold text-gym-accent/90 bg-gym-accent/10 border border-gym-accent/25 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        ↔ Scroll horizontally ({exerciseChartData.length} movements)
                      </span>
                    )}
                  </div>

                  <div className="overflow-x-auto custom-scrollbar pb-2 -mx-2 px-2 sm:mx-0 sm:px-0">
                    <div
                      style={{ minWidth: `${Math.max(520, exerciseChartData.length * 85)}px` }}
                      className="h-64 sm:h-72 w-full pt-4"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={exerciseChartData} margin={{ top: 10, right: 15, left: -10, bottom: 25 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                          <XAxis
                            dataKey="name"
                            stroke="#666"
                            tick={{ fill: "#aaa", fontSize: 10, fontWeight: "bold" }}
                            interval={0}
                            angle={-15}
                            textAnchor="end"
                          />
                          <YAxis stroke="#666" tick={{ fill: "#aaa", fontSize: 10 }} />
                          <Tooltip
                            labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                            contentStyle={{
                              backgroundColor: "#0d0d0d",
                              borderColor: "#333",
                              borderRadius: "8px",
                              fontSize: "12px",
                              color: "#fff",
                              fontWeight: "bold",
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                          <Bar dataKey="Baseline (A)" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Target (B)" fill="#ebff00" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Muscle Group Distribution Comparison */}
                {muscleGroupChartData.length > 0 && (
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <Target className="w-4 h-4 text-cyan-400" />
                          Muscle Group Volume Distribution
                        </h4>
                        <p className="text-[10px] text-white/40 font-mono">
                          Tonnage distribution across targeted muscle groups
                        </p>
                      </div>
                      {muscleGroupChartData.length > 5 && (
                        <span className="text-[9px] font-mono font-bold text-cyan-400/90 bg-cyan-400/10 border border-cyan-400/25 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                          ↔ Scroll horizontally
                        </span>
                      )}
                    </div>

                    <div className="overflow-x-auto custom-scrollbar pb-2 -mx-2 px-2 sm:mx-0 sm:px-0">
                      <div
                        style={{ minWidth: `${Math.max(480, muscleGroupChartData.length * 80)}px` }}
                        className="h-64 sm:h-72 w-full pt-4"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={muscleGroupChartData} margin={{ top: 10, right: 15, left: -10, bottom: 25 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                            <XAxis dataKey="group" stroke="#666" tick={{ fill: "#aaa", fontSize: 10, fontWeight: "bold" }} />
                            <YAxis stroke="#666" tick={{ fill: "#aaa", fontSize: 10 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#0d0d0d",
                                borderColor: "#333",
                                borderRadius: "8px",
                                fontSize: "12px",
                                color: "#fff",
                                fontWeight: "bold",
                              }}
                            />
                            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                            <Bar dataKey="Baseline (A)" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Target (B)" fill="#ebff00" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: TACTICAL COACH INSIGHTS */}
            {activeTab === "insights" && (
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 sm:p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">
                      AI Studio Tactical Synthesis
                    </h4>
                    <p className="text-[10px] text-white/40 font-mono">
                      Biomechanical progress analysis generated from your session logs
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                  {/* Volume Analysis */}
                  <div className="bg-black/60 border border-white/10 p-4 rounded-xl space-y-2">
                    <div className="text-[10px] font-black text-gym-accent uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5" />
                      Volume & Mechanical Work
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed">
                      {volumeDelta.diff > 0
                        ? `Target Session (B) achieved a +${volumeDelta.diff.toLocaleString()} kg (+${volumeDelta.pct.toFixed(1)}%) increase in total workload compared to Baseline (A). This indicates successful progressive overload.`
                        : volumeDelta.diff < 0
                        ? `Target Session (B) had a ${volumeDelta.diff.toLocaleString()} kg (${volumeDelta.pct.toFixed(1)}%) decrease in total workload. This may indicate a deload, higher intensity with lower volume, or fatigue.`
                        : `Both sessions recorded identical total volume tonnage.`}
                    </p>
                  </div>

                  {/* Overload Movements */}
                  <div className="bg-black/60 border border-white/10 p-4 rounded-xl space-y-2">
                    <div className="text-[10px] font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Overload Progression Count
                    </div>
                    {(() => {
                      let increasedCount = 0;
                      allExerciseNames.forEach((exName) => {
                        const exA = detailsA.exercisesMap.get(exName);
                        const exB = detailsB.exercisesMap.get(exName);
                        if (exA && exB && exB.maxWeight > exA.maxWeight) {
                          increasedCount++;
                        }
                      });
                      return (
                        <p className="text-xs text-white/80 leading-relaxed">
                          You achieved a direct weight increase on{" "}
                          <span className="text-emerald-400 font-bold">{increasedCount} exercise(s)</span>{" "}
                          performed in both sessions.
                        </p>
                      );
                    })()}
                  </div>

                  {/* Density Assessment */}
                  <div className="bg-black/60 border border-white/10 p-4 rounded-xl space-y-2">
                    <div className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5" />
                      Training Density (Vol / Set)
                    </div>
                    {(() => {
                      const densityA = detailsA.totalSets > 0 ? Math.round(detailsA.totalVolume / detailsA.totalSets) : 0;
                      const densityB = detailsB.totalSets > 0 ? Math.round(detailsB.totalVolume / detailsB.totalSets) : 0;
                      return (
                        <p className="text-xs text-white/80 leading-relaxed">
                          Average load per set went from{" "}
                          <span className="text-cyan-400 font-bold">{densityA} kg/set</span> in Baseline (A) to{" "}
                          <span className="text-gym-accent font-bold">{densityB} kg/set</span> in Target (B).
                        </p>
                      );
                    })()}
                  </div>

                  {/* Muscle Targeting */}
                  <div className="bg-black/60 border border-white/10 p-4 rounded-xl space-y-2">
                    <div className="text-[10px] font-black text-purple-400 uppercase tracking-wider flex items-center gap-2">
                      <Target className="w-3.5 h-3.5" />
                      Target Muscle Focus
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed">
                      Baseline Tags: <span className="text-cyan-400 font-bold">{detailsA.tags || "None"}</span>
                      <br />
                      Target Tags: <span className="text-gym-accent font-bold">{detailsB.tags || "None"}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-3 sm:p-5 border-t border-white/10 bg-black/80 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
            <div className="text-[10px] font-mono text-white/40 hidden sm:block">
              Comparing <span className="text-cyan-400 font-bold">{detailsA.dateStr}</span> vs{" "}
              <span className="text-gym-accent font-bold">{detailsB.dateStr}</span>
            </div>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gym-accent text-black hover:bg-white font-black uppercase tracking-[0.2em] text-[10px] cursor-pointer rounded-xl transition-all shadow-lg shadow-gym-accent/10 active:scale-95"
            >
              Close Comparison
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
