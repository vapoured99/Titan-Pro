import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Droplets,
  Activity,
  Flame,
  ShieldAlert,
  CupSoda,
  Timer,
  Thermometer,
  Zap,
  RefreshCw,
  Sliders,
  ChevronRight,
  Info,
} from "lucide-react";

interface SynapticReplenishmentPlannerProps {
  cnsScore: number;
  sessionSetsCount: number;
  compoundSetsCount: number;
}

export const SynapticReplenishmentPlanner: React.FC<SynapticReplenishmentPlannerProps> = ({
  cnsScore = 0,
  sessionSetsCount = 0,
  compoundSetsCount = 0,
}) => {
  // Interactive control overrides
  const [duration, setDuration] = useState<number>(Math.max(45, Math.min(180, sessionSetsCount * 8 || 75)));
  const [sweatRate, setSweatRate] = useState<string>("medium"); // low, medium, high, extreme
  const [supplementIntake, setSupplementIntake] = useState<boolean>(true);

  // Sweat rates in ml per minute
  const sweatRateMultipliers: Record<string, number> = {
    low: 8,
    medium: 13,
    high: 19,
    extreme: 25,
  };

  // Compute hydration & electrolyte replenishment requirements
  const calculations = useMemo(() => {
    const sweatFactor = sweatRateMultipliers[sweatRate];
    const rawFluid = duration * sweatFactor;
    
    // Neuro-hydraulic scaling based on CNS depletion
    // Heavy loads deplete Na-K channel efficiency.
    const cnsMultiplier = 1.0 + (cnsScore / 100) * 0.4;
    const compoundMultiplier = 1.0 + (compoundSetsCount * 0.03);

    // Dynamic electrolyte milligram targets
    const fluidRequirementMl = Math.round(rawFluid * (1.0 + (cnsScore / 150)));
    const sodiumMg = Math.round(fluidRequirementMl * 0.85 * cnsMultiplier * compoundMultiplier);
    const potassiumMg = Math.round(fluidRequirementMl * 0.28 * (1.0 + (cnsScore / 200)) * (1.0 + compoundSetsCount * 0.015));
    const magnesiumMg = Math.round(60 + (duration * 0.4) + (cnsScore * 1.6));
    const calciumMg = Math.round(40 + (duration * 0.2) + (cnsScore * 0.8));

    // Neural telemetry estimations
    const synapticVelocity = Math.max(70, Math.min(120, 115 - (cnsScore * 0.35) - (duration * 0.05)));
    const waterRetention = Math.max(88, Math.min(100, 99.4 - (cnsScore * 0.08) - (duration * 0.02)));
    const cellHydrationState = cnsScore > 80 ? "Sub-optimal" : cnsScore > 50 ? "Compromised" : "Homeostatic";

    // Osmolarity computation (mOsm/L of the resulting fluid if mixed strictly)
    const totalMolecules = (sodiumMg / 23) + (potassiumMg / 39.1) + (magnesiumMg / 24.3) + (calciumMg / 40.1);
    const osmolarity = Math.round((totalMolecules / (fluidRequirementMl / 1000)) * 1.5); // approximate osmotic pressure factor

    let tonicityLabel = "Isotonic";
    let tonicityDesc = "Perfect cellular absorption. Restores cell turgidity immediately.";
    let tonicityColor = "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";

    if (osmolarity < 240) {
      tonicityLabel = "Hypotonic";
      tonicityDesc = "Rapid fluid entry. Exerts minor intracranial swelling pressures if consumed ultra fast.";
      tonicityColor = "text-sky-400 border-sky-500/20 bg-sky-500/5";
    } else if (osmolarity > 315) {
      tonicityLabel = "Hypertonic";
      tonicityDesc = "Delayed gastric emptying. Might draw intracellular water back into gut temporarily.";
      tonicityColor = "text-amber-500 border-amber-500/20 bg-amber-500/5";
    }

    return {
      fluid: fluidRequirementMl,
      sodium: sodiumMg,
      potassium: potassiumMg,
      magnesium: magnesiumMg,
      calcium: calciumMg,
      synapticVelocity,
      waterRetention,
      cellHydrationState,
      osmolarity,
      tonicityLabel,
      tonicityDesc,
      tonicityColor,
    };
  }, [duration, cnsScore, compoundSetsCount, sweatRate]);

  return (
    <div className="bg-[#050506] border border-white/10 rounded-sm p-6 relative overflow-hidden space-y-6" id="synaptic-planner-container">
      {/* Visual cybertech design background grids */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,223,0,0.02)_0%,transparent_60%)] pointer-events-none" />
      
      {/* Header section with military spec tags */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[8px] font-mono tracking-[0.25em] text-white/40 uppercase">
            <Activity className="w-3.5 h-3.5 text-gym-accent animate-pulse" />
            SYNAPTIC REFRACTORY ION MATRIX INTERACTION v1.3
          </div>
          <h3 className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-2">
            🧪 ELECTROCHEMICAL SYNAPTIC REPLENISHMENT PLANNER
          </h3>
          <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider">
            Hydration & Osmotic formulation based on motor-unit recruitment and CNS de-polarization.
          </p>
        </div>

        {/* Dynamic status tags */}
        <div className="flex items-center gap-2 font-mono shrink-0">
          <div className="text-right">
            <span className="text-[7px] text-white/30 block uppercase tracking-widest font-bold">REPLENISHMENT TONICITY</span>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-sm border inline-block ${calculations.tonicityColor}`}>
              {calculations.tonicityLabel} ({calculations.osmolarity} mOsm/L)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 cols: Interactive Control Deck */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-black/40 border border-white/5 p-4 rounded-sm space-y-4">
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-[#ffdf00] border-b border-white/5 pb-2">
              <Sliders className="w-3.5 h-3.5" />
              DYNAMIC EXERTION INPUTS
            </div>

            {/* Slider 1: Duration */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-white/60 uppercase flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5 text-white/30" />
                  Training Duration
                </span>
                <span className="text-white font-bold">{duration} min</span>
              </div>
              <input
                type="range"
                min="30"
                max="180"
                step="5"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gym-accent"
              />
              <div className="flex justify-between text-[7px] text-white/20 font-mono uppercase">
                <span>30m (Activation)</span>
                <span>105m (Sub-Maximal)</span>
                <span>180m (Extreme Exhaustion)</span>
              </div>
            </div>

            {/* Selector 2: Ambient Temp / Sweat Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-white/60 uppercase flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-white/30" />
                  Thermal / Sweat Co-efficiency
                </span>
                <span className="text-white font-bold uppercase text-[9px]">{sweatRate} Rate</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(["low", "medium", "high", "extreme"] as const).map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setSweatRate(rate)}
                    className={`p-1.5 text-[8.5px] font-mono font-bold rounded-sm border uppercase transition-all ${
                      sweatRate === rate
                        ? "bg-gym-accent/10 text-gym-accent border-gym-accent"
                        : "bg-black/30 text-white/40 border-white/5 hover:border-white/15 hover:text-white/60"
                    }`}
                  >
                    {rate}
                  </button>
                ))}
              </div>
            </div>

            {/* Scientific disclaimer notes */}
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-sm text-[9px] text-white/45 leading-relaxed space-y-1.5 uppercase font-mono">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <Info className="w-3.5 h-3.5 text-gym-accent" />
                NEURAL SODIUM-POTASSIUM CONTEXT
              </div>
              <p>
                Action potentials propagation across somatic myelinated axons requires extreme sodium influx (<span className="text-white font-bold">Na⁺</span>) followed by potassium efflux (<span className="text-white font-bold">K⁺</span>). 
                Heavy motor recruiting sets (e.g. Back Squats, Deficit Deadlifts) force the Na⁺-K⁺-ATPase pumps to run at 95%+ cellular throughput, draining systemic ion pools rapidly.
              </p>
            </div>
          </div>

          {/* Telemetry reports (estimated neural water retention & action potential speed) */}
          <div className="bg-[#030304] border border-white/5 rounded-sm p-4 space-y-3.5">
            <span className="text-[7.5px] font-mono text-white/30 tracking-widest uppercase block">
              REAL-TIME NEURAL TELEMETRIC ESTIMATIONS
            </span>

            <div className="grid grid-cols-2 gap-4">
              {/* Telemetry Item 1: Synaptic Velocity */}
              <div className="space-y-1.5 border-r border-white/5 pr-2">
                <span className="text-[7px] text-white/30 font-mono uppercase tracking-widest block">Action Firing velocity</span>
                <div className="flex items-end gap-1 font-mono">
                  <span className="text-lg font-black text-white">{calculations.synapticVelocity.toFixed(1)}</span>
                  <span className="text-[8px] text-white/40 font-bold mb-0.5">m/s</span>
                </div>
                {/* Micro trend indicator */}
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-400" 
                    style={{ width: `${(calculations.synapticVelocity / 120) * 100}%` }} 
                  />
                </div>
                <span className="text-[7px] text-[#22c55e] font-mono uppercase tracking-wider block">
                  {calculations.synapticVelocity > 105 ? "■ OPTIMAL STRIKING PHASE" : calculations.synapticVelocity > 90 ? "■ SLIGHTLY ATTENUATED" : "▲ CRITICAL REFRACTORY LAG"}
                </span>
              </div>

              {/* Telemetry Item 2: Water retention */}
              <div className="space-y-1.5 pl-2">
                <span className="text-[7px] text-white/30 font-mono uppercase tracking-widest block">Intra-Neural Hydration</span>
                <div className="flex items-end gap-1 font-mono">
                  <span className="text-lg font-black text-white">{calculations.waterRetention.toFixed(1)}</span>
                  <span className="text-[8px] text-white/40 font-bold mb-0.5">%</span>
                </div>
                {/* Micro trend indicator */}
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400" 
                    style={{ width: `${calculations.waterRetention}%` }} 
                  />
                </div>
                <span className="text-[7px] text-white/30 font-mono uppercase tracking-wider block">
                  STATE: <strong className="text-white">{calculations.cellHydrationState}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 7 cols: Formulation Recipe & Membrane Interactive Visualizer */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Chemical-Schematic Fluid Composition Table */}
          <div className="bg-black/60 border border-white/10 rounded-sm p-4 font-mono space-y-4 relative">
            <span className="text-[8px] text-white/45 tracking-widest uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">
              <CupSoda className="w-3.5 h-3.5 text-gym-accent" />
              SOLUTE BALANCE COEFFICIENTS (TARGET FORMULATION)
            </span>

            <div className="space-y-2.5">
              {/* FLUID TARGET */}
              <div className="flex justify-between items-center text-[11px] hover:bg-white/[0.01] p-1.5 rounded transition-all">
                <span className="text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
                  H₂O Volumetric Carrier
                </span>
                <span className="font-bold text-white text-[13px]">{calculations.fluid} ml</span>
              </div>
              <div className="h-px bg-white/5 w-full" />

              {/* SODIUM */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] p-1.5 hover:bg-white/[0.01] rounded">
                  <span className="text-white font-bold flex items-center gap-2">
                    <span className="text-[9px] bg-red-500/10 border border-red-500/20 text-red-400 px-1 py-0.5 rounded-sm">Na⁺</span>
                    Sodium Ions (Intracellular flow)
                  </span>
                  <span className="text-white font-bold text-[13px]">{calculations.sodium} mg</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-red-400" 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (calculations.sodium / 2200) * 100)}%` }} 
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>

              {/* POTASSIUM */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] p-1.5 hover:bg-white/[0.01] rounded">
                  <span className="text-white font-bold flex items-center gap-2">
                    <span className="text-[9px] bg-violet-500/10 border border-violet-500/20 text-violet-400 px-1 py-0.5 rounded-sm">K⁺</span>
                    Potassium Ions (Hyperpolarization)
                  </span>
                  <span className="text-white font-bold text-[13px]">{calculations.potassium} mg</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-violet-400" 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (calculations.potassium / 800) * 100)}%` }} 
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>

              {/* MAGNESIUM */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] p-1.5 hover:bg-white/[0.01] rounded">
                  <span className="text-white font-bold flex items-center gap-2">
                    <span className="text-[9px] bg-[#ffdf00]/10 border border-[#ffdf00]/25 text-[#ffdf00] px-1 py-0.5 rounded-sm">Mg²⁺</span>
                    Magnesium Ions (Neuromuscular release)
                  </span>
                  <span className="text-[#ffdf00] font-bold text-[13px]">{calculations.magnesium} mg</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gym-accent" 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (calculations.magnesium / 450) * 100)}%` }} 
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>

              {/* CALCIUM */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] p-1.5 hover:bg-white/[0.01] rounded">
                  <span className="text-white font-bold flex items-center gap-2">
                    <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded-sm">Ca²⁺</span>
                    Calcium Solutes (Cross-bridge cycling)
                  </span>
                  <span className="text-white font-bold text-[13px]">{calculations.calcium} mg</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-emerald-400" 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (calculations.calcium / 300) * 100)}%` }} 
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>

            {/* Brewing action instruction card */}
            <div className="mt-4 p-3 bg-gym-accent/5 border border-gym-accent/20 rounded-sm text-[10px] leading-relaxed text-white">
              <span className="text-gym-accent font-black block uppercase mb-1 flex items-center gap-1.5 text-[10.5px]">
                <Zap className="w-3.5 h-3.5 shrink-0 text-gym-accent animate-pulse" />
                TACTICAL CELLULAR REFLUIDIZING DICTUM
              </span>
              <span>
                Combine <strong>{calculations.sodium} mg</strong> Sodium (salt equivalent: roughly 3/10th of a tsp), <strong>{calculations.potassium} mg</strong> Potassium, and <strong>{calculations.magnesium} mg</strong> Magnesium. Mix inside <strong>{calculations.fluid} ml</strong> water. Sip strictly in 75ml increments starting 15 minutes prior to compound lifting blocks to stabilize action-potentials.
              </span>
            </div>
          </div>

          {/* Graphical Representation: Active Neuron Ion Pump Membrane */}
          <div className="bg-[#030304] border border-white/5 rounded-sm p-4 select-none relative h-[180px] flex flex-col justify-between">
            <span className="text-[7.5px] font-mono text-white/30 tracking-widest uppercase block">
              SYNAPTIC MEMBRANE ELECTRO-CHANNELS ACTIVE GRAPHICS
            </span>

            {/* Render direct visual representation of the cell membrane pumping ions */}
            <div className="w-full flex justify-between items-center h-[110px] relative overflow-hidden bg-black/45 border border-white/5 p-2 rounded-sm font-mono text-[8px]">
              {/* Left side: Extracellular fluid */}
              <div className="flex flex-col text-center justify-center space-y-1.5 border-r border-white/5 h-full px-2 w-[80px]">
                <span className="text-red-400 font-bold tracking-widest uppercase text-[7px]">EXTRACELLULAR</span>
                <span className="text-white/60">High Na⁺</span>
                {/* Random floating Na+ nodes representing electrochemical gradient */}
                <div className="flex justify-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/20 text-red-300 font-black text-[6px] flex items-center justify-center border border-red-500/30">Na⁺</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/20 text-red-300 font-black text-[6px] flex items-center justify-center border border-red-500/30">Na⁺</span>
                </div>
              </div>

              {/* Middle: Phospholipid Bilayer Membrane with Firing Ion Channel Pumps */}
              <div className="flex-1 h-full relative flex items-center justify-center">
                {/* Upper Membrane Wall */}
                <div className="absolute top-0 inset-x-4 h-3 bg-white/10 flex justify-between px-2 items-center">
                  {[...Array(6)].map((_, i) => (
                    <span key={i} className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  ))}
                </div>

                {/* Lower Membrane Wall */}
                <div className="absolute bottom-0 inset-x-4 h-3 bg-white/10 flex justify-between px-2 items-center">
                  {[...Array(6)].map((_, i) => (
                    <span key={i} className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  ))}
                </div>

                {/* Ion Channel Pumps with Glowing active flows */}
                <div className="flex gap-8 relative z-10">
                  {/* Na+ Pump (pumps Na+ out, but lets it flow in during depolarization) */}
                  <div className="w-10 h-16 bg-red-950/40 border border-red-500/30 rounded flex flex-col items-center justify-between p-1">
                    <span className="text-red-400 font-black uppercase text-[5.5px]">Na PUMP</span>
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.7)]"
                      animate={{ y: [16, -16] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                    <span className="text-white/30 text-[6px]">DEPOLAR</span>
                  </div>

                  {/* K+ Pump (pumps K+ in, efflux out during repolarization) */}
                  <div className="w-10 h-16 bg-violet-950/40 border border-violet-500/30 rounded flex flex-col items-center justify-between p-1">
                    <span className="text-violet-400 font-black uppercase text-[5.5px]">K PUMP</span>
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                      animate={{ y: [-16, 16] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                    <span className="text-white/30 text-[6px]">REPOLAR</span>
                  </div>
                </div>

                {/* Animated voltage discharge current thread */}
                <div className="absolute inset-x-0 h-px bg-gym-accent/20 flex justify-center items-center pointer-events-none">
                  <span className="absolute w-2 h-2 bg-gym-accent rounded-full blur-[2px] animate-ping" />
                </div>
              </div>

              {/* Right side: Intracellular Fluid */}
              <div className="flex flex-col text-center justify-center space-y-1.5 border-l border-white/5 h-full px-2 w-[80px]">
                <span className="text-violet-400 font-bold tracking-widest uppercase text-[7px]">INTRACELLULAR</span>
                <span className="text-white/60">High K⁺</span>
                {/* Random floating K+ nodes */}
                <div className="flex justify-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500/20 text-violet-300 font-black text-[6px] flex items-center justify-center border border-violet-500/30">K⁺</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500/20 text-violet-300 font-black text-[6px] flex items-center justify-center border border-violet-500/30">K⁺</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[7px] font-mono text-white/30 uppercase tracking-[0.1em]">
              <span>Active Voltage: ~ -70mV (Threshold Firing Ready)</span>
              <span>Pump Phase: ATPase-Hydrolytic Cycle Running</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
