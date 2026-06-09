// ── PlacementInsightsPanel ────────────────────────────────────────────────────
// Section 4: AI placement insights from existing mentor + adaptive outputs.
// Consumes mentorInsights and adaptive state — no new intelligence generated.

import { motion } from 'framer-motion';
import {
  Lightbulb, Zap, MapPin, BookOpen, ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { AIInsight } from '@/types/ai';
import type { LearningPathAdjustment } from '@/engine/adaptiveEngine';
import type { BehaviorSignal } from '@/engine/behaviorEngine';

interface PlacementInsightsPanelProps {
  insights: AIInsight[];
  pathAdjustments: LearningPathAdjustment | null;
  behaviorSignal: BehaviorSignal;
  nextRoadmapNodeTitle: string | null;
  nextCourseTitle: string | null;
  readinessPct: number;
}

const InsightCard = ({
  icon,
  label,
  title,
  body,
  accent,
  actionLabel,
  actionTarget,
  index,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  body: string;
  accent: string;
  actionLabel: string;
  actionTarget: string;
  index: number;
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
      className={`relative group p-5 rounded-2xl border ${accent} bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] transition-all duration-300 cursor-default overflow-hidden`}
    >
      {/* Subtle glow */}
      <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-current opacity-5 blur-xl" />

      <div className="flex items-start gap-3 mb-3">
        <div className={`mt-0.5 opacity-70 ${
          accent.includes('violet') ? 'text-violet-400' :
          accent.includes('cyan')   ? 'text-cyan-400' :
          accent.includes('amber')  ? 'text-amber-400' :
          accent.includes('fuchsia') ? 'text-fuchsia-400' : 'text-emerald-400'
        }`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[9px] font-mono tracking-widest uppercase mb-1 ${
            accent.includes('violet') ? 'text-violet-400/70' :
            accent.includes('cyan')   ? 'text-cyan-400/70' :
            accent.includes('amber')  ? 'text-amber-400/70' :
            accent.includes('fuchsia') ? 'text-fuchsia-400/70' : 'text-emerald-400/70'
          }`}>
            {label}
          </p>
          <p className="text-sm font-semibold text-white/75 font-['Hanken_Grotesk',_sans-serif] mb-1">
            {title}
          </p>
          <p className="text-[11px] text-white/35 font-['Inter',_sans-serif] leading-relaxed">
            {body}
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate(actionTarget)}
        className={`flex items-center gap-1.5 text-[9px] font-mono tracking-widest uppercase hover:opacity-100 opacity-50 transition-opacity ${
          accent.includes('violet') ? 'text-violet-300' :
          accent.includes('cyan')   ? 'text-cyan-300' :
          accent.includes('amber')  ? 'text-amber-300' :
          accent.includes('fuchsia') ? 'text-fuchsia-300' : 'text-emerald-300'
        }`}
      >
        {actionLabel} <ArrowRight size={10} />
      </button>
    </motion.div>
  );
};

export const PlacementInsightsPanel = ({
  insights,
  pathAdjustments,
  behaviorSignal,
  nextRoadmapNodeTitle,
  nextCourseTitle,
  readinessPct,
}: PlacementInsightsPanelProps) => {
  // Derive the "next best action" from adaptive path adjustments
  const nextAction = pathAdjustments
    ? pathAdjustments.action.replace(/_/g, ' ')
    : nextRoadmapNodeTitle
    ? `Continue ${nextRoadmapNodeTitle}`
    : 'Complete roadmap assessment';

  // Determine primary readiness blocker from insights
  const topBlocker = insights.find(i => i.confidence === 'high' && i.type === 'skill_gap')
    ?? insights.find(i => i.confidence === 'high')
    ?? null;

  const staticCards = [
    {
      icon: <Zap size={16} />,
      label: 'Next Best Action',
      title: nextAction,
      body: pathAdjustments?.reason ?? behaviorSignal.rationale,
      accent: 'border-violet-500/20',
      actionLabel: 'Go to Roadmap',
      actionTarget: '/roadmap',
    },
    {
      icon: <MapPin size={16} />,
      label: 'Readiness Blocker',
      title: topBlocker ? topBlocker.message : 'No critical blockers detected',
      body: topBlocker
        ? topBlocker.detail
        : `Your readiness is at ${readinessPct}%. Keep progressing on current milestones.`,
      accent: 'border-amber-400/20',
      actionLabel: 'Talk to AI Mentor',
      actionTarget: '/mentor',
    },
    {
      icon: <Lightbulb size={16} />,
      label: 'Recommended Milestone',
      title: nextRoadmapNodeTitle
        ? `Unlock: ${nextRoadmapNodeTitle}`
        : 'Complete remaining roadmap nodes',
      body: 'Completing this milestone significantly improves your role compatibility scores.',
      accent: 'border-cyan-400/20',
      actionLabel: 'View Roadmap',
      actionTarget: '/roadmap',
    },
    {
      icon: <BookOpen size={16} />,
      label: 'Learning Priority',
      title: nextCourseTitle
        ? `Prioritize: ${nextCourseTitle}`
        : 'Start an AI-recommended course',
      body: 'AI-matched to your skill gaps and roadmap position for maximum placement impact.',
      accent: 'border-fuchsia-500/20',
      actionLabel: 'Explore Courses',
      actionTarget: '/courses',
    },
  ];

  return (
    <div className="rounded-[28px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mb-1">
          AI Placement Insights
        </p>
        <h3 className="text-lg font-bold text-white/85 font-['Hanken_Grotesk',_sans-serif]">
          Actionable Intelligence
        </h3>
        <p className="text-[11px] text-white/30 mt-0.5 font-['Inter',_sans-serif]">
          Sourced from mentor engine, adaptive layer, and recommendation bundles
        </p>
      </div>

      {/* Insight cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staticCards.map((card, i) => (
          <InsightCard key={card.label} {...card} index={i} />
        ))}
      </div>

      {/* Live insights from mentor engine */}
      {insights.length > 0 && (
        <div className="mt-6 border-t border-white/[0.05] pt-5">
          <p className="text-[9px] font-mono tracking-widest text-white/25 uppercase mb-3">
            Live AI Mentor Signals
          </p>
          <div className="space-y-2">
            {insights.slice(0, 3).map((insight, i) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.4 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/[0.04]"
              >
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  insight.confidence === 'high' ? 'bg-violet-400' :
                  insight.confidence === 'medium' ? 'bg-cyan-400' : 'bg-white/20'
                }`} />
                <div>
                  <p className="text-[11px] text-white/60 font-['Inter',_sans-serif]">
                    {insight.message}
                  </p>
                  {insight.detail && (
                    <p className="text-[10px] text-white/25 mt-0.5 font-mono">{insight.detail}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

