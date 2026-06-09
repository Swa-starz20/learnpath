import { motion } from 'framer-motion';
import { Package, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AccentColor } from '@/data/engineeringDomains';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';

interface ResourceItem {
  label: string;
  type: 'doc' | 'video' | 'paper' | 'tool' | 'repo';
  url?: string;
}

interface ResourceDockProps {
  resources: ResourceItem[];
  accentColor: AccentColor;
}

const TYPE_COLOR: Record<string, string> = {
  doc:   'text-cyan-400',
  video: 'text-violet-400',
  paper: 'text-fuchsia-400',
  tool:  'text-amber-400',
  repo:  'text-emerald-400',
};

const DEFAULT_RESOURCES: ResourceItem[] = [
  { label: 'Official Documentation', type: 'doc' },
  { label: 'Lecture Slides (PDF)', type: 'doc' },
  { label: 'Visualization Tool', type: 'tool' },
  { label: 'Reference Implementation', type: 'repo' },
  { label: 'Research Paper', type: 'paper' },
];

export const ResourceDock = ({ resources = DEFAULT_RESOURCES, accentColor }: ResourceDockProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[accentColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="relative rounded-2xl p-4 bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/[0.08]"
    >
      <div className="flex items-center gap-2 mb-3">
        <Package size={12} className={accent.text} />
        <p className="text-[9px] font-mono tracking-widest uppercase text-white/30">Resources</p>
      </div>
      <div className="space-y-2">
        {resources.map((r, i) => (
          <motion.div
            key={i}
            whileHover={{ x: 3 }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', TYPE_COLOR[r.type])} />
            <p className={cn('text-[11px] font-mono flex-1 transition-colors', TYPE_COLOR[r.type], 'opacity-60 group-hover:opacity-100')}>
              {r.label}
            </p>
            <ExternalLink size={9} className="text-white/15 group-hover:text-white/40 transition-colors" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
