import { motion } from 'framer-motion';
import { Zap, TrendingUp, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EngineeringCourse } from '@/data/engineeringCourses';
import type { AccentColor } from '@/data/engineeringDomains';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';

interface CourseProgressPanelProps {
  course: EngineeringCourse;
  accentColor: AccentColor;
  earnedXP: number;
}

export const CourseProgressPanel = ({ course, accentColor, earnedXP }: CourseProgressPanelProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[accentColor];
  const completedModules = course.modules.filter(m => m.status === 'completed').length;
  const pct = Math.round((completedModules / course.modules.length) * 100);
  const xpPct = Math.round((earnedXP / course.totalXP) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative rounded-2xl p-4 overflow-hidden bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/[0.08]"
    >
      <div className={cn('absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-40', accent.bg)} />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={13} className={accent.text} />
          <p className="text-xs font-bold text-white/80 font-['Hanken_Grotesk',_sans-serif]">Course Progress</p>
        </div>

        {/* Module progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[9px] font-mono tracking-widest text-white/30 uppercase">Modules</p>
            <p className={cn('text-xs font-bold font-mono', accent.text)}>{completedModules}/{course.modules.length}</p>
          </div>
          <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.1, ease: 'easeOut', delay: 0.3 }}
              className={cn('h-full rounded-full', accent.bg)}
              style={{ boxShadow: '0 0 8px rgba(139,92,246,0.4)' }}
            />
          </div>
          <p className="text-[9px] font-mono text-white/25 mt-1">{pct}% complete</p>
        </div>

        {/* XP progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[9px] font-mono tracking-widest text-white/30 uppercase">XP Earned</p>
            <p className="text-xs font-bold font-mono text-fuchsia-400">{earnedXP.toLocaleString()}</p>
          </div>
          <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 1.1, ease: 'easeOut', delay: 0.4 }}
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500"
              style={{ boxShadow: '0 0 8px rgba(217,70,239,0.3)' }}
            />
          </div>
          <p className="text-[9px] font-mono text-white/25 mt-1">{course.totalXP.toLocaleString()} XP total</p>
        </div>

        {/* Module status mini list */}
        <div className="space-y-1.5 pt-3 border-t border-white/[0.05]">
          {course.modules.map((mod, i) => (
            <div key={mod.id} className="flex items-center gap-2">
              <div className={cn(
                'w-2 h-2 rounded-full shrink-0',
                mod.status === 'completed' ? cn(accent.text, 'shadow-[0_0_4px_currentColor]') :
                mod.status === 'active' ? 'bg-violet-400 shadow-[0_0_4px_rgba(167,139,250,0.6)]' :
                'bg-white/[0.08]'
              )} style={mod.status === 'completed' ? { backgroundColor: 'currentColor' } : {}} />
              <p className={cn('text-[10px] font-mono truncate', mod.status === 'locked' ? 'text-white/20' : 'text-white/50')}>
                {i + 1}. {mod.title}
              </p>
              {mod.status === 'active' && (
                <span className="ml-auto text-[8px] font-mono text-violet-400 shrink-0">active</span>
              )}
            </div>
          ))}
        </div>

        {/* Next milestone */}
        <div className={cn('mt-3 p-3 rounded-xl border', 'bg-white/[0.02] border-white/[0.06]')}>
          <div className="flex items-center gap-1.5">
            <Zap size={10} className="text-amber-400" />
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Next Milestone</p>
          </div>
          <p className="text-xs font-semibold text-white/60 mt-1 font-['Hanken_Grotesk',_sans-serif]">
            {course.modules.find(m => m.status === 'locked')?.title ?? 'Course Complete!'}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={9} className="text-cyan-400" />
            <p className="text-[9px] font-mono text-cyan-400/70">
              +{course.modules.find(m => m.status === 'locked')?.totalXP.toLocaleString() ?? '0'} XP unlock
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
