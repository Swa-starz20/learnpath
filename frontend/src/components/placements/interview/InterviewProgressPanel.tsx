// ── InterviewProgressPanel ────────────────────────────────────────────────────
// Section 4: Simulated progress — completed simulations, pass probability,
// confidence trend, and readiness trend. Derived from existing intelligence metrics.

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BarChart3, CheckCircle2, Target } from 'lucide-react';
import type { InterviewType } from '@/data/interviews/interviewTracks';
import { INTERVIEW_TRACKS } from '@/data/interviews/interviewTracks';
import type { InterviewReadinessParams } from '@/data/interviews/interviewBenchmarks';
import {
  computeTrackReadiness,
  computePassProbability,
  deriveConfidenceTrend,
} from '@/data/interviews/interviewBenchmarks';

interface InterviewProgressPanelProps {
  params: InterviewReadinessParams;
  velocityTrend: 'improving' | 'stable' | 'declining';
  completedNodeCount: number;
  totalMilestones: number;
}

const TRACK_TYPES: InterviewType[] = ['technical', 'aptitude', 'hr', 'domain'];

const TrendWidget = ({ trend }: { trend: 'up' | 'flat' | 'down' }) => {
  const Icon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const cls  = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-white/30';
  const label= trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable';
  return (
    <div className={`flex items-center gap-1.5 ${cls}`}>
      <Icon size={13} />
      <span className="text-[10px] font-mono">{label}</span>
    </div>
  );
};

export const InterviewProgressPanel = ({
  params,
  velocityTrend,
  completedNodeCount,
  totalMilestones,
}: InterviewProgressPanelProps) => {
  // Confidence trend derived from velocity trend (existing intelligence)
  const confidenceTrend = deriveConfidenceTrend(velocityTrend, 0);

  // Simulated completed sessions: 1 per track if readiness >= 50, else 0
  const completedSessions = TRACK_TYPES.reduce((acc, t) => {
    const r = computeTrackReadiness(t, params);
    return acc + (r >= 50 ? 1 : 0);
  }, 0);

  // Overall pass probability at Intermediate difficulty
  const avgReadiness = Math.round(
    TRACK_TYPES.reduce((acc, t) => acc + computeTrackReadiness(t, params), 0) / TRACK_TYPES.length
  );
  const overallPassPct = computePassProbability(avgReadiness, 'Intermediate');
  const milestonePct   = totalMilestones > 0 ? Math.round((completedNodeCount / totalMilestones) * 100) : 0;

  return (
    <div className="rounded-[28px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-6">
      <div className="mb-6">
        <p className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mb-1">Section 4</p>
        <h3 className="text-lg font-bold text-white/85 font-['Hanken_Grotesk',_sans-serif]">Interview Progress</h3>
        <p className="text-[11px] text-white/30 mt-0.5 font-['Inter',_sans-serif]">
          Derived from readiness metrics, velocity, and roadmap completion
        </p>
      </div>

      {/* Top stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            icon: <CheckCircle2 size={16} />,
            label: 'Tracks Unlocked',
            value: `${completedSessions}/4`,
            color: 'text-emerald-300',
            glowColor: 'bg-emerald-400/10',
          },
          {
            icon: <Target size={16} />,
            label: 'Pass Probability',
            value: `${overallPassPct}%`,
            color: 'text-violet-300',
            glowColor: 'bg-violet-500/10',
          },
          {
            icon: <BarChart3 size={16} />,
            label: 'Milestone Progress',
            value: `${milestonePct}%`,
            color: 'text-cyan-300',
            glowColor: 'bg-cyan-400/10',
          },
          {
            icon: <TrendingUp size={16} />,
            label: 'Readiness Trend',
            value: velocityTrend === 'improving' ? '↑' : velocityTrend === 'declining' ? '↓' : '→',
            color: velocityTrend === 'improving' ? 'text-emerald-300' : velocityTrend === 'declining' ? 'text-red-300' : 'text-white/40',
            glowColor: 'bg-white/[0.03]',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`relative p-4 rounded-2xl border border-white/[0.06] ${stat.glowColor} overflow-hidden`}
          >
            <div className={`${stat.color} mb-2`}>{stat.icon}</div>
            <p className={`text-2xl font-bold font-['Hanken_Grotesk',_sans-serif] ${stat.color}`}>{stat.value}</p>
            <p className="text-[9px] font-mono tracking-widest text-white/30 uppercase mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Per-track readiness bars */}
      <div className="space-y-3 mb-6">
        <p className="text-[9px] font-mono tracking-widest text-white/25 uppercase">Track Readiness</p>
        {TRACK_TYPES.map((trackId, i) => {
          const track   = INTERVIEW_TRACKS.find(t => t.id === trackId)!;
          const score   = computeTrackReadiness(trackId, params);
          const barColor =
            track.color === 'violet'  ? 'bg-violet-500' :
            track.color === 'cyan'    ? 'bg-cyan-400' :
            track.color === 'amber'   ? 'bg-amber-400' : 'bg-fuchsia-500';

          return (
            <motion.div
              key={trackId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.07 + 0.3 }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{track.icon}</span>
                  <p className="text-[10px] font-mono text-white/40">{track.shortLabel}</p>
                </div>
                <p className="text-[10px] font-mono text-white/30">{score}%</p>
              </div>
              <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.07 + 0.4 }}
                  className={`h-full rounded-full ${barColor}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Trend summary */}
      <div className="flex items-center justify-between p-3 rounded-xl border border-white/[0.05] bg-white/[0.01]">
        <div>
          <p className="text-[9px] font-mono tracking-widest text-white/25 uppercase mb-1">Confidence Trend</p>
          <TrendWidget trend={confidenceTrend} />
        </div>
        <div className="text-right">
          <p className="text-[9px] font-mono tracking-widest text-white/25 uppercase mb-1">Velocity Trend</p>
          <TrendWidget trend={velocityTrend === 'improving' ? 'up' : velocityTrend === 'declining' ? 'down' : 'flat'} />
        </div>
      </div>
    </div>
  );
};
