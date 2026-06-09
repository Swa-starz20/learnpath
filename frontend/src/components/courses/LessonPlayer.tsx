import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Lesson } from '@/data/engineeringCourses';
import type { AccentColor } from '@/data/engineeringDomains';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';

// ── Lesson content sections (mock intelligence layer) ─────────────────────────
const LESSON_CONTENT: Record<string, { sections: string[]; keyPoints: string[] }> = {
  default: {
    sections: [
      'Understanding the core concept requires building an intuition for how the system behaves under edge cases. Start by visualizing the state transitions before moving to implementation.',
      'The most common mistake engineers make is optimizing prematurely. First get a working solution with clear invariants, then profile and optimize the bottleneck.',
      'Real-world systems introduce constraints that theoretical models ignore — concurrency, failure modes, and latency distributions are the dominant factors in production.',
    ],
    keyPoints: [
      'State invariants define correctness — never break them',
      'Time complexity matters, but cache effects dominate at scale',
      'Write tests before optimizing — measure, don\'t guess',
      'Every abstraction has a cost — choose the right level',
    ],
  },
};

interface LessonPlayerProps {
  lesson: Lesson;
  accentColor: AccentColor;
  onNext?: () => void;
  onComplete?: () => void;
}

export const LessonPlayer = ({ lesson, accentColor, onNext, onComplete }: LessonPlayerProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[accentColor];
  const content = LESSON_CONTENT[lesson.id] ?? LESSON_CONTENT.default;

  return (
    <motion.div
      key={lesson.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      {/* Lesson header */}
      <div className={cn(
        'relative rounded-2xl p-5 overflow-hidden',
        'bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/[0.08]'
      )}>
        <div className={cn('absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-30', accent.bg)} />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className={cn('text-[9px] font-mono tracking-widest uppercase mb-1', accent.text)}>Now Learning</p>
            <h2 className="text-lg font-bold text-white/95 font-['Hanken_Grotesk',_sans-serif] mb-1">{lesson.title}</h2>
            <p className="text-sm text-white/40 font-['Inter',_sans-serif]">{lesson.synopsis}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className={cn('text-lg font-bold font-mono', accent.text)}>+{lesson.xp} XP</p>
            <p className="text-[9px] font-mono text-white/25">{lesson.durationMin} min</p>
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="space-y-3">
        {content.sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-white/[0.06]"
          >
            <p className="text-sm text-white/65 leading-relaxed font-['Inter',_sans-serif]">{section}</p>
          </motion.div>
        ))}
      </div>

      {/* Key points */}
      <div className={cn('rounded-2xl p-4 border', accent.bg, accent.border)}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={12} className={accent.text} />
          <p className={cn('text-[9px] font-mono tracking-widest uppercase', accent.text)}>AI Key Takeaways</p>
        </div>
        <ul className="space-y-1.5">
          {content.keyPoints.map((kp, i) => (
            <li key={i} className="flex items-start gap-2">
              <ChevronRight size={10} className={cn('shrink-0 mt-0.5', accent.text)} />
              <p className="text-[12px] text-white/65 font-['Inter',_sans-serif]">{kp}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Lesson actions */}
      <div className="flex items-center gap-3 pt-1">
        {lesson.status !== 'completed' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold font-[\'Hanken_Grotesk\',_sans-serif]',
              accent.buttonBg, 'text-white shadow-sm hover:brightness-110 transition-all'
            )}
          >
            <BookOpen size={14} />
            Mark Complete · +{lesson.xp} XP
          </motion.button>
        )}
        {onNext && (
          <motion.button
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white/80 border border-white/[0.07] hover:border-white/[0.14] transition-all"
          >
            Next Lesson
            <ExternalLink size={12} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
