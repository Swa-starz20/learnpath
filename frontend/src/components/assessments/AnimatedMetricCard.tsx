'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedMetricCardProps {
  label: string;
  value: number;
  unit?: string;
  subtitle?: string;
  color?: 'violet' | 'cyan' | 'fuchsia' | 'amber';
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  delay?: number;
}

const colorMap = {
  violet: {
    value: 'text-violet-300',
    orb: 'bg-violet-500/20',
    trend: 'border-violet-500/20',
  },
  cyan: {
    value: 'text-cyan-300',
    orb: 'bg-cyan-400/20',
    trend: 'border-cyan-400/20',
  },
  fuchsia: {
    value: 'text-fuchsia-300',
    orb: 'bg-fuchsia-500/20',
    trend: 'border-fuchsia-500/20',
  },
  amber: {
    value: 'text-amber-300',
    orb: 'bg-amber-400/20',
    trend: 'border-amber-400/20',
  },
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
        // ease out quad
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

const TrendIcon: React.FC<{ trend: 'up' | 'down' | 'neutral'; value?: string }> = ({
  trend,
  value,
}) => {
  if (trend === 'up') {
    return (
      <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-mono">
        <TrendingUp size={11} />
        {value}
      </span>
    );
  }
  if (trend === 'down') {
    return (
      <span className="flex items-center gap-1 text-red-400 text-[10px] font-mono">
        <TrendingDown size={11} />
        {value}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-white/30 text-[10px] font-mono">
      <Minus size={11} />
      {value}
    </span>
  );
};

const AnimatedMetricCard: React.FC<AnimatedMetricCardProps> = ({
  label,
  value,
  unit,
  subtitle,
  color = 'violet',
  icon,
  trend,
  trendValue,
  delay = 0,
}) => {
  const c = colorMap[color];
  const count = useAnimatedCounter(value, 1200, delay * 1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -3 }}
      className={cn(
        'relative rounded-2xl p-5 overflow-hidden',
        'bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/[0.08]',
        'transition-shadow duration-300'
      )}
    >
      {/* Ambient glow orb top-right */}
      <div
        className={cn(
          'absolute -top-6 -right-6 w-28 h-28 rounded-full blur-2xl pointer-events-none',
          c.orb
        )}
      />

      {/* Top row: label + icon */}
      <div className="flex items-start justify-between relative z-10">
        <span className="text-[10px] font-mono tracking-widest uppercase text-white/35">
          {label}
        </span>
        {icon && <span className={cn('opacity-60', c.value)}>{icon}</span>}
      </div>

      {/* Value */}
      <div className="mt-3 flex items-end gap-1 relative z-10">
        <span
          className={cn(
            'text-3xl font-bold font-["Hanken_Grotesk",_sans-serif] leading-none',
            c.value
          )}
        >
          {count}
        </span>
        {unit && (
          <span className="text-sm font-mono text-white/30 mb-0.5">{unit}</span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-1.5 text-xs text-white/40 font-['Inter',_sans-serif] relative z-10">
          {subtitle}
        </p>
      )}

      {/* Trend */}
      {trend && (
        <div
          className={cn(
            'mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-2 relative z-10'
          )}
        >
          <TrendIcon trend={trend} value={trendValue} />
          {trendValue && (
            <span className="text-[9px] font-mono text-white/25 tracking-wider">vs last period</span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AnimatedMetricCard;
