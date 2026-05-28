import React from 'react';
import { motion } from 'motion/react';
import { POOLS } from '../data/exercises';

interface SessionSet {
  id?: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  timestamp?: any;
}

interface AnatomyChartProps {
  sets: SessionSet[];
  archivedWorkouts?: any[];
  compact?: boolean;
}

const AnatomyChart: React.FC<AnatomyChartProps> = ({ sets = [], archivedWorkouts = [], compact = false }) => {
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

  // Helper to parse exercises to muscle groups
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

  // Calculate the 5-day recovery status for each muscle group
  const getMuscleStatuses = () => {
    const groupsToShow = ['chest', 'back', 'shoulders', 'quads', 'hamstrings', 'glutes', 'calves', 'biceps', 'triceps', 'core', 'forearms'];
    const statuses: Record<string, { daysDiff: number; dates: string[]; text: string; fill: string; filterUrl: string }> = {};

    groupsToShow.forEach(group => {
      statuses[group] = {
        daysDiff: 999, // infinite (untouched)
        dates: [],
        text: 'Fully Rested',
        fill: 'rgba(255, 255, 255, 0.25)',
        filterUrl: 'none'
      };
    });

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

  const statuses = getMuscleStatuses();

  const getFill = (group: string) => {
    return statuses[group]?.fill || 'rgba(255, 255, 255, 0.25)';
  };

  const getFilter = (group: string) => {
    return statuses[group]?.filterUrl || 'none';
  };

  const getPulseClass = (group: string) => {
    const state = statuses[group];
    if (!state) return '';
    if (state.daysDiff === 0) {
      return 'pulse-strong';
    } else if (state.daysDiff === 1 || state.daysDiff === 2) {
      return 'pulse-medium';
    } else if (state.daysDiff === 3) {
      return 'pulse-minor';
    }
    return '';
  };

  // Stylized Body Outline (Blocky style from reference image) - extended to cover biceps and forearms
  const bodyOutlinePath = "M100,40 Q110,40 115,50 L115,70 Q130,75 140,90 Q145,110 142,130 Q138,150 134,165 L127,160 Q130,145 130,110 Q125,180 120,250 L130,350 L110,350 L105,260 L95,260 L90,350 L70,350 L80,250 Q75,180 70,110 Q70,145 73,160 L66,165 Q62,150 58,130 Q55,110 60,90 Q70,75 85,70 L85,50 Q90,40 100,40 Z";

  const groupsToShow = ['chest', 'back', 'shoulders', 'quads', 'hamstrings', 'glutes', 'calves', 'biceps', 'triceps', 'core', 'forearms'];

  return (
    <div className={compact ? "grid grid-cols-2 gap-4 py-2 w-full" : "grid grid-cols-1 md:grid-cols-2 gap-12 py-4 w-full"}>
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
        .pulse-minor {
          animation: minor-pulse 2.2s infinite ease-in-out;
        }
        .pulse-medium {
          animation: medium-pulse 1.3s infinite ease-in-out;
        }
        .pulse-strong {
          animation: strong-pulse 0.75s infinite ease-in-out;
        }
      `}} />

      {/* Front View */}
      <div className="flex flex-col items-center">
        <h4 className={compact ? "text-[8px] text-gym-accent font-bold uppercase tracking-[0.2em] mb-2" : "text-[10px] text-gym-accent font-bold uppercase tracking-[0.3em] mb-6"}>Front Evolution Grid</h4>
        <svg viewBox="0 0 200 400" className={compact ? "w-full max-w-[120px] h-auto" : "w-full max-w-[240px] h-auto"}>
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
          </defs>

          {/* Stylized Body Outline - Front */}
          <g fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={compact ? "1" : "1.5"}>
            <path d={bodyOutlinePath} />
          </g>

          {/* Muscle Groups - Front */}
          {/* Shoulders */}
          <path 
            d="M85,75 Q75,75 70,90 L75,105 Q80,105 85,95 Z M115,75 Q125,75 130,90 L125,105 Q120,105 115,95 Z" 
            fill={getFill('shoulders')} 
            filter={getFilter('shoulders')}
            className={`transition-all duration-1000 ${getPulseClass('shoulders')}`}
          />
          {/* Chest */}
          <path 
            d="M88,90 Q100,85 112,90 L115,115 Q100,120 85,115 Z" 
            fill={getFill('chest')} 
            filter={getFilter('chest')}
            className={`transition-all duration-1000 ${getPulseClass('chest')}`}
          />
          {/* Abs (Core) */}
          <path 
            d="M90,125 Q100,122 110,125 L108,185 Q100,188 92,185 Z" 
            fill={getFill('core')} 
            filter={getFilter('core')}
            className={`transition-all duration-1000 ${getPulseClass('core')}`}
          />
          {/* Biceps */}
          <path 
            d="M65,105 Q60,115 62,130 L70,125 Q72,115 70,105 Z M135,105 Q140,115 138,130 L130,125 Q128,115 130,105 Z" 
            fill={getFill('biceps')} 
            filter={getFilter('biceps')}
            className={`transition-all duration-1000 ${getPulseClass('biceps')}`}
          />
          {/* Forearms */}
          <path 
            d="M62,130 Q62,150 66,165 L73,160 Q70,145 70,125 Z M138,130 Q138,150 134,165 L127,160 Q130,145 130,125 Z" 
            fill={getFill('forearms')} 
            filter={getFilter('forearms')}
            className={`transition-all duration-1000 ${getPulseClass('forearms')}`}
          />
          {/* Quads (Upper Legs) */}
          <path 
            d="M82,200 Q90,195 98,200 L95,255 L85,255 Z M102,200 Q110,195 118,200 L115,255 L105,255 Z" 
            fill={getFill('quads')} 
            filter={getFilter('quads')}
            className={`transition-all duration-1000 ${getPulseClass('quads')}`}
          />
          {/* Calves (Lower Legs) */}
          <path 
            d="M84,265 L92,265 L88,330 L80,330 Z M116,265 L108,265 L112,330 L120,330 Z" 
            fill={getFill('calves')} 
            filter={getFilter('calves')}
            className={`transition-all duration-1000 ${getPulseClass('calves')}`}
          />
        </svg>
      </div>

      {/* Back View */}
      <div className="flex flex-col items-center">
        <h4 className={compact ? "text-[8px] text-gym-accent font-bold uppercase tracking-[0.2em] mb-2" : "text-[10px] text-gym-accent font-bold uppercase tracking-[0.3em] mb-6"}>Rear Evolution Grid</h4>
        <svg viewBox="0 0 200 400" className={compact ? "w-full max-w-[120px] h-auto" : "w-full max-w-[240px] h-auto"}>
          {/* Stylized Body Outline - Back */}
          <g fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={compact ? "1" : "1.5"}>
            <path d={bodyOutlinePath} />
          </g>

          {/* Muscle Groups - Back */}
          {/* Upper/Mid Back */}
          <path 
            d="M85,85 Q100,75 115,85 L120,135 Q100,145 80,135 Z" 
            fill={getFill('back')} 
            filter={getFilter('back')}
            className={`transition-all duration-1000 ${getPulseClass('back')}`}
          />
          {/* Middle/Lower Back */}
          <path 
            d="M90,140 Q100,145 110,140 L115,180 Q100,185 85,180 Z" 
            fill={getFill('back')} 
            filter={getFilter('back')}
            className={`transition-all duration-1000 opacity-100 ${getPulseClass('back')}`}
          />
          {/* Shoulders */}
          <path 
            d="M85,75 Q75,75 70,90 L75,105 Q80,105 85,95 Z M115,75 Q125,75 130,90 L125,105 Q120,105 115,95 Z" 
            fill={getFill('shoulders')} 
            filter={getFilter('shoulders')}
            className={`transition-all duration-1000 ${getPulseClass('shoulders')}`}
          />
          {/* Triceps */}
          <path 
            d="M62,105 Q58,115 60,130 L68,135 Q70,120 68,105 Z M138,105 Q142,115 140,130 L132,135 Q130,120 132,105 Z" 
            fill={getFill('triceps')} 
            filter={getFilter('triceps')}
            className={`transition-all duration-1000 ${getPulseClass('triceps')}`}
          />
          {/* Forearms */}
          <path 
            d="M60,130 Q60,150 64,165 L71,160 Q68,145 68,135 Z M140,130 Q140,150 136,165 L129,160 Q132,145 132,135 Z" 
            fill={getFill('forearms')} 
            filter={getFilter('forearms')}
            className={`transition-all duration-1000 ${getPulseClass('forearms')}`}
          />
          {/* Glutes */}
          <path 
            d="M82,185 C75,185 75,220 82,225 C90,225 100,215 100,215 C100,215 110,225 118,225 C125,220 125,185 118,185 C110,185 100,195 100,195 C100,195 90,185 82,185 Z" 
            fill={getFill('glutes')} 
            filter={getFilter('glutes')}
            className={`transition-all duration-1000 ${getPulseClass('glutes')}`}
          />
          {/* Hamstrings */}
          <path 
            d="M82,225 L95,225 L92,265 L84,265 Z M118,225 L105,225 L108,265 L116,265 Z" 
            fill={getFill('hamstrings')} 
            filter={getFilter('hamstrings')}
            className={`transition-all duration-1000 ${getPulseClass('hamstrings')}`}
          />
          {/* Calves (Lower Legs) */}
          <path 
            d="M84,265 L92,265 L88,335 L78,335 Z M116,265 L108,265 L112,335 L122,335 Z" 
            fill={getFill('calves')} 
            filter={getFilter('calves')}
            className={`transition-all duration-1000 ${getPulseClass('calves')}`}
          />
        </svg>
      </div>

      {/* Legend & Details Block */}
      {!compact && (
        <div className="md:col-span-2 mt-4 space-y-6">
          {/* Modern Interactive Glossary */}
          <div className="bg-[#050505] border border-white/5 rounded-sm p-5 space-y-4">
            <h5 className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] font-mono">Real-time Recovery Legend</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="flex items-start gap-2.5 p-2 bg-red-950/20 border border-red-500/20 rounded-sm">
                <span className="w-2 h-2 rounded-full bg-[#ef4444] shadow-[0_0_8px_#ef4444] mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-bold uppercase tracking-wider text-[10px]">Active Today</div>
                  <div className="text-white/40 text-[9px] mt-0.5 uppercase">Peak fatigue / Peak engagement</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 bg-orange-950/20 border border-orange-500/20 rounded-sm">
                <span className="w-2 h-2 rounded-full bg-[#f97316] shadow-[0_0_8px_#f97316] mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-bold uppercase tracking-wider text-[10px]">Fatigued (D1-D2)</div>
                  <div className="text-white/40 text-[9px] mt-0.5 uppercase">Muscular breakdown & Repair</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 bg-green-950/20 border border-green-500/20 rounded-sm">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e] mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-bold uppercase tracking-wider text-[10px]">Ready (D3)</div>
                  <div className="text-white/40 text-[9px] mt-0.5 uppercase">Optimal supercompensation window</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 bg-zinc-950/80 border border-white/5 rounded-sm">
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
                <div key={group} className="bg-zinc-950/70 border border-white/10 p-4 rounded-sm flex flex-col justify-between backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                    <span className="text-[10px] text-white font-black uppercase tracking-widest font-mono">
                      {group === 'core' ? 'abs/core' : group}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider text-[10px]" style={{ color: info.fill, backgroundColor: `${info.fill}10` }}>
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
                            className={`h-4 border rounded-sm transition-all duration-500 relative flex items-center justify-center`}
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
