import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AccentColor } from '@/data/engineeringDomains';
import { DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';

// Mock learning velocity data (days × comprehension %)
const VELOCITY_DATA = [
  { subject: 'Concept',    value: 82, fullMark: 100 },
  { subject: 'Practice',   value: 67, fullMark: 100 },
  { subject: 'Retention',  value: 74, fullMark: 100 },
  { subject: 'Speed',      value: 58, fullMark: 100 },
  { subject: 'Accuracy',   value: 79, fullMark: 100 },
  { subject: 'Depth',      value: 63, fullMark: 100 },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number; payload: { subject: string } }[] }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-900/90 border border-cyan-400/20 rounded-xl px-3 py-2 text-[10px] font-mono">
        <p className="text-cyan-400">{payload[0].payload.subject}</p>
        <p className="text-white/70">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

interface LearningVelocityChartProps {
  accentColor: AccentColor;
}

export const LearningVelocityChart = ({ accentColor }: LearningVelocityChartProps) => {
  const accent = DOMAIN_ACCENT_CLASSES[accentColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="relative rounded-2xl p-4 bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/[0.08]"
    >
      <div className="flex items-center gap-2 mb-1">
        <Activity size={12} className={accent.text} />
        <p className="text-xs font-bold text-white/80 font-['Hanken_Grotesk',_sans-serif]">Learning Velocity</p>
      </div>
      <p className="text-[9px] font-mono text-white/25 mb-3">AI-profiled across 6 dimensions</p>

      <ResponsiveContainer width="100%" height={200}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={VELOCITY_DATA}>
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'rgba(76,215,246,0.7)', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}
          />
          <Radar
            dataKey="value"
            stroke="#4cd7f6"
            fill="rgba(76,215,246,0.1)"
            strokeWidth={1.5}
            dot={{ r: 3, fill: '#4cd7f6' }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-between mt-2">
        <span className="text-[9px] font-mono text-white/25">Overall: 70.5% efficiency</span>
        <span className={cn('text-[9px] font-mono', accent.text)}>↑ 4.2% this week</span>
      </div>
    </motion.div>
  );
};
