import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Crown, 
  Trophy, 
  Sparkles, 
  Award, 
  Coins, 
  Plus, 
  Check, 
  Lock, 
  Zap, 
  Flame, 
  Activity, 
  Sword, 
  Tv, 
  RefreshCw,
  TrendingUp,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

// Vanguard Imports
import imgVanguardDefault from '../assets/images/vanguard_default_1779362283869.png';
import imgVanguardFlex from '../assets/images/vanguard_flex_1779362302716.png';
import imgVanguardCharge from '../assets/images/vanguard_charge_1779362323371.png';
import imgVanguardRoar from '../assets/images/vanguard_roar_1779362341980.png';

// Neon Striker Imports
import imgNeonStrikerDefault from '../assets/images/neon_striker_1779356868324.png';
import imgNeonStrikerFlex from '../assets/images/neon_striker_flex_1779361070169.png';
import imgNeonStrikerCharge from '../assets/images/neon_striker_charge_1779361086721.png';
import imgNeonStrikerRoar from '../assets/images/neon_striker_roar_1779361103538.png';

// Shadow Hunter Imports
import imgShadowHunterDefault from '../assets/images/shadow_hunter_1779356889743.png';
import imgShadowHunterFlex from '../assets/images/shadow_hunter_flex_1779361122192.png';
import imgShadowHunterCharge from '../assets/images/shadow_hunter_charge_1779361139639.png';
import imgShadowHunterRoar from '../assets/images/shadow_hunter_roar_1779361158854.png';

// Cyber Beast Imports
import imgCyberBeastDefault from '../assets/images/cyber_beast_1779356910976.png';
import imgCyberBeastFlex from '../assets/images/cyber_beast_flex_1779361174893.png';
import imgCyberBeastCharge from '../assets/images/cyber_beast_charge_1779361191878.png';
import imgCyberBeastRoar from '../assets/images/cyber_beast_roar_1779361209673.png';

// Golden Disciple Imports
import imgGoldenDiscipleDefault from '../assets/images/golden_disciple_1779356934562.png';
import imgGoldenDiscipleFlex from '../assets/images/golden_disciple_flex_1779361226424.png';
import imgGoldenDiscipleCharge from '../assets/images/gold_disciple_charge_1779361244052.png';
import imgGoldenDiscipleRoar from '../assets/images/gold_disciple_roar_1779361263799.png';

// Omega Prime Imports
import imgOmegaPrimeDefault from '../assets/images/omega_prime_1779356957034.png';
import imgOmegaPrimeFlex from '../assets/images/omega_prime_flex_1779361283032.png';
import imgOmegaPrimeCharge from '../assets/images/omega_prime_charge_1779361301468.png';
import imgOmegaPrimeRoar from '../assets/images/omega_prime_roar_1779361316201.png';

interface UserProfile {
  displayName?: string;
  photoURL?: string;
  startDate?: string;
  streakCount?: number;
  lastWorkoutDate?: string;
  activeView?: string;
  themeId?: string;
  avatarLevel?: number;
  avatarXp?: number;
  avatarCredits?: number;
  unlockedOutfits?: string[];
  equippedOutfit?: string;
  equippedAura?: string;
  equippedBackItem?: string;
  equippedEmote?: string;
  equippedTitle?: string;
  equippedBanner?: string;
  equippedBorder?: string;
}

interface AvatarPanelProps {
  profile: UserProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  saveSettings: (settings: any) => Promise<void>;
  setToast: (toast: { message: string, type: 'success' | 'pb' | 'info' } | null) => void;
  archivedWorkouts: any[];
}

// Outfits database with matching pre-generated image assets for default/flex/charge/roar positions
const OUTFITS = [
  {
    id: 'vanguard_cadet',
    name: 'Vanguard Cadet',
    description: 'Sleek dark charcoal gym gear cadet. Standard athletic specimen.',
    price: 0,
    image: imgVanguardDefault,
    accentColor: 'from-zinc-400 to-slate-600',
    glowClass: 'shadow-[0_0_20px_rgba(156,163,175,0.25)]',
    poseImages: {
      default: imgVanguardDefault,
      flex_mode: imgVanguardFlex,
      power_charge: imgVanguardCharge,
      savage_roar: imgVanguardRoar
    }
  },
  {
    id: 'neon_striker',
    name: 'Neon Striker',
    description: 'Neon purple glowing heavy-lifter exosuit.',
    price: 6000,
    image: imgNeonStrikerDefault,
    accentColor: 'from-fuchsia-500 to-purple-600',
    glowClass: 'shadow-[0_0_20px_rgba(219,39,119,0.3)]',
    poseImages: {
      default: imgNeonStrikerDefault,
      flex_mode: imgNeonStrikerFlex,
      power_charge: imgNeonStrikerCharge,
      savage_roar: imgNeonStrikerRoar
    }
  },
  {
    id: 'shadow_hunter',
    name: 'Shadow Hunter',
    description: 'Crimson-red tactical active cyborg.',
    price: 12000,
    image: imgShadowHunterDefault,
    accentColor: 'from-rose-500 to-red-700',
    glowClass: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    poseImages: {
      default: imgShadowHunterDefault,
      flex_mode: imgShadowHunterFlex,
      power_charge: imgShadowHunterCharge,
      savage_roar: imgShadowHunterRoar
    }
  },
  {
    id: 'cyber_beast',
    name: 'Cyber Beast',
    description: 'Cyber-teal & ice blue electronic armor.',
    price: 15000,
    image: imgCyberBeastDefault,
    accentColor: 'from-cyan-400 to-teal-600',
    glowClass: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    poseImages: {
      default: imgCyberBeastDefault,
      flex_mode: imgCyberBeastFlex,
      power_charge: imgCyberBeastCharge,
      savage_roar: imgCyberBeastRoar
    }
  },
  {
    id: 'golden_disciple',
    name: 'Golden Disciple',
    description: 'Gleaming physical specimen with solid gold plating.',
    price: 18000,
    image: imgGoldenDiscipleDefault,
    accentColor: 'from-amber-400 to-yellow-600',
    glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    poseImages: {
      default: imgGoldenDiscipleDefault,
      flex_mode: imgGoldenDiscipleFlex,
      power_charge: imgGoldenDiscipleCharge,
      savage_roar: imgGoldenDiscipleRoar
    }
  },
  {
    id: 'omega_prime',
    name: 'Omega Prime',
    description: 'Fully heavy armored mecha cyborg athlete.',
    price: 20000,
    image: imgOmegaPrimeDefault,
    accentColor: 'from-red-600 to-indigo-900',
    glowClass: 'shadow-[0_0_20px_rgba(220,38,38,0.3)]',
    poseImages: {
      default: imgOmegaPrimeDefault,
      flex_mode: imgOmegaPrimeFlex,
      power_charge: imgOmegaPrimeCharge,
      savage_roar: imgOmegaPrimeRoar
    }
  }
];

// Auras with premium, outer glow and custom blended overlay effects
const AURAS = [
  { id: 'none', name: 'No Aura', price: 0, desc: 'Clean focus.' },
  { id: 'void_core', name: 'Void Core', price: 3000, desc: 'Rotating neon purple bio-energy rays.', color: '#a855f7', glow: 'shadow-[0_0_80px_rgba(168,85,247,0.7),_0_0_40px_rgba(168,85,247,0.4)]' },
  { id: 'crimson_flare', name: 'Crimson Flare', price: 4500, desc: 'Continuous explosive fire red flares.', color: '#ef4444', glow: 'shadow-[0_0_80px_rgba(239,68,68,0.73),_0_0_40px_rgba(239,68,68,0.4)]' },
  { id: 'cyber_shard', name: 'Cyber Shard', price: 6000, desc: 'Rotating neon teal digital shields.', color: '#06b6d4', glow: 'shadow-[0_0_80px_rgba(6,182,212,0.7),_0_0_40px_rgba(6,182,212,0.4)]' },
  { id: 'golden_halo', name: 'Golden Crown', price: 8000, desc: 'Brilliant golden high-rank celestial crown.', color: '#eab308', glow: 'shadow-[0_0_90px_rgba(234,179,8,0.85),_0_0_45px_rgba(234,179,8,0.55)]' }
];

// Premium styled overlay elements for the character canvas matching the chosen aura
const AURA_STYLING: Record<string, { outerGlow: string; innerEffects: React.ReactNode }> = {
  none: { outerGlow: '', innerEffects: null },
  void_core: {
    outerGlow: 'shadow-[0_0_90px_rgba(168,85,247,0.65),_0_0_45px_rgba(168,85,247,0.35)] border-purple-500/50',
    innerEffects: (
      <div className="absolute inset-0 pointer-events-none mix-blend-screen scale-110 overflow-hidden">
        {/* Pulsating bio energy core field */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] opacity-45"
             style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)' }} />
        <div className="absolute top-1/4 left-1/4 w-44 h-44 rounded-full border-2 border-dashed border-purple-500/50 animate-orbit filter blur-xs" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full border border-fuchsia-500/35 animate-orbit" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
        {/* Soft floating void particles */}
        <div className="absolute bottom-4 left-10 w-3 h-3 rounded-full bg-purple-400 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute top-12 right-12 w-4 h-4 rounded-full bg-purple-500 animate-pulse" />
      </div>
    )
  },
  crimson_flare: {
    outerGlow: 'shadow-[0_0_90px_rgba(239,68,68,0.65),_0_0_45px_rgba(239,68,68,0.35)] border-red-500/50',
    innerEffects: (
      <div className="absolute inset-0 pointer-events-none mix-blend-color-dodge scale-105 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/25 via-orange-500/20 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-56 opacity-45"
             style={{ background: 'radial-gradient(ellipse at bottom, rgba(239,68,68,0.9) 0%, transparent 85%)' }} />
        {/* Rotating dash lines for energy build-up */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-dashed border-rose-500/60 animate-orbit" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-red-500/30 animate-pulse-slow" />
      </div>
    )
  },
  cyber_shard: {
    outerGlow: 'shadow-[0_0_90px_rgba(6,182,212,0.65),_0_0_45px_rgba(6,182,212,0.35)] border-cyan-500/50',
    innerEffects: (
      <div className="absolute inset-0 pointer-events-none mix-blend-screen scale-105 overflow-hidden">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(#06b6d4 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
        {/* Holographic matrix shields */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 border border-cyan-400/40 rounded-full animate-orbit" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-dashed border-cyan-500/35 animate-orbit" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
        <div className="absolute inset-x-0 h-[3px] bg-cyan-400/50 filter blur-xs" style={{ animation: 'scanline 3s linear infinite' }} />
      </div>
    )
  },
  golden_halo: {
    outerGlow: 'shadow-[0_0_95px_rgba(234,179,8,0.75),_0_0_50px_rgba(234,179,8,0.45)] border-yellow-500/55',
    innerEffects: (
      <div className="absolute inset-0 pointer-events-none mix-blend-color-dodge scale-105 overflow-hidden">
        {/* Heavenly shining crown above head */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-12 transform animate-float z-30" style={{ filter: 'drop-shadow(0 0 16px rgba(254,142,10,0.95))' }}>
          <svg className="w-full h-full" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
            </defs>
            <path 
              d="M10 45 L15 20 L35 32 L50 10 L65 32 L85 20 L90 45 Z" 
              fill="url(#crownGrad)" 
              stroke="#fff" 
              strokeWidth="1.5"
            />
            <rect x="8" y="44" width="84" height="6" fill="#ca8a04" rx="2" stroke="#fef08a" strokeWidth="1" />
            <line x1="12" y1="47" x2="88" y2="47" stroke="#fff" strokeWidth="1.2" strokeDasharray="3 3" />
            
            <circle cx="15" cy="20" r="3.5" fill="#fff" style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
            <circle cx="35" cy="32" r="3" fill="#fff" style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
            <circle cx="50" cy="10" r="4" fill="#fff" style={{ filter: 'drop-shadow(0 0 8px #fff)' }} />
            <circle cx="65" cy="32" r="3" fill="#fff" style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
            <circle cx="85" cy="20" r="3.5" fill="#fff" style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
          </svg>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-yellow-500/20 to-transparent" />
        {/* Floating golden sparkle particles */}
        <div className="absolute w-1.5 h-3 bg-yellow-300 rounded-full animate-ping" style={{ top: '25%', left: '20%', animationDuration: '3s' }} />
        <div className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" style={{ top: '45%', left: '75%', animationDuration: '2s' }} />
        <div className="absolute w-2 h-2.5 bg-yellow-200 rounded-full animate-ping" style={{ top: '65%', left: '15%', animationDuration: '4s' }} />
      </div>
    )
  }
};

// Custom back cosmetic layers
const BACK_ITEMS = [
  { id: 'none', name: 'No Back Item', price: 0, desc: 'Aerodynamic.' },
  { id: 'energy_blade', name: 'Energy Blade', price: 4000, desc: 'An angled neon laser samurai sword.', color: '#ec4899' },
  { id: 'void_shield', name: 'Void Shield', price: 5500, desc: 'A floating holographic defense disk.', color: '#8b5cf6' },
  { id: 'matrix_wings', name: 'Matrix Wings', price: 8000, desc: 'Cybernetic wings with digital neon code.', color: '#10b981' }
];

// Emotes to play screen-wide scanner or lightning effects
const EMOTES = [
  { id: 'none', name: 'No Emote Pose', price: 0, desc: 'Quiet martial stance.' },
  { id: 'flex_mode', name: 'Flex Mode', price: 2000, desc: 'Bodybuilding front battle flex posture.' },
  { id: 'power_charge', name: 'Power Charge', price: 2500, desc: 'Rising physical sparks, squat power stance.' },
  { id: 'savage_roar', name: 'Savage Roar', price: 4000, desc: 'Unshakable roar holding weights high.' }
];

// Display Titles
const TITLES = [
  { id: 'lifter', name: 'Lifter', desc: 'Standard cadet.', price: 0 },
  { id: 'iron_disciple', name: 'Iron Disciple', desc: 'Unbreakable mindset.', price: 2000 },
  { id: 'alpha_titan', name: 'Alpha Titan', desc: 'Unparalleled pure strength.', price: 5000 },
  { id: 'god_of_iron', name: 'God of Iron', desc: 'Ascended beyond physical gravity.', price: 8000 }
];

// Profile banner templates matching current Gym Themes
const BANNERS = [
  { id: 'titan_gold', name: 'Titan Gold Theme', desc: 'Gleaming gold high-rank warrior landscape.', price: 0, bgStyle: 'bg-gradient-to-r from-yellow-950/60 via-[#141005] to-black' },
  { id: 'iron_temple', name: 'Iron Temple Theme', desc: 'Ancient stone & classical brown discipline.', price: 2000, bgStyle: 'bg-gradient-to-br from-amber-950/60 via-[#100c08] to-stone-950' },
  { id: 'neon_pump', name: 'Neon Pump Theme', desc: 'Vaporwave synth-lights & heavy pulses.', price: 2500, bgStyle: 'bg-gradient-to-r from-fuchsia-950/60 via-[#0b0114] to-black' },
  { id: 'beast_mode', name: 'Beast Mode Theme', desc: 'Aggressive crimson shadows & warning fields.', price: 3000, bgStyle: 'bg-gradient-to-bl from-red-950/60 via-[#0c0101] to-black' },
  { id: 'zen_lifter', name: 'Zen Lifter Theme', desc: 'Calming forest green mists & quiet focus.', price: 2500, bgStyle: 'bg-gradient-to-r from-emerald-950/60 via-[#030e06] to-black' },
  { id: 'midnight_city', name: 'Midnight City Theme', desc: 'Late-night sky & cyber teal digital grid.', price: 3000, bgStyle: 'bg-gradient-to-tr from-cyan-950/60 via-[#01091a] to-black' }
];

// Banner Borders aligned with core themes
const BORDERS = [
  { 
    id: 'none', 
    name: 'No border', 
    desc: 'Clean basic interface.', 
    price: 0, 
    cardBorderClass: 'border border-white/10' 
  },
  { 
    id: 'titan_gold', 
    name: 'Titan Gilt Frame', 
    desc: 'Double gold lining, golden stars spinning in solar orbit, and dynamic cascading gold celestial light streaks.', 
    price: 3000, 
    cardBorderClass: 'border-2 border-amber-500/80 shadow-[0_0_25px_rgba(245,158,11,0.25)]',
    cornerElement: (
      <>
        {/* Luminous Diagonal Gold Metallic Sweep */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg z-10">
          <div className="absolute top-0 left-0 w-[300%] h-[300%] bg-gradient-to-br from-transparent via-yellow-400/10 to-transparent transform -translate-x-1/2 -translate-y-1/2 animate-[goldShimmer_4.5s_ease-in-out_infinite]" />
        </div>

        {/* Double Inner Gold borders enclosing entire card */}
        <div className="absolute inset-1.5 border border-yellow-500/15 pointer-events-none z-10" />
        <div className="absolute inset-3 border border-yellow-600/5 pointer-events-none z-10" />
        
        {/* Sparkling Gilded Dust Particles */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden pointer-events-none rounded-b-lg z-10">
          <div className="absolute bottom-2 left-[15%] w-1 h-1 rounded-full bg-yellow-300 animate-[riseSparks_3.2s_infinite]" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-4 left-[35%] w-1.5 h-1.5 rounded-full bg-amber-400 animate-[riseSparks_4s_infinite]" style={{ animationDelay: '1.2s' }} />
          <div className="absolute bottom-1 left-[55%] w-1 h-1 rounded-full bg-yellow-200 animate-[riseSparks_3.6s_infinite]" style={{ animationDelay: '0.6s' }} />
          <div className="absolute bottom-5 left-[75%] w-1.5 h-1.5 rounded-full bg-yellow-400 animate-[riseSparks_4.2s_infinite]" style={{ animationDelay: '1.8s' }} />
          <div className="absolute bottom-2 left-[88%] w-1 h-1 rounded-full bg-yellow-300 animate-[riseSparks_2.8s_infinite]" style={{ animationDelay: '2.4s' }} />
        </div>
        
        {/* Stellar Ornaments Spinning & Pulsating */}
        <div className="absolute top-2 left-2.5 w-5 h-5 text-yellow-400 animate-[starRotate_7s_linear_infinite] z-30 pointer-events-none" style={{ filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.7))' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </svg>
        </div>
        <div className="absolute top-2 right-2.5 w-5 h-5 text-yellow-400 animate-[starRotate_7s_linear_infinite] z-30 pointer-events-none" style={{ filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.7))', animationDelay: '1s' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </svg>
        </div>
        <div className="absolute bottom-2 left-2.5 w-5 h-5 text-yellow-400 animate-[starRotate_7s_linear_infinite] z-30 pointer-events-none" style={{ filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.7))', animationDelay: '2s' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </svg>
        </div>
        <div className="absolute bottom-2 right-2.5 w-5 h-5 text-yellow-400 animate-[starRotate_7s_linear_infinite] z-30 pointer-events-none" style={{ filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.7))', animationDelay: '3s' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </svg>
        </div>

        {/* Polished Gold Corner Bracket Overlays */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-yellow-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] z-30" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] border-yellow-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] z-30" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] border-yellow-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] z-30" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-yellow-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] z-30" />

        {/* Dynamic Gilded Crown Badge */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-yellow-500/10 border border-yellow-400/40 text-[7px] font-mono text-yellow-300 font-extrabold px-3 py-0.5 rounded-full select-none tracking-widest uppercase z-35 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
          GOLD GILT FRAME
        </div>
      </>
    )
  },
  { 
    id: 'iron_temple', 
    name: 'Iron Monolith', 
    desc: 'Heavy-metal bronze fortifications with active magma channels, cascading molten fire flows, and massive rotating hydraulic gear wheels.', 
    price: 3500, 
    cardBorderClass: 'border-2 border-orange-700 shadow-[0_0_35px_rgba(249,115,22,0.55),inset_0_0_20px_rgba(239,68,68,0.35)]',
    cornerElement: (
      <>
        {/* Active Overcharged Molten Border Core Channel flow lines */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent overflow-hidden z-30 pointer-events-none">
          <div className="w-56 h-full bg-gradient-to-r from-transparent via-red-500 to-transparent transform animate-[laserSlideH_2.8s_linear_infinite]" style={{ filter: 'drop-shadow(0 0 8px #f97316)' }} />
        </div>
        <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent overflow-hidden z-30 pointer-events-none">
          <div className="w-56 h-full bg-gradient-to-r from-transparent via-red-500 to-transparent transform animate-[laserSlideH_2.8s_linear_infinite_reverse]" style={{ filter: 'drop-shadow(0 0 8px #f97316)' }} />
        </div>
        <div className="absolute left-0 inset-y-0 w-1 bg-gradient-to-b from-transparent via-orange-500 to-transparent overflow-hidden z-30 pointer-events-none">
          <div className="w-full h-56 bg-gradient-to-b from-transparent via-red-500 to-transparent transform animate-[laserSlideV_2.5s_linear_infinite]" style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
        </div>
        <div className="absolute right-0 inset-y-0 w-1 bg-gradient-to-b from-transparent via-orange-500 to-transparent overflow-hidden z-30 pointer-events-none">
          <div className="w-full h-56 bg-gradient-to-b from-transparent via-red-500 to-transparent transform animate-[laserSlideV_2.5s_linear_infinite_reverse]" style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
        </div>

        {/* Heated Molten Border Flow Overlay */}
        <div className="absolute inset-0 border border-red-500/20 shadow-[inset_0_0_15px_rgba(239,68,68,0.3)] z-10 pointer-events-none" />

        {/* Double Inner Iron Border */}
        <div className="absolute inset-1 border border-stone-800 pointer-events-none z-10" />
        <div className="absolute inset-1.5 border border-[#452715]/45 opacity-70 z-10 pointer-events-none" />
        
        {/* Volcanic Heat Embers Rising (Bigger and more randomized) */}
        <div className="absolute inset-x-0 bottom-0 h-full overflow-hidden pointer-events-none rounded-b-lg z-10">
          <div className="absolute bottom-1 left-[15%] w-2 h-2 rounded-full bg-orange-600 animate-[magmaRise_4.8s_infinite] shadow-[0_0_8px_#f97316]" style={{ animationDelay: '0.2s' }} />
          <div className="absolute bottom-3 left-[35%] w-2.5 h-2.5 rounded-full bg-red-500 animate-[magmaRise_3.5s_infinite] shadow-[0_0_10px_#ef4444]" style={{ animationDelay: '1.2s' }} />
          <div className="absolute bottom-2 left-[55%] w-2 h-2 rounded-full bg-amber-500 animate-[magmaRise_4.2s_infinite] shadow-[0_0_8px_#ea580c]" style={{ animationDelay: '2.4s' }} />
          <div className="absolute bottom-4 left-[75%] w-3 h-3 rounded-full bg-yellow-500 animate-[magmaRise_3.9s_infinite] shadow-[0_0_12px_#fbbf24]" style={{ animationDelay: '0.7s' }} />
          <div className="absolute bottom-1 left-[90%] w-2 h-2 rounded-full bg-orange-500 animate-[magmaRise_4.5s_infinite] shadow-[0_0_8px_#f97316]" style={{ animationDelay: '1.9s' }} />
        </div>

        {/* Steel Gear Rivets in All Four Corners Spinning Hydraulically (Huge & Prominent!) */}
        <div className="absolute top-0.5 left-0.5 w-7 h-7 text-stone-600/95 animate-[gearSpinHuge_9s_linear_infinite] z-35 pointer-events-none" style={{ filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.7))' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.47,5.34 14.86,5.08L14.47,2.42C14.43,2.18 14.22,2 14,2H10C9.78,2 9.57,2.18 9.53,2.42L9.14,5.08C8.53,5.34 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.95C7.96,18.34 8.53,18.66 9.14,18.92L9.53,21.58C9.57,21.82 9.78,22 10,22H14C14.22,22 14.43,21.82 14.47,21.58L14.86,18.92C15.47,18.66 16.04,18.34 16.56,17.95L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
          </svg>
        </div>
        <div className="absolute top-0.5 right-0.5 w-7 h-7 text-stone-600/95 animate-[gearSpinHuge_9s_linear_infinite_reverse] z-35 pointer-events-none" style={{ filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.7))', animationDelay: '1.2s' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.47,5.34 14.86,5.08L14.47,2.42C14.43,2.18 14.22,2 14,2H10C9.78,2 9.57,2.18 9.53,2.42L9.14,5.08C8.53,5.34 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.95C7.96,18.34 8.53,18.66 9.14,18.92L9.53,21.58C9.57,21.82 9.78,22 10,22H14C14.22,22 14.43,21.82 14.47,21.58L14.86,18.92C15.47,18.66 16.04,18.34 16.56,17.95L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
          </svg>
        </div>
        <div className="absolute bottom-0.5 right-0.5 w-7 h-7 text-stone-600/95 animate-[gearSpinHuge_7s_linear_infinite_reverse] z-35 pointer-events-none" style={{ filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.7))', animationDelay: '0.6s' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.47,5.34 14.86,5.08L14.47,2.42C14.43,2.18 14.22,2 14,2H10C9.78,2 9.57,2.18 9.53,2.42L9.14,5.08C8.53,5.34 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.95C7.96,18.34 8.53,18.66 9.14,18.92L9.53,21.58C9.57,21.82 9.78,22 10,22H14C14.22,22 14.43,21.82 14.47,21.58L14.86,18.92C15.47,18.66 16.04,18.34 16.56,17.95L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
          </svg>
        </div>
        <div className="absolute bottom-0.5 left-0.5 w-7 h-7 text-stone-600/95 animate-[gearSpinHuge_7s_linear_infinite] z-35 pointer-events-none" style={{ filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.7))', animationDelay: '1.8s' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.47,5.34 14.86,5.08L14.47,2.42C14.43,2.18 14.22,2 14,2H10C9.78,2 9.57,2.18 9.53,2.42L9.14,5.08C8.53,5.34 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.95C7.96,18.34 8.53,18.66 9.14,18.92L9.53,21.58C9.57,21.82 9.78,22 10,22H14C14.22,22 14.43,21.82 14.47,21.58L14.86,18.92C15.47,18.66 16.04,18.34 16.56,17.95L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
          </svg>
        </div>

        {/* Engraved Ancient Molten Glow Runes - Overcharged & Bright! */}
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex flex-col justify-around h-60 text-amber-700/60 text-[10px] leading-relaxed font-mono select-none tracking-[0.25em] font-black pointer-events-none z-30 animate-[moltenRuneOvert_3s_infinite_ease-in-out]">
          <span>᚛</span><span>᚜</span><span>᚛</span><span>᚜</span><span>᚛</span><span>᚜</span>
        </div>
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col justify-around h-60 text-amber-700/60 text-[10px] leading-relaxed font-mono select-none tracking-[0.25em] font-black pointer-events-none z-30 animate-[moltenRuneOvert_3s_infinite_ease-in-out]" style={{ animationDelay: '1.5s' }}>
          <span>᚛</span><span>᚜</span><span>᚛</span><span>᚜</span><span>᚛</span><span>᚜</span>
        </div>

        {/* Chunky Stone Corner Caps - Styled as Reinforced Steel Braces */}
        <div className="absolute top-0 left-0 w-6 h-[4px] bg-stone-700 z-30" />
        <div className="absolute top-0 left-0 w-[4px] h-6 bg-stone-700 z-30" />
        <div className="absolute top-0 right-0 w-6 h-[4px] bg-stone-700 z-30" />
        <div className="absolute top-0 right-0 w-[4px] h-6 bg-stone-700 z-30" />
        <div className="absolute bottom-0 left-0 w-6 h-[4px] bg-stone-700 z-30" />
        <div className="absolute bottom-0 left-0 w-[4px] h-6 bg-stone-700 z-30" />
        <div className="absolute bottom-0 right-0 w-6 h-[4px] bg-stone-700 z-30" />
        <div className="absolute bottom-0 right-0 w-[4px] h-6 bg-stone-700 z-30" />

        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-orange-500/80 tracking-[0.8em] select-none z-30 font-bold bg-black/60 px-3 py-0.5 rounded border border-orange-600/30">MONOLITH</div>
      </>
    )
  },
  { 
    id: 'neon_pump', 
    name: 'Laser Pulse Vapor', 
    desc: 'Fully wrapping neon glass tube borders with flowing hyper-speed horizontal/vertical laser streams.', 
    price: 4000, 
    cardBorderClass: 'border-2 border-fuchsia-500/90 shadow-[0_0_30px_rgba(217,70,239,0.35)]',
    cornerElement: (
      <>
        {/* Double Laser Ring Glow Frame */}
        <div className="absolute inset-1.5 border border-purple-500/10 pointer-events-none z-10" />
        <div className="absolute -inset-[1px] border border-fuchsia-500/20 rounded-lg animate-pulse-slow z-20 pointer-events-none" />

        {/* Horizontal Moving Laser Beams */}
        <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent overflow-hidden z-30 pointer-events-none">
          <div className="w-48 h-full bg-gradient-to-r from-transparent via-white to-transparent transform animate-[laserSlideH_2.5s_linear_infinite]" />
        </div>
        <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent overflow-hidden z-30 pointer-events-none">
          <div className="w-48 h-full bg-gradient-to-r from-transparent via-white to-transparent transform animate-[laserSlideH_2.5s_linear_infinite_reverse]" />
        </div>

        {/* Vertical Moving Laser Beams */}
        <div className="absolute left-0 inset-y-0 w-[2.5px] bg-gradient-to-b from-transparent via-fuchsia-500 to-transparent overflow-hidden z-30 pointer-events-none">
          <div className="w-full h-48 bg-gradient-to-b from-transparent via-white to-transparent transform animate-[laserSlideV_2.2s_linear_infinite]" />
        </div>
        <div className="absolute right-0 inset-y-0 w-[2.5px] bg-gradient-to-b from-transparent via-purple-500 to-transparent overflow-hidden z-30 pointer-events-none">
          <div className="w-full h-48 bg-gradient-to-b from-transparent via-white to-transparent transform animate-[laserSlideV_2.2s_linear_infinite_reverse]" />
        </div>

        {/* High-Contrast Synth Brackets */}
        <div className="absolute top-1 left-1 w-4.5 h-4.5 border-t-2 border-l-2 border-fuchsia-400 shadow-[0_0_10px_#f500ff] z-30" />
        <div className="absolute top-1 right-1 w-4.5 h-4.5 border-t-2 border-r-2 border-fuchsia-400 shadow-[0_0_10px_#f500ff] z-30" />
        <div className="absolute bottom-1 left-1 w-4.5 h-4.5 border-b-2 border-l-2 border-purple-400 shadow-[0_0_10px_#8b5cf6] z-30" />
        <div className="absolute bottom-1 right-1 w-4.5 h-4.5 border-b-2 border-r-2 border-purple-400 shadow-[0_0_10px_#8b5cf6] z-30" />
      </>
    )
  },
  { 
    id: 'beast_mode', 
    name: 'Berserker Hazard', 
    desc: 'Blazing active red-and-yellow flames licking the bottom with crawling warning chevron danger strips.', 
    price: 4500, 
    cardBorderClass: 'border-2 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.45)]',
    cornerElement: (
      <>
        {/* Magma Inner Heat Overlay */}
        <div className="absolute inset-0 border border-red-500/25 shadow-[inset_0_0_15px_rgba(239,68,68,0.35)] z-10 pointer-events-none" />

        {/* Active Flames Licking the Borders */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-red-600/20 via-orange-500/5 to-transparent pointer-events-none z-15 mix-blend-screen" />
        
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-[85%] h-8 select-none pointer-events-none z-20 flex justify-between px-4 mix-blend-color-dodge opacity-80">
          <div className="w-8 h-8 text-red-500 animate-[fireFlicker_1.8s_infinite]">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C11.19,5.74 9.12,7.3 8.35,8.1C6.1,10.45 6.04,13.9 8.24,16.14C10.44,18.38 13.93,18.42 16.16,16.23C18.39,14.04 18.41,10.55 16.23,8.31C15.91,7.97 15.54,7.68 15.15,7.44C14.47,6.33 13.3,4.19 12,2M12,5.2C12.5,6.5 13.5,8.25 14.1,9.4C14.5,10.4 14.25,12 13.25,12.75C12.25,13.5 11,13.25 10.5,12.25C10,11.25 10.5,9.5 11,8C11.5,8.8 11.6,9.1 11.8,9.4L12,5.2Z"/></svg>
          </div>
          <div className="w-6 h-6 text-orange-400 animate-[fireFlicker_2.2s_infinite]" style={{ animationDelay: '0.4s' }}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C11.19,5.74 9.12,7.3 8.35,8.1C6.1,10.45 6.04,13.9 8.24,16.14C10.44,18.38 13.93,18.42 16.16,16.23C18.39,14.04 18.41,10.55 16.23,8.31C15.91,7.97 15.54,7.68 15.15,7.44C14.47,6.33 13.3,4.19 12,2M12,5.2C12.5,6.5 13.5,8.25 14.1,9.4C14.5,10.4 14.25,12 13.25,12.75C12.25,13.5 11,13.25 10.5,12.25C10,11.25 10.5,9.5 11,8C11.5,8.8 11.6,9.1 11.8,9.4L12,5.2Z"/></svg>
          </div>
          <div className="w-9 h-9 text-yellow-500 animate-[fireFlicker_1.5s_infinite]" style={{ animationDelay: '0.1s' }}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C11.19,5.74 9.12,7.3 8.35,8.1C6.1,10.45 6.04,13.9 8.24,16.14C10.44,18.38 13.93,18.42 16.16,16.23C18.39,14.04 18.41,10.55 16.23,8.31C15.91,7.97 15.54,7.68 15.15,7.44C14.47,6.33 13.3,4.19 12,2M12,5.2C12.5,6.5 13.5,8.25 14.1,9.4C14.5,10.4 14.25,12 13.25,12.75C12.25,13.5 11,13.25 10.5,12.25C10,11.25 10.5,9.5 11,8C11.5,8.8 11.6,9.1 11.8,9.4L12,5.2Z"/></svg>
          </div>
          <div className="w-7 h-7 text-red-500 animate-[fireFlicker_2.0s_infinite]" style={{ animationDelay: '0.6s' }}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C11.19,5.74 9.12,7.3 8.35,8.1C6.1,10.45 6.04,13.9 8.24,16.14C10.44,18.38 13.93,18.42 16.16,16.23C18.39,14.04 18.41,10.55 16.23,8.31C15.91,7.97 15.54,7.68 15.15,7.44C14.47,6.33 13.3,4.19 12,2M12,5.2C12.5,6.5 13.5,8.25 14.1,9.4C14.5,10.4 14.25,12 13.25,12.75C12.25,13.5 11,13.25 10.5,12.25C10,11.25 10.5,9.5 11,8C11.5,8.8 11.6,9.1 11.8,9.4L12,5.2Z"/></svg>
          </div>
        </div>

        {/* Diagonal Warning Chevrons Scrolling on Entire Perimeter */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-[repeating-linear-gradient(45deg,#b91c1c,#b91c1c_10px,#000_10px,#000_20px)] animate-[hazardSlide_1.5s_linear_infinite]" style={{ backgroundSize: '32px 100%' }} />
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-[repeating-linear-gradient(45deg,#b91c1c,#b91c1c_10px,#000_10px,#000_20px)] animate-[hazardSlide_1.5s_linear_infinite_reverse]" style={{ backgroundSize: '32px 100%' }} />
        <div className="absolute left-0 inset-y-0 w-1.5 bg-[repeating-linear-gradient(45deg,#b91c1c,#b91c1c_10px,#000_10px,#000_20px)] animate-[hazardSlide_1.5s_linear_infinite]" style={{ backgroundSize: '100% 32px' }} />
        <div className="absolute right-0 inset-y-0 w-1.5 bg-[repeating-linear-gradient(45deg,#b91c1c,#b91c1c_10px,#000_10px,#000_20px)] animate-[hazardSlide_1.5s_linear_infinite_reverse]" style={{ backgroundSize: '100% 32px' }} />

        {/* WARNING Banner Header */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-red-650 border border-red-500 rounded text-[5px] text-white font-mono font-black tracking-[0.3em] z-30 animate-pulse select-none uppercase">
          BEAST // OVERLOCK_ACTIVE
        </div>

        {/* Industrial Metal Corner Guards */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-red-700 z-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-red-700 z-30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-red-700 z-30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-red-700 z-30 pointer-events-none" />
      </>
    )
  },
  { 
    id: 'zen_lifter', 
    name: 'Emerald Core Shield', 
    desc: 'Crystalline forest energy fields with multi-faceted rotating emerald gemstone corners, glowing eco-synthesized energy grids, and rising mineral crystal shards.', 
    price: 3500, 
    cardBorderClass: 'border-2 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.55),inset_0_0_15px_rgba(16,185,129,0.25)] bg-slate-950/90',
    cornerElement: (
      <>
        {/* Chiseled Geometric Crystal Core Framing */}
        <div className="absolute inset-1 border border-emerald-500/35 rounded-lg pointer-events-none z-10" style={{ clipPath: 'polygon(12px 0px, calc(100% - 12px) 0px, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0px calc(100% - 12px), 0px 12px)' }} />
        <div className="absolute inset-2 border border-dashed border-emerald-400/20 pointer-events-none z-10" />

        {/* Horizontal Moving Green Bio-Pulse Beams */}
        <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent overflow-hidden z-30 pointer-events-none">
          <div className="w-32 h-full bg-gradient-to-r from-transparent via-green-300 to-transparent transform animate-[bioPulseH_3.5s_linear_infinite]" />
        </div>
        <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent overflow-hidden z-30 pointer-events-none">
          <div className="w-32 h-full bg-gradient-to-r from-transparent via-green-300 to-transparent transform animate-[bioPulseH_3.5s_linear_infinite_reverse]" style={{ animationDelay: '1s' }} />
        </div>

        {/* Vertical Moving Green Bio-Pulse Beams */}
        <div className="absolute left-0 inset-y-0 w-[2.5px] bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent overflow-hidden z-30 pointer-events-none">
          <div className="w-full h-32 bg-gradient-to-b from-transparent via-green-300 to-transparent transform animate-[bioPulseV_3.5s_linear_infinite]" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute right-0 inset-y-0 w-[2.5px] bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent overflow-hidden z-30 pointer-events-none">
          <div className="w-full h-32 bg-gradient-to-b from-transparent via-green-300 to-transparent transform animate-[bioPulseV_3.5s_linear_infinite_reverse]" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Rising Faceted Diamond Spark Particles (No more rounded circles) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="absolute bottom-[5%] left-[18%] w-3 h-4 animate-[crystalDrift_5s_infinite]" style={{ '--x-start': '-10px' } as React.CSSProperties}>
            <svg viewBox="0 0 12 16" fill="currentColor" className="text-emerald-400/80 drop-shadow-[0_0_4px_#10b981]">
              <polygon points="6,0 12,8 6,16 0,8" />
            </svg>
          </div>
          <div className="absolute bottom-[10%] left-[38%] w-2 h-3 animate-[crystalDrift_6.2s_infinite]" style={{ animationDelay: '1.5s', '--x-start': '15px' } as React.CSSProperties}>
            <svg viewBox="0 0 12 16" fill="currentColor" className="text-green-300/90 drop-shadow-[0_0_5px_#34d399]">
              <polygon points="6,0 12,8 6,16 0,8" />
            </svg>
          </div>
          <div className="absolute bottom-[15%] left-[62%] w-3.5 h-4.5 animate-[crystalDrift_5.5s_infinite]" style={{ animationDelay: '0.8s', '--x-start': '-20px' } as React.CSSProperties}>
            <svg viewBox="0 0 12 16" fill="currentColor" className="text-emerald-300 drop-shadow-[0_0_6px_#059669]">
              <polygon points="6,0 12,8 6,16 0,8" />
            </svg>
          </div>
          <div className="absolute bottom-[8%] left-[82%] w-2 h-3 animate-[crystalDrift_7s_infinite]" style={{ animationDelay: '2.4s', '--x-start': '25px' } as React.CSSProperties}>
            <svg viewBox="0 0 12 16" fill="currentColor" className="text-teal-300/80 drop-shadow-[0_0_4px_#2dd4bf]">
              <polygon points="6,0 12,8 6,16 0,8" />
            </svg>
          </div>
        </div>
        
        {/* Intricate 3D Faceted Octagonal Emerald Gemstones in All Four Corners (Rotating & Sparking) */}
        <div className="absolute -top-[1px] -left-[1px] w-7 h-7 pointer-events-none z-35 animate-[emeraldGlow_3.5s_infinite_ease-in-out]">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]">
            <polygon points="10,2 22,2 30,10 30,22 22,30 10,30 2,22 2,10" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
            <polygon points="12,6 20,6 26,12 26,20 20,26 12,26 6,20 6,12" fill="#059669" stroke="#a7f3d0" strokeWidth="1" />
            <polygon points="14,10 18,10 22,14 22,18 18,22 14,22 10,18 10,14" fill="#10b981" />
            <line x1="10" y1="2" x2="12" y2="6" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="22" y1="2" x2="20" y2="6" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="30" y1="10" x2="26" y2="12" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="30" y1="22" x2="26" y2="20" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="22" y1="30" x2="20" y2="26" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="10" y1="30" x2="12" y2="26" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="2" y1="22" x2="6" y2="20" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="2" y1="10" x2="6" y2="12" stroke="#d1fae5" strokeWidth="0.75" />
          </svg>
        </div>

        <div className="absolute -top-[1px] -right-[1px] w-7 h-7 pointer-events-none z-35 animate-[emeraldGlow_3.5s_infinite_ease-in-out]" style={{ animationDelay: '0.8s' }}>
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]">
            <polygon points="10,2 22,2 30,10 30,22 22,30 10,30 2,22 2,10" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
            <polygon points="12,6 20,6 26,12 26,20 20,26 12,26 6,20 6,12" fill="#059669" stroke="#a7f3d0" strokeWidth="1" />
            <polygon points="14,10 18,10 22,14 22,18 18,22 14,22 10,18 10,14" fill="#10b981" />
            <line x1="10" y1="2" x2="12" y2="6" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="22" y1="2" x2="20" y2="6" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="30" y1="10" x2="26" y2="12" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="30" y1="22" x2="26" y2="20" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="22" y1="30" x2="20" y2="26" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="10" y1="30" x2="12" y2="26" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="2" y1="22" x2="6" y2="20" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="2" y1="10" x2="6" y2="12" stroke="#d1fae5" strokeWidth="0.75" />
          </svg>
        </div>

        <div className="absolute -bottom-[1px] -left-[1px] w-7 h-7 pointer-events-none z-35 animate-[emeraldGlow_3.5s_infinite_ease-in-out]" style={{ animationDelay: '1.6s' }}>
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]">
            <polygon points="10,2 22,2 30,10 30,22 22,30 10,30 2,22 2,10" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
            <polygon points="12,6 20,6 26,12 26,20 20,26 12,26 6,20 6,12" fill="#059669" stroke="#a7f3d0" strokeWidth="1" />
            <polygon points="14,10 18,10 22,14 22,18 18,22 14,22 10,18 10,14" fill="#10b981" />
            <line x1="10" y1="2" x2="12" y2="6" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="22" y1="2" x2="20" y2="6" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="30" y1="10" x2="26" y2="12" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="30" y1="22" x2="26" y2="20" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="22" y1="30" x2="20" y2="26" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="10" y1="30" x2="12" y2="26" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="2" y1="22" x2="6" y2="20" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="2" y1="10" x2="6" y2="12" stroke="#d1fae5" strokeWidth="0.75" />
          </svg>
        </div>

        <div className="absolute -bottom-[1px] -right-[1px] w-7 h-7 pointer-events-none z-35 animate-[emeraldGlow_3.5s_infinite_ease-in-out]" style={{ animationDelay: '2.4s' }}>
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]">
            <polygon points="10,2 22,2 30,10 30,22 22,30 10,30 2,22 2,10" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
            <polygon points="12,6 20,6 26,12 26,20 20,26 12,26 6,20 6,12" fill="#059669" stroke="#a7f3d0" strokeWidth="1" />
            <polygon points="14,10 18,10 22,14 22,18 18,22 14,22 10,18 10,14" fill="#10b981" />
            <line x1="10" y1="2" x2="12" y2="6" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="22" y1="2" x2="20" y2="6" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="30" y1="10" x2="26" y2="12" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="30" y1="22" x2="26" y2="20" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="22" y1="30" x2="20" y2="26" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="10" y1="30" x2="12" y2="26" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="2" y1="22" x2="6" y2="20" stroke="#d1fae5" strokeWidth="0.75" />
            <line x1="2" y1="10" x2="6" y2="12" stroke="#d1fae5" strokeWidth="0.75" />
          </svg>
        </div>

        {/* Crystalline core top shield indicator banner */}
        <div className="absolute top-1.5 right-4 text-[7px] font-mono text-emerald-400/60 z-30 font-extrabold tracking-[0.2em] select-none bg-black/40 px-2 py-0.5 rounded border border-emerald-500/20">
          SHIELD // ACTIVE
        </div>
      </>
    )
  },
  { 
    id: 'midnight_city', 
    name: 'Telematic Horizon', 
    desc: 'High-voltage cyber teal circuit grids with a dynamic scrolling scanner sweeper bar.', 
    price: 4500, 
    cardBorderClass: 'border-2 border-cyan-500/90 shadow-[0_0_28px_rgba(6,182,212,0.35)]',
    cornerElement: (
      <>
        {/* Dynamic Cyber Sweep Scanning Laser Line */}
        <div className="absolute inset-x-1.5 h-[2px] bg-cyan-400 shadow-[0_0_10px_#06b6d4] z-20 pointer-events-none rounded animate-[cyberSweep_4s_linear_infinite]" />

        {/* Tech Circuit Borders enclosing card */}
        <div className="absolute top-1 inset-x-3 h-[1px] bg-cyan-500/20" />
        <div className="absolute bottom-1 inset-x-3 h-[1px] bg-cyan-500/20" />
        <div className="absolute left-1 inset-y-3 w-[1px] bg-cyan-500/20" />
        <div className="absolute right-1 inset-y-3 w-[1px] bg-cyan-500/20" />

        {/* Telemetry Corner Indicator Dots Blinking */}
        <div className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-[circuitPulse_1.2s_infinite] z-30" />
        <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-[circuitPulse_1.2s_infinite] z-30" style={{ animationDelay: '0.3s' }} />
        <div className="absolute bottom-1.5 left-1.5 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-[circuitPulse_1.2s_infinite] z-30" style={{ animationDelay: '0.6s' }} />
        <div className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-[circuitPulse_1.2s_infinite] z-30" style={{ animationDelay: '0.9s' }} />

        {/* Futuristic Cyber Bracket Caps */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400/80 pointer-events-none z-30" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400/80 pointer-events-none z-30" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400/80 pointer-events-none z-30" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400/80 pointer-events-none z-30" />

        <div className="absolute inset-2 border border-dashed border-cyan-500/15 pointer-events-none z-10" />
      </>
    )
  }
];

export default function AvatarPanel({ profile, setProfile, saveSettings, setToast, archivedWorkouts }: AvatarPanelProps) {
  const [activeTab, setActiveTab] = useState<'customization' | 'auras' | 'emotes' | 'titles' | 'banners' | 'bannerBorders'>('customization');
  const [isClaimingBonus, setIsClaimingBonus] = useState(false);

  // Tab scroll & swipe controls for mobile availability
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollState = () => {
    const el = tabContainerRef.current;
    if (el) {
      setShowLeftArrow(el.scrollLeft > 8);
      setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    }
  };

  useEffect(() => {
    const el = tabContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollState);
      // Run checklist checks once everything handles rendering
      checkScrollState();
      
      // Also listen to window resize
      window.addEventListener('resize', checkScrollState);
      
      const timeoutId = setTimeout(checkScrollState, 200);

      return () => {
        el.removeEventListener('scroll', checkScrollState);
        window.removeEventListener('resize', checkScrollState);
        clearTimeout(timeoutId);
      };
    }
  }, []);

  // When active tab changes, auto-scroll it into view
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeEl = tabContainerRef.current?.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
      checkScrollState();
    }, 120);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const scrollTabsNext = (direction: 'left' | 'right') => {
    const el = tabContainerRef.current;
    if (el) {
      const scrollStep = 200;
      el.scrollBy({
        left: direction === 'left' ? -scrollStep : scrollStep,
        behavior: 'smooth'
      });
    }
  };

  // Safely grab user values with defaults
  const level = profile?.avatarLevel ?? 1;
  const xp = profile?.avatarXp ?? 0;
  const credits = profile?.avatarCredits ?? 100000; // Start with 100,000 for effortless testing!
  const unlockedOutfits = profile?.unlockedOutfits ?? ['vanguard_cadet'];
  const equippedOutfit = profile?.equippedOutfit ?? 'vanguard_cadet';
  const equippedAura = profile?.equippedAura ?? 'none';
  const equippedBackItem = profile?.equippedBackItem ?? 'none';
  const equippedEmote = profile?.equippedEmote ?? 'none';
  const equippedTitle = profile?.equippedTitle ?? 'lifter';
  const equippedBanner = profile?.equippedBanner ?? 'titan_gold';
  const equippedBorder = profile?.equippedBorder ?? 'none';

  // Level XP Helper
  const getXpNeededForLevel = (lvl: number) => {
    return lvl * 500 + 2000;
  };
  const xpNeeded = getXpNeededForLevel(level);
  const xpPercentage = Math.min(100, (xp / xpNeeded) * 100);

  // Determine current Active Outfit
  const activeOutfit = OUTFITS.find(o => o.id === equippedOutfit) || OUTFITS[0];

  // Dynamically map pose image from activeOutfit based on currently equipped emote pose!
  const currentEmotePoseKey = equippedEmote === 'none' ? 'default' : equippedEmote;
  const activeCharacterImage = (activeOutfit.poseImages as any)?.[currentEmotePoseKey] || activeOutfit.image;

  // Dynamically calculate and parse strength metrics from actual workout stats!
  const totalVolume = archivedWorkouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0);
  const totalSetsCount = archivedWorkouts.reduce((sum, w) => sum + (w.totalSets || 0), 0);

  const calcStrength = Math.min(99, Math.max(50, 50 + Math.round(totalVolume / 1500)));
  const calcEndurance = Math.min(99, Math.max(45, 45 + archivedWorkouts.length * 3));
  const calcDiscipline = Math.min(99, Math.max(40, 40 + (profile?.streakCount || 0) * 5));
  const calcRecovery = Math.min(99, Math.max(55, 55 + Math.round(totalSetsCount / 6)));
  const calcConsistency = Math.min(99, Math.max(50, 50 + (profile?.streakCount || 0) * 8));

  // Determine Rank Name based on Level
  const getRankName = (lvl: number) => {
    if (lvl < 5) return 'BRONZE I';
    if (lvl < 10) return 'SILVER III';
    if (lvl < 18) return 'GOLD II';
    if (lvl < 28) return 'PLATINUM II';
    if (lvl < 40) return 'DIAMOND III';
    return 'COSMIC TITAN IV';
  };

  const getRankMilestone = (lvl: number) => {
    if (lvl < 5) return { current: lvl * 300, target: 1500, label: 'SILVER III' };
    if (lvl < 10) return { current: (lvl - 5) * 400, target: 2000, label: 'GOLD II' };
    if (lvl < 18) return { current: (lvl - 10) * 500, target: 4000, label: 'PLATINUM II' };
    if (lvl < 28) return { current: (lvl - 18) * 600, target: 6000, label: 'DIAMOND III' };
    return { current: (lvl - 28) * 800, target: 9600, label: 'COSMIC TITAN IV' };
  };

  const rankName = getRankName(level);
  const rankMeta = getRankMilestone(level);

  // Handle Free Claim of Bonus (to easily evaluate and enjoy the cosmetics system)
  const handleClaimDailyCredits = () => {
    setIsClaimingBonus(true);
    setTimeout(() => {
      const bonusCredits = 100000;
      const bonusXp = 800;
      
      let nextXp = xp + bonusXp;
      let nextLevel = level;
      while (nextXp >= getXpNeededForLevel(nextLevel)) {
        nextXp -= getXpNeededForLevel(nextLevel);
        nextLevel += 1;
      }

      const updatedSettings = {
        avatarCredits: credits + bonusCredits,
        avatarXp: nextXp,
        avatarLevel: nextLevel
      };

      setProfile(prev => prev ? { ...prev, ...updatedSettings } : null);
      saveSettings(updatedSettings);

      setToast({
        message: `🎁 Claimed Testing Pack! +100,000 Coins, +800 XP!`,
        type: 'success'
      });
      setIsClaimingBonus(false);
    }, 800);
  };

  // Helper inside click handlers to buy and equip cosmetics
  const buyOrEquipItem = async (category: typeof activeTab, itemId: string, price: number) => {
    if (category === 'customization') {
      const isAlreadyUnlocked = unlockedOutfits.includes(itemId);
      if (isAlreadyUnlocked) {
        const updated = { equippedOutfit: itemId };
        setProfile(prev => prev ? { ...prev, ...updated } : null);
        await saveSettings(updated);
      } else {
        if (credits < price) {
          return;
        }
        const updated = {
          avatarCredits: credits - price,
          unlockedOutfits: [...unlockedOutfits, itemId],
          equippedOutfit: itemId
        };
        setProfile(prev => prev ? { ...prev, ...updated } : null);
        await saveSettings(updated);
      }
    } 
    else if (category === 'auras') {
      const dbKey = `unlocked_aura_${itemId}`;
      const isUnlocked = itemId === 'none' || (profile as any)?.[dbKey];
      if (isUnlocked) {
        const updated = { equippedAura: itemId };
        setProfile(prev => prev ? { ...prev, ...updated } : null);
        await saveSettings(updated);
      } else {
        if (credits < price) {
          return;
        }
        const updated = {
          avatarCredits: credits - price,
          [dbKey]: true,
          equippedAura: itemId
        };
        setProfile(prev => prev ? { ...prev, ...updated } : null);
        await saveSettings(updated);
      }
    }
    else if (category === 'emotes') {
      const dbKey = `unlocked_emote_${itemId}`;
      const isUnlocked = itemId === 'none' || itemId === 'flex_mode' || (profile as any)?.[dbKey];
      if (isUnlocked) {
        const updated = { equippedEmote: itemId };
        setProfile(prev => prev ? { ...prev, ...updated } : null);
        await saveSettings(updated);
      } else {
        if (credits < price) {
          return;
        }
        const updated = {
          avatarCredits: credits - price,
          [dbKey]: true,
          equippedEmote: itemId
        };
        setProfile(prev => prev ? { ...prev, ...updated } : null);
        await saveSettings(updated);
      }
    }
    else if (category === 'titles') {
      const dbKey = `unlocked_title_${itemId}`;
      const isUnlocked = itemId === 'lifter' || (profile as any)?.[dbKey];
      if (isUnlocked) {
        const updated = { equippedTitle: itemId };
        setProfile(prev => prev ? { ...prev, ...updated } : null);
        await saveSettings(updated);
      } else {
        if (credits < price) {
          return;
        }
        const updated = {
          avatarCredits: credits - price,
          [dbKey]: true,
          equippedTitle: itemId
        };
        setProfile(prev => prev ? { ...prev, ...updated } : null);
        await saveSettings(updated);
      }
    }
    else if (category === 'banners') {
      const dbKey = `unlocked_banner_${itemId}`;
      const isUnlocked = itemId === 'titan_gold' || (profile as any)?.[dbKey];
      if (isUnlocked) {
        const updated = { equippedBanner: itemId };
        setProfile(prev => prev ? { ...prev, ...updated } : null);
        await saveSettings(updated);
      } else {
        if (credits < price) {
          return;
        }
        const updated = {
          avatarCredits: credits - price,
          [dbKey]: true,
          equippedBanner: itemId
        };
        setProfile(prev => prev ? { ...prev, ...updated } : null);
        await saveSettings(updated);
      }
    }
    else if (category === 'bannerBorders') {
      const dbKey = `unlocked_border_${itemId}`;
      const isUnlocked = itemId === 'none' || (profile as any)?.[dbKey];
      if (isUnlocked) {
        const updated = { equippedBorder: itemId };
        setProfile(prev => prev ? { ...prev, ...updated } : null);
        await saveSettings(updated);
      } else {
        if (credits < price) {
          return;
        }
        const updated = {
          avatarCredits: credits - price,
          [dbKey]: true,
          equippedBorder: itemId
        };
        setProfile(prev => prev ? { ...prev, ...updated } : null);
        await saveSettings(updated);
      }
    }
  };

  const getActiveTitle = () => {
    return TITLES.find(t => t.id === equippedTitle) || TITLES[0];
  };

  const getActiveBanner = () => {
    return BANNERS.find(b => b.id === equippedBanner) || BANNERS[0];
  };

  const getActiveBorder = () => {
    return BORDERS.find(b => b.id === equippedBorder) || BORDERS[0];
  };

  const activeAuraStyling = AURA_STYLING[equippedAura] || AURA_STYLING.none;

  return (
    <div className="space-y-8 pb-20 select-none">
      <style>{`
        @keyframes orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes shieldFloat {
          0%, 100% { transform: translate(10px, -50%) scale(1); filter: brightness(1); }
          50% { transform: translate(15px, -53%) scale(1.03); filter: brightness(1.2); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
        @keyframes scanline {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes riseSparks {
          0% { transform: translateY(100%) scale(0.8); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-20%) scale(1.2); opacity: 0; }
        }
        @keyframes rippleWave {
          0% { transform: scale(0.5); opacity: 0.8; border-width: 2px; }
          100% { transform: scale(1.6); opacity: 0; border-width: 0.5px; }
        }
        @keyframes fireFlicker {
          0%, 100% { transform: scale(1) translateY(0); filter: brightness(1.1) blur(0.5px); }
          50% { transform: scale(1.06) translateY(-2px); filter: brightness(1.3) blur(0px); }
        }
        @keyframes cyberSweep {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.9; }
          90% { opacity: 0.9; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes laserSlideH {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes laserSlideV {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes leafSway {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(6deg) scale(1.05); }
        }
        @keyframes goldPulse {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(245,158,11,0.4)) brightness(1); }
          50% { filter: drop-shadow(0 0 18px rgba(251,191,36,0.75)) brightness(1.2); }
        }
        @keyframes hazardSlide {
          0% { background-position: 0px 0px; }
          100% { background-position: 32px 0px; }
        }
        @keyframes circuitPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes starRotate {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.22) rotate(180deg); filter: brightness(1.3) drop-shadow(0 0 10px rgba(245,158,11,0.85)); }
          100% { transform: scale(1) rotate(360deg); }
        }
        @keyframes goldShimmer {
          0% { transform: translate(-150%, -150%) rotate(35deg); }
          100% { transform: translate(150%, 150%) rotate(35deg); }
        }
        @keyframes moltenRune {
          0%, 100% { color: rgba(146, 64, 14, 0.45); text-shadow: 0 0 2px rgba(120, 53, 4, 0.1); filter: brightness(0.9); }
          50% { color: rgba(251, 146, 60, 0.95); text-shadow: 0 0 12px #f97316, 0 0 24px #ef4444; filter: brightness(1.5); }
        }
        @keyframes moltenRuneOvert {
          0%, 100% { color: rgba(220, 38, 38, 0.5); text-shadow: 0 0 3px rgba(120, 30, 10, 0.2); transform: scale(0.95); }
          50% { color: #f97316; text-shadow: 0 0 20px #ff4500, 0 0 35px #ff2500, 0 0 55px #ef4444; transform: scale(1.15) brightness(2.2); }
        }
        @keyframes gearSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes gearSpinHuge {
          0% { transform: scale(1.6) rotate(0deg); filter: drop-shadow(0 0 6px rgba(249,115,22,0.4)); }
          50% { filter: drop-shadow(0 0 15px rgba(249,115,22,0.85)) brightness(1.45); }
          100% { transform: scale(1.6) rotate(360deg); filter: drop-shadow(0 0 6px rgba(249,115,22,0.4)); }
        }
        @keyframes bioPulseH {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes bioPulseV {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes sporeDrift {
          0%, 100% { transform: translate(0, 0) scale(0.8); opacity: 0.15; }
          33% { transform: translate(8px, -18px) scale(1.15); opacity: 0.85; }
          66% { transform: translate(-6px, -32px) scale(0.9); opacity: 0.35; }
        }
        @keyframes magmaRise {
          0% { transform: translateY(110%) scale(0.6) rotate(0deg); opacity: 0; }
          50% { opacity: 0.95; filter: brightness(1.5) drop-shadow(0 0 8px #f97316); }
          100% { transform: translateY(-40%) scale(1.3) rotate(180deg); opacity: 0; }
        }
        @keyframes emeraldGlow {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(5,150,105,0.7)) brightness(0.95); transform: scale(1) rotate(0deg); }
          50% { filter: drop-shadow(0 0 22px rgba(52,211,153,0.95)) brightness(1.4) saturate(1.3); transform: scale(1.18) rotate(15deg); }
        }
        @keyframes crystalDrift {
          0% { transform: translateY(110%) translateX(var(--x-start, 0px)) rotate(0deg) scale(0.5); opacity: 0; }
          50% { opacity: 0.9; filter: drop-shadow(0 0 8px #10b981) brightness(1.25); }
          100% { transform: translateY(-30%) translateX(calc(var(--x-start, 0px) + 25px)) rotate(180deg) scale(1.2); opacity: 0; }
        }
        .animate-orbit {
          animation: orbit 12s linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }
        .animate-shield-float {
          animation: shieldFloat 4s ease-in-out infinite;
        }
      `}</style>

      {/* Header Area with Cyberpunk titles and Top-Right Currency */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <span className="text-[10px] text-gym-accent font-black uppercase tracking-[0.4em] mb-1 block">CYBERPUNK // SERIES 01</span>
          <h2 className="text-4xl font-light italic font-serif text-white tracking-widest leading-none">
            Evolutive <span className="text-gym-accent accent-glow">Avatar</span>
          </h2>
        </div>

        {/* Currency Pill displays */}
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/10 p-3 rounded-lg shadow-inner">
          <div className="flex items-center gap-2 px-3 border-r border-white/10">
            <Coins className="w-4 h-4 text-amber-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[8px] text-white/30 uppercase tracking-widest font-black leading-none">Coins</span>
              <span className="text-sm font-black text-amber-400 font-mono tracking-tight">{credits.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-1">
            <Zap className="w-4 h-4 text-purple-400" />
            <div className="flex flex-col">
              <span className="text-[8px] text-white/30 uppercase tracking-widest font-black leading-none">Level XP</span>
              <span className="text-sm font-black text-purple-400 font-mono tracking-tight">{xp.toLocaleString()} XP</span>
            </div>
          </div>

          <button
            onClick={handleClaimDailyCredits}
            disabled={isClaimingBonus}
            className="ml-2 bg-gym-accent text-black hover:bg-gym-accent-light p-2 rounded-sm transition-all active:scale-90 flex items-center justify-center cursor-pointer disabled:opacity-50"
            title="Claim Daily Training Coins Box!"
          >
            {isClaimingBonus ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* COMBINED HERO SPLIT-GRID: Avatar Showcase Card on the Left, Biometric progression cards stacked on the Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Majestic Avatar Showcase Card (col-span-12 on mobile, col-span-5 on desktop) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className={`relative w-full max-w-[440px] lg:max-w-none aspect-[3/4.2] bg-black/40 ${getActiveBorder().id === 'none' ? 'border border-white/10' : getActiveBorder().cardBorderClass} rounded-lg overflow-hidden flex flex-col justify-between p-7 group transition-all duration-700 shadow-3xl ${activeAuraStyling.outerGlow}`}>
            
            {/* Theme Border Corner Elements */}
            {getActiveBorder().cornerElement}

            {/* Banner Theme Background */}
            <div className={`absolute inset-0 z-0 transition-all duration-700 ${getActiveBanner().bgStyle}`} />

            {/* Hexagonal Tech matrix line overlay patterns */}
            <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-color-dodge z-0 animate-pulse-slow" 
                 style={{ 
                   backgroundImage: 'radial-gradient(ellipse at center, rgba(var(--gym-accent-rgb), 0.25) 0%, transparent 80%)',
                   backgroundSize: 'cover' 
                 }} 
            />

            {/* Japanese Anime Style Side Text */}
            <div className="absolute left-5 top-28 z-10 flex flex-col items-center select-none pointer-events-none opacity-40">
              <span className="text-[9px] text-white/25 tracking-widest font-mono">SERIES 01 // OVERDRIVE</span>
              <div className="w-[1px] h-12 bg-white/15 my-3" />
              <div className="text-[16px] leading-relaxed font-bold font-serif text-gym-accent tracking-[0.25em] writing-mode-v select-none">
                限界を超えろ
              </div>
            </div>

            {/* Render Back cosmetics (wings, sword, shield) behind the central body */}
            {equippedBackItem === 'energy_blade' && (
              <div className="absolute top-12 right-6 z-0 transform translate-x-2 translate-y-4 select-none pointer-events-none animate-float" style={{ filter: 'drop-shadow(0 0 20px #ec4899)' }}>
                <svg width="120" height="260" viewBox="0 0 100 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="80" y1="20" x2="20" y2="220" stroke="#ec4899" strokeWidth="6" strokeLinecap="round" />
                  <line x1="80" y1="20" x2="20" y2="220" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                  <rect x="12" y="200" width="10" height="30" transform="rotate(-40 12 200)" fill="#1f2937" rx="1" />
                  <ellipse cx="20" cy="208" rx="8" ry="4" transform="rotate(-40 20 208)" fill="#ec4899" />
                </svg>
              </div>
            )}

            {equippedBackItem === 'void_shield' && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 z-0 select-none pointer-events-none animate-shield-float" style={{ filter: 'drop-shadow(0 0 18px #8b5cf6)' }}>
                <svg width="130" height="130" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="rgba(139, 92, 246, 0.12)" stroke="#8b5cf6" strokeWidth="3" />
                  <polygon points="50,15 80,30 80,70 50,85 20,70 20,30" fill="none" stroke="rgba(139, 92, 246, 0.45)" strokeWidth="1.2" strokeDasharray="4 4" />
                  <circle cx="50" cy="50" r="16" fill="rgba(255, 255, 255, 0.05)" stroke="#fff" strokeWidth="1" />
                </svg>
              </div>
            )}

            {equippedBackItem === 'matrix_wings' && (
              <div className="absolute inset-x-0 bottom-24 top-12 z-0 opacity-80 select-none pointer-events-none animate-float" style={{ filter: `drop-shadow(0 0 18px #10b981)` }}>
                <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100,80 L15,25 L50,130 L100,105" fill="rgba(16, 185, 129, 0.08)" stroke="#10b981" strokeWidth="2.5" />
                  <line x1="100" y1="80" x2="30" y2="40" stroke="#10b981" strokeWidth="1" strokeDasharray="6 6" />
                  <path d="M100,80 L185,25 L150,130 L100,105" fill="rgba(16, 185, 129, 0.08)" stroke="#10b981" strokeWidth="2.5" />
                  <line x1="100" y1="80" x2="170" y2="40" stroke="#10b981" strokeWidth="1" strokeDasharray="6 6" />
                </svg>
              </div>
            )}

            {/* Top Info overlay details */}
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 block leading-tight">ACTIVE SPECIMEN</span>
                <span className="text-base font-black text-white font-mono tracking-wider">{activeOutfit.name.toUpperCase()}</span>
              </div>
              <div className="flex gap-1.5 items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-400 font-mono">Synced</span>
              </div>
            </div>

            {/* Highly Scaled Central Avatar Body Image Container */}
            <div className="relative w-[92%] aspect-[3/3.8] mx-auto z-10 flex items-center justify-center my-4 overflow-hidden rounded-md border border-white/5 bg-black/40 group-hover:border-gym-accent/40 transition-all duration-500">
              <img 
                src={activeCharacterImage} 
                alt={activeOutfit.name} 
                className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.04] transition-transform duration-700 pointer-events-none select-none"
                referrerPolicy="no-referrer"
              />

              {/* Inner Aura overlay graphics rendered DIRECTLY on top of character image for max intensity */}
              {activeAuraStyling.innerEffects}

              {/* Dynamic visual overlay effects triggered by emote type */}
              {equippedEmote === 'flex_mode' && (
                <div className="absolute inset-0 pointer-events-none z-20">
                  <div className="absolute inset-x-0 h-[2.5px] bg-purple-500/50 filter blur-xs animate-pulse-slow" style={{ animation: 'scanline 4s linear infinite' }} />
                  <div className="absolute inset-0 bg-purple-500/[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(147,51,234,0.18) 1.5px, transparent 1.5px)', backgroundSize: '100% 5px' }} />
                </div>
              )}

              {equippedEmote === 'power_charge' && (
                <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                  <div className="absolute w-1 h-10 rounded-full bg-yellow-400 filter blur-[1px]" style={{ animation: 'riseSparks 2s infinite', left: '20%', animationDelay: '0.2s' }} />
                  <div className="absolute w-1 h-8 rounded-full bg-yellow-300 filter blur-[1px]" style={{ animation: 'riseSparks 1.5s infinite', left: '50%', animationDelay: '0s' }} />
                  <div className="absolute w-1.5 h-12 rounded-full bg-yellow-400 filter blur-[1px]" style={{ animation: 'riseSparks 2.5s infinite', left: '80%', animationDelay: '0.7s' }} />
                </div>
              )}

              {equippedEmote === 'savage_roar' && (
                <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center overflow-hidden">
                  <div className="absolute w-44 h-44 rounded-full border-2 border-red-500/50" style={{ animation: 'rippleWave 3s infinite', animationDelay: '0s' }} />
                  <div className="absolute w-44 h-44 rounded-full border-2 border-orange-500/40" style={{ animation: 'rippleWave 3s infinite', animationDelay: '1.5s' }} />
                </div>
              )}
            </div>

            {/* Character Footer displaying title */}
            <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between">
              <div>
                <span className="text-[8px] uppercase tracking-[0.34em] text-white/30 block leading-tight">Athletic Title</span>
                <span className="text-2xl font-light italic font-serif text-gym-accent tracking-wide leading-none select-none drop-shadow">
                  {getActiveTitle().name.toUpperCase()}
                </span>
                <span className="text-[10px] text-white/40 block mt-1 tracking-normal font-light italic">{getActiveTitle().desc}</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-gym-accent/30 bg-gym-accent/10 flex items-center justify-center shadow-inner">
                <Crown className="w-5 h-5 text-gym-accent" />
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Dynamic Progression and Biometrics block squeezed elegantly next to the card (span-7 on desktop) */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-between gap-6">
          
          {/* Box 1: Profile & Level/XP Status Card */}
          <div className="bg-white/[0.01] border border-white/5 rounded-lg p-6 relative overflow-hidden flex-1 flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Shield className="w-24 h-24 text-white" />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="flex items-center gap-4">
                {/* Micro avatar profile */}
                <div className="relative w-14 h-14 rounded-md border border-gym-accent/45 overflow-hidden flex-shrink-0 bg-black/40">
                  <img 
                    src={activeCharacterImage} 
                    alt="Active Micro Outfit" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-gym-accent transform scale-90 border border-black animate-pulse-slow" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-theme-text uppercase font-mono tracking-wider flex items-center gap-2">
                    {profile?.displayName || "LIFTER_01"}
                  </h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-black leading-snug">
                    Elite Physical Construct
                  </p>
                </div>
              </div>

              {/* Level circle and Exp Bar */}
              <div className="w-full md:w-3/5 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold font-mono text-white/70">
                  <div className="flex items-center gap-2">
                    <span className="bg-gym-accent/10 border border-gym-accent/30 text-gym-accent px-1.5 py-0.5 rounded-sm text-[10px]">
                      LEVEL {level}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/40 font-black">{xp.toLocaleString()} / {xpNeeded.toLocaleString()} XP</span>
                </div>

                {/* XP Progress Slider bar */}
                <div className="relative w-full h-2 bg-white/[0.04] border border-white/10 rounded-full overflow-hidden p-[1px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-400 rounded-full" 
                    style={{ boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)' }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Box 2: Competitive Rank Grid */}
          <div className="bg-white/[0.01] border border-white/5 rounded-lg p-6 overflow-hidden relative flex-1 flex flex-col justify-center">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-950/20 border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  <Trophy className="w-8 h-8 text-fuchsia-400" />
                </div>
                <div>
                  <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black">CURRENT RANK</span>
                  <h4 className="text-2xl font-black text-white font-mono tracking-wider">{rankName}</h4>
                  <p className="text-[10px] text-white/40 block mt-0.5 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-gym-accent" /> {totalVolume.toLocaleString()} Total KG Volume Lifted
                  </p>
                </div>
              </div>

              {/* Rank Progression */}
              <div className="w-full md:w-1/2 space-y-2">
                <div className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">
                  <span>Progress to Next Rank</span>
                  <span className="text-gym-accent font-mono">{rankMeta.label}</span>
                </div>
                
                <div className="relative w-full h-1.5 bg-white/[0.04] border border-white/5 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-gym-accent rounded-full" style={{ width: `${Math.min(100, (rankMeta.current / rankMeta.target) * 100)}%` }} />
                </div>

                <div className="text-right text-[8px] text-white/20 font-black uppercase tracking-wider">
                  {rankMeta.current.toLocaleString()} / {rankMeta.target.toLocaleString()} Power Units
                </div>
              </div>

            </div>
          </div>

          {/* Box 3: Physiological Core metrics block */}
          <div className="bg-white/[0.01] border border-white/5 rounded-lg p-6 flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black">Physiological Core</h4>
                <p className="text-base font-light font-serif italic text-white leading-tight">Biometric Evolution Metrics</p>
              </div>
              <span className="text-[9px] text-gym-accent font-mono font-bold uppercase tracking-widest bg-gym-accent/5 border border-gym-accent/10 px-2 py-1 rounded-sm">
                Active Rating
              </span>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {[
                { label: 'STR', val: calcStrength, icon: Flame, color: 'text-rose-500', desc: 'Volume' },
                { label: 'END', val: calcEndurance, icon: Activity, color: 'text-cyan-400', desc: 'Sessions' },
                { label: 'DIS', val: calcDiscipline, icon: Trophy, color: 'text-amber-400', desc: 'Streak' },
                { label: 'REC', val: calcRecovery, icon: Shield, color: 'text-purple-400', desc: 'Sets' },
                { label: 'CON', val: calcConsistency, icon: Award, color: 'text-emerald-400', desc: 'Logs' }
              ].map((stat, idx) => {
                const IconComp = stat.icon;
                return (
                  <div key={idx} className="bg-white/[0.02] border border-white/5 p-3 rounded-md flex flex-col items-center justify-between text-center group hover:bg-white/[0.04] hover:border-white/15 transition-all">
                    <IconComp className={`w-4 h-4 ${stat.color} mb-2 group-hover:scale-110 transition-transform`} />
                    <span className="text-[10px] text-white/50 uppercase tracking-wider font-extrabold mb-0.5">{stat.label}</span>
                    <span className="text-base font-black font-mono text-white leading-none mb-0.5">{stat.val}</span>
                    <span className="text-[8px] text-white/20 font-black uppercase tracking-tighter leading-none">{stat.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM SECTION: Customization Shop Tabs & Slider */}
      <div className="bg-white/[0.01] border border-white/5 rounded-lg overflow-hidden">
        
        {/* Navigation Categories inside Shop */}
        <div className="relative border-b border-white/5 bg-black/25 flex items-center">
          {/* Scroll Left indicator/button */}
          {showLeftArrow && (
            <button 
              onClick={() => scrollTabsNext('left')}
              className="absolute left-0 inset-y-0 px-2 bg-gradient-to-r from-black/90 via-black/80 to-transparent text-white/60 hover:text-white z-40 flex items-center transition-all cursor-pointer"
              title="Scroll Left"
            >
              <div className="bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 rounded-full p-2.5 shadow-xl active:scale-90 transition-all">
                <ChevronLeft className="w-4 h-4 text-gym-accent" />
              </div>
            </button>
          )}

          {/* Tab lists */}
          <div 
            ref={tabContainerRef}
            className="flex flex-1 overflow-x-auto no-scrollbar scroll-smooth relative"
          >
            {[
              { id: 'customization', label: 'Customization' },
              { id: 'auras', label: 'Auras' },
              { id: 'emotes', label: 'Emotes' },
              { id: 'titles', label: 'Titles' },
              { id: 'banners', label: 'Banners' },
              { id: 'bannerBorders', label: 'Banner Borders' }
            ].map((tab) => (
              <button
                key={tab.id}
                data-active={activeTab === tab.id ? "true" : "false"}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-5 text-xs font-black uppercase tracking-[0.2em] relative cursor-pointer font-sans transition-all flex-shrink-0 ${
                  activeTab === tab.id ? 'text-gym-accent bg-white/[0.01]' : 'text-white/40 hover:text-white/80'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="avatar-shop-active-line"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-gym-accent" 
                  />
                )}
              </button>
            ))}
          </div>

          {/* Scroll Right indicator/button */}
          {showRightArrow && (
            <button 
              onClick={() => scrollTabsNext('right')}
              className="absolute right-0 inset-y-0 px-2 bg-gradient-to-l from-black/90 via-black/80 to-transparent text-white/60 hover:text-white z-40 flex items-center transition-all cursor-pointer"
              title="Scroll Right"
            >
              <div className="bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 rounded-full p-2.5 shadow-xl active:scale-90 transition-all">
                <ChevronRight className="w-4 h-4 text-gym-accent" />
              </div>
            </button>
          )}
        </div>

        {/* Categories rendering grids */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {/* Tab 1: Customization Outfits */}
              {activeTab === 'customization' && OUTFITS.map((outfit) => {
                const isUnlocked = unlockedOutfits.includes(outfit.id);
                const isEquipped = equippedOutfit === outfit.id;
                
                return (
                  <div 
                    key={outfit.id} 
                    onClick={() => buyOrEquipItem('customization', outfit.id, outfit.price)}
                    className={`group/card relative rounded-lg border p-4 bg-black/35 cursor-pointer flex flex-col justify-between h-48 transition-all overflow-hidden ${
                      isEquipped 
                        ? 'border-gym-accent bg-gym-accent/[0.01]' 
                        : isUnlocked 
                          ? 'border-white/10 hover:border-white/30 hover:bg-white/[0.02]' 
                          : 'border-white/5 bg-black/50 opacity-80 hover:opacity-100 hover:border-white/10'
                    }`}
                  >
                    {/* Shadow overlay glow */}
                    <div className={`absolute -bottom-24 -right-24 w-44 h-44 rounded-full bg-gradient-to-r filter blur-3xl opacity-10 transition-opacity group-hover/card:opacity-20 ${outfit.accentColor}`} />

                    <div className="flex gap-4 items-start relative z-10">
                      {/* Item Avatar preview */}
                      <div className="w-20 h-24 rounded-md border border-white/5 overflow-hidden flex-shrink-0 bg-black/40 relative">
                        <img 
                          src={outfit.image} 
                          alt={outfit.name} 
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500" 
                          referrerPolicy="no-referrer"
                        />
                        {!isUnlocked && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Lock className="w-4 h-4 text-white/40" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h5 className="text-white font-black font-sans uppercase tracking-widest text-sm text-theme-text group-hover/card:text-gym-accent transition-colors">{outfit.name}</h5>
                        <p className="text-[10px] text-white/40 line-clamp-3 leading-tight font-light">{outfit.description}</p>
                      </div>
                    </div>

                    {/* Bottom strip inside card */}
                    <div className="border-t border-white/5 pt-3 flex items-center justify-between relative z-10 mt-2">
                      <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Construct</span>
                      
                      <div className="flex items-center gap-2">
                        {isEquipped ? (
                          <div className="bg-gym-accent text-black font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-sm flex items-center gap-1 select-none">
                            <Check className="w-3 h-3 stroke-[3]" /> Equipped
                          </div>
                        ) : isUnlocked ? (
                          <span className="text-[9px] uppercase font-bold text-white/50 tracking-widest group-hover/card:text-white transition-colors">Apply</span>
                        ) : (
                          <div className="bg-white/5 border border-white/10 text-amber-400 font-extrabold text-[10px] font-mono px-3 py-1 rounded-sm flex items-center gap-1 group-hover/card:bg-gym-accent group-hover/card:text-black hover:border-none transition-all">
                            <Coins className="w-3.5 h-3.5" /> {outfit.price.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}

              {/* Tab 2: Auras */}
              {activeTab === 'auras' && AURAS.map((aura) => {
                const dbKey = `unlocked_aura_${aura.id}`;
                const isUnlocked = aura.id === 'none' || (profile as any)?.[dbKey];
                const isEquipped = equippedAura === aura.id;

                return (
                  <div 
                    key={aura.id}
                    onClick={() => buyOrEquipItem('auras', aura.id, aura.price)}
                    className={`relative rounded-lg border p-5 bg-black/35 cursor-pointer flex flex-col justify-between h-44 transition-all overflow-hidden ${
                      isEquipped 
                        ? 'border-gym-accent bg-gym-accent/[0.01]' 
                        : isUnlocked 
                          ? 'border-white/10 hover:border-white/30 hover:bg-white/[0.02]' 
                          : 'border-white/5 bg-black/50 opacity-80 hover:opacity-100 hover:border-white/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-gym-accent animate-pulse" />
                          <h5 className="text-white font-black font-sans uppercase tracking-widest text-sm">{aura.name}</h5>
                        </div>
                        {!isUnlocked && <Lock className="w-3.5 h-3.5 text-white/20" />}
                      </div>
                      <p className="text-[10px] text-white/40 leading-tight font-light mt-1">{aura.desc}</p>
                    </div>

                    <div className="border-t border-white/5 pt-3 flex items-center justify-between mt-auto">
                      <span className="text-[8px] font-mono text-white/25 uppercase tracking-widest">Visual Matrix</span>
                      
                      <div className="flex items-center gap-2">
                        {isEquipped ? (
                          <div className="bg-gym-accent text-black font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-sm flex items-center gap-1 select-none">
                            <Check className="w-3 h-3 stroke-[3]" /> Equipped
                          </div>
                        ) : isUnlocked ? (
                          <span className="text-[9px] uppercase font-bold text-white/50 tracking-widest hover:text-white transition-colors">Equip</span>
                        ) : (
                          <div className="bg-white/5 border border-white/10 text-amber-400 font-extrabold text-[10px] font-mono px-3 py-1 rounded-sm flex items-center gap-1 transition-all">
                            <Coins className="w-3.5 h-3.5" /> {aura.price.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}

              {/* Tab 3: Emotes */}
              {activeTab === 'emotes' && EMOTES.map((emote) => {
                const dbKey = `unlocked_emote_${emote.id}`;
                const isUnlocked = emote.id === 'none' || emote.id === 'flex_mode' || (profile as any)?.[dbKey];
                const isEquipped = equippedEmote === emote.id;

                return (
                  <div 
                    key={emote.id}
                    onClick={() => buyOrEquipItem('emotes', emote.id, emote.price)}
                    className={`relative rounded-lg border p-5 bg-black/35 cursor-pointer flex flex-col justify-between h-44 transition-all overflow-hidden ${
                      isEquipped 
                        ? 'border-gym-accent bg-gym-accent/[0.01]' 
                        : isUnlocked 
                          ? 'border-white/10 hover:border-white/30 hover:bg-white/[0.02]' 
                          : 'border-white/5 bg-black/50 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-gym-accent animate-pulse" />
                          <h5 className="text-white font-black font-sans uppercase tracking-widest text-sm">{emote.name}</h5>
                        </div>
                        {!isUnlocked && <Lock className="w-3.5 h-3.5 text-white/20" />}
                      </div>
                      <p className="text-[10px] text-white/40 leading-tight font-light mt-1">{emote.desc}</p>
                    </div>

                    <div className="border-t border-white/5 pt-3 flex items-center justify-between mt-auto">
                      <span className="text-[8px] font-mono text-white/25 uppercase tracking-widest">Active Pose</span>
                      
                      <div className="flex items-center gap-2">
                        {isEquipped ? (
                          <div className="bg-gym-accent text-black font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-sm flex items-center gap-1 select-none">
                            <Check className="w-3 h-3 stroke-[3]" /> Active
                          </div>
                        ) : isUnlocked ? (
                          <span className="text-[9px] uppercase font-bold text-white/50 tracking-widest hover:text-white transition-colors">Equip</span>
                        ) : (
                          <div className="bg-white/5 border border-white/10 text-amber-400 font-extrabold text-[10px] font-mono px-3 py-1 rounded-sm flex items-center gap-1 transition-all">
                            <Coins className="w-3.5 h-3.5" /> {emote.price.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}

              {/* Tab 4: Titles */}
              {activeTab === 'titles' && TITLES.map((title) => {
                const dbKey = `unlocked_title_${title.id}`;
                const isUnlocked = title.id === 'lifter' || (profile as any)?.[dbKey];
                const isEquipped = equippedTitle === title.id;

                return (
                  <div 
                    key={title.id}
                    onClick={() => buyOrEquipItem('titles', title.id, title.price)}
                    className={`relative rounded-lg border p-5 bg-black/35 cursor-pointer flex flex-col justify-between h-44 transition-all overflow-hidden ${
                      isEquipped 
                        ? 'border-gym-accent bg-gym-accent/[0.01]' 
                        : isUnlocked 
                          ? 'border-white/10 hover:border-white/30 hover:bg-white/[0.02]' 
                          : 'border-white/5 bg-black/50 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-gym-accent" />
                          <h5 className="text-white font-black font-sans uppercase tracking-widest text-sm">{title.name}</h5>
                        </div>
                        {!isUnlocked && <Lock className="w-3.5 h-3.5 text-white/20" />}
                      </div>
                      <p className="text-[10px] text-white/40 leading-tight font-light mt-1">{title.desc}</p>
                    </div>

                    <div className="border-t border-white/5 pt-3 flex items-center justify-between mt-auto">
                      <span className="text-[8px] font-mono text-white/25 uppercase tracking-widest">Hologram Label</span>
                      
                      <div className="flex items-center gap-2">
                        {isEquipped ? (
                          <div className="bg-gym-accent text-black font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-sm flex items-center gap-1 select-none">
                            <Check className="w-3 h-3 stroke-[3]" /> Equipped
                          </div>
                        ) : isUnlocked ? (
                          <span className="text-[9px] uppercase font-bold text-white/50 tracking-widest hover:text-white transition-colors">Equip</span>
                        ) : (
                          <div className="bg-white/5 border border-white/10 text-amber-400 font-extrabold text-[10px] font-mono px-3 py-1 rounded-sm flex items-center gap-1 transition-all">
                            <Coins className="w-3.5 h-3.5" /> {title.price.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}

              {/* Tab 5: Banners */}
              {activeTab === 'banners' && BANNERS.map((banner) => {
                const dbKey = `unlocked_banner_${banner.id}`;
                const isUnlocked = banner.id === 'titan_gold' || (profile as any)?.[dbKey];
                const isEquipped = equippedBanner === banner.id;

                return (
                  <div 
                    key={banner.id}
                    onClick={() => buyOrEquipItem('banners', banner.id, banner.price)}
                    className={`relative rounded-lg border p-5 bg-black/35 cursor-pointer flex flex-col justify-between h-44 transition-all overflow-hidden ${
                      isEquipped 
                        ? 'border-gym-accent bg-gym-accent/[0.01]' 
                        : isUnlocked 
                          ? 'border-white/10 hover:border-white/30 hover:bg-white/[0.02]' 
                          : 'border-white/5 bg-black/50 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Tv className="w-4 h-4 text-gym-accent" />
                          <h5 className="text-white font-black font-sans uppercase tracking-widest text-sm">{banner.name}</h5>
                        </div>
                        {!isUnlocked && <Lock className="w-3.5 h-3.5 text-white/20" />}
                      </div>
                      <p className="text-[10px] text-white/40 leading-tight font-light mt-1">{banner.desc}</p>
                    </div>

                    <div className="border-t border-white/5 pt-3 flex items-center justify-between mt-auto">
                      <span className="text-[8px] font-mono text-white/25 uppercase tracking-widest">Card Grid Banner</span>
                      
                      <div className="flex items-center gap-2">
                        {isEquipped ? (
                          <div className="bg-gym-accent text-black font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-sm flex items-center gap-1 select-none">
                            <Check className="w-3 h-3 stroke-[3]" /> Active
                          </div>
                        ) : isUnlocked ? (
                          <span className="text-[9px] uppercase font-bold text-white/50 tracking-widest hover:text-white transition-colors">Equip</span>
                        ) : (
                          <div className="bg-white/5 border border-white/10 text-amber-400 font-extrabold text-[10px] font-mono px-3 py-1 rounded-sm flex items-center gap-1 transition-all">
                            <Coins className="w-3.5 h-3.5" /> {banner.price.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}

              {/* Tab 6: Banner Borders */}
              {activeTab === 'bannerBorders' && BORDERS.map((borderItem) => {
                const dbKey = `unlocked_border_${borderItem.id}`;
                const isUnlocked = borderItem.id === 'none' || (profile as any)?.[dbKey];
                const isEquipped = equippedBorder === borderItem.id;

                return (
                  <div 
                    key={borderItem.id}
                    onClick={() => buyOrEquipItem('bannerBorders', borderItem.id, borderItem.price)}
                    className={`relative rounded-lg border p-5 bg-black/35 cursor-pointer flex flex-col justify-between h-44 transition-all overflow-hidden ${
                      isEquipped 
                        ? 'border-gym-accent bg-gym-accent/[0.01]' 
                        : isUnlocked 
                          ? 'border-white/10 hover:border-white/30 hover:bg-white/[0.02]' 
                          : 'border-white/5 bg-black/50 opacity-80 hover:opacity-100 font-light'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-gym-accent" />
                          <h5 className="text-white font-black font-sans uppercase tracking-widest text-sm">{borderItem.name}</h5>
                        </div>
                        {!isUnlocked && <Lock className="w-3.5 h-3.5 text-white/20" />}
                      </div>
                      <p className="text-[10px] text-white/40 leading-tight font-light mt-1">{borderItem.desc}</p>
                    </div>

                    <div className="border-t border-white/5 pt-3 flex items-center justify-between mt-auto">
                      <span className="text-[8px] font-mono text-white/25 uppercase tracking-widest">Frame border</span>
                      
                      <div className="flex items-center gap-2">
                        {isEquipped ? (
                          <div className="bg-gym-accent text-black font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-sm flex items-center gap-1 select-none">
                            <Check className="w-3 h-3 stroke-[3]" /> Equipped
                          </div>
                        ) : isUnlocked ? (
                          <span className="text-[9px] uppercase font-bold text-white/50 tracking-widest hover:text-white transition-colors">Equip</span>
                        ) : (
                          <div className="bg-white/5 border border-white/10 text-amber-400 font-extrabold text-[10px] font-mono px-3 py-1 rounded-sm flex items-center gap-1 transition-all">
                            <Coins className="w-3.5 h-3.5" /> {borderItem.price.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
