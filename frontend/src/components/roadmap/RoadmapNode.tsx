import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Zap, Sparkles, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RoadmapNode } from '@/data/roadmapConfigs';
import type { AccentColor } from '@/data/engineeringDomains';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';

interface RoadmapNodeProps {
  node: RoadmapNode;
  index: number;
  accentColor: AccentColor;
  onClick?: (node: RoadmapNode) => void;
  isSelected?: boolean;
}

const statusConfig = {
  completed: {
    ring: 'border-2',
    label: 'Completed',
    icon: CheckCircle2,
  },
  active: {
    ring: 'border-2',
    label: 'In Progress',
    icon: Zap,
  },
  locked: {
    ring: 'border',
    label: 'Locked',
    icon: Lock,
  },
};

export const RoadmapNodeCard = ({
  node,
  index,
  accentColor,
  onClick,
  isSelected,
}: RoadmapNodeProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[accentColor];
  const statusCfg = statusConfig[node.status];
  const StatusIcon = statusCfg.icon;
  const isLocked = node.status === 'locked';
  const isActive = node.status === 'active';
  const isCompleted = node.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={!isLocked ? { y: -3, scale: 1.02 } : {}}
      onClick={() => !isLocked && onClick?.(node)}
      className={cn(
        'relative rounded-2xl p-4 transition-all duration-300 cursor-pointer group',
        'bg-[rgba(255,255,255,0.03)] backdrop-blur-xl',
        isSelected
          ? cn('border-2', accent.border, accent.glow)
          : isActive
          ? cn('border', accent.border, 'shadow-[0_0_12px_rgba(139,92,246,0.12)]')
          : isCompleted
          ? 'border border-white/[0.12]'
          : 'border border-white/[0.06] opacity-60',
        !isLocked && 'cursor-pointer'
      )}
    >
      {/* Key milestone badge */}
      {node.isKeyMilestone && !isLocked && (
        <div className="absolute -top-2.5 left-4">
          <span className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase',
            accent.bg, accent.border, 'border', accent.text
          )}>
            <Sparkles size={7} />
            Milestone
          </span>
        </div>
      )}

      {/* Ambient glow for active */}
      {isActive && (
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className={cn('absolute inset-0 rounded-2xl pointer-events-none', accent.bg)}
          style={{ filter: 'blur(8px)' }}
        />
      )}

      <div className="relative z-10 flex items-start gap-3">
        {/* Status icon */}
        <div className={cn(
          'w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center',
          isCompleted ? cn(accent.bg, accent.border, 'border') :
          isActive ? cn(accent.bg, accent.border, 'border-2') :
          'bg-white/[0.04] border border-white/[0.08]'
        )}>
          <StatusIcon
            size={14}
            className={isLocked ? 'text-white/25' : accent.text}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3 className={cn(
                'text-sm font-bold leading-snug font-[\'Hanken_Grotesk\',_sans-serif]',
                isLocked ? 'text-white/30' : 'text-white/90'
              )}>
                {node.title}
              </h3>
              <p className={cn('text-[10px] font-mono tracking-wide', isLocked ? 'text-white/20' : 'text-white/40')}>
                {node.subtitle}
              </p>
            </div>
            <span className={cn(
              'shrink-0 text-[9px] font-mono tracking-widest px-1.5 py-0.5 rounded-full',
              isCompleted ? cn(accent.bg, accent.text) :
              isActive ? 'bg-white/[0.06] text-white/50' :
              'bg-white/[0.03] text-white/20'
            )}>
              +{node.xpReward} XP
            </span>
          </div>

          {/* Skills chips */}
          {!isLocked && (
            <div className="flex flex-wrap gap-1 mt-2">
              {node.skills.slice(0, 3).map((skill) => (
                <span key={skill} className={cn(
                  'px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/[0.04] border border-white/[0.06]',
                  'text-white/40'
                )}>
                  {skill}
                </span>
              ))}
              {node.skills.length > 3 && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-white/25">
                  +{node.skills.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer: time + confidence */}
          <div className="flex items-center gap-3 mt-2.5">
            <span className="flex items-center gap-1 text-[9px] font-mono text-white/25">
              <Clock size={8} />
              {node.estimatedWeeks}w
            </span>
            {!isLocked && node.aiConfidence > 0 && (
              <span className={cn('text-[9px] font-mono', accent.text)}>
                {node.aiConfidence}% AI confidence
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
