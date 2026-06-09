// ── Progression Engine ────────────────────────────────────────────────────────
// Central XP, mastery, streak, and readiness authority.
// Pure utility functions — no UI, no state, no side effects.

import type { XPState, ProgressState, LearningVelocity } from '../types/progression';
import type { RoadmapNode } from '../data/roadmapConfigs';
import type { Lesson, CourseModule } from '../data/engineeringCourses';

// ── Constants ─────────────────────────────────────────────────────────────────
const XP_PER_LEVEL = 1000;
const STREAK_BONUS_MULTIPLIER = 0.05; // 5% XP bonus per streak day (cap 10 days)

// ── XP Calculations ───────────────────────────────────────────────────────────

/** Compute XP state from raw earned XP and streak */
export const computeXPState = (earnedXP: number, streak: number): XPState => {
  const level = Math.floor(earnedXP / XP_PER_LEVEL) + 1;
  const xpIntoLevel = earnedXP % XP_PER_LEVEL;
  return {
    total: earnedXP,
    level,
    nextLevelThreshold: level * XP_PER_LEVEL,
    progressToNextLevel: Math.round((xpIntoLevel / XP_PER_LEVEL) * 100),
    streak,
    weeklyXP: Math.min(earnedXP, 3500), // mock weekly cap
    allTimeXP: earnedXP,
  };
};

/** Apply streak bonus to a raw XP value */
export const applyStreakBonus = (xp: number, streak: number): number => {
  const bonus = Math.min(streak, 10) * STREAK_BONUS_MULTIPLIER;
  return Math.round(xp * (1 + bonus));
};

/** Sum XP from completed lessons */
export const sumCompletedLessonXP = (lessons: Lesson[]): number =>
  lessons.filter(l => l.status === 'completed').reduce((s, l) => s + l.xp, 0);

/** Sum XP from completed roadmap nodes */
export const sumCompletedNodeXP = (nodes: RoadmapNode[], completedIds: string[]): number => {
  const set = new Set(completedIds);
  return nodes.filter(n => set.has(n.id)).reduce((s, n) => s + n.xpReward, 0);
};

// ── Mastery & Readiness ───────────────────────────────────────────────────────

/**
 * Mastery score: weighted average of AI confidence across completed nodes.
 * Completed nodes with high confidence lift mastery; active nodes contribute partially.
 */
export const calcMasteryScore = (nodes: RoadmapNode[]): number => {
  const relevant = nodes.filter(n => n.status !== 'locked');
  if (relevant.length === 0) return 0;
  const weighted = relevant.map(n =>
    n.status === 'completed' ? n.aiConfidence : n.aiConfidence * 0.5
  );
  return Math.round(weighted.reduce((a, b) => a + b, 0) / weighted.length);
};

/**
 * Readiness percentage: fraction of nodes completed vs total.
 */
export const calcReadinessPct = (
  nodes: RoadmapNode[],
  completedNodeIds: string[]
): number => {
  if (nodes.length === 0) return 0;
  const set = new Set(completedNodeIds);
  return Math.round((nodes.filter(n => set.has(n.id)).length / nodes.length) * 100);
};

/** Module completion percentage */
export const calcModuleProgress = (module: CourseModule): number => {
  if (module.lessons.length === 0) return 0;
  return Math.round(
    (module.lessons.filter(l => l.status === 'completed').length / module.lessons.length) * 100
  );
};

// ── Unlock Thresholds ─────────────────────────────────────────────────────────

/**
 * Return node IDs that are currently unlockable (all deps completed, not yet active).
 */
export const getUnlockableNodes = (
  nodes: RoadmapNode[],
  completedIds: string[]
): string[] => {
  const completedSet = new Set(completedIds);
  return nodes
    .filter(n => n.status === 'locked' && n.dependencies.every(d => completedSet.has(d)))
    .map(n => n.id);
};

/** Whether a course module should be unlocked given the learner's completed modules */
export const isModuleUnlocked = (
  module: CourseModule,
  completedModuleIds: string[]
): boolean =>
  module.status !== 'locked' || completedModuleIds.includes(module.id);

// ── Streak ────────────────────────────────────────────────────────────────────

/**
 * Given a sorted array of activity timestamps (unix ms), compute streak in days.
 * Simple: counts consecutive days with at least one activity from today backwards.
 */
export const computeStreak = (activityTimestamps: number[]): number => {
  if (activityTimestamps.length === 0) return 0;
  const MS_PER_DAY = 86400000;
  const today = Math.floor(Date.now() / MS_PER_DAY);
  const days = new Set(activityTimestamps.map(t => Math.floor(t / MS_PER_DAY)));

  let streak = 0;
  let day = today;
  while (days.has(day)) {
    streak++;
    day--;
  }
  return streak;
};

// ── Estimated completion ──────────────────────────────────────────────────────

/**
 * Rough completion estimate in days given remaining hours and daily velocity.
 */
export const estimateCompletionDays = (
  remainingHours: number,
  avgDailyMinutes: number
): number => {
  if (avgDailyMinutes <= 0) return 999;
  return Math.ceil((remainingHours * 60) / avgDailyMinutes);
};

// ── Learning velocity ─────────────────────────────────────────────────────────

/**
 * Build a deterministic LearningVelocity snapshot from lesson history.
 * In production this would pull from a backend analytics service.
 */
export const computeLearningVelocity = (
  completedLessons: Lesson[],
  totalLessons: number,
  streak: number
): LearningVelocity => {
  const completionRate = totalLessons > 0
    ? completedLessons.length / totalLessons
    : 0;

  // Derive scores — deterministic from completion rate + streak
  const base = Math.round(completionRate * 80);
  const streakBoost = Math.min(streak * 2, 15);

  const conceptScore  = Math.min(100, base + 5 + streakBoost);
  const practiceScore = Math.min(100, base - 5 + streakBoost);
  const retentionScore = Math.min(100, base + streakBoost);
  const speedScore    = Math.min(100, base - 8 + streakBoost);
  const accuracyScore = Math.min(100, base + 3 + streakBoost);
  const depthScore    = Math.min(100, base - 12 + streakBoost);
  const overall       = Math.round((conceptScore + practiceScore + retentionScore + speedScore + accuracyScore + depthScore) / 6);

  return {
    lessonsPerDay: Math.max(0.5, streak > 0 ? completedLessons.length / Math.max(streak, 1) : 0.5),
    avgSessionMinutes: 35 + streak,
    conceptScore,
    practiceScore,
    retentionScore,
    speedScore,
    accuracyScore,
    depthScore,
    overall,
    trend: streak >= 5 ? 'up' : streak >= 2 ? 'stable' : 'down',
  };
};

// ── Progress state builder ────────────────────────────────────────────────────

export const buildProgressState = (params: {
  domainId: string;
  trackId: string;
  nodes: RoadmapNode[];
  completedLessons: Lesson[];
  completedModuleIds: string[];
  earnedXP: number;
}): ProgressState => ({
  domainId: params.domainId,
  trackId: params.trackId,
  completedNodeIds: params.nodes.filter(n => n.status === 'completed').map(n => n.id),
  completedLessonIds: params.completedLessons.map(l => l.id),
  completedModuleIds: params.completedModuleIds,
  earnedXP: params.earnedXP,
  readinessPct: calcReadinessPct(params.nodes, params.nodes.filter(n => n.status === 'completed').map(n => n.id)),
  masteryScore: calcMasteryScore(params.nodes),
});
