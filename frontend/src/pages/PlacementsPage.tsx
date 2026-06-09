// ── PlacementsPage ────────────────────────────────────────────────────────────
// Phase 1: Placement Intelligence Foundation
// Presentation and orchestration layer — consumes ONLY existing intelligence.
// No new intelligence engines, no duplicate calculations.

import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';

// Intelligence infrastructure (existing)
import {
  getIntelligenceState,
  onIntelligenceStateChange,
} from '@/intelligence/intelligenceSyncEngine';
import {
  getWeakSkills,
  getAdaptiveState,
  getMasteryScore,
  getAdaptiveBehaviorSignal,
  getAdaptivePathAdjustments,
  getMentorInsights,
  getRoadmapReadiness,
  getLearningVelocitySummary,
} from '@/intelligence/intelligenceSelectors';

// Existing domain data
import { ENGINEERING_DOMAINS } from '@/data/engineeringDomains';
import type { DomainId } from '@/data/engineeringDomains';

// New placement data configs
import { READINESS_CATEGORIES, computePlacementReadiness } from '@/data/placementBenchmarks';

// Placement components
import { CareerReadinessHero }    from '@/components/placements/CareerReadinessHero';
import { ReadinessBreakdownCard } from '@/components/placements/ReadinessBreakdownCard';
import { RoleCompatibilityMatrix } from '@/components/placements/RoleCompatibilityMatrix';
import { SkillGapPanel }          from '@/components/placements/SkillGapPanel';
import { PlacementInsightsPanel } from '@/components/placements/PlacementInsightsPanel';
import { CareerTrajectoryPanel }  from '@/components/placements/CareerTrajectoryPanel';

// ── Animation variants ─────────────────────────────────────────────────────────
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const sectionVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

// ── Page ───────────────────────────────────────────────────────────────────────
const PlacementsPage = () => {
  // ── Reactive intelligence subscription (same pattern as DashboardPage) ───
  const [intelligenceState, setIntelligenceState] = useState(
    () => getIntelligenceState()
  );
  useEffect(() => onIntelligenceStateChange(setIntelligenceState), []);

  // ── Domain selector (presentation only — reads from intelligence state) ───
  const activeDomainId = (intelligenceState?.domainId ?? 'computer') as DomainId;
  const [selectedDomain, setSelectedDomain] = useState<DomainId>(activeDomainId);

  // Keep domain in sync when intelligence state changes domain
  useEffect(() => {
    if (intelligenceState?.domainId) {
      setSelectedDomain(intelligenceState.domainId as DomainId);
    }
  }, [intelligenceState?.domainId]);

  // ── Consume ONLY existing intelligence selectors ──────────────────────────
  const weakSkills       = intelligenceState ? getWeakSkills(intelligenceState)            : [];
  const adaptiveState    = intelligenceState ? getAdaptiveState(intelligenceState)          : null;
  const masteryScore     = intelligenceState ? getMasteryScore(intelligenceState)           : 0;
  const behaviorSignal   = intelligenceState ? getAdaptiveBehaviorSignal(intelligenceState) : null;
  const pathAdjustments  = intelligenceState ? getAdaptivePathAdjustments(intelligenceState) : null;
  const insights         = intelligenceState ? getMentorInsights(intelligenceState)         : [];
  const roadmapReadiness = intelligenceState ? getRoadmapReadiness(intelligenceState)       : 0;
  const velocity         = intelligenceState ? getLearningVelocitySummary(intelligenceState) : null;
  const estimatedWeeks   = intelligenceState?.roadmap.intelligence.estimatedCompletionWeeks ?? 24;

  const technicalReadiness = intelligenceState?.readiness.technicalReadiness    ?? 0;
  const assessmentScore    = intelligenceState?.assessments.overallReadiness    ?? 0;
  const velocityScore      = velocity?.overall ?? 0;
  const nextSkillIds       = intelligenceState?.skills.nextSkillIds              ?? [];
  const allSkillNodes      = intelligenceState?.skills.allNodes                  ?? [];

  // Next course + roadmap node titles from recommendations
  const nextRoadmapNodeTitle = intelligenceState?.recommendations.nextRoadmapNode?.targetLabel ?? null;
  const nextCourseTitle      = intelligenceState?.recommendations.nextCourse?.targetLabel      ?? null;

  // ── Placement Readiness: composite from existing metrics ─────────────────
  // computePlacementReadiness is a pure function from placementBenchmarks.ts
  const placementReadiness = computePlacementReadiness({
    technicalReadiness,
    masteryScore,
    assessmentScore,
    velocityScore,
    completionPct: roadmapReadiness,
  });

  // ── Per-category scores for ReadinessBreakdownCard ───────────────────────
  // Map READINESS_CATEGORIES to existing intelligence metrics (no new logic)
  const categoryScores: Record<string, number> = {
    'technical':             technicalReadiness,
    'problem-solving':       masteryScore,
    'domain-expertise':      roadmapReadiness,
    'communication':         assessmentScore,
    'practical-experience':  Math.round(velocityScore * 0.85),
  };

  // Weak skill IDs for role compatibility
  const weakSkillIds = weakSkills.map(s => s.id);

  // ── Default behavior signal fallback ─────────────────────────────────────
  const defaultBehaviorSignal = {
    pattern: 'highlyEngaged' as const,
    confidence: 0,
    rationale: 'Complete assessments to activate adaptive intelligence.',
    suggestedAction: 'maintain_pace' as const,
    requiresMentorIntervention: false,
  };

  return (
    <div className="relative min-h-screen">
      {/* ── Atmospheric background ── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-1/4 right-0 w-[55%] h-[55%] bg-violet-600/[0.05] blur-[130px] rounded-full" />
        <div className="absolute bottom-0 -left-1/4 w-[45%] h-[45%] bg-cyan-500/[0.04] blur-[110px] rounded-full" />
        <div className="absolute top-[40%] left-[30%] w-[35%] h-[35%] bg-fuchsia-600/[0.03] blur-[90px] rounded-full" />
      </div>

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 max-w-[1400px] mx-auto"
      >
        {/* ── Page Header ── */}
        <motion.div variants={sectionVariant} className="mb-2">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-mono tracking-[0.22em] text-white/30 uppercase mb-1">
                Phase 1 · Intelligence Foundation
              </p>
              <h1 className="text-2xl font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] tracking-tight">
                Career{' '}
                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Readiness
                </span>
              </h1>
            </div>

            {/* Domain selector */}
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {ENGINEERING_DOMAINS.slice(0, 6).map(domain => (
                <button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain.id)}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-mono tracking-widest uppercase transition-all duration-200 ${
                    selectedDomain === domain.id
                      ? 'bg-violet-500/15 border border-violet-500/30 text-violet-300'
                      : 'bg-white/[0.02] border border-white/[0.06] text-white/30 hover:text-white/50'
                  }`}
                >
                  {domain.shortLabel}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 h-px bg-gradient-to-r from-violet-500/20 via-white/5 to-transparent" />
        </motion.div>

        {/* ── HERO: Career Readiness Overview ── */}
        <motion.div variants={sectionVariant}>
          <CareerReadinessHero
            intelligenceState={intelligenceState}
            placementReadiness={placementReadiness}
          />
        </motion.div>

        {/* ── SECTION 1: Readiness Breakdown ── */}
        <motion.div variants={sectionVariant}>
          <div className="mb-4">
            <p className="text-[9px] font-mono tracking-[0.2em] text-white/25 uppercase">
              Section 1
            </p>
            <h2 className="text-base font-semibold text-white/70 font-['Hanken_Grotesk',_sans-serif]">
              Readiness Breakdown
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {READINESS_CATEGORIES.map((category, i) => (
              <ReadinessBreakdownCard
                key={category.id}
                category={category}
                score={categoryScores[category.id] ?? 0}
                index={i}
              />
            ))}
          </div>
        </motion.div>

        {/* ── SECTION 2 + 3: Role Matrix & Skill Gaps side-by-side ── */}
        <motion.div variants={sectionVariant} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 2: Role Compatibility */}
          <div>
            <div className="mb-4">
              <p className="text-[9px] font-mono tracking-[0.2em] text-white/25 uppercase">
                Section 2
              </p>
              <h2 className="text-base font-semibold text-white/70 font-['Hanken_Grotesk',_sans-serif]">
                Role Compatibility
              </h2>
            </div>
            <RoleCompatibilityMatrix
              domainId={selectedDomain}
              readinessPct={roadmapReadiness}
              weakSkillIds={weakSkillIds}
            />
          </div>

          {/* Section 3: Skill Gap Analysis */}
          <div>
            <div className="mb-4">
              <p className="text-[9px] font-mono tracking-[0.2em] text-white/25 uppercase">
                Section 3
              </p>
              <h2 className="text-base font-semibold text-white/70 font-['Hanken_Grotesk',_sans-serif]">
                Skill Gap Analysis
              </h2>
            </div>
            <SkillGapPanel
              allSkillNodes={allSkillNodes}
              nextSkillIds={nextSkillIds}
            />
          </div>
        </motion.div>

        {/* ── SECTION 4: AI Placement Insights ── */}
        <motion.div variants={sectionVariant}>
          <div className="mb-4">
            <p className="text-[9px] font-mono tracking-[0.2em] text-white/25 uppercase">
              Section 4
            </p>
            <h2 className="text-base font-semibold text-white/70 font-['Hanken_Grotesk',_sans-serif]">
              AI Placement Insights
            </h2>
          </div>
          <PlacementInsightsPanel
            insights={insights}
            pathAdjustments={pathAdjustments}
            behaviorSignal={behaviorSignal ?? defaultBehaviorSignal}
            nextRoadmapNodeTitle={nextRoadmapNodeTitle}
            nextCourseTitle={nextCourseTitle}
            readinessPct={roadmapReadiness}
          />
        </motion.div>

        {/* ── SECTION 5: Career Trajectory ── */}
        <motion.div variants={sectionVariant}>
          <div className="mb-4">
            <p className="text-[9px] font-mono tracking-[0.2em] text-white/25 uppercase">
              Section 5
            </p>
            <h2 className="text-base font-semibold text-white/70 font-['Hanken_Grotesk',_sans-serif]">
              Career Trajectory
            </h2>
          </div>
          <CareerTrajectoryPanel
            domainId={selectedDomain}
            readinessPct={roadmapReadiness}
            estimatedWeeks={estimatedWeeks}
            shouldAccelerate={adaptiveState?.shouldAccelerate ?? false}
            engagementScore={adaptiveState?.engagementScore ?? 0}
          />
        </motion.div>

        {/* ── Phase 2 CTA: Interview Intelligence Workspace ── */}
        <motion.div variants={sectionVariant}>
          <div className="relative overflow-hidden rounded-[28px] border border-violet-500/20 bg-gradient-to-r from-violet-900/20 via-violet-800/10 to-cyan-900/15 backdrop-blur-xl p-8">
            {/* Ambient glow */}
            <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-violet-500/10 blur-[60px] pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-cyan-400/[0.06] blur-[50px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  <p className="text-[9px] font-mono tracking-[0.2em] text-violet-400/70 uppercase">Phase 2 · Available Now</p>
                </div>
                <h2 className="text-xl font-bold text-white/85 font-['Hanken_Grotesk',_sans-serif] mb-2">
                  Interview Intelligence{' '}
                  <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Workspace</span>
                </h2>
                <p className="text-[12px] text-white/40 font-['Inter',_sans-serif] max-w-lg">
                  Simulate interviews, evaluate readiness by track, analyse confidence, and get AI-driven prep guidance.
                  The bridge between career readiness and real interviews.
                </p>
              </div>
              <Link
                to="/placements/interview"
                className="flex-shrink-0 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-violet-500/20 border border-violet-500/35 text-violet-300 font-['Hanken_Grotesk',_sans-serif] font-semibold text-sm hover:bg-violet-500/30 hover:border-violet-500/55 hover:shadow-[0_0_24px_rgba(139,92,246,0.2)] transition-all duration-300"
              >
                Enter Interview Workspace
                <span className="text-violet-400/70">→</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Footer ── */}
        <motion.footer
          variants={sectionVariant}
          className="flex flex-col sm:flex-row justify-between items-center gap-3 py-5 border-t border-white/[0.05]"
        >
          <div className="flex items-center gap-4">
            <p className="text-[11px] font-mono font-bold text-violet-400 tracking-widest">
              LEARNPATH AI
            </p>
            <span className="text-white/15 text-xs">·</span>
            <p className="text-[11px] text-white/25 font-mono">Placement Intelligence · Phase 1</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <p className="text-[9px] font-mono text-white/20 tracking-widest uppercase">
              Intelligence Active
            </p>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default PlacementsPage;
