import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';

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
    image: '/src/assets/images/vanguard_default_1779362283869.png',
    accentColor: 'from-zinc-400 to-slate-600',
    glowClass: 'shadow-[0_0_20px_rgba(156,163,175,0.25)]',
    poseImages: {
      default: '/src/assets/images/vanguard_default_1779362283869.png',
      flex_mode: '/src/assets/images/vanguard_flex_1779362302716.png',
      power_charge: '/src/assets/images/vanguard_charge_1779362323371.png',
      savage_roar: '/src/assets/images/vanguard_roar_1779362341980.png'
    }
  },
  {
    id: 'neon_striker',
    name: 'Neon Striker',
    description: 'Neon purple glowing heavy-lifter exosuit.',
    price: 6000,
    image: '/src/assets/images/neon_striker_1779356868324.png',
    accentColor: 'from-fuchsia-500 to-purple-600',
    glowClass: 'shadow-[0_0_20px_rgba(219,39,119,0.3)]',
    poseImages: {
      default: '/src/assets/images/neon_striker_1779356868324.png',
      flex_mode: '/src/assets/images/neon_striker_flex_1779361070169.png',
      power_charge: '/src/assets/images/neon_striker_charge_1779361086721.png',
      savage_roar: '/src/assets/images/neon_striker_roar_1779361103538.png'
    }
  },
  {
    id: 'shadow_hunter',
    name: 'Shadow Hunter',
    description: 'Crimson-red tactical active cyborg.',
    price: 12000,
    image: '/src/assets/images/shadow_hunter_1779356889743.png',
    accentColor: 'from-rose-500 to-red-700',
    glowClass: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    poseImages: {
      default: '/src/assets/images/shadow_hunter_1779356889743.png',
      flex_mode: '/src/assets/images/shadow_hunter_flex_1779361122192.png',
      power_charge: '/src/assets/images/shadow_hunter_charge_1779361139639.png',
      savage_roar: '/src/assets/images/shadow_hunter_roar_1779361158854.png'
    }
  },
  {
    id: 'cyber_beast',
    name: 'Cyber Beast',
    description: 'Cyber-teal & ice blue electronic armor.',
    price: 15000,
    image: '/src/assets/images/cyber_beast_1779356910976.png',
    accentColor: 'from-cyan-400 to-teal-600',
    glowClass: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    poseImages: {
      default: '/src/assets/images/cyber_beast_1779356910976.png',
      flex_mode: '/src/assets/images/cyber_beast_flex_1779361174893.png',
      power_charge: '/src/assets/images/cyber_beast_charge_1779361191878.png',
      savage_roar: '/src/assets/images/cyber_beast_roar_1779361209673.png'
    }
  },
  {
    id: 'golden_disciple',
    name: 'Golden Disciple',
    description: 'Gleaming physical specimen with solid gold plating.',
    price: 18000,
    image: '/src/assets/images/golden_disciple_1779356934562.png',
    accentColor: 'from-amber-400 to-yellow-600',
    glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    poseImages: {
      default: '/src/assets/images/golden_disciple_1779356934562.png',
      flex_mode: '/src/assets/images/golden_disciple_flex_1779361226424.png',
      power_charge: '/src/assets/images/gold_disciple_charge_1779361244052.png',
      savage_roar: '/src/assets/images/gold_disciple_roar_1779361263799.png'
    }
  },
  {
    id: 'omega_prime',
    name: 'Omega Prime',
    description: 'Fully heavy armored mecha cyborg athlete.',
    price: 20000,
    image: '/src/assets/images/omega_prime_1779356957034.png',
    accentColor: 'from-red-600 to-indigo-900',
    glowClass: 'shadow-[0_0_20px_rgba(220,38,38,0.3)]',
    poseImages: {
      default: '/src/assets/images/omega_prime_1779356957034.png',
      flex_mode: '/src/assets/images/omega_prime_flex_1779361283032.png',
      power_charge: '/src/assets/images/omega_prime_charge_1779361301468.png',
      savage_roar: '/src/assets/images/omega_prime_roar_1779361316201.png'
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
  { id: 'midnight_city', name: 'Midnight City Theme', desc: 'Late-night sky & cyber teal digital grid.', price: 3000, bgStyle: 'bg-gradient-to-tr from-cyan-950/60 via-[#01091a] to-black' },
  { id: 'cyberpunk_grid', name: 'Cyberpunk Grid', desc: 'Classic indigo space grid network.', price: 1500, bgStyle: 'bg-gradient-to-r from-purple-950/60 via-[#04010a] to-neutral-950' }
];

export default function AvatarPanel({ profile, setProfile, saveSettings, setToast, archivedWorkouts }: AvatarPanelProps) {
  const [activeTab, setActiveTab] = useState<'customization' | 'auras' | 'emotes' | 'titles' | 'banners'>('customization');
  const [isClaimingBonus, setIsClaimingBonus] = useState(false);

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
      const isUnlocked = itemId === 'titan_gold' || itemId === 'cyberpunk_grid' || (profile as any)?.[dbKey];
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
  };

  const getActiveTitle = () => {
    return TITLES.find(t => t.id === equippedTitle) || TITLES[0];
  };

  const getActiveBanner = () => {
    return BANNERS.find(b => b.id === equippedBanner) || BANNERS[0];
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
          <div className={`relative w-full max-w-[440px] lg:max-w-none aspect-[3/4.2] bg-black/40 border border-white/10 rounded-lg overflow-hidden flex flex-col justify-between p-7 group transition-all duration-700 shadow-3xl ${activeAuraStyling.outerGlow}`}>
            
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
        <div className="flex overflow-x-auto no-scrollbar border-b border-white/5 bg-black/25">
          {[
            { id: 'customization', label: 'Customization' },
            { id: 'auras', label: 'Auras' },
            { id: 'emotes', label: 'Emotes' },
            { id: 'titles', label: 'Titles' },
            { id: 'banners', label: 'Banners' }
          ].map((tab) => (
            <button
              key={tab.id}
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
                const isUnlocked = banner.id === 'titan_gold' || banner.id === 'cyberpunk_grid' || (profile as any)?.[dbKey];
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

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
