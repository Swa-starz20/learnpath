import type { DomainId } from './engineeringDomains';

// Re-export for consumers that need DomainId from this module
export type { DomainId };

export interface ReadinessCategory {
  id: string;
  label: string;
  description: string;
  /** Weight in overall placement readiness (0-1, all should sum to 1.0) */
  weight: number;
  /** Icon for display */
  icon: string;
  /** Color accent */
  color: 'violet' | 'cyan' | 'fuchsia' | 'amber' | 'emerald';
}

export interface PlacementBenchmark {
  /** Readiness % label */
  label: string;
  /** Min score for this band */
  minScore: number;
  /** Visual color */
  color: 'red' | 'amber' | 'cyan' | 'violet' | 'emerald';
  /** Short description */
  description: string;
}

export interface InterviewReadinessFactors {
  technicalWeight: number;       // 0-1
  problemSolvingWeight: number;
  communicationWeight: number;
  domainExpertiseWeight: number;
  practicalExpWeight: number;
}

// ─────────────────────────────────────────────
// Readiness Categories (weights sum to 1.0)
// ─────────────────────────────────────────────
export const READINESS_CATEGORIES: ReadinessCategory[] = [
  {
    id: 'technical',
    label: 'Technical Readiness',
    description: 'Core technical knowledge and engineering fundamentals assessed through modules and tests.',
    weight: 0.30,
    icon: '⚙️',
    color: 'violet',
  },
  {
    id: 'problem-solving',
    label: 'Problem Solving',
    description: 'Ability to analyse novel problems and derive systematic solutions under constraints.',
    weight: 0.25,
    icon: '🧩',
    color: 'cyan',
  },
  {
    id: 'domain-expertise',
    label: 'Domain Expertise',
    description: 'Depth of specialised knowledge within the selected engineering domain.',
    weight: 0.20,
    icon: '🎓',
    color: 'fuchsia',
  },
  {
    id: 'communication',
    label: 'Communication Readiness',
    description: 'Clarity in technical communication, documentation, and presentation skills.',
    weight: 0.15,
    icon: '💬',
    color: 'amber',
  },
  {
    id: 'practical-experience',
    label: 'Practical Experience',
    description: 'Hands-on project work, lab exercises, and real-world application exposure.',
    weight: 0.10,
    icon: '🔬',
    color: 'emerald',
  },
];

// ─────────────────────────────────────────────
// Placement Benchmark Bands
// ─────────────────────────────────────────────
export const PLACEMENT_BENCHMARKS: PlacementBenchmark[] = [
  {
    label: 'Not Ready',
    minScore: 0,
    color: 'red',
    description: 'Significant gaps in fundamentals. Focused learning required before applications.',
  },
  {
    label: 'Developing',
    minScore: 40,
    color: 'amber',
    description: 'Core knowledge building. Targeted skill development will accelerate readiness.',
  },
  {
    label: 'Approaching',
    minScore: 60,
    color: 'cyan',
    description: 'Solid foundation with a few gaps. Practise assessments and projects recommended.',
  },
  {
    label: 'Ready',
    minScore: 75,
    color: 'violet',
    description: 'Strong placement candidate. Apply confidently to target roles.',
  },
  {
    label: 'Exceptional',
    minScore: 90,
    color: 'emerald',
    description: 'Outstanding readiness. Competitive for top-tier opportunities.',
  },
];

// ─────────────────────────────────────────────
// Interview Readiness Factors (default weights, sum to 1.0)
// ─────────────────────────────────────────────
export const INTERVIEW_READINESS_FACTORS: InterviewReadinessFactors = {
  technicalWeight: 0.40,
  problemSolvingWeight: 0.25,
  communicationWeight: 0.15,
  domainExpertiseWeight: 0.12,
  practicalExpWeight: 0.08,
};

// ─────────────────────────────────────────────
// computePlacementReadiness
// Maps params to READINESS_CATEGORIES weights:
//   technical       → technicalReadiness   (weight 0.30)
//   problem-solving → masteryScore         (weight 0.25)
//   domain-expertise→ assessmentScore      (weight 0.20)
//   communication   → velocityScore        (weight 0.15)
//   practical-exp   → completionPct        (weight 0.10)
// ─────────────────────────────────────────────
export const computePlacementReadiness = (params: {
  technicalReadiness: number;
  masteryScore: number;
  assessmentScore: number;
  velocityScore: number;
  completionPct: number;
}): number => {
  const { technicalReadiness, masteryScore, assessmentScore, velocityScore, completionPct } = params;
  const score =
    technicalReadiness * 0.30 +
    masteryScore       * 0.25 +
    assessmentScore    * 0.20 +
    velocityScore      * 0.15 +
    completionPct      * 0.10;
  return Math.max(0, Math.min(100, Math.round(score)));
};

// ─────────────────────────────────────────────
// getBenchmarkBand
// ─────────────────────────────────────────────
export const getBenchmarkBand = (score: number): PlacementBenchmark => {
  // Traverse in descending order to find the highest matching band
  const sorted = [...PLACEMENT_BENCHMARKS].sort((a, b) => b.minScore - a.minScore);
  const band = sorted.find((b) => score >= b.minScore);
  // Default to the lowest band if nothing matched (score < 0 edge-case)
  return band ?? PLACEMENT_BENCHMARKS[0];
};

// ─────────────────────────────────────────────
// computeInterviewReadiness
// Weighted average of three inputs using INTERVIEW_READINESS_FACTORS.
// Remaining weight (domainExpertise + practicalExp) is split equally
// across technicalReadiness and masteryScore for a clean 3-input API.
// ─────────────────────────────────────────────
export const computeInterviewReadiness = (
  technicalReadiness: number,
  masteryScore: number,
  assessmentScore: number,
): number => {
  const { technicalWeight, problemSolvingWeight, communicationWeight, domainExpertiseWeight, practicalExpWeight } =
    INTERVIEW_READINESS_FACTORS;

  // Allocate domain + practical weights back to available inputs proportionally
  const residual = domainExpertiseWeight + practicalExpWeight;
  const tWeight = technicalWeight + residual * 0.5;
  const mWeight = problemSolvingWeight + residual * 0.5;

  const score =
    technicalReadiness * tWeight +
    masteryScore       * mWeight +
    assessmentScore    * communicationWeight;

  // Normalise by total weight used
  const totalWeight = tWeight + mWeight + communicationWeight;
  const normalised = totalWeight > 0 ? (score / totalWeight) : score;

  return Math.max(0, Math.min(100, Math.round(normalised)));
};
