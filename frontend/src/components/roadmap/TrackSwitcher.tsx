import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { CareerTrack } from '@/data/roadmapConfigs';
import type { AccentColor } from '@/data/engineeringDomains';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';

interface TrackSwitcherProps {
  tracks: CareerTrack[];
  selectedTrack: string;
  onSelect: (id: string) => void;
  accentColor: AccentColor;
}

const difficultyColor: Record<string, string> = {
  Beginner:     'text-emerald-400',
  Intermediate: 'text-amber-400',
  Advanced:     'text-orange-400',
  Expert:       'text-red-400',
};

export const TrackSwitcher = ({
  tracks,
  selectedTrack,
  onSelect,
  accentColor,
}: TrackSwitcherProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[accentColor];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {tracks.map((track, i) => {
        const isSelected = track.id === selectedTrack;
        return (
          <motion.button
            key={track.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(track.id)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm transition-all duration-200 border',
              isSelected
                ? cn(accent.bg, accent.border, 'shadow-sm')
                : 'bg-white/[0.03] border-white/[0.07] hover:border-white/[0.14] hover:bg-white/[0.05]'
            )}
          >
            <div className="text-left">
              <p className={cn(
                'text-xs font-semibold font-[\'Hanken_Grotesk\',_sans-serif]',
                isSelected ? accent.text : 'text-white/70'
              )}>
                {track.label}
              </p>
              <div className="flex items-center gap-1.5">
                <span className={cn('text-[9px] font-mono', difficultyColor[track.difficulty])}>
                  {track.difficulty}
                </span>
                <span className="text-white/15 text-[9px]">·</span>
                <span className="text-[9px] font-mono text-white/30">{track.duration}</span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
