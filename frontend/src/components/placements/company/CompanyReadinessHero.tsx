import { motion } from 'framer-motion';
import {
  Building2, Sparkles, ShieldCheck, Zap, Brain
} from 'lucide-react';
import { formatPct } from '@/utils/formatters';

interface CompanyReadinessHeroProps {
  bestMatchName: string;
  bestMatchLogo: string;
  bestMatchScore: number;
  overallCompanyReadiness: number;
  interviewReadiness: number;
  placementReadiness: number;
  aiConfidence: number;
}

export const CompanyReadinessHero = ({
  bestMatchName,
  bestMatchLogo,
  bestMatchScore,
  overallCompanyReadiness,
  interviewReadiness,
  placementReadiness,
  aiConfidence,
}: CompanyReadinessHeroProps) => {
  const kpis = [
    {
      label: 'BEST MATCH',
      value: bestMatchName,
      sub: `${formatPct(bestMatchScore)} Match Score`,
      icon: <span className="text-xl">{bestMatchLogo}</span>,
      color: 'text-violet-400',
      glowColor: 'drop-shadow(0 0 8px rgba(167,139,250,0.5))',
      delay: 0.05,
    },
    {
      label: 'COMPANY READINESS',
      value: formatPct(overallCompanyReadiness),
      sub: 'Weighted Average',
      icon: <Building2 size={16} />,
      color: 'text-cyan-400',
      glowColor: 'drop-shadow(0 0 8px rgba(76,215,246,0.5))',
      delay: 0.1,
    },
    {
      label: 'INTERVIEW READINESS',
      value: formatPct(interviewReadiness),
      sub: 'Workspace Simulation',
      icon: <Zap size={16} />,
      color: 'text-fuchsia-400',
      glowColor: 'drop-shadow(0 0 8px rgba(217,70,239,0.5))',
      delay: 0.15,
    },
    {
      label: 'PLACEMENT READINESS',
      value: formatPct(placementReadiness),
      sub: 'Career Readiness Index',
      icon: <ShieldCheck size={16} />,
      color: 'text-amber-400',
      glowColor: 'drop-shadow(0 0 8px rgba(245,158,11,0.5))',
      delay: 0.20,
    },
    {
      label: 'AI CONFIDENCE',
      value: formatPct(aiConfidence),
      sub: 'Engine Certainty',
      icon: <Brain size={16} />,
      color: 'text-emerald-400',
      glowColor: 'drop-shadow(0 0 8px rgba(52,211,153,0.5))',
      delay: 0.25,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-6 mb-6">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/[0.04] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/[0.03] blur-[80px] rounded-full pointer-events-none" />

      {/* Main Title Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={14} className="text-violet-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-violet-400/80 uppercase">
              Phase 3 · Company Readiness
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white/95 font-['Hanken_Grotesk',_sans-serif]">
            Company Match Intelligence
          </h1>
          <p className="text-xs text-white/40 mt-1 font-['Inter',_sans-serif] max-w-xl">
            Evaluate preparedness, identify benchmark gaps, and review strategic next actions mapped to top software and engineering recruiters.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/[0.08] border border-cyan-500/20 self-start md:self-center">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(76,215,246,0.8)]"
          />
          <span className="text-[9px] font-mono text-cyan-300/80 tracking-widest">
            COMPANY TARGETS SYNCED
          </span>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: kpi.delay, ease: 'easeOut' as const }}
            whileHover={{ y: -3, scale: 1.01 }}
            className="rounded-2xl p-4 bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between group transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">
                {kpi.label}
              </span>
              <div className={`${kpi.color} opacity-70 group-hover:opacity-100 transition-opacity`} style={{ filter: kpi.glowColor }}>
                {kpi.icon}
              </div>
            </div>
            <div>
              <p className="text-lg font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] truncate leading-tight">
                {kpi.value}
              </p>
              <p className="text-[9px] font-mono text-white/25 mt-0.5 uppercase tracking-wide">
                {kpi.sub}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
