import { motion } from 'framer-motion';
import { BookOpen, Zap, Clock, TrendingUp, Target, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EngineeringCourse } from '@/data/engineeringCourses';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';

interface CourseHeroProps {
  course: EngineeringCourse;
  domainLabel: string;
  streak: number;
  earnedXP: number;
}

export const CourseHero = ({ course, domainLabel, streak, earnedXP }: CourseHeroProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[course.color];
  const completedModules = course.modules.filter(m => m.status === 'completed').length;
  const pct = Math.round((completedModules / course.modules.length) * 100);

  const stats = [
    { label: 'AI Match',    value: `${course.matchScore}%`, icon: Sparkles,   color: accent.text },
    { label: 'Progress',    value: `${pct}%`,               icon: TrendingUp,  color: 'text-cyan-400' },
    { label: 'Streak',      value: `${streak}d`,            icon: Zap,         color: 'text-amber-400' },
    { label: 'Earned XP',   value: `${earnedXP.toLocaleString()}`, icon: Target, color: 'text-fuchsia-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={cn(
        'relative rounded-[28px] p-6 overflow-hidden',
        'bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/[0.08]',
        accent.glow
      )}
    >
      {/* Ambient orbs */}
      <div className={cn('absolute -top-16 -left-16 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-25', accent.bg)} />
      <div className="absolute -bottom-10 right-1/3 w-40 h-40 bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-start gap-6">
        {/* Left: Course info */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 mb-3">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={cn('w-1.5 h-1.5 rounded-full', accent.text)}
              style={{ backgroundColor: 'currentColor', boxShadow: '0 0 6px currentColor' }}
            />
            <span className={cn('text-[10px] font-mono tracking-widest uppercase', accent.text)}>
              {domainLabel} · AI-Adaptive Course
            </span>
          </div>

          <h1 className="text-xl font-bold text-white/95 font-['Hanken_Grotesk',_sans-serif] leading-tight mb-1">
            {course.title}
          </h1>
          <p className={cn('text-sm font-mono mb-2', accent.text)}>{course.subtitle}</p>
          <p className="text-sm text-white/40 font-['Inter',_sans-serif] leading-relaxed max-w-2xl">
            {course.description}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-white/30">
              <Clock size={10} /> {course.totalHours}h total
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-white/30">
              <BookOpen size={10} /> {course.modules.length} modules
            </span>
            {course.roadmapSync && (
              <span className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono border', 'bg-violet-500/10 border-violet-500/25 text-violet-400')}>
                ◈ Roadmap Synced
              </span>
            )}
            {course.assessmentLinked && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400">
                ◧ Assessment Linked
              </span>
            )}
          </div>

          {/* Skill chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {course.skills.slice(0, 6).map(s => (
              <span key={s} className={cn('px-2 py-0.5 rounded text-[9px] font-mono border', accent.bg, accent.border, accent.text)}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Stats */}
        <div className="grid grid-cols-2 gap-2.5 xl:w-56 shrink-0">
          {stats.map((st, i) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={st.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 * i }}
                className="p-3 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-white/[0.07]"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={10} className={st.color} />
                  <span className="text-[9px] font-mono tracking-widest text-white/25 uppercase">{st.label}</span>
                </div>
                <p className={cn('text-base font-bold font-[\'Hanken_Grotesk\',_sans-serif]', st.color)}>{st.value}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
