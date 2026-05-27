import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Clock, Target, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RoadmapNode } from '@/data/roadmapConfigs';
import type { AccentColor } from '@/data/engineeringDomains';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';

interface AIPathInsightProps {
  activeNode: RoadmapNode | null;
  nextNode: RoadmapNode | null;
  accentColor: AccentColor;
  domainLabel: string;
}

const INSIGHT_MESSAGES: Record<string, { why: string; impact: string }> = {
  default: {
    why: 'This module is a critical dependency for advanced system-level thinking. Completing it unlocks the next milestone in your AI-optimized roadmap.',
    impact: 'Engineers who complete this stage are 3.2× more likely to clear senior-level interviews.',
  },
};

export const AIPathInsight = ({
  activeNode,
  nextNode,
  accentColor,
  domainLabel,
}: AIPathInsightProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[accentColor];
  const insight = INSIGHT_MESSAGES[activeNode?.id ?? ''] ?? INSIGHT_MESSAGES.default;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        'relative rounded-[28px] p-5 overflow-hidden',
        'bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/[0.08]'
      )}
    >
      {/* Ambient glow */}
      <div className={cn('absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-50', accent.bg)} />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', accent.bg, accent.border, 'border')}>
            <Sparkles size={13} className={accent.text} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">AI Path Insight</h3>
            <p className="text-[9px] font-mono tracking-widest text-white/30 uppercase">{domainLabel}</p>
          </div>
        </div>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={cn('w-2 h-2 rounded-full shadow-[0_0_8px]', accent.text)}
          style={{ backgroundColor: 'currentColor' }}
        />
      </div>

      {/* Current Node context */}
      {activeNode ? (
        <div className="relative z-10 space-y-3">
          {/* Currently active */}
          <div className={cn('p-3 rounded-xl', accent.bg, 'border', accent.border)}>
            <p className={cn('text-[9px] font-mono tracking-widest uppercase mb-1', accent.text)}>
              Now Learning
            </p>
            <p className="text-sm font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">
              {activeNode.title}
            </p>
            <p className="text-[11px] text-white/40 font-mono mt-0.5">{activeNode.subtitle}</p>
          </div>

          {/* Why this matters */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-1.5 mb-2">
              <Target size={10} className="text-white/30" />
              <p className="text-[9px] font-mono tracking-widest uppercase text-white/30">Why this matters</p>
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed font-['Inter',_sans-serif]">
              {insight.why}
            </p>
          </div>

          {/* Impact */}
          <div className="p-3 rounded-xl bg-violet-500/[0.05] border border-violet-500/10">
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingUp size={10} className="text-violet-400" />
              <p className="text-[9px] font-mono tracking-widest uppercase text-violet-400/70">AI Impact Score</p>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed font-['Inter',_sans-serif]">
              {insight.impact}
            </p>
          </div>

          {/* Estimated completion */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Clock size={10} className="text-white/25" />
              <span className="text-[10px] font-mono text-white/35">
                ~{activeNode.estimatedWeeks}w to complete
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap size={10} className={accent.text} />
              <span className={cn('text-[10px] font-mono', accent.text)}>
                +{activeNode.xpReward} XP
              </span>
            </div>
          </div>

          {/* Next node preview */}
          {nextNode && (
            <div className="pt-3 border-t border-white/[0.05]">
              <p className="text-[9px] font-mono tracking-widest uppercase text-white/20 mb-2">Up Next</p>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <ChevronRight size={12} className="text-white/20 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-white/50 font-['Hanken_Grotesk',_sans-serif] truncate">
                    {nextNode.title}
                  </p>
                  <p className="text-[9px] font-mono text-white/25">{nextNode.estimatedWeeks}w · +{nextNode.xpReward} XP</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative z-10 text-center py-6">
          <Sparkles size={24} className={cn('mx-auto mb-3 opacity-40', accent.text)} />
          <p className="text-sm text-white/40 font-['Inter',_sans-serif]">
            Select a node to see AI insights
          </p>
        </div>
      )}
    </motion.div>
  );
};
