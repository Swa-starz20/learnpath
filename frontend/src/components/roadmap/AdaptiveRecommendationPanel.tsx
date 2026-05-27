import { motion } from 'framer-motion';
import { TrendingUp, Target, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RoadmapNode } from '@/data/roadmapConfigs';
import type { AccentColor } from '@/data/engineeringDomains';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';

interface AdaptiveRecommendationPanelProps {
  nodes: RoadmapNode[];
  accentColor: AccentColor;
  onNodeClick?: (node: RoadmapNode) => void;
}

const RECOMMENDATION_REASONS: string[] = [
  'Highest impact for your career goal',
  'Prerequisite for 3 upcoming nodes',
  'AI detected skill gap — priority boost',
  'Market demand spike detected',
  'Matches your learning velocity pattern',
];

export const AdaptiveRecommendationPanel = ({
  nodes,
  accentColor,
  onNodeClick,
}: AdaptiveRecommendationPanelProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[accentColor];
  // Recommend: active first, then first 2 locked
  const recommended = [
    ...nodes.filter((n) => n.status === 'active'),
    ...nodes.filter((n) => n.status === 'locked').slice(0, 2),
  ].slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className={cn(
        'relative rounded-[28px] p-5 overflow-hidden',
        'bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/[0.08]'
      )}
    >
      <div className={cn('absolute -top-8 -right-8 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-40', accent.bg)} />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-2 mb-4">
        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', 'bg-fuchsia-500/10 border border-fuchsia-500/25')}>
          <Target size={12} className="text-fuchsia-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">AI Recommendations</h3>
          <p className="text-[9px] font-mono tracking-widest text-white/25 uppercase">Adaptive · Real-time</p>
        </div>
        <span className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-[9px] font-mono text-fuchsia-400">
          <Sparkles size={7} />
          ADAPTIVE
        </span>
      </div>

      {/* Recommendation cards */}
      <div className="relative z-10 space-y-2">
        {recommended.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            whileHover={{ x: 3 }}
            onClick={() => onNodeClick?.(node)}
            className={cn(
              'group flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200',
              node.status === 'active'
                ? cn(accent.bg, accent.border)
                : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
            )}
          >
            {/* Priority badge */}
            <div className={cn(
              'shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold font-mono',
              i === 0 ? cn(accent.bg, accent.text, 'border', accent.border) : 'bg-white/[0.06] text-white/30'
            )}>
              {i + 1}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                {node.status === 'active' && (
                  <TrendingUp size={9} className={accent.text} />
                )}
                <p className={cn(
                  'text-[11px] font-semibold font-[\'Hanken_Grotesk\',_sans-serif] truncate',
                  node.status === 'active' ? accent.text : 'text-white/70'
                )}>
                  {node.title}
                </p>
              </div>
              <p className="text-[9px] font-mono text-white/30">
                {RECOMMENDATION_REASONS[i % RECOMMENDATION_REASONS.length]}
              </p>
            </div>

            <ChevronRight size={12} className="text-white/20 group-hover:text-white/50 transition-colors shrink-0 mt-0.5" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
