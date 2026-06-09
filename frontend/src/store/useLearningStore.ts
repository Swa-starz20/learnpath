// ── useLearningStore ─────────────────────────────────────────────────────────
// Central intelligence state for the entire LearnPath ecosystem.
// Uses React's built-in useState/useReducer via a singleton pattern
// (no external library dependency — stays consistent with existing project).
// Future: swap the in-memory singleton for a backend-hydrated store.

import { useState, useEffect, useCallback } from 'react';
import type { DomainId } from '../data/engineeringDomains';
import type { SkillNode } from '../types/skill';
import type { XPState, ProgressState, LearningVelocity } from '../types/progression';
import type { RecommendationBundle } from '../engine/recommendationEngine';
import type { AIInsight } from '../types/ai';
import type { AssessmentState } from '../types/assessment';

import { DOMAIN_ROADMAP_CONFIGS } from '../data/roadmapConfigs';
import { getCoursesForDomain } from '../data/engineeringCourses';

import {
  computeXPState,
  calcMasteryScore,
  calcReadinessPct,
  computeLearningVelocity,
  getUnlockableNodes,
  sumCompletedNodeXP,
} from '../engine/progressionEngine';
import { buildSkillNodes, getWeakSkillClusters, getNextRecommendedSkills } from '../engine/skillGraphEngine';
import { buildRecommendationBundle } from '../engine/recommendationEngine';
import { buildSyncLinks, computeSyncScore } from '../lib/sync';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LearningState {
  // Core identity
  domainId: DomainId;
  trackId: string;

  // Progression
  xp: XPState;
  progress: ProgressState;
  streak: number;
  velocity: LearningVelocity;

  // Skills
  skillNodes: SkillNode[];
  weakSkillIds: string[];
  syncScore: number;           // 0-100 cross-system alignment

  // AI intelligence
  recommendations: RecommendationBundle | null;
  insights: AIInsight[];
  adaptiveDifficulty: RecommendationBundle['difficulty'] | null;

  // Assessment
  assessment: AssessmentState;

  // Meta
  lastComputedAt: number;
}

// ── Singleton in-memory state (survives re-renders without context) ────────────
// In production: serialised to localStorage / synced to backend.

let _state: LearningState | null = null;
const _listeners = new Set<() => void>();

const notify = () => _listeners.forEach(fn => fn());

// ── Seed state builder ────────────────────────────────────────────────────────

const buildInitialState = (domainId: DomainId, trackId?: string): LearningState => {
  const config = DOMAIN_ROADMAP_CONFIGS[domainId];
  const track = trackId
    ? config.tracks.find(t => t.id === trackId) ?? config.tracks[0]
    : config.tracks[0];
  const { nodes } = track;

  const completedNodeIds = nodes.filter(n => n.status === 'completed').map(n => n.id);
  const earnedXP = sumCompletedNodeXP(nodes, completedNodeIds);
  const streak = 7; // mock: would come from activity log
  const courses = getCoursesForDomain(domainId);

  const allSkills = Array.from(new Set(nodes.flatMap(n => n.skills)));
  const weakSkillIds = allSkills
    .filter((_, i) => i % 5 === 0)               // mock: every 5th skill is "weak"
    .map(s => s.toLowerCase().replace(/\s+/g, '-'));

  const skillNodes = buildSkillNodes(allSkills, domainId, 'Roadmap', weakSkillIds);
  void Object.fromEntries(skillNodes.map(n => [n.id, n])); // retained for future use

  const activeNode = nodes.find(n => n.status === 'active');
  const completedLessons = courses.flatMap(c => c.modules.flatMap(m => m.lessons.filter(l => l.status === 'completed')));
  const totalLessons = courses.flatMap(c => c.modules.flatMap(m => m.lessons)).length;

  const velocity = computeLearningVelocity(completedLessons, totalLessons, streak);
  const masteryScore = calcMasteryScore(nodes);
  const readinessPct = calcReadinessPct(nodes, completedNodeIds);
  const xp = computeXPState(earnedXP, streak);

  const weakSkillNodes = skillNodes.filter(s => weakSkillIds.includes(s.id));
  void buildSyncLinks(nodes, courses); // retained for future use

  const recommendations = buildRecommendationBundle({
    courses,
    roadmapNodes: nodes,
    completedNodeIds,
    weakSkills: weakSkillNodes,
    activeNodeSkills: activeNode?.skills ?? [],
    assessmentScore: 73,
    velocity,
    masteryScore,
    readinessPct,
    currentDifficulty: track.difficulty as 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert',
    domainId,
  });

  return {
    domainId,
    trackId: track.id,
    xp,
    progress: {
      domainId,
      trackId: track.id,
      completedNodeIds,
      completedLessonIds: completedLessons.map(l => l.id),
      completedModuleIds: courses.flatMap(c => c.modules.filter(m => m.status === 'completed').map(m => m.id)),
      earnedXP,
      readinessPct,
      masteryScore,
    },
    streak,
    velocity,
    skillNodes,
    weakSkillIds,
    syncScore: computeSyncScore(skillNodes, nodes),
    recommendations,
    insights: recommendations.insights,
    adaptiveDifficulty: recommendations.difficulty,
    assessment: {
      completedAssessments: [],
      cognitiveReadiness: 73,
      technicalReadiness: 68,
      weakSkillIds,
      strongSkillIds: [],
    },
    lastComputedAt: Date.now(),
  };
};

// ── Actions ───────────────────────────────────────────────────────────────────

export const learningStoreActions = {
  setDomain: (domainId: DomainId, trackId?: string) => {
    _state = buildInitialState(domainId, trackId);
    notify();
  },
  setTrack: (trackId: string) => {
    if (!_state) return;
    _state = buildInitialState(_state.domainId, trackId);
    notify();
  },
  addXP: (amount: number) => {
    if (!_state) return;
    const next = _state.xp.total + amount;
    _state = { ..._state, xp: computeXPState(next, _state.streak), lastComputedAt: Date.now() };
    notify();
  },
  markLessonComplete: (lessonId: string) => {
    if (!_state) return;
    if (_state.progress.completedLessonIds.includes(lessonId)) return;
    const updated = [..._state.progress.completedLessonIds, lessonId];
    _state = {
      ..._state,
      progress: { ..._state.progress, completedLessonIds: updated },
      lastComputedAt: Date.now(),
    };
    notify();
  },
  refreshRecommendations: () => {
    if (!_state) return;
    const config = DOMAIN_ROADMAP_CONFIGS[_state.domainId];
    const track = config.tracks.find(t => t.id === _state!.trackId) ?? config.tracks[0];
    const courses = getCoursesForDomain(_state.domainId);
    const activeNode = track.nodes.find(n => n.status === 'active');
    const weakNodes = _state.skillNodes.filter(s => _state!.weakSkillIds.includes(s.id));

    const recommendations = buildRecommendationBundle({
      courses,
      roadmapNodes: track.nodes,
      completedNodeIds: _state.progress.completedNodeIds,
      weakSkills: weakNodes,
      activeNodeSkills: activeNode?.skills ?? [],
      assessmentScore: _state.assessment.cognitiveReadiness,
      velocity: _state.velocity,
      masteryScore: _state.progress.masteryScore,
      readinessPct: _state.progress.readinessPct,
      currentDifficulty: track.difficulty as 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert',
      domainId: _state.domainId,
    });

    _state = {
      ..._state,
      recommendations,
      insights: recommendations.insights,
      adaptiveDifficulty: recommendations.difficulty,
      lastComputedAt: Date.now(),
    };
    notify();
  },
};

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * useLearningStore: single hook giving any component access to the central
 * intelligence state. Re-renders only when the singleton notifies.
 *
 * Usage:
 *   const { xp, progress, recommendations, insights } = useLearningStore();
 *   const { setDomain, addXP } = useLearningStore();
 */
export const useLearningStore = () => {
  // Lazy-initialise singleton
  if (!_state) {
    _state = buildInitialState('computer');
  }

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const listener = () => forceUpdate(n => n + 1);
    _listeners.add(listener);
    return () => { _listeners.delete(listener); };
  }, []);

  const setDomain = useCallback(
    (domainId: DomainId, trackId?: string) => learningStoreActions.setDomain(domainId, trackId),
    []
  );
  const setTrack = useCallback(
    (trackId: string) => learningStoreActions.setTrack(trackId),
    []
  );
  const addXP = useCallback(
    (amount: number) => learningStoreActions.addXP(amount),
    []
  );
  const markLessonComplete = useCallback(
    (lessonId: string) => learningStoreActions.markLessonComplete(lessonId),
    []
  );
  const refreshRecommendations = useCallback(
    () => learningStoreActions.refreshRecommendations(),
    []
  );

  return {
    // State
    ..._state,
    // Derived helpers
    weakSkillClusters: getWeakSkillClusters(_state.skillNodes),
    nextSkills: getNextRecommendedSkills(
      _state.skillNodes,
      Object.fromEntries(_state.skillNodes.map(n => [n.id, n]))
    ),
    unlockableNodeIds: (() => {
      const config = DOMAIN_ROADMAP_CONFIGS[_state.domainId];
      const track = config.tracks.find(t => t.id === _state!.trackId) ?? config.tracks[0];
      return getUnlockableNodes(track.nodes, _state.progress.completedNodeIds);
    })(),
    // Actions
    setDomain,
    setTrack,
    addXP,
    markLessonComplete,
    refreshRecommendations,
  };
};
