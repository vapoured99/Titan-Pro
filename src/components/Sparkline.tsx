import React, { useMemo } from 'react';

interface SetData {
  weight: number;
  reps: number;
  date: string;
}

interface SparklineProps {
  exName: string;
  sessionSets?: any[];
  archivedWorkouts?: any[];
  width?: number;
  height?: number;
}

// 1-Rep Max formula (Epley)
const calc1RM = (weight: number, reps: number): number => {
  if (reps <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
};

export default function Sparkline({
  exName,
  sessionSets = [],
  archivedWorkouts = [],
  width = 80,
  height = 20
}: SparklineProps) {
  const trendData = useMemo(() => {
    const cleanName = exName.trim().toLowerCase();
    
    // Map of date -> max estimated 1RM (or max logged performance metric)
    const pointsMap: Record<string, { val: number; date: string }> = {};

    // 1. Process archived workouts (sorted oldest to newest)
    // We sort the workouts first by date to build the chronological timeline
    const sortedWorkouts = [...archivedWorkouts].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    sortedWorkouts.forEach((w) => {
      if (!w.date || !w.sets || !Array.isArray(w.sets)) return;
      
      w.sets.forEach((s: any) => {
        if (s.exerciseName && s.exerciseName.trim().toLowerCase() === cleanName) {
          const val = calc1RM(Number(s.weight) || 0, Number(s.reps) || 0);
          if (val > 0) {
            // Take the max 1RM for this exercise on this specific day
            const existing = pointsMap[w.date];
            if (!existing || val > existing.val) {
              pointsMap[w.date] = { val, date: w.date };
            }
          }
        }
      });
    });

    // 2. Process active session sets of today
    sessionSets.forEach((s: any) => {
      if (s.exerciseName && s.exerciseName.trim().toLowerCase() === cleanName) {
        const val = calc1RM(Number(s.weight) || 0, Number(s.reps) || 0);
        if (val > 0) {
          const todayStr = s.date || new Date().toISOString().split('T')[0];
          const existing = pointsMap[todayStr];
          if (!existing || val > existing.val) {
            pointsMap[todayStr] = { val, date: todayStr };
          }
        }
      }
    });

    // Convert map to chronological array
    const chronologicalPoints = Object.entries(pointsMap)
      .map(([date, item]) => ({
        date,
        val: Math.round(item.val * 10) / 10 // rounded to 1 decimal place
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return chronologicalPoints;
  }, [exName, sessionSets, archivedWorkouts]);

  if (trendData.length < 2) {
    // Return subtle minimal indicator if not enough historical data points
    return (
      <div className="flex items-center gap-1.5 opacity-30 select-none">
        <svg width={width} height={height} className="overflow-visible">
          <line 
            x1={0} 
            y1={height / 2} 
            x2={width} 
            y2={height / 2} 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeDasharray="2,2" 
          />
        </svg>
      </div>
    );
  }

  // Calculate coordinates for SVG
  const minVal = Math.min(...trendData.map(d => d.val));
  const maxVal = Math.max(...trendData.map(d => d.val));
  const valRange = maxVal - minVal || 1;

  // Add small padding to top and bottom of sparkline
  const padding = 2;
  const usableHeight = height - padding * 2;

  // Map each data point to svg coordinates
  const coords = trendData.map((d, i) => {
    const x = (i / (trendData.length - 1)) * width;
    // SVG 0,0 is at the top left, so we invert the Y coordinate
    const y = height - padding - ((d.val - minVal) / valRange) * usableHeight;
    return { x, y, val: d.val, date: d.date };
  });

  // Construct SVG Path
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  // Colors: dynamic sparkline color depending on performance trajectory
  const firstVal = trendData[0].val;
  const lastVal = trendData[trendData.length - 1].val;
  const isUpward = lastVal >= firstVal;
  const strokeColor = isUpward ? '#22c55e' : '#f43f5e'; // gym-accent green vs danger red
  const gradientId = `sparkline-grad-${exName.replace(/[^a-zA-Z0-9]/g, '-')}`;

  return (
    <div className="flex items-center gap-2 group/sparkline relative" title={`Est. 1RM progression from ${firstVal}kg to ${lastVal}kg across ${trendData.length} records`}>
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Gradient fill */}
        <path d={areaPath} fill={`url(#${gradientId})`} />

        {/* Line */}
        <path 
          d={linePath} 
          fill="none" 
          stroke={strokeColor} 
          strokeWidth="1.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Pulsing glow endpoint (latest point) */}
        {coords.length > 0 && (
          <>
            <circle 
              cx={coords[coords.length - 1].x} 
              cy={coords[coords.length - 1].y} 
              r="2.5" 
              fill={strokeColor} 
            />
            <circle 
              cx={coords[coords.length - 1].x} 
              cy={coords[coords.length - 1].y} 
              r="4.5" 
              fill="none" 
              stroke={strokeColor} 
              strokeWidth="0.8"
              className="animate-ping opacity-60" 
            />
          </>
        )}
      </svg>
      {/* Absolute micro statistics tag shown on hover */}
      <span className="hidden group-hover/sparkline:inline-flex absolute -bottom-6 right-0 z-50 bg-[#0c0c0c] border border-white/20 px-1.5 py-0.5 rounded-[2px] text-[8px] font-mono font-bold leading-none uppercase tracking-widest text-white/95 whitespace-nowrap shadow-xl">
        {isUpward ? '▲' : '▼'} {Math.round(lastVal - firstVal)}kg Δ ({lastVal}kg)
      </span>
    </div>
  );
}
