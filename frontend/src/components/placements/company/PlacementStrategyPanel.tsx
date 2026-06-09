import { motion } from 'framer-motion';
import { Compass, Star, ShieldCheck, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPct } from '@/utils/formatters';

interface PlacementStrategyPanelProps {
  bestFitName: string;
  bestFitScore: number;
  stretchName: string;
  stretchScore: number;
  safeName: string;
  safeScore: number;
  immediateAction: string;
  actionRoute: string;
}

export const PlacementStrategyPanel = ({
  bestFitName,
  bestFitScore,
  stretchName,
  stretchScore,
  safeName,
  safeScore,
  immediateAction,
  actionRoute,
}: PlacementStrategyPanelProps) => {
  return (
    <div className="rounded-[28px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-6 h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/[0.03] blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="mb-6">
        <p className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mb-1">
          Placement Strategy
        </p>
        <h3 className="text-lg font-bold text-white/85 font-['Hanken_Grotesk',_sans-serif]">
          Recruiter Targeting Strategy
        </h3>
        <p className="text-[11px] text-white/35 mt-0.5 font-['Inter',_sans-serif]">
          Actionable routing strategy to guide your application priorities.
        </p>
      </div>

      <div className="space-y-4">
        {/* Best Fit */}
        <motion.div
          whileHover={{ x: 2 }}
          className="p-4 rounded-2xl bg-violet-500/[0.04] border border-violet-500/15 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-400">
              <Compass size={16} />
            </div>
            <div>
              <p className="text-[9px] font-mono text-violet-400 uppercase tracking-widest">
                Best Fit Company
              </p>
              <h4 className="text-sm font-bold text-white/85 font-['Hanken_Grotesk',_sans-serif]">
                {bestFitName}
              </h4>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-violet-300 font-mono">
              {formatPct(bestFitScore)}
            </p>
            <p className="text-[8px] font-mono text-white/20 uppercase">Match</p>
          </div>
        </motion.div>

        {/* Stretch Target */}
        <motion.div
          whileHover={{ x: 2 }}
          className="p-4 rounded-2xl bg-fuchsia-500/[0.03] border border-fuchsia-500/10 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400">
              <Star size={16} />
            </div>
            <div>
              <p className="text-[9px] font-mono text-fuchsia-400 uppercase tracking-widest">
                Stretch Target
              </p>
              <h4 className="text-sm font-bold text-white/85 font-['Hanken_Grotesk',_sans-serif]">
                {stretchName}
              </h4>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-fuchsia-300 font-mono">
              {formatPct(stretchScore)}
            </p>
            <p className="text-[8px] font-mono text-white/20 uppercase">Match</p>
          </div>
        </motion.div>

        {/* Safe Target */}
        <motion.div
          whileHover={{ x: 2 }}
          className="p-4 rounded-2xl bg-cyan-500/[0.03] border border-cyan-500/10 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">
                Safe Target
              </p>
              <h4 className="text-sm font-bold text-white/85 font-['Hanken_Grotesk',_sans-serif]">
                {safeName}
              </h4>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-cyan-300 font-mono">
              {formatPct(safeScore)}
            </p>
            <p className="text-[8px] font-mono text-white/20 uppercase">Match</p>
          </div>
        </motion.div>

        {/* Immediate Next Action CTA */}
        <div className="mt-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] flex flex-col justify-between gap-3">
          <div>
            <span className="text-[9px] font-mono text-white/25 uppercase tracking-widest block mb-1">
              Immediate Next Action
            </span>
            <p className="text-[12px] font-medium text-white/80 leading-relaxed">
              {immediateAction}
            </p>
          </div>
          <Link
            to={actionRoute}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white text-xs font-bold font-['Hanken_Grotesk',_sans-serif] tracking-wider hover:brightness-110 transition-all shadow-[0_0_16px_rgba(139,92,246,0.2)] flex items-center justify-center gap-1.5"
          >
            <Play size={11} fill="currentColor" />
            Execute Strategy
          </Link>
        </div>
      </div>
    </div>
  );
};
