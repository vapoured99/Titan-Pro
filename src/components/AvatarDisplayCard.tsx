import React, { useState, useEffect } from 'react';
import { Crown } from 'lucide-react';
import { TransparentCharacter } from './TransparentCharacter';
import {
  OUTFITS,
  OUTFIT_TO_BANNER,
  AURA_STYLING,
  FINAL_FORM_THEMES,
  BANNERS,
  BORDERS,
  TITLES,
  PETS_DATA
} from './AvatarPanel';

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

interface AvatarDisplayCardProps {
  profile: UserProfile | null;
  currentUser?: any;
  customClass?: string;
}

export function AvatarDisplayCard({ profile, currentUser, customClass = '' }: AvatarDisplayCardProps) {
  // Equipped configuration defaults
  const equippedOutfit = profile?.equippedOutfit ?? 'vanguard_cadet';
  const equippedAura = profile?.equippedAura ?? 'none';
  const equippedBackItem = profile?.equippedBackItem ?? 'none';
  const equippedEmote = (profile as any)?.[`equippedEmote_${equippedOutfit}`] ?? 'none';
  const equippedTitle = profile?.equippedTitle ?? 'lifter';
  const equippedBanner = OUTFIT_TO_BANNER[equippedOutfit] || 'default_slate';
  const equippedBorder = profile?.equippedBorder ?? 'none';

  // Find active items
  const activeOutfit = OUTFITS.find(o => o.id === equippedOutfit) || OUTFITS[0];
  const finalFormTheme = FINAL_FORM_THEMES[equippedOutfit] || FINAL_FORM_THEMES.vanguard_cadet;

  // Active getters
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

  // Resolve pose image based on equipped emote/pose
  const activeCharacterImage = activeOutfit.poseImages?.[equippedEmote as keyof typeof activeOutfit.poseImages] || activeOutfit.image;

  // Companion Pet details retrieval for the bottom right corner
  const userId = currentUser?.uid || 'guest';
  const petNamesKey = `gym_pet_names_${userId}`;
  const petLevelsKey = `gym_pet_levels_${userId}`;

  const [petNames, setPetNames] = useState<Record<string, string>>({});
  const [petLevels, setPetLevels] = useState<Record<string, number>>({});

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
  }, [userId, petNamesKey, petLevelsKey]);

  // Synchronize dynamic updates by listening to local storage write events
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedNames = localStorage.getItem(petNamesKey);
        setPetNames(savedNames ? JSON.parse(savedNames) : {});
        const savedLevels = localStorage.getItem(petLevelsKey);
        setPetLevels(savedLevels ? JSON.parse(savedLevels) : {});
      } catch {
        // ignore errors
      }
    };
    window.addEventListener('storage', handleStorageChange);
    // Also periodically poll local storage because same-window writes do not trigger the storage event
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [petNamesKey, petLevelsKey]);

  const activePetInfo = PETS_DATA[equippedOutfit] || PETS_DATA.vanguard_cadet;
  const currentPetName = petNames[equippedOutfit] || activePetInfo.name;
  const currentPetLevel = petLevels[equippedOutfit] || 1;

  return (
    <div className={`relative w-full aspect-[3/4.2] bg-black/50 ${getActiveBorder().id === 'none' ? 'border border-white/10' : getActiveBorder().cardBorderClass} rounded-lg overflow-hidden flex flex-col justify-between p-7 group transition-all duration-700 shadow-3xl ${activeAuraStyling.outerGlow} ${customClass}`}>
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
      `}</style>
      
      {/* Theme Border Corner Elements */}
      {getActiveBorder().cornerElement}

      {/* Banner Theme Background */}
      {!['naruto', 'sasuke', 'jinwoo'].includes(activeOutfit.id) ? (
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
          <span className="text-[10px] uppercase tracking-[0.2em] text-white font-bold block leading-tight mb-0.5">ACTIVE SPECIMEN</span>
          <span className="text-base font-black text-white font-mono tracking-wider">{activeOutfit.name.toUpperCase()}</span>
        </div>
        <div className="flex gap-1.5 items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-400 font-mono">Synced</span>
        </div>
      </div>

      {/* Highly Scaled Central Avatar Body Image Container */}
      <div className={`relative w-[92%] aspect-[3/3.8] mx-auto z-10 flex items-center justify-center my-4 overflow-hidden rounded-md border transition-all duration-500 ${
        ['naruto', 'sasuke', 'jinwoo'].includes(activeOutfit.id)
          ? 'border-white/10 bg-transparent'
          : equippedEmote === 'final_form'
            ? `border-[rgba(var(--gym-accent-rgb,212,175,55),0.6)] bg-black/75 scale-[1.02] ${finalFormTheme.glow}`
            : 'border-white/5 bg-transparent group-hover:border-gym-accent/40'
      }`}>
        {['naruto', 'sasuke', 'jinwoo'].includes(activeOutfit.id) ? (
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
        ) : (
          <TransparentCharacter 
            src={activeCharacterImage} 
            alt={activeOutfit.name} 
            className={`w-full h-full object-cover transform select-none pointer-events-none transition-all duration-700 ${
              equippedEmote === 'final_form'
                ? 'animate-super-shudder scale-[1.05]'
                : 'scale-100 group-hover:scale-[1.04]'
            }`}
            toleranceMultiplier={activeOutfit.id === 'golden_disciple' ? 0.85 : 1.0}
            fallbackSrc={activeOutfit.image}
          />
        )}

        {/* Inner Aura overlay graphics rendered DIRECTLY on top of character image for max intensity */}
        {activeAuraStyling.innerEffects}

        {/* Dynamic visual overlay effects triggered by emote type */}
        {equippedEmote === 'flex_mode' && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <div className="absolute inset-x-0 h-[2.5px] bg-purple-500/50 filter blur-xs animate-pulse-slow font-sans" style={{ animation: 'scanline 4s linear infinite' }} />
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
              <span className="text-[7px] font-mono tracking-widest text-white font-bold animate-pulse">STAGE_05</span>
            </div>
          </div>
        )}

        {/* Floating Pet Companion inside main frame */}
        <div 
          className="absolute bottom-3 right-3 z-30 flex flex-col items-center select-none pointer-events-none group/petdisplay cursor-pointer"
          title={`LV.${currentPetLevel} ${currentPetName}: +${currentPetLevel * 2}% DMG & -${currentPetLevel * 2}% DMG Received`}
        >
          <div className="p-1 bg-black/85 rounded-md border border-white/20 shadow-lg">
            {activePetInfo.sprite}
          </div>
          <div className="mt-1.5 bg-black/95 text-[7px] font-mono tracking-widest text-white px-1.5 py-0.5 rounded border border-white/5 uppercase select-none font-bold flex flex-col items-center">
            <span>LV.{currentPetLevel} {currentPetName}</span>
            <span className="text-[6px] text-emerald-400 font-bold tracking-normal mt-0.5 text-center leading-none">+{currentPetLevel * 2}% ATK / -{currentPetLevel * 2}% DMG</span>
          </div>
        </div>
      </div>

      {/* Character Footer displaying title */}
      <div className="relative z-10 flex items-center justify-between transition-all duration-300 w-full border-t border-white/10 pt-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.34em] text-white font-bold block leading-tight mb-1">Athletic Title</span>
          <span className="text-2xl font-light italic font-serif text-white tracking-wide leading-none select-none drop-shadow">
            {getActiveTitle().name.toUpperCase()}
          </span>
          <span className="text-xs text-white/95 block mt-1 tracking-normal font-normal leading-relaxed">{getActiveTitle().desc}</span>
        </div>
        <div className="w-10 h-10 rounded-full border border-gym-accent/30 bg-gym-accent/10 flex items-center justify-center shadow-inner shrink-0">
          <Crown className="w-5 h-5 text-gym-accent" />
        </div>
      </div>

    </div>
  );
}
