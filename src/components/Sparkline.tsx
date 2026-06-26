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

    // Convert map to chronological array
    const chronologicalPoints = Object.entries(pointsMap)
      .map(([date, item]) => ({
        date,
        val: Math.round(item.val * 10) / 10 // rounded to 1 decimal place
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return chronologicalPoints;
  }, [exName, archivedWorkouts]);

  const maxVal = useMemo(() => {
    if (trendData.length === 0) return 0;
    return Math.max(...trendData.map(d => d.val));
  }, [trendData]);

  const isAssisted = exName.trim().toLowerCase().includes("assisted pull");

  // If we have no data points at all
  if (trendData.length === 0) {
    return null;
  }

  // If we only have 1 point, we can't draw a line, but we can display the 1RM value and a subtle placeholder
  if (trendData.length < 2) {
    return (
      <div className="flex items-center gap-2 select-none">
        <svg width={width} height={height} className="overflow-visible opacity-30 shrink-0">
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
        {maxVal > 0 && (
          <span className="text-[10px] font-mono font-bold text-gym-accent bg-gym-accent/5 border border-gym-accent/15 px-1.5 py-0.5 rounded-sm shrink-0">
            Est. 1RM: {maxVal.toFixed(1)}kg
          </span>
        )}
      </div>
    );
  }

  // Calculate coordinates for SVG
  const minVal = Math.min(...trendData.map(d => d.val));
  const maxValActual = Math.max(...trendData.map(d => d.val));
  const valRange = maxValActual - minVal || 1;

  // Add small padding to top and bottom of sparkline
  const padding = 2;
  const usableHeight = height - padding * 2;

  // Map each data point to svg coordinates
  const coords = trendData.map((d, i) => {
    const x = (i / (trendData.length - 1)) * width;
    // SVG 0,0 is at the top left
    // For normal: higher value is better (higher on screen -> smaller Y value in SVG)
    // For assisted: lower value is better (higher on screen -> smaller Y value in SVG)
    const y = isAssisted
      ? padding + ((d.val - minVal) / valRange) * usableHeight
      : height - padding - ((d.val - minVal) / valRange) * usableHeight;
    return { x, y, val: d.val, date: d.date };
  });

  // Construct SVG Path
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  // Colors: dynamic sparkline color depending on performance trajectory
  const firstVal = trendData[0].val;
  const lastVal = trendData[trendData.length - 1].val;
  const isUpward = isAssisted ? lastVal <= firstVal : lastVal >= firstVal;
  const strokeColor = isUpward ? '#22c55e' : '#f43f5e'; // gym-accent green vs danger red
  const gradientId = `sparkline-grad-${exName.replace(/[^a-zA-Z0-9]/g, '-')}`;

  // Delta calculation: for assisted, diff should be inverted so negative delta (strength improved) shows up positive.
  const diffVal = lastVal - firstVal;
  const displayDiff = isAssisted ? -diffVal : diffVal;

  return (
    <div className="flex items-center gap-2 group/sparkline relative shrink-0" title={isAssisted ? `Assisted Pull-up resistance progression from ${firstVal}kg to ${lastVal}kg (lower is stronger) across ${trendData.length} records` : `Est. 1RM progression from ${firstVal}kg to ${lastVal}kg across ${trendData.length} records`}>
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
      {maxVal > 0 && (
        <span className="text-[10px] font-mono font-bold text-gym-accent bg-gym-accent/5 border border-gym-accent/15 px-1.5 py-0.5 rounded-sm select-none shrink-0" title={`Peak Estimated 1-Rep Max: ${maxVal.toFixed(1)}kg`}>
          Est. 1RM: {maxVal.toFixed(1)}kg
        </span>
      )}
      {/* Absolute micro statistics tag shown on hover */}
      <span className="hidden group-hover/sparkline:inline-flex absolute -bottom-6 right-0 z-50 bg-[#0c0c0c] border border-white/20 px-1.5 py-0.5 rounded-[2px] text-[8px] font-mono font-bold leading-none uppercase tracking-widest text-white/95 whitespace-nowrap shadow-xl">
        {isUpward ? '▲' : '▼'} {Math.abs(Math.round(displayDiff))}kg Δ ({lastVal}kg)
      </span>
    </div>
  );
}
