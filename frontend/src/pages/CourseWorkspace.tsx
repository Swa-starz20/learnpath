import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';

// Data
import { ENGINEERING_DOMAINS, DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';
import { getAllCourses } from '@/data/engineeringCourses';
import type { Lesson } from '@/data/engineeringCourses';
import { dispatchIntelligenceEvent } from '@/intelligence/intelligenceEvents';

// Components
import { CourseHero } from '@/components/courses/CourseHero';
import { LessonSidebar } from '@/components/courses/LessonSidebar';
import { LessonPlayer } from '@/components/courses/LessonPlayer';
import { CourseProgressPanel } from '@/components/courses/CourseProgressPanel';
import { AIStudyInsight } from '@/components/courses/AIStudyInsight';
import { PracticeLabCard } from '@/components/courses/PracticeLabCard';
import { ResourceDock } from '@/components/courses/ResourceDock';
import { SkillSyncPanel } from '@/components/courses/SkillSyncPanel';
import { LearningVelocityChart } from '@/components/courses/LearningVelocityChart';

// All courses across all 12 domains — built once at module level
const ALL_COURSES = getAllCourses();

const CourseWorkspace = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  // Resolve course — strict lookup with no silent CS fallback
  const course = ALL_COURSES.find(c => c.id === courseId);
  // Not found guard — show a clear message instead of silently loading wrong course
  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-white/40 font-mono text-sm mb-2">Course not found</p>
          <button
            onClick={() => navigate('/courses')}
            className="text-[11px] font-mono text-violet-400 hover:text-violet-300 transition-colors"
          >
            ← Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const domain = ENGINEERING_DOMAINS.find(d => d.id === course.domainId) ?? ENGINEERING_DOMAINS[0];
  const accent = DOMAIN_ACCENT_CLASSES[course.color];

  // Find active lesson (first non-completed in first active module)
  const defaultActiveLesson = course.modules
    .flatMap(m => m.lessons)
    .find(l => l.status === 'active') ?? null;

  const [activeLessonId, setActiveLessonId] = useState<string | null>(defaultActiveLesson?.id ?? null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(
    course.modules.find(m => m.status === 'active')?.id ?? null
  );

  const handleLessonSelect = useCallback((lessonId: string, moduleId: string) => {
    setActiveLessonId(lessonId);
    setActiveModuleId(moduleId);
  }, []);

  // Resolve active lesson object
  const activeLesson: Lesson | null = course.modules
    .flatMap(m => m.lessons)
    .find(l => l.id === activeLessonId) ?? null;

  // Next lesson (linear traversal)
  const allLessons = course.modules.flatMap(m => m.lessons);
  const currentIdx = allLessons.findIndex(l => l.id === activeLessonId);
  const nextLesson = currentIdx >= 0 && currentIdx < allLessons.length - 1
    ? allLessons[currentIdx + 1]
    : null;

  // Earned XP from completed lessons
  const earnedXP = allLessons
    .filter(l => l.status === 'completed')
    .reduce((s, l) => s + l.xp, 0);

  return (
    <div className="relative min-h-full">
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[50%] h-[40%] bg-violet-600/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/3 w-[40%] h-[35%] bg-cyan-500/[0.03] blur-[100px] rounded-full" />
      </div>

      <div className="space-y-4">
        {/* ── Back nav + course header ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/courses')}
            className="flex items-center gap-1.5 text-[11px] font-mono text-white/40 hover:text-white/70 transition-colors"
          >
            <ArrowLeft size={13} />
            Courses
          </motion.button>
          <div className="w-px h-4 bg-white/[0.10]" />
          <p className={cn('text-[10px] font-mono tracking-widest uppercase', accent.text)}>
            {domain.label}
          </p>
        </motion.div>

        {/* ── Course Hero ───────────────────────────────────────────────── */}
        <CourseHero
          course={course}
          domainLabel={domain.label}
          streak={7}
          earnedXP={earnedXP}
        />

        {/* ── Main workspace: 3-column layout ─────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr_280px] gap-4">

          {/* LEFT: Lesson sidebar */}
          <LessonSidebar
            modules={course.modules}
            activeLessonId={activeLessonId}
            accentColor={course.color}
            onSelect={handleLessonSelect}
          />

          {/* CENTER: Lesson player + labs */}
          <div className="space-y-4 min-w-0">
            <AnimatePresence mode="wait">
              {activeLesson ? (
                <LessonPlayer
                  key={activeLesson.id}
                  lesson={activeLesson}
                  accentColor={course.color}
                  onNext={nextLesson && nextLesson.status !== 'locked'
                    ? () => handleLessonSelect(nextLesson.id, activeModuleId ?? '')
                    : undefined}
                  onComplete={() => {
                    // Dispatch LESSON_COMPLETED so the intelligence engine propagates updates
                    dispatchIntelligenceEvent({
                      type: 'LESSON_COMPLETED',
                      payload: {
                        lessonId: activeLesson.id,
                        moduleId: activeModuleId ?? '',
                        courseId: course.id,
                        domainId: course.domainId as import('@/data/engineeringDomains').DomainId,
                        xpEarned: activeLesson.xp,
                        triggeredAt: Date.now(),
                      },
                    });
                  }}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl p-12 text-center bg-[rgba(255,255,255,0.02)] border border-white/[0.07]"
                >
                  <p className="text-white/30 font-mono text-sm">Select a lesson to begin</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Resource Dock */}
            <ResourceDock accentColor={course.color} resources={[]} />

            {/* Practice Labs */}
            {course.labs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <FlaskConical size={13} className="text-cyan-400" />
                  <p className="text-[9px] font-mono tracking-widest uppercase text-white/30">Practice Labs</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.labs.map((lab, i) => (
                    <PracticeLabCard
                      key={lab.id}
                      lab={lab}
                      accentColor={course.color}
                      index={i}
                      onStart={() => {
                        // Dispatch LAB_COMPLETED when lab is started/completed
                        dispatchIntelligenceEvent({
                          type: 'LAB_COMPLETED',
                          payload: {
                            labId: lab.id,
                            courseId: course.id,
                            domainId: course.domainId as import('@/data/engineeringDomains').DomainId,
                            xpEarned: lab.xp,
                            triggeredAt: Date.now(),
                          },
                        });
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT: AI intelligence stack */}
          <div className="space-y-4">
            {/* Course progress */}
            <CourseProgressPanel
              course={course}
              accentColor={course.color}
              earnedXP={earnedXP}
            />

            {/* AI study insight */}
            <AIStudyInsight
              course={course}
              activeLesson={activeLesson}
              accentColor={course.color}
            />

            {/* Skill sync */}
            <SkillSyncPanel
              skills={course.skills}
              accentColor={course.color}
            />

            {/* Learning velocity */}
            <LearningVelocityChart accentColor={course.color} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseWorkspace;
