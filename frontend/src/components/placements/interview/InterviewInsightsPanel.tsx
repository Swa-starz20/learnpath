// ── InterviewInsightsPanel ────────────────────────────────────────────────────
// Section 5: AI interview insights — blockers, prep focus, adaptive suggestions.
// Consumes existing mentor insights + adaptive intelligence signals.

import { motion } from 'framer-motion';
import { Lightbulb, AlertCircle, BookOpen, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { InterviewType } from '@/data/interviews/interviewTracks';
import { DOMAIN_INTERVIEW_FOCUS } from '@/data/interviews/interviewTracks';
import type { DomainId } from '@/data/engineeringDomains';
import type { AIInsight } from '@/types/ai';
import type { InterviewReadinessParams } from '@/data/interviews/interviewBenchmarks';
import { computeTrackReadiness } from '@/data/interviews/interviewBenchmarks';

interface InterviewInsightsPanelProps {
  domainId: DomainId;
  activeTrack: InterviewType;
  params: InterviewReadinessParams;
  mentorInsights: AIInsight[];
  pathAdjustmentAction: string | null;
  adaptiveRationale: string;
  shouldAccelerate: boolean;
}

const InsightRow = ({
  icon, color, label, heading, body, actionLabel, actionTarget, delay,
}: {
  icon: React.ReactNode; color: string; label: string; heading: string;
  body: string; actionLabel: string; actionTarget: string; delay: number;
}) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="flex items-start gap-4 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] transition-all group"
    >
      <div className={`mt-0.5 flex-shrink-0 ${color}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-[9px] font-mono tracking-widest uppercase mb-1 ${color} opacity-70`}>{label}</p>
        <p className="text-sm font-semibold text-white/75 font-['Hanken_Grotesk',_sans-serif] mb-0.5">{heading}</p>
        <p className="text-[11px] text-white/35 font-['Inter',_sans-serif] leading-relaxed">{body}</p>
        <button
          onClick={() => navigate(actionTarget)}
          className={`flex items-center gap-1 mt-2 text-[9px] font-mono tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity ${color}`}
        >
          {actionLabel} <ArrowRight size={9} />
        </button>
      </div>
    </motion.div>
  );
};

export const InterviewInsightsPanel = ({
  domainId,
  activeTrack,
  params,
  mentorInsights,
  pathAdjustmentAction,
  adaptiveRationale,
  shouldAccelerate,
}: InterviewInsightsPanelProps) => {
  const focus      = DOMAIN_INTERVIEW_FOCUS[domainId];
  const trackReady = computeTrackReadiness(activeTrack, params);

  // Derive likely blocker from readiness signals
  const likelyBlocker =
    params.technicalReadiness < 50 ? 'Technical depth below interview threshold' :
    params.assessmentScore < 50    ? 'Assessment score limiting aptitude readiness' :
    params.masteryScore < 55       ? 'Skill mastery gaps reducing domain confidence' :
    params.velocityScore < 40      ? 'Low learning velocity affecting readiness signals' :
    'Minor gaps — maintain current preparation pace';

  // Recommended prep focus from domain config
  const prepFocus =
    activeTrack === 'technical' ? focus.sampleTopics.slice(0, 3) :
    activeTrack === 'domain'    ? focus.domainAreas.slice(0, 3) :
    activeTrack === 'aptitude'  ? focus.aptitudeAreas :
    ['STAR method answers', 'Leadership examples', 'Communication clarity'];

  const adaptiveSuggestion = shouldAccelerate
    ? `High engagement detected — accelerate to Advanced ${activeTrack} simulations.`
    : adaptiveRationale || 'Maintain steady pace; AI is monitoring your readiness signals.';

  const staticInsights = [
    {
      icon: <AlertCircle size={16} />,
      color: 'text-red-400',
      label: 'Likely Blocker',
      heading: likelyBlocker,
      body: 'Resolving this blocker will have the highest impact on your interview readiness score.',
      actionLabel: 'View Roadmap',
      actionTarget: '/roadmap',
      delay: 0,
    },
    {
      icon: <BookOpen size={16} />,
      color: 'text-cyan-400',
      label: `${activeTrack.charAt(0).toUpperCase() + activeTrack.slice(1)} Prep Focus`,
      heading: prepFocus.join(' · '),
      body: `These are the most tested topics for ${activeTrack} interviews in ${domainId} engineering. Prioritise mastery.`,
      actionLabel: 'Explore Courses',
      actionTarget: '/courses',
      delay: 0.08,
    },
    {
      icon: <Zap size={16} />,
      color: 'text-violet-400',
      label: 'Adaptive Suggestion',
      heading: pathAdjustmentAction
        ? `${pathAdjustmentAction.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`
        : 'Follow AI Recommended Pace',
      body: adaptiveSuggestion,
      actionLabel: 'Talk to Mentor',
      actionTarget: '/mentor',
      delay: 0.16,
    },
    {
      icon: <Lightbulb size={16} />,
      color: 'text-amber-400',
      label: 'Readiness Insight',
      heading: trackReady >= 75
        ? 'You are interview-ready for this track'
        : trackReady >= 50
        ? 'Approaching readiness — one more milestone needed'
        : 'Build fundamentals before attempting this track',
      body: trackReady >= 75
        ? 'Your intelligence scores qualify you for real interview practice in this domain.'
        : `Target ${Math.max(0, 75 - trackReady)} more readiness points to unlock full simulation mode.`,
      actionLabel: 'View Placement Status',
      actionTarget: '/placements',
      delay: 0.24,
    },
  ];

  // Live mentor signals from existing intelligence
  const relevantInsights = mentorInsights.slice(0, 3);

  return (
    <div className="rounded-[28px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-6 space-y-5">
      <div>
        <p className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mb-1">Section 5</p>
        <h3 className="text-lg font-bold text-white/85 font-['Hanken_Grotesk',_sans-serif]">AI Interview Insights</h3>
        <p className="text-[11px] text-white/30 mt-0.5 font-['Inter',_sans-serif]">
          Sourced from adaptive layer, mentor engine, and readiness signals
        </p>
      </div>

      {/* Static insight rows */}
      <div className="space-y-3">
        {staticInsights.map(ins => <InsightRow key={ins.label} {...ins} />)}
      </div>

      {/* Live mentor signals */}
      {relevantInsights.length > 0 && (
        <div className="border-t border-white/[0.05] pt-4">
          <p className="text-[9px] font-mono tracking-widest text-white/25 uppercase mb-3">Live Mentor Signals</p>
          <div className="space-y-2">
            {relevantInsights.map((insight, i) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.5 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/[0.04]"
              >
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  insight.confidence === 'high' ? 'bg-violet-400' :
                  insight.confidence === 'medium' ? 'bg-cyan-400' : 'bg-white/20'
                }`} />
                <div>
                  <p className="text-[11px] text-white/60 font-['Inter',_sans-serif]">{insight.message}</p>
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
