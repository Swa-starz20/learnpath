import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, TrendingUp, ChevronRight, Brain, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EngineeringCourse, Lesson } from '@/data/engineeringCourses';
import type { AccentColor } from '@/data/engineeringDomains';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';

interface AIStudyInsightProps {
  course: EngineeringCourse;
  activeLesson: Lesson | null;
  accentColor: AccentColor;
}

const WEAK_SKILLS = [
  { skill: 'Graph Algorithms', gap: 'Critical', confidence: 42 },
  { skill: 'Dynamic Programming', gap: 'Moderate', confidence: 61 },
  { skill: 'System Design', gap: 'Low', confidence: 75 },
];

const GAP_COLOR: Record<string, string> = {
  Critical: 'text-red-400',
  Moderate: 'text-amber-400',
  Low: 'text-emerald-400',
};

export const AIStudyInsight = ({ course, activeLesson, accentColor }: AIStudyInsightProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[accentColor];

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      className="relative rounded-[28px] p-5 overflow-hidden bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/[0.08] space-y-4"
    >
      {/* Ambient */}
      <div className={cn('absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-40', accent.bg)} />
      <div className="absolute -bottom-8 left-0 w-28 h-28 bg-cyan-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', accent.bg, 'border', accent.border)}>
            <Sparkles size={12} className={accent.text} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">AI Study Insight</h3>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Adaptive Intelligence</p>
          </div>
        </div>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-cyan-400"
          style={{ boxShadow: '0 0 6px rgba(76,215,246,0.8)' }}
        />
      </div>

      {/* Active lesson context */}
      {activeLesson && (
        <div className={cn('relative z-10 p-3 rounded-xl border', accent.bg, accent.border)}>
          <p className={cn('text-[9px] font-mono tracking-widest uppercase mb-1', accent.text)}>Studying Now</p>
          <p className="text-sm font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">{activeLesson.title}</p>
          <p className="text-[10px] font-mono text-white/35 mt-0.5">{activeLesson.durationMin}min · +{activeLesson.xp} XP</p>
        </div>
      )}

      {/* Skill gaps */}
      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-2.5">
          <AlertCircle size={11} className="text-amber-400" />
          <p className="text-[9px] font-mono tracking-widest text-white/30 uppercase">Skill Gap Analysis</p>
        </div>
        <div className="space-y-2">
          {WEAK_SKILLS.map((ws, i) => (
            <motion.div
              key={ws.skill}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex items-center gap-2"
            >
              <p className="text-[10px] font-mono text-white/55 flex-1 truncate">{ws.skill}</p>
              <span className={cn('text-[9px] font-mono', GAP_COLOR[ws.gap])}>{ws.gap}</span>
              <div className="w-16 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ws.confidence}%` }}
                  transition={{ duration: 0.8, delay: 0.1 * i }}
                  className={cn('h-full rounded-full',
                    ws.gap === 'Critical' ? 'bg-red-500' :
                    ws.gap === 'Moderate' ? 'bg-amber-400' : 'bg-emerald-400'
                  )}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Roadmap sync */}
      <div className="relative z-10 p-3 rounded-xl bg-violet-500/[0.06] border border-violet-500/15">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Target size={10} className="text-violet-400" />
          <p className="text-[9px] font-mono tracking-widest uppercase text-violet-400/70">Roadmap Sync</p>
        </div>
        <p className="text-[11px] text-white/50 font-['Inter',_sans-serif] leading-relaxed">
          This course directly advances your <span className="text-violet-300 font-semibold">{course.modules.find(m => m.status === 'active')?.title}</span> roadmap node. Complete 3 more lessons to unlock the next milestone.
        </p>
      </div>

      {/* AI recommendations */}
      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-2">
          <Brain size={11} className="text-fuchsia-400" />
          <p className="text-[9px] font-mono tracking-widest text-white/30 uppercase">AI Suggestions</p>
        </div>
        {[
          { text: 'Review the previous lesson before continuing', priority: 'high' },
          { text: 'Try the linked practice lab to reinforce concepts', priority: 'med' },
          { text: 'Share your progress with the AI Mentor', priority: 'low' },
        ].map((rec, i) => (
          <motion.button
            key={i}
            whileHover={{ x: 3 }}
            className="w-full flex items-center gap-2 py-1.5 text-left"
          >
            <TrendingUp size={9} className={rec.priority === 'high' ? 'text-fuchsia-400' : 'text-white/25'} />
            <p className="text-[10px] font-['Inter',_sans-serif] text-white/45 flex-1">{rec.text}</p>
            <ChevronRight size={10} className="text-white/20 shrink-0" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
