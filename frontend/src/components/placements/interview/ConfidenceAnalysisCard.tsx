// ── ConfidenceAnalysisCard ────────────────────────────────────────────────────
// Compact card showing confidence band, score, and trend for a single track.
// Used inside the evaluation panel grid.

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { InterviewType } from '@/data/interviews/interviewTracks';
import { INTERVIEW_TRACKS } from '@/data/interviews/interviewTracks';
import type { InterviewReadinessParams } from '@/data/interviews/interviewBenchmarks';
import {
  computeTrackReadiness,
  getConfidenceBand,
  computePassProbability,
} from '@/data/interviews/interviewBenchmarks';

interface ConfidenceAnalysisCardProps {
  trackId: InterviewType;
  params: InterviewReadinessParams;
  confidenceTrend: 'up' | 'flat' | 'down';
  index: number;
}

const BAND_RING: Record<string, string> = {
  emerald: 'stroke-emerald-400',
  violet:  'stroke-violet-400',
  cyan:    'stroke-cyan-400',
  amber:   'stroke-amber-400',
  red:     'stroke-red-400',
};
const BAND_TEXT: Record<string, string> = {
  emerald: 'text-emerald-400',
  violet:  'text-violet-400',
  cyan:    'text-cyan-400',
  amber:   'text-amber-400',
  red:     'text-red-400',
};

export const ConfidenceAnalysisCard = ({
  trackId, params, confidenceTrend, index,
}: ConfidenceAnalysisCardProps) => {
  const track    = INTERVIEW_TRACKS.find(t => t.id === trackId)!;
  const score    = computeTrackReadiness(trackId, params);
  const band     = getConfidenceBand(score);
  const passPct  = computePassProbability(score, 'Intermediate');

  // SVG circle arc
  const radius = 28;
  const circ   = 2 * Math.PI * radius;
  const dash   = circ * (score / 100);

  const TrendIcon =
    confidenceTrend === 'up'   ? TrendingUp :
    confidenceTrend === 'down' ? TrendingDown : Minus;
  const trendColor =
    confidenceTrend === 'up'   ? 'text-emerald-400' :
    confidenceTrend === 'down' ? 'text-red-400' : 'text-white/30';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -3 }}
      className="relative p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] transition-all duration-300 cursor-default overflow-hidden"
    >
      {/* SVG ring */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
            <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="4" stroke="rgba(255,255,255,0.05)" />
            <motion.circle
              cx="32" cy="32" r={radius}
              fill="none" strokeWidth="4"
              strokeLinecap="round"
              className={BAND_RING[band.color]}
              strokeDasharray={`${dash} ${circ}`}
              initial={{ strokeDasharray: `0 ${circ}` }}
              animate={{ strokeDasharray: `${dash} ${circ}` }}
              transition={{ duration: 1.0, ease: 'easeOut', delay: index * 0.08 + 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-bold font-mono ${BAND_TEXT[band.color]}`}>{score}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-mono tracking-widest text-white/30 uppercase mb-0.5">
            {track.shortLabel}
          </p>
          <p className="text-sm font-semibold text-white/80 font-['Hanken_Grotesk',_sans-serif]">
            {band.label}
          </p>
          <p className="text-[10px] text-white/25 font-['Inter',_sans-serif] mt-0.5">
            {band.description}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <TrendIcon size={11} className={trendColor} />
          <span className={trendColor}>
            {confidenceTrend === 'up' ? 'Improving' : confidenceTrend === 'down' ? 'Declining' : 'Stable'}
          </span>
        </div>
        <span className="text-white/25">
          Pass est: {passPct}%
        </span>
      </div>

      {/* Track evaluation areas */}
      <div className="flex flex-wrap gap-1 mt-3">
        {track.evaluationAreas.slice(0, 2).map(area => (
          <span key={area} className="px-1.5 py-0.5 rounded bg-white/[0.03] text-[8px] font-mono text-white/25">
            {area}
          </span>
        ))}
      </div>
    </motion.div>
  );
};
