// ── InterviewEvaluationPanel ──────────────────────────────────────────────────
// Section 3: Evaluation intelligence — strengths, weaknesses, improvement priorities,
// and mentor recommendation. Consumed from existing intelligence + benchmarks.

import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ArrowUp, MessageCircle } from 'lucide-react';
import type { InterviewType } from '@/data/interviews/interviewTracks';
import type { InterviewReadinessParams, ImprovementPriority } from '@/data/interviews/interviewBenchmarks';
import {
  TRACK_DIMENSIONS,
  computeTrackReadiness,
  deriveImprovementPriorities,
} from '@/data/interviews/interviewBenchmarks';
import type { SkillNode } from '@/types/skill';

interface InterviewEvaluationPanelProps {
  trackId: InterviewType;
  params: InterviewReadinessParams;
  weakSkills: SkillNode[];
  mentorContextSummary: string;
}

const URGENCY_STYLES: Record<ImprovementPriority['urgency'], string> = {
  critical: 'border-red-400/25 bg-red-500/10 text-red-300',
  high:     'border-amber-400/25 bg-amber-400/10 text-amber-300',
  medium:   'border-cyan-400/25 bg-cyan-400/10 text-cyan-300',
  low:      'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
};

export const InterviewEvaluationPanel = ({
  trackId,
  params,
  weakSkills,
  mentorContextSummary,
}: InterviewEvaluationPanelProps) => {
  const dimensions  = TRACK_DIMENSIONS[trackId];
  const trackReady  = computeTrackReadiness(trackId, params);
  const weakLabels  = weakSkills.map(s => s.label);
  const priorities  = deriveImprovementPriorities(params, weakLabels);

  // Derive strengths vs weaknesses from dimension weights × readiness signals
  const dimensionScores = dimensions.map(dim => {
    const baseScore =
      dim.id === 'concept-depth'   || dim.id === 'specialisation'  ? params.technicalReadiness :
      dim.id === 'problem-solving' || dim.id === 'quantitative'    ? params.masteryScore :
      dim.id === 'communication'   || dim.id === 'verbal'          ? params.assessmentScore :
      dim.id === 'cultural-fit'    || dim.id === 'behavioural'     ? params.assessmentScore :
      dim.id === 'industry-know'   || dim.id === 'application'     ? params.roadmapReadiness :
      trackReady;
    return { ...dim, score: Math.round(baseScore * (0.8 + dim.weight * 0.4)) };
  });

  const strengths  = dimensionScores.filter(d => d.score >= 65).sort((a, b) => b.score - a.score);
  const weaknesses = dimensionScores.filter(d => d.score < 65).sort((a, b) => a.score - b.score);

  const COLOR_TEXT: Record<string, string> = {
    violet: 'text-violet-400', cyan: 'text-cyan-400',
    fuchsia: 'text-fuchsia-400', amber: 'text-amber-400', emerald: 'text-emerald-400',
  };
  const COLOR_BG: Record<string, string> = {
    violet: 'bg-violet-500/10 border-violet-500/20',
    cyan: 'bg-cyan-400/10 border-cyan-400/20',
    fuchsia: 'bg-fuchsia-500/10 border-fuchsia-500/20',
    amber: 'bg-amber-400/10 border-amber-400/20',
    emerald: 'bg-emerald-400/10 border-emerald-400/20',
  };

  return (
    <div className="rounded-[28px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-6 space-y-6">
      <div>
        <p className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mb-1">Section 3</p>
        <h3 className="text-lg font-bold text-white/85 font-['Hanken_Grotesk',_sans-serif]">Evaluation Intelligence</h3>
        <p className="text-[11px] text-white/30 mt-0.5 font-['Inter',_sans-serif]">
          Derived from assessment, roadmap, mastery, and adaptive signals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={14} className="text-emerald-400" />
            <p className="text-[11px] font-semibold text-white/65 font-['Hanken_Grotesk',_sans-serif]">Strengths</p>
            <span className="ml-auto text-[8px] font-mono text-emerald-400/60 border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 rounded-full">
              {strengths.length}
            </span>
          </div>
          <div className="space-y-2">
            {strengths.length === 0 ? (
              <p className="text-[10px] font-mono text-white/20 italic">Complete more assessments to surface strengths.</p>
            ) : strengths.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`flex items-center justify-between p-3 rounded-xl border ${COLOR_BG[d.color]}`}
              >
                <div className="flex items-center gap-2">
                  <span>{d.icon}</span>
                  <span className={`text-[11px] font-['Inter',_sans-serif] ${COLOR_TEXT[d.color]}`}>{d.label}</span>
                </div>
                <span className={`text-[10px] font-mono ${COLOR_TEXT[d.color]}`}>{d.score}%</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-amber-400" />
            <p className="text-[11px] font-semibold text-white/65 font-['Hanken_Grotesk',_sans-serif]">Improvement Areas</p>
            <span className="ml-auto text-[8px] font-mono text-amber-400/60 border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 rounded-full">
              {weaknesses.length}
            </span>
          </div>
          <div className="space-y-2">
            {weaknesses.length === 0 ? (
              <p className="text-[10px] font-mono text-white/20 italic">All dimensions performing well.</p>
            ) : weaknesses.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]"
              >
                <div className="flex items-center gap-2">
                  <span>{d.icon}</span>
                  <span className="text-[11px] text-white/50 font-['Inter',_sans-serif]">{d.label}</span>
                </div>
                <span className="text-[10px] font-mono text-white/30">{d.score}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Improvement Priorities */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ArrowUp size={14} className="text-violet-400" />
          <p className="text-[11px] font-semibold text-white/65 font-['Hanken_Grotesk',_sans-serif]">Improvement Priorities</p>
        </div>
        <div className="space-y-2">
          {priorities.map((p, i) => (
            <motion.div
              key={p.area}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.07 + 0.3 }}
              className={`flex items-start gap-3 p-3 rounded-xl border ${URGENCY_STYLES[p.urgency]}`}
            >
              <span className="text-[8px] font-mono tracking-widest uppercase opacity-70 mt-0.5 flex-shrink-0">
                {p.urgency}
              </span>
              <div>
                <p className="text-[11px] font-semibold font-['Hanken_Grotesk',_sans-serif] opacity-90">{p.area}</p>
                <p className="text-[10px] opacity-60 mt-0.5 font-['Inter',_sans-serif]">{p.suggestion}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mentor recommendation */}
      {mentorContextSummary && (
        <div className="p-4 rounded-2xl border border-violet-500/15 bg-violet-500/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle size={13} className="text-violet-400" />
            <p className="text-[9px] font-mono tracking-widest text-violet-400/70 uppercase">AI Mentor Recommendation</p>
          </div>
          <p className="text-[12px] italic text-violet-300/75 font-['Inter',_sans-serif] leading-relaxed">
            "{mentorContextSummary}"
          </p>
        </div>
      )}
    </div>
  );
};
