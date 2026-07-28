import React from "react";
import { motion } from "motion/react";

interface AnimatedDividerProps {
  className?: string;
  accentColor?: string; // e.g. "#D4AF37" or "var(--gym-accent, #D4AF37)"
  glowIntensity?: "subtle" | "medium" | "high";
  speed?: number; // duration in seconds
}

export const AnimatedDivider: React.FC<AnimatedDividerProps> = ({
  className = "",
  accentColor = "var(--gym-accent, #D4AF37)",
  glowIntensity = "medium",
  speed = 4,
}) => {
  const glowShadow =
    glowIntensity === "high"
      ? "0 0 12px var(--gym-accent, #D4AF37), 0 0 20px var(--gym-accent, #D4AF37)"
      : glowIntensity === "medium"
      ? "0 0 8px var(--gym-accent, #D4AF37)"
      : "0 0 4px var(--gym-accent, #D4AF37)";

  return (
    <div className={`relative w-full h-[1px] overflow-hidden my-2 ${className}`}>
      {/* Baseline static track */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Breathing ambient central glow */}
      <motion.div
        animate={{
          opacity: [0.2, 0.6, 0.2],
          scaleX: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          backgroundColor: accentColor,
          boxShadow: glowShadow,
        }}
        className="absolute inset-y-0 left-1/4 right-1/4 h-full blur-[1px] opacity-40"
      />

      {/* Laser scanline energy pulse traveling left to right */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accentColor} 40%, #ffffff 50%, ${accentColor} 60%, transparent 100%)`,
          boxShadow: glowShadow,
        }}
        className="absolute top-0 bottom-0 w-1/2 h-full opacity-90"
      />

      {/* Micro tech nodes / edge highlights */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white/20" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white/20" />
    </div>
  );
};

export default AnimatedDivider;
