// ── Intelligence Events ───────────────────────────────────────────────────────
// Strongly typed platform event definitions for the Unified Intelligence Sync Engine.
// No external event libraries. No side effects at import time.
// Consumers dispatch events via `dispatchIntelligenceEvent()`
// and subscribe via `onIntelligenceEvent()`.

import type { DomainId } from '../data/engineeringDomains';
import type { AssessmentResult } from '../types/assessment';

// ── Event type discriminator union ────────────────────────────────────────────

export type IntelligenceEventType =
  | 'ASSESSMENT_COMPLETED'
  | 'LESSON_COMPLETED'
  | 'LAB_COMPLETED'
  | 'MODULE_COMPLETED'
  | 'ROADMAP_NODE_UNLOCKED'
  | 'ROADMAP_NODE_COMPLETED'
  | 'XP_GAINED'
  | 'STREAK_UPDATED'
  | 'LEVEL_UP'
  | 'DOMAIN_CHANGED'
  | 'TRACK_CHANGED'
  | 'SKILL_MASTERED'
  | 'SKILL_GAP_DETECTED'
  | 'DIFFICULTY_ADJUSTED'
  | 'MENTOR_QUERY_SUBMITTED'
  | 'INTELLIGENCE_CYCLE_COMPLETE';

// ── Typed event payload definitions ──────────────────────────────────────────

export interface AssessmentCompletedPayload {
  assessmentId: string;
  domainId: DomainId;
  result: AssessmentResult;
  triggeredAt: number;
}

export interface LessonCompletedPayload {
  lessonId: string;
  moduleId: string;
  courseId: string;
  domainId: DomainId;
  xpEarned: number;
  triggeredAt: number;
}

export interface LabCompletedPayload {
  labId: string;
  courseId: string;
  domainId: DomainId;
  xpEarned: number;
  triggeredAt: number;
}

export interface ModuleCompletedPayload {
  moduleId: string;
  courseId: string;
  domainId: DomainId;
  xpEarned: number;
  triggeredAt: number;
}

export interface RoadmapNodeUnlockedPayload {
  nodeId: string;
  nodeTitle: string;
  domainId: DomainId;
  trackId: string;
  triggeredAt: number;
}

export interface RoadmapNodeCompletedPayload {
  nodeId: string;
  nodeTitle: string;
  domainId: DomainId;
  trackId: string;
  xpEarned: number;
  triggeredAt: number;
}

export interface XPGainedPayload {
  amount: number;
  source: 'lesson' | 'lab' | 'assessment' | 'roadmap_node' | 'streak' | 'bonus';
  domainId: DomainId;
  triggeredAt: number;
}

export interface StreakUpdatedPayload {
  previousStreak: number;
  newStreak: number;
  triggeredAt: number;
}

export interface LevelUpPayload {
  previousLevel: number;
  newLevel: number;
  totalXP: number;
  triggeredAt: number;
}

export interface DomainChangedPayload {
  previousDomainId: DomainId;
  newDomainId: DomainId;
  triggeredAt: number;
}

export interface TrackChangedPayload {
  domainId: DomainId;
  previousTrackId: string;
  newTrackId: string;
  triggeredAt: number;
}

export interface SkillMasteredPayload {
  skillId: string;
  skillLabel: string;
  domainId: DomainId;
  triggeredAt: number;
}

export interface SkillGapDetectedPayload {
  skillId: string;
  skillLabel: string;
  gap: 'Critical' | 'Moderate' | 'Low';
  confidence: number;
  domainId: DomainId;
  triggeredAt: number;
}

export interface DifficultyAdjustedPayload {
  fromLevel: 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert';
  toLevel: 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert';
  reason: string;
  triggeredAt: number;
}

export interface MentorQuerySubmittedPayload {
  query: string;
  domainId: DomainId;
  triggeredAt: number;
}

export interface IntelligenceCycleCompletePayload {
  domainId: DomainId;
  cycleId: string;
  updatedSystems: string[];
  triggeredAt: number;
}

// ── Discriminated event union ──────────────────────────────────────────────────

export type IntelligenceEvent =
  | { type: 'ASSESSMENT_COMPLETED';        payload: AssessmentCompletedPayload }
  | { type: 'LESSON_COMPLETED';            payload: LessonCompletedPayload }
  | { type: 'LAB_COMPLETED';               payload: LabCompletedPayload }
  | { type: 'MODULE_COMPLETED';            payload: ModuleCompletedPayload }
  | { type: 'ROADMAP_NODE_UNLOCKED';       payload: RoadmapNodeUnlockedPayload }
  | { type: 'ROADMAP_NODE_COMPLETED';      payload: RoadmapNodeCompletedPayload }
  | { type: 'XP_GAINED';                  payload: XPGainedPayload }
  | { type: 'STREAK_UPDATED';             payload: StreakUpdatedPayload }
  | { type: 'LEVEL_UP';                   payload: LevelUpPayload }
  | { type: 'DOMAIN_CHANGED';             payload: DomainChangedPayload }
  | { type: 'TRACK_CHANGED';              payload: TrackChangedPayload }
  | { type: 'SKILL_MASTERED';             payload: SkillMasteredPayload }
  | { type: 'SKILL_GAP_DETECTED';         payload: SkillGapDetectedPayload }
  | { type: 'DIFFICULTY_ADJUSTED';        payload: DifficultyAdjustedPayload }
  | { type: 'MENTOR_QUERY_SUBMITTED';     payload: MentorQuerySubmittedPayload }
  | { type: 'INTELLIGENCE_CYCLE_COMPLETE'; payload: IntelligenceCycleCompletePayload };

// ── Event handler type ────────────────────────────────────────────────────────

export type IntelligenceEventHandler<T extends IntelligenceEvent = IntelligenceEvent> =
  (event: T) => void;

// ── Lightweight in-process event bus ─────────────────────────────────────────
// No external library. Handlers are called synchronously on dispatch.

type AnyHandler = (event: IntelligenceEvent) => void;

const _handlers = new Map<IntelligenceEventType, Set<AnyHandler>>();

/**
 * Subscribe to a specific intelligence event type.
 * Returns an unsubscribe function.
 */
export const onIntelligenceEvent = <T extends IntelligenceEvent>(
  type: T['type'],
  handler: (event: T) => void
): (() => void) => {
  if (!_handlers.has(type)) _handlers.set(type, new Set());
  const h = handler as AnyHandler;
  _handlers.get(type)!.add(h);
  return () => _handlers.get(type)?.delete(h);
};

/**
 * Dispatch a typed intelligence event to all registered handlers.
 * Synchronous — handlers run in registration order.
 */
export const dispatchIntelligenceEvent = (event: IntelligenceEvent): void => {
  _handlers.get(event.type)?.forEach(h => {
    try { h(event); }
    catch (err) {
      console.error(`[IntelligenceEvents] Handler error for ${event.type}:`, err);
    }
  });
};

/**
 * Subscribe to ALL intelligence events (for debugging / analytics).
 * Returns an unsubscribe function.
 */
export const onAnyIntelligenceEvent = (
  handler: (event: IntelligenceEvent) => void
): (() => void) => {
  const unsubs: (() => void)[] = [];
  const ALL_TYPES: IntelligenceEventType[] = [
    'ASSESSMENT_COMPLETED', 'LESSON_COMPLETED', 'LAB_COMPLETED', 'MODULE_COMPLETED',
    'ROADMAP_NODE_UNLOCKED', 'ROADMAP_NODE_COMPLETED', 'XP_GAINED', 'STREAK_UPDATED',
    'LEVEL_UP', 'DOMAIN_CHANGED', 'TRACK_CHANGED', 'SKILL_MASTERED',
    'SKILL_GAP_DETECTED', 'DIFFICULTY_ADJUSTED', 'MENTOR_QUERY_SUBMITTED',
    'INTELLIGENCE_CYCLE_COMPLETE',
  ];
  ALL_TYPES.forEach(t => unsubs.push(onIntelligenceEvent(t as IntelligenceEvent['type'], handler as never)));
  return () => unsubs.forEach(u => u());
};

/** Clear all handlers — useful in tests / hot-reload scenarios. */
export const clearIntelligenceHandlers = (): void => _handlers.clear();
