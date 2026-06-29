import React, { useMemo } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Dumbbell, 
  Activity, 
  Flame, 
  Scale, 
  Zap 
} from "lucide-react";

interface ImmersiveLandingProps {
  onEnter: () => void;
  profile: any;
  currentUser: any;
  archivedWorkouts: any[];
  currentDays: any[][];
  activeTheme: any;
  playRestBeep?: (freq?: number, dur?: number) => void;
  sessionSets: any[];
  cnsFatigueAnalysis: any;
  syncedProfile: any;
  weightHistory: any[];
  volumeData: any[];
  setActiveView: (view: any) => void;
}

export const ImmersiveLanding: React.FC<ImmersiveLandingProps> = ({
  onEnter,
  profile,
  currentUser,
  archivedWorkouts = [],
  activeTheme,
  cnsFatigueAnalysis,
  syncedProfile,
  weightHistory = [],
  setActiveView
}) => {
  const currentProfile = syncedProfile || profile;
  const level = currentProfile?.avatarLevel ?? 1;
  const rankName = currentProfile?.equippedOutfit 
    ? currentProfile.equippedOutfit.replace(/_/g, " ").toUpperCase() 
    : "VANGUARD CADET";

  // Calculate real-time stats
  const totalVolume = useMemo(() => {
    return archivedWorkouts.reduce((acc, w) => acc + (w.totalVolume || 0), 0);
  }, [archivedWorkouts]);

  const totalWorkouts = archivedWorkouts.length;

  const sortedWorkouts = useMemo(() => {
    return [...archivedWorkouts].sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0).getTime();
      const dateB = new Date(b.date || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }, [archivedWorkouts]);

  const lastWorkout = sortedWorkouts[0] || null;

  // Last 7 days stats
  const oneWeekAgo = useMemo(() => Date.now() - 7 * 24 * 60 * 60 * 1000, []);
  const last7DaysWorkouts = useMemo(() => {
    return archivedWorkouts.filter(w => {
      const d = new Date(w.date || w.createdAt || 0).getTime();
      return d >= oneWeekAgo;
    });
  }, [archivedWorkouts, oneWeekAgo]);

  const weeklyVolume = useMemo(() => {
    return last7DaysWorkouts.reduce((acc, w) => acc + (w.totalVolume || 0), 0);
  }, [last7DaysWorkouts]);

  const weeklyWorkoutsCount = last7DaysWorkouts.length;

  // CNS Fatigue
  const cnsScore = cnsFatigueAnalysis?.score ?? 0;
  const cnsLabel = cnsFatigueAnalysis?.label ?? "RESTORED";
  const cnsHexColor = cnsFatigueAnalysis?.hexColor ?? "#10b981";

  // Streak
  const streak = currentProfile?.streak ?? 0;

  // Weight Change
  const currentWeight = currentProfile?.weight ?? (weightHistory && weightHistory[weightHistory.length - 1]?.weight) ?? null;
  const initialWeight = (weightHistory && weightHistory[0]?.weight) ?? currentWeight;
  const weightDiff = currentWeight && initialWeight ? (currentWeight - initialWeight) : 0;

  const handleNavigate = (view: any) => {
    setActiveView(view);
    onEnter();
  };

  // Curated premium high-contrast gym environment image (Unsplash) - Masculine heavy barbell lift theme
  const heroGymImage = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop";

  const athleteName = currentProfile?.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'ATHLETE';

  // Scroll and pop animation variants
  const scrollPopVariant = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 160, 
        damping: 18,
        mass: 0.8
      } 
    }
  };

  const scrollZoomVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 140, 
        damping: 16 
      } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020202] text-white selection:bg-gym-accent selection:text-black font-sans flex flex-col justify-between overflow-x-hidden">
      
      {/* Absolute high-end ambient radial glow */}
      <div 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% -15%, ${(activeTheme?.accent || "#ff3e3e")}0a 0%, transparent 60%),
            radial-gradient(circle at 90% 70%, ${(activeTheme?.accent || "#ff3e3e")}04 0%, transparent 40%)
          `
        }}
      />

      {/* Decorative vertical blueprint coordinate lines */}
      <div className="absolute inset-y-0 left-0 right-0 pointer-events-none z-0 flex justify-between max-w-7xl mx-auto px-8 md:px-16 opacity-[0.03]">
        <div className="w-[1px] h-full bg-gradient-to-b from-white via-transparent to-white" />
        <div className="w-[1px] h-full bg-gradient-to-b from-white via-transparent to-white hidden md:block" />
        <div className="w-[1px] h-full bg-gradient-to-b from-white via-transparent to-white hidden lg:block" />
        <div className="w-[1px] h-full bg-gradient-to-b from-white via-transparent to-white" />
      </div>

      <div className="relative z-10 w-full flex flex-col min-h-screen justify-between">
        
        {/* Sleek Minimalist Header - Now contains the primary brand title "Titan Pro" */}
        <header className="max-w-7xl w-full mx-auto px-8 md:px-16 pt-16 pb-16 flex items-end justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gym-accent animate-pulse" />
              <span className="text-[10px] font-mono text-white/30 tracking-[0.35em] uppercase font-black block">
                WELCOME BACK, {athleteName.toUpperCase()}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-white leading-none">
              TITAN <span className="font-serif italic font-light text-gym-accent">PRO</span>
            </h1>
          </div>
          
          <button
            onClick={onEnter}
            className="text-[10px] font-mono border border-white/10 hover:border-gym-accent/50 px-6 py-2.5 rounded-full hover:bg-white/[0.02] text-white/85 hover:text-white transition-all duration-300 uppercase tracking-widest cursor-pointer"
          >
            LAUNCH CONSOLE &rarr;
          </button>
        </header>

        {/* Contained Photographic HUD Banner with REAL Telemetry overlays (No large copy section block above it) */}
        <section className="max-w-7xl w-full mx-auto px-8 md:px-16">
          <div className="relative w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-[#090909]">
            
            {/* Top and Bottom Moody Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020202]/95 via-black/45 to-[#020202]/30 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

            {/* Heavy Contrast Grayscale Gym Asset */}
            <motion.img 
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.75 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              src={heroGymImage} 
              alt="Gym Landscape Banner" 
              className="w-full h-[360px] md:h-[480px] object-cover grayscale contrast-[1.2] brightness-[0.65]"
              referrerPolicy="no-referrer"
            />

            {/* Floating Top Header inside visual banner */}
            <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gym-accent animate-pulse" />
                <span className="text-[8px] font-mono text-white/50 tracking-[0.2em] uppercase">// LIVE ATHLETE TELEMETRY</span>
              </div>
              <span className="text-[8px] font-mono text-white/80 border border-white/10 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md tracking-widest uppercase shadow-md">
                LEVEL {level} // {rankName}
              </span>
            </div>

            {/* Personalized Athlete HUD Statistics Overlay */}
            <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-10 space-y-6">
              
              {/* Responsive Metrics HUD Grid */}
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: "-40px" }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-12"
              >
                
                {/* CNS Fatigue Stat */}
                <motion.div 
                  variants={scrollPopVariant}
                  className="bg-black/60 backdrop-blur-md border border-white/[0.06] rounded-xl p-4 space-y-2 hover:border-gym-accent/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono text-white/40 tracking-wider uppercase font-bold">01 / CNS FATIGUE</span>
                    <Activity className="w-3.5 h-3.5" style={{ color: cnsHexColor }} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-2xl font-mono font-bold leading-none" style={{ color: cnsHexColor }}>
                      {cnsScore}%
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-white/30 font-mono">
                      {cnsLabel}
                    </p>
                  </div>
                </motion.div>

                {/* Training Streak Stat */}
                <motion.div 
                  variants={scrollPopVariant}
                  className="bg-black/60 backdrop-blur-md border border-white/[0.06] rounded-xl p-4 space-y-2 hover:border-orange-400/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono text-white/40 tracking-wider uppercase font-bold">02 / STREAK</span>
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-2xl font-mono font-bold leading-none text-white">
                      {streak} {streak === 1 ? 'DAY' : 'DAYS'}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-white/30 font-mono">
                      Active Cycle
                    </p>
                  </div>
                </motion.div>

                {/* Weekly Work Volume Stat */}
                <motion.div 
                  variants={scrollPopVariant}
                  className="bg-black/60 backdrop-blur-md border border-white/[0.06] rounded-xl p-4 space-y-2 hover:border-gym-accent/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono text-white/40 tracking-wider uppercase font-bold">03 / WEEKLY LOAD</span>
                    <Zap className="w-3.5 h-3.5 text-gym-accent" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-2xl font-mono font-bold leading-none text-white">
                      {weeklyVolume > 0 ? `${(weeklyVolume / 1000).toFixed(1)}T` : "0.0T"}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-white/30 font-mono">
                      {weeklyWorkoutsCount} {weeklyWorkoutsCount === 1 ? 'SESSION' : 'SESSIONS'} / 7D
                    </p>
                  </div>
                </motion.div>

                {/* Body Metrics Stat */}
                <motion.div 
                  variants={scrollPopVariant}
                  className="bg-black/60 backdrop-blur-md border border-white/[0.06] rounded-xl p-4 space-y-2 hover:border-blue-400/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono text-white/40 tracking-wider uppercase font-bold">04 / WEIGHT</span>
                    <Scale className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-2xl font-mono font-bold leading-none text-white">
                      {currentWeight ? `${currentWeight} kg` : "N/A"}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-white/30 font-mono">
                      {weightDiff !== 0 ? (
                        <span className={weightDiff > 0 ? "text-emerald-400" : "text-rose-400"}>
                          {weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(1)} kg delta
                        </span>
                      ) : (
                        "Baseline Stable"
                      )}
                    </p>
                  </div>
                </motion.div>

              </motion.div>

            </div>
          </div>
        </section>

        {/* Section 3: Clean, Spaced Statistics & System Module Navigation Grid */}
        <section className="max-w-7xl w-full mx-auto px-8 md:px-16 py-28 md:py-36">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16"
          >
            
            {/* Split Planner Module card */}
            <motion.div 
              variants={scrollPopVariant}
              onClick={() => handleNavigate("workout")}
              className="space-y-4 group cursor-pointer bg-white/[0.01] hover:bg-white/[0.02] border border-white/0 hover:border-white/[0.04] p-5 rounded-xl transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gym-accent group-hover:scale-125 transition-transform" />
                <span className="text-[9px] font-mono text-white/30 tracking-widest uppercase font-black block">
                  MODULE 01 / PROGRAMMING
                </span>
              </div>
              <h3 className="text-2xl font-extralight tracking-tight text-white group-hover:text-gym-accent transition-colors">
                Lifting splits
              </h3>
              <p className="text-xs text-white/40 font-light leading-relaxed">
                Design custom lifting protocols built around compound targets. 
              </p>
              {lastWorkout && (
                <div className="text-[10px] font-mono text-white/30 border-t border-white/[0.04] pt-2 mt-1">
                  LAST SESSION: <span className="text-gym-accent">{lastWorkout.name?.toUpperCase()}</span>
                </div>
              )}
            </motion.div>

            {/* Muscle Mapping Module card */}
            <motion.div 
              variants={scrollPopVariant}
              onClick={() => handleNavigate("anatomy")}
              className="space-y-4 group cursor-pointer bg-white/[0.01] hover:bg-white/[0.02] border border-white/0 hover:border-white/[0.04] p-5 rounded-xl transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gym-accent group-hover:scale-125 transition-transform" />
                <span className="text-[9px] font-mono text-white/30 tracking-widest uppercase font-black block">
                  MODULE 02 / RECRUITMENT
                </span>
              </div>
              <h3 className="text-2xl font-extralight tracking-tight text-white group-hover:text-gym-accent transition-colors">
                Anatomy Maps
              </h3>
              <p className="text-xs text-white/40 font-light leading-relaxed">
                Analyze muscle density ratios and load points mapped from set history.
              </p>
              <div className="text-[10px] font-mono text-white/30 border-t border-white/[0.04] pt-2 mt-1">
                LIFETIME: <span className="text-white/60">{totalWorkouts} COMPLETED SESSIONS</span>
              </div>
            </motion.div>

            {/* CNS Fatigue Module card */}
            <motion.div 
              variants={scrollPopVariant}
              onClick={() => handleNavigate("progress")}
              className="space-y-4 group cursor-pointer bg-white/[0.01] hover:bg-white/[0.02] border border-white/0 hover:border-white/[0.04] p-5 rounded-xl transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gym-accent group-hover:scale-125 transition-transform" />
                <span className="text-[9px] font-mono text-white/30 tracking-widest uppercase font-black block">
                  MODULE 03 / DIAGNOSTICS
                </span>
              </div>
              <h3 className="text-2xl font-extralight tracking-tight text-white group-hover:text-gym-accent transition-colors">
                CNS Recovery
              </h3>
              <p className="text-xs text-white/40 font-light leading-relaxed">
                Forecast physical fatigue levels to maintain optimal weekly volume limits.
              </p>
              <div className="text-[10px] font-mono text-white/30 border-t border-white/[0.04] pt-2 mt-1">
                STATUS: <span className="font-semibold" style={{ color: cnsHexColor }}>{cnsLabel}</span>
              </div>
            </motion.div>

            {/* Real Stats HUD Display panel */}
            <motion.div 
              variants={scrollPopVariant}
              className="space-y-4 border-l border-white/[0.06] pl-6 md:pl-8 py-2"
            >
              <span className="text-[9px] font-mono text-white/30 tracking-widest block uppercase font-bold">
                04 // METRIC OVERVIEW
              </span>
              <div className="space-y-1">
                <p className="text-xl font-mono text-white font-bold leading-none">
                  {totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}T` : "0.0T"}
                </p>
                <p className="text-[9px] uppercase text-white/35 font-mono tracking-wider">AGGREGATED VOLUME</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/50 font-mono">
                  SESSIONS COMPLETED: {totalWorkouts}
                </p>
                <p className="text-xs text-gym-accent font-mono uppercase">
                  RANK: {level} ({rankName})
                </p>
              </div>
            </motion.div>

          </motion.div>
        </section>

        {/* Proceed to Application CTA section */}
        <section className="max-w-7xl w-full mx-auto px-8 md:px-16 pb-16 flex justify-center">
          <motion.button
            variants={scrollZoomVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-40px" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEnter}
            className="group inline-flex items-center gap-3 bg-white hover:bg-gym-accent hover:text-black text-black px-8 py-3.5 rounded-full font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-gym-accent/10 cursor-pointer"
          >
            <span>PROCEED TO CONSOLE</span>
            <ArrowRight className="w-3.5 h-3.5 text-current transition-transform group-hover:translate-x-1" />
          </motion.button>
        </section>

        {/* Simple & Minimalist Footer */}
        <footer className="max-w-7xl w-full mx-auto px-8 md:px-16 pb-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] font-mono text-white/20 border-t border-white/[0.02]">
          <div>
            &copy; {new Date().getFullYear()} TITAN PERFORMANCE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gym-accent" />
            <span>DESIGNED FOR ELITE ATHLETICS PROTOCOLS</span>
          </div>
        </footer>

      </div>
    </div>
  );
};
