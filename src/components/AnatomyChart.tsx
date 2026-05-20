import React from 'react';
import { motion } from 'motion/react';
import { POOLS } from '../data/exercises';

interface SessionSet {
  exerciseName: string;
  weight: number;
  reps: number;
}

interface AnatomyChartProps {
  sets: SessionSet[];
}

const AnatomyChart: React.FC<AnatomyChartProps> = ({ sets }) => {
  // Count unique exercises per muscle group
  const muscleExerciseCount = sets.reduce((acc, set) => {
    let muscleGroup: string | null = null;
    for (const [key, exercises] of Object.entries(POOLS)) {
      const ex = exercises.find(e => e.name === set.exerciseName);
      if (ex) {
        muscleGroup = ex.muscleGroup || ex.pool;
        break;
      }
    }
    if (muscleGroup) {
      if (!acc[muscleGroup]) acc[muscleGroup] = new Set();
      acc[muscleGroup].add(set.exerciseName);
    }
    return acc;
  }, {} as Record<string, Set<string>>);

  const getIntensity = (group: string) => {
    const count = muscleExerciseCount[group]?.size || 0;
    return Math.min(count / 4, 1);
  };

  const getFill = (group: string) => {
    const count = muscleExerciseCount[group]?.size || 0;
    if (count === 0) return "rgba(255, 255, 255, 0.05)";
    if (count === 1) return "#22c55e"; // Green
    if (count === 2) return "#eab308"; // Yellow
    if (count === 3) return "#f97316"; // Orange
    return "#ef4444"; // Red (4+)
  };

  const getPoolColorClass = (group: string) => {
    const count = muscleExerciseCount[group]?.size || 0;
    if (count === 1) return "bg-[#22c55e]";
    if (count === 2) return "bg-[#eab308]";
    if (count === 3) return "bg-[#f97316]";
    if (count >= 4) return "bg-[#ef4444]";
    return "bg-white/10";
  };

  // Stylized Body Outline (Blocky style from reference image)
  const bodyOutlinePath = "M100,40 Q110,40 115,50 L115,70 Q130,75 140,90 L145,130 L135,135 L130,110 Q125,180 120,250 L130,350 L110,350 L105,260 L95,260 L90,350 L70,350 L80,250 Q75,180 70,110 L65,135 L55,130 L60,90 Q70,75 85,70 L85,50 Q90,40 100,40 Z";

  const groupsToShow = ['chest', 'back', 'shoulders', 'quads', 'hamstrings', 'glutes', 'calves', 'biceps', 'triceps', 'core'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-10">
      {/* Front View */}
      <div className="flex flex-col items-center">
        <h4 className="text-[10px] text-gym-accent font-bold uppercase tracking-[0.3em] mb-8">Front Evolution</h4>
        <svg viewBox="0 0 200 400" className="w-full max-w-[240px] h-auto drop-shadow-[0_0_20px_rgba(212,175,55,0.1)]">
          {/* Stylized Body Outline - Front */}
          <g fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1">
            <path d={bodyOutlinePath} />
          </g>

          {/* Muscle Groups - Front */}
          {/* Shoulders */}
          <path 
            d="M85,75 Q75,75 70,90 L75,105 Q80,105 85,95 Z M115,75 Q125,75 130,90 L125,105 Q120,105 115,95 Z" 
            fill={getFill('shoulders')} 
            className="transition-colors duration-1000"
          />
          {/* Chest */}
          <path 
            d="M88,90 Q100,85 112,90 L115,115 Q100,120 85,115 Z" 
            fill={getFill('chest')} 
            className="transition-colors duration-1000"
          />
          {/* Abs (Core) */}
          <path 
            d="M90,125 Q100,122 110,125 L108,185 Q100,188 92,185 Z" 
            fill={getFill('core')} 
            className="transition-colors duration-1000"
          />
          {/* Biceps */}
          <path 
            d="M65,105 Q60,115 62,130 L70,125 Q72,115 70,105 Z M135,105 Q140,115 138,130 L130,125 Q128,115 130,105 Z" 
            fill={getFill('biceps')} 
            className="transition-colors duration-1000"
          />
          {/* Quads (Upper Legs) */}
          <path 
            d="M82,200 Q90,195 98,200 L95,255 L85,255 Z M102,200 Q110,195 118,200 L115,255 L105,255 Z" 
            fill={getFill('quads')} 
            className="transition-colors duration-1000"
          />
          {/* Calves (Lower Legs) */}
          <path 
            d="M84,265 L92,265 L88,330 L80,330 Z M116,265 L108,265 L112,330 L120,330 Z" 
            fill={getFill('calves')} 
            className="transition-colors duration-1000"
          />
        </svg>
      </div>

      {/* Back View */}
      <div className="flex flex-col items-center">
        <h4 className="text-[10px] text-gym-accent font-bold uppercase tracking-[0.3em] mb-8">Rear Evolution</h4>
        <svg viewBox="0 0 200 400" className="w-full max-w-[240px] h-auto drop-shadow-[0_0_20px_rgba(212,175,55,0.1)]">
          {/* Stylized Body Outline - Back */}
          <g fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1">
            <path d={bodyOutlinePath} />
          </g>

          {/* Muscle Groups - Back */}
          {/* Upper/Mid Back */}
          <path 
            d="M85,85 Q100,75 115,85 L120,135 Q100,145 80,135 Z" 
            fill={getFill('back')} 
            className="transition-colors duration-1000"
          />
          {/* Middle/Lower Back */}
          <path 
            d="M90,140 Q100,145 110,140 L115,180 Q100,185 85,180 Z" 
            fill={getFill('back')} 
            className="transition-colors duration-1000 opacity-80"
          />
          {/* Shoulders */}
          <path 
            d="M85,75 Q75,75 70,90 L75,105 Q80,105 85,95 Z M115,75 Q125,75 130,90 L125,105 Q120,105 115,95 Z" 
            fill={getFill('shoulders')} 
            className="transition-colors duration-1000"
          />
          {/* Triceps */}
          <path 
            d="M62,105 Q58,115 60,130 L68,135 Q70,120 68,105 Z M138,105 Q142,115 140,130 L132,135 Q130,120 132,105 Z" 
            fill={getFill('triceps')} 
            className="transition-colors duration-1000"
          />
          {/* Glutes */}
          <path 
            d="M82,185 C75,185 75,220 82,225 C90,225 100,215 100,215 C100,215 110,225 118,225 C125,220 125,185 118,185 C110,185 100,195 100,195 C100,195 90,185 82,185 Z" 
            fill={getFill('glutes')} 
            className="transition-colors duration-1000"
          />
          {/* Hamstrings */}
          <path 
            d="M82,225 L95,225 L92,265 L84,265 Z M118,225 L105,225 L108,265 L116,265 Z" 
            fill={getFill('hamstrings')} 
            className="transition-colors duration-1000"
          />
          {/* Calves (Lower Legs) */}
          <path 
            d="M84,265 L92,265 L88,335 L78,335 Z M116,265 L108,265 L112,335 L122,335 Z" 
            fill={getFill('calves')} 
            className="transition-colors duration-1000"
          />
        </svg>
      </div>

      <div className="md:col-span-2 mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-5 gap-4">
          {groupsToShow.map(group => (
            <div key={group} className="bg-white/5 border border-white/10 p-4 rounded-sm flex flex-col items-center text-center">
              <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest mb-1">
                {group === 'core' ? 'abs/core' : group}
              </span>
              <div className="text-sm font-medium text-white">{muscleExerciseCount[group]?.size ? `${Math.round(intensityToLoad(getIntensity(group)))}%` : "0%"}</div>
              <div className="w-full bg-white/5 h-1 mt-3 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${getIntensity(group) * 100}%` }}
                   className={`h-full ${getPoolColorClass(group)}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const intensityToLoad = (i: number) => i * 100;

export default AnatomyChart;
