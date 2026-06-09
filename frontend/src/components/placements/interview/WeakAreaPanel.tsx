// ── WeakAreaPanel ─────────────────────────────────────────────────────────────
// Shows skill gaps filtered to interview-relevant context.
// Reads from existing intelligence state — no new gap analysis.

import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import type { InterviewType } from '@/data/interviews/interviewTracks';
import { DOMAIN_INTERVIEW_FOCUS } from '@/data/interviews/interviewTracks';
import type { DomainId } from '@/data/engineeringDomains';
import type { SkillNode } from '@/types/skill';

interface WeakAreaPanelProps {
  domainId: DomainId;
  trackId: InterviewType;
  weakSkills: SkillNode[];
  nextSkillIds: string[];
}

const GAP_STYLES: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  Critical: { border: 'border-red-400/20',    bg: 'bg-red-500/10',    text: 'text-red-400',    dot: 'bg-red-400' },
  Moderate: { border: 'border-amber-400/20',  bg: 'bg-amber-400/10',  text: 'text-amber-400',  dot: 'bg-amber-400' },
  Low:      { border: 'border-cyan-400/20',   bg: 'bg-cyan-400/10',   text: 'text-cyan-400',   dot: 'bg-cyan-400' },
  None:     { border: 'border-white/[0.06]',  bg: 'bg-white/[0.02]',  text: 'text-white/40',   dot: 'bg-white/20' },
};

export const WeakAreaPanel = ({ domainId, trackId, weakSkills, nextSkillIds }: WeakAreaPanelProps) => {
  const focus = DOMAIN_INTERVIEW_FOCUS[domainId];

  // Map track type to relevant focus areas
  const relevantAreas =
    trackId === 'technical' ? focus.technicalAreas :
    trackId === 'domain'    ? focus.domainAreas :
    trackId === 'aptitude'  ? focus.aptitudeAreas :
    ['Communication', 'Behavioural', 'Professional Conduct'];

  // Filter weak skills that match relevant interview areas (label fuzzy match)
  const relevantWeak = weakSkills.filter(s =>
    relevantAreas.some(area =>
      s.label.toLowerCase().includes(area.toLowerCase().split(' ')[0]) ||
      s.category.toLowerCase().includes(area.toLowerCase().split(' ')[0])
    )
  );

  const criticalWeak = relevantWeak.filter(s => s.gap === 'Critical');
  const moderateWeak = relevantWeak.filter(s => s.gap === 'Moderate');
  const allWeak      = [...criticalWeak, ...moderateWeak, ...weakSkills.filter(s => !relevantWeak.includes(s))];
  const displaySkills = allWeak.slice(0, 8);
  const recommended   = weakSkills.filter(s => nextSkillIds.includes(s.id)).slice(0, 4);

  return (
    <div className="rounded-[28px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-6">
      <div className="mb-5">
        <p className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mb-1">Weak Areas</p>
        <h3 className="text-lg font-bold text-white/85 font-['Hanken_Grotesk',_sans-serif]">Interview Blockers</h3>
        <p className="text-[11px] text-white/30 mt-0.5 font-['Inter',_sans-serif]">
          Skills blocking higher {trackId} interview scores
        </p>
      </div>

      {/* Relevant interview focus */}
      <div className="mb-5">
        <p className="text-[9px] font-mono tracking-widest text-white/25 uppercase mb-2">
          {trackId.charAt(0).toUpperCase() + trackId.slice(1)} Interview Focus Areas
        </p>
        <div className="flex flex-wrap gap-1.5">
          {relevantAreas.map(area => (
            <span key={area} className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-[9px] font-mono text-violet-300/70">
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Gap summary chips */}
      <div className="flex gap-2 mb-5">
        <span className="px-3 py-1 rounded-full border border-red-400/20 bg-red-500/10 text-[8px] font-mono text-red-400 tracking-widest">
          {criticalWeak.length} CRITICAL
        </span>
        <span className="px-3 py-1 rounded-full border border-amber-400/20 bg-amber-400/10 text-[8px] font-mono text-amber-400 tracking-widest">
          {moderateWeak.length} MODERATE
        </span>
      </div>

      {/* Skill list */}
      {displaySkills.length === 0 ? (
        <div className="p-4 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] text-center">
          <p className="text-[11px] text-emerald-400/70 font-mono">
            No significant weak areas detected for this interview track ✓
          </p>
        </div>
      ) : (
        <div className="space-y-2 mb-5">
          {displaySkills.map((skill, i) => {
            const s = GAP_STYLES[skill.gap] ?? GAP_STYLES['None'];
            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${s.border} ${s.bg}`}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
                  <span className="text-[11px] text-white/65 font-['Inter',_sans-serif] truncate">
                    {skill.label}
                  </span>
                  <span className="text-[9px] font-mono text-white/25 flex-shrink-0">
                    {skill.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className={`text-[9px] font-mono ${s.text}`}>{skill.gap}</span>
                  <span className="text-[9px] font-mono text-white/25">{skill.confidence}%</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Recommended to study next */}
      {recommended.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target size={13} className="text-violet-400" />
            <p className="text-[9px] font-mono tracking-widest text-white/25 uppercase">Recommended Next</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recommended.map(s => (
              <span key={s.id} className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-[9px] font-mono text-violet-300/80">
                {s.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
