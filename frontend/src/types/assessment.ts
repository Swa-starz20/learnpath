// ── Assessment intelligence types ─────────────────────────────────────────────

export type AssessmentCategory = 'cognitive' | 'technical' | 'behavioral' | 'personality' | 'career';
export type AssessmentStatus = 'not_started' | 'in_progress' | 'completed';

export interface AssessmentMetric {
  category: AssessmentCategory;
  label: string;
  score: number;           // 0-100
  benchmark: number;       // domain average for comparison
  gap: number;             // score - benchmark (negative = below)
}

export interface AssessmentResult {
  assessmentId: string;
  completedAt: number;     // unix ms
  overallScore: number;    // 0-100
  metrics: AssessmentMetric[];
  weakSkills: string[];    // skill IDs identified as weak
  strongSkills: string[];  // skill IDs identified as strong
  recommendedDomainId: string | null;
}

export interface AssessmentState {
  completedAssessments: AssessmentResult[];
  cognitiveReadiness: number;  // 0-100 composite
  technicalReadiness: number;
  weakSkillIds: string[];
  strongSkillIds: string[];
}
