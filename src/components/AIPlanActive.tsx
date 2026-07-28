import React, { useState, useEffect, useMemo } from "react";
import { Exercise } from "../data/exercises";
import { getExerciseProgressionState } from "../lib/progression";

export interface AIPlanExercise {
  exercise: Exercise;
  targetSets: number;
  targetReps: string;
}

export function isBodyweightExercise(name: string): boolean {
  const n = name.toLowerCase();
  return (
    n.includes("push up") ||
    n.includes("pushup") ||
    n.includes("pull up") ||
    n.includes("pullup") ||
    n.includes("chin up") ||
    n.includes("chinup") ||
    n.includes("dip") ||
    n.includes("plank") ||
    n.includes("crunch") ||
    n.includes("sit up") ||
    n.includes("situp") ||
    n.includes("hanging leg") ||
    n.includes("hanging knee") ||
    n.includes("bodyweight") ||
    n.includes("burpee") ||
    n.includes("pistol squat") ||
    n.includes("air squat") ||
    n.includes("handstand") ||
    n.includes("mountain climber") ||
    n.includes("jumping jack") ||
    n.includes("l-sit") ||
    n.includes("muscle up") ||
    n.includes("muscleup") ||
    n.includes("leg raise")
  );
}

export function extractCleanNote(notesStr: string | undefined | null): string {
  if (!notesStr) return "";
  const clean = notesStr.trim();
  if (/^(?:Plan Set \d+|AI Plan Set \d+)$/i.test(clean)) {
    return "";
  }
  const match = clean.match(/^(?:Plan Set \d+|AI Plan Set \d+):\s*(.*)$/i);
  if (match) {
    return match[1].trim();
  }
  return clean;
}

import {
  Activity,
  CheckCircle,
  Plus,
  Minus,
  Check,
  RotateCcw,
  Trash2,
  Dumbbell,
  X,
  BookOpen,
  RefreshCw
} from "lucide-react";
import { motion } from "motion/react";

interface AIPlanActiveProps {
  activeExercises: AIPlanExercise[];
  personalBests: Record<string, any>;
  sessionSets: any[];
  archivedWorkouts?: any[];
  onSaveSet: (
    exName: string,
    weight: string,
    reps: string,
    notes?: string,
    difficulty?: "easy" | "moderate" | "hard" | "failure",
    source?: string
  ) => Promise<void>;
  onDeleteSet?: (setId: string) => Promise<void>;
  onFinishWorkout: (
    durationSec: number,
    completedSetsCount: number,
    totalVolume: number,
    calculatedCalories: number,
    somaticFeedbackText: string
  ) => void;
  onDeactivate: () => void;
  playRestBeep: (frequency?: number, duration?: number) => void;
  restTimerEnabled: boolean;
  setRestTimerEnabled: (val: boolean) => void;
  manualRestTime: number;
  setManualRestTime: React.Dispatch<React.SetStateAction<number>>;
  manualRestActive: boolean;
  setManualRestActive: (val: boolean) => void;
  manualRestTarget: number;
  setManualRestTarget: (val: number) => void;
  userProfile: any;
  onDeleteExercise?: (exName: string) => void;
  onShowGuidance?: (ex: Exercise) => void;
  onSwapExercise?: (ex: Exercise) => void;
}

const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Legs",
  "Core & Cardio",
  "Other"
];

const getMuscleGroup = (ex: Exercise): string => {
  const pool = (ex.pool || "").toLowerCase();
  if (pool.includes("chest")) return "Chest";
  if (pool.includes("back")) return "Back";
  if (pool.includes("delt") || pool.includes("shoulder")) return "Shoulders";
  if (pool.includes("bicep") || pool.includes("tricep") || pool.includes("arm") || pool.includes("brachialis")) return "Arms";
  if (pool.includes("quad") || pool.includes("hamstring") || pool.includes("calf") || pool.includes("calves") || pool.includes("leg")) return "Legs";
  if (pool.includes("abs") || pool.includes("oblique") || pool.includes("core") || pool.includes("cardio")) return "Core & Cardio";
  return "Other";
};


export function normalizeExerciseName(name: string): string {
  return (name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/flyes/g, "flys")
    .replace(/flies/g, "flys")
    .replace(/triceps/g, "tricep")
    .replace(/biceps/g, "bicep")
    .replace(/pulldowns/g, "pulldown")
    .replace(/extensions/g, "extension")
    .replace(/raises/g, "raise")
    .replace(/presses/g, "press")
    .replace(/curls/g, "curl")
    .trim();
}

export function getWorkoutTime(w: any): number {
  if (!w) return 0;
  if (w.timestamp) {
    if (typeof w.timestamp.seconds === 'number') return w.timestamp.seconds * 1000;
    if (w.timestamp instanceof Date) return w.timestamp.getTime();
    if (typeof w.timestamp === 'string') return new Date(w.timestamp).getTime();
    if (typeof w.timestamp === 'number') return w.timestamp;
  }
  if (w.date) {
    const d = new Date(w.date).getTime();
    if (!isNaN(d)) return d;
  }
  return 0;
}

export default function AIPlanActive({
  activeExercises: initialActiveExercises,
  personalBests,
  sessionSets,
  archivedWorkouts,
  onSaveSet,
  onDeleteSet,
  onFinishWorkout,
  onDeactivate,
  playRestBeep,
  restTimerEnabled,
  setRestTimerEnabled,
  manualRestTime,
  setManualRestTime,
  manualRestActive,
  setManualRestActive,
  manualRestTarget,
  setManualRestTarget,
  userProfile,
  onDeleteExercise,
  onShowGuidance,
  onSwapExercise
}: AIPlanActiveProps) {
  // Copy activeExercises to state for interactive adjustments
  const [activeExercises, setActiveExercises] = useState<AIPlanExercise[]>(initialActiveExercises);

  // Synchronize local activeExercises when initialActiveExercises prop changes (e.g. on swap)
  useEffect(() => {
    setActiveExercises((prev) => {
      return initialActiveExercises.map((item, idx) => {
        const existing = prev.find(
          (p) => p.exercise.name.toLowerCase() === item.exercise.name.toLowerCase()
        );
        if (existing) {
          return existing;
        }
        const atIndex = prev[idx];
        if (atIndex && atIndex.exercise.name !== item.exercise.name) {
          return {
            ...item,
            targetSets: atIndex.targetSets
          };
        }
        return item;
      });
    });
  }, [initialActiveExercises]);

  const allLoggedSets = useMemo(() => {
    const logged: any[] = [];
    logged.push(...sessionSets);
    if (archivedWorkouts) {
      archivedWorkouts.forEach((w) => {
        if (w.sets && Array.isArray(w.sets)) {
          w.sets.forEach((s: any) => {
            logged.push({
              ...s,
              date: s.date || w.date || ""
            });
          });
        }
      });
    }
    return logged;
  }, [sessionSets, archivedWorkouts]);

  // Background active duration tracker (retained for metric logging on complete)
  const [startTime] = useState<number>(() => {
    const saved = localStorage.getItem("gym_ai_workout_start_time");
    if (saved) return parseInt(saved);
    const now = Date.now();
    localStorage.setItem("gym_ai_workout_start_time", now.toString());
    return now;
  });

  const [elapsedSec, setElapsedSec] = useState<number>(0);

  // Keep track of set inputs map
  const [setInputs, setSetInputs] = useState<
    Record<
      string,
      { weight: string; reps: string; logged: boolean; difficulty: "easy" | "moderate" | "hard" | "failure"; notes?: string }
    >
  >(() => {
    let savedObj: Record<string, any> = {};
    try {
      const saved = localStorage.getItem("gym_ai_set_inputs");
      if (saved) {
        savedObj = JSON.parse(saved);
      }
    } catch {}

    const init: Record<
      string,
      { weight: string; reps: string; logged: boolean; difficulty: "easy" | "moderate" | "hard" | "failure"; notes?: string }
    > = {};

    initialActiveExercises.forEach((exItem) => {
      const exName = exItem.exercise.name;
      const pbKey = Object.keys(personalBests || {}).find(
        (key) => normalizeExerciseName(key) === normalizeExerciseName(exName)
      );
      const pb = pbKey ? personalBests[pbKey] : null;

      // Find the most recent sets for this exercise from sessionSets (most recent current) or archivedWorkouts
      let lastSets: any[] = [];
      const currentSessionSets = (sessionSets || [])
        .filter((s) => normalizeExerciseName(s.exerciseName) === normalizeExerciseName(exName));

      if (currentSessionSets.length > 0) {
        lastSets = currentSessionSets;
      } else {
        const previousWorkouts = (archivedWorkouts || [])
          .filter((w) =>
            w.sets?.some(
              (s: any) =>
                normalizeExerciseName(s.exerciseName) === normalizeExerciseName(exName) &&
                !(Number(s.weight || 0) <= 1 || Number(s.reps || 0) <= 1)
            )
          )
          .sort((a, b) => getWorkoutTime(b) - getWorkoutTime(a));

        if (previousWorkouts.length > 0) {
          lastSets = previousWorkouts[0].sets.filter(
            (s: any) =>
              normalizeExerciseName(s.exerciseName) === normalizeExerciseName(exName) &&
              !(Number(s.weight || 0) <= 1 || Number(s.reps || 0) <= 1)
          );
        }
      }

      const isBodyweight = isBodyweightExercise(exName);
      const hasHistory = !!pb || lastSets.length > 0;
      const lastSetWeight = lastSets.length > 0 ? lastSets[lastSets.length - 1].weight?.toString() : null;
      const defaultWeight = hasHistory
        ? (lastSetWeight || (pb ? pb.bestWeight.toString() : (isBodyweight ? "0" : "60")))
        : "";
      const defaultReps = hasHistory
        ? (lastSets.length > 0 ? lastSets[lastSets.length - 1].reps?.toString() : (exItem.targetReps || "10"))
        : "";

      for (let s = 0; s < exItem.targetSets; s++) {
        const key = `${exName}-${s}`;
        const historicalSet = lastSets[s] || (lastSets.length > 0 ? lastSets[lastSets.length - 1] : null);
        
        const savedVal = savedObj[key];
        const hasSavedVal = savedVal !== undefined && savedVal !== null;
        const isSavedTestVal = hasSavedVal && (savedVal.weight === "1" || savedVal.weight === 1) && (savedVal.reps === "1" || savedVal.reps === 1);

        const prevCleanNote = historicalSet ? extractCleanNote(historicalSet.notes) : "";

        if (hasSavedVal && !isSavedTestVal) {
          init[key] = {
            ...savedVal,
            notes: (savedVal.notes !== undefined) ? savedVal.notes : prevCleanNote
          };
        } else {
          init[key] = {
            weight: historicalSet ? historicalSet.weight.toString() : defaultWeight,
            reps: historicalSet ? historicalSet.reps.toString() : defaultReps,
            logged: false,
            difficulty: historicalSet?.difficulty || "moderate",
            notes: prevCleanNote
          };
        }
      }
    });
    return init;
  });

  // Dynamically update setInputs when archivedWorkouts loads/updates or sessionSets updates (for unlogged items)
  useEffect(() => {
    setSetInputs((prev) => {
      const next = { ...prev };
      let changed = false;

      initialActiveExercises.forEach((exItem) => {
        const exName = exItem.exercise.name;
        const pbKey = Object.keys(personalBests || {}).find(
          (key) => normalizeExerciseName(key) === normalizeExerciseName(exName)
        );
        const pb = pbKey ? personalBests[pbKey] : null;

        let lastSets: any[] = [];
        const currentSessionSets = (sessionSets || [])
          .filter((s) => normalizeExerciseName(s.exerciseName) === normalizeExerciseName(exName));

        if (currentSessionSets.length > 0) {
          lastSets = currentSessionSets;
        } else {
          const previousWorkouts = (archivedWorkouts || [])
            .filter((w) =>
              w.sets?.some(
                (s: any) =>
                  normalizeExerciseName(s.exerciseName) === normalizeExerciseName(exName) &&
                  !(Number(s.weight || 0) <= 1 || Number(s.reps || 0) <= 1)
              )
            )
            .sort((a, b) => getWorkoutTime(b) - getWorkoutTime(a));

          if (previousWorkouts.length > 0) {
            lastSets = previousWorkouts[0].sets.filter(
              (s: any) =>
                normalizeExerciseName(s.exerciseName) === normalizeExerciseName(exName) &&
                !(Number(s.weight || 0) <= 1 || Number(s.reps || 0) <= 1)
            );
          }
        }

        const isBodyweight = isBodyweightExercise(exName);
        const hasHistory = !!pb || lastSets.length > 0;
        const lastSetWeight = lastSets.length > 0 ? lastSets[lastSets.length - 1].weight?.toString() : null;
        const defaultWeight = hasHistory
          ? (lastSetWeight || (pb ? pb.bestWeight.toString() : (isBodyweight ? "0" : "60")))
          : "";
        const defaultReps = hasHistory
          ? (lastSets.length > 0 ? lastSets[lastSets.length - 1].reps?.toString() : (exItem.targetReps || "10"))
          : "";

        for (let s = 0; s < exItem.targetSets; s++) {
          const key = `${exName}-${s}`;
          const historicalSet = lastSets[s] || (lastSets.length > 0 ? lastSets[lastSets.length - 1] : null);
          const targetW = historicalSet ? historicalSet.weight.toString() : defaultWeight;
          const targetR = historicalSet ? historicalSet.reps.toString() : defaultReps;
          const targetDiff = historicalSet?.difficulty || "moderate";

          // Match matching sets in sessionSets
          const sessionHasThisSet = currentSessionSets.some(
            (set) =>
              (set.notes && set.notes.startsWith(`Plan Set ${s + 1}`)) ||
              (set.notes && set.notes.startsWith(`AI Plan Set ${s + 1}`))
          );

          const prevCleanNote = historicalSet ? extractCleanNote(historicalSet.notes) : "";

          if (!prev[key]) {
            next[key] = {
              weight: targetW,
              reps: targetR,
              logged: sessionHasThisSet,
              difficulty: targetDiff,
              notes: prevCleanNote
            };
            changed = true;
          } else {
            // Update logged state if it disagrees with current session sets
            if (prev[key].logged && !sessionHasThisSet) {
              next[key] = {
                ...prev[key],
                logged: false
              };
              changed = true;
            } else if (!prev[key].logged && sessionHasThisSet) {
              next[key] = {
                ...prev[key],
                logged: true
              };
              changed = true;
            } else if (!prev[key].logged) {
              if (prev[key].notes === undefined) {
                next[key] = {
                  ...prev[key],
                  notes: prevCleanNote
                };
                changed = true;
              }
              // If there's no history, make sure it is empty (not prefilled with "60" or other defaults)
              if (!hasHistory) {
                if (prev[key].weight !== "" || prev[key].reps !== "") {
                  next[key] = {
                    ...prev[key],
                    weight: "",
                    reps: "",
                  };
                  changed = true;
                }
              } else {
                // Overwrite if it's the simple default and we actually have real history to offer
                if (prev[key].weight !== targetW || prev[key].reps !== targetR) {
                  const isBodyweight = isBodyweightExercise(exName);
                  const isGlobalDefault = (prev[key].weight === "60" || prev[key].weight === "0" || prev[key].weight === "" || prev[key].weight === "30" || prev[key].weight === "1") && (prev[key].reps === (exItem.targetReps || "10") || prev[key].reps === "" || prev[key].reps === "1");
                  if (isGlobalDefault && (historicalSet || pb)) {
                    next[key] = {
                      ...prev[key],
                      weight: targetW,
                      reps: targetR,
                      difficulty: targetDiff
                    };
                    changed = true;
                  }
                }
              }
            }
          }
        }
      });

      return changed ? next : prev;
    });
  }, [archivedWorkouts, sessionSets, initialActiveExercises, personalBests]);

  // Persist inputs to localStorage
  useEffect(() => {
    localStorage.setItem("gym_ai_set_inputs", JSON.stringify(setInputs));
  }, [setInputs]);

  // Maintain elapsed seconds counter for completion report
  useEffect(() => {
    const updateTime = () => {
      const diff = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSec(diff > 0 ? diff : 0);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  // Interactive field adjustments
  const handleAdjustWeight = (key: string, delta: number) => {
    setSetInputs((prev) => {
      const curr = prev[key] || { weight: "", reps: "", logged: false, difficulty: "moderate" };
      if (curr.logged) return prev;
      const wVal = parseFloat(curr.weight) || 0;
      const newVal = Math.max(0, wVal + delta);
      return {
        ...prev,
        [key]: { ...curr, weight: newVal.toString() }
      };
    });
  };

  const handleAdjustReps = (key: string, delta: number) => {
    setSetInputs((prev) => {
      const curr = prev[key] || { weight: "", reps: "", logged: false, difficulty: "moderate" };
      if (curr.logged) return prev;
      const rVal = parseInt(curr.reps) || 0;
      const newVal = Math.max(1, rVal + delta);
      return {
        ...prev,
        [key]: { ...curr, reps: newVal.toString() }
      };
    });
  };

  const handleDifficultyToggle = (key: string, diff: "easy" | "moderate" | "hard" | "failure") => {
    setSetInputs((prev) => {
      const curr = prev[key] || { weight: "", reps: "", logged: false, difficulty: "moderate" };
      if (curr.logged) return prev;
      return {
        ...prev,
        [key]: { ...curr, difficulty: diff }
      };
    });
  };

  const handleSetFieldChange = (key: string, field: "weight" | "reps" | "notes", value: string) => {
    setSetInputs((prev) => {
      const curr = prev[key] || { weight: "", reps: "", logged: false, difficulty: "moderate", notes: "" };
      if (curr.logged) return prev;
      return {
        ...prev,
        [key]: { ...curr, [field]: value }
      };
    });
  };

  // Log single set
  const handleLogSetRow = async (exName: string, setIdx: number) => {
    const key = `${exName}-${setIdx}`;
    const curr = setInputs[key];
    if (!curr || curr.logged) return;

    if (restTimerEnabled) {
      setManualRestTime(manualRestTarget);
      setManualRestActive(true);
      playRestBeep(1200, 0.08);
    } else {
      playRestBeep(1000, 0.05);
    }

    const setNoteText = curr.notes?.trim()
      ? `Plan Set ${setIdx + 1}: ${curr.notes.trim()}`
      : `Plan Set ${setIdx + 1}`;

    await onSaveSet(
      exName,
      curr.weight,
      curr.reps,
      setNoteText,
      curr.difficulty,
      "ai_plan"
    );

    setSetInputs((prev) => ({
      ...prev,
      [key]: { ...prev[key], logged: true }
    }));
  };

  // Undo/delete logged set
  const handleUndoLogSetRow = async (exName: string, setIdx: number) => {
    const key = `${exName}-${setIdx}`;
    // Find the logged set in sessionSets matching this exercise and notes
    const targetSet = (sessionSets || []).find(
      (s) =>
        normalizeExerciseName(s.exerciseName) === normalizeExerciseName(exName) &&
        (s.notes?.startsWith(`Plan Set ${setIdx + 1}`) || s.notes?.startsWith(`AI Plan Set ${setIdx + 1}`))
    );

    if (targetSet && targetSet.id && onDeleteSet) {
      await onDeleteSet(targetSet.id);
    }

    // Set local state logged to false
    setSetInputs((prev) => ({
      ...prev,
      [key]: { ...prev[key], logged: false }
    }));
  };

  // Set counter adjustments on the fly
  const handleAddSetInPlace = (exName: string) => {
    setActiveExercises((prev) =>
      prev.map((item) => {
        if (item.exercise.name !== exName) return item;
        const newSets = item.targetSets + 1;
        const lastKey = `${exName}-${item.targetSets - 1}`;
        const lastInput = setInputs[lastKey] || {
          weight: "",
          reps: "",
          logged: false,
          difficulty: "moderate",
          notes: ""
        };

        setSetInputs((p) => ({
          ...p,
          [`${exName}-${item.targetSets}`]: {
            weight: lastInput.weight,
            reps: lastInput.reps,
            logged: false,
            difficulty: "moderate",
            notes: ""
          }
        }));

        return { ...item, targetSets: newSets };
      })
    );
  };

  const handleRemoveSetInPlace = (exName: string) => {
    setActiveExercises((prev) =>
      prev.map((item) => {
        if (item.exercise.name !== exName || item.targetSets <= 1) return item;
        const newSets = item.targetSets - 1;
        const delKey = `${exName}-${newSets}`;
        setSetInputs((p) => {
          const c = { ...p };
          delete c[delKey];
          return c;
        });

        return { ...item, targetSets: newSets };
      })
    );
  };

  const handleRemoveExerciseInPlace = (exName: string) => {
    setActiveExercises((prev) => prev.filter((item) => item.exercise.name !== exName));
    if (onDeleteExercise) {
      onDeleteExercise(exName);
    }
  };

  // Summary Metrics
  const stats = useMemo(() => {
    let completedSets = 0;
    let totalSets = 0;
    let volume = 0;

    activeExercises.forEach((item) => {
      const exName = item.exercise.name;
      for (let s = 0; s < item.targetSets; s++) {
        totalSets++;
        const inp = setInputs[`${exName}-${s}`];
        if (inp && inp.logged) {
          completedSets++;
          const kg = parseFloat(inp.weight) || 0;
          const r = parseInt(inp.reps) || 0;
          volume += kg * r;
        }
      }
    });

    const calories = Math.round((elapsedSec / 60) * 4.2 + completedSets * 7.5);

    return {
      completedSets,
      totalSets,
      volume,
      calories,
      progress: totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0
    };
  }, [activeExercises, setInputs, elapsedSec]);

  // Grouped active exercises
  const groupedActiveExercises = useMemo(() => {
    const groups: Record<string, AIPlanExercise[]> = {};
    activeExercises.forEach((item) => {
      const g = getMuscleGroup(item.exercise);
      if (!groups[g]) {
        groups[g] = [];
      }
      groups[g].push(item);
    });

    // Sort each muscle group's exercises so compounds are first
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => {
        const catA = a.exercise.category || "isolation";
        const catB = b.exercise.category || "isolation";
        if (catA === "compound" && catB !== "compound") return -1;
        if (catA !== "compound" && catB === "compound") return 1;
        return 0;
      });
    });

    return groups;
  }, [activeExercises]);

  const handleFinishWorkoutClick = () => {
    const loggedCount = stats.completedSets;
    const vol = stats.volume;
    let feedback = "";
    if (loggedCount === 0) {
      feedback = "Somatic Diagnostics: No sets completed. Motor activation thresholds unrecorded.";
    } else {
      feedback = `Training diagnostics complete. Final training mechanical work volume logged: ${vol.toLocaleString()} kg across ${loggedCount} sets. Progressive tension successfully applied. Ready for systemic recovery.`;
    }

    onFinishWorkout(elapsedSec, stats.completedSets, stats.volume, stats.calories, feedback);

    localStorage.removeItem("gym_ai_workout_start_time");
    localStorage.removeItem("gym_ai_set_inputs");
    localStorage.removeItem("gym_ai_workout_active");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Sleek Minimal Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Progress & Metrics Card (Takes full width) */}
        <div className="md:col-span-12 w-full bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/80 border border-white/12 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_32px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-gym-accent/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-black uppercase text-gym-accent tracking-widest flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-gym-accent" />
                Routine Engagement
              </span>
              <p className="text-[10px] text-white/35 font-mono mt-0.5">
                {stats.completedSets} of {stats.totalSets} sets finalized
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black font-mono text-white">
                {stats.progress}% Completed
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div
                style={{ width: `${stats.progress}%` }}
                className="bg-gym-accent h-full transition-all duration-500 rounded-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-white/5">
            <div>
              <span className="text-[8px] font-mono text-white/35 uppercase block">
                Total Volume
              </span>
              <span className="text-xs font-bold font-mono text-white mt-0.5 block">
                {stats.volume.toLocaleString()} kg
              </span>
            </div>
            <div>
              <span className="text-[8px] font-mono text-white/35 uppercase block">
                Total Movements
              </span>
              <span className="text-xs font-bold font-mono text-white mt-0.5 block">
                {activeExercises.length} Active
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Exercises Section Grouped by Muscle Groups */}
      <div className="space-y-8">
        {MUSCLE_GROUPS.map((group) => {
          const exercisesInGroup = groupedActiveExercises[group] || [];
          if (exercisesInGroup.length === 0) return null;

          return (
            <div key={group} className="space-y-4">
              
              {/* Sleek Group Header */}
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-[10px] font-mono font-black text-gym-accent uppercase tracking-widest">
                  {group}
                </span>
                <span className="text-[8px] font-mono text-white/35">
                  ({exercisesInGroup.length} movement{exercisesInGroup.length > 1 ? "s" : ""})
                </span>
              </div>

              {/* Group Movement List */}
              <div className="space-y-4">
                {exercisesInGroup.map((exItem) => {
                  const exName = exItem.exercise.name;
                  const pb = personalBests[exName];
                  const progState = getExerciseProgressionState(exName, allLoggedSets, setInputs);

                  let compSets = 0;
                  for (let s = 0; s < exItem.targetSets; s++) {
                    if (setInputs[`${exName}-${s}`]?.logged) compSets++;
                  }
                  const isDone = compSets === exItem.targetSets && exItem.targetSets > 0;

                  // Count completed sets and check for recommendations
                  const loggedSets = Array.from({ length: exItem.targetSets })
                    .map((_, sIdx) => {
                      const key = `${exName}-${sIdx}`;
                      return { sIdx, key, ...setInputs[key] };
                    })
                    .filter((s) => s && s.logged);

                  // Group logged sets by their weight to see if they completed at least 3 sets at easy or moderate at a given weight
                  const weightGroups: Record<string, typeof loggedSets> = {};
                  loggedSets.forEach((set) => {
                    const w = set.weight;
                    if (w) {
                      if (!weightGroups[w]) weightGroups[w] = [];
                      weightGroups[w].push(set);
                    }
                  });

                  let recommendIncrease = false;
                  let targetWeightStr = "";
                  let recommendedWeightStr = "";

                   for (const [wStr, sets] of Object.entries(weightGroups)) {
                    const easyModSets = sets.filter(
                      (s) => s.difficulty === "easy" || s.difficulty === "moderate"
                    );
                    const hasHard = sets.some(
                      (s) => s.difficulty === "hard"
                    );
                    const has10PlusReps = sets.some((s) => {
                      const r = parseInt(s.reps, 10);
                      return !isNaN(r) && r >= 10;
                    });
                    if (easyModSets.length >= 3 && !hasHard && has10PlusReps) {
                      recommendIncrease = true;
                      targetWeightStr = wStr;
                      const wNum = parseFloat(wStr);
                      recommendedWeightStr = isNaN(wNum) ? wStr : (wNum + 2.5).toString();
                      break;
                    }
                  }

                  return (
                    <div
                      key={exName}
                      className={`bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/80 border border-l-4 rounded-2xl p-4 sm:p-5 backdrop-blur-md transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_32px_rgba(0,0,0,0.8)] ${
                        isDone
                          ? "border-white/12 border-l-emerald-500 hover:border-emerald-500/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_0_20px_rgba(16,185,129,0.15)]"
                          : "border-white/12 border-l-red-500 hover:border-red-500/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_0_20px_rgba(239,68,68,0.15)]"
                      }`}
                    >
                      {/* Sub-header row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-3 mb-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                              isDone
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : "bg-white/[0.02] border-white/5 text-white/30"
                            }`}
                          >
                            <Dumbbell className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                              {exName}
                              {isDone && (
                                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3] shrink-0" />
                              )}
                            </h3>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-black uppercase tracking-wider ${
                                (exItem.exercise.category || "isolation") === "compound"
                                  ? "bg-gym-accent/15 border border-gym-accent/20 text-gym-accent"
                                  : "bg-blue-500/15 border border-blue-500/20 text-blue-400"
                              }`}>
                                {exItem.exercise.category || "isolation"}
                              </span>
                              {exItem.exercise.pool && (
                                <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 text-[8px] font-mono font-bold uppercase tracking-wider">
                                  {exItem.exercise.pool.replace("_", " ")}
                                </span>
                              )}
                              {pb && (
                                <span className="text-[8px] font-mono text-gym-accent font-bold bg-gym-accent/5 border border-gym-accent/10 px-1.5 py-0.5 rounded">
                                  PB: {pb.bestWeight}kg × {pb.bestReps}
                                </span>
                              )}
                              {progState.showTag && (
                                <span className="bg-emerald-500/15 border border-emerald-500/30 text-[#34d399] text-[8px] font-mono font-black uppercase px-1.5 py-0.5 rounded tracking-wider flex items-center gap-1">
                                  🚀 Increase Weight
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Fast inline set managers */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          {onSwapExercise && (
                            <button
                              onClick={() => onSwapExercise(exItem.exercise)}
                              className="px-2 py-1 bg-white/5 border border-white/10 hover:bg-gym-accent hover:text-black hover:border-gym-accent text-[8.5px] font-mono text-white/60 rounded-md uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shrink-0"
                              title="Swap Exercise"
                            >
                              <RefreshCw className="w-2.5 h-2.5" /> Swap
                            </button>
                          )}
                          {onShowGuidance && (
                            <button
                              onClick={() => onShowGuidance(exItem.exercise)}
                              className="px-2 py-1 bg-gym-accent/15 border border-gym-accent/30 hover:bg-gym-accent hover:text-black text-[8.5px] font-mono text-gym-accent rounded-md uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shrink-0"
                              title="View Guidance"
                            >
                              <BookOpen className="w-2.5 h-2.5" /> Guide
                            </button>
                          )}
                          <button
                            onClick={() => handleAddSetInPlace(exName)}
                            className="px-2 py-1 bg-white/5 border border-white/10 text-[8.5px] font-mono text-white/60 hover:bg-white/10 rounded-md uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shrink-0"
                          >
                            <Plus className="w-2.5 h-2.5" /> Set
                          </button>
                          <button
                            onClick={() => handleRemoveSetInPlace(exName)}
                            disabled={exItem.targetSets <= 1}
                            className="px-2 py-1 bg-white/5 border border-white/10 disabled:opacity-25 text-[8.5px] font-mono text-white/60 hover:bg-white/10 rounded-md uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shrink-0"
                          >
                            <Minus className="w-2.5 h-2.5" /> Set
                          </button>
                          <button
                            onClick={() => handleRemoveExerciseInPlace(exName)}
                            className="p-1 bg-white/5 hover:bg-red-500/10 text-white/30 hover:text-red-400 border border-white/10 rounded-md transition-all cursor-pointer shrink-0"
                            title="Remove movement"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {recommendIncrease && (
                        <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex flex-col gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                          <div className="flex items-center gap-1.5 justify-between">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] font-mono text-emerald-400 flex items-center gap-1.5">
                              <Activity className="w-3.5 h-3.5 animate-pulse" />
                              PROGRESSION TARGET ACQUIRED
                            </span>
                            <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-mono font-bold">
                              🚀 Increase Weight
                            </span>
                          </div>
                          <p className="text-[10px] text-white/70 leading-relaxed font-sans">
                            You completed <strong className="text-white">3 sets</strong> at <span className="text-emerald-400 font-mono font-bold">{targetWeightStr}kg</span> with Easy/Moderate intensity! Double-progression triggered. Upgrade your weight for unlogged sets.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setSetInputs((prev) => {
                                const next = { ...prev };
                                for (let s = 0; s < exItem.targetSets; s++) {
                                  const key = `${exName}-${s}`;
                                  if (next[key] && !next[key].logged) {
                                    next[key] = {
                                      ...next[key],
                                      weight: recommendedWeightStr
                                    };
                                  }
                                }
                                return next;
                              });
                            }}
                            className="w-full mt-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-black font-semibold rounded-md text-[9px] font-black uppercase tracking-[0.15em] font-mono transition-all cursor-pointer shadow-md shadow-emerald-500/15 text-center"
                          >
                            🚀 Apply Suggested Weight Increase to Remaining Sets
                          </button>
                        </div>
                      )}

                      {/* Interactive log rows - Fully Responsive Vertical Design to Avoid Horizontal Scrolling */}
                      <div className="space-y-3">
                        {Array.from({ length: exItem.targetSets }).map((_, sIdx) => {
                          const key = `${exName}-${sIdx}`;
                          const isBodyweight = isBodyweightExercise(exName);
                          const isCardio = exItem.exercise?.pool === "cardio" ||
                            ["treadmill", "run", "cardio", "hike", "stair", "bike", "row", "elliptical", "walk"]
                              .some((term) => exName.toLowerCase().includes(term));
                          
                          const pbKey = Object.keys(personalBests || {}).find(
                            (k) => normalizeExerciseName(k) === normalizeExerciseName(exName)
                          );
                          const pb = pbKey ? personalBests[pbKey] : null;
                          const hasPB = !!pbKey;

                          let lastSets: any[] = [];
                          const currentSessionSets = (sessionSets || [])
                            .filter((s) => normalizeExerciseName(s.exerciseName) === normalizeExerciseName(exName));

                          if (currentSessionSets.length > 0) {
                            lastSets = currentSessionSets;
                          } else {
                            const previousWorkouts = (archivedWorkouts || [])
                              .filter((w) =>
                                w.sets?.some(
                                  (s: any) =>
                                    normalizeExerciseName(s.exerciseName) === normalizeExerciseName(exName) &&
                                    !(Number(s.weight || 0) <= 1 || Number(s.reps || 0) <= 1)
                                )
                              )
                              .sort((a, b) => getWorkoutTime(b) - getWorkoutTime(a));

                            if (previousWorkouts.length > 0) {
                              lastSets = previousWorkouts[0].sets.filter(
                                (s: any) =>
                                  normalizeExerciseName(s.exerciseName) === normalizeExerciseName(exName) &&
                                  !(Number(s.weight || 0) <= 1 || Number(s.reps || 0) <= 1)
                              );
                            }
                          }
                          const hasHistory = hasPB || lastSets.length > 0;

                          const rowState = setInputs[key] || {
                            weight: hasHistory ? (isCardio ? "15" : isBodyweight ? "0" : "60") : "",
                            reps: hasHistory ? (isCardio ? "1" : "10") : "",
                            logged: false,
                            difficulty: "moderate"
                          };
                          const isLogged = rowState.logged;

                          return (
                            <div
                              key={sIdx}
                              className={`p-3 rounded-xl border transition-all flex flex-col gap-3 ${
                                isLogged
                                  ? "bg-white/[0.01] border-white/5 opacity-50"
                                  : "bg-black/20 border-white/5 hover:border-white/10"
                              }`}
                            >
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                {/* Set Badge & Best Target */}
                                <div className="flex items-center justify-between md:justify-start gap-4 shrink-0">
                                  <span className="font-mono font-black text-xs text-white/80">
                                    Set {sIdx + 1}
                                  </span>
                                  {pb ? (
                                    <span className="text-[10.5px] font-mono text-white/35">
                                      Target: {isCardio ? `${pb.bestWeight} min @ Lvl ${pb.bestReps}` : `${pb.bestWeight}kg × ${pb.bestReps}`}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-mono text-white/20">
                                      No PB
                                    </span>
                                  )}
                                </div>

                              {/* Interactive Increment Controllers */}
                              <div className="grid grid-cols-2 md:flex md:items-center gap-4 flex-1 md:justify-end">
                                {/* Slot 1 control block (Weight / Duration) */}
                                <div className="space-y-1 md:space-y-0 md:flex md:items-center md:gap-2">
                                  <span className="text-[9px] font-mono font-bold text-white/50 uppercase tracking-wider block">
                                    {isCardio ? "Duration (min)" : "Weight (kg)"}
                                  </span>
                                  <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-lg p-0.5 max-w-[130px] md:w-[110px]">
                                    <button
                                      type="button"
                                      disabled={isLogged}
                                      onClick={() => handleAdjustWeight(key, -0.5)}
                                      className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-white/70 flex items-center justify-center font-bold text-xs cursor-pointer shrink-0"
                                    >
                                      -
                                    </button>
                                    <input
                                      type="text"
                                      disabled={isLogged}
                                      value={rowState.weight}
                                      onChange={(e) =>
                                        handleSetFieldChange(key, "weight", e.target.value)
                                      }
                                      className="bg-transparent text-center text-xs font-mono font-bold text-white w-10 outline-none"
                                    />
                                    <button
                                      type="button"
                                      disabled={isLogged}
                                      onClick={() => handleAdjustWeight(key, 0.5)}
                                      className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-white/70 flex items-center justify-center font-bold text-xs cursor-pointer shrink-0"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                {/* Slot 2 control block (Reps / Incline / Level) */}
                                <div className="space-y-1 md:space-y-0 md:flex md:items-center md:gap-2">
                                  <span className="text-[9px] font-mono font-bold text-white/50 uppercase tracking-wider block">
                                    {isCardio ? "Level / Incline" : "Reps"}
                                  </span>
                                  <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-lg p-0.5 max-w-[110px] md:w-[90px]">
                                    <button
                                      type="button"
                                      disabled={isLogged}
                                      onClick={() => handleAdjustReps(key, -1)}
                                      className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-white/70 flex items-center justify-center font-bold text-xs cursor-pointer shrink-0"
                                    >
                                      -
                                    </button>
                                    <input
                                      type="text"
                                      disabled={isLogged}
                                      value={rowState.reps}
                                      onChange={(e) =>
                                        handleSetFieldChange(key, "reps", e.target.value)
                                      }
                                      className="bg-transparent text-center text-xs font-mono font-bold text-white w-8 outline-none"
                                    />
                                    <button
                                      type="button"
                                      disabled={isLogged}
                                      onClick={() => handleAdjustReps(key, 1)}
                                      className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-white/70 flex items-center justify-center font-bold text-xs cursor-pointer shrink-0"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Intensity Pills & Log status block */}
                              <div className="flex items-center justify-between md:justify-end gap-3 border-t border-white/5 pt-2.5 md:pt-0 md:border-0 shrink-0">
                                {/* Intensity Selectors */}
                                <div className="flex items-center gap-1">
                                  {(["easy", "moderate", "hard", "failure"] as const).map((diff) => {
                                    const active = rowState.difficulty === diff;
                                    let theme = "";
                                    if (diff === "easy")
                                      theme = active
                                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                                        : "text-white/20 hover:text-emerald-400/50";
                                    else if (diff === "moderate")
                                      theme = active
                                        ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                                        : "text-white/20 hover:text-amber-400/50";
                                    else if (diff === "hard")
                                      theme = active
                                        ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                                        : "text-white/20 hover:text-rose-400/50";
                                    else
                                      theme = active
                                        ? "bg-purple-500/25 border-purple-500/50 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                                        : "text-white/20 hover:text-purple-400/50";

                                    return (
                                      <button
                                        key={diff}
                                        type="button"
                                        disabled={isLogged}
                                        onClick={() => handleDifficultyToggle(key, diff)}
                                        className={`px-1.5 py-0.5 border border-transparent rounded text-[8px] font-mono font-extrabold uppercase tracking-wide cursor-pointer transition-all ${theme}`}
                                        title={diff === "failure" ? "Till Failure" : `${diff} intensity`}
                                      >
                                        {diff === "failure" ? "F" : diff.slice(0, 3)}
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Save Button */}
                                <div>
                                  {isLogged ? (
                                    <div className="flex items-center gap-1.5">
                                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" title="Set logged">
                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleUndoLogSetRow(exName, sIdx)}
                                        className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/20 hover:border-red-500 transition-all cursor-pointer group shrink-0"
                                        title="Undo completion (removes from session log)"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleLogSetRow(exName, sIdx)}
                                      className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/5 hover:bg-gym-accent hover:text-black border border-white/10 hover:border-gym-accent transition-all cursor-pointer group"
                                      title="Log this set"
                                    >
                                      <Check className="w-3.5 h-3.5 text-white/35 group-hover:text-black transition-colors" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Notes Section */}
                              <div className="border-t border-white/5 pt-2 flex items-center gap-2">
                                <span className="text-[9px] font-mono font-bold uppercase text-white/35 shrink-0">
                                  Notes:
                                </span>
                                <input
                                  type="text"
                                  disabled={isLogged}
                                  placeholder="e.g. used neutral handle, focused on slow negatives..."
                                  value={rowState.notes || ""}
                                  onChange={(e) =>
                                    handleSetFieldChange(key, "notes", e.target.value)
                                  }
                                  className="bg-transparent text-[11px] text-white/80 placeholder:text-white/20 w-full outline-none border-b border-white/5 hover:border-white/10 focus:border-gym-accent/40 pb-0.5 transition-colors"
                                />
                              </div>

                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
