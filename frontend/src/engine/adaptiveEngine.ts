// ── Adaptive Engine ───────────────────────────────────────────────────────────
// Central orchestration layer for the Adaptive Intelligence Behavior Layer.
// Composes: progressionEngine, recommendationEngine, skillGraphEngine,
//           intelligenceSyncEngine, difficultyEngine, behaviorEngine, mentorEngine.
// Pure functions — no UI, no direct store mutations.
// Designed to be called from the intelligenceSyncEngine on each intelligence cycle.

import type { LearningVelocity } from '../types/progression';
import type { SkillNode } from '../types/skill';
import type { AdaptiveDifficultyState, AIInsight, RecommendationResult } from '../types/ai';
import type { RoadmapNode } from '../data/roadmapConfigs';
import type { EngineeringCourse } from '../data/engineeringCourses';
import type { DomainId } from '../data/engineeringDomains';

// ── Existing engines (reuse, never re-implement) ──────────────────────────────
import {
  buildRecommendationBundle,
} from './recommendationEngine';
import {
  getUnlockableNodes,
} from './progressionEngine';
import {
  getNextRecommendedSkills,
} from './skillGraphEngine';
import { getIntelligenceState } from '../intelligence/intelligenceSyncEngine';

// ── New adaptive engines ──────────────────────────────────────────────────────
import {
  computeDifficultyDecision,
  nextDifficultyLevel,
  prevDifficultyLevel,
  type DifficultyDecision,
  type DifficultyLevel,
} from './difficultyEngine';
import {
  classifyBehavior,
  computeEngagementScore,
  engagementTrend,
  type BehaviorSignal,
  type BehaviorPattern,
} from './behaviorEngine';
import {
  buildMentorGuidanceBundle,
  type MentorGuidanceBundle,
} from './mentorEngine';

// ── Adaptive state types ──────────────────────────────────────────────────────

/** Complete adaptive evaluation of a learner's current state */
export interface AdaptiveState {
  domainId: DomainId;
  behavior: BehaviorSignal;
  difficulty: DifficultyDecision;
  engagementScore: number;
  engagementTrend: 'improving' | 'stable' | 'declining';
  /** Whether the learner should advance on the roadmap */
  shouldAccelerate: boolean;
  /** Whether roadmap progression should be slowed */
  shouldSlow: boolean;
  evaluatedAt: number;
}

/** Adaptive recommendation output — enriched with behavior context */
export interface AdaptiveRecommendations {
  nextCourse: RecommendationResult | null;
  nextRoadmapNode: RecommendationResult | null;
  reinforcement: RecommendationResult | null;
  difficulty: AdaptiveDifficultyState;
  insights: AIInsight[];
  /** Behavior-adjusted urgency override for the primary recommendation */
  behaviorPattern: BehaviorPattern;
}

/** Adaptive learning path adjustment suggestion */
export interface LearningPathAdjustment {
  action:
    | 'accelerate_roadmap_progression'
    | 'slow_roadmap_progression'
    | 'unlock_advanced_content'
    | 'prioritize_skill_reinforcement'
    | 'maintain_current_path';
  reason: string;
  targetNodeIds: string[];
  targetSkillIds: string[];
  newDifficultyLevel: DifficultyLevel;
  urgency: 'high' | 'medium' | 'low';
}

// ── Input contract ────────────────────────────────────────────────────────────

export interface AdaptiveEngineInput {
  domainId: DomainId;
  velocity: LearningVelocity;
  masteryScore: number;
  readinessPct: number;
  streak: number;
  weakSkills: SkillNode[];
  allNodes: RoadmapNode[];
  completedNodeIds: string[];
  courses: EngineeringCourse[];
  currentDifficulty: DifficultyLevel;
  assessmentScore: number;
  unlockedNodeCount: number;
  estimatedCompletionWeeks: number;
}

// ── 1. evaluateAdaptiveState ──────────────────────────────────────────────────

/**
 * Aggregate all intelligence signals into a structured AdaptiveState.
 * This is the primary entry point for adaptive behavior evaluation.
 *
 * Consumes: behaviorEngine, difficultyEngine, progressionEngine outputs.
 * Does NOT mutate any store or state.
 */
export const evaluateAdaptiveState = (input: AdaptiveEngineInput): AdaptiveState => {
  const {
    domainId, velocity, masteryScore, readinessPct, streak,
    weakSkills, allNodes, completedNodeIds,
    currentDifficulty, unlockedNodeCount,
  } = input;

  // Classify behavior pattern
  const behavior = classifyBehavior({
    velocity,
    masteryScore,
    streak,
    weakSkills,
    recentlyUnlockedNodeCount: unlockedNodeCount,
  });

  // Compute difficulty decision
  const difficulty = computeDifficultyDecision({
    currentLevel: currentDifficulty,
    velocity,
    masteryScore,
    weakSkills,
    readinessPct,
  });

  // Engagement metrics
  const completedCount = completedNodeIds.length;
  const totalCount = allNodes.length;
  const score = computeEngagementScore(velocity, streak, completedCount, totalCount);
  const trend = engagementTrend(velocity);

  // Path decisions
  const shouldAccelerate =
    behavior.pattern === 'accelerating' || behavior.pattern === 'highlyEngaged';
  const shouldSlow =
    behavior.pattern === 'struggling';

  return {
    domainId,
    behavior,
    difficulty,
    engagementScore: score,
    engagementTrend: trend,
    shouldAccelerate,
    shouldSlow,
    evaluatedAt: Date.now(),
  };
};

// ── 2. generateAdaptiveRecommendations ───────────────────────────────────────

/**
 * Generate adaptive recommendations enriched with behavior context.
 * Delegates recommendation logic to recommendationEngine — no duplication.
 * Adjusts urgency based on detected behavior pattern.
 */
export const generateAdaptiveRecommendations = (
  input: AdaptiveEngineInput,
  adaptiveState: AdaptiveState,
): AdaptiveRecommendations => {
  const {
    courses, allNodes, completedNodeIds, weakSkills,
    velocity, masteryScore, readinessPct, currentDifficulty,
    assessmentScore, domainId,
  } = input;

  const activeNode = allNodes.find(n => n.status === 'active');
  const activeNodeSkills = activeNode?.skills ?? [];

  // Reuse existing recommendation bundle — no logic duplication
  const bundle = buildRecommendationBundle({
    courses,
    roadmapNodes: allNodes,
    completedNodeIds,
    weakSkills,
    activeNodeSkills,
    assessmentScore,
    velocity,
    masteryScore,
    readinessPct,
    currentDifficulty,
    domainId,
  });

  // Behavior-adjusted insight: prepend behavior-specific insight to front
  const behaviorInsight = buildBehaviorInsight(adaptiveState.behavior);
  const allInsights = behaviorInsight
    ? [behaviorInsight, ...bundle.insights]
    : bundle.insights;

  // Urgency override for struggling learners: escalate reinforcement
  const reinforcement = bundle.reinforcement
    ? {
        ...bundle.reinforcement,
        urgency: adaptiveState.behavior.pattern === 'struggling'
          ? 'high' as const
          : bundle.reinforcement.urgency,
      }
    : null;

  return {
    nextCourse: bundle.course,
    nextRoadmapNode: bundle.roadmapNode,
    reinforcement,
    difficulty: bundle.difficulty,
    insights: allInsights,
    behaviorPattern: adaptiveState.behavior.pattern,
  };
};

// ── 3. generateAdaptiveMentorContext ─────────────────────────────────────────

/**
 * Generate a complete mentor guidance bundle from adaptive state.
 * Delegates to mentorEngine — this function only orchestrates the inputs.
 * Returns a MentorGuidanceBundle compatible with existing mentor workflows.
 */
export const generateAdaptiveMentorContext = (
  input: AdaptiveEngineInput,
  adaptiveState: AdaptiveState,
): MentorGuidanceBundle => {
  const {
    weakSkills, velocity, masteryScore, readinessPct,
    streak, unlockedNodeCount, estimatedCompletionWeeks, allNodes,
  } = input;

  const upcomingMilestones = allNodes.filter(
    n => n.isKeyMilestone && n.status !== 'completed'
  );

  return buildMentorGuidanceBundle({
    behavior:                adaptiveState.behavior,
    difficultyDecision:      adaptiveState.difficulty,
    weakSkills,
    velocity,
    masteryScore,
    readinessPct,
    streak,
    unlockedNodeCount,
    estimatedCompletionWeeks,
    upcomingMilestones,
  });
};

// ── 4. determineLearningPathAdjustments ──────────────────────────────────────

/**
 * Determine concrete learning path adjustments from adaptive state.
 * Returns a structured action the platform can apply to roadmap/course progression.
 * Does NOT mutate roadmap state — returns a description of what should change.
 */
export const determineLearningPathAdjustments = (
  input: AdaptiveEngineInput,
  adaptiveState: AdaptiveState,
): LearningPathAdjustment => {
  const { allNodes, completedNodeIds, weakSkills, currentDifficulty } = input;
  const { behavior, difficulty, shouldAccelerate, shouldSlow } = adaptiveState;

  // Determine unlockable nodes (reuse progressionEngine)
  const unlockableIds = getUnlockableNodes(allNodes, completedNodeIds);

  // Determine skill IDs to prioritize
  const skillNodeMap = Object.fromEntries(
    input.weakSkills.map(n => [n.id, n])
  );
  const prioritySkillIds = getNextRecommendedSkills(weakSkills, skillNodeMap, 4)
    .map(n => n.id);

  // ── Struggling: prioritize skill reinforcement ──────────────────────────────
  if (shouldSlow) {
    return {
      action: 'prioritize_skill_reinforcement',
      reason: behavior.rationale,
      targetNodeIds: [],        // pause roadmap advancement
      targetSkillIds: prioritySkillIds,
      newDifficultyLevel: prevDifficultyLevel(currentDifficulty),
      urgency: 'high',
    };
  }

  // ── Accelerating / Highly Engaged: unlock advanced content ─────────────────
  if (shouldAccelerate) {
    // Prefer milestone nodes in unlockable set
    const milestoneIds = allNodes
      .filter(n => unlockableIds.includes(n.id) && n.isKeyMilestone)
      .map(n => n.id);

    const targetIds = milestoneIds.length > 0
      ? milestoneIds
      : unlockableIds.slice(0, 3);

    const newLevel = difficulty.direction === 'increase'
      ? nextDifficultyLevel(currentDifficulty)
      : currentDifficulty;

    return {
      action: unlockableIds.length > 0
        ? 'accelerate_roadmap_progression'
        : 'unlock_advanced_content',
      reason: behavior.rationale,
      targetNodeIds: targetIds,
      targetSkillIds: [],
      newDifficultyLevel: newLevel,
      urgency: 'medium',
    };
  }

  // ── Plateauing: gentle push toward next unlockable node ────────────────────
  if (behavior.pattern === 'plateauing') {
    return {
      action: unlockableIds.length > 0
        ? 'accelerate_roadmap_progression'
        : 'prioritize_skill_reinforcement',
      reason: `Progress stalled — ${unlockableIds.length} node(s) available to unlock.`,
      targetNodeIds: unlockableIds.slice(0, 2),
      targetSkillIds: prioritySkillIds.slice(0, 2),
      newDifficultyLevel: currentDifficulty,
      urgency: 'medium',
    };
  }

  // ── Default: maintain current path ─────────────────────────────────────────
  return {
    action: 'maintain_current_path',
    reason: behavior.rationale,
    targetNodeIds: unlockableIds.slice(0, 1),
    targetSkillIds: prioritySkillIds.slice(0, 2),
    newDifficultyLevel: difficulty.targetLevel,
    urgency: 'low',
  };
};

// ── Internal helper ───────────────────────────────────────────────────────────

/**
 * Build a behavior-specific AIInsight for injection into the recommendations bundle.
 * Converts BehaviorSignal into the standard AIInsight shape for compatibility.
 */
const buildBehaviorInsight = (
  behavior: BehaviorSignal,
): AIInsight | null => {
  if (behavior.pattern === 'highlyEngaged') return null; // no extra noise for positive state

  const insightTypeMap: Record<BehaviorPattern, AIInsight['type']> = {
    struggling:     'velocity_drop',
    accelerating:   'unlock_ready',
    plateauing:     'milestone_alert',
    highlyEngaged:  'roadmap_sync',
    inconsistent:   'velocity_drop',
  };

  return {
    id: `behavior-${behavior.pattern}-${Date.now()}`,
    type: insightTypeMap[behavior.pattern],
    message: behavior.rationale.split('—')[0]?.trim() ?? behavior.rationale,
    detail: behavior.rationale,
    confidence: behavior.confidence >= 75 ? 'high' : behavior.confidence >= 50 ? 'medium' : 'low',
    actionLabel: behavior.suggestedAction.replace(/_/g, ' '),
    actionTarget: behavior.requiresMentorIntervention ? '/mentor' : '/roadmap',
    createdAt: Date.now(),
  };
};

// ── Convenience: full adaptive cycle from intelligence state ──────────────────

/**
 * Run a complete adaptive cycle using the current intelligence state.
 * Convenience wrapper — reads from intelligenceSyncEngine singleton.
 * Returns null if intelligence state hasn't been initialized yet.
 */
export const runAdaptiveCycle = (): {
  state: AdaptiveState;
  recommendations: AdaptiveRecommendations;
  mentorContext: MentorGuidanceBundle;
  pathAdjustments: LearningPathAdjustment;
} | null => {
  const intel = getIntelligenceState();
  if (!intel) return null;

  const input: AdaptiveEngineInput = {
    domainId: intel.domainId,
    velocity: intel.learningVelocity.velocity,
    masteryScore: intel.progression.progress.masteryScore,
    readinessPct: intel.roadmap.intelligence.readinessPct,
    streak: intel.progression.streak,
    weakSkills: intel.skills.allNodes.filter(s => s.gap !== 'None'),
    allNodes: [],   // roadmap nodes: resolved at call site via DOMAIN_ROADMAP_CONFIGS
    completedNodeIds: intel.progression.progress.completedNodeIds,
    courses: [],    // resolved at call site via getCoursesForDomain
    currentDifficulty: (intel.recommendations.difficulty?.currentLevel ?? 'Intermediate') as DifficultyLevel,
    assessmentScore: intel.assessments.overallReadiness,
    unlockedNodeCount: intel.roadmap.unlockableNodeIds.length,
    estimatedCompletionWeeks: intel.roadmap.intelligence.estimatedCompletionWeeks,
  };

  const state = evaluateAdaptiveState(input);
  const recommendations = generateAdaptiveRecommendations(input, state);
  const mentorContext = generateAdaptiveMentorContext(input, state);
  const pathAdjustments = determineLearningPathAdjustments(input, state);

  return { state, recommendations, mentorContext, pathAdjustments };
};
