import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { CompanyProfile } from '@/data/company/companyProfiles';
import { formatPct } from '@/utils/formatters';

interface CompanyMatchCardProps {
  company: CompanyProfile;
  matchScore: number;
  readinessScore: number;
  confidenceScore: number;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

export const CompanyMatchCard = ({
  company,
  matchScore,
  readinessScore,
  confidenceScore,
  isSelected,
  onSelect,
  index,
}: CompanyMatchCardProps) => {
  const isSoftware = company.category === 'Software / IT';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: 'easeOut' as const }}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onSelect}
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 border cursor-pointer transition-all duration-300 group',
        isSelected
          ? 'bg-[rgba(139,92,246,0.08)] border-violet-500/40 shadow-[0_0_24px_rgba(139,92,246,0.15)]'
          : 'bg-[rgba(255,255,255,0.02)] border-white/[0.07] hover:border-white/[0.15] hover:bg-white/[0.03]'
      )}
    >
      {/* Background glow when selected */}
      {isSelected && (
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Top Header Row */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
            {company.logo}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] leading-tight">
              {company.name}
            </h3>
            <span className={cn(
              'text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full mt-1 inline-block',
              isSoftware
                ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/20'
                : 'bg-fuchsia-400/10 text-fuchsia-300 border border-fuchsia-400/20'
            )}>
              {company.category}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <Sparkles size={10} className="text-violet-400" />
            <span className="text-xs font-bold font-mono text-violet-300">
              {formatPct(matchScore)}
            </span>
          </div>
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest block mt-0.5">
            MATCH
          </span>
        </div>
      </div>

      <p className="text-[11px] text-white/40 font-['Inter',_sans-serif] line-clamp-2 leading-relaxed mb-4">
        {company.description}
      </p>

      {/* Metrics Section */}
      <div className="grid grid-cols-2 gap-3 mb-4 pt-3 border-t border-white/[0.05]">
        <div className="p-2.5 rounded-xl bg-white/[0.01] border border-white/[0.04]">
          <span className="text-[8px] font-mono text-white/25 uppercase tracking-wider block">
            Readiness
          </span>
          <p className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
            {formatPct(readinessScore)}
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-white/[0.01] border border-white/[0.04]">
          <span className="text-[8px] font-mono text-white/25 uppercase tracking-wider block">
            Confidence
          </span>
          <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
            {formatPct(confidenceScore)}
          </p>
        </div>
      </div>

      {/* Bottom Action bar */}
      <div className="flex items-center justify-between mt-1 text-[9px] font-mono text-white/30 uppercase tracking-widest">
        <span className="text-white/20">
          {company.salaryRange}
        </span>
        <div className={cn(
          'flex items-center gap-1 group-hover:text-white transition-colors',
          isSelected ? 'text-violet-300' : 'text-white/30'
        )}>
          {isSelected ? 'Selected' : 'Analyze Gaps'}
          <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};
