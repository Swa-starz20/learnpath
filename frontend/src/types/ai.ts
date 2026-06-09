// ── AI intelligence types ─────────────────────────────────────────────────────

export type RecommendationKind =
  | 'next_course'
  | 'reinforce_skill'
  | 'next_roadmap_node'
  | 'increase_difficulty'
  | 'decrease_difficulty'
  | 'practice_lab'
  | 'mentor_guidance';

export type AIConfidenceLevel = 'high' | 'medium' | 'low';

export interface RecommendationResult {
  kind: RecommendationKind;
  targetId: string;        // course id, skill id, node id, etc.
  targetLabel: string;
  rationale: string;       // human-readable explanation
  score: number;           // 0-100 recommendation confidence
  urgency: 'high' | 'medium' | 'low';
}

export interface AIInsight {
  id: string;
  type: 'skill_gap' | 'milestone_alert' | 'velocity_drop' | 'unlock_ready' | 'roadmap_sync';
  message: string;
  detail: string;
  confidence: AIConfidenceLevel;
  actionLabel?: string;
  actionTarget?: string;
  createdAt: number;       // unix ms
}

export interface AdaptiveDifficultyState {
  currentLevel: 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert';
  suggestedLevel: 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert';
  adjustmentReason: string;
  lastAdjustedAt: number;
}
