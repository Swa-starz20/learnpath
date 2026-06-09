// ── Shared primitive types ────────────────────────────────────────────────────
// Re-exported here so all engines import from one place.

export type { DomainId, AccentColor, EngineeringDomain } from '../data/engineeringDomains';
export type { NodeStatus, RoadmapNode, CareerTrack, DomainRoadmapConfig } from '../data/roadmapConfigs';
export type {
  LessonType, LessonStatus, DifficultyLevel,
  Lesson, CourseModule, PracticeLab, EngineeringCourse,
} from '../data/engineeringCourses';
