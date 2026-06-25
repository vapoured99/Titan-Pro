import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, Dumbbell, Calendar, Info, Edit3, Check, Trophy } from "lucide-react";

interface SessionSet {
  id?: string;
  exerciseName: string;
  weight: number | string;
  reps: number | string;
  timestamp?: any;
  date?: string;
  difficulty?: number;
}

interface WeeklyVolumeTrackerProps {
  archivedWorkouts: any[];
  sessionSets: SessionSet[];
}

export const WeeklyVolumeTracker: React.FC<WeeklyVolumeTrackerProps> = ({
  archivedWorkouts = [],
  sessionSets = [],
}) => {
  const [weeklyGoal, setWeeklyGoal] = useState<number>(10000); // default 10,000 kg goal
  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);
  const [goalInput, setGoalInput] = useState<string>("10000");
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Helper to extract timestamp from set/workout
  const getTimestamp = (item: any) => {
    if (item.timestamp) {
      if (typeof item.timestamp.toMillis === "function") return item.timestamp.toMillis();
      if (item.timestamp.seconds) return item.timestamp.seconds * 1000;
    }
    if (item.date) {
      const parsed = Date.parse(item.date);
      if (!isNaN(parsed)) return parsed;
    }
    return Date.now();
  };

  // 1. Calculate Monday at 00:00:00 of the current week in local time
  const weekRange = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday being 0
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 7);
    return { start: monday, end: sunday };
  }, [archivedWorkouts, sessionSets]);

  // 2. Map weekly workouts and active logs into days of the week (Mon=0, Tue=1, ..., Sun=6)
  const { totalVolume, daysVolume, dailyTargets } = useMemo(() => {
    const daysVol = [0, 0, 0, 0, 0, 0, 0]; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
    const startMs = weekRange.start.getTime();
    const endMs = weekRange.end.getTime();

    // Sum from archived workouts within current week
    archivedWorkouts.forEach((w) => {
      const ts = getTimestamp(w);
      if (ts >= startMs && ts < endMs) {
        const vol = w.totalVolume || (w.sets ? w.sets.reduce((sum: number, s: any) => sum + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0) : 0);
        const dateObj = new Date(ts);
        const dayIdx = dateObj.getDay();
        const indexInWeek = dayIdx === 0 ? 6 : dayIdx - 1;
        daysVol[indexInWeek] += vol;
      }
    });

    // Sum from current active session sets (Assume they correspond to today!)
    const activeVol = sessionSets.reduce((sum, s) => sum + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0);
    const todayIdx = new Date().getDay();
    const todayIndexInWeek = todayIdx === 0 ? 6 : todayIdx - 1;
    daysVol[todayIndexInWeek] += activeVol;

    const total = daysVol.reduce((sum, val) => sum + val, 0);
    
    // Average daily target is weekly target divided by average active days (say 4 days of program)
    const dailyTarget = Math.round(weeklyGoal / 4);

    return {
      totalVolume: total,
      daysVolume: daysVol,
      dailyTargets: Array(7).fill(dailyTarget),
    };
  }, [archivedWorkouts, sessionSets, weekRange, weeklyGoal]);

  const progressPercent = Math.min(100, Math.round((totalVolume / weeklyGoal) * 100));

  const handleSaveGoal = () => {
    const val = parseInt(goalInput, 10);
    if (!isNaN(val) && val > 0) {
      setWeeklyGoal(val);
      setIsEditingGoal(false);
    }
  };

  const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const dayLabelsFull = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Circular progress calculations for central major ring
  const majorRadius = 54;
  const majorCircumference = 2 * Math.PI * majorRadius;
  const majorStrokeOffset = majorCircumference - (progressPercent / 100) * majorCircumference;

  return (
    <div className="bg-black/70 border border-white/10 rounded-sm p-5 flex flex-col justify-between h-full min-h-[380px] backdrop-blur-md relative overflow-hidden group hover:border-gym-accent/30 transition-all duration-300">
      {/* Visual corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-gym-accent/50 transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-gym-accent/50 transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-gym-accent/50 transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-gym-accent/50 transition-colors" />

      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-[10px] text-white uppercase font-black tracking-widest mb-1 font-mono flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-gym-accent" />
            Weekly Volume Goal
          </h4>
          <p className="text-xs text-white/50 font-mono font-bold tracking-tight uppercase">
            Progressive Loading Metrics
          </p>
        </div>

        {/* Edit Goal Toggle */}
        <div className="flex items-center">
          {isEditingGoal ? (
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-0.5 rounded">
              <input
                type="number"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="w-16 bg-transparent text-[10px] text-white outline-none font-mono font-bold text-center p-1"
                placeholder="Goal kg"
              />
              <button
                onClick={handleSaveGoal}
                className="p-1 text-gym-accent hover:bg-white/5 rounded cursor-pointer"
                title="Save volume goal"
              >
                <Check className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setGoalInput(weeklyGoal.toString()); setIsEditingGoal(true); }}
              className="p-1 px-2.5 text-[8px] font-mono font-black uppercase text-white/40 hover:text-white bg-white/5 border border-white/10 rounded flex items-center gap-1 hover:border-white/20 transition-all cursor-pointer"
              title="Customize weekly target"
            >
              <Edit3 className="w-2.5 h-2.5" />
              Set Goal
            </button>
          )}
        </div>
      </div>

      {/* Main concentric visual ring */}
      <div className="flex-1 flex items-center justify-center relative my-3">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Outer glow sphere */}
          <div className={`absolute inset-4 rounded-full blur-2xl opacity-15 transition-all duration-500 ${progressPercent >= 100 ? "bg-gym-accent" : "bg-white/40"}`} />

          {/* Major Circular progress ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r={majorRadius}
              className="stroke-white/5 fill-none"
              strokeWidth="5"
            />
            <motion.circle
              cx="64"
              cy="64"
              r={majorRadius}
              className="stroke-gym-accent fill-none"
              strokeWidth="6"
              strokeDasharray={majorCircumference}
              animate={{ strokeDashoffset: majorStrokeOffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 3px rgba(163, 230, 53, 0.3))" }}
            />
          </svg>

          {/* Overall text inside circle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black font-mono tracking-tighter leading-none text-white">
              {progressPercent}%
            </span>
            <span className="text-[7px] font-mono font-bold text-white/40 uppercase tracking-widest mt-1">
              Goal Achieved
            </span>
          </div>
        </div>

        {/* Simple details panel overlay */}
        <div className="absolute right-0 top-0 text-right font-mono text-[9px] text-white/60 space-y-1 bg-white/[0.01] border border-white/5 p-2 rounded max-w-[110px]">
          <div>
            <span className="text-white/30 text-[7px] block uppercase">Weekly Goal</span>
            <span className="font-bold text-white">{weeklyGoal.toLocaleString()} kg</span>
          </div>
          <div>
            <span className="text-white/30 text-[7px] block uppercase">Current Week</span>
            <span className="font-black text-gym-accent">{totalVolume.toLocaleString()} kg</span>
          </div>
        </div>
      </div>

      {/* Day of the week progress rings */}
      <div className="pt-3 border-t border-white/5">
        <div className="flex justify-between items-center text-[7px] font-mono text-white/30 tracking-widest font-black uppercase mb-2">
          <span>Weekly Day-by-Day Density</span>
          <span className="text-gym-accent">Hover for details</span>
        </div>

        {/* Rings strip */}
        <div className="grid grid-cols-7 gap-2">
          {daysVolume.map((vol, idx) => {
            const dayTarget = dailyTargets[idx];
            const pct = dayTarget > 0 ? Math.min(100, Math.round((vol / dayTarget) * 100)) : 0;
            const isCompleted = vol > 0;
            
            // Day ring circular calculations
            const minRadius = 11;
            const minCircumference = 2 * Math.PI * minRadius;
            const minStrokeOffset = minCircumference - (pct / 100) * minCircumference;

            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-1 group/day relative"
                onMouseEnter={() => setHoveredDay(idx)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Visual day progress ring */}
                <div className="relative w-9 h-9 flex items-center justify-center cursor-pointer">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 28 28">
                    <circle
                      cx="14"
                      cy="14"
                      r={minRadius}
                      className="stroke-white/5 fill-none"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="14"
                      cy="14"
                      r={minRadius}
                      className={`fill-none transition-all duration-500 ${isCompleted ? "stroke-gym-accent" : "stroke-white/10"}`}
                      strokeWidth="2.5"
                      strokeDasharray={minCircumference}
                      strokeDashoffset={minStrokeOffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={`absolute text-[8px] font-mono font-bold leading-none ${isCompleted ? "text-gym-accent font-black" : "text-white/30"}`}>
                    {dayNames[idx][0]}
                  </span>
                </div>

                <span className="text-[7px] font-mono text-white/20 font-black">{dayNames[idx]}</span>

                {/* Day volume tooltip */}
                <AnimatePresence>
                  {hoveredDay === idx && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full mb-2 bg-[#090a0f] border border-white/15 rounded p-2 text-[8px] font-mono text-white z-30 pointer-events-none shadow-2xl whitespace-nowrap"
                    >
                      <div className="text-[7px] text-white/40 uppercase font-bold border-b border-white/10 pb-1 mb-1">
                        {dayLabelsFull[idx]} Vol
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex justify-between gap-4">
                          <span>Volume:</span>
                          <strong className="text-gym-accent">{vol.toLocaleString()} kg</strong>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>Daily Target:</span>
                          <strong className="text-white/60">{dayTarget.toLocaleString()} kg</strong>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
