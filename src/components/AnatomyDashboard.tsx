import React, { useState, useMemo, useEffect } from 'react';
import { Scroll3DItem } from '../App';
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
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import D3RadarChart from './D3RadarChart';
import { HypertrophicAdaptationPredictor } from './HypertrophicAdaptationPredictor';
import AICoach from './AICoach';
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
  muscleGroupStrengthData: any[];
  activeTheme: any;
}

export default function AnatomyDashboard({
  sessionSets = [],
  archivedWorkouts = [],
  profile,
  saveSettings,
  setToast,
  setActiveView,
  routines = [],
  muscleGroupStrengthData = [],
  activeTheme
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
    if (['back', 'upper_back', 'lower_back', 'lats', 'rhomboids_traps', 'erector_spinae'].includes(rg)) return 'Back';
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
    radar: false, // Default closed
    strength: false,
    biomechanical: false, // Default closed
    cnsFatigue: false
  });

  const toggleSection = (section: string) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const [selectedRadarGroup, setSelectedRadarGroup] = useState<string>('chest');
  const [selectedSubMuscle, setSelectedSubMuscle] = useState<string | null>(null);

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

  // --- 2b. Dynamic Sub-Muscle Breakdown Calculation ---
  const subMuscleBreakdown = useMemo(() => {
    // We will initialize all sub-muscles for each major category with 0 count and empty exercises record.
    const scheme: Record<string, {
      label: string;
      subMuscles: Record<string, {
        label: string;
        count: number;
        exercises: Record<string, number>;
        description: string;
        recommends: string[];
      }>;
    }> = {
      chest: {
        label: 'Chest (Push)',
        subMuscles: {
          upper_chest: {
            label: 'Upper Chest (Clavicular)',
            count: 0,
            exercises: {},
            description: 'Upper fibers originating at the collarbone. Crucial for an upper-chest shelf and overall shoulder-to-chest transitions.',
            recommends: ['Incline Dumbbell Press', 'Barbell Incline Bench Press', 'Decline Push Ups', 'Low-to-High Cable Flyes']
          },
          middle_chest: {
            label: 'Mid Chest (Sternal)',
            count: 0,
            exercises: {},
            description: 'The largest section of the chest. Builds pectoral mass, thickness, and standard horizontal pushing power.',
            recommends: ['Flat Barbell Bench Press', 'Flat Dumbbell Press', 'Machine Chest Press', 'Push-ups']
          },
          lower_chest: {
            label: 'Lower Chest (Costal)',
            count: 0,
            exercises: {},
            description: 'Crucial for outlining the lower pec line and creating a defined pectoralis lower border.',
            recommends: ['Chest Dips', 'Decline Dumbbell Press', 'High-to-Low Cable Flyes']
          },
          general: {
            label: 'General Pectoralis',
            count: 0,
            exercises: {},
            description: 'Recruited across general push patterns, peck flyes, and compound press variants.',
            recommends: ['Dumbbell Flyes', 'Pec Deck Flyes', 'Deficit Push-ups']
          }
        }
      },
      back: {
        label: 'Back (Pull)',
        subMuscles: {
          lats: {
            label: 'Latissimus Dorsi (Lats)',
            count: 0,
            exercises: {},
            description: 'Large wing-like muscles on your sides. Key for vertical pulling movements and creating a V-taper silhouette.',
            recommends: ['Lat Pulldowns', 'Pull-ups', 'Chins', 'Straight Arm Pulldowns']
          },
          upper_back: {
            label: 'Rhomboids & Traps',
            count: 0,
            exercises: {},
            description: 'Muscles between and over the shoulder blades. Vital for scapular retraction, posturing, and overall back thickness.',
            recommends: ['Barbell Rows', 'Face Pulls', 'Seated Cable Rows', 'Dumbbell Shrugs']
          },
          lower_back: {
            label: 'Lower Back & Erectors',
            count: 0,
            exercises: {},
            description: 'Erector spinae muscles supporting the spine. Provides structural posture maintenance and heavy spinal loading support.',
            recommends: ['Deadlifts', 'Back Extensions', 'Good Mornings', 'Rack Pulls']
          },
          general: {
            label: 'General Pull Coordinates',
            count: 0,
            exercises: {},
            description: 'Balanced posterior pull movements that stimulate various areas of back musculature.',
            recommends: ['Single Arm Dumbbell Row', 'T-Bar Rows', 'Machine Rows']
          }
        }
      },
      shoulders: {
        label: 'Shoulders',
        subMuscles: {
          front_delts: {
            label: 'Front Deltoids (Anterior)',
            count: 0,
            exercises: {},
            description: 'Muscles on the front of the shoulders, responsible for raising arms forward. Heavily active in all press forms.',
            recommends: ['Seated Dumbbell Shoulder Press', 'Military Overhead Press', 'Dumbbell Front Raises']
          },
          side_delts: {
            label: 'Side Deltoids (Lateral)',
            count: 0,
            exercises: {},
            description: 'Gives the shoulders a round, capped shape and broadens your frame. Vital for the optical V-taper appearance.',
            recommends: ['Dumbbell Lateral Raises', 'Cable Lateral Raises', 'Upright Rows']
          },
          rear_delts: {
            label: 'Rear Deltoids (Posterior)',
            count: 0,
            exercises: {},
            description: 'Located at the back of the shoulder. Essential for shoulder joint health, alignment stability, and pulling posture.',
            recommends: ['Rear Delt Flyes', 'Face Pulls', 'Reverse Pec Deck']
          },
          general: {
            label: 'General Deltoid Volume',
            count: 0,
            exercises: {},
            description: 'Overarching deltoid activation in heavy multi-joint overhead or dynamic shoulder stability drills.',
            recommends: ['Arnold Press', 'Log Press', 'Kettlebell Halos']
          }
        }
      },
      legs: {
        label: 'Legs / Lower Body',
        subMuscles: {
          quads: {
            label: 'Quadriceps (Front Thigh)',
            count: 0,
            exercises: {},
            description: 'Four large muscles on the front of the thigh, vital for knee extension, jumping, and deep squat power.',
            recommends: ['Barbell Back Squats', 'Leg Press', 'Hack Squats', 'Quads Leg Extensions']
          },
          hamstrings: {
            label: 'Hamstrings (Rear Thigh)',
            count: 0,
            exercises: {},
            description: 'Muscles on the back of the thigh, key for bending knees, sprinting speeds, and hip articulation hinge loops.',
            recommends: ['Romanian Deadlifts', 'Seated Leg Curls', 'Lying Hamstring Curls']
          },
          glutes: {
            label: 'Gluteal Chain (Glutes)',
            count: 0,
            exercises: {},
            description: 'The body\'s primary hip extensor and glute muscles. Responsible for explosive lower-body drive and athletic stability.',
            recommends: ['Hip Thrusts', 'Bulgarian Split Squats', 'Sumo Deadlifts', 'Glute Bridges']
          },
          calves: {
            label: 'Calves (Lower Leg)',
            count: 0,
            exercises: {},
            description: 'Lower leg muscles (soleus and gastrocnemius), key for ankle extension, springiness, and foot stability.',
            recommends: ['Standing Calf Raises', 'Seated Calf Raises', 'Donkey Calf Raises']
          },
          general: {
            label: 'General Leg Coordinate',
            count: 0,
            exercises: {},
            description: 'Assisting musculature active in large multi-joint leg exercises.',
            recommends: ['Walking Lunges', 'Goblet Squats', 'Step-ups']
          }
        }
      },
      arms: {
        label: 'Arms',
        subMuscles: {
          biceps: {
            label: 'Biceps Brachii',
            count: 0,
            exercises: {},
            description: 'The main upper arm pulling muscle. Includes long and short heads, active in elbow bending and forearm supination.',
            recommends: ['Barbell Bicep Curls', 'Incline Dumbbell Curls', 'Hammer Curls']
          },
          brachialis: {
            label: 'Brachialis (Outer Arm Peak)',
            count: 0,
            exercises: {},
            description: 'Deep muscle under the lower biceps. Pushes the biceps outward, significantly broadening the arm width profile.',
            recommends: ['Hammer Curls', 'Cable Rope Curls', 'Reverse Grip Curls']
          },
          triceps: {
            label: 'Triceps Brachii',
            count: 0,
            exercises: {},
            description: 'Accounts for nearly two-thirds of upper arm mass. Composed of lateral, long, and medial heads for elbow extension.',
            recommends: ['Tricep Pushdowns', 'Overhead Tricep Extensions', 'Skull Crushers', 'Close-Grip Bench Press']
          },
          forearms: {
            label: 'Forearms & Grip',
            count: 0,
            exercises: {},
            description: 'Enhances wrist stability, absolute grip hold strength, and aesthetic beefiness of the forearm.',
            recommends: ['Wrist Curls', 'Reverse Wrist Curls', 'Farmers Walks']
          },
          general: {
            label: 'General Arms Volume',
            count: 0,
            exercises: {},
            description: 'Involuntary arm activation across heavy row pulling or chest pushing sessions.',
            recommends: ['Chin-ups', 'Dips', 'Close-Grip Pushups']
          }
        }
      },
      core: {
        label: 'Core',
        subMuscles: {
          upper_core: {
            label: 'Upper Abs',
            count: 0,
            exercises: {},
            description: 'Fibers of the upper rectus abdominis, responsible for pulling the ribcage towards the hips during trunk flexion.',
            recommends: ['Ab Crunches', 'Cable Kneeling Crunches', 'Decline Board Crunches']
          },
          lower_core: {
            label: 'Lower Abs',
            count: 0,
            exercises: {},
            description: 'Lower fibers of the rectus abdominis. Pivotal for pelvis tilt stability and lifting the legs/lower spine.',
            recommends: ['Hanging Leg Raises', 'Reverse Crunches', 'Hanging Knee Raises']
          },
          obliques: {
            label: 'Obliques & Rotation',
            count: 0,
            exercises: {},
            description: 'Inter-twined side wall muscles. Vital for trunk rotation, lateral bending, and functional waist stability.',
            recommends: ['Russian Twists', 'Woodchoppers', 'Side Planks', 'Bicycle Crunches']
          },
          general: {
            label: 'Deep Core & Transverse',
            count: 0,
            exercises: {},
            description: 'The internal corset muscles. Keeps intra-abdominal pressure stable, supporting the spine under heavy axial load.',
            recommends: ['Planks', 'Ab Wheel Rollouts', 'Pallof Press']
          }
        }
      }
    };

    const processSetDetailed = (exName: string) => {
      const rawG = findMuscleGroup(exName);
      if (!rawG) return;
      const rg = rawG.toLowerCase();

      let majorKey: string | null = null;
      let subKey = 'general';

      // Advanced sub-muscle assignment mapping
      if (['chest', 'upper_chest', 'middle_chest', 'lower_chest'].includes(rg)) {
        majorKey = 'chest';
        if (['upper_chest', 'middle_chest', 'lower_chest'].includes(rg)) {
          subKey = rg;
        }
      } else if (['back', 'upper_back', 'lower_back', 'lats', 'rhomboids_traps', 'erector_spinae'].includes(rg)) {
        majorKey = 'back';
        if (rg === 'lats') {
          subKey = 'lats';
        } else if (['upper_back', 'rhomboids_traps'].includes(rg)) {
          subKey = 'upper_back';
        } else if (['lower_back', 'erector_spinae'].includes(rg)) {
          subKey = 'lower_back';
        }
      } else if (['shoulders', 'front_delts', 'side_delts', 'rear_delts'].includes(rg)) {
        majorKey = 'shoulders';
        if (['front_delts', 'side_delts', 'rear_delts'].includes(rg)) {
          subKey = rg;
        }
      } else if (['quads', 'hamstrings', 'glutes', 'calves', 'legs'].includes(rg)) {
        majorKey = 'legs';
        if (['quads', 'hamstrings', 'glutes', 'calves'].includes(rg)) {
          subKey = rg;
        }
      } else if (['biceps', 'triceps', 'forearms', 'arms', 'long_biceps', 'short_biceps', 'brachialis', 'long_triceps', 'lateral_triceps', 'medial_triceps'].includes(rg)) {
        majorKey = 'arms';
        if (['biceps', 'long_biceps', 'short_biceps'].includes(rg)) {
          subKey = 'biceps';
        } else if (rg === 'brachialis') {
          subKey = 'brachialis';
        } else if (['triceps', 'long_triceps', 'lateral_triceps', 'medial_triceps'].includes(rg)) {
          subKey = 'triceps';
        } else if (rg === 'forearms') {
          subKey = 'forearms';
        }
      } else if (['core', 'upper_core', 'lower_core', 'obliques'].includes(rg)) {
        majorKey = 'core';
        if (['upper_core', 'lower_core', 'obliques'].includes(rg)) {
          subKey = rg;
        }
      }

      if (majorKey) {
        const cat = scheme[majorKey];
        if (cat) {
          if (!cat.subMuscles[subKey]) {
            subKey = 'general';
          }
          cat.subMuscles[subKey].count += 1;
          cat.subMuscles[subKey].exercises[exName] = (cat.subMuscles[subKey].exercises[exName] || 0) + 1;
        }
      }
    };

    // Calculate from current active workout sets
    sessionSets.forEach(s => processSetDetailed(s.exerciseName));

    // Calculate from past archived workouts
    archivedWorkouts.forEach(w => {
      if (w?.sets && Array.isArray(w.sets)) {
        w.sets.forEach((s: any) => processSetDetailed(s.exerciseName));
      }
    });

    return scheme;
  }, [sessionSets, archivedWorkouts, findMuscleGroup]);

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
      if (['back', 'upper_back', 'lats', 'rhomboids_traps'].includes(rg)) return 'upper_back';
      if (['lower_back', 'erector_spinae'].includes(rg)) return 'lower_back';
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
      <div className="border border-white/15 rounded-md overflow-hidden bg-black/70 backdrop-blur-md">
        <Scroll3DItem>
        <button
          onClick={() => toggleSection('physiological')}
          className="w-full flex items-center justify-between p-6 text-left border-b border-white/15 hover:bg-white/[0.04] transition-all cursor-pointer group"
          id="toggle-physiological"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-md bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center text-gym-accent group-hover:bg-gym-accent/20 group-hover:border-gym-accent/40 transition-all shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Physiological Analysis
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
        </Scroll3DItem>

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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-md bg-black/40 border border-white/5">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setAnatomyMode('logged')}
                      className={`px-3.5 py-1.5 text-[10px] uppercase tracking-wider font-extrabold cursor-pointer rounded-md border transition-all ${
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
                      className={`px-3.5 py-1.5 text-[10px] uppercase tracking-wider font-extrabold cursor-pointer rounded-md border transition-all ${
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
                          className="bg-black/80 border border-white/15 hover:border-white/25 focus:border-gym-accent text-white text-xs font-bold uppercase tracking-widest rounded-md px-4 py-3 focus:outline-none transition-all cursor-pointer min-w-[200px] max-w-[320px] shadow-md"
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
                  <div className="p-4 bg-gym-accent/[0.02] border border-gym-accent/10 rounded-md space-y-3 animate-fade-in">
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
                  selectedDashboardRoutine={selectedDashboardRoutine}
                />

                {anatomyMode === 'logged' && sessionSets.length === 0 && (
                  <div className="py-5 px-7 bg-white/[0.01] border border-white/5 border-dashed rounded-md text-center flex flex-col sm:flex-row items-center justify-between gap-4">
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
                      className="text-[9px] bg-gym-accent text-black font-black uppercase tracking-widest px-4 py-2 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer rounded-md"
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
      <div className="border border-white/15 rounded-md overflow-hidden bg-black/70 backdrop-blur-md">
        <Scroll3DItem>
        <button
          onClick={() => toggleSection('radar')}
          className="w-full flex items-center justify-between p-6 text-left border-b border-white/15 hover:bg-white/[0.04] transition-all cursor-pointer group"
          id="toggle-radar"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-md bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center text-gym-accent group-hover:bg-gym-accent/20 group-hover:border-gym-accent/40 transition-all shrink-0">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Muscular Radar Analysis
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
        </Scroll3DItem>

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
                
                {/* ROW 1: High-Level Symmetry & Diagnostics */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Radar Web Card */}
                  <div className="lg:col-span-5 p-4 bg-zinc-950/40 border border-white/5 rounded-md flex flex-col items-center justify-center relative w-full h-full min-h-[385px]">
                    <div className="w-full max-w-[340px] flex flex-col items-center justify-center">
                      <RadarChart sessionSets={sessionSets} archivedWorkouts={archivedWorkouts} size={300} plain={true} />
                      <span className="text-[9px] uppercase tracking-[0.2em] font-mono font-bold text-white/30 mt-4 block text-center">
                        Biomechanical Volume Web
                      </span>
                    </div>
                  </div>
                  
                  {/* Symmetry Performance & Actionable Recommendations */}
                  <div className="lg:col-span-7 flex flex-col justify-between p-5 bg-zinc-950/40 border border-white/5 rounded-md min-h-[385px] space-y-4">
                    <div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-3.5">
                        <span className="text-[9px] font-black font-mono text-white/50 uppercase tracking-widest">
                          Symmetry & Balance Diagnostics
                        </span>
                        <span className="text-[8px] bg-gym-accent/10 border border-gym-accent/20 text-gym-accent px-2 py-0.5 rounded-md font-mono uppercase tracking-widest font-black">
                          Realtime Metric
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3.5">
                        <div className="text-4xl font-mono font-black text-gym-accent tracking-tight">
                          {balanceAnalysis.score}%
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white uppercase tracking-wider">
                            Muscular Symmetry Rating
                          </div>
                          <p className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5">
                            Deviation spread against optimal standard
                          </p>
                        </div>
                      </div>

                      {/* Diagnostic Status banner */}
                      <div className="flex gap-2.5 items-start bg-[#050505]/40 border border-white/5 p-3 rounded-md">
                        {balanceAnalysis.type === 'danger' || balanceAnalysis.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-gym-accent shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="text-[10px] font-bold text-white uppercase font-mono block">
                            Recommendation Status: {balanceAnalysis.title}
                          </span>
                          <p className="text-[11px] text-white/60 leading-relaxed mt-0.5">
                            {balanceAnalysis.desc}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Integrated Tips/Action items */}
                    <div className="pt-2 border-t border-white/5">
                      <h6 className="text-[8px] font-bold text-gym-accent uppercase tracking-widest font-mono flex items-center gap-1.5 mb-2.5">
                        <Zap className="w-3.5 h-3.5" />
                        Aesthetic & Symmetry Recommendations
                      </h6>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {balanceAnalysis.tips.map((tip, i) => (
                          <div key={i} className="text-[11px] text-white/70 flex items-start gap-2 leading-relaxed bg-white/[0.01] p-2 border border-white/[0.02] rounded-md">
                            <span className="text-gym-accent font-mono font-bold shrink-0">&bull;</span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* ROW 2: Muscle Group Selection & Sub-Muscle Coordinates (Master-Detail pattern) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left: Volumetric List (Selectable Cards) */}
                  <div className="lg:col-span-5 p-5 bg-zinc-950/40 border border-white/5 rounded-md flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                        <h5 className="text-[9px] font-black text-white/50 uppercase tracking-[0.25em] font-mono">
                          Muscle Groups
                        </h5>
                        <span className="text-[8px] text-white/40 uppercase tracking-widest font-mono">
                          Select group to inspect fibers
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                        {radarData.list.map((item) => {
                          const isActive = item.key === selectedRadarGroup;
                          return (
                            <div 
                              key={item.key} 
                              onClick={() => setSelectedRadarGroup(item.key)}
                              className={`p-3 transition-all rounded-md flex flex-col justify-between cursor-pointer select-none border ${
                                isActive 
                                  ? 'bg-gym-accent/[0.04] border-gym-accent/40 shadow-[0_0_8px_rgba(212,255,0,0.05)]' 
                                  : 'bg-white/[0.01] border-white/[0.03] hover:border-white/10 hover:bg-white/[0.02]'
                              }`}
                            >
                              <div className="flex justify-between items-center font-mono">
                                <span className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-gym-accent' : 'text-white/85'}`}>
                                  {item.label}
                                </span>
                                <span className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-gym-accent'}`}>
                                  {item.count} Sets
                                </span>
                              </div>
                              
                              {/* Inline mini percentage filled bar */}
                              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2.5">
                                <div 
                                  style={{ width: `${item.score}%` }}
                                  className={`h-full rounded-full transition-all duration-500 ${isActive ? 'bg-white' : 'bg-gym-accent opacity-80'}`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right: Sub-Muscle Interactive Coordinates */}
                  <div className="lg:col-span-7 p-5 bg-[#050505]/60 border border-white/5 hover:border-white/8 transition-all rounded-md relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gym-accent/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2.5 mb-3.5 gap-2">
                        <div className="flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-gym-accent animate-pulse shrink-0" />
                          <div>
                            <h6 className="text-[10px] font-black text-white uppercase tracking-wider font-mono">
                              Sub-Muscle Fiber Breakdown
                            </h6>
                            <span className="text-[8px] text-white/40 uppercase tracking-widest font-semibold block mt-1">
                              {subMuscleBreakdown[selectedRadarGroup]?.label || selectedRadarGroup.toUpperCase()} Coordinates
                            </span>
                          </div>
                        </div>
                        <span className="text-[8px] bg-gym-accent/5 border border-gym-accent/20 text-gym-accent px-2 py-0.5 rounded-md font-mono uppercase tracking-widest font-black self-start sm:self-auto">
                          Interactive Fiber Analytics
                        </span>
                      </div>

                      {(() => {
                        const filteredEntries = Object.entries(
                          (subMuscleBreakdown[selectedRadarGroup]?.subMuscles || {}) as Record<string, {
                            label: string;
                            count: number;
                            description: string;
                            exercises: Record<string, number>;
                            recommends: string[];
                          }>
                        ).filter(([key]) => !(key === 'general' && selectedRadarGroup !== 'core'));

                        const totalGroupCount = filteredEntries.reduce((acc, [_, curr]) => acc + curr.count, 0) || 1;

                        const subMuscleDataList = filteredEntries.map(([key, data]) => {
                          const percentage = Math.round((data.count / totalGroupCount) * 100);

                          return {
                            key,
                            name: data.label.replace(/\s*\(.*\)/, ''),
                            fullName: data.label,
                            count: data.count,
                            percentage: percentage,
                            description: data.description,
                            exercises: data.exercises,
                            recommends: data.recommends
                          };
                        });

                        const activeSubKey = (selectedSubMuscle && subMuscleDataList.some(item => item.key === selectedSubMuscle)) 
                          ? selectedSubMuscle 
                          : subMuscleDataList[0]?.key || '';
                        
                        const activeSubData = subMuscleDataList.find(item => item.key === activeSubKey);

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch min-h-[300px]">
                            {/* Left part of the Right Column - Visual distribution BarChart */}
                            <div className="md:col-span-6 flex flex-col justify-between space-y-3">
                              <div className="p-3 bg-white/[0.005] border border-white/[0.02] rounded-md flex-1 flex flex-col justify-between">
                                <span className="text-[8px] text-white/30 uppercase tracking-widest font-mono font-bold block mb-2">
                                  Volumetric Distribution (% of Group)
                                </span>
                                
                                {/* Recharts Bar Chart of sub-muscles */}
                                <div className="w-full h-[180px] font-mono text-[9px]">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                      data={subMuscleDataList}
                                      layout="vertical"
                                      margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
                                      onClick={(state) => {
                                        if (state && state.activeLabel !== undefined) {
                                          const item = subMuscleDataList[state.activeTooltipIndex || 0];
                                          if (item) setSelectedSubMuscle(item.key);
                                        }
                                      }}
                                    >
                                      <XAxis type="number" hide />
                                      <YAxis
                                        dataKey="name"
                                        type="category"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: 'rgba(255, 255, 255, 0.45)', fontSize: 8 }}
                                        width={70}
                                      />
                                      <Tooltip
                                        cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
                                        content={({ active, payload }) => {
                                          if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                              <div className="bg-zinc-950/95 border border-white/10 px-2 py-1.5 rounded-md font-mono text-[9px] shadow-lg">
                                                <span className="text-white font-bold block text-[8px]">{data.fullName}</span>
                                                <span className="text-gym-accent font-black">{data.count} Sets ({data.percentage}%)</span>
                                              </div>
                                            );
                                          }
                                          return null;
                                        }}
                                      />
                                      <Bar dataKey="percentage" radius={[0, 2, 2, 0]} cursor="pointer">
                                        {subMuscleDataList.map((entry, index) => {
                                          const isSelected = entry.key === activeSubKey;
                                          return (
                                            <Cell
                                              key={`cell-${index}`}
                                              fill={isSelected ? '#d4ff00' : 'rgba(212, 255, 0, 0.15)'}
                                              stroke={isSelected ? '#d4ff00' : 'rgba(212, 255, 0, 0.05)'}
                                              strokeWidth={1}
                                              onClick={() => setSelectedSubMuscle(entry.key)}
                                              className="transition-all duration-300"
                                            />
                                          );
                                        })}
                                      </Bar>
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>

                                {/* Mini buttons for selection fallback */}
                                <div className="flex flex-wrap gap-1 mt-2 border-t border-white/[0.03] pt-2">
                                  {subMuscleDataList.map((entry) => {
                                    const isSelected = entry.key === activeSubKey;
                                    return (
                                      <button
                                        key={entry.key}
                                        onClick={() => setSelectedSubMuscle(entry.key)}
                                        className={`px-1.5 py-0.5 rounded-md text-[7px] font-mono uppercase tracking-wider transition-all border ${
                                          isSelected
                                            ? 'bg-gym-accent/10 border-gym-accent/35 text-gym-accent font-black'
                                            : 'bg-white/[0.01] border-white/[0.03] text-white/50 hover:bg-white/[0.03] hover:text-white'
                                        }`}
                                      >
                                        {entry.name}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Right part of the Right Column - Selected Fiber Diagnostics */}
                            <div className="md:col-span-6 flex flex-col justify-between">
                              <AnimatePresence mode="wait">
                                {activeSubData && (
                                  <motion.div
                                    key={activeSubKey}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.12 }}
                                    className="h-full flex flex-col justify-between p-3 bg-white/[0.01] border border-white/[0.03] rounded-md"
                                  >
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-start gap-1 font-mono">
                                        <div className="space-y-0.5">
                                          <h6 className="text-[10px] font-black text-white uppercase tracking-wider">{activeSubData.fullName}</h6>
                                          <span className="text-[7.5px] text-white/30 uppercase tracking-widest block">Selected Fiber Sector</span>
                                        </div>
                                        <div className="text-right shrink-0">
                                          <span className="text-[9px] text-gym-accent font-bold font-mono bg-gym-accent/5 px-1.5 py-0.5 border border-gym-accent/10 rounded-md">
                                            {activeSubData.count} Sets
                                          </span>
                                        </div>
                                      </div>

                                      <p className="text-[10.5px] text-white/60 leading-relaxed font-sans font-normal border-t border-white/[0.03] pt-2">
                                        {activeSubData.description}
                                      </p>
                                    </div>

                                    <div className="space-y-3 pt-3 border-t border-white/[0.03] mt-3">
                                      {/* Logged/Recommended Exercises */}
                                      <div className="space-y-1.5">
                                        <span className="text-[7.5px] font-bold font-mono text-white/45 uppercase tracking-wider block">
                                          {activeSubData.count > 0 ? "Targeted Workouts" : "Recommended Corrective Targets"}
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                          {activeSubData.count > 0 ? (
                                            Object.entries(activeSubData.exercises).map(([exName, count]) => (
                                              <span key={exName} className="text-[8px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-md text-white/80 font-mono">
                                                {exName} ({count})
                                              </span>
                                            ))
                                          ) : (
                                            activeSubData.recommends.map((rec) => (
                                              <span key={rec} className="text-[8px] bg-gym-accent/[0.01] border border-gym-accent/5 px-1.5 py-0.5 rounded-md text-gym-accent/70 font-mono">
                                                {rec}
                                              </span>
                                            ))
                                          )}
                                        </div>
                                      </div>

                                      {/* Status gauge bottom */}
                                      <div className="bg-zinc-950/40 border border-white/[0.02] p-1.5 rounded-md flex items-center justify-between text-[7.5px] font-mono uppercase tracking-wider">
                                        <span className="text-white/30">RECIPROCAL RECRUITMENT:</span>
                                        <span className={activeSubData.count > 0 ? "text-gym-accent font-bold" : "text-amber-400 font-bold"}>
                                          {activeSubData.count > 0 ? `${activeSubData.percentage}% of Group` : 'Atrophy Danger'}
                                        </span>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ────────────────── DROP DOWN 3: BIOMECHANICAL STRUCTURAL LOAD ALERTER ────────────────── */}
      <div className="border border-white/15 rounded-md overflow-hidden bg-black/70 backdrop-blur-md">
        <Scroll3DItem>
        <button
          onClick={() => toggleSection('biomechanical')}
          className="w-full flex items-center justify-between p-6 text-left border-b border-white/15 hover:bg-white/[0.04] transition-all cursor-pointer group"
          id="toggle-biomechanical"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-md bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center text-gym-accent group-hover:bg-gym-accent/20 group-hover:border-gym-accent/40 transition-all shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Muscle Balance & Joint Safety
              </h4>
              <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">
                Rolling 30-Day Push/Pull Ratios & Postural Joint Safety
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
                  : "● WORKLOAD: BALANCED"}
              </span>
            )}
            {expanded.biomechanical ? (
              <ChevronUp className="w-4 h-4 text-white/40 group-hover:text-white" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white" />
            )}
          </div>
        </button>
        </Scroll3DItem>

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
                <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-md space-y-2">
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
                  <div className="p-5 bg-white/[0.01] border border-white/5 rounded-md space-y-4">
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
                          <span className="text-[8px] bg-zinc-800 border border-zinc-700 font-mono px-2 py-0.5 rounded-md uppercase tracking-wider text-zinc-400">
                            Awaiting Data
                          </span>
                        ) : biomechanicalAnalysis.chestBack.status === 'critical' ? (
                          <span className="text-[8px] bg-red-950/50 border border-red-500/30 font-mono px-2 py-0.5 rounded-md uppercase tracking-wider text-red-500/40 font-bold animate-pulse text-red-400">
                            POSTURAL WARNING
                          </span>
                        ) : biomechanicalAnalysis.chestBack.status === 'moderate' ? (
                          <span className="text-[8px] bg-amber-950/50 border border-amber-500/30 font-mono px-2 py-0.5 rounded-md uppercase tracking-wider text-amber-500/50 font-bold text-amber-400">
                            MILD IMBALANCE
                          </span>
                        ) : (
                          <span className="text-[8px] bg-gym-accent/15 border border-gym-accent/30 font-mono px-2 py-0.5 rounded-md uppercase tracking-wider text-gym-accent font-bold">
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
                      <div className="p-3 bg-red-950/20 border border-red-500/15 rounded-md flex items-start gap-3 mt-1 animate-fade-in">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-bounce" />
                        <div>
                          <strong className="text-xs text-red-400 uppercase tracking-wide block">{biomechanicalAnalysis.chestBack.warning}</strong>
                          <p className="text-[11px] text-white/70 leading-relaxed mt-1">{biomechanicalAnalysis.chestBack.tip}</p>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* SLIDER 2: QUADS VS HAMSTRINGS */}
                  <div className="p-5 bg-white/[0.01] border border-white/5 rounded-md space-y-4">
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
                          <span className="text-[8px] bg-zinc-800 border border-zinc-700 font-mono px-2 py-0.5 rounded-md uppercase tracking-wider text-zinc-400">
                            Awaiting Data
                          </span>
                        ) : biomechanicalAnalysis.quadHam.status === 'critical' ? (
                          <span className="text-[8px] bg-red-950/50 border border-red-500/30 font-mono px-2 py-0.5 rounded-md uppercase tracking-wider text-red-500/40 font-bold animate-pulse text-red-400">
                            POSTURAL WARNING
                          </span>
                        ) : biomechanicalAnalysis.quadHam.status === 'moderate' ? (
                          <span className="text-[8px] bg-amber-950/50 border border-amber-500/30 font-mono px-2 py-0.5 rounded-md uppercase tracking-wider text-amber-500/50 font-bold text-amber-400">
                            MILD IMBALANCE
                          </span>
                        ) : (
                          <span className="text-[8px] bg-gym-accent/15 border border-gym-accent/30 font-mono px-2 py-0.5 rounded-md uppercase tracking-wider text-gym-accent font-bold">
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
                      <div className="p-3 bg-red-950/20 border border-red-500/15 rounded-md flex items-start gap-3 mt-1 animate-fade-in">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-bounce" />
                        <div>
                          <strong className="text-xs text-red-400 uppercase tracking-wide block">{biomechanicalAnalysis.quadHam.warning}</strong>
                          <p className="text-[11px] text-white/70 leading-relaxed mt-1">{biomechanicalAnalysis.quadHam.tip}</p>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* SLIDER 3: BICEPS VS TRICEPS */}
                  <div className="p-5 bg-white/[0.01] border border-white/5 rounded-md space-y-4">
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
                          <span className="text-[8px] bg-zinc-800 border border-zinc-700 font-mono px-2 py-0.5 rounded-md uppercase tracking-wider text-zinc-400">
                            Awaiting Data
                          </span>
                        ) : biomechanicalAnalysis.bicepsTriceps.status === 'critical' ? (
                          <span className="text-[8px] bg-red-950/50 border border-red-500/30 font-mono px-2 py-0.5 rounded-md uppercase tracking-wider text-red-500/40 font-bold animate-pulse text-red-400">
                            POSTURAL WARNING
                          </span>
                        ) : biomechanicalAnalysis.bicepsTriceps.status === 'moderate' ? (
                          <span className="text-[8px] bg-amber-950/50 border border-amber-500/30 font-mono px-2 py-0.5 rounded-md uppercase tracking-wider text-amber-500/50 font-bold text-amber-400">
                            MILD IMBALANCE
                          </span>
                        ) : (
                          <span className="text-[8px] bg-gym-accent/15 border border-gym-accent/30 font-mono px-2 py-0.5 rounded-md uppercase tracking-wider text-gym-accent font-bold">
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
                      <div className="p-3 bg-red-950/20 border border-red-500/15 rounded-md flex items-start gap-3 mt-1 animate-fade-in">
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
                  <div className="p-4 bg-gym-accent/[0.03] border border-gym-accent/15 rounded-md flex items-center gap-3">
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

      {/* ────────────────── DROP DOWN 4: RELATIVE STRENGTH RADAR ────────────────── */}
      <div className="border border-white/15 rounded-md overflow-hidden bg-black/70 backdrop-blur-md">
        <Scroll3DItem>
        <button
          onClick={() => toggleSection('strength')}
          className="w-full flex items-center justify-between p-6 text-left border-b border-white/15 hover:bg-white/[0.04] transition-all cursor-pointer group"
          id="toggle-strength"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-md bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center text-gym-accent group-hover:bg-gym-accent/20 group-hover:border-gym-accent/40 transition-all shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Relative Strength Radar
              </h4>
              <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">
                D3 concentric muscle group development comparison against baseline 1RMs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {expanded.strength ? (
              <ChevronUp className="w-4 h-4 text-white/40 group-hover:text-white" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white" />
            )}
          </div>
        </button>
        </Scroll3DItem>

        <AnimatePresence initial={false}>
          {expanded.strength && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-6">
                <D3RadarChart
                  data={muscleGroupStrengthData}
                  activeTheme={activeTheme}
                  profile={profile}
                  sessionSets={sessionSets}
                  archivedWorkouts={archivedWorkouts}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ────────────────── DROP DOWN 5: DYNAMIC CNS FATIGUE INDEX ────────────────── */}
      <div className="border border-white/15 rounded-md overflow-hidden bg-black/70 backdrop-blur-md mt-4">
        <Scroll3DItem>
        <button
          onClick={() => toggleSection('cnsFatigue')}
          className="w-full flex items-center justify-between p-6 text-left border-b border-white/15 hover:bg-white/[0.04] transition-all cursor-pointer group"
          id="toggle-cns-fatigue"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-md bg-gym-accent/10 border border-gym-accent/25 flex items-center justify-center text-gym-accent group-hover:bg-gym-accent/20 group-hover:border-gym-accent/40 transition-all shrink-0">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Central Nervous System (CNS) Fatigue Index
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
        </Scroll3DItem>

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
                <div className={`p-4 rounded-md border ${cnsFatigueAnalysis.levelColor} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300`}>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black tracking-widest uppercase font-mono bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
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
                  <div className="w-full h-2.5 bg-white/5 rounded-md overflow-hidden p-0.5 border border-white/10">
                    <div 
                      style={{ width: `${cnsFatigueAnalysis.score}%` }}
                      className={`h-full rounded-md transition-all duration-700 ${cnsFatigueAnalysis.barColor}`}
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
                  <div className="md:col-span-5 bg-[#030303]/75 p-5 border border-white/5 rounded-md flex flex-col items-center justify-center relative overflow-hidden h-[330px]">
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
                    <div className="p-4 bg-zinc-945 border border-white/5 rounded-md space-y-3.5">
                      <span className="text-[8px] font-black tracking-widest text-gym-accent uppercase font-mono block">
                        ANATOMICAL WEAR & TEAR RECOMMENDATIONS
                      </span>
                      <p className="text-xs text-white/80 leading-relaxed font-sans">
                        {cnsFatigueAnalysis.recommendations}
                      </p>
                    </div>

                    <div className="p-4 bg-zinc-950 border border-white/5 rounded-md space-y-3">
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

                {/* 📊 Hypertrophic Adaptation & Stimulus Desensitization Predictor Section */}
                <HypertrophicAdaptationPredictor
                  sessionSets={sessionSets}
                  archivedWorkouts={archivedWorkouts}
                />

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tactical Analyst AI Coach */}
      <div className="mt-8">
        <AICoach
          sets={sessionSets}
          archivedWorkouts={archivedWorkouts}
          userId={profile?.id || "anonymous"}
        />
      </div>

    </div>
  );
}
