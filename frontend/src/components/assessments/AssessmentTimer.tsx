'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssessmentTimerProps {
  totalSeconds: number;
  onExpire?: () => void;
  variant?: 'compact' | 'full';
  warningThreshold?: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const AssessmentTimer: React.FC<AssessmentTimerProps> = ({
  totalSeconds,
  onExpire,
  variant = 'full',
  warningThreshold = 60,
}) => {
  const [remaining, setRemaining] = useState(totalSeconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpireRef.current?.();
      return;
    }
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [remaining === totalSeconds]); // re-run only on reset

  const isCritical = remaining < 30;
  const isWarning = remaining < warningThreshold;

  const textColor = isCritical
    ? 'text-red-400'
    : isWarning
    ? 'text-amber-400'
    : 'text-cyan-400';

  const glowColor = isCritical
    ? 'drop-shadow(0 0 6px rgba(239,68,68,0.7))'
    : isWarning
    ? 'drop-shadow(0 0 6px rgba(251,191,36,0.6))'
    : 'drop-shadow(0 0 6px rgba(76,215,246,0.5))';

  const arcStroke = isCritical ? '#f87171' : isWarning ? '#fbbf24' : '#818cf8';
  const containerBorderColor = isCritical
    ? 'border-red-400/20'
    : isWarning
    ? 'border-amber-400/20'
    : 'border-cyan-400/20';

  // SVG arc math
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const pct = totalSeconds > 0 ? remaining / totalSeconds : 0;
  const dashOffset = circumference * (1 - pct);

  if (variant === 'compact') {
    return (
      <motion.span
        animate={
          isCritical
            ? { opacity: [1, 0.4, 1] }
            : isWarning
            ? { opacity: [1, 0.6, 1] }
            : {}
        }
        transition={
          isCritical
            ? { duration: 0.6, repeat: Infinity }
            : isWarning
            ? { duration: 1.2, repeat: Infinity }
            : {}
        }
        className={cn(
          'flex items-center gap-1.5 font-mono tracking-widest text-sm',
          textColor
        )}
        style={{ filter: glowColor }}
      >
        <Clock size={13} />
        {formatTime(remaining)}
      </motion.span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'inline-flex items-center gap-4 px-5 py-3 rounded-[28px]',
        'bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border',
        containerBorderColor
      )}
    >
      {/* SVG circular arc */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          className="absolute inset-0 -rotate-90"
        >
          {/* Track */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="5"
          />
          {/* Arc */}
          <motion.circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={arcStroke}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.9, ease: 'linear' }}
            style={{ filter: `drop-shadow(0 0 4px ${arcStroke}90)` }}
          />
        </svg>

        {/* Center icon */}
        <Clock
          size={18}
          className={cn(textColor, 'relative z-10')}
          style={{ filter: glowColor }}
        />
      </div>

      {/* Time display */}
      <div className="flex flex-col">
        <span className="text-[9px] font-mono tracking-widest uppercase text-white/30 mb-0.5">
          Time Remaining
        </span>
        <motion.span
          animate={
            isCritical
              ? { opacity: [1, 0.3, 1] }
              : isWarning
              ? { opacity: [1, 0.6, 1] }
              : {}
          }
          transition={
            isCritical
              ? { duration: 0.5, repeat: Infinity }
              : isWarning
              ? { duration: 1.1, repeat: Infinity }
              : {}
          }
          className={cn(
            'text-2xl font-bold font-mono tracking-widest',
            textColor
          )}
          style={{ filter: glowColor }}
        >
          {formatTime(remaining)}
        </motion.span>
      </div>
    </motion.div>
  );
};

export default AssessmentTimer;
