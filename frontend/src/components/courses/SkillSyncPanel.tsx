import { motion } from 'framer-motion';
import { Link2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AccentColor } from '@/data/engineeringDomains';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';

interface SkillSyncItem {
  skill: string;
  synced: boolean;
  roadmapNode?: string;
}

interface SkillSyncPanelProps {
  skills: string[];
  accentColor: AccentColor;
}

export const SkillSyncPanel = ({ skills, accentColor }: SkillSyncPanelProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[accentColor];

  const syncedSkills: SkillSyncItem[] = skills.map((s, i) => ({
    skill: s,
    synced: i < Math.ceil(skills.length * 0.6),
    roadmapNode: i < 2 ? 'Active roadmap node' : undefined,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="relative rounded-2xl p-4 bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/[0.08]"
    >
      <div className="flex items-center gap-2 mb-3">
        <Link2 size={12} className={accent.text} />
        <p className="text-[9px] font-mono tracking-widest uppercase text-white/30">Skill Sync</p>
        <span className={cn('ml-auto text-[9px] font-mono', accent.text)}>
          {syncedSkills.filter(s => s.synced).length}/{syncedSkills.length} synced
        </span>
      </div>
      <div className="space-y-1.5">
        {syncedSkills.map((item, i) => (
          <motion.div
            key={item.skill}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.04 * i }}
            className="flex items-center gap-2"
          >
            <CheckCircle2 size={10} className={item.synced ? accent.text : 'text-white/15'} />
            <p className={cn('text-[10px] font-mono flex-1', item.synced ? 'text-white/60' : 'text-white/25')}>
              {item.skill}
            </p>
            {item.roadmapNode && (
              <span className={cn('text-[8px] font-mono px-1.5 py-0.5 rounded', accent.bg, accent.text)}>◈</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
