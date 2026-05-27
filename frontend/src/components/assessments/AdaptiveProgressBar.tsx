'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AdaptiveProgressBarProps {
  current: number;
  total: number;
  label?: string;
  color?: 'violet' | 'cyan' | 'gradient';
  showLabel?: boolean;
  animated?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

const heightMap = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
};

const fillMap = {
  violet: 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]',
  cyan: 'bg-cyan-400 shadow-[0_0_8px_rgba(76,215,246,0.6)]',
  gradient:
    'bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_10px_rgba(192,193,255,0.5)]',
};

const AdaptiveProgressBar: React.FC<AdaptiveProgressBarProps> = ({
  current,
  total,
  label,
  color = 'gradient',
  showLabel = true,
  animated = true,
  height = 'md',
}) => {
  const pct = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;

  return (
    <div className="w-full space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">
            {label ?? `Q ${current} of ${total}`}
          </span>
          <span
            className={cn(
              'text-[10px] font-mono tracking-widest',
              color === 'cyan'
                ? 'text-cyan-400'
                : color === 'violet'
                ? 'text-violet-400'
                : 'text-violet-300'
            )}
          >
            {Math.round(pct)}%
          </span>
        </div>
      )}

      <div
        className={cn(
          'w-full bg-white/[0.05] rounded-full overflow-hidden',
          heightMap[height]
        )}
      >
        <motion.div
          initial={animated ? { width: 0 } : { width: `${pct}%` }}
          animate={{ width: `${pct}%` }}
          transition={animated ? { duration: 0.9, ease: 'easeOut' } : { duration: 0 }}
          className={cn('h-full rounded-full', fillMap[color])}
        />
      </div>
    </div>
  );
};

export default AdaptiveProgressBar;
