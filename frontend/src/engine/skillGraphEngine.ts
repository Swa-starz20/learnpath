// ── Skill Graph Engine ────────────────────────────────────────────────────────
// Transforms raw skill strings into interconnected intelligence nodes.
// Pure logic — zero UI dependencies.

import type { SkillNode, SkillDependency, SkillCluster, SkillGap } from '../types/skill';
import type { DomainId } from '../data/engineeringDomains';
import type { RoadmapNode } from '../data/roadmapConfigs';
import type { AssessmentResult } from '../types/assessment';

// ── Static dependency graph (domain-independent structure) ────────────────────
// key: skill label (lowercase), value: skills it depends on
const SKILL_DEPENDENCIES: Record<string, string[]> = {
  // CS / Algorithm chain
  'arrays':              [],
  'linked lists':        ['arrays'],
  'trees':               ['arrays', 'linked lists'],
  'graphs':              ['trees'],
  'dp':                  ['trees', 'graphs'],
  'system design':       ['graphs', 'dp'],
  'distributed systems': ['system design'],
  'microservices':       ['system design'],
  'kafka':               ['distributed systems'],
  // AI/ML chain
  'linear algebra':      [],
  'probability':         ['linear algebra'],
  'calculus':            ['linear algebra'],
  'supervised':          ['linear algebra', 'probability'],
  'cnns':                ['supervised'],
  'transformers':        ['cnns'],
  'rlhf':                ['transformers'],
  // Robotics chain
  'ros2':                [],
  'slam':                ['ros2'],
  'nav2':                ['slam'],
  'kalman filter':       [],
  'path planning':       ['kalman filter', 'nav2'],
  // Mechanical chain
  'solidworks':          [],
  'ansys':               ['solidworks'],
  'cfd':                 ['ansys'],
  'fea':                 ['ansys'],
  // Electrical chain
  'kvl/kcl':             [],
  'transformers_elec':   ['kvl/kcl'],
  'load flow':           ['transformers_elec'],
  'scada':               ['load flow'],
  // Electronics chain
  'verilog':             [],
  'cmos':                ['verilog'],
  'drc/lvs':             ['cmos'],
  // Civil chain
  'autocad':             [],
  'revit':               ['autocad'],
  'staad.pro':           ['autocad'],
  // Aerospace chain
  'xfoil':               [],
  'turbomachinery':      ['xfoil'],
  'simulink':            ['kalman filter'],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Normalise a skill label for dependency lookups */
const normalise = (s: string) => s.toLowerCase().trim();

/** Build SkillNode objects from raw skill strings + context data */
export const buildSkillNodes = (
  skills: string[],
  domainId: DomainId,
  category: string,
  weakSkillIds: string[] = [],
  confidenceOverrides: Record<string, number> = {}
): SkillNode[] =>
  skills.map(label => {
    const id = normalise(label).replace(/\s+/g, '-');
    const isWeak = weakSkillIds.includes(id);
    const confidence = confidenceOverrides[id] ?? (isWeak ? 45 : 75);
    const gap: SkillGap =
      confidence < 50 ? 'Critical' :
      confidence < 65 ? 'Moderate' :
      confidence < 80 ? 'Low' : 'None';

    return {
      id,
      label,
      domainId,
      category,
      status: isWeak ? 'weak' : confidence >= 80 ? 'mastered' : 'learning',
      confidence,
      gap,
      xpWeight: gap === 'Critical' ? 2.0 : gap === 'Moderate' ? 1.5 : gap === 'Low' ? 1.2 : 1.0,
    };
  });

/** Return the dependency edges for a given skill id */
export const getSkillDependencies = (skillId: string): SkillDependency[] => {
  const key = skillId.replace(/-/g, ' ');
  const prereqs = SKILL_DEPENDENCIES[key] ?? [];
  return prereqs.map(dep => ({
    from: normalise(dep).replace(/\s+/g, '-'),
    to: skillId,
    strength: 'hard' as const,
  }));
};

/** Skills unlocked once `skillId` is mastered */
export const getUnlockedSkills = (skillId: string): string[] => {
  const label = skillId.replace(/-/g, ' ');
  return Object.entries(SKILL_DEPENDENCIES)
    .filter(([, deps]) => deps.includes(label))
    .map(([child]) => normalise(child).replace(/\s+/g, '-'));
};

/** 0-100 readiness score for a skill given its prerequisites' confidence */
export const calculateSkillReadiness = (
  skillId: string,
  nodeMap: Record<string, SkillNode>
): number => {
  const deps = getSkillDependencies(skillId);
  if (deps.length === 0) return 100;
  const depConfidences = deps
    .map(d => nodeMap[d.from]?.confidence ?? 0);
  return Math.round(depConfidences.reduce((a, b) => a + b, 0) / depConfidences.length);
};

/** Group weak skills by category and compute cluster stats */
export const getWeakSkillClusters = (nodes: SkillNode[]): SkillCluster[] => {
  const byCategory: Record<string, SkillNode[]> = {};
  for (const node of nodes) {
    if (node.gap !== 'None') {
      (byCategory[node.category] ??= []).push(node);
    }
  }
  return Object.entries(byCategory).map(([category, skills]) => ({
    category,
    skills,
    avgConfidence: Math.round(skills.reduce((s, n) => s + n.confidence, 0) / skills.length),
    weakCount: skills.filter(n => n.gap === 'Critical' || n.gap === 'Moderate').length,
  })).sort((a, b) => a.avgConfidence - b.avgConfidence);
};

/** Ordered list of next skills to learn based on readiness + impact */
export const getNextRecommendedSkills = (
  nodes: SkillNode[],
  nodeMap: Record<string, SkillNode>,
  limit = 4
): SkillNode[] => {
  return nodes
    .filter(n => n.status !== 'mastered')
    .map(n => ({ node: n, readiness: calculateSkillReadiness(n.id, nodeMap) }))
    .filter(({ readiness }) => readiness >= 70) // prerequisites sufficiently met
    .sort((a, b) => {
      // Prioritise: critical gap → highest readiness → highest XP weight
      const gapScore = (g: SkillGap) =>
        g === 'Critical' ? 4 : g === 'Moderate' ? 3 : g === 'Low' ? 2 : 1;
      return (
        gapScore(b.node.gap) - gapScore(a.node.gap) ||
        b.readiness - a.readiness ||
        b.node.xpWeight - a.node.xpWeight
      );
    })
    .slice(0, limit)
    .map(({ node }) => node);
};

/** Extract skill nodes from a set of roadmap nodes */
export const skillsFromRoadmapNodes = (
  roadmapNodes: RoadmapNode[],
  domainId: DomainId,
  weakIds: string[]
): SkillNode[] => {
  const allSkills = Array.from(new Set(roadmapNodes.flatMap(n => n.skills)));
  return buildSkillNodes(allSkills, domainId, 'Roadmap', weakIds);
};

/** Cross-reference assessment weak skills with roadmap skill nodes */
export const correlateAssessmentToRoadmap = (
  assessment: AssessmentResult,
  roadmapNodes: RoadmapNode[]
): { nodeId: string; affectedSkills: string[] }[] => {
  return roadmapNodes
    .filter(n => n.status !== 'completed')
    .map(n => ({
      nodeId: n.id,
      affectedSkills: n.skills.filter(s =>
        assessment.weakSkills.includes(normalise(s).replace(/\s+/g, '-'))
      ),
    }))
    .filter(r => r.affectedSkills.length > 0);
};
