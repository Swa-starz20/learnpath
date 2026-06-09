import { AlertCircle, Target, BookOpen, AlertOctagon } from 'lucide-react';
import type { UserIntelligenceState } from '@/intelligence/userIntelligenceState';
import type { CompanyProfile } from '@/data/company/companyProfiles';
import { getWeakSkills } from '@/intelligence/intelligenceSelectors';
import { getCoursesForDomain } from '@/data/engineeringCourses';
import { DOMAIN_ROADMAP_CONFIGS } from '@/data/roadmapConfigs';

interface CompanyGapAnalysisProps {
  intelligenceState: UserIntelligenceState | null;
  company: CompanyProfile;
}

export const CompanyGapAnalysis = ({
  intelligenceState,
  company,
}: CompanyGapAnalysisProps) => {
  if (!intelligenceState) return null;

  // 1. Weak skills from selector
  const allWeak = getWeakSkills(intelligenceState);
  const criticalBlockers = allWeak.filter((s) => s.gap === 'Critical');

  // 2. Missing Skills: preferred domains / roles relevant skills that user hasn't mastered yet
  // We can look at the current track's milestone skills or company's preferred fields
  const activeTrackId = intelligenceState.trackId;
  const activeDomainId = intelligenceState.domainId;
  const activeConfig = DOMAIN_ROADMAP_CONFIGS[activeDomainId];
  
  // Find all skills in the active roadmap that aren't mastered
  const activeTrackNodes = activeConfig?.tracks.find(t => t.id === activeTrackId)?.nodes ?? [];
  const trackSkills = Array.from(new Set(activeTrackNodes.flatMap(n => n.skills)));
  const masteredSkillLabels = new Set(
    intelligenceState.skills.allNodes
      .filter(s => s.status === 'mastered')
      .map(s => s.label.toLowerCase())
  );
  
  const missingOrWeakTrackSkills = trackSkills
    .filter(skill => !masteredSkillLabels.has(skill.toLowerCase()))
    .slice(0, 5);

  // 3. Recommended Roadmap Nodes
  const nextNodeRec = intelligenceState.recommendations.nextRoadmapNode;
  const unlockableNodeIds = intelligenceState.roadmap.unlockableNodeIds;
  const activeTrack = activeConfig?.tracks.find(t => t.id === activeTrackId);
  const unlockableNodes = activeTrack?.nodes.filter(n => unlockableNodeIds.includes(n.id)) ?? [];

  // 4. Recommended Courses
  const nextCourseRec = intelligenceState.recommendations.nextCourse;
  const allDomainCourses = getCoursesForDomain(activeDomainId);
  const recommendedCourses = allDomainCourses
    .filter(c => c.roadmapSync || c.assessmentLinked)
    .slice(0, 2);

  return (
    <div className="rounded-[28px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-6 h-full">
      <div className="mb-6">
        <p className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mb-1">
          Gap Analysis
        </p>
        <h3 className="text-lg font-bold text-white/85 font-['Hanken_Grotesk',_sans-serif]">
          Recruiter Readiness Gaps
        </h3>
        <p className="text-[11px] text-white/35 mt-0.5 font-['Inter',_sans-serif]">
          Specific skills and roadmap elements blocking you from meeting {company.name}'s hiring bar.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Critical Blockers */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertOctagon size={13} className="text-red-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-red-300/80 uppercase">
              Critical Blockers ({criticalBlockers.length})
            </span>
          </div>
          {criticalBlockers.length === 0 ? (
            <p className="text-[11px] text-white/30 italic">No critical skill blockers detected ✓</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {criticalBlockers.map((s) => (
                <span
                  key={s.id}
                  className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/25 text-[10px] font-mono text-red-400"
                >
                  {s.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Weak & Missing Skills */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={13} className="text-amber-400" />
            <span className="text-[10px] font-mono tracking-widest text-amber-300/80 uppercase">
              Weak / Missing Track Skills
            </span>
          </div>
          {missingOrWeakTrackSkills.length === 0 ? (
            <p className="text-[11px] text-white/30 italic">All track skills fully aligned ✓</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {missingOrWeakTrackSkills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/5 border border-amber-500/15 text-[10px] font-mono text-amber-300/80"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Recommended Roadmap Nodes */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target size={13} className="text-violet-400" />
            <span className="text-[10px] font-mono tracking-widest text-violet-300/80 uppercase">
              Recommended Roadmap Nodes
            </span>
          </div>
          <div className="space-y-2">
            {nextNodeRec && (
              <div className="p-3 rounded-xl bg-violet-500/[0.04] border border-violet-500/20 flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-white/80 font-['Inter',_sans-serif]">
                    {nextNodeRec.targetLabel}
                  </p>
                  <p className="text-[9px] font-mono text-violet-300/60 mt-0.5 uppercase tracking-wide">
                    Next Recommendation
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-violet-500/15 text-[9px] font-mono text-violet-300">
                  +90 XP
                </span>
              </div>
            )}
            {unlockableNodes.filter(n => n.title !== nextNodeRec?.targetLabel).slice(0, 2).map((n) => (
              <div key={n.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-white/70 font-['Inter',_sans-serif]">
                    {n.title}
                  </p>
                  <p className="text-[9px] font-mono text-white/20 mt-0.5 uppercase tracking-wide">
                    Unlockable Node
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[9px] font-mono text-white/30">
                  +{n.xpReward} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Recommended Courses */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={13} className="text-cyan-400" />
            <span className="text-[10px] font-mono tracking-widest text-cyan-300/80 uppercase">
              Recommended Courses
            </span>
          </div>
          <div className="space-y-2">
            {nextCourseRec && (
              <div className="p-3 rounded-xl bg-cyan-500/[0.04] border border-cyan-500/20 flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/80 font-['Inter',_sans-serif] truncate">
                    {nextCourseRec.targetLabel}
                  </p>
                  <p className="text-[9px] font-mono text-cyan-300/60 mt-0.5 uppercase tracking-wide truncate">
                    {nextCourseRec.rationale}
                  </p>
                </div>
                <span className="ml-3 px-2 py-0.5 rounded bg-cyan-500/15 text-[9px] font-mono text-cyan-300 shrink-0">
                  Course
                </span>
              </div>
            )}
            {recommendedCourses.filter(c => c.title !== nextCourseRec?.targetLabel).map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/70 font-['Inter',_sans-serif] truncate">
                    {c.title}
                  </p>
                  <p className="text-[9px] font-mono text-white/20 mt-0.5 uppercase tracking-wide truncate">
                    {c.subtitle}
                  </p>
                </div>
                <span className="ml-3 px-2 py-0.5 rounded bg-white/[0.04] text-[9px] font-mono text-white/30 shrink-0">
                  Course
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
