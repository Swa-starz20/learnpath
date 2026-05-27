import { motion } from 'framer-motion';
import { TrendingUp, Sparkles, Target, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EngineeringDomain } from '@/data/engineeringDomains';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';
import type { CareerTrack } from '@/data/roadmapConfigs';

interface RoadmapHeroProps {
  domain: EngineeringDomain;
  track: CareerTrack;
  readiness: number;       // 0-100
  aiConfidence: number;    // 0-100
  completedNodes: number;
  totalNodes: number;
}

export const RoadmapHero = ({
  domain,
  track,
  readiness,
  aiConfidence,
  completedNodes,
  totalNodes,
}: RoadmapHeroProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[domain.color];

  const stats = [
    { label: 'Readiness', value: `${readiness}%`, icon: Target, color: accent.text },
    { label: 'AI Confidence', value: `${aiConfidence}%`, icon: Brain, color: 'text-fuchsia-400' },
    { label: 'Progress', value: `${completedNodes}/${totalNodes}`, icon: TrendingUp, color: 'text-cyan-400' },
    { label: 'Market Demand', value: domain.marketDemand, icon: Sparkles, color: 'text-amber-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative rounded-[28px] p-6 overflow-hidden',
        'bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/[0.08]',
        accent.glow
      )}
    >
      {/* Background orbs */}
      <div className={cn('absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30', accent.bg)} />
      <div className="absolute -bottom-8 right-1/3 w-36 h-36 bg-cyan-500/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center gap-6">
        {/* Left: Domain info */}
        <div className="flex-1">
          {/* AI badge */}
          <div className="flex items-center gap-2 mb-3">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={cn('w-1.5 h-1.5 rounded-full', accent.text)}
              style={{ backgroundColor: 'currentColor', boxShadow: '0 0 6px currentColor' }}
            />
            <span className={cn('text-[10px] font-mono tracking-widest uppercase', accent.text)}>
              AI-Powered Roadmap · Live
            </span>
          </div>

          {/* Domain + track */}
          <div className="flex items-center gap-3 mb-1">
            <span className={cn('text-3xl', accent.text)}>{domain.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-white/95 font-['Hanken_Grotesk',_sans-serif] leading-tight">
                {domain.label}
              </h1>
              <p className={cn('text-sm font-mono', accent.text)}>
                {track.label} → {track.targetRole}
              </p>
            </div>
          </div>

          <p className="text-sm text-white/40 font-['Inter',_sans-serif] mt-2 max-w-lg leading-relaxed">
            {domain.description}
          </p>

          {/* Role pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {domain.jobRoles.slice(0, 4).map((role) => (
              <span key={role} className={cn(
                'px-2.5 py-1 rounded-full text-[10px] font-mono border',
                accent.bg, accent.border, accent.text
              )}>
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Stats grid */}
        <div className="grid grid-cols-2 gap-3 xl:w-64 shrink-0">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className={cn(
                  'p-3 rounded-2xl',
                  'bg-[rgba(255,255,255,0.03)] border border-white/[0.07]'
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={10} className={stat.color} />
                  <span className="text-[9px] font-mono tracking-widest text-white/25 uppercase">
                    {stat.label}
                  </span>
                </div>
                <p className={cn('text-base font-bold font-[\'Hanken_Grotesk\',_sans-serif]', stat.color)}>
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
