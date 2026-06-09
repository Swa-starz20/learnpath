import { Brain, Compass, AlertOctagon, TrendingUp } from 'lucide-react';
import type { UserIntelligenceState } from '@/intelligence/userIntelligenceState';
import type { CompanyProfile } from '@/data/company/companyProfiles';
import { getMentorInsights, getAdaptiveFocusLabel } from '@/intelligence/intelligenceSelectors';

interface CompanyInsightsPanelProps {
  intelligenceState: UserIntelligenceState | null;
  company: CompanyProfile;
}

export const CompanyInsightsPanel = ({
  intelligenceState,
  company,
}: CompanyInsightsPanelProps) => {
  if (!intelligenceState) return null;

  // Extract mentor guidance (first 2 items)
  const insights = getMentorInsights(intelligenceState).slice(0, 2);

  // Extract adaptive recommendations
  const focusLabel = getAdaptiveFocusLabel(intelligenceState);
  const adjustments = intelligenceState.adaptive.pathAdjustments;
  
  // Extract critical blockers
  const blockers = intelligenceState.skills.allNodes
    .filter((s) => s.gap === 'Critical')
    .slice(0, 3);

  // Extract improvement priorities
  const priorities = intelligenceState.skills.allNodes
    .filter((s) => s.gap === 'Moderate' || s.gap === 'Low')
    .slice(0, 3);

  return (
    <div className="rounded-[28px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mb-1">
            AI Company Insights
          </p>
          <h3 className="text-lg font-bold text-white/85 font-['Hanken_Grotesk',_sans-serif]">
            Recruiter Prep Insights
          </h3>
          <p className="text-[11px] text-white/35 mt-0.5 font-['Inter',_sans-serif]">
            Deep analysis of your profile alignment with {company.name}'s hiring requirements.
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
          <Brain size={16} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Guidance & Adaptive Recommendations */}
        <div className="space-y-5">
          {/* Mentor Guidance */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={13} className="text-violet-400" />
              <span className="text-[9px] font-mono tracking-widest text-violet-300 uppercase">
                AI Mentor Guidance
              </span>
            </div>
            {insights.length === 0 ? (
              <p className="text-xs text-white/40 italic">No custom mentor guidance available currently.</p>
            ) : (
              <div className="space-y-3">
                {insights.map((insight) => (
                  <div key={insight.id}>
                    <p className="text-xs font-semibold text-white/80 leading-normal">
                      {insight.message}
                    </p>
                    <p className="text-[10px] text-white/45 mt-0.5 font-['Inter',_sans-serif] leading-relaxed">
                      {insight.detail}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Adaptive Path Adjustments */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div className="flex items-center gap-2 mb-3">
              <Compass size={13} className="text-cyan-400" />
              <span className="text-[9px] font-mono tracking-widest text-cyan-300 uppercase">
                Adaptive Path Adjustments
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/80 mb-1 leading-normal">
                {focusLabel}
              </p>
              {adjustments && (
                <p className="text-[10px] text-white/45 font-['Inter',_sans-serif] leading-relaxed">
                  {adjustments.reason} Target Node: {adjustments.targetNodeIds[0] || 'N/A'}. Target Level: {adjustments.newDifficultyLevel}.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Blockers & Priorities */}
        <div className="space-y-5">
          {/* Readiness Blockers */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div className="flex items-center gap-2 mb-3">
              <AlertOctagon size={13} className="text-red-400" />
              <span className="text-[9px] font-mono tracking-widest text-red-300 uppercase">
                Readiness Blockers
              </span>
            </div>
            {blockers.length === 0 ? (
              <p className="text-xs text-white/40 italic">No critical blockers impacting matching.</p>
            ) : (
              <div className="space-y-2">
                {blockers.map((b) => (
                  <div key={b.id} className="flex justify-between items-center text-xs font-['Inter',_sans-serif]">
                    <span className="text-white/75">{b.label}</span>
                    <span className="text-[9px] font-mono text-red-400 font-bold bg-red-400/10 px-1.5 py-0.5 rounded">
                      GAP: {b.gap.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Improvement Priorities */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={13} className="text-emerald-400" />
              <span className="text-[9px] font-mono tracking-widest text-emerald-300 uppercase">
                Improvement Priorities
              </span>
            </div>
            {priorities.length === 0 ? (
              <p className="text-xs text-white/40 italic">No secondary improvement priorities flagged.</p>
            ) : (
              <div className="space-y-2">
                {priorities.map((p) => (
                  <div key={p.id} className="flex justify-between items-center text-xs font-['Inter',_sans-serif]">
                    <span className="text-white/70">{p.label}</span>
                    <span className="text-[9px] font-mono text-cyan-300 font-bold bg-cyan-400/10 px-1.5 py-0.5 rounded">
                      {p.gap} Gap
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
