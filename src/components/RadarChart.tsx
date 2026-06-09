import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  const comparisonColor = '#0ea5e9'; // Historical sky blue

  // --- 1. State for Comparison Mode & Interactive Tooltip ---
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<{
    label: string;
    key: string;
    count: number;
    uniqueExercises: number;
    score: number;
    histCount: number;
    histScore: number;
    histUniqueExercises: number;
    x: number;
    y: number;
  } | null>(null);

  // --- 2. Dynamic Muscular Radar Calculation ---
  const radarData = useMemo(() => {
    // 6 strategic buckets for balanced athletic biomechanics
    const currentCats: Record<string, { label: string; count: number; exercises: Set<string> }> = {
      chest: { label: 'Chest (Push)', count: 0, exercises: new Set() },
      back: { label: 'Back (Pull)', count: 0, exercises: new Set() },
      shoulders: { label: 'Shoulders', count: 0, exercises: new Set() },
      legs: { label: 'Legs/Lower', count: 0, exercises: new Set() },
      arms: { label: 'Arms', count: 0, exercises: new Set() },
      core: { label: 'Core', count: 0, exercises: new Set() }
    };

    const histCats: Record<string, { label: string; count: number; exercises: Set<string> }> = {
      chest: { label: 'Chest (Push)', count: 0, exercises: new Set() },
      back: { label: 'Back (Pull)', count: 0, exercises: new Set() },
      shoulders: { label: 'Shoulders', count: 0, exercises: new Set() },
      legs: { label: 'Legs/Lower', count: 0, exercises: new Set() },
      arms: { label: 'Arms', count: 0, exercises: new Set() },
      core: { label: 'Core', count: 0, exercises: new Set() }
    };

    const processSet = (exName: string, isCurrent: boolean) => {
      const rawGroup = findMuscleGroup(exName);
      if (!rawGroup) return;

      const target = isCurrent ? currentCats : histCats;

      if (['chest', 'upper_chest', 'middle_chest', 'lower_chest'].includes(rawGroup)) {
        target.chest.count += 1;
        target.chest.exercises.add(exName);
      } else if (['back', 'upper_back', 'lower_back', 'lats', 'rhomboids_traps', 'erector_spinae'].includes(rawGroup)) {
        target.back.count += 1;
        target.back.exercises.add(exName);
      } else if (['shoulders', 'front_delts', 'side_delts', 'rear_delts'].includes(rawGroup)) {
        target.shoulders.count += 1;
        target.shoulders.exercises.add(exName);
      } else if (['quads', 'hamstrings', 'glutes', 'calves', 'legs'].includes(rawGroup)) {
        target.legs.count += 1;
        target.legs.exercises.add(exName);
      } else if (['biceps', 'triceps', 'forearms', 'arms', 'long_biceps', 'short_biceps', 'brachialis', 'long_triceps', 'lateral_triceps', 'medial_triceps'].includes(rawGroup)) {
        target.arms.count += 1;
        target.arms.exercises.add(exName);
      } else if (['core', 'upper_core', 'lower_core', 'obliques'].includes(rawGroup)) {
        target.core.count += 1;
        target.core.exercises.add(exName);
      }
    };

    // Calculate from current active sets
    sessionSets.forEach(s => processSet(s.exerciseName, true));

    // Calculate from past workouts
    archivedWorkouts.forEach(w => {
      if (w?.sets && Array.isArray(w.sets)) {
        w.sets.forEach((s: any) => processSet(s.exerciseName, false));
      }
    });

    const maxCurrentCount = Math.max(...Object.values(currentCats).map(c => c.count), 1);
    const maxHistCount = Math.max(...Object.values(histCats).map(c => c.count), 1);

    // Sum of combined sets for default view
    const maxCombinedCount = Math.max(
      ...Object.keys(currentCats).map(key => currentCats[key].count + histCats[key].count),
      1
    );

    // Calculate symmetric scores on a scale of 20 to 100 for optimal visualization boundaries
    const list = Object.keys(currentCats).map(key => {
      const current = currentCats[key];
      const hist = histCats[key];
      const combinedCount = current.count + hist.count;

      const score = Math.max(20, Math.round((combinedCount / maxCombinedCount) * 100));
      const currentScore = Math.max(20, Math.round((current.count / maxCurrentCount) * 100));
      const histScore = Math.max(20, Math.round((hist.count / maxHistCount) * 100));

      return {
        key,
        label: current.label,
        count: current.count,
        uniqueExercises: current.exercises.size,
        score,
        currentScore,
        histCount: hist.count,
        histUniqueExercises: hist.exercises.size,
        histScore
      };
    });

    return {
      list,
      maxCurrentCount,
      maxHistCount,
      maxCombinedCount
    };
  }, [sessionSets, archivedWorkouts]);

  // Helper for rendering glowing radar axes
  const radarChartSVG = useMemo(() => {
    const list = radarData.list;
    const center = size / 2;
    const radius = size * 0.28; // expanded to fill container space better
    const stretchY = 1.70; // vertically stretched modifier to match grid layout
    const radiusX = radius;
    const radiusY = radius * stretchY;

    // Angles: vertical star starting upward at -90 degrees (-π/2)
    const vertices = list.map((item, i) => {
      const angle = -Math.PI / 2 + (i * Math.PI) / 3;
      const x = center + radiusX * Math.cos(angle);
      const y = center + radiusY * Math.sin(angle);
      
      // Plot combined coordinate
      const valMultiplier = item.score / 100;
      const valX = center + (radiusX * valMultiplier) * Math.cos(angle);
      const valY = center + (radiusY * valMultiplier) * Math.sin(angle);

      // Plot comparison coords
      const currentMultiplier = item.currentScore / 100;
      const currentValX = center + (radiusX * currentMultiplier) * Math.cos(angle);
      const currentValY = center + (radiusY * currentMultiplier) * Math.sin(angle);

      const histMultiplier = item.histScore / 100;
      const histValX = center + (radiusX * histMultiplier) * Math.cos(angle);
      const histValY = center + (radiusY * histMultiplier) * Math.sin(angle);

      // Label coords adjusted outward for margins
      const labelOffset = 18;
      const lblX = center + (radiusX + labelOffset) * Math.cos(angle);
      const lblY = center + (radiusY + labelOffset) * Math.sin(angle);

      return {
        ...item,
        x,
        y,
        valX,
        valY,
        currentValX,
        currentValY,
        histValX,
        histValY,
        lblX,
        lblY,
        angle
      };
    });

    const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

    return {
      center,
      radius,
      radiusX,
      radiusY,
      vertices,
      rings
    };
  }, [radarData, size]);

  const hasData = radarData.maxCombinedCount > 0 || radarData.list.some(l => l.count > 0 || l.histCount > 0);
  const hasCurrentData = radarData.maxCurrentCount > 0 && radarData.list.some(l => l.count > 0);
  const hasHistoricalData = radarData.maxHistCount > 0 && radarData.list.some(l => l.histCount > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.015, borderColor: 'rgba(34, 197, 110, 0.35)', boxShadow: '0 12px 30px -10px rgba(34, 197, 110, 0.16)' }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="flex flex-col items-center justify-between p-4 bg-black/60 border border-white/10 rounded-sm backdrop-blur-md relative h-full min-h-[410px]"
    >
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />

      {/* Header Info */}
      <div className="w-full text-center mb-1 pb-1 border-b border-white/5 flex flex-col items-center">
        <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-mono font-bold block">Biomechanical Balance</span>
        <span className="text-[11px] text-gym-accent uppercase font-bold tracking-widest font-mono">Muscular Spider Web Matrix</span>
      </div>

      {/* Toggle Comparison Mode Button */}
      <div className="flex items-center gap-2 mt-1 mb-2 z-10">
        <button 
          onClick={() => setComparisonMode(prev => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-sm border text-[8px] font-black uppercase tracking-widest transition-all cursor-pointer ${
            comparisonMode 
              ? 'bg-gym-accent/10 border-gym-accent/40 text-gym-accent shadow-[0_0_10px_rgba(34,197,110,0.15)]' 
              : 'bg-white/5 border-white/10 text-white/40 hover:text-white/80 hover:border-white/20'
          }`}
          title="Toggle overlay comparing today's workout with your historical exercise volume summaries"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${comparisonMode ? 'bg-[#22c55e] animate-pulse' : 'bg-white/25'}`} />
          {comparisonMode ? 'Viewing Workout Comparison' : 'Toggle Comparison Mode'}
        </button>
      </div>

      {/* SVG Canvas and Tooltip Container */}
      <div className="relative flex items-center justify-center w-full" style={{ height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
          <defs>
            {/* Primary active session fill gradient */}
            <radialGradient id="console-radar-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
              <stop offset="85%" stopColor={accentColor} stopOpacity="0.04" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
            </radialGradient>

            {/* Historical fill gradient */}
            <radialGradient id="historical-radar-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={comparisonColor} stopOpacity="0.20" />
              <stop offset="85%" stopColor={comparisonColor} stopOpacity="0.02" />
              <stop offset="100%" stopColor={comparisonColor} stopOpacity="0" />
            </radialGradient>

            <filter id="console-radar-line-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="history-radar-line-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Concentric helper grid polygons */}
          {radarChartSVG.rings.map((ringMulti, idx) => {
            const rx = radarChartSVG.radiusX * ringMulti;
            const ry = radarChartSVG.radiusY * ringMulti;
            const points = radarChartSVG.vertices.map((v, i) => {
              const angle = -Math.PI / 2 + (i * Math.PI) / 3;
              const x = radarChartSVG.center + rx * Math.cos(angle);
              const y = radarChartSVG.center + ry * Math.sin(angle);
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
                  transformOrigin: `${radarChartSVG.center}px ${radarChartSVG.center}px`
                }}
              />
            );
          })}

          {/* Axis Radial Lines */}
          {radarChartSVG.vertices.map((v, i) => (
            <motion.line
              key={i}
              x1={radarChartSVG.center}
              y1={radarChartSVG.center}
              x2={v.x}
              y2={v.y}
              stroke="rgba(255, 255, 255, 0.07)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                delay: 0.1 + (i * 0.03),
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
              }}
            />
          ))}

          {/* Ring Percentage Markers */}
          {[50, 100].map((perc, i) => {
            const ry = radarChartSVG.radiusY * (perc / 100);
            return (
              <motion.text
                key={i}
                x={radarChartSVG.center + 4}
                y={radarChartSVG.center - ry - 2}
                fill="white"
                className="text-[6px] font-mono tracking-widest font-bold fill-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                {perc}%
              </motion.text>
            );
          })}

          {/* ================= SHAPES RENDERING ================= */}

          {hasData && (
            comparisonMode ? (
              <>
                {/* 1. Historical Volume Shape (Comparison Overlay) */}
                {hasHistoricalData && (
                  <motion.path
                    d={radarChartSVG.vertices.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.histValX} ${v.histValY}`).join(' ') + ' Z'}
                    fill="url(#historical-radar-glow)"
                    stroke={comparisonColor}
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                    strokeDasharray="2,2"
                    filter="url(#history-radar-line-glow)"
                    initial={{ pathLength: 0, fillOpacity: 0 }}
                    animate={{ pathLength: 1, fillOpacity: 0.8 }}
                    transition={{
                      pathLength: { delay: 0.4, duration: 1.1, ease: "easeInOut" },
                      fillOpacity: { delay: 1.3, duration: 0.5, ease: "easeOut" }
                    }}
                  />
                )}

                {/* 2. Today's Workout Active Shape */}
                {hasCurrentData && (
                  <motion.path
                    d={radarChartSVG.vertices.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.currentValX} ${v.currentValY}`).join(' ') + ' Z'}
                    fill="url(#console-radar-glow)"
                    stroke={accentColor}
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                    filter="url(#console-radar-line-glow)"
                    initial={{ pathLength: 0, fillOpacity: 0 }}
                    animate={{ pathLength: 1, fillOpacity: 1 }}
                    transition={{
                      pathLength: { delay: 0.5, duration: 1.3, ease: "easeInOut" },
                      fillOpacity: { delay: 1.6, duration: 0.6, ease: "easeOut" }
                    }}
                  />
                )}
              </>
            ) : (
              /* 3. Combined / Standard Shape (Default View) */
              <motion.path
                d={radarChartSVG.vertices.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.valX} ${v.valY}`).join(' ') + ' Z'}
                fill="url(#console-radar-glow)"
                stroke={accentColor}
                strokeWidth="1.8"
                strokeLinejoin="round"
                filter="url(#console-radar-line-glow)"
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 1 }}
                transition={{
                  pathLength: { delay: 0.5, duration: 1.3, ease: "easeInOut" },
                  fillOpacity: { delay: 1.6, duration: 0.6, ease: "easeOut" }
                }}
              />
            )
          )}

          {/* ================= VERTEX PLOT CIRCLES ================= */}
          {hasData && radarChartSVG.vertices.map((v, i) => {
            // Pick corresponding displayed coordinates
            const pointX = comparisonMode ? v.currentValX : v.valX;
            const pointY = comparisonMode ? v.currentValY : v.valY;

            return (
              <g key={i}>
                {/* Historical point overlays */}
                {comparisonMode && hasHistoricalData && (
                  <motion.circle
                    cx={v.histValX}
                    cy={v.histValY}
                    r="1.8"
                    fill="#000000"
                    stroke={comparisonColor}
                    strokeWidth="1"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.8 }}
                    transition={{
                      delay: i * 0.08,
                      type: "spring",
                      stiffness: 350,
                      damping: 15
                    }}
                    style={{
                      originX: `${v.histValX}px`,
                      originY: `${v.histValY}px`
                    }}
                  />
                )}

                {/* Main active point overlay */}
                <motion.circle
                  cx={pointX}
                  cy={pointY}
                  r="2.5"
                  fill="#000000"
                  stroke={accentColor}
                  strokeWidth="1.5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: i * 0.08,
                    type: "spring",
                    stiffness: 350,
                    damping: 15
                  }}
                  style={{
                    originX: `${pointX}px`,
                    originY: `${pointY}px`
                  }}
                />

                {/* HIGHLIGHT RINGS ON HOVER */}
                {activeTooltip?.key === v.key && (
                  <circle
                    cx={pointX}
                    cy={pointY}
                    r="5"
                    fill="none"
                    stroke={accentColor}
                    strokeWidth="1.2"
                    className="animate-ping"
                  />
                )}

                {/* ZERO-COLLISION INVISIBLE HOVER GESTURE TARGETS (UX optimization) */}
                <circle
                  cx={pointX}
                  cy={pointY}
                  r="14"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    setActiveTooltip({
                      label: v.label,
                      key: v.key,
                      count: v.count,
                      uniqueExercises: v.uniqueExercises,
                      score: v.score,
                      histCount: v.histCount,
                      histScore: v.histScore,
                      histUniqueExercises: v.histUniqueExercises,
                      x: pointX,
                      y: pointY
                    });
                  }}
                  onMouseLeave={() => setActiveTooltip(null)}
                />
              </g>
            );
          })}

          {/* ================= OUTER TEXT LABELS ================= */}
          {radarChartSVG.vertices.map((v, i) => {
            let textAnchor = "middle";
            if (Math.cos(v.angle) > 0.1) textAnchor = "start";
            else if (Math.cos(v.angle) < -0.1) textAnchor = "end";

            let dy = "0.33em";
            if (Math.sin(v.angle) > 0.8) dy = "0.80em";
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

            const isHovered = activeTooltip?.key === v.key;

            return (
              <motion.text
                key={i}
                x={v.lblX}
                y={v.lblY}
                dy={dy}
                textAnchor={textAnchor}
                fill={isHovered ? accentColor : "white"}
                className="text-[7.5px] font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer select-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.35 + (i * 0.03),
                  duration: 0.4,
                  ease: "easeOut"
                }}
                onMouseEnter={() => {
                  const pointX = comparisonMode ? v.currentValX : v.valX;
                  const pointY = comparisonMode ? v.currentValY : v.valY;
                  setActiveTooltip({
                    label: v.label,
                    key: v.key,
                    count: v.count,
                    uniqueExercises: v.uniqueExercises,
                    score: v.score,
                    histCount: v.histCount,
                    histScore: v.histScore,
                    histUniqueExercises: v.histUniqueExercises,
                    x: pointX,
                    y: pointY
                  });
                }}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                {displayName}
                <tspan className="text-[6.2px] fill-gym-accent/50 font-normal ml-0.5 font-sans"> ({v.count})</tspan>
              </motion.text>
            );
          })}
        </svg>

        {/* Dynamic center metric when no data is found */}
        {!hasData && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6">
            <span className="text-[8px] text-white/30 uppercase tracking-widest font-mono font-bold">RECRUIT_GRID</span>
            <span className="text-[9px] text-[#f43f5e] font-sans font-medium mt-1 uppercase">No Volume Logged</span>
          </div>
        )}

        {/* ================= INTERACTIVE FLOATING TOOLTIP ================= */}
        <AnimatePresence>
          {activeTooltip && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-40 p-3 bg-black/95 border border-white/15 rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.85)] flex flex-col pointer-events-none text-left min-w-[140px] select-none"
              style={{ 
                left: activeTooltip.x, 
                top: activeTooltip.y + 12,
                transform: 'translate(-50%, 0)'
              }}
            >
              {/* Highlight bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gym-accent" />
              
              <div className="text-[9px] font-black uppercase text-gym-accent tracking-widest mb-1.5 font-mono">
                {activeTooltip.label}
              </div>
              <div className="space-y-1 text-[8.5px] font-mono whitespace-nowrap">
                <div className="flex justify-between gap-6 text-white/90">
                  <span>TODAY'S SETS</span>
                  <span className="font-extrabold text-white text-right">{activeTooltip.count}</span>
                </div>
                <div className="flex justify-between gap-6 text-white/60">
                  <span>TODAY'S EXS</span>
                  <span className="font-bold text-white/80 text-right">{activeTooltip.uniqueExercises}</span>
                </div>
                
                {/* Historical stats shown within comparison or overlay */}
                <div className="border-t border-white/10 my-1 pb-1" />
                <div className="flex justify-between gap-6 text-[#0ea5e9]">
                  <span>PAST SETS</span>
                  <span className="font-extrabold text-right">{activeTooltip.histCount}</span>
                </div>
                <div className="flex justify-between gap-6 text-white/40">
                  <span>PAST EXS</span>
                  <span className="font-bold text-white/60 text-right">{activeTooltip.histUniqueExercises}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mini Legend / Subtitle info */}
      <div className="w-full flex justify-between items-center text-[7.5px] font-mono text-white/30 tracking-wider mt-1 pt-1.5 border-t border-white/5">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full inline-block" /> TODAY
        </span>
        {comparisonMode && (
          <span className="flex items-center gap-1.5 text-[#0ea5e9]">
            <span className="w-1.5 h-1.5 bg-[#0ea5e9] rounded-full inline-block" /> HISTORY
          </span>
        )}
        <span className="text-gym-accent/60 font-bold uppercase">HOVER FOR METRICS</span>
      </div>
    </motion.div>
  );
}
