// ── MockInterviewCard ─────────────────────────────────────────────────────────
// Section 2: One card per mock session. Shows difficulty, readiness gate,
// duration, and AI confidence. No real interview engine — readiness workspace only.

import { motion } from 'framer-motion';
import { Clock, Lock, ChevronRight } from 'lucide-react';
import type { MockInterviewSession } from '@/data/interviews/interviewTracks';
import { computePassProbability } from '@/data/interviews/interviewBenchmarks';

interface MockInterviewCardProps {
  session: MockInterviewSession;
  userReadiness: number;      // overall readiness from intelligence state
  trackReadiness: number;     // track-specific readiness
  index: number;
  onSelect?: (sessionId: string) => void;
}

const DIFFICULTY_COLORS = {
  Foundational: { text: 'text-emerald-400', border: 'border-emerald-400/20', bg: 'bg-emerald-400/10' },
  Intermediate:  { text: 'text-cyan-400',    border: 'border-cyan-400/20',    bg: 'bg-cyan-400/10' },
  Advanced:      { text: 'text-violet-400',  border: 'border-violet-500/20',  bg: 'bg-violet-500/10' },
  Expert:        { text: 'text-fuchsia-400', border: 'border-fuchsia-500/20', bg: 'bg-fuchsia-500/10' },
};

export const MockInterviewCard = ({
  session,
  userReadiness,
  trackReadiness,
  index,
  onSelect,
}: MockInterviewCardProps) => {
  const isLocked   = userReadiness < session.minReadiness;
  const passPct    = computePassProbability(trackReadiness, session.difficulty);
  const dc         = DIFFICULTY_COLORS[session.difficulty];
  const aiConf     = Math.min(99, Math.round(passPct * 0.9 + trackReadiness * 0.1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
      className={`relative group p-5 rounded-2xl border transition-all duration-300 overflow-hidden ${
        isLocked
          ? 'border-white/[0.04] bg-white/[0.01] opacity-60'
          : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04] cursor-pointer'
      }`}
      onClick={() => !isLocked && onSelect?.(session.id)}
    >
      {/* Glow orb */}
      {!isLocked && (
        <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-violet-500/10 blur-2xl opacity-0 group-hover:opacity-60 transition-opacity" />
      )}

      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-md border text-[8px] font-mono tracking-widest uppercase ${dc.text} ${dc.border} ${dc.bg}`}>
              {session.difficulty}
            </span>
            {session.aiEvaluated && (
              <span className="px-2 py-0.5 rounded-md border border-violet-500/20 bg-violet-500/10 text-[8px] font-mono text-violet-400 tracking-widest">
                AI Evaluated
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-white/80 font-['Hanken_Grotesk',_sans-serif] mt-1">
            {session.label}
          </h4>
        </div>
        {isLocked ? (
          <Lock size={16} className="text-white/20 flex-shrink-0" />
        ) : (
          <ChevronRight size={16} className="text-white/25 flex-shrink-0 group-hover:text-violet-400 transition-colors" />
        )}
      </div>

      {/* Focus areas */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {session.focusAreas.map(area => (
          <span key={area} className="px-2 py-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[9px] font-mono text-white/35">
            {area}
          </span>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-[10px] font-mono text-white/30 mb-4">
        <div className="flex items-center gap-1">
          <Clock size={11} />
          <span>{session.durationMinutes} min</span>
        </div>
        <span>Pass probability: {isLocked ? '—' : `${passPct}%`}</span>
      </div>

      {/* AI Confidence bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <p className="text-[8px] font-mono text-white/20 tracking-widest uppercase">AI Confidence</p>
          <p className="text-[8px] font-mono text-white/20">{isLocked ? '—' : `${aiConf}%`}</p>
        </div>
        <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
          {!isLocked && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${aiConf}%` }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: index * 0.08 + 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
            />
          )}
        </div>
      </div>

      {isLocked && (
        <p className="text-[9px] font-mono text-white/20 mt-3 tracking-wide">
          Requires {session.minReadiness}% readiness to unlock
        </p>
      )}
    </motion.div>
  );
};
