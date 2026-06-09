// ── Skill intelligence types ──────────────────────────────────────────────────

export type SkillStatus = 'mastered' | 'learning' | 'weak' | 'locked';
export type SkillGap = 'Critical' | 'Moderate' | 'Low' | 'None';

export interface SkillNode {
  id: string;              // unique slug e.g. 'arrays', 'kalman-filter'
  label: string;           // display name
  domainId: string;        // which engineering domain
  category: string;        // e.g. 'DSA', 'Control Systems', 'VLSI'
  status: SkillStatus;
  confidence: number;      // 0-100 AI-scored confidence
  gap: SkillGap;
  xpWeight: number;        // contribution to XP
}

export interface SkillDependency {
  from: string;            // skill id that must be learned first
  to: string;              // skill id unlocked after
  strength: 'hard' | 'soft'; // hard = prerequisite, soft = recommended
}

export interface SkillSyncState {
  skillId: string;
  syncedToCourseId: string | null;
  syncedToRoadmapNodeId: string | null;
  syncedToAssessmentId: string | null;
  lastSyncedAt: number;    // unix ms
}

export interface SkillCluster {
  category: string;
  skills: SkillNode[];
  avgConfidence: number;
  weakCount: number;
}
