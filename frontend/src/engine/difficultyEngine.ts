// ── Difficulty Engine ─────────────────────────────────────────────────────────
// Determines adaptive difficulty adjustments from learner signals.
// Pure functions — no UI, no store mutations, no side effects.
// Composes evaluateDifficultyAdjustment from recommendationEngine.
// Does NOT re-implement the core evaluation logic.

import type { AdaptiveDifficultyState } from '../types/ai';
import type { LearningVelocity } from '../types/progression';
import type { SkillNode } from '../types/skill';
import { evaluateDifficultyAdjustment } from './recommendationEngine';
import { weightedAverage } from '../lib/scoring';

// ── Difficulty level ordering ─────────────────────────────────────────────────

export type DifficultyLevel = 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert';

const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  'Foundational', 'Intermediate', 'Advanced', 'Expert',
];

// ── Config-driven thresholds ──────────────────────────────────────────────────
// All thresholds in one place for easy tuning without touching logic.

export const DIFFICULTY_THRESHOLDS = {
  /** Mastery score above which difficulty should increase */
  increaseMinMastery: 85,
  /** Velocity overall above which difficulty should increase */
  increaseMinVelocity: 75,
  /** Mastery score below which difficulty should decrease */
  decreaseMaxMastery: 55,
  /** Retention score below which difficulty should decrease */
  decreaseMaxRetention: 60,
  /** Critical skill gap ratio that blocks difficulty increase (0-1) */
  criticalGapBlockThreshold: 0.3,
} as const;

// ── Direction types ────────────────────────────────────────────────────────────

export type DifficultyDirection = 'increase' | 'decrease' | 'maintain';

export interface DifficultyDecision {
  direction: DifficultyDirection;
  currentLevel: DifficultyLevel;
  targetLevel: DifficultyLevel;
  reason: string;
  /** 0-100: how confident the engine is in this adjustment */
  confidence: number;
  blockedBySkillGaps: boolean;
}

// ── Core evaluation (delegates to recommendationEngine) ───────────────────────

/**
 * Primary difficulty evaluation.
 * Delegates core logic to recommendationEngine.evaluateDifficultyAdjustment.
 * Returns the standard AdaptiveDifficultyState for compatibility with
 * the existing intelligence sync engine.
 */
export const evaluateDifficulty = (
  currentLevel: DifficultyLevel,
  velocity: LearningVelocity,
  masteryScore: number
): AdaptiveDifficultyState =>
  evaluateDifficultyAdjustment(currentLevel, velocity, masteryScore);

// ── Direction resolver ────────────────────────────────────────────────────────

/**
 * Resolve a difficulty direction from a computed AdaptiveDifficultyState.
 * Pure mapping — no recalculation.
 */
export const resolveDifficultyDirection = (
  state: AdaptiveDifficultyState
): DifficultyDirection => {
  const ci = DIFFICULTY_LEVELS.indexOf(state.currentLevel);
  const si = DIFFICULTY_LEVELS.indexOf(state.suggestedLevel);
  if (si > ci) return 'increase';
  if (si < ci) return 'decrease';
  return 'maintain';
};

// ── Skill-gap guard ───────────────────────────────────────────────────────────

/**
 * Returns true if critical skill gaps should block a difficulty increase.
 * A learner with >30% critical gaps should not advance difficulty even if
 * velocity and mastery metrics suggest otherwise.
 */
export const isBlockedBySkillGaps = (weakSkills: SkillNode[]): boolean => {
  if (weakSkills.length === 0) return false;
  const criticalCount = weakSkills.filter(s => s.gap === 'Critical').length;
  return criticalCount / weakSkills.length > DIFFICULTY_THRESHOLDS.criticalGapBlockThreshold;
};

// ── Composite difficulty decision ─────────────────────────────────────────────

/**
 * Compute a structured DifficultyDecision from all learner signals.
 * Composes evaluateDifficulty + skill-gap guard.
 * This is the primary function for the adaptive layer to consume.
 */
export const computeDifficultyDecision = (params: {
  currentLevel: DifficultyLevel;
  velocity: LearningVelocity;
  masteryScore: number;
  weakSkills: SkillNode[];
  readinessPct: number;
}): DifficultyDecision => {
  const { currentLevel, velocity, masteryScore, weakSkills, readinessPct } = params;

  const state = evaluateDifficulty(currentLevel, velocity, masteryScore);
  let direction = resolveDifficultyDirection(state);
  const blocked = isBlockedBySkillGaps(weakSkills);

  // Skill gaps block difficulty increase — override to maintain
  if (direction === 'increase' && blocked) {
    direction = 'maintain';
  }

  // Confidence: how aligned the signals are with the recommended direction
  const confidence = Math.round(weightedAverage([
    { score: masteryScore,       weight: 0.4 },
    { score: velocity.overall,   weight: 0.35 },
    { score: readinessPct,       weight: 0.25 },
  ]));

  const reason = blocked && direction === 'maintain'
    ? `Difficulty increase paused: ${weakSkills.filter(s => s.gap === 'Critical').length} critical skill gap(s) must be resolved first.`
    : state.adjustmentReason;

  return {
    direction,
    currentLevel,
    targetLevel: state.suggestedLevel,
    reason,
    confidence,
    blockedBySkillGaps: blocked,
  };
};

// ── Level navigation helpers ──────────────────────────────────────────────────

/** Get the next difficulty level above current, or current if already at Expert */
export const nextDifficultyLevel = (level: DifficultyLevel): DifficultyLevel => {
  const idx = DIFFICULTY_LEVELS.indexOf(level);
  return DIFFICULTY_LEVELS[Math.min(idx + 1, DIFFICULTY_LEVELS.length - 1)];
};

/** Get the previous difficulty level below current, or current if already Foundational */
export const prevDifficultyLevel = (level: DifficultyLevel): DifficultyLevel => {
  const idx = DIFFICULTY_LEVELS.indexOf(level);
  return DIFFICULTY_LEVELS[Math.max(idx - 1, 0)];
};

/** Numeric rank of a difficulty level (Foundational=0, Expert=3) */
export const difficultyRank = (level: DifficultyLevel): number =>
  DIFFICULTY_LEVELS.indexOf(level);
