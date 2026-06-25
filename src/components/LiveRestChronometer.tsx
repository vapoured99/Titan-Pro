import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Play, Pause, RotateCcw, AlertCircle, Volume2, VolumeX, Zap, Info } from "lucide-react";

interface SessionSet {
  id?: string;
  exerciseName: string;
  weight: number | string;
  reps: number | string;
  timestamp?: any;
  date?: string;
  difficulty?: number;
}

interface LiveRestChronometerProps {
  sessionSets: SessionSet[];
  historicalAvgRest?: number;
}

export const LiveRestChronometer: React.FC<LiveRestChronometerProps> = ({
  sessionSets = [],
  historicalAvgRest = 90,
}) => {
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [targetRest, setTargetRest] = useState<number>(historicalAvgRest || 90);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  
  // Manual Timer State
  const [manualTime, setManualTime] = useState<number>(90);
  const [manualActive, setManualActive] = useState<boolean>(false);
  const [manualTarget, setManualTarget] = useState<number>(90);

  // Auto Tracker State (seconds elapsed since last set)
  const [autoSeconds, setAutoSeconds] = useState<number>(0);
  const [lastSetLogged, setLastSetLogged] = useState<SessionSet | null>(null);

  const prevSetsLengthRef = useRef(sessionSets.length);

  // Sound generator
  const playBeep = (frequency = 880, duration = 0.15) => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context not allowed or supported yet.", e);
    }
  };

  // Helper to extract timestamp
  const getSetTimestamp = (set: SessionSet) => {
    if (set.timestamp) {
      if (typeof set.timestamp.toMillis === "function") return set.timestamp.toMillis();
      if (set.timestamp.seconds) return set.timestamp.seconds * 1000;
    }
    if (set.date) {
      const parsed = Date.parse(set.date);
      if (!isNaN(parsed)) return parsed;
    }
    return Date.now();
  };

  // Get last set logged
  const sortedSets = [...sessionSets].sort((a, b) => getSetTimestamp(a) - getSetTimestamp(b));
  const latestSet = sortedSets.length > 0 ? sortedSets[sortedSets.length - 1] : null;

  // Track sets length to sound beep on a new set log and auto-reset rest timer
  useEffect(() => {
    if (sessionSets.length > prevSetsLengthRef.current) {
      // New set logged!
      playBeep(1200, 0.1); // high frequency positive chime
      setAutoSeconds(0);
      if (mode === "manual") {
        setManualActive(false);
        setManualTime(manualTarget);
      }
    }
    prevSetsLengthRef.current = sessionSets.length;
  }, [sessionSets.length]);

  // Sync automatic ticker since last set
  useEffect(() => {
    if (latestSet) {
      setLastSetLogged(latestSet);
      
      const updateAutoSeconds = () => {
        const lastTs = getSetTimestamp(latestSet);
        const diff = Math.max(0, Math.floor((Date.now() - lastTs) / 1000));
        setAutoSeconds(diff);

        // Sound chime right at target rest threshold
        if (diff === targetRest) {
          playBeep(660, 0.3); // Double chime
          setTimeout(() => playBeep(880, 0.2), 150);
        }
      };

      updateAutoSeconds();
      const interval = setInterval(updateAutoSeconds, 1000);
      return () => clearInterval(interval);
    } else {
      setLastSetLogged(null);
      setAutoSeconds(0);
    }
  }, [latestSet, targetRest]);

  // Manual timer ticker
  useEffect(() => {
    let timer: any = null;
    if (manualActive && manualTime > 0) {
      timer = setInterval(() => {
        setManualTime((prev) => {
          if (prev <= 1) {
            setManualActive(false);
            playBeep(523.25, 0.3); // C5 alert
            setTimeout(() => playBeep(659.25, 0.2), 150); // E5
            setTimeout(() => playBeep(783.99, 0.4), 300); // G5
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [manualActive, manualTime]);

  const formatTimerValue = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Circular progress calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  
  // Progress ratio
  const activeElapsed = mode === "auto" ? autoSeconds : (manualTarget - manualTime);
  const activeTarget = mode === "auto" ? targetRest : manualTarget;
  const rawProgress = activeTarget > 0 ? activeElapsed / activeTarget : 0;
  const strokeDashoffset = circumference - Math.min(1.0, rawProgress) * circumference;

  const handleManualPreset = (seconds: number) => {
    setManualTarget(seconds);
    setManualTime(seconds);
    setManualActive(true);
    playBeep(880, 0.08);
  };

  const isOverresting = mode === "auto" && autoSeconds > targetRest;

  return (
    <div className="bg-black/70 border border-white/10 rounded-sm p-5 flex flex-col justify-between h-full min-h-[380px] backdrop-blur-md relative overflow-hidden group hover:border-gym-accent/30 transition-all duration-300">
      {/* Visual cyber lines */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-gym-accent/50 transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-gym-accent/50 transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-gym-accent/50 transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-gym-accent/50 transition-colors" />

      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-[10px] text-white uppercase font-black tracking-widest mb-1 font-mono flex items-center gap-1.5">
            <Clock className={`w-3.5 h-3.5 ${isOverresting ? "text-red-400 animate-pulse" : "text-gym-accent"}`} />
            Interval Chronometer
          </h4>
          <p className="text-xs text-white/50 font-mono font-bold tracking-tight uppercase">
            {mode === "auto" ? "Biometric Rest Tracker" : "Tactical Timer Preset"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-1.5 rounded bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer ${audioEnabled ? "text-gym-accent" : "text-white/30"}`}
            title={audioEnabled ? "Mute alert chimes" : "Unmute alert chimes"}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Mode switch */}
          <div className="flex bg-white/5 border border-white/10 rounded p-0.5 font-mono text-[8px] font-black tracking-wider">
            <button
              onClick={() => setMode("auto")}
              className={`px-2 py-1 rounded-sm uppercase transition-all cursor-pointer ${mode === "auto" ? "bg-gym-accent text-black font-black" : "text-white/55 hover:text-white"}`}
            >
              AUTO
            </button>
            <button
              onClick={() => setMode("manual")}
              className={`px-2 py-1 rounded-sm uppercase transition-all cursor-pointer ${mode === "manual" ? "bg-gym-accent text-black font-black" : "text-white/55 hover:text-white"}`}
            >
              MANUAL
            </button>
          </div>
        </div>
      </div>

      {/* Main Clock Face & Progress Circle */}
      <div className="flex-1 flex flex-col items-center justify-center my-2 relative">
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Dynamic pulsing background under-shadow */}
          <div className={`absolute inset-4 rounded-full blur-2xl opacity-20 transition-all duration-700 ${
            isOverresting ? "bg-red-500" :
            (mode === "manual" && manualActive) ? "bg-cyan-500" : "bg-gym-accent"
          }`} />

          {/* SVG Progress Ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 144 144">
            {/* Background Track Circle */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="stroke-white/5 fill-none"
              strokeWidth="5"
            />
            {/* Glowing Active Ring */}
            <motion.circle
              cx="72"
              cy="72"
              r={radius}
              className={`fill-none transition-colors duration-300 ${
                isOverresting ? "stroke-red-500" :
                (mode === "manual" && manualActive) ? "stroke-cyan-400" : "stroke-gym-accent"
              }`}
              strokeWidth="6"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ ease: "linear", duration: 0.1 }}
              strokeLinecap="round"
              style={{
                filter: isOverresting 
                  ? "drop-shadow(0 0 4px rgba(239, 68, 68, 0.4))"
                  : "drop-shadow(0 0 4px rgba(163, 230, 53, 0.4))"
              }}
            />
          </svg>

          {/* Core Chronometer Typography */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait">
              {mode === "auto" ? (
                <motion.div
                  key="auto-time"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center"
                >
                  <span className={`text-3xl font-black font-mono tracking-tighter tabular-nums leading-none ${
                    isOverresting ? "text-red-400 animate-pulse" : "text-white"
                  }`}>
                    {formatTimerValue(autoSeconds)}
                  </span>
                  <span className={`text-[8px] font-mono font-bold uppercase tracking-widest mt-1 ${isOverresting ? "text-red-400" : "text-white/40"}`}>
                    {isOverresting ? "Over-resting" : "Rest Pace"}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="manual-time"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-3xl font-black font-mono tracking-tighter tabular-nums leading-none text-white">
                    {formatTimerValue(manualTime)}
                  </span>
                  <span className="text-[8px] font-mono font-bold text-white/40 uppercase tracking-widest mt-1">
                    {manualActive ? "COUNTDOWN" : "STANDBY"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Dynamic Warning Banner / Helper text under circular ring */}
        <div className="h-6 mt-1 flex items-center justify-center">
          {mode === "auto" ? (
            lastSetLogged ? (
              <div className="text-[9px] font-mono text-white/60 uppercase tracking-wider flex items-center gap-1">
                <span className="text-white/30">Target Rest:</span>
                <span className="font-black text-gym-accent">{formatTimerValue(targetRest)}</span>
              </div>
            ) : (
              <span className="text-[8px] font-mono text-white/30 uppercase italic flex items-center gap-1.5">
                <Info className="w-3 h-3 text-white/20" /> No active sets recorded in this session
              </span>
            )
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setManualActive(!manualActive)}
                className={`p-1 px-3 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all border cursor-pointer ${
                  manualActive 
                    ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20" 
                    : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                }`}
              >
                {manualActive ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                {manualActive ? "Pause" : "Start"}
              </button>
              <button
                onClick={() => { setManualTime(manualTarget); setManualActive(false); playBeep(440, 0.08); }}
                className="p-1 px-2.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                title="Reset manual countdown"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Controls / Customizations */}
      <div className="pt-3 border-t border-white/5 flex flex-col gap-2.5">
        {mode === "auto" ? (
          <>
            {/* Quick target rest editor buttons */}
            <div className="flex flex-col gap-1">
              <span className="text-[7px] font-mono uppercase tracking-widest text-white/30 font-bold">Adjust Active Rest Target:</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[45, 60, 90, 120].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => { setTargetRest(sec); playBeep(980, 0.05); }}
                    className={`py-1 text-[9px] font-mono font-bold rounded border transition-all cursor-pointer ${
                      targetRest === sec 
                        ? "bg-gym-accent border-gym-accent text-black font-black" 
                        : "bg-white/[0.02] border-white/5 text-white/60 hover:border-white/15 hover:text-white"
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Micro details of last set to show context */}
            {lastSetLogged && (
              <div className="text-[8px] font-mono text-white/40 bg-white/[0.01] border border-white/5 rounded px-2 py-1 flex items-center justify-between">
                <span className="truncate max-w-[120px] font-semibold text-white/60">
                  ⚡ LAST: {lastSetLogged.exerciseName}
                </span>
                <span className="shrink-0 font-bold text-gym-accent">
                  {lastSetLogged.weight}kg × {lastSetLogged.reps} rep
                </span>
              </div>
            )}
          </>
        ) : (
          /* Manual Presets Selection */
          <div className="flex flex-col gap-1.5">
            <span className="text-[7px] font-mono uppercase tracking-widest text-white/30 font-bold">Select Timer Countdown:</span>
            <div className="grid grid-cols-5 gap-1.5 font-mono text-[9px] font-bold">
              {[30, 60, 90, 120, 180].map((sec) => (
                <button
                  key={sec}
                  onClick={() => handleManualPreset(sec)}
                  className={`py-1 rounded border transition-all cursor-pointer ${
                    manualTarget === sec 
                      ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400" 
                      : "bg-white/[0.02] border-white/5 text-white/60 hover:border-white/15"
                  }`}
                >
                  {sec === 180 ? "3m" : `${sec}s`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
