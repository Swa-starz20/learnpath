import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Lock, Zap, ChevronDown, ChevronRight, BookOpen, FlaskConical, BarChart2, Pencil, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { CourseModule, LessonType } from '@/data/engineeringCourses';
import type { AccentColor } from '@/data/engineeringDomains';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';

const TYPE_ICON: Record<LessonType, typeof BookOpen> = {
  concept:    BookOpen,
  lab:        FlaskConical,
  quiz:       BarChart2,
  assignment: Pencil,
  project:    FolderOpen,
};

const TYPE_COLOR: Record<LessonType, string> = {
  concept:    'text-violet-400',
  lab:        'text-cyan-400',
  quiz:       'text-amber-400',
  assignment: 'text-fuchsia-400',
  project:    'text-emerald-400',
};

interface LessonSidebarProps {
  modules: CourseModule[];
  activeLessonId: string | null;
  accentColor: AccentColor;
  onSelect: (lessonId: string, moduleId: string) => void;
}

export const LessonSidebar = ({ modules, activeLessonId, accentColor, onSelect }: LessonSidebarProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[accentColor];
  const [openModules, setOpenModules] = useState<Set<string>>(
    () => new Set(modules.filter(m => m.status !== 'locked').map(m => m.id))
  );

  const toggleModule = (id: string) => {
    setOpenModules(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-[28px] overflow-hidden bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/[0.08] h-full"
    >
      <div className="px-4 py-3.5 border-b border-white/[0.06]">
        <p className={cn('text-[9px] font-mono tracking-widest uppercase mb-0.5', accent.text)}>Course Content</p>
        <p className="text-xs text-white/40 font-mono">{modules.length} modules</p>
      </div>

      <div className="overflow-y-auto max-h-[70vh] scrollbar-none">
        {modules.map((mod, mi) => {
          const isOpen = openModules.has(mod.id);
          const isLocked = mod.status === 'locked';
          const completedCount = mod.lessons.filter(l => l.status === 'completed').length;

          return (
            <div key={mod.id} className="border-b border-white/[0.04] last:border-0">
              {/* Module header */}
              <button
                onClick={() => !isLocked && toggleModule(mod.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                  isLocked ? 'opacity-45 cursor-not-allowed' : 'hover:bg-white/[0.02]'
                )}
              >
                {/* Status dot */}
                <div className={cn(
                  'w-6 h-6 rounded-lg flex items-center justify-center shrink-0',
                  mod.status === 'completed' ? cn(accent.bg, 'border', accent.border) :
                  mod.status === 'active' ? 'bg-violet-500/15 border border-violet-500/30' :
                  'bg-white/[0.04] border border-white/[0.08]'
                )}>
                  {mod.status === 'completed' ? <CheckCircle2 size={11} className={accent.text} /> :
                   mod.status === 'active' ? <Zap size={11} className="text-violet-400" /> :
                   <Lock size={10} className="text-white/25" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={cn('text-xs font-semibold font-[\'Hanken_Grotesk\',_sans-serif] truncate',
                    isLocked ? 'text-white/30' : 'text-white/85'
                  )}>
                    {mi + 1}. {mod.title}
                  </p>
                  <p className="text-[9px] font-mono text-white/25 truncate">{completedCount}/{mod.lessons.length} lessons</p>
                </div>

                {!isLocked && (
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={12} className="text-white/25 shrink-0" />
                  </motion.div>
                )}
              </button>

              {/* Lesson list */}
              <AnimatePresence>
                {isOpen && !isLocked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    {mod.lessons.map((lesson) => {
                      const Icon = TYPE_ICON[lesson.type];
                      const typeColor = TYPE_COLOR[lesson.type];
                      const isActive = lesson.id === activeLessonId;
                      const isLessonLocked = lesson.status === 'locked';

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => !isLessonLocked && onSelect(lesson.id, mod.id)}
                          className={cn(
                            'w-full flex items-center gap-2.5 pl-[52px] pr-4 py-2.5 text-left transition-all',
                            isActive ? cn(accent.bg, 'border-l-2', accent.border.replace('border-', 'border-l-')) : 'border-l-2 border-transparent',
                            isLessonLocked ? 'opacity-35 cursor-not-allowed' : 'hover:bg-white/[0.02]'
                          )}
                        >
                          <Icon size={11} className={cn(isLessonLocked ? 'text-white/20' : typeColor)} />
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-[11px] font-medium leading-snug truncate',
                              isActive ? accent.text : isLessonLocked ? 'text-white/25' : 'text-white/65'
                            )}>
                              {lesson.title}
                            </p>
                            <p className="text-[9px] font-mono text-white/20">{lesson.durationMin}m · +{lesson.xp} XP</p>
                          </div>
                          {lesson.status === 'completed' && <CheckCircle2 size={10} className={cn('shrink-0', accent.text)} />}
                          {isActive && <ChevronRight size={10} className={cn('shrink-0', accent.text)} />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
