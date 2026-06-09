import { motion } from 'framer-motion';
import { FlaskConical, Lock, CheckCircle2, Clock, Wrench, Zap, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PracticeLab } from '@/data/engineeringCourses';
import type { AccentColor } from '@/data/engineeringDomains';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';

interface PracticeLabCardProps {
  lab: PracticeLab;
  accentColor: AccentColor;
  index: number;
  onStart?: () => void;
}

const DIFF_COLOR: Record<string, string> = {
  Foundational: 'text-emerald-400',
  Intermediate: 'text-amber-400',
  Advanced: 'text-orange-400',
  Expert: 'text-red-400',
};

export const PracticeLabCard = ({ lab, accentColor, index, onStart }: PracticeLabCardProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[accentColor];
  const isLocked = lab.status === 'locked';
  const isCompleted = lab.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={!isLocked ? { y: -2, scale: 1.01 } : {}}
      className={cn(
        'relative rounded-2xl p-4 overflow-hidden border transition-all duration-200',
        'bg-[rgba(255,255,255,0.02)] backdrop-blur-xl',
        isCompleted ? cn('border-white/[0.12]', accent.glow) :
        isLocked ? 'border-white/[0.05] opacity-55' :
        cn('border', accent.border, 'shadow-sm')
      )}
    >
      {/* Background tint for active labs */}
      {!isLocked && !isCompleted && (
        <div className={cn('absolute inset-0 rounded-2xl pointer-events-none opacity-5', accent.bg)} />
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
            isCompleted ? cn(accent.bg, 'border', accent.border) :
            isLocked ? 'bg-white/[0.04] border border-white/[0.08]' :
            'bg-cyan-500/15 border border-cyan-500/25'
          )}>
            {isCompleted ? <CheckCircle2 size={14} className={accent.text} /> :
             isLocked ? <Lock size={13} className="text-white/25" /> :
             <FlaskConical size={14} className="text-cyan-400" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={cn(
                'text-sm font-bold font-[\'Hanken_Grotesk\',_sans-serif]',
                isLocked ? 'text-white/30' : 'text-white/90'
              )}>
                {lab.title}
              </h3>
              <span className={cn('text-[9px] font-mono', DIFF_COLOR[lab.difficulty])}>
                {lab.difficulty}
              </span>
            </div>
            <p className={cn('text-[11px] mt-0.5 leading-snug', isLocked ? 'text-white/20' : 'text-white/45 font-[\'Inter\',_sans-serif]')}>
              {lab.description}
            </p>
          </div>

          <span className={cn('shrink-0 text-[9px] font-mono font-bold', accent.text)}>+{lab.xp} XP</span>
        </div>

        {/* Tools + duration */}
        {!isLocked && (
          <>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {lab.tools.map(t => (
                <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono bg-white/[0.04] border border-white/[0.07] text-white/45">
                  <Wrench size={8} />
                  {t}
                </span>
              ))}
              <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono text-white/30">
                <Clock size={8} />
                {lab.durationMin}m
              </span>
            </div>

            <motion.button
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={onStart}
              className={cn(
                'flex items-center gap-2 text-xs font-semibold font-[\'Hanken_Grotesk\',_sans-serif] transition-all',
                isCompleted ? cn(accent.text, 'opacity-70') : accent.text
              )}
            >
              <Zap size={12} />
              {isCompleted ? 'Redo Lab' : 'Start Lab'}
              <ChevronRight size={12} />
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
};
