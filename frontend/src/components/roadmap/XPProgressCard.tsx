import { motion } from 'framer-motion';
import { Zap, Award, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AccentColor } from '@/data/engineeringDomains';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';

interface XPProgressCardProps {
  currentXP: number;
  totalXP: number;
  level: number;
  streak: number;
  accentColor: AccentColor;
}

function useAnimatedValue(target: number): number {
  // Simple static return — RAF animation on page load would happen naturally
  return target;
}

export const XPProgressCard = ({
  currentXP,
  totalXP,
  level,
  streak,
  accentColor,
}: XPProgressCardProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[accentColor];
  const pct = Math.min((currentXP / totalXP) * 100, 100);
  useAnimatedValue(pct); // kept for future animation hook

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className={cn(
        'relative rounded-2xl p-4 overflow-hidden',
        'bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/[0.08]'
      )}
    >
      <div className={cn('absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none', accent.bg)} />

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', accent.bg, 'border', accent.border)}>
              <Zap size={12} className={accent.text} />
            </div>
            <div>
              <p className="text-[9px] font-mono tracking-widest uppercase text-white/30">XP Progress</p>
              <p className={cn('text-xs font-bold font-mono', accent.text)}>Level {level}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Flame size={12} className="text-amber-400" />
            <span className="text-xs font-bold font-mono text-amber-300">{streak}</span>
            <span className="text-[9px] font-mono text-white/30">day streak</span>
          </div>
        </div>

        {/* XP numbers */}
        <div className="flex items-baseline gap-1 mb-2">
          <span className={cn('text-2xl font-bold font-[\'Hanken_Grotesk\',_sans-serif]', accent.text)}>
            {currentXP.toLocaleString()}
          </span>
          <span className="text-sm font-mono text-white/30">/ {totalXP.toLocaleString()} XP</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            className={cn('h-full rounded-full')}
            style={{
              background: `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))`,
              boxShadow: `0 0 10px rgba(139,92,246,0.5)`,
              backgroundImage: 'linear-gradient(to right, #7c3aed, #4f46e5)',
            }}
          />
        </div>

        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[9px] font-mono text-white/25">{pct.toFixed(1)}% complete</span>
          <span className="text-[9px] font-mono text-white/25">{(totalXP - currentXP).toLocaleString()} XP to next level</span>
        </div>
      </div>
    </motion.div>
  );
};

// ── Achievement Badge ──────────────────────────────────────────────────────────

interface AchievementBadgeProps {
  label: string;
  icon: string;
  unlocked: boolean;
  accentColor: AccentColor;
  delay?: number;
}

export const AchievementBadge = ({
  label,
  icon,
  unlocked,
  accentColor,
  delay = 0,
}: AchievementBadgeProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[accentColor];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: unlocked ? 1 : 0.35, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={unlocked ? { y: -2, scale: 1.05 } : {}}
      className={cn(
        'relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all',
        unlocked
          ? cn('bg-[rgba(255,255,255,0.03)]', accent.border, 'cursor-default')
          : 'bg-[rgba(255,255,255,0.01)] border-white/[0.06] grayscale'
      )}
    >
      {unlocked && (
        <div className={cn('absolute inset-0 rounded-xl opacity-10 pointer-events-none', accent.bg)} />
      )}
      <span className="text-xl relative z-10">{icon}</span>
      <span className={cn(
        'text-[9px] font-mono tracking-wide text-center leading-tight',
        unlocked ? 'text-white/60' : 'text-white/20'
      )}>
        {label}
      </span>
      {unlocked && (
        <Award size={9} className={cn('absolute top-1.5 right-1.5', accent.text)} />
      )}
    </motion.div>
  );
};
