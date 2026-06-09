
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { CareerTrack, RoadmapNode } from '@/data/roadmapConfigs';
import type { AccentColor } from '@/data/engineeringDomains';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';
import { RoadmapNodeCard } from './RoadmapNode';
import { PathConnector } from './PathConnector';

interface LearningGraphProps {
  track: CareerTrack;
  accentColor: AccentColor;
  onNodeSelect: (node: RoadmapNode) => void;
  selectedNodeId: string | null;
}

export const LearningGraph = ({
  track,
  accentColor,
  onNodeSelect,
  selectedNodeId,
}: LearningGraphProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[accentColor];
  const { nodes } = track;

  // Stats
  const completed = nodes.filter((n) => n.status === 'completed').length;
  const total = nodes.length;
  const pct = Math.round((completed / total) * 100);
  const earnedXP = nodes.filter((n) => n.status === 'completed').reduce((s, n) => s + n.xpReward, 0);

  return (
    <motion.div
      key={track.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative rounded-[28px] overflow-hidden',
        'bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/[0.08]'
      )}
    >
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">
              {track.label} Track
            </h2>
            <span className={cn(
              'px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase border',
              accent.bg, accent.border, accent.text
            )}>
              {track.difficulty}
            </span>
          </div>
          <p className="text-[10px] font-mono text-white/30 mt-0.5">
            Target: {track.targetRole} · {track.duration}
          </p>
        </div>

        {/* Progress ring */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className={cn('text-lg font-bold font-mono', accent.text)}>{pct}%</p>
            <p className="text-[9px] font-mono text-white/30">{completed}/{total} nodes</p>
          </div>
          <div className="relative w-12 h-12">
            <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              <motion.circle
                cx="24" cy="24" r="20" fill="none"
                strokeWidth="4" strokeLinecap="round"
                stroke={accent.text.replace('text-', '').includes('violet') ? '#8b5cf6' :
                       accent.text.includes('cyan') ? '#22d3ee' :
                       accent.text.includes('fuchsia') ? '#d946ef' :
                       accent.text.includes('amber') ? '#f59e0b' :
                       accent.text.includes('emerald') ? '#34d399' :
                       accent.text.includes('rose') ? '#fb7185' :
                       accent.text.includes('sky') ? '#38bdf8' : '#818cf8'}
                strokeDasharray={`${2 * Math.PI * 20}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - pct / 100) }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Graph area */}
      <div className="p-5">
        {/* Horizontal flow indicator strip */}
        <div className="flex items-center gap-1 mb-5 overflow-x-auto scrollbar-none">
          {nodes.map((node, i) => (
            <div key={node.id} className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => node.status !== 'locked' && onNodeSelect(node)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  node.id === selectedNodeId ? 'w-8' : 'w-4',
                  node.status === 'completed' ? cn('opacity-100', accent.bg) :
                  node.status === 'active' ? 'bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.7)]' :
                  'bg-white/[0.08]'
                )}
              />
              {i < nodes.length - 1 && (
                <div className="w-2 h-px bg-white/[0.06]" />
              )}
            </div>
          ))}
          <span className="ml-3 text-[9px] font-mono text-white/25 shrink-0">
            {earnedXP.toLocaleString()} XP earned
          </span>
        </div>

        {/* Node list */}
        <div className="space-y-1">
          <AnimatePresence mode="wait">
            {nodes.map((node, i) => (
              <div key={node.id}>
                <RoadmapNodeCard
                  node={node}
                  index={i}
                  accentColor={accentColor}
                  onClick={onNodeSelect}
                  isSelected={selectedNodeId === node.id}
                />
                {i < nodes.length - 1 && (
                  <PathConnector
                    fromStatus={node.status}
                    accentColor={accentColor}
                    orientation="vertical"
                  />
                )}
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
