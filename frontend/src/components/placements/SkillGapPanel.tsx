// ── SkillGapPanel ─────────────────────────────────────────────────────────────
// Section 3: Skill gap analysis consuming existing intelligence outputs only.
// Reads from state.skills.allNodes — no separate analysis logic.

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, TrendingUp, Target } from 'lucide-react';
import type { SkillNode } from '@/types/skill';

interface SkillGapPanelProps {
  allSkillNodes: SkillNode[];
  nextSkillIds: string[];
}

interface GapSection {
  title: string;
  sub: string;
  icon: React.ReactNode;
  skills: SkillNode[];
  accent: string;
  badgeColor: string;
  emptyMessage: string;
}

const SkillChip = ({
  skill,
  accent,
  index,
}: {
  skill: SkillNode;
  accent: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay: index * 0.04 }}
    className={`flex items-center justify-between px-3 py-2 rounded-xl border ${accent} bg-white/[0.02] group hover:bg-white/[0.04] transition-all`}
  >
    <span className="text-[11px] text-white/65 font-['Inter',_sans-serif] truncate mr-2">
      {skill.label}
    </span>
    <span className="text-[9px] font-mono text-white/30 flex-shrink-0">
      {skill.confidence}%
    </span>
  </motion.div>
);

export const SkillGapPanel = ({ allSkillNodes, nextSkillIds }: SkillGapPanelProps) => {
  const criticalGaps   = allSkillNodes.filter(s => s.gap === 'Critical');
  const moderateGaps   = allSkillNodes.filter(s => s.gap === 'Moderate');
  const strengths      = allSkillNodes.filter(s => s.gap === 'None' && s.confidence >= 75);
  const recommended    = allSkillNodes.filter(s => nextSkillIds.includes(s.id));

  const sections: GapSection[] = [
    {
      title: 'Critical Gaps',
      sub: 'Blocking placement readiness',
      icon: <AlertTriangle size={15} />,
      skills: criticalGaps.slice(0, 6),
      accent: 'border-red-400/20',
      badgeColor: 'bg-red-500/10 text-red-400 border-red-400/20',
      emptyMessage: 'No critical gaps detected ✓',
    },
    {
      title: 'Moderate Gaps',
      sub: 'Reducing compatibility scores',
      icon: <AlertTriangle size={15} />,
      skills: moderateGaps.slice(0, 6),
      accent: 'border-amber-400/20',
      badgeColor: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
      emptyMessage: 'No moderate gaps ✓',
    },
    {
      title: 'Strength Areas',
      sub: 'Boosting your profile',
      icon: <CheckCircle size={15} />,
      skills: strengths.slice(0, 6),
      accent: 'border-emerald-400/20',
      badgeColor: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
      emptyMessage: 'Complete assessments to surface strengths',
    },
    {
      title: 'Recommended Focus',
      sub: 'Next skills to unlock',
      icon: <Target size={15} />,
      skills: recommended.slice(0, 6),
      accent: 'border-violet-400/20',
      badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      emptyMessage: 'Complete roadmap nodes to get recommendations',
    },
  ];

  const totalGaps   = criticalGaps.length + moderateGaps.length;
  const gapReduction = totalGaps === 0 ? 100 : Math.round((strengths.length / (allSkillNodes.length || 1)) * 100);

  return (
    <div className="rounded-[28px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mb-1">
            Skill Gap Analysis
          </p>
          <h3 className="text-lg font-bold text-white/85 font-['Hanken_Grotesk',_sans-serif]">
            Profile Gaps{' '}
            <span className="text-sm font-normal text-white/35">
              & Strengths
            </span>
          </h3>
          <p className="text-[11px] text-white/30 mt-0.5 font-['Inter',_sans-serif]">
            Derived from assessments, roadmap progress, and adaptive intelligence
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-white/20" />
          <span className="text-[10px] font-mono text-white/25">
            {gapReduction}% strength ratio
          </span>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-3 py-1 rounded-full border border-red-400/20 bg-red-500/10 text-[9px] font-mono text-red-400 tracking-widest">
          {criticalGaps.length} CRITICAL
        </span>
        <span className="px-3 py-1 rounded-full border border-amber-400/20 bg-amber-400/10 text-[9px] font-mono text-amber-400 tracking-widest">
          {moderateGaps.length} MODERATE
        </span>
        <span className="px-3 py-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 text-[9px] font-mono text-emerald-400 tracking-widest">
          {strengths.length} STRONG
        </span>
      </div>

      {/* Four-column skill grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`${
                section.title === 'Critical Gaps'    ? 'text-red-400' :
                section.title === 'Moderate Gaps'   ? 'text-amber-400' :
                section.title === 'Strength Areas'  ? 'text-emerald-400' : 'text-violet-400'
              }`}>
                {section.icon}
              </span>
              <div>
                <p className="text-[11px] font-semibold text-white/70 font-['Hanken_Grotesk',_sans-serif]">
                  {section.title}
                </p>
                <p className="text-[9px] text-white/25 font-mono">{section.sub}</p>
              </div>
              <span className={`ml-auto px-2 py-0.5 rounded-full border text-[8px] font-mono tracking-widest ${section.badgeColor}`}>
                {section.skills.length}
              </span>
            </div>

            {section.skills.length === 0 ? (
              <p className="text-[10px] text-white/20 font-mono italic pl-1">
                {section.emptyMessage}
              </p>
            ) : (
              <div className="space-y-1.5">
                {section.skills.map((skill, i) => (
                  <SkillChip
                    key={skill.id}
                    skill={skill}
                    accent={section.accent}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
