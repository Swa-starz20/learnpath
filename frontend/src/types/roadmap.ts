// ── Roadmap intelligence types ────────────────────────────────────────────────
// Extends the base types in data/roadmapConfigs.ts with intelligence metadata.

export interface RoadmapSyncLink {
  nodeId: string;
  linkedCourseId: string | null;
  linkedSkillIds: string[];
  linkedAssessmentId: string | null;
  syncedAt: number;
}

export interface RoadmapIntelligence {
  domainId: string;
  trackId: string;
  readinessPct: number;       // 0-100
  aiConfidenceAvg: number;    // average across active/completed nodes
  estimatedCompletionWeeks: number;
  unlockedNodeIds: string[];
  criticalPathNodeIds: string[];  // nodes on the fastest completion path
  syncLinks: RoadmapSyncLink[];
}
