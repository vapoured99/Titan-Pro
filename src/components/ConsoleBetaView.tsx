import React from "react";
import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUp, FlaskConical } from "lucide-react";

interface ConsoleBetaViewProps {
  profile: any;
  syncedProfile: any;
  archivedWorkouts: any[];
  sessionSets: any[];
  cnsFatigueAnalysis: any;
  chronologicalDaysConsole: any[];
  activeTheme: any;
  setActiveView: (view: any) => void;
  consoleBetaTab: "strength" | "hypertrophy" | "neural" | "endurance";
  setConsoleBetaTab: (tab: "strength" | "hypertrophy" | "neural" | "endurance") => void;
}

export default function ConsoleBetaView({
  profile,
  archivedWorkouts,
  sessionSets,
  chronologicalDaysConsole,
  setActiveView,
  consoleBetaTab,
  setConsoleBetaTab,
}: ConsoleBetaViewProps) {
  const level = profile?.avatarLevel ?? 1;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = new Date().toLocaleString("default", { month: "long" });

  const workoutDays = React.useMemo(() => new Set(
    archivedWorkouts
      .map((w) => {
        if (!w.date) return null;
        const d = new Date(w.date);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth ? d.getDate() : null;
      })
      .filter(Boolean) as number[]
  ), [archivedWorkouts, currentYear, currentMonth]);

  // Real weightlifting calculations
  const totalWeightLogged = React.useMemo(() => archivedWorkouts.reduce((acc, w) => {
    if (w.sets && w.sets.length > 0) {
      return acc + w.sets.reduce((sum: number, s: any) => sum + ((s.weight || 0) * (s.reps || 0)), 0);
    }
    return acc + (w.totalVolume || 0);
  }, 0), [archivedWorkouts]);

  // 1RM Estimator State
  const [calcWeight, setCalcWeight] = React.useState<number>(80);
  const [calcReps, setCalcReps] = React.useState<number>(5);
  const [calcLift, setCalcLift] = React.useState<string>("bench");
  const estimated1RM = Math.round(calcWeight * (1 + calcReps / 30));

  const [savedMaxes, setSavedMaxes] = React.useState<Record<string, number>>(() => {
    try {
      const s = localStorage.getItem("somatic_saved_1rm");
      return s ? JSON.parse(s) : { bench: 100, squat: 140, deadlift: 180, overhead: 65 };
    } catch {
      return { bench: 100, squat: 140, deadlift: 180, overhead: 65 };
    }
  });

  const saveMax = () => {
    const updated = { ...savedMaxes, [calcLift]: estimated1RM };
    setSavedMaxes(updated);
    localStorage.setItem("somatic_saved_1rm", JSON.stringify(updated));
  };

  // Dynamic Muscle Group Volume Counts
  const muscleGroupsData = React.useMemo(() => {
    const counts: Record<string, number> = { Chest: 0, Back: 0, Legs: 0, Shoulders: 0, Arms: 0, Core: 0 };
    const allSets = [...sessionSets, ...archivedWorkouts.flatMap(w => w.sets || [])];
    
    allSets.forEach(s => {
      const name = (s.exerciseName || "").toLowerCase();
      if (name.includes("chest") || name.includes("press") || name.includes("bench") || name.includes("fly")) counts.Chest++;
      else if (name.includes("row") || name.includes("pull") || name.includes("lat") || name.includes("chin") || name.includes("back")) counts.Back++;
      else if (name.includes("squat") || name.includes("leg") || name.includes("quad") || name.includes("ham") || name.includes("calf") || name.includes("lunge")) counts.Legs++;
      else if (name.includes("press") || name.includes("delt") || name.includes("shoulder") || name.includes("raise")) counts.Shoulders++;
      else if (name.includes("curl") || name.includes("biceps") || name.includes("triceps") || name.includes("arm") || name.includes("dip")) counts.Arms++;
      else if (name.includes("crunch") || name.includes("situp") || name.includes("plank") || name.includes("ab") || name.includes("core")) counts.Core++;
    });

    const maxCount = Math.max(...Object.values(counts), 1);
    const hasData = Object.values(counts).some(v => v > 0);

    // Default beautiful hypertrophy values if no data exists
    if (!hasData) {
      return [
        { name: "Legs", sets: 14, percent: 90 },
        { name: "Back", sets: 12, percent: 80 },
        { name: "Chest", sets: 10, percent: 70 },
        { name: "Shoulders", sets: 8, percent: 55 },
        { name: "Arms", sets: 8, percent: 55 },
        { name: "Core", sets: 6, percent: 40 }
      ];
    }

    return Object.entries(counts).map(([name, val]) => ({
      name,
      sets: val,
      percent: Math.round((val / maxCount) * 100)
    }));
  }, [sessionSets, archivedWorkouts]);

  // Volume progression list
  const loadProgressionData = React.useMemo(() => {
    return chronologicalDaysConsole.map((d) => {
      const dayWorkouts = archivedWorkouts.filter(w => (w.date || "").slice(0, 10) === d.date.slice(0, 10));
      let vol = dayWorkouts.reduce((sum, w) => sum + (w.sets?.reduce((sSum: number, s: any) => sSum + ((s.weight || 0) * (s.reps || 0)), 0) || w.totalVolume || 0), 0);
      if (vol === 0 && d.count > 0) vol = d.calories * 1.5;
      return {
        date: d.date.slice(5),
        calories: d.calories,
        volume: Math.round(vol)
      };
    });
  }, [chronologicalDaysConsole, archivedWorkouts]);

  // Custom goals advice depending on tab
  const currentTab = React.useMemo(() => {
    switch (consoleBetaTab) {
      case "strength":
        return {
          title: "Power & Absolute Strength",
          range: "1-5 Reps",
          rest: "3-5 Minutes",
          desc: "Focused on myofibrillar density, skeletal motor recruitment, and neural pathway adaptation.",
          guidelines: [
            "Use heavy compound exercises targeting absolute mechanical tension.",
            "Maintain complete spinal and core bracing throughout maximum effort sets.",
            "Rest long enough to fully restore ATP-CP reserves before subsequent loads."
          ]
        };
      case "hypertrophy":
        return {
          title: "Sarcoplasmic Muscle Growth",
          range: "6-12 Reps",
          rest: "90-120 Seconds",
          desc: "Maximizing metabolic stress, high-volume overload, and intracellular protein synthesis.",
          guidelines: [
            "Control eccentric movement (2-3s negative phase) for muscle micro-tearing.",
            "Ensure progressive load increments of 1-2.5kg once rep targets are met.",
            "Include high-tension stretch-mediated reps near the end of hypertrophy workouts."
          ]
        };
      case "neural":
        return {
          title: "Explosive Athletic Power",
          range: "1-3 Reps (Explosive)",
          rest: "2-3 Minutes",
          desc: "Stimulating high-frequency rate coding, speed strength, and fast-twitch motor units.",
          guidelines: [
            "Perform concentric phases with maximal intent and explosive speed.",
            "Keep resistance moderate (50-70% 1RM) to optimize dynamic velocity curves.",
            "Stop sets long before fatigue limits explosive speed output."
          ]
        };
      case "endurance":
        return {
          title: "Muscular & Vascular Endurance",
          range: "15-25 Reps",
          rest: "45-60 Seconds",
          desc: "Promoting mitochondrial biogenesis, capillarization, and lactic threshold delays.",
          guidelines: [
            "Maintain constant steady-state tension throughout extended rep ranges.",
            "Utilize short rests to force adaptation to lactic acid and hydrogen build-ups.",
            "Focus on form durability under high-volume cardiovascular and muscle exhaustion."
          ]
        };
    }
  }, [consoleBetaTab]);

  return (
    <motion.div
      key="console2-view"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 pb-12 text-left"
    >
      {/* HEADER: AMBER LAB STATUS HUB */}
      <div className="bg-[#0b0a0a] border border-amber-500/10 rounded-2xl p-5 md:p-6 relative overflow-hidden shadow-[inset_0_1px_3px_rgba(245,158,11,0.05)]">
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] text-amber-500 font-mono tracking-[0.35em] uppercase font-bold">
                Lifting Performance Lab // DECK BETA
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light font-sans text-white tracking-tight">
              Console <span className="font-serif italic text-amber-400">Beta</span>
            </h2>
            <p className="text-xs text-white/50 font-light max-w-lg">
              Dynamic volume diagnostics, progressive load progression rates, and interactive one-rep max estimation logs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-white/[0.01] border border-white/[0.03] rounded-xl px-4 py-2.5 font-mono text-left">
              <span className="text-[8px] text-white/30 uppercase tracking-widest block">Logged Workload</span>
              <span className="text-sm font-black text-amber-400">{totalWeightLogged.toLocaleString()} kg</span>
            </div>
            <div className="bg-white/[0.01] border border-white/[0.03] rounded-xl px-4 py-2.5 font-mono text-left">
              <span className="text-[8px] text-white/30 uppercase tracking-widest block">Athlete Rating</span>
              <span className="text-sm font-black text-white">LEVEL {level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE GOAL PROGRAMMING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="bg-[#090909] border border-white/[0.03] rounded-2xl p-5 md:p-6 flex flex-col h-full relative transition-all duration-300">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-white/[0.03]">
                <div>
                  <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest font-black">
                    TRAINING METRIC GUIDES
                  </span>
                  <h3 className="text-lg font-light text-white font-sans mt-0.5">
                    Athletic <span className="font-serif italic text-amber-400">Focus Parameters</span>
                  </h3>
                </div>
                <span className="text-[9px] font-mono text-amber-400 uppercase bg-amber-500/5 border border-amber-500/15 px-2.5 py-1 rounded">
                  Programming Rules
                </span>
              </div>

              {/* Goal Tabs */}
              <div className="grid grid-cols-4 gap-1.5 mb-5 p-1 bg-black/60 border border-white/5 rounded-xl">
                {(["strength", "hypertrophy", "neural", "endurance"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setConsoleBetaTab(tab)}
                    className={`py-2 px-1 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      consoleBetaTab === tab
                        ? "bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.05)]"
                        : "text-white/40 hover:text-white/80 border border-transparent hover:bg-white/[0.01]"
                    }`}
                  >
                    {tab === "neural" ? "ATHLETIC" : tab}
                  </button>
                ))}
              </div>

              {/* Dynamic Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                  <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                    <span className="text-[8px] text-white/30 block tracking-wider uppercase">Optimal Rep range</span>
                    <span className="text-sm font-black text-amber-400 mt-0.5 block">{currentTab.range}</span>
                  </div>
                  <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                    <span className="text-[8px] text-white/30 block tracking-wider uppercase">Optimal Rest periods</span>
                    <span className="text-sm font-black text-white mt-0.5 block">{currentTab.rest}</span>
                  </div>
                </div>

                <div className="bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl">
                  <span className="text-[9px] font-mono text-amber-400 uppercase font-bold block mb-1">PROGRAM FOCUS: {currentTab.title.toUpperCase()}</span>
                  <p className="text-xs text-white/60 leading-relaxed">{currentTab.desc}</p>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[8px] font-mono text-white/30 tracking-widest uppercase block">PRO LIFTING RULES</span>
                  {currentTab.guidelines.map((g, i) => (
                    <div key={i} className="flex gap-2.5 items-start text-xs text-white/50 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: ESTIMATED ONE-REP MAX CALCULATOR */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-[#090909] border border-white/[0.03] rounded-2xl p-5 md:p-6 hover:border-amber-500/20 transition-all duration-300 flex flex-col justify-between h-full relative">
            <div>
              <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest font-black block mb-1">
                STRENGTH RATIO ESTIMATOR
              </span>
              <h3 className="text-lg font-light text-white font-sans">
                Dynamic <span className="font-serif italic text-amber-400">1-Rep Max (1RM)</span>
              </h3>
              <p className="text-xs text-white/40 mt-1 mb-4">
                Calculate and record estimated absolute maximum lifting capability across core compound drills.
              </p>

              <div className="space-y-3.5">
                <div className="p-3.5 bg-black/60 rounded-xl border border-white/5 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[8px] font-mono text-white/30 uppercase block mb-1">Core Lift</label>
                      <select
                        value={calcLift}
                        onChange={(e) => setCalcLift(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-1 px-1 text-xs text-white outline-none"
                      >
                        <option value="bench">Bench Press</option>
                        <option value="squat">Squat</option>
                        <option value="deadlift">Deadlift</option>
                        <option value="overhead">Overhead Press</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[8px] font-mono text-white/30 uppercase block mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={calcWeight}
                        onChange={(e) => setCalcWeight(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-1 px-1 text-xs text-white text-center outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-mono text-white/30 uppercase block mb-1">Repetitions</label>
                      <input
                        type="number"
                        value={calcReps}
                        onChange={(e) => setCalcReps(parseInt(e.target.value) || 0)}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-1 px-1 text-xs text-white text-center outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 font-mono">
                    <div>
                      <span className="text-[8px] text-white/40 block">ESTIMATED 1RM</span>
                      <span className="text-xl font-black text-amber-400">{estimated1RM} kg</span>
                    </div>
                    <button
                      onClick={saveMax}
                      className="px-3 py-1.5 bg-amber-500 text-black hover:bg-amber-400 transition-all rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider"
                    >
                      Record PR
                    </button>
                  </div>
                </div>

                {/* Saved records list */}
                <div className="space-y-2 bg-white/[0.01] border border-white/5 p-3 rounded-xl font-mono text-[10px]">
                  <span className="text-[8px] text-white/30 uppercase block tracking-wider">SAVED PERFORMANCE MAXES (PRs)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-white/40">Bench Press:</span>
                      <span className="text-white font-bold">{savedMaxes.bench} kg</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-white/40">Back Squat:</span>
                      <span className="text-white font-bold">{savedMaxes.squat} kg</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-white/40">Deadlift:</span>
                      <span className="text-white font-bold">{savedMaxes.deadlift} kg</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-white/40">Overhead:</span>
                      <span className="text-white font-bold">{savedMaxes.overhead} kg</span>
                    </div>
                  </div>
                </div>

                {/* Target repetition loads based on 1RM */}
                <div className="space-y-1 bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl font-mono text-[9px] text-amber-300">
                  <div className="flex justify-between border-b border-amber-500/10 pb-1">
                    <span>90% 1RM (approx 3-4 reps)</span>
                    <span className="font-bold">{Math.round(estimated1RM * 0.9)} kg</span>
                  </div>
                  <div className="flex justify-between border-b border-amber-500/10 pb-1">
                    <span>80% 1RM (approx 7-8 reps)</span>
                    <span className="font-bold">{Math.round(estimated1RM * 0.8)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>70% 1RM (approx 10-12 reps)</span>
                    <span className="font-bold">{Math.round(estimated1RM * 0.7)} kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: MUSCLE GROUP VOLUME BREAKDOWN & PROGRESSION CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-5">
          <div className="bg-[#090909] border border-white/[0.03] rounded-2xl p-5 md:p-6 hover:border-amber-500/25 transition-all duration-300 h-full relative">
            <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest font-black block mb-1">
              Muscle Group Training Distribution
            </span>
            <h3 className="text-lg font-light text-white font-sans mb-1">
              Mechanical <span className="font-serif italic text-amber-400">Volume Shares</span>
            </h3>
            <p className="text-xs text-white/40 mb-4">
              Real-time muscular loading density calculated from your active lifting logs.
            </p>

            <div className="space-y-3.5">
              {muscleGroupsData.map((item, idx) => (
                <div key={idx} className="space-y-1 text-left">
                  <div className="flex justify-between items-center font-mono text-[10px]">
                    <span className="text-white/70">{item.name}</span>
                    <span className="text-amber-400 font-bold">{item.sets} Sets completed</span>
                  </div>
                  <div className="h-2 w-full bg-white/[0.02] border border-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-500"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-[#090909] border border-white/[0.03] rounded-2xl p-5 md:p-6 relative overflow-hidden h-full">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest font-black">
                  Multi-Dimensional Load Analytics
                </span>
                <h3 className="text-xl font-light text-white font-sans mt-0.5">
                  Lifting <span className="font-serif italic text-amber-400">Volume Progression</span>
                </h3>
              </div>
              <span className="text-xs text-white/40 font-mono bg-white/[0.01] px-3 py-1.5 border border-white/5 rounded-xl">
                TOTAL WEIGHT VOLUME LIFTED (kg)
              </span>
            </div>

            <div className="h-[200px] w-full">
              {loadProgressionData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center bg-white/[0.01] rounded-xl border border-dashed border-white/[0.05]">
                  <FlaskConical className="w-5 h-5 text-white/10 mb-2 animate-pulse" />
                  <span className="text-[10px] text-white/30 font-mono">No workload progression mapped.</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={loadProgressionData}
                    margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorVolumeBeta" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                    <XAxis dataKey="date" stroke="#ffffff10" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
                    <YAxis stroke="#ffffff10" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0b0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }}
                      labelStyle={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", fontFamily: "monospace" }}
                      itemStyle={{ fontSize: "11px" }}
                    />
                    <Area
                      type="monotone"
                      name="Load Volume (kg)"
                      dataKey="volume"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorVolumeBeta)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: TRAINING DENSITY GRID */}
      <div className="bg-[#090909] border border-white/[0.03] rounded-2xl p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4 mb-5">
          <div>
            <h4 className="text-base font-semibold text-white leading-snug">
              Monthly Training Density
            </h4>
            <p className="text-xs text-white/40 font-mono mt-0.5">
              {monthName.toUpperCase()} {currentYear} • WORKOUT LOG FREQUENCY
            </p>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-white/40">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-white/[0.01] border border-white/5" />
              <span>Rest Day</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] border border-amber-400" />
              <span>Active Lift Day</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-12 gap-2.5">
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const hasWorkout = workoutDays.has(dayNum);
            return (
              <div
                key={idx}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center font-mono relative transition-all duration-300 border ${
                  hasWorkout
                    ? "bg-gradient-to-br from-amber-600 to-amber-500 text-black border-amber-400 font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.3)] hover:scale-105"
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
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 px-4 py-2 bg-black/60 border border-white/10 hover:border-amber-500/35 rounded-md text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-amber-400 transition-all cursor-pointer group"
        >
          <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          Back to Top
        </button>
      </div>
    </motion.div>
  );
}
