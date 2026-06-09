// ── Sync Utilities ────────────────────────────────────────────────────────────
// Cross-system alignment: roadmap ↔ courses ↔ assessments ↔ skills.

import type { RoadmapNode } from '../data/roadmapConfigs';
import type { EngineeringCourse } from '../data/engineeringCourses';
import type { SkillNode } from '../types/skill';
import type { RoadmapSyncLink } from '../types/roadmap';

/**
 * Find courses that directly support an active roadmap node.
 * Returns courses with at least one overlapping skill.
 */
export const findCoursesForNode = (
  node: RoadmapNode,
  courses: EngineeringCourse[]
): EngineeringCourse[] => {
  const nodeSkills = new Set(node.skills.map(s => s.toLowerCase()));
  return courses.filter(c =>
    c.skills.some(s => nodeSkills.has(s.toLowerCase()))
  );
};

/**
 * Compute skill overlap percentage between a course and roadmap node.
 * Returns 0-100.
 */
export const skillOverlapPct = (
  courseSkills: string[],
  nodeSkills: string[]
): number => {
  if (nodeSkills.length === 0) return 0;
  const nodeSet = new Set(nodeSkills.map(s => s.toLowerCase()));
  const matches = courseSkills.filter(s => nodeSet.has(s.toLowerCase())).length;
  return Math.round((matches / nodeSkills.length) * 100);
};

/**
 * Build sync links connecting roadmap nodes to their corresponding courses.
 */
export const buildSyncLinks = (
  nodes: RoadmapNode[],
  courses: EngineeringCourse[]
): RoadmapSyncLink[] => {
  const now = Date.now();
  return nodes.map(node => {
    const linked = findCoursesForNode(node, courses);
    return {
      nodeId: node.id,
      linkedCourseId: linked[0]?.id ?? null,
      linkedSkillIds: node.skills
        .map(s => s.toLowerCase().replace(/\s+/g, '-'))
        .slice(0, 4),
      linkedAssessmentId: null, // connected when assessment engine expands
      syncedAt: now,
    };
  });
};

/**
 * Compute how many of the learner's skills are synced across roadmap + courses.
 * Returns 0-100 sync score.
 */
export const computeSyncScore = (
  unlockedSkills: SkillNode[],
  roadmapNodes: RoadmapNode[]
): number => {
  const roadmapSkillSet = new Set(
    roadmapNodes.flatMap(n => n.skills.map(s => s.toLowerCase()))
  );
  if (roadmapSkillSet.size === 0) return 100;
  const synced = unlockedSkills.filter(s =>
    roadmapSkillSet.has(s.label.toLowerCase())
  ).length;
  return Math.round((synced / roadmapSkillSet.size) * 100);
};

/**
 * Given a completed lesson ID, return roadmap nodes it contributes to.
 */
export const nodesContributedByLesson = (
  lessonSkills: string[],
  nodes: RoadmapNode[]
): string[] => {
  const lessonSet = new Set(lessonSkills.map(s => s.toLowerCase()));
  return nodes
    .filter(n => n.status !== 'completed' && n.skills.some(s => lessonSet.has(s.toLowerCase())))
    .map(n => n.id);
};
