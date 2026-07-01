import React from "react";
import { motion } from "motion/react";
import { ArrowUp, Check } from "lucide-react";

interface ConsoleCViewProps {
  profile: any;
  syncedProfile: any;
  archivedWorkouts: any[];
  sessionSets: any[];
  cnsFatigueAnalysis: any;
  chronologicalDaysConsole: any[];
  activeTheme: any;
  setActiveView: (view: any) => void;
  consoleCProfile: "hyper" | "flow" | "power" | "recovery";
  setConsoleCProfile: (profile: "hyper" | "flow" | "power" | "recovery") => void;
}

export default function ConsoleCView({
  archivedWorkouts,
  sessionSets,
  consoleCProfile,
  setConsoleCProfile,
}: ConsoleCViewProps) {
  // Muscle recovery tracker state
  const [muscleRecovery, setMuscleRecovery] = React.useState<Record<string, { percent: number; advice: string }>>(() => {
    try {
      const s = localStorage.getItem("somatic_muscle_recovery");
      return s ? JSON.parse(s) : {
        Chest: { percent: 90, advice: "Optimized. Perfect for heavy push routines." },
        Back: { percent: 75, advice: "Slight soreness. Recommended: Light warm-ups." },
        Legs: { percent: 50, advice: "Heavy fatigue. Target: Stretching & hydration." },
        Shoulders: { percent: 85, advice: "Excellent capacity. Ready for overhead lifts." },
        Arms: { percent: 95, advice: "Fully recovered. Fully hydrated glycogen pools." }
      };
    } catch {
      return {
        Chest: { percent: 90, advice: "Optimized. Perfect for heavy push routines." },
        Back: { percent: 75, advice: "Slight soreness. Recommended: Light warm-ups." },
        Legs: { percent: 50, advice: "Heavy fatigue. Target: Stretching & hydration." },
        Shoulders: { percent: 85, advice: "Excellent capacity. Ready for overhead lifts." },
        Arms: { percent: 95, advice: "Fully recovered. Fully hydrated glycogen pools." }
      };
    }
  });

  const performActiveRecovery = (muscle: string) => {
    setMuscleRecovery((prev) => {
      const updated = {
        ...prev,
        [muscle]: {
          ...prev[muscle],
          percent: Math.min(100, prev[muscle].percent + 15)
        }
      };
      localStorage.setItem("somatic_muscle_recovery", JSON.stringify(updated));
      return updated;
    });
  };

  // SMART Lift Targets State
  const [liftGoals, setLiftGoals] = React.useState<Record<string, { current: number; target: number }>>(() => {
    try {
      const s = localStorage.getItem("somatic_lift_goals");
      return s ? JSON.parse(s) : {
        bench: { current: 85, target: 100 },
        squat: { current: 120, target: 140 },
        deadlift: { current: 150, target: 180 }
      };
    } catch {
      return {
        bench: { current: 85, target: 100 },
        squat: { current: 120, target: 140 },
        deadlift: { current: 150, target: 180 }
      };
    }
  });

  const [isEditingGoals, setIsEditingGoals] = React.useState(false);
  const [editingGoalsInput, setEditingGoalsInput] = React.useState(liftGoals);

  const saveLiftGoals = () => {
    setLiftGoals(editingGoalsInput);
    localStorage.setItem("somatic_lift_goals", JSON.stringify(editingGoalsInput));
    setIsEditingGoals(false);
  };

  // Daily Consistency Habits Tracker State
  const [habits, setHabits] = React.useState<Record<string, boolean>>(() => {
    try {
      const s = localStorage.getItem("somatic_daily_habits");
      return s ? JSON.parse(s) : { protein: false, water: false, sleep: false, mobility: false, log: false };
    } catch {
      return { protein: false, water: false, sleep: false, mobility: false, log: false };
    }
  });

  const toggleHabit = (key: string) => {
    setHabits((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("somatic_daily_habits", JSON.stringify(updated));
      return updated;
    });
  };

  const habitScore = Math.round((Object.values(habits).filter(Boolean).length / Object.keys(habits).length) * 100);

  // Dynamic set telemetry
  const telemetryLogs = React.useMemo(() => {
    const allSets = [...sessionSets];
    archivedWorkouts.slice(-2).forEach(w => {
      if (w.sets) allSets.push(...w.sets);
    });

    return allSets.slice(-4).map((s, idx) => {
      const weightVal = s.weight || 0;
      const loadText = weightVal >= 100 ? "HEAVY MECHANICAL LOADING" : weightVal >= 60 ? "MODERATE TENSION PROFILE" : "LIGHT METABOLIC LOADING";
      return {
        exercise: s.exerciseName || "Somatic Lift Drill",
        weight: weightVal,
        reps: s.reps || 0,
        loadText,
        rpe: s.rpe || 8,
        time: "Logged set"
      };
    });
  }, [sessionSets, archivedWorkouts]);

  // Guidelines for active athletic styles
  const currentStyle = React.useMemo(() => {
    switch (consoleCProfile) {
      case "power":
        return {
          repRange: "1-5 Reps (Max Load)", rest: "180s - 300s", focus: "Absolute Strength",
          tip: "Focus entirely on maximum structural brace and skeletal loading. Rest long enough to clear metabolic fatigue entirely."
        };
      case "hyper":
        return {
          repRange: "6-12 Reps (Mechanical Tension)", rest: "90s - 120s", focus: "Hypertrophy Aesthetics",
          tip: "Maximize metabolic pump. Prioritize complete range of motion and 2-3 second slow eccentric controls on final failure sets."
        };
      case "flow":
        return {
          repRange: "8-15 Reps (Volume & Tempo)", rest: "60s - 90s", focus: "Athletic Conditioning",
          tip: "Keep pace constant. Integrate supersets or active mobility drills in intermediate rest intervals to build work capacity."
        };
      case "recovery":
        return {
          repRange: "12-20 Reps (Deload Tempo)", rest: "45s - 60s", focus: "Active Muscle Recovery",
          tip: "Perform active deloads. Use low weight loads to stimulate local blood flow and speed muscle fiber repair without soreness."
        };
    }
  }, [consoleCProfile]);

  return (
    <motion.div
      key="console-c-view"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 pb-12 text-left"
    >
      {/* CYBERNETIC LINK HEADER */}
      <div className="bg-[#05090e] border border-cyan-500/15 rounded-2xl p-5 md:p-6 relative overflow-hidden shadow-[inset_0_1px_3px_rgba(6,182,212,0.08)]">
        <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[10px] text-cyan-400 font-mono tracking-[0.4em] uppercase font-bold">
                Consistency & Goals // SHADOW DECK
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light font-sans text-white tracking-tight">
              Console <span className="font-serif italic text-cyan-400">C</span>
            </h2>
            <p className="text-xs text-white/55 font-light leading-relaxed max-w-lg">
              SMART lifting targets tracker, daily high-protein habit scorecard, and localized muscle fatigue recovery diagnostics.
            </p>
          </div>

          <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-4 font-mono shrink-0 text-left min-w-[180px]">
            <span className="text-[8px] text-cyan-400 block tracking-widest uppercase font-bold">DAILY HABIT RATING</span>
            <div className="text-sm font-black text-white mt-1 flex items-center gap-1.5">
              <span>{habitScore}% CONSISTENCY</span>
            </div>
            <span className="text-[9px] text-cyan-300/60 block mt-0.5 font-mono">HABITS COMPLETED: {Object.values(habits).filter(Boolean).length}/5</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: LIFT TARGETS & STYLE SELECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: SMART Lift Targets */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="bg-[#05080c] border border-white/[0.03] rounded-2xl p-5 md:p-6 flex flex-col justify-between h-full relative transition-all duration-300">
            <div>
              <div className="flex justify-between items-start mb-5 pb-3 border-b border-white/[0.04]">
                <div>
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-black">
                    SMART GOALS PROGRESSION
                  </span>
                  <h3 className="text-lg font-light text-white font-sans mt-0.5">
                    Core Lift <span className="font-serif italic text-cyan-400">Weight Targets</span>
                  </h3>
                </div>
                <button
                  onClick={() => {
                    if (isEditingGoals) {
                      saveLiftGoals();
                    } else {
                      setEditingGoalsInput(liftGoals);
                      setIsEditingGoals(true);
                    }
                  }}
                  className="text-[9px] font-mono bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 px-2.5 py-1 rounded transition-all"
                >
                  {isEditingGoals ? "SAVE GOALS" : "EDIT TARGETS"}
                </button>
              </div>

              {isEditingGoals ? (
                <div className="space-y-4 bg-white/[0.01] border border-white/5 p-4 rounded-xl font-mono text-xs mb-4">
                  <span className="text-[8px] text-white/30 uppercase tracking-wider block">ADJUST CORE LIFT GOALS (kg)</span>
                  <div className="space-y-3">
                    {["bench", "squat", "deadlift"].map((lift) => (
                      <div key={lift} className="grid grid-cols-3 items-center gap-4 font-mono">
                        <span className="text-white/60 capitalize">{lift}:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] text-white/30">Current:</span>
                          <input
                            type="number"
                            value={editingGoalsInput[lift as keyof typeof liftGoals].current}
                            onChange={(e) => setEditingGoalsInput({
                              ...editingGoalsInput,
                              [lift]: { ...editingGoalsInput[lift as keyof typeof liftGoals], current: parseFloat(e.target.value) || 0 }
                            })}
                            className="w-14 bg-white/5 border border-white/10 rounded py-0.5 px-1 text-center text-white outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] text-white/30">Target:</span>
                          <input
                            type="number"
                            value={editingGoalsInput[lift as keyof typeof liftGoals].target}
                            onChange={(e) => setEditingGoalsInput({
                              ...editingGoalsInput,
                              [lift]: { ...editingGoalsInput[lift as keyof typeof liftGoals], target: parseFloat(e.target.value) || 0 }
                            })}
                            className="w-14 bg-white/5 border border-white/10 rounded py-0.5 px-1 text-center text-white outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-5 mb-5 font-mono">
                  {(Object.entries(liftGoals) as [string, { current: number; target: number }][]).map(([key, item]) => {
                    const ratio = Math.min(100, Math.round((item.current / item.target) * 100));
                    return (
                      <div key={key} className="space-y-1.5 text-left">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-white/70 capitalize font-bold">{key} Press</span>
                          <span className="text-cyan-400 font-bold">{item.current} / {item.target} kg ({ratio}%)</span>
                        </div>
                        <div className="h-2 w-full bg-white/[0.02] border border-white/5 rounded-full overflow-hidden relative">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-500"
                            style={{ width: `${ratio}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Athletic style tabs */}
              <div className="grid grid-cols-4 gap-1.5 mb-4 p-1 bg-black/80 border border-white/5 rounded-xl">
                {(["power", "hyper", "flow", "recovery"] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setConsoleCProfile(style)}
                    className={`py-2 px-1 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      consoleCProfile === style
                        ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                        : "text-white/40 hover:text-white/80 border border-transparent hover:bg-white/[0.01]"
                    }`}
                  >
                    {style === "power" ? "POWER" : style === "hyper" ? "HYPER" : style === "flow" ? "FLOW" : "RECOVERY"}
                  </button>
                ))}
              </div>

              <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-4 text-[11px] font-mono text-cyan-300 leading-relaxed">
                <span className="font-bold uppercase block text-[9px] text-cyan-400 mb-0.5">{currentStyle.focus.toUpperCase()} COACHING MATRIX</span>
                <div className="grid grid-cols-2 gap-2 mb-2 text-white/50 text-[10px]">
                  <span>Rep Target: <strong className="text-white">{currentStyle.repRange}</strong></span>
                  <span>Rest: <strong className="text-white">{currentStyle.rest}</strong></span>
                </div>
                <p className="text-white/70 leading-normal font-sans">{currentStyle.tip}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Daily Consistency Checklist */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-[#05080c] border border-white/[0.03] rounded-2xl p-5 md:p-6 flex flex-col justify-between h-full relative transition-all duration-300">
            <div className="space-y-1 mb-4">
              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-black block">
                HABIT SCORECARD
              </span>
              <h3 className="text-lg font-light text-white font-sans">
                Daily <span className="font-serif italic text-cyan-400">Lifter Habits</span>
              </h3>
              <p className="text-xs text-white/40">
                Check off your core daily recovery habits to build consecutive fitness streaks.
              </p>
            </div>

            <div className="space-y-3 flex-1 mb-4">
              {[
                { key: "protein", label: "🍖 High-Protein Goal Met (>1.6g/kg)" },
                { key: "water", label: "💧 Optimal Hydration (>3 Liters)" },
                { key: "sleep", label: "💤 7.5+ Hours Quality Deep Sleep" },
                { key: "mobility", label: "🧘‍♂️ 10-Min Muscle Mobility Stretch" },
                { key: "log", label: "📓 Complete Log Analysis & Diary" }
              ].map((habit) => (
                <div
                  key={habit.key}
                  onClick={() => toggleHabit(habit.key)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    habits[habit.key]
                      ? "bg-cyan-500/5 border-cyan-400/30 text-white"
                      : "bg-white/[0.01] border-white/5 text-white/40 hover:bg-white/[0.02]"
                  }`}
                >
                  <span className="text-xs font-semibold">{habit.label}</span>
                  <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all ${
                    habits[habit.key]
                      ? "bg-cyan-400 border-cyan-400 text-black"
                      : "border-white/20 bg-transparent"
                  }`}>
                    {habits[habit.key] && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 flex items-center justify-between text-[10px] font-mono text-white/30">
              <span>TODAY'S CONSISTENCY RANK:</span>
              <span className="text-cyan-400 font-bold uppercase tracking-wider">
                {habitScore === 100 ? "🌟 GOD MODE LIFTING" : habitScore >= 60 ? "💪 WELL PROGRAMMED" : "⚠️ NEED STIMULUS"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: INDIVIDUAL MUSCLE RECOVERY TRACKER */}
      <div className="bg-[#05080c] border border-white/[0.03] rounded-2xl p-5 md:p-6">
        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-black block mb-1">
          Soreness & Muscle Fatigue Cooldowns
        </span>
        <h3 className="text-lg font-light text-white font-sans mb-1">
          Muscular <span className="font-serif italic text-cyan-400">Recovery Gauges</span>
        </h3>
        <p className="text-xs text-white/40 mb-5">
          Estimate recovery status per muscle group to prevent injuries. Tap stretch button to execute instant target recovery relief.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {(Object.entries(muscleRecovery) as [string, { percent: number; advice: string }][]).map(([muscle, data]) => {
            const isOptimal = data.percent >= 80;
            const isSevere = data.percent < 60;
            return (
              <div key={muscle} className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex flex-col justify-between text-left hover:border-cyan-500/20 transition-all duration-300">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-xs text-white/80 font-bold">{muscle}</span>
                    <span className={`text-[10px] font-bold ${isOptimal ? "text-cyan-400" : isSevere ? "text-red-400" : "text-amber-400"}`}>
                      {data.percent}%
                    </span>
                  </div>
                  <p className="text-[10px] text-white/40 min-h-[30px] leading-normal">{data.advice}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.03] flex items-center justify-between gap-2">
                  <span className="text-[8px] font-mono text-white/30">
                    {isOptimal ? "READY TO LOAD" : "RESTING"}
                  </span>
                  <button
                    onClick={() => performActiveRecovery(muscle)}
                    disabled={data.percent >= 100}
                    className="px-2 py-1 bg-cyan-400/10 hover:bg-cyan-400 text-cyan-400 hover:text-black disabled:opacity-30 disabled:hover:bg-cyan-400/10 disabled:hover:text-cyan-400 transition-all rounded text-[8px] font-mono font-bold uppercase tracking-wider"
                  >
                    Stretch
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: REAL-TIME LIFT SIGNAL TELEMETRY */}
      <div className="bg-[#03060a] border border-cyan-500/10 rounded-2xl p-5 md:p-6 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              REAL-TIME MECHANICAL LOAD TELEMETRY
            </h4>
            <p className="text-[10px] text-cyan-400/70 mt-0.5">
              STREAMING LATEST COMPLETED LIFT DRILLS
            </p>
          </div>
          <span className="text-[9px] text-cyan-300 bg-cyan-500/5 px-2.5 py-1 border border-cyan-500/10 rounded">
            SIGNAL: OPTIMAL (4.2ms)
          </span>
        </div>

        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 no-scrollbar text-[11px] leading-relaxed text-white/50 text-left">
          {telemetryLogs.length === 0 ? (
            <div className="text-white/20 py-4 text-center">
              [SYSTEM] No active lift logs found. Start logging sets to feed active telemetry signals.
            </div>
          ) : (
            telemetryLogs.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.03] flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-cyan-500/5 hover:border-cyan-500/10 transition-all duration-300">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">[{idx + 1}] {item.exercise}</span>
                    <span className="text-[8px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.2 rounded uppercase font-bold tracking-wider font-mono">
                      {item.loadText}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/40 font-mono">
                    MECHANICAL WORKLOAD: <span className="text-white">{item.weight} kg</span> × <span className="text-white">{item.reps} reps</span> • ESTIMATED INTENSITY: <span className="text-cyan-300 font-bold">RPE {item.rpe}</span>
                  </div>
                </div>
                <div className="text-[9px] text-white/20 font-mono">
                  SECURE_METRICS // TICKER_SUCCESS
                </div>
              </div>
            ))
          )}
          <div className="text-[10px] text-cyan-400/30 animate-pulse mt-2 pl-1 font-mono">
            [SECURE_LOGGER] Ticker active. Listening for subsequent muscle concentric stimulus...
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 px-4 py-2 bg-black/60 border border-white/10 hover:border-cyan-500/35 rounded-md text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-cyan-400 transition-all cursor-pointer group"
        >
          <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          Back to Top
        </button>
      </div>
    </motion.div>
  );
}
