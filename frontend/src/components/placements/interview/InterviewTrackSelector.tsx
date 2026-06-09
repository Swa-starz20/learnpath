// ── InterviewTrackSelector ────────────────────────────────────────────────────
// Section 1: Tab-style track selector — Technical | Aptitude | HR | Domain.
// Shows unlock status from readiness + per-track readiness scores.

import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { INTERVIEW_TRACKS, type InterviewType } from '@/data/interviews/interviewTracks';
import type { InterviewReadinessParams } from '@/data/interviews/interviewBenchmarks';
import { computeTrackReadiness } from '@/data/interviews/interviewBenchmarks';

interface InterviewTrackSelectorProps {
  selected: InterviewType;
  onChange: (t: InterviewType) => void;
  params: InterviewReadinessParams;
}

const COLOR_ACTIVE: Record<string, string> = {
  violet:  'border-violet-500/40 bg-violet-500/10 text-violet-300 shadow-[0_0_16px_rgba(139,92,246,0.15)]',
  cyan:    'border-cyan-400/40 bg-cyan-400/10 text-cyan-300 shadow-[0_0_16px_rgba(76,215,246,0.12)]',
  amber:   'border-amber-400/40 bg-amber-400/10 text-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.12)]',
  fuchsia: 'border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300 shadow-[0_0_16px_rgba(217,70,239,0.12)]',
};

const COLOR_DOT: Record<string, string> = {
  violet: 'bg-violet-400', cyan: 'bg-cyan-400', amber: 'bg-amber-400', fuchsia: 'bg-fuchsia-400',
};

const COLOR_BAR: Record<string, string> = {
  violet: 'bg-violet-500', cyan: 'bg-cyan-400', amber: 'bg-amber-400', fuchsia: 'bg-fuchsia-500',
};

export const InterviewTrackSelector = ({ selected, onChange, params }: InterviewTrackSelectorProps) => (
  <div className="rounded-[28px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-6">
    <div className="mb-5">
      <p className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mb-1">Section 1</p>
      <h3 className="text-lg font-bold text-white/85 font-['Hanken_Grotesk',_sans-serif]">Interview Tracks</h3>
      <p className="text-[11px] text-white/30 mt-0.5 font-['Inter',_sans-serif]">Select a track to view sessions and readiness analysis</p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {INTERVIEW_TRACKS.map((track, i) => {
        const readiness = computeTrackReadiness(track.id, params);
        const isLocked  = readiness < track.minReadiness;
        const isActive  = selected === track.id;

        return (
          <motion.button
            key={track.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            onClick={() => !isLocked && onChange(track.id)}
            disabled={isLocked}
            className={`relative p-4 rounded-2xl border text-left transition-all duration-300 overflow-hidden ${
              isLocked
                ? 'border-white/[0.04] bg-white/[0.01] opacity-50 cursor-not-allowed'
                : isActive
                ? COLOR_ACTIVE[track.color]
                : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04] cursor-pointer'
            }`}
          >
            {/* Active indicator dot */}
            {isActive && (
              <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full animate-pulse ${COLOR_DOT[track.color]}`} />
            )}

            {isLocked && (
              <div className="absolute top-2 right-2">
                <Lock size={10} className="text-white/20" />
              </div>
            )}

            <span className="text-2xl block mb-2">{track.icon}</span>
            <p className={`text-sm font-semibold font-['Hanken_Grotesk',_sans-serif] mb-0.5 ${
              isActive ? '' : 'text-white/65'
            }`}>
              {track.shortLabel}
            </p>
            <p className="text-[10px] text-white/30 font-['Inter',_sans-serif] line-clamp-2 mb-3">
              {track.description}
            </p>

            {/* Readiness bar */}
            <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${readiness}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.06 + 0.3 }}
                className={`h-full rounded-full ${isLocked ? 'bg-white/10' : COLOR_BAR[track.color]}`}
              />
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-[8px] font-mono text-white/20">
                {isLocked ? `Needs ${track.minReadiness}%` : 'Readiness'}
              </p>
              <p className="text-[8px] font-mono text-white/20">{readiness}%</p>
            </div>
          </motion.button>
        );
      })}
    </div>
  </div>
);
