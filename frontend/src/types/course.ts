// ── Course intelligence types ─────────────────────────────────────────────────
// Extends base types in data/engineeringCourses.ts with intelligence metadata.

export interface CourseIntelligence {
  courseId: string;
  domainId: string;
  aiMatchScore: number;       // 0-100 personalization score
  assessmentAlignment: number; // 0-100 how well it targets weak skills
  roadmapRelevance: number;   // 0-100 alignment with active roadmap node
  estimatedCompletionDays: number;
  adaptedDifficulty: 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface LessonProgress {
  lessonId: string;
  moduleId: string;
  courseId: string;
  completedAt: number | null; // unix ms
  timeSpentMin: number;
  xpEarned: number;
  confidenceAfter: number;    // 0-100 self-reported or AI-inferred
}
