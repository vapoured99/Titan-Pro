import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Flame, TrendingUp, CheckCircle2, Sparkles, Clock, ChevronRight, Activity } from 'lucide-react';

interface Workout {
  id: string;
  name?: string;
  date: string; // "YYYY-MM-DD"
  totalVolume?: number;
  sets?: any[];
  timestamp?: any;
}

interface WorkoutCalendarHeatmapProps {
  archivedWorkouts?: Workout[];
  activeTheme: {
    accent: string;
    accentLight: string;
    accentDark: string;
    accentRgb: string;
    bg: string;
    id: string;
  };
}

export default function WorkoutCalendarHeatmap({
  archivedWorkouts = [],
  activeTheme
}: WorkoutCalendarHeatmapProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 1. Get dates for the past 3 months (Current month, Month - 1, Month - 2)
  const calendarMonths = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth(); // 0-indexed
      
      // Get name of the month
      const monthName = d.toLocaleDateString('en-GB', { month: 'long' });
      
      // Get first day of the month (Monday-Sunday index: 0-6 where Mon=0, Sun=6)
      // JS getDay(): 0 = Sunday, 1 = Monday, ... 6 = Saturday
      const firstDayRaw = new Date(year, month, 1).getDay();
      const firstDayOffset = firstDayRaw === 0 ? 6 : firstDayRaw - 1; // Align to Mon=0, Sun=6
      
      // Get number of days in the month
      const totalDays = new Date(year, month + 1, 0).getDate();
      
      months.push({
        year,
        month,
        monthName,
        firstDayOffset,
        totalDays
      });
    }
    
    return months;
  }, []);

  // 2. Map of "YYYY-MM-DD" -> list of workouts Completed on that day
  const workoutsByDateMap = useMemo(() => {
    const map: Record<string, Workout[]> = {};
    
    archivedWorkouts.forEach((w) => {
      if (!w.date) return;
      // Extract clean date string in case of extra whitespace
      const cleanDate = w.date.trim();
      if (!map[cleanDate]) {
        map[cleanDate] = [];
      }
      map[cleanDate].push(w);
    });
    
    return map;
  }, [archivedWorkouts]);

  // 3. Filtering workouts targeting the past 3 months only for statistical compilation
  const stats = useMemo(() => {
    const now = new Date();
    // Start of 2 months ago (which translates to the first day of the 3-month range)
    const startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const startDateStr = startDate.toISOString().split('T')[0];
    
    const threeMonthsWorkouts = archivedWorkouts.filter(w => {
      return w.date && w.date >= startDateStr && w.date <= now.toISOString().split('T')[0];
    });

    const totalWorkouts = threeMonthsWorkouts.length;

    // Calculate Workout Days Consistency
    // Total days in the 3 months up to today
    const msDiff = now.getTime() - startDate.getTime();
    const totalDaysInRange = Math.max(1, Math.ceil(msDiff / (1000 * 60 * 60 * 24)));
    const uniqueDaysWorkedOut = Object.keys(workoutsByDateMap).filter(d => {
      return d && d >= startDateStr && d <= now.toISOString().split('T')[0];
    }).length;
    
    const consistencyPercent = Math.round((uniqueDaysWorkedOut / totalDaysInRange) * 100);

    // Calculate streaks
    // Sort all unique workout dates chronologically
    const allWorkoutDates = Object.keys(workoutsByDateMap)
      .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    let currentStreak = 0;
    
    if (allWorkoutDates.length > 0) {
      const todayStr = now.toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      const setOfDates = new Set(allWorkoutDates);
      let tempDate = now;
      let checkStr = todayStr;
      
      // If no workout today, check starting from yesterday
      if (!setOfDates.has(todayStr)) {
        tempDate = yesterday;
        checkStr = yesterdayStr;
      }
      
      if (setOfDates.has(checkStr)) {
        while (setOfDates.has(checkStr)) {
          currentStreak++;
          tempDate.setDate(tempDate.getDate() - 1);
          checkStr = tempDate.toISOString().split('T')[0];
        }
      }
    }

    // Most active day of the week (Mon-Sun)
    const dayOfWeekCounts = [0, 0, 0, 0, 0, 0, 0]; // Mon to Sun
    threeMonthsWorkouts.forEach(w => {
      const d = new Date(w.date);
      const dayRaw = d.getDay(); // 0 = Sun, 1 = Mon...
      const dayOffset = dayRaw === 0 ? 6 : dayRaw - 1; // Mon=0, Sun=6
      if (dayOffset >= 0 && dayOffset < 7) {
        dayOfWeekCounts[dayOffset]++;
      }
    });

    const daysLabel = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let maxIdx = 0;
    let maxCount = 0;
    dayOfWeekCounts.forEach((cnt, idx) => {
      if (cnt > maxCount) {
        maxCount = cnt;
        maxIdx = idx;
      }
    });

    const peakDayName = maxCount > 0 ? daysLabel[maxIdx] : 'None';

    return {
      totalWorkouts,
      consistencyPercent,
      currentStreak,
      peakDayName,
      maxCount
    };
  }, [archivedWorkouts, workoutsByDateMap]);

  // Handler for clearing the selected date breakdown
  const handleCellClick = (dateStr: string, hasWorkouts: boolean) => {
    if (selectedDate === dateStr) {
      setSelectedDate(null);
    } else {
      setSelectedDate(dateStr);
    }
  };

  // Helper to format date label
  const formatFullDate = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // List of workouts matching current chosen date
  const selectedDateWorkouts = selectedDate ? workoutsByDateMap[selectedDate] || [] : [];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. Header and Micro Analytics Ribbell Blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat block 1 */}
        <div className="bg-white/[0.015] border border-white/5 rounded-sm p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gym-accent/10 border border-gym-accent/20 flex items-center justify-center text-gym-accent shrink-0">
            <CheckCircle2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="block text-[8px] font-mono font-bold tracking-widest text-white/30 uppercase">TOTAL WORKOUTS</span>
            <span className="text-sm font-sans font-black text-white">{stats.totalWorkouts} SECURED</span>
          </div>
        </div>

        {/* Stat block 2 */}
        <div className="bg-white/[0.015] border border-white/5 rounded-sm p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gym-accent/10 border border-gym-accent/20 flex items-center justify-center text-gym-accent shrink-0">
            <Flame className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="block text-[8px] font-mono font-bold tracking-widest text-white/30 uppercase">CURRENT STREAK</span>
            <span className="text-sm font-sans font-black text-white">{stats.currentStreak} DAYS</span>
          </div>
        </div>

        {/* Stat block 3 */}
        <div className="bg-white/[0.015] border border-white/5 rounded-sm p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gym-accent/10 border border-gym-accent/20 flex items-center justify-center text-gym-accent shrink-0">
            <TrendingUp className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="block text-[8px] font-mono font-bold tracking-widest text-white/30 uppercase">CONSISTENCY</span>
            <span className="text-sm font-sans font-black text-white">{stats.consistencyPercent}% OF DAYS</span>
          </div>
        </div>

        {/* Stat block 4 */}
        <div className="bg-white/[0.015] border border-white/5 rounded-sm p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gym-accent/10 border border-gym-accent/20 flex items-center justify-center text-gym-accent shrink-0">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="block text-[8px] font-mono font-bold tracking-widest text-white/30 uppercase">PEAK FORCE DAY</span>
            <span className="text-sm font-sans font-black text-white">{stats.peakDayName}</span>
          </div>
        </div>
      </div>

      {/* 2. Heatmap Legend Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[9px] font-mono font-bold text-white/40 border-b border-white/5 pb-4">
        <span className="uppercase tracking-widest flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-gym-accent" />
          PAST 3 MONTHS LOAD INTEGRATION CHRONOLOGY
        </span>
        <div className="flex items-center gap-2">
          <span>LESS ACTIVITY</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm bg-white/[0.02] border border-white/5" title="0 Workouts" />
            <div className="w-4 h-4 rounded-sm border" style={{ backgroundColor: `rgba(var(--gym-accent-rgb), 0.22)`, borderColor: `rgba(var(--gym-accent-rgb), 0.3)` }} title="1 Workout" />
            <div className="w-4 h-4 rounded-sm border" style={{ backgroundColor: `rgba(var(--gym-accent-rgb), 0.55)`, borderColor: `rgba(var(--gym-accent-rgb), 0.6)` }} title="2 Workouts" />
            <div className="w-4 h-4 rounded-sm border" style={{ backgroundColor: `var(--gym-accent)`, borderColor: `var(--gym-accent)` }} title="3+ Workouts" />
          </div>
          <span>MORE INTENSITY</span>
        </div>
      </div>

      {/* 3. Monthly Heatmap Calendars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {calendarMonths.map((mObj, mIdx) => {
          return (
            <div key={`${mObj.year}-${mObj.month}`} className="border border-white/5 bg-white/[0.01] rounded-sm p-5 relative overflow-hidden">
              {/* Background Month Watermark */}
              <div className="absolute right-2 top-2 select-none opacity-[0.02] text-5xl font-black font-sans leading-none pointer-events-none">
                {(mObj.month + 1).toString().padStart(2, '0')}
              </div>

              {/* Month Header */}
              <div className="mb-4">
                <span className="text-xs font-serif font-light italic text-white flex items-center gap-1.5 uppercase tracking-widest break-all">
                  {mObj.monthName}
                  <span className="text-[9px] font-mono font-black text-gym-accent/60 opacity-80 not-italic ml-1">
                    {mObj.year}
                  </span>
                </span>
                <span className="block text-[8px] font-mono text-white/20 tracking-wider uppercase mt-0.5">LOAD MAP STAGE_0{mIdx + 1}</span>
              </div>

              {/* Days Grid Headers (Mon to Sun) */}
              <div className="grid grid-cols-7 gap-1 text-[8.5px] font-mono font-bold text-white/30 text-center mb-2">
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
                <span>S</span>
              </div>

              {/* Days Tiles */}
              <div className="grid grid-cols-7 gap-1.5">
                {/* 1. Blank leading squares */}
                {Array.from({ length: mObj.firstDayOffset }).map((_, emptyIdx) => (
                  <div key={`empty-${emptyIdx}`} className="aspect-square bg-transparent pointer-events-none border border-transparent" />
                ))}

                {/* 2. Active month days */}
                {Array.from({ length: mObj.totalDays }).map((_, dayIdx) => {
                  const dayNum = dayIdx + 1;
                  // Construct formatted date string : YYYY-MM-DD
                  const padM = (mObj.month + 1).toString().padStart(2, '0');
                  const padD = dayNum.toString().padStart(2, '0');
                  const dateStr = `${mObj.year}-${padM}-${padD}`;
                  
                  const dayWorkouts = workoutsByDateMap[dateStr] || [];
                  const count = dayWorkouts.length;
                  const isDaySelected = selectedDate === dateStr;

                  // Determine styled variables adapted to the current theme
                  let tileStyle: React.CSSProperties = {
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderColor: 'rgba(255, 255, 255, 0.05)',
                  };
                  let textClass = 'text-white/40 hover:text-white/80';

                  if (count === 1) {
                    tileStyle = {
                      backgroundColor: `rgba(var(--gym-accent-rgb), 0.22)`,
                      borderColor: `rgba(var(--gym-accent-rgb), 0.35)`,
                    };
                    textClass = 'text-white font-bold';
                  } else if (count === 2) {
                    tileStyle = {
                      backgroundColor: `rgba(var(--gym-accent-rgb), 0.55)`,
                      borderColor: `rgba(var(--gym-accent-rgb), 0.65)`,
                    };
                    textClass = 'text-black font-black';
                  } else if (count >= 3) {
                    tileStyle = {
                      backgroundColor: `var(--gym-accent)`,
                      borderColor: `var(--gym-accent)`,
                    };
                    textClass = 'text-black font-black';
                  }

                  const tooltipText = `${dayNum} ${mObj.monthName}: ${count} workout${count !== 1 ? 's' : ''} completed`;

                  return (
                    <button
                      key={`day-${dayNum}`}
                      onClick={() => handleCellClick(dateStr, count > 0)}
                      className={`aspect-square flex items-center justify-center rounded-sm text-[9px] font-mono border transition-all cursor-pointer relative select-none hover:scale-110 hover:z-10 focus:outline-none ${textClass} ${
                        isDaySelected ? 'ring-2 ring-white scale-105 z-10 shadow-lg' : ''
                      }`}
                      style={tileStyle}
                      title={tooltipText}
                    >
                      {dayNum}
                      {/* Interactive indicator dot if selected and has workout */}
                      {count > 0 && (
                        <span className={`absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full ${count >= 2 ? 'bg-black/70' : 'bg-gym-accent'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Interactive Drawer / Selected Date Workout Details */}
      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.25 }}
            className="border border-white/10 rounded-sm bg-black/60 p-6 backdrop-blur-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5 mb-4">
              <div>
                <span className="text-[9px] font-mono text-gym-accent tracking-widest font-bold uppercase block">CHRONO EVENT TARGET DETAIL</span>
                <h4 className="text-sm font-sans font-black text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gym-accent" />
                  {formatFullDate(selectedDate)}
                </h4>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="self-start sm:self-center px-3 py-1 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-sm text-[8px] font-mono tracking-widest uppercase text-white/60 hover:text-white cursor-pointer transition-all active:scale-95"
              >
                CLOSE ANALYSIS
              </button>
            </div>

            {selectedDateWorkouts.length === 0 ? (
              <div className="py-8 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-sm flex flex-col items-center justify-center">
                <Activity className="w-8 h-8 text-white/10 mb-1.5 animate-pulse" />
                <p className="text-white/20 font-bold text-xs">No entries archived on this date.</p>
                <p className="text-[10px] text-white/15 uppercase tracking-widest mt-0.5">System standing: inactive</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedDateWorkouts.map((w) => {
                  return (
                    <div key={w.id} className="border border-white/10 rounded-sm p-4 bg-white/[0.015] hover:border-gym-accent/30 hover:bg-white/[0.03] transition-all flex flex-col justify-between">
                      <div>
                        {/* Title Row */}
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <span className="text-xs font-mono font-black text-white tracking-wide uppercase truncate">
                            {w.name || "UNNAMED FORCE ROUTINE"}
                          </span>
                          <span className="shrink-0 bg-gym-accent/10 border border-gym-accent/20 text-gym-accent rounded-[2px] px-1.5 py-0.5 text-[8.5px] font-black tracking-widest uppercase">
                            COMPLETED
                          </span>
                        </div>

                        {/* Stats Summary */}
                        <div className="flex gap-4 text-[9px] font-mono text-white/55 tracking-wider mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gym-accent/50" />
                            {w.sets?.length || 0} Sets Loaded
                          </span>
                          <span>|</span>
                          <span className="flex items-center gap-1 font-bold text-white/80">
                            Volume: {w.totalVolume || 0} kg
                          </span>
                        </div>

                        {/* Exercise Sets Breakdowns List */}
                        {w.sets && w.sets.length > 0 ? (
                          <div className="max-h-36 overflow-y-auto divide-y divide-white/5 pr-1 py-1 bg-black/30 rounded border border-white/5 px-2">
                            {(() => {
                              // Group sets by exerciseName
                              const grouped: Record<string, typeof w.sets> = {};
                              w.sets.forEach((s: any) => {
                                const exName = s.exerciseName || "Exercise";
                                if (!grouped[exName]) grouped[exName] = [];
                                grouped[exName].push(s);
                              });
                              
                              return Object.entries(grouped).map(([ex, sets]) => (
                                <div key={ex} className="py-2 first:pt-1 last:pb-1">
                                  <div className="text-[9.5px] font-bold text-white uppercase tracking-wider mb-1">
                                    {ex}
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {sets.map((s, sIdx) => (
                                      <span key={sIdx} className="text-[8.5px] font-mono bg-white/[0.04] border border-white/5 rounded px-1.5 py-0.5 text-white/60">
                                        R{sIdx+1}: {s.weight || 0}kg x {s.reps || 0}
                                        {s.isWarmup ? ' (W)' : ''}
                                        {s.isDropset ? ' (D)' : ''}
                                        {s.isFailure ? ' (F)' : ''}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ));
                            })()}
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-4 flex items-center justify-between text-[8px] font-mono border-t border-white/5 pt-2">
                        <span className="text-white/20 uppercase tracking-widest">RECORD_UID: {w.id.substring(0, 10)}...</span>
                        <span className="text-gym-accent flex items-center gap-0.5 font-bold">
                          DETAILS <ChevronRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
