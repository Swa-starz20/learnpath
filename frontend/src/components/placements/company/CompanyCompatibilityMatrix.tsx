import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatPct } from '@/utils/formatters';

interface CompatibilityMetric {
  label: string;
  userScore: number;
  benchmarkScore: number;
  color: 'violet' | 'cyan' | 'fuchsia' | 'amber' | 'emerald';
  glowColor: string;
}

interface CompanyCompatibilityMatrixProps {
  companyName: string;
  minAptitude: number;
  minTechnical: number;
  minCommunication: number;
  minPractical: number;
  minDomain: number;
  userAptitude: number;
  userTechnical: number;
  userCommunication: number;
  userPractical: number;
  userDomain: number;
}

export const CompanyCompatibilityMatrix = ({
  companyName,
  minAptitude,
  minTechnical,
  minCommunication,
  minPractical,
  minDomain,
  userAptitude,
  userTechnical,
  userCommunication,
  userPractical,
  userDomain,
}: CompanyCompatibilityMatrixProps) => {
  const metrics: CompatibilityMetric[] = [
    {
      label: 'Technical Readiness',
      userScore: userTechnical,
      benchmarkScore: minTechnical,
      color: 'violet',
      glowColor: 'shadow-[0_0_8px_rgba(167,139,250,0.5)]',
    },
    {
      label: 'Problem Solving / Aptitude',
      userScore: userAptitude,
      benchmarkScore: minAptitude,
      color: 'cyan',
      glowColor: 'shadow-[0_0_8px_rgba(76,215,246,0.5)]',
    },
    {
      label: 'Domain Expertise',
      userScore: userDomain,
      benchmarkScore: minDomain,
      color: 'fuchsia',
      glowColor: 'shadow-[0_0_8px_rgba(217,70,239,0.5)]',
    },
    {
      label: 'Communication Readiness',
      userScore: userCommunication,
      benchmarkScore: minCommunication,
      color: 'amber',
      glowColor: 'shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    },
    {
      label: 'Projects / Practical Exp.',
      userScore: userPractical,
      benchmarkScore: minPractical,
      color: 'emerald',
      glowColor: 'shadow-[0_0_8px_rgba(52,211,153,0.5)]',
    },
  ];

  const colorClasses = {
    violet: { bar: 'bg-violet-400', text: 'text-violet-400', border: 'border-violet-500/20' },
    cyan: { bar: 'bg-cyan-400', text: 'text-cyan-400', border: 'border-cyan-400/20' },
    fuchsia: { bar: 'bg-fuchsia-400', text: 'text-fuchsia-400', border: 'border-fuchsia-500/20' },
    amber: { bar: 'bg-amber-400', text: 'text-amber-400', border: 'border-amber-500/20' },
    emerald: { bar: 'bg-emerald-400', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  };

  return (
    <div className="rounded-[28px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-6">
      <div className="mb-6">
        <p className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mb-1">
          Compatibility Matrix
        </p>
        <h3 className="text-lg font-bold text-white/85 font-['Hanken_Grotesk',_sans-serif]">
          {companyName} Target vs Profile
        </h3>
        <p className="text-[11px] text-white/35 mt-0.5 font-['Inter',_sans-serif]">
          Compare your current engineering profile against this recruiter's specific minimum requirements.
        </p>
      </div>

      <div className="space-y-5">
        {metrics.map((m) => {
          const isMet = m.userScore >= m.benchmarkScore;
          const pct = Math.max(2, Math.min(100, m.userScore));
          const benchmarkPct = Math.max(2, Math.min(100, m.benchmarkScore));
          const diff = m.userScore - m.benchmarkScore;

          return (
            <div key={m.label} className="space-y-1.5">
              {/* Labels and difference info */}
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs font-semibold text-white/85 font-['Inter',_sans-serif]">
                    {m.label}
                  </span>
                  <span className={cn(
                    'text-[9px] font-mono ml-2.5 font-bold',
                    isMet ? 'text-emerald-400' : 'text-red-400'
                  )}>
                    {diff >= 0 ? `+${diff}%` : `${diff}%`}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="text-white/30 uppercase">Benchmark:</span>
                  <span className="text-white/60 font-semibold">{formatPct(m.benchmarkScore, false)}</span>
                  <span className="text-white/20">|</span>
                  <span className="text-white/30 uppercase">Actual:</span>
                  <span className={cn('font-bold', colorClasses[m.color].text)}>
                    {formatPct(m.userScore, false)}
                  </span>
                </div>
              </div>

              {/* Progress bar container */}
              <div className="relative h-2.5 w-full bg-white/[0.05] rounded-full overflow-visible border border-white/[0.04]">
                {/* User actual bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.0, ease: 'easeOut' as const }}
                  className={cn('h-full rounded-full relative', colorClasses[m.color].bar, m.glowColor)}
                />

                {/* Benchmark indicator flag */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-white z-10 border-l border-r border-black/50"
                  style={{ left: `${benchmarkPct}%` }}
                  title={`Target: ${m.benchmarkScore}%`}
                >
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/30 rounded px-1 py-0.2 text-[7px] font-mono text-white/60 tracking-wider">
                    TARGET
                  </div>
                </div>
              </div>

              {/* Status footer for this row */}
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
                  Target threshold comparisons
                </span>
                <div className="flex items-center gap-1">
                  {isMet ? (
                    <>
                      <CheckCircle2 size={10} className="text-emerald-400" />
                      <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
                        Requirement Met
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={10} className="text-red-400 animate-pulse" />
                      <span className="text-[9px] font-mono text-red-400 uppercase tracking-widest">
                        Gap Detected
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
