import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Brain } from "lucide-react";

interface Contributor {
  exercise: string;
  setsCount: number;
  loadingPerSet: number;
  totalContribution: number;
}

interface CNSFatigueAnalysis {
  score: number;
  totalSpinalLoad: number;
  contributors: Contributor[];
  label: string;
  sublabel: string;
  recommendations: string;
  levelColor: string;
  barColor: string;
  hexColor: string;
}

interface SpinalDepletionWidgetProps {
  cnsFatigueAnalysis: CNSFatigueAnalysis;
  setActiveView: (view: any) => void;
}

export const SpinalDepletionWidget: React.FC<SpinalDepletionWidgetProps> = ({
  cnsFatigueAnalysis,
  setActiveView,
}) => {
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  // Smoothly animate the local display score whenever the master score changes
  useEffect(() => {
    let animationFrameId: number;
    const startValue = animatedScore;
    const endValue = cnsFatigueAnalysis.score;
    const duration = 1000; // 1 second animation glide
    const startTime = performance.now();

    const animateNum = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth cubic ease-out
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeProgress;
      setAnimatedScore(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateNum);
      }
    };

    animationFrameId = requestAnimationFrame(animateNum);
    return () => cancelAnimationFrame(animationFrameId);
  }, [cnsFatigueAnalysis.score]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative overflow-hidden bg-gradient-to-b from-[#090909] to-[#040404] border border-white/[0.04] rounded-xl p-6 select-none hover:border-white/10 transition-all duration-300"
      id="spinal-gauge-hero-card"
    >
      {/* Abstract Corner Radial Glow */}
      <motion.div 
        className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none"
        animate={{ backgroundColor: `${cnsFatigueAnalysis.hexColor}20` }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <div className="absolute top-3 right-3 flex items-center gap-1.5 font-mono text-[7px] text-white/20 tracking-widest uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-gym-accent animate-pulse" />
        SYSTEMICS LEVEL 5 MONITOR
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Semicircular Gauge Display (Left 4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-[220px] flex flex-col items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 200 120" id="spinal-depletion-radial-gauge">
              <defs>
                {/* Glowing Filter effects */}
                <filter id="spinal-gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="spinal-interior-glow" cx="50%" cy="100%" r="65%">
                  <motion.stop 
                    offset="0%" 
                    animate={{ stopColor: cnsFatigueAnalysis.hexColor }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    stopOpacity="0.12" 
                  />
                  <motion.stop 
                    offset="100%" 
                    animate={{ stopColor: cnsFatigueAnalysis.hexColor }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    stopOpacity="0" 
                  />
                </radialGradient>
              </defs>

              {/* Semicircle bounding background glow fill */}
              <path d="M 30 100 A 70 70 0 0 1 170 100 Z" fill="url(#spinal-interior-glow)" />

              {/* Gauge Background track */}
              <path
                d="M 30 100 A 70 70 0 0 1 170 100"
                fill="none"
                stroke="rgba(255, 255, 255, 0.04)"
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* Animated active filled arc */}
              <motion.path
                d="M 30 100 A 70 70 0 0 1 170 100"
                fill="none"
                strokeWidth="8.5"
                strokeLinecap="round"
                filter="url(#spinal-gauge-glow)"
                initial={{ pathLength: 0 }}
                animate={{ 
                  pathLength: cnsFatigueAnalysis.score / 100,
                  stroke: cnsFatigueAnalysis.hexColor
                }}
                transition={{ 
                  pathLength: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                  stroke: { duration: 1.2, ease: "easeInOut" }
                }}
              />

              {/* Radial demarcation lines / ticks for zones (25%, 55%, 85%) */}
              {[0.25, 0.55, 0.85].map((pct, idx) => {
                const angle = Math.PI - pct * Math.PI;
                const r1 = 64;
                const r2 = 76;
                const x1 = 100 + r1 * Math.cos(angle);
                const y1 = 100 - r1 * Math.sin(angle);
                const x2 = 100 + r2 * Math.cos(angle);
                const y2 = 100 - r2 * Math.sin(angle);
                return (
                  <line
                    key={idx}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1.2"
                  />
                );
              })}

              {/* Outer Labels */}
              <text x="22" y="112" className="text-[7.5px] font-mono fill-white/25 font-black text-center" textAnchor="middle">RECOVERED</text>
              <text x="100" y="24" className="text-[7.5px] font-mono fill-white/25 font-black text-center" textAnchor="middle">HYPERTROPHY</text>
              <text x="178" y="112" className="text-[7.5px] font-mono fill-white/25 font-black text-center" textAnchor="middle">CRITICAL</text>

              {/* Digital Score Overlay inside the gauge */}
              <text x="100" y="76" className="text-[25px] font-black fill-white font-mono text-center" textAnchor="middle">
                {Math.round(animatedScore)}%
              </text>
              <text x="100" y="89" className="text-[6px] tracking-[0.2em] font-mono fill-white/35 uppercase text-center" textAnchor="middle">
                CNS FATIGUE INDEX
              </text>

              {/* Animated Needle sweep */}
              <motion.line
                x1="100"
                y1="100"
                x2="100"
                y2="42"
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ originX: "100px", originY: "100px" }}
                initial={{ rotate: -90 }}
                animate={{ rotate: -90 + (cnsFatigueAnalysis.score / 100) * 180 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 45, 
                  damping: 12, 
                  mass: 0.8
                }}
              />

              {/* Center Pin node display */}
              <circle cx="100" cy="100" r="6.5" fill="#09090b" stroke="#ffffff" strokeWidth="2" />
              <motion.circle 
                cx="100" 
                cy="100" 
                r="2.5" 
                animate={{ fill: cnsFatigueAnalysis.hexColor }} 
                transition={{ duration: 1.2 }}
              />
            </svg>
          </div>
        </div>

        {/* Deep Analytics & Training Action Directives (Right 8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-1">
            <motion.span 
              className={`text-[8.5px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md border inline-block select-none ${cnsFatigueAnalysis.levelColor}`}
              animate={{ borderColor: `${cnsFatigueAnalysis.hexColor}30` }}
              transition={{ duration: 1.2 }}
            >
              {cnsFatigueAnalysis.label}
            </motion.span>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mt-1.5 flex items-center gap-2">
              <Brain className="w-4 h-4 text-gym-accent" />
              Spinal Depletion Status (Past 72h)
            </h4>
            <p className="text-[10px] text-white/40 uppercase tracking-widest block font-mono">
              COMPUTE SUMMARY: {cnsFatigueAnalysis.totalSpinalLoad.toFixed(1)} SPINAL LOAD UNITS • {cnsFatigueAnalysis.contributors.length} SYSTEMIC CONTRIBUTORS
            </p>
          </div>

          <p className="text-xs text-white/85 leading-relaxed font-sans pr-4 border-l-2 border-white/5 pl-3">
            {cnsFatigueAnalysis.recommendations}
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-white/5 pt-3.5 mt-2.5">
            <div className="text-left">
              <span className="text-[7.5px] text-white/30 font-mono uppercase tracking-wider block">72h Load Profile</span>
              <span className="text-xs font-bold text-white font-mono block mt-0.5">
                {cnsFatigueAnalysis.contributors.length > 0 ? `${cnsFatigueAnalysis.contributors.length} exercises logged` : 'Optimal Recovery'}
              </span>
            </div>
            <div className="h-6 w-px bg-white/5 self-center" />
            <div className="text-left">
              <span className="text-[7.5px] text-white/30 font-mono uppercase tracking-wider block">Intensity Rating</span>
              <motion.span 
                className="text-xs font-bold font-mono block mt-0.5" 
                animate={{ color: cnsFatigueAnalysis.hexColor }}
                transition={{ duration: 1.2 }}
              >
                {cnsFatigueAnalysis.score > 85 ? 'Critical Neuro-Shear' : cnsFatigueAnalysis.score > 55 ? 'Heavy Systemic Wear' : cnsFatigueAnalysis.score > 25 ? 'Average Structural Strain' : 'Restored / Perfect CNS'}
              </motion.span>
            </div>
            <div className="h-6 w-px bg-white/5 self-center" />
            <button
              onClick={() => {
                setActiveView("anatomy");
              }}
              className="ml-auto text-[9px] text-gym-accent font-extrabold uppercase tracking-wider border border-gym-accent/20 hover:border-gym-accent/60 bg-gym-accent/5 hover:bg-gym-accent/10 px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer flex items-center gap-1.5 font-mono hover:scale-[1.02] active:scale-[0.98]"
            >
              Inspect Neural Component Log
              <span className="text-xs">→</span>
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
