// ── User Intelligence State ───────────────────────────────────────────────────
// Single unified state model for adaptive platform intelligence.
// Composes existing types — does NOT duplicate them.
// This is the cross-system "view" consumed by the sync engine and selectors.

import type { DomainId } from '../data/engineeringDomains';
import type { AssessmentState, AssessmentResult } from '../types/assessment';
import type { SkillNode, SkillCluster } from '../types/skill';
import type { XPState, ProgressState, LearningVelocity, MilestoneState } from '../types/progression';
import type { RecommendationResult, AIInsight, AdaptiveDifficultyState } from '../types/ai';
import type { RoadmapIntelligence } from '../types/roadmap';
import type { CourseIntelligence } from '../types/course';
import type { BehaviorPattern, BehaviorSignal } from '../engine/behaviorEngine';
import type { DifficultyDecision, DifficultyDirection } from '../engine/difficultyEngine';
import type { LearningPathAdjustment } from '../engine/adaptiveEngine';

// ── Slice: Assessments ────────────────────────────────────────────────────────

export interface AssessmentIntelligenceSlice {
  state: AssessmentState;
  latestResult: AssessmentResult | null;
  /** Composite readiness derived from cognitive + technical scores */
  overallReadiness: number;          // 0-100
  /** Recommended domain based on latest assessment profile */
  recommendedDomainId: DomainId | null;
  lastSyncedAt: number;
}

// ── Slice: Roadmap ────────────────────────────────────────────────────────────

export interface RoadmapIntelligenceSlice {
  domainId: DomainId;
  trackId: string;
  intelligence: RoadmapIntelligence;
  /** Node IDs the learner can unlock right now */
  unlockableNodeIds: string[];
  /** Node IDs blocking fastest completion path that have critical skill gaps */
  blockedNodeIds: string[];
  lastSyncedAt: number;
}

// ── Slice: Courses ────────────────────────────────────────────────────────────

export interface CourseIntelligenceSlice {
  activeCourseId: string | null;
  intelligence: CourseIntelligence[];   // per course
  /** Course IDs ordered by AI match + readiness */
  rankedCourseIds: string[];
  lastSyncedAt: number;
}

// ── Slice: Skills ─────────────────────────────────────────────────────────────

export interface SkillIntelligenceSlice {
  allNodes: SkillNode[];
  weakClusters: SkillCluster[];
  /** Skills ready to start (prerequisites met, not mastered) */
  nextSkillIds: string[];
  /** 0-100 cross-system skill sync score */
  syncScore: number;
  lastSyncedAt: number;
}

// ── Slice: Progression ────────────────────────────────────────────────────────

export interface ProgressionIntelligenceSlice {
  xp: XPState;
  progress: ProgressState;
  velocity: LearningVelocity;
  streak: number;
  milestones: MilestoneState[];
  lastSyncedAt: number;
}

// ── Slice: Recommendations ────────────────────────────────────────────────────

export interface RecommendationIntelligenceSlice {
  nextCourse: RecommendationResult | null;
  nextRoadmapNode: RecommendationResult | null;
  reinforcement: RecommendationResult | null;
  difficulty: AdaptiveDifficultyState | null;
  lastSyncedAt: number;
}

// ── Slice: Mentor Insights ────────────────────────────────────────────────────

export interface MentorIntelligenceSlice {
  insights: AIInsight[];
  /** Summary sentence for the AI Mentor's greeting context */
  contextSummary: string;
  /** Topics the mentor should proactively surface */
  proactiveTopics: string[];
  lastSyncedAt: number;
}

// ── Slice: Readiness ──────────────────────────────────────────────────────────

export interface ReadinessIntelligenceSlice {
  /** Overall domain readiness 0-100 */
  domainReadiness: number;
  /** Cognitive readiness from assessments */
  cognitiveReadiness: number;
  /** Technical readiness from roadmap + courses */
  technicalReadiness: number;
  /** Career pathway readiness estimate */
  careerReadiness: number;
  lastSyncedAt: number;
}

// ── Slice: Learning Velocity ──────────────────────────────────────────────────

export interface LearningVelocitySlice {
  velocity: LearningVelocity;
  /** 7-day XP trend: array of daily XP totals, oldest first */
  weeklyXPTrend: number[];
  /** Whether velocity is improving, stable, or declining */
  trend: 'improving' | 'stable' | 'declining';
  lastSyncedAt: number;
}

// ── Slice: Career Alignment ───────────────────────────────────────────────────

export interface CareerAlignmentSlice {
  /** Primary career track the learner is progressing toward */
  primaryTrackId: string | null;
  /** 0-100 alignment score with current domain track */
  alignmentScore: number;
  /** Skills the learner still needs for their career target */
  missingSkillIds: string[];
  /** Estimated weeks to reach career readiness at current velocity */
  estimatedWeeks: number;
  lastSyncedAt: number;
}

// ── Slice: Adaptive Intelligence ───────────────────────────────────────────────
// Populated by adaptiveEngine on every runIntelligenceCycle().
// Consumed by Dashboard, Mentor, Roadmap via selectors.

export interface AdaptiveIntelligenceSlice {
  /** Detected learner behavior pattern */
  behaviorPattern: BehaviorPattern;
  /** Full behavior signal with confidence, rationale, and suggested action */
  behaviorSignal: BehaviorSignal;
  /** Difficulty direction decided by difficultyEngine */
  difficultyDirection: DifficultyDirection;
  /** Full difficulty decision with reason and confidence */
  difficultyDecision: DifficultyDecision;
  /** 0-100 composite engagement score */
  engagementScore: number;
  /** Velocity-derived engagement trend */
  engagementTrend: 'improving' | 'stable' | 'declining';
  /** Whether the learner should accelerate on the roadmap */
  shouldAccelerate: boolean;
  /** Whether roadmap progression should slow */
  shouldSlow: boolean;
  /** Learning path adjustments from adaptiveEngine */
  pathAdjustments: LearningPathAdjustment | null;
  /** Whether adaptive layer has run at least once */
  isHydrated: boolean;
  lastSyncedAt: number;
}

// ── Unified Intelligence State ────────────────────────────────────────────────

export interface UserIntelligenceState {
  // Core identity
  domainId: DomainId;
  trackId: string;

  // All intelligence slices
  assessments: AssessmentIntelligenceSlice;
  roadmap: RoadmapIntelligenceSlice;
  courses: CourseIntelligenceSlice;
  skills: SkillIntelligenceSlice;
  progression: ProgressionIntelligenceSlice;
  recommendations: RecommendationIntelligenceSlice;
  mentorInsights: MentorIntelligenceSlice;
  readiness: ReadinessIntelligenceSlice;
  learningVelocity: LearningVelocitySlice;
  careerAlignment: CareerAlignmentSlice;
  /** Adaptive behavior layer — populated after first runIntelligenceCycle() */
  adaptive: AdaptiveIntelligenceSlice;

  // Meta
  lastFullSyncAt: number;
  syncCycleId: string;
  isStale: boolean;             // true when any slice is outdated
}

// ── Null-safe default builder ─────────────────────────────────────────────────
// Used by the sync engine to initialise a clean intelligence state.

export const createEmptyIntelligenceState = (
  domainId: DomainId,
  trackId: string
): UserIntelligenceState => {
  const now = Date.now();
  const emptyBehaviorSignal: BehaviorSignal = {
    pattern: 'highlyEngaged',
    confidence: 0,
    rationale: 'Adaptive layer not yet hydrated.',
    suggestedAction: 'maintain_pace',
    requiresMentorIntervention: false,
  };
  const emptyDifficultyDecision: DifficultyDecision = {
    direction: 'maintain',
    currentLevel: 'Intermediate',
    targetLevel: 'Intermediate',
    reason: 'Adaptive layer not yet hydrated.',
    confidence: 0,
    blockedBySkillGaps: false,
  };
  return {
    domainId,
    trackId,
    assessments: {
      state: { completedAssessments: [], cognitiveReadiness: 0, technicalReadiness: 0, weakSkillIds: [], strongSkillIds: [] },
      latestResult: null,
      overallReadiness: 0,
      recommendedDomainId: null,
      lastSyncedAt: now,
    },
    roadmap: {
      domainId,
      trackId,
      intelligence: { domainId, trackId, readinessPct: 0, aiConfidenceAvg: 0, estimatedCompletionWeeks: 52, unlockedNodeIds: [], criticalPathNodeIds: [], syncLinks: [] },
      unlockableNodeIds: [],
      blockedNodeIds: [],
      lastSyncedAt: now,
    },
    courses: {
      activeCourseId: null,
      intelligence: [],
      rankedCourseIds: [],
      lastSyncedAt: now,
    },
    skills: {
      allNodes: [],
      weakClusters: [],
      nextSkillIds: [],
      syncScore: 0,
      lastSyncedAt: now,
    },
    progression: {
      xp: { total: 0, level: 1, nextLevelThreshold: 1000, progressToNextLevel: 0, streak: 0, weeklyXP: 0, allTimeXP: 0 },
      progress: { domainId, trackId, completedNodeIds: [], completedLessonIds: [], completedModuleIds: [], earnedXP: 0, readinessPct: 0, masteryScore: 0 },
      velocity: { lessonsPerDay: 0, avgSessionMinutes: 0, conceptScore: 0, practiceScore: 0, retentionScore: 0, speedScore: 0, accuracyScore: 0, depthScore: 0, overall: 0, trend: 'stable' },
      streak: 0,
      milestones: [],
      lastSyncedAt: now,
    },
    recommendations: {
      nextCourse: null,
      nextRoadmapNode: null,
      reinforcement: null,
      difficulty: null,
      lastSyncedAt: now,
    },
    mentorInsights: {
      insights: [],
      contextSummary: '',
      proactiveTopics: [],
      lastSyncedAt: now,
    },
    readiness: {
      domainReadiness: 0,
      cognitiveReadiness: 0,
      technicalReadiness: 0,
      careerReadiness: 0,
      lastSyncedAt: now,
    },
    learningVelocity: {
      velocity: { lessonsPerDay: 0, avgSessionMinutes: 0, conceptScore: 0, practiceScore: 0, retentionScore: 0, speedScore: 0, accuracyScore: 0, depthScore: 0, overall: 0, trend: 'stable' },
      weeklyXPTrend: [0, 0, 0, 0, 0, 0, 0],
      trend: 'stable',
      lastSyncedAt: now,
    },
    careerAlignment: {
      primaryTrackId: trackId,
      alignmentScore: 0,
      missingSkillIds: [],
      estimatedWeeks: 52,
      lastSyncedAt: now,
    },
    adaptive: {
      behaviorPattern: 'highlyEngaged',
      behaviorSignal: emptyBehaviorSignal,
      difficultyDirection: 'maintain',
      difficultyDecision: emptyDifficultyDecision,
      engagementScore: 0,
      engagementTrend: 'stable',
      shouldAccelerate: false,
      shouldSlow: false,
      pathAdjustments: null,
      isHydrated: false,
      lastSyncedAt: now,
    },
    lastFullSyncAt: now,
    syncCycleId: `cycle-${now}`,
    isStale: false,
  };
};
