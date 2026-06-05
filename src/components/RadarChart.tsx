import React, { useMemo } from 'react';
import { POOLS } from '../data/exercises';

interface SessionSet {
  id?: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}

interface RadarChartProps {
  sessionSets?: SessionSet[];
  archivedWorkouts?: any[];
  size?: number;
}

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

export default function RadarChart({
  sessionSets = [],
  archivedWorkouts = [],
  size = 240
}: RadarChartProps) {
  const accentColor = '#22c55e'; // Gym-accent green

  // --- 1. Dynamic Muscular Radar Calculation ---
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

  // Helper for rendering glowing radar axes
  const radarChartSVG = useMemo(() => {
    const list = radarData.list;
    const center = size / 2;
    // Keep dynamic padding for outer labels
    const radius = size * 0.26;

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
      const labelOffset = 16;
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
      center,
      radius,
      vertices,
      rings
    };
  }, [radarData, size]);

  const hasData = radarData.maxCount > 1 || radarData.list.some(l => l.count > 0);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-black/60 border border-white/10 rounded-sm backdrop-blur-md relative h-full">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />

      <div className="w-full text-center mb-1 pb-1 border-b border-white/5">
        <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-mono font-bold block">Biomechanical Balance</span>
        <span className="text-[11px] text-gym-accent uppercase font-bold tracking-widest font-mono">Muscular Spider Web Matrix</span>
      </div>

      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
          <defs>
            <radialGradient id="console-radar-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
              <stop offset="85%" stopColor={accentColor} stopOpacity="0.04" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
            </radialGradient>
            <filter id="console-radar-line-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
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
              strokeWidth="1"
            />
          ))}

          {/* Ring Label Percentages */}
          {[50, 100].map((perc, i) => {
            const r = radarChartSVG.radius * (perc / 100);
            return (
              <text
                key={i}
                x={radarChartSVG.center + 4}
                y={radarChartSVG.center - r - 2}
                fill="white"
                fillOpacity={0.2}
                className="text-[6px] font-mono tracking-widest font-bold fill-white/20"
              >
                {perc}%
              </text>
            );
          })}

          {/* Dynamic User Volume Web Polygon */}
          {hasData && (
            <polygon
              points={radarChartSVG.vertices.map(v => `${v.valX},${v.valY}`).join(' ')}
              fill="url(#console-radar-glow)"
              stroke={accentColor}
              strokeWidth="1.8"
              strokeLinejoin="round"
              filter="url(#console-radar-line-glow)"
            />
          )}

          {/* Vertex Plot Points */}
          {hasData && radarChartSVG.vertices.map((v, i) => (
            <circle
              key={i}
              cx={v.valX}
              cy={v.valY}
              r="2.5"
              fill="#000000"
              stroke={accentColor}
              strokeWidth="1.5"
              className="cursor-pointer"
            />
          ))}

          {/* Outer Labels */}
          {radarChartSVG.vertices.map((v, i) => {
            let textAnchor = "middle";
            if (Math.cos(v.angle) > 0.1) textAnchor = "start";
            else if (Math.cos(v.angle) < -0.1) textAnchor = "end";

            // Offset adjustment for bottom-middle text
            let dy = "0.33em";
            if (Math.sin(v.angle) > 0.8) dy = "0.85em";
            else if (Math.sin(v.angle) < -0.8) dy = "-0.2em";

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
                y={v.lblY}
                dy={dy}
                textAnchor={textAnchor}
                fill="white"
                className="text-[7.5px] font-mono font-bold tracking-wider uppercase fill-white"
              >
                {displayName}
                <tspan className="text-[6px] fill-gym-accent/50 font-normal ml-0.5 font-sans"> ({v.count})</tspan>
              </text>
            );
          })}
        </svg>

        {/* Dynamic center metric when no data */}
        {!hasData && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6">
            <span className="text-[8px] text-white/30 uppercase tracking-widest font-mono font-bold">RECRUIT_GRID</span>
            <span className="text-[9px] text-[#f43f5e] font-sans font-medium mt-1 uppercase">No Volume Logged</span>
          </div>
        )}
      </div>

      {/* Mini Legend */}
      <div className="w-full flex justify-between items-center text-[7.5px] font-mono text-white/40 tracking-wider mt-1 pt-1.5 border-t border-white/5">
        <span>ZONES: 6 ACTIVE</span>
        <span className="text-gym-accent font-bold">100% SCALE PROPORTIONAL</span>
      </div>
    </div>
  );
}
