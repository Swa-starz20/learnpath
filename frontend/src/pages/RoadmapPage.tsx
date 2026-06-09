import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Data
import { ENGINEERING_DOMAINS } from '@/data/engineeringDomains';
import type { DomainId } from '@/data/engineeringDomains';
import { DOMAIN_ROADMAP_CONFIGS } from '@/data/roadmapConfigs';
import type { RoadmapNode } from '@/data/roadmapConfigs';
import { dispatchIntelligenceEvent } from '@/intelligence/intelligenceEvents';

// Components
import { RoadmapHero } from '@/components/roadmap/RoadmapHero';
import { LearningGraph } from '@/components/roadmap/LearningGraph';
import { DomainSelector } from '@/components/roadmap/DomainSelector';
import { TrackSwitcher } from '@/components/roadmap/TrackSwitcher';
import { AIPathInsight } from '@/components/roadmap/AIPathInsight';
import { AdaptiveRecommendationPanel } from '@/components/roadmap/AdaptiveRecommendationPanel';
import { XPProgressCard, AchievementBadge } from '@/components/roadmap/XPProgressCard';
import { MilestoneTimeline } from '@/components/roadmap/MilestoneTimeline';

// ── Static demo achievements ────────────────────────────────────────────────
const ACHIEVEMENTS = [
  { label: 'First Node', icon: '⚡', unlocked: true },
  { label: 'Week 1', icon: '🔥', unlocked: true },
  { label: 'Milestone 1', icon: '⭐', unlocked: true },
  { label: 'Mid-Track', icon: '🎯', unlocked: false },
  { label: 'Speed Run', icon: '🚀', unlocked: false },
  { label: 'Track Done', icon: '🏆', unlocked: false },
];

// ── Page ──────────────────────────────────────────────────────────────────────
const RoadmapPage = () => {
  // Domain + track state
  const [domainId, setDomainId] = useState<DomainId>('computer');
  const [domainDropOpen, setDomainDropOpen] = useState(false);

  const domain = ENGINEERING_DOMAINS.find((d) => d.id === domainId)!;
  const config = DOMAIN_ROADMAP_CONFIGS[domainId];
  const [trackId, setTrackId] = useState<string>(config.tracks[0].id);

  // Resolve selected track (reset when domain changes)
  const currentTrack = config.tracks.find((t) => t.id === trackId) ?? config.tracks[0];
  const { nodes } = currentTrack;

  // Selected node for AI panel
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    nodes.find((n) => n.status === 'active')?.id ?? null
  );

  const handleDomainChange = useCallback((id: DomainId) => {
    // Dispatch domain change so the intelligence engine rebuilds for the new domain
    dispatchIntelligenceEvent({
      type: 'DOMAIN_CHANGED',
      payload: { previousDomainId: domainId, newDomainId: id, triggeredAt: Date.now() },
    });
    setDomainId(id);
    const newConfig = DOMAIN_ROADMAP_CONFIGS[id];
    setTrackId(newConfig.tracks[0].id);
    const newActive = newConfig.tracks[0].nodes.find((n) => n.status === 'active');
    setSelectedNodeId(newActive?.id ?? null);
  }, [domainId]);

  const handleTrackChange = useCallback((id: string) => {
    // Dispatch track change so the intelligence engine rebuilds recommendations
    dispatchIntelligenceEvent({
      type: 'TRACK_CHANGED',
      payload: { domainId, previousTrackId: trackId, newTrackId: id, triggeredAt: Date.now() },
    });
    setTrackId(id);
    const newTrack = config.tracks.find((t) => t.id === id) ?? config.tracks[0];
    const newActive = newTrack.nodes.find((n) => n.status === 'active');
    setSelectedNodeId(newActive?.id ?? null);
  }, [config.tracks, domainId, trackId]);

  // Derived data
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;
  const activeNode = nodes.find((n) => n.status === 'active') ?? null;
  const nextLockedNode = nodes.find((n) => n.status === 'locked') ?? null;
  const completedNodes = nodes.filter((n) => n.status === 'completed');
  const earnedXP = completedNodes.reduce((s, n) => s + n.xpReward, 0);
  const totalXP = currentTrack.totalXP;
  const readiness = Math.round((completedNodes.length / nodes.length) * 100);
  const aiConfidence = activeNode?.aiConfidence ?? 85;

  return (
    <div className="relative min-h-full">
      {/* ── Atmospheric background ─────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[50%] h-[40%] bg-violet-600/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[40%] h-[40%] bg-cyan-500/[0.03] blur-[100px] rounded-full" />
      </div>

      <div className="space-y-5">
        {/* ── Top toolbar ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 flex-wrap"
        >
          {/* Domain selector */}
          <DomainSelector
            selectedDomain={domainId}
            onSelect={handleDomainChange}
            isOpen={domainDropOpen}
            onToggle={() => setDomainDropOpen((p) => !p)}
          />

          {/* Divider */}
          <div className="w-px h-8 bg-white/[0.08] hidden sm:block" />

          {/* Track switcher */}
          <AnimatePresence mode="wait">
            <TrackSwitcher
              key={domainId}
              tracks={config.tracks}
              selectedTrack={currentTrack.id}
              onSelect={handleTrackChange}
              accentColor={domain.color}
            />
          </AnimatePresence>

          {/* XP chip */}
          <div className={cn(
            'ml-auto hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl',
            'bg-[rgba(255,255,255,0.03)] border border-white/[0.07]'
          )}>
            <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">Earned</span>
            <span className="text-sm font-bold font-mono text-violet-300">{earnedXP.toLocaleString()} XP</span>
          </div>
        </motion.div>

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <RoadmapHero
            key={domainId}
            domain={domain}
            track={currentTrack}
            readiness={readiness}
            aiConfidence={aiConfidence}
            completedNodes={completedNodes.length}
            totalNodes={nodes.length}
          />
        </AnimatePresence>

        {/* ── Main 3-col layout ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
          {/* ── CENTER: Learning Graph ──────────────────────────────────── */}
          <div className="space-y-5">
            <AnimatePresence mode="wait">
              <LearningGraph
                key={currentTrack.id}
                track={currentTrack}
                accentColor={domain.color}
                onNodeSelect={(node: RoadmapNode) => setSelectedNodeId(node.id)}
                selectedNodeId={selectedNodeId}
              />
            </AnimatePresence>

            {/* XP Card + Achievements row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <XPProgressCard
                currentXP={earnedXP}
                totalXP={totalXP}
                level={Math.floor(earnedXP / 1000) + 1}
                streak={7}
                accentColor={domain.color}
              />
              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={cn(
                  'relative rounded-2xl p-4 overflow-hidden',
                  'bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/[0.08]'
                )}
              >
                <p className="text-[9px] font-mono tracking-widest uppercase text-white/25 mb-3">Achievements</p>
                <div className="grid grid-cols-3 gap-2">
                  {ACHIEVEMENTS.map((a, i) => (
                    <AchievementBadge
                      key={a.label}
                      label={a.label}
                      icon={a.icon}
                      unlocked={a.unlocked}
                      accentColor={domain.color}
                      delay={0.05 * i}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Milestone timeline (bottom) */}
            <MilestoneTimeline nodes={nodes} accentColor={domain.color} />
          </div>

          {/* ── RIGHT PANEL ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <AIPathInsight
                key={selectedNodeId ?? 'none'}
                activeNode={selectedNode ?? activeNode}
                nextNode={nextLockedNode}
                accentColor={domain.color}
                domainLabel={domain.label}
              />
            </AnimatePresence>

            <AdaptiveRecommendationPanel
              nodes={nodes}
              accentColor={domain.color}
              onNodeClick={(node) => setSelectedNodeId(node.id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
