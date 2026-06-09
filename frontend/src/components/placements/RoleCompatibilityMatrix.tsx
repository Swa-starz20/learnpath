// ── RoleCompatibilityMatrix ───────────────────────────────────────────────────
// Section 2: Config-driven role alignment matrix.
// Reads roles from roleMappings.ts, computes compatibility from existing
// intelligence state (readinessPct + weakSkills). Zero hardcoded UI logic.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { DomainId } from '@/data/engineeringDomains';
import { ENGINEERING_DOMAINS } from '@/data/engineeringDomains';
import {
  getRolesForDomain,
  computeRoleCompatibility,
  type RoleDefinition,
} from '@/data/roleMappings';

interface RoleCompatibilityMatrixProps {
  domainId: DomainId;
  readinessPct: number;
  weakSkillIds: string[];
}

const CompatibilityBar = ({ score, delay }: { score: number; delay: number }) => {
  const color =
    score >= 80 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' :
    score >= 60 ? 'bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.4)]' :
    score >= 40 ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.3)]' :
                  'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.3)]';

  const label =
    score >= 80 ? 'High Match' :
    score >= 60 ? 'Good Match' :
    score >= 40 ? 'Partial Match' : 'Low Match';

  const labelColor =
    score >= 80 ? 'text-emerald-400' :
    score >= 60 ? 'text-violet-400' :
    score >= 40 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className={`text-[9px] font-mono tracking-widest uppercase ${labelColor} w-20 text-right flex-shrink-0`}>
        {label}
      </span>
    </div>
  );
};

const RoleRow = ({
  role,
  compatibility,
  index,
}: {
  role: RoleDefinition;
  compatibility: number;
  index: number;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      className="border border-white/[0.05] rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        <span className="text-xl w-8 flex-shrink-0">{role.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white/80 font-['Hanken_Grotesk',_sans-serif] truncate">
            {role.title}
          </p>
          <p className="text-[10px] text-white/30 font-mono truncate">{role.salaryRange}</p>
        </div>
        <CompatibilityBar score={compatibility} delay={index * 0.06 + 0.2} />
        <span className="text-white/25 flex-shrink-0 ml-2">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-white/[0.04]">
              <p className="text-[11px] text-white/40 mb-3 font-['Inter',_sans-serif]">
                {role.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {role.requiredSkills.map(skill => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[9px] font-mono text-white/35 tracking-wide"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-[9px] font-mono text-white/20 mt-3 tracking-widest">
                MIN READINESS: {role.minReadiness}% · YOUR MATCH: {compatibility}%
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const RoleCompatibilityMatrix = ({
  domainId,
  readinessPct,
  weakSkillIds,
}: RoleCompatibilityMatrixProps) => {
  const domain = ENGINEERING_DOMAINS.find(d => d.id === domainId);
  const roles  = getRolesForDomain(domainId);

  if (roles.length === 0) return null;

  const rolesWithScores = roles
    .map(role => ({
      role,
      compatibility: computeRoleCompatibility(role, readinessPct, weakSkillIds),
    }))
    .sort((a, b) => b.compatibility - a.compatibility);

  return (
    <div className="rounded-[28px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-6 overflow-hidden">
      {/* Section header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mb-1">
            Role Compatibility Matrix
          </p>
          <h3 className="text-lg font-bold text-white/85 font-['Hanken_Grotesk',_sans-serif]">
            {domain?.label ?? 'Engineering'} Roles
          </h3>
          <p className="text-[11px] text-white/30 mt-0.5 font-['Inter',_sans-serif]">
            Ranked by AI compatibility score · Your readiness: {readinessPct}%
          </p>
        </div>
        <span className="text-2xl opacity-60">{domain?.icon}</span>
      </div>

      {/* Role list */}
      <div className="space-y-2">
        {rolesWithScores.map(({ role, compatibility }, i) => (
          <RoleRow
            key={role.id}
            role={role}
            compatibility={compatibility}
            index={i}
          />
        ))}
      </div>
    </div>
  );
};
