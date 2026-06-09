// ── Interview Benchmarks ──────────────────────────────────────────────────────
// Evaluation bands, confidence scoring, and improvement priority logic.
// Extends placementBenchmarks — does NOT duplicate them.

import type { InterviewType } from './interviewTracks';

// ── Confidence Band ───────────────────────────────────────────────────────────

export interface ConfidenceBand {
  label: string;
  minScore: number;
  color: 'red' | 'amber' | 'cyan' | 'violet' | 'emerald';
  description: string;
  icon: string;
}

export const CONFIDENCE_BANDS: ConfidenceBand[] = [
  { label: 'Very Low',   minScore: 0,  color: 'red',     icon: '◻', description: 'Significant preparation needed before interviews.' },
  { label: 'Low',        minScore: 25, color: 'amber',   icon: '◈', description: 'Core gaps in interview-style responses.' },
  { label: 'Moderate',   minScore: 50, color: 'cyan',    icon: '◉', description: 'Solid baseline; targeted practice recommended.' },
  { label: 'High',       minScore: 70, color: 'violet',  icon: '◆', description: 'Interview-ready with minor areas to strengthen.' },
  { label: 'Exceptional',minScore: 88, color: 'emerald', icon: '⭐', description: 'Outstanding interview preparedness.' },
];

export const getConfidenceBand = (score: number): ConfidenceBand => {
  const sorted = [...CONFIDENCE_BANDS].sort((a, b) => b.minScore - a.minScore);
  return sorted.find(b => score >= b.minScore) ?? CONFIDENCE_BANDS[0];
};

// ── Evaluation Dimension ──────────────────────────────────────────────────────

export interface EvaluationDimension {
  id: string;
  label: string;
  description: string;
  weight: number;       // 0–1, sums to 1.0 per interview type
  icon: string;
  color: 'violet' | 'cyan' | 'fuchsia' | 'amber' | 'emerald';
}

/** Per-track evaluation dimensions and weights. */
export const TRACK_DIMENSIONS: Record<InterviewType, EvaluationDimension[]> = {
  technical: [
    { id: 'concept-depth',   label: 'Concept Depth',    description: 'Depth of core engineering understanding.',    weight: 0.35, icon: '🧠', color: 'violet' },
    { id: 'problem-solving', label: 'Problem Solving',  description: 'Approach to novel engineering challenges.',    weight: 0.30, icon: '⚙️', color: 'cyan' },
    { id: 'code-design',     label: 'Design Thinking',  description: 'System/solution design and trade-off reasoning.',weight: 0.20, icon: '📐', color: 'fuchsia' },
    { id: 'communication',   label: 'Communication',    description: 'Clarity of technical explanation.',             weight: 0.15, icon: '💬', color: 'amber' },
  ],
  aptitude: [
    { id: 'quantitative',    label: 'Quantitative',     description: 'Numerical and arithmetic reasoning.',          weight: 0.35, icon: '📊', color: 'cyan' },
    { id: 'logical',         label: 'Logical Reasoning', description: 'Pattern recognition and deduction.',          weight: 0.30, icon: '🔗', color: 'violet' },
    { id: 'verbal',          label: 'Verbal Reasoning',  description: 'Reading comprehension and inference.',        weight: 0.20, icon: '📝', color: 'amber' },
    { id: 'speed-accuracy',  label: 'Speed & Accuracy',  description: 'Time efficiency under test conditions.',      weight: 0.15, icon: '⏱️', color: 'emerald' },
  ],
  hr: [
    { id: 'behavioural',     label: 'Behavioural',      description: 'STAR-format responses and situational fit.',   weight: 0.35, icon: '🎭', color: 'amber' },
    { id: 'communication',   label: 'Communication',    description: 'Clarity, confidence, and articulation.',       weight: 0.30, icon: '💬', color: 'violet' },
    { id: 'cultural-fit',    label: 'Cultural Fit',     description: 'Values alignment and professional conduct.',   weight: 0.20, icon: '🤝', color: 'cyan' },
    { id: 'leadership',      label: 'Leadership',       description: 'Initiative, ownership, and team dynamics.',    weight: 0.15, icon: '🌟', color: 'fuchsia' },
  ],
  domain: [
    { id: 'specialisation',  label: 'Specialisation',   description: 'Depth in domain-specific advanced topics.',   weight: 0.40, icon: '🎓', color: 'fuchsia' },
    { id: 'industry-know',   label: 'Industry Knowledge', description: 'Standards, tools, and current practices.',  weight: 0.25, icon: '🏭', color: 'violet' },
    { id: 'research',        label: 'Research Depth',   description: 'Understanding of literature and innovations.', weight: 0.20, icon: '🔬', color: 'cyan' },
    { id: 'application',     label: 'Applied Skills',   description: 'Practical implementation experience.',         weight: 0.15, icon: '🔧', color: 'amber' },
  ],
};

// ── Interview Readiness Scoring ───────────────────────────────────────────────

export interface InterviewReadinessParams {
  technicalReadiness: number;   // 0–100 from intelligence state
  assessmentScore:    number;   // 0–100 from assessments slice
  masteryScore:       number;   // 0–100 from progression slice
  velocityScore:      number;   // 0–100 from learning velocity
  roadmapReadiness:   number;   // 0–100 from roadmap slice
}

/**
 * Compute per-track interview readiness from existing intelligence metrics.
 * Each track weighs existing metrics differently — no new metrics created.
 */
export const computeTrackReadiness = (
  trackId: InterviewType,
  params: InterviewReadinessParams,
): number => {
  const { technicalReadiness, assessmentScore, masteryScore, velocityScore, roadmapReadiness } = params;

  let score: number;
  switch (trackId) {
    case 'technical':
      score = technicalReadiness * 0.40 + masteryScore * 0.30 + roadmapReadiness * 0.20 + velocityScore * 0.10;
      break;
    case 'aptitude':
      score = assessmentScore * 0.45 + masteryScore * 0.30 + velocityScore * 0.25;
      break;
    case 'hr':
      score = assessmentScore * 0.50 + velocityScore * 0.30 + roadmapReadiness * 0.20;
      break;
    case 'domain':
      score = roadmapReadiness * 0.40 + technicalReadiness * 0.35 + masteryScore * 0.25;
      break;
  }
  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Compute composite interview confidence: weighted average of track readiness scores.
 */
export const computeInterviewConfidence = (
  params: InterviewReadinessParams,
): number => {
  const weights: Record<InterviewType, number> = { technical: 0.40, aptitude: 0.25, hr: 0.20, domain: 0.15 };
  const allTypes: InterviewType[] = ['technical', 'aptitude', 'hr', 'domain'];
  const score = allTypes.reduce(
    (acc, t) => acc + computeTrackReadiness(t, params) * weights[t],
    0,
  );
  return Math.max(0, Math.min(100, Math.round(score)));
};

// ── Pass Probability ──────────────────────────────────────────────────────────

/** Estimate pass probability for a specific track at a given difficulty. */
export const computePassProbability = (
  trackReadiness: number,
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert',
): number => {
  const difficultyPenalty = { Foundational: 5, Intermediate: 15, Advanced: 30, Expert: 45 };
  const adjusted = trackReadiness - difficultyPenalty[difficulty];
  return Math.max(5, Math.min(99, Math.round(adjusted)));
};

// ── Improvement Priority ──────────────────────────────────────────────────────

export interface ImprovementPriority {
  area: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  suggestion: string;
}

/**
 * Derive improvement priorities from existing readiness signals.
 * Pure function — no new state, no API calls.
 */
export const deriveImprovementPriorities = (
  params: InterviewReadinessParams,
  weakSkillLabels: string[],
): ImprovementPriority[] => {
  const priorities: ImprovementPriority[] = [];

  if (params.technicalReadiness < 50) {
    priorities.push({ area: 'Technical Depth', urgency: 'critical', suggestion: 'Complete core roadmap nodes to build technical foundation.' });
  } else if (params.technicalReadiness < 70) {
    priorities.push({ area: 'Technical Depth', urgency: 'high', suggestion: 'Target remaining skill gaps on the roadmap.' });
  }

  if (params.assessmentScore < 50) {
    priorities.push({ area: 'Assessment Performance', urgency: 'critical', suggestion: 'Retake assessments to strengthen cognitive readiness signals.' });
  } else if (params.assessmentScore < 65) {
    priorities.push({ area: 'Assessment Performance', urgency: 'high', suggestion: 'Practice aptitude-style questions for higher assessment scores.' });
  }

  if (params.velocityScore < 40) {
    priorities.push({ area: 'Learning Velocity', urgency: 'high', suggestion: 'Increase daily study consistency to improve velocity signals.' });
  }

  if (params.masteryScore < 55) {
    priorities.push({ area: 'Skill Mastery', urgency: 'high', suggestion: 'Focus on mastering fewer skills deeply rather than breadth.' });
  }

  if (weakSkillLabels.length > 3) {
    priorities.push({ area: 'Skill Gaps', urgency: 'medium', suggestion: `Resolve ${weakSkillLabels.slice(0, 2).join(' and ')} first — they block interview readiness.` });
  }

  if (priorities.length === 0) {
    priorities.push({ area: 'Refinement', urgency: 'low', suggestion: 'Excellent base — focus on domain-specific depth for top-tier interviews.' });
  }

  return priorities.slice(0, 4);
};

// ── Confidence Trend ──────────────────────────────────────────────────────────

/** Derive a synthetic confidence trend from the learning velocity trend. */
export const deriveConfidenceTrend = (
  velocityTrend: 'improving' | 'stable' | 'declining',
  readinessDelta: number, // positive = improving, negative = declining
): 'up' | 'flat' | 'down' => {
  if (velocityTrend === 'improving' || readinessDelta > 5) return 'up';
  if (velocityTrend === 'declining' || readinessDelta < -5) return 'down';
  return 'flat';
};
