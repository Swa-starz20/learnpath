// ── InterviewHero ─────────────────────────────────────────────────────────────
// Hero section for the Interview Intelligence Workspace.
// Six KPIs derived from existing intelligence state via benchmarks.

import { motion } from 'framer-motion';
import { Shield, Target, Brain, Zap, MessageSquare, Award } from 'lucide-react';
import type { InterviewType } from '@/data/interviews/interviewTracks';
import type { InterviewReadinessParams } from '@/data/interviews/interviewBenchmarks';
import {
  computeTrackReadiness,
  computeInterviewConfidence,
  getConfidenceBand,
} from '@/data/interviews/interviewBenchmarks';
import { formatPct } from '@/utils/formatters';

interface InterviewHeroProps {
  params: InterviewReadinessParams;
  recommendedTrack: InterviewType;
  domainLabel: string;
}

const KPI = ({
  icon, label, value, sub, color, glowColor, delay,
}: {
  icon: React.ReactNode; label: string; value: string; sub: string;
  color: string; glowColor: string; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    whileHover={{ y: -3 }}
    className="relative group p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] transition-all duration-300 cursor-default"
  >
    <div className={`absolute -top-2 -right-2 w-10 h-10 rounded-full ${glowColor} blur-xl opacity-50 group-hover:opacity-90 transition-opacity`} />
    <div className={`${color} mb-2`}>{icon}</div>
    <p className={`text-xl font-bold font-['Hanken_Grotesk',_sans-serif] ${color}`}>{value}</p>
    <p className="text-[10px] font-mono tracking-widest text-white/40 uppercase mt-0.5">{label}</p>
    <p className="text-[10px] text-white/25 mt-1 font-['Inter',_sans-serif]">{sub}</p>
  </motion.div>
);

const TRACK_LABELS: Record<InterviewType, string> = {
  technical: 'Technical Round',
  aptitude: 'Aptitude Test',
  hr: 'HR Discussion',
  domain: 'Domain Deep-Dive',
};

export const InterviewHero = ({ params, recommendedTrack, domainLabel }: InterviewHeroProps) => {
  const confidence = computeInterviewConfidence(params);
  const band = getConfidenceBand(confidence);
  const techReady = computeTrackReadiness('technical', params);
  const commReady = computeTrackReadiness('hr', params);
  const domainReady = computeTrackReadiness('domain', params);

  const kpis = [
    { icon: <Shield size={18} />, label: 'Interview Readiness', value: formatPct(confidence), sub: band.description, color: 'text-violet-300', glowColor: 'bg-violet-500/15', delay: 0 },
    { icon: <Award size={18} />, label: 'Confidence Score', value: `${band.label}`, sub: `${formatPct(confidence)} composite`, color: 'text-cyan-300', glowColor: 'bg-cyan-400/15', delay: 0.06 },
    { icon: <Brain size={18} />, label: 'Technical Readiness', value: formatPct(techReady), sub: 'Engineering depth', color: 'text-fuchsia-300', glowColor: 'bg-fuchsia-500/15', delay: 0.12 },
    { icon: <MessageSquare size={18} />, label: 'Communication', value: formatPct(commReady), sub: 'HR & behavioural', color: 'text-amber-300', glowColor: 'bg-amber-400/15', delay: 0.18 },
    { icon: <Target size={18} />, label: 'Domain Readiness', value: formatPct(domainReady), sub: domainLabel, color: 'text-emerald-300', glowColor: 'bg-emerald-400/15', delay: 0.24 },
    { icon: <Zap size={18} />, label: 'Recommended Track', value: TRACK_LABELS[recommendedTrack], sub: 'AI-selected for you', color: 'text-sky-300', glowColor: 'bg-sky-400/15', delay: 0.30 },
  ];

  const bandTextColor =
    band.color === 'emerald' ? 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10' :
    band.color === 'violet'  ? 'text-violet-300 border-violet-400/30 bg-violet-500/10' :
    band.color === 'cyan'    ? 'text-cyan-300 border-cyan-400/30 bg-cyan-400/10' :
    band.color === 'amber'   ? 'text-amber-300 border-amber-400/30 bg-amber-400/10' :
                               'text-red-300 border-red-400/30 bg-red-500/10';

  const dotColor =
    band.color === 'emerald' ? 'bg-emerald-400' :
    band.color === 'violet'  ? 'bg-violet-400' :
    band.color === 'cyan'    ? 'bg-cyan-400' :
    band.color === 'amber'   ? 'bg-amber-400' : 'bg-red-400';

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-8">
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-violet-600/[0.06] blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-cyan-500/[0.05] blur-[60px] pointer-events-none" />

      <div className="relative z-10 flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-mono tracking-[0.22em] text-white/30 uppercase mb-1">
            Phase 2 · Interview Intelligence
          </p>
          <h2 className="text-2xl font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] tracking-tight">
            Interview{' '}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Workspace
            </span>
          </h2>
          <p className="text-sm text-white/35 mt-1 font-['Inter',_sans-serif]">
            AI-evaluated readiness for {domainLabel} interviews
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${bandTextColor}`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${dotColor}`} />
          <span className="text-[10px] font-mono tracking-widest uppercase">{band.label}</span>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map(k => <KPI key={k.label} {...k} />)}
      </div>

      {/* Overall bar */}
      <div className="relative z-10 mt-6">
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-[9px] font-mono tracking-widest text-white/25 uppercase">Interview Confidence Index</p>
          <p className="text-[9px] font-mono text-white/25">{formatPct(confidence)}</p>
        </div>
        <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
          />
        </div>
      </div>
    </div>
  );
};
