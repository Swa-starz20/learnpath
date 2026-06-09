// ── Recommendation Engine ─────────────────────────────────────────────────────
// Deterministic adaptive intelligence layer.
// Pure logic — no API calls, no UI dependencies.

import type { RecommendationResult, AIInsight, AdaptiveDifficultyState } from '../types/ai';
import type { SkillNode } from '../types/skill';
import type { LearningVelocity } from '../types/progression';
import type { RoadmapNode } from '../data/roadmapConfigs';
import type { EngineeringCourse } from '../data/engineeringCourses';
import type { DomainId } from '../data/engineeringDomains';


// ── Course recommendation ─────────────────────────────────────────────────────

/**
 * Score a course against the learner's current context.
 * Returns 0-100. Higher = stronger recommendation.
 */
const scoreCourse = (
  course: EngineeringCourse,
  weakSkills: SkillNode[],
  activeRoadmapNodeSkills: string[],
  assessmentScore: number
): number => {
  const weakLabels = new Set(weakSkills.map(s => s.label.toLowerCase()));
  const roadmapSet = new Set(activeRoadmapNodeSkills.map(s => s.toLowerCase()));

  // Overlap with weak skills (0-40 points)
  const weakOverlap = course.skills.filter(s => weakLabels.has(s.toLowerCase())).length;
  const weakScore = Math.min(40, weakOverlap * 10);

  // Overlap with active roadmap node skills (0-35 points)
  const roadmapOverlap = course.skills.filter(s => roadmapSet.has(s.toLowerCase())).length;
  const roadmapScore = Math.min(35, roadmapOverlap * 10);

  // Assessment alignment bonus (0-15 points)
  const assessmentBonus = course.assessmentLinked ? Math.round(assessmentScore / 100 * 15) : 0;

  // Roadmap sync bonus (0-10 points)
  const syncBonus = course.roadmapSync ? 10 : 0;

  return Math.min(100, weakScore + roadmapScore + assessmentBonus + syncBonus);
};

/** Pick the best course from a list for the current learner context */
export const recommendCourse = (
  courses: EngineeringCourse[],
  weakSkills: SkillNode[],
  activeNodeSkills: string[],
  assessmentScore: number
): RecommendationResult | null => {
  if (courses.length === 0) return null;

  const scored = courses
    .map(c => ({ course: c, score: scoreCourse(c, weakSkills, activeNodeSkills, assessmentScore) }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best) return null;

  return {
    kind: 'next_course',
    targetId: best.course.id,
    targetLabel: best.course.title,
    rationale: `${best.score}% match — targets your weak skills and aligns with your active roadmap node.`,
    score: best.score,
    urgency: best.score >= 80 ? 'high' : best.score >= 60 ? 'medium' : 'low',
  };
};

// ── Next roadmap node recommendation ─────────────────────────────────────────

/** Recommend the highest-readiness locked node to unlock next */
export const recommendNextRoadmapNode = (
  nodes: RoadmapNode[],
  completedNodeIds: string[]
): RecommendationResult | null => {
  const completedSet = new Set(completedNodeIds);

  const candidates = nodes.filter(n => {
    if (n.status !== 'locked') return false;
    return n.dependencies.every(dep => completedSet.has(dep));
  });

  if (candidates.length === 0) return null;

  // Prefer milestone nodes, then highest XP reward
  const best = candidates.sort((a, b) => {
    if (a.isKeyMilestone && !b.isKeyMilestone) return -1;
    if (!a.isKeyMilestone && b.isKeyMilestone) return 1;
    return b.xpReward - a.xpReward;
  })[0];

  return {
    kind: 'next_roadmap_node',
    targetId: best.id,
    targetLabel: best.title,
    rationale: `All prerequisites met. This ${best.isKeyMilestone ? 'milestone ' : ''}node will unlock +${best.xpReward} XP.`,
    score: 90,
    urgency: best.isKeyMilestone ? 'high' : 'medium',
  };
};

// ── Skill reinforcement recommendation ───────────────────────────────────────

/** Recommend a skill to reinforce based on gap severity */
export const recommendReinforcement = (
  weakSkills: SkillNode[]
): RecommendationResult | null => {
  if (weakSkills.length === 0) return null;
  const critical = weakSkills.filter(s => s.gap === 'Critical');
  const target = critical[0] ?? weakSkills[0];

  return {
    kind: 'reinforce_skill',
    targetId: target.id,
    targetLabel: target.label,
    rationale: `${target.gap} gap detected (${target.confidence}% confidence). Reinforcing this skill unlocks ${target.label}-dependent topics.`,
    score: 100 - target.confidence,
    urgency: target.gap === 'Critical' ? 'high' : 'medium',
  };
};

// ── Adaptive difficulty adjustment ───────────────────────────────────────────

/** Evaluate whether to adjust difficulty based on velocity and mastery */
export const evaluateDifficultyAdjustment = (
  currentLevel: AdaptiveDifficultyState['currentLevel'],
  velocity: LearningVelocity,
  masteryScore: number
): AdaptiveDifficultyState => {
  const LEVELS: AdaptiveDifficultyState['currentLevel'][] = ['Foundational', 'Intermediate', 'Advanced', 'Expert'];
  const idx = LEVELS.indexOf(currentLevel);

  let suggested = currentLevel;
  let reason = 'Difficulty is well-calibrated for your current performance.';

  if (masteryScore >= 85 && velocity.overall >= 75 && idx < LEVELS.length - 1) {
    suggested = LEVELS[idx + 1];
    reason = `Mastery ${masteryScore}% and velocity ${velocity.overall}% are strong — increasing difficulty.`;
  } else if (masteryScore < 55 && velocity.retentionScore < 60 && idx > 0) {
    suggested = LEVELS[idx - 1];
    reason = `Mastery ${masteryScore}% is below threshold — reducing difficulty to consolidate foundations.`;
  }

  return {
    currentLevel,
    suggestedLevel: suggested,
    adjustmentReason: reason,
    lastAdjustedAt: Date.now(),
  };
};

// ── AI insights generation ────────────────────────────────────────────────────

/** Generate contextual AI insights from learner state */
export const generateInsights = (params: {
  weakSkills: SkillNode[];
  velocity: LearningVelocity;
  readinessPct: number;
  completedNodeIds: string[];
  unlockedNodeIds: string[];
  domainId: DomainId;
}): AIInsight[] => {
  const { weakSkills, velocity, readinessPct, completedNodeIds, unlockedNodeIds } = params;
  const insights: AIInsight[] = [];
  const now = Date.now();

  // Velocity drop
  if (velocity.trend === 'down' && velocity.overall < 60) {
    insights.push({
      id: 'velocity-drop',
      type: 'velocity_drop',
      message: 'Learning velocity has decreased this week',
      detail: `Your study consistency dropped to ${velocity.overall}% efficiency. Short daily sessions beat long infrequent ones.`,
      confidence: 'high',
      actionLabel: 'View Study Schedule',
      actionTarget: '/mentor',
      createdAt: now,
    });
  }

  // Critical skill gaps
  const criticalSkills = weakSkills.filter(s => s.gap === 'Critical');
  if (criticalSkills.length > 0) {
    insights.push({
      id: `skill-gap-${criticalSkills[0].id}`,
      type: 'skill_gap',
      message: `Critical gap: ${criticalSkills[0].label}`,
      detail: `${criticalSkills.length} critical skill gap${criticalSkills.length > 1 ? 's' : ''} detected. Addressing these will unblock your roadmap progression.`,
      confidence: 'high',
      actionLabel: 'Reinforce Skills',
      actionTarget: '/courses',
      createdAt: now,
    });
  }

  // Unlock ready
  if (unlockedNodeIds.length > 0) {
    insights.push({
      id: 'unlock-ready',
      type: 'unlock_ready',
      message: `${unlockedNodeIds.length} roadmap node${unlockedNodeIds.length > 1 ? 's' : ''} ready to unlock`,
      detail: 'All prerequisites are met. Begin these nodes to advance your career track.',
      confidence: 'high',
      actionLabel: 'Continue Roadmap',
      actionTarget: '/roadmap',
      createdAt: now,
    });
  }

  // Roadmap sync reminder
  if (readinessPct > 70 && completedNodeIds.length > 0) {
    insights.push({
      id: 'roadmap-sync',
      type: 'roadmap_sync',
      message: 'Your roadmap is ahead of your course progress',
      detail: `${readinessPct}% roadmap readiness. Ensure course completion keeps pace with your learning plan.`,
      confidence: 'medium',
      actionLabel: 'View Roadmap',
      actionTarget: '/roadmap',
      createdAt: now,
    });
  }

  return insights;
};

// ── Composite recommendation bundle ──────────────────────────────────────────

export interface RecommendationBundle {
  course: RecommendationResult | null;
  roadmapNode: RecommendationResult | null;
  reinforcement: RecommendationResult | null;
  difficulty: AdaptiveDifficultyState;
  insights: AIInsight[];
}

export const buildRecommendationBundle = (params: {
  courses: EngineeringCourse[];
  roadmapNodes: RoadmapNode[];
  completedNodeIds: string[];
  weakSkills: SkillNode[];
  activeNodeSkills: string[];
  assessmentScore: number;
  velocity: LearningVelocity;
  masteryScore: number;
  readinessPct: number;
  currentDifficulty: AdaptiveDifficultyState['currentLevel'];
  domainId: DomainId;
}): RecommendationBundle => ({
  course:       recommendCourse(params.courses, params.weakSkills, params.activeNodeSkills, params.assessmentScore),
  roadmapNode:  recommendNextRoadmapNode(params.roadmapNodes, params.completedNodeIds),
  reinforcement: recommendReinforcement(params.weakSkills),
  difficulty:   evaluateDifficultyAdjustment(params.currentDifficulty, params.velocity, params.masteryScore),
  insights:     generateInsights({
    weakSkills: params.weakSkills,
    velocity: params.velocity,
    readinessPct: params.readinessPct,
    completedNodeIds: params.completedNodeIds,
    unlockedNodeIds: params.roadmapNodes
      .filter(n => n.status === 'locked' && n.dependencies.every(d => params.completedNodeIds.includes(d)))
      .map(n => n.id),
    domainId: params.domainId,
  }),
});
