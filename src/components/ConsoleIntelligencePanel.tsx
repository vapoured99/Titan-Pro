import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Activity, Zap, Clock, ShieldAlert, Cpu, BarChart3, TrendingUp, Info } from 'lucide-react';

interface SessionSet {
  id?: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  timestamp: any;
  notes?: string;
}

interface ConsoleIntelligencePanelProps {
  sessionSets: SessionSet[];
  archivedWorkouts: any[];
  findExerciseByName: (name: string) => any;
  currentDays?: any[][];
  lastLoadedDayIndex?: number | null;
}

// Tech Corner Brackets for premium tactical HUD look
const CornerAccents = () => (
  <>
    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-white/15 pointer-events-none" />
    <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-white/15 pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-white/15 pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-white/15 pointer-events-none" />
  </>
);

// Segmented LED-style progress bar
const SegmentedProgressBar = ({ 
  percent, 
  isAchieved 
}: { 
  percent: number; 
  isAchieved: boolean 
}) => {
  const segmentsCount = 20;
  const activeSegments = Math.round((percent / 100) * segmentsCount);
  
  return (
    <div className="flex gap-1 w-full justify-between">
      {Array.from({ length: segmentsCount }).map((_, i) => {
        const isActive = i < activeSegments;
        let segmentColor = 'bg-white/5 border-white/5';
        
        if (isActive) {
          if (isAchieved) {
            segmentColor = 'bg-gradient-to-t from-gym-accent to-yellow-400 shadow-[0_0_6px_rgba(163,230,53,0.4)]';
          } else {
            segmentColor = 'bg-gym-accent shadow-[0_0_4px_rgba(163,230,53,0.25)]';
          }
        }
        
        return (
          <motion.div
            key={i}
            initial={{ scaleY: 0.6, opacity: 0.2 }}
            animate={{ scaleY: isActive ? 1 : 0.8, opacity: isActive ? 1 : 0.3 }}
            transition={{ delay: i * 0.02, duration: 0.3 }}
            className={`h-3 flex-1 rounded-[1px] transition-all duration-300 ${segmentColor}`}
          />
        );
      })}
    </div>
  );
};

export default function ConsoleIntelligencePanel({
  sessionSets = [],
  archivedWorkouts = [],
  findExerciseByName,
  currentDays = [],
  lastLoadedDayIndex = null,
}: ConsoleIntelligencePanelProps) {
  // --- HELPERS ---
  const getSetTimestamp = (set: any) => {
    if (set.timestamp) {
      if (typeof set.timestamp.toMillis === 'function') return set.timestamp.toMillis();
      if (set.timestamp.seconds) return set.timestamp.seconds * 1000;
    }
    if (set.date) {
      const parsed = Date.parse(set.date);
      if (!isNaN(parsed)) return parsed;
    }
    return Date.now();
  };

  // --- 2. PACING SPARKLINE & LIVE REST ANALYTICS ---
  const pacingData = useMemo(() => {
    // 1. Sort active sets by timestamp
    const sortedSets = [...sessionSets].sort((a, b) => getSetTimestamp(a) - getSetTimestamp(b));
    
    // 2. Compute intervals between consecutive sets (in seconds)
    const intervals: number[] = [];
    for (let i = 0; i < sortedSets.length - 1; i++) {
      const currentTs = getSetTimestamp(sortedSets[i]);
      const nextTs = getSetTimestamp(sortedSets[i + 1]);
      const diffSecs = Math.max(0, Math.floor((nextTs - currentTs) / 1000));
      // Cap at 15 minutes (900 seconds) to avoid outliers
      if (diffSecs < 900) {
        intervals.push(diffSecs);
      }
    }

    // 3. Compute active average rest interval
    const activeAvgRest = intervals.length > 0 
      ? Math.round(intervals.reduce((sum, val) => sum + val, 0) / intervals.length) 
      : 0;

    // 4. Compute historical average rest interval across archived workouts
    let totalHistIntervalsSum = 0;
    let histIntervalsCount = 0;
    let totalArchivedSets = 0;

    archivedWorkouts.forEach((w) => {
      const wSets = w.sets || [];
      totalArchivedSets += wSets.length;
      if (wSets.length > 1) {
        const sortedWSet = [...wSets].sort((a, b) => getSetTimestamp(a) - getSetTimestamp(b));
        for (let i = 0; i < sortedWSet.length - 1; i++) {
          const t1 = getSetTimestamp(sortedWSet[i]);
          const t2 = getSetTimestamp(sortedWSet[i + 1]);
          const diff = Math.max(0, Math.floor((t2 - t1) / 1000));
          if (diff < 900) {
            totalHistIntervalsSum += diff;
            histIntervalsCount++;
          }
        }
      }
    });

    const historicalAvgRest = histIntervalsCount > 0 
      ? Math.round(totalHistIntervalsSum / histIntervalsCount) 
      : 90; // Default to 90 seconds if no history

    const historicalAvgSets = archivedWorkouts.length > 0
      ? Math.round(totalArchivedSets / archivedWorkouts.length)
      : 15; // default to 15 sets if no history

    // 5. Compute Fatigue Trend (Early vs Late rest intervals)
    let trend: 'tightening' | 'stable' | 'escalating' = 'stable';
    let earlyAvg = 0;
    let lateAvg = 0;

    if (intervals.length >= 2) {
      const mid = Math.ceil(intervals.length / 2);
      const early = intervals.slice(0, mid);
      const late = intervals.slice(mid);
      
      earlyAvg = early.reduce((s, v) => s + v, 0) / early.length;
      lateAvg = late.length > 0 ? (late.reduce((s, v) => s + v, 0) / late.length) : earlyAvg;

      if (lateAvg > earlyAvg + 5) {
        trend = 'escalating';
      } else if (lateAvg < earlyAvg - 5) {
        trend = 'tightening';
      }
    }

    // 6. Compute Predicted Finish Time (EST_FINISH)
    // Gather planned exercises from currentDays based on lastLoadedDayIndex, fallback to all days flattened
    const plannedExList = (lastLoadedDayIndex !== null && currentDays && currentDays[lastLoadedDayIndex])
      ? (currentDays[lastLoadedDayIndex] || [])
      : (currentDays && currentDays.length > 0 ? currentDays.flat() : []);

    const seenNames = new Set<string>();
    const uniquePlanned = plannedExList.filter((ex) => {
      if (!ex || !ex.name) return false;
      const normalized = ex.name.trim().toLowerCase();
      if (seenNames.has(normalized)) return false;
      seenNames.add(normalized);
      return true;
    });

    let remainingSets = 0;
    let targetSetsCount = 0;

    if (uniquePlanned.length > 0) {
      targetSetsCount = uniquePlanned.length * 3;
      uniquePlanned.forEach((ex) => {
        const normalizedName = ex.name.trim().toLowerCase();
        const loggedSetsCount = sessionSets.filter(
          (s) => s && s.exerciseName && s.exerciseName.trim().toLowerCase() === normalizedName
        ).length;
        const remainingForEx = Math.max(0, 3 - loggedSetsCount);
        remainingSets += remainingForEx;
      });
    } else {
      // Fallback if no programming is active
      targetSetsCount = Math.max(historicalAvgSets, sessionSets.length + 3);
      remainingSets = Math.max(0, targetSetsCount - sessionSets.length);
    }
    
    // Average set duration assumed to be 45s of active work + rest pace
    const currentRestPace = activeAvgRest || historicalAvgRest || 90;
    // Each remaining set takes 45 seconds of active work + rest pace, excluding the last set's rest time if there are any remaining sets.
    const estimatedRemainingSeconds = remainingSets > 0 
      ? (remainingSets * (45 + currentRestPace) - currentRestPace) 
      : 0;
    
    const estFinishTime = new Date(Date.now() + estimatedRemainingSeconds * 1000);
    const estFinishStr = estFinishTime.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    return {
      intervals,
      activeAvg: activeAvgRest,
      historicalAvg: historicalAvgRest,
      trend,
      earlyAvg,
      lateAvg,
      estFinishStr,
      targetSetsCount,
      remainingSets,
    };
  }, [sessionSets, archivedWorkouts, currentDays, lastLoadedDayIndex]);

  // --- 3. EVOLUTION PROGRESS TRACKER (PROGRESSIVE OVERLOAD) ---
  const evolutionData = useMemo(() => {
    // 1. Helper to find matching muscle group for a set
    const getMuscleGroup = (exerciseName: string): string => {
      const ex = findExerciseByName(exerciseName);
      if (ex?.muscleGroup) return ex.muscleGroup.trim().toLowerCase();
      if (ex?.pool) return ex.pool.trim().toLowerCase();
      
      const name = (exerciseName || '').trim().toLowerCase();
      if (name.includes('chest') || name.includes('bench press') || name.includes('push up') || name.includes('fly') || name.includes('pec deck')) {
        return 'chest';
      }
      if (name.includes('row') || name.includes('lat') || name.includes('pull') || name.includes('chin') || name.includes('back')) {
        return 'back';
      }
      if (name.includes('shoulder') || name.includes('delt') || name.includes('lateral raise') || name.includes('military') || name.includes('arnold') || name.includes('overhead')) {
        return 'shoulders';
      }
      if (name.includes('bicep') || name.includes('curl')) {
        return 'biceps';
      }
      if (name.includes('tricep') || name.includes('pushdown') || name.includes('kickback') || name.includes('dip') || name.includes('skull crusher')) {
        return 'triceps';
      }
      if (name.includes('squat') || name.includes('leg press') || name.includes('extension') || name.includes('lunge') || name.includes('quad')) {
        return 'quads';
      }
      if (name.includes('deadlift') || name.includes('romanian') || name.includes('rdl') || name.includes('hamstring') || name.includes('hinge') || name.includes('glute')) {
        return 'hamstrings/glutes';
      }
      return 'other';
    };

    // 2. Identify muscle groups in active session and calculate volume per group
    const activeMuscleMap = new Map<string, number>(); // muscleGroup -> activeVolume
    sessionSets.forEach((s) => {
      const ex = findExerciseByName(s.exerciseName);
      if (ex?.pool === 'cardio') return;
      const group = getMuscleGroup(s.exerciseName);
      if (group && group !== 'other') {
        const setVolume = (Number(s.weight) || 0) * (Number(s.reps) || 0);
        activeMuscleMap.set(group, (activeMuscleMap.get(group) || 0) + setVolume);
      }
    });

    const activeMuscles = Array.from(activeMuscleMap.keys());

    if (activeMuscles.length === 0) {
      return {
        currentVolume: 0,
        previousVolume: 0,
        volumeDiff: 0,
        isOverloadAchieved: false,
        progressPct: 0,
        hasPrevious: false,
        activeMuscles: [],
        matchingMuscles: [],
        matchedWorkoutName: '',
      };
    }

    // 3. Sort archived workouts descending
    const sortedArchived = [...archivedWorkouts].sort((a, b) => {
      const getTs = (ts: any) => {
        if (!ts) return 0;
        if (typeof ts.toMillis === 'function') return ts.toMillis();
        if (ts.seconds) return ts.seconds * 1000;
        return 0;
      };
      const timeA = a.timestamp ? getTs(a.timestamp) : (a.date ? new Date(a.date).getTime() : 0);
      const timeB = b.timestamp ? getTs(b.timestamp) : (b.date ? new Date(b.date).getTime() : 0);
      return timeB - timeA; // Descending (most recent first)
    });

    // 4. Find most recent archived workout with matching muscles
    let matchedWorkout: any = null;
    let matchingMuscles: string[] = [];

    for (const w of sortedArchived) {
      const histSets = w.sets || [];
      const histMuscles = new Set<string>();
      histSets.forEach((s: any) => {
        const ex = findExerciseByName(s.exerciseName);
        if (ex?.pool === 'cardio') return;
        const group = getMuscleGroup(s.exerciseName);
        if (group && group !== 'other') {
          histMuscles.add(group);
        }
      });

      // Check intersection
      const intersect = activeMuscles.filter((m) => histMuscles.has(m));
      if (intersect.length > 0) {
        matchedWorkout = w;
        matchingMuscles = intersect;
        break;
      }
    }

    // 5. Compute volume comparison ONLY for the matching muscle groups
    if (!matchedWorkout) {
      // No previous matching workout found.
      const totalCurrentMatchedVolume = activeMuscles.reduce((sum, m) => sum + (activeMuscleMap.get(m) || 0), 0);
      return {
        currentVolume: totalCurrentMatchedVolume,
        previousVolume: 0,
        volumeDiff: totalCurrentMatchedVolume,
        isOverloadAchieved: false,
        progressPct: 0,
        hasPrevious: false,
        activeMuscles,
        matchingMuscles: [],
        matchedWorkoutName: '',
      };
    }

    // Calculate volume of matching muscle groups in current session
    const currentMatchedVolume = matchingMuscles.reduce((sum, m) => sum + (activeMuscleMap.get(m) || 0), 0);

    // Calculate volume of matching muscle groups in historical session
    const historicalSets = matchedWorkout.sets || [];
    let historicalMatchedVolume = 0;
    historicalSets.forEach((s: any) => {
      const ex = findExerciseByName(s.exerciseName);
      if (ex?.pool === 'cardio') return;
      const group = getMuscleGroup(s.exerciseName);
      if (matchingMuscles.includes(group)) {
        historicalMatchedVolume += (Number(s.weight) || 0) * (Number(s.reps) || 0);
      }
    });

    const volumeDiff = currentMatchedVolume - historicalMatchedVolume;
    const isOverloadAchieved = historicalMatchedVolume > 0 && currentMatchedVolume >= historicalMatchedVolume;
    const progressPct = historicalMatchedVolume > 0 
      ? Math.min(100, Math.round((currentMatchedVolume / historicalMatchedVolume) * 100)) 
      : 0;

    // Format date of matched workout
    const formattedDate = matchedWorkout.date || 
      (matchedWorkout.timestamp 
        ? new Date(getSetTimestamp(matchedWorkout)).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) 
        : 'Previous Session');

    const matchedWorkoutName = matchedWorkout.routineName 
      ? `${matchedWorkout.routineName} (${formattedDate})` 
      : `Workout on ${formattedDate}`;

    return {
      currentVolume: currentMatchedVolume,
      previousVolume: historicalMatchedVolume,
      volumeDiff,
      isOverloadAchieved,
      progressPct,
      hasPrevious: true,
      activeMuscles,
      matchingMuscles,
      matchedWorkoutName,
    };
  }, [sessionSets, archivedWorkouts, findExerciseByName]);

  // Format seconds to readable mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div className="mt-8 bg-gradient-to-b from-[#090a0d] to-[#040405] border border-white/10 rounded-lg p-6 relative overflow-hidden shadow-2xl">
      {/* Background cyber grid and subtle ambient neon glow spheres */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gym-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* HUD Panel Outer Frame Accents */}
      <CornerAccents />

      {/* Primary Header Console Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 mb-6 relative z-10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gym-accent/10 border border-gym-accent/30 rounded-lg relative overflow-hidden shadow-[inset_0_0_10px_rgba(163,230,53,0.1)]">
            <Cpu className="w-5 h-5 text-gym-accent animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black uppercase text-white tracking-[0.25em]">Tactical Intelligence HUD</h4>
              <span className="text-[7px] font-mono bg-white/10 text-white/50 px-1 py-0.2 rounded uppercase">V2.4</span>
            </div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono mt-0.5">Automated Bio-mechanical Performance Calibration</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-[9px] font-mono">
          {/* Diagnostic Stats */}
          <div className="hidden md:flex items-center gap-4 text-white/40 border-r border-white/10 pr-4">
            <div>
              <span className="text-white/20 mr-1">SETS_LOGGED:</span>
              <span className="text-white/80 font-bold">{sessionSets.length}</span>
            </div>
            <div>
              <span className="text-white/20 mr-1">TARGET_MATCH:</span>
              <span className="text-white/80 font-bold">{evolutionData.hasPrevious ? 'ACTIVE' : 'READY'}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gym-accent/10 border border-gym-accent/25 rounded-md text-[8px] font-bold text-gym-accent uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-gym-accent animate-ping" />
            Telemetry System Live
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* Widget 1: Pacing Sparkline */}
        <div className="space-y-4 bg-black/40 border border-white/5 p-5 rounded-lg relative hover:border-gym-accent/20 transition-all duration-300">
          <CornerAccents />
          <div className="flex items-center justify-between">
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-white/70 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gym-accent" /> Live Rest Pacing Analytics
            </h5>
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded">PACING_CORE</span>
          </div>

          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[9px] font-mono border-b border-white/5 pb-3">
              <div className="bg-white/[0.01] border border-white/5 p-2 rounded">
                <span className="text-white/30 uppercase block text-[7px] tracking-widest">Active Rest</span>
                <span className={`text-sm font-black tracking-tight ${pacingData.intervals.length > 0 ? "text-gym-accent animate-pulse" : "text-white/30"}`}>
                  {pacingData.intervals.length > 0 ? formatTime(pacingData.activeAvg) : "Awaiting..."}
                </span>
              </div>
              <div className="bg-white/[0.01] border border-white/5 p-2 rounded">
                <span className="text-white/30 uppercase block text-[7px] tracking-widest">Target Rest</span>
                <span className="text-sm font-black text-white/85 tracking-tight">
                  {formatTime(pacingData.historicalAvg)}
                </span>
              </div>
              <div className="bg-white/[0.01] border border-white/5 p-2 rounded">
                <span className="text-white/30 uppercase block text-[7px] tracking-widest">Fatigue Trend</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`text-sm font-black leading-none ${
                    pacingData.trend === 'escalating' ? 'text-red-400' :
                    pacingData.trend === 'tightening' ? 'text-gym-accent' :
                    'text-white/55'
                  }`}>
                    {pacingData.trend === 'escalating' ? '↗' :
                     pacingData.trend === 'tightening' ? '↘' : '→'}
                  </span>
                  <span className={`text-[8px] font-bold tracking-tight uppercase ${
                    pacingData.trend === 'escalating' ? 'text-red-400' :
                    pacingData.trend === 'tightening' ? 'text-gym-accent' :
                    'text-white/55'
                  }`}>
                    {pacingData.trend === 'escalating' ? 'Escalating' :
                     pacingData.trend === 'tightening' ? 'Tightening' : 'Stable'}
                  </span>
                </div>
              </div>
              <div className="bg-white/[0.01] border border-white/5 p-2 rounded text-right sm:text-left">
                <span className="text-white/30 uppercase block text-[7px] tracking-widest">Est. Finish</span>
                <span className="text-sm font-black text-gym-accent tracking-tight block mt-0.5">{pacingData.estFinishStr}</span>
              </div>
            </div>

            {/* Sparkline Graphic representing intervals */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <BarChart3 className="w-3 h-3 text-gym-accent" /> Cumulative Pace Timeline
                </span>
                {pacingData.intervals.length > 0 && (
                  <span className="text-[7px] font-mono text-white/20 uppercase">Hover bars for details</span>
                )}
              </div>
              
              <div className="h-16 bg-black/60 rounded border border-white/5 p-2.5 flex items-end gap-1.5 relative overflow-hidden">
                {/* Visual horizontal guide lines */}
                <div className="absolute inset-x-0 top-1/3 border-t border-white/5 border-dashed pointer-events-none" />
                <div className="absolute inset-x-0 top-2/3 border-t border-white/5 border-dashed pointer-events-none" />
                
                {pacingData.intervals.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-[8px] text-white/30 font-mono uppercase tracking-widest text-center px-4 leading-relaxed">
                    <span>Awaiting sequential sets to plot rhythm...</span>
                    <span className="text-[7px] text-white/10 normal-case">Log 2 or more sets of any exercise to start</span>
                  </div>
                ) : (
                  <>
                    {pacingData.intervals.map((interval, idx) => {
                      // Ratio compared to target
                      const ratio = interval / pacingData.historicalAvg;
                      let barBg = 'from-gym-accent/80 to-gym-accent';
                      let glowShadow = 'shadow-[0_0_8px_rgba(163,230,53,0.3)]';
                      let label = 'Optimum Pace';
                      
                      if (ratio < 0.6) {
                        barBg = 'from-amber-500/80 to-amber-400';
                        glowShadow = 'shadow-[0_0_8px_rgba(245,158,11,0.3)]';
                        label = 'Rushed';
                      } else if (ratio > 1.4) {
                        barBg = 'from-red-500/80 to-red-400';
                        glowShadow = 'shadow-[0_0_8px_rgba(239,68,68,0.3)]';
                        label = 'Over-rest';
                      }
                      
                      // Height proportional to cap of 3 minutes (180 seconds)
                      const heightPct = Math.max(15, Math.min(100, (interval / 180) * 100));

                      return (
                        <div 
                          key={idx} 
                          className="flex-1 flex flex-col items-center gap-1 group/pbar h-full justify-end relative"
                        >
                          {/* Rich HUD Tooltip */}
                          <div className="absolute bottom-full mb-2 bg-[#090a0f] border border-white/15 rounded px-2.5 py-1.5 text-[8px] font-mono text-white whitespace-nowrap opacity-0 group-hover/pbar:opacity-100 transition-opacity duration-200 z-20 pointer-events-none shadow-xl">
                            <div className="text-[7px] text-white/30 uppercase font-black border-b border-white/10 pb-0.5 mb-1 flex justify-between gap-4">
                              <span>INTERVAL #{idx + 1}➔#{idx + 2}</span>
                              <span className="text-gym-accent font-bold">{label}</span>
                            </div>
                            <div className="flex justify-between gap-6">
                              <span>REST: <strong className="text-white">{formatTime(interval)}</strong></span>
                              <span>TARGET: <strong className="text-white/60">{formatTime(pacingData.historicalAvg)}</strong></span>
                            </div>
                          </div>
                          
                          <motion.div 
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            style={{ height: `${heightPct}%`, originY: 1 }}
                            className={`w-full rounded-sm bg-gradient-to-t ${barBg} ${glowShadow} hover:brightness-125 transition-all duration-300`}
                          />
                          <span className="text-[7px] font-mono text-white/20 absolute -bottom-1 select-none">#{idx + 1}</span>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            {/* Pacing Diagnostic Box to explain the fatigue trend and perfectly balance column heights */}
            <div className="text-[10px] font-mono p-3 rounded-lg bg-white/[0.01] border border-white/5 flex items-start gap-2.5">
              <Activity className={`w-4 h-4 shrink-0 mt-0.5 ${
                pacingData.intervals.length === 0 ? 'text-white/30 animate-pulse' :
                pacingData.trend === 'escalating' ? 'text-red-400' :
                pacingData.trend === 'tightening' ? 'text-gym-accent' :
                'text-white/70'
              }`} />
              <div className="space-y-1 leading-normal">
                {pacingData.intervals.length === 0 ? (
                  <>
                    <div className="font-bold text-white/50 uppercase tracking-widest text-[9px]">Pacing Diagnostics Standby</div>
                    <div className="text-white/45 text-[9px]">
                      Rest telemetry requires at least two sequential sets of any exercise to start profiling work density and heart-rate recovery.
                    </div>
                  </>
                ) : pacingData.trend === 'escalating' ? (
                  <>
                    <div className="font-bold text-red-400 uppercase tracking-widest text-[9px]">Fatigue Accrual Alert</div>
                    <div className="text-white/60 text-[9px]">
                      Your rest intervals are steadily climbing as you progress (Early: <span className="text-white font-semibold">{formatTime(Math.round(pacingData.earlyAvg))}</span> vs Late: <span className="text-white font-bold">{formatTime(Math.round(pacingData.lateAvg))}</span>). Maintain focus on recovery tempo to sustain workout density.
                    </div>
                  </>
                ) : pacingData.trend === 'tightening' ? (
                  <>
                    <div className="font-bold text-gym-accent uppercase tracking-widest text-[9px]">High Efficiency Pacing</div>
                    <div className="text-white/60 text-[9px]">
                      Rest intervals are tightening (Early: <span className="text-white font-semibold">{formatTime(Math.round(pacingData.earlyAvg))}</span> vs Late: <span className="text-white font-bold">{formatTime(Math.round(pacingData.lateAvg))}</span>). Excellent work capacity! Avoid rushing set starts to preserve maximum mechanical tension.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-bold text-white/70 uppercase tracking-widest text-[9px]">Pacing Velocity Stable</div>
                    <div className="text-white/60 text-[9px]">
                      Recovery intervals are stable within 5 seconds (Avg: <span className="text-white font-semibold">{formatTime(Math.round(pacingData.activeAvg))}</span>). Your autonomic response is matched perfectly with your workload.
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Widget 2: Muscle-Matched Overload Tracker */}
        <div className="space-y-4 bg-black/40 border border-white/5 p-5 rounded-lg relative hover:border-gym-accent/20 transition-all duration-300">
          <CornerAccents />
          <div className="flex items-center justify-between">
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-white/70 flex items-center gap-2">
              <Zap className="w-4 h-4 text-gym-accent" /> Muscle-Matched Overload Tracker
            </h5>
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded">OVERLOAD_CORE</span>
          </div>

          <div className="space-y-4 pt-1">
            {/* Target Muscles Badges */}
            <div className="bg-white/[0.01] border border-white/5 p-2.5 rounded-md space-y-1.5">
              <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest block">Active Session Footprint:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {evolutionData.activeMuscles.length > 0 ? (
                  evolutionData.activeMuscles.map((muscle) => (
                    <span 
                      key={muscle} 
                      className="px-2 py-0.5 bg-gym-accent/5 border border-gym-accent/15 rounded-full text-[8px] font-mono text-gym-accent uppercase tracking-wider flex items-center gap-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-gym-accent" />
                      {muscle}
                    </span>
                  ))
                ) : (
                  <span className="text-[8px] font-mono text-white/20 uppercase italic">No muscle metrics recorded. Log sets to evaluate...</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[9px] font-mono border-b border-white/5 pb-3">
              <div>
                <span className="text-white/30 uppercase block text-[8px] tracking-wider">Matched Active Volume</span>
                <span className="text-base font-black text-white">{evolutionData.currentVolume.toLocaleString()} <span className="text-[9px] font-medium text-white/40">kg</span></span>
              </div>
              <div className="text-right">
                <span className="text-white/30 uppercase block text-[8px] tracking-wider">Matched Target Volume</span>
                <span className="text-base font-black text-white/60">
                  {evolutionData.hasPrevious ? `${evolutionData.previousVolume.toLocaleString()} kg` : 'N/A (Baseline)'}
                </span>
              </div>
            </div>

            {/* LED Segmented Volume Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[8px] font-mono">
                <span className="text-white/35 uppercase flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-white/40" /> Performance Bar
                </span>
                <span className="text-gym-accent font-black tracking-wider uppercase">
                  {evolutionData.hasPrevious ? `${evolutionData.progressPct}% achieved` : 'Establishing baseline...'}
                </span>
              </div>
              
              <div className="py-1">
                <SegmentedProgressBar 
                  percent={evolutionData.hasPrevious ? evolutionData.progressPct : 100} 
                  isAchieved={evolutionData.isOverloadAchieved}
                />
              </div>
            </div>

            {/* Target Comparison Meta */}
            {evolutionData.hasPrevious && (
              <div className="text-[8px] font-mono text-white/50 bg-[#090b0e] border border-white/5 px-2.5 py-2 rounded flex justify-between items-center">
                <span className="text-white/35 tracking-wider flex items-center gap-1">
                  <Info className="w-3 h-3 text-white/30" /> COGNITIVE PAIRING:
                </span>
                <span className="text-white font-bold uppercase truncate max-w-[190px] border-b border-dotted border-white/20 pb-0.5">
                  {evolutionData.matchedWorkoutName}
                </span>
              </div>
            )}

            {/* Status and Dynamic Guidance */}
            <div className="text-[10px] font-mono p-3 rounded-lg bg-white/[0.01] border border-white/5 flex items-start gap-2.5">
              <ShieldAlert className={`w-4 h-4 shrink-0 mt-0.5 ${evolutionData.isOverloadAchieved ? 'text-gym-accent' : 'text-amber-500'}`} />
              <div className="space-y-1 leading-normal">
                {evolutionData.isOverloadAchieved ? (
                  <>
                    <div className="font-bold text-gym-accent uppercase tracking-widest text-[9px]">Progressive Overload Achieved!</div>
                    <div className="text-white/60 text-[9px]">
                      Stellar work! You exceeded your historical volume on <span className="text-white font-semibold">{evolutionData.matchingMuscles.join(', ')}</span> by <span className="text-gym-accent font-bold">+{evolutionData.volumeDiff.toLocaleString()} kg</span>. Stimulus has been successfully upgraded.
                    </div>
                  </>
                ) : evolutionData.hasPrevious ? (
                  <>
                    <div className="font-bold text-amber-500 uppercase tracking-widest text-[9px]">Stimulus Overload Deficit</div>
                    <div className="text-white/40 text-[9px]">
                      Log <span className="text-white/80 font-bold">{Math.abs(evolutionData.volumeDiff).toLocaleString()} kg</span> more volume on <span className="text-white font-semibold">{evolutionData.matchingMuscles.join(', ')}</span> to match and upgrade your matched target of <span className="text-white/80 font-bold">{evolutionData.previousVolume.toLocaleString()} kg</span>.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-bold text-white/50 uppercase tracking-widest text-[9px]">Target Calibration Stage</div>
                    <div className="text-white/40 text-[9px]">
                      Add sets to the active log. The cumulative volume logged for active muscles will serve as your target benchmark next time you train them.
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
