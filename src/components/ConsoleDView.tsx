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

interface ExerciseMapping {
  primaryGroup: string;
  primarySubs: string[];
  secondaryGroups: string[];
  secondarySubs: string[];
}

function parseExercise(name: string): ExerciseMapping {
  const n = (name || "").toLowerCase();
  
  const result: ExerciseMapping = {
    primaryGroup: "",
    primarySubs: [],
    secondaryGroups: [],
    secondarySubs: []
  };

  // Chest / Push
  if (n.includes("bench press") || n.includes("chest press") || n.includes("pushup") || n.includes("push-up") || n.includes("dip")) {
    result.primaryGroup = "Chest";
    result.secondaryGroups = ["Arms", "Shoulders"];
    result.secondarySubs = ["Triceps", "Front Deltoids"];
    
    if (n.includes("incline")) {
      result.primarySubs = ["Upper Chest"];
    } else if (n.includes("decline")) {
      result.primarySubs = ["Lower Chest"];
    } else {
      result.primarySubs = ["Mid Chest", "Lower Chest"];
    }
  } else if (n.includes("fly") || n.includes("pec deck") || n.includes("cable crossover")) {
    result.primaryGroup = "Chest";
    result.primarySubs = ["Mid Chest", "Upper Chest"];
    result.secondaryGroups = [];
    result.secondarySubs = [];
  }
  
  // Back / Pull
  else if (n.includes("lat pulldown") || n.includes("pullup") || n.includes("pull-up") || n.includes("chinup") || n.includes("chin-up") || n.includes("lat pull")) {
    result.primaryGroup = "Back";
    result.primarySubs = ["Latissimus Dorsi (Lats)"];
    result.secondaryGroups = ["Arms", "Back"];
    result.secondarySubs = ["Biceps", "Trapezius (Traps)"];
  } else if (n.includes("row")) {
    result.primaryGroup = "Back";
    result.primarySubs = ["Rhomboids & Mid-Back", "Latissimus Dorsi (Lats)"];
    result.secondaryGroups = ["Arms", "Back"];
    result.secondarySubs = ["Biceps", "Trapezius (Traps)"];
  } else if (n.includes("deadlift")) {
    result.primaryGroup = "Back";
    result.primarySubs = ["Lower Back"];
    result.secondaryGroups = ["Legs", "Back"];
    result.secondarySubs = ["Hamstrings", "Gluteals", "Trapezius (Traps)", "Rhomboids & Mid-Back"];
  } else if (n.includes("shrug")) {
    result.primaryGroup = "Back";
    result.primarySubs = ["Trapezius (Traps)"];
    result.secondaryGroups = ["Arms"];
    result.secondarySubs = ["Forearms"];
  }
  
  // Shoulders
  else if (n.includes("shoulder press") || n.includes("overhead press") || n.includes("military press") || n.includes("arnold press")) {
    result.primaryGroup = "Shoulders";
    result.primarySubs = ["Front Deltoids", "Side Deltoids"];
    result.secondaryGroups = ["Arms"];
    result.secondarySubs = ["Triceps"];
  } else if (n.includes("lateral raise") || n.includes("side raise")) {
    result.primaryGroup = "Shoulders";
    result.primarySubs = ["Side Deltoids"];
    result.secondaryGroups = [];
    result.secondarySubs = [];
  } else if (n.includes("rear delt") || n.includes("face pull") || n.includes("reverse fly")) {
    result.primaryGroup = "Shoulders";
    result.primarySubs = ["Rear Deltoids"];
    result.secondaryGroups = ["Back"];
    result.secondarySubs = ["Rhomboids & Mid-Back"];
  }
  
  // Arms
  else if (n.includes("bicep curl") || n.includes("hammer curl") || n.includes("preacher curl") || n.includes("spider curl") || n.includes("bicep")) {
    result.primaryGroup = "Arms";
    result.primarySubs = ["Biceps"];
    result.secondaryGroups = ["Arms"];
    result.secondarySubs = ["Forearms"];
  } else if (n.includes("tricep pushdown") || n.includes("tricep extension") || n.includes("skull crusher") || n.includes("tricep kickback") || n.includes("tricep")) {
    result.primaryGroup = "Arms";
    result.primarySubs = ["Triceps"];
    result.secondaryGroups = [];
    result.secondarySubs = [];
  } else if (n.includes("forearm") || n.includes("wrist curl") || n.includes("grip")) {
    result.primaryGroup = "Arms";
    result.primarySubs = ["Forearms"];
    result.secondaryGroups = [];
    result.secondarySubs = [];
  }
  
  // Legs
  else if (n.includes("squat") || n.includes("leg press") || n.includes("hack squat")) {
    result.primaryGroup = "Legs";
    result.primarySubs = ["Quadriceps", "Gluteals"];
    result.secondaryGroups = ["Legs", "Back"];
    result.secondarySubs = ["Hamstrings", "Lower Back"];
  } else if (n.includes("leg extension") || n.includes("quad extension")) {
    result.primaryGroup = "Legs";
    result.primarySubs = ["Quadriceps"];
    result.secondaryGroups = [];
    result.secondarySubs = [];
  } else if (n.includes("leg curl") || n.includes("hamstring curl") || n.includes("romanian deadlift") || n.includes("rdl")) {
    result.primaryGroup = "Legs";
    result.primarySubs = ["Hamstrings", "Gluteals"];
    result.secondaryGroups = ["Back"];
    result.secondarySubs = ["Lower Back"];
  } else if (n.includes("calf raise") || n.includes("calf")) {
    result.primaryGroup = "Legs";
    result.primarySubs = ["Calves"];
    result.secondaryGroups = [];
    result.secondarySubs = [];
  } else if (n.includes("lunge") || n.includes("hip thrust") || n.includes("glute kickback")) {
    result.primaryGroup = "Legs";
    result.primarySubs = ["Gluteals"];
    result.secondaryGroups = ["Legs"];
    result.secondarySubs = ["Hamstrings", "Quadriceps"];
  }
  
  // Core
  else if (n.includes("crunch") || n.includes("situp") || n.includes("sit-up") || n.includes("abdominal")) {
    result.primaryGroup = "Core";
    result.primarySubs = ["Rectus Abdominis (Abs)"];
    result.secondaryGroups = [];
    result.secondarySubs = [];
  } else if (n.includes("twist") || n.includes("oblique") || n.includes("side bend")) {
    result.primaryGroup = "Core";
    result.primarySubs = ["Obliques"];
    result.secondaryGroups = [];
    result.secondarySubs = [];
  } else if (n.includes("plank") || n.includes("ab wheel") || n.includes("rollout")) {
    result.primaryGroup = "Core";
    result.primarySubs = ["Transverse Abdominis", "Deep Core Stabilizers"];
    result.secondaryGroups = ["Back", "Shoulders"];
    result.secondarySubs = ["Lower Back", "Front Deltoids"];
  } else if (n.includes("hanging leg raise") || n.includes("knee raise") || n.includes("core")) {
    result.primaryGroup = "Core";
    result.primarySubs = ["Rectus Abdominis (Abs)", "Deep Core Stabilizers"];
    result.secondaryGroups = [];
    result.secondarySubs = [];
  }
  
  // Generic fallback if nothing matches
  else {
    if (n.includes("press")) {
      result.primaryGroup = "Chest";
      result.primarySubs = ["Mid Chest"];
      result.secondaryGroups = ["Arms"];
      result.secondarySubs = ["Triceps"];
    } else if (n.includes("pull") || n.includes("lift")) {
      result.primaryGroup = "Back";
      result.primarySubs = ["Latissimus Dorsi (Lats)"];
      result.secondaryGroups = ["Arms"];
      result.secondarySubs = ["Biceps"];
    } else if (n.includes("raise")) {
      result.primaryGroup = "Shoulders";
      result.primarySubs = ["Side Deltoids"];
    } else if (n.includes("curl")) {
      result.primaryGroup = "Arms";
      result.primarySubs = ["Biceps"];
    } else {
      result.primaryGroup = "Arms";
      result.primarySubs = ["Forearms"];
    }
  }

  return result;
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

  // 3. Spinal & Neuromuscular Decompression Checklist items
  const [drillHanging, setDrillHanging] = useState<boolean>(() => {
    try {
      return localStorage.getItem("drill_hanging") === "true";
    } catch {
      return false;
    }
  });
  const [drillTwist, setDrillTwist] = useState<boolean>(() => {
    try {
      return localStorage.getItem("drill_twist") === "true";
    } catch {
      return false;
    }
  });
  const [drillSquat, setDrillSquat] = useState<boolean>(() => {
    try {
      return localStorage.getItem("drill_squat") === "true";
    } catch {
      return false;
    }
  });

  const localSpinalUnitsDelta = useMemo(() => {
    let sum = 0;
    if (drillHanging) sum += 1.5;
    if (drillTwist) sum += 1.5;
    if (drillSquat) sum += 1.5;
    return sum;
  }, [drillHanging, drillTwist, drillSquat]);

  const toggleDrillHanging = () => {
    const next = !drillHanging;
    setDrillHanging(next);
    try {
      localStorage.setItem("drill_hanging", String(next));
    } catch (e) {}
  };

  const toggleDrillTwist = () => {
    const next = !drillTwist;
    setDrillTwist(next);
    try {
      localStorage.setItem("drill_twist", String(next));
    } catch (e) {}
  };

  const toggleDrillSquat = () => {
    const next = !drillSquat;
    setDrillSquat(next);
    try {
      localStorage.setItem("drill_squat", String(next));
    } catch (e) {}
  };

  const baselineRecovery = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];

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

    // Initialize accumulated fatigue
    const fatigueByGroup: Record<string, number> = {
      Chest: 0, Back: 0, Legs: 0, Shoulders: 0, Arms: 0, Core: 0
    };
    
    const fatigueBySub: Record<string, number> = {};
    const allSubMuscles = [
      "Upper Chest", "Mid Chest", "Lower Chest",
      "Latissimus Dorsi (Lats)", "Rhomboids & Mid-Back", "Trapezius (Traps)", "Lower Back",
      "Front Deltoids", "Side Deltoids", "Rear Deltoids",
      "Biceps", "Triceps", "Forearms",
      "Quadriceps", "Hamstrings", "Gluteals", "Calves",
      "Rectus Abdominis (Abs)", "Obliques", "Transverse Abdominis", "Deep Core Stabilizers"
    ];
    allSubMuscles.forEach(sub => {
      fatigueBySub[sub] = 0;
    });

    const processSet = (exerciseName: string, decay: number) => {
      const parsed = parseExercise(exerciseName);
      if (parsed.primaryGroup) {
        fatigueByGroup[parsed.primaryGroup] = (fatigueByGroup[parsed.primaryGroup] || 0) + (10 * decay);
        parsed.primarySubs.forEach(sub => {
          fatigueBySub[sub] = (fatigueBySub[sub] || 0) + (12 * decay);
        });
      }
      parsed.secondaryGroups.forEach(g => {
        fatigueByGroup[g] = (fatigueByGroup[g] || 0) + (3 * decay);
      });
      parsed.secondarySubs.forEach(sub => {
        fatigueBySub[sub] = (fatigueBySub[sub] || 0) + (4 * decay);
      });
    };

    // 1. Process active session sets (today, diff = 0)
    sessionSets.forEach((set) => {
      processSet(set.exerciseName, 1.0);
    });

    // 2. Process archived sets in the last 5 days
    archivedWorkouts.forEach((w) => {
      const wDate = w.date || todayStr;
      const diff = getDaysDiff(todayStr, wDate);
      if (diff >= 0 && diff <= 4) {
        let decay = 1.0;
        if (diff === 0) decay = 1.0;
        else if (diff === 1) decay = 0.60;
        else if (diff === 2) decay = 0.35;
        else if (diff === 3) decay = 0.15;
        else if (diff === 4) decay = 0.05;

        const wSets = w.sets || [];
        wSets.forEach((set: any) => {
          processSet(set.exerciseName, decay);
        });
      }
    });

    // Compute final recovery percentages with a minimum cap of 15% and maximum 100%
    const recoveryByGroup: Record<string, number> = {};
    const recoveryBySub: Record<string, number> = {};

    allSubMuscles.forEach(sub => {
      const accumulatedFatigue = Math.min(85, fatigueBySub[sub]);
      recoveryBySub[sub] = Math.round(100 - accumulatedFatigue);
    });

    // Map parent muscle groups to their respective sub-muscle groups for accurate mathematical average
    const groupToSubs: Record<string, string[]> = {
      Chest: ["Upper Chest", "Mid Chest", "Lower Chest"],
      Back: ["Latissimus Dorsi (Lats)", "Rhomboids & Mid-Back", "Trapezius (Traps)", "Lower Back"],
      Shoulders: ["Front Deltoids", "Side Deltoids", "Rear Deltoids"],
      Arms: ["Biceps", "Triceps", "Forearms"],
      Legs: ["Quadriceps", "Hamstrings", "Gluteals", "Calves"],
      Core: ["Rectus Abdominis (Abs)", "Obliques", "Transverse Abdominis", "Deep Core Stabilizers"]
    };

    Object.keys(groupToSubs).forEach(g => {
      const subs = groupToSubs[g];
      const sum = subs.reduce((acc, sub) => acc + (recoveryBySub[sub] ?? 100), 0);
      recoveryByGroup[g] = Math.round(sum / subs.length);
    });

    return {
      groups: recoveryByGroup,
      subs: recoveryBySub
    };
  }, [sessionSets, archivedWorkouts]);

  const muscleRecovery = useMemo(() => {
    const recovery: Record<string, { percent: number; advice: string }> = {};
    const muscleGroups = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

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
      },
      Core: {
        optimal: "Abdominal/transverse wall fully functional.",
        sore: "Core sore from heavy stabilization. Recommend stretching.",
        severe: "Deep stabilizer fatigue. Avoid heavy axial loading."
      }
    };

    muscleGroups.forEach((m) => {
      const base = baselineRecovery.groups[m] ?? 100;
      const finalPercent = base; // Discard stretch/target-relief overrides completely

      let advice = advices[m].optimal;
      if (finalPercent < 60) advice = advices[m].severe;
      else if (finalPercent < 90) advice = advices[m].sore;

      recovery[m] = {
        percent: finalPercent,
        advice
      };
    });

    return recovery;
  }, [baselineRecovery]);

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

  const resetSynergyDecompression = () => {
    setDrillHanging(false);
    setDrillTwist(false);
    setDrillSquat(false);
    try {
      localStorage.removeItem("drill_hanging");
      localStorage.removeItem("drill_twist");
      localStorage.removeItem("drill_squat");
    } catch (e) {}
    try {
      localStorage.removeItem("somatic_stretched_muscles");
    } catch (e) {}
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

  // 6. Neural Recruitment loading level computations
  const recruitment: Record<string, any> = useMemo(() => {
    // Define baseline values for sub-muscle groups
    const subScores: Record<string, number> = {
      // Chest
      "Upper Chest": 25,
      "Mid Chest": 25,
      "Lower Chest": 25,
      // Back
      "Latissimus Dorsi (Lats)": 20,
      "Rhomboids & Mid-Back": 20,
      "Trapezius (Traps)": 20,
      "Lower Back": 20,
      // Shoulders
      "Front Deltoids": 25,
      "Side Deltoids": 25,
      "Rear Deltoids": 25,
      // Arms
      "Biceps": 20,
      "Triceps": 20,
      "Forearms": 20,
      // Legs
      "Quadriceps": 30,
      "Hamstrings": 30,
      "Gluteals": 30,
      "Calves": 30,
      // Core
      "Rectus Abdominis (Abs)": 40,
      "Obliques": 40,
      "Transverse Abdominis": 40,
      "Deep Core Stabilizers": 40,
    };

    // Process each logged set to precisely allocate recruitment points to specific sub-muscle groups
    sessionSets.forEach((set) => {
      const exName = (set.exerciseName || "").toLowerCase();
      
      // Chest Allocations
      if (exName.includes("incline") || exName.includes("upper chest") || exName.includes("low-to-high")) {
        subScores["Upper Chest"] += 15;
      } else if (exName.includes("decline") || exName.includes("lower chest") || exName.includes("high-to-low")) {
        subScores["Lower Chest"] += 15;
      } else if (exName.includes("dip")) {
        subScores["Lower Chest"] += 10;
        subScores["Mid Chest"] += 5;
        subScores["Triceps"] += 5;
      } else if (exName.includes("chest") || exName.includes("bench") || exName.includes("press") || exName.includes("fly") || exName.includes("pushup") || exName.includes("push-up") || exName.includes("pec deck")) {
        subScores["Mid Chest"] += 15;
      }

      // Back Allocations
      if (exName.includes("pulldown") || exName.includes("pull up") || exName.includes("pull-up") || exName.includes("lat")) {
        subScores["Latissimus Dorsi (Lats)"] += 15;
        if (exName.includes("pull up") || exName.includes("pull-up") || exName.includes("chin")) {
          subScores["Biceps"] += 5;
        }
      } else if (exName.includes("chin up") || exName.includes("chin-up")) {
        subScores["Latissimus Dorsi (Lats)"] += 10;
        subScores["Biceps"] += 10;
      } else if (exName.includes("deadlift")) {
        subScores["Lower Back"] += 10;
        subScores["Gluteals"] += 5;
        subScores["Rhomboids & Mid-Back"] += 5;
      } else if (exName.includes("shrug") || exName.includes("upright row") || exName.includes("trap")) {
        subScores["Trapezius (Traps)"] += 15;
      } else if (exName.includes("back extension") || exName.includes("hyperextension") || exName.includes("good morning") || exName.includes("lower back")) {
        subScores["Lower Back"] += 15;
      } else if (exName.includes("row") || exName.includes("back")) {
        subScores["Rhomboids & Mid-Back"] += 15;
      }

      // Shoulders Allocations
      if (exName.includes("shoulder press") || exName.includes("overhead press") || exName.includes("military press") || exName.includes("arnold press") || exName.includes("front raise")) {
        subScores["Front Deltoids"] += 15;
      } else if (exName.includes("lateral raise") || exName.includes("side raise") || exName.includes("side delt") || exName.includes("cable lateral")) {
        subScores["Side Deltoids"] += 15;
      } else if (exName.includes("face pull") || exName.includes("rear delt") || exName.includes("reverse fly") || exName.includes("rear raise")) {
        subScores["Rear Deltoids"] += 15;
      } else if (exName.includes("shoulder") || exName.includes("raise") || exName.includes("delt")) {
        subScores["Side Deltoids"] += 10;
        subScores["Front Deltoids"] += 5;
      }

      // Arms Allocations
      if (exName.includes("bicep") || exName.includes("preacher") || (exName.includes("curl") && !exName.includes("wrist") && !exName.includes("reverse"))) {
        subScores["Biceps"] += 15;
      } else if (exName.includes("tricep") || exName.includes("pushdown") || exName.includes("skull") || exName.includes("close grip")) {
        subScores["Triceps"] += 15;
      } else if (exName.includes("wrist") || exName.includes("forearm") || exName.includes("reverse curl")) {
        subScores["Forearms"] += 15;
      } else if (exName.includes("arm") || exName.includes("curl")) {
        subScores["Biceps"] += 10;
        subScores["Triceps"] += 5;
      }

      // Legs Allocations
      if (exName.includes("squat") || exName.includes("leg press") || exName.includes("extension") || exName.includes("quad")) {
        subScores["Quadriceps"] += 10;
        if (exName.includes("squat")) {
          subScores["Gluteals"] += 5;
        }
      } else if (exName.includes("hamstring") || exName.includes("leg curl") || exName.includes("rdl") || exName.includes("romanian")) {
        subScores["Hamstrings"] += 15;
      } else if (exName.includes("hip thrust") || exName.includes("glute") || exName.includes("bridge") || exName.includes("kickback")) {
        subScores["Gluteals"] += 15;
      } else if (exName.includes("calf") || exName.includes("calves")) {
        subScores["Calves"] += 15;
      } else if (exName.includes("lunge") || exName.includes("step up")) {
        subScores["Quadriceps"] += 7;
        subScores["Gluteals"] += 8;
      } else if (exName.includes("leg")) {
        subScores["Quadriceps"] += 10;
        subScores["Hamstrings"] += 5;
      }

      // Core Allocations
      if (exName.includes("crunch") || exName.includes("sit up") || exName.includes("situp") || exName.includes("abs") || exName.includes("leg raise") || exName.includes("knee raise")) {
        subScores["Rectus Abdominis (Abs)"] += 15;
      } else if (exName.includes("twist") || exName.includes("woodchopper") || exName.includes("oblique") || exName.includes("bicycle")) {
        subScores["Obliques"] += 15;
      } else if (exName.includes("vacuum") || exName.includes("bird dog") || exName.includes("dead bug")) {
        subScores["Transverse Abdominis"] += 15;
      } else if (exName.includes("plank")) {
        subScores["Transverse Abdominis"] += 10;
        subScores["Deep Core Stabilizers"] += 5;
      } else if (exName.includes("ab wheel") || exName.includes("stabilizer") || exName.includes("farmer")) {
        subScores["Deep Core Stabilizers"] += 15;
      } else if (exName.includes("core")) {
        subScores["Rectus Abdominis (Abs)"] += 5;
        subScores["Transverse Abdominis"] += 5;
        subScores["Deep Core Stabilizers"] += 5;
      }
    });

    // Clip all subScores to [0, 100]
    Object.keys(subScores).forEach((k) => {
      subScores[k] = Math.min(100, subScores[k]);
    });

    // Compute overall parent scores as the average of their respective sub-muscles
    const chestAvg = Math.round((subScores["Upper Chest"] + subScores["Mid Chest"] + subScores["Lower Chest"]) / 3);
    const backAvg = Math.round((subScores["Latissimus Dorsi (Lats)"] + subScores["Rhomboids & Mid-Back"] + subScores["Trapezius (Traps)"] + subScores["Lower Back"]) / 4);
    const shouldersAvg = Math.round((subScores["Front Deltoids"] + subScores["Side Deltoids"] + subScores["Rear Deltoids"]) / 3);
    const armsAvg = Math.round((subScores["Biceps"] + subScores["Triceps"] + subScores["Forearms"]) / 3);
    const legsAvg = Math.round((subScores["Quadriceps"] + subScores["Hamstrings"] + subScores["Gluteals"] + subScores["Calves"]) / 4);
    const coreAvg = Math.round((subScores["Rectus Abdominis (Abs)"] + subScores["Obliques"] + subScores["Transverse Abdominis"] + subScores["Deep Core Stabilizers"]) / 4);

    return {
      Chest: chestAvg,
      Back: backAvg,
      Shoulders: shouldersAvg,
      Arms: armsAvg,
      Legs: legsAvg,
      Core: coreAvg,
      subScores,
    };
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
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
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
              borderColor: hoveredCard === "engagement" ? `rgba(${accentRgb}, 0.5)` : "rgba(255, 255, 255, 0.12)",
              boxShadow: hoveredCard === "engagement"
                ? `inset 0 1px 0 rgba(255,255,255,0.25), 0 12px 32px rgba(0,0,0,0.85), 0 0 20px rgba(${accentRgb}, 0.15)`
                : "inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.7)"
            }}
            className="bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/80 border rounded-2xl p-5 md:p-6 flex flex-col justify-between relative overflow-visible group transition-all duration-300 h-full hover:-translate-y-0.5"
          >
            <div 
              style={{ background: `linear-gradient(to right, transparent, rgba(${accentRgb}, 0.3), transparent)` }}
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
                className="flex items-center justify-center cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-gradient-to-b from-white/[0.05] to-black/60 border border-white/10 rounded-xl p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                onClick={() => setActiveView("anatomy")}
                title="Click to view detailed diagnostics"
              >
                <AnatomyChart
                  sets={sessionSets}
                  archivedWorkouts={archivedWorkouts}
                  compact={true}
                />
              </div>
              <div className="flex items-center justify-center bg-gradient-to-b from-white/[0.05] to-black/60 border border-white/10 rounded-xl p-3 overflow-visible relative shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                <RadarChart
                  sessionSets={sessionSets}
                  archivedWorkouts={archivedWorkouts}
                  size={240}
                  plain={true}
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 font-mono">
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

        {/* Right: Muscle Group Recovery Carousel (replaces Capacity Matrix) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div 
            onMouseEnter={() => setHoveredCard("capacity")}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ 
              borderColor: hoveredCard === "capacity" ? `rgba(${accentRgb}, 0.5)` : "rgba(255, 255, 255, 0.12)",
              boxShadow: hoveredCard === "capacity"
                ? `inset 0 1px 0 rgba(255,255,255,0.25), 0 12px 32px rgba(0,0,0,0.85), 0 0 20px rgba(${accentRgb}, 0.15)`
                : "inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.7)"
            }}
            className="bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/80 border rounded-2xl p-5 md:p-6 flex flex-col justify-between transition-all duration-300 h-full relative overflow-hidden hover:-translate-y-0.5"
          >
            <div 
              style={{ background: `linear-gradient(to right, transparent, rgba(${accentRgb}, 0.3), transparent)` }}
              className="absolute top-0 left-0 w-full h-[1px]" 
            />
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="space-y-0.5">
                <span style={{ color: accent }} className="text-[9px] font-mono uppercase tracking-widest font-black">
                  Muscle Load Breakdown
                </span>
                <h3 className="text-base font-semibold text-white">
                  Muscle Recovery <span style={{ color: accent }} className="font-serif italic">Status</span>
                </h3>
              </div>
              {/* Navigation buttons */}
              <div className="flex items-center gap-1 bg-gradient-to-b from-white/10 to-black/60 border border-white/15 rounded-lg p-0.5 shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                <button
                  onClick={() => setActiveMatrixSlide(prev => (prev === 0 ? matrixGroups.length - 1 : prev - 1))}
                  className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded transition-all cursor-pointer"
                  title="Previous Muscle"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[9px] font-mono font-bold text-white/80 uppercase px-1.5 min-w-[54px] text-center">
                  {matrixGroups[activeMatrixSlide]}
                </span>
                <button
                  onClick={() => setActiveMatrixSlide(prev => (prev === matrixGroups.length - 1 ? 0 : prev + 1))}
                  className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded transition-all cursor-pointer"
                  title="Next Muscle"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {(() => {
              const currentGroup = matrixGroups[activeMatrixSlide];
              const parentRecovery = muscleRecovery[currentGroup]?.percent ?? 100;
              const subRec = baselineRecovery.subs || {};
              
              // Define sub-muscles for current group based on precise sub-muscle calculations
              let subMuscles: { name: string; pct: number }[] = [];
              if (currentGroup === "Chest") {
                subMuscles = [
                  { name: "Upper Chest", pct: subRec["Upper Chest"] ?? 100 },
                  { name: "Mid Chest", pct: subRec["Mid Chest"] ?? 100 },
                  { name: "Lower Chest", pct: subRec["Lower Chest"] ?? 100 },
                ];
              } else if (currentGroup === "Back") {
                subMuscles = [
                  { name: "Latissimus Dorsi (Lats)", pct: subRec["Latissimus Dorsi (Lats)"] ?? 100 },
                  { name: "Rhomboids & Mid-Back", pct: subRec["Rhomboids & Mid-Back"] ?? 100 },
                  { name: "Trapezius (Traps)", pct: subRec["Trapezius (Traps)"] ?? 100 },
                  { name: "Lower Back", pct: subRec["Lower Back"] ?? 100 },
                ];
              } else if (currentGroup === "Shoulders") {
                subMuscles = [
                  { name: "Front Deltoids", pct: subRec["Front Deltoids"] ?? 100 },
                  { name: "Side Deltoids", pct: subRec["Side Deltoids"] ?? 100 },
                  { name: "Rear Deltoids", pct: subRec["Rear Deltoids"] ?? 100 },
                ];
              } else if (currentGroup === "Arms") {
                subMuscles = [
                  { name: "Biceps", pct: subRec["Biceps"] ?? 100 },
                  { name: "Triceps", pct: subRec["Triceps"] ?? 100 },
                  { name: "Forearms", pct: subRec["Forearms"] ?? 100 },
                ];
              } else if (currentGroup === "Legs") {
                subMuscles = [
                  { name: "Quadriceps", pct: subRec["Quadriceps"] ?? 100 },
                  { name: "Hamstrings", pct: subRec["Hamstrings"] ?? 100 },
                  { name: "Gluteals", pct: subRec["Gluteals"] ?? 100 },
                  { name: "Calves", pct: subRec["Calves"] ?? 100 },
                ];
              } else if (currentGroup === "Core") {
                subMuscles = [
                  { name: "Rectus Abdominis (Abs)", pct: subRec["Rectus Abdominis (Abs)"] ?? 100 },
                  { name: "Obliques", pct: subRec["Obliques"] ?? 100 },
                  { name: "Transverse Abdominis", pct: subRec["Transverse Abdominis"] ?? 100 },
                  { name: "Deep Core Stabilizers", pct: subRec["Deep Core Stabilizers"] ?? 100 },
                ];
              }

              return (
                <div className="flex-1 flex flex-col justify-between pt-1 h-full min-h-[300px]">
                  {/* Parent Overall Score Badge */}
                  <div className="bg-gradient-to-b from-white/[0.06] to-black/50 border border-white/10 rounded-xl p-3 flex items-center justify-between mb-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    <span className="text-[11px] text-white/60 font-mono">Overall {currentGroup} Recovery</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-black uppercase ${
                        parentRecovery >= 80 ? "text-emerald-400" : parentRecovery < 60 ? "text-red-400" : "text-amber-400"
                      }`}>
                        {parentRecovery >= 80 ? "OPTIMAL" : parentRecovery < 60 ? "FATIGUED" : "RECOVERING"}
                      </span>
                      <span style={{ color: parentRecovery >= 80 ? "#34d399" : parentRecovery < 60 ? "#f87171" : "#fbbf24" }} className="text-sm font-mono font-black">
                        {parentRecovery}%
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-around py-2 space-y-3">
                    {subMuscles.map((sub) => {
                      const barColor = sub.pct >= 80 ? "from-emerald-500 to-teal-400" : sub.pct < 60 ? "from-red-500 to-rose-400" : "from-amber-500 to-orange-400";
                      return (
                        <div key={sub.name} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs font-mono">
                            <span className="text-white/80 font-medium">{sub.name}</span>
                            <span style={{ color: sub.pct >= 80 ? "#34d399" : sub.pct < 60 ? "#f87171" : "#fbbf24" }} className="font-bold">
                              {sub.pct}%
                            </span>
                          </div>
                          <div className="h-2 w-full bg-black/40 border border-white/10 rounded-full overflow-hidden shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${sub.pct}%` }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <div className="mt-4 pt-3 border-t border-white/10 text-[9px] text-white/40 font-mono flex items-center justify-between">
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

      {/* SECTION 3: PERFORMANCE PROGRESSION CHART CARD (FULL WIDTH) */}
      <div 
        onMouseEnter={() => setHoveredCard("performance")}
        onMouseLeave={() => setHoveredCard(null)}
        style={{ 
          borderColor: hoveredCard === "performance" ? `rgba(${accentRgb}, 0.5)` : "rgba(255, 255, 255, 0.12)",
          boxShadow: hoveredCard === "performance"
            ? `inset 0 1px 0 rgba(255,255,255,0.25), 0 12px 32px rgba(0,0,0,0.85), 0 0 20px rgba(${accentRgb}, 0.15)`
            : "inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.7)"
        }}
        className="bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/80 border rounded-2xl p-5 md:p-6 transition-all duration-300 relative overflow-hidden hover:-translate-y-0.5"
      >
        <div 
          style={{ background: `linear-gradient(to right, transparent, rgba(${accentRgb}, 0.3), transparent)` }}
          className="absolute top-0 left-0 w-full h-[1px]" 
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="space-y-1">
            <span style={{ color: accent }} className="text-[9px] font-mono uppercase tracking-widest font-black block">
              Performance Trackers
            </span>
            <h3 className="text-xl font-light text-white font-sans">
              Performance <span style={{ color: accent }} className="font-serif italic">Metrics</span>
            </h3>
            <p className="text-xs text-white/40 leading-relaxed max-w-2xl">
              Track your lifting volume, energy output, body weight, and adiposity progressions over time.
            </p>
          </div>
          {/* Slide Navigation Buttons */}
          <div className="flex items-center gap-2 bg-gradient-to-b from-white/10 to-black/60 border border-white/15 rounded-lg p-1 self-start sm:self-auto shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
            <button 
              onClick={() => setActiveChartSlide(prev => (prev === 0 ? chartTypes.length - 1 : prev - 1))}
              className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded transition-all cursor-pointer"
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
              className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded transition-all cursor-pointer"
              title="Next Metric"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-[220px] md:min-h-[280px] flex flex-col justify-center">
          {activeSlideChartComponent()}
        </div>
      </div>

      {/* SECTION 4: CAROUSELS SECTION (MONTHLY CALENDAR CAROUSEL & NERVOUS SYSTEM GAUGE CAROUSEL) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* CAROUSEL 1: MONTHLY TRAINING DENSITY CALENDAR CAROUSEL */}
        <div 
          onMouseEnter={() => setHoveredCard("calendar")}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ 
            borderColor: hoveredCard === "calendar" ? `rgba(${accentRgb}, 0.5)` : "rgba(255, 255, 255, 0.12)",
            boxShadow: hoveredCard === "calendar"
              ? `inset 0 1px 0 rgba(255,255,255,0.25), 0 12px 32px rgba(0,0,0,0.85), 0 0 20px rgba(${accentRgb}, 0.15)`
              : "inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.7)"
          }}
          className="bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/80 border rounded-2xl p-5 md:p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden hover:-translate-y-0.5"
        >
          <div 
            style={{ background: `linear-gradient(to right, transparent, rgba(${accentRgb}, 0.3), transparent)` }}
            className="absolute top-0 left-0 w-full h-[1px]" 
          />
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div>
              <h4 className="text-base font-semibold text-white leading-snug">
                Monthly Training Density
              </h4>
              <p className="text-[10px] text-white/40 font-mono mt-0.5 uppercase">
                {monthName} {calendarYear} • Workout Frequency Map
              </p>
            </div>
            {/* Navigation Carousel Buttons */}
            <div className="flex items-center gap-1.5 bg-gradient-to-b from-white/10 to-black/60 border border-white/15 rounded-lg p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
              <button 
                onClick={() => navigateMonth("prev")}
                className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded transition-all cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[9px] font-mono font-bold text-white/80 uppercase px-2">
                {monthName.slice(0, 3)} {calendarYear}
              </span>
              <button 
                onClick={() => navigateMonth("next")}
                className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded transition-all cursor-pointer"
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
                      : "bg-gradient-to-b from-white/[0.04] to-black/40 border-white/10 text-white/40 hover:bg-white/10"
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

          <div className="flex items-center gap-4 text-[9px] font-mono text-white/40 mt-4 pt-3 border-t border-white/10">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-white/[0.04] border border-white/10" />
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

        {/* CAROUSEL 2: SIMPLIFIED NERVOUS SYSTEM & SPINE LOAD GAUGE */}
        <div 
          onMouseEnter={() => setHoveredCard("spinal")}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ 
            borderColor: hoveredCard === "spinal" ? `rgba(${accentRgb}, 0.5)` : "rgba(255, 255, 255, 0.12)",
            boxShadow: hoveredCard === "spinal"
              ? `inset 0 1px 0 rgba(255,255,255,0.25), 0 12px 32px rgba(0,0,0,0.85), 0 0 20px rgba(${accentRgb}, 0.15)`
              : "inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.7)"
          }}
          className="bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/80 border rounded-2xl p-5 md:p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden hover:-translate-y-0.5"
        >
          <div 
            style={{ background: `linear-gradient(to right, transparent, rgba(${accentRgb}, 0.3), transparent)` }}
            className="absolute top-0 left-0 w-full h-[1px]" 
          />
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div>
              <h4 className="text-base font-semibold text-white leading-snug">
                Nervous System & Spine Load
              </h4>
              <p className="text-[10px] text-white/40 font-mono mt-0.5 uppercase">
                Spinal Compression Level
              </p>
            </div>
            {localSpinalUnitsDelta > 0 && (
              <button
                onClick={resetSynergyDecompression}
                onMouseEnter={() => setHoveredCard("reset-stress-btn")}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  borderColor: hoveredCard === "reset-stress-btn" ? `rgba(${accentRgb}, 0.4)` : "rgba(255, 255, 255, 0.15)",
                  color: hoveredCard === "reset-stress-btn" ? accent : "rgba(255, 255, 255, 0.7)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)"
                }}
                className="px-2.5 py-1 bg-gradient-to-b from-white/10 to-black/60 border rounded-lg text-[8px] font-mono font-bold uppercase transition-all cursor-pointer hover:border-white/30"
              >
                Reset
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-2 relative">
            <div className="relative w-full max-w-[210px] flex flex-col items-center justify-center pt-2">
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
              <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase inline-block border shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] ${synergeticCNSInfo.levelColor}`}>
                {synergeticCNSInfo.label}
              </span>
              <p className="text-[10px] text-white/50 leading-snug px-3">
                {synergeticSpinalLoadUnits.toFixed(1)} Joint Stress Units • {synergeticCNSInfo.sublabel}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-white/40 mt-4 pt-3 border-t border-white/10">
            <span className="uppercase">CNS Status Monitoring</span>
            <span style={{ color: accent }} className="opacity-80 font-bold uppercase">
              Active Telemetry
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          onMouseEnter={() => setHoveredCard("back-to-top-btn")}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            borderColor: hoveredCard === "back-to-top-btn" ? `rgba(${accentRgb}, 0.5)` : "rgba(255, 255, 255, 0.15)",
            color: hoveredCard === "back-to-top-btn" ? accent : "rgba(255, 255, 255, 0.7)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.6)"
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/60 border rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer group active:translate-y-0.5 hover:-translate-y-0.5"
        >
          <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          Back to Top
        </button>
      </div>

    </motion.div>
  );
}
