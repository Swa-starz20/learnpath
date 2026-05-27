'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, CheckCircle2, PlayCircle, Circle, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssessmentCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'not_started' | 'in_progress' | 'completed';
  progress?: number;
  icon: React.ReactNode;
  color: 'violet' | 'cyan' | 'fuchsia' | 'amber';
  onStart: () => void;
}

const colorMap = {
  violet: {
    banner: 'from-violet-900/60 via-indigo-900/40 to-slate-900/60',
    glow: 'bg-violet-500/20',
    glowShadow: 'shadow-[0_0_60px_rgba(139,92,246,0.25)]',
    border: 'border-violet-500/25',
    accent: 'text-violet-400',
    button: 'bg-violet-500/20 hover:bg-violet-500/30 border-violet-500/30 text-violet-300 shadow-[0_0_16px_rgba(139,92,246,0.3)]',
    progress: 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]',
    orb: 'bg-violet-500/15',
  },
  cyan: {
    banner: 'from-cyan-900/60 via-teal-900/40 to-slate-900/60',
    glow: 'bg-cyan-400/20',
    glowShadow: 'shadow-[0_0_60px_rgba(76,215,246,0.2)]',
    border: 'border-cyan-400/25',
    accent: 'text-cyan-400',
    button: 'bg-cyan-400/10 hover:bg-cyan-400/20 border-cyan-400/30 text-cyan-300 shadow-[0_0_16px_rgba(76,215,246,0.25)]',
    progress: 'bg-cyan-400 shadow-[0_0_8px_rgba(76,215,246,0.6)]',
    orb: 'bg-cyan-400/15',
  },
  fuchsia: {
    banner: 'from-fuchsia-900/60 via-purple-900/40 to-slate-900/60',
    glow: 'bg-fuchsia-500/20',
    glowShadow: 'shadow-[0_0_60px_rgba(217,70,239,0.2)]',
    border: 'border-fuchsia-500/25',
    accent: 'text-fuchsia-400',
    button: 'bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border-fuchsia-500/30 text-fuchsia-300 shadow-[0_0_16px_rgba(217,70,239,0.25)]',
    progress: 'bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.6)]',
    orb: 'bg-fuchsia-500/15',
  },
  amber: {
    banner: 'from-amber-900/60 via-orange-900/40 to-slate-900/60',
    glow: 'bg-amber-400/20',
    glowShadow: 'shadow-[0_0_60px_rgba(251,191,36,0.2)]',
    border: 'border-amber-400/25',
    accent: 'text-amber-400',
    button: 'bg-amber-400/10 hover:bg-amber-400/20 border-amber-400/30 text-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.25)]',
    progress: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
    orb: 'bg-amber-400/15',
  },
};

const difficultyColor: Record<string, string> = {
  Beginner: 'text-emerald-400',
  Intermediate: 'text-amber-400',
  Advanced: 'text-red-400',
};

const StatusBadge: React.FC<{ status: AssessmentCardProps['status'] }> = ({ status }) => {
  if (status === 'completed') {
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/25 text-cyan-400 text-[10px] font-mono tracking-widest uppercase">
        <CheckCircle2 size={10} />
        Completed
      </span>
    );
  }
  if (status === 'in_progress') {
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-[10px] font-mono tracking-widest uppercase">
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          <PlayCircle size={10} />
        </motion.span>
        In Progress
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/40 text-[10px] font-mono tracking-widest uppercase">
      <Circle size={10} />
      Not Started
    </span>
  );
};

const AssessmentCard: React.FC<AssessmentCardProps> = ({
  title,
  description,
  category,
  duration,
  difficulty,
  status,
  progress = 0,
  icon,
  color,
  onStart,
}) => {
  const c = colorMap[color];

  const ctaLabel =
    status === 'completed' ? 'Review' : status === 'in_progress' ? 'Continue' : 'Start Assessment';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        'relative rounded-[28px] overflow-hidden',
        'bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/[0.08]',
        'transition-shadow duration-300',
        c.glowShadow
      )}
    >
      {/* Ambient glow orb top-right */}
      <div
        className={cn(
          'absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl pointer-events-none',
          c.orb
        )}
      />

      {/* Colored gradient banner */}
      <div className={cn('relative h-28 bg-gradient-to-br', c.banner)}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(11,19,38,0.6)]" />

        {/* Category chip */}
        <div className="absolute top-4 left-4">
          <span className={cn('text-[9px] font-mono tracking-widest uppercase', c.accent)}>
            {category}
          </span>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 right-4">
          <StatusBadge status={status} />
        </div>

        {/* Icon */}
        <div className="absolute bottom-4 left-5 w-10 h-10 flex items-center justify-center">
          <span className={cn('text-2xl', c.accent)}>{icon}</span>
        </div>

        {/* AI Powered chip */}
        <div className="absolute bottom-4 right-4">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-[9px] font-mono tracking-widest uppercase">
            <Sparkles size={8} />
            AI Powered
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <h3
          className="text-white/90 font-bold text-lg leading-snug font-['Hanken_Grotesk',_sans-serif]"
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-white/50 text-sm leading-relaxed line-clamp-2">{description}</p>

        {/* Metadata row */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-white/40 uppercase">
            <Clock size={11} className="text-white/30" />
            {duration}
          </span>
          <span className="w-px h-3 bg-white/10" />
          <span className={cn('flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase', difficultyColor[difficulty])}>
            <Zap size={11} />
            {difficulty}
          </span>
        </div>

        {/* Progress bar (in_progress only) */}
        {status === 'in_progress' && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">Progress</span>
              <span className="text-[9px] font-mono tracking-widest text-violet-400">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className={cn('h-full rounded-full', c.progress)}
              />
            </div>
          </div>
        )}

        {/* CTA Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border',
            'text-sm font-semibold font-["Hanken_Grotesk",_sans-serif]',
            'transition-all duration-200',
            c.button
          )}
        >
          {ctaLabel}
          <ChevronRight size={15} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AssessmentCard;
