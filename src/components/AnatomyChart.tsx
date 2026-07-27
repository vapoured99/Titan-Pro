import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { POOLS, getSecondaryMusclesForExercise } from '../data/exercises';
import { 
  Crosshair, 
  Target, 
  Dumbbell, 
  Timer, 
  Zap, 
  Sparkles, 
  AlertCircle, 
  BookOpen, 
  ExternalLink, 
  X, 
  ChevronDown, 
  ChevronUp,
  Flame,
  Check
} from 'lucide-react';

interface BiomechanicsInfo {
  title: string;
  focus: string;
  reps: string;
  rest: string;
  tip: string;
  setup: string;
  mechanics: 'Compound-focused' | 'Isolation-focused' | 'Mixed vectors';
}

const BIOMECHANICS: Record<string, BiomechanicsInfo> = {
  chest: {
    title: "Pectoralis Major & Minor",
    focus: "Horizontal Adduction & Vertical Pressing Planes",
    reps: "6-12 Reps (Strength & Hypertrophy)",
    rest: "120-180 Secs (CNS Recovery)",
    mechanics: "Compound-focused",
    tip: "Keep scapulae retracted (pin shoulders down and back) to shield front deltoids and load chest fibers.",
    setup: "Elbow path flare should stay between 45° and 60° relative to torso. Squeeze forcefully at lockout."
  },
  upper_back: {
    title: "Latissimus Dorsi & Rhomboids (Upper Back)",
    focus: "Vertical Pulls & Horizontal Shoulder Extension",
    reps: "8-12 Reps (Time Under Tension)",
    rest: "90-120 Secs (Metabolic Balance)",
    mechanics: "Compound-focused",
    tip: "Drive directly down with your elbows instead of pulling with hands. Retract your rhomboids and traps to squeeze the shoulder blades together.",
    setup: "Initiate lat engagements with a shoulder blade pull-down (depression) before arm lines begin flex."
  },
  lower_back: {
    title: "Erector Spinae & Lumbar (Lower Back)",
    focus: "Hip Hinge, Extension & Spinal Stabilization",
    reps: "6-12 Reps (Posterior Chain Strength)",
    rest: "120-150 Secs (CNS Heavy Recovery)",
    mechanics: "Compound-focused",
    tip: "Keep the lower back locked in flat neutral. Focus on articulating from the hips rather than rounding the spine.",
    setup: "Keep the weight close to your center of gravity. Plant your heels firmly and engage your legs and glutes to pull safely."
  },
  shoulders: {
    title: "Deltoids (Anterior, Lateral, Posterior)",
    focus: "Scapular Plane Abduction & Overhead Pressing",
    reps: "10-15 Reps (Sarcoplasmic Hypertrophy)",
    rest: "60-90 Secs (Pumping Volume)",
    mechanics: "Mixed vectors",
    tip: "Perform lateral raises ~30° slightly forward in the scapular plane to eliminate rotor cuff grinding.",
    setup: "Ensure shoulders do not shrug up toward ears during dumbbell or lateral cable expansions."
  },
  quads: {
    title: "Quadriceps Femoris (Leg Front)",
    focus: "Knee Joint Flexion & Deep Extension Pressing",
    reps: "8-15 Reps (High Mechanical Stretch)",
    rest: "120-180 Secs (Deep Tissue Prep)",
    mechanics: "Compound-focused",
    tip: "Prioritize maximum knee bend to stretch knee extensors, pushing forcefully out of the bottom.",
    setup: "Set feet shoulder-width, tracking outer toes. Ensure heels remain fully planted on the platform."
  },
  hamstrings: {
    title: "Biceps Femoris & Semitendinosus",
    focus: "Hip Hinge Extension & Knee Joint Flexion",
    reps: "6-12 Reps (Fast-Twitch Target)",
    rest: "90-120 Secs (Fiber Restoration)",
    mechanics: "Mixed vectors",
    tip: "Keep knees slightly unlocked on hinges (RDLs) while pushing hips as far back as physically possible.",
    setup: "Lock the lower back spinal column in flat neutral. Focus pure tension on stretching back thigh chains."
  },
  glutes: {
    title: "Gluteus Maximus & Medius",
    focus: "Hip Extension & Multi-Angle Abduction",
    reps: "8-12 Reps (Peak Squeeze Load)",
    rest: "90-120 Secs (Contractile Refresh)",
    mechanics: "Compound-focused",
    tip: "Achieve posterior pelvic tilt (active tuck and squeeze) at peak of hip thrusts to fully shorten tissues.",
    setup: "Align your shins completely vertically at peak extensions. Press straight downward through heels."
  },
  calves: {
    title: "Gastrocnemius & Soleus",
    focus: "Plantar Flexion & Ankle Base Stabilization",
    reps: "12-20 Reps (High-Tension Endurance)",
    rest: "45-60 Secs (Fast-Frequency)",
    mechanics: "Isolation-focused",
    tip: "Pause for 2 full seconds in deep stretch at the bottom of reps to bypass elastic achilles reflex.",
    setup: "Focus driving through the ball of the foot (first/second toes) to maintain correct joint vectors."
  },
  biceps: {
    title: "Biceps Brachii & Brachialis",
    focus: "Elbow Flexion & Forearm Supination",
    reps: "10-15 Reps (Squeeze & Peak)",
    rest: "60-90 Secs (Intense Pump)",
    mechanics: "Isolation-focused",
    tip: "Pin elbows to ribs. Rotate wrists outward (index finger high) during contraction to prompt maximal peak.",
    setup: "Keep trunk static; do not let elbows swing forward significantly to ensure mechanical insulation."
  },
  triceps: {
    title: "Triceps Brachii (Long, Lateral, Medial)",
    focus: "Elbow Extension & Arm Extension Press",
    reps: "10-15 Reps (Mechanical Stretch)",
    rest: "60-90 Secs (Triceps Isolate)",
    mechanics: "Isolation-focused",
    tip: "Combine overhead exercises to load the long head of the triceps while in its fully elongated shape.",
    setup: "Lock shoulders down. Drive hands downward, fully straightening elbows without wrist torque."
  },
  core: {
    title: "Rectus Abdominis & Obliques / Core",
    focus: "Spinal Flexion, Anti-Extension & Rotation",
    reps: "12-25 Reps (Endurance Conditioning)",
    rest: "30-45 Secs (High-Frequency)",
    mechanics: "Isolation-focused",
    tip: "Bring ribs down to hips. Round the spine actively on crunches rather than tilting hips forward.",
    setup: "Pull navel to spine. Do not pull on the back of the neck on crunch elements; brace abdominal lines."
  },
  forearms: {
    title: "Brachioradialis & Wrist Flexors/Extensors",
    focus: "Grip Flexion endurance & Wrist Articulation",
    reps: "12-20 Reps",
    rest: "45-60 Secs (Tendon-Safe)",
    mechanics: "Isolation-focused",
    tip: "Employ dynamic neutral grasp patterns (hammer curls) alongside deep static dumbbell farmer carries.",
    setup: "Isolate motion strictly to wrist pivots on roll actions to guard dynamic wrist sheaths from load."
  }
};

interface SessionSet {
  id?: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  timestamp?: any;
  notes?: string;
}

interface AnatomyChartProps {
  sets: SessionSet[];
  archivedWorkouts?: any[];
  compact?: boolean;
  viewMode?: 'logged' | 'routine';
  routineMuscleGroups?: { group: string; percentage: number; count: number }[];
  selectedDashboardRoutine?: any;
  focusedExerciseGuidance?: any;
}

const AnatomyChart: React.FC<AnatomyChartProps> = ({ 
  sets = [], 
  archivedWorkouts = [], 
  compact = false,
  viewMode = 'logged',
  routineMuscleGroups = [],
  selectedDashboardRoutine = null,
  focusedExerciseGuidance = null
}) => {
  const [today, setToday] = React.useState(() => new Date().toISOString().split('T')[0]);

  React.useEffect(() => {
    // Real-time checking to update colors automatically as the day rolls over
    const interval = setInterval(() => {
      const currentToday = new Date().toISOString().split('T')[0];
      if (currentToday !== today) {
        setToday(currentToday);
      }
    }, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, [today]);

  // Secondary Muscle Mapping Helper
  const mapSecondaryToAnatomyKey = (muscle: any): string | null => {
    if (typeof muscle !== 'string') return null;
    const m = muscle.toLowerCase().trim();
    if (m.includes('chest')) return 'chest';
    if (m.includes('upper back') || m.includes('back') || m.includes('lats') || m.includes('rhomboids_traps') || m.includes('traps') || m.includes('rear delts')) return 'upper_back';
    if (m.includes('lower back') || m.includes('erector_spinae')) return 'lower_back';
    if (m.includes('shoulder') || m.includes('delts') || m.includes('deltoid')) return 'shoulders';
    if (m.includes('quad')) return 'quads';
    if (m.includes('hamstring')) return 'hamstrings';
    if (m.includes('glute')) return 'glutes';
    if (m.includes('calf') || m.includes('calves')) return 'calves';
    if (m.includes('bicep')) return 'biceps';
    if (m.includes('tricep')) return 'triceps';
    if (m.includes('core') || m.includes('ab') || m.includes('abs') || m.includes('oblique')) return 'core';
    if (m.includes('forearm')) return 'forearms';
    return null;
  };

  const findExerciseObjByName = (exerciseName: string) => {
    if (!exerciseName) return null;
    const cleanName = exerciseName.trim().toLowerCase();
    try {
      const saved = localStorage.getItem('gym_custom_exercises');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const found = parsed.find(e => e.name?.trim().toLowerCase() === cleanName);
          if (found) {
            return {
              name: found.name,
              pool: found.pool || found.muscleGroup,
              muscleGroup: found.muscleGroup || found.pool,
              secondaryMuscles: found.secondaryMuscles || [],
              icon: found.icon || "Activity",
              category: found.category || "isolation"
            } as any;
          }
        }
      }
    } catch (e) {}

    for (const [poolKey, exercises] of Object.entries(POOLS)) {
      const ex = exercises.find(e => e.name.trim().toLowerCase() === cleanName);
      if (ex) {
        return ex;
      }
    }
    return null;
  };

  // Helper to parse exercises to muscle groups
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
            if (['lats', 'rhomboids_traps', 'upper_back', 'back'].includes(rawGroup)) {
              return 'upper_back';
            }
            if (['erector_spinae', 'lower_back'].includes(rawGroup)) {
              return 'lower_back';
            }
            return rawGroup;
          }
        }
      }
    } catch (e) {
      console.error("Error reading custom exercises in AnatomyChart:", e);
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
        if (['lats', 'rhomboids_traps', 'upper_back', 'back'].includes(rawGroup)) {
          return 'upper_back';
        }
        if (['erector_spinae', 'lower_back'].includes(rawGroup)) {
          return 'lower_back';
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

  // Calculate the 5-day recovery status/routine focus for each muscle group
  const getMuscleStatuses = () => {
    const groupsToShow = ['chest', 'upper_back', 'lower_back', 'shoulders', 'quads', 'hamstrings', 'glutes', 'calves', 'biceps', 'triceps', 'core', 'forearms'];
    const statuses: Record<string, { daysDiff: number; dates: string[]; text: string; fill: string; filterUrl: string; percentage?: number }> = {};

    groupsToShow.forEach(group => {
      statuses[group] = {
        daysDiff: 999, // infinite (untouched)
        dates: [],
        text: 'Fully Rested',
        fill: 'rgba(255, 255, 255, 0.25)',
        filterUrl: 'none'
      };
    });

    if (focusedExerciseGuidance) {
      const resolved = findExerciseObjByName(focusedExerciseGuidance.name) || focusedExerciseGuidance;
      const primaryGroup = findMuscleGroupForExercise(resolved.name);
      
      if (primaryGroup && statuses[primaryGroup]) {
        statuses[primaryGroup] = {
          daysDiff: 0,
          dates: [today],
          text: 'Primary Muscle Group Target',
          fill: '#f97316', // Orange Glow
          filterUrl: 'url(#glow-orange)',
          isPrimaryGuidance: true
        } as any;
      }

      const secondaries = getSecondaryMusclesForExercise(resolved);
      secondaries.forEach((secName: string) => {
        const mapped = mapSecondaryToAnatomyKey(secName);
        if (mapped && statuses[mapped] && mapped !== primaryGroup) {
          statuses[mapped] = {
            daysDiff: 0,
            dates: [today],
            text: 'Synergistic Muscle Group Target',
            fill: '#3b82f6', // Glowing blue
            filterUrl: 'url(#glow-blue-strong)',
            isSecondaryGuidance: true
          } as any;
        }
      });

      return statuses;
    }

    if (viewMode === 'routine' && routineMuscleGroups && routineMuscleGroups.length > 0) {
      const matchGroup = (anatomyGroup: string, routineGroup: string) => {
        const ag = anatomyGroup.toLowerCase();
        const rg = routineGroup.toLowerCase();
        if (rg === 'chest' && ag === 'chest') return true;
        if (rg === 'triceps' && ag === 'triceps') return true;
        if (rg === 'biceps' && ag === 'biceps') return true;
        if (rg === 'shoulders' && ag === 'shoulders') return true;
        if (rg === 'back' && (ag === 'upper_back' || ag === 'lower_back')) return true;
        if (rg === 'legs' && (ag === 'quads' || ag === 'hamstrings' || ag === 'glutes' || ag === 'calves')) return true;
        if (rg === 'core' && ag === 'core') return true;
        if (rg === 'forearms' && ag === 'forearms') return true;
        return false;
      };

      groupsToShow.forEach(group => {
        const matched = routineMuscleGroups.find(r => matchGroup(group, r.group));
        if (matched && matched.percentage > 0) {
          const state = statuses[group];
          state.percentage = matched.percentage;
          
          if (matched.percentage >= 35) {
            state.daysDiff = 0; // map to strong pulse
            state.text = `Primary Focus: ${matched.percentage}% Intensity`;
            state.fill = '#fbbf24'; // Neon Amber / Yellow-400
            state.filterUrl = 'url(#glow-amber)';
          } else if (matched.percentage >= 15) {
            state.daysDiff = 1; // map to medium pulse
            state.text = `Secondary Focus: ${matched.percentage}% Intensity`;
            state.fill = '#f59e0b'; // Medium Amber / Yellow-500
            state.filterUrl = 'url(#glow-amber)';
          } else {
            state.daysDiff = 3; // map to minor pulse
            state.text = `Supporting Focus: ${matched.percentage}% Intensity`;
            state.fill = '#b45309'; // Dark Copper Amber / Yellow-700
            state.filterUrl = 'none';
          }
        }
      });

      return statuses;
    }

    // 1. Process active session sets (Today / Day 0)
    if (sets && sets.length > 0) {
      sets.forEach(set => {
        const group = findMuscleGroupForExercise(set.exerciseName);
        if (group && statuses[group]) {
          statuses[group].daysDiff = 0;
          if (!statuses[group].dates.includes(today)) {
            statuses[group].dates.push(today);
          }
        }
      });
    }

    // 2. Process archived workouts within the last 5 days
    if (archivedWorkouts && archivedWorkouts.length > 0) {
      archivedWorkouts.forEach(workout => {
        const wDate = workout.date;
        if (!wDate) return;

        const diff = getDaysDiff(today, wDate);
        // Only interested in workouts within the 5-day window
        if (diff >= 0 && diff <= 4) {
          const wSets = workout.sets || [];
          wSets.forEach((set: any) => {
            const group = findMuscleGroupForExercise(set.exerciseName);
            if (group && statuses[group]) {
              // We want the most recent workout to determine status
              if (diff < statuses[group].daysDiff) {
                statuses[group].daysDiff = diff;
              }
              if (!statuses[group].dates.includes(wDate)) {
                statuses[group].dates.push(wDate);
              }
            }
          });
        }
      });
    }

    // Assign text, fill, and SVG filter based on computed daysDiff
    groupsToShow.forEach(group => {
      const state = statuses[group];
      if (state.daysDiff === 0) {
        state.text = 'Active Today';
        state.fill = '#ef4444'; // Bright Red
        state.filterUrl = 'url(#glow-red)';
      } else if (state.daysDiff === 1) {
        state.text = 'Fatigue (Day 1)';
        state.fill = '#f97316'; // Orange
        state.filterUrl = 'url(#glow-orange)';
      } else if (state.daysDiff === 2) {
        state.text = 'Fatigue (Day 2)';
        state.fill = '#f97316'; // Orange
        state.filterUrl = 'url(#glow-orange)';
      } else if (state.daysDiff === 3) {
        state.text = 'Ready / Soreness Clear (Day 3)';
        state.fill = '#22c55e'; // Green
        state.filterUrl = 'url(#glow-green)';
      } else {
        state.text = 'Fully Rested';
        state.fill = 'rgba(255, 255, 255, 0.25)'; // Dark/Translucent
        state.filterUrl = 'none';
      }
    });

    return statuses;
  };

  const [selectedMuscle, setSelectedMuscle] = React.useState<string | null>(null);
  const [expandedExercise, setExpandedExercise] = React.useState<string | null>(null);

  const statuses = getMuscleStatuses();

  const getSecondaryMuscleStatuses = () => {
    const groupsToShow = ['chest', 'upper_back', 'lower_back', 'shoulders', 'quads', 'hamstrings', 'glutes', 'calves', 'biceps', 'triceps', 'core', 'forearms'];
    const statuses: Record<string, { daysDiff: number; text: string; fill: string; filterUrl: string }> = {};

    groupsToShow.forEach(group => {
      statuses[group] = {
        daysDiff: 999,
        text: 'No Secondary Tension',
        fill: 'rgba(255, 255, 255, 0.12)',
        filterUrl: 'none'
      };
    });

    const markSecondaryGroup = (group: string, daysDiff: number) => {
      if (daysDiff < statuses[group].daysDiff) {
        statuses[group].daysDiff = daysDiff;
      }
    };

    const processExerciseSecs = (exName: string, daysDiff: number) => {
      const exObj = findExerciseObjByName(exName);
      if (!exObj) return;
      const secondaries = getSecondaryMusclesForExercise(exObj);
      secondaries.forEach(secName => {
        const mapped = mapSecondaryToAnatomyKey(secName);
        if (mapped) {
          markSecondaryGroup(mapped, daysDiff);
        }
      });
    };

    if (viewMode === 'routine' && selectedDashboardRoutine) {
      if (selectedDashboardRoutine.sets && selectedDashboardRoutine.sets.length > 0) {
        selectedDashboardRoutine.sets.forEach((s: any) => {
          processExerciseSecs(s.exerciseName, 0);
        });
      }
    } else {
      if (sets && sets.length > 0) {
        sets.forEach(set => {
          processExerciseSecs(set.exerciseName, 0);
        });
      }

      if (archivedWorkouts && archivedWorkouts.length > 0) {
        archivedWorkouts.forEach(workout => {
          const wDate = workout.date;
          if (!wDate) return;
          const diff = getDaysDiff(today, wDate);
          if (diff >= 0 && diff <= 4) {
            const wSets = workout.sets || [];
            wSets.forEach((set: any) => {
              processExerciseSecs(set.exerciseName, diff);
            });
          }
        });
      }
    }

    groupsToShow.forEach(group => {
      const state = statuses[group];
      if (state.daysDiff === 0) {
        state.text = 'Active Secondary Today';
        state.fill = '#3b82f6'; // Bright Electric Blue
        state.filterUrl = 'url(#glow-blue-strong)';
      } else if (state.daysDiff === 1 || state.daysDiff === 2) {
        state.text = 'Secondary Tension (D1-D2)';
        state.fill = '#60a5fa'; // Mid Blue
        state.filterUrl = 'url(#glow-blue-medium)';
      } else if (state.daysDiff === 3) {
        state.text = 'Ready / Restored (D3)';
        state.fill = '#93c5fd'; // Soft Light Blue
        state.filterUrl = 'none';
      } else {
        state.text = 'Untouched / Rested';
        state.fill = 'rgba(255, 255, 255, 0.12)';
        state.filterUrl = 'none';
      }
    });

    return statuses;
  };

  const secondaryStatuses = getSecondaryMuscleStatuses();

  const getSecondaryPulseClass = (group: string) => {
    const state = secondaryStatuses[group];
    if (!state) return '';
    if (state.daysDiff === 0) {
      return 'pulse-strong-blue';
    } else if (state.daysDiff === 1 || state.daysDiff === 2) {
      return 'pulse-medium-blue';
    } else if (state.daysDiff === 3) {
      return 'pulse-minor-blue';
    }
    return '';
  };

  const getSecondaryMuscleProps = (group: string) => {
    const isSelected = selectedMuscle === group;
    const secStatus = secondaryStatuses[group];
    return {
      fill: isSelected ? '#ffd700' : (secStatus?.fill || 'rgba(255, 255, 255, 0.12)'),
      fillOpacity: isSelected ? 0.65 : 1,
      filter: isSelected ? 'url(#glow-active)' : (secStatus?.filterUrl || 'none'),
      stroke: isSelected ? '#ffd700' : 'rgba(255, 255, 255, 0.3)',
      strokeWidth: isSelected ? '2' : '1.25',
      strokeDasharray: isSelected ? '3, 1' : 'none',
      onClick: () => {
        if (compact) return;
        setSelectedMuscle(selectedMuscle === group ? null : group);
        setExpandedExercise(null);
      },
      className: `hover-target-muscle transition-all duration-300 ${isSelected ? 'brightness-125' : ''} ${getSecondaryPulseClass(group)}`
    };
  };

  const getFill = (group: string) => {
    return statuses[group]?.fill || 'rgba(255, 255, 255, 0.25)';
  };

  const getFilter = (group: string) => {
    return statuses[group]?.filterUrl || 'none';
  };

  const getPulseClass = (group: string) => {
    const state = statuses[group];
    if (!state) return '';
    if (focusedExerciseGuidance) {
      if ((state as any).isPrimaryGuidance) return 'pulse-strong-amber';
      if ((state as any).isSecondaryGuidance) return 'pulse-strong-blue';
      return '';
    }
    if (state.daysDiff === 0) {
      return viewMode === 'routine' ? 'pulse-strong-amber' : 'pulse-strong';
    } else if (state.daysDiff === 1 || state.daysDiff === 2) {
      return viewMode === 'routine' ? 'pulse-medium-amber' : 'pulse-medium';
    } else if (state.daysDiff === 3) {
      return viewMode === 'routine' ? 'pulse-minor-amber' : 'pulse-minor';
    }
    return '';
  };

  // Helper containing props logic for SVG interactive muscle paths
  const getMuscleProps = (group: string) => {
    const isSelected = selectedMuscle === group;
    return {
      fill: isSelected ? '#ffd700' : getFill(group),
      fillOpacity: isSelected ? 0.65 : 1,
      filter: isSelected ? 'url(#glow-active)' : getFilter(group),
      stroke: isSelected ? '#ffd700' : 'rgba(255, 255, 255, 0.4)',
      strokeWidth: isSelected ? '2' : '1.25',
      strokeDasharray: isSelected ? '3, 1' : 'none',
      onClick: () => {
        if (compact) return;
        setSelectedMuscle(selectedMuscle === group ? null : group);
        setExpandedExercise(null);
      },
      className: `hover-target-muscle transition-all duration-300 ${isSelected ? 'brightness-125' : ''} ${getPulseClass(group)}`
    };
  };

  // Heavy filter mapping Exercises database to currently highlighted muscle
  const getExercisesForMuscle = (muscle: string) => {
    const allExercises: any[] = [];
    Object.entries(POOLS).forEach(([key, list]) => {
      list.forEach(item => {
        allExercises.push({ ...item, key });
      });
    });

    try {
      const saved = localStorage.getItem('gym_custom_exercises');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach(item => {
            allExercises.push({
              name: item.name,
              icon: item.icon || "Activity",
              pool: item.pool || item.muscleGroup,
              muscleGroup: item.muscleGroup || item.pool,
              instructions: item.instructions || ["Perform this custom movement with controlled tempo."],
              key: "custom"
            });
          });
        }
      }
    } catch (e) {
      console.error("Error reading custom exercises in getExercisesForMuscle:", e);
    }

    return allExercises.filter(ex => {
      const mg = (ex.muscleGroup || "").toLowerCase();
      const p = (ex.pool || "").toLowerCase();
      const target = muscle.toLowerCase();
      
      if (mg === target || p === target) return true;
      
      // Leg regions mapping logic
      if (target === 'legs' && (p === 'legs' || mg === 'quads' || mg === 'hamstrings' || mg === 'glutes' || mg === 'calves')) {
        return true;
      }
      
      return false;
    });
  };

  const selectedMuscleDrills = selectedMuscle ? getExercisesForMuscle(selectedMuscle) : [];

  // Stylized Body Outline (Blocky style from reference image) - extended to cover biceps and forearms
  const bodyOutlinePath = "M100,40 Q110,40 115,50 L115,70 Q130,75 140,90 Q145,110 142,130 Q138,150 134,165 L127,160 Q130,145 130,110 Q125,180 120,250 L130,350 L110,350 L105,260 L95,260 L90,350 L70,350 L80,250 Q75,180 70,110 Q70,145 73,160 L66,165 Q62,150 58,130 Q55,110 60,90 Q70,75 85,70 L85,50 Q90,40 100,40 Z";

  const groupsToShow = ['chest', 'upper_back', 'lower_back', 'shoulders', 'quads', 'hamstrings', 'glutes', 'calves', 'biceps', 'triceps', 'core', 'forearms'];

  return (
    <div className="w-full space-y-4">
      <div className={compact ? "grid grid-cols-2 gap-4 py-2 w-full" : (selectedMuscle ? "grid grid-cols-1 lg:grid-cols-12 gap-6 py-4 w-full" : "grid grid-cols-2 lg:grid-cols-4 gap-6 py-4 w-full")}>
        {/* Dynamic styles injected for pulsing live effects */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes minor-pulse {
            0%, 100% { opacity: 0.85; }
            50% { opacity: 1; }
          }
          @keyframes medium-pulse {
            0%, 100% { opacity: 0.55; }
            50% { opacity: 1; }
          }
          @keyframes strong-pulse {
            0%, 100% { opacity: 0.35; }
            50% { opacity: 1; }
          }
          @keyframes minor-pulse-amber {
            0%, 100% { opacity: 0.8; filter: drop-shadow(0 0 1px rgba(251, 191, 36, 0.3)); }
            50% { opacity: 1; filter: drop-shadow(0 0 3px rgba(251, 191, 36, 0.6)); }
          }
          @keyframes medium-pulse-amber {
            0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 2px rgba(245, 158, 11, 0.4)); }
            50% { opacity: 1; filter: drop-shadow(0 0 7px rgba(245, 158, 11, 0.75)); }
          }
          @keyframes strong-pulse-amber {
            0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 3px rgba(251, 191, 36, 0.5)); }
            50% { opacity: 1; filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.95)); }
          }
          .pulse-minor {
            animation: minor-pulse 2.2s infinite ease-in-out;
          }
          .pulse-medium {
            animation: medium-pulse 1.3s infinite ease-in-out;
          }
          .pulse-strong {
            animation: strong-pulse 0.75s infinite ease-in-out;
          }
          .pulse-minor-amber {
            animation: minor-pulse-amber 2.2s infinite ease-in-out;
          }
          .pulse-medium-amber {
            animation: medium-pulse-amber 1.3s infinite ease-in-out;
          }
          .pulse-strong-amber {
            animation: strong-pulse-amber 0.85s infinite ease-in-out;
          }
          @keyframes minor-pulse-blue {
            0%, 100% { opacity: 0.8; filter: drop-shadow(0 0 1px rgba(59, 130, 246, 0.3)); }
            50% { opacity: 1; filter: drop-shadow(0 0 3px rgba(59, 130, 246, 0.6)); }
          }
          @keyframes medium-pulse-blue {
            0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 2px rgba(59, 130, 246, 0.4)); }
            50% { opacity: 1; filter: drop-shadow(0 0 7px rgba(59, 130, 246, 0.75)); }
          }
          @keyframes strong-pulse-blue {
            0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 3px rgba(59, 130, 246, 0.5)); }
            50% { opacity: 1; filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.95)); }
          }
          .pulse-minor-blue {
            animation: minor-pulse-blue 2.2s infinite ease-in-out;
          }
          .pulse-medium-blue {
            animation: medium-pulse-blue 1.3s infinite ease-in-out;
          }
          .pulse-strong-blue {
            animation: strong-pulse-blue 0.85s infinite ease-in-out;
          }
          .hover-target-muscle {
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .hover-target-muscle:hover {
            fill-opacity: 0.85 !important;
            stroke: #ffd700 !important;
            stroke-width: 1.5px !important;
          }
        `}} />

        {/* 1. Front View - Primary */}
        <div className={compact ? "flex flex-col items-center" : (selectedMuscle ? "lg:col-span-2 flex flex-col items-center" : "flex flex-col items-center")}>
          <div className={compact ? "h-8 flex items-center justify-center text-center mb-2" : "min-h-[2.5rem] flex items-center justify-center text-center mb-6"}>
            <h4 className={compact ? "text-[8px] text-gym-accent font-bold uppercase tracking-[0.2em]" : "text-[10px] text-gym-accent font-bold uppercase tracking-[0.3em]"}>
              {compact ? "Front View" : "Front Primary"}
            </h4>
          </div>
          <svg viewBox={compact ? "50 35 100 320" : "0 0 200 400"} className={compact ? "w-full max-w-[190px] h-auto" : "w-full max-w-[210px] h-auto"}>
            {/* Cybernetic High-Contrast SVG Glow Filters */}
            <defs>
              <filter id="glow-red" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComponentTransfer in="blur" result="glow">
                  <feFuncA type="linear" slope="0.8" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-orange" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComponentTransfer in="blur" result="glow">
                  <feFuncA type="linear" slope="0.6" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-green" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComponentTransfer in="blur" result="glow">
                  <feFuncA type="linear" slope="0.5" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-amber" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComponentTransfer in="blur" result="glow">
                  <feFuncA type="linear" slope="0.85" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-active" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4.5" result="blur" />
                <feComponentTransfer in="blur" result="glow">
                  <feFuncA type="linear" slope="1" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-blue-strong" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComponentTransfer in="blur" result="glow">
                  <feFuncA type="linear" slope="0.85" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-blue-medium" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComponentTransfer in="blur" result="glow">
                  <feFuncA type="linear" slope="0.6" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Stylized Body Outline - Front */}
            <g fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={compact ? "1" : "1.25"}>
              <path d={bodyOutlinePath} />
            </g>

            {/* Muscle Groups - Front */}
            {/* Shoulders */}
            <path 
              d="M85,75 Q75,75 70,90 L75,105 Q80,105 85,95 Z M115,75 Q125,75 130,90 L125,105 Q120,105 115,95 Z" 
              {...getMuscleProps('shoulders')}
            />
            {/* Chest */}
            <path 
              d="M88,90 Q100,85 112,90 L115,115 Q100,120 85,115 Z" 
              {...getMuscleProps('chest')}
            />
            {/* Abs (Core) */}
            <path 
              d="M90,125 Q100,122 110,125 L108,185 Q100,188 92,185 Z" 
              {...getMuscleProps('core')}
            />
            {/* Biceps */}
            <path 
              d="M65,105 Q60,115 62,130 L70,125 Q72,115 70,105 Z M135,105 Q140,115 138,130 L130,125 Q128,115 130,105 Z" 
              {...getMuscleProps('biceps')}
            />
            {/* Forearms */}
            <path 
              d="M62,130 Q62,150 66,165 L73,160 Q70,145 70,125 Z M138,130 Q138,150 134,165 L127,160 Q130,145 130,125 Z" 
              {...getMuscleProps('forearms')}
            />
            {/* Quads (Upper Legs) */}
            <path 
              d="M82,200 Q90,195 98,200 L95,255 L85,255 Z M102,200 Q110,195 118,200 L115,255 L105,255 Z" 
              {...getMuscleProps('quads')}
            />
            {/* Calves (Lower Legs) */}
            <path 
              d="M84,265 L92,265 L88,330 L80,330 Z M116,265 L108,265 L112,330 L120,330 Z" 
              {...getMuscleProps('calves')}
            />
          </svg>
        </div>

        {/* 2. Front View - Secondary */}
        {!compact && (
          <div className={selectedMuscle ? "lg:col-span-2 flex flex-col items-center" : "flex flex-col items-center"}>
            <div className="min-h-[2.5rem] flex items-center justify-center text-center mb-6">
              <h4 className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.3em]">Front Secondary</h4>
            </div>
            <svg viewBox="0 0 200 400" className="w-full max-w-[210px] h-auto">
              {/* Stylized Body Outline - Front */}
              <g fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.25">
                <path d={bodyOutlinePath} />
              </g>

              {/* Muscle Groups - Front (Secondary Highlight Mode) */}
              {/* Shoulders */}
              <path 
                d="M85,75 Q75,75 70,90 L75,105 Q80,105 85,95 Z M115,75 Q125,75 130,90 L125,105 Q120,105 115,95 Z" 
                {...getSecondaryMuscleProps('shoulders')}
              />
              {/* Chest */}
              <path 
                d="M88,90 Q100,85 112,90 L115,115 Q100,120 85,115 Z" 
                {...getSecondaryMuscleProps('chest')}
              />
              {/* Abs (Core) */}
              <path 
                d="M90,125 Q100,122 110,125 L108,185 Q100,188 92,185 Z" 
                {...getSecondaryMuscleProps('core')}
              />
              {/* Biceps */}
              <path 
                d="M65,105 Q60,115 62,130 L70,125 Q72,115 70,105 Z M135,105 Q140,115 138,130 L130,125 Q128,115 130,105 Z" 
                {...getSecondaryMuscleProps('biceps')}
              />
              {/* Forearms */}
              <path 
                d="M62,130 Q62,150 66,165 L73,160 Q70,145 70,125 Z M138,130 Q138,150 134,165 L127,160 Q130,145 130,125 Z" 
                {...getSecondaryMuscleProps('forearms')}
              />
              {/* Quads (Upper Legs) */}
              <path 
                d="M82,200 Q90,195 98,200 L95,255 L85,255 Z M102,200 Q110,195 118,200 L115,255 L105,255 Z" 
                {...getSecondaryMuscleProps('quads')}
              />
              {/* Calves (Lower Legs) */}
              <path 
                d="M84,265 L92,265 L88,330 L80,330 Z M116,265 L108,265 L112,330 L120,330 Z" 
                {...getSecondaryMuscleProps('calves')}
              />
            </svg>
          </div>
        )}

        {/* 3. Back View - Primary */}
        <div className={compact ? "flex flex-col items-center" : (selectedMuscle ? "lg:col-span-2 flex flex-col items-center" : "flex flex-col items-center")}>
          <div className={compact ? "h-8 flex items-center justify-center text-center mb-2" : "min-h-[2.5rem] flex items-center justify-center text-center mb-6"}>
            <h4 className={compact ? "text-[8px] text-gym-accent font-bold uppercase tracking-[0.2em]" : "text-[10px] text-gym-accent font-bold uppercase tracking-[0.3em]"}>
              {compact ? "Rear View" : "Rear Primary"}
            </h4>
          </div>
          <svg viewBox={compact ? "50 35 100 320" : "0 0 200 400"} className={compact ? "w-full max-w-[190px] h-auto" : "w-full max-w-[210px] h-auto"}>
            {/* Stylized Body Outline - Back */}
            <g fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={compact ? "1" : "1.25"}>
              <path d={bodyOutlinePath} />
            </g>

            {/* Muscle Groups - Back */}
            {/* Upper/Mid Back */}
            <path 
              d="M85,85 Q100,75 115,85 L120,135 Q100,145 80,135 Z" 
              {...getMuscleProps('upper_back')}
            />
            {/* Middle/Lower Back */}
            <path 
              d="M90,140 Q100,145 110,140 L115,180 Q100,185 85,180 Z" 
              {...getMuscleProps('lower_back')}
            />
            {/* Shoulders */}
            <path 
              d="M85,75 Q75,75 70,90 L75,105 Q80,105 85,95 Z M115,75 Q125,75 130,90 L125,105 Q120,105 115,95 Z" 
              {...getMuscleProps('shoulders')}
            />
            {/* Triceps */}
            <path 
              d="M62,105 Q58,115 60,130 L68,135 Q70,120 68,105 Z M138,105 Q142,115 140,130 L132,135 Q130,120 132,105 Z" 
              {...getMuscleProps('triceps')}
            />
            {/* Forearms */}
            <path 
              d="M60,130 Q60,150 64,165 L71,160 Q68,145 68,135 Z M140,130 Q140,150 136,165 L129,160 Q132,145 132,135 Z" 
              {...getMuscleProps('forearms')}
            />
            {/* Glutes */}
            <path 
              d="M82,185 C75,185 75,220 82,225 C90,225 100,215 100,215 C100,215 110,225 118,225 C125,220 125,185 118,185 C110,185 100,195 100,195 C100,195 90,185 82,185 Z" 
              {...getMuscleProps('glutes')}
            />
            {/* Hamstrings */}
            <path 
              d="M82,225 L95,225 L92,262 L84,262 Z M118,225 L105,225 L108,262 L116,262 Z" 
              {...getMuscleProps('hamstrings')}
            />
            {/* Calves (Lower Legs) */}
            <path 
              d="M83,270 L91,270 L88,330 L79,330 Z M117,270 L109,270 L112,330 L121,330 Z" 
              {...getMuscleProps('calves')}
            />
          </svg>
        </div>

        {/* 4. Back View - Secondary */}
        {!compact && (
          <div className={selectedMuscle ? "lg:col-span-2 flex flex-col items-center" : "flex flex-col items-center"}>
            <div className="min-h-[2.5rem] flex items-center justify-center text-center mb-6">
              <h4 className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.3em]">Rear Secondary</h4>
            </div>
            <svg viewBox="0 0 200 400" className="w-full max-w-[210px] h-auto">
              {/* Stylized Body Outline - Back */}
              <g fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.25">
                <path d={bodyOutlinePath} />
              </g>

              {/* Muscle Groups - Back (Secondary Highlight Mode) */}
              {/* Upper/Mid Back */}
              <path 
                d="M85,85 Q100,75 115,85 L120,135 Q100,145 80,135 Z" 
                {...getSecondaryMuscleProps('upper_back')}
              />
              {/* Middle/Lower Back */}
              <path 
                d="M90,140 Q100,145 110,140 L115,180 Q100,185 85,180 Z" 
                {...getSecondaryMuscleProps('lower_back')}
              />
              {/* Shoulders */}
              <path 
                d="M85,75 Q75,75 70,90 L75,105 Q80,105 85,95 Z M115,75 Q125,75 130,90 L125,105 Q120,105 115,95 Z" 
                {...getSecondaryMuscleProps('shoulders')}
              />
              {/* Triceps */}
              <path 
                d="M62,105 Q58,115 60,130 L68,135 Q70,120 68,105 Z M138,105 Q142,115 140,130 L132,135 Q130,120 132,105 Z" 
                {...getSecondaryMuscleProps('triceps')}
              />
              {/* Forearms */}
              <path 
                d="M60,130 Q60,150 64,165 L71,160 Q68,145 68,135 Z M140,130 Q140,150 136,165 L129,160 Q132,145 132,135 Z" 
                {...getSecondaryMuscleProps('forearms')}
              />
              {/* Glutes */}
              <path 
                d="M82,185 C75,185 75,220 82,225 C90,225 100,215 100,215 C100,215 110,225 118,225 C125,220 125,185 118,185 C110,185 100,195 100,195 C100,195 90,185 82,185 Z" 
                {...getSecondaryMuscleProps('glutes')}
              />
              {/* Hamstrings */}
              <path 
                d="M82,225 L95,225 L92,262 L84,262 Z M118,225 L105,225 L108,262 L116,262 Z" 
                {...getSecondaryMuscleProps('hamstrings')}
              />
              {/* Calves (Lower Legs) */}
              <path 
                d="M83,270 L91,270 L88,330 L79,330 Z M117,270 L109,270 L112,330 L121,330 Z" 
                {...getSecondaryMuscleProps('calves')}
              />
            </svg>
          </div>
        )}

        {/* Sidebar panel for interactive drills (Option 2) */}
        {!compact && selectedMuscle && (
          <div className="lg:col-span-4 bg-[#040404]/90 border border-gym-accent/35 rounded-md p-5 space-y-5 shadow-[0_0_20px_rgba(255,215,0,0.03)] backdrop-blur-md flex flex-col justify-between">
            {/* Header: Reticle Active Indicator */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 flex items-center justify-center border border-gym-accent/40 rounded-md bg-gym-accent/5">
                  <Crosshair className="w-4 h-4 text-gym-accent animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="absolute inset-0 border border-gym-accent/15 rounded-md animate-ping opacity-25" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#ffffff] flex items-center gap-1.5 font-mono">
                    Target Aligned: <span className="text-gym-accent">{selectedMuscle === 'core' ? 'Abs & Core' : selectedMuscle}</span>
                  </h3>
                  <p className="text-[8px] text-white/40 uppercase tracking-widest font-mono">Telemetry Active &bull; Form Guidance</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedMuscle(null);
                  setExpandedExercise(null);
                }}
                className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer border border-white/5"
              >
                <X className="w-3.5 h-3.5 text-white/50 hover:text-white" />
              </button>
            </div>

            {/* Grid 1: Alignment Analytics & Mechanical Targets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Box A: Rep scheme */}
              <div className="p-3 bg-white/[0.015] border border-white/5 rounded-md flex flex-col items-center justify-center text-center">
                <Target className="w-4 h-4 text-gym-accent/80 mb-1" />
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest block font-mono">Target Range</span>
                <span className="text-[10px] font-black text-white uppercase mt-1 font-mono">{BIOMECHANICS[selectedMuscle]?.reps || "8-12 Reps"}</span>
              </div>
              {/* Box B: Rest cycle */}
              <div className="p-3 bg-white/[0.015] border border-white/5 rounded-md flex flex-col items-center justify-center text-center">
                <Timer className="w-4 h-4 text-gym-accent/80 mb-1" />
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest block font-mono">Rest Goal</span>
                <span className="text-[10px] font-black text-white uppercase mt-1 font-mono">{BIOMECHANICS[selectedMuscle]?.rest || "90 Secs"}</span>
              </div>
              {/* Box C: Category */}
              <div className="p-3 bg-white/[0.015] border border-white/5 rounded-md flex flex-col items-center justify-center text-center">
                <Dumbbell className="w-4 h-4 text-gym-accent/80 mb-1" />
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest block font-mono">Mechanics</span>
                <span className="text-[10px] font-black text-gym-accent uppercase mt-1 font-mono text-[9px]">{BIOMECHANICS[selectedMuscle]?.mechanics || "Mixed"}</span>
              </div>
            </div>

            {/* Biomechanical Tips Box */}
            <div className="p-4 bg-gym-accent/[0.02] border border-gym-accent/15 rounded-md space-y-1.5">
              <div className="flex items-center gap-1.5 text-gym-accent">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-wider font-mono">Biomechanical Isolation Secret</span>
              </div>
              <p className="text-[11px] leading-relaxed text-white/85">
                {BIOMECHANICS[selectedMuscle]?.tip}
              </p>
              <div className="text-[9px] text-white/45 leading-relaxed font-mono pt-1.5 uppercase border-t border-white/5 mt-2">
                <span className="text-gym-accent font-bold">SETUP TIP:</span> {BIOMECHANICS[selectedMuscle]?.setup}
              </div>
            </div>

            {/* Movements/Drills list */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white/60">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Recommended Drills ({selectedMuscleDrills.length})</span>
                </div>
                <span className="text-[8px] text-white/30 uppercase tracking-widest font-mono">Tap drill to study form</span>
              </div>

              <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-white/10">
                {selectedMuscleDrills.length === 0 ? (
                  <div className="p-4 rounded-md border border-white/5 bg-white/[0.01] text-center text-white/45 text-[11px] uppercase">
                    No matching drills cataloged for this precise sector.
                  </div>
                ) : (
                  selectedMuscleDrills.map((ex, index) => {
                    const isExpanded = expandedExercise === ex.name;
                    return (
                      <div 
                        key={`${ex.name}-${index}`} 
                        className={`rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? "bg-gradient-to-b from-white/[0.1] via-white/[0.04] to-black/90 border-gym-accent/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.6)]" : "bg-gradient-to-b from-white/[0.06] to-black/60 border-white/12 hover:border-white/25 hover:from-white/[0.08]"}`}
                      >
                        {/* Summary Header Row */}
                        <div 
                          onClick={() => setExpandedExercise(isExpanded ? null : ex.name)}
                          className="flex items-center justify-between p-3 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded bg-white/5 flex items-center justify-center text-white/65 border border-white/5">
                              <Zap className="w-3.5 h-3.5 text-gym-accent" />
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-white block uppercase tracking-wide">{ex.name}</span>
                              <span className="text-[8px] text-white/35 font-mono uppercase tracking-widest">{ex.key === 'custom' ? 'Custom Exercise' : `${ex.key} Drill`}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {/* Youtube video linkage */}
                            <a 
                              href={ex.youtubeUrl || `https://www.youtube.com/results?search_query=how+to+do+${encodeURIComponent(ex.name)}`} 
                              target="_blank" 
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-6 h-6 rounded bg-red-950/20 hover:bg-red-900/40 border border-red-500/30 flex items-center justify-center transition-all"
                              title="Search Form on YouTube"
                            >
                              <ExternalLink className="w-2.5 h-2.5 text-red-500" />
                            </a>
                            <div className="text-white/40 ml-1">
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        </div>

                        {/* Collapsible content (Setup method / instructions) */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.18 }}
                              className="overflow-hidden border-t border-white/5"
                            >
                              <div className="p-3 bg-black/40 space-y-2 text-[10px] leading-relaxed text-white/80">
                                <div className="text-[8.5px] font-bold text-gym-accent uppercase tracking-widest font-mono mb-1">Tactical Execution Protocol:</div>
                                {ex.instructions && ex.instructions.length > 0 ? (
                                  <ol className="list-decimal list-inside space-y-1 pl-1">
                                    {ex.instructions.map((inst: string, idx: number) => (
                                      <li key={idx} className="marker:text-gym-accent marker:font-bold">
                                        {inst}
                                      </li>
                                    ))}
                                  </ol>
                                ) : (
                                  <p>Ensure correct lifting forms; control the loading phase and hold peaks.</p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Placeholder instruction panel when no muscle is clicked */}
      {!compact && !selectedMuscle && (
        <div className="border border-white/5 rounded-md p-5 bg-white/[0.01] backdrop-blur-sm flex flex-col items-center justify-center text-center space-y-2.5 min-h-[140px]">
          <div className="w-9 h-9 rounded-full border border-gym-accent/30 bg-gym-accent/5 flex items-center justify-center relative">
            <Crosshair className="w-4.5 h-4.5 text-gym-accent animate-pulse" />
            <span className="absolute inset-0 border border-gym-accent/10 rounded-full animate-ping opacity-25" />
          </div>
          <div>
            <h5 className="text-[10px] font-black text-white uppercase tracking-[0.2em] font-mono">Muscle Isolation System Deselected</h5>
            <p className="text-[9px] text-white/40 max-w-lg mx-auto mt-1 uppercase leading-relaxed tracking-wider font-mono">
              Leverage the fully interactive Front & Rear grids by clicking any sector (e.g., Chest, Glutes, Hamstrings) to deploy targeting specs and isolation drills!
            </p>
          </div>
        </div>
      )}

      {/* Legend & Details Block */}
      {!compact && (
        <div className="md:col-span-2 mt-4 space-y-6">
          {/* Modern Interactive Glossary */}
          <div className="bg-[#050505] border border-white/5 rounded-md p-5 space-y-4">
            <h5 className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] font-mono">Real-time Recovery Legend</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="flex items-start gap-2.5 p-2 bg-red-950/20 border border-red-500/20 rounded-md">
                <span className="w-2 h-2 rounded-full bg-[#ef4444] shadow-[0_0_8px_#ef4444] mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-bold uppercase tracking-wider text-[10px]">Active Today</div>
                  <div className="text-white/40 text-[9px] mt-0.5 uppercase">Peak fatigue / Peak engagement</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 bg-orange-950/20 border border-orange-500/20 rounded-md">
                <span className="w-2 h-2 rounded-full bg-[#f97316] shadow-[0_0_8px_#f97316] mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-bold uppercase tracking-wider text-[10px]">Fatigued (D1-D2)</div>
                  <div className="text-white/40 text-[9px] mt-0.5 uppercase">Muscular breakdown & Repair</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 bg-green-950/20 border border-green-500/20 rounded-md">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e] mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-bold uppercase tracking-wider text-[10px]">Ready (D3)</div>
                  <div className="text-white/40 text-[9px] mt-0.5 uppercase">Optimal supercompensation window</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 bg-zinc-950/80 border border-white/5 rounded-md">
                <span className="w-2 h-2 rounded-full bg-white/25 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white/60 font-bold uppercase tracking-wider text-[10px]">Fully Rested (D4+)</div>
                  <div className="text-white/30 text-[9px] mt-0.5 uppercase">Rested & fully prepared to train</div>
                </div>
              </div>
            </div>
          </div>

          {/* Muscle Detail Grid with timelines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupsToShow.map(group => {
              const info = statuses[group];
              const isUntouched = info.daysDiff > 4;

              return (
                <div key={group} className="bg-zinc-950/70 border border-white/10 p-4 rounded-md flex flex-col justify-between backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                    <span className="text-[10px] text-white font-black uppercase tracking-widest font-mono">
                      {group === 'core' ? 'abs/core' : group === 'upper_back' ? 'upper back' : group === 'lower_back' ? 'lower back' : group}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider text-[10px]" style={{ color: info.fill, backgroundColor: `${info.fill}10` }}>
                      {info.daysDiff === 0 ? "Today" : isUntouched ? "Fully Rested" : `${info.daysDiff}d Ago`}
                    </span>
                  </div>

                  <div className="text-[10px] text-white/40 uppercase mb-4 font-semibold tracking-wider">
                    {info.text}
                  </div>

                  {/* 5-Day Visual recovery blocks */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[8px] text-white/30 uppercase tracking-widest font-mono font-bold font-black px-1">
                      <span>Today</span>
                      <span>D1</span>
                      <span>D2</span>
                      <span>D3</span>
                      <span>D4+</span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      {[0, 1, 2, 3, 4].map(dayIndex => {
                        let active = false;
                        let activeColor = '';
                        let activeGlow = '';

                        if (dayIndex === 4) {
                          active = info.daysDiff >= 4;
                          activeColor = '#52525b';
                          activeGlow = 'none';
                        } else {
                          active = info.daysDiff === dayIndex;
                          activeColor = dayIndex === 0 ? '#ef4444' : (dayIndex === 3 ? '#22c55e' : '#f97316');
                          activeGlow = `0 0 10px ${activeColor}`;
                        }

                        return (
                          <div
                            key={dayIndex}
                            style={{ 
                              backgroundColor: active ? activeColor : 'rgba(255, 255, 255, 0.04)',
                              boxShadow: active ? activeGlow : 'none',
                              borderColor: active ? activeColor : 'rgba(255, 255, 255, 0.1)'
                            }}
                            className={`h-4 border rounded-md transition-all duration-500 relative flex items-center justify-center`}
                          >
                            {active && (
                              <div className="w-1 h-1 rounded-full bg-white opacity-80" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnatomyChart;
