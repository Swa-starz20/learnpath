import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { EngineeringCourse } from '@/data/engineeringCourses';
import type { AccentColor } from '@/data/engineeringDomains';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';


interface CourseTrackSwitcherProps {
  courses: EngineeringCourse[];
  activeCourseId: string;
  accentColor: AccentColor;
  onSelect: (id: string) => void;
}

export const CourseTrackSwitcher = ({ courses, activeCourseId, accentColor, onSelect }: CourseTrackSwitcherProps) => {
  void accentColor;


  return (
    <div className="flex flex-wrap gap-2">
      {courses.map((course, i) => {
        const isActive = course.id === activeCourseId;
        const a = DOMAIN_ACCENT_CLASSES[course.color];
        return (
          <motion.button
            key={course.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(course.id)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm border transition-all duration-200',
              isActive ? cn(a.bg, a.border) : 'bg-white/[0.02] border-white/[0.07] hover:border-white/[0.13]'
            )}
          >
            <p className={cn('text-xs font-semibold font-[\'Hanken_Grotesk\',_sans-serif]',
              isActive ? a.text : 'text-white/55'
            )}>
              {course.title}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
};
