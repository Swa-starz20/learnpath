// ── CareerReadinessHero ───────────────────────────────────────────────────────
// Hero section for the Placement Intelligence Foundation.
// Consumes ONLY existing intelligence selectors — no duplicate calculations.

import { motion } from 'framer-motion';
import {
  ShieldCheck, Zap, Brain, Target, TrendingUp, Award,
} from 'lucide-react';
import type { UserIntelligenceState } from '@/intelligence/userIntelligenceState';
import {
  getRoadmapReadiness,
  getMasteryScore,
  getVelocityTrend,
  getAdaptiveBehaviorPattern,
} from '@/intelligence/intelligenceSelectors';
import {
  getBenchmarkBand,
  computeInterviewReadiness,
} from '@/data/placementBenchmarks';
import { formatPct } from '@/utils/formatters';

interface HeroKPI {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
  delay: number;
}

interface CareerReadinessHeroProps {
  intelligenceState: UserIntelligenceState | null;
  placementReadiness: number;
}

export const CareerReadinessHero = ({
  intelligenceState,
  placementReadiness,
}: CareerReadinessHeroProps) => {
  // ── Derive values from existing selectors ──────────────────────────────────
  const domainReadiness  = intelligenceState ? getRoadmapReadiness(intelligenceState) : 0;
  const masteryScore     = intelligenceState ? getMasteryScore(intelligenceState) : 0;
  const velocityTrend    = intelligenceState ? getVelocityTrend(intelligenceState) : 'stable';
  const behaviorPattern  = intelligenceState ? getAdaptiveBehaviorPattern(intelligenceState) : 'highlyEngaged';
  const velocityOverall  = intelligenceState?.learningVelocity.velocity.overall ?? 0;
  const technicalReady   = intelligenceState?.readiness.technicalReadiness ?? 0;
  const assessmentScore  = intelligenceState?.assessments.overallReadiness ?? 0;
  const careerReadiness  = intelligenceState?.readiness.careerReadiness ?? 0;

  const interviewReadiness = computeInterviewReadiness(technicalReady, masteryScore, assessmentScore);
  const band = getBenchmarkBand(placementReadiness);

  // ── Velocity label ────────────────────────────────────────────────────────
  const velocityLabel =
    velocityTrend === 'improving' ? '↑ Improving' :
    velocityTrend === 'declining' ? '↓ Declining' : '→ Stable';

  // ── Behavior label ────────────────────────────────────────────────────────
  const behaviorLabel: Record<typeof behaviorPattern, string> = {
    accelerating:  'High',
    highlyEngaged: 'Strong',
    plateauing:    'Moderate',
    inconsistent:  'Low',
    struggling:    'Low',
  };

  const kpis: HeroKPI[] = [
    {
      label: 'Placement Readiness',
      value: formatPct(placementReadiness),
      sub: band.description,
      icon: <ShieldCheck size={18} />,
      color: 'text-violet-300',
      glowColor: 'bg-violet-500/15',
      delay: 0,
    },
    {
      label: 'Interview Readiness',
      value: formatPct(interviewReadiness),
      sub: interviewReadiness >= 75 ? 'Ready for interviews' : 'Needs improvement',
      icon: <Target size={18} />,
      color: 'text-cyan-300',
      glowColor: 'bg-cyan-400/15',
      delay: 0.06,
    },
    {
      label: 'Domain Readiness',
      value: formatPct(domainReadiness),
      sub: 'Roadmap + Assessments',
      icon: <Brain size={18} />,
      color: 'text-fuchsia-300',
      glowColor: 'bg-fuchsia-500/15',
      delay: 0.12,
    },
    {
      label: 'AI Confidence',
      value: formatPct(masteryScore),
      sub: 'Skill mastery index',
      icon: <Award size={18} />,
      color: 'text-amber-300',
      glowColor: 'bg-amber-400/15',
      delay: 0.18,
    },
    {
      label: 'Learning Velocity',
      value: formatPct(velocityOverall),
      sub: velocityLabel,
      icon: <Zap size={18} />,
      color: 'text-emerald-300',
      glowColor: 'bg-emerald-400/15',
      delay: 0.24,
    },
    {
      label: 'Career Readiness',
      value: formatPct(careerReadiness),
      sub: `AI Mode: ${behaviorLabel[behaviorPattern]}`,
      icon: <TrendingUp size={18} />,
      color: 'text-sky-300',
      glowColor: 'bg-sky-400/15',
      delay: 0.30,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-8">
      {/* Atmospheric blobs */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-violet-600/[0.07] blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-cyan-500/[0.06] blur-[60px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-mono tracking-[0.22em] text-white/30 uppercase mb-1">
            AI Career Readiness Command Center
          </p>
          <h2 className="text-2xl font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] tracking-tight">
            Placement{' '}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Intelligence
            </span>
          </h2>
          <p className="text-sm text-white/35 mt-1 font-['Inter',_sans-serif]">
            Real-time readiness across all engineering domains
          </p>
        </div>

        {/* Overall band badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
          band.color === 'emerald' ? 'border-emerald-400/30 bg-emerald-400/10' :
          band.color === 'violet'  ? 'border-violet-400/30 bg-violet-500/10' :
          band.color === 'cyan'    ? 'border-cyan-400/30 bg-cyan-400/10' :
          band.color === 'amber'   ? 'border-amber-400/30 bg-amber-400/10' :
                                     'border-red-400/30 bg-red-500/10'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            band.color === 'emerald' ? 'bg-emerald-400' :
            band.color === 'violet'  ? 'bg-violet-400' :
            band.color === 'cyan'    ? 'bg-cyan-400' :
            band.color === 'amber'   ? 'bg-amber-400' : 'bg-red-400'
          }`} />
          <span className={`text-[10px] font-mono tracking-widest uppercase ${
            band.color === 'emerald' ? 'text-emerald-300' :
            band.color === 'violet'  ? 'text-violet-300' :
            band.color === 'cyan'    ? 'text-cyan-300' :
            band.color === 'amber'   ? 'text-amber-300' : 'text-red-300'
          }`}>
            {band.label}
          </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: kpi.delay, ease: 'easeOut' }}
            whileHover={{ y: -3 }}
            className="relative group p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] transition-all duration-300 cursor-default"
          >
            {/* Glow orb */}
            <div className={`absolute -top-2 -right-2 w-10 h-10 rounded-full ${kpi.glowColor} blur-xl opacity-60 group-hover:opacity-100 transition-opacity`} />

            <div className={`${kpi.color} mb-2`}>{kpi.icon}</div>
            <p className={`text-xl font-bold font-['Hanken_Grotesk',_sans-serif] ${kpi.color}`}>
              {kpi.value}
            </p>
            <p className="text-[10px] font-mono tracking-widest text-white/40 uppercase mt-0.5">
              {kpi.label}
            </p>
            <p className="text-[10px] text-white/25 mt-1 font-['Inter',_sans-serif]">
              {kpi.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Thin bottom bar showing placement readiness as a progress line */}
      <div className="relative z-10 mt-6">
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-[9px] font-mono tracking-widest text-white/25 uppercase">
            Overall Placement Readiness
          </p>
          <p className="text-[9px] font-mono text-white/25">{formatPct(placementReadiness)}</p>
        </div>
        <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${placementReadiness}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
          />
        </div>
      </div>
    </div>
  );
};
