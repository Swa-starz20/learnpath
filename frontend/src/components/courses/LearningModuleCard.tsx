import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, Clock, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';
import { AdaptiveDifficultyBadge } from './AdaptiveDifficultyBadge';
import type { CourseCatalogEntry } from '@/data/courseCatalog';

interface LearningModuleCardProps {
  entry: CourseCatalogEntry;
  index: number;
  isActive?: boolean;
}

export const LearningModuleCard = ({ entry, index, isActive = false }: LearningModuleCardProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[entry.color];
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -3, scale: 1.01 }}
      onClick={() => navigate(`/courses/${entry.id}`)}
      className={cn(
        'relative rounded-2xl p-4 overflow-hidden border cursor-pointer group transition-all duration-200',
        'bg-[rgba(255,255,255,0.02)] backdrop-blur-xl',
        isActive ? cn('border', accent.border, accent.glow) : 'border-white/[0.07] hover:border-white/[0.13]'
      )}
    >
      {/* Ambient glow on active */}
      {isActive && (
        <div className={cn('absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-30', accent.bg)} />
      )}

      {/* Match score badge */}
      <div className="absolute top-3 right-3">
        <span className={cn(
          'flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono border',
          accent.bg, accent.border, accent.text
        )}>
          <Sparkles size={7} />
          {entry.matchScore}%
        </span>
      </div>

      <div className="relative z-10">
        {/* Title */}
        <div className="pr-14 mb-2">
          <h3 className="text-sm font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] leading-snug group-hover:text-white transition-colors">
            {entry.title}
          </h3>
          <p className={cn('text-[10px] font-mono mt-0.5', accent.text)}>{entry.subtitle}</p>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-3">
          <AdaptiveDifficultyBadge difficulty={entry.difficulty} adaptive={isActive} size="sm" />
          <span className="flex items-center gap-1 text-[9px] font-mono text-white/30">
            <Clock size={8} /> {entry.totalHours}h
          </span>
          {entry.roadmapSync && (
            <span className="text-[9px] font-mono text-violet-400/70">◈ Roadmap</span>
          )}
        </div>

        {/* Skill chips */}
        <div className="flex flex-wrap gap-1 mb-3">
          {entry.skills.slice(0, 4).map(s => (
            <span key={s} className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/40">
              {s}
            </span>
          ))}
        </div>

        {/* CTA row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <BarChart2 size={9} className="text-white/20" />
            <span className="text-[9px] font-mono text-white/25">{entry.tags.join(' · ')}</span>
          </div>
          <motion.div
            whileHover={{ x: 3 }}
            className={cn('flex items-center gap-1 text-[10px] font-mono font-semibold', accent.text)}
          >
            {isActive ? 'Continue' : 'Explore'}
            <ChevronRight size={11} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
