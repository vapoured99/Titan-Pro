import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Sparkles, AlertTriangle, CheckCircle, Zap, RotateCcw, Shield } from 'lucide-react';
import { POOLS } from '../data/exercises';

interface SessionSet {
  id?: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  timestamp?: any;
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
    for (const [poolKey, exercises] of Object.entries(POOLS)) {
      const ex = exercises.find(e => e.name.trim().toLowerCase() === cleanName);
      if (ex) {
        return ex.muscleGroup || ex.pool || poolKey;
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
    const groupsToShow = ['chest', 'back', 'shoulders', 'quads', 'hamstrings', 'glutes', 'calves', 'biceps', 'triceps', 'core', 'forearms'];
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
        throw new Error('Intelligence scan returned server-side validation anomaly.');
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
    <div className="bg-black/60 border border-white/10 rounded-sm p-6 relative overflow-hidden backdrop-blur-md mt-8">
      {/* Dynamic Cyber Deco Grid Bars */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gym-accent/30 to-transparent" />
      <div className="absolute top-0 right-10 w-24 h-24 bg-gym-accent/5 rounded-full blur-3xl -z-10" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-gym-accent/10 border border-gym-accent/30 flex items-center justify-center text-gym-accent shadow-sm shadow-gym-accent/10">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-[10px] text-gym-accent font-black uppercase tracking-[0.3em] font-mono">TACTICAL OPERATIVE CO-PILOT</h4>
            <p className="text-xs text-white/40 font-light">Real-time biomechanical target guidance & recovery assessment</p>
          </div>
        </div>

        {advice && (
          <button
            onClick={executeAnalysis}
            type="button"
            disabled={loading}
            className="flex items-center gap-2 self-start sm:self-center text-[9px] text-white/40 hover:text-gym-accent uppercase tracking-widest font-black font-mono transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3 h-3 ${loading ? 'animate-spin text-gym-accent' : ''}`} />
            Re-Analyze Biometrics
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!advice ? (
          /* Blank state / Inactive directive */
          <motion.div
            key="analyze-prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <Sparkles className="w-8 h-8 text-white/15 mb-3" />
            <h5 className="text-sm font-semibold text-white/80">Operative Bot Ready for Directive</h5>
            <p className="text-xs text-white/40 max-w-md mx-auto mt-1 mb-5">
              Initiate a 5-day physiological biomechanics scan to decipher muscle recruitment cycles and formulate today's tactical workout.
            </p>
            <button
              onClick={executeAnalysis}
              disabled={loading}
              type="button"
              className="bg-gym-accent text-black font-black uppercase tracking-[0.2em] text-[10px] px-6 py-3.5 rounded-sm hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-gym-accent/10 flex items-center gap-2.5"
            >
              <Cpu className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'CALCULATING BIOMETRIC SYNAPSE...' : 'INITIATE TACTICAL ANALYSIS'}
            </button>
            {error && (
              <p className="text-red-400 font-mono text-[9px] uppercase tracking-widest mt-4">
                [SYSTEM DEFECT]: {error}
              </p>
            )}
          </motion.div>
        ) : (
          /* Advice loaded successfully */
          <motion.div
            key="advice-display"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Top row: Quote & Recovery Score */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Motivational Battle Quote */}
              <div className="lg:col-span-8 bg-[#050505] border border-white/5 p-4 rounded-sm flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gym-accent/[0.02] rounded-full blur-2xl" />
                <span className="text-[8px] text-gym-accent font-black uppercase tracking-widest block mb-1 font-mono">OPERATIVE DIRECTIVE</span>
                <p className="text-base font-light italic font-serif text-white leading-snug tracking-tight">
                  "{advice.shortMotivationalQuote}"
                </p>
              </div>

              {/* Recovery Score Dial */}
              <div className="lg:col-span-4 bg-[#050505] border border-white/5 p-4 rounded-sm flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[8px] text-white/40 font-black uppercase tracking-widest font-mono block">SYSTEM STATUS</span>
                  <div className="text-xs font-semibold text-white/80">{advice.overallStatus}</div>
                  <div className="text-[9px] text-white/30 uppercase tracking-wider">Aggregate Bio-Recovery</div>
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
              <div className="bg-green-950/10 border border-green-500/20 p-5 rounded-sm relative">
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
                        className="bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold font-mono uppercase px-3 py-1 rounded-sm tracking-wider flex items-center gap-1.5"
                      >
                        <Zap className="w-2.5 h-2.5 animate-bounce fill-current" />
                        {target}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Red Avoid Targets */}
              <div className="bg-red-950/10 border border-red-500/20 p-5 rounded-sm relative">
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
                        className="bg-red-500/10 border border-red-500/35 text-red-400 text-[10px] font-bold font-mono uppercase px-3 py-1 rounded-sm tracking-widest flex items-center gap-1.5"
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
            <div className="bg-[#050505] border border-white/5 p-5 rounded-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                <h5 className="text-[9px] font-black font-mono text-white/40 uppercase tracking-[0.3em]">PHYSIOLOGICAL REPORT & RECOMMENDATION</h5>
                <span className="text-[9px] text-gym-accent font-mono font-black uppercase tracking-widest">
                  FOCUS: {advice.customWorkoutRecommendation}
                </span>
              </div>
              <p className="text-xs text-white/70 font-light leading-relaxed tracking-wide font-sans">
                {advice.personalizedAdvice}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AICoach;
