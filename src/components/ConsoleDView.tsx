import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  ArrowUp, 
  ChevronLeft, 
  ChevronRight, 
  Brain, 
  Zap, 
  Activity, 
  Calendar, 
  Flame, 
  Trophy, 
  Sparkles, 
  Scale, 
  Percent, 
  Maximize2, 
  TrendingUp, 
  Info,
  Timer
} from "lucide-react";
import AnatomyChart from "./AnatomyChart";
import RadarChart from "./RadarChart";

interface Contributor {
  exercise: string;
  setsCount: number;
  loadingPerSet: number;
  totalContribution: number;
}

interface CNSFatigueAnalysis {
  score: number;
  totalSpinalLoad: number;
  contributors: Contributor[];
  label: string;
  sublabel: string;
  recommendations: string;
  levelColor: string;
  barColor: string;
  hexColor: string;
}

interface ConsoleDViewProps {
  profile: any;
  syncedProfile: any;
  archivedWorkouts: any[];
  sessionSets: any[];
  cnsFatigueAnalysis: CNSFatigueAnalysis;
  chronologicalDaysConsole: any[];
  activeTheme: any;
  setActiveView: (view: any) => void;
}

export default function ConsoleDView({
  profile,
  syncedProfile,
  archivedWorkouts,
  sessionSets,
  cnsFatigueAnalysis,
  chronologicalDaysConsole,
  activeTheme,
  setActiveView,
}: ConsoleDViewProps) {
  // Theme color adaptation variables
  const accent = activeTheme?.accent || "#f97316";
  const accentRgb = activeTheme?.accentRgb || "249, 115, 22";
  const accentLight = activeTheme?.accentLight || "#fb923c";
  const accentDark = activeTheme?.accentDark || "#ea580c";

  // Hover state tracker for dynamic theming hover effects
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // 1. Month Navigation state (Carousel)
  const [calendarMonth, setCalendarMonth] = useState<number>(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState<number>(new Date().getFullYear());

  // 2. Chart Carousel state
  const [activeChartSlide, setActiveChartSlide] = useState<number>(0);
  const chartTypes = ["volume", "calories", "weight", "fat"];

  // Muscle Capacity Carousel state
  const [activeMatrixSlide, setActiveMatrixSlide] = useState<number>(0);
  const matrixGroups = ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core"];

  // 3. Muscle Recovery & Spinal Synergy overrides (Dynamically driven by logged workouts!)
  const [stretchedMuscles, setStretchedMuscles] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem("somatic_stretched_muscles");
      return stored ? JSON.parse(stored) : { Chest: 0, Back: 0, Legs: 0, Shoulders: 0, Arms: 0, Core: 0 };
    } catch {
      return { Chest: 0, Back: 0, Legs: 0, Shoulders: 0, Arms: 0, Core: 0 };
    }
  });

  const baselineRecovery = useMemo(() => {
    const defaultPercent: Record<string, number> = {
      Chest: 100,
      Back: 100,
      Legs: 100,
      Shoulders: 100,
      Arms: 100,
    };

    const getDaysDiff = (d1Str: string, d2Str: string) => {
      try {
        const date1 = new Date(d1Str.split('T')[0]);
        const date2 = new Date(d2Str.split('T')[0]);
        const diffTime = date1.getTime() - date2.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
      } catch (e) {
        return 999;
      }
    };

    const getMuscleGroupForExercise = (exerciseName: string): string => {
      const name = (exerciseName || "").toLowerCase();
      // Match legs first (to prevent "leg press" from matching chest)
      if (name.includes("leg press") || name.includes("squat") || name.includes("leg") || name.includes("calf") || name.includes("quad") || name.includes("glute") || name.includes("lunge") || name.includes("hamstring")) return "Legs";
      // Match shoulders next (to prevent "shoulder press" from matching chest)
      if (name.includes("shoulder press") || name.includes("overhead press") || name.includes("military press") || name.includes("shoulder") || name.includes("lateral") || name.includes("delt") || name.includes("raise")) return "Shoulders";
      // Match chest
      if (name.includes("chest") || name.includes("bench") || name.includes("press") || name.includes("fly") || name.includes("pushup") || name.includes("dip")) return "Chest";
      // Match back
      if (name.includes("back") || name.includes("row") || name.includes("pull") || name.includes("chin") || name.includes("lat") || name.includes("deadlift")) return "Back";
      // Match arms
      if (name.includes("bicep") || name.includes("tricep") || name.includes("curl") || name.includes("arm") || name.includes("forearm") || name.includes("wrist")) return "Arms";
      return "";
    };

    const todayStr = new Date().toISOString().split("T")[0];

    // Check today's active session sets
    sessionSets.forEach((set) => {
      const g = getMuscleGroupForExercise(set.exerciseName);
      if (g) {
        defaultPercent[g] = 25; // trained today -> very sore!
      }
    });

    // Check archived workouts within last 5 days
    archivedWorkouts.forEach((w) => {
      const wDate = w.date || todayStr;
      const diff = getDaysDiff(todayStr, wDate);
      if (diff >= 0 && diff <= 4) {
        const wSets = w.sets || [];
        wSets.forEach((set: any) => {
          const g = getMuscleGroupForExercise(set.exerciseName);
          if (g) {
            let val = 100;
            if (diff === 0) val = 25;
            else if (diff === 1) val = 45;
            else if (diff === 2) val = 65;
            else if (diff === 3) val = 85;

            if (val < defaultPercent[g]) {
              defaultPercent[g] = val;
            }
          }
        });
      }
    });

    return defaultPercent;
  }, [sessionSets, archivedWorkouts]);

  const muscleRecovery = useMemo(() => {
    const recovery: Record<string, { percent: number; advice: string }> = {};
    const muscleGroups = ["Chest", "Back", "Legs", "Shoulders", "Arms"];

    const advices: Record<string, Record<string, string>> = {
      Chest: {
        optimal: "Fully recovered. Ready for high intensity.",
        sore: "Trained recently. Focus on upper chest stretches.",
        severe: "Highly fatigued. Prioritize active rest."
      },
      Back: {
        optimal: "Fully recovered. Ready for heavy work.",
        sore: "Slight back tension. Recommend lat stretches.",
        severe: "Extremely sore. Avoid spinal strain."
      },
      Legs: {
        optimal: "Legs ready for intense training.",
        sore: "Moderate quad/glute stiffness. Stretch.",
        severe: "Heavy fatigue. Prioritize deep hamstring relief."
      },
      Shoulders: {
        optimal: "Shoulders ready for overhead lifts.",
        sore: "Front delts tight. Gentle stretching recommended.",
        severe: "Highly fatigued. Rest shoulder girdle."
      },
      Arms: {
        optimal: "Arm glycogen pools fully charged.",
        sore: "Bicep/tricep tight. Recommended: Light foam rolling.",
        severe: "Highly sore. Focus on grip and forearm release."
      }
    };

    muscleGroups.forEach((m) => {
      const base = baselineRecovery[m];
      const stretchBonus = stretchedMuscles[m] || 0;
      const finalPercent = Math.min(100, base + stretchBonus);

      let advice = advices[m].optimal;
      if (finalPercent < 60) advice = advices[m].severe;
      else if (finalPercent < 90) advice = advices[m].sore;

      recovery[m] = {
        percent: finalPercent,
        advice
      };
    });

    return recovery;
  }, [baselineRecovery, stretchedMuscles]);

  const [localSpinalUnitsDelta, setLocalSpinalUnitsDelta] = useState<number>(0);

  // Compute synergy values based on interactive decompression
  const synergeticSpinalLoadUnits = useMemo(() => {
    return Math.max(0, parseFloat((cnsFatigueAnalysis.totalSpinalLoad - localSpinalUnitsDelta).toFixed(1)));
  }, [cnsFatigueAnalysis.totalSpinalLoad, localSpinalUnitsDelta]);

  const synergeticSpinalScore = useMemo(() => {
    return Math.min(100, Math.round((synergeticSpinalLoadUnits / 30) * 100));
  }, [synergeticSpinalLoadUnits]);

  // Compute dynamic color & text descriptions for synergetic score
  const synergeticCNSInfo = useMemo(() => {
    let label = 'FULLY RECOVERED';
    let sublabel = 'Your body and nervous system are fully recovered and ready for training.';
    let levelColor = 'text-green-400 bg-green-500/10 border-green-500/20';
    let barColor = 'bg-green-500';
    let hexColor = '#22c55e';

    if (synergeticSpinalScore > 85) {
      label = 'NERVOUS SYSTEM OVERLOAD';
      sublabel = 'High system fatigue detected. Consider a light session or stretching.';
      levelColor = 'text-red-400 bg-red-950/40 border-red-500/20';
      barColor = 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]';
      hexColor = '#ef4444';
    } else if (synergeticSpinalScore > 55) {
      label = 'NERVOUS SYSTEM TIRED';
      sublabel = 'Moderate system fatigue. Ensure good form and avoid lifting to failure.';
      levelColor = 'text-amber-500 bg-amber-950/40 border-amber-500/20';
      barColor = 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]';
      hexColor = '#f59e0b';
    } else if (synergeticSpinalScore > 25) {
      label = 'MILD SYSTEM FATIGUE';
      sublabel = 'Slight tension detected. Standard recovery levels apply.';
      levelColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      barColor = 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
      hexColor = '#10b981';
    }

    return { label, sublabel, levelColor, barColor, hexColor };
  }, [synergeticSpinalScore]);

  const performActiveRecovery = (muscle: string) => {
    setStretchedMuscles((prev) => {
      const updated = {
        ...prev,
        [muscle]: Math.min(75, (prev[muscle] || 0) + 15) // max stretch recovery bonus of 75%
      };
      localStorage.setItem("somatic_stretched_muscles", JSON.stringify(updated));
      return updated;
    });
    // Relieve spinal load units when muscles are stretched (active decompression)
    setLocalSpinalUnitsDelta((prev) => Math.min(15, prev + 1.5));
  };

  const resetSynergyDecompression = () => {
    setLocalSpinalUnitsDelta(0);
    setStretchedMuscles({ Chest: 0, Back: 0, Legs: 0, Shoulders: 0, Arms: 0 });
    localStorage.removeItem("somatic_stretched_muscles");
  };

  // 4. Weight and Fat local histories & inputs
  const currentProfileWeight = profile?.weight ?? 80;
  const currentProfileBodyFat = profile?.bodyFat ?? 14.5;

  const [weightHistory, setWeightHistory] = useState<{ date: string; value: number }[]>(() => {
    try {
      const stored = localStorage.getItem("somatic_weight_history");
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      { date: "06/05", value: currentProfileWeight + 1.5 },
      { date: "06/10", value: currentProfileWeight + 1.1 },
      { date: "06/15", value: currentProfileWeight + 0.6 },
      { date: "06/20", value: currentProfileWeight + 0.2 },
      { date: "06/25", value: currentProfileWeight - 0.1 },
      { date: "07/01", value: currentProfileWeight }
    ];
  });

  const [fatHistory, setFatHistory] = useState<{ date: string; value: number }[]>(() => {
    try {
      const stored = localStorage.getItem("somatic_fat_history");
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      { date: "06/05", value: currentProfileBodyFat + 0.6 },
      { date: "06/10", value: currentProfileBodyFat + 0.4 },
      { date: "06/15", value: currentProfileBodyFat + 0.3 },
      { date: "06/20", value: currentProfileBodyFat + 0.1 },
      { date: "06/25", value: currentProfileBodyFat },
      { date: "07/01", value: currentProfileBodyFat }
    ];
  });

  const [inputWeight, setInputWeight] = useState<string>("");
  const [inputFat, setInputFat] = useState<string>("");

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputWeight);
    if (isNaN(val) || val <= 0) return;
    const dateStr = new Date().toLocaleDateString("default", { month: "2-digit", day: "2-digit" });
    const updated = [...weightHistory, { date: dateStr, value: val }].slice(-10);
    setWeightHistory(updated);
    localStorage.setItem("somatic_weight_history", JSON.stringify(updated));
    setInputWeight("");
  };

  const handleAddFat = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputFat);
    if (isNaN(val) || val <= 0 || val >= 100) return;
    const dateStr = new Date().toLocaleDateString("default", { month: "2-digit", day: "2-digit" });
    const updated = [...fatHistory, { date: dateStr, value: val }].slice(-10);
    setFatHistory(updated);
    localStorage.setItem("somatic_fat_history", JSON.stringify(updated));
    setInputFat("");
  };

  // 5. Reflex Tester state
  const [reflexState, setReflexState] = useState<"idle" | "preparing" | "waiting" | "active" | "result" | "early">("idle");
  const [reflexTime, setReflexTime] = useState<number | null>(null);
  const [reflexHistory, setReflexHistory] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem("somatic_reflex_history");
      return stored ? JSON.parse(stored) : [218, 245, 189];
    } catch {
      return [218, 245, 189];
    }
  });

  const reflexTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reflexStartRef = useRef<number>(0);

  const bestReflex = useMemo(() => {
    if (reflexHistory.length === 0) return null;
    return Math.min(...reflexHistory);
  }, [reflexHistory]);

  const startReflexTest = () => {
    if (reflexTimerRef.current) clearTimeout(reflexTimerRef.current);
    setReflexState("waiting");
    setReflexTime(null);

    const randomDelay = 1500 + Math.random() * 3000; // 1.5s to 4.5s
    reflexTimerRef.current = setTimeout(() => {
      setReflexState("active");
      reflexStartRef.current = performance.now();
    }, randomDelay);
  };

  const triggerReflexClick = () => {
    if (reflexState === "waiting") {
      // Early click (Misfire)
      if (reflexTimerRef.current) clearTimeout(reflexTimerRef.current);
      setReflexState("early");
    } else if (reflexState === "active") {
      // Valid reflex click
      const end = performance.now();
      const delay = Math.round(end - reflexStartRef.current);
      setReflexTime(delay);
      setReflexState("result");
      const updated = [delay, ...reflexHistory].slice(0, 10);
      setReflexHistory(updated);
      localStorage.setItem("somatic_reflex_history", JSON.stringify(updated));
    }
  };

  useEffect(() => {
    return () => {
      if (reflexTimerRef.current) clearTimeout(reflexTimerRef.current);
    };
  }, []);

  const getReflexRating = (time: number) => {
    if (time < 160) return { label: "EXCELLENT // ELITE SPEED", color: "text-emerald-400" };
    if (time < 200) return { label: "FAST // HIGH RECOVERY", color: "text-green-400" };
    if (time < 250) return { label: "GOOD // DECENT RECOVERY", color: "text-amber-400" };
    if (time < 350) return { label: "AVERAGE // MILD FATIGUE", color: "text-white/60" };
    return { label: "SLOW // NERVOUS SYSTEM FATIGUE", color: "text-rose-500 animate-pulse" };
  };

  // 6. Neural Recruitment loading level computations
  const recruitment = useMemo(() => {
    const scores: Record<string, number> = {
      Chest: 25,
      Back: 20,
      Legs: 30,
      Shoulders: 25,
      Core: 40,
      Arms: 20,
    };
    sessionSets.forEach(set => {
      const exName = (set.exerciseName || "").toLowerCase();
      if (exName.includes("leg press") || exName.includes("squat") || exName.includes("leg") || exName.includes("calf") || exName.includes("quad") || exName.includes("glute") || exName.includes("lunge") || exName.includes("hamstring")) {
        scores.Legs += 15;
      } else if (exName.includes("shoulder press") || exName.includes("overhead press") || exName.includes("military press") || exName.includes("shoulder") || exName.includes("lateral") || exName.includes("delt") || exName.includes("raise")) {
        scores.Shoulders += 15;
      } else if (exName.includes("chest") || exName.includes("bench") || exName.includes("press") || exName.includes("fly") || exName.includes("pushup") || exName.includes("dip")) {
        scores.Chest += 15;
      } else if (exName.includes("back") || exName.includes("row") || exName.includes("pull") || exName.includes("chin") || exName.includes("lat") || exName.includes("deadlift")) {
        scores.Back += 15;
      } else if (exName.includes("abs") || exName.includes("crunch") || exName.includes("plank") || exName.includes("core") || exName.includes("situp")) {
        scores.Core += 15;
      } else if (exName.includes("bicep") || exName.includes("tricep") || exName.includes("curl") || exName.includes("arm") || exName.includes("forearm") || exName.includes("wrist")) {
        scores.Arms += 15;
      } else {
        scores.Arms += 10;
      }
    });
    Object.keys(scores).forEach(k => {
      scores[k] = Math.min(100, scores[k]);
    });
    return scores;
  }, [sessionSets]);

  // 7. Monthly Days density calculations based on archivedWorkouts
  const daysInMonth = useMemo(() => {
    return new Date(calendarYear, calendarMonth + 1, 0).getDate();
  }, [calendarMonth, calendarYear]);

  const monthName = useMemo(() => {
    return new Date(calendarYear, calendarMonth, 1).toLocaleString("default", { month: "long" });
  }, [calendarMonth, calendarYear]);

  const workoutDaysInSelectedMonth = useMemo(() => {
    const set = new Set<number>();
    archivedWorkouts.forEach((w) => {
      if (!w.date) return;
      const d = new Date(w.date + "T00:00:00");
      if (d.getFullYear() === calendarYear && d.getMonth() === calendarMonth) {
        set.add(d.getDate());
      }
    });
    return set;
  }, [archivedWorkouts, calendarMonth, calendarYear]);

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (calendarMonth === 0) {
        setCalendarMonth(11);
        setCalendarYear(prev => prev - 1);
      } else {
        setCalendarMonth(prev => prev - 1);
      }
    } else {
      if (calendarMonth === 11) {
        setCalendarMonth(0);
        setCalendarYear(prev => prev + 1);
      } else {
        setCalendarMonth(prev => prev + 1);
      }
    }
  };

  // 8. Recharts data preparation for the chart slides
  const loadProgressionData = useMemo(() => {
    return chronologicalDaysConsole.map(day => ({
      date: day.date.slice(5), // Keep MM-DD format
      volume: day.calories * 8, // Estimate volume based on calories or standard mapping
      calories: day.calories
    }));
  }, [chronologicalDaysConsole]);

  const activeSlideChartComponent = () => {
    switch (chartTypes[activeChartSlide]) {
      case "volume":
        return (
          <div className="h-full w-full flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono px-1">
              <span className="text-white/40">CALCULATED WORKLOAD PROGRESSION</span>
              <span className="text-emerald-400 font-bold">Lifting Volume (kg)</span>
            </div>
            <div className="h-[180px] w-full mt-2">
              {loadProgressionData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center bg-white/[0.01] rounded-xl border border-dashed border-white/[0.05]">
                  <TrendingUp className="w-5 h-5 text-white/10 mb-2" />
                  <span className="text-[10px] text-white/30 font-mono">No workload progression logged.</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={loadProgressionData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorVolumeD" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                    <XAxis dataKey="date" stroke="#ffffff10" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
                    <YAxis stroke="#ffffff10" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0b0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }}
                      labelStyle={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", fontFamily: "monospace" }}
                      itemStyle={{ fontSize: "11px", color: "#22c55e" }}
                    />
                    <Area
                      type="monotone"
                      name="Volume (kg)"
                      dataKey="volume"
                      stroke="#22c55e"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorVolumeD)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        );
      case "calories":
        return (
          <div className="h-full w-full flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono px-1">
              <span className="text-white/40">THERMODYNAMIC KINETIC SPLIT</span>
              <span className="text-emerald-400 font-bold">Energy Output (kcal)</span>
            </div>
            <div className="h-[180px] w-full mt-2">
              {loadProgressionData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center bg-white/[0.01] rounded-xl border border-dashed border-white/[0.05]">
                  <Flame className="w-5 h-5 text-white/10 mb-2 animate-pulse" />
                  <span className="text-[10px] text-white/30 font-mono">No kinetic energy outputs mapped.</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={loadProgressionData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorCaloriesD" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                    <XAxis dataKey="date" stroke="#ffffff10" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
                    <YAxis stroke="#ffffff10" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0b0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }}
                      labelStyle={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", fontFamily: "monospace" }}
                      itemStyle={{ fontSize: "11px", color: "#22c55e" }}
                    />
                    <Area
                      type="monotone"
                      name="Calories (kcal)"
                      dataKey="calories"
                      stroke="#22c55e"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorCaloriesD)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        );
      case "weight":
        return (
          <div className="h-full w-full flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono px-1">
              <span className="text-white/40">PHYSICAL WEIGHT TIMELINE (PAST 10)</span>
              <span className="text-emerald-400 font-bold">Body Weight (kg)</span>
            </div>
            <div className="h-[180px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightHistory} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff10" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#ffffff10" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0b0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }}
                    labelStyle={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", fontFamily: "monospace" }}
                    itemStyle={{ fontSize: "11px", color: "#22c55e" }}
                  />
                  <Line
                    type="monotone"
                    name="Weight"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={2.5}
                    dot={{ r: 4, stroke: '#1c1917', strokeWidth: 1.5, fill: '#22c55e' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case "fat":
        return (
          <div className="h-full w-full flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono px-1">
              <span className="text-white/40">ADIPOSE TRACKING TIMELINE</span>
              <span className="text-emerald-400 font-bold">Body Fat (%)</span>
            </div>
            <div className="h-[180px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fatHistory} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff10" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
                  <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} stroke="#ffffff10" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0b0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }}
                    labelStyle={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", fontFamily: "monospace" }}
                    itemStyle={{ fontSize: "11px", color: "#22c55e" }}
                  />
                  <Line
                    type="monotone"
                    name="Body Fat %"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={2.5}
                    dot={{ r: 4, stroke: '#1c1917', strokeWidth: 1.5, fill: '#22c55e' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      key="console-d-view"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="space-y-6 pb-12 text-left"
    >
      {/* Standard Header View */}
      <div className="mb-6 pb-6 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-light italic font-serif">
            Console
          </h3>
          <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
            Monitor metrics, recovery, and performance
          </p>
        </div>
      </div>

      {/* SECTION 2: PHYSICAL RECRUITMENT MAPPING & TORQUE MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Physical Recruitment Mapping */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div 
            onMouseEnter={() => setHoveredCard("engagement")}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ 
              borderColor: hoveredCard === "engagement" ? `rgba(${accentRgb}, 0.2)` : "rgba(255, 255, 255, 0.04)"
            }}
            className="bg-gradient-to-b from-[#090909] to-[#040404] border rounded-xl p-5 flex flex-col justify-between relative overflow-visible group transition-all duration-300 h-full"
          >
            <div 
              style={{ background: `linear-gradient(to right, transparent, rgba(${accentRgb}, 0.2), transparent)` }}
              className="absolute top-0 left-0 w-full h-[1px]" 
            />
            
            <div className="space-y-1 mb-4">
              <span style={{ color: accent }} className="text-[9px] font-mono uppercase tracking-widest font-black">
                Muscle Engagement
              </span>
              <h3 className="text-xl font-light text-white font-sans">
                Muscle Use & <span style={{ color: accent }} className="font-serif italic">Engagement</span>
              </h3>
              <p className="text-[11px] text-white/40 leading-relaxed">
                Real-time look at which muscles are active in your current session.
              </p>
            </div>

            {/* Twin Graphics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center py-4 flex-1 overflow-visible">
              <div 
                className="flex items-center justify-center cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-black/40 border border-white/[0.02] rounded-xl p-3"
                onClick={() => setActiveView("anatomy")}
                title="Click to view detailed diagnostics"
              >
                <AnatomyChart
                  sets={sessionSets}
                  archivedWorkouts={archivedWorkouts}
                  compact={true}
                />
              </div>
              <div className="flex items-center justify-center bg-black/40 border border-white/[0.02] rounded-xl p-3 overflow-visible relative">
                <RadarChart
                  sessionSets={sessionSets}
                  archivedWorkouts={archivedWorkouts}
                  size={240}
                  plain={true}
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.03] flex items-center justify-between text-[10px] text-white/30 font-mono">
              <span>ACTIVE ENGAGEMENT</span>
              <button 
                onClick={() => setActiveView("anatomy")}
                style={{ color: accent }}
                className="hover:text-white transition-colors uppercase tracking-wider font-bold"
              >
                DETAILED MUSCLE CHART &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Right: Muscle Group Capacity Carousel (replaces Somatic Torque Matrix) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div 
            onMouseEnter={() => setHoveredCard("capacity")}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ 
              borderColor: hoveredCard === "capacity" ? `rgba(${accentRgb}, 0.2)` : "rgba(255, 255, 255, 0.04)"
            }}
            className="bg-gradient-to-b from-[#090909] to-[#040404] border rounded-xl p-5 md:p-6 flex flex-col justify-between transition-all duration-300 h-full relative overflow-hidden"
          >
            <div 
              style={{ background: `linear-gradient(to right, transparent, rgba(${accentRgb}, 0.2), transparent)` }}
              className="absolute top-0 left-0 w-full h-[1px]" 
            />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <div className="space-y-0.5">
                <span style={{ color: accent }} className="text-[9px] font-mono uppercase tracking-widest font-black">
                  Muscle Load Breakdown
                </span>
                <h3 className="text-base font-semibold text-white">
                  Muscle Group <span style={{ color: accent }} className="font-serif italic">Capacity</span>
                </h3>
              </div>
              {/* Navigation buttons */}
              <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded p-0.5 shrink-0">
                <button
                  onClick={() => setActiveMatrixSlide(prev => (prev === 0 ? matrixGroups.length - 1 : prev - 1))}
                  className="p-1 text-white/50 hover:text-white hover:bg-white/5 rounded transition-all cursor-pointer"
                  title="Previous Muscle"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[9px] font-mono font-bold text-white/80 uppercase px-1.5 min-w-[54px] text-center">
                  {matrixGroups[activeMatrixSlide]}
                </span>
                <button
                  onClick={() => setActiveMatrixSlide(prev => (prev === matrixGroups.length - 1 ? 0 : prev + 1))}
                  className="p-1 text-white/50 hover:text-white hover:bg-white/5 rounded transition-all cursor-pointer"
                  title="Next Muscle"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {(() => {
              const currentGroup = matrixGroups[activeMatrixSlide];
              const parentScore = recruitment[currentGroup] ?? 50;
              
              // Define sub-muscles for current group
              let subMuscles: { name: string; pct: number }[] = [];
              if (currentGroup === "Chest") {
                subMuscles = [
                  { name: "Upper Chest", pct: Math.min(100, Math.round(parentScore * 1.05)) },
                  { name: "Mid Chest", pct: Math.min(100, Math.round(parentScore * 0.95)) },
                  { name: "Lower Chest", pct: Math.min(100, Math.round(parentScore * 0.90)) },
                ];
              } else if (currentGroup === "Back") {
                subMuscles = [
                  { name: "Latissimus Dorsi (Lats)", pct: Math.min(100, Math.round(parentScore * 1.05)) },
                  { name: "Rhomboids & Mid-Back", pct: Math.min(100, Math.round(parentScore * 0.95)) },
                  { name: "Trapezius (Traps)", pct: Math.min(100, Math.round(parentScore * 1.00)) },
                  { name: "Lower Back", pct: Math.min(100, Math.round(parentScore * 0.85)) },
                ];
              } else if (currentGroup === "Shoulders") {
                subMuscles = [
                  { name: "Front Deltoids", pct: Math.min(100, Math.round(parentScore * 1.05)) },
                  { name: "Side Deltoids", pct: Math.min(100, Math.round(parentScore * 1.00)) },
                  { name: "Rear Deltoids", pct: Math.min(100, Math.round(parentScore * 0.90)) },
                ];
              } else if (currentGroup === "Arms") {
                subMuscles = [
                  { name: "Biceps", pct: Math.min(100, Math.round(parentScore * 1.02)) },
                  { name: "Triceps", pct: Math.min(100, Math.round(parentScore * 0.98)) },
                  { name: "Forearms", pct: Math.min(100, Math.round(parentScore * 0.85)) },
                ];
              } else if (currentGroup === "Legs") {
                subMuscles = [
                  { name: "Quadriceps", pct: Math.min(100, Math.round(parentScore * 1.05)) },
                  { name: "Hamstrings", pct: Math.min(100, Math.round(parentScore * 0.95)) },
                  { name: "Gluteals", pct: Math.min(100, Math.round(parentScore * 1.00)) },
                  { name: "Calves", pct: Math.min(100, Math.round(parentScore * 0.80)) },
                ];
              } else if (currentGroup === "Core") {
                subMuscles = [
                  { name: "Rectus Abdominis (Abs)", pct: Math.min(100, Math.round(parentScore * 1.05)) },
                  { name: "Obliques", pct: Math.min(100, Math.round(parentScore * 0.95)) },
                  { name: "Transverse Abdominis", pct: Math.min(100, Math.round(parentScore * 0.90)) },
                  { name: "Deep Core Stabilizers", pct: Math.min(100, Math.round(parentScore * 1.00)) },
                ];
              }

              return (
                <div className="flex-1 flex flex-col justify-between pt-1 h-full min-h-[300px]">
                  {/* Parent Overall Score Badge */}
                  <div className="bg-white/[0.01] border border-white/5 rounded-lg p-3 flex items-center justify-between mb-2">
                    <span className="text-[11px] text-white/50 font-mono">Overall {currentGroup} Capacity</span>
                    <span style={{ color: accent }} className="text-sm font-mono font-black">{parentScore}%</span>
                  </div>

                  <div className="flex-1 flex flex-col justify-around py-4 space-y-4">
                    {subMuscles.map((sub) => (
                      <div key={sub.name} className="space-y-2">
                        <div className="flex justify-between items-center text-xs md:text-sm font-mono">
                          <span className="text-white/80 font-medium">{sub.name}</span>
                          <span style={{ color: sub.pct > 75 ? accent : "rgba(255, 255, 255, 0.4)" }} className={sub.pct > 75 ? "font-bold" : ""}>
                            {sub.pct}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-white/[0.02] border border-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${sub.pct}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            style={{ background: `linear-gradient(to right, ${accentDark}, ${accent})` }}
                            className="h-full rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="mt-4 pt-3 border-t border-white/[0.03] text-[9px] text-white/30 font-mono flex items-center justify-between">
              {/* Dot Indicators */}
              <div className="flex items-center gap-1">
                {matrixGroups.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMatrixSlide(idx)}
                    style={{ backgroundColor: idx === activeMatrixSlide ? accent : "rgba(255, 255, 255, 0.2)" }}
                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${idx === activeMatrixSlide ? "w-3" : ""}`}
                  />
                ))}
              </div>
              <span style={{ color: accent }} className="font-bold uppercase opacity-80">Dynamic Sub-Mapping</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: UNIFIED RECOVERY & MUSCULAR RECOVERY GAUGE */}
      <div 
        onMouseEnter={() => setHoveredCard("recovery")}
        onMouseLeave={() => setHoveredCard(null)}
        style={{ 
          borderColor: hoveredCard === "recovery" ? `rgba(${accentRgb}, 0.15)` : "rgba(255, 255, 255, 0.04)"
        }}
        className="bg-gradient-to-b from-[#080808] to-[#040404] border rounded-2xl p-5 md:p-6 transition-all duration-300 relative overflow-hidden"
      >
        <div 
          style={{ background: `linear-gradient(to right, transparent, rgba(${accentRgb}, 0.15), transparent)` }}
          className="absolute top-0 left-0 w-full h-[1px]" 
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="space-y-1">
            <span style={{ color: accent }} className="text-[9px] font-mono uppercase tracking-widest font-black block">
              Spine & Joint Stress Reliever
            </span>
            <h3 className="text-xl font-light text-white font-sans">
              Nervous System & <span style={{ color: accent }} className="font-serif italic">Spine Load</span>
            </h3>
            <p className="text-xs text-white/40 leading-relaxed max-w-2xl">
              Recent heavy workouts can compress your spine and stress your joints. Rest and stretching help keep your nervous system healthy.
            </p>
          </div>
          {localSpinalUnitsDelta > 0 && (
            <button
              onClick={resetSynergyDecompression}
              onMouseEnter={() => setHoveredCard("reset-stress-btn")}
              onMouseLeave={() => setHoveredCard("recovery")}
              style={{
                borderColor: hoveredCard === "reset-stress-btn" ? `rgba(${accentRgb}, 0.4)` : "rgba(255, 255, 255, 0.1)",
                color: hoveredCard === "reset-stress-btn" ? accent : "rgba(255, 255, 255, 0.5)"
              }}
              className="px-2.5 py-1.5 border rounded text-[9px] font-mono font-bold uppercase transition-all cursor-pointer"
            >
              Reset Stress Level
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Semicircular Spinal Depletion Gauge */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-black/30 border border-white/[0.02] rounded-2xl relative">
            <div className="absolute top-3 left-3 flex items-center gap-1 font-mono text-[8px] text-white/20">
              <Brain style={{ color: accent }} className="w-3 h-3" />
              SPINAL COMPRESSION LEVEL
            </div>
            <div className="relative w-full max-w-[210px] flex flex-col items-center justify-center pt-6">
              <svg className="w-full h-full" viewBox="0 0 200 120" id="spinal-depletion-radial-gauge">
                <defs>
                  <filter id="spinal-gauge-glow-d" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <radialGradient id="spinal-interior-glow-d" cx="50%" cy="100%" r="65%">
                    <stop offset="0%" stopColor={synergeticCNSInfo.hexColor} stopOpacity="0.15" />
                    <stop offset="100%" stopColor={synergeticCNSInfo.hexColor} stopOpacity="0" />
                  </radialGradient>
                </defs>

                <path d="M 30 100 A 70 70 0 0 1 170 100 Z" fill="url(#spinal-interior-glow-d)" />
                <path
                  d="M 30 100 A 70 70 0 0 1 170 100"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.04)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                <motion.path
                  d="M 30 100 A 70 70 0 0 1 170 100"
                  fill="none"
                  strokeWidth="8.5"
                  strokeLinecap="round"
                  filter="url(#spinal-gauge-glow-d)"
                  initial={{ pathLength: 0 }}
                  animate={{ 
                    pathLength: synergeticSpinalScore / 100,
                    stroke: synergeticCNSInfo.hexColor
                  }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />

                {[0.25, 0.55, 0.85].map((pct, idx) => {
                  const angle = Math.PI - pct * Math.PI;
                  const r1 = 64;
                  const r2 = 76;
                  const x1 = 100 + r1 * Math.cos(angle);
                  const y1 = 100 - r1 * Math.sin(angle);
                  const x2 = 100 + r2 * Math.cos(angle);
                  const y2 = 100 - r2 * Math.sin(angle);
                  return (
                    <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  );
                })}
              </svg>

              {/* Indicator Values Overlay */}
              <div className="absolute bottom-2 text-center">
                <span className="text-[28px] font-black font-mono text-white leading-none">
                  {synergeticSpinalScore}
                  <span className="text-[12px] text-white/40 font-normal">%</span>
                </span>
                <span className="text-[8px] font-mono text-white/30 block tracking-widest uppercase mt-0.5">
                  Stress Index
                </span>
              </div>
            </div>

            <div className="text-center mt-3 space-y-1 font-mono">
              <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase inline-block border ${synergeticCNSInfo.levelColor}`}>
                {synergeticCNSInfo.label}
              </span>
              <p className="text-[10px] text-white/50 leading-snug px-3">
                {synergeticSpinalLoadUnits.toFixed(1)} Joint Stress Units • {synergeticCNSInfo.sublabel}
              </p>
            </div>
          </div>

          {/* Muscle Recovery Gauges */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block font-bold">
              MUSCLE RECOVERY STATUS
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {(Object.entries(muscleRecovery) as [string, { percent: number; advice: string }][]).map(([muscle, data]) => {
                const isOptimal = data.percent >= 80;
                const isSevere = data.percent < 60;
                return (
                  <div 
                    key={muscle} 
                    className="bg-[#0b0b0b] border border-white/5 rounded-xl p-3 flex flex-col justify-between text-left hover:border-orange-500/20 transition-all duration-300"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] text-white/80 font-bold block">{muscle}</span>
                      <span className={`text-base font-black font-mono ${isOptimal ? "text-emerald-400" : isSevere ? "text-red-400" : "text-amber-400"}`}>
                        {data.percent}%
                      </span>
                      <p className="text-[8px] text-white/30 leading-normal min-h-[36px]">
                        {data.advice}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/[0.03] flex items-center justify-between gap-1.5">
                      <span className="text-[7px] font-mono text-white/30 uppercase">
                        Status
                      </span>
                      <span className={`text-[8px] font-mono font-extrabold uppercase tracking-wider ${isOptimal ? "text-emerald-400" : isSevere ? "text-red-400" : "text-amber-400"}`}>
                        {isOptimal ? "OPTIMAL" : isSevere ? "FATIGUED" : "RECOVERING"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {localSpinalUnitsDelta > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 text-[10px] font-mono text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  STRETCH ACTIVE: Your stretching drills have helped your recovery, subtracting 
                  <span className="font-bold"> -{localSpinalUnitsDelta.toFixed(1)} Joint Stress Units</span> and improving muscle recovery.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 4: CAROUSELS SECTION (MONTHLY CALENDAR CAROUSEL & PERFORMANCE CHART CAROUSEL) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* CAROUSEL 1: MONTHLY TRAINING DENSITY CALENDAR CAROUSEL */}
        <div className="bg-[#090909] border border-white/[0.03] rounded-2xl p-5 md:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <div>
              <h4 className="text-base font-semibold text-white leading-snug">
                Monthly Training Density
              </h4>
              <p className="text-[10px] text-white/40 font-mono mt-0.5 uppercase">
                {monthName} {calendarYear} • Workout Frequency Map
              </p>
            </div>
            {/* Navigation Carousel Buttons */}
            <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 rounded-md p-1">
              <button 
                onClick={() => navigateMonth("prev")}
                className="p-1 text-white/50 hover:text-white hover:bg-white/5 rounded transition-all cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[9px] font-mono font-bold text-white/80 uppercase px-2">
                {monthName.slice(0, 3)} {calendarYear}
              </span>
              <button 
                onClick={() => navigateMonth("next")}
                className="p-1 text-white/50 hover:text-white hover:bg-white/5 rounded transition-all cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-10 gap-2 flex-1">
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const hasWorkout = workoutDaysInSelectedMonth.has(dayNum);
              return (
                <div
                  key={idx}
                  style={hasWorkout ? {
                    background: `linear-gradient(to bottom right, ${accentDark}, ${accent})`,
                    borderColor: accentLight,
                    boxShadow: `0 0 10px rgba(${accentRgb}, 0.3)`
                  } : {}}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center font-mono relative transition-all duration-300 border ${
                    hasWorkout
                      ? "text-black font-extrabold hover:scale-105"
                      : "bg-white/[0.01] border-white/5 text-white/30 hover:bg-white/5"
                  }`}
                  title={`${monthName} ${dayNum}: ${hasWorkout ? "Workout Active" : "Rest Day"}`}
                >
                  <span className="text-[10px]">{dayNum}</span>
                  {hasWorkout && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-black/60" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[9px] font-mono text-white/30 mt-4 pt-3 border-t border-white/[0.03]">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-white/[0.01] border border-white/5" />
              <span>Rest Day</span>
            </div>
            <div className="flex items-center gap-1">
              <div style={{ backgroundColor: accent }} className="w-2 h-2 rounded" />
              <span>Workout Active</span>
            </div>
            <div style={{ color: accent }} className="ml-auto opacity-80 font-bold">
              {workoutDaysInSelectedMonth.size} lift sessions logged
            </div>
          </div>
        </div>

        {/* CAROUSEL 2: METRIC PROGRESSION CHART CAROUSEL */}
        <div className="bg-[#090909] border border-white/[0.03] rounded-2xl p-5 md:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <div>
              <h4 className="text-base font-semibold text-white leading-snug">
                Somatic Performance Carousel
              </h4>
              <p className="text-[10px] text-white/40 font-mono mt-0.5 uppercase">
                Active Slide: {chartTypes[activeChartSlide].toUpperCase()} progressions
              </p>
            </div>
            {/* Slide Navigation Buttons */}
            <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-md p-1">
              <button 
                onClick={() => setActiveChartSlide(prev => (prev === 0 ? chartTypes.length - 1 : prev - 1))}
                className="p-1 text-white/50 hover:text-white hover:bg-white/5 rounded transition-all cursor-pointer"
                title="Previous Metric"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1 px-1">
                {chartTypes.map((_, idx) => (
                  <div 
                    key={idx} 
                    style={{ backgroundColor: idx === activeChartSlide ? accent : "rgba(255, 255, 255, 0.2)" }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === activeChartSlide ? "w-2.5" : ""}`}
                  />
                ))}
              </div>
              <button 
                onClick={() => setActiveChartSlide(prev => (prev === chartTypes.length - 1 ? 0 : prev + 1))}
                className="p-1 text-white/50 hover:text-white hover:bg-white/5 rounded transition-all cursor-pointer"
                title="Next Metric"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-[200px] flex flex-col justify-center">
            {activeSlideChartComponent()}
          </div>
        </div>
      </div>

      {/* SECTION 5: REFLEX TESTER */}
      <div className="bg-[#060606] border border-white/[0.04] rounded-2xl p-5 md:p-6 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-5">
          <div className="space-y-0.5">
            <span style={{ color: accent }} className="text-[9px] font-mono uppercase tracking-widest font-black block">
              Nerve Connection Speed
            </span>
            <h3 className="text-lg font-light text-white font-sans flex items-center gap-2">
              <Timer style={{ color: accent }} className="w-5 h-5" />
              Neural Reflex <span style={{ color: accent }} className="font-serif italic">Tester</span>
            </h3>
            <p className="text-xs text-white/40">
              Test your reaction speed. A fast reaction time indicates a rested and healthy nervous system.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-[8px] text-white/30 block uppercase font-bold">Best Time</span>
              <span className="text-emerald-400 font-extrabold">{bestReflex ? `${bestReflex} ms` : "No logs"}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Reaction Game Interface (Left 7 cols) */}
          <div className="md:col-span-7 flex flex-col">
            <div 
              onClick={triggerReflexClick}
              onMouseEnter={() => setHoveredCard("reflex-area")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                borderColor: 
                  reflexState === "idle" && hoveredCard === "reflex-area"
                    ? `rgba(${accentRgb}, 0.3)`
                    : reflexState === "waiting"
                    ? "rgba(245, 158, 11, 0.2)"
                    : reflexState === "active"
                    ? "rgba(52, 211, 153, 0.4)"
                    : reflexState === "early"
                    ? "rgba(239, 68, 68, 0.2)"
                    : reflexState === "result"
                    ? `rgba(${accentRgb}, 0.2)`
                    : "rgba(255, 255, 255, 0.05)"
              }}
              className={`flex-1 min-h-[180px] rounded-2xl border flex flex-col items-center justify-center text-center p-6 transition-all duration-200 select-none cursor-pointer relative overflow-hidden ${
                reflexState === "idle" 
                  ? "bg-stone-900/30 hover:bg-stone-900/50" 
                  : reflexState === "waiting"
                  ? "bg-amber-950/20 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)] cursor-not-allowed"
                  : reflexState === "active"
                  ? "bg-emerald-950/40 shadow-[0_0_25px_rgba(52,211,153,0.15)] scale-[0.99] hover:bg-emerald-900/50"
                  : reflexState === "early"
                  ? "bg-rose-950/30 border-rose-500/20"
                  : "bg-orange-950/10"
              }`}
            >
              {reflexState === "idle" && (
                <div className="space-y-3">
                  <Activity style={{ color: accent }} className="w-10 h-10 mx-auto animate-pulse opacity-50" />
                  <div>
                    <h5 className="text-white font-bold font-mono text-sm uppercase">Ready</h5>
                    <p className="text-xs text-white/40 max-w-sm mx-auto mt-1">
                      Tap below to start. Click as fast as you can when the screen flashes green.
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startReflexTest();
                    }}
                    onMouseEnter={() => setHoveredCard("start-test-btn")}
                    onMouseLeave={() => setHoveredCard("reflex-area")}
                    style={{ backgroundColor: hoveredCard === "start-test-btn" ? accentLight : accent }}
                    className="px-4 py-2 text-black text-[10px] font-black uppercase tracking-wider rounded-md transition-colors font-mono cursor-pointer"
                  >
                    Start Test
                  </button>
                </div>
              )}

              {reflexState === "waiting" && (
                <div className="space-y-2 text-center">
                  <div className="relative w-8 h-8 mx-auto">
                    <span className="absolute inset-0 rounded-full border-2 border-amber-400/20 border-t-amber-400 animate-spin" />
                  </div>
                  <h5 className="text-amber-400 font-bold font-mono text-xs uppercase tracking-widest animate-pulse">
                    Wait for Green...
                  </h5>
                  <p className="text-[10px] text-white/30 max-w-xs mx-auto">
                    Concentrate and be ready to click!
                  </p>
                </div>
              )}

              {reflexState === "active" && (
                <div className="space-y-2 text-center pointer-events-none">
                  <Zap className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                  <h5 className="text-emerald-400 font-black font-mono text-xl uppercase tracking-widest animate-pulse">
                    CLICK NOW!
                  </h5>
                  <p className="text-xs text-emerald-300/60 font-semibold font-mono">
                    TAP AS FAST AS YOU CAN!
                  </p>
                </div>
              )}

              {reflexState === "early" && (
                <div className="space-y-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h5 className="text-rose-500 font-bold font-mono text-xs uppercase tracking-widest">
                      TOO EARLY!
                    </h5>
                    <p className="text-[10px] text-white/40 max-w-xs mx-auto mt-1">
                      You clicked before the green light. Try again!
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startReflexTest();
                    }}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-[9px] font-mono font-bold uppercase rounded transition-colors cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {reflexState === "result" && reflexTime !== null && (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 border border-emerald-500/20 rounded-full text-emerald-400 font-mono text-xs">
                    <Trophy className="w-3.5 h-3.5" />
                    TEST COMPLETED
                  </div>
                  <div>
                    <h4 className="text-4xl font-mono font-black text-white">
                      {reflexTime} <span className="text-lg font-light text-white/40">ms</span>
                    </h4>
                    <p className={`text-xs font-mono uppercase font-bold mt-1 ${getReflexRating(reflexTime).color}`}>
                      {getReflexRating(reflexTime).label}
                    </p>
                  </div>
                  <div className="text-[10px] text-white/40 max-w-md mx-auto leading-normal px-4">
                    {reflexTime < 200 
                      ? "Excellent! Your reaction time is fast. Your nervous system is fully rested and ready to train."
                      : reflexTime < 250 
                      ? "Good reaction time. You are recovered enough for a solid workout."
                      : "Slight reaction delay. Consider taking a lighter training day or focusing on stretching."
                    }
                  </div>
                  <div className="flex gap-2 justify-center pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startReflexTest();
                      }}
                      onMouseEnter={() => setHoveredCard("test-again-btn")}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{ backgroundColor: hoveredCard === "test-again-btn" ? accentLight : accent }}
                      className="px-3 py-1.5 text-black text-[9px] font-mono font-black uppercase tracking-widest rounded transition-colors cursor-pointer"
                    >
                      Test Again
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setReflexState("idle");
                      }}
                      className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-white/60 text-[9px] font-mono font-black uppercase tracking-widest rounded transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* History Panel (Right 5 cols) */}
          <div className="md:col-span-5 bg-[#0b0b0b] border border-white/5 rounded-2xl p-4 flex flex-col justify-between text-left font-mono text-xs">
            <div className="space-y-3 flex-1">
              <span className="text-[8px] text-white/30 uppercase tracking-widest font-black block pb-1 border-b border-white/5">
                PAST TEST RESULTS
              </span>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {reflexHistory.length === 0 ? (
                  <div className="text-center py-6 text-white/20 text-[10px]">
                    No test results yet.
                  </div>
                ) : (
                  reflexHistory.map((time, idx) => {
                    const rating = getReflexRating(time);
                    return (
                      <div key={idx} className="flex items-center justify-between py-1 border-b border-white/[0.02] text-[10px]">
                        <div className="flex items-center gap-2">
                          <span className="text-white/20">#{reflexHistory.length - idx}</span>
                          <span className={rating.color}>{time} ms</span>
                        </div>
                        <span className="text-white/30 text-[9px] uppercase tracking-wider">
                          {time < 200 ? "Elite" : time < 250 ? "Athletic" : "Lag"}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl text-[10px] text-amber-300 leading-normal mt-4">
              <span className="font-extrabold uppercase text-[8px] tracking-widest text-amber-400 block mb-1">
                REACTION TIME FACTOR
              </span>
              Heavy lifting fatigues the nervous system, which temporarily slows your reaction time.
            </div>
          </div>

        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          onMouseEnter={() => setHoveredCard("back-to-top-btn")}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            borderColor: hoveredCard === "back-to-top-btn" ? `rgba(${accentRgb}, 0.35)` : "rgba(255, 255, 255, 0.1)",
            color: hoveredCard === "back-to-top-btn" ? accent : "rgba(255, 255, 255, 0.6)"
          }}
          className="flex items-center gap-2 px-4 py-2 bg-black/60 border rounded-md text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer group"
        >
          <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          Back to Top
        </button>
      </div>

    </motion.div>
  );
}
