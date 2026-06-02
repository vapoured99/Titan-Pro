import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Dumbbell, 
  Brain, 
  Award, 
  TrendingUp, 
  Scale, 
  User as UserIcon, 
  HelpCircle, 
  Flame,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import AnatomyChart from './AnatomyChart';
import { POOLS } from '../data/exercises';

interface SessionSet {
  id?: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  timestamp?: any;
}

interface UserProfile {
  id?: string;
  displayName?: string;
  bodyweight?: number;
  sex?: 'male' | 'female' | 'other';
  age?: number;
}

interface AnatomyDashboardProps {
  sessionSets: SessionSet[];
  archivedWorkouts: any[];
  profile: UserProfile | null;
  saveSettings: (settings: any) => Promise<void>;
  setToast: (toast: { message: string; type: 'success' | 'pb' | 'info' } | null) => void;
  setActiveView: (view: string) => void;
}

// 1-Rep Max Epley Calculation
const calc1RM = (weight: number, reps: number): number => {
  if (reps <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
};

export default function AnatomyDashboard({
  sessionSets = [],
  archivedWorkouts = [],
  profile,
  saveSettings,
  setToast,
  setActiveView
}: AnatomyDashboardProps) {
  // Theme styling helpers matching Titan Gym CLI theme
  const accentColor = "#22c55e"; // gym-accent green

  // Keep track of which dropdowns/accordions are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    physiological: false,
    radar: true, // Default open Option 2: Muscular Radar Analysis
    strength: false
  });

  const toggleSection = (section: string) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Local state for bodyweight (falls back to profile, can be saved to profile)
  const [localBodyweight, setLocalBodyweight] = useState<number>(() => {
    return profile?.bodyweight || 80;
  });

  // Sync bodyweight if profile loads
  useEffect(() => {
    if (profile?.bodyweight) {
      setLocalBodyweight(profile.bodyweight);
    }
  }, [profile?.bodyweight]);

  const [savingBodyweight, setSavingBodyweight] = useState(false);

  const handleSaveBodyweight = async () => {
    try {
      setSavingBodyweight(true);
      await saveSettings({ bodyweight: localBodyweight });
      setToast({ message: `Bodyweight successfully updated to ${localBodyweight} kg`, type: 'success' });
    } catch (e) {
      setToast({ message: 'Failed to update bodyweight in firebase cloud database', type: 'info' });
    } finally {
      setSavingBodyweight(false);
    }
  };

  // Muscle mapping helper
  const findMuscleGroup = (exerciseName: string): string | null => {
    if (!exerciseName) return null;
    const cleanName = exerciseName.trim().toLowerCase();

    // Check custom exercises
    try {
      const saved = localStorage.getItem('gym_custom_exercises');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const found = parsed.find(e => e.name?.trim().toLowerCase() === cleanName);
          if (found) {
            return found.muscleGroup || found.pool;
          }
        }
      }
    } catch (_) {}

    // Check raw exercise list
    for (const [poolKey, exercises] of Object.entries(POOLS)) {
      const ex = exercises.find(e => e.name.trim().toLowerCase() === cleanName);
      if (ex) {
        return ex.muscleGroup || ex.pool || poolKey;
      }
    }
    return null;
  };

  // --- 2. Dynamic Muscular Radar Calculation ---
  const radarData = useMemo(() => {
    // 6 strategic buckets for balanced athletic biomechanics
    const categories: Record<string, { label: string; count: number; exercises: Set<string> }> = {
      chest: { label: 'Chest (Push)', count: 0, exercises: new Set() },
      back: { label: 'Back (Pull)', count: 0, exercises: new Set() },
      shoulders: { label: 'Shoulders', count: 0, exercises: new Set() },
      legs: { label: 'Legs/Lower', count: 0, exercises: new Set() },
      arms: { label: 'Arms', count: 0, exercises: new Set() },
      core: { label: 'Core', count: 0, exercises: new Set() }
    };

    const processSet = (exName: string) => {
      const rawGroup = findMuscleGroup(exName);
      if (!rawGroup) return;

      if (['chest', 'upper_chest', 'middle_chest', 'lower_chest'].includes(rawGroup)) {
        categories.chest.count += 1;
        categories.chest.exercises.add(exName);
      } else if (rawGroup === 'back' || rawGroup === 'upper_back' || rawGroup === 'lower_back') {
        categories.back.count += 1;
        categories.back.exercises.add(exName);
      } else if (['shoulders', 'front_delts', 'side_delts', 'rear_delts'].includes(rawGroup)) {
        categories.shoulders.count += 1;
        categories.shoulders.exercises.add(exName);
      } else if (['quads', 'hamstrings', 'glutes', 'calves', 'legs'].includes(rawGroup)) {
        categories.legs.count += 1;
        categories.legs.exercises.add(exName);
      } else if (['biceps', 'triceps', 'forearms', 'arms', 'long_biceps', 'short_biceps', 'brachialis', 'long_triceps', 'lateral_triceps', 'medial_triceps'].includes(rawGroup)) {
        categories.arms.count += 1;
        categories.arms.exercises.add(exName);
      } else if (['core', 'upper_core', 'lower_core', 'obliques'].includes(rawGroup)) {
        categories.core.count += 1;
        categories.core.exercises.add(exName);
      }
    };

    // Calculate from current active sets
    sessionSets.forEach(s => processSet(s.exerciseName));

    // Calculate from past workouts
    archivedWorkouts.forEach(w => {
      if (w?.sets && Array.isArray(w.sets)) {
        w.sets.forEach((s: any) => processSet(s.exerciseName));
      }
    });

    const maxCount = Math.max(...Object.values(categories).map(c => c.count), 1);

    // Calculate symmetric scores on a scale of 0 to 100
    const list = Object.entries(categories).map(([key, value]) => {
      // Relative score: 20-100 base display factor for nicer visual layout
      const score = Math.max(20, Math.round((value.count / maxCount) * 100));
      return {
        key,
        label: value.label,
        count: value.count,
        uniqueExercises: value.exercises.size,
        score
      };
    });

    return {
      list,
      maxCount
    };
  }, [sessionSets, archivedWorkouts]);

  // Compute balance analysis based on count distributions
  const balanceAnalysis = useMemo(() => {
    const data = radarData.list;
    const totals = data.reduce((acc, curr) => acc + curr.count, 0);
    if (totals === 0) {
      return {
        score: 100,
        title: "Clean Baseline",
        desc: "Start logging your workouts to populate your neural biomechanics radar.",
        type: "neutral",
        tips: ["Log your first session in the Workout tab to begin mapping.", "Balance compound lifts with functional mobility exercises."]
      };
    }

    const map = data.reduce((acc, curr) => {
      acc[curr.key] = curr.count;
      return acc;
    }, {} as Record<string, number>);

    // Dynamic Balance calculation formula
    const counts = data.map(d => d.count);
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    const sumSqDiffs = counts.reduce((a, b) => a + Math.pow(b - avg, 2), 0);
    const stdDev = Math.sqrt(sumSqDiffs / counts.length);
    const maxPossStdDev = avg * Math.sqrt(counts.length - 1); // rough baseline normalizing
    const rawSymmetry = 100 - Math.min(65, Math.round((stdDev / (maxPossStdDev || 1)) * 100));

    let title = "Symmetrical Athlete";
    let desc = "Your muscle groups have highly balanced training volumes. Keep up this structured approach!";
    let type = "success";
    const tips: string[] = [];

    // Detect dominance biases
    const pushCount = map.chest + map.shoulders;
    const pullCount = map.back;
    if (pushCount > pullCount * 1.8 && pushCount > 4) {
      title = "Anterior Chain Dominant";
      desc = "You are logging significantly more horizontal and vertical pressing volume than pulling volume. This poses long-term posture risks.";
      type = "warning";
      tips.push("Add Barbell Rows or Cable Pull-throughs to balance pushing forces.", "Integrate Rear Delt Flyes to open up chest cavities.");
    } else if (pullCount > pushCount * 1.8 && pullCount > 4) {
      title = "Posterior Chain biased";
      desc = "Your back workouts are highly developed, but pressing systems are currently behind. Your upper back is hyper-stabilized.";
      type = "info";
      tips.push("Consider increasing your Bench Press or Incline Dumbbell volume.", "Inject Overhead Presses into your shoulder sequences.");
    }

    // Upper/Lower distribution check
    const upperCount = map.chest + map.back + map.shoulders + map.arms;
    const lowerCount = map.legs;
    if (upperCount > lowerCount * 2.5 && upperCount > 5) {
      title = "Upper-Body Biased";
      desc = "Your lower posterior muscles and quads receive sparse volume compared to high-intensity upper workouts.";
      type = "warning";
      tips.push("Commit to lower-body compound movements (Squats, Deadlifts).", "Integrate calf raises and split squats twice a week to secure ankles and knees.");
    } else if (lowerCount > upperCount * 1.5 && lowerCount > 4) {
      title = "Lower-Body Specialists";
      desc = "Fantastic lower-body focus. Ensure your shoulder girdles and midback are strong enough to support high spinal loads.";
      type = "info";
      tips.push("Stabilize your core and upper back with Bent-over Rows.", "Train your rotator cuffs with face-pulls.");
    }

    if (tips.length === 0) {
      tips.push("Maintain a 1:1 ratio between rowing (Pull) and pressing (Push) volume.", "Incorporate multi-planar movements (lateral, transverse) for structural mobility.");
    }

    return {
      score: rawSymmetry,
      title,
      desc,
      type,
      tips
    };
  }, [radarData]);

  // --- 3. Relative Strength Metrics Calculation ---
  // Look for historical maximums of 4 major movements
  const compoundMaxes = useMemo(() => {
    const movements = {
      bench: { name: "Bench Press", best: 0, reps: 0, est1RM: 0, date: "" },
      squat: { name: "Back Squat", best: 0, reps: 0, est1RM: 0, date: "" },
      deadlift: { name: "Deadlift", best: 0, reps: 0, est1RM: 0, date: "" },
      ohp: { name: "Overhead Press", best: 0, reps: 0, est1RM: 0, date: "" }
    };

    const normalizeMatch = (name: string, target: string) => {
      const n = name.toLowerCase().trim();
      const t = target.toLowerCase();
      // Look for matches in common compound variants
      if (t === 'bench') return n.includes('bench press') && !n.includes('incline') && !n.includes('decline');
      if (t === 'squat') return n.includes('squat') && (n.includes('barbell') || n.includes('back') || n.includes('safety bar'));
      if (t === 'deadlift') return n.includes('deadlift') && !n.includes('romanian') && !n.includes('stiff-leg');
      if (t === 'ohp') return (n.includes('overhead press') || n.includes('military press') || n.includes('shoulder press')) && n.includes('barbell');
      return false;
    };

    const inspectSet = (set: any, dateString: string) => {
      Object.keys(movements).forEach((key) => {
        const mKey = key as keyof typeof movements;
        if (normalizeMatch(set.exerciseName, mKey)) {
          const current1RM = calc1RM(set.weight, set.reps);
          if (current1RM > movements[mKey].est1RM) {
            movements[mKey].best = set.weight;
            movements[mKey].reps = set.reps;
            movements[mKey].est1RM = current1RM;
            movements[mKey].date = dateString || set.date || "Today";
          }
        }
      });
    };

    // Parse active sets
    sessionSets.forEach(s => inspectSet(s, "Active Today"));

    // Parse archived workouts
    archivedWorkouts.forEach(w => {
      if (w?.sets) {
        w.sets.forEach((s: any) => inspectSet(s, w.date));
      }
    });

    return movements;
  }, [sessionSets, archivedWorkouts]);

  // Manual override values for 1RM inputs in case the user wants to test hypothetical weights
  const [benchManual, setBenchManual] = useState<string>("");
  const [squatManual, setSquatManual] = useState<string>("");
  const [deadliftManual, setDeadliftManual] = useState<string>("");
  const [ohpManual, setOhpManual] = useState<string>("");

  const actualBenchMax = useMemo(() => {
    return parseFloat(benchManual) || compoundMaxes.bench.est1RM || 0;
  }, [benchManual, compoundMaxes.bench.est1RM]);

  const actualSquatMax = useMemo(() => {
    return parseFloat(squatManual) || compoundMaxes.squat.est1RM || 0;
  }, [squatManual, compoundMaxes.squat.est1RM]);

  const actualDeadliftMax = useMemo(() => {
    return parseFloat(deadliftManual) || compoundMaxes.deadlift.est1RM || 0;
  }, [deadliftManual, compoundMaxes.deadlift.est1RM]);

  const actualOhpMax = useMemo(() => {
    return parseFloat(ohpManual) || compoundMaxes.ohp.est1RM || 0;
  }, [ohpManual, compoundMaxes.ohp.est1RM]);

  // Retrieve sex from profile to customize multiplier standards
  const sex = profile?.sex || 'male';

  // Compute strength standards
  const strengthStandards = useMemo(() => {
    const isFemale = sex === 'female';
    
    // Bench standards as bw-multiple
    const benchLevels = isFemale 
      ? { novice: 0.45, intermediate: 0.65, advanced: 0.85, elite: 1.2 } 
      : { novice: 0.75, intermediate: 1.1, advanced: 1.5, elite: 2.0 };

    const squatLevels = isFemale
      ? { novice: 0.65, intermediate: 1.0, advanced: 1.4, elite: 1.8 }
      : { novice: 1.0, intermediate: 1.5, advanced: 2.0, elite: 2.5 };

    const deadliftLevels = isFemale
      ? { novice: 0.8, intermediate: 1.2, advanced: 1.6, elite: 2.1 }
      : { novice: 1.2, intermediate: 1.75, advanced: 2.3, elite: 2.8 };

    const ohpLevels = isFemale
      ? { novice: 0.3, intermediate: 0.45, advanced: 0.65, elite: 0.85 }
      : { novice: 0.5, intermediate: 0.75, advanced: 1.0, elite: 1.25 };

    const getLevel = (maxVal: number, levels: typeof benchLevels) => {
      const ratio = maxVal / (localBodyweight || 80);
      if (ratio < levels.novice) return { text: "Untrained", ratio, next: "Novice", target: levels.novice, progress: Math.min(100, Math.round((ratio / levels.novice) * 100)), color: "text-zinc-500" };
      if (ratio < levels.intermediate) return { text: "Novice", ratio, next: "Intermediate", target: levels.intermediate, progress: Math.min(100, Math.round(((ratio - levels.novice) / (levels.intermediate - levels.novice)) * 100)), color: "text-blue-400" };
      if (ratio < levels.advanced) return { text: "Intermediate", ratio, next: "Advanced", target: levels.advanced, progress: Math.min(100, Math.round(((ratio - levels.intermediate) / (levels.advanced - levels.intermediate)) * 100)), color: "text-yellow-500" };
      if (ratio < levels.elite) return { text: "Advanced", ratio, next: "Elite", target: levels.elite, progress: Math.min(100, Math.round(((ratio - levels.advanced) / (levels.elite - levels.advanced)) * 100)), color: "text-gym-accent" };
      return { text: "Elite Veteran", ratio, next: "Max Level achieved", target: levels.elite, progress: 100, color: "text-purple-400 font-extrabold animate-pulse" };
    };

    return {
      bench: getLevel(actualBenchMax, benchLevels),
      squat: getLevel(actualSquatMax, squatLevels),
      deadlift: getLevel(actualDeadliftMax, deadliftLevels),
      ohp: getLevel(actualOhpMax, ohpLevels)
    };
  }, [sex, localBodyweight, actualBenchMax, actualSquatMax, actualDeadliftMax, actualOhpMax]);


  // Helper for rendering glowing radar axes
  const radarChartSVG = useMemo(() => {
    const list = radarData.list;
    const size = 260;
    const center = size / 2;
    const radius = 90;

    // Angles: vertical star starting upward at -90 degrees (-π/2)
    const vertices = list.map((item, i) => {
      const angle = -Math.PI / 2 + (i * Math.PI) / 3;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      
      // Plot value coordinates
      const valMultiplier = item.score / 100; // e.g., 0.2 to 1.0
      const valX = center + (radius * valMultiplier) * Math.cos(angle);
      const valY = center + (radius * valMultiplier) * Math.sin(angle);

      // Label coords adjusted outward for margins
      const labelOffset = 21;
      const lblX = center + (radius + labelOffset) * Math.cos(angle);
      const lblY = center + (radius + labelOffset) * Math.sin(angle);

      return {
        ...item,
        x,
        y,
        valX,
        valY,
        lblX,
        lblY,
        angle
      };
    });

    // Ring grid data
    const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

    return {
      size,
      center,
      radius,
      vertices,
      rings
    };
  }, [radarData]);

  return (
    <div className="space-y-6" id="anatomy-dashboard">
      
      {/* ────────────────── DROP DOWN 1: PHYSIOLOGICAL ANALYSIS ────────────────── */}
      <div className="border border-white/5 rounded-sm overflow-hidden bg-[#050505]/40 backdrop-blur-md">
        <button
          onClick={() => toggleSection('physiological')}
          className="w-full flex items-center justify-between p-5 text-left border-b border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer group"
          id="toggle-physiological"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-sm bg-gym-accent/10 flex items-center justify-center border border-gym-accent/20 group-hover:border-gym-accent/40 transition-all">
              <Activity className="w-4 h-4 text-gym-accent" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                1 &mdash; Physiological Analysis
              </h4>
              <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">
                Real-Time Muscle Stimulation Mapping & Recovery Grid
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Quick status summary for closed state */}
            {!expanded.physiological && (
              <span className="hidden sm:inline-block text-[9px] bg-white/5 border border-white/10 px-2.5 py-1 text-white/50 uppercase tracking-widest font-mono">
                Recruited: {radarData.list.filter(l => l.count > 0).length} / 6 Zones
              </span>
            )}
            {expanded.physiological ? (
              <ChevronUp className="w-4 h-4 text-white/40 group-hover:text-white" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white" />
            )}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {expanded.physiological && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-6">
                <AnatomyChart sets={sessionSets} archivedWorkouts={archivedWorkouts} />

                {sessionSets.length === 0 && (
                  <div className="py-5 px-7 bg-white/[0.01] border border-white/5 border-dashed rounded-sm text-center flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-left">
                      <Flame className="w-4 h-4 text-white/20 flex-shrink-0 animate-pulse" />
                      <div>
                        <p className="text-xs font-bold text-white/70 uppercase">No Active Training Session</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                          Visualizing muscle states based on 5-day history pools. Log live sets to trigger glow peaks.
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveView('workout')}
                      className="text-[9px] bg-gym-accent text-black font-black uppercase tracking-widest px-4 py-2 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer rounded-sm"
                    >
                      Fire Up Workout &rarr;
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ────────────────── DROP DOWN 2: MUSCULAR RADAR ANALYSIS ────────────────── */}
      <div className="border border-white/5 rounded-sm overflow-hidden bg-[#050505]/40 backdrop-blur-md">
        <button
          onClick={() => toggleSection('radar')}
          className="w-full flex items-center justify-between p-5 text-left border-b border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer group"
          id="toggle-radar"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-sm bg-gym-accent/10 flex items-center justify-center border border-gym-accent/20 group-hover:border-gym-accent/40 transition-all">
              <Brain className="w-4 h-4 text-gym-accent" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                2 &mdash; Muscular Radar Analysis
              </h4>
              <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">
                Dynamic Biomechanical Symmetry Map & Volume Breakdown
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!expanded.radar && (
              <span className="hidden sm:inline-block text-[9px] bg-white/5 border border-white/10 px-2.5 py-1 text-white/50 uppercase tracking-widest font-mono">
                Symmetry: {balanceAnalysis.score}%
              </span>
            )}
            {expanded.radar ? (
              <ChevronUp className="w-4 h-4 text-white/40 group-hover:text-white" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white" />
            )}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {expanded.radar && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  
                  {/* Radar Chart SVG Viewport (Left 5 cols) */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                    
                    <div className="w-[260px] h-[260px] flex items-center justify-center relative bg-gradient-to-b from-white/[0.01] to-transparent p-4 rounded-full border border-white/[0.02]">
                      <svg viewBox="0 0 260 260" className="w-full h-full">
                        <defs>
                          <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={accentColor} stopOpacity="0.22" />
                            <stop offset="85%" stopColor={accentColor} stopOpacity="0.03" />
                            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
                          </radialGradient>
                          <filter id="radar-line-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>

                        {/* Concentric helper grids */}
                        {radarChartSVG.rings.map((ringMulti, idx) => {
                          const r = radarChartSVG.radius * ringMulti;
                          // Draw hexagonal concentric polygon
                          const points = radarChartSVG.vertices.map((v, i) => {
                            const angle = -Math.PI / 2 + (i * Math.PI) / 3;
                            const x = radarChartSVG.center + r * Math.cos(angle);
                            const y = radarChartSVG.center + r * Math.sin(angle);
                            return `${x},${y}`;
                          }).join(' ');

                          return (
                            <polygon
                              key={idx}
                              points={points}
                              fill="none"
                              stroke="rgba(255, 255, 255, 0.04)"
                              strokeWidth="1"
                              strokeDasharray={idx < 4 ? "3,3" : "none"}
                            />
                          );
                        })}

                        {/* Axis Lines radiating out */}
                        {radarChartSVG.vertices.map((v, i) => (
                          <line
                            key={i}
                            x1={radarChartSVG.center}
                            y1={radarChartSVG.center}
                            x2={v.x}
                            y2={v.y}
                            stroke="rgba(255, 255, 255, 0.08)"
                            strokeWidth="1.2"
                          />
                        ))}

                        {/* Ring Label Percentages */}
                        {[40, 80, 100].map((perc, i) => {
                          const r = radarChartSVG.radius * (perc / 100);
                          return (
                            <text
                              key={i}
                              x={radarChartSVG.center + 5}
                              y={radarChartSVG.center - r - 3}
                              className="text-[7px] text-white/20 font-mono tracking-widest font-black uppercase"
                            >
                              {perc}%
                            </text>
                          );
                        })}

                        {/* Dynamic User Volume Web Polygon */}
                        <polygon
                          points={radarChartSVG.vertices.map(v => `${v.valX},${v.valY}`).join(' ')}
                          fill="url(#radar-glow)"
                          stroke={accentColor}
                          strokeWidth="2"
                          strokeLinejoin="round"
                          filter="url(#radar-line-glow)"
                          className="transition-all duration-1000"
                        />

                        {/* Vertex Plot Points */}
                        {radarChartSVG.vertices.map((v, i) => (
                          <circle
                            key={i}
                            cx={v.valX}
                            cy={v.valY}
                            r="3.5"
                            fill="#000000"
                            stroke={accentColor}
                            strokeWidth="2"
                            className="transition-all duration-1000 cursor-pointer"
                          />
                        ))}

                        {/* Outer Labels */}
                        {radarChartSVG.vertices.map((v, i) => {
                          let textAnchor = "middle";
                          if (Math.cos(v.angle) > 0.1) textAnchor = "start";
                          else if (Math.cos(v.angle) < -0.1) textAnchor = "end";

                          const labelMap: Record<string, string> = {
                            chest: 'CHEST',
                            back: 'BACK',
                            shoulders: 'SHOULDERS',
                            legs: 'LEGS',
                            arms: 'ARMS',
                            core: 'CORE'
                          };
                          const displayName = labelMap[v.key] || v.key.toUpperCase();

                          return (
                            <text
                              key={i}
                              x={v.lblX}
                              y={v.lblY + 3}
                              textAnchor={textAnchor}
                              className="text-[9px] text-white font-mono tracking-wider font-extrabold uppercase fill-white"
                            >
                              {displayName}
                            </text>
                          );
                        })}
                      </svg>
                    </div>

                    <div className="absolute bottom-2 text-center">
                      <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-white/30">
                        Volumetric Bio-Map
                      </span>
                    </div>

                  </div>

                  {/* Symmetry and Recommendations Column (Right 7 cols) */}
                  <div className="lg:col-span-7 space-y-5">
                    
                    {/* Symmetry Performance Meter */}
                    <div className="p-4 bg-zinc-950/70 border border-white/5 rounded-sm relative overflow-hidden">
                      <div className="absolute right-4 top-4 text-4xl font-mono text-white/5 font-black uppercase tracking-tighter">
                        TITAN
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="text-3xl font-mono font-black text-gym-accent tracking-tight">
                          {balanceAnalysis.score}%
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white uppercase tracking-wider">
                            Muscular Symmetry Rating
                          </div>
                          <div className="text-[9px] text-white/40 uppercase tracking-widest">
                            Deviation spread against optimal standard
                          </div>
                        </div>
                      </div>

                      {/* Score description band */}
                      <div className="flex gap-2.5 items-start mt-4 pt-4 border-t border-white/5">
                        {balanceAnalysis.type === 'danger' || balanceAnalysis.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-gym-accent shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="text-xs font-bold text-white uppercase font-mono block">
                            Status: {balanceAnalysis.title}
                          </span>
                          <p className="text-xs text-white/60 leading-relaxed mt-1">
                            {balanceAnalysis.desc}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Zone volume bars breakdown */}
                    <div className="space-y-3 pt-2">
                      <h5 className="text-[9px] font-black text-white/40 uppercase tracking-[0.25em] font-mono">
                        Volumetric Breakdown (Total Sets Logged)
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {radarData.list.map((item) => (
                          <div key={item.key} className="p-3 bg-white/[0.01] border border-white/[0.03] hover:border-white/5 transition-all rounded-sm flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[10px] uppercase font-bold text-white/85 font-mono">
                                {item.label}
                              </span>
                              <span className="text-[10px] font-mono text-gym-accent">
                                {item.count} sets
                              </span>
                            </div>
                            
                            {/* Simple inline visual fill line */}
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div 
                                style={{ width: `${item.score}%` }}
                                className="h-full bg-gym-accent rounded-full opacity-80"
                              />
                            </div>
                            
                            <div className="flex justify-between items-center mt-1 text-[8px] text-white/30 uppercase tracking-widest">
                              <span>Symmetry Weight:</span>
                              <span className="font-mono">{item.score}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Highly relevant actionable training suggestions */}
                    <div className="p-4 bg-gym-accent/5 border border-gym-accent/15 rounded-sm">
                      <h6 className="text-[9px] font-bold text-gym-accent uppercase tracking-widest font-mono flex items-center gap-1.5 mb-2">
                        <Zap className="w-3.5 h-3.5" />
                        Aesthetic & Symmetry Recommendations
                      </h6>
                      <ul className="space-y-2 text-xs text-white/70">
                        {balanceAnalysis.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 bg-[#050505]/40 p-2.5 rounded-sm border border-white/[0.02]">
                            <span className="text-gym-accent text-[11px] font-mono font-bold shrink-0 mt-0.5">&bull;</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ────────────────── DROP DOWN 3: RELATIVE STRENGTH METRICS ────────────────── */}
      <div className="border border-white/5 rounded-sm overflow-hidden bg-[#050505]/40 backdrop-blur-md">
        <button
          onClick={() => toggleSection('strength')}
          className="w-full flex items-center justify-between p-5 text-left border-b border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer group"
          id="toggle-strength"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-sm bg-gym-accent/10 flex items-center justify-center border border-gym-accent/20 group-hover:border-gym-accent/40 transition-all">
              <Award className="w-4 h-4 text-gym-accent" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                3 &mdash; Relative Strength Metrics
              </h4>
              <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">
                Relative Compound Multipliers, 1RM Indexes & Strength Levels
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!expanded.strength && (
              <span className="hidden sm:inline-block text-[9px] bg-white/5 border border-white/10 px-2.5 py-1 text-white/50 uppercase tracking-widest font-mono">
                Weight: {localBodyweight} kg ({sex === 'female' ? 'F' : 'M'})
              </span>
            )}
            {expanded.strength ? (
              <ChevronUp className="w-4 h-4 text-white/40 group-hover:text-white" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white" />
            )}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {expanded.strength && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-6">
                
                {/* Bodyweight Setup Bar */}
                <div className="p-4 bg-[#0a0a0a] border border-white/5 rounded-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <Scale className="w-5 h-5 text-white/40 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                        Power-to-Weight Bio-Reference
                      </h5>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">
                        Strength indicators map directly to your bodyweight standard
                      </p>
                    </div>
                  </div>
                  
                  {/* Weight input and save */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-zinc-950 border border-white/10 rounded-sm overflow-hidden px-2 relative">
                      <input 
                        type="number"
                        min="30"
                        max="250"
                        value={localBodyweight}
                        onChange={(e) => setLocalBodyweight(parseInt(e.target.value) || 0)}
                        className="w-16 bg-transparent text-white text-xs text-center py-2 focus:outline-none focus:ring-0 font-mono font-bold"
                      />
                      <span className="text-[9px] font-black uppercase text-white/30 tracking-widest font-mono ml-1">
                        KG
                      </span>
                    </div>

                    <button
                      onClick={handleSaveBodyweight}
                      disabled={savingBodyweight || localBodyweight === profile?.bodyweight}
                      className="text-[9px] font-black uppercase tracking-widest px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-sm disabled:opacity-20 transition-all cursor-pointer"
                    >
                      {savingBodyweight ? "Persisting..." : "Persist"}
                    </button>
                  </div>
                </div>

                {/* Overrides / Hypotheses explanation */}
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-sm text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-2 font-mono">
                  <TrendingUp className="w-4 h-4 text-gym-accent" />
                  <span>The system auto-calculates 1RM from history. Use fields below to manually simulate new targets.</span>
                </div>

                {/* Compound Standards Grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* BENCH PRESS CARD */}
                  <div className="p-4 bg-zinc-950/80 border border-white/10 rounded-sm relative space-y-4">
                    <div className="flex justify-between items-start border-b border-white/5 pb-3">
                      <div>
                        <span className="text-[9px] bg-gym-accent/10 border border-gym-accent/20 text-gym-accent px-2 py-0.5 rounded-sm uppercase tracking-widest font-mono font-bold mb-1 inline-block">
                          CHEST / SHOULDER / TRICEPS
                        </span>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">
                          1 &mdash; Flat Bench Press
                        </h4>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-mono font-extrabold text-white">
                          Calculated: {compoundMaxes.bench.est1RM || "none"} kg
                        </span>
                        <span className="text-[9px] text-white/30 font-mono uppercase">
                          {compoundMaxes.bench.date ? `Log: ${compoundMaxes.bench.date}` : "No historical logged bench data"}
                        </span>
                      </div>
                    </div>

                    {/* Manual override input line */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/40 uppercase tracking-wider text-[10px]">Manual Input Target 1RM:</span>
                      <div className="flex items-center bg-zinc-900 border border-white/5 px-2 py-1 rounded-sm">
                        <input
                          type="number"
                          placeholder={`${compoundMaxes.bench.est1RM || 0}`}
                          value={benchManual}
                          onChange={(e) => setBenchManual(e.target.value)}
                          className="w-16 bg-transparent text-white focus:outline-none text-[10px] font-mono text-right font-bold"
                        />
                        <span className="text-[8px] text-white/20 font-mono ml-1">KG</span>
                      </div>
                    </div>

                    {/* Performance metrics breakdown */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs font-mono font-bold">
                        <span className="text-white/60 uppercase">Relative Ratio:</span>
                        <span className="text-white">
                          {strengthStandards.bench.ratio.toFixed(2)}x Bodyweight
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-mono font-bold">
                        <span className="text-white/60 uppercase">Tier Rank:</span>
                        <span className={strengthStandards.bench.color}>
                          {strengthStandards.bench.text}
                        </span>
                      </div>

                      {/* Level standard visual progress gauge */}
                      <div className="space-y-1 mt-3">
                        <div className="flex justify-between text-[8px] text-white/30 uppercase tracking-widest font-mono">
                          <span>Progress to {strengthStandards.bench.next}</span>
                          <span>{strengthStandards.bench.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${strengthStandards.bench.progress}%` }}
                            className="h-full bg-gym-accent rounded-full transition-all duration-500"
                          />
                        </div>
                        <div className="flex justify-between text-[7.5px] text-white/20 font-mono">
                          <span>BW target: {(strengthStandards.bench.target * localBodyweight).toFixed(1)} kg ({strengthStandards.bench.target}x)</span>
                          <span>Body weight indicator</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SQUATS CARD */}
                  <div className="p-4 bg-zinc-950/80 border border-white/10 rounded-sm relative space-y-4">
                    <div className="flex justify-between items-start border-b border-white/5 pb-3">
                      <div>
                        <span className="text-[9px] bg-gym-accent/10 border border-gym-accent/20 text-gym-accent px-2 py-0.5 rounded-sm uppercase tracking-widest font-mono font-bold mb-1 inline-block">
                          QUADS / HAMSTRINGS / GLUTES
                        </span>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">
                          2 &mdash; Barbell Back Squats
                        </h4>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-mono font-extrabold text-white">
                          Calculated: {compoundMaxes.squat.est1RM || "none"} kg
                        </span>
                        <span className="text-[9px] text-white/30 font-mono uppercase">
                          {compoundMaxes.squat.date ? `Log: ${compoundMaxes.squat.date}` : "No historical logged squat data"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/40 uppercase tracking-wider text-[10px]">Manual Input Target 1RM:</span>
                      <div className="flex items-center bg-zinc-900 border border-white/5 px-2 py-1 rounded-sm">
                        <input
                          type="number"
                          placeholder={`${compoundMaxes.squat.est1RM || 0}`}
                          value={squatManual}
                          onChange={(e) => setSquatManual(e.target.value)}
                          className="w-16 bg-transparent text-white focus:outline-none text-[10px] font-mono text-right font-bold"
                        />
                        <span className="text-[8px] text-white/20 font-mono ml-1">KG</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs font-mono font-bold">
                        <span className="text-white/60 uppercase">Relative Ratio:</span>
                        <span className="text-white">
                          {strengthStandards.squat.ratio.toFixed(2)}x Bodyweight
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-mono font-bold">
                        <span className="text-white/60 uppercase">Tier Rank:</span>
                        <span className={strengthStandards.squat.color}>
                          {strengthStandards.squat.text}
                        </span>
                      </div>

                      <div className="space-y-1 mt-3">
                        <div className="flex justify-between text-[8px] text-white/30 uppercase tracking-widest font-mono">
                          <span>Progress to {strengthStandards.squat.next}</span>
                          <span>{strengthStandards.squat.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${strengthStandards.squat.progress}%` }}
                            className="h-full bg-gym-accent rounded-full transition-all duration-500"
                          />
                        </div>
                        <div className="flex justify-between text-[7.5px] text-white/20 font-mono">
                          <span>BW target: {(strengthStandards.squat.target * localBodyweight).toFixed(1)} kg ({strengthStandards.squat.target}x)</span>
                          <span>Leg power standard</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DEADLIFT CARD */}
                  <div className="p-4 bg-zinc-950/80 border border-white/10 rounded-sm relative space-y-4">
                    <div className="flex justify-between items-start border-b border-white/5 pb-3">
                      <div>
                        <span className="text-[9px] bg-gym-accent/10 border border-gym-accent/20 text-gym-accent px-2 py-0.5 rounded-sm uppercase tracking-widest font-mono font-bold mb-1 inline-block">
                          POSTERIOR CHAIN / BACK / GRIP
                        </span>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">
                          3 &mdash; Barbell Deadlifts
                        </h4>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-mono font-extrabold text-white">
                          Calculated: {compoundMaxes.deadlift.est1RM || "none"} kg
                        </span>
                        <span className="text-[9px] text-white/30 font-mono uppercase">
                          {compoundMaxes.deadlift.date ? `Log: ${compoundMaxes.deadlift.date}` : "No historical logged deadlift data"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/40 uppercase tracking-wider text-[10px]">Manual Input Target 1RM:</span>
                      <div className="flex items-center bg-zinc-900 border border-white/5 px-2 py-1 rounded-sm">
                        <input
                          type="number"
                          placeholder={`${compoundMaxes.deadlift.est1RM || 0}`}
                          value={deadliftManual}
                          onChange={(e) => setDeadliftManual(e.target.value)}
                          className="w-16 bg-transparent text-white focus:outline-none text-[10px] font-mono text-right font-bold"
                        />
                        <span className="text-[8px] text-white/20 font-mono ml-1">KG</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs font-mono font-bold">
                        <span className="text-white/60 uppercase">Relative Ratio:</span>
                        <span className="text-white">
                          {strengthStandards.deadlift.ratio.toFixed(2)}x Bodyweight
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-mono font-bold">
                        <span className="text-white/60 uppercase">Tier Rank:</span>
                        <span className={strengthStandards.deadlift.color}>
                          {strengthStandards.deadlift.text}
                        </span>
                      </div>

                      <div className="space-y-1 mt-3">
                        <div className="flex justify-between text-[8px] text-white/30 uppercase tracking-widest font-mono">
                          <span>Progress to {strengthStandards.deadlift.next}</span>
                          <span>{strengthStandards.deadlift.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${strengthStandards.deadlift.progress}%` }}
                            className="h-full bg-gym-accent rounded-full transition-all duration-500"
                          />
                        </div>
                        <div className="flex justify-between text-[7.5px] text-white/20 font-mono">
                          <span>BW target: {(strengthStandards.deadlift.target * localBodyweight).toFixed(1)} kg ({strengthStandards.deadlift.target}x)</span>
                          <span>Spine safety metric</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* OVERHEAD PRESS CARD */}
                  <div className="p-4 bg-zinc-950/80 border border-white/10 rounded-sm relative space-y-4">
                    <div className="flex justify-between items-start border-b border-white/5 pb-3">
                      <div>
                        <span className="text-[9px] bg-gym-accent/10 border border-gym-accent/20 text-gym-accent px-2 py-0.5 rounded-sm uppercase tracking-widest font-mono font-bold mb-1 inline-block">
                          CHRONIC SHOULDERS / ROTATOR SCAPS
                        </span>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">
                          4 &mdash; Barbell Overhead Press
                        </h4>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-mono font-extrabold text-white">
                          Calculated: {compoundMaxes.ohp.est1RM || "none"} kg
                        </span>
                        <span className="text-[9px] text-white/30 font-mono uppercase">
                          {compoundMaxes.ohp.date ? `Log: ${compoundMaxes.ohp.date}` : "No historical logged press data"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/40 uppercase tracking-wider text-[10px]">Manual Input Target 1RM:</span>
                      <div className="flex items-center bg-zinc-900 border border-white/5 px-2 py-1 rounded-sm">
                        <input
                          type="number"
                          placeholder={`${compoundMaxes.ohp.est1RM || 0}`}
                          value={ohpManual}
                          onChange={(e) => setOhpManual(e.target.value)}
                          className="w-16 bg-transparent text-white focus:outline-none text-[10px] font-mono text-right font-bold"
                        />
                        <span className="text-[8px] text-white/20 font-mono ml-1">KG</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs font-mono font-bold">
                        <span className="text-white/60 uppercase">Relative Ratio:</span>
                        <span className="text-white">
                          {strengthStandards.ohp.ratio.toFixed(2)}x Bodyweight
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-mono font-bold">
                        <span className="text-white/60 uppercase">Tier Rank:</span>
                        <span className={strengthStandards.ohp.color}>
                          {strengthStandards.ohp.text}
                        </span>
                      </div>

                      <div className="space-y-1 mt-3">
                        <div className="flex justify-between text-[8px] text-white/30 uppercase tracking-widest font-mono">
                          <span>Progress to {strengthStandards.ohp.next}</span>
                          <span>{strengthStandards.ohp.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${strengthStandards.ohp.progress}%` }}
                            className="h-full bg-gym-accent rounded-full transition-all duration-500"
                          />
                        </div>
                        <div className="flex justify-between text-[7.5px] text-white/20 font-mono">
                          <span>BW target: {(strengthStandards.ohp.target * localBodyweight).toFixed(1)} kg ({strengthStandards.ohp.target}x)</span>
                          <span>Rotator force index</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
