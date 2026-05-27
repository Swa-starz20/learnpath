'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, BookOpen, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompatibilityCardProps {
  role: string;
  compatibility: number;
  personalityMatch: string;
  growthPotential: 'High' | 'Very High' | 'Exceptional';
  learningPath: string;
  aiConfidence: number;
  color: 'violet' | 'cyan' | 'fuchsia' | 'amber';
  rank?: number;
  delay?: number;
}

const colorMap = {
  violet: {
    ring: '#8b5cf6',
    ringGlow: 'rgba(139,92,246,0.5)',
    text: 'text-violet-300',
    badge: 'bg-violet-500/10 border-violet-500/25 text-violet-400',
    orb: 'bg-violet-500/15',
    progressFill: 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]',
    glowShadow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]',
  },
  cyan: {
    ring: '#22d3ee',
    ringGlow: 'rgba(34,211,238,0.5)',
    text: 'text-cyan-300',
    badge: 'bg-cyan-400/10 border-cyan-400/25 text-cyan-400',
    orb: 'bg-cyan-400/15',
    progressFill: 'bg-cyan-400 shadow-[0_0_8px_rgba(76,215,246,0.6)]',
    glowShadow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]',
  },
  fuchsia: {
    ring: '#d946ef',
    ringGlow: 'rgba(217,70,239,0.5)',
    text: 'text-fuchsia-300',
    badge: 'bg-fuchsia-500/10 border-fuchsia-500/25 text-fuchsia-400',
    orb: 'bg-fuchsia-500/15',
    progressFill: 'bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.6)]',
    glowShadow: 'hover:shadow-[0_0_30px_rgba(217,70,239,0.2)]',
  },
  amber: {
    ring: '#f59e0b',
    ringGlow: 'rgba(245,158,11,0.5)',
    text: 'text-amber-300',
    badge: 'bg-amber-400/10 border-amber-400/25 text-amber-400',
    orb: 'bg-amber-400/15',
    progressFill: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
    glowShadow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]',
  },
};

const growthColors: Record<string, string> = {
  High: 'text-emerald-400',
  'Very High': 'text-cyan-400',
  Exceptional: 'text-violet-400',
};

function useAnimatedCounter(target: number, duration = 1200, delay = 0) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let startTime: number | null = null;
    const delayId = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - (1 - progress) * (1 - progress);
        setCount(Math.floor(eased * target));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          setCount(target);
        }
      };
      rafRef.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(delayId);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay]);

  return count;
}

const CompatibilityCard: React.FC<CompatibilityCardProps> = ({
  role,
  compatibility,
  personalityMatch,
  growthPotential,
  learningPath,
  aiConfidence,
  color,
  rank,
  delay = 0,
}) => {
  const c = colorMap[color];
  const compatCount = useAnimatedCounter(compatibility, 1200, delay * 1000);
  const confCount = useAnimatedCounter(aiConfidence, 1100, delay * 1000 + 200);

  // SVG ring math
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - compatibility / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        'relative rounded-2xl p-5 overflow-hidden',
        'bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/[0.08]',
        'transition-all duration-300',
        c.glowShadow
      )}
    >
      {/* Ambient glow orb */}
      <div
        className={cn(
          'absolute -top-8 -right-8 w-36 h-36 rounded-full blur-3xl pointer-events-none',
          c.orb
        )}
      />

      {/* Top row: rank badge + role */}
      <div className="flex items-start gap-3 relative z-10">
        {rank !== undefined && (
          <span
            className={cn(
              'shrink-0 w-7 h-7 rounded-full flex items-center justify-center',
              'border text-[11px] font-bold font-mono',
              c.badge
            )}
          >
            #{rank}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white/90 font-bold text-base leading-snug font-['Hanken_Grotesk',_sans-serif] truncate">
            {role}
          </h3>
          <span className="flex items-center gap-1 mt-0.5 text-[9px] font-mono tracking-widest uppercase text-white/30">
            <Sparkles size={8} className="text-violet-400" />
            AI Matched
          </span>
        </div>
      </div>

      {/* Compatibility ring + value */}
      <div className="mt-4 flex items-center gap-5 relative z-10">
        {/* SVG ring */}
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0 -rotate-90">
            {/* Track */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
            />
            {/* Fill arc */}
            <motion.circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke={c.ring}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.2, ease: 'easeOut', delay }}
              style={{ filter: `drop-shadow(0 0 6px ${c.ringGlow})` }}
            />
          </svg>
          {/* Center value */}
          <div className="relative z-10 flex flex-col items-center">
            <span className={cn('text-xl font-bold font-mono leading-none', c.text)}>
              {compatCount}
            </span>
            <span className="text-[9px] font-mono text-white/30">%</span>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex-1 space-y-2.5 min-w-0">
          <div className="flex items-start gap-2">
            <Brain size={11} className="text-white/30 mt-0.5 shrink-0" />
            <div>
              <p className="text-[9px] font-mono tracking-widest uppercase text-white/25 mb-0.5">
                Personality
              </p>
              <p className="text-[11px] font-mono text-white/70 leading-snug">{personalityMatch}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <TrendingUp size={11} className="text-white/30 mt-0.5 shrink-0" />
            <div>
              <p className="text-[9px] font-mono tracking-widest uppercase text-white/25 mb-0.5">
                Growth
              </p>
              <p className={cn('text-[11px] font-bold font-mono', growthColors[growthPotential])}>
                {growthPotential}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <BookOpen size={11} className="text-white/30 mt-0.5 shrink-0" />
            <div>
              <p className="text-[9px] font-mono tracking-widest uppercase text-white/25 mb-0.5">
                Path
              </p>
              <p className="text-[11px] font-mono text-white/60 leading-snug truncate max-w-[140px]">
                {learningPath}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Confidence bar */}
      <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-1.5 relative z-10">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest uppercase text-white/30">
            <Award size={9} className="text-violet-400" />
            AI Confidence
          </span>
          <span className="text-[10px] font-mono text-violet-400">{confCount}%</span>
        </div>
        <div className="h-1 w-full bg-white/[0.05] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${aiConfidence}%` }}
            transition={{ duration: 1.1, ease: 'easeOut', delay: delay + 0.2 }}
            className={cn('h-full rounded-full', c.progressFill)}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CompatibilityCard;
