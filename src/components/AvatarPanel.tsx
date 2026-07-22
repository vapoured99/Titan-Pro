import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  ChevronLeft,
  Skull,
  Sparkle,
  Info
} from 'lucide-react';

// Vanguard Imports
import { SphereGrid } from './avatar/SphereGrid';
import { AuraSynthesizer } from './avatar/AuraSynthesizer';
import { ChallengePortal } from './avatar/ChallengePortal';
import imgVanguardDefault from '../assets/images/vanguard_default_1779362283869.png';
import imgVanguardFlex from '../assets/images/vanguard_flex_1779362302716.png';
import imgVanguardCharge from '../assets/images/vanguard_charge_1779362323371.png';
import imgVanguardRoar from '../assets/images/vanguard_roar_1779362341980.png';

// Newly generated Final Forms
import imgVanguardFinal from '../assets/images/vanguard_final_1779446997564.png';

// Naruto Imports
import imgNarutoDefault from '../assets/images/No_Emote_Pose-1.png';
import imgNarutoFlex from '../assets/images/Flex_Mode-1.png';
import imgNarutoCharge from '../assets/images/Power_Charge-1.png';
import imgNarutoRoar from '../assets/images/Savage_Roar-1.png';
import imgNarutoFinal from '../assets/images/Final_Form-1.png';

// Sasuke Imports
import imgSasukeDefault from '../assets/images/No_Emote_Pose_S.png';
import imgSasukeFlex from '../assets/images/Flex_Mode_S.png';
import imgSasukeCharge from '../assets/images/Power_Charge_S.png';
import imgSasukeRoar from '../assets/images/Savage_Roar_S.png';
import imgSasukeFinal from '../assets/images/Final_Form_S.png';

// Jinwoo Imports
import imgJinwooDefault from '../assets/images/No_Emote_Pose_J.png';
import imgJinwooFlex from '../assets/images/Flex_Mode_J.png';
import imgJinwooCharge from '../assets/images/Power_Charge_J.png';
import imgJinwooRoar from '../assets/images/Savage_Roar_J.png';
import imgJinwooFinal from '../assets/images/Final_Form_J.png';

// Goku Imports
import imgGokuDefault from '../assets/images/No_Emote_Pose_G.png';
import imgGokuFlex from '../assets/images/Flex_Mode_G.png';
import imgGokuCharge from '../assets/images/Power_Charge_G.png';
import imgGokuRoar from '../assets/images/Savage_Roar_G.png';
import imgGokuFinal from '../assets/images/Final_Form_G.png';

// Kaiju No 8 Imports
import imgKaijuDefault from '../assets/images/No_Emote_Pose_K.png';
import imgKaijuFlex from '../assets/images/Flex_Mode_K.png';
import imgKaijuCharge from '../assets/images/Power_Charge_K.png';
import imgKaijuRoar from '../assets/images/Savage_Roar_K.png';
import imgKaijuFinal from '../assets/images/Final_Form_K.png';

// Beerus Imports
import imgBeerusDefault from '../assets/images/No_Emote_Pose_B.png';
import imgBeerusFlex from '../assets/images/Flex_Mode_B.png';
import imgBeerusCharge from '../assets/images/Power_Charge_B.png';
import imgBeerusRoar from '../assets/images/Savage_Roar_B.png';
import imgBeerusFinal from '../assets/images/Final_Form_B.png';

// Text-free character class landscape banners
import imgBannerVanguardCadet from '../assets/images/banner_vanguard_cadet_1779449260585.png';


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
  unassignedPoints?: number;
  avatarPower?: number;
  avatarKinetic?: number;
  avatarSymmetry?: number;
  avatarVelocity?: number;
  gridNodesUnlocked?: string[];
  completedRaidsCount?: number;
  [key: string]: any;
}

interface AvatarPanelProps {
  profile: UserProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  saveSettings: (settings: any) => Promise<void>;
  setToast: (toast: { message: string, type: 'success' | 'pb' | 'info' } | null) => void;
  archivedWorkouts: any[];
  currentUser?: any;
}

// Outfits database with matching pre-generated image assets for default/flex/charge/roar positions
export const OUTFITS = [
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
    id: 'naruto',
    name: 'Naruto',
    description: 'The legendary Orange Hokage operative. Master of Nine-Tails power-ups.',
    price: 15000,
    image: imgNarutoDefault,
    accentColor: 'from-amber-500 to-orange-600',
    glowClass: 'shadow-[0_0_25px_rgba(249,115,22,0.4)]',
    poseImages: {
      default: imgNarutoDefault,
      flex_mode: imgNarutoFlex,
      power_charge: imgNarutoCharge,
      savage_roar: imgNarutoRoar,
      final_form: imgNarutoFinal
    }
  },
  {
    id: 'sasuke',
    name: 'Sasuke',
    description: 'The legendary Avenger of the Uchiha clan. Master of the Sharingan and purple Susanoo shrouds.',
    price: 15000,
    image: imgSasukeDefault,
    accentColor: 'from-violet-500 to-indigo-600',
    glowClass: 'shadow-[0_0_25px_rgba(168,85,247,0.4)]',
    poseImages: {
      default: imgSasukeDefault,
      flex_mode: imgSasukeFlex,
      power_charge: imgSasukeCharge,
      savage_roar: imgSasukeRoar,
      final_form: imgSasukeFinal
    }
  },
  {
    id: 'jinwoo',
    name: 'Sung Jin Woo',
    description: 'The legendary Shadow Monarch. Master of shadow summoning and abyssal daggers.',
    price: 15000,
    image: imgJinwooDefault,
    accentColor: 'from-indigo-950 via-slate-900 to-indigo-900',
    glowClass: 'shadow-[0_0_25px_rgba(99,102,241,0.4)] border border-indigo-500/20',
    poseImages: {
      default: imgJinwooDefault,
      flex_mode: imgJinwooFlex,
      power_charge: imgJinwooCharge,
      savage_roar: imgJinwooRoar,
      final_form: imgJinwooFinal
    }
  },
  {
    id: 'goku',
    name: 'Goku',
    description: 'The legendary Saiyan warrior. Master of the Kaioken, Super Saiyan Blue, and Mastered Ultra Instinct.',
    price: 15000,
    image: imgGokuDefault,
    accentColor: 'from-orange-500 via-red-500 to-yellow-500',
    glowClass: 'shadow-[0_0_25px_rgba(249,115,22,0.5)] border border-orange-500/20',
    poseImages: {
      default: imgGokuDefault,
      flex_mode: imgGokuFlex,
      power_charge: imgGokuCharge,
      savage_roar: imgGokuRoar,
      final_form: imgGokuFinal
    }
  },
  {
    id: 'kaiju8',
    name: 'Kaiju No. 8',
    description: 'A Defense Force recruit who transforms into a legendary Category 8 Kaiju with electric cyan energy output.',
    price: 15000,
    image: imgKaijuDefault,
    accentColor: 'from-cyan-500 via-zinc-900 to-teal-400',
    glowClass: 'shadow-[0_0_25px_rgba(6,182,212,0.5)] border border-cyan-500/20',
    poseImages: {
      default: imgKaijuDefault,
      flex_mode: imgKaijuFlex,
      power_charge: imgKaijuCharge,
      savage_roar: imgKaijuRoar,
      final_form: imgKaijuFinal
    }
  },
  {
    id: 'beerus',
    name: 'Beerus',
    description: 'The God of Destruction of Universe 7. Feared yet respected, with terrifying Hakai purple destruction energy.',
    price: 15000,
    image: imgBeerusDefault,
    accentColor: 'from-purple-950 via-fuchsia-900 to-indigo-950',
    glowClass: 'shadow-[0_0_25px_rgba(168,85,247,0.5)] border border-purple-500/20',
    poseImages: {
      default: imgBeerusDefault,
      flex_mode: imgBeerusFlex,
      power_charge: imgBeerusCharge,
      savage_roar: imgBeerusRoar,
      final_form: imgBeerusFinal
    }
  }
];

// Map outfits / operatives to their corresponding banners automatically
export const OUTFIT_TO_BANNER: Record<string, string> = {
  vanguard_cadet: 'default_slate',
  naruto: 'titan_gold',
  sasuke: 'aether_light',
  jinwoo: 'shadow_smoke',
  goku: 'titan_gold',
  kaiju8: 'midnight_city',
  beerus: 'midnight_city'
};

// Sphere Grid Nodes configuration for visual and interactive talent mapping
export interface SphereNode {
  id: string;
  name: string;
  category: 'power' | 'kinetic' | 'symmetry' | 'velocity' | 'recovery';
  bonusText: string;
  cost: number;
  statBonus: { stat: 'power' | 'kinetic' | 'symmetry' | 'velocity' | 'recovery'; amount: number };
  x: number; // Percent coordinates in map grid overlay
  y: number;
  connections: string[]; // ids of connected nodes
}

export const SPHERE_NODES: Record<string, SphereNode> = {
  p0: { id: 'p0', name: 'Altar of Ascent', category: 'power', bonusText: 'Base potential awakened.', cost: 0, statBonus: { stat: 'power', amount: 0 }, x: 50, y: 50, connections: ['po1', 'ki1', 'sy1', 've1', 're1'] },
  
  // Power Branch (Top Left)
  po1: { id: 'po1', name: 'Iron Forged Tendons', category: 'power', bonusText: '+2 Muscular Power rating', cost: 1, statBonus: { stat: 'power', amount: 2 }, x: 41, y: 41, connections: ['p0', 'po2', 're1'] },
  po2: { id: 'po2', name: 'Gravity Mastery', category: 'power', bonusText: '+4 Muscular Power rating', cost: 2, statBonus: { stat: 'power', amount: 4 }, x: 31, y: 32, connections: ['po1', 'po3', 're2'] },
  po3: { id: 'po3', name: 'Sovereign Sledge', category: 'power', bonusText: '+8 Max Power (Hypertrophic Burst)', cost: 3, statBonus: { stat: 'power', amount: 8 }, x: 21, y: 23, connections: ['po2', 'po4'] },
  po4: { id: 'po4', name: 'Sovereign Catalyst', category: 'power', bonusText: '+12 Absolute Combat Power Boost', cost: 4, statBonus: { stat: 'power', amount: 12 }, x: 12, y: 14, connections: ['po3'] },

  // Kinetic Branch (Top Right)
  ki1: { id: 'ki1', name: 'Cardio-Vascular Ignition', category: 'kinetic', bonusText: '+2 Stamina Recovery', cost: 1, statBonus: { stat: 'kinetic', amount: 2 }, x: 59, y: 41, connections: ['p0', 'ki2', 're1'] },
  ki2: { id: 'ki2', name: 'Anaerobic Buffering', category: 'kinetic', bonusText: '+4 Oxygen Utilization', cost: 2, statBonus: { stat: 'kinetic', amount: 4 }, x: 69, y: 32, connections: ['ki1', 'ki3', 're2'] },
  ki3: { id: 'ki3', name: 'Vortex Inversion', category: 'kinetic', bonusText: '+8 Absolute Kinetic Endurance', cost: 3, statBonus: { stat: 'kinetic', amount: 8 }, x: 79, y: 23, connections: ['ki2', 'ki4'] },
  ki4: { id: 'ki4', name: 'Vortex Overdrive', category: 'kinetic', bonusText: '+12 Hyper-Stamina Kinetics', cost: 4, statBonus: { stat: 'kinetic', amount: 12 }, x: 88, y: 14, connections: ['ki3'] },

  // Recovery Branch (Straight Up Center)
  re1: { id: 're1', name: 'Metabolic Recalibration', category: 'recovery', bonusText: '+2 Adaptive Recovery rating', cost: 1, statBonus: { stat: 'recovery', amount: 2 }, x: 50, y: 38, connections: ['p0', 'po1', 'ki1', 're2'] },
  re2: { id: 're2', name: 'Myofascial Release', category: 'recovery', bonusText: '+4 Myofascial Equilibrium', cost: 2, statBonus: { stat: 'recovery', amount: 4 }, x: 50, y: 27, connections: ['re1', 'po2', 'ki2', 're3'] },
  re3: { id: 're3', name: 'Somatotropic Surge', category: 'recovery', bonusText: '+8 Max Recovery (Super Rest)', cost: 3, statBonus: { stat: 'recovery', amount: 8 }, x: 50, y: 17, connections: ['re2', 're4'] },
  re4: { id: 're4', name: 'Infinite Restoration', category: 'recovery', bonusText: '+12 Absolute Vitality Restoratives', cost: 4, statBonus: { stat: 'recovery', amount: 12 }, x: 50, y: 8, connections: ['re3'] },

  // Symmetry Branch (Bottom Left)
  sy1: { id: 'sy1', name: 'Core Integration', category: 'symmetry', bonusText: '+2 Postural Stabilization', cost: 1, statBonus: { stat: 'symmetry', amount: 2 }, x: 41, y: 59, connections: ['p0', 'sy2'] },
  sy2: { id: 'sy2', name: 'Biomechanical Symmetry', category: 'symmetry', bonusText: '+4 Flexor Equilibrium', cost: 2, statBonus: { stat: 'symmetry', amount: 4 }, x: 31, y: 68, connections: ['sy1', 'sy3'] },
  sy3: { id: 'sy3', name: 'Absolute Alignment', category: 'symmetry', bonusText: '+8 Stabilizer Reflexes', cost: 3, statBonus: { stat: 'symmetry', amount: 8 }, x: 21, y: 77, connections: ['sy2', 'sy4'] },
  sy4: { id: 'sy4', name: 'Zenith Axis Alignment', category: 'symmetry', bonusText: '+12 Postural Defensive Symmetry', cost: 4, statBonus: { stat: 'symmetry', amount: 12 }, x: 12, y: 86, connections: ['sy3'] },

  // Velocity Branch (Bottom Right)
  ve1: { id: 've1', name: 'Fast-Twitch Awakening', category: 'velocity', bonusText: '+2 Muscular Acceleration', cost: 1, statBonus: { stat: 'velocity', amount: 2 }, x: 59, y: 59, connections: ['p0', 've2'] },
  ve2: { id: 've2', name: 'High-Velocity Reciprocal', category: 'velocity', bonusText: '+4 Plyometric Elasticity', cost: 2, statBonus: { stat: 'velocity', amount: 4 }, x: 69, y: 68, connections: ['ve1', 've3'] },
  ve3: { id: 've3', name: 'Temporal Flash', category: 'velocity', bonusText: '+8 Dynamic Striking Speed', cost: 3, statBonus: { stat: 'velocity', amount: 8 }, x: 79, y: 77, connections: ['ve2', 've4'] },
  ve4: { id: 've4', name: 'Relativistic Reflex', category: 'velocity', bonusText: '+12 Quantum Action Speed', cost: 4, statBonus: { stat: 'velocity', amount: 12 }, x: 88, y: 86, connections: ['ve3'] },
};

// Boss list for simulation
export interface RaidBoss {
  id: string;
  name: string;
  subtitle: string;
  level: number;
  hp: number;
  maxHp: number;
  attackPower: number;
  defense: number;
  rewards: { xp: number; credits: number; aura?: string };
  difficulty: 'normal' | 'hard' | 'mythic' | 'nightmare' | 'apocalypse';
  description: string;
  themeColor: string;
}

export const RAID_BOSSES: RaidBoss[] = [
  {
    id: 'iron_leviathan',
    name: 'The Obsidian Golem',
    subtitle: 'Ancient Stone Monument of Force',
    level: 3,
    hp: 450,
    maxHp: 450,
    attackPower: 18,
    defense: 8,
    difficulty: 'normal',
    description: 'A colossal monument sculpted from unbreakable volcanic obsidian, designed to test the absolute boundaries of your mechanical push and pull power.',
    themeColor: 'from-amber-600/20 to-orange-500/10 border-orange-500/30',
    rewards: { xp: 400, credits: 1500 }
  },
  {
    id: 'plasma_phoenix',
    name: 'Pyroclastic Storm Drake',
    subtitle: 'Living Deep-Earth Furnace of Endurance',
    level: 8,
    hp: 900,
    maxHp: 900,
    attackPower: 32,
    defense: 12,
    difficulty: 'hard',
    description: 'A legendary dragon of liquid magma and blinding ash that drains your physical stamina, thriving upon continuous, explosive cardio endurance.',
    themeColor: 'from-red-600/20 to-rose-500/10 border-red-500/30',
    rewards: { xp: 950, credits: 3500, aura: 'void_core' }
  },
  {
    id: 'cyber_beast_reaper',
    name: 'Abyssal Dread Shadow Stalker',
    subtitle: 'Spectral Devourer of Human Fortitude',
    level: 15,
    hp: 2200,
    maxHp: 2200,
    attackPower: 58,
    defense: 25,
    difficulty: 'mythic',
    description: 'A terrifying entity from the shadows that tests the absolute limits of physical coordination, heavy loading, and core central nervous system stamina.',
    themeColor: 'from-purple-600/20 to-indigo-500/10 border-indigo-500/35',
    rewards: { xp: 2400, credits: 8000, aura: 'shadow_smoke' }
  },
  {
    id: 'lumen_singularity_gate',
    name: 'Stellar Archon of the Spires',
    subtitle: 'Pristine Guardian of the Sun-Gilded Peak',
    level: 25,
    hp: 4500,
    maxHp: 4500,
    attackPower: 95,
    defense: 45,
    difficulty: 'nightmare',
    description: 'The celestial beacon guarding the cloud spires, composed of pure compressed stardust that challenges your somatic symmetry, kinetic velocity, and absolute balance.',
    themeColor: 'from-cyan-600/20 to-teal-500/10 border-cyan-500/40',
    rewards: { xp: 6000, credits: 20000, aura: 'aether_light' }
  },
  {
    id: 'chrono_apocalypse_archon',
    name: 'The Chrono-Titan Kronos',
    subtitle: 'Eternal Sovereign of Eldritch Time',
    level: 35,
    hp: 9500,
    maxHp: 9500,
    attackPower: 160,
    defense: 70,
    difficulty: 'apocalypse',
    description: 'A legendary titan capable of bending inertia and dragging down physical movement. Overcoming this trial demands a flawless synergy of maximum muscular strength, plyometric speed, and rapid metabolic post-session recovery.',
    themeColor: 'from-red-950/45 via-purple-950/30 to-black/90 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.25)]',
    rewards: { xp: 15000, credits: 50000, aura: 'golden_halo' }
  },
  {
    id: 'primeval_god_specimen',
    name: 'The Ancient Primeval Demiurge',
    subtitle: 'Pre-Aeon Progenitor of Physical Might',
    level: 50,
    hp: 24000,
    maxHp: 24000,
    attackPower: 320,
    defense: 120,
    difficulty: 'apocalypse',
    description: 'The primordial deity who carved the mountains and forged somatic power itself. Imbued with infinitely regenerating biological strength, only the ultimate champions, accompanied by fully evolved companions, have any hope of living through its crushing ground shocks.',
    themeColor: 'from-yellow-950/50 via-zinc-950/30 to-black/95 border-yellow-500/70 shadow-[0_0_30px_rgba(234,179,8,0.3)] animate-pulse',
    rewards: { xp: 35000, credits: 120000, aura: 'aether_light' }
  }
];

export interface Relic {
  id: string;
  name: string;
  bossId: string;
  bossName: string;
  icon: string;
  badgeColor: string;
  description: string;
  bonusText: string;
  bonus: {
    maxHp?: number;
    attack?: number;
    defense?: number;
    criticalChance?: number;
    xpMultiplier?: number;
    statPercentBonus?: number;
  };
}

export const RELICS: Relic[] = [
  {
    id: 'obsidian_heart',
    name: 'Shattered Obsidian Heart',
    bossId: 'iron_leviathan',
    bossName: 'The Obsidian Golem',
    icon: '🪨',
    badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    description: 'An ancient volcanic core vibrating with intense seismic force.',
    bonusText: 'Permanent +15 Max Fortitude HP',
    bonus: { maxHp: 15 }
  },
  {
    id: 'pyroclastic_seed',
    name: 'Pyroclastic Flame Seed',
    bossId: 'plasma_phoenix',
    bossName: 'Pyroclastic Storm Drake',
    icon: '🔥',
    badgeColor: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    description: 'A glowing particle forged at the heart of the earth\'s furnace.',
    bonusText: 'Permanent +5 Might (ATK) power',
    bonus: { attack: 5 }
  },
  {
    id: 'abyssal_lantern',
    name: 'Abyssal Soul Lantern',
    bossId: 'cyber_beast_reaper',
    bossName: 'Abyssal Dread Shadow Stalker',
    icon: '💀',
    badgeColor: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
    description: 'A spectral light that anchors your mind against overwhelming neural exhaustion.',
    bonusText: 'Permanent +3 Resting Defense',
    bonus: { defense: 3 }
  },
  {
    id: 'sun_gilded_scepter',
    name: 'Sun-Gilded Archon Scepter',
    bossId: 'lumen_singularity_gate',
    bossName: 'Stellar Archon of the Spires',
    icon: '🔱',
    badgeColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    description: 'A divine beacon radiating the raw stardust of solar peaks.',
    bonusText: 'Permanent +10% Experience (XP) Gain multiplier from trials',
    bonus: { xpMultiplier: 0.10 }
  },
  {
    id: 'chrono_hourglass',
    name: 'Chrono-Hourglass of Kronos',
    bossId: 'chrono_apocalypse_archon',
    bossName: 'The Chrono-Titan Kronos',
    icon: '⏳',
    badgeColor: 'border-red-500/30 bg-red-500/10 text-red-300',
    description: 'An arcane device filled with the flowing sands of eldritch timelines.',
    bonusText: 'Permanent +1.5% Critical Blow Chance',
    bonus: { criticalChance: 1.5 }
  },
  {
    id: 'demiurge_crest',
    name: 'Primordial Crest of the Demiurge',
    bossId: 'primeval_god_specimen',
    bossName: 'The Ancient Primeval Demiurge',
    icon: '👑',
    badgeColor: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
    description: 'The supreme crown element symbolizing mastery over organic physical evolution.',
    bonusText: 'Permanent +5% Strength & +10% Core Health multipliers',
    bonus: { statPercentBonus: 0.05 }
  }
];

// Auras with premium, outer glow and custom blended overlay effects
export const AURAS = [
  { id: 'none', name: 'No Aura', price: 0, desc: 'Clean focus.', statMultiplier: { power: 1.0, kinetic: 1.0, symmetry: 1.0, velocity: 1.0 } },
  { id: 'void_core', name: 'Void Core', price: 3000, desc: 'Rotating neon purple bio-energy rays.', color: '#a855f7', glow: 'shadow-[0_0_110px_rgba(168,85,247,0.95),_0_0_55px_rgba(168,85,247,0.6),inset_0_0_25px_rgba(168,85,247,0.4)]', statMultiplier: { power: 1.15, kinetic: 1.05, symmetry: 1.10, velocity: 1.10 } },
  { id: 'emerald_overdrive', name: 'Emerald Overdrive', price: 5000, desc: 'High-density pulsing green techno-organic bio-fields.', color: '#10b981', glow: 'shadow-[0_0_110px_rgba(16,185,129,0.95),_0_0_55px_rgba(16,185,129,0.6),inset_0_0_25px_rgba(16,185,129,0.4)]', statMultiplier: { power: 1.10, kinetic: 1.25, symmetry: 1.15, velocity: 1.10 } },
  { id: 'crimson_flare', name: 'Crimson Flare', price: 4500, desc: 'Continuous explosive fire red flares.', color: '#ef4444', glow: 'shadow-[0_0_110px_rgba(239,68,68,0.95),_0_0_55px_rgba(239,68,68,0.6),inset_0_0_25px_rgba(239,68,68,0.4)]', statMultiplier: { power: 1.25, kinetic: 1.10, symmetry: 1.05, velocity: 1.20 } },
  { id: 'hyper_blue_plasma', name: 'Hyper Blue Plasma', price: 5500, desc: 'High-frequency blue thermonuclear electrical fields.', color: '#3b82f6', glow: 'shadow-[0_0_110px_rgba(59,130,246,0.95),_0_0_55px_rgba(59,130,246,0.6),inset_0_0_25px_rgba(59,130,246,0.4)]', statMultiplier: { power: 1.20, kinetic: 1.15, symmetry: 1.10, velocity: 1.25 } },
  { id: 'cyber_shard', name: 'Cyber Shard', price: 6000, desc: 'Rotating neon teal digital shields.', color: '#06b6d4', glow: 'shadow-[0_0_110px_rgba(6,182,212,0.95),_0_0_55px_rgba(6,182,212,0.6),inset_0_0_25px_rgba(6,182,212,0.4)]', statMultiplier: { power: 1.10, kinetic: 1.15, symmetry: 1.30, velocity: 1.15 } },
  { id: 'golden_halo', name: 'Golden Crown', price: 8000, desc: 'Brilliant golden high-rank celestial crown.', color: '#eab308', glow: 'shadow-[0_0_120px_rgba(234,179,8,1),_0_0_60px_rgba(234,179,8,0.7),inset_0_0_30px_rgba(234,179,8,0.45)]', statMultiplier: { power: 1.25, kinetic: 1.25, symmetry: 1.25, velocity: 1.25 } },
  { id: 'shadow_smoke', name: 'Shadow Smoke', price: 9000, desc: 'Deep, dense whispering kinetic shadow mists.', color: '#0c0a0f', glow: 'shadow-[0_0_120px_rgba(0,0,0,1),_0_0_60px_rgba(24,24,35,0.9),inset_0_0_25px_rgba(0,0,0,0.5)]', statMultiplier: { power: 1.30, kinetic: 1.20, symmetry: 1.15, velocity: 1.30 } },
  { id: 'aether_light', name: 'Aetheric Light', price: 8000, desc: 'Pure solar-white electromagnetic light radiating sacred beams.', color: '#ffffff', glow: 'shadow-[0_0_120px_rgba(255,255,255,0.85),_0_0_60px_rgba(244,244,245,0.75),inset_0_0_25px_rgba(255,255,255,0.4)]', statMultiplier: { power: 1.35, kinetic: 1.35, symmetry: 1.35, velocity: 1.35 } }
];

// Premium styled overlay elements for the character canvas matching the chosen aura
export const AURA_STYLING: Record<string, { outerGlow: string; innerEffects: React.ReactNode }> = {
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
export const TITLES = [
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
export const FINAL_FORM_THEMES: Record<string, { color: string; glow: string; particles: string; bannerText: string; overlayGradient: string }> = {
  vanguard_cadet: { color: '#9ca3af', glow: 'shadow-[0_0_90px_rgba(156,163,175,0.9),_0_0_45px_rgba(156,163,175,0.6)]', particles: '#9ca3af', bannerText: 'CADET // LIMIT BREAK', overlayGradient: 'from-zinc-400/20 to-transparent' },

  naruto: { color: '#ea580c', glow: 'shadow-[0_0_120px_rgba(234,88,12,1),_0_0_60px_rgba(234,88,12,0.7)]', particles: '#ea580c', bannerText: 'NARUTO // SAGE OF SIX PATHS LIMIT BREAK', overlayGradient: 'from-orange-500/35 to-transparent' },
  sasuke: { color: '#a855f7', glow: 'shadow-[0_0_120px_rgba(168,85,247,1),_0_0_60px_rgba(168,85,247,0.7)]', particles: '#a855f7', bannerText: 'SASUKE // INDRA REINCARNATION SUSANOO OUTBURST', overlayGradient: 'from-purple-500/35 to-transparent' },
  jinwoo: { color: '#3b82f6', glow: 'shadow-[0_0_120px_rgba(59,130,246,1),_0_0_60px_rgba(168,85,247,0.7)]', particles: '#3b82f6', bannerText: 'SUNG JIN WOO // MONARCH OF SHADOWS DECREE', overlayGradient: 'from-blue-950/40 to-transparent' },
  goku: { color: '#f97316', glow: 'shadow-[0_0_120px_rgba(249,115,22,1),_0_0_60px_rgba(253,224,71,0.85)]', particles: '#fbbf24', bannerText: 'GOKU // MASTERED ULTRA INSTINCT LIMIT BREAK', overlayGradient: 'from-orange-500/40 via-yellow-500/20 to-transparent' },
  kaiju8: { color: '#06b6d4', glow: 'shadow-[0_0_120px_rgba(6,182,212,1),_0_0_60px_rgba(20,184,166,0.75)]', particles: '#22d3ee', bannerText: 'KAIJU NO. 8 // 9.8 FORTITUDE LEVEL OVERLOAD DETECTED', overlayGradient: 'from-cyan-950/40 via-zinc-900/10 to-transparent' },
  beerus: { color: '#a855f7', glow: 'shadow-[0_0_120px_rgba(168,85,247,1),_0_0_60px_rgba(192,38,211,0.85)]', particles: '#d946ef', bannerText: 'BEERUS // GOD OF DESTRUCTION PURPLE HAKAI DECREE', overlayGradient: 'from-purple-950/40 via-fuchsia-900/10 to-transparent' }
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

  naruto: {
    name: "Mini Kurama",
    type: "Nine-Tails Spirit",
    desc: "A small, adorable chibi-size manifestation of the Nine-Tailed Fox. Hovers playfully, radiating warm life-force chakra and boosting stamina and physical recovery.",
    color: "#f97316",
    glow: "rgba(249,115,22,0.45)",
    buff: "+15% Kyuubi Stamina Surge",
    sprite: (
      <div className="relative animate-float" style={{ animationDuration: '3s' }}>
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Flame Orbit */}
          <circle cx="50" cy="50" r="40" stroke="rgba(249,115,22,0.2)" strokeWidth="1" strokeDasharray="4 4" className="animate-spin" style={{ animationDuration: '12s' }} />
          {/* Chibi Fox Head */}
          <path d="M50,30 L65,45 L50,60 L35,45 Z" fill="#ea580c" stroke="#f97316" strokeWidth="2" />
          {/* Ears */}
          <path d="M38,40 L30,22 L45,35 Z" fill="#ea580c" stroke="#f97316" strokeWidth="1.5" />
          <path d="M62,40 L70,22 L55,35 Z" fill="#ea580c" stroke="#f97316" strokeWidth="1.5" />
          {/* Inner ears */}
          <path d="M36,36 L32,25 L40,33 Z" fill="#1e293b" />
          <path d="M64,36 L68,25 L60,33 Z" fill="#1e293b" />
          {/* Eyes */}
          <circle cx="44" cy="45" r="2.5" fill="#fbbf24" stroke="#000" strokeWidth="0.5" />
          <circle cx="56" cy="45" r="2.5" fill="#fbbf24" stroke="#000" strokeWidth="0.5" />
          <path d="M43,43 L46,44" stroke="#000" strokeWidth="1" />
          <path d="M57,43 L54,44" stroke="#000" strokeWidth="1" />
          {/* Cheeks */}
          <line x1="38" y1="48" x2="42" y2="48" stroke="#1e293b" strokeWidth="1" />
          <line x1="38" y1="51" x2="41" y2="50" stroke="#1e293b" strokeWidth="1" />
          <line x1="62" y1="48" x2="58" y2="48" stroke="#1e293b" strokeWidth="1" />
          <line x1="62" y1="51" x2="59" y2="50" stroke="#1e293b" strokeWidth="1" />
          {/* Nose */}
          <polygon points="49,50 51,50 50,52" fill="#000" />
          {/* Glowing Chakra tails behind */}
          <path d="M25,65 Q15,50 30,45" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" className="opacity-80 animate-pulse" />
          <path d="M75,65 Q85,50 70,45" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" className="opacity-80 animate-pulse" />
          <path d="M50,75 Q50,90 40,80" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" className="opacity-80" />
        </svg>
      </div>
    )
  },
  sasuke: {
    name: "Mini Susanoo",
    type: "Spectral Aura Guardian",
    desc: "A small, mysterious hovering manifestation of Sasuke's purple Susanoo shield. Radiates deep amethyst light and sharpening focus aura to boost mental endurance.",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.45)",
    buff: "+15% Amethyst Focus Shroud",
    sprite: (
      <div className="relative animate-float" style={{ animationDuration: '3.5s' }}>
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Orbit rings */}
          <circle cx="50" cy="50" r="40" stroke="rgba(168,85,247,0.2)" strokeWidth="1" strokeDasharray="3 3" className="animate-spin" style={{ animationDuration: '15s' }} />
          {/* Chibi Spectral Helmet / Face */}
          <path d="M50,25 L68,42 L50,65 L32,42 Z" fill="#7e22ce" stroke="#c084fc" strokeWidth="2" />
          {/* Horns */}
          <path d="M35,38 L25,18 L42,32 Z" fill="#6b21a8" stroke="#c084fc" strokeWidth="1.5" />
          <path d="M65,38 L75,18 L58,32 Z" fill="#6b21a8" stroke="#c084fc" strokeWidth="1.5" />
          {/* Sharingan Eyes */}
          <circle cx="43" cy="44" r="2.5" fill="#ef4444" stroke="#000" strokeWidth="0.5" />
          <circle cx="57" cy="44" r="2.5" fill="#ef4444" stroke="#000" strokeWidth="0.5" />
          {/* Sharingan pupils */}
          <circle cx="43" cy="44" r="0.7" fill="#000" />
          <circle cx="57" cy="44" r="0.7" fill="#000" />
          {/* Spectral shoulders */}
          <path d="M22,60 Q12,45 28,40" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" className="opacity-80 animate-pulse" />
          <path d="M78,60 Q88,45 72,40" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" className="opacity-80 animate-pulse" />
          <path d="M50,70 L50,85" stroke="#7e22ce" strokeWidth="2" strokeLinecap="round" className="opacity-80" />
        </svg>
      </div>
    )
  },
  jinwoo: {
    name: "Mini Kaisel",
    type: "Shadow Wyvern Companion",
    desc: "A small, cute shadow wyvern companion born from Sung Jin Woo's shadow army. Shrouds you with shadowy aura to boost maximum lifting focus.",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.45)",
    buff: "+15% Shadow Essence Surge",
    sprite: (
      <div className="relative animate-float" style={{ animationDuration: '3.5s' }}>
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shadow Orbit */}
          <circle cx="50" cy="50" r="40" stroke="rgba(59,130,246,0.2)" strokeWidth="1" strokeDasharray="3 3" className="animate-spin" style={{ animationDuration: '15s' }} />
          {/* Dragon/Wyvern head */}
          <path d="M50,25 L65,40 L50,60 L35,40 Z" fill="#1e1b4b" stroke="#3b82f6" strokeWidth="2" />
          {/* Wings */}
          <path d="M35,38 L15,30 L25,50 Z" fill="#1e1b4b" stroke="#3b82f6" strokeWidth="1.5" />
          <path d="M65,38 L85,30 L75,50 Z" fill="#1e1b4b" stroke="#3b82f6" strokeWidth="1.5" />
          {/* Glowing Shadow Eyes */}
          <circle cx="43" cy="42" r="2.5" fill="#a855f7" className="animate-pulse" />
          <circle cx="57" cy="42" r="2.5" fill="#a855f7" className="animate-pulse" />
          {/* Spectral tail */}
          <path d="M50,60 Q40,80 50,90" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" className="opacity-80 animate-pulse" />
        </svg>
      </div>
    )
  },
  goku: {
    name: "Flying Nimbus",
    type: "Divine Cloud Companion",
    desc: "A magical yellow flying cloud companion granted to Goku. Swirls you with pure heart energy to speed up post-workout recovery.",
    color: "#eab308",
    glow: "rgba(234,179,8,0.45)",
    buff: "+15% Golden Nimbus Recovery Pace",
    sprite: (
      <div className="relative animate-float" style={{ animationDuration: '3.2s' }}>
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cloud fluff shape */}
          <path d="M30,55 Q20,55 25,45 Q20,35 35,35 Q40,25 55,25 Q70,25 75,35 Q85,35 80,45 Q85,55 75,55 Q65,65 50,65 Q35,65 30,55 Z" fill="#fde047" stroke="#eab308" strokeWidth="2.5" className="opacity-90 animate-pulse" />
          {/* Nimbus trail lines */}
          <path d="M20,60 L40,60" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" />
          {/* Sparkles */}
          <circle cx="50" cy="45" r="1.5" fill="#ffffff" className="animate-ping" />
        </svg>
      </div>
    )
  },
  kaiju8: {
    name: "Defense Force Drone",
    type: "Tactical Scout Companion",
    desc: "A tactical reconnaissance drone designed by the Anti-Kaiju Defense Force. Monitors muscle recovery markers in real-time.",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.45)",
    buff: "+12% Tactical Muscle Optimization",
    sprite: (
      <div className="relative animate-float" style={{ animationDuration: '2.8s' }}>
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Drone metallic body */}
          <rect x="35" y="40" width="30" height="20" rx="6" fill="#1e293b" stroke="#06b6d4" strokeWidth="2.5" className="animate-pulse" />
          {/* Rotating wings */}
          <line x1="20" y1="35" x2="40" y2="45" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          <line x1="60" y1="45" x2="80" y2="35" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="35" r="3" fill="#06b6d4" className="animate-ping" />
          <circle cx="80" cy="35" r="3" fill="#06b6d4" className="animate-ping" />
          {/* Scanner beam */}
          <path d="M50,60 L40,85 L60,85 Z" fill="rgba(6,182,212,0.15)" className="animate-pulse" />
        </svg>
      </div>
    )
  },
  beerus: {
    name: "Whis",
    type: "Angelic Attendant Companion",
    desc: "A divine angel attendant to the God of Destruction. Glides around gracefully with his scepter, offering gourmet earth delicacies to speed up physical rejuvenation.",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.45)",
    buff: "+15% Angelic Temporal Do-Over Recovery",
    sprite: (
      <div className="relative animate-float" style={{ animationDuration: '3.6s' }}>
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Angel ring halo */}
          <ellipse cx="50" cy="25" rx="15" ry="5" stroke="#38bdf8" strokeWidth="1.5" className="opacity-80 animate-pulse" />
          {/* Scepter stick & crystal ball */}
          <line x1="30" y1="80" x2="60" y2="35" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="60" cy="35" r="5" fill="#38bdf8" className="animate-pulse" />
          <circle cx="60" cy="35" r="8" stroke="#0ea5e9" strokeWidth="1" className="animate-ping" style={{ animationDuration: '2s' }} />
          {/* Whis simple robe silhouette */}
          <path d="M42,40 L58,40 L52,70 L48,70 Z" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M45,45 L55,45 L50,55 Z" fill="#a855f7" />
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
export const BANNERS: ProfileBanner[] = [
  { 
    id: 'default_slate', 
    name: 'Default Slate', 
    desc: 'Sleek high-contrast carbon gray core layout for starting athletes.', 
    price: 0, 
    bgStyle: 'bg-gradient-to-br from-zinc-800/25 via-[#121315] to-[#040405]',
    glowColor: 'bg-zinc-500/10'
  },
  { 
    id: 'titan_gold', 
    name: 'Golden Disciple', 
    desc: 'Crystalline golden skyline featuring reflective yellow-gold skyscrapers and a hovering pure light octahedron.', 
    price: 1000, 
    bgStyle: 'bg-gradient-to-br from-amber-500/25 via-[#1a1204] to-[#050301]',
    glowColor: 'bg-amber-500/15'
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
    glowColor: 'bg-zinc-800/15'
  },
  { 
    id: 'aether_light', 
    name: 'Phantom Wraith', 
    desc: 'A deep space stardust vortex portal where a massive dark void phantom entity with purple eyes begins to manifest.', 
    price: 4500, 
    bgStyle: 'bg-gradient-to-br from-white/90 via-zinc-100/90 to-slate-200/80',
    glowColor: 'bg-white/75'
  }
];

// Banner Borders aligned with core themes
export const BORDERS = [
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
      </>
    )
  }
];

export function getAuraLockStatus(auraId: string, profile: any): { isLocked: boolean; reason?: string } {
  if (!profile) return { isLocked: false };
  if (auraId === 'none') return { isLocked: false };

  const isUnlocked = (id: string) => id === 'none' || !!profile[`unlocked_aura_${id}`];

  // 10% DMG (emerald_overdrive, cyber_shard) are available by default
  if (auraId === 'emerald_overdrive' || auraId === 'cyber_shard') {
    return { isLocked: false };
  }

  // 15% DMG (void_core) requires any 10% DMG aura
  if (auraId === 'void_core') {
    const has10 = isUnlocked('emerald_overdrive') || isUnlocked('cyber_shard');
    if (!has10) {
      return { isLocked: true, reason: 'Requires purchasing a 10% DMG Aura first (Emerald Overdrive or Cyber Shard)' };
    }
    return { isLocked: false };
  }

  // 20% DMG (hyper_blue_plasma) requires 15% DMG aura
  if (auraId === 'hyper_blue_plasma') {
    const has15 = isUnlocked('void_core');
    if (!has15) {
      return { isLocked: true, reason: 'Requires purchasing the 15% DMG Aura first (Void Core)' };
    }
    return { isLocked: false };
  }

  // 25% DMG (crimson_flare, golden_halo) requires 20% DMG aura
  if (auraId === 'crimson_flare' || auraId === 'golden_halo') {
    const has20 = isUnlocked('hyper_blue_plasma');
    if (!has20) {
      return { isLocked: true, reason: 'Requires purchasing the 20% DMG Aura first (Hyper Blue Plasma)' };
    }
    return { isLocked: false };
  }

  // 30% DMG (shadow_smoke) requires any 25% DMG aura
  if (auraId === 'shadow_smoke') {
    const has25 = isUnlocked('crimson_flare') || isUnlocked('golden_halo');
    if (!has25) {
      return { isLocked: true, reason: 'Requires purchasing a 25% DMG Aura first (Crimson Flare or Golden Crown)' };
    }
    return { isLocked: false };
  }

  // 35% DMG (aether_light) requires 30% DMG aura
  if (auraId === 'aether_light') {
    const has30 = isUnlocked('shadow_smoke');
    if (!has30) {
      return { isLocked: true, reason: 'Requires purchasing the 30% DMG Aura first (Shadow Smoke)' };
    }
    return { isLocked: false };
  }

  return { isLocked: false };
}

export function getEmoteLockStatus(emoteId: string, equippedOutfit: string, profile: any): { isLocked: boolean; reason?: string } {
  if (!profile) return { isLocked: false };
  if (emoteId === 'none' || emoteId === 'flex_mode') return { isLocked: false };

  const isUnlocked = (id: string) => id === 'none' || !!profile[`unlocked_emote_${equippedOutfit}_${id}`];

  if (emoteId === 'power_charge') {
    if (!isUnlocked('flex_mode')) {
      return { isLocked: true, reason: 'Requires purchasing "Flex Mode" emote first' };
    }
  }

  if (emoteId === 'savage_roar') {
    if (!isUnlocked('power_charge')) {
      return { isLocked: true, reason: 'Requires purchasing "Power Charge" emote first' };
    }
  }

  if (emoteId === 'final_form') {
    if (!isUnlocked('savage_roar')) {
      return { isLocked: true, reason: 'Requires purchasing "Savage Roar" emote first' };
    }
  }

  return { isLocked: false };
}

export default function AvatarPanel({ profile, setProfile, saveSettings, setToast, archivedWorkouts, currentUser }: AvatarPanelProps) {
  const [activeTab, setActiveTab] = useState<'operatives' | 'auras' | 'emotes' | 'titles' | 'operativeBorders'>('operatives');

  // --- Rank Up Aura Exploding Particle States ---
  const [showRankUp, setShowRankUp] = useState(false);
  const [rankUpData, setRankUpData] = useState<{
    type: 'level' | 'class' | 'pr';
    title: string;
    description: string;
    prev: string | number;
    current: string | number;
    color: string;
    glow: string;
  }>({
    type: 'level',
    title: "LEVEL UP SECURED",
    description: "New RPG Level milestones achieved",
    prev: 1,
    current: 1,
    color: "bg-gym-accent",
    glow: "shadow-[0_0_20px_rgba(212,175,55,0.6)]"
  });
  const [explodingParticles, setExplodingParticles] = useState<any[]>([]);

  // Calculate current cybernetic class based on archived workouts
  const cyberneticClassRaw = useMemo(() => {
    // 1RM calculator helper
    const calc1RM = (w: number, r: number) => {
      if (r <= 1) return w;
      return w * (1 + r / 30); // Epley Formula
    };

    const normalizeMatch = (name: string, target: string) => {
      const n = name.toLowerCase().trim();
      const t = target.toLowerCase();
      if (t === 'bench') return n.includes('bench press') && !n.includes('incline') && !n.includes('decline');
      if (t === 'squat') return n.includes('squat') && (n.includes('barbell') || n.includes('back') || n.includes('safety bar'));
      if (t === 'deadlift') return n.includes('deadlift') && !n.includes('romanian') && !n.includes('stiff-leg');
      if (t === 'ohp') return n.includes('overhead press') || n.includes('military press') || (n.includes('shoulder press') && n.includes('barbell'));
      return false;
    };

    const movements = { bench: 0, squat: 0, deadlift: 0, ohp: 0 };

    (archivedWorkouts || []).forEach((w) => {
      if (w?.sets) {
        w.sets.forEach((s: any) => {
          Object.keys(movements).forEach((key) => {
            const mKey = key as keyof typeof movements;
            if (normalizeMatch(s.exerciseName, mKey)) {
              const current1RM = calc1RM(Number(s.weight) || 0, Number(s.reps) || 0);
              if (current1RM > movements[mKey]) {
                movements[mKey] = current1RM;
              }
            }
          });
        });
      }
    });

    const isFemale = profile?.sex === "female";
    const weight = profile?.bodyweight || 80;

    const benchRatio = movements.bench / weight;
    const squatRatio = movements.squat / weight;
    const deadliftRatio = movements.deadlift / weight;
    const ohpRatio = movements.ohp / weight;
    const totalRatio = benchRatio + squatRatio + deadliftRatio + ohpRatio;

    const thresholds = isFemale
      ? [0, 2.2, 3.3, 4.5, 5.95]
      : [0, 3.45, 5.1, 6.8, 8.55];

    const classNames = [
      "Base Sportsman",
      "Advanced Trainee",
      "Symmetric Specialist",
      "Elite Competitor",
      "Absolute Master"
    ];

    let currentClassIdx = 0;
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (totalRatio >= thresholds[i]) {
        currentClassIdx = i;
        break;
      }
    }

    return {
      index: currentClassIdx,
      name: classNames[currentClassIdx],
      ratio: totalRatio,
    };
  }, [archivedWorkouts, profile?.sex, profile?.bodyweight]);

  // Track state transitions to trigger particle effects & Rank Up animation
  useEffect(() => {
    if (!profile) return;
    const currentUserId = currentUser?.uid || 'guest';

    const storedLvlKey = `last_seen_level_${currentUserId}`;
    const storedClassIdxKey = `last_seen_cybernetic_class_${currentUserId}`;
    const storedPrCountKey = `last_seen_pr_count_${currentUserId}`;

    const prevLvlStr = localStorage.getItem(storedLvlKey);
    const prevClassIdxStr = localStorage.getItem(storedClassIdxKey);
    const prevPrCountStr = localStorage.getItem(storedPrCountKey);

    const currentLevel = profile?.avatarLevel ?? 1;
    const currentClassIdx = cyberneticClassRaw.index;
    const currentPrCount = (archivedWorkouts || []).length;

    let triggered = false;

    // Helper to generate burst of 45 colorful dynamic sparks
    const triggerSparkBurst = (type: 'level' | 'class' | 'pr', prevVal: string | number, curVal: string | number) => {
      const colorsMap = {
        level: ["#ffdf00", "#fbbf24", "#fef08a", "#ffffff"],
        class: ["#06b6d4", "#a855f7", "#ec4899", "#22c55e", "#ffffff"],
        pr: ["#ef4444", "#fbbf24", "#3b82f6", "#10b981", "#ffffff"]
      };
      
      const typeDesc = {
        level: { title: "ATHLETIC LEVEL UP!", desc: "Your level has increased! Keep up the great work." },
        class: { title: "ATHLETIC CLASS EVOLVED!", desc: "Your training class and physical tier have officially reached the next stage." },
        pr: { title: "NEW PERSONAL RECORD!", desc: "You've beaten your previous best lift. Outstanding strength!" }
      };

      const selectedColors = colorsMap[type] || colorsMap.level;
      const meta = typeDesc[type] || typeDesc.level;

      const newParticles = Array.from({ length: 50 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 90 + Math.random() * 200; // outward spread
        const tx = Math.sin(angle) * distance;
        const ty = -Math.cos(angle) * distance - (10 + Math.random() * 40); // fly up
        const color = selectedColors[Math.floor(Math.random() * selectedColors.length)];
        const size = 3.5 + Math.random() * 6.5;
        const delay = Math.random() * 0.25;
        const duration = 0.8 + Math.random() * 1.2;
        return {
          id: i,
          tx: `${tx}px`,
          ty: `${ty}px`,
          color,
          size: `${size}px`,
          delay: `${delay}s`,
          duration: `${duration}s`,
        };
      });

      setRankUpData({
        type,
        title: meta.title,
        description: meta.desc,
        prev: prevVal,
        current: curVal,
        color: type === 'class' ? 'bg-[#06b6d4]' : type === 'pr' ? 'bg-red-500' : 'bg-gym-accent',
        glow: type === 'class' ? 'shadow-[0_0_25px_#06b6d4]' : type === 'pr' ? 'shadow-[0_0_25px_#ef4444]' : 'shadow-[0_0_25px_#ffdf00]'
      });

      setExplodingParticles(newParticles);
      setShowRankUp(true);

      // Auto clear overlay after a few seconds
      setTimeout(() => {
        setShowRankUp(false);
      }, 5500);
    };

    // 1. Check Level Up
    if (prevLvlStr !== null) {
      const prevLvl = parseInt(prevLvlStr, 10);
      if (currentLevel > prevLvl) {
        triggerSparkBurst('level', prevLvl, currentLevel);
        triggered = true;
      }
    }
    localStorage.setItem(storedLvlKey, currentLevel.toString());

    // 2. Check Cybernetic Class up
    if (!triggered && prevClassIdxStr !== null) {
      const prevClassIdx = parseInt(prevClassIdxStr, 10);
      if (currentClassIdx > prevClassIdx) {
        const classNames = [
          "Base Sportsman",
          "Advanced Trainee",
          "Symmetric Specialist",
          "Elite Competitor",
          "Absolute Master"
        ];
        triggerSparkBurst('class', classNames[prevClassIdx], classNames[currentClassIdx]);
        triggered = true;
      }
    }
    localStorage.setItem(storedClassIdxKey, currentClassIdx.toString());

    // 3. Check PR/Workout milestones added
    if (!triggered && prevPrCountStr !== null) {
      const prevPrCount = parseInt(prevPrCountStr, 10);
      if (currentPrCount > prevPrCount && prevPrCount > 0) {
        triggerSparkBurst('pr', prevPrCount, currentPrCount);
        triggered = true;
      }
    }
    localStorage.setItem(storedPrCountKey, currentPrCount.toString());

  }, [profile?.avatarLevel, cyberneticClassRaw.index, archivedWorkouts?.length, currentUser?.uid, profile]);

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
  const credits = profile?.avatarCredits ?? 5000;
  const unlockedOutfits = profile?.unlockedOutfits ?? ['vanguard_cadet'];
  const equippedOutfit = profile?.equippedOutfit ?? 'vanguard_cadet';
  const equippedAura = profile?.equippedAura ?? 'none';
  const equippedBackItem = profile?.equippedBackItem ?? 'none';
  const equippedEmote = (profile as any)?.[`equippedEmote_${equippedOutfit}`] ?? 'none';
  const equippedTitle = profile?.equippedTitle ?? 'lifter';
  const equippedBanner = OUTFIT_TO_BANNER[equippedOutfit] || 'default_slate';
  const equippedBorder = profile?.equippedBorder ?? 'none';

  // Level XP Helper
  const getXpNeededForLevel = (lvl: number) => {
    return lvl * 500 + 2000;
  };
  const xpNeeded = getXpNeededForLevel(level);
  const xpPercentage = Math.min(100, (xp / xpNeeded) * 100);

  // Determine current Active Outfit
  const activeOutfit = OUTFITS.find(o => o.id === equippedOutfit) || OUTFITS[0];
  const isFullArt = ['vanguard_cadet', 'naruto', 'sasuke', 'jinwoo', 'goku', 'kaiju8', 'beerus'].includes(activeOutfit.id);
  const finalFormTheme = FINAL_FORM_THEMES[equippedOutfit] || FINAL_FORM_THEMES.vanguard_cadet;

  const userId = currentUser?.uid || 'guest';
  const petNamesKey = `gym_pet_names_${userId}`;
  const petLevelsKey = `gym_pet_levels_${userId}`;
  const petXpsKey = `gym_pet_xps_${userId}`;

  // --- New 5-Tab Navigation & RPG state fields ---
  const [innerTab, setInnerTab] = useState<'customization' | 'sphere_grid' | 'auras' | 'raid_portal' | 'trophies'>('customization');

  // Draggable Swipeable Biometric Carousel States & Controls
  const bioScrollRef = useRef<HTMLDivElement>(null);
  const [bioIsDragging, setBioIsDragging] = useState(false);
  const [bioStartX, setBioStartX] = useState(0);
  const [bioScrollLeft, setBioScrollLeft] = useState(0);

  const handleBioMouseDown = (e: React.MouseEvent) => {
    if (!bioScrollRef.current) return;
    setBioIsDragging(true);
    setBioStartX(e.pageX - bioScrollRef.current.offsetLeft);
    setBioScrollLeft(bioScrollRef.current.scrollLeft);
  };

  const handleBioMouseLeave = () => {
    setBioIsDragging(false);
  };

  const handleBioMouseUp = () => {
    setBioIsDragging(false);
  };

  const handleBioMouseMove = (e: React.MouseEvent) => {
    if (!bioIsDragging || !bioScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - bioScrollRef.current.offsetLeft;
    const walk = (x - bioStartX) * 1.5; // Drag speed sensitivity multiplier
    bioScrollRef.current.scrollLeft = bioScrollLeft - walk;
  };

  const scrollBioLeft = () => {
    if (bioScrollRef.current) {
      bioScrollRef.current.scrollBy({ left: -290, behavior: 'smooth' });
    }
  };

  const scrollBioRight = () => {
    if (bioScrollRef.current) {
      bioScrollRef.current.scrollBy({ left: 290, behavior: 'smooth' });
    }
  };

  // Shared attributes
  const unassignedPoints = profile?.unassignedPoints ?? 10;
  const basePower = profile?.avatarPower ?? 10;
  const baseKinetic = profile?.avatarKinetic ?? 10;
  const baseSymmetry = profile?.avatarSymmetry ?? 10;
  const baseVelocity = profile?.avatarVelocity ?? 10;
  const baseRecoveryAttr = profile?.avatarRecovery ?? 10;
  const gridNodesUnlocked = profile?.gridNodesUnlocked ?? ['p0'];
  const completedRaidsCount = profile?.completedRaidsCount ?? 0;

  // Derived bonuses from sphere grid nodes
  const sphereGridBonus = useMemo(() => {
    let p = 0; let k = 0; let s = 0; let v = 0; let r = 0;
    gridNodesUnlocked.forEach(nodeId => {
      const node = SPHERE_NODES[nodeId];
      if (node && node.statBonus) {
        if (node.statBonus.stat === 'power') p += node.statBonus.amount;
        else if (node.statBonus.stat === 'kinetic') k += node.statBonus.amount;
        else if (node.statBonus.stat === 'symmetry') s += node.statBonus.amount;
        else if (node.statBonus.stat === 'velocity') v += node.statBonus.amount;
        else if (node.statBonus.stat === 'recovery') r += node.statBonus.amount;
      }
    });
    return { power: p, kinetic: k, symmetry: s, velocity: v, recovery: r };
  }, [gridNodesUnlocked]);

  // Derived stats with Aura multiplier applied
  const currentAuraId = profile?.equippedAura ?? 'none';
  const currentAura = AURAS.find(a => a.id === currentAuraId) || AURAS[0];
  const auraMult = currentAura.statMultiplier || { power: 1.0, kinetic: 1.0, symmetry: 1.0, velocity: 1.0 };
  const auraRecoveryMult = (currentAura.statMultiplier as any)?.recovery || 1.10;

  const finalPower = Math.round((basePower + sphereGridBonus.power) * auraMult.power);
  const finalKinetic = Math.round((baseKinetic + sphereGridBonus.kinetic) * auraMult.kinetic);
  const finalSymmetry = Math.round((baseSymmetry + sphereGridBonus.symmetry) * auraMult.symmetry);
  const finalVelocity = Math.round((baseVelocity + sphereGridBonus.velocity) * auraMult.velocity);
  const finalRecoveryAttr = Math.round((baseRecoveryAttr + sphereGridBonus.recovery) * auraRecoveryMult);

  // Stats bundle for battle simulator
  const derivedStats = useMemo(() => {
    const unlockedRelics: string[] = profile?.unlockedRelics || [];
    const hasObsidianHeart = unlockedRelics.includes('obsidian_heart');
    const hasPyroclasticSeed = unlockedRelics.includes('pyroclastic_seed');
    const hasAbyssalLantern = unlockedRelics.includes('abyssal_lantern');
    const hasChronoHourglass = unlockedRelics.includes('chrono_hourglass');
    const hasDemiurgeCrest = unlockedRelics.includes('demiurge_crest');

    const baseMaxHp = 100 + (finalSymmetry * 8) + (finalKinetic * 5) + (finalRecoveryAttr * 4);
    const maxHp = Math.round((baseMaxHp + (hasObsidianHeart ? 15 : 0)) * (hasDemiurgeCrest ? 1.10 : 1.0));
    
    const baseAttack = 10 + (finalPower * 2);
    const attack = Math.round((baseAttack + (hasPyroclasticSeed ? 5 : 0)) * (hasDemiurgeCrest ? 1.05 : 1.0));
    
    const defense = 5 + Math.round(finalSymmetry * 1.5) + Math.round(finalRecoveryAttr * 0.5) + (hasAbyssalLantern ? 3 : 0);
    const criticalChance = 5 + Math.round(finalVelocity * 0.5) + (hasChronoHourglass ? 1.5 : 0);
    const dodgeChance = 2 + Math.round(finalRecoveryAttr * 0.4);
    
    return { maxHp, attack, defense, criticalChance, dodgeChance };
  }, [finalPower, finalKinetic, finalSymmetry, finalVelocity, finalRecoveryAttr, profile?.unlockedRelics]);

  // RPG Raid victory reward processor
  const handleGainRaidRewards = async (xpGained: number, creditsGained: number, bossAura?: string, relicId?: string) => {
    let nextLevel = level;
    const petMultiplier = 1.45 + ((petLevels[equippedOutfit] || 1) - 1) * 0.1;
    
    // Apply Sun-Gilded Archon Scepter bonus
    const relics: string[] = profile?.unlockedRelics || [];
    const hasScepter = relics.includes('sun_gilded_scepter') || relicId === 'sun_gilded_scepter';
    const scepterMultiplier = hasScepter ? 1.10 : 1.0;

    const multipliedXp = Math.round(xpGained * petMultiplier * scepterMultiplier);
    let nextXp = xp + multipliedXp;
    const nextCredits = credits + creditsGained;
    let letPoints = unassignedPoints;
    
    const getXpNeeded = (lvl: number) => lvl * 500 + 2000;
    let leveledUp = false;

    while (nextXp >= getXpNeeded(nextLevel)) {
      nextXp -= getXpNeeded(nextLevel);
      nextLevel += 1;
      letPoints += 3; // Grant 3 points per level up
      leveledUp = true;
    }

    const nextRelics = [...relics];
    if (relicId && !nextRelics.includes(relicId)) {
      nextRelics.push(relicId);
    }

    const updated: any = {
      avatarLevel: nextLevel,
      avatarXp: nextXp,
      avatarCredits: nextCredits,
      unassignedPoints: letPoints,
      completedRaidsCount: completedRaidsCount + 1,
      unlockedRelics: nextRelics
    };

    if (bossAura) {
      updated[`unlocked_aura_${bossAura}`] = true;
    }

    setProfile(prev => prev ? { ...prev, ...updated } : null);
    await saveSettings(updated);
    
    if (relicId) {
      const foundRelic = RELICS.find(r => r.id === relicId);
      setToast({ 
        message: `🏛️ MYTHIC DROP: Claimed ${foundRelic?.name || relicId}! Passive unlocked.`, 
        type: 'success' 
      });
    } else if (leveledUp) {
      setToast({ message: `🎉 LEVELED UP to Level ${nextLevel}! +3 Talent Points!`, type: 'success' });
    } else {
      setToast({ message: `✓ Raid Complete! Gained +${multipliedXp} XP & +${creditsGained} Coins.`, type: 'success' });
    }
  };

  // Upgrade direct attribute with +1 spend
  const handleUpgradeAttribute = async (key: string, currentValue: number) => {
    if (unassignedPoints <= 0) return;
    const nextPoints = unassignedPoints - 1;
    const nextValue = currentValue + 1;
    
    const updated = {
      unassignedPoints: nextPoints,
      [key]: nextValue
    };
    
    setProfile(prev => prev ? { ...prev, ...updated } : null);
    await saveSettings(updated);
    setToast({ message: `Attribute upgraded successfully!`, type: 'success' });
  };

  // Synaptic mapping nodes activation
  const handleUnlockNode = async (nodeId: string, node: SphereNode) => {
    if (gridNodesUnlocked.includes(nodeId)) return;
    
    // Check points
    if (unassignedPoints < node.cost) {
      setToast({ message: `Insufficient Talent Points! (Requires ${node.cost} point(s))`, type: 'info' });
      return;
    }

    // Check connectivity
    const hasConnection = node.connections.some(conn => gridNodesUnlocked.includes(conn));
    if (!hasConnection) {
      setToast({ message: "Path locked! You must unlock adjacent nodes in the grid first.", type: 'info' });
      return;
    }

    // Spend cost & unlock synaptic node
    const updated = {
      unassignedPoints: unassignedPoints - node.cost,
      gridNodesUnlocked: [...gridNodesUnlocked, nodeId]
    };
    
    setProfile(prev => prev ? { ...prev, ...updated } : null);
    await saveSettings(updated);
    setToast({ message: `✓ Activated Node: ${node.name}!`, type: 'success' });
  };

  // Unique interactive Companion Pet Storage with LocalStorage Persistence
  const [petNames, setPetNames] = useState<Record<string, string>>({});
  const [petLevels, setPetLevels] = useState<Record<string, number>>({});
  const [petXps, setPetXps] = useState<Record<string, number>>({});

  // Synchronise pet stats when user ID changes
  useEffect(() => {
    try {
      const savedNames = localStorage.getItem(petNamesKey);
      setPetNames(savedNames ? JSON.parse(savedNames) : {});
    } catch {
      setPetNames({});
    }

    try {
      const savedLevels = localStorage.getItem(petLevelsKey);
      setPetLevels(savedLevels ? JSON.parse(savedLevels) : {});
    } catch {
      setPetLevels({});
    }

    try {
      const savedXps = localStorage.getItem(petXpsKey);
      setPetXps(savedXps ? JSON.parse(savedXps) : {});
    } catch {
      setPetXps({});
    }
  }, [userId, petNamesKey, petLevelsKey, petXpsKey]);

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
    localStorage.setItem(petNamesKey, JSON.stringify(updated));
    setIsRenamingPet(false);
    setToast({ message: `Companion renamed to "${trimmed}"!`, type: "success" });
  };

  const handleInteractPet = (action: 'feed' | 'train' | 'pet') => {
    if (action === 'feed') {
      if (currentPetLevel >= 100) {
        setToast({ message: `${currentPetName} is already at peak level 100!`, type: "info" });
        return;
      }
      const cost = 100;
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
        newLvl = Math.min(100, newLvl + 1);
        if (newLvl === 100) {
          newXp = 0;
        }
        setToast({ message: `Level Up! ${currentPetName} reached Level ${newLvl}!`, type: "success" });
      } else {
        setToast({ message: `Fed ${currentPetName}! +15 XP`, type: "success" });
      }

      const updatedXps = { ...petXps, [equippedOutfit]: newXp };
      const updatedLvls = { ...petLevels, [equippedOutfit]: newLvl };
      setPetXps(updatedXps);
      setPetLevels(updatedLvls);
      localStorage.setItem(petXpsKey, JSON.stringify(updatedXps));
      localStorage.setItem(petLevelsKey, JSON.stringify(updatedLvls));

      setPetFeedEffect('feed');
      setTimeout(() => setPetFeedEffect('none'), 1200);

    } else if (action === 'train') {
      if (currentPetLevel >= 100) {
        setToast({ message: `${currentPetName} is already at peak level 100!`, type: "info" });
        return;
      }
      const cost = 200;
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
        newLvl = Math.min(100, newLvl + 1);
        if (newLvl === 100) {
          newXp = 0;
        }
        setToast({ message: `Level Up! ${currentPetName} reached Level ${newLvl}!`, type: "success" });
      } else {
        setToast({ message: `${currentPetName} worked out the iron! +35 XP`, type: "success" });
      }

      const updatedXps = { ...petXps, [equippedOutfit]: newXp };
      const updatedLvls = { ...petLevels, [equippedOutfit]: newLvl };
      setPetXps(updatedXps);
      setPetLevels(updatedLvls);
      localStorage.setItem(petXpsKey, JSON.stringify(updatedXps));
      localStorage.setItem(petLevelsKey, JSON.stringify(updatedLvls));

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

  // Handle Free Claim of Bonus removed for testing production locks

  // Helper inside click handlers to buy and equip cosmetics
  const buyOrEquipItem = async (category: typeof activeTab, itemId: string, price: number) => {
    let itemName = itemId;
    if (category === 'operatives') {
      itemName = OUTFITS.find(o => o.id === itemId)?.name || itemId;
    } else if (category === 'auras') {
      itemName = AURAS.find(a => a.id === itemId)?.name || itemId;
    } else if (category === 'emotes') {
      itemName = EMOTES.find(e => e.id === itemId)?.name || itemId;
    } else if (category === 'titles') {
      itemName = TITLES.find(t => t.id === itemId)?.name || itemId;
    } else if (category === 'operativeBorders') {
      itemName = BORDERS.find(b => b.id === itemId)?.name || itemId;
    }

    let isPurchase = false;

    if (category === 'operatives') {
      const isAlreadyUnlocked = unlockedOutfits.includes(itemId);
      if (isAlreadyUnlocked) {
        const updated = { 
          equippedOutfit: itemId,
          [`equippedEmote_${itemId}`]: 'none',
          equippedEmote: 'none'
        };
        setProfile(prev => prev ? { ...prev, ...updated } : null);
        await saveSettings(updated);
      } else {
        if (credits < price) {
          setToast({ message: `Insufficient Coins to purchase ${itemName}!`, type: 'info' });
          return;
        }
        isPurchase = true;
        const updated = {
          avatarCredits: credits - price,
          unlockedOutfits: [...unlockedOutfits, itemId],
          equippedOutfit: itemId,
          [`equippedEmote_${itemId}`]: 'none',
          equippedEmote: 'none'
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
        const progressionLock = getAuraLockStatus(itemId, profile);
        if (progressionLock.isLocked) {
          setToast({ message: progressionLock.reason || 'Locked by progression', type: 'info' });
          return;
        }
        if (credits < price) {
          setToast({ message: `Insufficient Coins to purchase ${itemName}!`, type: 'info' });
          return;
        }
        isPurchase = true;
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
      const dbKey = `unlocked_emote_${equippedOutfit}_${itemId}`;
      const isUnlocked = itemId === 'none' || (profile as any)?.[dbKey];
      if (isUnlocked) {
        const updated = { 
          [`equippedEmote_${equippedOutfit}`]: itemId,
          equippedEmote: itemId
        };
        setProfile(prev => prev ? { ...prev, ...updated } : null);
        await saveSettings(updated);
      } else {
        const progressionLock = getEmoteLockStatus(itemId, equippedOutfit, profile);
        if (progressionLock.isLocked) {
          setToast({ message: progressionLock.reason || 'Locked by progression', type: 'info' });
          return;
        }
        if (credits < price) {
          setToast({ message: `Insufficient Coins to purchase ${itemName}!`, type: 'info' });
          return;
        }
        isPurchase = true;
        const updated = {
          avatarCredits: credits - price,
          [dbKey]: true,
          [`equippedEmote_${equippedOutfit}`]: itemId,
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
          setToast({ message: `Insufficient Coins to purchase ${itemName}!`, type: 'info' });
          return;
        }
        isPurchase = true;
        const updated = {
          avatarCredits: credits - price,
          [dbKey]: true,
          equippedTitle: itemId
        };
        setProfile(prev => prev ? { ...prev, ...updated } : null);
        await saveSettings(updated);
      }
    }
    else if (category === 'operativeBorders') {
      const dbKey = `unlocked_border_${itemId}`;
      const isUnlocked = itemId === 'none' || (profile as any)?.[dbKey];
      if (isUnlocked) {
        const updated = { equippedBorder: itemId };
        setProfile(prev => prev ? { ...prev, ...updated } : null);
        await saveSettings(updated);
      } else {
        if (credits < price) {
          setToast({ message: `Insufficient Coins to purchase ${itemName}!`, type: 'info' });
          return;
        }
        isPurchase = true;
        const updated = {
          avatarCredits: credits - price,
          [dbKey]: true,
          equippedBorder: itemId
        };
        setProfile(prev => prev ? { ...prev, ...updated } : null);
        await saveSettings(updated);
      }
    }

    if (isPurchase) {
      setToast({ message: `💸 Purchased & Equipped: ${itemName}!`, type: 'success' });
    } else {
      setToast({ message: `✨ Equipped: ${itemName}!`, type: 'success' });
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
        @keyframes particleFly {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        @keyframes holoWave {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
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

          <div className="flex items-center gap-2 px-1 border-r border-white/10 pr-3">
            <Zap className="w-4 h-4 text-purple-400" />
            <div className="flex flex-col">
              <span className="text-[8px] text-white/30 uppercase tracking-widest font-black leading-none">Level XP</span>
              <span className="text-sm font-black text-purple-400 font-mono tracking-tight">{xp.toLocaleString()} XP</span>
            </div>
          </div>

          <button
            onClick={async () => {
              const newCredits = credits + 1000000;
              setProfile(prev => prev ? { ...prev, avatarCredits: newCredits } : null);
              await saveSettings({ avatarCredits: newCredits });
              setToast({ message: "✓ +1,000,000 Sacred Coins granted for testing!", type: "success" });
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 rounded text-[9px] font-black text-amber-400 tracking-widest uppercase transition-all shrink-0 cursor-pointer"
            title="Grant 1,000,000 Testing Credits"
          >
            +1M Coins
          </button>
        </div>
      </div>


      {/* 5-Tab Navigation Ribbon for Avatar Panel */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'customization', label: 'PRESTIGE DESIGNER', icon: Shield, color: 'text-amber-400' },
          { id: 'sphere_grid', label: 'TALENT SPHERE GRID', icon: Trophy, color: 'text-gym-accent' },
          { id: 'auras', label: 'AURA SYNTHESIZER', icon: Sparkles, color: 'text-fuchsia-400' },
          { id: 'raid_portal', label: 'CHALLENGE PORTAL', icon: Skull, color: 'text-rose-500' },
          { id: 'trophies', label: 'TROPHY SHELF', icon: Award, color: 'text-yellow-400' },
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = innerTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setInnerTab(tab.id as any);
              }}
              className={`flex items-center gap-2 py-2 px-4 rounded-md text-xs font-bold tracking-wider uppercase transition-all select-none border border-transparent shrink-0 cursor-pointer ${
                isSelected 
                  ? 'bg-white/5 border-white/10 text-white shadow-xl shadow-black/40' 
                  : 'text-white/40 hover:text-white/85 hover:bg-white/[0.01]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* COMBINED HERO SPLIT-GRID: Avatar Showcase Card on the Left, Biometric progression cards stacked on the Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Majestic Avatar Showcase Card (col-span-5) */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-start gap-6 h-full w-full">
          <div className={`relative w-full max-w-[440px] lg:max-w-none aspect-[3/4.2] bg-black/50 ${getActiveBorder().id === 'none' ? 'border border-white/10' : getActiveBorder().cardBorderClass} rounded-lg overflow-hidden flex flex-col justify-between p-7 group transition-all duration-700 shadow-3xl ${activeAuraStyling.outerGlow}`}>
            
            {/* Theme Border Corner Elements */}
            {getActiveBorder().cornerElement}

            {/* Banner Theme Background */}
            {!['vanguard_cadet', 'naruto', 'sasuke', 'jinwoo', 'goku', 'kaiju8', 'beerus'].includes(activeOutfit.id) ? (
              <>
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
              </>
            ) : (
              <div className="absolute inset-0 z-0 transition-all duration-700 bg-zinc-950" />
            )}

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

            {/* Render Back cosmetics (wings, sword, shield) behind reference if not Naruto/Sasuke/Jinwoo emotes */}
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
            <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center overflow-hidden rounded-lg transition-all duration-500">
              <img 
                src={activeCharacterImage} 
                alt={activeOutfit.name} 
                className={`w-full h-full object-cover transform select-none pointer-events-none transition-all duration-700 ${
                  equippedEmote === 'final_form'
                    ? 'animate-super-shudder scale-[1.05]'
                    : 'scale-100 group-hover:scale-[1.04]'
                }`}
                style={{ opacity: 1 }}
                referrerPolicy="no-referrer"
              />

              {/* Inner Aura overlay graphics rendered DIRECTLY on top of character image for max intensity */}
              {activeAuraStyling.innerEffects}

              {/* Active Rank Up Holographic Scanning Window & Particles */}
              {explodingParticles.map((p) => (
                <div
                  key={p.id}
                  className="absolute top-1/2 left-1/2 rounded-full pointer-events-none z-30"
                  style={{
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    boxShadow: `0 0 10px ${p.color}, 0 0 20px ${p.color}`,
                    "--tx": p.tx,
                    "--ty": p.ty,
                    animation: `particleFly ${p.duration} cubic-bezier(0.1, 0.8, 0.3, 1) ${p.delay} forwards`,
                  } as React.CSSProperties}
                />
              ))}

              <AnimatePresence>
                {showRankUp && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4 text-center font-mono"
                  >
                    {/* Glowing background burst */}
                    <div className={`absolute w-36 h-36 rounded-full filter blur-[40px] opacity-25 ${rankUpData.type === 'class' ? 'bg-[#06b6d4]' : rankUpData.type === 'pr' ? 'bg-red-500' : 'bg-gym-accent'}`} />

                    {/* Laser scanning sweep lines */}
                    <div className="absolute inset-x-0 h-0.5 bg-gym-accent/40 z-40 filter blur-xs" style={{ animation: 'holoWave 2.2s linear infinite' }} />

                    <motion.div
                      initial={{ scale: 0.8, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.8, y: -15 }}
                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                      className="space-y-4 z-40"
                    >
                      {/* Interactive Spec Badge */}
                      <span className={`text-[8px] font-black uppercase tracking-[0.25em] px-2.5 py-1 rounded-md border ${
                        rankUpData.type === 'class' ? 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' : rankUpData.type === 'pr' ? 'text-red-400 border-red-500/20 bg-red-500/5' : 'text-gym-accent border-gym-accent/20 bg-gym-accent/5'
                      }`}>
                        {rankUpData.title}
                      </span>

                      <div className="space-y-1 mt-2">
                        <span className="text-[10px] text-white/40 uppercase tracking-widest block">{rankUpData.description}</span>
                        
                        <div className="flex flex-col items-center justify-center py-2.5 px-3 bg-black/60 border border-white/5 rounded-md my-1">
                          <span className="text-[9px] text-white/30 uppercase tracking-widest block">SYSTEM METRIC SHIFT</span>
                          <div className="flex items-center gap-3 mt-1.5 font-bold">
                            <span className="text-xs text-white/50 line-through tracking-wide">{rankUpData.prev}</span>
                            <ChevronRight className="w-4 h-4 text-gym-accent animate-pulse" />
                            <span className="text-sm text-white tracking-widest font-black uppercase text-glow accent-light animate-bounce">
                              {rankUpData.current}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Success Badge */}
                      <div className="flex justify-center">
                        <div className="w-10 h-10 rounded-full bg-gym-accent/10 border border-gym-accent/30 flex items-center justify-center animate-pulse">
                          <Zap className="w-4 h-4 text-gym-accent" />
                        </div>
                      </div>

                      <span className="text-[7.5px] text-white/20 uppercase tracking-[0.3em] block mt-4 animate-pulse">
                        Somatic calibration complete
                      </span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dynamic visual overlay effects triggered by emote type */}
              {equippedEmote === 'final_form' && (
                <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between overflow-hidden">
                  {/* Highly optimized background glow matching theme */}
                  <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t via-transparent to-transparent opacity-50" style={{ backgroundImage: `linear-gradient(to top, ${finalFormTheme.color}45, transparent)` }} />
                  
                  {/* Stylized technological overlay rings */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full border-4 border-dashed animate-orbit opacity-25 filter blur-xs" style={{ borderColor: finalFormTheme.color, animationDuration: '6s' }} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full border-2 border-double animate-orbit opacity-40" style={{ borderColor: finalFormTheme.color, animationDuration: '10s', animationDirection: 'reverse' }} />
                  
                  {/* Tech status display overlay at the top */}
                  {activeOutfit.id !== 'naruto' && activeOutfit.id !== 'sasuke' && activeOutfit.id !== 'jinwoo' && activeOutfit.id !== 'goku' && activeOutfit.id !== 'kaiju8' && activeOutfit.id !== 'beerus' && (
                    <div className="bg-black/85 border-b border-white/10 px-3 py-1.5 flex items-center justify-between w-full relative z-30">
                      <span className="text-[8px] font-black font-mono tracking-widest text-red-500 animate-pulse">● OVERLOAD</span>
                      <span className="text-[7.5px] font-extrabold font-mono text-white/50 tracking-widest">{finalFormTheme.bannerText}</span>
                    </div>
                  )}

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
                className={`absolute ${isFullArt ? 'bottom-[24%] right-[8%]' : 'bottom-3 right-3'} z-30 flex flex-col items-center group/minipet cursor-pointer`}
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
                <span className="text-2xl font-light italic font-serif text-white tracking-wide leading-none select-none drop-shadow">
                  {getActiveTitle().name.toUpperCase()}
                </span>
                <span className="text-[10px] text-white/40 block mt-1 tracking-normal font-light italic">{getActiveTitle().desc}</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-gym-accent/30 bg-gym-accent/10 flex items-center justify-center shadow-inner shrink-0">
                <Crown className="w-5 h-5 text-gym-accent" />
              </div>
            </div>

          </div>

          {/* Active Companion Pet Card (Injected under the Showcase card, constantly displayed on the left column) */}
          <div className="w-full max-w-[440px] xl:max-w-none bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/80 border border-white/12 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_32px_rgba(0,0,0,0.8)] backdrop-blur-md group/petcard">
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
                          className="text-white/30 hover:text-gym-accent hover:scale-105 transition-all p-0.5 pointer-events-auto"
                          title="Rename Companion"
                        >
                          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2-2v-7" />
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
            <div className="flex gap-4 bg-black/30 border border-white/15 p-3.5 rounded-lg relative overflow-hidden">
              <div className={`w-16 h-16 rounded flex items-center justify-center border bg-black/70 flex-shrink-0 relative overflow-hidden transition-all duration-300 ${
                petFeedEffect === 'feed' ? 'scale-105 bg-emerald-950/25 border-emerald-500/50' : 
                petFeedEffect === 'train' ? 'scale-105 bg-amber-950/25 border-amber-500/50' : 
                petFeedEffect === 'peteffect' ? 'scale-105 bg-fuchsia-950/25 border-fuchsia-500/50' : 
                'border-white/15'
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
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5 text-[8.5px] font-mono text-gym-accent font-black tracking-wider uppercase truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-gym-accent animate-pulse" />
                    Buff: {activePetInfo.buff}
                  </div>
                  <div className="flex items-center gap-1.5 text-[8.5px] font-mono text-emerald-400 font-extrabold tracking-wider uppercase truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Combat Boost: +{currentPetLevel * 2}% DMG | -{currentPetLevel * 2}% DMG Recv
                  </div>
                </div>
              </div>
            </div>

            {/* Bonding synergy progress gauge */}
            <div className="flex flex-col gap-1.5 bg-black/20 border border-white/15 p-2.5 rounded">
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
                <div className="text-[6.5px] font-mono text-emerald-400/80 font-bold">100 COINS // +15XP</div>
              </button>

              <button 
                onClick={() => handleInteractPet('train')}
                className="bg-amber-500/[0.03] hover:bg-amber-500/10 active:scale-95 text-amber-400 border border-amber-500/20 py-1.5 px-1 rounded flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <div className="text-[9px] font-black uppercase tracking-wider">Lifting Logs</div>
                <div className="text-[6.5px] font-mono text-amber-400/80 font-bold">200 COINS // +35XP</div>
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

        {/* Right Side Column (Column 2) */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col h-full xl:max-h-[975px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={innerTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col h-full"
            >
              {innerTab === 'customization' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 grid-rows-[auto_auto_1fr] flex-1">
                  
                  {/* Card 1: Integrated Profile & Combat Readiness (Span col-span-2) */}
          <div className="md:col-span-2 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/80 border border-white/12 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-gym-accent/40 group shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_32px_rgba(0,0,0,0.8)] backdrop-blur-md">
            {/* Decal background grid patterns */}
            <div className="absolute inset-0 opacity-[0.03] bg-grid-pattern pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                {/* Advanced Micro avatar silhouette halo */}
                <div className="relative w-16 h-16 rounded-md border border-gym-accent/30 overflow-hidden flex-shrink-0 bg-zinc-950 p-0.5 group-hover:border-gym-accent/60 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-tr from-gym-accent/10 to-transparent opacity-40" />
                  <img 
                    src={activeCharacterImage} 
                    alt="Active Micro Outfit" 
                    className="w-full h-full object-cover rounded-md transition-transform duration-500 group-hover:scale-[1.08]" 
                    style={{ opacity: 1 }}
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
 
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-white uppercase font-mono tracking-widest leading-none group-hover:text-gym-accent transition-colors">
                      {profile?.displayName || "LIFTER_01"}
                    </h3>
                    <span className="text-[7.5px] font-mono font-bold tracking-widest text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase animate-pulse">
                      AUTHENTICATED
                    </span>
                  </div>
                  <p className="text-[9.5px] text-white/40 uppercase tracking-[0.2em] font-black leading-none mt-1.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gym-accent/60" /> Elite Physical Construct // SYSTEM AGENT
                  </p>
                </div>
              </div>
 
              {/* Level XP summary block */}
              <div className="w-full sm:flex-1 sm:max-w-[280px] sm:min-w-[200px] flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-4 text-[10px] font-extrabold font-mono text-white/55 tracking-wider">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="bg-gym-accent/15 border border-gym-accent/30 text-gym-accent px-1.5 py-0.5 rounded text-[8.5px] font-black tracking-widest uppercase">
                      RANK LEVEL {level}
                    </span>
                  </div>
                  <span className="text-[9px] text-white/40 font-black shrink-0 whitespace-nowrap">{xp.toLocaleString()} / {xpNeeded.toLocaleString()} XP</span>
                </div>
 
                {/* Visual Segmented Progress Bar */}
                <div className="relative w-full h-2.5 bg-zinc-950 border border-white/10 rounded-full p-[2px] overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercentage}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-gym-accent rounded-full" 
                    style={{ boxShadow: '0 0 10px rgba(168, 85, 247, 0.45)' }}
                  />
                </div>
                
                {/* Horizontal Tick guides */}
                <div className="flex justify-between px-1 text-[7px] text-white/20 font-bold font-mono">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
 
          {/* Card 2: Arena Milestones & Trophy Standing (Col-span-1) */}
          <div className="col-span-1 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/80 border border-white/12 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[178px] hover:border-gym-accent/40 group transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_32px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/5 rounded-full filter blur-xl pointer-events-none" />
            
            <div className="flex items-start gap-3.5 relative z-10">
              <div className="w-12 h-12 rounded-lg bg-purple-950/15 border border-purple-500/20 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                <Trophy className="w-6 h-6 text-fuchsia-400" />
              </div>
              <div>
                <span className="text-[8.5px] text-white/30 uppercase tracking-[0.25em] font-black block">ARENA STANDING</span>
                <h4 className="text-lg font-black text-white font-mono tracking-wider mt-0.5">{rankName}</h4>
                <p className="text-[8.5px] text-white/40 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                  <Award className="w-3 text-gym-accent" /> {totalVolume.toLocaleString()} Total Volume (KG)
                </p>
              </div>
            </div>
 
            {/* Rank progression indicator bar */}
            <div className="space-y-1.5 mt-5 relative z-10">
              <div className="flex justify-between text-[8px] font-black text-white/40 uppercase tracking-widest">
                <span>PROGRESS TO NEXT TIER</span>
                <span className="text-gym-accent font-mono">{rankMeta.label}</span>
              </div>
              
              <div className="relative w-full h-1.5 bg-zinc-950 border border-white/5 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-gym-accent rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (rankMeta.current / rankMeta.target) * 100)}%` }} />
              </div>
 
              <div className="text-right text-[7.5px] text-white/25 font-black uppercase tracking-wider font-mono">
                {rankMeta.current.toLocaleString()} / {rankMeta.target.toLocaleString()} Power Units
              </div>
            </div>
          </div>
 
          {/* Card 3: Neural Buffs & System Core Calibration (Col-span-1) */}
          <div className="col-span-1 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/80 border border-white/12 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[178px] hover:border-gym-accent/40 group transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_32px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gym-accent/5 rounded-full filter blur-xl pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className="text-[8.5px] text-white/30 uppercase tracking-[0.25em] font-black block">COGNITIVE SYNERGY</span>
                <span className="text-lg font-mono font-black text-white tracking-widest block mt-0.5">BUFF METRICS</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-gym-accent text-[8px] font-semibold bg-gym-accent/10 border border-gym-accent/25 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-gym-accent" /> SYNCS_OK
              </div>
            </div>
 
            {/* High fidelity status list */}
            <div className="space-y-1 mt-3 relative z-10 font-mono text-[9px] uppercase font-bold text-white/45">
              <div className="flex justify-between border-b border-white/[0.04] pb-1">
                <span>COMPANION SYNERGY:</span>
                <span className="text-white text-right shrink-0">LV.{currentPetLevel} {currentPetName}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-1">
                <span>EQUIPPED EMOTE:</span>
                <span className="text-gym-accent">{equippedEmote === 'none' ? 'NO POSE ACT' : equippedEmote.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span>SYS MULTIPLIER:</span>
                <span className="text-emerald-400">{(1.45 + (currentPetLevel - 1) * 0.1).toFixed(2)}X EXP RATE</span>
              </div>
            </div>
 
            {/* Pulsing visual wave monitor element under buffs */}
            <div className="mt-2.5 flex items-center justify-between bg-zinc-950/60 border border-white/5 rounded px-2.5 py-1">
              <span className="text-[7.5px] font-mono font-black tracking-widest text-white/20 uppercase">NEURAL FEEDBACK</span>
              <div className="w-14 h-4 opacity-50">
                <svg className="w-full h-full text-gym-accent" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M 0,15 L 20,15 L 24,5 L 27,25 L 32,1 L 36,18 L 39,15 L 100,15"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: '280',
                      animation: 'ecgPulse 2.5s linear infinite'
                    }}
                  />
                </svg>
              </div>
            </div>
          </div>
 
          {/* Card 4: Physiological Core & Biometrics Unified Calibration Matrix (Span col-span-2) */}
          <div className="md:col-span-2 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/80 border border-white/12 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-gym-accent/40 group shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_32px_rgba(0,0,0,0.8)] backdrop-blur-md w-full flex flex-col justify-between h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gym-accent/10 to-transparent pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 mb-5 relative z-10 gap-3">
              <div>
                <h4 className="text-[9px] text-gym-accent font-mono font-black tracking-[0.3em] uppercase">SYSTEM CORE</h4>
                <p className="text-base font-light font-serif italic text-white leading-tight">Biometric Evolution & Calibration Matrix</p>
                <p className="text-[9.5px] text-white/40 tracking-wider font-sans mt-0.5">Optimize physical parameters by analyzing combat telemetry ranges and allocating talent points</p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <div className="bg-gym-accent/10 border border-gym-accent/30 rounded px-2.5 py-1 flex items-center gap-1.5 animate-pulse shrink-0">
                  <span className="w-1 h-1 rounded-full bg-gym-accent" />
                  <span className="text-[10px] font-black text-gym-accent font-mono uppercase tracking-wider">
                    {unassignedPoints} TALENT POINTS
                  </span>
                </div>
              </div>
            </div>

            {/* UNMERGED DUAL PANELS */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-10 flex-1">
              
              {/* Left Side: Biometric Telemetry & Core Combat Ratings (Col-span-5) */}
              <div className="xl:col-span-5 flex flex-col justify-between min-h-[350px]">
                <div>
                  <div className="border-b border-white/5 pb-2">
                    <span className="text-[9px] text-gym-accent font-mono font-black tracking-widest uppercase">COMBAT TELEMETRY</span>
                    <span className="text-[8px] text-white/30 uppercase tracking-widest block font-mono mt-0.5">derived stats feed</span>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-between gap-2.5 mt-3">
                  {[
                    {
                      label: 'ATTACK RATING',
                      value: `${derivedStats.attack} ATK`,
                      percent: Math.min(100, Math.round((derivedStats.attack / 250) * 100)),
                      icon: Sword,
                      color: 'text-red-500',
                      barColor: 'from-red-500 to-rose-400'
                    },
                    {
                      label: 'MAX HEALTH (HP)',
                      value: `${derivedStats.maxHp} HP`,
                      percent: Math.min(100, Math.round((derivedStats.maxHp / 550) * 100)),
                      icon: Activity,
                      color: 'text-blue-400',
                      barColor: 'from-blue-500 to-cyan-400'
                    },
                    {
                      label: 'ACTIVE DEFENSE',
                      value: `${derivedStats.defense} DEF`,
                      percent: Math.min(100, Math.round((derivedStats.defense / 150) * 100)),
                      icon: Shield,
                      color: 'text-emerald-400',
                      barColor: 'from-emerald-500 to-teal-400'
                    },
                    {
                      label: 'CRITICAL VALUE',
                      value: `${derivedStats.criticalChance}% CRT`,
                      percent: Math.min(100, Math.round((derivedStats.criticalChance / 45) * 100)),
                      icon: Zap,
                      color: 'text-amber-400',
                      barColor: 'from-amber-400 to-yellow-500'
                    },
                    {
                      label: 'EVASION DODGE',
                      value: `${derivedStats.dodgeChance}% DDG`,
                      percent: Math.min(100, Math.round((derivedStats.dodgeChance / 35) * 100)),
                      icon: Sparkles,
                      color: 'text-purple-400',
                      barColor: 'from-purple-500 to-fuchsia-400'
                    }
                  ].map((comb, index) => {
                    const CombIcon = comb.icon;
                    return (
                      <div key={index} className="flex flex-col gap-1.5 p-2.5 rounded bg-zinc-950/60 border border-white/5 hover:border-white/10 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <CombIcon className={`w-3.5 h-3.5 ${comb.color} shrink-0`} />
                            <span className="text-[9.5px] font-mono font-bold uppercase text-white/70 tracking-widest truncate">{comb.label}</span>
                          </div>
                          <span className="text-xs font-mono font-black text-white shrink-0 pl-1">{comb.value}</span>
                        </div>
                        <div className="relative w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                          <div className={`absolute top-0 left-0 h-full bg-gradient-to-r ${comb.barColor} rounded-full`} style={{ width: `${comb.percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Talent Attributes Protocols (Col-span-7) */}
              <div className="xl:col-span-7 flex flex-col justify-between animate-[slideUp_0.3s_ease-out] min-h-[350px]">
                <div>
                  <div className="border-b border-white/5 pb-2">
                    <span className="text-[9px] text-gym-accent font-mono font-black tracking-widest uppercase">TALENT CALIBRATION MATRIX</span>
                    <span className="text-[8px] text-white/30 uppercase tracking-widest block font-mono mt-0.5">allocate talent points directly</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between gap-2.5 mt-3">
                  {/* Slider substitute start */}
                  <div className="hidden">
                    <div ref={bioScrollRef} />
                  </div>
                  {[
                {
                  key: 'avatarPower',
                  label: 'Muscular Power & Strength',
                  short: 'STR',
                  evolutionVal: calcStrength,
                  evolutionDesc: 'Volume-based',
                  evolutionTrigger: 'Lifting Volume',
                  base: basePower,
                  final: finalPower,
                  desc: 'Increases challenge attack rating',
                  icon: Flame,
                  color: 'text-red-500',
                  barColor: 'from-red-500 to-rose-400',
                  borderColor: 'border-red-500/25',
                  activeGlow: 'hover:border-red-500/30 hover:bg-red-950/[0.03]',
                },
                {
                  key: 'avatarKinetic',
                  label: 'Kinetic Stamina & Endurance',
                  short: 'END',
                  evolutionVal: calcEndurance,
                  evolutionDesc: 'Session-based',
                  evolutionTrigger: 'Completed Sessions',
                  base: baseKinetic,
                  final: finalKinetic,
                  desc: 'Increases maximum combat life-pool',
                  icon: Activity,
                  color: 'text-blue-400',
                  barColor: 'from-blue-500 to-cyan-400',
                  borderColor: 'border-blue-400/25',
                  activeGlow: 'hover:border-blue-400/30 hover:bg-blue-950/[0.03]',
                },
                {
                  key: 'avatarSymmetry',
                  label: 'Symmetry & Discipline',
                  short: 'DIS',
                  evolutionVal: calcDiscipline,
                  evolutionDesc: 'Streak-based',
                  evolutionTrigger: 'Consistency Streak',
                  base: baseSymmetry,
                  final: finalSymmetry,
                  desc: 'Supports posture & defensive defense',
                  icon: Trophy,
                  color: 'text-emerald-400',
                  barColor: 'from-emerald-500 to-teal-400',
                  borderColor: 'border-emerald-500/25',
                  activeGlow: 'hover:border-emerald-400/30 hover:bg-emerald-950/[0.03]',
                },
                {
                  key: 'avatarVelocity',
                  label: 'Velocity & Consistency',
                  short: 'CON',
                  evolutionVal: calcConsistency,
                  evolutionDesc: 'Log-based',
                  evolutionTrigger: 'Continuous Logs',
                  base: baseVelocity,
                  final: finalVelocity,
                  desc: 'Directly boosts critical value likelihood',
                  icon: Award,
                  color: 'text-amber-400',
                  barColor: 'from-amber-400 to-yellow-500',
                  borderColor: 'border-amber-400/25',
                  activeGlow: 'hover:border-amber-400/30 hover:bg-amber-950/[0.03]',
                },
                {
                  key: 'avatarRecovery',
                  label: 'Adaptive Recovery & Rest',
                  short: 'REC',
                  evolutionVal: calcRecovery,
                  evolutionDesc: 'Sets-based',
                  evolutionTrigger: 'Completed Sets',
                  base: baseRecoveryAttr,
                  final: finalRecoveryAttr,
                  desc: 'Shield regenerator, HP & Evasion Dodge buff',
                  icon: Shield,
                  color: 'text-purple-400',
                  barColor: 'from-purple-500 to-fuchsia-400',
                  borderColor: 'border-purple-500/25',
                  activeGlow: 'hover:border-purple-500/30 hover:bg-purple-950/[0.03]',
                }
              ].map((stat) => {
                const StatIconComp = stat.icon;
                return (
                  <div 
                    key={stat.key} 
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 px-3 bg-zinc-950/70 border border-white/10 rounded-md hover:border-white/20 transition-all duration-300 relative overflow-hidden pb-3"
                  >
                    {/* Attribute label tag */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="p-1 rounded bg-white/[0.02] border border-white/5 shrink-0">
                        <StatIconComp className={`w-3.5 h-3.5 ${stat.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-black text-white font-mono leading-none">{stat.short}</span>
                          <span className="text-[9.5px] text-white/50 font-mono tracking-wider font-extrabold block leading-none">LV {stat.final}</span>
                        </div>
                        <span className="text-[8.5px] tracking-wide text-white/30 truncate block mt-1 font-sans" title={stat.label}>{stat.label}</span>
                      </div>
                    </div>

                    {/* Attribute Upgrade Buttons */}
                    <div className="flex items-center justify-between gap-1.5 bg-black/40 border border-white/5 p-1 rounded font-mono md:w-[130px] shrink-0">
                      <div className="flex flex-col font-mono pl-1">
                        <span className="text-[7.5px] font-extrabold uppercase font-mono tracking-widest text-[#ffffff]/40 leading-none">Base</span>
                        <span className="text-[9.5px] font-black font-mono text-[#ffffff]/85 leading-tight mt-0.5">{stat.base}</span>
                      </div>

                      <button
                        onClick={() => handleUpgradeAttribute(stat.key, stat.base)}
                        disabled={unassignedPoints <= 0}
                        className="w-5 h-5 rounded-md bg-gym-accent hover:bg-gym-accent-light text-black disabled:opacity-20 transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0 disabled:pointer-events-none"
                        title={`Calibrate ${stat.short}`}
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3.5]" />
                      </button>

                      <div className="flex flex-col items-end pr-1">
                        <span className="text-[7.5px] font-extrabold uppercase font-mono tracking-widest text-[#ffffff]/40 leading-none">Final</span>
                        <span className={`text-[9.5px] font-mono font-black leading-tight mt-0.5 px-1 rounded bg-zinc-900 border ${stat.borderColor} ${stat.color}`}>
                          {stat.final}
                        </span>
                      </div>
                    </div>

                    {/* Dynamic bottom edge energy bar indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-900/50">
                      <div className={`h-full bg-gradient-to-r ${stat.barColor}`} style={{ width: `${stat.evolutionVal}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      </div>
    ) : innerTab === 'sphere_grid' ? (
                <SphereGrid 
                  unassignedPoints={unassignedPoints}
                  gridNodesUnlocked={gridNodesUnlocked}
                  onUnlockNode={handleUnlockNode}
                />
              ) : innerTab === 'auras' ? (
                <AuraSynthesizer 
                  profile={profile}
                  equippedAura={currentAuraId}
                  onBuyOrEquip={(auraId, price) => buyOrEquipItem('auras', auraId, price)}
                />
              ) : innerTab === 'raid_portal' ? (
                <ChallengePortal 
                  displayName={profile?.displayName || "Athlete Specimen"}
                  level={level}
                  derivedStats={derivedStats}
                  onGainRewards={handleGainRaidRewards}
                  activePetLevel={currentPetLevel}
                  activePetName={currentPetName}
                  unlockedRelics={profile?.unlockedRelics || []}
                />
              ) : (
                <div id="trophy-shelf-section" className="bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/80 border border-white/12 rounded-2xl p-6 relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_32px_rgba(0,0,0,0.8)] backdrop-blur-md h-full flex flex-col justify-start flex-1 gap-6 min-h-[500px]">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-yellow-500/10 to-transparent pointer-events-none" />
                  <div className="absolute top-1/2 left-0 w-36 h-36 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none blur-xl" />
                  
                  {/* Title Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-4 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-1 px-2 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-mono text-[9px] uppercase tracking-wider font-extrabold animate-pulse">🏛️ Coliseum Specialty</span>
                      </div>
                      <h3 className="text-xl font-light font-serif text-white tracking-wide mt-1.5">Coliseum Trophy Room & Relic Forge</h3>
                      <p className="text-[11px] text-white/50 tracking-wide font-sans mt-0.5">Defeating legendary portal titans forges physical relics that provide passive physical status bonuses.</p>
                    </div>
                    {/* Active Relics Tracker */}
                    <div className="bg-zinc-950 border border-white/5 p-3 rounded-lg flex items-center gap-3 shrink-0">
                      <div className="p-2 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 rounded-full">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div className="font-mono">
                        <span className="text-[9px] uppercase tracking-widest text-[#ffffff]/45 block">Relics Active</span>
                        <span className="text-lg font-black text-white">{(profile?.unlockedRelics || []).length} <span className="text-xs text-white/30">/ {RELICS.length}</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Container wrapper to prevent cutting off relics at the bottom */}
                  <div className="flex-grow flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-6 min-h-0">
                    {/* Relic Resonance Summary Section */}
                    <div className="bg-zinc-950/90 border border-yellow-500/10 rounded-lg p-4 relative overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/[0.02] to-transparent pointer-events-none" />
                      <h4 className="text-[9.5px] font-mono font-extrabold tracking-widest text-yellow-500 uppercase flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" /> RELIC RESONANCE PASSIVES
                      </h4>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
                        {[
                          { label: 'Max Health pool', value: (profile?.unlockedRelics || []).includes('obsidian_heart') ? '+15 HP' : '+0 HP', active: (profile?.unlockedRelics || []).includes('obsidian_heart') },
                          { label: 'Somatic Might', value: (profile?.unlockedRelics || []).includes('pyroclastic_seed') ? '+5 ATK' : '+0 ATK', active: (profile?.unlockedRelics || []).includes('pyroclastic_seed') },
                          { label: 'Resting Defense', value: (profile?.unlockedRelics || []).includes('abyssal_lantern') ? '+3 DEF' : '+0 DEF', active: (profile?.unlockedRelics || []).includes('abyssal_lantern') },
                          { label: 'Trial Experience', value: (profile?.unlockedRelics || []).includes('sun_gilded_scepter') ? '+10% XP' : '+0% XP', active: (profile?.unlockedRelics || []).includes('sun_gilded_scepter') },
                          { label: 'Critical Strike', value: (profile?.unlockedRelics || []).includes('chrono_hourglass') ? '+1.5% CRIT' : '+0% CRIT', active: (profile?.unlockedRelics || []).includes('chrono_hourglass') },
                        ].map((sub, i) => (
                          <div key={i} className={`p-2.5 rounded border font-mono text-center flex flex-col justify-center items-center gap-0.5 ${sub.active ? 'border-yellow-500/20 bg-yellow-500/[0.04] text-white' : 'border-white/5 bg-black/40 text-white/30'}`}>
                            <span className="text-[8.5px] uppercase tracking-wider block font-sans text-white/40">{sub.label}</span>
                            <span className={`text-xs font-black mt-1 ${sub.active ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]' : 'text-white/20'}`}>{sub.value}</span>
                          </div>
                        ))}
                      </div>
                      {(profile?.unlockedRelics || []).includes('demiurge_crest') && (
                        <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/25 rounded flex items-center justify-between text-[11px] font-mono text-yellow-300 px-3">
                          <span className="font-extrabold">👑 PRIMORDIAL ASCENSION ACTIVE:</span>
                          <span>+5% General Strength Multiplier & +10% Core Health Multiplier enabled!</span>
                        </div>
                      )}
                    </div>

                    {/* Relics Library Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {RELICS.map((relic) => {
                        const isUnlocked = (profile?.unlockedRelics || []).includes(relic.id);
                        return (
                          <div 
                            key={relic.id}
                            className={`relative border rounded-lg p-4 bg-zinc-950/90 flex flex-col justify-between min-h-[170px] transition-all duration-300 overflow-hidden group/relic ${
                              isUnlocked 
                                ? 'border-yellow-500/35 text-white shadow-[0_0_20px_rgba(234,179,8,0.06)] hover:border-yellow-500/50 hover:shadow-[0_0_25px_rgba(234,179,8,0.12)] bg-gradient-to-b from-yellow-500/[0.01] to-transparent' 
                                : 'border-white/5 text-white/40 bg-zinc-950/40 select-none'
                            }`}
                          >
                            {/* Top row */}
                            <div>
                              <div className="flex items-start justify-between">
                                <div className={`p-2.5 rounded-lg border font-mono text-xl flex items-center justify-center shrink-0 shadow-md ${
                                  isUnlocked 
                                    ? relic.badgeColor + ' shadow-yellow-500/5'
                                    : 'border-white/5 bg-zinc-900/50 text-white/20'
                                }`}>
                                  {relic.icon}
                                </div>
                                {isUnlocked ? (
                                  <span className="flex items-center gap-1 text-[8.5px] font-mono font-extrabold text-[#10b981] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase">
                                    <Check className="w-3 h-3 stroke-[3]" /> Bound & Active
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-[8.5px] font-mono font-black text-[#f43f5e] bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded uppercase">
                                    <Lock className="w-3 h-3" /> Dormant
                                  </span>
                                )}
                              </div>
                              
                              {/* Relic Title */}
                              <h5 className={`font-serif text-sm mt-3.5 transition-colors ${isUnlocked ? 'text-white' : 'text-white/40'}`}>
                                {relic.name}
                              </h5>
                              
                              {/* Relic Description */}
                              <p className="text-[11px] text-white/50 font-normal mt-1 leading-relaxed">
                                {relic.description}
                              </p>
                            </div>

                            {/* Passive Bonus Tag lines */}
                            <div className="mt-4 border-t border-white/5 pt-3 flex flex-col gap-1">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-mono uppercase tracking-wider text-[#ffffff]/30">Passive Attributer:</span>
                                <span className={`text-[10px] font-mono font-black ${isUnlocked ? 'text-yellow-400' : 'text-white/20'}`}>
                                  {relic.bonusText}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[9px] font-mono mt-0.5">
                                <span className="text-[#ffffff]/30">Titan Vessel Name:</span>
                                <span className={isUnlocked ? 'text-white/70' : 'text-white/20'}>{relic.bossName}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Relocated Widescreen Avatar Store Section at bottom */}
      {innerTab === 'customization' && (
        <div className="w-full mt-8 animate-[fadeIn_0.5s_ease-out]">
          <div className="bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/80 border border-white/12 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-gym-accent/30 group shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_32px_rgba(0,0,0,0.8)] backdrop-blur-md w-full">
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-gym-accent/5 to-transparent pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-gradient-to-tr from-purple-500/5 to-transparent pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 mb-5 relative z-10 gap-3">
              <div>
                <h4 className="text-[10px] text-gym-accent font-mono font-black tracking-[0.3em] uppercase">STYLING SELECTION LAB</h4>
                <p className="text-lg font-light font-serif italic text-white leading-tight">Athletes & Holographics Customizer</p>
                <p className="text-[11px] text-white/50 tracking-wider font-sans mt-0.5">Use active coins to obtain custom skins, dynamic action postures, status titles, and avatar borders</p>
              </div>
            </div>

            {/* Customizer Sub-Tab Ribbon with Horizontal Smooth Scrolling */}
            <div className="relative border border-white/10 bg-zinc-950/80 rounded px-1 flex items-center overflow-hidden mb-6">
              {showLeftArrow && (
                <button 
                  onClick={() => scrollTabsNext('left')}
                  className="absolute left-0 inset-y-0 px-2 bg-gradient-to-r from-black/90 via-black/40 to-transparent text-white/60 hover:text-white z-40 flex items-center cursor-pointer transition-all"
                  title="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4 text-gym-accent" />
                </button>
              )}

              <div 
                ref={tabContainerRef}
                className="flex flex-1 overflow-x-auto no-scrollbar scroll-smooth relative"
              >
                {[
                  { id: 'operatives', label: 'Operatives' },
                  { id: 'emotes', label: 'Emotes' },
                  { id: 'titles', label: 'Titles' },
                  { id: 'operativeBorders', label: 'Borders' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    data-active={activeTab === tab.id ? "true" : "false"}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] relative cursor-pointer font-mono transition-all flex-shrink-0 ${
                      activeTab === tab.id ? 'text-gym-accent bg-white/[0.02]' : 'text-white/40 hover:text-white/80'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="avatar-shop-active-line-moved"
                        className="absolute bottom-0 inset-x-0 h-[2px] bg-gym-accent" 
                      />
                    )}
                  </button>
                ))}
              </div>

              {showRightArrow && (
                <button 
                  onClick={() => scrollTabsNext('right')}
                  className="absolute right-0 inset-y-0 px-2 bg-gradient-to-l from-black/90 via-black/40 to-transparent text-white/60 hover:text-white z-40 flex items-center cursor-pointer transition-all"
                  title="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4 text-gym-accent" />
                </button>
              )}
            </div>

            {/* Customizer Selection Cards Listing inside shop wrapper */}
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  {/* Category 1: Operative skins */}
                  {activeTab === 'operatives' && OUTFITS.map((outfit) => {
                    const isUnlocked = unlockedOutfits.includes(outfit.id);
                    const isEquipped = equippedOutfit === outfit.id;
                    
                    return (
                      <div 
                        key={outfit.id} 
                        onClick={() => buyOrEquipItem('operatives', outfit.id, outfit.price)}
                        className={`group/card relative rounded-lg border p-3.5 bg-zinc-950/95 cursor-pointer flex flex-col justify-between h-44 transition-all overflow-hidden ${
                          isEquipped 
                            ? 'border-gym-accent bg-gym-accent/[0.04] shadow-inner' 
                            : isUnlocked 
                              ? 'border-white/10 hover:border-white/30 hover:bg-zinc-900/40' 
                              : 'border-white/5 opacity-80 hover:opacity-100 hover:border-white/15'
                        }`}
                      >
                        <div className={`absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-r filter blur-3xl opacity-10 transition-opacity group-hover/card:opacity-20 ${outfit.accentColor}`} />

                        <div className="flex gap-3.5 items-start relative z-10 min-w-0">
                          {/* Char body thumbnail */}
                          <div className="w-16 h-20 rounded border border-white/5 overflow-hidden flex-shrink-0 bg-black/45 relative shadow-inner">
                            <img 
                              src={outfit.image} 
                              alt={outfit.name} 
                              className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500" 
                              referrerPolicy="no-referrer"
                            />
                            {!isUnlocked && (
                              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                <Lock className="w-3.5 h-3.5 text-white/35" />
                              </div>
                            )}
                          </div>

                          <div className="space-y-1 min-w-0 flex-1">
                            <h5 className="text-white font-bold leading-none font-mono uppercase tracking-wide text-[12px] group-hover/card:text-gym-accent transition-colors truncate">{outfit.name}</h5>
                            <p className="text-[9.5px] text-white/40 leading-normal font-sans line-clamp-3 font-light mt-1.5">{outfit.description}</p>
                          </div>
                        </div>

                        {/* Apply or Buy button footer strip */}
                        <div className="border-t border-white/5 pt-2.5 flex items-center justify-between relative z-10 mt-2">
                          <span className="text-[7.5px] font-mono text-white/20 uppercase tracking-widest font-bold">Construct Specimen</span>
                          
                          <div className="flex items-center gap-2">
                            {isEquipped ? (
                              <div className="bg-gym-accent text-black font-bold text-[8px] uppercase tracking-wider px-2.5 py-0.5 rounded-md flex items-center gap-1 select-none font-mono">
                                <Check className="w-2.5 h-2.5 stroke-[3.5]" /> Active
                              </div>
                            ) : isUnlocked ? (
                              <span className="text-[8.5px] font-mono uppercase font-black text-white/40 tracking-wider group-hover/card:text-white transition-colors">Apply</span>
                            ) : (
                              <div className="bg-white/[0.02] border border-white/10 text-amber-400 font-extrabold text-[9.5px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1 group-hover/card:bg-gym-accent group-hover/card:text-black hover:border-transparent transition-all">
                                <Coins className="w-3" /> {outfit.price.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Category 2: Emotes / Poses */}
                  {activeTab === 'emotes' && EMOTES.map((emote) => {
                    const dbKey = `unlocked_emote_${equippedOutfit}_${emote.id}`;
                    const isUnlocked = emote.id === 'none' || (profile as any)?.[dbKey];
                    const isEquipped = equippedEmote === emote.id;
                    const progressionLock = getEmoteLockStatus(emote.id, equippedOutfit, profile);

                    return (
                      <div 
                        key={emote.id}
                        onClick={() => buyOrEquipItem('emotes', emote.id, emote.price)}
                        className={`relative rounded-lg border p-3.5 bg-zinc-950/95 cursor-pointer flex flex-col justify-between h-40 transition-all overflow-hidden ${
                          isEquipped 
                            ? 'border-gym-accent bg-gym-accent/[0.04] shadow-inner' 
                            : isUnlocked 
                              ? 'border-white/10 hover:border-white/30 hover:bg-zinc-900/40' 
                              : progressionLock.isLocked
                                ? 'border-red-500/10 opacity-70 cursor-not-allowed hover:bg-red-950/[0.02]'
                                : 'border-white/5 opacity-80 hover:opacity-100 hover:bg-zinc-900/10'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5 border-b border-white/5 pb-1.5 font-sans">
                            <div className="flex items-center gap-2 min-w-0">
                              <Activity className={`w-3.5 h-3.5 shrink-0 ${progressionLock.isLocked ? 'text-red-500/50' : 'text-gym-accent animate-pulse'}`} />
                              <h5 className={`font-bold leading-none font-mono uppercase tracking-wide text-[12px] truncate ${progressionLock.isLocked ? 'text-white/50' : 'text-white'}`}>{emote.name}</h5>
                            </div>
                            {!isUnlocked && (
                              <Lock className={`w-3 h-3 shrink-0 ${progressionLock.isLocked ? 'text-red-500 animate-pulse' : 'text-white/30'}`} />
                            )}
                          </div>
                          <p className="text-[9.5px] leading-normal font-sans line-clamp-2 mt-1">
                            {progressionLock.isLocked ? (
                              <span className="text-red-400/90 font-semibold font-mono tracking-wide">{progressionLock.reason}</span>
                            ) : (
                              <span className="text-white/40">{emote.desc}</span>
                            )}
                          </p>
                        </div>

                        <div className="border-t border-white/5 pt-2.5 flex items-center justify-between mt-auto relative z-10">
                          <span className="text-[7.5px] font-mono text-white/20 uppercase tracking-widest font-bold">Dynamic Act Pose</span>
                          
                          <div className="flex items-center gap-2">
                            {isEquipped ? (
                              <div className="bg-gym-accent text-black font-bold text-[8px] uppercase tracking-wider px-2.5 py-0.5 rounded-md flex items-center gap-1 select-none font-mono">
                                <Check className="w-2.5 h-2.5 stroke-[3.5]" /> Equipped
                              </div>
                            ) : isUnlocked ? (
                              <span className="text-[8.5px] font-mono uppercase font-black text-white/40 tracking-wider hover:text-white transition-colors">Equip</span>
                            ) : progressionLock.isLocked ? (
                              <span className="text-[8px] font-mono uppercase font-bold text-red-500/50 tracking-wider">PROGRESS LOCKED</span>
                            ) : (
                              <div className="bg-white/[0.01] border border-white/10 text-amber-400 font-extrabold text-[9.5px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1 transition-all">
                                <Coins className="w-3" /> {emote.price.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Category 3: Titles */}
                  {activeTab === 'titles' && TITLES.map((title) => {
                    const dbKey = `unlocked_title_${title.id}`;
                    const isUnlocked = title.id === 'lifter' || (profile as any)?.[dbKey];
                    const isEquipped = equippedTitle === title.id;

                    return (
                      <div 
                        key={title.id}
                        onClick={() => buyOrEquipItem('titles', title.id, title.price)}
                        className={`relative rounded-lg border p-3.5 bg-zinc-950/95 cursor-pointer flex flex-col justify-between h-40 transition-all overflow-hidden ${
                          isEquipped 
                            ? 'border-gym-accent bg-gym-accent/[0.04] shadow-inner' 
                            : isUnlocked 
                              ? 'border-white/10 hover:border-white/30 hover:bg-zinc-900/40' 
                              : 'border-white/5 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5 border-b border-white/5 pb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <Award className="w-3.5 h-3.5 text-gym-accent shrink-0" />
                              <h5 className="text-white font-bold leading-none font-mono uppercase tracking-wide text-[12px] truncate">{title.name}</h5>
                            </div>
                            {!isUnlocked && <Lock className="w-3 h-3 text-white/30 shrink-0" />}
                          </div>
                          <p className="text-[9.5px] text-white/40 leading-normal font-sans line-clamp-2 mt-1">{title.desc}</p>
                        </div>

                        <div className="border-t border-white/5 pt-2.5 flex items-center justify-between mt-auto relative z-10">
                          <span className="text-[7.5px] font-mono text-white/20 uppercase tracking-widest font-bold">Showcase Label</span>
                          
                          <div className="flex items-center gap-2">
                            {isEquipped ? (
                              <div className="bg-gym-accent text-black font-bold text-[8px] uppercase tracking-wider px-2.5 py-0.5 rounded-md flex items-center gap-1 select-none font-mono">
                                <Check className="w-2.5 h-2.5 stroke-[3.5]" /> Equipped
                              </div>
                            ) : isUnlocked ? (
                              <span className="text-[8.5px] font-mono uppercase font-black text-white/40 tracking-wider hover:text-white transition-colors">Equip</span>
                            ) : (
                              <div className="bg-white/[0.01] border border-white/10 text-amber-400 font-extrabold text-[9.5px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1 transition-all">
                                <Coins className="w-3" /> {title.price.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Category 4: operativeBorders */}
                  {activeTab === 'operativeBorders' && BORDERS.map((borderItem) => {
                    const dbKey = `unlocked_border_${borderItem.id}`;
                    const isUnlocked = borderItem.id === 'none' || (profile as any)?.[dbKey];
                    const isEquipped = equippedBorder === borderItem.id;

                    return (
                      <div 
                        key={borderItem.id}
                        onClick={() => buyOrEquipItem('operativeBorders', borderItem.id, borderItem.price)}
                        className={`relative rounded-lg border p-3.5 bg-zinc-950/95 cursor-pointer flex flex-col justify-between h-40 transition-all overflow-hidden ${
                          isEquipped 
                            ? 'border-gym-accent bg-gym-accent/[0.04] shadow-inner' 
                            : isUnlocked 
                              ? 'border-white/10 hover:border-white/30 hover:bg-zinc-900/40' 
                              : 'border-white/5 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5 border-b border-white/5 pb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <Shield className="w-3.5 h-3.5 text-gym-accent shrink-0" />
                              <h5 className="text-white font-bold leading-none font-mono uppercase tracking-wide text-[12px] truncate">{borderItem.name}</h5>
                            </div>
                            {!isUnlocked && <Lock className="w-3 h-3 text-white/30 shrink-0" />}
                          </div>
                          <p className="text-[9.5px] text-white/40 leading-normal font-sans line-clamp-2 mt-1">{borderItem.desc}</p>
                        </div>

                        <div className="border-t border-white/5 pt-2.5 flex items-center justify-between mt-auto relative z-10">
                          <span className="text-[7.5px] font-mono text-white/20 uppercase tracking-widest font-bold">Profile Border</span>
                          
                          <div className="flex items-center gap-2">
                            {isEquipped ? (
                              <div className="bg-gym-accent text-black font-bold text-[8px] uppercase tracking-wider px-2.5 py-0.5 rounded-md flex items-center gap-1 select-none font-mono">
                                <Check className="w-2.5 h-2.5 stroke-[3.5]" /> Equipped
                              </div>
                            ) : isUnlocked ? (
                              <span className="text-[8.5px] font-mono uppercase font-black text-white/40 tracking-wider hover:text-white transition-colors">Equip</span>
                            ) : (
                              <div className="bg-white/[0.01] border border-white/10 text-amber-400 font-extrabold text-[9.5px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1 transition-all">
                                <Coins className="w-3" /> {borderItem.price.toLocaleString()}
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
      )}

    </div>
  );
}
