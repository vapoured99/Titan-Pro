import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Sparkles, AlertTriangle, CheckCircle, Zap, RotateCcw, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { POOLS } from '../data/exercises';
import { Scroll3DItem } from '../App';

interface SessionSet {
  id?: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  timestamp?: any;
  notes?: string;
}

interface AICoachProps {
  sets: SessionSet[];
  archivedWorkouts?: any[];
  userId?: string;
}

interface CoachRecommendation {
  overallStatus: string;
  recoveryScore: number;
  priorityTargets: string[];
  avoidTargets: string[];
  shortMotivationalQuote: string;
  customWorkoutRecommendation: string;
  personalizedAdvice: string;
}

const AICoach: React.FC<AICoachProps> = ({ sets = [], archivedWorkouts = [], userId = 'anonymous' }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [advice, setAdvice] = React.useState<CoachRecommendation | null>(null);
  const [isMinimized, setIsMinimized] = React.useState(true);

  const today = React.useMemo(() => new Date().toISOString().split('T')[0], []);

  // Compute daily cache key to avoid redundant API hits
  const cacheKey = React.useMemo(() => `titan_ai_coach_${userId}_${today}`, [userId, today]);

  // Read cache on mount
  React.useEffect(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setAdvice(JSON.parse(cached));
      }
    } catch (e) {
      console.error("Failed to parse cached advice:", e);
    }
  }, [cacheKey]);

  // Helper to parse exercises to muscle groups (matching AnatomyChart)
  const findMuscleGroupForExercise = (exerciseName: string): string | null => {
    if (!exerciseName) return null;
    const cleanName = exerciseName.trim().toLowerCase();
    try {
      const saved = localStorage.getItem('gym_custom_exercises');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const found = parsed.find(e => e.name?.trim().toLowerCase() === cleanName);
          if (found) {
            const rawGroup = found.muscleGroup || found.pool;
            if (['front_delts', 'side_delts', 'rear_delts'].includes(rawGroup)) {
              return 'shoulders';
            }
            if (['upper_core', 'lower_core', 'obliques'].includes(rawGroup)) {
              return 'core';
            }
            if (['upper_chest', 'middle_chest', 'lower_chest'].includes(rawGroup)) {
              return 'chest';
            }
            if (['long_biceps', 'short_biceps', 'brachialis'].includes(rawGroup)) {
              return 'biceps';
            }
            if (['long_triceps', 'lateral_triceps', 'medial_triceps'].includes(rawGroup)) {
              return 'triceps';
            }
            return rawGroup;
          }
        }
      }
    } catch (e) {
      console.error("Error reading custom exercises in AICoach:", e);
    }
    for (const [poolKey, exercises] of Object.entries(POOLS)) {
      const ex = exercises.find(e => e.name.trim().toLowerCase() === cleanName);
      if (ex) {
        const rawGroup = ex.muscleGroup || ex.pool || poolKey;
        if (['front_delts', 'side_delts', 'rear_delts'].includes(rawGroup)) {
          return 'shoulders';
        }
        if (['upper_core', 'lower_core', 'obliques'].includes(rawGroup)) {
          return 'core';
        }
        if (['upper_chest', 'middle_chest', 'lower_chest'].includes(rawGroup)) {
          return 'chest';
        }
        if (['long_biceps', 'short_biceps', 'brachialis'].includes(rawGroup)) {
          return 'biceps';
        }
        if (['long_triceps', 'lateral_triceps', 'medial_triceps'].includes(rawGroup)) {
          return 'triceps';
        }
        return rawGroup;
      }
    }
    return null;
  };

  // Helper to calculate difference in calendar days
  const getDaysDiff = (dateStr1: string, dateStr2: string): number => {
    if (!dateStr1 || !dateStr2) return 999;
    try {
      const d1 = new Date(dateStr1 + 'T00:00:00');
      const d2 = new Date(dateStr2 + 'T00:00:00');
      const diffTime = d1.getTime() - d2.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      return isNaN(diffDays) ? 999 : diffDays;
    } catch {
      return 999;
    }
  };

  const getMuscleStatuses = () => {
    const groupsToShow = ['chest', 'upper_back', 'lower_back', 'shoulders', 'quads', 'hamstrings', 'glutes', 'calves', 'biceps', 'triceps', 'core', 'forearms'];
    const statuses: Record<string, { daysDiff: number; label: string }> = {};

    groupsToShow.forEach(group => {
      statuses[group] = {
        daysDiff: 999,
        label: 'Fully Rested'
      };
    });

    // 1. Process active session sets (Today)
    if (sets && sets.length > 0) {
      sets.forEach(set => {
        const group = findMuscleGroupForExercise(set.exerciseName);
        if (group && statuses[group]) {
          statuses[group].daysDiff = 0;
        }
      });
    }

    // 2. Process archived workouts (Last 5 days)
    if (archivedWorkouts && archivedWorkouts.length > 0) {
      archivedWorkouts.forEach(workout => {
        const wDate = workout.date;
        if (!wDate) return;

        const diff = getDaysDiff(today, wDate);
        if (diff >= 0 && diff <= 4) {
          const wSets = workout.sets || [];
          wSets.forEach((set: any) => {
            const group = findMuscleGroupForExercise(set.exerciseName);
            if (group && statuses[group]) {
              if (diff < statuses[group].daysDiff) {
                statuses[group].daysDiff = diff;
              }
            }
          });
        }
      });
    }

    // Label matching chart styles
    groupsToShow.forEach(group => {
      const state = statuses[group];
      if (state.daysDiff === 0) {
        state.label = 'Active Today';
      } else if (state.daysDiff === 1) {
        state.label = 'Fatigued (Day 1)';
      } else if (state.daysDiff === 2) {
        state.label = 'Fatigued (Day 2)';
      } else if (state.daysDiff === 3) {
        state.label = 'Ready / Soreness Clear (Day 3)';
      } else {
        state.label = 'Fully Rested';
      }
    });

    return statuses;
  };

  const executeAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const muscleStatuses = getMuscleStatuses();

      const response = await fetch('/api/coach/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ muscleStatuses })
      });

      if (!response.ok) {
        let errMsg = 'Intelligence scan returned server-side validation anomaly.';
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errMsg = errData.error;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data: CoachRecommendation = await response.json();
      setAdvice(data);

      // Save to cache
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Severe connection grid interruption. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-white/15 rounded-md overflow-hidden bg-black/70 backdrop-blur-md h-full">
      <Scroll3DItem>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          type="button"
          className={`w-full flex items-center justify-between py-4 px-4 sm:px-6 text-left transition-all cursor-pointer group ${
            !isMinimized ? "border-b border-white/15" : ""
          } hover:bg-white/[0.04]`}
        >
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-md bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center text-gym-accent group-hover:bg-gym-accent/20 group-hover:border-gym-accent/40 transition-all shrink-0">
              <Cpu className="w-4 h-4 animate-pulse" />
            </div>
            <h4 className="text-sm sm:text-base md:text-lg font-light italic font-serif text-white/90 whitespace-nowrap truncate">
              Tactical AI Co-Pilot
            </h4>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {advice && isMinimized && (
              <span className="hidden sm:inline-block text-[10px] font-mono text-white/40 group-hover:text-gym-accent/80 px-2 py-0.5 border border-white/10 rounded-full uppercase tabular-nums whitespace-nowrap shrink-0 transition-colors">
                {advice.recoveryScore}% READY • {advice.overallStatus}
              </span>
            )}
            {!isMinimized ? (
              <ChevronUp className="w-4 h-4 text-white/20 group-hover:text-gym-accent transition-transform duration-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/20 group-hover:text-gym-accent transition-transform duration-500" />
            )}
          </div>
        </button>
      </Scroll3DItem>

      <AnimatePresence initial={false}>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {error && (
                <div className="mb-4 bg-red-950/20 border border-red-500/30 p-3 rounded-md text-red-400 font-mono text-[10px] uppercase tracking-wider flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">[SYSTEM DEFECT / QUOTA EXHAUSTED]: </span>
                    <span className="normal-case block mt-1 text-white/95 text-[11px] leading-relaxed select-text">{error}</span>
                  </div>
                </div>
              )}

              {!advice ? (
                /* Blank state / Inactive directive */
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Sparkles className="w-8 h-8 text-white/15 mb-3" />
                  <h5 className="text-sm font-semibold text-white/80">Operative Bot Ready for Directive</h5>
                  <p className="text-sm text-white/40 max-w-md mx-auto mt-2 mb-5 font-normal">
                    Initiate a 5-day physiological biomechanics scan to decipher muscle recruitment cycles and formulate today's tactical workout.
                  </p>
                  <button
                    onClick={executeAnalysis}
                    disabled={loading}
                    type="button"
                    className="bg-gym-accent text-black font-black uppercase tracking-[0.2em] text-[10px] px-6 py-3.5 rounded-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-gym-accent/10 flex items-center gap-2.5"
                  >
                    <Cpu className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'CALCULATING BIOMETRIC SYNAPSE...' : 'INITIATE TACTICAL ANALYSIS'}
                  </button>
                </div>
              ) : (
                /* Advice loaded successfully */
                <div className="space-y-6">
                  {/* Top row: Quote & Recovery Score */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                    {/* Motivational Battle Quote */}
                    <div className="lg:col-span-8 bg-[#050505] border border-white/5 p-4 rounded-md flex flex-col justify-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gym-accent/[0.02] rounded-full blur-2xl" />
                      <span className="text-[8px] text-gym-accent font-black uppercase tracking-widest block mb-1 font-mono">OPERATIVE DIRECTIVE</span>
                      <p className="text-sm sm:text-base font-light italic font-serif text-white leading-snug tracking-tight">
                        "{advice.shortMotivationalQuote}"
                      </p>
                    </div>

                    {/* Recovery Score Dial */}
                    <div className="lg:col-span-4 bg-[#050505] border border-white/5 p-4 rounded-md flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] text-white/70 font-black uppercase tracking-widest font-mono block">SYSTEM STATUS</span>
                        <div className="text-sm font-semibold text-white">{advice.overallStatus}</div>
                        <div className="text-[10px] text-white/80 uppercase tracking-wider font-medium">Aggregate Bio-Recovery</div>
                      </div>

                      <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          {/* Background circle */}
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            className="stroke-white/5 fill-none"
                            strokeWidth="4"
                          />
                          {/* Fill circle */}
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            className="stroke-gym-accent fill-none transition-all duration-1000 ease-out"
                            strokeWidth="4"
                            strokeDasharray={`${2 * Math.PI * 34}`}
                            strokeDashoffset={`${2 * Math.PI * 34 * (1 - advice.recoveryScore / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-lg font-black text-gym-accent font-mono tracking-tight leading-none mt-1">
                            {advice.recoveryScore}%
                          </span>
                          <span className="text-[7px] text-white/40 uppercase tracking-widest font-mono scale-95 mt-0.5">READY</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Target Guidance Splits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Green Priority Targets */}
                    <div className="bg-green-950/10 border border-green-500/20 p-5 rounded-md relative">
                      <div className="absolute top-2 right-3">
                        <CheckCircle className="w-4 h-4 text-green-500/30" />
                      </div>
                      <h5 className="text-[9px] font-black font-mono text-green-400 uppercase tracking-[0.3em] mb-3">RECUPERATED TARGETS (TRAIN TODAY)</h5>
                      
                      {advice.priorityTargets.length === 0 ? (
                        <p className="text-xs text-white/40 font-light italic">No fully rested muscle pools available. Rest highly recommended.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2.5">
                          {advice.priorityTargets.map((target, i) => (
                            <span 
                              key={i} 
                              className="bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold font-mono uppercase px-3 py-1 rounded-md tracking-wider flex items-center gap-1.5"
                            >
                              <Zap className="w-2.5 h-2.5 animate-bounce fill-current" />
                              {target}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Red Avoid Targets */}
                    <div className="bg-red-950/10 border border-red-500/20 p-5 rounded-md relative">
                      <div className="absolute top-2 right-3">
                        <AlertTriangle className="w-4 h-4 text-red-500/30" />
                      </div>
                      <h5 className="text-[9px] font-black font-mono text-red-400 uppercase tracking-[0.3em] mb-3">MATRICULATED FATIGUE (AVOID TODAY)</h5>
                      
                      {advice.avoidTargets.length === 0 ? (
                        <p className="text-xs text-white/40 font-light italic">No fatigue registered currently. Pure recruitment canvas.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2.5">
                          {advice.avoidTargets.map((target, i) => (
                            <span 
                              key={i} 
                              className="bg-red-500/10 border border-red-500/35 text-red-400 text-[10px] font-bold font-mono uppercase px-3 py-1 rounded-md tracking-widest flex items-center gap-1.5"
                            >
                              <Shield className="w-2.5 h-2.5" />
                              {target}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom block: Detailed Recommendation & Physiology Analysis */}
                  <div className="bg-[#050505] border border-white/5 p-5 rounded-md space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <h5 className="text-[10px] font-black font-mono text-white/80 uppercase tracking-[0.3em]">PHYSIOLOGICAL REPORT & RECOMMENDATION</h5>
                      <span className="text-[10px] text-gym-accent font-mono font-black uppercase tracking-widest">
                        FOCUS: {advice.customWorkoutRecommendation}
                      </span>
                    </div>
                    <p className="text-sm text-white/90 font-light leading-relaxed tracking-wide font-sans">
                      {advice.personalizedAdvice}
                    </p>
                    
                    {/* Re-analyze action at the bottom */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={executeAnalysis}
                        type="button"
                        disabled={loading}
                        className="flex items-center gap-2 text-[9px] text-white/40 hover:text-gym-accent uppercase tracking-widest font-black font-mono transition-all cursor-pointer disabled:opacity-50"
                      >
                        <RotateCcw className={`w-3 h-3 ${loading ? 'animate-spin text-gym-accent' : ''}`} />
                        {loading ? 'ANALYZING...' : 'Re-Run Tactical Analysis'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AICoach;
