// ── Progression intelligence types ────────────────────────────────────────────

export interface XPState {
  total: number;
  level: number;           // derived from total XP
  nextLevelThreshold: number;
  progressToNextLevel: number; // 0-100 pct
  streak: number;          // consecutive study days
  weeklyXP: number;
  allTimeXP: number;
}

export interface ProgressState {
  domainId: string;
  trackId: string;
  completedNodeIds: string[];
  completedLessonIds: string[];
  completedModuleIds: string[];
  earnedXP: number;
  readinessPct: number;    // 0-100 calculated
  masteryScore: number;    // 0-100 weighted confidence
}

export interface MilestoneState {
  milestoneId: string;
  title: string;
  unlockedAt: number | null; // unix ms, null = locked
  xpGranted: number;
}

export interface LearningVelocity {
  lessonsPerDay: number;
  avgSessionMinutes: number;
  conceptScore: number;    // 0-100
  practiceScore: number;
  retentionScore: number;
  speedScore: number;
  accuracyScore: number;
  depthScore: number;
  overall: number;         // composite 0-100
  trend: 'up' | 'stable' | 'down';
}
