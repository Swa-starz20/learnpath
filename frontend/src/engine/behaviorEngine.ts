// ── Behavior Engine ───────────────────────────────────────────────────────────
// Detects learner behavior patterns from intelligence signals.
// Pure functions — no UI, no store mutations, no side effects.
// Composes existing types from types/progression.ts, types/skill.ts.
// Does NOT recalculate velocity or mastery — reads them from inputs.

import type { LearningVelocity } from '../types/progression';
import type { SkillNode } from '../types/skill';
import { weightedAverage } from '../lib/scoring';

// ── Behavior pattern types ────────────────────────────────────────────────────

export type BehaviorPattern =
  | 'struggling'        // low mastery, declining velocity, critical gaps
  | 'accelerating'      // rising velocity, high mastery, milestone progress
  | 'plateauing'        // stable but not progressing — no new nodes unlocked
  | 'highlyEngaged'     // high streak + velocity, consistent sessions
  | 'inconsistent';     // erratic: good velocity but declining retention

// ── Config-driven detection thresholds ───────────────────────────────────────

export const BEHAVIOR_THRESHOLDS = {
  // Struggling
  strugglingMaxMastery:    55,
  strugglingMaxVelocity:   50,
  strugglingMinCritical:   1,    // at least 1 critical gap

  // Accelerating
  acceleratingMinMastery:  80,
  acceleratingMinVelocity: 70,
  acceleratingMinStreak:   5,

  // Plateauing
  plateauingMaxNewNodes:   0,    // no new nodes unlocked recently
  plateauingMinStreak:     3,    // still showing up, just not advancing
  plateauingMaxVelocity:   65,   // not high enough to be accelerating

  // Highly Engaged
  engagedMinStreak:        7,
  engagedMinVelocity:      65,
  engagedMinSessions:      0.8,  // lessonsPerDay relative threshold

  // Inconsistent
  inconsistentMaxRetention: 55,
  inconsistentMinVelocity:  55,  // decent speed but poor retention
} as const;

// ── Behavior signal ───────────────────────────────────────────────────────────

export interface BehaviorSignal {
  pattern: BehaviorPattern;
  /** 0-100 detection confidence */
  confidence: number;
  /** Human-readable explanation of why this pattern was detected */
  rationale: string;
  /** Recommended adaptive action category */
  suggestedAction:
    | 'reinforce_weak_skills'
    | 'reduce_difficulty'
    | 'increase_difficulty'
    | 'accelerate_roadmap'
    | 'trigger_mentor_check_in'
    | 'maintain_pace'
    | 'improve_consistency';
  /** Whether this pattern warrants a mentor intervention */
  requiresMentorIntervention: boolean;
}

// ── Individual pattern detectors (composable, deterministic) ──────────────────

/** Detect struggling learner: mastery below threshold, velocity declining, critical gaps present */
export const detectStruggling = (
  velocity: LearningVelocity,
  masteryScore: number,
  weakSkills: SkillNode[],
): boolean => {
  const criticalGaps = weakSkills.filter(s => s.gap === 'Critical').length;
  return (
    masteryScore < BEHAVIOR_THRESHOLDS.strugglingMaxMastery &&
    velocity.overall < BEHAVIOR_THRESHOLDS.strugglingMaxVelocity &&
    criticalGaps >= BEHAVIOR_THRESHOLDS.strugglingMinCritical
  );
};

/** Detect accelerating learner: strong mastery + velocity + active streak */
export const detectAccelerating = (
  velocity: LearningVelocity,
  masteryScore: number,
  streak: number,
): boolean =>
  masteryScore >= BEHAVIOR_THRESHOLDS.acceleratingMinMastery &&
  velocity.overall >= BEHAVIOR_THRESHOLDS.acceleratingMinVelocity &&
  streak >= BEHAVIOR_THRESHOLDS.acceleratingMinStreak;

/** Detect plateau: learner is consistent but no new roadmap progress */
export const detectPlateauing = (
  velocity: LearningVelocity,
  streak: number,
  recentlyUnlockedNodeCount: number,
): boolean =>
  streak >= BEHAVIOR_THRESHOLDS.plateauingMinStreak &&
  velocity.overall < BEHAVIOR_THRESHOLDS.plateauingMaxVelocity &&
  recentlyUnlockedNodeCount <= BEHAVIOR_THRESHOLDS.plateauingMaxNewNodes;

/** Detect highly engaged: high streak + solid velocity + regular sessions */
export const detectHighlyEngaged = (
  velocity: LearningVelocity,
  streak: number,
): boolean =>
  streak >= BEHAVIOR_THRESHOLDS.engagedMinStreak &&
  velocity.overall >= BEHAVIOR_THRESHOLDS.engagedMinVelocity &&
  velocity.lessonsPerDay >= BEHAVIOR_THRESHOLDS.engagedMinSessions;

/** Detect inconsistency: reasonable velocity but poor retention */
export const detectInconsistent = (velocity: LearningVelocity): boolean =>
  velocity.overall >= BEHAVIOR_THRESHOLDS.inconsistentMinVelocity &&
  velocity.retentionScore < BEHAVIOR_THRESHOLDS.inconsistentMaxRetention;

// ── Primary behavior classification ──────────────────────────────────────────

/**
 * Classify a learner's behavior pattern from all available intelligence signals.
 * Priority order: struggling → accelerating → highlyEngaged → plateauing → inconsistent.
 * The first matching pattern wins to ensure a single deterministic classification.
 *
 * Inputs are consumed from the intelligence sync engine's state slices —
 * do NOT recalculate velocity or mastery here.
 */
export const classifyBehavior = (params: {
  velocity: LearningVelocity;
  masteryScore: number;
  streak: number;
  weakSkills: SkillNode[];
  recentlyUnlockedNodeCount: number;
}): BehaviorSignal => {
  const { velocity, masteryScore, streak, weakSkills, recentlyUnlockedNodeCount } = params;

  // ── 1. Struggling (highest priority — requires immediate intervention) ──────
  if (detectStruggling(velocity, masteryScore, weakSkills)) {
    const criticalCount = weakSkills.filter(s => s.gap === 'Critical').length;
    const confidence = Math.round(weightedAverage([
      { score: 100 - masteryScore,               weight: 0.4 },
      { score: 100 - velocity.overall,           weight: 0.35 },
      { score: Math.min(criticalCount * 25, 100), weight: 0.25 },
    ]));
    return {
      pattern: 'struggling',
      confidence,
      rationale: `Mastery ${masteryScore}%, velocity ${velocity.overall}%, ${criticalCount} critical skill gap(s). Immediate reinforcement required.`,
      suggestedAction: masteryScore < 40 ? 'reduce_difficulty' : 'reinforce_weak_skills',
      requiresMentorIntervention: true,
    };
  }

  // ── 2. Accelerating ──────────────────────────────────────────────────────────
  if (detectAccelerating(velocity, masteryScore, streak)) {
    const confidence = Math.round(weightedAverage([
      { score: masteryScore,       weight: 0.4 },
      { score: velocity.overall,   weight: 0.35 },
      { score: Math.min(streak * 8, 100), weight: 0.25 },
    ]));
    return {
      pattern: 'accelerating',
      confidence,
      rationale: `Mastery ${masteryScore}%, velocity ${velocity.overall}%, ${streak}-day streak. Learner is primed for advanced challenges.`,
      suggestedAction: 'increase_difficulty',
      requiresMentorIntervention: false,
    };
  }

  // ── 3. Highly Engaged ────────────────────────────────────────────────────────
  if (detectHighlyEngaged(velocity, streak)) {
    const confidence = Math.round(weightedAverage([
      { score: Math.min(streak * 10, 100), weight: 0.4 },
      { score: velocity.overall,           weight: 0.35 },
      { score: velocity.practiceScore,     weight: 0.25 },
    ]));
    return {
      pattern: 'highlyEngaged',
      confidence,
      rationale: `${streak}-day streak, ${velocity.overall}% velocity, ${velocity.lessonsPerDay.toFixed(1)} lessons/day. Strong consistent engagement.`,
      suggestedAction: 'accelerate_roadmap',
      requiresMentorIntervention: false,
    };
  }

  // ── 4. Plateauing ────────────────────────────────────────────────────────────
  if (detectPlateauing(velocity, streak, recentlyUnlockedNodeCount)) {
    const confidence = Math.round(weightedAverage([
      { score: Math.min(streak * 10, 100), weight: 0.4 },
      { score: 100 - velocity.overall,    weight: 0.3 },
      { score: 70,                         weight: 0.3 }, // base — plateau is soft signal
    ]));
    return {
      pattern: 'plateauing',
      confidence,
      rationale: `${streak}-day streak but ${recentlyUnlockedNodeCount} new nodes unlocked recently. Velocity ${velocity.overall}% — progress has stalled.`,
      suggestedAction: 'trigger_mentor_check_in',
      requiresMentorIntervention: true,
    };
  }

  // ── 5. Inconsistent ──────────────────────────────────────────────────────────
  if (detectInconsistent(velocity)) {
    const confidence = Math.round(weightedAverage([
      { score: velocity.overall,                  weight: 0.35 },
      { score: 100 - velocity.retentionScore,     weight: 0.45 },
      { score: 60,                                weight: 0.2 },
    ]));
    return {
      pattern: 'inconsistent',
      confidence,
      rationale: `Velocity ${velocity.overall}% but retention ${velocity.retentionScore}% — moving fast but not retaining. Consolidation sessions needed.`,
      suggestedAction: 'improve_consistency',
      requiresMentorIntervention: velocity.retentionScore < 40,
    };
  }

  // ── Default: maintain pace ────────────────────────────────────────────────────
  return {
    pattern: 'highlyEngaged', // closest neutral positive state
    confidence: 60,
    rationale: `Balanced performance: mastery ${masteryScore}%, velocity ${velocity.overall}%, ${streak}-day streak.`,
    suggestedAction: 'maintain_pace',
    requiresMentorIntervention: false,
  };
};

// ── Multi-signal engagement score ─────────────────────────────────────────────

/**
 * Composite engagement score (0-100) from all available signals.
 * Reuses velocity scores from progressionEngine — no re-derivation.
 */
export const computeEngagementScore = (
  velocity: LearningVelocity,
  streak: number,
  completedCount: number,
  totalCount: number,
): number => {
  const completionRate = totalCount > 0
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  return Math.round(weightedAverage([
    { score: velocity.overall,      weight: 0.35 },
    { score: velocity.practiceScore, weight: 0.20 },
    { score: Math.min(streak * 8, 100), weight: 0.25 },
    { score: completionRate,         weight: 0.20 },
  ]));
};

// ── Engagement trend ──────────────────────────────────────────────────────────

/**
 * Maps the existing LearningVelocity trend to a richer engagement trend.
 * Avoids duplicating trend calculation from progressionEngine.
 */
export const engagementTrend = (
  velocity: LearningVelocity,
): 'improving' | 'stable' | 'declining' =>
  velocity.trend === 'up' ? 'improving' :
  velocity.trend === 'down' ? 'declining' : 'stable';
