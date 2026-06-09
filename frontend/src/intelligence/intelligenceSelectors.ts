// ── Intelligence Selectors ────────────────────────────────────────────────────
// Reusable derived intelligence queries.
// Pure functions — no UI, no side effects, no state mutations.
// Domain-agnostic: works for all 12 engineering domains.
// Compose existing types from types/, engine/, store/.

import type { UserIntelligenceState } from './userIntelligenceState';
import type { SkillNode, SkillCluster } from '../types/skill';
import type { RecommendationResult, AIInsight } from '../types/ai';
import type { LearningVelocity } from '../types/progression';
import type { BehaviorPattern, BehaviorSignal } from '../engine/behaviorEngine';
import type { DifficultyDecision, DifficultyDirection } from '../engine/difficultyEngine';
import type { LearningPathAdjustment } from '../engine/adaptiveEngine';

// ── Readiness selectors ───────────────────────────────────────────────────────

/**
 * Returns overall domain readiness (0-100).
 * Composite: roadmap readiness × 0.5 + technical readiness × 0.3 + cognitive × 0.2
 */
export const getCurrentReadiness = (state: UserIntelligenceState): number => {
  const roadmap   = state.roadmap.intelligence.readinessPct;
  const technical = state.readiness.technicalReadiness;
  const cognitive = state.readiness.cognitiveReadiness;
  return Math.round(roadmap * 0.5 + technical * 0.3 + cognitive * 0.2);
};

/**
 * Returns cognitive readiness from assessment engine (0-100).
 */
export const getCognitiveReadiness = (state: UserIntelligenceState): number =>
  state.assessments.state.cognitiveReadiness;

/**
 * Returns technical readiness from roadmap + course progress (0-100).
 */
export const getTechnicalReadiness = (state: UserIntelligenceState): number =>
  state.readiness.technicalReadiness;

/**
 * Returns career alignment score (0-100) for the active engineering track.
 */
export const getCareerAlignment = (state: UserIntelligenceState): number =>
  state.careerAlignment.alignmentScore;

/**
 * Returns estimated weeks to career readiness at current velocity.
 */
export const getCareerETA = (state: UserIntelligenceState): number =>
  state.careerAlignment.estimatedWeeks;

// ── Skill selectors ───────────────────────────────────────────────────────────

/**
 * Returns all skill nodes with a gap (weak/learning/locked, not mastered).
 * Sorted by gap severity: Critical → Moderate → Low.
 */
export const getWeakSkills = (state: UserIntelligenceState): SkillNode[] => {
  const GAP_ORDER = { Critical: 0, Moderate: 1, Low: 2, None: 3 };
  return state.skills.allNodes
    .filter(n => n.gap !== 'None')
    .sort((a, b) => GAP_ORDER[a.gap] - GAP_ORDER[b.gap]);
};

/**
 * Returns mastered skill nodes (confidence ≥ 80, status = 'mastered').
 */
export const getStrongSkills = (state: UserIntelligenceState): SkillNode[] =>
  state.skills.allNodes.filter(n => n.status === 'mastered');

/**
 * Returns critical-gap skill nodes only.
 */
export const getCriticalSkillGaps = (state: UserIntelligenceState): SkillNode[] =>
  state.skills.allNodes.filter(n => n.gap === 'Critical');

/**
 * Returns skill clusters with at least one weak skill, sorted by avg confidence ascending.
 */
export const getWeakSkillClusters = (state: UserIntelligenceState): SkillCluster[] =>
  state.skills.weakClusters.filter(c => c.weakCount > 0);

/**
 * Returns skill IDs that are ready to start (prerequisites met, not mastered).
 */
export const getNextSkillIds = (state: UserIntelligenceState): string[] =>
  state.skills.nextSkillIds;

// ── Recommendation selectors ──────────────────────────────────────────────────

/**
 * Returns ranked course recommendations from the recommendation slice.
 * If no ranked courses, falls back to nextCourse recommendation.
 */
export const getNextRecommendedCourses = (
  state: UserIntelligenceState,
  limit = 3
): RecommendationResult[] => {
  const results: RecommendationResult[] = [];
  if (state.recommendations.nextCourse) results.push(state.recommendations.nextCourse);
  if (state.recommendations.reinforcement) results.push(state.recommendations.reinforcement);
  return results.slice(0, limit);
};

/**
 * Returns the recommended next roadmap node, or null if none available.
 */
export const getNextRecommendedRoadmapNode = (
  state: UserIntelligenceState
): RecommendationResult | null => state.recommendations.nextRoadmapNode;

/**
 * Returns recommended skill reinforcement target.
 */
export const getRecommendedReinforcement = (
  state: UserIntelligenceState
): RecommendationResult | null => state.recommendations.reinforcement;

/**
 * Returns the AI-suggested difficulty level.
 */
export const getAdaptiveDifficulty = (
  state: UserIntelligenceState
): 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert' =>
  state.recommendations.difficulty?.suggestedLevel ?? 'Intermediate';

// ── Roadmap selectors ─────────────────────────────────────────────────────────

/**
 * Returns node IDs blocked by critical skill gaps on the critical path.
 */
export const getRoadmapRiskAreas = (state: UserIntelligenceState): string[] =>
  state.roadmap.blockedNodeIds;

/**
 * Returns node IDs that the learner can unlock right now.
 */
export const getUnlockableNodes = (state: UserIntelligenceState): string[] =>
  state.roadmap.unlockableNodeIds;

/**
 * Returns the estimated weeks to complete the current roadmap track.
 */
export const getRoadmapCompletionETA = (state: UserIntelligenceState): number =>
  state.roadmap.intelligence.estimatedCompletionWeeks;

/**
 * Returns roadmap readiness percentage (0-100).
 */
export const getRoadmapReadiness = (state: UserIntelligenceState): number =>
  state.roadmap.intelligence.readinessPct;

// ── Learning velocity selectors ───────────────────────────────────────────────

/**
 * Returns the full learning velocity snapshot.
 */
export const getLearningVelocitySummary = (state: UserIntelligenceState): LearningVelocity =>
  state.learningVelocity.velocity;

/**
 * Returns a labelled trend string: 'improving' | 'stable' | 'declining'.
 */
export const getVelocityTrend = (
  state: UserIntelligenceState
): 'improving' | 'stable' | 'declining' => state.learningVelocity.trend;

/**
 * Returns the 7-day XP trend as an array of daily totals, oldest first.
 */
export const getWeeklyXPTrend = (state: UserIntelligenceState): number[] =>
  state.learningVelocity.weeklyXPTrend;

// ── Mentor insights selectors ─────────────────────────────────────────────────

/**
 * Returns all active AI mentor insights, sorted by recency.
 */
export const getMentorInsights = (state: UserIntelligenceState): AIInsight[] =>
  [...state.mentorInsights.insights].sort((a, b) => b.createdAt - a.createdAt);

/**
 * Returns only HIGH confidence insights — suitable for urgent mentor alerts.
 */
export const getHighPriorityInsights = (state: UserIntelligenceState): AIInsight[] =>
  state.mentorInsights.insights.filter(i => i.confidence === 'high');

/**
 * Returns the AI mentor's context summary sentence.
 */
export const getMentorContextSummary = (state: UserIntelligenceState): string =>
  state.mentorInsights.contextSummary;

/**
 * Returns proactive topics the mentor should surface in the session.
 */
export const getMentorProactiveTopics = (state: UserIntelligenceState): string[] =>
  state.mentorInsights.proactiveTopics;

// ── Progression selectors ─────────────────────────────────────────────────────

/**
 * Returns the current XP level.
 */
export const getCurrentLevel = (state: UserIntelligenceState): number =>
  state.progression.xp.level;

/**
 * Returns the XP progress percentage within the current level (0-100).
 */
export const getLevelProgress = (state: UserIntelligenceState): number =>
  state.progression.xp.progressToNextLevel;

/**
 * Returns the active study streak in days.
 */
export const getStreak = (state: UserIntelligenceState): number =>
  state.progression.streak;

/**
 * Returns overall mastery score (0-100).
 */
export const getMasteryScore = (state: UserIntelligenceState): number =>
  state.progression.progress.masteryScore;

// ── Composite selectors ───────────────────────────────────────────────────────

/**
 * Returns a plain-English dashboard summary for the current intelligence state.
 * Domain-agnostic.
 */
export const getDashboardSummary = (state: UserIntelligenceState): {
  readiness: number;
  level: number;
  streak: number;
  masteryScore: number;
  weakSkillCount: number;
  unlockableNodeCount: number;
  topInsight: AIInsight | null;
} => ({
  readiness: getCurrentReadiness(state),
  level: getCurrentLevel(state),
  streak: getStreak(state),
  masteryScore: getMasteryScore(state),
  weakSkillCount: getWeakSkills(state).length,
  unlockableNodeCount: getUnlockableNodes(state).length,
  topInsight: getHighPriorityInsights(state)[0] ?? getMentorInsights(state)[0] ?? null,
});

/**
 * Returns true if the intelligence state is considered stale and needs re-sync.
 * Stale threshold: 5 minutes.
 */
export const isIntelligenceStale = (
  state: UserIntelligenceState,
  thresholdMs = 300_000
): boolean => state.isStale || Date.now() - state.lastFullSyncAt > thresholdMs;

// ── Adaptive Intelligence Selectors ──────────────────────────────────────────
// Read from state.adaptive — populated by adaptiveEngine on every cycle.
// Safe to call before hydration: all fields have default values.

/**
 * Returns the detected learner behavior pattern.
 * Default: 'highlyEngaged' until adaptive layer has run.
 */
export const getAdaptiveBehaviorPattern = (
  state: UserIntelligenceState
): BehaviorPattern => state.adaptive.behaviorPattern;

/**
 * Returns the full adaptive state slice.
 * Contains behavior signal, difficulty decision, engagement score, path adjustments.
 */
export const getAdaptiveState = (state: UserIntelligenceState) => state.adaptive;

/**
 * Returns the adaptive difficulty direction: 'increase' | 'decrease' | 'maintain'.
 * Use this to signal difficulty changes to Roadmap and Course UI without new controls.
 */
export const getAdaptiveDifficultyDirection = (
  state: UserIntelligenceState
): DifficultyDirection => state.adaptive.difficultyDirection;

/**
 * Returns the full difficulty decision, including reason and confidence.
 * Use in Roadmap and Courses to explain difficulty changes to the learner.
 */
export const getAdaptiveDifficultyDecision = (
  state: UserIntelligenceState
): DifficultyDecision => state.adaptive.difficultyDecision;

/**
 * Returns adaptive learning path adjustments.
 * Contains targetNodeIds, targetSkillIds, action, and urgency.
 * Roadmap consumers use this to highlight recommended next steps.
 */
export const getAdaptivePathAdjustments = (
  state: UserIntelligenceState
): LearningPathAdjustment | null => state.adaptive.pathAdjustments;

/**
 * Returns the behavior signal for the mentor UI.
 * Contains pattern, confidence, rationale, suggestedAction, and requiresMentorIntervention.
 */
export const getAdaptiveBehaviorSignal = (
  state: UserIntelligenceState
): BehaviorSignal => state.adaptive.behaviorSignal;

/**
 * Returns true if the adaptive layer has run at least once.
 * Use as a guard before consuming adaptive outputs.
 */
export const isAdaptiveHydrated = (state: UserIntelligenceState): boolean =>
  state.adaptive.isHydrated;

/**
 * Returns a human-readable adaptive focus label for the Dashboard.
 * Translates behavior pattern + difficulty direction into a single summary string.
 */
export const getAdaptiveFocusLabel = (state: UserIntelligenceState): string => {
  const { behaviorPattern, difficultyDirection, shouldAccelerate, shouldSlow } = state.adaptive;
  if (shouldSlow)        return 'Reinforcement mode — resolving skill gaps';
  if (shouldAccelerate)  return 'Acceleration mode — pushing to next level';
  if (difficultyDirection === 'increase') return 'Advancing — difficulty increasing';
  if (difficultyDirection === 'decrease') return 'Consolidating — difficulty reduced';
  const labels: Record<BehaviorPattern, string> = {
    struggling:    'Support mode — mentor guidance active',
    accelerating:  'High performance — advanced content unlocked',
    plateauing:    'Plateau detected — new challenge recommended',
    highlyEngaged: 'Engaged — maintaining strong momentum',
    inconsistent:  'Focus mode — improving retention',
  };
  return labels[behaviorPattern] ?? 'Learning in progress';
};

