import React, { useState } from 'react';
import { Sword, Skull } from 'lucide-react';
import { RAID_BOSSES, RaidBoss } from '../AvatarPanel';

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
  const [bossHp, setBossHp] = useState<number>(100);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [playerMaxHp, setPlayerMaxHp] = useState<number>(100);
  const [battleLogs, setBattleLogs] = useState<string[]>([]);
  const [battleFinished, setBattleFinished] = useState<'won' | 'lost' | null>(null);
  const [combatFloaters, setCombatFloaters] = useState<CombatFloater[]>([]);

  const startRaidBattle = (boss: RaidBoss) => {
    setSelectedBoss(boss);
    setBossHp(boss.hp);
    setPlayerMaxHp(derivedStats.maxHp);
    setPlayerHp(derivedStats.maxHp);
    
    const petDmgBuff = activePetLevel * 2;
    const petDmgRed = activePetLevel * 2;
    
    setBattleLogs([
      `⚔️ Battle initiated. Challenge: ${boss.name} (LVL ${boss.level})`,
      `🧬 Your Combat Rating: HP ${derivedStats.maxHp} | ATK ${derivedStats.attack} | DEF ${derivedStats.defense}`,
      `🐾 Companion ${activePetName || 'Pet'} (LVL ${activePetLevel}): +${petDmgBuff}% DMG & -${petDmgRed}% DMG Received!`,
      `🥊 It is your turn! Initiate attack sequence.`
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
    if (!selectedBoss || battleFinished) return;

    const roundLogs: string[] = [];
    
    // --- Phase 1: Player Attacks Boss ---
    const isCrit = Math.random() * 100 < derivedStats.criticalChance;
    
    // Calculate randomized DMG
    let playerDmgBase = derivedStats.attack * (0.85 + Math.random() * 0.3);
    if (isCrit) {
      playerDmgBase *= 1.8;
      roundLogs.push(`⭐️ CRITICAL HIT!`);
    }

    // Apply active pet companion damage buff: +2% per level
    const petDmgBuff = activePetLevel * 2;
    const petMultiplier = 1 + (petDmgBuff / 100);
    playerDmgBase *= petMultiplier;

    // Apply boss defense mitigation
    let finalBossDmg = Math.round(Math.max(5, playerDmgBase - selectedBoss.defense));
    const nextBossHp = Math.max(0, bossHp - finalBossDmg);
    setBossHp(nextBossHp);

    roundLogs.push(`💥 You attacked ${selectedBoss.name} dealing ${finalBossDmg} damage (including +${petDmgBuff}% Companion boost).`);
    spawnFloater(`-${finalBossDmg}`, isCrit ? 'critical' : 'damage');

    // Check boss defeat
    if (nextBossHp <= 0) {
      setBattleFinished('won');
      roundLogs.push(`🔥 CONGRATULATIONS! You have successfully neutralized ${selectedBoss.name}!`);
      roundLogs.push(`🏆 Earned rewards: +${selectedBoss.rewards.xp} XP and +${selectedBoss.rewards.credits} Coins.`);
      
      onGainRewards(selectedBoss.rewards.xp, selectedBoss.rewards.credits, selectedBoss.rewards.aura);
      setBattleLogs(prev => [...roundLogs, ...prev]);
      return;
    }

    // --- Phase 2: Boss Counters ---
    const bossDmgBase = selectedBoss.attackPower * (0.75 + Math.random() * 0.5);
    let finalPlayerDmg = Math.round(Math.max(3, bossDmgBase - derivedStats.defense));
    
    // Apply active pet companion damage reduction: -2% per level (cap at 90% mitigation for safety)
    const petDmgRed = activePetLevel * 2;
    const reducerMultiplier = Math.max(0.1, 1 - (petDmgRed / 100));
    finalPlayerDmg = Math.round(finalPlayerDmg * reducerMultiplier);

    const nextPlayerHp = Math.max(0, playerHp - finalPlayerDmg);
    setPlayerHp(nextPlayerHp);

    roundLogs.push(`👿 ${selectedBoss.name} retaliated, dealing ${finalPlayerDmg} damage to your armor.`);
    roundLogs.push(`🛡️ Companion ${activePetName || 'Pet'} mitigated -${petDmgRed}% incoming damage.`);
    spawnFloater(`-${finalPlayerDmg}`, 'boss_damage');

    // Check player defeat
    if (nextPlayerHp <= 0) {
      setBattleFinished('lost');
      roundLogs.push(`🚨 CRITICAL OVERLOAD! Your biomechanics failed to withstand the pressure of ${selectedBoss.name}.`);
      roundLogs.push(`💡 Tip: Buff your attributes via the Talent Sphere Grid or synth high-multiplier auras.`);
    } else {
      roundLogs.push(`🥊 Round complete. Ready for next assault.`);
    }

    setBattleLogs(prev => [...roundLogs, ...prev]);
  };

  return (
    <div className="w-full h-full flex flex-col flex-1">
      {!isFighting ? (
        <div className="bg-black/85 border border-white/20 rounded-lg p-6 relative overflow-hidden shadow-xl h-full flex flex-col justify-start flex-1 gap-4">
          <div>
            <h3 className="text-base font-black uppercase tracking-wider text-rose-500 font-mono">4. Challenge Portal</h3>
            <p className="text-[10px] text-white/50 font-sans">Neutralize synthetic threat vectors using sandbox battle mechanics. Earn massive permanent level XP and Coin rewards.</p>
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
                          ? 'bg-orange-500/20 border-orange-400 text-orange-300' 
                          : boss.difficulty === 'mythic' 
                            ? 'bg-purple-500/20 border-purple-400 text-purple-300' 
                            : boss.difficulty === 'nightmare'
                              ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                              : 'bg-red-950/80 border-red-500 text-red-400 font-black animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                    }`}>
                      {boss.difficulty} PROTOCOL
                    </span>
                    <span className="text-[9px] text-white/40 font-mono">REQ. LEVEL {boss.level}</span>
                  </div>
                  
                  <h4 className="text-xs font-black text-white font-mono uppercase">{boss.name}</h4>
                  <p className="text-[10px] text-white/60 mb-2 font-serif italic">{boss.subtitle}</p>
                  <p className="text-[10px] text-white/40 max-w-xl line-clamp-2 leading-relaxed">{boss.description}</p>
                </div>

                {/* HP & Rewards status */}
                <div className="flex md:flex-col items-end gap-2.5 justify-between w-full md:w-auto mt-4 md:mt-0 pt-3 md:pt-0 border-t border-white/5 md:border-0 shrink-0">
                  <div className="text-right">
                    <span className="text-[7.5px] text-white/40 block font-mono">THREAT RATING</span>
                    <span className="text-[10px] font-mono font-bold text-white">HP: {boss.hp} | ATK: {boss.attackPower}</span>
                  </div>
                  <div className="text-right mb-1">
                    <span className="text-[7.5px] text-white/40 block font-mono font-bold text-yellow-500">🏆 REWARDS</span>
                    <span className="text-[10px] font-mono font-bold text-white">+{boss.rewards.xp} XP | +{boss.rewards.credits} CO</span>
                  </div>
                  
                  <button
                    onClick={() => startRaidBattle(boss)}
                    className="bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-2 rounded text-[10px] font-black font-mono tracking-wider cursor-pointer flex items-center gap-1.5 uppercase shadow-md active:scale-95 transition-all"
                  >
                    <Sword className="w-3 h-3 text-white animate-pulse" />
                    INITIATE RAID
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Fighting Screen Interface
        <div className="bg-black/90 border border-red-500/30 rounded-lg p-6 relative overflow-hidden shadow-2xl h-full flex flex-col justify-between flex-1 gap-4">
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          
          {/* Header bar */}
          <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-mono font-black text-red-500 uppercase tracking-widest">ACTIVE SIMULATION RAID</span>
            </div>
            <button 
              onClick={() => setIsFighting(false)}
              className="text-[10px] font-mono bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white px-2.5 py-1 rounded cursor-pointer transition-colors"
            >
              ← WITHDRAW
            </button>
          </div>

          {/* Battleground Dual bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Floating text indicators */}
            {combatFloaters.map(f => (
              <div 
                key={f.id}
                style={{ left: `${f.x}%`, top: `${f.y}%` }}
                className={`absolute font-black text-base animate-bounce select-none pointer-events-none drop-shadow-xl z-[999] ${
                  f.type === 'critical' ? 'text-yellow-400 text-lg scale-110' :
                  f.type === 'dodge' ? 'text-cyan-400 font-mono text-[11px]' :
                  f.type === 'boss_damage' ? 'text-red-500' : 'text-orange-500'
                }`}
              >
                {f.val}
              </div>
            ))}

            {/* Your status */}
            <div className="bg-zinc-950 p-4 rounded border border-white/10 flex flex-col gap-3 relative">
              <span className="absolute bottom-2 right-2 text-[8px] font-mono text-white/10">OPERATIVE_01</span>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-white uppercase tracking-wider">{displayName || "LIFTER_01"}</span>
                <span className="text-[10px] font-mono text-gym-accent font-bold">LVL {level}</span>
              </div>
              <div className="w-full h-3 bg-red-950/20 border border-white/10 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-white/50 leading-none">
                <span>HEALTH</span>
                <span className="font-bold text-white">{playerHp} / {playerMaxHp} HP</span>
              </div>
            </div>

            {/* Boss status */}
            <div className="bg-zinc-950 p-4 rounded border border-red-500/20 flex flex-col gap-3 relative">
              <span className="absolute bottom-2 right-2 text-[8px] font-mono text-red-500/10">THREAT_VECTOR</span>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-white uppercase tracking-wider">{selectedBoss?.name}</span>
                <span className="text-[10px] font-mono text-red-400 font-bold">ALPHA</span>
              </div>
              <div className="w-full h-3 bg-red-950/20 border border-red-500/20 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-red-500 transition-all duration-300"
                  style={{ width: `${(bossHp / (selectedBoss?.hp || 1)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-white/50 leading-none">
                <span>BARRIER INTEGRITY</span>
                <span className="font-bold text-red-400">{bossHp} / {selectedBoss?.hp} HP</span>
              </div>
            </div>
          </div>

          {/* Central command battle button */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            {battleFinished ? (
              <div className="text-center space-y-4">
                <h4 className={`text-2xl font-black font-mono tracking-widest ${battleFinished === 'won' ? 'text-gym-accent' : 'text-red-500'}`}>
                  {battleFinished === 'won' ? 'RAID VICTORIOUS' : 'SYSTEM OVERLOADED'}
                </h4>
                <button
                  onClick={() => {
                    setSelectedBoss(null);
                    setIsFighting(false);
                    setBattleFinished(null);
                  }}
                  className="bg-white text-black px-6 py-2 rounded text-xs font-black font-mono uppercase tracking-wider cursor-pointer hover:bg-zinc-200 transition-all shadow-md"
                >
                  DISMISS BATTLE REPORT
                </button>
              </div>
            ) : (
              <button
                onClick={executeRound}
                className="bg-red-600 hover:bg-red-500 hover:scale-105 active:scale-95 text-white px-8 py-3.5 rounded text-sm font-black font-mono tracking-wider uppercase cursor-pointer shadow-lg shadow-red-950/50 flex items-center gap-2 transition-all"
              >
                <Sword className="w-4 h-4" />
                LAUNCH ATK SEQUENCE
              </button>
            )}
          </div>

          {/* Battle console feedback logs */}
          <div className="mt-6">
            <span className="text-[8px] font-mono text-white/30 block mb-2 tracking-widest uppercase">COMBAT_LOGS_FEED_STREAM</span>
            <div className="bg-black border border-white/5 p-4 rounded h-40 overflow-y-auto font-mono text-xs text-white/60 space-y-2 select-text">
              {battleLogs.map((log, i) => (
                <div key={i} className={`p-1.5 rounded-sm ${
                  log.includes('CRITICAL') ? 'bg-yellow-500/10 text-yellow-300 border-l-2 border-yellow-500 pl-2' :
                  log.includes('💥') ? 'text-white' :
                  log.includes('won') ? 'bg-emerald-500/10 text-emerald-300 border-l-2 border-emerald-500 pl-2' :
                  log.includes('lost') || log.includes('DEFEATED') ? 'bg-red-950/30 text-red-400 border-l-2 border-red-500 pl-2' :
                  'text-white/40'
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
