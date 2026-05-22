import React, { useState, useRef, useEffect } from 'react';
import { TransparentCharacter } from './TransparentCharacter';
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

// Shadow Wraith and Lumen Sentinel Generated Imports
import imgShadowWraithDefault from '../assets/images/shadow_wraith_cyber_1779445357447.png';
import imgShadowWraithFlex from '../assets/images/shadow_wraith_flex_1779446074058.png';
import imgShadowWraithCharge from '../assets/images/shadow_wraith_charge_1779446090352.png';
import imgShadowWraithRoar from '../assets/images/shadow_wraith_roar_1779446108786.png';
import imgShadowWraithFinal from '../assets/images/wraith_supreme_final_v2_1779449842798.png';

import imgLumenSentinelDefault from '../assets/images/lumen_sentinel_cyber_1779445373875.png';
import imgLumenSentinelFlex from '../assets/images/lumen_sentinel_flex_1779446141435.png';
import imgLumenSentinelCharge from '../assets/images/lumen_sentinel_charge_1779446157202.png';
import imgLumenSentinelRoar from '../assets/images/lumen_sentinel_roar_1779446173501.png';
import imgLumenSentinelFinal from '../assets/images/lumen_sentinel_final_1779446190633.png';

// Newly generated Final Forms
import imgVanguardFinal from '../assets/images/vanguard_final_1779446997564.png';
import imgNeonStrikerFinal from '../assets/images/neon_striker_final_1779447016669.png';
import imgShadowHunterFinal from '../assets/images/shadow_hunter_final_1779447034179.png';
import imgCyberBeastFinal from '../assets/images/cyber_beast_final_1779447049772.png';
import imgGoldenDiscipleFinal from '../assets/images/golden_disciple_final_1779447066274.png';
import imgOmegaPrimeFinal from '../assets/images/omega_prime_final_1779447085411.png';

// Text-free character class landscape banners
import imgBannerVanguardCadet from '../assets/images/banner_vanguard_cadet_1779449260585.png';
import imgBannerNeonStriker from '../assets/images/banner_neon_striker_1779449278463.png';
import imgBannerShadowHunter from '../assets/images/banner_shadow_hunter_1779449294320.png';
import imgBannerCyberBeast from '../assets/images/banner_cyber_beast_1779449309358.png';
import imgBannerGoldenDisciple from '../assets/images/banner_golden_disciple_1779449325883.png';
import imgBannerOmegaPrime from '../assets/images/banner_omega_prime_mech_1779449344526.png';
import imgBannerPhantomWraith from '../assets/images/banner_phantom_wraith_v3_1779451441624.png';
import imgBannerLumenSentinel from '../assets/images/banner_lumen_sentinel_1779449818555.png';


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
      savage_roar: imgVanguardRoar,
      final_form: imgVanguardFinal
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
      savage_roar: imgNeonStrikerRoar,
      final_form: imgNeonStrikerFinal
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
      savage_roar: imgShadowHunterRoar,
      final_form: imgShadowHunterFinal
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
      savage_roar: imgCyberBeastRoar,
      final_form: imgCyberBeastFinal
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
      savage_roar: imgGoldenDiscipleRoar,
      final_form: imgGoldenDiscipleFinal
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
      savage_roar: imgOmegaPrimeRoar,
      final_form: imgOmegaPrimeFinal
    }
  },
  {
    id: 'shadow_wraith',
    name: 'Phantom Wraith',
    description: 'Mysterious smoked-out phantom cyborg cloaked in deep shadow arrays and crimson visors.',
    price: 16000,
    image: imgShadowWraithDefault,
    accentColor: 'from-zinc-800 to-black',
    glowClass: 'shadow-[0_0_25px_rgba(24,24,27,0.7)]',
    poseImages: {
      default: imgShadowWraithDefault,
      flex_mode: imgShadowWraithFlex,
      power_charge: imgShadowWraithCharge,
      savage_roar: imgShadowWraithRoar,
      final_form: imgShadowWraithFinal
    }
  },
  {
    id: 'lumen_sentinel',
    name: 'Lumen Sentinel',
    description: 'Pristine, high-tech white cyber paladin with glowing cyan highlights.',
    price: 18000,
    image: imgLumenSentinelDefault,
    accentColor: 'from-zinc-100 via-white to-sky-100',
    glowClass: 'shadow-[0_0_25px_rgba(255,255,255,0.6)] border border-white/20',
    poseImages: {
      default: imgLumenSentinelDefault,
      flex_mode: imgLumenSentinelFlex,
      power_charge: imgLumenSentinelCharge,
      savage_roar: imgLumenSentinelRoar,
      final_form: imgLumenSentinelFinal
    }
  }
];

// Auras with premium, outer glow and custom blended overlay effects
const AURAS = [
  { id: 'none', name: 'No Aura', price: 0, desc: 'Clean focus.' },
  { id: 'void_core', name: 'Void Core', price: 3000, desc: 'Rotating neon purple bio-energy rays.', color: '#a855f7', glow: 'shadow-[0_0_110px_rgba(168,85,247,0.95),_0_0_55px_rgba(168,85,247,0.6),inset_0_0_25px_rgba(168,85,247,0.4)]' },
  { id: 'emerald_overdrive', name: 'Emerald Overdrive', price: 5000, desc: 'High-density pulsing green techno-organic bio-fields.', color: '#10b981', glow: 'shadow-[0_0_110px_rgba(16,185,129,0.95),_0_0_55px_rgba(16,185,129,0.6),inset_0_0_25px_rgba(16,185,129,0.4)]' },
  { id: 'crimson_flare', name: 'Crimson Flare', price: 4500, desc: 'Continuous explosive fire red flares.', color: '#ef4444', glow: 'shadow-[0_0_110px_rgba(239,68,68,0.95),_0_0_55px_rgba(239,68,68,0.6),inset_0_0_25px_rgba(239,68,68,0.4)]' },
  { id: 'hyper_blue_plasma', name: 'Hyper Blue Plasma', price: 5500, desc: 'High-frequency blue thermonuclear electrical fields.', color: '#3b82f6', glow: 'shadow-[0_0_110px_rgba(59,130,246,0.95),_0_0_55px_rgba(59,130,246,0.6),inset_0_0_25px_rgba(59,130,246,0.4)]' },
  { id: 'cyber_shard', name: 'Cyber Shard', price: 6000, desc: 'Rotating neon teal digital shields.', color: '#06b6d4', glow: 'shadow-[0_0_110px_rgba(6,182,212,0.95),_0_0_55px_rgba(6,182,212,0.6),inset_0_0_25px_rgba(6,182,212,0.4)]' },
  { id: 'golden_halo', name: 'Golden Crown', price: 8000, desc: 'Brilliant golden high-rank celestial crown.', color: '#eab308', glow: 'shadow-[0_0_120px_rgba(234,179,8,1),_0_0_60px_rgba(234,179,8,0.7),inset_0_0_30px_rgba(234,179,8,0.45)]' },
  { id: 'shadow_smoke', name: 'Shadow Smoke', price: 9000, desc: 'Deep, dense whispering kinetic shadow mists.', color: '#0c0a0f', glow: 'shadow-[0_0_120px_rgba(0,0,0,1),_0_0_60px_rgba(24,24,35,0.9),inset_0_0_25px_rgba(0,0,0,0.5)]' },
  { id: 'aether_light', name: 'Aetheric Light', price: 8000, desc: 'Pure solar-white electromagnetic light radiating sacred beams.', color: '#ffffff', glow: 'shadow-[0_0_120px_rgba(255,255,255,0.85),_0_0_60px_rgba(244,244,245,0.75),inset_0_0_25px_rgba(255,255,255,0.4)]' }
];

// Premium styled overlay elements for the character canvas matching the chosen aura
const AURA_STYLING: Record<string, { outerGlow: string; innerEffects: React.ReactNode }> = {
  none: { outerGlow: '', innerEffects: null },
  void_core: {
    outerGlow: 'shadow-[0_0_120px_rgba(168,85,247,0.95),_0_0_60px_rgba(168,85,247,0.6)] border-purple-500/70',
    innerEffects: (
      <div className="absolute inset-0 pointer-events-none mix-blend-screen scale-110 overflow-hidden">
        {/* Pulsating bio energy core field */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-65"
             style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.7) 0%, transparent 65%)' }} />
        <div className="absolute top-1/4 left-1/4 w-44 h-44 rounded-full border-2 border-dashed border-purple-400 animate-orbit filter blur-xs" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full border-2 border-fuchsia-400 animate-orbit" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
        {/* Soft floating void particles */}
        <div className="absolute bottom-4 left-10 w-4 h-4 rounded-full bg-purple-300 animate-ping opacity-80" style={{ animationDuration: '2s' }} />
        <div className="absolute top-12 right-12 w-5 h-5 rounded-full bg-purple-400 animate-pulse" />
      </div>
    )
  },
  emerald_overdrive: {
    outerGlow: 'shadow-[0_0_120px_rgba(16,185,129,0.95),_0_0_60px_rgba(16,185,129,0.6)] border-emerald-500/70',
    innerEffects: (
      <div className="absolute inset-0 pointer-events-none mix-blend-screen scale-110 overflow-hidden">
        {/* Pulsating bio energy core field */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-65"
             style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.7) 0%, transparent 65%)' }} />
        {/* Moving organic Green bio-pulses and grids */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full border-2 border-dashed border-emerald-400 animate-orbit filter blur-xs" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/2 left-1/4 w-[252px] h-[252px] rounded-full border-2 border-emerald-500/70 animate-orbit" style={{ animationDuration: '5s', animationDirection: 'reverse' }} />
        {/* Rising diamond particles */}
        <div className="absolute bottom-4 left-16 w-3.5 h-3.5 rounded-full bg-emerald-400 animate-pulse opacity-85" />
        <div className="absolute top-16 right-16 w-5 h-5 rounded-full bg-green-400 animate-ping opacity-85" style={{ animationDuration: '1.8s' }} />
      </div>
    )
  },
  crimson_flare: {
    outerGlow: 'shadow-[0_0_120px_rgba(239,68,68,0.95),_0_0_60px_rgba(239,68,68,0.6)] border-red-500/70',
    innerEffects: (
      <div className="absolute inset-0 pointer-events-none mix-blend-color-dodge scale-105 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/35 via-orange-500/30 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-56 opacity-65"
             style={{ background: 'radial-gradient(ellipse at bottom, rgba(239,68,68,0.95) 0%, transparent 80%)' }} />
        {/* Rotating dash lines for energy build-up */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-dashed border-rose-500 animate-orbit" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-red-500/40 animate-pulse-slow" />
      </div>
    )
  },
  hyper_blue_plasma: {
    outerGlow: 'shadow-[0_0_120px_rgba(59,130,246,0.95),_0_0_60px_rgba(59,130,246,0.6)] border-blue-500/70',
    innerEffects: (
      <div className="absolute inset-0 pointer-events-none mix-blend-color-dodge scale-110 overflow-hidden">
        {/* Intense blue thermal core */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] opacity-70"
             style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.75) 0%, transparent 65%)' }} />
        {/* Blue plasma circles and sweeps */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 border-2 border-blue-400 rounded-full animate-orbit" style={{ animationDuration: '7s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-68 h-68 border-2 border-dashed border-sky-400/60 animate-orbit" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
        <div className="absolute top-10 left-12 w-4.5 h-4.5 rounded-full bg-blue-300 animate-ping opacity-85" style={{ animationDuration: '2.4s' }} />
        <div className="absolute bottom-16 right-16 w-3.5 h-3.5 rounded-full bg-cyan-400 animate-pulse opacity-90" />
      </div>
    )
  },
  cyber_shard: {
    outerGlow: 'shadow-[0_0_120px_rgba(6,182,212,0.95),_0_0_60px_rgba(6,182,212,0.6)] border-cyan-500/70',
    innerEffects: (
      <div className="absolute inset-0 pointer-events-none mix-blend-screen scale-105 overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#06b6d4 2.5px, transparent 2.5px)', backgroundSize: '16px 16px' }} />
        {/* Holographic matrix shields */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 border-2 border-cyan-400/60 rounded-full animate-orbit" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-2 border-dashed border-cyan-500/50 animate-orbit" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
        <div className="absolute inset-x-0 h-[4px] bg-cyan-400/70 filter blur-xs" style={{ animation: 'scanline 2.5s linear infinite' }} />
      </div>
    )
  },
  golden_halo: {
    outerGlow: 'shadow-[0_0_130px_rgba(234,179,8,1),_0_0_65px_rgba(234,179,8,0.7)] border-yellow-500/75',
    innerEffects: (
      <div className="absolute inset-0 pointer-events-none mix-blend-color-dodge scale-105 overflow-hidden">
        {/* Heavenly shining crown above head */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-12 transform animate-float z-30" style={{ filter: 'drop-shadow(0 0 22px rgba(254,142,10,1))' }}>
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
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-yellow-500/35 to-transparent" />
        {/* Floating golden sparkle particles */}
        <div className="absolute w-2 h-4 bg-yellow-300 rounded-full animate-ping opacity-90" style={{ top: '25%', left: '20%', animationDuration: '3s' }} />
        <div className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-90" style={{ top: '45%', left: '75%', animationDuration: '2s' }} />
        <div className="absolute w-2.5 h-3.5 bg-yellow-200 rounded-full animate-ping opacity-90" style={{ top: '65%', left: '15%', animationDuration: '4s' }} />
      </div>
    )
  },
  shadow_smoke: {
    outerGlow: 'shadow-[0_0_120px_rgba(0,0,0,1),_0_0_60px_rgba(15,23,42,0.95)] border-zinc-900/90 animate-[smokyAuraPulse_4s_infinite]',
    innerEffects: (
      <div className="absolute inset-0 pointer-events-none mix-blend-normal overflow-hidden bg-black/15">
        {/* Soft swirling background glow - transparent in the center, framing the avatar */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] opacity-85"
             style={{ background: 'radial-gradient(circle, transparent 20%, rgba(12,10,16,0.25) 45%, rgba(15,15,23,0.7) 75%, rgba(2,2,3,0.95) 100%)' }} />

        {/* Swirling deep smoke vortex SVG layers (Toned down and expanded to not block the center character) */}
        <div className="absolute inset-0 flex items-center justify-center animate-spin" style={{ animationDuration: '32s' }}>
          <svg className="w-full h-full opacity-15 filter blur-lg transform scale-125" viewBox="0 0 200 200" fill="none">
            <path d="M40,100 C40,60 80,40 100,50 C120,40 160,60 160,100 C160,140 120,160 100,150 C80,160 40,140 40,100 Z" fill="#0f172a" />
            <path d="M50,100 C50,70 70,50 100,60 C130,50 150,70 150,100 C150,130 130,150 100,140 C70,150 50,130 50,100 Z" fill="#020617" />
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center animate-spin" style={{ animationDuration: '22s', animationDirection: 'reverse' }}>
          <svg className="w-full h-full opacity-12 filter blur-xl transform scale-135" viewBox="0 0 200 200" fill="none">
            <path d="M60,100 C60,50 90,30 100,40 C110,30 140,50 140,100 C140,150 110,170 100,160 C90,170 60,150 60,100 Z" fill="#18181b" />
          </svg>
        </div>

        {/* Rising kinetic particles & smoke bubbles */}
        <div className="absolute bottom-2 left-1/4 w-24 h-24 bg-zinc-950 rounded-full filter blur-xl animate-[smokeDrift_4.5s_infinite]" style={{ '--x-start': '-15px' } as React.CSSProperties} />
        <div className="absolute bottom-4 left-1/2 w-32 h-32 bg-black rounded-full filter blur-xl animate-[smokeDrift_6s_infinite]" style={{ '--x-start': '15px' } as React.CSSProperties} />
        <div className="absolute bottom-1 left-2/3 w-20 h-20 bg-slate-950 rounded-full filter blur-xl animate-[smokeDrift_3.8s_infinite]" style={{ '--x-start': '-25px' } as React.CSSProperties} />
        <div className="absolute bottom-8 left-1/3 w-28 h-28 bg-stone-950 rounded-full filter blur-xl animate-[smokeDrift_5s_infinite]" style={{ '--x-start': '20px' } as React.CSSProperties} />

        {/* Dark embers floating upwards inside the aura */}
        <div className="absolute bottom-6 left-[25%] w-2 h-2 bg-slate-600 rounded-full animate-[riseSparks_4.5s_infinite] opacity-35" style={{ animationDelay: '0.2s' }} />
        <div className="absolute bottom-[15%] left-[70%] w-1.5 h-1.5 bg-zinc-700 rounded-full animate-[riseSparks_3s_infinite] opacity-45" style={{ animationDelay: '1.2s' }} />
        <div className="absolute bottom-[5%] left-[50%] w-2.5 h-2.5 bg-stone-800 rounded-full animate-[riseSparks_5.2s_infinite] opacity-30" style={{ animationDelay: '2s' }} />
      </div>
    )
  },
  aether_light: {
    outerGlow: 'shadow-[0_0_120px_rgba(255,255,255,1),_0_0_60px_rgba(244,244,245,0.85)] border-white/60 animate-pulseSlow',
    innerEffects: (
      <div className="absolute inset-0 pointer-events-none mix-blend-screen overflow-hidden bg-white/[0.03]">
        {/* Luminous border framing overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] opacity-90"
             style={{ background: 'radial-gradient(circle, transparent 15%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.18) 75%, rgba(255,255,255,0.35) 100%)' }} />

        {/* Solar geometry / shining laser lines */}
        <div className="absolute inset-0 flex items-center justify-center animate-spin" style={{ animationDuration: '45s' }}>
          <svg className="w-full h-full opacity-25 filter blur-[2px] transform scale-110" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="42" stroke="#ffffff" strokeWidth="0.75" strokeDasharray="8 8" />
            <circle cx="50" cy="50" r="30" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="2 4" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="6 6" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="6 6" />
          </svg>
        </div>

        {/* Pure geometric stardust rising */}
        <div className="absolute bottom-4 left-1/4 w-1.5 h-1.5 bg-white filter blur-xs animate-[riseSparks_4s_infinite]" style={{ animationDelay: '0.1s' }} />
        <div className="absolute bottom-8 left-1/2 w-2 h-2 bg-white filter blur-xs animate-[riseSparks_3s_infinite]" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-2 left-[78%] w-1 h-1 bg-sky-200 filter blur-xs animate-[riseSparks_5s_infinite]" style={{ animationDelay: '0.7s' }} />
        <div className="absolute bottom-10 left-[62%] w-2 h-2 bg-zinc-100 filter blur-[0.5px] animate-[riseSparks_3.6s_infinite]" style={{ animationDelay: '2.2s' }} />

        {/* Bright cross highlights sparkling */}
        <div className="absolute top-[20%] left-[25%] animate-pulse" style={{ animationDuration: '2.5s' }}>
          <svg className="w-3.5 h-3.5 text-white/50" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2 L14,10 L22,12 L14,14 L12,22 L10,14 L2,12 L10,10 Z" />
          </svg>
        </div>
        <div className="absolute top-[60%] left-[80%] animate-pulse" style={{ animationDuration: '3.8s', animationDelay: '1.2s' }}>
          <svg className="w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2 L14,10 L22,12 L14,14 L12,22 L10,14 L2,12 L10,10 Z" />
          </svg>
        </div>
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
  { id: 'savage_roar', name: 'Savage Roar', price: 4000, desc: 'Unshakable roar holding weights high.' },
  { id: 'final_form', name: 'Final Form', price: 7500, desc: 'Ultimate localized power overload. High-frequency electrical neon field.' }
];

// Display Titles
const TITLES = [
  // Free / Starters / Cadet
  { id: 'lifter', name: 'Lifter', desc: 'Standard cadet.', price: 0 },

  // Funny "Bad at Gym" Titles (Budget Tier)
  { id: 'gym_tourist', name: 'Gym Tourist', desc: 'Scrolls phone for 15 minutes between sets on the only bench press.', price: 250 },
  { id: 'cardio_clown', name: 'Cardio Clown', desc: 'Violently avoids all weight plates. Treadmill is their home.', price: 500 },
  { id: 'ego_lifter', name: 'Ego Lifter', desc: 'No parallel squat depth. High-volume warning vocal grunts.', price: 750 },
  { id: 'shaker_chemist', name: 'Shaker Chemist', desc: 'Has 4 shaker cups, 8 powders, and 0 actual PR lifts.', price: 1000 },
  { id: 'bench_napper', name: 'Bench Napper', desc: 'Has set a sleeping bag up on the adjustable flat bench.', price: 1250 },

  // Cool Gym Core Titles (Serious Tier)
  { id: 'pump_lord', name: 'Pump Lord', desc: 'Vessels filled with fully optimized aesthetic lactic acid.', price: 1500 },
  { id: 'iron_disciple', name: 'Iron Disciple', desc: 'Unbreakable mindset.', price: 2000 },
  { id: 'pr_prophet', name: 'PR Prophet', desc: 'Foresees future records and bends bars to manifest them.', price: 3500 },
  { id: 'quadzilla', name: 'Quadzilla', desc: 'Unbelievable leg-day dimensions causing local seismic events.', price: 4500 },
  { id: 'alpha_titan', name: 'Alpha Titan', desc: 'Unparalleled pure strength.', price: 5000 },
  { id: 'barbell_beast', name: 'Barbell Beast', desc: 'Gnaws on steel plates for dynamic pre-workout nutrition.', price: 6500 },
  { id: 'god_of_iron', name: 'God of Iron', desc: 'Ascended beyond physical gravity.', price: 8000 },
  { id: 'plates_eater', name: 'Plate Eater', desc: 'Stacks forty-fives like hotcakes and devours gravity.', price: 12000 }
];

// Final Form styling configurations matching the character ID
const FINAL_FORM_THEMES: Record<string, { color: string; glow: string; particles: string; bannerText: string; overlayGradient: string }> = {
  vanguard_cadet: { color: '#9ca3af', glow: 'shadow-[0_0_90px_rgba(156,163,175,0.9),_0_0_45px_rgba(156,163,175,0.6)]', particles: '#9ca3af', bannerText: 'CADET // LIMIT BREAK', overlayGradient: 'from-zinc-400/20 to-transparent' },
  neon_striker: { color: '#d946ef', glow: 'shadow-[0_0_100px_rgba(217,70,239,1),_0_0_50px_rgba(217,70,239,0.7)]', particles: '#d946ef', bannerText: 'STRIKER // NEON FORCE', overlayGradient: 'from-fuchsia-500/30 to-transparent' },
  shadow_hunter: { color: '#f43f5e', glow: 'shadow-[0_0_100px_rgba(244,63,94,1),_0_0_50px_rgba(244,63,94,0.7)]', particles: '#f43f5e', bannerText: 'HUNTER // DOOMSDAY OVERDRIVE', overlayGradient: 'from-rose-500/30 to-transparent' },
  cyber_beast: { color: '#06b6d4', glow: 'shadow-[0_0_100px_rgba(6,182,212,1),_0_0_50px_rgba(6,182,212,0.7)]', particles: '#06b6d4', bannerText: 'BEAST // RYU_OVERDRIVE', overlayGradient: 'from-cyan-400/30 to-transparent' },
  golden_disciple: { color: '#fbbf24', glow: 'shadow-[0_0_120px_rgba(251,191,36,1),_0_0_60px_rgba(251,191,36,0.75)]', particles: '#fbbf24', bannerText: 'DISCIPLE // SOLAR ASCENT', overlayGradient: 'from-amber-400/35 to-transparent' },
  omega_prime: { color: '#ef4444', glow: 'shadow-[0_0_130px_rgba(239,68,68,1),_0_0_65px_rgba(239,68,68,0.85)]', particles: '#ef4444', bannerText: 'PRIME // GALAXY MONARCH', overlayGradient: 'from-red-500/35 to-transparent' },
  shadow_wraith: { color: '#09090b', glow: 'shadow-[0_0_130px_rgba(15,23,42,1),_0_0_65px_rgba(24,24,27,0.95),inset_0_0_30px_rgba(0,0,0,0.8)] border-slate-900', particles: '#18181b', bannerText: 'WRAITH // VOID SHADOW OVERDRIVE', overlayGradient: 'from-zinc-950/50 to-transparent' },
  lumen_sentinel: { color: '#ffffff', glow: 'shadow-[0_0_130px_rgba(255,255,255,1),_0_0_65px_rgba(244,244,245,0.85),inset_0_0_30px_rgba(255,255,255,0.3)] border-white/80', particles: '#cbd5e1', bannerText: 'SENTINEL // AETHER LIMIT BREAK', overlayGradient: 'from-white/25 to-transparent' }
};

// Unique interactive pets mapped to character outfits
export const PETS_DATA: Record<string, {
  name: string;
  type: string;
  desc: string;
  color: string;
  glow: string;
  buff: string;
  sprite: React.ReactNode;
}> = {
  vanguard_cadet: {
    name: "Spot-X9",
    type: "Tactical Gear Hound",
    desc: "A hyper-dense cyber-canine engineered with adaptive mechanical gears and carbon fiber armor. Fetches chalk, projects precision real-time bar-path laser targets, and scans biometric strain.",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.45)",
    buff: "+12% Bar-Path Telemetry Precision",
    sprite: (
      <div className="relative animate-float" style={{ animationDuration: '3.2s' }}>
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer futuristic tech circle */}
          <circle cx="50" cy="50" r="45" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 6" className="opacity-40 animate-spin" style={{ animationDuration: '16s' }} />
          
          {/* Dog body - Sleek futuristic tactical plate style */}
          <path d="M22,58 H64 L54,78 H28 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" strokeLinejoin="miter" />
          <path d="M34,58 L40,48 H58 L52,58" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
          
          {/* Tactical cyber collar */}
          <rect x="56" y="44" width="6" height="12" rx="1.5" fill="#38bdf8" className="animate-pulse" />
          
          {/* Mechanical Legs with detailed joints & feet */}
          {/* Front leg */}
          <line x1="28" y1="78" x2="22" y2="92" stroke="#38bdf8" strokeWidth="2.5" />
          <circle cx="28" cy="78" r="2" fill="#fff" />
          <rect x="18" y="90" width="7" height="3" rx="1" fill="#0ea5e9" />
          
          {/* Second front leg */}
          <line x1="38" y1="78" x2="42" y2="92" stroke="#0ea5e9" strokeWidth="2.5" />
          <circle cx="38" cy="78" r="2" fill="#38bdf8" />
          <rect x="39" y="90" width="7" height="3" rx="1" fill="#38bdf8" />
          
          {/* Rear Leg 1 */}
          <line x1="46" y1="78" x2="42" y2="92" stroke="#0ea5e9" strokeWidth="2.5" />
          <circle cx="46" cy="78" r="2" fill="#38bdf8" />
          
          {/* Rear Leg 2 */}
          <line x1="52" y1="78" x2="58" y2="92" stroke="#38bdf8" strokeWidth="2.5" />
          <circle cx="52" cy="78" r="2" fill="#fff" />
          <rect x="55" y="90" width="7" height="3" rx="1" fill="#0ea5e9" />

          {/* Robo Head profile with glowing laser scanning visor */}
          <path d="M60,32 H80 L74,54 H62 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
          {/* Glowing Red laser scanner visor */}
          <path d="M72,36 L81,42 L77,48 L70,44 Z" fill="#ef4444" className="animate-pulse" />
          <line x1="74" y1="41" x2="94" y2="49" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" />

          {/* Exhaust booster pipe on back */}
          <rect x="16" y="52" width="10" height="6" rx="1" fill="#334155" stroke="#38bdf8" strokeWidth="1.5" transform="rotate(-20 16 52)" />
          {/* Floating animated propulsion spark */}
          <circle cx="10" cy="62" r="3" fill="#f97316" className="animate-ping" />

          {/* Rhythmic telemetry radar sweep indicator on top */}
          <circle cx="50" cy="50" r="30" fill="none" stroke="#0284c7" strokeWidth="0.75" strokeDasharray="10 90" className="animate-spin" style={{ animationDuration: '2.5s' }} />
        </svg>
      </div>
    )
  },
  neon_striker: {
    name: "Vapor-Moth",
    type: "Synth Flutterer",
    desc: "A bioluminescent cyber-lepidopteran designed to generate rhythm-synchronized electric airwaves. Emits soothing vaporwave frequencies that optimize muscle pump cadence.",
    color: "#d946ef",
    glow: "rgba(217,70,239,0.45)",
    buff: "+15% Rhythm Cadence Sync",
    sprite: (
      <div className="relative animate-float" style={{ animationDuration: '2.5s' }}>
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50,50 L20,20 C10,30 10,70 50,50 Z" fill="rgba(217,70,239,0.3)" stroke="#d946ef" strokeWidth="2" className="animate-wings-flutter origin-right" />
          <path d="M50,50 L30,40 C25,45 25,65 50,50 Z" fill="rgba(244,63,94,0.4)" stroke="#f43f5e" strokeWidth="1.5" className="animate-wings-flutter origin-right" />
          <path d="M50,50 L80,20 C90,30 90,70 50,50 Z" fill="rgba(217,70,239,0.3)" stroke="#d946ef" strokeWidth="2" className="animate-wings-flutter origin-left" />
          <path d="M50,50 L70,40 C75,45 75,65 50,50 Z" fill="rgba(244,63,94,0.4)" stroke="#f43f5e" strokeWidth="1.5" className="animate-wings-flutter origin-left" />
          <rect x="47" y="30" width="6" height="40" rx="3" fill="#1e1b4b" stroke="#d946ef" strokeWidth="1.5" />
          <circle cx="50" cy="25" r="4" fill="#f43f5e" />
          <line x1="50" y1="25" x2="42" y2="12" stroke="#d946ef" strokeWidth="1.5" />
          <line x1="50" y1="25" x2="58" y2="12" stroke="#d946ef" strokeWidth="1.5" />
          <circle cx="42" cy="12" r="2" fill="#d946ef" />
          <circle cx="58" cy="12" r="2" fill="#d946ef" />
        </svg>
      </div>
    )
  },
  shadow_hunter: {
    name: "Pyrogore-X9",
    type: "Thermo Plasma Demon",
    desc: "A high-intensity thermodynamic plasma familiar that hovers with micro-thrusters. Absorbs excess cardiac heat, channels metabolic kinetics, and emits glowing superheated pulses to amplify lifting explosive velocity.",
    color: "#f43f5e",
    glow: "rgba(244,63,94,0.45)",
    buff: "+14% Hot-Zone Blast Off Force",
    sprite: (
      <div className="relative animate-float" style={{ animationDuration: '2.9s' }}>
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Flame Orbit field */}
          <circle cx="50" cy="50" r="44" stroke="rgba(244,63,94,0.2)" strokeWidth="1" strokeDasharray="4 8" className="animate-spin" style={{ animationDuration: '10s' }} />
          <circle cx="50" cy="50" r="32" stroke="rgba(244,63,94,0.15)" strokeWidth="1" />
          
          {/* Main Core Body */}
          <g>
            {/* Plasma Back Shell */}
            <path d="M50,15 C68,30 74,54 66,75 C58,88 42,88 34,75 C26,54 32,30 50,15 Z" fill="url(#plasmaGrad)" stroke="#f43f5e" strokeWidth="2.5" />
            
            {/* Internal hot reactor core */}
            <circle cx="50" cy="56" r="14" fill="#0f172a" stroke="#fb923c" strokeWidth="1.5" />
            <circle cx="50" cy="56" r="8" fill="#fef08a" className="animate-pulse" />

            {/* Sharp Cybernetic Demonic Horns */}
            <path d="M42,26 L30,12 L38,32 Z" fill="#e11d48" stroke="#f43f5e" strokeWidth="1" />
            <path d="M58,26 L70,12 L62,32 Z" fill="#e11d48" stroke="#f43f5e" strokeWidth="1" />

            {/* Glowing Cyber visor/eyes */}
            <polygon points="40,46 48,46 46,50 38,50" fill="#fdba74" className="animate-pulse" />
            <polygon points="60,46 52,46 54,50 62,50" fill="#fdba74" className="animate-pulse" />

            {/* Floating Kinetic Energy Wings */}
            <path d="M28,48 L10,38 L22,62 Z" fill="rgba(244,63,94,0.3)" stroke="#f43f5e" strokeWidth="1" className="animate-wings-flutter origin-right" />
            <path d="M72,48 L90,38 L78,62 Z" fill="rgba(244,63,94,0.3)" stroke="#f43f5e" strokeWidth="1" className="animate-wings-flutter origin-left" />

            {/* Tail */}
            <path d="M50,80 Q50,95 38,94" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" className="animate-wiggle origin-top" />
            <polygon points="38,94 44,91 40,88" fill="#f43f5e" />
          </g>

          <defs>
            <radialGradient id="plasmaGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="1" />
              <stop offset="60%" stopColor="#be123c" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e1114" stopOpacity="0.5" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    )
  },
  cyber_beast: {
    name: "Scylla-V",
    type: "Subgrid Leviathan",
    desc: "A bio-integrated synthetic deep-sea predator that breathes oxygenated subgrid data. Keeps high-density system components cool, filters core noise, and accelerates thermic output safety.",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.45)",
    buff: "+18% Thermic Regulation Efficiency",
    sprite: (
      <div className="relative animate-float" style={{ animationDuration: '3.8s' }}>
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Glowing bio-luminescent subgrid water rings */}
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(6,182,212,0.15)" strokeWidth="3" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="1" strokeDasharray="6 12" className="animate-spin" style={{ animationDuration: '8s' }} />
          
          {/* Futuristic mechanical shark/serpent body */}
          <g>
            {/* Upper body / Jaw flow */}
            <path d="M15,44 Q35,28 65,34 L85,46 L65,58 Q35,64 15,48 Z" fill="#0c4a6e" stroke="#06b6d4" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M45,39 L60,42 L52,48 Z" fill="#082f49" />

            {/* Glowing cyber gills */}
            <line x1="42" y1="44" x2="42" y2="52" stroke="#22d3ee" strokeWidth="2.5" className="animate-pulse" />
            <line x1="48" y1="43" x2="48" y2="53" stroke="#22d3ee" strokeWidth="2.5" className="animate-pulse" />
            <line x1="54" y1="44" x2="54" y2="52" stroke="#22d3ee" strokeWidth="2.5" className="animate-pulse" />

            {/* Hydrodynamic dorsal fin */}
            <polygon points="52,34 72,12 66,34" fill="#082f49" stroke="#06b6d4" strokeWidth="1.5" />
            
            {/* Glowing neon stabilizers (Pectoral fins) */}
            <polygon points="34,54 20,72 26,56" fill="#0284c7" stroke="#06b6d4" strokeWidth="1.5" />
            <polygon points="46,54 36,76 38,55" fill="#22d3ee" stroke="#22d3ee" strokeWidth="1" />

            {/* Glowing digital slit optical eye */}
            <circle cx="74" cy="42" r="3" fill="#22d3ee" className="animate-pulse" />
            <line x1="74" y1="42" x2="88" y2="44" stroke="#e0f2fe" strokeWidth="1" />

            {/* Interactive electric particle spark orbiting body */}
            <g className="animate-circle-orbit" style={{ animationDuration: '2.5s' }}>
              <circle cx="50" cy="50" r="4" fill="#22d3ee" style={{ filter: 'drop-shadow(0 0 6px #22d3ee)' }} />
            </g>
          </g>

          {/* Bio-metric pressure bubble generators */}
          <circle cx="28" cy="22" r="2" fill="#22d3ee" className="animate-ping" style={{ animationDelay: '0.4s' }} />
          <circle cx="78" cy="74" r="1.5" fill="#06b6d4" className="animate-ping" style={{ animationDelay: '1.2s' }} />
        </svg>
      </div>
    )
  },
  golden_disciple: {
    name: "Sol-Aethelon",
    type: "Nebula Solar Phoenix",
    desc: "A magnificent trans-dimensional avian forged from solid aurum lattice and subgrid solar flares. Channels mental fortitudes, elevates willpower barriers, and emits ultra-high spectrum victory flares.",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.45)",
    buff: "+16% Dynamic Willpower Threshold",
    sprite: (
      <div className="relative animate-float" style={{ animationDuration: '2.7s' }}>
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Backing golden halo ring */}
          <circle cx="50" cy="46" r="38" stroke="rgba(251,191,36,0.25)" strokeWidth="1" strokeDasharray="12 4" className="animate-spin" style={{ animationDuration: '24s' }} />
          <circle cx="50" cy="46" r="28" stroke="rgba(251,191,36,0.15)" strokeWidth="1.5" />

          {/* Majestic Crystalline Golden Wings (Animated) */}
          <path d="M50,42 L12,14 C6,24 10,64 50,52 Z" fill="url(#goldWingGrad)" stroke="#fbbf24" strokeWidth="1.5" className="animate-wings-flutter origin-right" />
          <path d="M50,42 L88,14 C94,24 90,64 50,52 Z" fill="url(#goldWingGrad)" stroke="#fbbf24" strokeWidth="1.5" className="animate-wings-flutter origin-left" />
          
          {/* Inner secondary wing feathers */}
          <path d="M50,42 L24,24 Q20,38 50,48 Z" fill="rgba(245,158,11,0.5)" stroke="#f59e0b" strokeWidth="1" className="animate-wings-flutter origin-right" />
          <path d="M50,42 L76,24 Q80,38 50,48 Z" fill="rgba(245,158,11,0.5)" stroke="#f59e0b" strokeWidth="1" className="animate-wings-flutter origin-left" />

          {/* Phoenix Crystalline Body & Tail */}
          <g>
            {/* Long elegant neck and central sleek gold torso */}
            <path d="M50,22 L55,42 L52,78 L48,78 L45,42 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" strokeLinejoin="round" />
            
            {/* Crowned phoenix head profile with glowing solar aura */}
            <circle cx="50" cy="20" r="6" fill="#fef08a" stroke="#fbbf24" strokeWidth="1.5" />
            {/* Crown Crest Feathers */}
            <path d="M48,14 L50,4 L52,14 L49,14" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
            <path d="M43,16 L41,9 L47,16" fill="#f59e0b" />
            <path d="M57,16 L59,9 L53,16" fill="#f59e0b" />

            {/* Glowing red divine eye */}
            <circle cx="50" cy="20" r="1.5" fill="#f43f5e" />

            {/* Glowing Core Sunburst Gem on chest */}
            <polygon points="50,34 53,40 58,42 53,44 50,50 47,44 42,42 47,40" fill="#fff" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 4px #fff)' }} />

            {/* Cascading Golden Foil Tail Ribbons */}
            <path d="M48,78 Q30,96 24,96" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" className="animate-wiggle" />
            <path d="M50,78 Q50,98 50,98" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            <path d="M52,78 Q70,96 76,96" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" className="animate-wiggle" />
            
            {/* Diamond tip nodes at the end is of tail ribbons */}
            <polygon points="24,96 21,93 24,90 27,93" fill="#fbbf24" />
            <polygon points="76,96 73,93 76,90 79,93" fill="#fbbf24" />
          </g>

          <defs>
            <linearGradient id="goldWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0.25" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    )
  },
  omega_prime: {
    name: "Astra-Core X1",
    type: "Dimensional Singularity",
    desc: "A self-contained quantum gravitational singularity reactor hovering in a magnetic containment frame. Bends local regional forces, significantly easing athletic exertion levels.",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.55)",
    buff: "-12% Perceived Exertion (RPE)",
    sprite: (
      <div className="relative animate-float" style={{ animationDuration: '3.4s' }}>
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Gravitational warp fields */}
          <circle cx="50" cy="50" r="45" stroke="rgba(239,68,68,0.15)" strokeWidth="1" strokeDasharray="3 4" className="animate-spin" style={{ animationDuration: '14s' }} />
          <circle cx="50" cy="50" r="38" stroke="rgba(239,68,68,0.25)" strokeWidth="1.5" strokeDasharray="12 18" className="animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />
          
          {/* Hexagonal mechanical containment brackets */}
          <polygon points="50,26 71,38 71,62 50,74 29,62 29,38" fill="rgba(15,23,42,0.85)" stroke="#ef4444" strokeWidth="2.2" />
          
          {/* Magnetic bracket shield arm paths */}
          <path d="M16,50 C16,31 31,16 50,16" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 4" />
          <path d="M84,50 C84,69 69,84 50,84" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 4" />
          
          {/* Outer focus status indicator lights */}
          <circle cx="16" cy="50" r="2.5" fill="#f43f5e" className="animate-pulse" />
          <circle cx="84" cy="50" r="2.5" fill="#f43f5e" className="animate-pulse" />
          <circle cx="50" cy="16" r="2" fill="#fff" />
          <circle cx="50" cy="84" r="2" fill="#fff" />

          {/* Sub-particle energy orbit sweeps */}
          <g className="animate-circle-orbit" style={{ animationDuration: '2.5s' }}>
            <circle cx="50" cy="50" r="3.5" fill="#fff" style={{ filter: 'drop-shadow(0 0 6px #ef4444)' }} />
          </g>
          <g className="animate-circle-orbit" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
            <circle cx="50" cy="50" r="2" fill="#fb7185" style={{ filter: 'drop-shadow(0 0 4px #e11d48)' }} />
          </g>

          {/* Central ultra-bright core (The Singularity) */}
          <circle cx="50" cy="50" r="13" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="6 3" className="animate-pulse" />
          <circle cx="50" cy="50" r="8.5" fill="#fff" style={{ filter: 'drop-shadow(0 0 10px #ef4444)' }} className="animate-pulse" />
          
          {/* Micro light-emission spikes */}
          <line x1="50" y1="36" x2="50" y2="64" stroke="#ef4444" strokeWidth="1" className="opacity-75" />
          <line x1="36" y1="50" x2="64" y2="50" stroke="#ef4444" strokeWidth="1" className="opacity-75" />
        </svg>
      </div>
    )
  },
  shadow_wraith: {
    name: "Nox-Spectre X1",
    type: "Dark Void Familiar",
    desc: "An advanced levitating shadow construct forged with dark-matter plating. Radiates shifting obsidian streams and cosmic void energy to maximize endurance limits.",
    color: "#c084fc",
    glow: "rgba(168,85,247,0.55)",
    buff: "+18% Dark-Matter Endurance Buff",
    sprite: (
      <div className="relative animate-float" style={{ animationDuration: '3.6s' }}>
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Swirling deep violet nebulous rings */}
          <circle cx="50" cy="50" r="44" stroke="rgba(168,85,247,0.25)" strokeWidth="1" strokeDasharray="3 4" className="animate-spin" style={{ animationDuration: '12s' }} />
          <circle cx="50" cy="50" r="36" stroke="rgba(192,132,252,0.3)" strokeWidth="1.5" strokeDasharray="8 6" className="animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />
          
          {/* Shifting background void particle cluster */}
          <g className="animate-pulse">
            <circle cx="28" cy="32" r="1.5" fill="#a855f7" />
            <circle cx="72" cy="68" r="2" fill="#c084fc" />
            <circle cx="35" cy="74" r="1" fill="#f472b6" />
          </g>

          {/* Majestic sleek mechanical wings */}
          <path d="M50,42 L12,24 C18,36 12,62 50,50 Z" fill="url(#noxWingGrad)" stroke="#a855f7" strokeWidth="1.5" className="animate-wings-flutter origin-right" />
          <path d="M50,42 L88,24 C82,36 88,62 50,50 Z" fill="url(#noxWingGrad)" stroke="#a855f7" strokeWidth="1.5" className="animate-wings-flutter origin-left" />

          {/* Shroud plate shadow armor tail */}
          <path d="M50,75 L45,95 L50,90 L55,95 Z" fill="#18181b" stroke="#a855f7" strokeWidth="1" className="animate-wiggle origin-top" />

          {/* Primary Core Drone Head (Complex diamond plating) */}
          <polygon points="50,18 76,40 50,80 24,40" fill="rgba(9,9,11,0.92)" stroke="#a855f7" strokeWidth="2.5" />
          <polygon points="50,26 68,41 50,70 32,41" fill="#241435" stroke="#c084fc" strokeWidth="1.2" />

          {/* Glowing fuchsia cyber slit optical visors */}
          <polygon points="40,40 48,42 42,46" fill="#f472b6" className="animate-pulse" />
          <polygon points="60,40 52,42 58,46" fill="#f472b6" className="animate-pulse" />
          <circle cx="50" cy="48" r="3.5" fill="#18181b" stroke="#f472b6" strokeWidth="1.5" />
          <circle cx="50" cy="48" r="1" fill="#fff" className="animate-ping" />

          {/* Swirling interactive micro-spark */}
          <g className="animate-circle-orbit" style={{ animationDuration: '3s' }}>
            <circle cx="50" cy="50" r="3" fill="#fb7185" style={{ filter: 'drop-shadow(0 0 5px #f43f5e)' }} />
          </g>

          <defs>
            <linearGradient id="noxWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b0764" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#8108c4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#090514" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    )
  },
  lumen_sentinel: {
    name: "Lux-Seraph S1",
    type: "Celestial Prism Construct",
    desc: "A sacred high-dimensional drone crafted from pristine crystal solar matrices. Emits highly refined cleansing beams that instantly refresh athletic muscles.",
    color: "#38bdf8",
    glow: "rgba(255,255,255,0.8)",
    buff: "+20% Pristine Recovery Booster",
    sprite: (
      <div className="relative animate-float" style={{ animationDuration: '2.8s' }}>
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sacred Celestial Geometry Orbits */}
          <circle cx="50" cy="55" r="42" stroke="rgba(56,189,248,0.25)" strokeWidth="0.75" strokeDasharray="4 8" className="animate-spin" style={{ animationDuration: '18s' }} />
          <circle cx="50" cy="55" r="34" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="16 12" className="animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }} />
          
          {/* High-frequency light rays rising background */}
          <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(56,189,248,0.15)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(56,189,248,0.15)" strokeWidth="1" strokeDasharray="3 3" />

          {/* Seraphim multi-layer crystalline wings */}
          <path d="M50,45 L14,18 Q32,24 50,50 Z" fill="url(#luxWingGrad)" stroke="#38bdf8" strokeWidth="1.5" className="animate-wings-flutter origin-right" />
          <path d="M50,45 L86,18 Q68,24 50,50 Z" fill="url(#luxWingGrad)" stroke="#38bdf8" strokeWidth="1.5" className="animate-wings-flutter origin-left" />
          
          {/* Lower auxiliary energy wings */}
          <path d="M50,55 L24,78 Q36,68 50,55 Z" fill="rgba(56,189,248,0.4)" stroke="#0ea5e9" strokeWidth="1" className="animate-wings-flutter origin-right" />
          <path d="M50,55 L76,78 Q64,68 50,55 Z" fill="rgba(56,189,248,0.4)" stroke="#0ea5e9" strokeWidth="1" className="animate-wings-flutter origin-left" />

          {/* Elegant double-helix vertical rotation alignment */}
          <g className="animate-pulse">
            <ellipse cx="50" cy="52" rx="4" ry="15" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          </g>

          {/* Master Celestial Hex-Prism Core Body */}
          <polygon points="50,22 72,48 50,78 28,48" fill="rgba(255,255,255,0.96)" stroke="#cbd5e1" strokeWidth="2.5" />
          <polygon points="50,30 64,48 50,68 36,48" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />

          {/* Ultimate central pure white singular solar spark */}
          <polygon points="50,42 54,48 60,50 54,52 50,58 46,52 40,50 46,48" fill="#fff" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 8px #38bdf8)' }} />
          <circle cx="50" cy="50" r="2.5" fill="#fff" />

          <defs>
            <linearGradient id="luxWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.25" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    )
  }
};

interface ProfileBanner {
  id: string;
  name: string;
  desc: string;
  price: number;
  bgStyle: string;
  glowColor: string;
  bgImage?: string;
}

// Profile banner templates matching current Gym Themes (opacities reduced by 10% to prevent excess brightness)
const BANNERS: ProfileBanner[] = [
  { 
    id: 'titan_gold', 
    name: 'Golden Disciple', 
    desc: 'Crystalline golden skyline featuring reflective yellow-gold skyscrapers and a hovering pure light octahedron.', 
    price: 0, 
    bgStyle: 'bg-gradient-to-br from-amber-500/25 via-[#1a1204] to-[#050301]',
    bgImage: imgBannerGoldenDisciple,
    glowColor: 'bg-amber-500/15'
  },
  { 
    id: 'neon_pump', 
    name: 'Neon Striker', 
    desc: 'Luminous vaporwave skyscraper avenue glowing in deep synth purple and neon pink flares.', 
    price: 2500, 
    bgStyle: 'bg-gradient-to-br from-fuchsia-500/40 via-purple-950/90 to-[#06010d]',
    bgImage: imgBannerNeonStriker,
    glowColor: 'bg-fuchsia-500/25'
  },
  { 
    id: 'beast_mode', 
    name: 'Shadow Hunter', 
    desc: 'Eerie volcanic canyon with tall obsidian structures rising toward an eclipse in a blood-red sky.', 
    price: 3000, 
    bgStyle: 'bg-gradient-to-br from-red-600/40 via-red-950/95 to-black',
    bgImage: imgBannerShadowHunter,
    glowColor: 'bg-red-500/30'
  },
  { 
    id: 'zen_lifter', 
    name: 'Cyber Beast', 
    desc: 'Fierce cyan and teal electric lightning storm framing monolithic high-dimensional weather spires.', 
    price: 2500, 
    bgStyle: 'bg-gradient-to-br from-emerald-500/35 via-emerald-950/95 to-[#010603]',
    bgImage: imgBannerCyberBeast,
    glowColor: 'bg-emerald-500/25'
  },
  { 
    id: 'midnight_city', 
    name: 'Vanguard', 
    desc: 'Futuristic sky-high metropolitan architecture surrounded by mist under a massive blue storm moon.', 
    price: 3000, 
    bgStyle: 'bg-gradient-to-br from-cyan-500/35 via-blue-950/95 to-[#010410]',
    bgImage: imgBannerVanguardCadet,
    glowColor: 'bg-cyan-500/25'
  },
  { 
    id: 'shadow_smoke', 
    name: 'Omega Prime', 
    desc: 'Apocalyptic battle zone with falling meteors, smoke plumes, and a colossal combat robot mech silhouette.', 
    price: 4500, 
    bgStyle: 'bg-gradient-to-br from-zinc-950/60 via-slate-900/40 to-black',
    bgImage: imgBannerOmegaPrime,
    glowColor: 'bg-zinc-800/15'
  },
  { 
    id: 'aether_light', 
    name: 'Phantom Wraith', 
    desc: 'A deep space stardust vortex portal where a massive dark void phantom entity with purple eyes begins to manifest.', 
    price: 4500, 
    bgStyle: 'bg-gradient-to-br from-white/90 via-zinc-100/90 to-slate-200/80',
    bgImage: imgBannerPhantomWraith,
    glowColor: 'bg-white/75'
  },
  { 
    id: 'lumen_sentinel', 
    name: 'Lumen Sentinel', 
    desc: 'Majestic crystalline spires and orbiting silver stardust halo under cloud skies.', 
    price: 5000, 
    bgStyle: 'bg-gradient-to-br from-sky-400/20 via-slate-900/40 to-black',
    bgImage: imgBannerLumenSentinel,
    glowColor: 'bg-sky-400/35'
  }
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
  },
  { 
    id: 'shadow_smoke', 
    name: 'Shadow Whisperer', 
    desc: 'Dense, amorphous drifting shadow fog and kinetic smoke plumes rolling around the perimeter with flying black embers.', 
    price: 5000, 
    cardBorderClass: 'border-2 border-zinc-950/90 shadow-[0_0_55px_rgba(5,5,8,1),inset_0_0_25px_rgba(15,23,42,0.95)]',
    cornerElement: (
      <>
        {/* Intense Alpheus smokey framing (blur filters creating irregular fog on borders) */}
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black via-zinc-950/80 to-transparent opacity-75 filter blur-xs pointer-events-none z-10 animate-pulse" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black via-zinc-950/80 to-transparent opacity-85 filter blur-sm pointer-events-none z-10" />
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black via-zinc-950/60 to-transparent opacity-65 filter blur-xs pointer-events-none z-10 animate-pulse" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black via-zinc-950/60 to-transparent opacity-65 filter blur-xs pointer-events-none z-10 animate-pulse" />

        {/* Elusive Swirling Smoke Whisp Plumes (Drifting along edges) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
          {/* Top-left slow-rolling dark smoke puff */}
          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-zinc-900 opacity-80 filter blur-xl animate-[smokeDrift_8s_infinite]" style={{ '--x-start': '10px' } as React.CSSProperties} />
          {/* Bottom-right slow-rolling dark smoke puff */}
          <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-black opacity-90 filter blur-xl animate-[smokeDrift_9s_infinite]" style={{ '--x-start': '-15px' } as React.CSSProperties} />
          {/* Random floating heavy smoke puff */}
          <div className="absolute top-1/2 left-2 w-16 h-16 rounded-full bg-slate-950 opacity-70 filter blur-lg animate-[smokeDrift_5.2s_infinite]" style={{ '--x-start': '20px' } as React.CSSProperties} />
          <div className="absolute top-[30%] right-2 w-20 h-20 rounded-full bg-zinc-950 opacity-60 filter blur-lg animate-[smokeDrift_6.5s_infinite_reverse]" style={{ '--x-start': '-20px' } as React.CSSProperties} />
        </div>

        {/* Floating Kinetic Ash/Dark Embers along the border */}
        <div className="absolute inset-x-0 bottom-1 h-32 overflow-hidden pointer-events-none z-30">
          <div className="absolute bottom-1 left-[15%] w-[3px] h-[3px] bg-slate-500 rounded-full animate-[riseSparks_3.8s_infinite] opacity-60" style={{ animationDelay: '0.2s' }} />
          <div className="absolute bottom-4 left-[45%] w-[4px] h-[4px] bg-zinc-600 rounded-full animate-[riseSparks_4.5s_infinite] opacity-50" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-2 left-[80%] w-1.5 h-1.5 bg-neutral-700 rounded-full animate-[riseSparks_5.2s_infinite] opacity-40" style={{ animationDelay: '2.2s' }} />
        </div>

        {/* Double Layer Inner Shroud Borders */}
        <div className="absolute inset-1.5 border border-zinc-900/60 pointer-events-none z-10" />
        <div className="absolute inset-3 border border-black/40 pointer-events-none z-10 animate-pulse" />

        {/* Heavy Rough-Spiky Shroud Corner Bracket elements */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-[4px] border-l-[4px] border-black/80 z-30 pointer-events-none filter drop-shadow-[0_0_6px_rgba(0,0,0,0.85)]" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-[4px] border-r-[4px] border-black/80 z-30 pointer-events-none filter drop-shadow-[0_0_6px_rgba(0,0,0,0.85)]" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[4px] border-l-[4px] border-black/80 z-30 pointer-events-none filter drop-shadow-[0_0_6px_rgba(0,0,0,0.85)]" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[4px] border-r-[4px] border-black/80 z-30 pointer-events-none filter drop-shadow-[0_0_6px_rgba(0,0,0,0.85)]" />

        {/* SYSTEM STATUS // SHADOW MODE */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[7px] font-mono text-zinc-300 tracking-[0.4em] select-none z-30 font-black bg-black border border-zinc-900 shadow-[0_0_15px_rgba(0,0,0,0.95)] px-2.5 py-0.5 rounded uppercase">
          SHADOW WHISPER
        </div>
      </>
    )
  },
  { 
    id: 'aether_light', 
    name: 'Aetheric Sentinel', 
    desc: 'Gleaming, crystalline silver-white cybernetic rails equipped with flowing solar-light streaks and floating cosmic star shards.', 
    price: 5500, 
    cardBorderClass: 'border-2 border-white/95 shadow-[0_0_45px_rgba(255,255,255,0.7),_inset_0_0_20px_rgba(255,255,255,0.45)] bg-slate-950/20',
    cornerElement: (
      <>
        {/* Dynamic high-frequency laser sweep lines along edges */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent overflow-hidden z-30 pointer-events-none">
          <div className="w-48 h-full bg-gradient-to-r from-transparent via-sky-300 to-transparent transform animate-[laserSlideH_3.2s_linear_infinite]" />
        </div>
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent overflow-hidden z-30 pointer-events-none">
          <div className="w-48 h-full bg-gradient-to-r from-transparent via-sky-300 to-transparent transform animate-[laserSlideH_3.2s_linear_infinite_reverse]" style={{ animationDelay: '0.8s' }} />
        </div>
        <div className="absolute left-0 inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-white to-transparent overflow-hidden z-30 pointer-events-none">
          <div className="w-full h-48 bg-gradient-to-b from-transparent via-sky-300 to-transparent transform animate-[laserSlideV_2.8s_linear_infinite]" />
        </div>
        <div className="absolute right-0 inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-white to-transparent overflow-hidden z-30 pointer-events-none">
          <div className="w-full h-48 bg-gradient-to-b from-transparent via-sky-300 to-transparent transform animate-[laserSlideV_2.8s_linear_infinite_reverse]" style={{ animationDelay: '0.6s' }} />
        </div>

        {/* Dynamic rotating high-tech celestial circles in corner areas */}
        <div className="absolute top-1.5 left-1.5 w-8 h-8 border border-white/20 rounded-full animate-spin pointer-events-none z-20" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1.5 right-1.5 w-8 h-8 border border-white/20 rounded-full animate-spin pointer-events-none z-20" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />
        <div className="absolute bottom-1.5 left-1.5 w-8 h-8 border border-white/20 rounded-full animate-spin pointer-events-none z-20" style={{ animationDuration: '7s', animationDirection: 'reverse' }} />
        <div className="absolute bottom-1.5 right-1.5 w-8 h-8 border border-white/20 rounded-full animate-spin pointer-events-none z-20" style={{ animationDuration: '9s' }} />

        {/* Double Layer Clean white inner borders */}
        <div className="absolute inset-1.5 border border-white/20 pointer-events-none z-10" />
        <div className="absolute inset-3 border border-dashed border-white/10 pointer-events-none z-10 animate-pulse" />

        {/* Rising pure white star sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="absolute bottom-[5%] left-[20%] w-1.5 h-1.5 bg-white rounded-full animate-[riseSparks_4.2s_infinite] opacity-80" />
          <div className="absolute bottom-[10%] left-[55%] w-2 h-2 bg-sky-100 rounded-full animate-[riseSparks_3s_infinite] opacity-90" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-[4%] left-[82%] w-1 h-1 bg-white rounded-full animate-[riseSparks_5s_infinite] opacity-70" style={{ animationDelay: '1.8s' }} />
        </div>

        {/* Polished White metallic/chrome cyber corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-white/95 shadow-[0_0_12px_rgba(255,255,255,0.85)] z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] border-white/95 shadow-[0_0_12px_rgba(255,255,255,0.85)] z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] border-white/95 shadow-[0_0_12px_rgba(255,255,255,0.85)] z-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-white/95 shadow-[0_0_12px_rgba(255,255,255,0.85)] z-20 pointer-events-none" />

        {/* Rotating Celestial Sunburst Crosses in corners */}
        <div className="absolute top-[2px] left-[2px] z-30 pointer-events-none animate-spin" style={{ animationDuration: '10s' }}>
          <svg className="w-5 h-5 text-white/90 filter drop-shadow-[0_0_5px_rgba(255,255,255,0.9)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2 L14,10 L22,12 L14,14 L12,22 L10,14 L2,12 L10,10 Z" />
          </svg>
        </div>
        <div className="absolute top-[2px] right-[2px] z-30 pointer-events-none animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
          <svg className="w-5 h-5 text-sky-200/90 filter drop-shadow-[0_0_5px_rgba(255,255,255,0.9)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2 L14,10 L22,12 L14,14 L12,22 L10,14 L2,12 L10,10 Z" />
          </svg>
        </div>
        <div className="absolute bottom-[2px] left-[2px] z-30 pointer-events-none animate-spin" style={{ animationDuration: '14s', animationDirection: 'reverse' }}>
          <svg className="w-5 h-5 text-sky-100/90 filter drop-shadow-[0_0_5px_rgba(255,255,255,0.9)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2 L14,10 L22,12 L14,14 L12,22 L10,14 L2,12 L10,10 Z" />
          </svg>
        </div>
        <div className="absolute bottom-[2px] right-[2px] z-30 pointer-events-none animate-spin" style={{ animationDuration: '9s' }}>
          <svg className="w-5 h-5 text-white/95 filter drop-shadow-[0_0_5px_rgba(255,255,255,0.9)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2 L14,10 L22,12 L14,14 L12,22 L10,14 L2,12 L10,10 Z" />
          </svg>
        </div>

        {/* AETHER STATUS LABEL */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[7px] font-mono text-zinc-100 tracking-[0.52em] select-none z-30 font-black bg-zinc-950/90 border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.4)] px-3 py-0.5 rounded-full uppercase">
          LUMEN ACTIVATED
        </div>
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
  const finalFormTheme = FINAL_FORM_THEMES[equippedOutfit] || FINAL_FORM_THEMES.vanguard_cadet;

  // Unique interactive Companion Pet Storage with LocalStorage Persistence
  const [petNames, setPetNames] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('gym_pet_names');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [petLevels, setPetLevels] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('gym_pet_levels');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [petXps, setPetXps] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('gym_pet_xps');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isRenamingPet, setIsRenamingPet] = useState(false);
  const [renameInput, setRenameInput] = useState("");
  const [petFeedEffect, setPetFeedEffect] = useState<'none' | 'feed' | 'train' | 'peteffect'>('none');

  const activePetInfo = PETS_DATA[equippedOutfit] || PETS_DATA.vanguard_cadet;
  const currentPetName = petNames[equippedOutfit] || activePetInfo.name;
  const currentPetLevel = petLevels[equippedOutfit] || 1;
  const currentPetXp = petXps[equippedOutfit] || 0;

  const handleRenamePet = (newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const updated = { ...petNames, [equippedOutfit]: trimmed };
    setPetNames(updated);
    localStorage.setItem('gym_pet_names', JSON.stringify(updated));
    setIsRenamingPet(false);
    setToast({ message: `Companion renamed to "${trimmed}"!`, type: "success" });
  };

  const handleInteractPet = (action: 'feed' | 'train' | 'pet') => {
    if (action === 'feed') {
      const cost = 25;
      if (credits < cost) {
        setToast({ message: "Insufficient Coins to purchase high-energy protein shakes!", type: "info" });
        return;
      }
      const newCredits = credits - cost;
      saveSettings({ avatarCredits: newCredits });
      setProfile(prev => prev ? { ...prev, avatarCredits: newCredits } : null);

      let newXp = currentPetXp + 15;
      let newLvl = currentPetLevel;
      if (newXp >= 100) {
        newXp = newXp - 100;
        newLvl += 1;
        setToast({ message: `Level Up! ${currentPetName} reached Level ${newLvl}!`, type: "success" });
      } else {
        setToast({ message: `Fed ${currentPetName}! +15 XP`, type: "success" });
      }

      const updatedXps = { ...petXps, [equippedOutfit]: newXp };
      const updatedLvls = { ...petLevels, [equippedOutfit]: newLvl };
      setPetXps(updatedXps);
      setPetLevels(updatedLvls);
      localStorage.setItem('gym_pet_xps', JSON.stringify(updatedXps));
      localStorage.setItem('gym_pet_levels', JSON.stringify(updatedLvls));

      setPetFeedEffect('feed');
      setTimeout(() => setPetFeedEffect('none'), 1200);

    } else if (action === 'train') {
      const cost = 50;
      if (credits < cost) {
        setToast({ message: "Insufficient Coins to purchase mini lifting logs!", type: "info" });
        return;
      }
      const newCredits = credits - cost;
      saveSettings({ avatarCredits: newCredits });
      setProfile(prev => prev ? { ...prev, avatarCredits: newCredits } : null);

      let newXp = currentPetXp + 35;
      let newLvl = currentPetLevel;
      if (newXp >= 100) {
        newXp = newXp - 100;
        newLvl += 1;
        setToast({ message: `Level Up! ${currentPetName} reached Level ${newLvl}!`, type: "success" });
      } else {
        setToast({ message: `${currentPetName} worked out the iron! +35 XP`, type: "success" });
      }

      const updatedXps = { ...petXps, [equippedOutfit]: newXp };
      const updatedLvls = { ...petLevels, [equippedOutfit]: newLvl };
      setPetXps(updatedXps);
      setPetLevels(updatedLvls);
      localStorage.setItem('gym_pet_xps', JSON.stringify(updatedXps));
      localStorage.setItem('gym_pet_levels', JSON.stringify(updatedLvls));

      setPetFeedEffect('train');
      setTimeout(() => setPetFeedEffect('none'), 1200);

    } else if (action === 'pet') {
      setToast({ message: `You petted ${currentPetName}! They emit a happy sequence of cyber sparks!`, type: "success" });
      setPetFeedEffect('peteffect');
      setTimeout(() => setPetFeedEffect('none'), 1200);
    }
  };

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
        @keyframes superShudder {
          0%, 100% { transform: translate(0px, 0px) scale(1.01); filter: brightness(1) saturate(1); }
          20% { transform: translate(-0.6px, 0.6px) scale(1.02); filter: brightness(1.1) saturate(1.1); }
          40% { transform: translate(0.6px, -0.6px) scale(1.01); filter: brightness(1) saturate(1); }
          60% { transform: translate(-0.9px, -0.9px) scale(1.03); filter: brightness(1.25) saturate(1.2); }
          80% { transform: translate(0.9px, 0.9px) scale(1.02); filter: brightness(1.1) saturate(1.1); }
        }
        .animate-super-shudder {
          animation: superShudder 0.15s linear infinite;
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
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.4s ease-in-out infinite;
        }
        @keyframes wingsFlutter {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.4); }
        }
        .animate-wings-flutter {
          animation: wingsFlutter 0.15s ease-in-out infinite;
        }
        @keyframes circleOrbit {
          0% { transform: rotate(0deg) translateX(12px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(12px) rotate(-360deg); }
        }
        .animate-circle-orbit {
          animation: circleOrbit 3s linear infinite;
        }
        @keyframes smokeDrift {
          0% { transform: translateY(0px) translateX(var(--x-start, 0px)) scale(0.85); opacity: 0; }
          20% { opacity: 0.55; }
          60% { opacity: 0.3; }
          100% { transform: translateY(-160px) translateX(calc(var(--x-start, 0px) + 25px)) scale(1.4); opacity: 0; }
        }
        @keyframes smokyAuraPulse {
          0%, 100% { filter: drop-shadow(0 0 15px rgba(0,0,0,0.95)) drop-shadow(0 0 35px rgba(15,23,42,0.85)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 35px rgba(0,0,0,1)) drop-shadow(0 0 70px rgba(24,24,35,0.95)); transform: scale(1.02); }
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
        
        {/* Left Side: Majestic Avatar Showcase Card and Interactive Companion Pet (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-6 items-center">
          <div className={`relative w-full max-w-[440px] lg:max-w-none aspect-[3/4.2] bg-black/50 ${getActiveBorder().id === 'none' ? 'border border-white/10' : getActiveBorder().cardBorderClass} rounded-lg overflow-hidden flex flex-col justify-between p-7 group transition-all duration-700 shadow-3xl ${activeAuraStyling.outerGlow}`}>
            
            {/* Theme Border Corner Elements */}
            {getActiveBorder().cornerElement}

            {/* Banner Theme Background */}
            {getActiveBanner().bgImage ? (
              <div 
                className="absolute inset-0 z-0 transition-all duration-700 bg-cover bg-center" 
                style={{ backgroundImage: `url(${getActiveBanner().bgImage})`, opacity: 0.85 }}
              />
            ) : (
              <div className={`absolute inset-0 z-0 transition-all duration-700 ${getActiveBanner().bgStyle}`} />
            )}
            
            {/* Darker 10% shroud overlay to soften overly bright colors of active banners */}
            <div className={`absolute inset-0 z-0 pointer-events-none transition-all duration-300 ${
              getActiveBanner().id === 'aether_light' ? 'bg-black/20' : 'bg-black/10'
            }`} />

            {/* High-Contrast Interactive Neon Glow Highlights */}
            {getActiveBanner().glowColor && (
              <>
                <div className={`absolute -top-12 -right-12 w-64 h-64 rounded-full filter blur-[70px] opacity-65 mix-blend-screen transition-all duration-700 pointer-events-none ${getActiveBanner().glowColor}`} />
                <div className={`absolute -bottom-12 -left-12 w-64 h-64 rounded-full filter blur-[70px] opacity-50 mix-blend-screen transition-all duration-700 pointer-events-none ${getActiveBanner().glowColor}`} />
              </>
            )}

            {/* Hexagonal Tech matrix line overlay patterns */}
            <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-color-dodge z-0 animate-pulse-slow" 
                 style={{ 
                   backgroundImage: 'radial-gradient(ellipse at center, rgba(var(--gym-accent-rgb), 0.25) 0%, transparent 80%)',
                   backgroundSize: 'cover' 
                 }} 
            />

            {/* Japanese Anime Style Side Text */}
            <div className="absolute left-5 top-28 z-10 flex flex-col items-center select-none pointer-events-none transition-all duration-300 opacity-40">
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
            <div className="relative z-10 flex justify-between items-start transition-all duration-300">
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
            <div className={`relative w-[92%] aspect-[3/3.8] mx-auto z-10 flex items-center justify-center my-4 overflow-hidden rounded-md border transition-all duration-500 ${
              equippedEmote === 'final_form'
                ? `border-[rgba(var(--gym-accent-rgb,212,175,55),0.6)] bg-black/75 scale-[1.02] ${finalFormTheme.glow}`
                : 'border-white/5 bg-transparent group-hover:border-gym-accent/40'
            }`}>
              <TransparentCharacter 
                src={activeCharacterImage} 
                alt={activeOutfit.name} 
                className={`w-full h-full object-cover transform select-none pointer-events-none transition-all duration-700 ${
                  equippedEmote === 'final_form'
                    ? 'animate-super-shudder scale-[1.05]'
                    : 'scale-100 group-hover:scale-[1.04]'
                }`}
                toleranceMultiplier={activeOutfit.id === 'golden_disciple' ? 0.85 : 1.0}
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

              {equippedEmote === 'final_form' && (
                <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between overflow-hidden">
                  {/* Highly optimized background glow matching theme */}
                  <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t via-transparent to-transparent opacity-50" style={{ backgroundImage: `linear-gradient(to top, ${finalFormTheme.color}45, transparent)` }} />
                  
                  {/* Stylized technological overlay rings */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full border-4 border-dashed animate-orbit opacity-25 filter blur-xs" style={{ borderColor: finalFormTheme.color, animationDuration: '6s' }} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full border-2 border-double animate-orbit opacity-40" style={{ borderColor: finalFormTheme.color, animationDuration: '10s', animationDirection: 'reverse' }} />
                  
                  {/* Tech status display overlay at the top */}
                  <div className="bg-black/85 border-b border-white/10 px-3 py-1.5 flex items-center justify-between w-full relative z-30">
                    <span className="text-[8px] font-black font-mono tracking-widest text-red-500 animate-pulse">● OVERLOAD</span>
                    <span className="text-[7.5px] font-extrabold font-mono text-white/50 tracking-widest">{finalFormTheme.bannerText}</span>
                  </div>

                  {/* Rising stardust energy lines */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute w-0.5 h-12 rounded-full filter blur-[1px]" style={{ backgroundColor: finalFormTheme.color, animation: 'riseSparks 1.6s infinite', left: '15%', animationDelay: '0.1s' }} />
                    <div className="absolute w-0.5 h-16 rounded-full filter blur-[1.5px]" style={{ backgroundColor: finalFormTheme.color, animation: 'riseSparks 2s infinite', left: '45%', animationDelay: '0.5s' }} />
                    <div className="absolute w-0.5 h-10 rounded-full filter blur-[1px]" style={{ backgroundColor: finalFormTheme.color, animation: 'riseSparks 1.2s infinite', left: '75%', animationDelay: '0s' }} />
                    <div className="absolute w-0.5 h-14 rounded-full filter blur-[2px]" style={{ backgroundColor: finalFormTheme.color, animation: 'riseSparks 2.4s infinite', left: '90%', animationDelay: '0.8s' }} />
                  </div>

                  {/* Corner indicator ticks */}
                  <div className="absolute bottom-1 right-2 inline-flex items-center gap-1 bg-black/65 px-1.5 py-0.5 rounded-xs border border-white/5 z-30">
                    <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: finalFormTheme.color }} />
                    <span className="text-[7px] font-mono tracking-widest text-white font-bold">STAGE_05</span>
                  </div>
                </div>
              )}

              {/* Floating Pet Companion inside main frame */}
              <div 
                className="absolute bottom-3 right-3 z-30 flex flex-col items-center group/minipet cursor-pointer"
                onClick={() => {
                  handleInteractPet('pet');
                }}
              >
                <div className={`p-1 bg-black/85 rounded-md border border-white/20 shadow-lg ${
                  petFeedEffect === 'feed' ? 'border-emerald-500 scale-110' : 
                  petFeedEffect === 'train' ? 'border-amber-500 scale-110' : 
                  petFeedEffect === 'peteffect' ? 'border-fuchsia-500 scale-110' : 
                  'group-hover/minipet:border-gym-accent/50'
                } transition-all duration-300`}>
                  {activePetInfo.sprite}
                </div>
                <div className="mt-1.5 bg-black/95 text-[7px] font-mono tracking-widest text-white px-1.5 py-0.5 rounded border border-white/5 uppercase select-none font-bold">
                  LV.{currentPetLevel} {currentPetName}
                </div>
              </div>
            </div>

            {/* Character Footer displaying title */}
            <div className="relative z-10 flex items-center justify-between transition-all duration-300 w-full border-t border-white/10 pt-4">
              <div>
                <span className="text-[8px] uppercase tracking-[0.34em] text-white/30 block leading-tight">Athletic Title</span>
                <span className="text-2xl font-light italic font-serif text-gym-accent tracking-wide leading-none select-none drop-shadow">
                  {getActiveTitle().name.toUpperCase()}
                </span>
                <span className="text-[10px] text-white/40 block mt-1 tracking-normal font-light italic">{getActiveTitle().desc}</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-gym-accent/30 bg-gym-accent/10 flex items-center justify-center shadow-inner shrink-0">
                <Crown className="w-5 h-5 text-gym-accent" />
              </div>
            </div>

          </div>

          {/* COMPANION PET INTERACTION CARD */}
          <div className="w-full max-w-[440px] bg-black/45 border border-white/10 rounded-lg p-5 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 shadow-xl group/petcard">
            {/* Background cyan/pink/amber gradient particle glow */}
            <div 
              className="absolute -right-12 -top-12 w-32 h-32 rounded-full filter blur-3xl opacity-20 pointer-events-none transition-all duration-700" 
              style={{ backgroundColor: activePetInfo.color }} 
            />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activePetInfo.color }} />
                <div>
                  <div className="text-[8px] uppercase tracking-[0.25em] text-white/45 font-mono">Active Companion</div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {isRenamingPet ? (
                      <div className="flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded px-1.5 py-0.5">
                        <input
                          type="text"
                          value={renameInput}
                          onChange={(e) => setRenameInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenamePet(renameInput);
                            if (e.key === 'Escape') setIsRenamingPet(false);
                          }}
                          className="bg-transparent text-[11px] font-sans text-white max-w-[120px] focus:outline-none"
                          placeholder="Name of pet..."
                          autoFocus
                        />
                        <button 
                          onClick={() => handleRenamePet(renameInput)} 
                          className="text-gym-accent font-black text-[9px] px-1 hover:text-white transition-colors uppercase font-mono"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 select-none font-sans">
                        <span className="text-xs font-black text-white tracking-wide">{currentPetName}</span>
                        <button 
                          onClick={() => {
                            setRenameInput(currentPetName);
                            setIsRenamingPet(true);
                          }}
                          className="text-white/30 hover:text-gym-accent hover:scale-105 transition-all p-0.5"
                          title="Rename Companion"
                        >
                          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <span className="text-[7.5px] px-1.5 py-0.5 rounded bg-white/[0.03] text-white/50 border border-white/5 font-mono uppercase tracking-wider">{activePetInfo.type}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/[0.02] border border-white/10 px-2.5 py-1 rounded flex flex-col items-center">
                <span className="text-[7px] text-white/30 tracking-widest uppercase leading-none font-black font-mono">Synergy</span>
                <span className="text-xs font-black text-white font-mono leading-tight">Lv.{currentPetLevel}</span>
              </div>
            </div>

            {/* Pet Core Display: Center stage */}
            <div className="flex gap-4 bg-black/20 border border-white/5 p-3.5 rounded-lg relative overflow-hidden">
              <div className={`w-16 h-16 rounded flex items-center justify-center border bg-black/60 flex-shrink-0 relative overflow-hidden transition-all duration-300 ${
                petFeedEffect === 'feed' ? 'scale-105 bg-emerald-950/25 border-emerald-500/50' : 
                petFeedEffect === 'train' ? 'scale-105 bg-amber-950/25 border-amber-500/50' : 
                petFeedEffect === 'peteffect' ? 'scale-105 bg-fuchsia-950/25 border-fuchsia-500/50' : 
                'border-white/5'
              }`}>
                {/* Embedded action ripple overlays */}
                {petFeedEffect === 'feed' && (
                  <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center z-10 animate-pulse" />
                )}
                {petFeedEffect === 'train' && (
                  <div className="absolute inset-0 bg-amber-500/10 flex items-center justify-center z-10 animate-pulse" />
                )}
                {petFeedEffect === 'peteffect' && (
                  <div className="absolute inset-0 bg-fuchsia-500/10 flex items-center justify-center z-10 animate-pulse" />
                )}
                <div style={{ filter: `drop-shadow(0 0 8px ${activePetInfo.color})` }}>
                  {activePetInfo.sprite}
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <span className="text-[7.5px] tracking-[0.2em] font-mono uppercase text-white/30 block leading-none mb-1">Companion Bio</span>
                  <p className="text-[10px] text-white/60 leading-normal font-sans tracking-wide">
                    {activePetInfo.desc}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[8px] font-mono text-gym-accent font-black tracking-wider uppercase truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-gym-accent animate-pulse" />
                  Buff: {activePetInfo.buff}
                </div>
              </div>
            </div>

            {/* Bonding synergy progress gauge */}
            <div className="flex flex-col gap-1.5 bg-black/10 border border-white/5 p-2.5 rounded">
              <div className="flex items-center justify-between text-[7.5px] font-mono select-none">
                <span className="text-white/40 uppercase tracking-widest font-black">Bond Progression</span>
                <span className="text-white/80 font-bold">{currentPetXp} / 100 XP</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 border border-white/5 rounded-full overflow-hidden relative">
                <div 
                  className="h-full rounded-full transition-all duration-700" 
                  style={{ 
                    width: `${currentPetXp}%`,
                    backgroundColor: activePetInfo.color,
                    boxShadow: `0 0 10px ${activePetInfo.color}`
                  }} 
                />
              </div>
            </div>

            {/* Feeding and training interactive action panel */}
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => handleInteractPet('feed')}
                className="bg-emerald-500/[0.03] hover:bg-emerald-500/10 active:scale-95 text-emerald-400 border border-emerald-500/20 py-1.5 px-1 rounded flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <div className="text-[9px] font-black uppercase tracking-wider">Feed Shake</div>
                <div className="text-[6.5px] font-mono text-emerald-400/80 font-bold">25 COINS // +15XP</div>
              </button>

              <button 
                onClick={() => handleInteractPet('train')}
                className="bg-amber-500/[0.03] hover:bg-amber-500/10 active:scale-95 text-amber-400 border border-amber-500/20 py-1.5 px-1 rounded flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <div className="text-[9px] font-black uppercase tracking-wider">Lifting Logs</div>
                <div className="text-[6.5px] font-mono text-amber-400/80 font-bold">50 COINS // +35XP</div>
              </button>

              <button 
                onClick={() => handleInteractPet('pet')}
                className="bg-fuchsia-500/[0.03] hover:bg-fuchsia-500/10 active:scale-95 text-fuchsia-400 border border-fuchsia-500/20 py-1.5 px-1 rounded flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <div className="text-[9px] font-black uppercase tracking-wider">Interact</div>
                <div className="text-[6.5px] font-mono text-fuchsia-400/80 font-bold">FREE // SPARKS!</div>
              </button>
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
                <div className="relative w-14 h-14 rounded-md border border-gym-accent/45 overflow-hidden flex-shrink-0 bg-transparent">
                  <TransparentCharacter 
                    src={activeCharacterImage} 
                    alt="Active Micro Outfit" 
                    className="w-full h-full object-cover" 
                    toleranceMultiplier={activeOutfit.id === 'golden_disciple' ? 0.85 : 1.0}
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
                      <div className="w-20 h-24 rounded-md border border-white/5 overflow-hidden flex-shrink-0 bg-transparent relative">
                        <TransparentCharacter 
                          src={outfit.image} 
                          alt={outfit.name} 
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500" 
                          toleranceMultiplier={outfit.id === 'golden_disciple' ? 0.85 : 1.0}
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
                    className={`relative rounded-lg border p-5 cursor-pointer flex flex-col justify-between h-44 transition-all overflow-hidden group/bitem ${
                      isEquipped 
                        ? 'border-gym-accent shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                        : isUnlocked 
                          ? 'border-white/10 hover:border-white/30' 
                          : 'border-white/5 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {/* The dynamic banner preview gradient directly within the list item card */}
                    {banner.bgImage ? (
                      <div 
                        className="absolute inset-0 z-0 transition-opacity duration-300 bg-cover bg-center opacity-70 group-hover/bitem:opacity-90" 
                        style={{ backgroundImage: `url(${banner.bgImage})` }}
                      />
                    ) : (
                      <div className={`absolute inset-0 z-0 transition-opacity duration-300 ${banner.bgStyle} opacity-70 group-hover/bitem:opacity-90`} />
                    )}
                    
                    {/* Dark gradient mask to keep texts ultra-readable */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
                    
                    {/* Ambient Glow matching banner */}
                    {banner.glowColor && (
                      <div className={`absolute -top-6 -right-6 w-32 h-32 rounded-full filter blur-[25px] opacity-60 mix-blend-screen transition-all duration-300 group-hover/bitem:scale-110 pointer-events-none z-0 ${banner.glowColor}`} />
                    )}

                    <div className="relative z-10 w-full">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Tv className="w-4 h-4 text-gym-accent" />
                          <h5 className="text-white font-black font-sans uppercase tracking-widest text-sm">{banner.name}</h5>
                        </div>
                        {!isUnlocked && <Lock className="w-3.5 h-3.5 text-white/20" />}
                      </div>
                      <p className="text-[10px] text-white/60 leading-tight font-light mt-1">{banner.desc}</p>
                    </div>

                    <div className="relative z-10 border-t border-white/10 pt-3 flex items-center justify-between mt-auto w-full">
                      <span className="text-[8px] font-mono text-white/45 uppercase tracking-widest">Card Grid Banner</span>
                      
                      <div className="flex items-center gap-2">
                        {isEquipped ? (
                          <div className="bg-gym-accent text-black font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-sm flex items-center gap-1 select-none">
                            <Check className="w-3 h-3 stroke-[3]" /> Active
                          </div>
                        ) : isUnlocked ? (
                          <span className="text-[9px] uppercase font-bold text-white/80 tracking-widest hover:text-white transition-colors">Equip</span>
                        ) : (
                          <div className="bg-black/60 border border-white/10 text-amber-400 font-extrabold text-[10px] font-mono px-3 py-1 rounded-sm flex items-center gap-1 hover:border-white/25 transition-all">
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
