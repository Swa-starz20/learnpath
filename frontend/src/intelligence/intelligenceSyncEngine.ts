// ── Intelligence Sync Engine ──────────────────────────────────────────────────
// Orchestration layer connecting all LearnPath intelligence systems.
// Consumes existing engines; does NOT re-implement their logic.
// Pure module — no React, no UI, no direct DOM access.
//
// Data flow:
//   Event → syncX() → engine functions → updated slice → learningStoreActions
//   runIntelligenceCycle() → all syncX() in dependency order → full state rebuild

import type { DomainId } from '../data/engineeringDomains';
import type { AssessmentResult } from '../types/assessment';
import type { CourseIntelligence } from '../types/course';

import { DOMAIN_ROADMAP_CONFIGS } from '../data/roadmapConfigs';
import { getCoursesForDomain } from '../data/engineeringCourses';

// ── Engine imports (reuse, never re-implement) ────────────────────────────────
import {
  buildSkillNodes,
  getWeakSkillClusters,
  getNextRecommendedSkills,
  correlateAssessmentToRoadmap,
} from '../engine/skillGraphEngine';
import {
  computeXPState,
  calcMasteryScore,
  calcReadinessPct,
  computeLearningVelocity,
  getUnlockableNodes,
  sumCompletedNodeXP,
  estimateCompletionDays,
} from '../engine/progressionEngine';
import {
  buildRecommendationBundle,
  generateInsights,
} from '../engine/recommendationEngine';
import {
  evaluateAdaptiveState,
  generateAdaptiveMentorContext,
  determineLearningPathAdjustments,
  type AdaptiveEngineInput,
} from '../engine/adaptiveEngine';
import { buildSyncLinks, computeSyncScore } from '../lib/sync';
import { xpToLevel } from '../lib/xp';

// ── Intelligence state + events ───────────────────────────────────────────────
import type { UserIntelligenceState } from './userIntelligenceState';
import { createEmptyIntelligenceState } from './userIntelligenceState';
import {
  dispatchIntelligenceEvent,
  onIntelligenceEvent,
} from './intelligenceEvents';

// ── Store actions (side-effectful bridge to React state) ─────────────────────
import { learningStoreActions } from '../store/useLearningStore';

// ── Internal singleton state ──────────────────────────────────────────────────

let _intelligenceState: UserIntelligenceState | null = null;
const _stateListeners = new Set<(state: UserIntelligenceState) => void>();

const notifyStateListeners = () => {
  if (_intelligenceState) {
    _stateListeners.forEach(fn => {
      try { fn(_intelligenceState!); }
      catch (err) { console.error('[IntelligenceSyncEngine] Listener error:', err); }
    });
  }
};

/** Get the current unified intelligence state (read-only). */
export const getIntelligenceState = (): UserIntelligenceState | null => _intelligenceState;

/** Subscribe to intelligence state updates. Returns unsubscribe function. */
export const onIntelligenceStateChange = (
  handler: (state: UserIntelligenceState) => void
): (() => void) => {
  _stateListeners.add(handler);
  return () => _stateListeners.delete(handler);
};

// ── Helper: resolve roadmap track ─────────────────────────────────────────────

const resolveTrack = (domainId: DomainId, trackId: string) => {
  const config = DOMAIN_ROADMAP_CONFIGS[domainId];
  return config.tracks.find(t => t.id === trackId) ?? config.tracks[0];
};

// ── Sync functions ────────────────────────────────────────────────────────────

/**
 * syncAssessmentState
 * Integrates a completed assessment result into unified intelligence.
 * Updates: skill nodes, weak skill IDs, assessment slice, readiness slice.
 */
export const syncAssessmentState = (
  state: UserIntelligenceState,
  result: AssessmentResult
): UserIntelligenceState => {
  const now = Date.now();
  const { domainId, trackId } = state;
  const track = resolveTrack(domainId, trackId);

  // Merge new weak skills with existing
  const allWeakIds = Array.from(new Set([
    ...state.assessments.state.weakSkillIds,
    ...result.weakSkills,
  ]));
  const allStrongIds = Array.from(new Set([
    ...state.assessments.state.strongSkillIds,
    ...result.strongSkills,
  ]));

  // Rebuild skill nodes with updated confidence overrides from assessment
  const allRoadmapSkills = Array.from(new Set(track.nodes.flatMap(n => n.skills)));
  const confidenceOverrides: Record<string, number> = {};
  result.metrics.forEach(m => {
    const id = m.label.toLowerCase().replace(/\s+/g, '-');
    confidenceOverrides[id] = m.score;
  });

  const skillNodes = buildSkillNodes(
    allRoadmapSkills, domainId, 'Roadmap', allWeakIds, confidenceOverrides
  );
  const skillNodeMap = Object.fromEntries(skillNodes.map(n => [n.id, n]));

  // Cognitive readiness = weighted avg of cognitive + personality metrics
  const cogMetrics = result.metrics.filter(m =>
    m.category === 'cognitive' || m.category === 'personality'
  );
  const cognitiveReadiness = cogMetrics.length > 0
    ? Math.round(cogMetrics.reduce((s, m) => s + m.score, 0) / cogMetrics.length)
    : state.assessments.state.cognitiveReadiness;

  // Technical readiness = avg of technical metrics
  const techMetrics = result.metrics.filter(m => m.category === 'technical');
  const technicalReadiness = techMetrics.length > 0
    ? Math.round(techMetrics.reduce((s, m) => s + m.score, 0) / techMetrics.length)
    : state.assessments.state.technicalReadiness;

  // Overall readiness
  const overallReadiness = Math.round(cognitiveReadiness * 0.4 + technicalReadiness * 0.6);

  // Correlate assessment weak skills to blocked roadmap nodes
  const correlations = correlateAssessmentToRoadmap(result, track.nodes);
  const blockedNodeIds = correlations.map(c => c.nodeId);

  return {
    ...state,
    assessments: {
      state: {
        ...state.assessments.state,
        completedAssessments: [...state.assessments.state.completedAssessments, result],
        cognitiveReadiness,
        technicalReadiness,
        weakSkillIds: allWeakIds,
        strongSkillIds: allStrongIds,
      },
      latestResult: result,
      overallReadiness,
      recommendedDomainId: (result.recommendedDomainId as DomainId) ?? domainId,
      lastSyncedAt: now,
    },
    skills: {
      ...state.skills,
      allNodes: skillNodes,
      weakClusters: getWeakSkillClusters(skillNodes),
      nextSkillIds: getNextRecommendedSkills(skillNodes, skillNodeMap, 6).map(n => n.id),
      lastSyncedAt: now,
    },
    roadmap: {
      ...state.roadmap,
      blockedNodeIds,
      lastSyncedAt: now,
    },
    readiness: {
      domainReadiness: overallReadiness,
      cognitiveReadiness,
      technicalReadiness,
      careerReadiness: Math.round(overallReadiness * 0.7 + state.careerAlignment.alignmentScore * 0.3),
      lastSyncedAt: now,
    },
    isStale: true,
  };
};

/**
 * syncRoadmapState
 * Recomputes roadmap intelligence slice from current progress.
 * Updates: roadmap slice, unlockable nodes, career alignment.
 */
export const syncRoadmapState = (
  state: UserIntelligenceState
): UserIntelligenceState => {
  const now = Date.now();
  const { domainId, trackId } = state;
  const track = resolveTrack(domainId, trackId);
  const { nodes } = track;

  const completedNodeIds = state.progression.progress.completedNodeIds;
  const unlockableIds = getUnlockableNodes(nodes, completedNodeIds);
  const masteryScore = calcMasteryScore(nodes);
  const readinessPct = calcReadinessPct(nodes, completedNodeIds);

  // Critical path: milestone nodes not yet completed
  const criticalPathNodeIds = nodes
    .filter(n => n.isKeyMilestone && !completedNodeIds.includes(n.id))
    .map(n => n.id);

  // Blocked nodes = critical path ∩ nodes with skill gaps
  const weakSkillSet = new Set(state.skills.allNodes.filter(s => s.gap === 'Critical').map(s => s.label.toLowerCase()));
  const blockedNodeIds = nodes
    .filter(n => !completedNodeIds.includes(n.id) && n.skills.some(s => weakSkillSet.has(s.toLowerCase())))
    .map(n => n.id);

  const courses = getCoursesForDomain(domainId);
  const syncLinks = buildSyncLinks(nodes, courses);

  // Estimate completion in weeks
  const remainingNodes = nodes.filter(n => !completedNodeIds.includes(n.id));
  const avgHoursPerNode = 8;
  const remainingHours = remainingNodes.length * avgHoursPerNode;
  const avgDailyMinutes = state.learningVelocity.velocity.avgSessionMinutes || 35;
  const estimatedCompletionWeeks = Math.ceil(estimateCompletionDays(remainingHours, avgDailyMinutes) / 7);

  // Career alignment: ratio of completed nodes to total weighted by milestones
  const milestoneTotal = nodes.filter(n => n.isKeyMilestone).length || 1;
  const milestonesDone = nodes.filter(n => n.isKeyMilestone && completedNodeIds.includes(n.id)).length;
  const alignmentScore = Math.round(
    readinessPct * 0.6 + (milestonesDone / milestoneTotal) * 100 * 0.4
  );

  // Missing skills for career readiness = skills in locked milestone nodes
  const missingSkillIds = nodes
    .filter(n => n.isKeyMilestone && n.status === 'locked')
    .flatMap(n => n.skills)
    .map(s => s.toLowerCase().replace(/\s+/g, '-'))
    .filter((id, i, arr) => arr.indexOf(id) === i); // unique

  return {
    ...state,
    roadmap: {
      domainId,
      trackId,
      intelligence: {
        domainId,
        trackId,
        readinessPct,
        aiConfidenceAvg: masteryScore,
        estimatedCompletionWeeks,
        unlockedNodeIds: unlockableIds,
        criticalPathNodeIds,
        syncLinks,
      },
      unlockableNodeIds: unlockableIds,
      blockedNodeIds,
      lastSyncedAt: now,
    },
    careerAlignment: {
      primaryTrackId: trackId,
      alignmentScore,
      missingSkillIds,
      estimatedWeeks: estimatedCompletionWeeks,
      lastSyncedAt: now,
    },
    isStale: true,
  };
};

/**
 * syncCourseState
 * Rebuilds course intelligence: ranking, AI match scores, active course.
 * Updates: courses slice.
 */
export const syncCourseState = (
  state: UserIntelligenceState
): UserIntelligenceState => {
  const now = Date.now();
  const { domainId, trackId } = state;
  const track = resolveTrack(domainId, trackId);
  const activeNode = track.nodes.find(n => n.status === 'active');
  const courses = getCoursesForDomain(domainId);

  const weakSkillSet = new Set(
    state.skills.allNodes.filter(s => s.gap !== 'None').map(s => s.label.toLowerCase())
  );
  const activeNodeSkillSet = new Set((activeNode?.skills ?? []).map(s => s.toLowerCase()));

  // Build per-course intelligence entries
  const intelligenceEntries: CourseIntelligence[] = courses.map(course => {
    const weakOverlap = course.skills.filter(s => weakSkillSet.has(s.toLowerCase())).length;
    const roadmapOverlap = course.skills.filter(s => activeNodeSkillSet.has(s.toLowerCase())).length;
    const assessmentAlignment = Math.min(100, weakOverlap * 20);
    const roadmapRelevance = Math.min(100, roadmapOverlap * 25);
    const aiMatchScore = Math.min(100,
      assessmentAlignment * 0.4 +
      roadmapRelevance * 0.35 +
      (course.assessmentLinked ? 15 : 0) +
      (course.roadmapSync ? 10 : 0)
    );

    return {
      courseId: course.id,
      domainId,
      aiMatchScore: Math.round(aiMatchScore),
      assessmentAlignment,
      roadmapRelevance,
      estimatedCompletionDays: estimateCompletionDays(
        course.totalHours,
        state.learningVelocity.velocity.avgSessionMinutes || 35
      ),
      adaptedDifficulty: state.recommendations.difficulty?.suggestedLevel ?? course.difficulty,
    };
  });

  // Rank course IDs by aiMatchScore descending
  const rankedCourseIds = [...intelligenceEntries]
    .sort((a, b) => b.aiMatchScore - a.aiMatchScore)
    .map(e => e.courseId);

  // Active course = highest ranked in-progress
  const activeCourseId = courses.find(c =>
    c.modules.some(m => m.status === 'active')
  )?.id ?? rankedCourseIds[0] ?? null;

  return {
    ...state,
    courses: {
      activeCourseId,
      intelligence: intelligenceEntries,
      rankedCourseIds,
      lastSyncedAt: now,
    },
    isStale: true,
  };
};

/**
 * syncMentorState
 * Updates AI Mentor intelligence: insights, context summary, proactive topics.
 * Consumes: skills, velocity, roadmap, recommendations.
 */
export const syncMentorState = (
  state: UserIntelligenceState
): UserIntelligenceState => {
  const now = Date.now();
  const { domainId, trackId } = state;
  const track = resolveTrack(domainId, trackId);

  const weakSkillNodes = state.skills.allNodes.filter(s => s.gap !== 'None');

  // Regenerate insights from recommendation engine
  const insights = generateInsights({
    weakSkills: weakSkillNodes,
    velocity: state.learningVelocity.velocity,
    readinessPct: state.roadmap.intelligence.readinessPct,
    completedNodeIds: state.progression.progress.completedNodeIds,
    unlockedNodeIds: state.roadmap.unlockableNodeIds,
    domainId,
  });

  // Proactive topics: derive from critical gaps + unlockable nodes
  const criticalSkills = state.skills.allNodes
    .filter(s => s.gap === 'Critical')
    .slice(0, 3)
    .map(s => s.label);

  const unlockableTitles = track.nodes
    .filter(n => state.roadmap.unlockableNodeIds.includes(n.id))
    .slice(0, 2)
    .map(n => n.title);

  const proactiveTopics = [...criticalSkills, ...unlockableTitles];

  // Context summary for the mentor greeting
  const readiness = state.roadmap.intelligence.readinessPct;
  const velocity = state.learningVelocity.velocity;
  const contextSummary = [
    `Roadmap readiness: ${readiness}%.`,
    criticalSkills.length > 0
      ? `Focus areas: ${criticalSkills.slice(0, 2).join(', ')}.`
      : 'No critical skill gaps.',
    velocity.trend === 'down'
      ? 'Learning velocity declining — consider shorter daily sessions.'
      : velocity.trend === 'up'
      ? 'Strong learning momentum this week.'
      : 'Steady progress.',
    state.roadmap.unlockableNodeIds.length > 0
      ? `${state.roadmap.unlockableNodeIds.length} roadmap nodes ready to unlock.`
      : '',
  ].filter(Boolean).join(' ');

  return {
    ...state,
    mentorInsights: {
      insights,
      contextSummary,
      proactiveTopics,
      lastSyncedAt: now,
    },
    isStale: true,
  };
};

/**
 * syncDashboardState
 * Recomputes progression and readiness slices for dashboard consumption.
 * Updates: progression slice, readiness slice, learningVelocity slice.
 */
export const syncDashboardState = (
  state: UserIntelligenceState
): UserIntelligenceState => {
  const now = Date.now();
  const { domainId, trackId } = state;
  const track = resolveTrack(domainId, trackId);
  const { nodes } = track;
  const courses = getCoursesForDomain(domainId);

  const completedNodeIds = state.progression.progress.completedNodeIds;
  const streak = state.progression.streak;
  const earnedXP = sumCompletedNodeXP(nodes, completedNodeIds);
  const xp = computeXPState(earnedXP, streak);

  const completedLessons = courses.flatMap(c =>
    c.modules.flatMap(m => m.lessons.filter(l => l.status === 'completed'))
  );
  const totalLessons = courses.flatMap(c => c.modules.flatMap(m => m.lessons)).length;
  const velocity = computeLearningVelocity(completedLessons, totalLessons, streak);

  const masteryScore = calcMasteryScore(nodes);
  const readinessPct = calcReadinessPct(nodes, completedNodeIds);

  // Weekly XP trend (mock: distribute total across 7 days with streak influence)
  const dailyBase = Math.round(earnedXP / Math.max(streak, 7));
  const weeklyXPTrend = Array.from({ length: 7 }, (_, i) =>
    Math.max(0, dailyBase + (i === 6 ? streak * 20 : i % 2 === 0 ? -50 : 30))
  );

  const velocityTrend: 'improving' | 'stable' | 'declining' =
    velocity.trend === 'up' ? 'improving' :
    velocity.trend === 'down' ? 'declining' : 'stable';

  // Composite readiness
  const domainReadiness = Math.round(
    readinessPct * 0.5 +
    state.assessments.state.technicalReadiness * 0.3 +
    state.assessments.state.cognitiveReadiness * 0.2
  );
  const careerReadiness = Math.round(
    state.careerAlignment.alignmentScore * 0.6 +
    domainReadiness * 0.4
  );

  return {
    ...state,
    progression: {
      ...state.progression,
      xp,
      progress: {
        ...state.progression.progress,
        earnedXP,
        readinessPct,
        masteryScore,
      },
      velocity,
      lastSyncedAt: now,
    },
    learningVelocity: {
      velocity,
      weeklyXPTrend,
      trend: velocityTrend,
      lastSyncedAt: now,
    },
    readiness: {
      domainReadiness,
      cognitiveReadiness: state.assessments.state.cognitiveReadiness,
      technicalReadiness: state.assessments.state.technicalReadiness,
      careerReadiness,
      lastSyncedAt: now,
    },
    isStale: true,
  };
};

// ── Full intelligence cycle ───────────────────────────────────────────────────

/**
 * runIntelligenceCycle
 * Runs all sync functions in correct dependency order and rebuilds the full
 * unified intelligence state. Dispatches INTELLIGENCE_CYCLE_COMPLETE event.
 *
 * Order:
 *   1. Dashboard (XP/progression — baseline for everything else)
 *   2. Roadmap (readiness, unlockable nodes, career alignment)
 *   3. Courses (ranking depends on roadmap + skills)
 *   4. Mentor (insights depend on skills + roadmap + velocity)
 *   5. Recommendations (bundles from all above)
 *
 * Assessment sync is event-driven — not run as part of the regular cycle.
 */
export const runIntelligenceCycle = (
  domainId: DomainId,
  trackId?: string
): UserIntelligenceState => {
  const config = DOMAIN_ROADMAP_CONFIGS[domainId];
  const resolvedTrackId = trackId ?? config.tracks[0].id;

  // Start from existing state if domain/track matches; else rebuild from scratch
  let state: UserIntelligenceState =
    _intelligenceState?.domainId === domainId &&
    _intelligenceState.trackId === resolvedTrackId
      ? _intelligenceState
      : createEmptyIntelligenceState(domainId, resolvedTrackId);

  // Seed skill nodes from roadmap if empty
  if (state.skills.allNodes.length === 0) {
    const track = resolveTrack(domainId, resolvedTrackId);
    const allSkills = Array.from(new Set(track.nodes.flatMap(n => n.skills)));
    const weakSkillIds = state.assessments.state.weakSkillIds;
    const skillNodes = buildSkillNodes(allSkills, domainId, 'Roadmap', weakSkillIds);
    const skillNodeMap = Object.fromEntries(skillNodes.map(n => [n.id, n]));
    state = {
      ...state,
      skills: {
        allNodes: skillNodes,
        weakClusters: getWeakSkillClusters(skillNodes),
        nextSkillIds: getNextRecommendedSkills(skillNodes, skillNodeMap, 6).map(n => n.id),
        syncScore: computeSyncScore(skillNodes, track.nodes),
        lastSyncedAt: Date.now(),
      },
    };
  }

  // Seed progression from roadmap data if XP is 0
  if (state.progression.progress.earnedXP === 0) {
    const track = resolveTrack(domainId, resolvedTrackId);
    const completedNodeIds = track.nodes.filter(n => n.status === 'completed').map(n => n.id);
    const earnedXP = sumCompletedNodeXP(track.nodes, completedNodeIds);
    const mockStreak = 7;
    const xp = computeXPState(earnedXP, mockStreak);
    state = {
      ...state,
      progression: {
        ...state.progression,
        streak: mockStreak,
        xp,
        progress: {
          ...state.progression.progress,
          completedNodeIds,
          earnedXP,
          readinessPct: calcReadinessPct(track.nodes, completedNodeIds),
          masteryScore: calcMasteryScore(track.nodes),
        },
      },
    };
  }

  // Seed assessment readiness from defaults if not yet assessed
  if (state.assessments.state.cognitiveReadiness === 0) {
    state = {
      ...state,
      assessments: {
        ...state.assessments,
        state: { ...state.assessments.state, cognitiveReadiness: 73, technicalReadiness: 68 },
        overallReadiness: 71,
      },
    };
  }

  // Run sync chain in dependency order
  state = syncDashboardState(state);
  state = syncRoadmapState(state);
  state = syncCourseState(state);
  state = syncMentorState(state);

  // Final: rebuild recommendations using all synced data
  const track = resolveTrack(domainId, resolvedTrackId);
  const courses = getCoursesForDomain(domainId);
  const activeNode = track.nodes.find(n => n.status === 'active');
  const weakSkillNodes = state.skills.allNodes.filter(s => s.gap !== 'None');

  const bundle = buildRecommendationBundle({
    courses,
    roadmapNodes: track.nodes,
    completedNodeIds: state.progression.progress.completedNodeIds,
    weakSkills: weakSkillNodes,
    activeNodeSkills: activeNode?.skills ?? [],
    assessmentScore: state.assessments.overallReadiness,
    velocity: state.learningVelocity.velocity,
    masteryScore: state.progression.progress.masteryScore,
    readinessPct: state.roadmap.intelligence.readinessPct,
    currentDifficulty: track.difficulty as 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert',
    domainId,
  });

  // ── Step 6: Adaptive Intelligence Cycle ────────────────────────────────────────────
  // Runs immediately after recommendations. Reuses all synced data from steps 1-5.
  // Does NOT recalculate anything — delegates to adaptiveEngine which delegates
  // to progressionEngine, skillGraphEngine, and recommendationEngine.

  const adaptiveInput: AdaptiveEngineInput = {
    domainId,
    velocity:                state.learningVelocity.velocity,
    masteryScore:            state.progression.progress.masteryScore,
    readinessPct:            state.roadmap.intelligence.readinessPct,
    streak:                  state.progression.streak,
    weakSkills:              state.skills.allNodes.filter(s => s.gap !== 'None'),
    allNodes:                track.nodes,
    completedNodeIds:        state.progression.progress.completedNodeIds,
    courses,
    currentDifficulty:       (bundle.difficulty.suggestedLevel ?? 'Intermediate') as import('../engine/difficultyEngine').DifficultyLevel,
    assessmentScore:         state.assessments.overallReadiness,
    unlockedNodeCount:       state.roadmap.unlockableNodeIds.length,
    estimatedCompletionWeeks: state.roadmap.intelligence.estimatedCompletionWeeks,
  };

  const adaptiveState   = evaluateAdaptiveState(adaptiveInput);
  const mentorBundle    = generateAdaptiveMentorContext(adaptiveInput, adaptiveState);
  const pathAdjustments = determineLearningPathAdjustments(adaptiveInput, adaptiveState);
  const adaptiveNow     = Date.now();

  // Merge adaptive mentor guidance into existing mentorInsights slice.
  // Adaptive insights are prepended so they appear first in the mentor feed.
  // The adaptive contextSummary replaces the static one when available.
  const mergedMentorInsights = {
    insights: [
      ...mentorBundle.insights,
      ...state.mentorInsights.insights,
    ].slice(0, 10), // cap at 10 to avoid unbounded growth
    contextSummary: mentorBundle.contextSummary || state.mentorInsights.contextSummary,
    proactiveTopics: [
      ...mentorBundle.proactiveTopics,
      ...state.mentorInsights.proactiveTopics,
    ].filter((t, i, arr) => arr.indexOf(t) === i).slice(0, 6), // unique, max 6
    lastSyncedAt: adaptiveNow,
  };

  const cycleId = `cycle-${Date.now()}`;
  state = {
    ...state,
    recommendations: {
      nextCourse:      bundle.course,
      nextRoadmapNode: bundle.roadmapNode,
      reinforcement:   bundle.reinforcement,
      difficulty:      bundle.difficulty,
      lastSyncedAt:    Date.now(),
    },
    mentorInsights: mergedMentorInsights,
    adaptive: {
      behaviorPattern:    adaptiveState.behavior.pattern,
      behaviorSignal:     adaptiveState.behavior,
      difficultyDirection: adaptiveState.difficulty.direction,
      difficultyDecision: adaptiveState.difficulty,
      engagementScore:    adaptiveState.engagementScore,
      engagementTrend:    adaptiveState.engagementTrend,
      shouldAccelerate:   adaptiveState.shouldAccelerate,
      shouldSlow:         adaptiveState.shouldSlow,
      pathAdjustments,
      isHydrated:         true,
      lastSyncedAt:       adaptiveNow,
    },
    lastFullSyncAt: Date.now(),
    syncCycleId:    cycleId,
    isStale:        false,
  };

  _intelligenceState = state;
  notifyStateListeners();

  // Propagate cycle completion to learningStore so UI re-renders
  learningStoreActions.refreshRecommendations();

  // Emit cycle complete event — adaptive is now a first-class participant
  dispatchIntelligenceEvent({
    type: 'INTELLIGENCE_CYCLE_COMPLETE',
    payload: {
      domainId,
      cycleId,
      updatedSystems: ['dashboard', 'roadmap', 'courses', 'mentor', 'recommendations', 'adaptive'],
      triggeredAt: Date.now(),
    },
  });

  return state;
};

// ── Event-driven integration hooks ────────────────────────────────────────────
// Wire intelligence events to sync functions automatically.
// Called once at app startup via `initIntelligenceSyncEngine()`.

let _initialized = false;

export const initIntelligenceSyncEngine = (
  initialDomainId: DomainId = 'computer',
  initialTrackId?: string
): void => {
  if (_initialized) return;
  _initialized = true;

  // ── ASSESSMENT_COMPLETED → full assessment sync + cycle ───────────────────
  onIntelligenceEvent('ASSESSMENT_COMPLETED', (event) => {
    if (event.type !== 'ASSESSMENT_COMPLETED') return;
    const { payload } = event;
    if (!_intelligenceState) return;
    const updated = syncAssessmentState(_intelligenceState, payload.result);
    _intelligenceState = updated;
    notifyStateListeners();
    // Re-run cycle to propagate assessment → roadmap → courses → mentor
    runIntelligenceCycle(payload.domainId, _intelligenceState.trackId);
  });

  // ── LESSON_COMPLETED → XP + progression + recommendations ────────────────
  onIntelligenceEvent('LESSON_COMPLETED', (event) => {
    if (event.type !== 'LESSON_COMPLETED') return;
    const { payload } = event;
    learningStoreActions.addXP(payload.xpEarned);
    learningStoreActions.markLessonComplete(payload.lessonId);
    dispatchIntelligenceEvent({
      type: 'XP_GAINED',
      payload: {
        amount: payload.xpEarned,
        source: 'lesson',
        domainId: payload.domainId,
        triggeredAt: Date.now(),
      },
    });
    if (_intelligenceState) {
      _intelligenceState = syncCourseState(_intelligenceState);
      _intelligenceState = syncMentorState(_intelligenceState);
      notifyStateListeners();
    }
  });

  // ── LAB_COMPLETED → XP + course sync ─────────────────────────────────────
  onIntelligenceEvent('LAB_COMPLETED', (event) => {
    if (event.type !== 'LAB_COMPLETED') return;
    const { payload } = event;
    learningStoreActions.addXP(payload.xpEarned);
    dispatchIntelligenceEvent({
      type: 'XP_GAINED',
      payload: {
        amount: payload.xpEarned,
        source: 'lab',
        domainId: payload.domainId,
        triggeredAt: Date.now(),
      },
    });
    if (_intelligenceState) {
      _intelligenceState = syncCourseState(_intelligenceState);
      notifyStateListeners();
    }
  });

  // ── ROADMAP_NODE_COMPLETED → roadmap + courses + mentor full cycle ────────
  onIntelligenceEvent('ROADMAP_NODE_COMPLETED', (event) => {
    if (event.type !== 'ROADMAP_NODE_COMPLETED') return;
    const { payload } = event;
    learningStoreActions.addXP(payload.xpEarned);
    dispatchIntelligenceEvent({
      type: 'XP_GAINED',
      payload: {
        amount: payload.xpEarned,
        source: 'roadmap_node',
        domainId: payload.domainId,
        triggeredAt: Date.now(),
      },
    });
    runIntelligenceCycle(payload.domainId, payload.trackId);
  });

  // ── DOMAIN_CHANGED → full rebuild ────────────────────────────────────────
  onIntelligenceEvent('DOMAIN_CHANGED', (event) => {
    if (event.type !== 'DOMAIN_CHANGED') return;
    const { payload } = event;
    learningStoreActions.setDomain(payload.newDomainId);
    runIntelligenceCycle(payload.newDomainId);
  });

  // ── TRACK_CHANGED → full rebuild for same domain ─────────────────────────
  onIntelligenceEvent('TRACK_CHANGED', (event) => {
    if (event.type !== 'TRACK_CHANGED') return;
    const { payload } = event;
    learningStoreActions.setTrack(payload.newTrackId);
    runIntelligenceCycle(payload.domainId, payload.newTrackId);
  });

  // ── XP_GAINED → check for level-up ───────────────────────────────────────
  onIntelligenceEvent('XP_GAINED', (event) => {
    if (event.type !== 'XP_GAINED') return;
    const { payload } = event;
    if (!_intelligenceState) return;
    const prev = _intelligenceState.progression.xp.level;
    const newXP = _intelligenceState.progression.progress.earnedXP + payload.amount;
    const newLevel = xpToLevel(newXP);
    if (newLevel > prev) {
      dispatchIntelligenceEvent({
        type: 'LEVEL_UP',
        payload: {
          previousLevel: prev,
          newLevel,
          totalXP: newXP,
          triggeredAt: Date.now(),
        },
      });
    }
  });

  // ── SKILL_GAP_DETECTED → mentor update ───────────────────────────────────
  onIntelligenceEvent('SKILL_GAP_DETECTED', () => {
    if (!_intelligenceState) return;
    _intelligenceState = syncMentorState(_intelligenceState);
    notifyStateListeners();
  });

  // ── Seed the initial state ────────────────────────────────────────────────
  runIntelligenceCycle(initialDomainId, initialTrackId);

  console.info(`[IntelligenceSyncEngine] Initialized. Domain: ${initialDomainId}`);
};

/** Reset sync engine (for testing / hot-reload). */
export const resetIntelligenceSyncEngine = (): void => {
  _intelligenceState = null;
  _stateListeners.clear();
  _initialized = false;
};
