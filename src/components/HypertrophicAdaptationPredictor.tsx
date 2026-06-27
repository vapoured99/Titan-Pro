import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RotateCcw,
  Zap,
  TrendingDown,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Dumbbell,
  AlertCircle,
  RefreshCw,
  Gauge,
  ChevronRight,
  Workflow
} from "lucide-react";
import { POOLS } from "../data/exercises";

interface SessionSet {
  id?: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}

interface HypertrophicAdaptationPredictorProps {
  sessionSets: SessionSet[];
  archivedWorkouts: any[];
}

export const HypertrophicAdaptationPredictor: React.FC<HypertrophicAdaptationPredictorProps> = ({
  sessionSets = [],
  archivedWorkouts = [],
}) => {
  const [selectedMuscle, setSelectedMuscle] = useState<string>("chest");
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Helper to resolve muscle group & category of an exercise Name
  const resolveExerciseMeta = (name: string) => {
    if (!name) return { group: "other", isCompound: false };
    const cleanName = name.trim().toLowerCase();

    const normalizeGroup = (raw: string | null): string => {
      if (!raw) return 'other';
      const rg = raw.toLowerCase().trim();
      if (['front_delts', 'side_delts', 'rear_delts', 'shoulders', 'side-delts', 'rear-delts'].includes(rg)) return 'shoulders';
      if (['upper_core', 'lower_core', 'obliques', 'core'].includes(rg)) return 'core';
      if (['upper_chest', 'middle_chest', 'lower_chest', 'chest'].includes(rg)) return 'chest';
      if (['long_biceps', 'short_biceps', 'brachialis', 'biceps'].includes(rg)) return 'biceps';
      if (['long_triceps', 'lateral_triceps', 'medial_triceps', 'triceps'].includes(rg)) return 'triceps';
      if (['back', 'upper_back', 'lats', 'rhomboids_traps'].includes(rg)) return 'back';
      if (['lower_back', 'erector_spinae'].includes(rg)) return 'posterior_spine';
      if (['quads'].includes(rg)) return 'quads';
      if (['hamstrings', 'glutes', 'calves'].includes(rg)) return 'posterior_legs';
      return 'other';
    };

    // Scan pools
    for (const [poolKey, exercises] of Object.entries(POOLS)) {
      const ex = exercises.find((e: any) => e.name.trim().toLowerCase() === cleanName);
      if (ex) {
        return {
          group: normalizeGroup(ex.muscleGroup || ex.pool || poolKey),
          isCompound: ex.category === "compound" || cleanName.includes("press") || cleanName.includes("squat") || cleanName.includes("deadlift") || cleanName.includes("rows")
        };
      }
    }
    
    // Incase of missing matches, generic heuristic search
    if (cleanName.includes("bench") || cleanName.includes("chest") || cleanName.includes("dip")) {
      return { group: "chest", isCompound: true };
    }
    if (cleanName.includes("row") || cleanName.includes("pull") || cleanName.includes("lat")) {
      return { group: "back", isCompound: true };
    }
    if (cleanName.includes("press") && (cleanName.includes("shoulder") || cleanName.includes("overhead") || cleanName.includes("military") || cleanName.includes("ohp"))) {
      return { group: "shoulders", isCompound: true };
    }
    if (cleanName.includes("squat") || cleanName.includes("leg press")) {
      return { group: "quads", isCompound: true };
    }
    if (cleanName.includes("bicep") || (cleanName.includes("curl") && !cleanName.includes("leg")) || cleanName.includes("preacher")) {
      return { group: "biceps", isCompound: false };
    }
    if (cleanName.includes("tricep") || cleanName.includes("pushdown") || cleanName.includes("skullcrusher") || cleanName.includes("skull crusher")) {
      return { group: "triceps", isCompound: false };
    }
    if (cleanName.includes("deadlift") || cleanName.includes("rdl") || (cleanName.includes("curl") && cleanName.includes("leg"))) {
      return { group: "posterior_legs", isCompound: true };
    }

    return { group: "other", isCompound: false };
  };

  // Organize workouts into weeks and evaluate repeated movements
  const adaptationMetrics = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const getDaysBetween = (d1: Date, d2: Date) => {
      const diffTime = Math.abs(d1.getTime() - d2.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Prepare chronological weeks (Week 0 is current week, Week 1 is past 7-14 days etc.)
    const weekBuckets: Record<number, Record<string, Set<string>>> = {};
    for (let w = 0; w <= 5; w++) {
      weekBuckets[w] = {
        chest: new Set(),
        back: new Set(),
        shoulders: new Set(),
        quads: new Set(),
        posterior_legs: new Set(),
        biceps: new Set(),
        triceps: new Set(),
      };
    }

    // Process current live session sets (Week 0)
    sessionSets.forEach((s) => {
      const meta = resolveExerciseMeta(s.exerciseName);
      if (meta.group in weekBuckets[0]) {
        weekBuckets[0][meta.group].add(s.exerciseName.trim());
      }
    });

    // Process archived workouts (Weeks 0 to 5)
    archivedWorkouts.forEach((w) => {
      if (!w?.date) return;
      const workoutDate = new Date(w.date + 'T00:00:00');
      if (isNaN(workoutDate.getTime())) return;

      const daysAgo = getDaysBetween(today, workoutDate);
      const weekIndex = Math.floor(daysAgo / 7);

      if (weekIndex >= 0 && weekIndex <= 5 && w.sets && Array.isArray(w.sets)) {
        w.sets.forEach((s: any) => {
          const meta = resolveExerciseMeta(s.exerciseName);
          if (meta.group in weekBuckets[weekIndex]) {
            weekBuckets[weekIndex][meta.group].add(s.exerciseName.trim());
          }
        });
      }
    });

    const categories = [
      { id: "chest", label: "Chest Pressing", primaryMuscle: "Main Chest Muscles" },
      { id: "back", label: "Back Rowing & Pulling", primaryMuscle: "Upper Back & Lats" },
      { id: "shoulders", label: "Shoulder Pressing", primaryMuscle: "Shoulder Muscles" },
      { id: "quads", label: "Quad Exercises", primaryMuscle: "Front Thighs" },
      { id: "posterior_legs", label: "Hamstrings & Glutes", primaryMuscle: "Back Legs & Glutes" },
      { id: "biceps", label: "Bicep Exercises", primaryMuscle: "Front Arms" },
      { id: "triceps", label: "Tricep Exercises", primaryMuscle: "Back Arms" },
    ];

    const results = categories.map((cat) => {
      // Find consecutive weeks carrying the same physical exercise
      // We look at week 0 down to week 5
      let maxConsecutiveWeeks = 0;
      const weeklyExercises = Array.from({ length: 6 }).map((_, i) => Array.from(weekBuckets[i][cat.id]));
      
      // Calculate how many weeks in a row we did any of the same exercise
      const allHistoricExercises = new Set<string>();
      weeklyExercises.forEach(week => week.forEach(ex => allHistoricExercises.add(ex)));

      let streakCalculated = 0;
      let targetConsistentExercise = "";

      // Look for the exercise which is most repeated week-on-week
      let highestExerciseStreak = 0;
      allHistoricExercises.forEach(exercise => {
        let currentStreak = 0;
        let activeStreak = 0;
        // Scan backwards starting from Week 0 or the first active week
        for (let w = 0; w <= 5; w++) {
          if (weekBuckets[w][cat.id].has(exercise)) {
            activeStreak++;
            if (activeStreak > currentStreak) {
              currentStreak = activeStreak;
            }
          } else {
            activeStreak = 0;
          }
        }
        if (currentStreak > highestExerciseStreak) {
          highestExerciseStreak = currentStreak;
          targetConsistentExercise = exercise;
        }
      });

      maxConsecutiveWeeks = highestExerciseStreak;

      // Base responsiveness math (Muscle Adaptation / Repeated Bout Effect)
      // High responsiveness (fresh stimulus): 100%. Plateau: 15-20%.
      let receptivityValue = 100;
      let statusLabel = "High Progress Potential";
      let statusDesc = "Your muscles are highly responsive to this exercise right now. Excellent phase for building strength and size.";
      let themeColor = "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
      let barColor = "bg-emerald-400";

      if (maxConsecutiveWeeks === 2) {
        receptivityValue = 85;
        statusLabel = "Optimal Zone";
        statusDesc = "You are currently well-adjusted to this movement. Strength gains are standard and performing well.";
        themeColor = "text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
        barColor = "bg-cyan-400";
      } else if (maxConsecutiveWeeks === 3) {
        receptivityValue = 68;
        statusLabel = "Gradual Adaptation";
        statusDesc = "Your muscles are adapting to this specific movement angle. Gains may begin to slow down slightly.";
        themeColor = "text-violet-400 border-violet-500/20 bg-violet-500/5";
        barColor = "bg-violet-400";
      } else if (maxConsecutiveWeeks === 4) {
        receptivityValue = 45;
        statusLabel = "Highly Adapted";
        statusDesc = "Your body is highly adjusted to this exact loading angle. We suggest swapping this exercise soon to spark new progress.";
        themeColor = "text-amber-500 border-amber-500/20 bg-amber-500/5";
        barColor = "bg-amber-500";
      } else if (maxConsecutiveWeeks >= 5) {
        receptivityValue = 20;
        statusLabel = "Plateau Zone";
        statusDesc = "You have hit adaptation limit on this movement. Rotate to a new recommended exercise to unlock fresh growth.";
        themeColor = "text-red-400 border-red-500/20 bg-red-500/5";
        barColor = "bg-red-500";
      }

      // Generate rotation targets based on POOLS context
      const exerciseRotations: Record<string, string[]> = {
        chest: [
          "Incline Dumbbell Chest Press",
          "Barbell Incline Bench Press",
          "Chest Dip",
          "Weighted Push Ups",
          "Cable Chest Press",
        ],
        back: [
          "Weighted Pull Ups",
          "Barbell Pendlay Row",
          "Chest Supported Dumbbell Row",
          "Meadows Row",
          "Lat Pulldowns (Wide Grip)",
        ],
        shoulders: [
          "Seated Dumbbell Shoulder Press",
          "Barbell Overhead Press",
          "Behind the Neck Press",
          "Incline Dumbbell Front Raise",
        ],
        quads: [
          "Front Squat",
          "Leg Press (High Stance)",
          "Hack Squat (Decline)",
          "Goblet Squat (Heels Elevated)",
        ],
        posterior_legs: [
          "Romanian Deadlift",
          "Deficit Deadlift",
          "Glute Ham Raise",
          "Lying Leg Curls",
          "Barbell Hip Thrusts",
        ],
        biceps: [
          "Incline Dumbbell Curls",
          "Hammer Curls",
          "Preacher Curls",
          "Spider Curls",
          "Cable Bicep Curls",
        ],
        triceps: [
          "Weighted Tricep Dips",
          "EZ-Bar Skull Crushers",
          "Tricep Rope Pushdowns",
          "Close Grip Bench Press",
          "Overhead Dumbbell Tricep Extension",
        ]
      };

      // Ensure we don't suggest the current consistent exercise
      const suggestedRotations = (exerciseRotations[cat.id] || [])
        .filter(exName => exName.toLowerCase() !== targetConsistentExercise.toLowerCase())
        .slice(0, 3);

      return {
        ...cat,
        consecutiveWeeks: maxConsecutiveWeeks,
        targetExercise: targetConsistentExercise || "None (Rotated/Fresh)",
        receptivity: receptivityValue,
        statusLabel,
        statusDesc,
        themeColor,
        barColor,
        suggestedRotations,
        weeklyExercises,
      };
    });

    return results;
  }, [sessionSets, archivedWorkouts]);

  const activeCategoryData = useMemo(() => {
    return adaptationMetrics.find((item) => item.id === selectedMuscle) || adaptationMetrics[0];
  }, [adaptationMetrics, selectedMuscle]);

  return (
    <div className="bg-[#050506] border border-white/10 rounded-md p-6 relative overflow-hidden space-y-6" id="hypertrophic-adaptations-panel">
      {/* Background neon dynamic grid element */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(34,197,94,0.015)_0%,transparent_60%)] pointer-events-none" />

      {/* Header element */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[8px] font-mono tracking-[0.25em] text-white/40 uppercase">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            EXERCISE VARIETY & PROGRESS TRAIL ANALYZER
          </div>
          <h3 className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-2">
            📉 MUSCLE ADAPTATION & PLATEAU PREDICTOR
          </h3>
          <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider">
            Analyzes your workout history to identify when your muscles have fully adapted to certain exercises, helping you rotate movements to keep making progress.
          </p>
        </div>

        {/* Dynamic Help Controller */}
        <div>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[9.5px] font-mono rounded-md border border-white/10 cursor-pointer transition-all uppercase"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {showExplanation ? "Hide Info" : "How It Works"}
          </button>
        </div>
      </div>

      {/* Experimental Science Expansion Board */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-md space-y-3 text-[10px] leading-relaxed text-white/60 font-mono uppercase">
              <span className="text-[10.5px] text-emerald-400 font-black block flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                THE IMPORTANCE OF EXERCISE ROTATION
              </span>
              <p>
                When you do a new exercise for the first time, it challenges your muscles in a fresh way, promoting high levels of muscle tension and micro-tears that trigger <strong className="text-white">new muscle growth and strength</strong>.
              </p>
              <p>
                However, after repeating the exact same exercise (like the barbell bench press or squats) for <strong className="text-white">4 to 5 weeks in a row</strong>, your nervous system and muscle fibers become highly adapted to that exact angle and movement path. Because of this adaptation, the exercise becomes less effective over time.
              </p>
              <p>
                <strong className="text-white">The Solution:</strong> By swapping your main lifts for another high-quality variation (for example, switching from Flat Barbell Bench Press to Incline Dumbbell Bench Press, or from Back Squats to Front Squats) every 4 to 6 weeks, you challenge your body in a brand-new way to stimulate fresh growth and bypass training plateaus!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 cols: Muscle Category Receptivity Dashboard */}
        <div className="lg:col-span-6 space-y-4">
          <span className="text-[8px] font-mono text-white/30 tracking-widest uppercase block border-b border-white/5 pb-1.5">
            YOUR ESTIMATED MUSCLE PROGRESS POTENTIAL
          </span>

          <div className="space-y-3.5">
            {adaptationMetrics.map((item) => {
              const isSelected = selectedMuscle === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMuscle(item.id)}
                  className={`p-3 border rounded-md transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-white/[0.03] border-white/20 shadow-xs"
                      : "bg-[#020203] border-white/5 hover:border-white/10 hover:bg-white/[0.01]"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Dumbbell className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-400" : "text-white/30"}`} />
                        <h4 className="text-[11px] font-black tracking-wide text-white uppercase">{item.label}</h4>
                      </div>
                      <span className="text-[8.5px] text-white/30 font-mono block uppercase">{item.primaryMuscle}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[7.5px] text-white/30 font-mono uppercase block">RESPONSIVENESS</span>
                      <span className={`text-[10px] font-mono font-black ${item.receptivity < 50 ? "text-red-400" : item.receptivity < 75 ? "text-amber-400" : "text-emerald-400"}`}>
                        {item.receptivity}%
                      </span>
                    </div>
                  </div>

                  {/* Receptivity Slider Rating */}
                  <div className="mt-2.5 space-y-1">
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${item.barColor}`}
                        style={{ width: `${item.receptivity}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-white/40 uppercase">
                      <span>Streak: {item.consecutiveWeeks} weeks in a row</span>
                      <span className="font-bold">{item.statusLabel}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 6 cols: Deep Adaptation Report & Rotation Blueprint */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-black/60 border border-white/5 rounded-md p-4 space-y-4 font-mono font-mono">
            <span className="text-[8px] text-white/40 tracking-widest uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Gauge className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              ADAPTATION STATUS &bull; {activeCategoryData.label}
            </span>

            {/* Current status summary info panel */}
            <div className={`p-3.5 rounded-md border ${activeCategoryData.themeColor} space-y-1 cursor-default`}>
              <div className="flex items-center justify-between text-[11px] font-black uppercase">
                <span>STIMULUS POTENTIAL: {activeCategoryData.statusLabel}</span>
                <span className="text-xs">{activeCategoryData.receptivity}%</span>
              </div>
              <p className="text-[9.5px] text-white/70 leading-relaxed uppercase">
                {activeCategoryData.statusDesc}
              </p>
            </div>

            {/* Dynamic Telemetry Matrix */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="p-3 bg-[#030304] border border-white/5 rounded">
                <span className="text-[7px] text-white/30 uppercase tracking-widest block">Most Repeated Exercise</span>
                <span className="text-[11px] text-white font-bold block mt-1 truncate uppercase">
                  {activeCategoryData.targetExercise}
                </span>
                <span className="text-[7.2px] text-white/40 uppercase block mt-0.5">
                  Done for {activeCategoryData.consecutiveWeeks} weeks straight
                </span>
              </div>

              <div className="p-3 bg-[#030304] border border-white/5 rounded">
                <span className="text-[7px] text-white/30 uppercase tracking-widest block">Recommended Action</span>
                <span className="text-[11px] text-[#ffdf00] font-black block mt-1 uppercase">
                  {activeCategoryData.consecutiveWeeks >= 4 ? "SWAP EXERCISE" : "KEEP EXERCISE"}
                </span>
                <span className="text-[7.2px] text-white/40 uppercase block mt-0.5">
                  {activeCategoryData.consecutiveWeeks >= 4 ? "Ready for a new movement" : "Still yielding strong gains"}
                </span>
              </div>
            </div>

            {/* Suggestion blueprint block targeting the selected muscle group rotation variations */}
            <div className="space-y-2 pt-1">
              <span className="text-[8.5px] text-white/30 uppercase tracking-wider block">
                🧬 RECOMMENDED REPLACEMENT EXERCISES (RESTORE GROWTH POTENTIAL)
              </span>

              <div className="space-y-2">
                {activeCategoryData.suggestedRotations.length > 0 ? (
                  activeCategoryData.suggestedRotations.map((altName, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-md flex items-center justify-between hover:bg-emerald-500/10 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded-md">
                          OPTION {i + 1}
                        </span>
                        <span className="text-[10px] font-bold text-white uppercase truncate">{altName}</span>
                      </div>
                      <span className="text-[7.5px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                        +100% FRESH EFFORT
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center bg-white/[0.01] border border-white/5 rounded text-[10px] text-white/40 uppercase">
                    No historic exercises logged. Add some exercises to get personalized recommended swaps!
                  </div>
                )}
              </div>
            </div>

            {/* Micro warning indicator */}
            {activeCategoryData.consecutiveWeeks >= 4 && (
              <div className="p-2.5 bg-amber-500/5 border border-amber-500/15 text-amber-500 rounded-md flex items-start gap-2.5 text-[9px] uppercase leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                <div>
                  <span className="font-bold block">Plateau Warning</span>
                  Performing <strong className="text-white">{activeCategoryData.targetExercise}</strong> for this many weeks has reached adaptation limits. Your strength and growth gains may slow down soon due to muscular memory. We recommend introducing one of the alternative exercises above.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
