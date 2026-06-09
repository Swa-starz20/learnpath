// ── InterviewWorkspacePage ────────────────────────────────────────────────────
// Phase 2: Interview Intelligence Workspace
// Route: /placements/interview
// Presentation + orchestration only — consumes existing intelligence.
// No real interview engine, no backend, no speech/video.

import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

// ── Existing intelligence infrastructure ──────────────────────────────────────
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
  getVelocityTrend,
  getMentorContextSummary,
} from '@/intelligence/intelligenceSelectors';

// ── Existing domain data ───────────────────────────────────────────────────────
import { ENGINEERING_DOMAINS } from '@/data/engineeringDomains';
import type { DomainId } from '@/data/engineeringDomains';

// ── Interview data configs ─────────────────────────────────────────────────────
import type { InterviewType } from '@/data/interviews/interviewTracks';
import { getMockSessions } from '@/data/interviews/interviewTracks';
import {
  computeTrackReadiness,
  computeInterviewConfidence,
  deriveConfidenceTrend,
  type InterviewReadinessParams,
} from '@/data/interviews/interviewBenchmarks';
import { formatPct } from '@/utils/formatters';

// ── Interview components ───────────────────────────────────────────────────────
import { InterviewHero }            from '@/components/placements/interview/InterviewHero';
import { InterviewTrackSelector }   from '@/components/placements/interview/InterviewTrackSelector';
import { MockInterviewCard }        from '@/components/placements/interview/MockInterviewCard';
import { InterviewEvaluationPanel } from '@/components/placements/interview/InterviewEvaluationPanel';
import { ConfidenceAnalysisCard }   from '@/components/placements/interview/ConfidenceAnalysisCard';
import { WeakAreaPanel }            from '@/components/placements/interview/WeakAreaPanel';
import { InterviewProgressPanel }   from '@/components/placements/interview/InterviewProgressPanel';
import { InterviewInsightsPanel }   from '@/components/placements/interview/InterviewInsightsPanel';

// ── Animation variants (matching existing pages) ──────────────────────────────
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};
const sectionVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

const ALL_TRACKS: InterviewType[] = ['technical', 'aptitude', 'hr', 'domain'];

// ── Page ───────────────────────────────────────────────────────────────────────
const InterviewWorkspacePage = () => {
  // ── Reactive intelligence subscription (same pattern as DashboardPage) ────
  const [intelligenceState, setIntelligenceState] = useState(
    () => getIntelligenceState()
  );
  useEffect(() => onIntelligenceStateChange(setIntelligenceState), []);

  // ── Active track selection ────────────────────────────────────────────────
  const [activeTrack, setActiveTrack] = useState<InterviewType>('technical');

  // ── Derive from intelligence selectors ───────────────────────────────────
  const weakSkills          = intelligenceState ? getWeakSkills(intelligenceState)              : [];
  const adaptiveState       = intelligenceState ? getAdaptiveState(intelligenceState)            : null;
  const masteryScore        = intelligenceState ? getMasteryScore(intelligenceState)             : 0;
  const behaviorSignal      = intelligenceState ? getAdaptiveBehaviorSignal(intelligenceState)  : null;
  const pathAdjustments     = intelligenceState ? getAdaptivePathAdjustments(intelligenceState) : null;
  const mentorInsights      = intelligenceState ? getMentorInsights(intelligenceState)           : [];
  const roadmapReadiness    = intelligenceState ? getRoadmapReadiness(intelligenceState)         : 0;
  const velocity            = intelligenceState ? getLearningVelocitySummary(intelligenceState) : null;
  const velocityTrend       = intelligenceState ? getVelocityTrend(intelligenceState)            : 'stable';
  const mentorContextSummary = intelligenceState ? getMentorContextSummary(intelligenceState)   : '';

  const technicalReadiness  = intelligenceState?.readiness.technicalReadiness  ?? 0;
  const assessmentScore     = intelligenceState?.assessments.overallReadiness  ?? 0;
  const velocityScore       = velocity?.overall ?? 0;
  const nextSkillIds        = intelligenceState?.skills.nextSkillIds            ?? [];
  const domainId            = (intelligenceState?.domainId ?? 'computer') as DomainId;
  const domain              = ENGINEERING_DOMAINS.find(d => d.id === domainId);

  const completedNodeCount  = intelligenceState?.progression.progress.completedNodeIds.length ?? 0;
  const totalMilestones     = intelligenceState?.progression.milestones.length ?? 0;

  // ── Build InterviewReadinessParams from existing signals ──────────────────
  const params: InterviewReadinessParams = {
    technicalReadiness,
    assessmentScore,
    masteryScore,
    velocityScore,
    roadmapReadiness,
  };

  // ── Derived values ────────────────────────────────────────────────────────
  const interviewConfidence = computeInterviewConfidence(params);
  const activeTrackReadiness = computeTrackReadiness(activeTrack, params);

  // Recommend the track where the learner has the highest score
  const recommendedTrack = ALL_TRACKS.reduce<InterviewType>((best, t) => {
    const s = computeTrackReadiness(t, params);
    return s > computeTrackReadiness(best, params) ? t : best;
  }, 'technical');

  const confidenceTrend = deriveConfidenceTrend(velocityTrend, 0);

  // Mock sessions for the active track + domain
  const sessions = getMockSessions(domainId, activeTrack);

  // Adaptive signals
  const shouldAccelerate   = adaptiveState?.shouldAccelerate ?? false;
  const adaptiveRationale  = behaviorSignal?.rationale ?? '';
  const pathAction         = pathAdjustments?.action?.replace(/_/g, ' ') ?? null;

  return (
    <div className="relative min-h-screen">
      {/* ── Background ── */}
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
        {/* ── Breadcrumb ── */}
        <motion.div variants={sectionVariant} className="flex items-center gap-2">
          <Link
            to="/placements"
            className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-white/30 hover:text-white/60 transition-colors uppercase"
          >
            <ChevronLeft size={12} /> Career Readiness
          </Link>
          <span className="text-white/15 text-xs">·</span>
          <span className="text-[10px] font-mono tracking-widest text-violet-400/70 uppercase">
            Interview Workspace
          </span>
        </motion.div>

        {/* ── Page Header ── */}
        <motion.div variants={sectionVariant}>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-mono tracking-[0.22em] text-white/30 uppercase mb-1">
                Phase 2 · Interview Intelligence
              </p>
              <h1 className="text-2xl font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] tracking-tight">
                Interview{' '}
                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Intelligence
                </span>{' '}
                Workspace
              </h1>
              <p className="text-sm text-white/30 mt-1 font-['Inter',_sans-serif]">
                {domain?.label ?? 'Engineering'} · {domain?.icon} AI-powered readiness simulation
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-violet-400 tracking-widest">
                Confidence: {formatPct(interviewConfidence)}
              </p>
              <p className="text-[9px] font-mono text-white/25 mt-0.5">
                Recommended: {recommendedTrack}
              </p>
            </div>
          </div>
          <div className="mt-4 h-px bg-gradient-to-r from-violet-500/20 via-white/5 to-transparent" />
        </motion.div>

        {/* ── HERO ── */}
        <motion.div variants={sectionVariant}>
          <InterviewHero
            params={params}
            recommendedTrack={recommendedTrack}
            domainLabel={domain?.label ?? 'Engineering'}
          />
        </motion.div>

        {/* ── SECTION 1: Track Selector ── */}
        <motion.div variants={sectionVariant}>
          <InterviewTrackSelector
            selected={activeTrack}
            onChange={setActiveTrack}
            params={params}
          />
        </motion.div>

        {/* ── SECTION 2: Mock Interview Workspace ── */}
        <motion.div variants={sectionVariant}>
          <div className="mb-4">
            <p className="text-[9px] font-mono tracking-[0.2em] text-white/25 uppercase">Section 2</p>
            <h2 className="text-base font-semibold text-white/70 font-['Hanken_Grotesk',_sans-serif]">
              Mock Interview Sessions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sessions.map((session, i) => (
              <MockInterviewCard
                key={session.id}
                session={session}
                userReadiness={interviewConfidence}
                trackReadiness={activeTrackReadiness}
                index={i}
              />
            ))}
          </div>
        </motion.div>

        {/* ── SECTION 3: Evaluation + Confidence Cards ── */}
        <motion.div variants={sectionVariant}>
          <div className="mb-4">
            <p className="text-[9px] font-mono tracking-[0.2em] text-white/25 uppercase">Section 3</p>
            <h2 className="text-base font-semibold text-white/70 font-['Hanken_Grotesk',_sans-serif]">
              Evaluation Intelligence
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Evaluation panel spans 2 cols */}
            <div className="lg:col-span-2">
              <InterviewEvaluationPanel
                trackId={activeTrack}
                params={params}
                weakSkills={weakSkills}
                mentorContextSummary={mentorContextSummary}
              />
            </div>
            {/* Confidence analysis cards */}
            <div className="space-y-4">
              {ALL_TRACKS.map((t, i) => (
                <ConfidenceAnalysisCard
                  key={t}
                  trackId={t}
                  params={params}
                  confidenceTrend={confidenceTrend}
                  index={i}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── SECTION 3b: Weak Area Panel ── */}
        <motion.div variants={sectionVariant}>
          <WeakAreaPanel
            domainId={domainId}
            trackId={activeTrack}
            weakSkills={weakSkills}
            nextSkillIds={nextSkillIds}
          />
        </motion.div>

        {/* ── SECTION 4 + 5: Progress + Insights side by side ── */}
        <motion.div variants={sectionVariant} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InterviewProgressPanel
            params={params}
            velocityTrend={velocityTrend}
            completedNodeCount={completedNodeCount}
            totalMilestones={totalMilestones}
          />
          <InterviewInsightsPanel
            domainId={domainId}
            activeTrack={activeTrack}
            params={params}
            mentorInsights={mentorInsights}
            pathAdjustmentAction={pathAction}
            adaptiveRationale={adaptiveRationale}
            shouldAccelerate={shouldAccelerate}
          />
        </motion.div>

        {/* ── Footer ── */}
        <motion.footer
          variants={sectionVariant}
          className="flex flex-col sm:flex-row justify-between items-center gap-3 py-5 border-t border-white/[0.05]"
        >
          <div className="flex items-center gap-4">
            <p className="text-[11px] font-mono font-bold text-violet-400 tracking-widest">LEARNPATH AI</p>
            <span className="text-white/15 text-xs">·</span>
            <p className="text-[11px] text-white/25 font-mono">Interview Intelligence · Phase 2</p>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/placements" className="text-[9px] font-mono text-white/20 hover:text-white/50 tracking-widest uppercase transition-colors">
              ← Career Readiness
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <p className="text-[9px] font-mono text-white/20 tracking-widest uppercase">Workspace Active</p>
            </div>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default InterviewWorkspacePage;
