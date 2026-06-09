import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getIntelligenceState, onIntelligenceStateChange } from '@/intelligence/intelligenceSyncEngine';
import { COMPANY_PROFILES } from '@/data/company/companyProfiles';
import {
  COMPANY_BENCHMARKS,
  calculateCompanyReadinessScore,
  calculateCompanyMatchScore
} from '@/data/company/companyBenchmarks';
import {
  computePlacementReadiness,
  computeInterviewReadiness
} from '@/data/placementBenchmarks';

// Components
import { CompanyReadinessHero } from '@/components/placements/company/CompanyReadinessHero';
import { CompanyMatchCard } from '@/components/placements/company/CompanyMatchCard';
import { CompanyCompatibilityMatrix } from '@/components/placements/company/CompanyCompatibilityMatrix';
import { CompanyGapAnalysis } from '@/components/placements/company/CompanyGapAnalysis';
import { PlacementStrategyPanel } from '@/components/placements/company/PlacementStrategyPanel';
import { CompanyInsightsPanel } from '@/components/placements/company/CompanyInsightsPanel';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const sectionVariant = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const CompanyReadinessPage = () => {
  // ── Reactive state subscription ──────────────────────────────────────────
  const [intelligenceState, setIntelligenceState] = useState(() => getIntelligenceState());
  useEffect(() => onIntelligenceStateChange(setIntelligenceState), []);

  // ── Active selected company in the grid ───────────────────────────────────
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('bosch');

  // ── Profile scores for the 5 categories (derived from intelligence state) ──
  const technical = intelligenceState?.readiness.technicalReadiness ?? 68;
  const problemSolving = intelligenceState?.progression.progress.masteryScore ?? 75;
  const domainExpertise = intelligenceState?.assessments.overallReadiness ?? 71;
  const communication = intelligenceState?.learningVelocity.velocity.overall ?? 65;
  const practicalExperience = intelligenceState?.roadmap.intelligence.readinessPct ?? 60;

  // ── Calculate readiness indices ───────────────────────────────────────────
  const placementReadiness = computePlacementReadiness({
    technicalReadiness: technical,
    masteryScore: problemSolving,
    assessmentScore: domainExpertise,
    velocityScore: communication,
    completionPct: practicalExperience,
  });

  const interviewReadiness = computeInterviewReadiness(technical, problemSolving, domainExpertise);
  const aiConfidence = Math.round((problemSolving * 0.4 + domainExpertise * 0.6) * 0.95);

  // ── Compute company-specific stats ────────────────────────────────────────
  const companyStats = COMPANY_PROFILES.map((company) => {
    const benchmark = COMPANY_BENCHMARKS[company.id] || COMPANY_BENCHMARKS['tcs'];
    const readinessScore = calculateCompanyReadinessScore(benchmark, {
      technical,
      problemSolving,
      domainExpertise,
      communication,
      practicalExperience,
    });
    const matchScore = calculateCompanyMatchScore(benchmark, {
      technical,
      problemSolving,
      domainExpertise,
      communication,
      practicalExperience,
    });
    // AI confidence maps directly to matching confidence
    const confidenceScore = Math.max(0, Math.min(100, Math.round(readinessScore * 0.9 + problemSolving * 0.1)));

    return {
      company,
      benchmark,
      readinessScore,
      matchScore,
      confidenceScore,
    };
  });

  // ── Determine Strategy targets ────────────────────────────────────────────
  const sortedByMatch = [...companyStats].sort((a, b) => b.matchScore - a.matchScore);
  
  const bestFit = sortedByMatch[0] || { company: COMPANY_PROFILES[0], matchScore: 80 };
  
  // Safe: highest matching company where matchScore >= 75
  const safeTarget = sortedByMatch.find(c => c.matchScore >= 75) ?? sortedByMatch[sortedByMatch.length - 1];

  // Stretch: high requirements company (e.g. Oracle, Bosch, ABB) with matchScore < 75
  const stretchTarget = [...companyStats]
    .sort((a, b) => b.benchmark.minOverallReadiness - a.benchmark.minOverallReadiness)
    .find(c => c.matchScore < 75) ?? sortedByMatch[0];

  // ── Resolve currently selected company ────────────────────────────────────
  const selectedStat = companyStats.find(cs => cs.company.id === selectedCompanyId) || companyStats[0];

  // ── Determine Immediate Next Action based on selected company's gaps ──────
  const getImmediateAction = () => {
    const { company, benchmark } = selectedStat;
    const gaps = [];
    if (technical < benchmark.minTechnical) gaps.push({ name: 'technical skills', route: '/courses' });
    if (problemSolving < benchmark.minProblemSolving) gaps.push({ name: 'problem solving & aptitude', route: '/assessments' });
    if (domainExpertise < benchmark.minDomainExpertise) gaps.push({ name: 'domain expertise', route: '/assessments' });
    if (communication < benchmark.minCommunication) gaps.push({ name: 'communication skills', route: '/mentor' });
    if (practicalExperience < benchmark.minPracticalExperience) gaps.push({ name: 'practical experience', route: '/roadmap' });

    if (gaps.length > 0) {
      return {
        action: `Accelerate study on ${gaps[0].name} to meet the minimum target for ${company.name}.`,
        route: gaps[0].route,
      };
    }
    return {
      action: `Requirement met! Launch a simulated Interview Session in the Interview Intelligence Workspace for ${company.name}.`,
      route: '/placements/interview',
    };
  };

  const immediateActionInfo = getImmediateAction();

  return (
    <div className="relative min-h-screen">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[50%] h-[40%] bg-violet-600/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/4 w-[40%] h-[40%] bg-cyan-500/[0.03] blur-[100px] rounded-full" />
      </div>

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 max-w-[1400px] mx-auto pb-12"
      >
        {/* Page Hero */}
        <CompanyReadinessHero
          bestMatchName={bestFit.company.name}
          bestMatchLogo={bestFit.company.logo}
          bestMatchScore={bestFit.matchScore}
          overallCompanyReadiness={selectedStat.readinessScore}
          interviewReadiness={interviewReadiness}
          placementReadiness={placementReadiness}
          aiConfidence={aiConfidence}
        />

        {/* Section 1: Company Match Grid */}
        <motion.div variants={sectionVariant}>
          <div className="mb-4">
            <p className="text-[10px] font-mono tracking-widest text-white/35 uppercase">
              Section 1 · Recruiter Grid
            </p>
            <h2 className="text-base font-bold text-white/85 font-['Hanken_Grotesk',_sans-serif]">
              Hiring Company Match Rankings
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {companyStats.map((stat) => (
              <CompanyMatchCard
                key={stat.company.id}
                company={stat.company}
                matchScore={stat.matchScore}
                readinessScore={stat.readinessScore}
                confidenceScore={stat.confidenceScore}
                isSelected={selectedCompanyId === stat.company.id}
                onSelect={() => setSelectedCompanyId(stat.company.id)}
                index={0}
              />
            ))}
          </div>
        </motion.div>

        {/* Sections 2 & 3: Compatibility Matrix & Gap Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={sectionVariant}>
            <CompanyCompatibilityMatrix
              companyName={selectedStat.company.name}
              minAptitude={selectedStat.benchmark.minProblemSolving}
              minTechnical={selectedStat.benchmark.minTechnical}
              minCommunication={selectedStat.benchmark.minCommunication}
              minPractical={selectedStat.benchmark.minPracticalExperience}
              minDomain={selectedStat.benchmark.minDomainExpertise}
              userAptitude={problemSolving}
              userTechnical={technical}
              userCommunication={communication}
              userPractical={practicalExperience}
              userDomain={domainExpertise}
            />
          </motion.div>
          
          <motion.div variants={sectionVariant}>
            <CompanyGapAnalysis
              intelligenceState={intelligenceState}
              company={selectedStat.company}
            />
          </motion.div>
        </div>

        {/* Sections 4 & 5: Strategy & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          <motion.div variants={sectionVariant}>
            <PlacementStrategyPanel
              bestFitName={bestFit.company.name}
              bestFitScore={bestFit.matchScore}
              stretchName={stretchTarget.company.name}
              stretchScore={stretchTarget.matchScore}
              safeName={safeTarget.company.name}
              safeScore={safeTarget.matchScore}
              immediateAction={immediateActionInfo.action}
              actionRoute={immediateActionInfo.route}
            />
          </motion.div>

          <motion.div variants={sectionVariant}>
            <CompanyInsightsPanel
              intelligenceState={intelligenceState}
              company={selectedStat.company}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyReadinessPage;
