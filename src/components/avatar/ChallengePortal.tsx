import React, { useState, useMemo } from 'react';
import { Sword, Skull, Shield, Zap, Activity, Info, Sparkles, Scroll } from 'lucide-react';
import { RAID_BOSSES, RaidBoss } from '../AvatarPanel';

const RaidBackdrop: React.FC<{ bossId: string }> = ({ bossId }) => {
  // Generate stable particle attributes using stable seeds based on ID
  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1.2,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: Math.random() * 6 + 4,
      opacity: Math.random() * 0.45 + 0.15,
    }));
  }, [bossId]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <style>{`
        @keyframes bgFloatUp {
          0% { transform: translateY(115%) rotate(0deg); opacity: 0; }
          20% { opacity: var(--op, 0.6); }
          80% { opacity: var(--op, 0.6); }
          100% { transform: translateY(-15%) rotate(360deg); opacity: 0; }
        }
        @keyframes gravityDown {
          0% { transform: translateY(-15%); opacity: 0.15; }
          50% { opacity: 0.4; }
          100% { transform: translateY(115%); opacity: 0.15; }
        }
        @keyframes rotateGear {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.85; transform: scale(1.15); }
        }
        @keyframes scanSweep {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes pulseBright {
          0%, 100% { transform: scale(0.95) translate(-50%, -50%); opacity: 0.35; filter: blur(40px); }
          50% { transform: scale(1.1) translate(-50%, -50%); opacity: 0.65; filter: blur(60px); }
        }
        @keyframes driftNebula {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(25px, -15px) scale(1.05); }
        }
        @keyframes lightningStrike {
          0%, 94%, 98%, 100% { opacity: 0.05; }
          95%, 97% { opacity: 0.25; }
        }
        @keyframes swordStrikeSlash {
          0% { transform: translate(-50%, -50%) scale(0.2) rotate(-90deg); opacity: 0; }
          15% { transform: translate(-50%, -50%) scale(1.1) rotate(-45deg); opacity: 1; }
          75% { transform: translate(-50%, -50%) scale(1.3) rotate(45deg); opacity: 1; filter: drop-shadow(0 0 20px rgb(239,68,68)); }
          100% { transform: translate(-30%, -30%) scale(1.5) rotate(90deg); opacity: 0; }
        }
        @keyframes shieldAbsorb {
          0% { transform: scale(0.7); opacity: 0; }
          15% { transform: scale(1.12); opacity: 1; }
          50% { transform: scale(1); opacity: 0.95; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        @keyframes hitShake {
          0%, 100% { transform: translate(0, 0); }
          20%, 60% { transform: translate(-3px, 1.5px); }
          40%, 80% { transform: translate(3px, -1.5px); }
        }
      `}</style>

      {/* 1. OBSIDIAN GOLEM BACKGROUND */}
      {bossId === 'iron_leviathan' && (
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-zinc-950 to-amber-950/25">
          {/* Ancient gravity force lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.012)_1px,transparent_1px)] bg-[size:24px_24px] opacity-25 pointer-events-none" />
          
          {/* Gravitational stone sparks moving down */}
          {particles.slice(0, 15).map(p => (
            <div
              key={p.id}
              className="absolute bg-amber-600/10 rounded-full"
              style={{
                left: `${p.left}%`,
                width: '1px',
                height: `${p.size * 15 + 20}px`,
                animation: 'gravityDown 3.5s linear infinite',
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}

          {/* High-contrast stone pillars / coliseum shadows */}
          <div className="absolute left-4 top-0 bottom-0 w-3 bg-neutral-950/60 border-r border-amber-600/5 flex flex-col justify-around py-4 opacity-50">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="w-full h-[4px] bg-amber-500/10" />
            ))}
          </div>
          <div className="absolute right-4 top-0 bottom-0 w-3 bg-neutral-950/60 border-l border-amber-600/5 flex flex-col justify-around py-4 opacity-50">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="w-full h-[4px] bg-amber-500/10" />
            ))}
          </div>

          {/* Majestic Earth Core circle centered background */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-amber-500/10 rounded-full flex items-center justify-center opacity-30">
            <div 
              className="w-56 h-56 border-4 border-dashed border-amber-500/10 rounded-full flex items-center justify-center"
              style={{ animation: 'rotateGear 45s linear infinite' }}
            >
              <div className="w-20 h-20 rounded-full bg-amber-950/20 flex items-center justify-center border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                <span className="text-[8px] font-mono text-amber-500/80 font-bold tracking-widest uppercase text-center">ANCIENT<br/>FORCE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PYROCLASTIC STORM DRAKE BACKGROUND */}
      {bossId === 'plasma_phoenix' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#090101] via-[#1a0303] to-[#3a0c06]/35">
          {/* Intense orange/red ambient orbs pulsing */}
          <div 
            className="absolute left-1/2 top-1/2 rounded-full bg-rose-600/15"
            style={{
              width: '320px',
              height: '320px',
              animation: 'pulseBright 6s ease-in-out infinite',
            }}
          />

          {/* Heat map wave lines representing molten magma */}
          <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(circle at 50% 120%, rgba(239,68,68,0.18) 0%, transparent 70%)' }} />

          {/* Rising volcanic flame embers */}
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute rounded-full bg-gradient-to-t from-orange-400 to-yellow-300 shadow-[0_0_8px_rgba(251,146,60,0.8)]"
              style={{
                left: `${p.left}%`,
                width: `${p.size + 1}px`,
                height: `${p.size + 1}px`,
                bottom: '-20px',
                animation: 'bgFloatUp 5s ease-out infinite',
                animationDelay: `${p.delay}s`,
                '--op': p.opacity + 0.3,
              } as React.CSSProperties}
            />
          ))}

          {/* Thermodynamic volcanic haze */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-red-600/10 to-transparent blur-md" />
        </div>
      )}

      {/* 3. ABYSSAL DREAD REAPER BACKGROUND */}
      {bossId === 'cyber_beast_reaper' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#020006] via-[#060111] to-[#0e0321]/50">
          {/* Shimmering runes-like subtle background points */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.03)_1px,transparent_2px)] bg-[size:20px_20px] pointer-events-none opacity-50" />
          
          {/* Slow sliding dark energy shockwaves */}
          <div 
            className="absolute inset-x-0 h-[2px] bg-purple-500/15 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            style={{ animation: 'scanSweep 7s ease-in-out infinite' }}
          />

          {/* Shimmering spectral wisps */}
          {particles.slice(0, 18).map(p => (
            <div
              key={p.id}
              className="absolute bg-purple-400/20 border border-purple-500/20 rounded-full"
              style={{
                left: `${p.left}%`,
                top: `${p.size * 20}%`,
                width: `${p.size * 0.8 + 2}px`,
                height: `${p.size * 0.8 + 2}px`,
                animation: 'starTwinkle 3.5s ease-in-out infinite',
                animationDelay: `${p.delay * 0.5}s`,
              }}
            />
          ))}

          {/* Ancient Runes calling in the background shadow */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-[0.04] select-none font-serif text-[11px] text-purple-400 italic space-y-1">
            <div>[ THE ABYSS CALLS ]</div>
            <div>[ SOUL FORTITUDE TRIAL: ENGAGED ]</div>
            <div>[ VOID OF ENDLESS GRAVES ]</div>
            <div>[ APOCRYPHAL SAGA RECORDED ]</div>
          </div>
        </div>
      )}

      {/* 4. STELLAR ARCHON BACKGROUND */}
      {bossId === 'lumen_singularity_gate' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#000105] via-[#000710] to-[#02131f]/40">
          {/* Subtle slow drifting star nebula cloud */}
          <div 
            className="absolute -left-10 -top-10 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top_left,rgba(6,182,212,0.08)_0%,transparent_60%)] pointer-events-none"
            style={{ animation: 'driftNebula 12s ease-in-out infinite' }}
          />
          <div 
            className="absolute -right-10 -bottom-10 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.06)_0%,transparent_60%)] pointer-events-none"
            style={{ animation: 'driftNebula 16s ease-in-out infinite' }}
          />

          {/* Sacred Celestial Rings spinning in orbital harmony */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-cyan-500/10 flex items-center justify-center pointer-events-none opacity-30">
            <div 
              className="w-72 h-72 border border-dashed border-cyan-500/20 rounded-full flex items-center justify-center"
              style={{ animation: 'rotateGear 60s linear infinite' }}
            >
              <div 
                className="w-48 h-48 border border-cyan-500/15 rounded-full"
                style={{ animation: 'rotateGear 30s linear infinite reverse' }}
              />
            </div>
          </div>

          {/* Sparkling stardust particles */}
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute rounded-full bg-cyan-200"
              style={{
                left: `${p.left}%`,
                top: `${p.size * 22}%`,
                width: `${p.size * 0.5 + 1.2}px`,
                height: `${p.size * 0.5 + 1.2}px`,
                boxShadow: '0 0 6px rgba(103,232,249,0.8)',
                animation: 'starTwinkle 4s ease-in-out infinite',
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}

          {/* A glowing radiant solar beacon representer behind layers */}
          <div 
            className="absolute left-1/2 top-1/2 rounded-full bg-cyan-500/10 shadow-[0_0_80px_rgba(6,182,212,0.4)] animate-pulse"
            style={{
              width: '180px',
              height: '180px',
            }}
          />
        </div>
      )}

      {/* 5. THE CHRONO-TITAN KRONOS BACKGROUND */}
      {bossId === 'chrono_apocalypse_archon' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#030001] via-[#090105] to-[#140111]/40">
          {/* Background clock matrix gears and temporal sand lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(244,63,94,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(244,63,94,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-45" />

          {/* Shifting space warp lines */}
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'conic-gradient(from 45deg, transparent, rgba(244,63,94,0.07), transparent, rgba(168,85,247,0.07), transparent)' }} />

          {/* Drifting temporal sand runic ashes */}
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute bg-rose-400/25 border border-rose-500/30 rounded-full"
              style={{
                left: `${p.left}%`,
                width: `${p.size + 1.5}px`,
                height: `${p.size + 1.5}px`,
                bottom: '-20px',
                animation: 'bgFloatUp 6s linear infinite',
                animationDelay: `${p.delay}s`,
                '--op': p.opacity + 0.1,
              } as React.CSSProperties}
            />
          ))}

          {/* Atmospheric thunder discharge shadows */}
          <div 
            className="absolute inset-0 bg-rose-500"
            style={{ animation: 'lightningStrike 12s linear infinite' }}
          />

          {/* Pulsing red-purple Kronos core energy hourglass */}
          <div 
            className="absolute left-1/2 top-1/2 rounded-full bg-rose-500/10 shadow-[0_0_100px_rgba(244,63,94,0.4)]"
            style={{
              width: '240px',
              height: '240px',
              animation: 'pulseBright 5s ease-in-out infinite',
            }}
          />
        </div>
      )}

      {/* 6. THE ANCIENT PRIMEVAL DEMIURGE BACKGROUND */}
      {bossId === 'primeval_god_specimen' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#070601] via-[#111003] to-[#221e06]/45">
          {/* Golden energy columns/radiating grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.04)_1px,transparent_2px)] bg-[size:16px_16px] opacity-65" />

          {/* Radiant gold divine halos */}
          <div 
            className="absolute left-1/2 top-1/2 rounded-full border-2 border-dashed border-yellow-500/10 animate-[spin_80s_linear_infinite]"
            style={{
              width: '380px',
              height: '380px',
            }}
          />
          <div 
            className="absolute left-1/2 top-1/2 rounded-full border border-yellow-500/5 animate-[spin_40s_linear_infinite_reverse]"
            style={{
              width: '280px',
              height: '280px',
            }}
          />

          {/* Rising divine golden light sparks */}
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute rounded-full bg-gradient-to-t from-yellow-300 to-yellow-100 shadow-[0_0_12px_rgba(234,179,8,0.9)]"
              style={{
                left: `${p.left}%`,
                width: `${p.size + 1.2}px`,
                height: `${p.size + 1.2}px`,
                bottom: '-20px',
                animation: 'bgFloatUp 7.5s ease-out infinite',
                animationDelay: `${p.delay}s`,
                '--op': p.opacity + 0.4,
              } as React.CSSProperties}
            />
          ))}

          {/* Core god sphere representing infinite somatic power */}
          <div 
            className="absolute left-1/2 top-1/2 rounded-full bg-yellow-500/15 shadow-[0_0_120px_rgba(234,179,8,0.55)] border border-yellow-500/20"
            style={{
              width: '190px',
              height: '190px',
              animation: 'pulseBright 4.5s ease-in-out infinite',
            }}
          />
        </div>
      )}
    </div>
  );
};

interface ChallengePortalProps {
  displayName: string;
  level: number;
  derivedStats: {
    maxHp: number;
    attack: number;
    defense: number;
    criticalChance: number;
  };
  onGainRewards: (xp: number, credits: number, auraId?: string) => void;
  activePetLevel?: number;
  activePetName?: string;
}

interface CombatFloater {
  id: string;
  val: string;
  type: 'damage' | 'heal' | 'critical' | 'dodge' | 'boss_damage';
  x: number;
  y: number;
}

export const ChallengePortal: React.FC<ChallengePortalProps> = ({
  displayName,
  level,
  derivedStats,
  onGainRewards,
  activePetLevel = 1,
  activePetName,
}) => {
  const [selectedBoss, setSelectedBoss] = useState<RaidBoss | null>(null);
  const [isFighting, setIsFighting] = useState(false);
  
  const [bossHp, setBossHpState] = useState<number>(100);
  const bossHpRef = React.useRef(100);
  const setBossHp = (val: number) => {
    bossHpRef.current = val;
    setBossHpState(val);
  };

  const [playerHp, setPlayerHpState] = useState<number>(100);
  const playerHpRef = React.useRef(100);
  const setPlayerHp = (val: number) => {
    playerHpRef.current = val;
    setPlayerHpState(val);
  };

  const [playerMaxHp, setPlayerMaxHp] = useState<number>(100);
  const [battleLogs, setBattleLogs] = useState<string[]>([]);
  
  const [battleFinished, setBattleFinishedState] = useState<'won' | 'lost' | null>(null);
  const battleFinishedRef = React.useRef<'won' | 'lost' | null>(null);
  const setBattleFinished = (val: 'won' | 'lost' | null) => {
    battleFinishedRef.current = val;
    setBattleFinishedState(val);
  };

  const [combatFloaters, setCombatFloaters] = useState<CombatFloater[]>([]);
  
  // Custom combat animation states
  const [activeCombatEff, setActiveCombatEff] = useState<'none' | 'player_slash' | 'boss_shield'>('none');
  const [isAnimatingRound, setIsAnimatingRound] = useState(false);

  const startRaidBattle = (boss: RaidBoss) => {
    setSelectedBoss(boss);
    setBossHp(boss.hp);
    setPlayerMaxHp(derivedStats.maxHp);
    setPlayerHp(derivedStats.maxHp);
    setActiveCombatEff('none');
    setIsAnimatingRound(false);
    
    const petDmgBuff = activePetLevel * 2;
    const petDmgRed = activePetLevel * 2;
    
    setBattleLogs([
      `⚔️ The arena gates crash open. The trial of ${boss.name} (Rank ${boss.level}) begins!`,
      `🧬 Your heroic attributes: Fortitude ${derivedStats.maxHp} | Might ${derivedStats.attack} | Defense ${derivedStats.defense}`,
      `🐾 Your faithful companion ${activePetName || 'Guardian'} (LVL ${activePetLevel}) leaps into battle, boosting your might by +${petDmgBuff}% and steeling your armor by -${petDmgRed}%!`,
      `🥊 The audience holds their breath! Cast your heroic somatic strike.`
    ]);
    setBattleFinished(null);
    setIsFighting(true);
  };

  const spawnFloater = (val: string, type: 'damage' | 'heal' | 'critical' | 'dodge' | 'boss_damage') => {
    const id = Math.random().toString();
    const x = Math.floor(Math.random() * 80) + 10;
    const y = Math.floor(Math.random() * 50) + 20;
    setCombatFloaters(prev => [...prev, { id, val, type, x, y }]);
    setTimeout(() => {
      setCombatFloaters(prev => prev.filter(f => f.id !== id));
    }, 1200);
  };

  const executeRound = () => {
    if (!selectedBoss || battleFinishedRef.current) return;

    const roundLogs: string[] = [];
    
    // --- Phase 1: Player Attacks Boss Instantly ---
    const isCrit = Math.random() * 100 < derivedStats.criticalChance;
    
    // Calculate randomized DMG
    let playerDmgBase = derivedStats.attack * (0.85 + Math.random() * 0.3);
    if (isCrit) {
      playerDmgBase *= 1.8;
      roundLogs.push(`⭐️ CRITICAL BLOW!`);
    }

    // Apply active pet companion damage buff: +2% per level
    const petDmgBuff = activePetLevel * 2;
    const petMultiplier = 1 + (petDmgBuff / 100);
    playerDmgBase *= petMultiplier;

    // Apply boss defense mitigation
    let finalBossDmg = Math.round(Math.max(5, playerDmgBase - selectedBoss.defense));
    const nextBossHp = Math.max(0, bossHpRef.current - finalBossDmg);
    
    // Perform Player Strike Instantly
    setBossHp(nextBossHp);
    roundLogs.push(`💥 You strike a powerful somatic blow against ${selectedBoss.name}, shearing through their armor for ${finalBossDmg} damage (with a +${petDmgBuff}% Companion force multiplier).`);
    spawnFloater(`-${finalBossDmg}`, isCrit ? 'critical' : 'damage');

    // Check boss defeat
    if (nextBossHp <= 0) {
      setBattleFinished('won');
      const victorLogs = [
        `🔥 TRIUMPH! You have successfully overcome ${selectedBoss.name}!`,
        `🏆 Permanent rewards claimed: +${selectedBoss.rewards.xp} XP and +${selectedBoss.rewards.credits} Sacred Coins.`
      ];
      onGainRewards(selectedBoss.rewards.xp, selectedBoss.rewards.credits, selectedBoss.rewards.aura);
      setBattleLogs(prev => [...victorLogs, ...roundLogs, ...prev]);
      return;
    }

    // --- Phase 2: Boss Counters Instantly ---
    const counterLogs: string[] = [];
    const bossDmgBase = selectedBoss.attackPower * (0.75 + Math.random() * 0.5);
    let finalPlayerDmg = Math.round(Math.max(3, bossDmgBase - derivedStats.defense));
    
    // Apply active pet companion damage reduction: -2% per level (cap at 90% mitigation for safety)
    const petDmgRed = activePetLevel * 2;
    const reducerMultiplier = Math.max(0.1, 1 - (petDmgRed / 100));
    finalPlayerDmg = Math.round(finalPlayerDmg * reducerMultiplier);

    const nextPlayerHp = Math.max(0, playerHpRef.current - finalPlayerDmg);
    setPlayerHp(nextPlayerHp);

    counterLogs.push(`👿 ${selectedBoss.name} roars and retaliates, inflicting ${finalPlayerDmg} crushing damage upon your defenses.`);
    counterLogs.push(`🛡️ Your loyal companion ${activePetName || 'Guardian'} courageously absorbs -${petDmgRed}% of the kinetic strike.`);
    spawnFloater(`-${finalPlayerDmg}`, 'boss_damage');

    // Check player defeat
    if (nextPlayerHp <= 0) {
      setBattleFinished('lost');
      counterLogs.push(`🚨 DEFEAT... Your physical fortitude gave way under the overwhelming strength of ${selectedBoss.name}.`);
      counterLogs.push(`💡 Strategy: Buff your primary attributes on the Talent Sphere Grid or forge legendary high-multiplier auras.`);
    } else {
      counterLogs.push(`🥊 The clash pauses. Gather your strength for the next strike.`);
    }

    setBattleLogs(prev => [...counterLogs, ...roundLogs, ...prev]);
  };

  return (
    <div className="w-full h-full flex flex-col flex-1">
      {!isFighting ? (
        <div className="bg-black/85 border border-white/10 rounded-lg p-6 relative overflow-hidden shadow-xl h-full flex flex-col justify-start flex-1 gap-4">
          <div>
            <h3 className="text-base font-black uppercase tracking-wider text-amber-500 font-mono flex items-center gap-2">
              <Scroll className="w-5 h-5 text-amber-500 animate-pulse" />
              4. The Grand Arena
            </h3>
            <p className="text-[10px] text-white/50 font-sans">Challenge legendary mythic beasts and primordial titans to test your somatic limits. Earn massive permanent Experience and Sacred Coins.</p>
          </div>

          <div className="space-y-4 flex-grow flex-1 overflow-y-auto pr-1 no-scrollbar min-h-0">
            {RAID_BOSSES.map(boss => (
              <div 
                key={boss.id} 
                className={`p-4 rounded border bg-gradient-to-r relative overflow-hidden transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${boss.themeColor}`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[7px] font-mono tracking-widest uppercase font-black px-1.5 py-0.5 rounded border ${
                      boss.difficulty === 'normal' 
                        ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300' 
                        : boss.difficulty === 'hard' 
                          ? 'bg-or-500/20 border-orange-400 text-orange-300' 
                          : boss.difficulty === 'mythic' 
                            ? 'bg-purple-500/20 border-purple-400 text-purple-300' 
                            : boss.difficulty === 'nightmare'
                              ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                              : 'bg-red-950/80 border-red-500 text-red-400 font-black animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                    }`}>
                      🏛️ {boss.difficulty.toUpperCase()} TRIAL
                    </span>
                    <span className="text-[9px] text-white/40 font-mono">LEVEL REQ: {boss.level}</span>
                  </div>
                  
                  <h4 className="text-sm font-black text-amber-100 font-sans uppercase tracking-wide">{boss.name}</h4>
                  <p className="text-[10px] text-amber-400/80 mb-2 font-serif italic">{boss.subtitle}</p>
                  <p className="text-[10px] text-white/40 max-w-xl line-clamp-2 leading-relaxed">{boss.description}</p>
                </div>

                {/* HP & Rewards status */}
                <div className="flex md:flex-col items-end gap-2.5 justify-between w-full md:w-auto mt-4 md:mt-0 pt-3 md:pt-0 border-t border-white/5 md:border-0 shrink-0">
                  <div className="text-right">
                    <span className="text-[7.5px] text-white/40 block font-mono">CHAMPION STATS</span>
                    <span className="text-[10px] font-mono font-bold text-white">HP: {boss.hp} | ATK: {boss.attackPower}</span>
                  </div>
                  <div className="text-right mb-1">
                    <span className="text-[7.5px] text-amber-500 block font-mono font-bold">🏆 REWARDS</span>
                    <span className="text-[10px] font-mono font-bold text-white">+{boss.rewards.xp} XP | +{boss.rewards.credits} CO</span>
                  </div>
                  
                  <button
                    onClick={() => startRaidBattle(boss)}
                    className="bg-amber-600 hover:bg-amber-500 text-black px-3.5 py-2 rounded text-[10px] font-black font-mono tracking-wider cursor-pointer flex items-center gap-1.5 uppercase shadow-md active:scale-95 transition-all"
                  >
                    <Sword className="w-3 h-3 text-black animate-pulse" />
                    ENTER COLISEUM
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Fighting Screen Interface
        <div className="bg-zinc-950/95 border border-amber-600/20 rounded-lg p-6 relative overflow-hidden shadow-2xl h-full flex flex-col justify-between flex-1 gap-4 select-none min-h-[500px]">
          {/* Dynamic, ambient themed backdrop for target boss */}
          {selectedBoss && <RaidBackdrop bossId={selectedBoss.id} />}
          
          <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px] bg-[size:20px_20px] pointer-events-none z-10" />
          <div className="absolute inset-x-0 top-0 h-[25px] bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none z-10 animate-pulse" />
          
          {/* Header bar */}
          <div className="flex justify-between items-center border-b border-amber-500/10 pb-4 mb-3 relative z-20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-black text-amber-500 uppercase tracking-widest">COLISEUM TRIAL ARENA</span>
                <span className="text-[8px] font-mono text-white/40 uppercase">TRIAL LEVEL: {selectedBoss?.difficulty.toUpperCase()} CHALLENGE // PEAK_RANK_{selectedBoss?.level}</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsFighting(false)}
              className="text-[9px] font-mono bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 text-white/70 hover:text-white px-3 py-1.5 rounded-sm cursor-pointer transition-all uppercase tracking-wider active:scale-95"
            >
              ← RETREAT TO TEMPLE
            </button>
          </div>
 
          {/* Battleground responsive Grid System (Player, Centerpiece Arena, Boss) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-20 my-auto items-stretch">
            {/* Floating damage/combat text indicators */}
            {combatFloaters.map(f => (
              <div 
                key={f.id}
                style={{ left: `${f.x}%`, top: `${f.y}%` }}
                className={`absolute font-black text-lg select-none pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] z-[999] animate-[bounce_1.2s_ease-in-out_infinite] ${
                  f.type === 'critical' ? 'text-amber-400 text-xl font-sans scale-110 tracking-widest' :
                  f.type === 'dodge' ? 'text-cyan-400 font-mono text-sm' :
                  f.type === 'boss_damage' ? 'text-red-500 text-lg md:text-xl' : 'text-orange-500 text-lg md:text-xl'
                }`}
              >
                {f.val}
              </div>
            ))}
 
            {/* COLUMN 1: YOUR STATUS */}
            <div className="lg:col-span-4 bg-black/80 backdrop-blur-md p-4 rounded border border-white/10 flex flex-col justify-between gap-4 relative overflow-hidden shadow-xl group hover:border-amber-500/20 transition-all">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/5 to-transparent pointer-events-none" />
              <span className="absolute bottom-2 right-2 text-[7px] font-mono text-amber-500/20 uppercase tracking-widest font-black leading-none">CHALLENGER // PROTO-MIGHT</span>
              
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <span className="text-[13px] font-black text-white hover:text-amber-400 uppercase tracking-wider font-sans block truncate max-w-[70%]">{displayName || "HEROIC ATHLETE"}</span>
                  <span className="text-[9px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold px-1.5 py-0.5 rounded-xs shrink-0">LVL {level}</span>
                </div>
                <div className="text-[8px] font-mono text-white/40 uppercase">TACTICAL STANCE: ACTIVE CLASH</div>
              </div>

              <div className="space-y-2">
                <div className="w-full h-3 bg-red-950/20 border border-white/10 rounded-full overflow-hidden p-[2px] relative shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(0, Math.min(100, (playerHp / playerMaxHp) * 100))}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono leading-none">
                  <span className="text-white/50 uppercase tracking-wider">Somatic Stamina</span>
                  <span className="font-bold text-emerald-400">{playerHp} / {playerMaxHp} HP</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[8.5px] font-mono uppercase text-white/40">
                <span>Might (ATK): {derivedStats.attack}</span>
                <span>Defense: {derivedStats.defense}</span>
                <span>Precision (CRT): {derivedStats.criticalChance}%</span>
              </div>
            </div>
  
            {/* COLUMN 2: ANIMATION MATCH STAGE */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center bg-zinc-950/80 border border-white/5 backdrop-blur-md p-4 rounded-lg relative overflow-hidden h-40 lg:h-auto min-h-[160px] text-center shadow-xl">
              {/* Spinning subtle patterns */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none opacity-20" />
              <div className="absolute inset-x-0 h-[1px] bg-amber-500/10 animate-[scanSweep_5s_linear_infinite]" />
              
              {selectedBoss && (
                <div className="flex flex-col items-center justify-center space-y-3 relative z-10 w-full">
                  {/* The rendering of the giant active boss graphic */}
                  {selectedBoss.id === 'iron_leviathan' && (
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 border border-dashed border-amber-500/20 rounded-full animate-[spin_12s_linear_infinite]" />
                      <div className="absolute w-12 h-12 border border-amber-500/30 rounded-full flex items-center justify-center bg-amber-500/5 shadow-[inset_0_0_12px_rgba(245,158,11,0.25)]">
                        <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse">🪨</span>
                      </div>
                      <div className="absolute -top-1 -right-1 flex gap-1 items-center bg-amber-500/10 border border-amber-500/30 rounded-xs px-1">
                        <span className="text-[5px] font-mono text-amber-500 font-bold uppercase">ANCIENT STONE</span>
                      </div>
                    </div>
                  )}

                  {selectedBoss.id === 'plasma_phoenix' && (
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 border border-red-500/20 rounded-full animate-[spin_6s_linear_infinite]" />
                      <div className="absolute w-12 h-12 border border-red-500/30 rounded-full animate-pulse flex items-center justify-center bg-red-500/5 shadow-[inset_0_0_12px_rgba(239,68,68,0.25)]">
                        <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(239,68,68,0.75)]">🐉</span>
                      </div>
                    </div>
                  )}

                  {selectedBoss.id === 'cyber_beast_reaper' && (
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 border-2 border-dotted border-purple-500/20 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
                      <div className="absolute w-12 h-12 border border-purple-500/30 rounded-full flex items-center justify-center bg-purple-500/5 shadow-[inset_0_0_12px_rgba(168,85,247,0.25)]">
                        <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(168,85,247,0.75)]">💀</span>
                      </div>
                    </div>
                  )}

                  {selectedBoss.id === 'lumen_singularity_gate' && (
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 border border-cyan-500/30 rounded-full animate-[spin_18s_linear_infinite]" />
                      <div className="absolute w-11 h-11 border border-cyan-500/40 bg-cyan-950/20 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(6,182,212,0.85)]">👼</span>
                      </div>
                    </div>
                  )}

                  {selectedBoss.id === 'chrono_apocalypse_archon' && (
                    <div className="relative w-18 h-18 flex items-center justify-center">
                      <div className="absolute inset-0 border border-dashed border-rose-500/20 rounded-full animate-[spin_14s_linear_infinite]" />
                      <div className="absolute w-13 h-13 border border-rose-500/30 bg-rose-950/10 rounded-full flex items-center justify-center">
                        <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(244,63,94,0.85)]">⏳</span>
                      </div>
                      <div className="absolute top-0 text-[5px] font-mono text-red-400 bg-red-950/80 border border-red-500/30 px-1 rounded uppercase font-black">
                        CHRONO TIME
                      </div>
                    </div>
                  )}

                  {selectedBoss.id === 'primeval_god_specimen' && (
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <div className="absolute inset-0 border-2 border-double border-yellow-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
                      <div className="absolute w-14 h-14 border border-yellow-500/30 bg-yellow-950/10 rounded-full flex items-center justify-center animate-pulse shadow-[inset_0_0_16px_rgba(234,179,8,0.3)]">
                        <span className="text-4xl filter drop-shadow-[0_0_15px_rgba(234,179,8,0.95)]">🔱</span>
                      </div>
                      <span className="absolute -bottom-1 text-[5px] font-mono text-yellow-400 px-1 bg-black border border-yellow-500/30 rounded uppercase font-bold tracking-widest block leading-none select-none">
                        SOMATIC
                      </span>
                    </div>
                  )}

                  <div className="space-y-0.5">
                    <span className="text-[7.5px] font-mono text-amber-500/40 tracking-[0.25em] uppercase block">HEROIC MATCH STAGE</span>
                    <span className="text-[10px] font-mono font-black text-amber-500 uppercase tracking-widest block">UNLEASH MARTIAL FEATS</span>
                  </div>
                </div>
              )}
            </div>
 
            {/* COLUMN 3: BOSS STATUS */}
            <div className="lg:col-span-4 bg-black/80 backdrop-blur-md p-4 rounded border border-red-500/10 flex flex-col justify-between gap-4 relative overflow-hidden shadow-xl group hover:border-red-500/20 transition-all">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-500/5 to-transparent pointer-events-none" />
              <span className="absolute bottom-2 right-2 text-[7px] font-mono text-red-500/20 uppercase tracking-widest font-black leading-none">LEGENDARY MYTH // BOSS</span>
              
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <span className="text-[13px] font-black text-white hover:text-red-400 uppercase tracking-wider font-sans block truncate max-w-[70%]">{selectedBoss?.name}</span>
                  <span className="text-[9px] font-mono bg-red-500/10 border border-red-500/20 text-red-400 font-bold px-1.5 py-0.5 rounded-xs shrink-0">{selectedBoss?.difficulty.toUpperCase()}</span>
                </div>
                <div className="text-[8px] font-mono text-white/40 uppercase">CHAMPION RANK REQ {selectedBoss?.level}</div>
              </div>

              <div className="space-y-2">
                <div className="w-full h-3 bg-red-950/20 border border-red-500/10 rounded-full overflow-hidden p-[2px] relative shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-rose-400 shadow-[0_0_8px_rgba(239,68,68,0.5)] rounded-full transition-all duration-300 animate-pulse"
                    style={{ width: `${Math.max(0, Math.min(100, (bossHp / (selectedBoss?.hp || 1)) * 100))}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono leading-none">
                  <span className="text-white/50 uppercase tracking-wider">Guardian Aegis</span>
                  <span className="font-bold text-red-400">{bossHp} / {selectedBoss?.hp} HP</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[8.5px] font-mono uppercase text-white/40">
                <span>Reward XP: +{selectedBoss?.rewards.xp}</span>
                <span>Reward Gold: +{selectedBoss?.rewards.credits}</span>
                <span>Defense (DEF): {selectedBoss?.defense}</span>
              </div>
            </div>
          </div>
 
          {/* Central command battle button */}
          <div className="mt-4 flex flex-col items-center justify-center gap-4 relative z-20">
            {battleFinished ? (
              <div className="text-center space-y-4 bg-black/90 backdrop-blur-md p-6 rounded-lg border border-amber-500/10 shadow-2xl max-w-sm w-full">
                <h4 className={`text-xl font-black font-sans tracking-wide ${battleFinished === 'won' ? 'text-amber-400 animate-bounce' : 'text-red-500'}`}>
                  {battleFinished === 'won' ? '★ TRIAL VICTORIOUS ★' : '⚡ STAMINA EXHAUSTED ⚡'}
                </h4>
                <p className="text-[10px] font-sans text-white/60 lowercase leading-relaxed first-letter:uppercase">
                  {battleFinished === 'won' 
                    ? `The mythological beast collapsed in defeat! Your heroic somatic triumph yields permanent rewards on your athletic profile (+${selectedBoss?.rewards.xp} XP and +${selectedBoss?.rewards.credits} Sacred Coins).`
                    : "Your physical fortitude failed under the crushing strength of the titan. Retreat to the Temple, expand your Talent Sphere, and ignite your raw endurance before challenging this titan again."}
                </p>
                <button
                  onClick={() => {
                    setSelectedBoss(null);
                    setIsFighting(false);
                    setBattleFinished(null);
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black px-6 py-2.5 rounded text-xs font-black font-mono uppercase tracking-wider cursor-pointer hover:from-amber-400 hover:to-amber-500 hover:scale-105 active:scale-95 transition-all shadow-md mt-2"
                >
                  CONCLUDE CHAMPION REPORT
                </button>
              </div>
            ) : (
              <button
                onClick={executeRound}
                disabled={isAnimatingRound}
                className={`bg-gradient-to-r from-amber-600 to-amber-500 border border-amber-500/20 text-black px-10 py-4 rounded text-xs font-black font-sans tracking-wider uppercase shadow-[0_0_25px_rgba(245,158,11,0.25)] flex items-center gap-3 transition-all z-20 ${
                  isAnimatingRound 
                    ? 'opacity-60 cursor-not-allowed scale-95' 
                    : 'hover:from-amber-400 hover:to-amber-500 hover:scale-[1.03] active:scale-95 cursor-pointer'
                }`}
              >
                <Sword className={`w-4 h-4 text-black ${isAnimatingRound ? 'animate-spin' : 'animate-bounce'}`} />
                {isAnimatingRound ? 'STRIKING HEROIC BLOW...' : '⚔️ UNLEASH HEROIC SOMATIC STRIKE'}
              </button>
            )}
          </div>
 
          {/* Battle console feedback logs streams */}
          <div className="mt-4 relative z-20">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[7.5px] font-mono text-white/30 tracking-widest uppercase">📜 CHRONICLES OF THE CLASH</span>
              <span className="text-[7.5px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-sm border border-amber-500/25 animate-pulse">● SAGA WRITING</span>
            </div>
            
            <div className="bg-stone-950 p-4 rounded border border-amber-500/5 h-32 overflow-y-auto font-sans text-xs text-white/60 space-y-2 select-text no-scrollbar shadow-inner">
              {battleLogs.map((log, i) => (
                <div key={i} className={`p-2 rounded-sm text-[11px] leading-relaxed border-l-2 ${
                  log.includes('CRITICAL') ? 'bg-amber-500/10 text-amber-300 border-amber-500' :
                  log.includes('💥') ? 'text-white border-yellow-600/80 bg-white/[0.01]' :
                  log.includes('won') || log.includes('TRIUMPH') || log.includes('CONGRATULATIONS') ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500 font-bold uppercase tracking-wide' :
                  log.includes('lost') || log.includes('🚨') || log.includes('DEFEAT') || log.includes('failed') ? 'bg-red-950/40 text-red-400 border-red-500' :
                  'border-white/5 text-white/40'
                }`}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
