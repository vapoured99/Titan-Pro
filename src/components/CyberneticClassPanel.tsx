import React, { useMemo } from "react";
import { motion } from "motion/react";
import {
  ShieldAlert,
  Cpu,
  Tv,
  Sword,
  Shield,
  Zap,
  Target,
  Dumbbell,
  Unlock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface CyberneticClassPanelProps {
  sex: "male" | "female";
  localBodyweight: number;
  actualBenchMax: number;
  actualSquatMax: number;
  actualDeadliftMax: number;
  actualOhpMax: number;
}

export const CyberneticClassPanel: React.FC<CyberneticClassPanelProps> = ({
  sex,
  localBodyweight,
  actualBenchMax,
  actualSquatMax,
  actualDeadliftMax,
  actualOhpMax,
}) => {
  const isFemale = sex === "female";
  const weight = localBodyweight || 80;

  // Ratios for each compound
  const benchRatio = actualBenchMax / weight;
  const squatRatio = actualSquatMax / weight;
  const deadliftRatio = actualDeadliftMax / weight;
  const ohpRatio = actualOhpMax / weight;

  const totalRatio = benchRatio + squatRatio + deadliftRatio + ohpRatio;

  // Let's establish classes with corresponding thresholds and descriptions
  const CLASS_CONFIG = useMemo(() => {
    return [
      {
        id: 1,
        name: "Standard Carbon Frame",
        codename: "CARBON-GEN-1",
        color: "text-zinc-400",
        borderColor: "border-zinc-500/20",
        bgGlow: "rgba(113, 113, 122, 0.08)",
        textColor: "#a1a1aa",
        desc: "Baseline biological platform. Undergoes unreinforced soft-tissue flexion. Subject to high mechanical stress under heavy compounds.",
        specs: {
          skeletal: "Standard Calcium Matrix",
          muscular: "Standard Organic Type-I Fast Twitch",
          synapses: "Conventional Bio-Neuron Recruiter",
        },
        threshold: 0,
        targets: isFemale
          ? { bench: 0.45, squat: 0.65, deadlift: 0.8, ohp: 0.3 }
          : { bench: 0.75, squat: 1.0, deadlift: 1.2, ohp: 0.5 },
      },
      {
        id: 2,
        name: "Reinforced Alloy Shell",
        codename: "CHROMIUM-SHELL-V2",
        color: "text-blue-400",
        borderColor: "border-blue-500/20",
        bgGlow: "rgba(59, 130, 246, 0.08)",
        textColor: "#60a5fa",
        desc: "Micro-fracture treated bone architecture bonded with high-tensile carbon ligaments. Spinal columns stabilized with alloy mesh wraps.",
        specs: {
          skeletal: "Carbon-Infused Sintered Alloy",
          muscular: "Hyper-trophic Redirection Polymers",
          synapses: "Coaxially Screened Neural Pathways",
        },
        threshold: isFemale ? 2.2 : 3.45,
        targets: isFemale
          ? { bench: 0.65, squat: 1.0, deadlift: 1.2, ohp: 0.45 }
          : { bench: 1.1, squat: 1.5, deadlift: 1.75, ohp: 0.75 },
      },
      {
        id: 3,
        name: "Titanium Exochassis",
        codename: "TITAN-EXO-CLASS-3",
        color: "text-amber-500",
        borderColor: "border-amber-500/20",
        bgGlow: "rgba(245, 158, 11, 0.08)",
        textColor: "#f59e0b",
        desc: "Biomimetic titanium bone plating with integrated heavy-load socket couplers. Stabilizers redirect spinal load pressures seamlessly.",
        specs: {
          skeletal: "Sub-dermal Titanium Gr-5 plating",
          muscular: "Pneumatic-Assist Muscle Bundle wraps",
          synapses: "High-Frequency Neuro-Link Shunts",
        },
        threshold: isFemale ? 3.3 : 5.1,
        targets: isFemale
          ? { bench: 0.85, squat: 1.4, deadlift: 1.6, ohp: 0.65 }
          : { bench: 1.5, squat: 2.0, deadlift: 2.3, ohp: 1.0 },
      },
      {
        id: 4,
        name: "Class IV Dreadnought Mech",
        codename: "NEURAL-DREADNOUGHT-V4",
        color: "text-rose-500",
        borderColor: "border-rose-500/20",
        bgGlow: "rgba(244, 63, 94, 0.09)",
        textColor: "#f43f5e",
        desc: "Autonomous mechanical load absorption frames. Eliminates central safety limits to fire motor-units at 98% efficiency under gravity.",
        specs: {
          skeletal: "Sintered Tungsten-Carbide Girders",
          muscular: "High-Density Neodymium Muscle Core",
          synapses: "Myelinated Quantum Nerve Accel",
        },
        threshold: isFemale ? 4.5 : 6.8,
        targets: isFemale
          ? { bench: 1.2, squat: 1.8, deadlift: 2.1, ohp: 0.85 }
          : { bench: 2.0, squat: 2.5, deadlift: 2.8, ohp: 1.25 },
      },
      {
        id: 5,
        name: "Singularity Vanguard Titan",
        codename: "VANGUARD-TITAN-OMEGA",
        color: "text-purple-400",
        borderColor: "border-purple-500/25",
        bgGlow: "rgba(168, 85, 247, 0.1)",
        textColor: "#c084fc",
        desc: "Absolute cosmic unit. Matter manipulation vectors and weight dampeners allow skeletal structures to handle infinite compression waves.",
        specs: {
          skeletal: "Hyper-Dense Singularity Core",
          muscular: "Gravitational Redirection Tendons",
          synapses: "Direct Neural Singularity Streamer",
        },
        threshold: isFemale ? 5.95 : 8.55,
        targets: isFemale
          ? { bench: 1.5, squat: 2.1, deadlift: 2.4, ohp: 0.95 }
          : { bench: 2.3, squat: 3.0, deadlift: 3.2, ohp: 1.4 },
      },
    ];
  }, [isFemale]);

  // Determine actual current class
  const currentClassIndex = useMemo(() => {
    let index = 0;
    for (let i = CLASS_CONFIG.length - 1; i >= 0; i--) {
      if (totalRatio >= CLASS_CONFIG[i].threshold) {
        index = i;
        break;
      }
    }
    return index;
  }, [totalRatio, CLASS_CONFIG]);

  const currentClass = CLASS_CONFIG[currentClassIndex];
  const nextClass = currentClassIndex < CLASS_CONFIG.length - 1 ? CLASS_CONFIG[currentClassIndex + 1] : null;

  // Standardize ratios for the radar chart visualization.
  // Radial coordinates of the 4 compound exercises (Bench, Squat, Deadlift, OHP).
  // Find maximum scale to map beautifully inside 180x180 radar
  const maxScaleVal = useMemo(() => {
    // Determine typical upper limit based on gender and current ratios
    return isFemale ? 2.5 : 3.5;
  }, [isFemale]);

  const radarChartData = useMemo(() => {
    const size = 180;
    const center = size / 2;
    const radius = 65;

    // Angles: diamond coordinates (up, right, down, left)
    // 0: Bench Press (UP)
    // 1: Back Squats (RIGHT)
    // 2: Deadlifts (DOWN)
    // 3: Overhead Press (LEFT)
    const labelNames = ["Bench Press", "Back Squat", "Deadlift", "Overhead Press"];
    const currentRatios = [benchRatio, squatRatio, deadliftRatio, ohpRatio];
    
    // Target ratios of the next evolution, or the current class targets if at max
    const targetConfig = nextClass ? nextClass.threshold > 0 ? CLASS_CONFIG[currentClassIndex + 1].targets : CLASS_CONFIG[currentClassIndex].targets : CLASS_CONFIG[CLASS_CONFIG.length - 1].targets;
    const targetRatios = [targetConfig.bench, targetConfig.squat, targetConfig.deadlift, targetConfig.ohp];

    const getX = (angle: number, length: number) => center + length * Math.cos(angle);
    const getY = (angle: number, length: number) => center + length * Math.sin(angle);

    const axes = labelNames.map((name, i) => {
      const angle = -Math.PI / 2 + (i * Math.PI) / 2; // Increments of 90 degrees
      
      const capMultiplier = (val: number) => Math.min(1.0, val / maxScaleVal);

      const currentLength = radius * capMultiplier(currentRatios[i]);
      const targetLength = radius * capMultiplier(targetRatios[i]);

      return {
        name,
        angle,
        labelX: getX(angle, radius + 20),
        labelY: getY(angle, radius + 11),
        lineX: getX(angle, radius),
        lineY: getY(angle, radius),
        currentPtX: getX(angle, currentLength),
        currentPtY: getY(angle, currentLength),
        targetPtX: getX(angle, targetLength),
        targetPtY: getY(angle, targetLength),
        currentRatio: currentRatios[i],
        targetRatio: targetRatios[i],
      };
    });

    return {
      size,
      center,
      radius,
      axes,
    };
  }, [benchRatio, squatRatio, deadliftRatio, ohpRatio, currentClassIndex, nextClass, CLASS_CONFIG, maxScaleVal]);

  // Unlock logs to display in terminal
  const unlockLogs = useMemo(() => {
    const logs: { text: string; success: boolean; date: string }[] = [];
    const todayStr = new Date().toISOString().substring(0, 10);

    // Bench unlocks
    if (benchRatio >= CLASS_CONFIG[1].targets.bench) {
      logs.push({ text: `CARBON-ARMOR OVERRIDE: Bench ratio (${benchRatio.toFixed(2)}x) unlocked Reinforced Alloy standards.`, success: true, date: todayStr });
    }
    if (benchRatio >= CLASS_CONFIG[2].targets.bench) {
      logs.push({ text: `CHEST CORE MATRIX SYSTEMICS: Bench ratio (${benchRatio.toFixed(2)}x) expanded into Titanium Exochassis standards.`, success: true, date: todayStr });
    }
    if (benchRatio >= CLASS_CONFIG[3].targets.bench) {
      logs.push({ text: `DREADNOUGHT REINFORCEMENTS: Bench ratio (${benchRatio.toFixed(2)}x) cleared for Dreadnought Mech-standards!`, success: true, date: todayStr });
    }

    // Squat unlocks
    if (squatRatio >= CLASS_CONFIG[1].targets.squat) {
      logs.push({ text: `HYDRAULIC UPGRADE: Posterior stabilizers (${squatRatio.toFixed(2)}x) unlocked Reinforced Alloy standards.`, success: true, date: todayStr });
    }
    if (squatRatio >= CLASS_CONFIG[2].targets.squat) {
      logs.push({ text: `HEAVY ABSORBER UPGRADE: Squat ratio (${squatRatio.toFixed(2)}x) expanded into Titanium Exochassis standards.`, success: true, date: todayStr });
    }
    if (squatRatio >= CLASS_CONFIG[3].targets.squat) {
      logs.push({ text: `DREADNOUGHT ENGINE UPGRADE: Squat ratio (${squatRatio.toFixed(2)}x) operates at supreme mechanical loads.`, success: true, date: todayStr });
    }

    // Deadlift unlocks
    if (deadliftRatio >= CLASS_CONFIG[1].targets.deadlift) {
      logs.push({ text: `SPINAL SHEAR FORCE UPGRADE: Posterior chain (${deadliftRatio.toFixed(2)}x) passed Alloy Shell standard.`, success: true, date: todayStr });
    }
    if (deadliftRatio >= CLASS_CONFIG[2].targets.deadlift) {
      logs.push({ text: `GRAVITY SHUNT INTEGRATION: Deadlift ratio (${deadliftRatio.toFixed(2)}x) passed Titanium Exo standards.`, success: true, date: todayStr });
    }
    if (deadliftRatio >= CLASS_CONFIG[3].targets.deadlift) {
      logs.push({ text: `CRITICAL LOAD CAPACTY PASSED: Deadlift ratio (${deadliftRatio.toFixed(2)}x) is certified for Dreadnought operation levels.`, success: true, date: todayStr });
    }

    // Fallback if none are unlocked
    if (logs.length === 0) {
      logs.push({
        text: "SYSTEM INITIALIZED: Awaiting additional bio-data compilation. Compile heavy lifts to override safety limiters.",
        success: false,
        date: todayStr,
      });
    }

    // Take the 4 most recent unlocks to prevent overflow
    return logs.slice(-4).reverse();
  }, [benchRatio, squatRatio, deadliftRatio, CLASS_CONFIG]);

  // Progress percentage logic to next tier
  const percentToNext = useMemo(() => {
    if (!nextClass) return 100;
    const currentMin = currentClass.threshold;
    const targetMin = nextClass.threshold;
    const progress = ((totalRatio - currentMin) / (targetMin - currentMin)) * 100;
    return Math.max(0, Math.min(100, Math.round(progress)));
  }, [totalRatio, currentClass, nextClass]);

  return (
    <div className="bg-[#070708] border border-white/10 rounded-sm p-6 relative overflow-hidden space-y-6">
      {/* Background structural cybernetic grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:10px_10px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] pointer-events-none" />

      {/* Military Spec Level 5 Tech Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-4 relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[8px] font-mono tracking-[0.25em] text-white/40 uppercase">
            <Cpu className="w-3.5 h-3.5 text-gym-accent animate-pulse" />
            BIOMECHANICAL REINFORCEMENT FRAME SPECTRA v5.9
          </div>
          <h2 className="text-base font-black text-white tracking-wide uppercase flex items-center gap-2">
            🛡️ BIOMECHANICAL CYBERNETIC FRAME
          </h2>
          <p className="text-[10px] text-white/40 font-mono leading-relaxed max-w-xl uppercase">
            Skeletal stress matrices computed by relative bodyweight multipliers. Real-time hydraulic and skeletal upgrade class diagnostics.
          </p>
        </div>

        {/* Current frame rank status badge */}
        <div className="flex flex-col font-mono text-right shrink-0">
          <span className="text-[7.5px] uppercase text-white/30 tracking-widest font-black">CURRENT CHASSIS CLASSIFICATION</span>
          <span className={`text-md font-black tracking-wider uppercase mt-1 ${currentClass.color}`}>
            {currentClass.name}
          </span>
          <span className="text-[8px] text-white/20 mt-0.5 tracking-wider uppercase">
            CODEX: {currentClass.codename}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left Side: Military Rank Banner and Stats Specs (7 Columns) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          
          {/* Cybernetic Class Rank Banner Card */}
          <div 
            className="border rounded-sm p-5 relative overflow-hidden transition-all duration-[1s]"
            style={{ 
              borderColor: currentClass.textColor + "30",
              background: `linear-gradient(135deg, ${currentClass.textColor}05 0%, #000 100%)` 
            }}
          >
            {/* Glowing Corner Indicator */}
            <div 
              className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-[45px] pointer-events-none"
              style={{ backgroundColor: `${currentClass.textColor}12` }}
            />

            <div className="flex items-center gap-4">
              {/* Outer emblem container with themed frame status */}
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center relative border shadow-2xl bg-black"
                style={{ borderColor: currentClass.textColor + "60" }}
              >
                <div className="absolute inset-0.5 rounded-full border border-dashed border-white/10 animate-[spin_40s_linear_infinite]" />
                {currentClassIndex >= 3 ? (
                  <Sword className="w-6 h-6" style={{ color: currentClass.textColor }} />
                ) : (
                  <Shield className="w-6 h-6" style={{ color: currentClass.textColor }} />
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[8px] font-mono tracking-widest text-white/40 uppercase block">FRAME STATUS INTEGRITY</span>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <span style={{ color: currentClass.textColor }}>■</span> {currentClass.name}
                </h3>
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider block bg-white/5 border border-white/5 py-0.5 px-2 rounded-sm max-w-fit">
                  Cumulative Standard Index: <strong className="text-white">{totalRatio.toFixed(2)}x</strong> multiplier achieved
                </span>
              </div>
            </div>

            {/* Spec description block */}
            <p className="text-[11px] text-white/70 italic mt-3.5 pr-2 leading-relaxed">
              &ldquo;{currentClass.desc}&rdquo;
            </p>

            {/* Micro component list specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 mt-3.5 border-t border-white/5 text-[9px] font-mono">
              <div className="p-2 bg-black/40 border border-white/5 rounded-sm">
                <span className="text-white/35 uppercase text-[7.5px] block tracking-wider">Skeletal Framework</span>
                <span className="text-white font-bold block truncate mt-0.5 uppercase">{currentClass.specs.skeletal}</span>
              </div>
              <div className="p-2 bg-black/40 border border-white/5 rounded-sm">
                <span className="text-white/35 uppercase text-[7.5px] block tracking-wider">Myofibril Polymers</span>
                <span className="text-white font-bold block truncate mt-0.5 uppercase">{currentClass.specs.muscular}</span>
              </div>
              <div className="p-2 bg-black/40 border border-white/5 rounded-sm">
                <span className="text-white/35 uppercase text-[7.5px] block tracking-wider">Neural Recruiter</span>
                <span className="text-white font-bold block truncate mt-0.5 uppercase">{currentClass.specs.synapses}</span>
              </div>
            </div>
          </div>

          {/* Level Progression & Next Evolution Directive */}
          {nextClass ? (
            <div className="bg-[#0a0a0c] border border-white/5 p-4 rounded-sm space-y-3">
              <div className="flex justify-between items-center text-[9px] font-mono">
                <div className="flex items-center gap-1.5 uppercase tracking-wider text-white">
                  <Target className="w-3.5 h-3.5 text-gym-accent animate-pulse" />
                  NEXT STRUCTURAL EVOLUTION UPGRADE
                </div>
                <div className="text-white/40 uppercase">
                  Class total threshold: <strong className="text-white font-mono">{nextClass.threshold.toFixed(2)}x</strong>
                </div>
              </div>

              {/* Progress bar to next frame upgrade */}
              <div className="space-y-1 pt-1">
                <div className="w-full h-2 bg-black border border-white/5 rounded-full overflow-hidden p-0.5 relative">
                  <motion.div
                    className="h-full bg-gym-accent rounded-full shadow-[0_0_8px_rgba(255,223,0,0.6)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentToNext}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between font-mono text-[7.5px] text-white/30 uppercase mt-0.5">
                  <span className="flex items-center gap-1">
                    Index: {totalRatio.toFixed(2)}x / {nextClass.threshold.toFixed(2)}x
                  </span>
                  <span>{percentToNext}% towards {nextClass.name}</span>
                </div>
              </div>

              {/* Directive alert block */}
              <div className="p-2.5 bg-gym-accent/5 border border-gym-accent/15 rounded-sm text-[10px] leading-relaxed text-gym-accent uppercase tracking-wider flex items-start gap-2">
                <TrendingUp className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span>UPGRADE THRESHOLD REQUIREMENT: Pass a total cumulative ratio of <strong>{nextClass.threshold.toFixed(2)}x</strong> bodyweight across compounds. Accumulate <strong>{(nextClass.threshold - totalRatio).toFixed(2)}x</strong> more relative load to bypass limits.</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-purple-950/20 border border-purple-500/20 p-4 rounded-sm">
              <div className="flex items-center gap-2 text-xs font-black text-purple-400 font-mono uppercase tracking-widest animate-pulse">
                <Unlock className="w-4 h-4" />
                MAXIMUM CYBERNETIC INTEGRATION ACHIEVED
              </div>
              <p className="text-[10px] font-mono text-purple-300 mt-1 uppercase tracking-wider">
                System limits completely overridden. Gravity calculations normalized. The subject possesses god-tier biomechanical strength relative to organic matrix standards.
              </p>
            </div>
          )}

          {/* Quick Realtime Multiplier list block */}
          <div className="grid grid-cols-4 gap-2 text-[9px] font-mono select-none">
            <div className="bg-black/50 border border-white/5 p-2 rounded-sm text-center">
              <span className="text-white/30 block uppercase tracking-widest text-[7px]">Bench Press</span>
              <strong className="text-[13px] block text-white font-black mt-1 font-mono">{benchRatio.toFixed(2)}x</strong>
              <span className="text-[7.5px] text-white/20 block truncate mt-0.5 uppercase">({Math.round(actualBenchMax)} KG)</span>
            </div>
            <div className="bg-black/50 border border-white/5 p-2 rounded-sm text-center">
              <span className="text-white/30 block uppercase tracking-widest text-[7px]">Back Squat</span>
              <strong className="text-[13px] block text-white font-black mt-1 font-mono">{squatRatio.toFixed(2)}x</strong>
              <span className="text-[7.5px] text-white/20 block truncate mt-0.5 uppercase">({Math.round(actualSquatMax)} KG)</span>
            </div>
            <div className="bg-black/50 border border-white/5 p-2 rounded-sm text-center">
              <span className="text-white/30 block uppercase tracking-widest text-[7px]">Deadlift</span>
              <strong className="text-[13px] block text-white font-black mt-1 font-mono">{deadliftRatio.toFixed(2)}x</strong>
              <span className="text-[7.5px] text-white/20 block truncate mt-0.5 uppercase">({Math.round(actualDeadliftMax)} KG)</span>
            </div>
            <div className="bg-black/50 border border-white/5 p-2 rounded-sm text-center">
              <span className="text-white/30 block uppercase tracking-widest text-[7px]">Overhead Press</span>
              <strong className="text-[13px] block text-white font-black mt-1 font-mono">{ohpRatio.toFixed(2)}x</strong>
              <span className="text-[7.5px] text-white/20 block truncate mt-0.5 uppercase">({Math.round(actualOhpMax)} KG)</span>
            </div>
          </div>

        </div>

        {/* Right Side: Visual Evolution Spider Chart & Realtime Alerts Terminal (5 Columns) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          
          {/* Radar Chart Panel Frame */}
          <div className="bg-[#030304] border border-white/5 rounded-sm p-4 flex flex-col items-center justify-center relative select-none">
            <span className="absolute top-2.5 left-2.5 flex items-center gap-1.5 font-mono text-[7px] text-white/30 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-gym-accent animate-pulse" />
              EVOLUTION TARGET OVERLAY
            </span>

            {/* Render direct SVG diamond radar spider chart */}
            <div className="w-full max-w-[200px] aspect-square flex items-center justify-center mt-3 relative">
              <svg 
                width={radarChartData.size} 
                height={radarChartData.size} 
                viewBox={`0 0 ${radarChartData.size} ${radarChartData.size}`}
                className="w-full h-full font-mono overflow-visible"
              >
                <defs>
                  {/* Subtle Grid Hashed Pattern for evolution area */}
                  <pattern id="target-stripes" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(217, 119, 6, 0.12)" strokeWidth="2.2" />
                  </pattern>
                  {/* Glow filter */}
                  <filter id="radar-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Sub boundary concentric rings */}
                {[0.25, 0.5, 0.75, 1.0].map((level, idx) => {
                  const ringRadius = radarChartData.radius * level;
                  return (
                    <polygon
                      key={idx}
                      points={radarChartData.axes.map((ax, i) => {
                        const x = radarChartData.center + ringRadius * Math.cos(ax.angle);
                        const y = radarChartData.center + ringRadius * Math.sin(ax.angle);
                        return `${x},${y}`;
                      }).join(" ")}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.03)"
                      strokeWidth="1"
                      strokeDasharray={idx === 3 ? "0" : "2 2"}
                    />
                  );
                })}

                {/* Main Axis diagonal spokes */}
                {radarChartData.axes.map((ax, idx) => (
                  <line
                    key={idx}
                    x1={radarChartData.center}
                    y1={radarChartData.center}
                    x2={ax.lineX}
                    y2={ax.lineY}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="1.2"
                  />
                ))}

                {/* Outer Exercise Category labels */}
                {radarChartData.axes.map((ax, idx) => (
                  <g key={idx} className="text-[7.5px] font-black font-mono tracking-widest text-[#a1a1aa] uppercase">
                    <text
                      x={ax.labelX}
                      y={ax.labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="rgba(255, 255, 255, 0.3)"
                    >
                      {ax.name}
                    </text>
                    <text
                      x={ax.labelX}
                      y={ax.labelY + 8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white font-bold"
                    >
                      {ax.currentRatio.toFixed(2)}x
                    </text>
                  </g>
                ))}

                {/* Next Tier Upgrade target outer overlay shape */}
                <polygon
                  points={radarChartData.axes.map((ax) => `${ax.targetPtX},${ax.targetPtY}`).join(" ")}
                  fill="url(#target-stripes)"
                  stroke={nextClass ? nextClass.textColor + "50" : "rgba(168, 85, 247, 0.4)"}
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />

                {/* Current actual strength profile shape */}
                <polygon
                  points={radarChartData.axes.map((ax) => `${ax.currentPtX},${ax.currentPtY}`).join(" ")}
                  fill="rgba(255, 223, 0, 0.08)"
                  stroke="#ffdf00"
                  strokeWidth="2"
                  filter="url(#radar-glow)"
                />

                {/* Target overlay vertices markers */}
                {radarChartData.axes.map((ax, idx) => (
                  <circle
                    key={`t-${idx}`}
                    cx={ax.targetPtX}
                    cy={ax.targetPtY}
                    r="3.2"
                    fill="#030304"
                    stroke={nextClass ? nextClass.textColor : "#c084fc"}
                    strokeWidth="1.5"
                  />
                ))}

                {/* Current actual vertices markers */}
                {radarChartData.axes.map((ax, idx) => (
                  <circle
                    key={`c-${idx}`}
                    cx={ax.currentPtX}
                    cy={ax.currentPtY}
                    r="3.5"
                    fill="#ffdf00"
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                ))}

                {/* Center Core dot */}
                <circle cx={radarChartData.center} cy={radarChartData.center} r="3" fill="#09090b" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
              </svg>
            </div>

            {/* Color key guide */}
            <div className="flex justify-center gap-4 text-[8px] font-mono uppercase tracking-widest mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1.5 bg-[#ffdf00] inline-block rounded-xs" />
                <span className="text-white/60">Actual Matrix</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1.5 border border-dashed inline-block rounded-xs" style={{ borderColor: nextClass?.textColor || '#c084fc' }} />
                <span className="text-white/60">Target Frame</span>
              </div>
            </div>
          </div>

          {/* Unlocking Live Alerts Console Terminal */}
          <div className="bg-black border border-white/10 rounded-sm p-4 relative font-mono overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 select-none">
              <span className="text-[7px] text-white/40 tracking-widest uppercase flex items-center gap-1.5">
                <Tv className="w-3 h-3 text-[#ffbe1a]" />
                UNLOCKED FRAME SECTOR OVERRIDES
              </span>
              <span className="text-[6.5px] bg-white/5 text-white/50 px-1 font-mono uppercase">TTY_SYSTEM</span>
            </div>

            <div className="space-y-2 select-none">
              {unlockLogs.map((log, index) => (
                <div key={index} className="text-[9px] flex items-start gap-1 text-white/80 leading-relaxed">
                  <span className="text-[#ffdf00] shrink-0 font-bold">&gt;</span>
                  <div className="break-words font-mono">
                    <span className="text-white/40 mr-1">[{log.date}]</span>
                    {log.success ? (
                      <span className="text-emerald-400 font-bold uppercase">{log.text}</span>
                    ) : (
                      <span className="text-white/60 uppercase">{log.text}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
