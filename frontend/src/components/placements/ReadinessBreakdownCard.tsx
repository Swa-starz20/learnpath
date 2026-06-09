// ── ReadinessBreakdownCard ────────────────────────────────────────────────────
// Section 1: Detailed readiness decomposition using existing intelligence metrics.
// Renders one card per ReadinessCategory from placementBenchmarks config.

import { motion } from 'framer-motion';
import type { ReadinessCategory } from '@/data/placementBenchmarks';

interface ReadinessBreakdownCardProps {
  category: ReadinessCategory;
  score: number;        // 0-100 computed from intelligence state
  index: number;        // for stagger delay
}

const COLOR_MAP: Record<ReadinessCategory['color'], {
  text: string; bar: string; border: string; bg: string; glow: string;
}> = {
  violet:  { text: 'text-violet-400',  bar: 'bg-violet-500',  border: 'border-violet-500/20', bg: 'bg-violet-500/10',  glow: 'shadow-[0_0_10px_rgba(139,92,246,0.4)]' },
  cyan:    { text: 'text-cyan-400',    bar: 'bg-cyan-400',    border: 'border-cyan-400/20',   bg: 'bg-cyan-400/10',    glow: 'shadow-[0_0_10px_rgba(76,215,246,0.4)]' },
  fuchsia: { text: 'text-fuchsia-400', bar: 'bg-fuchsia-500', border: 'border-fuchsia-500/20', bg: 'bg-fuchsia-500/10', glow: 'shadow-[0_0_10px_rgba(217,70,239,0.3)]' },
  amber:   { text: 'text-amber-400',   bar: 'bg-amber-400',   border: 'border-amber-400/20',  bg: 'bg-amber-400/10',   glow: 'shadow-[0_0_10px_rgba(251,191,36,0.3)]' },
  emerald: { text: 'text-emerald-400', bar: 'bg-emerald-400', border: 'border-emerald-400/20', bg: 'bg-emerald-400/10', glow: 'shadow-[0_0_10px_rgba(52,211,153,0.3)]' },
};

export const ReadinessBreakdownCard = ({
  category,
  score,
  index,
}: ReadinessBreakdownCardProps) => {
  const c = COLOR_MAP[category.color];
  const clampedScore = Math.max(0, Math.min(100, score));

  const statusLabel =
    clampedScore >= 80 ? 'Strong' :
    clampedScore >= 60 ? 'Good' :
    clampedScore >= 40 ? 'Developing' : 'Needs Focus';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative group p-5 rounded-2xl border ${c.border} bg-[rgba(255,255,255,0.02)] backdrop-blur-xl hover:border-white/[0.12] transition-all duration-300 cursor-default overflow-hidden`}
    >
      {/* Ambient glow orb */}
      <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full ${c.bg} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500`} />

      {/* Header row */}
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{category.icon}</span>
            <p className={`text-[10px] font-mono tracking-widest uppercase ${c.text}`}>
              {category.label}
            </p>
          </div>
          <p className="text-[10px] text-white/30 font-['Inter',_sans-serif] max-w-[160px] leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Score badge */}
        <div className={`flex flex-col items-end`}>
          <span className={`text-2xl font-bold font-['Hanken_Grotesk',_sans-serif] ${c.text}`}>
            {clampedScore}
          </span>
          <span className={`text-[9px] font-mono tracking-widest uppercase ${c.text} opacity-60`}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10">
        <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${clampedScore}%` }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: index * 0.07 + 0.3 }}
            className={`h-full rounded-full ${c.bar} ${c.glow}`}
          />
        </div>
        {/* Weight indicator */}
        <div className="flex justify-between mt-1.5">
          <p className="text-[8px] font-mono text-white/20 tracking-widest">
            WEIGHT {Math.round(category.weight * 100)}%
          </p>
          <p className="text-[8px] font-mono text-white/20 tracking-widest">
            {clampedScore}/100
          </p>
        </div>
      </div>
    </motion.div>
  );
};
