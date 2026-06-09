'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';

interface CognitiveRadarChartProps {
  data: { subject: string; value: number; fullMark: number }[];
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLegend?: boolean;
  title?: string;
  subtitle?: string;
}

const sizeMap = {
  sm: 200,
  md: 280,
  lg: 360,
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-slate-900/90 border border-cyan-400/20 rounded-xl px-3 py-2 backdrop-blur-md">
      <p className="text-[10px] font-mono tracking-widest uppercase text-white/40 mb-0.5">
        {item.payload?.subject}
      </p>
      <p className="text-sm font-bold text-cyan-400">
        {item.value}
        <span className="text-white/30 text-xs font-normal ml-1">
          / {item.payload?.fullMark}
        </span>
      </p>
    </div>
  );
};

const CognitiveRadarChart: React.FC<CognitiveRadarChartProps> = ({
  data,
  size = 'md',
  showLegend = true,
  title,
  subtitle,
}) => {
  const chartHeight = sizeMap[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'rounded-[28px] p-5',
        'bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/[0.08]',
        'shadow-[0_0_20px_rgba(192,193,255,0.08)]'
      )}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-white/90 font-bold text-base font-['Hanken_Grotesk',_sans-serif]">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-white/40 text-xs mt-0.5 font-['Inter',_sans-serif]">{subtitle}</p>
          )}
        </div>
      )}

      {/* Chart */}
      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%">
            <PolarGrid
              stroke="rgba(255,255,255,0.06)"
              gridType="polygon"
            />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: 'rgba(76,215,246,0.8)',
                fontSize: 9,
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 500,
              }}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#4cd7f6"
              strokeWidth={2}
              fill="rgba(76,215,246,0.12)"
              style={{ filter: 'drop-shadow(0 0 8px rgba(76,215,246,0.4))' }}
              dot={{ r: 3, fill: '#4cd7f6', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#4cd7f6', stroke: 'rgba(76,215,246,0.4)', strokeWidth: 3 }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-2">
          <span
            className="inline-block w-6 h-0.5 rounded-full bg-cyan-400"
            style={{ boxShadow: '0 0 6px rgba(76,215,246,0.6)' }}
          />
          <span className="text-[9px] font-mono tracking-widest uppercase text-white/30">
            Cognitive Score
          </span>
          <span className="ml-auto text-[9px] font-mono tracking-widest text-cyan-400/60">
            Scale: 0 – {data[0]?.fullMark ?? 100}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default CognitiveRadarChart;
