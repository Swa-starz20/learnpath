import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RoadmapNode } from '@/data/roadmapConfigs';
import type { AccentColor } from '@/data/engineeringDomains';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';

interface MilestoneTimelineProps {
  nodes: RoadmapNode[];
  accentColor: AccentColor;
}

export const MilestoneTimeline = ({ nodes, accentColor }: MilestoneTimelineProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[accentColor];
  const milestones = nodes.filter((n) => n.isKeyMilestone);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn(
        'relative rounded-[28px] p-5 overflow-hidden',
        'bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/[0.08]'
      )}
    >
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-violet-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-5 relative z-10">
        <Zap size={14} className={accent.text} />
        <h3 className="text-sm font-bold text-white/80 font-['Hanken_Grotesk',_sans-serif]">
          Milestones
        </h3>
        <span className={cn(
          'ml-auto text-[9px] font-mono tracking-widest px-2 py-0.5 rounded-full',
          accent.bg, accent.border, 'border', accent.text
        )}>
          {milestones.filter(m => m.status === 'completed').length}/{milestones.length} done
        </span>
      </div>

      {/* Timeline */}
      <div className="relative z-10">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-px bg-white/[0.06]" />

        <div className="space-y-4">
          {milestones.map((node, i) => {
            const isCompleted = node.status === 'completed';
            const isActive = node.status === 'active';

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                className="relative flex items-start gap-4 pl-9"
              >
                {/* Dot */}
                <div className="absolute left-0 top-0.5">
                  {isCompleted ? (
                    <div className={cn(
                      'w-[30px] h-[30px] rounded-full flex items-center justify-center',
                      accent.bg, 'border', accent.border
                    )}>
                      <CheckCircle2 size={13} className={accent.text} />
                    </div>
                  ) : isActive ? (
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      className={cn(
                        'w-[30px] h-[30px] rounded-full flex items-center justify-center',
                        'bg-violet-500/20 border-2 border-violet-400/60',
                        'shadow-[0_0_12px_rgba(167,139,250,0.4)]'
                      )}
                    >
                      <div className="w-2 h-2 rounded-full bg-violet-400" />
                    </motion.div>
                  ) : (
                    <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center bg-white/[0.04] border border-white/[0.08]">
                      <Circle size={10} className="text-white/20" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={cn(isCompleted || isActive ? '' : 'opacity-40')}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={cn(
                      'text-sm font-semibold font-[\'Hanken_Grotesk\',_sans-serif]',
                      isCompleted ? accent.text : isActive ? 'text-white/80' : 'text-white/35'
                    )}>
                      {node.title}
                    </p>
                    {isCompleted && (
                      <span className={cn(
                        'text-[9px] font-mono tracking-widest px-1.5 py-0.5 rounded-full',
                        accent.bg, accent.border, 'border', accent.text
                      )}>
                        +{node.xpReward} XP
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-white/30 mt-0.5">{node.subtitle}</p>
                  {isActive && (
                    <div className="mt-2 h-1 w-24 bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '45%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-violet-500 rounded-full shadow-[0_0_6px_rgba(139,92,246,0.6)]"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
