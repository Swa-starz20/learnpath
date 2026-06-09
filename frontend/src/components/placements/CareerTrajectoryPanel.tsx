// ── CareerTrajectoryPanel ─────────────────────────────────────────────────────
// Section 5: Visualizes learner progression path from current to target role.
// Derives trajectory from careerTracks config + existing roadmap/readiness signals.
// No hardcoded roles — everything from config + intelligence state.

import { motion } from 'framer-motion';
import { ArrowDown, MapPin, Flag, Star } from 'lucide-react';
import type { DomainId } from '@/data/engineeringDomains';
import { ENGINEERING_DOMAINS } from '@/data/engineeringDomains';
import { getCareerTrack, getReadinessLevel } from '@/data/careerTracks';

interface CareerTrajectoryPanelProps {
  domainId: DomainId;
  readinessPct: number;
  estimatedWeeks: number;
  shouldAccelerate: boolean;
  engagementScore: number;
}

interface TrajectoryNode {
  role: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCurrent: boolean;
  isReached: boolean;
  color: string;
  borderColor: string;
  bgColor: string;
  weeks: string;
}

export const CareerTrajectoryPanel = ({
  domainId,
  readinessPct,
  estimatedWeeks,
  shouldAccelerate,
  engagementScore,
}: CareerTrajectoryPanelProps) => {
  const domain = ENGINEERING_DOMAINS.find(d => d.id === domainId);
  const track  = getCareerTrack(domainId);
  const level  = getReadinessLevel(readinessPct, track.readinessThreshold); void engagementScore;

  // Determine which node is "current" based on readiness level
  const isEntryDone = readinessPct >= 40;
  const isMidDone   = readinessPct >= track.readinessThreshold;
  const isSeniorDone = readinessPct >= 90;

  const trajectoryNodes: TrajectoryNode[] = [
    {
      role: 'Engineering Student',
      label: 'Current Position',
      icon: <MapPin size={16} />,
      isActive: !isEntryDone,
      isCurrent: !isEntryDone,
      isReached: true,
      color: 'text-white/60',
      borderColor: 'border-white/20',
      bgColor: 'bg-white/[0.05]',
      weeks: 'Now',
    },
    {
      role: track.entryRole,
      label: 'Entry Level',
      icon: <Star size={16} />,
      isActive: isEntryDone && !isMidDone,
      isCurrent: isEntryDone && !isMidDone,
      isReached: isEntryDone,
      color: isEntryDone ? 'text-cyan-300' : 'text-white/30',
      borderColor: isEntryDone ? 'border-cyan-400/40' : 'border-white/10',
      bgColor: isEntryDone ? 'bg-cyan-400/10' : 'bg-white/[0.02]',
      weeks: `${Math.round(estimatedWeeks * 0.35)}w at current pace`,
    },
    {
      role: track.midRole,
      label: 'Placement Ready',
      icon: <Flag size={16} />,
      isActive: isMidDone && !isSeniorDone,
      isCurrent: isMidDone && !isSeniorDone,
      isReached: isMidDone,
      color: isMidDone ? 'text-violet-300' : 'text-white/25',
      borderColor: isMidDone ? 'border-violet-400/40' : 'border-white/[0.06]',
      bgColor: isMidDone ? 'bg-violet-500/10' : 'bg-white/[0.01]',
      weeks: `${estimatedWeeks}w estimated`,
    },
    {
      role: track.seniorRole,
      label: 'Target Role',
      icon: <Star size={16} />,
      isActive: false,
      isCurrent: isSeniorDone,
      isReached: isSeniorDone,
      color: isSeniorDone ? 'text-fuchsia-300' : 'text-white/20',
      borderColor: isSeniorDone ? 'border-fuchsia-400/40' : 'border-white/[0.04]',
      bgColor: isSeniorDone ? 'bg-fuchsia-500/10' : 'bg-white/[0.01]',
      weeks: `${Math.round(estimatedWeeks * 2.5)}w projected`,
    },
  ];

  // Accelerated ETA
  const acceleratedWeeks = shouldAccelerate
    ? Math.round(estimatedWeeks * 0.75)
    : estimatedWeeks;

  return (
    <div className="rounded-[28px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mb-1">
            Career Trajectory
          </p>
          <h3 className="text-lg font-bold text-white/85 font-['Hanken_Grotesk',_sans-serif]">
            {domain?.label ?? 'Engineering'} Path
          </h3>
          <p className="text-[11px] text-white/30 mt-0.5 font-['Inter',_sans-serif]">
            Derived from roadmap progress, readiness metrics, and adaptive intelligence
          </p>
        </div>
        <div className="text-right">
          <p className={`text-[9px] font-mono tracking-widest uppercase ${
            level === 'Lead'     ? 'text-fuchsia-400' :
            level === 'Senior'   ? 'text-violet-400' :
            level === 'Mid-Level'? 'text-cyan-400' :
            level === 'Junior'   ? 'text-amber-400' : 'text-white/30'
          }`}>
            {level} Level
          </p>
          <p className="text-[9px] font-mono text-white/20 mt-0.5">
            {readinessPct}% readiness
          </p>
        </div>
      </div>

      {/* Trajectory flow — vertical */}
      <div className="relative">
        {trajectoryNodes.map((node, i) => (
          <div key={node.role}>
            {/* Node */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
              className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 ${node.borderColor} ${node.bgColor} ${node.isCurrent ? 'shadow-[0_0_20px_rgba(139,92,246,0.1)]' : ''}`}
            >
              {/* Pulse for current */}
              {node.isCurrent && (
                <div className="absolute -top-1 -right-1 w-3 h-3">
                  <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-50" />
                  <div className="relative w-3 h-3 rounded-full bg-cyan-400" />
                </div>
              )}

              {/* Icon */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${node.borderColor} ${node.bgColor}`}>
                <span className={node.color}>{node.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-[9px] font-mono tracking-widest uppercase mb-0.5 ${node.color} opacity-60`}>
                  {node.label}
                  {node.isCurrent && (
                    <span className="ml-2 text-cyan-400 opacity-80">← You are here</span>
                  )}
                </p>
                <p className={`text-sm font-semibold font-['Hanken_Grotesk',_sans-serif] ${node.color}`}>
                  {node.role}
                </p>
                <p className="text-[9px] font-mono text-white/20 mt-0.5">{node.weeks}</p>
              </div>

              {/* Readiness pill */}
              {node.isReached && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-[8px] font-mono text-emerald-400 tracking-widest flex-shrink-0">
                  REACHED
                </span>
              )}
            </motion.div>

            {/* Connector arrow (not after last) */}
            {i < trajectoryNodes.length - 1 && (
              <div className="flex items-center justify-start pl-6 py-2">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="text-white/15"
                >
                  <ArrowDown size={16} />
                </motion.div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* AI ETA bar */}
      <div className="mt-6 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.01]">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] font-mono tracking-widest text-white/30 uppercase">
            {shouldAccelerate ? 'Accelerated ETA' : 'Estimated Time to Placement Ready'}
          </p>
          <span className={`text-[10px] font-mono ${shouldAccelerate ? 'text-emerald-400' : 'text-white/40'}`}>
            {shouldAccelerate ? `~${acceleratedWeeks}w` : `~${estimatedWeeks}w`}
          </span>
        </div>
        <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (readinessPct / track.readinessThreshold) * 100)}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <p className="text-[8px] font-mono text-white/15">0%</p>
          <p className="text-[8px] font-mono text-white/15">
            Placement threshold: {track.readinessThreshold}%
          </p>
        </div>
      </div>

      {/* Core evaluation skills */}
      <div className="mt-5">
        <p className="text-[9px] font-mono tracking-widest text-white/25 uppercase mb-3">
          Core Evaluation Skills for {track.entryRole}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {track.coreEvaluationSkills.map(skill => (
            <span
              key={skill}
              className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.07] text-[9px] font-mono text-white/35 tracking-wide"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
