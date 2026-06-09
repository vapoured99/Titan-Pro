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
import RadarChart from './RadarChart';
import { POOLS } from '../data/exercises';

interface SessionSet {
  id?: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  timestamp?: any;
  notes?: string;
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
  routines?: any[];
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
  setActiveView,
  routines = []
}: AnatomyDashboardProps) {
  // Add a local state for Anatomy Dashboard Mode
  const [anatomyMode, setAnatomyMode] = useState<'logged' | 'routine'>('logged');
  // Local state for selected routine in Anatomy Panel
  const [selectedDashboardRoutineId, setSelectedDashboardRoutineId] = useState<string | null>(null);

  // Derive selected routine
  const selectedDashboardRoutine = useMemo(() => {
    if (!routines || routines.length === 0) return null;
    return routines.find((r) => r.id === selectedDashboardRoutineId) || routines[0] || null;
  }, [routines, selectedDashboardRoutineId]);

  // Sync selected dashboard routine id when routines load
  useEffect(() => {
    if (routines && routines.length > 0 && !selectedDashboardRoutineId) {
      setSelectedDashboardRoutineId(routines[0].id || null);
    }
  }, [routines, selectedDashboardRoutineId]);

  const mapRawGroupToMainMuscleGroup = (rawGroup: string | null): string => {
    if (!rawGroup) return 'Other';
    const rg = rawGroup.toLowerCase();
    if (['chest', 'upper_chest', 'middle_chest', 'lower_chest'].includes(rg)) return 'Chest';
    if (['back', 'upper_back', 'lower_back', 'lats'].includes(rg)) return 'Back';
    if (['shoulders', 'front_delts', 'side_delts', 'rear_delts'].includes(rg)) return 'Shoulders';
    if (['quads', 'hamstrings', 'glutes', 'calves', 'legs'].includes(rg)) return 'Legs';
    if (['biceps', 'long_biceps', 'short_biceps', 'brachialis'].includes(rg)) return 'Biceps';
    if (['triceps', 'long_triceps', 'lateral_triceps', 'medial_triceps'].includes(rg)) return 'Triceps';
    if (['core', 'upper_core', 'lower_core', 'obliques'].includes(rg)) return 'Core';
    if (['forearms'].includes(rg)) return 'Forearms';
    return 'Other';
  };
  // Theme styling helpers matching Titan Gym CLI theme
  const accentColor = "#22c55e"; // gym-accent green

  // Keep track of which dropdowns/accordions are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    physiological: false,
    radar: true, // Default open Option 2: Muscular Radar Analysis
    strength: false,
    biomechanical: true,
    cnsFatigue: false
  });

  const [barbellWeight, setBarbellWeight] = useState<number>(100);
  const [selectedPercentageLift, setSelectedPercentageLift] = useState<'bench' | 'squat' | 'deadlift' | 'ohp'>('bench');

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

  // Calculate routine muscular target breakdown
  const routineMuscleGroups = useMemo(() => {
    if (!selectedDashboardRoutine || !selectedDashboardRoutine.sets) return [];
    
    // Get unique exercises
    const uniqueExs = Array.from(
      new Set(selectedDashboardRoutine.sets.map((s: any) => s.exerciseName))
    ) as string[];
    
    const counts: Record<string, number> = {};
    let total = 0;
    
    uniqueExs.forEach((name) => {
      const rawG = findMuscleGroup(name);
      const group = mapRawGroupToMainMuscleGroup(rawG);
      counts[group] = (counts[group] || 0) + 1;
      total++;
    });
    
    if (total === 0) return [];
    
    return Object.entries(counts)
      .map(([group, count]) => ({
        group,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [selectedDashboardRoutine, findMuscleGroup]);

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

  // --- Biomechanical Load Balance Calculations over Rolling 30-Day Window ---
  const biomechanicalData = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);

    const isWithin30Days = (dateStr: string): boolean => {
      if (!dateStr) return false;
      try {
        const date = new Date(dateStr + 'T00:00:00');
        if (isNaN(date.getTime())) return false;
        const diffTime = today.getTime() - date.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 30;
      } catch {
        return false;
      }
    };

    const normalizeGroupTo30Day = (raw: string | null): string => {
      if (!raw) return 'other';
      const rg = raw.toLowerCase().trim();
      if (['front_delts', 'side_delts', 'rear_delts'].includes(rg)) return 'shoulders';
      if (['upper_core', 'lower_core', 'obliques', 'core'].includes(rg)) return 'core';
      if (['upper_chest', 'middle_chest', 'lower_chest', 'chest'].includes(rg)) return 'chest';
      if (['long_biceps', 'short_biceps', 'brachialis', 'biceps'].includes(rg)) return 'biceps';
      if (['long_triceps', 'lateral_triceps', 'medial_triceps', 'triceps'].includes(rg)) return 'triceps';
      if (['back', 'upper_back', 'lats'].includes(rg)) return 'upper_back';
      if (['lower_back'].includes(rg)) return 'lower_back';
      if (['quads'].includes(rg)) return 'quads';
      if (['hamstrings'].includes(rg)) return 'hamstrings';
      if (['glutes'].includes(rg)) return 'glutes';
      if (['calves'].includes(rg)) return 'calves';
      if (['forearms'].includes(rg)) return 'forearms';
      return 'other';
    };

    const volumes: Record<string, number> = {
      chest: 0,
      upper_back: 0,
      lower_back: 0,
      shoulders: 0,
      quads: 0,
      hamstrings: 0,
      glutes: 0,
      calves: 0,
      biceps: 0,
      triceps: 0,
      core: 0,
      forearms: 0
    };

    // 1. Current active sets
    sessionSets.forEach(s => {
      const g = normalizeGroupTo30Day(findMuscleGroup(s.exerciseName));
      if (g in volumes) {
        volumes[g] += 1;
      }
    });

    // 2. Archived workouts in last 30 days
    archivedWorkouts.forEach(w => {
      if (w && isWithin30Days(w.date) && w.sets && Array.isArray(w.sets)) {
        w.sets.forEach((s: any) => {
          const g = normalizeGroupTo30Day(findMuscleGroup(s.exerciseName));
          if (g in volumes) {
            volumes[g] += 1;
          }
        });
      }
    });

    return volumes;
  }, [sessionSets, archivedWorkouts, findMuscleGroup]);

  const biomechanicalAnalysis = useMemo(() => {
    const data = biomechanicalData;

    // --- 1. Chest vs Upper Back ---
    const chestVol = data.chest;
    const backVol = data.upper_back;
    const chestTotal = chestVol + backVol;
    const chestPct = chestTotal > 0 ? Math.round((chestVol / chestTotal) * 100) : 50;
    const backPct = chestTotal > 0 ? Math.round((backVol / chestTotal) * 100) : 50;
    
    let chestBackStatus: 'balanced' | 'moderate' | 'critical' = 'balanced';
    let chestBackWarning = '';
    let chestBackTip = '';
    if (chestTotal > 0) {
      if (chestVol >= backVol * 2 && chestVol > 2) {
        chestBackStatus = 'critical';
        chestBackWarning = 'Slouch & Posture Risk';
        chestBackTip = 'Chest volume exceeds Upper Back volume by more than 2:1. Add more rowing movements (e.g. Barbell Rows, Cable Rows, Face Pulls) to solve intermediate rounded posture risk.';
      } else if (chestVol > backVol * 1.35 && chestVol > 1) {
        chestBackStatus = 'moderate';
        chestBackWarning = 'Mild Chest Prepotency';
        chestBackTip = 'Slightly increase your midback/rowing sets to pull the skeletal structure back into balance.';
      } else {
        chestBackStatus = 'balanced';
      }
    }

    // --- 2. Quads vs Hamstrings ---
    const quadVol = data.quads;
    const hamVol = data.hamstrings;
    const legTotal = quadVol + hamVol;
    const quadPct = legTotal > 0 ? Math.round((quadVol / legTotal) * 100) : 50;
    const hamPct = legTotal > 0 ? Math.round((hamVol / legTotal) * 100) : 50;

    let quadHamStatus: 'balanced' | 'moderate' | 'critical' = 'balanced';
    let quadHamWarning = '';
    let quadHamTip = '';
    if (legTotal > 0) {
      if (quadVol >= hamVol * 2 && quadVol > 2) {
        quadHamStatus = 'critical';
        quadHamWarning = 'Knee Joint Shear Risk';
        quadHamTip = 'Quads volume exceeds Hamstrings volume by more than 2:1. Incorporate Romanian Deadlifts (RDLs), lying leg curls, and glute-ham raises to secure anterior/posterior lower balance.';
      } else if (quadVol > hamVol * 1.4 && quadVol > 1) {
        quadHamStatus = 'moderate';
        quadHamWarning = 'Mild Quadriceps Bias';
        quadHamTip = 'Incorporate dedicated posterior knee flexion curls to offset pushing forces on knee caps.';
      } else {
        quadHamStatus = 'balanced';
      }
    }

    // --- 3. Biceps vs Triceps ---
    const bicVol = data.biceps;
    const triVol = data.triceps;
    const armTotal = bicVol + triVol;
    const bicPct = armTotal > 0 ? Math.round((bicVol / armTotal) * 100) : 50;
    const triPct = armTotal > 0 ? Math.round((triVol / armTotal) * 100) : 50;

    let armStatus: 'balanced' | 'moderate' | 'critical' = 'balanced';
    let armWarning = '';
    let armTip = '';
    if (armTotal > 0) {
      if (bicVol >= triVol * 2.2 && bicVol > 2) {
        armStatus = 'critical';
        armWarning = 'Elbow Flexor Overstress';
        armTip = 'Biceps volume is more than 2.2x higher than Triceps. Add skull crushers or cable pushdowns to protect tendons.';
      } else if (triVol >= bicVol * 2.2 && triVol > 2) {
        armStatus = 'critical';
        armWarning = 'Elbow Extensor Bias';
        armTip = 'Triceps volume is more than 2.2x higher than Biceps. Target incline dumbbell curls or standard curls to stabilize elbow complexes.';
      } else if ((bicVol > triVol * 1.5 || triVol > bicVol * 1.5) && armTotal > 2) {
        armStatus = 'moderate';
        armWarning = 'Minor Arm Inequality';
        armTip = 'Review arm distributions; aim to pair curls with similar sets of presses/extensions.';
      } else {
        armStatus = 'balanced';
      }
    }

    // Dynamic Alert Count
    let totalAlerts = 0;
    if (chestBackStatus === 'critical') totalAlerts++;
    if (quadHamStatus === 'critical') totalAlerts++;
    if (armStatus === 'critical') totalAlerts++;

    return {
      chestBack: {
        chestVol,
        backVol,
        total: chestTotal,
        chestPct,
        backPct,
        status: chestBackStatus,
        warning: chestBackWarning,
        tip: chestBackTip
      },
      quadHam: {
        quadVol,
        hamVol,
        total: legTotal,
        quadPct,
        hamPct,
        status: quadHamStatus,
        warning: quadHamWarning,
        tip: quadHamTip
      },
      bicepsTriceps: {
        bicVol,
        triVol,
        total: armTotal,
        bicPct,
        triPct,
        status: armStatus,
        warning: armWarning,
        tip: armTip
      },
      totalAlerts
    };
  }, [biomechanicalData]);

  // --- 4. Relative Strength Metrics Calculation ---
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

  const cnsFatigueAnalysis = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const isWithin72Hours = (dateStr: string): boolean => {
      if (!dateStr) return false;
      try {
        const date = new Date(dateStr + 'T00:00:00');
        if (isNaN(date.getTime())) return false;
        const diffTime = today.getTime() - date.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 3;
      } catch {
        return false;
      }
    };

    const getDaysAgo = (dateStr: string): number => {
      if (!dateStr) return 0;
      try {
        const date = new Date(dateStr + 'T00:00:00');
        if (isNaN(date.getTime())) return 0;
        
        const tToday = new Date(today);
        tToday.setHours(0, 0, 0, 0);
        const tDate = new Date(date);
        tDate.setHours(0, 0, 0, 0);
        
        const diffTime = tToday.getTime() - tDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
      } catch {
        return 0;
      }
    };

    const getSpinalIntensity = (name: string): number => {
      const n = name.toLowerCase().trim();
      if (n.includes('deadlift') || n.includes('rack pull') || n.includes('good morning') || n.includes('deficit deadlift')) return 9.0;
      if (n.includes('squat') && (n.includes('barbell') || n.includes('back') || n.includes('front') || n.includes('safety'))) return 7.5;
      if (n.includes('row') && (n.includes('barbell') || n.includes('bent over') || n.includes('t-bar'))) return 5.0;
      if (n.includes('press') && (n.includes('overhead') || n.includes('military') || n.includes('standing') || n.includes('shoulder')) || n.includes('clean') || n.includes('snatch') || n.includes('thruster')) return 5.0;
      if (n.includes('squat') || n.includes('leg press') || n.includes('hack squat') || n.includes('lunges')) return 3.0;
      if (n.includes('bench press') || n.includes('chest press') || n.includes('dip') || n.includes('pullup') || n.includes('chin up') || n.includes('lat pulldown') || n.includes('dumbbell row')) return 2.0;
      if (n.includes('curl') || n.includes('extension') || n.includes('pushdown') || n.includes('fly') || n.includes('raise') || n.includes('shrug') || n.includes('crunch') || n.includes('plank')) return 0.4;
      return 0.5;
    };

    // We will group sets by exercise name and daysAgo to correctly apply set-diminishing fatigue
    const exerciseLoads: Record<string, Record<number, number>> = {};
    const registerSetCount = (exerciseName: string, daysAgo: number) => {
      const nameKey = exerciseName.toLowerCase().trim();
      if (!exerciseLoads[nameKey]) {
        exerciseLoads[nameKey] = {};
      }
      exerciseLoads[nameKey][daysAgo] = (exerciseLoads[nameKey][daysAgo] || 0) + 1;
    };

    // 1. Process active sets (today = 0 days ago)
    sessionSets.forEach(s => {
      registerSetCount(s.exerciseName, 0);
    });

    // 2. Process archived sets in last 72 hours
    archivedWorkouts.forEach(w => {
      if (w && isWithin72Hours(w.date) && w.sets && Array.isArray(w.sets)) {
        const daysAgo = getDaysAgo(w.date);
        if (daysAgo <= 3) {
          w.sets.forEach((s: any) => {
            registerSetCount(s.exerciseName, daysAgo);
          });
        }
      }
    });

    let totalSpinalLoad = 0;
    const contributors: { exercise: string; setsCount: number; loadingPerSet: number; totalContribution: number }[] = [];

    // Map to get the display title of the exercise
    const exerciseDisplayNames: Record<string, string> = {};
    sessionSets.forEach(s => {
      exerciseDisplayNames[s.exerciseName.toLowerCase().trim()] = s.exerciseName;
    });
    archivedWorkouts.forEach(w => {
      if (w && w.sets && Array.isArray(w.sets)) {
        w.sets.forEach((s: any) => {
          exerciseDisplayNames[s.exerciseName.toLowerCase().trim()] = s.exerciseName;
        });
      }
    });

    Object.entries(exerciseLoads).forEach(([nameKey, daysAgoRecord]) => {
      const baseIntensity = getSpinalIntensity(nameKey);
      const displayName = exerciseDisplayNames[nameKey] || nameKey;
      
      let exerciseTotalContribution = 0;
      let totalSetsCount = 0;

      Object.entries(daysAgoRecord).forEach(([daysAgoStr, setsCount]) => {
        const daysAgo = parseInt(daysAgoStr, 10);
        
        let timeDecay = 1.0;
        if (daysAgo === 1) timeDecay = 0.50;
        else if (daysAgo === 2) timeDecay = 0.25;
        else if (daysAgo >= 3) timeDecay = 0.10;

        let intervalContribution = 0;
        for (let setIndex = 0; setIndex < setsCount; setIndex++) {
          let setDecay = 1.0;
          if (setIndex === 1) setDecay = 0.5;
          else if (setIndex === 2) setDecay = 0.3;
          else if (setIndex >= 3) setDecay = 0.2;
          
          intervalContribution += baseIntensity * setDecay * timeDecay;
        }

        exerciseTotalContribution += intervalContribution;
        totalSetsCount += setsCount;
      });

      totalSpinalLoad += exerciseTotalContribution;

      contributors.push({
        exercise: displayName,
        setsCount: totalSetsCount,
        loadingPerSet: baseIntensity,
        totalContribution: exerciseTotalContribution
      });
    });

    contributors.sort((a, b) => b.totalContribution - a.totalContribution);

    // Dynamic CNS fatigue index capped at 100%
    // 30 load units represents heavy central fatigue safely and realistically with the diminishing loads model
    const score = Math.min(100, Math.round((totalSpinalLoad / 30) * 100));

    let label = 'FRESH & ENERGY CHARGED';
    let sublabel = 'Optimal neural efficiency. Ready for high-force motor recruitment.';
    let recommendations = 'CNS integrity is fully recovered. You are clear for high-load strength testing (3-5 rep max effort). Workouts targeting heavy compounds will be highly productive today.';
    let levelColor = 'text-green-400 bg-green-500/10 border-green-500/20';
    let barColor = 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
    let hexColor = '#22c55e';

    if (score > 85) {
      label = 'CRITICAL CNS NEURAL FRY';
      sublabel = 'Extremely high central fatigue detected. Joint shear risks elevated.';
      recommendations = 'Take an active deload day or full active rest. If training today, perform strictly low-impact single-joint isolation machines (reps 15+). Do not touch the vertical barbell.';
      levelColor = 'text-red-400 bg-red-950/40 border-red-500/20 animate-pulse';
      barColor = 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]';
      hexColor = '#ef4444';
    } else if (score > 55) {
      label = 'CNS TAXED & DAMPENED';
      sublabel = 'Substantial central nervous wear. Spinal stabilizers are under load.';
      recommendations = 'Rest highly advised or transition to mechanical tension / hypertrophy. Keep absolute load sub-maximal (<75% 1RM). Focus on unilateral dumbbell or machine work rather than heavy standing barbell lifts.';
      levelColor = 'text-amber-500 bg-amber-950/40 border-amber-500/20';
      barColor = 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]';
      hexColor = '#f59e0b';
    } else if (score > 25) {
      label = 'MODERATE SYSTEMIC WEAR';
      sublabel = 'Accumulating spinal load. Productive hypertrophy zoning.';
      recommendations = 'Standard capacity. Excellent window for mid-range hypertrophy loads (8-12 reps per set). Ensure correct structural patterns and core bracing prior to squats or rows.';
      levelColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      barColor = 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
      hexColor = '#10b981';
    }

    return {
      score,
      totalSpinalLoad,
      contributors,
      label,
      sublabel,
      recommendations,
      levelColor,
      barColor,
      hexColor
    };
  }, [sessionSets, archivedWorkouts]);

  const spinalRegions = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const isWithin72Hours = (dateStr: string): boolean => {
      if (!dateStr) return false;
      try {
        const date = new Date(dateStr + 'T00:00:00');
        if (isNaN(date.getTime())) return false;
        const diffTime = today.getTime() - date.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 3;
      } catch {
        return false;
      }
    };

    const getDaysAgo = (dateStr: string): number => {
      if (!dateStr) return 0;
      try {
        const date = new Date(dateStr + 'T00:00:00');
        if (isNaN(date.getTime())) return 0;
        const tToday = new Date(today);
        tToday.setHours(0, 0, 0, 0);
        const tDate = new Date(date);
        tDate.setHours(0, 0, 0, 0);
        const diffTime = tToday.getTime() - tDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
      } catch {
        return 0;
      }
    };

    const exerciseLoads: Record<string, Record<number, number>> = {};
    const registerSetCount = (exerciseName: string, daysAgo: number) => {
      const nameKey = exerciseName.toLowerCase().trim();
      if (!exerciseLoads[nameKey]) {
        exerciseLoads[nameKey] = {};
      }
      exerciseLoads[nameKey][daysAgo] = (exerciseLoads[nameKey][daysAgo] || 0) + 1;
    };

    sessionSets.forEach(s => registerSetCount(s.exerciseName, 0));

    archivedWorkouts.forEach(w => {
      if (w && isWithin72Hours(w.date) && w.sets && Array.isArray(w.sets)) {
        const daysAgo = getDaysAgo(w.date);
        if (daysAgo <= 3) {
          w.sets.forEach((s: any) => {
            registerSetCount(s.exerciseName, daysAgo);
          });
        }
      }
    });

    let lumbarUnits = 0;
    let thoracicUnits = 0;
    let cervicalUnits = 0;

    Object.entries(exerciseLoads).forEach(([nameKey, daysAgoRecord]) => {
      let lumbarBase = 0.1;
      let thoracicBase = 0.1;
      let cervicalBase = 0.1;
      const n = nameKey;

      if (n.includes('deadlift') || n.includes('rack pull') || n.includes('good morning') || n.includes('deficit')) {
        lumbarBase = 9.0;
        thoracicBase = 3.5;
        cervicalBase = 1.0;
      } else if (n.includes('squat') && (n.includes('barbell') || n.includes('back') || n.includes('front') || n.includes('safety') || n.includes('goblet'))) {
        lumbarBase = 7.5;
        thoracicBase = 2.5;
        cervicalBase = 1.0;
      } else if (n.includes('squat') || n.includes('leg press') || n.includes('hack squat') || n.includes('lunge')) {
        lumbarBase = 3.0;
        thoracicBase = 0.5;
        cervicalBase = 0.2;
      } else if (n.includes('row') || n.includes('pullup') || n.includes('chin up') || n.includes('pulldown') || n.includes('lat pull')) {
        thoracicBase = 7.0;
        lumbarBase = n.includes('bent over') || n.includes('barbell') ? 4.5 : 1.0;
        cervicalBase = 1.0;
      } else if (n.includes('bench') || n.includes('chest') || n.includes('fly') || n.includes('dip') || n.includes('pushup')) {
        thoracicBase = 1.0; // Stabilizing retraction only
        lumbarBase = 0.2;
        cervicalBase = 0.2;
      } else if (n.includes('overhead press') || n.includes('military') || n.includes('shoulder press')) {
        cervicalBase = 6.0;
        thoracicBase = 3.0;
        lumbarBase = 1.5;
      } else if (n.includes('shrug') || n.includes('upright row') || n.includes('clean') || n.includes('snatch')) {
        cervicalBase = 5.0;
        thoracicBase = 2.5;
        lumbarBase = 1.5;
      } else if (n.includes('raise') || n.includes('extension') || n.includes('curl') || n.includes('pushdown') || n.includes('crunch') || n.includes('plank')) {
        cervicalBase = n.includes('raise') ? 0.8 : 0.1;
        thoracicBase = 0.2;
        lumbarBase = (n.includes('crunch') || n.includes('plank')) ? 0.8 : 0.1;
      } else {
        lumbarBase = 0.5;
        thoracicBase = 0.5;
        cervicalBase = 0.2;
      }

      Object.entries(daysAgoRecord).forEach(([daysAgoStr, setsCount]) => {
        const daysAgo = parseInt(daysAgoStr, 10);
        
        let timeDecay = 1.0;
        if (daysAgo === 1) timeDecay = 0.5;
        else if (daysAgo === 2) timeDecay = 0.25;
        else if (daysAgo >= 3) timeDecay = 0.1;

        let lumbarInterval = 0;
        let thoracicInterval = 0;
        let cervicalInterval = 0;

        for (let setIndex = 0; setIndex < setsCount; setIndex++) {
          let setDecay = 1.0;
          if (setIndex === 1) setDecay = 0.5;
          else if (setIndex === 2) setDecay = 0.3;
          else if (setIndex >= 3) setDecay = 0.2;
          
          lumbarInterval += lumbarBase * setDecay * timeDecay;
          thoracicInterval += thoracicBase * setDecay * timeDecay;
          cervicalInterval += cervicalBase * setDecay * timeDecay;
        }

        lumbarUnits += lumbarInterval;
        thoracicUnits += thoracicInterval;
        cervicalUnits += cervicalInterval;
      });
    });

    return {
      lumbar: Math.min(100, Math.round((lumbarUnits / 25) * 100)),
      thoracic: Math.min(100, Math.round((thoracicUnits / 25) * 100)),
      cervical: Math.min(100, Math.round((cervicalUnits / 15) * 100))
    };
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
    const size = 365;
    const center = size / 2;
    const radius = 110;

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
                {/* Visual Interactivity & Sync Controller */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-sm bg-black/40 border border-white/5">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setAnatomyMode('logged')}
                      className={`px-3.5 py-1.5 text-[10px] uppercase tracking-wider font-extrabold cursor-pointer rounded-sm border transition-all ${
                        anatomyMode === 'logged'
                          ? 'bg-gym-accent border-gym-accent text-black shadow-lg shadow-gym-accent/10'
                          : 'bg-transparent border-white/10 text-white/60 hover:text-white hover:border-white/20'
                      }`}
                    >
                      Logged Sessions Mode
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnatomyMode('routine')}
                      className={`px-3.5 py-1.5 text-[10px] uppercase tracking-wider font-extrabold cursor-pointer rounded-sm border transition-all ${
                        anatomyMode === 'routine'
                          ? 'bg-gym-accent border-gym-accent text-black shadow-lg shadow-gym-accent/10'
                          : 'bg-transparent border-white/10 text-white/60 hover:text-white hover:border-white/20'
                      }`}
                    >
                      Saved Routines Mode
                    </button>
                  </div>

                  {anatomyMode === 'routine' && (
                    <div className="flex items-center gap-3.5 w-full sm:w-auto min-w-0 sm:justify-end">
                      <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold whitespace-nowrap">
                        Select Routine Heatmap:
                      </label>
                      {(!routines || routines.length === 0) ? (
                        <span className="text-[10px] text-white/30 italic">No custom routines saved</span>
                      ) : (
                        <select
                          value={selectedDashboardRoutineId || ""}
                          onChange={(e) => setSelectedDashboardRoutineId(e.target.value)}
                          className="bg-black/90 border border-white/10 hover:border-white/25 focus:border-gym-accent text-white text-[10px] font-bold uppercase tracking-wider rounded-sm px-3 py-1.5 focus:outline-none transition-all cursor-pointer min-w-[140px] max-w-[220px]"
                        >
                          {routines.map((r: any, idx: number) => (
                            <option key={r.id || idx} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>

                {anatomyMode === 'routine' && selectedDashboardRoutine && (
                  <div className="p-4 bg-gym-accent/[0.02] border border-gym-accent/10 rounded-sm space-y-3 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/5">
                      <div>
                        <h5 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gym-accent animate-pulse" />
                          {selectedDashboardRoutine.name}
                        </h5>
                        <p className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5">
                          Routine-based simulation heatmap visualization (Amber glow matches emphasis)
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-white/60 font-mono">
                        <span>Exercises: <strong className="text-white">{new Set(selectedDashboardRoutine.sets.map((s: any) => s.exerciseName)).size}</strong></span>
                        <span>•</span>
                        <span>Sets: <strong className="text-white">{selectedDashboardRoutine.sets.length}</strong></span>
                      </div>
                    </div>

                    {routineMuscleGroups.length === 0 ? (
                      <p className="text-[10px] text-white/40 italic">This routine doesn't have any mapped exercises to compute.</p>
                    ) : (
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {routineMuscleGroups.slice(0, 3).map((item, idx) => (
                          <div key={item.group} className="flex items-center gap-1.5">
                            <span className="text-[9px] text-white/40 font-bold uppercase">
                              {idx === 0 ? "Primary Target:" : idx === 1 ? "Secondary:" : "Supporting:"}
                            </span>
                            <span className="text-[10px] text-gym-accent uppercase font-black tracking-wider">
                              {item.group} ({item.percentage}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <AnatomyChart 
                  sets={sessionSets} 
                  archivedWorkouts={archivedWorkouts} 
                  viewMode={anatomyMode}
                  routineMuscleGroups={routineMuscleGroups}
                />

                {anatomyMode === 'logged' && sessionSets.length === 0 && (
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
              <div className="p-6 space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  
                  {/* Radar Chart Component (Left 5 cols) */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center relative w-full pt-2">
                    <div className="w-full max-w-[390px]">
                      <RadarChart sessionSets={sessionSets} archivedWorkouts={archivedWorkouts} size={350} />
                    </div>
                  </div>
                  
                  <div className="hidden lg:col-span-5">
                    
                    <div className="w-[365px] h-[365px] flex items-center justify-center relative bg-gradient-to-b from-white/[0.01] to-transparent p-4 rounded-full border border-white/[0.02]">
                      <svg viewBox="0 0 365 365" className="w-full h-full">
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
                            <motion.polygon
                              key={idx}
                              points={points}
                              fill="none"
                              stroke="rgba(255, 255, 255, 0.04)"
                              strokeWidth="1"
                              strokeDasharray={idx < 4 ? "3,3" : "none"}
                              initial={{ scale: 0.96, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{
                                delay: idx * 0.04,
                                duration: 0.6,
                                ease: [0.16, 1, 0.3, 1]
                              }}
                              style={{
                                originX: `${radarChartSVG.center}px`,
                                originY: `${radarChartSVG.center}px`
                              }}
                            />
                          );
                        })}

                        {/* Axis Lines radiating out */}
                        {radarChartSVG.vertices.map((v, i) => (
                           <motion.line
                            key={i}
                            x1={radarChartSVG.center}
                            y1={radarChartSVG.center}
                            x2={v.x}
                            y2={v.y}
                            stroke="rgba(255, 255, 255, 0.08)"
                            strokeWidth="1.2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{
                              delay: 0.1 + (i * 0.03),
                              duration: 0.8,
                              ease: [0.16, 1, 0.3, 1]
                            }}
                          />
                        ))}

                        {/* Ring Label Percentages */}
                        {[40, 80, 100].map((perc, i) => {
                          const r = radarChartSVG.radius * (perc / 100);
                          return (
                            <motion.text
                              key={i}
                              x={radarChartSVG.center + 5}
                              y={radarChartSVG.center - r - 3}
                              className="text-[7px] text-white/20 font-mono tracking-widest font-black uppercase"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.2 }}
                              transition={{ delay: 0.4, duration: 0.4 }}
                            >
                              {perc}%
                            </motion.text>
                          );
                        })}

                        {/* Dynamic User Volume Web Polygon */}
                        <motion.path
                          d={radarChartSVG.vertices.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.valX} ${v.valY}`).join(' ') + ' Z'}
                          fill="url(#radar-glow)"
                          stroke={accentColor}
                          strokeWidth="2"
                          strokeLinejoin="round"
                          filter="url(#radar-line-glow)"
                          initial={{ pathLength: 0, fillOpacity: 0 }}
                          animate={{ pathLength: 1, fillOpacity: 1 }}
                          transition={{
                            pathLength: {
                              delay: 0.5,
                              duration: 1.3,
                              ease: "easeInOut"
                            },
                            fillOpacity: {
                              delay: 1.6,
                              duration: 0.6,
                              ease: "easeOut"
                            }
                          }}
                        />

                        {/* Vertex Plot Points */}
                        {radarChartSVG.vertices.map((v, i) => (
                          <motion.circle
                            key={i}
                            cx={v.valX}
                            cy={v.valY}
                            r="3.5"
                            fill="#000000"
                            stroke={accentColor}
                            strokeWidth="2"
                            className="cursor-pointer"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                              delay: i * 0.08,
                              type: "spring",
                              stiffness: 350,
                              damping: 11
                            }}
                            style={{
                              originX: `${v.valX}px`,
                              originY: `${v.valY}px`
                            }}
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
                            <motion.text
                              key={i}
                              x={v.lblX}
                              y={v.lblY + 3}
                              textAnchor={textAnchor}
                              className="text-[9px] text-white font-mono tracking-wider font-extrabold uppercase fill-white"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{
                                delay: 0.35 + (i * 0.03),
                                duration: 0.4,
                                ease: "easeOut"
                              }}
                              style={{
                                originX: `${v.lblX}px`,
                                originY: `${v.lblY}px`
                              }}
                            >
                              {displayName}
                            </motion.text>
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
                            <div className="flex justify-between items-center mb-1.5 font-mono">
                              <span className="text-[10px] uppercase font-bold text-white/85">
                                {item.label}
                              </span>
                              <span className="text-[10px] text-gym-accent">
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
                            
                            <div className="flex justify-between items-center mt-1 text-[8px] text-white/30 uppercase tracking-widest font-mono">
                              <span>Symmetry Weight:</span>
                              <span>{item.score}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

                {/* Highly relevant actionable training suggestions - MOVED HERE UNDER BOTH SECTIONS */}
                <div className="p-4 bg-gym-accent/5 border border-gym-accent/15 rounded-sm">
                  <h6 className="text-[9px] font-bold text-gym-accent uppercase tracking-widest font-mono flex items-center gap-1.5 mb-2.5">
                    <Zap className="w-3.5 h-3.5" />
                    Aesthetic & Symmetry Recommendations
                  </h6>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-white/70">
                    {balanceAnalysis.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 bg-[#050505]/40 p-3 rounded-sm border border-white/[0.02]">
                        <span className="text-gym-accent text-[11px] font-mono font-bold shrink-0 mt-0.5">&bull;</span>
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ────────────────── DROP DOWN 3: BIOMECHANICAL STRUCTURAL LOAD ALERTER ────────────────── */}
      <div className="border border-white/5 rounded-sm overflow-hidden bg-[#050505]/40 backdrop-blur-md">
        <button
          onClick={() => toggleSection('biomechanical')}
          className="w-full flex items-center justify-between p-5 text-left border-b border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer group"
          id="toggle-biomechanical"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-sm bg-gym-accent/10 flex items-center justify-center border border-gym-accent/20 group-hover:border-gym-accent/40 transition-all">
              <Scale className="w-4 h-4 text-gym-accent" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                3 &mdash; Biomechanical Load Alerter
              </h4>
              <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">
                Rolling 30-Day Agonist/Antagonist Ratios & Postural Risk Tracker
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!expanded.biomechanical && (
              <span className={`text-[9px] px-2.5 py-1 uppercase tracking-widest font-mono border ${
                biomechanicalAnalysis.totalAlerts > 0
                  ? 'bg-red-950/40 border-red-500/20 text-red-400 font-bold animate-pulse'
                  : 'bg-white/5 border-white/10 text-white/50'
              }`}>
                {biomechanicalAnalysis.totalAlerts > 0
                  ? `❗ POSTURAL WARNINGS: ${biomechanicalAnalysis.totalAlerts}`
                  : "● BIOMECHANICS: BALANCED"}
              </span>
            )}
            {expanded.biomechanical ? (
              <ChevronUp className="w-4 h-4 text-white/40 group-hover:text-white" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white" />
            )}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {expanded.biomechanical && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-6">
                
                {/* Rolling Indicator Box */}
                <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-sm space-y-2">
                  <div className="flex text-[10px] items-center gap-2 text-white/40 uppercase tracking-widest font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-gym-accent animate-ping" />
                    <span>Real-Time Agonist-Antagonist Posture Evaluator</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    This engine processes your active workout files over a <strong>rolling 30-day window</strong> to diagnose kinetic chain deviations. Overtraining an agonist muscle group while neglecting its antagonist leads to extreme tendon pull, rounded postures, joint shear, and increased safety risks.
                  </p>
                </div>

                {/* The 3 Sliders layout */}
                <div className="space-y-8">
                  
                  {/* SLIDER 1: CHEST VS UPPER BACK */}
                  <div className="p-5 bg-white/[0.01] border border-white/5 rounded-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                          1. Shoulder Girdle Balance (Chest vs. Upper Back)
                        </h5>
                        <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">
                          Target Ratio &mdash; 1:1 or higher pulling focus (Prevents Rounded Shoulders)
                        </p>
                      </div>

                      {/* Status badge */}
                      <div>
                        {biomechanicalAnalysis.chestBack.total === 0 ? (
                          <span className="text-[8px] bg-zinc-800 border border-zinc-700 font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider text-zinc-400">
                            Awaiting Data
                          </span>
                        ) : biomechanicalAnalysis.chestBack.status === 'critical' ? (
                          <span className="text-[8px] bg-red-950/50 border border-red-500/30 font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider text-red-500/40 font-bold animate-pulse text-red-400">
                            POSTURAL WARNING
                          </span>
                        ) : biomechanicalAnalysis.chestBack.status === 'moderate' ? (
                          <span className="text-[8px] bg-amber-950/50 border border-amber-500/30 font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider text-amber-500/50 font-bold text-amber-400">
                            MILD IMBALANCE
                          </span>
                        ) : (
                          <span className="text-[8px] bg-gym-accent/15 border border-gym-accent/30 font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider text-gym-accent font-bold">
                            OPTIMAL SYMMETRY
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Sliding Track Graph */}
                    <div className="space-y-1.5 select-none pt-4 pb-1">
                      <div className="relative w-full h-2.5 bg-zinc-900 border border-white/5 rounded-full flex items-center">
                        {/* Perfect Alignment 50% Marker */}
                        <div className="absolute top-[-4px] bottom-[-4px] left-1/2 w-[2px] bg-white/20 z-10" />
                        <span className="absolute top-[-16px] left-[48%] text-[7px] font-mono text-white/25 uppercase tracking-widest">
                          Symmetric Match
                        </span>

                        {/* Drag/Slide Bubble Node Indicator */}
                        <div 
                          style={{ left: `calc(${biomechanicalAnalysis.chestBack.chestPct}% - 6px)` }}
                          className={`absolute w-3.5 h-3.5 rounded-full transition-all duration-500 z-20 ${
                            biomechanicalAnalysis.chestBack.total === 0
                              ? 'bg-zinc-650 border border-zinc-500'
                              : biomechanicalAnalysis.chestBack.status === 'critical'
                              ? 'bg-red-500 border border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse'
                              : biomechanicalAnalysis.chestBack.status === 'moderate'
                              ? 'bg-amber-400 border border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                              : 'bg-gym-accent border-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                          }`}
                        />
                      </div>
                      
                      {/* Left/Right Text Indicators */}
                      <div className="flex justify-between text-[10px] font-mono font-black uppercase text-white/40 tracking-wider">
                        <span className={biomechanicalAnalysis.chestBack.chestPct > 60 ? "text-amber-400" : "text-white/60"}>
                          Chest ({biomechanicalAnalysis.chestBack.chestPct}%)
                        </span>
                        <span className={biomechanicalAnalysis.chestBack.backPct > 60 ? "text-emerald-400" : "text-white/60"}>
                          Upper Back ({biomechanicalAnalysis.chestBack.backPct}%)
                        </span>
                      </div>
                    </div>

                    {/* Tonnage breakdown details */}
                    <div className="flex justify-between text-[10px] text-white/40 uppercase font-mono border-t border-white/5 pt-2">
                      <span>Last 30D chest training load: <strong className="text-white">{biomechanicalAnalysis.chestBack.chestVol} Sets</strong></span>
                      <span>Last 30D back pulling load: <strong className="text-white">{biomechanicalAnalysis.chestBack.backVol} Sets</strong></span>
                    </div>

                    {/* Alerter warning container if active */}
                    {biomechanicalAnalysis.chestBack.total > 0 && biomechanicalAnalysis.chestBack.status !== 'balanced' && (
                      <div className="p-3 bg-red-950/20 border border-red-500/15 rounded-sm flex items-start gap-3 mt-1 animate-fade-in">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-bounce" />
                        <div>
                          <strong className="text-xs text-red-400 uppercase tracking-wide block">{biomechanicalAnalysis.chestBack.warning}</strong>
                          <p className="text-[11px] text-white/70 leading-relaxed mt-1">{biomechanicalAnalysis.chestBack.tip}</p>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* SLIDER 2: QUADS VS HAMSTRINGS */}
                  <div className="p-5 bg-white/[0.01] border border-white/5 rounded-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                          2. Knee Joint Health (Quadriceps vs. Hamstrings)
                        </h5>
                        <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">
                          Target Ratio &mdash; 3:2 (approx. 60% Quads vs. 40% Hamstrings for optimal ACL defense)
                        </p>
                      </div>

                      {/* Status badge */}
                      <div>
                        {biomechanicalAnalysis.quadHam.total === 0 ? (
                          <span className="text-[8px] bg-zinc-800 border border-zinc-700 font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider text-zinc-400">
                            Awaiting Data
                          </span>
                        ) : biomechanicalAnalysis.quadHam.status === 'critical' ? (
                          <span className="text-[8px] bg-red-950/50 border border-red-500/30 font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider text-red-500/40 font-bold animate-pulse text-red-400">
                            POSTURAL WARNING
                          </span>
                        ) : biomechanicalAnalysis.quadHam.status === 'moderate' ? (
                          <span className="text-[8px] bg-amber-950/50 border border-amber-500/30 font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider text-amber-500/50 font-bold text-amber-400">
                            MILD IMBALANCE
                          </span>
                        ) : (
                          <span className="text-[8px] bg-gym-accent/15 border border-gym-accent/30 font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider text-gym-accent font-bold">
                            OPTIMAL SYMMETRY
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Sliding Track Graph */}
                    <div className="space-y-1.5 select-none pt-4 pb-1">
                      <div className="relative w-full h-2.5 bg-zinc-900 border border-white/5 rounded-full flex items-center">
                        {/* Perfect Alignment 60% Marker (approx ideal ratio) */}
                        <div className="absolute top-[-4px] bottom-[-4px] left-[60%] w-[2px] bg-white/20 z-10" />
                        <span className="absolute top-[-16px] left-[55%] text-[7px] font-mono text-white/25 uppercase tracking-widest">
                          Ideal standard (3:2)
                        </span>

                        {/* Drag/Slide Bubble Node Indicator */}
                        <div 
                          style={{ left: `calc(${biomechanicalAnalysis.quadHam.quadPct}% - 6px)` }}
                          className={`absolute w-3.5 h-3.5 rounded-full transition-all duration-500 z-20 ${
                            biomechanicalAnalysis.quadHam.total === 0
                              ? 'bg-zinc-650 border border-zinc-500'
                              : biomechanicalAnalysis.quadHam.status === 'critical'
                              ? 'bg-red-500 border border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse'
                              : biomechanicalAnalysis.quadHam.status === 'moderate'
                              ? 'bg-amber-400 border border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                              : 'bg-gym-accent border-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                          }`}
                        />
                      </div>
                      
                      {/* Left/Right Text Indicators */}
                      <div className="flex justify-between text-[10px] font-mono font-black uppercase text-white/40 tracking-wider">
                        <span className={biomechanicalAnalysis.quadHam.quadPct > 65 ? "text-amber-400" : "text-white/60"}>
                          Quads ({biomechanicalAnalysis.quadHam.quadPct}%)
                        </span>
                        <span className={biomechanicalAnalysis.quadHam.hamPct > 50 ? "text-emerald-400" : "text-white/60"}>
                          Hamstrings ({biomechanicalAnalysis.quadHam.hamPct}%)
                        </span>
                      </div>
                    </div>

                    {/* Tonnage breakdown details */}
                    <div className="flex justify-between text-[10px] text-white/40 uppercase font-mono border-t border-white/5 pt-2">
                      <span>Last 30D quad squats/presses: <strong className="text-white">{biomechanicalAnalysis.quadHam.quadVol} Sets</strong></span>
                      <span>Last 30D hamstring deads/curls: <strong className="text-white">{biomechanicalAnalysis.quadHam.hamVol} Sets</strong></span>
                    </div>

                    {/* Alerter warning container if active */}
                    {biomechanicalAnalysis.quadHam.total > 0 && biomechanicalAnalysis.quadHam.status !== 'balanced' && (
                      <div className="p-3 bg-red-950/20 border border-red-500/15 rounded-sm flex items-start gap-3 mt-1 animate-fade-in">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-bounce" />
                        <div>
                          <strong className="text-xs text-red-400 uppercase tracking-wide block">{biomechanicalAnalysis.quadHam.warning}</strong>
                          <p className="text-[11px] text-white/70 leading-relaxed mt-1">{biomechanicalAnalysis.quadHam.tip}</p>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* SLIDER 3: BICEPS VS TRICEPS */}
                  <div className="p-5 bg-white/[0.01] border border-white/5 rounded-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                          3. Elbow Joint Integrity (Biceps vs. Triceps)
                        </h5>
                        <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">
                          Target Ratio &mdash; 1:1 (Balanced flexion-extension secures tendon insertion pathways)
                        </p>
                      </div>

                      {/* Status badge */}
                      <div>
                        {biomechanicalAnalysis.bicepsTriceps.total === 0 ? (
                          <span className="text-[8px] bg-zinc-800 border border-zinc-700 font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider text-zinc-400">
                            Awaiting Data
                          </span>
                        ) : biomechanicalAnalysis.bicepsTriceps.status === 'critical' ? (
                          <span className="text-[8px] bg-red-950/50 border border-red-500/30 font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider text-red-500/40 font-bold animate-pulse text-red-400">
                            POSTURAL WARNING
                          </span>
                        ) : biomechanicalAnalysis.bicepsTriceps.status === 'moderate' ? (
                          <span className="text-[8px] bg-amber-950/50 border border-amber-500/30 font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider text-amber-500/50 font-bold text-amber-400">
                            MILD IMBALANCE
                          </span>
                        ) : (
                          <span className="text-[8px] bg-gym-accent/15 border border-gym-accent/30 font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider text-gym-accent font-bold">
                            OPTIMAL SYMMETRY
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Sliding Track Graph */}
                    <div className="space-y-1.5 select-none pt-4 pb-1">
                      <div className="relative w-full h-2.5 bg-zinc-900 border border-white/5 rounded-full flex items-center">
                        {/* Perfect Alignment 50% Marker */}
                        <div className="absolute top-[-4px] bottom-[-4px] left-1/2 w-[2px] bg-white/20 z-10" />
                        <span className="absolute top-[-16px] left-[48%] text-[7px] font-mono text-white/25 uppercase tracking-widest">
                          Symmetric Match
                        </span>

                        {/* Drag/Slide Bubble Node Indicator */}
                        <div 
                          style={{ left: `calc(${biomechanicalAnalysis.bicepsTriceps.bicPct}% - 6px)` }}
                          className={`absolute w-3.5 h-3.5 rounded-full transition-all duration-500 z-20 ${
                            biomechanicalAnalysis.bicepsTriceps.total === 0
                              ? 'bg-zinc-650 border border-zinc-500'
                              : biomechanicalAnalysis.bicepsTriceps.status === 'critical'
                              ? 'bg-red-500 border border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse'
                              : biomechanicalAnalysis.bicepsTriceps.status === 'moderate'
                              ? 'bg-amber-400 border border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                              : 'bg-gym-accent border-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                          }`}
                        />
                      </div>
                      
                      {/* Left/Right Text Indicators */}
                      <div className="flex justify-between text-[10px] font-mono font-black uppercase text-white/40 tracking-wider">
                        <span className={biomechanicalAnalysis.bicepsTriceps.bicPct > 60 ? "text-amber-400" : "text-white/60"}>
                          Biceps ({biomechanicalAnalysis.bicepsTriceps.bicPct}%)
                        </span>
                        <span className={biomechanicalAnalysis.bicepsTriceps.triPct > 60 ? "text-emerald-400" : "text-white/60"}>
                          Triceps ({biomechanicalAnalysis.bicepsTriceps.triPct}%)
                        </span>
                      </div>
                    </div>

                    {/* Tonnage breakdown details */}
                    <div className="flex justify-between text-[10px] text-white/40 uppercase font-mono border-t border-white/5 pt-2">
                      <span>Last 30D biceps flexion load: <strong className="text-white">{biomechanicalAnalysis.bicepsTriceps.bicVol} Sets</strong></span>
                      <span>Last 30D triceps extension load: <strong className="text-white">{biomechanicalAnalysis.bicepsTriceps.triVol} Sets</strong></span>
                    </div>

                    {/* Alerter warning container if active */}
                    {biomechanicalAnalysis.bicepsTriceps.total > 0 && biomechanicalAnalysis.bicepsTriceps.status !== 'balanced' && (
                      <div className="p-3 bg-red-950/20 border border-red-500/15 rounded-sm flex items-start gap-3 mt-1 animate-fade-in">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-bounce" />
                        <div>
                          <strong className="text-xs text-red-400 uppercase tracking-wide block">{biomechanicalAnalysis.bicepsTriceps.warning}</strong>
                          <p className="text-[11px] text-white/70 leading-relaxed mt-1">{biomechanicalAnalysis.bicepsTriceps.tip}</p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Highly relevant actionable posture recommendations bottom bar */}
                {biomechanicalAnalysis.totalAlerts === 0 && (
                  <div className="p-4 bg-gym-accent/[0.03] border border-gym-accent/15 rounded-sm flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-gym-accent shrink-0 animate-pulse" />
                    <div>
                      <h6 className="text-xs font-bold text-gym-accent uppercase tracking-wide">Kinetic Chain Integrity Satisfied</h6>
                      <p className="text-[10px] text-white/60 uppercase tracking-wider mt-0.5">
                        Your agonist/antagonist volumes are within optimal limits. Keep rotating movements to maintain structural posture.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ────────────────── DROP DOWN 4: RELATIVE STRENGTH METRICS ────────────────── */}
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
                4 &mdash; Relative Strength Metrics
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

                {/* ────────────────── HIGH-CONTRAST INTERACTIVE WEIGHT-PLATE CALCULATOR ────────────────── */}
                <div className="border-t border-white/5 pt-6 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <h5 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Dumbbell className="w-4 h-4 text-gym-accent" />
                        🏋️ Barbell Loading & Plate Visualizer
                      </h5>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">
                        Select a lift percentage or input weight to visually load on-the-bar sleeves
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-zinc-950 border border-white/10 rounded-sm overflow-hidden px-2 h-10 select-none">
                      <span className="text-[9px] uppercase font-black text-white/30 tracking-widest font-mono">TARGET_LOAD:</span>
                      <input 
                        type="number"
                        min="20"
                        max="500"
                        step="2.5"
                        value={barbellWeight}
                        onChange={(e) => setBarbellWeight(Math.max(20, Math.min(500, parseFloat(e.target.value) || 20)))}
                        className="w-16 bg-transparent text-white text-xs text-center h-full focus:outline-none focus:ring-0 font-mono font-bold"
                      />
                      <span className="text-[9px] font-black uppercase text-gym-accent font-mono">KG</span>
                    </div>
                  </div>

                  {/* Percentage Helper Bar linked to 1RM */}
                  <div className="p-3.5 bg-white/[0.01] border border-white/5 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-[10px]">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-white/40 uppercase tracking-widest font-bold">1RM Reference:</span>
                      {(['bench', 'squat', 'deadlift', 'ohp'] as const).map((lift) => {
                        const maxVal = lift === 'bench' ? actualBenchMax : lift === 'squat' ? actualSquatMax : lift === 'deadlift' ? actualDeadliftMax : actualOhpMax;
                        return (
                          <button
                            key={lift}
                            onClick={() => setSelectedPercentageLift(lift)}
                            className={`px-2 py-1 uppercase text-[9px] font-bold border transition-all cursor-pointer ${
                              selectedPercentageLift === lift
                                ? 'bg-gym-accent/15 border-gym-accent text-gym-accent'
                                : 'bg-black/40 border-white/5 text-white/60 hover:text-white hover:border-white/20'
                            }`}
                          >
                            {lift} ({Math.round(maxVal)}k)
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-white/40 uppercase tracking-widest font-bold">Presets:</span>
                      {[50, 60, 70, 80, 90, 100].map((perc) => {
                        const refMax = selectedPercentageLift === 'bench' ? actualBenchMax : selectedPercentageLift === 'squat' ? actualSquatMax : selectedPercentageLift === 'deadlift' ? actualDeadliftMax : actualOhpMax;
                        const targetPercWeight = refMax ? Math.round((refMax * (perc / 100)) / 2.5) * 2.5 : 0;
                        const disabled = !refMax || targetPercWeight < 20;
                        return (
                          <button
                            key={perc}
                            onClick={() => {
                              if (!disabled) {
                                setBarbellWeight(targetPercWeight);
                              }
                            }}
                            disabled={disabled}
                            className="px-2 py-1 bg-white/5 border border-white/5 hover:bg-white/10 text-white/80 hover:text-white text-[9px] font-bold transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {perc}% ({targetPercWeight > 0 ? `${targetPercWeight}k` : '—'})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Render the Barbell and Plates! */}
                  {(() => {
                    let rem = (barbellWeight - 20) / 2;
                    if (rem < 0) rem = 0;
                    
                    const specPlates = [
                      { w: 25, color: '#ef4444', height: 115, width: 15, label: '25kg', textClass: 'text-[9px] fill-white font-bold font-mono' },
                      { w: 20, color: '#3b82f6', height: 104, width: 15, label: '20kg', textClass: 'text-[9px] fill-white font-bold font-mono' },
                      { w: 15, color: '#eab308', height: 95, width: 14, label: '15kg', textClass: 'text-[9px] fill-black font-bold font-mono' },
                      { w: 10, color: '#22c55e', height: 84, width: 13, label: '10kg', textClass: 'text-[9px] fill-white font-bold font-mono' },
                      { w: 5, color: '#e4e4e7', height: 64, width: 11, label: '5kg', textClass: 'text-[8px] fill-black font-bold font-mono' },
                      { w: 2.5, color: '#52525b', height: 50, width: 9, label: '2.5', textClass: 'text-[7px] fill-white font-mono' },
                      { w: 1.25, color: '#71717a', height: 42, width: 7, label: '1.25', textClass: 'text-[6px] fill-white font-mono' }
                    ];

                    const platesNeeded: { w: number; color: string; height: number; width: number; label: string; textClass: string }[] = [];
                    specPlates.forEach(p => {
                      while (rem >= p.w) {
                        platesNeeded.push(p);
                        rem -= p.w;
                      }
                    });

                    let currentSleeveX = 115;
                    const loadedPlatesRender = platesNeeded.map((p, i) => {
                      const x = currentSleeveX;
                      const y = 80 - p.height / 2;
                      const width = p.width;
                      const height = p.height;
                      currentSleeveX += width + 2.5; 
                      return (
                        <g key={i}>
                          <rect 
                            x={x} 
                            y={y} 
                            width={width} 
                            height={height} 
                            fill={p.color} 
                            rx={1.5}
                            stroke="#050505"
                            strokeWidth={0.5}
                          />
                          {p.height > 60 && (
                            <text
                              x={x + width / 2}
                              y={80}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className={p.textClass}
                              transform={`rotate(-90 ${x + width / 2} 80)`}
                            >
                              {p.label}
                            </text>
                          )}
                        </g>
                      );
                    });

                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                        <div className="lg:col-span-8 bg-[#030303]/75 p-5 border border-white/5 rounded-sm flex flex-col items-center justify-center relative overflow-hidden h-[180px]">
                          <div className="absolute top-2.5 left-3.5 flex items-center gap-1.5 font-mono text-[8px] text-white/30 tracking-widest uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-gym-accent animate-pulse" />
                            Right Sleeve Visual Vector
                          </div>

                          <svg className="w-full max-w-[440px] h-[130px]" viewBox="0 0 350 160">
                            <rect x="0" y="76" width="350" height="8" fill="#4B5563" rx="1.5" />
                            <line x1="20" y1="76" x2="80" y2="84" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                            <line x1="40" y1="76" x2="100" y2="84" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                            <rect x="102" y="62" width="10" height="36" fill="#D1D5DB" rx="1" stroke="#374151" strokeWidth={0.75} />
                            <rect x="112" y="66" width="5" height="28" fill="#9CA3AF" rx="0.5" />
                            <rect x="117" y="70" width="220" height="20" fill="#E5E7EB" rx="1" stroke="#4B5563" strokeWidth={0.75} />
                            {loadedPlatesRender}
                            {platesNeeded.length > 0 && (
                              <rect x={currentSleeveX} y={67} width="4" height="26" fill="#3B82F6" rx="0.5" stroke="#1D4ED8" strokeWidth={0.5} />
                            )}
                          </svg>

                          <div className="mt-1 flex justify-between w-full max-w-[400px] text-[8.5px] text-white/35 font-mono select-none">
                            <span>Sleeve Center (Collar)</span>
                            <span>Remaining Space: {Math.max(0, 220 - (currentSleeveX - 117)).toFixed(0)}px</span>
                            <span>End Cap</span>
                          </div>
                        </div>

                        <div className="lg:col-span-4 p-4 bg-zinc-940 border border-white/5 rounded-sm h-[180px] flex flex-col justify-between">
                          <div>
                            <span className="text-[8px] tracking-widest font-bold uppercase text-gym-accent font-mono block mb-1">
                              Plate Loading Instruction
                            </span>
                            <h6 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                              Required Per Side:
                            </h6>
                          </div>

                          {platesNeeded.length === 0 ? (
                            <div className="text-center py-6 text-white/20 text-[10px] font-mono leading-relaxed">
                              Bar is empty (20 kg).<br />Add weight load above to slide plates!
                            </div>
                          ) : (
                            <div className="overflow-y-auto max-h-[85px] space-y-1.5 pr-2 custom-scrollbar my-2">
                              {(() => {
                                const counts: Record<number, number> = {};
                                platesNeeded.forEach(p => {
                                  counts[p.w] = (counts[p.w] || 0) + 1;
                                });
                                return Object.entries(counts).sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])).map(([wt, c]) => {
                                  const spec = specPlates.find(sp => sp.w === parseFloat(wt));
                                  return (
                                    <div key={wt} className="flex justify-between items-center text-[10.5px] font-mono border-b border-white/[0.02] pb-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: spec?.color }} />
                                        <span className="text-white font-semibold">{wt} kg plate</span>
                                      </div>
                                      <span className="text-gym-accent font-bold">
                                        &times; {c} {c > 1 ? 'plates' : 'plate'}
                                      </span>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          )}

                          <div className="flex justify-between items-center bg-[#070707] p-2 rounded-sm border border-white/[0.04]">
                            <span className="text-[8px] font-mono text-white/30 uppercase">Sleeve Weight:</span>
                            <span className="text-xs font-bold text-white font-mono shrink-0">
                              {((barbellWeight - 20) / 2).toFixed(2)} kg
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ────────────────── DROP DOWN 5: DYNAMIC CNS FATIGUE INDEX ────────────────── */}
      <div className="border border-white/5 rounded-sm overflow-hidden bg-[#050505]/40 backdrop-blur-md mt-4">
        <button
          onClick={() => toggleSection('cnsFatigue')}
          className="w-full flex items-center justify-between p-5 text-left border-b border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer group"
          id="toggle-cns-fatigue"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-sm bg-gym-accent/10 flex items-center justify-center border border-gym-accent/20 group-hover:border-gym-accent/40 transition-all">
              <Brain className="w-4 h-4 text-gym-accent" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                5 &mdash; Central Nervous System (CNS) Fatigue Index
              </h4>
              <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">
                Dynamic fatigue index & joint-shear risk based on 72h compound spinal loading
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!expanded.cnsFatigue && (
              <span className={`text-[8.5px] font-mono uppercase px-2 py-0.5 border font-semibold ${
                cnsFatigueAnalysis.score > 85 ? 'text-red-400 bg-red-950/20 border-red-500/20 animate-pulse' :
                cnsFatigueAnalysis.score > 55 ? 'text-amber-400 bg-amber-950/20 border-amber-500/20' :
                'text-green-400 bg-green-950/20 border-green-500/20'
              }`}>
                Fatigue: {cnsFatigueAnalysis.score}%
              </span>
            )}
            {expanded.cnsFatigue ? (
              <ChevronUp className="w-4 h-4 text-white/40 group-hover:text-white" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white" />
            )}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {expanded.cnsFatigue && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-6">

                {/* Status Announcement Banner */}
                <div className={`p-4 rounded-sm border ${cnsFatigueAnalysis.levelColor} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300`}>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black tracking-widest uppercase font-mono bg-white/5 px-2 py-0.5 rounded-sm border border-white/5">
                      CNS NEURAL STATUS FEEDBACK
                    </span>
                    <h5 className="text-sm font-black uppercase tracking-wider font-mono">
                      {cnsFatigueAnalysis.label}
                    </h5>
                    <p className="text-xs text-white/60 leading-relaxed font-mono">
                      {cnsFatigueAnalysis.sublabel}
                    </p>
                  </div>
                  <div className="flex flex-col items-end whitespace-nowrap">
                    <span className="text-3xl font-black text-white font-mono">
                      {cnsFatigueAnalysis.score}%
                    </span>
                    <span className="text-[8.5px] uppercase font-mono tracking-widest text-white/45">
                      Fatigue Index
                    </span>
                  </div>
                </div>

                {/* Progress bar representing spinal loading */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] text-white/30 uppercase tracking-widest font-mono">
                    <span>Central Nervous System Wear & Tear Gauge</span>
                    <span className="text-white/60">{cnsFatigueAnalysis.totalSpinalLoad.toFixed(1)} Spinal Load Units</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/5 rounded-sm overflow-hidden p-0.5 border border-white/10">
                    <div 
                      style={{ width: `${cnsFatigueAnalysis.score}%` }}
                      className={`h-full rounded-sm transition-all duration-700 ${cnsFatigueAnalysis.barColor}`}
                    />
                  </div>
                  <div className="flex justify-between text-[7px] text-white/20 font-mono">
                    <span>FRESH ZONE (0% - 25%)</span>
                    <span>HYPERTROPHY ZONE (25% - 55%)</span>
                    <span>TAXED ZONE (55% - 85%)</span>
                    <span>FRY RISK (&gt;85%)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Spinal Section Visualizer */}
                  <div className="md:col-span-5 bg-[#030303]/75 p-5 border border-white/5 rounded-sm flex flex-col items-center justify-center relative overflow-hidden h-[330px]">
                    <div className="absolute top-2.5 left-3.5 flex items-center gap-1.5 font-mono text-[8px] text-white/30 tracking-widest uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-gym-accent animate-pulse" />
                      Dynamic Vertebrae Loading Model
                    </div>

                    <div className="flex items-center gap-5 w-full max-w-[220px]">
                      {/* Spine Illustration SVG */}
                      <svg className="w-[85px] h-[250px]" viewBox="0 0 100 300">
                        {/* Spinal canal guideline */}
                        <line x1="50" y1="10" x2="50" y2="290" stroke="rgba(255,255,255,0.05)" strokeWidth={3} strokeDasharray="3,3" />

                        {/* Cervical Vertebrae section shapes C1-C7 */}
                        <g>
                          <rect x="35" y="15" width="30" height="8" rx="2" 
                            fill={spinalRegions.cervical > 75 ? '#ef4444' : spinalRegions.cervical > 45 ? '#f59e0b' : spinalRegions.cervical > 15 ? '#10b981' : '#334155'} 
                            className="transition-colors duration-500"
                          />
                          <rect x="30" y="27" width="40" height="9" rx="2" 
                            fill={spinalRegions.cervical > 75 ? '#ef4444' : spinalRegions.cervical > 45 ? '#f59e0b' : spinalRegions.cervical > 15 ? '#10b981' : '#334155'} 
                            className="transition-colors duration-500"
                          />
                          <rect x="32" y="40" width="36" height="9" rx="2" 
                            fill={spinalRegions.cervical > 75 ? '#ef4444' : spinalRegions.cervical > 45 ? '#f59e0b' : spinalRegions.cervical > 15 ? '#10b981' : '#334155'} 
                            className="transition-colors duration-500"
                          />
                        </g>

                        {/* Thoracic Vertebrae section shapes T1-T12 */}
                        <g>
                          <rect x="26" y="58" width="48" height="11" rx="2.5" 
                            fill={spinalRegions.thoracic > 75 ? '#ef4444' : spinalRegions.thoracic > 45 ? '#f59e0b' : spinalRegions.thoracic > 15 ? '#10b981' : '#334155'} 
                            className="transition-colors duration-500"
                          />
                          <rect x="24" y="73" width="52" height="11" rx="2.5" 
                            fill={spinalRegions.thoracic > 75 ? '#ef4444' : spinalRegions.thoracic > 45 ? '#f59e0b' : spinalRegions.thoracic > 15 ? '#10b981' : '#334155'} 
                            className="transition-colors duration-500"
                          />
                          <rect x="23" y="88" width="54" height="12" rx="2.5" 
                            fill={spinalRegions.thoracic > 75 ? '#ef4444' : spinalRegions.thoracic > 45 ? '#f59e0b' : spinalRegions.thoracic > 15 ? '#10b981' : '#334155'} 
                            className="transition-colors duration-500"
                          />
                          <rect x="21" y="104" width="58" height="12" rx="2.5" 
                            fill={spinalRegions.thoracic > 75 ? '#ef4444' : spinalRegions.thoracic > 45 ? '#f59e0b' : spinalRegions.thoracic > 15 ? '#10b981' : '#334155'} 
                            className="transition-colors duration-500"
                          />
                          <rect x="20" y="120" width="60" height="13" rx="2.5" 
                            fill={spinalRegions.thoracic > 75 ? '#ef4444' : spinalRegions.thoracic > 45 ? '#f59e0b' : spinalRegions.thoracic > 15 ? '#10b981' : '#334155'} 
                            className="transition-colors duration-500"
                          />
                          <rect x="22" y="137" width="56" height="13" rx="2.5" 
                            fill={spinalRegions.thoracic > 75 ? '#ef4444' : spinalRegions.thoracic > 45 ? '#f59e0b' : spinalRegions.thoracic > 15 ? '#10b981' : '#334155'} 
                            className="transition-colors duration-500"
                          />
                          <rect x="24" y="154" width="52" height="13" rx="2.5" 
                            fill={spinalRegions.thoracic > 75 ? '#ef4444' : spinalRegions.thoracic > 45 ? '#f59e0b' : spinalRegions.thoracic > 15 ? '#10b981' : '#334155'} 
                            className="transition-colors duration-500"
                          />
                        </g>

                        {/* Lumbar Vertebrae section shapes L1-L5 */}
                        <g>
                          <rect x="18" y="177" width="64" height="16" rx="3" 
                            fill={spinalRegions.lumbar > 75 ? '#ef4444' : spinalRegions.lumbar > 45 ? '#f59e0b' : spinalRegions.lumbar > 15 ? '#10b981' : '#334155'} 
                            className="transition-colors duration-500"
                          />
                          <rect x="16" y="197" width="68" height="16" rx="3" 
                            fill={spinalRegions.lumbar > 75 ? '#ef4444' : spinalRegions.lumbar > 45 ? '#f59e0b' : spinalRegions.lumbar > 15 ? '#10b981' : '#334155'} 
                            className="transition-colors duration-500"
                          />
                          <rect x="15" y="217" width="70" height="17" rx="3" 
                            fill={spinalRegions.lumbar > 75 ? '#ef4444' : spinalRegions.lumbar > 45 ? '#f59e0b' : spinalRegions.lumbar > 15 ? '#10b981' : '#334155'} 
                            className="transition-colors duration-500"
                          />
                          <rect x="14" y="238" width="72" height="17" rx="3" 
                            fill={spinalRegions.lumbar > 75 ? '#ef4444' : spinalRegions.lumbar > 45 ? '#f59e0b' : spinalRegions.lumbar > 15 ? '#10b981' : '#334155'} 
                            className="transition-colors duration-500"
                          />
                        </g>

                        {/* Sacrum & Coccyx base anchor */}
                        <polygon points="20,260 80,260 50,295" 
                          fill={spinalRegions.lumbar > 75 ? '#b91c1c' : '#475569'} 
                        />
                      </svg>

                      {/* Region Stats Labels on Right */}
                      <div className="flex-1 space-y-4 font-mono text-[9px]">
                        <div className="border-l-2 border-white/5 pl-2.5">
                          <p className="text-white/40 uppercase tracking-widest">Cervical (C1-C7)</p>
                          <p className="font-extrabold text-white text-xs">{spinalRegions.cervical}% loaded</p>
                          <p className="text-[7.5px] uppercase text-white/30 mt-0.5">Trap overhead loads</p>
                        </div>
                        <div className="border-l-2 border-white/5 pl-2.5">
                          <p className="text-white/40 uppercase tracking-widest">Thoracic (T1-T12)</p>
                          <p className="font-extrabold text-white text-xs">{spinalRegions.thoracic}% loaded</p>
                          <p className="text-[7.5px] uppercase text-white/30 mt-0.5">Upper Back & Bench rows</p>
                        </div>
                        <div className="border-l-2 border-white/5 pl-2.5">
                          <p className="text-white/40 uppercase tracking-widest">Lumbar (L1-L5)</p>
                          <p className="font-extrabold text-amber-500 text-xs">{spinalRegions.lumbar}% loaded</p>
                          <p className="text-[7.5px] uppercase text-white/30 mt-0.5">Heavy deadlift/squat</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Calculations & contributors logs */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="p-4 bg-zinc-945 border border-white/5 rounded-sm space-y-3.5">
                      <span className="text-[8px] font-black tracking-widest text-gym-accent uppercase font-mono block">
                        ANATOMICAL WEAR & TEAR RECOMMENDATIONS
                      </span>
                      <p className="text-xs text-white/80 leading-relaxed font-sans">
                        {cnsFatigueAnalysis.recommendations}
                      </p>
                    </div>

                    <div className="p-4 bg-zinc-950 border border-white/5 rounded-sm space-y-3">
                      <span className="text-[8px] font-black tracking-widest text-white/40 uppercase font-mono block border-b border-white/5 pb-2">
                        COMPONENTS CONTRIBUTING TO SPINAL DEPLETION (PAST 72H)
                      </span>

                      {cnsFatigueAnalysis.contributors.length === 0 ? (
                        <p className="text-[10px] text-white/20 font-mono py-4 text-center">
                          No spinal-loading compounds identified in historical 3-day history. Central nervous efficiency is optimal.
                        </p>
                      ) : (
                        <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                          {cnsFatigueAnalysis.contributors.map((contrib, i) => {
                            let barColor = 'bg-emerald-500';
                            if (contrib.loadingPerSet >= 8) barColor = 'bg-red-500';
                            else if (contrib.loadingPerSet >= 6) barColor = 'bg-amber-500';
                            
                            return (
                              <div key={i} className="flex justify-between items-center text-[10px] border-b border-white/[0.02] pb-1.5 font-mono">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white font-bold">{contrib.exercise}</span>
                                    <span className="text-[8px] uppercase text-white/40">
                                      {contrib.setsCount} {contrib.setsCount > 1 ? 'sets' : 'set'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[7.5px] text-white/30 uppercase">Shear Load Factor:</span>
                                    <span className="text-[7.5px] font-bold text-white/60">{contrib.loadingPerSet} / set</span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="font-bold text-white">+{contrib.totalContribution.toFixed(1)} units</span>
                                  <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                                    <div className={`h-full ${barColor}`} style={{ width: `${(contrib.totalContribution / 40) * 100}%` }} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
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
