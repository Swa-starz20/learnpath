import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AccentColor } from '@/data/engineeringDomains';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';

interface PathConnectorProps {
  fromStatus: 'completed' | 'active' | 'locked';
  accentColor: AccentColor;
  orientation?: 'vertical' | 'horizontal';
}

export const PathConnector = ({
  fromStatus,
  accentColor,
  orientation = 'vertical',
}: PathConnectorProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[accentColor];
  const isActive = fromStatus === 'completed';

  if (orientation === 'horizontal') {
    return (
      <div className="flex items-center px-1">
        <div className={cn(
          'h-px flex-1',
          isActive ? cn('bg-gradient-to-r', accent.text, 'opacity-40') : 'bg-white/[0.06]'
        )} />
        {isActive && (
          <motion.div
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className={cn('w-1.5 h-1.5 rounded-full -mx-0.5', accent.bg, 'border', accent.border)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-1 h-8">
      <div className="relative w-px flex-1 overflow-hidden">
        {/* Base track */}
        <div className="absolute inset-0 bg-white/[0.06]" />
        {/* Animated fill for completed connections */}
        {isActive && (
          <motion.div
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={cn('absolute inset-0', accent.text)}
            style={{ background: `linear-gradient(to bottom, currentColor, transparent)`, opacity: 0.4 }}
          />
        )}
      </div>
    </div>
  );
};
