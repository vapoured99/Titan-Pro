import React from 'react';
import { Coins, Lock } from 'lucide-react';
import { AURAS, getAuraLockStatus } from '../AvatarPanel';

interface AuraSynthesizerProps {
  profile: any;
  equippedAura: string;
  onBuyOrEquip: (auraId: string, price: number) => void;
}

export const AuraSynthesizer: React.FC<AuraSynthesizerProps> = ({
  profile,
  equippedAura,
  onBuyOrEquip,
}) => {
  return (
    <div className="bg-black/85 border border-white/20 rounded-lg p-6 relative overflow-hidden shadow-xl h-full flex flex-col justify-between flex-1 gap-6">
      <div>
        <h3 className="text-base font-black uppercase tracking-wider text-white font-mono text-fuchsia-400 font-bold">3. Aura Synthesizer</h3>
        <p className="text-[10px] text-white/50 font-sans">Synthesize energetic shielding auras. Equipped aura modifies total attributes and applies global buffs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow flex-1 overflow-y-auto pr-1 no-scrollbar min-h-[340px]">
        {AURAS.map(aura => {
          const dbKey = `unlocked_aura_${aura.id}`;
          const isUnlocked = aura.id === 'none' || !!profile?.[dbKey];
          const isEquipped = equippedAura === aura.id;
          const progressionLock = getAuraLockStatus(aura.id, profile);
          
          return (
            <div 
              key={aura.id}
              className={`p-4 rounded border transition-all ${
                isEquipped 
                  ? 'bg-zinc-900 border-fuchsia-500/50 shadow-md shadow-fuchsia-950/30' 
                  : isUnlocked 
                    ? 'bg-zinc-900/40 border-white/10 hover:border-white/20' 
                    : progressionLock.isLocked
                      ? 'bg-red-950/[0.01] border-red-500/10 opacity-70'
                      : 'bg-zinc-950/70 border-white/5 opacity-80'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs font-bold font-sans uppercase font-mono ${progressionLock.isLocked ? 'text-white/50' : 'text-white'}`}>{aura.name}</h4>
                    {isEquipped && (
                      <span className="text-[7.5px] bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 font-bold font-mono uppercase px-1 rounded-md">Current</span>
                    )}
                    {!isUnlocked && (
                      <Lock className={`w-3 h-3 ${progressionLock.isLocked ? 'text-red-500 animate-pulse' : 'text-white/30'}`} />
                    )}
                  </div>
                  <p className="text-[10px] mt-1 max-w-[260px] line-clamp-2 leading-relaxed">
                    {progressionLock.isLocked ? (
                      <span className="text-red-400 font-semibold font-mono">{progressionLock.reason}</span>
                    ) : (
                      <span className="text-white/50">{aura.desc}</span>
                    )}
                  </p>
                </div>

                {/* Stat multipliers representation */}
                <div className="text-right">
                  <span className="text-[7px] text-white/40 block uppercase font-mono tracking-wider">Aura Buff Matrix</span>
                  <span className={`text-[11px] font-black font-mono font-bold ${progressionLock.isLocked ? 'text-red-500/50' : 'text-cyan-400'}`}>
                    {Object.values(aura.statMultiplier).every(v => v === 1) 
                      ? "Base" 
                      : `+${Math.round((aura.statMultiplier.power - 1) * 100)}% DMG`}
                  </span>
                </div>
              </div>

              {/* Detail Metrics bar */}
              <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-white/5 text-[9px] font-mono text-white/40">
                <div>PWR: <span className="text-white/80 font-bold">{aura.statMultiplier.power}x</span></div>
                <div>KIN: <span className="text-white/80 font-bold">{aura.statMultiplier.kinetic}x</span></div>
                <div>SYM: <span className="text-white/80 font-bold">{aura.statMultiplier.symmetry}x</span></div>
                <div>VEL: <span className="text-white/80 font-bold">{aura.statMultiplier.velocity}x</span></div>
              </div>

              {/* Unlock Action Row */}
              <div className="mt-4 flex justify-end">
                {isUnlocked ? (
                  <button
                    onClick={() => onBuyOrEquip(aura.id, aura.price)}
                    className={`px-3 py-1.5 rounded text-[9px] font-bold font-mono tracking-wider transition-all cursor-pointer ${
                      isEquipped 
                        ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/40 cursor-default' 
                        : 'bg-transparent border border-white/10 text-white hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {isEquipped ? 'ACTIVE MATRIX' : 'ENGAGE AURA'}
                  </button>
                ) : progressionLock.isLocked ? (
                  <button
                    disabled
                    className="bg-zinc-900/50 text-red-500/40 border border-red-500/5 px-3 py-1.5 rounded text-[9px] font-bold font-mono tracking-wider cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Lock className="w-3 h-3 text-red-500/40" />
                    PROGRESS LOCKED
                  </button>
                ) : (
                  <button
                    onClick={() => onBuyOrEquip(aura.id, aura.price)}
                    className="bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 rounded text-[9px] font-black font-mono tracking-wider cursor-pointer flex items-center gap-1.5"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    BUY FOR {aura.price.toLocaleString()} CO
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
