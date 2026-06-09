import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { DifficultyLevel } from '@/data/engineeringCourses';

interface AdaptiveDifficultyBadgeProps {
  difficulty: DifficultyLevel;
  adaptive?: boolean;
  size?: 'sm' | 'md';
}

const DIFFICULTY_CONFIG: Record<DifficultyLevel, { color: string; bg: string; border: string; dot: string }> = {
  Foundational: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', dot: 'bg-emerald-400' },
  Intermediate: { color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/25',   dot: 'bg-amber-400' },
  Advanced:     { color: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/25',  dot: 'bg-orange-400' },
  Expert:       { color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/25',     dot: 'bg-red-400' },
};

export const AdaptiveDifficultyBadge = ({ difficulty, adaptive = false, size = 'sm' }: AdaptiveDifficultyBadgeProps) => {
  const cfg = DIFFICULTY_CONFIG[difficulty];

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border font-mono',
      cfg.bg, cfg.border, cfg.color,
      size === 'sm' ? 'px-2 py-0.5 text-[9px] tracking-widest' : 'px-3 py-1 text-[10px]'
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {difficulty}
      {adaptive && (
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="ml-0.5 text-white/30"
        >
          · AI
        </motion.span>
      )}
    </span>
  );
};
