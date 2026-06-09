// ── Mentor Engine ─────────────────────────────────────────────────────────────
// Generates structured mentor guidance from adaptive behavior signals.
// Pure functions — no LLM calls, no UI logic, no store mutations.
// Composes BehaviorSignal, DifficultyDecision, and existing AIInsight type.

import type { AIInsight } from '../types/ai';
import type { SkillNode } from '../types/skill';
import type { LearningVelocity } from '../types/progression';
import type { RoadmapNode } from '../data/roadmapConfigs';
import type { BehaviorSignal, BehaviorPattern } from './behaviorEngine';
import type { DifficultyDecision, DifficultyLevel } from './difficultyEngine';

// ── Mentor guidance types ─────────────────────────────────────────────────────

export type MentorGuidanceKind =
  | 'reinforcement'       // address critical skill gaps
  | 'intervention'        // struggling: mentor check-in needed
  | 'advanced_challenge'  // high performers: push harder
  | 'pacing_adjustment'   // roadmap speed change suggestion
  | 'consistency_nudge'   // inconsistent learner: session frequency
  | 'milestone_push';     // close to milestone: motivational nudge

export interface MentorGuidance {
  kind: MentorGuidanceKind;
  title: string;
  message: string;
  detail: string;
  /** AI confidence 0-100 */
  confidence: number;
  urgency: 'high' | 'medium' | 'low';
  /** Route to direct the learner */
  actionTarget: string;
  actionLabel: string;
  /** Converts to AIInsight for use in existing mentor workflows */
  toInsight: () => AIInsight;
}

// ── Guidance factory ──────────────────────────────────────────────────────────

const makeGuidance = (
  kind: MentorGuidanceKind,
  title: string,
  message: string,
  detail: string,
  urgency: 'high' | 'medium' | 'low',
  confidence: number,
  actionTarget: string,
  actionLabel: string,
): MentorGuidance => ({
  kind,
  title,
  message,
  detail,
  confidence,
  urgency,
  actionTarget,
  actionLabel,
  toInsight: (): AIInsight => ({
    id: `mentor-${kind}-${Date.now()}`,
    type: kind === 'intervention' || kind === 'reinforcement'
      ? 'skill_gap'
      : kind === 'pacing_adjustment'
      ? 'roadmap_sync'
      : kind === 'milestone_push'
      ? 'milestone_alert'
      : 'velocity_drop',
    message,
    detail,
    confidence: confidence >= 75 ? 'high' : confidence >= 50 ? 'medium' : 'low',
    actionLabel,
    actionTarget,
    createdAt: Date.now(),
  }),
});

// ── Reinforcement guidance ────────────────────────────────────────────────────

/**
 * Generate reinforcement guidance for critical/moderate skill gaps.
 * Used for: struggling, inconsistent learners.
 */
export const generateReinforcementGuidance = (
  weakSkills: SkillNode[],
  behaviorConfidence: number,
): MentorGuidance | null => {
  const critical = weakSkills.filter(s => s.gap === 'Critical');
  const moderate = weakSkills.filter(s => s.gap === 'Moderate');
  const target = critical[0] ?? moderate[0];

  if (!target) return null;

  const skillCount = critical.length + moderate.length;
  const urgency: 'high' | 'medium' | 'low' =
    critical.length > 0 ? 'high' : moderate.length > 2 ? 'medium' : 'low';

  return makeGuidance(
    'reinforcement',
    'Skill Reinforcement Needed',
    `${skillCount} skill gap${skillCount > 1 ? 's' : ''} detected — focus on ${target.label}`,
    `${critical.length} critical and ${moderate.length} moderate gaps are slowing your progression. ` +
    `Start with "${target.label}" (${target.confidence}% confidence) to unblock dependent topics.`,
    urgency,
    behaviorConfidence,
    '/courses',
    'Find Reinforcement Course',
  );
};

// ── Intervention guidance ─────────────────────────────────────────────────────

/**
 * Generate mentor intervention guidance for struggling or plateauing learners.
 * Triggered when requiresMentorIntervention = true in BehaviorSignal.
 */
export const generateInterventionGuidance = (
  pattern: BehaviorPattern,
  velocity: LearningVelocity,
  masteryScore: number,
  behaviorConfidence: number,
): MentorGuidance => {
  const isStruggling = pattern === 'struggling';

  const title = isStruggling
    ? 'Mentor Check-In Recommended'
    : 'Learning Plateau Detected';

  const message = isStruggling
    ? `Velocity at ${velocity.overall}% with mastery ${masteryScore}% — you need targeted support`
    : `Progress has stalled — ${velocity.overall}% velocity but no new roadmap nodes recently`;

  const detail = isStruggling
    ? 'Your AI Mentor has personalized guidance ready. Shorter, focused sessions with direct mentor feedback can reverse this trend quickly.'
    : 'You\'re showing up consistently but not advancing. Your mentor can help identify the block and suggest the next breakthrough step.';

  return makeGuidance(
    'intervention',
    title,
    message,
    detail,
    'high',
    behaviorConfidence,
    '/mentor',
    'Talk to AI Mentor',
  );
};

// ── Advanced challenge guidance ───────────────────────────────────────────────

/**
 * Generate advanced challenge guidance for accelerating and highly engaged learners.
 * Suggests increasing difficulty or unlocking advanced labs/content.
 */
export const generateAdvancedChallengeGuidance = (
  difficultyDecision: DifficultyDecision,
  nextLevel: DifficultyLevel,
  behaviorConfidence: number,
): MentorGuidance =>
  makeGuidance(
    'advanced_challenge',
    'Ready for Advanced Content',
    `Performance signals suggest you should move to ${nextLevel} difficulty`,
    difficultyDecision.blockedBySkillGaps
      ? `You're performing well overall, but resolving ${
          difficultyDecision.reason.match(/\d+/)?.[0] ?? 'some'
        } critical skill gap(s) will fully unlock the next challenge tier.`
      : `Mastery and velocity are both strong. Advancing to ${nextLevel} will accelerate your career readiness and challenge your depth of knowledge.`,
    difficultyDecision.blockedBySkillGaps ? 'medium' : 'high',
    behaviorConfidence,
    '/roadmap',
    'Explore Advanced Track',
  );

// ── Roadmap pacing guidance ───────────────────────────────────────────────────

/**
 * Generate roadmap pacing suggestion based on behavior and completion velocity.
 * Does not modify roadmap state — returns a guidance object only.
 */
export const generatePacingGuidance = (
  pattern: BehaviorPattern,
  readinessPct: number,
  estimatedCompletionWeeks: number,
  unlockedNodeCount: number,
): MentorGuidance => {
  const isAccelerating = pattern === 'accelerating' || pattern === 'highlyEngaged';

  const title = isAccelerating ? 'Accelerate Your Roadmap' : 'Pace Your Learning';
  const message = isAccelerating
    ? `${unlockedNodeCount} node${unlockedNodeCount !== 1 ? 's' : ''} ready — you're on track to finish ${estimatedCompletionWeeks < 20 ? 'ahead of schedule' : 'on schedule'}`
    : `Currently at ${readinessPct}% roadmap readiness — consistent daily sessions will keep you on track`;

  const detail = isAccelerating
    ? `Your current trajectory puts career readiness at ${readinessPct}%. Unlocking queued nodes now maximizes your momentum.`
    : `Estimated ${estimatedCompletionWeeks} weeks to completion. Short daily sessions compound faster than long infrequent ones.`;

  return makeGuidance(
    'pacing_adjustment',
    title,
    message,
    detail,
    isAccelerating ? 'medium' : 'low',
    isAccelerating ? 85 : 70,
    '/roadmap',
    isAccelerating ? 'Continue Roadmap' : 'View Schedule',
  );
};

// ── Milestone nudge guidance ──────────────────────────────────────────────────

/**
 * Generate motivational milestone push guidance when a learner is close to a milestone.
 * Uses existing roadmap node data — no new calculations.
 */
export const generateMilestonePushGuidance = (
  upcomingMilestones: RoadmapNode[],
): MentorGuidance | null => {
  const next = upcomingMilestones[0];
  if (!next) return null;

  return makeGuidance(
    'milestone_push',
    'Milestone Within Reach',
    `"${next.title}" milestone is your next major checkpoint`,
    `Completing this milestone unlocks +${next.xpReward} XP and advances your career track significantly. Focus on its prerequisites to unlock it.`,
    'medium',
    88,
    '/roadmap',
    'View Milestone',
  );
};

// ── Context summary generator ─────────────────────────────────────────────────

/**
 * Generate a single plain-English context summary sentence for the AI Mentor greeting.
 * Composable with MentorPage and AIContextPanel.
 * Replaces static strings — no LLM required.
 */
export const generateMentorContextSummary = (params: {
  pattern: BehaviorPattern;
  masteryScore: number;
  readinessPct: number;
  streak: number;
  criticalGapCount: number;
  unlockedNodeCount: number;
}): string => {
  const { pattern, masteryScore, readinessPct, streak, criticalGapCount, unlockedNodeCount } = params;

  const snippets: Record<BehaviorPattern, string> = {
    struggling:
      `Mastery at ${masteryScore}% with ${criticalGapCount} critical gap(s) — reinforcement sessions recommended.`,
    accelerating:
      `Strong momentum: ${masteryScore}% mastery, ${readinessPct}% roadmap, ${streak}-day streak. Ready to advance.`,
    plateauing:
      `Consistent ${streak}-day streak but roadmap progress has slowed — ${unlockedNodeCount} nodes unlocked recently.`,
    highlyEngaged:
      `Excellent engagement: ${streak}-day streak, ${readinessPct}% readiness. Keep this momentum.`,
    inconsistent:
      `Good velocity but retention needs attention. Shorter, spaced sessions will improve recall.`,
  };

  return snippets[pattern] ??
    `Readiness: ${readinessPct}%. Mastery: ${masteryScore}%. Streak: ${streak} days.`;
};

// ── Composite guidance bundle ─────────────────────────────────────────────────

export interface MentorGuidanceBundle {
  primary: MentorGuidance | null;
  secondary: MentorGuidance | null;
  contextSummary: string;
  proactiveTopics: string[];
  /** All guidance items converted to AIInsight[] for compatibility with existing mentor workflows */
  insights: AIInsight[];
}

/**
 * Build a complete mentor guidance bundle from all adaptive signals.
 * This is the primary function for the adaptiveEngine to consume.
 * All sub-functions are composable and individually testable.
 */
export const buildMentorGuidanceBundle = (params: {
  behavior: BehaviorSignal;
  difficultyDecision: DifficultyDecision;
  weakSkills: SkillNode[];
  velocity: LearningVelocity;
  masteryScore: number;
  readinessPct: number;
  streak: number;
  unlockedNodeCount: number;
  estimatedCompletionWeeks: number;
  upcomingMilestones: RoadmapNode[];
}): MentorGuidanceBundle => {
  const {
    behavior, difficultyDecision, weakSkills, velocity,
    masteryScore, readinessPct, streak,
    unlockedNodeCount, estimatedCompletionWeeks, upcomingMilestones,
  } = params;

  const guidances: (MentorGuidance | null)[] = [];

  // Intervention (highest priority)
  if (behavior.requiresMentorIntervention) {
    guidances.push(generateInterventionGuidance(
      behavior.pattern, velocity, masteryScore, behavior.confidence
    ));
  }

  // Reinforcement
  if (behavior.pattern === 'struggling' || behavior.pattern === 'inconsistent') {
    guidances.push(generateReinforcementGuidance(weakSkills, behavior.confidence));
  }

  // Advanced challenge
  if (behavior.pattern === 'accelerating' || behavior.pattern === 'highlyEngaged') {
    guidances.push(generateAdvancedChallengeGuidance(
      difficultyDecision,
      difficultyDecision.targetLevel,
      behavior.confidence,
    ));
  }

  // Milestone push
  guidances.push(generateMilestonePushGuidance(upcomingMilestones));

  // Pacing
  guidances.push(generatePacingGuidance(
    behavior.pattern, readinessPct, estimatedCompletionWeeks, unlockedNodeCount
  ));

  const validGuidances = guidances.filter((g): g is MentorGuidance => g !== null);

  const criticalGapCount = weakSkills.filter(s => s.gap === 'Critical').length;
  const contextSummary = generateMentorContextSummary({
    pattern: behavior.pattern, masteryScore, readinessPct,
    streak, criticalGapCount, unlockedNodeCount,
  });

  // Proactive topics: skills + upcoming milestone titles
  const proactiveTopics = [
    ...weakSkills.filter(s => s.gap !== 'None').slice(0, 2).map(s => s.label),
    ...upcomingMilestones.slice(0, 1).map(n => n.title),
  ];

  return {
    primary: validGuidances[0] ?? null,
    secondary: validGuidances[1] ?? null,
    contextSummary,
    proactiveTopics,
    insights: validGuidances.map(g => g.toInsight()),
  };
};
