import React from 'react';
import { Sparkle, Lock, Info } from 'lucide-react';
import { SPHERE_NODES } from '../AvatarPanel';

interface SphereGridProps {
  unassignedPoints: number;
  gridNodesUnlocked: string[];
  onUnlockNode: (nodeId: string, node: any) => void;
}

export const SphereGrid: React.FC<SphereGridProps> = ({
  unassignedPoints,
  gridNodesUnlocked,
  onUnlockNode,
}) => {
  return (
    <div className="bg-black/85 border border-white/20 rounded-lg p-6 relative overflow-hidden shadow-xl h-full flex flex-col justify-between flex-1 gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-base font-black uppercase tracking-wider text-white font-mono">2. Attribute Sphere Grid</h3>
          <p className="text-[10px] text-white/50">Awaken connected bio-nodes in your athletic blueprint to boost raw stats.</p>
        </div>
        <div className="flex items-center gap-2 bg-gym-accent/10 border border-gym-accent/30 px-3.5 py-1.5 rounded text-xs font-mono font-bold text-gym-accent">
          ⭐ Available Points: {unassignedPoints}
        </div>
      </div>

      {/* Connected Visual Map */}
      <div className="relative bg-zinc-950 rounded border border-white/10 aspect-[16/9] w-full overflow-hidden flex items-center justify-center flex-grow flex-1 min-h-[300px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1.5px,transparent_1.5px)] bg-[size:16px_16px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Laser connection links behind nodes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {Object.entries(SPHERE_NODES).map(([nodeId, node]) => {
            return node.connections.map(connId => {
              const target = SPHERE_NODES[connId];
              if (!target || nodeId > connId) return null; // Render each line only once to optimize
              
              const isSourceUnlocked = gridNodesUnlocked.includes(nodeId);
              const isTargetUnlocked = gridNodesUnlocked.includes(connId);
              const isLineActive = isSourceUnlocked && isTargetUnlocked;

              return (
                <line
                  key={`${nodeId}-${connId}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  stroke={isLineActive ? '#00f2fe' : '#27272a'}
                  strokeWidth={isLineActive ? '1.5' : '1'}
                  strokeDasharray={isLineActive ? 'none' : '4,4'}
                  className={isLineActive ? 'opacity-85' : 'opacity-25'}
                />
              );
            });
          })}
        </svg>

        {/* Grid Core Central Alignment Pillar Display */}
        <div className="absolute opacity-5 text-[8px] font-mono select-none pointer-events-none tracking-[0.5em] text-center uppercase">
          BIOMECHANICAL ALIGNMENT PILLAR PROTOCOL
        </div>

        {/* Render Interactive Sphere Nodes */}
        {Object.entries(SPHERE_NODES).map(([nodeId, node]) => {
          const isUnlocked = gridNodesUnlocked.includes(nodeId);
          const isCentral = nodeId === 'p0';

          // Color mapping per node category
          const colorScheme = ({
            power: { bg: 'bg-amber-600/30', border: 'border-amber-400', glow: 'shadow-amber-500/25', iconColor: 'text-amber-400' },
            kinetic: { bg: 'bg-cyan-600/30', border: 'border-cyan-400', glow: 'shadow-cyan-400/25', iconColor: 'text-cyan-300' },
            symmetry: { bg: 'bg-emerald-600/30', border: 'border-emerald-400', glow: 'shadow-emerald-500/25', iconColor: 'text-emerald-400' },
            velocity: { bg: 'bg-pink-600/30', border: 'border-pink-400', glow: 'shadow-pink-500/25', iconColor: 'text-pink-400' },
            recovery: { bg: 'bg-purple-600/30', border: 'border-purple-400', glow: 'shadow-purple-500/25', iconColor: 'text-purple-400' },
          } as any)[node.category] || { bg: 'bg-zinc-600/30', border: 'border-zinc-400', glow: 'shadow-zinc-300/25', iconColor: 'text-zinc-400' };

          return (
            <div
              key={nodeId}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
            >
              <button
                onClick={() => onUnlockNode(nodeId, node)}
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer relative ${
                  isUnlocked 
                    ? `${colorScheme.bg} ${colorScheme.border} shadow-[0_0_10px_rgba(255,255,255,0.1)]` 
                    : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'
                }`}
                title={node.name}
              >
                {isUnlocked ? (
                  <Sparkle className={`w-3.5 h-3.5 ${colorScheme.iconColor} animate-pulse`} />
                ) : (
                  <Lock className="w-3 text-zinc-600 group-hover:text-zinc-400" />
                )}
                
                {/* Cost Indicator Badge */}
                {!isCentral && !isUnlocked && (
                  <span className="absolute -top-1.5 -right-1.5 bg-zinc-800 text-white border border-zinc-700 rounded-full text-[7px] font-bold w-3.5 h-3.5 flex items-center justify-center">
                    {node.cost}
                  </span>
                )}
              </button>

              {/* Floating Tooltip descriptor popup */}
              <div className={`absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-all ${node.y < 35 ? 'top-10' : 'bottom-10'} left-1/2 -translate-x-1/2 bg-zinc-950/95 border border-white/10 p-2 rounded shadow-xl min-w-[160px] z-[99] text-center`}>
                <div className={`text-[8px] font-mono uppercase tracking-wider font-bold ${colorScheme.iconColor}`}>
                  {node.category} branch
                </div>
                <div className="text-[11px] font-bold text-white mt-0.5 whitespace-nowrap">{node.name}</div>
                <div className="text-[9px] text-white/50 mt-0.5">{node.bonusText}</div>
                
                {!isUnlocked && (
                  <div className="border-t border-white/5 mt-2 pt-1 flex justify-center items-center gap-1">
                    <span className="text-[8.5px] text-white/40">Activation:</span>
                    <span className="text-[9px] font-bold text-amber-400 font-mono">{node.cost} SP</span>
                  </div>
                )}
                {isUnlocked && (
                  <span className="text-[8px] text-emerald-400 font-bold block mt-1">✓ Active Specimen</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sphere Grid Instructions */}
      <div className="bg-zinc-900/60 border border-white/5 p-4 rounded flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-white/50 space-y-1 font-sans">
          <p className="font-bold text-white">How Synaptic Mapping Works:</p>
          <p>1. Progress spreads outward from the central Altar. You must unlock adjacent nodes to trace high-level pathways.</p>
          <p>2. Activating nodes automatically adds permanent bonus points to your core stats.</p>
          <p>3. Spend talent points earned through active challenge portals to unlock specialized power grids.</p>
        </div>
      </div>
    </div>
  );
};
