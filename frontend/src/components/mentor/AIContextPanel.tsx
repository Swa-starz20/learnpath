import { motion } from "framer-motion";
import {
  Sparkles,
  CircleDot,
  CheckCircle2,
  Map,
  Brain,
  Zap,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { SkillInsightCard } from "./SkillInsightCard";
import { ResourceCard, quickResources } from "./ResourceCard";

// ── Sync status items ──────────────────────────────────────────
interface SyncItem {
  label: string;
  synced: boolean;
}

const syncItems: SyncItem[] = [
  { label: "Roadmap Synced", synced: true },
  { label: "Assessment Synced", synced: true },
  { label: "Mentor Memory Active", synced: true },
  { label: "Recommendation Engine", synced: false },
];

// ── Section wrapper ────────────────────────────────────────────
const Section = ({
  title,
  accent = "violet",
  children,
  delay = 0,
}: {
  title: string;
  accent?: "violet" | "cyan" | "fuchsia" | "neutral";
  children: React.ReactNode;
  delay?: number;
}) => {
  const accentMap = {
    violet: "text-violet-400/60",
    cyan: "text-cyan-400/60",
    fuchsia: "text-fuchsia-400/60",
    neutral: "text-white/30",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <h4
        className={`text-[10px] font-mono tracking-[0.18em] uppercase mb-3 ${accentMap[accent]}`}
      >
        {title}
      </h4>
      {children}
    </motion.div>
  );
};

// ── Thin divider ────────────────────────────────────────────────
const Divider = () => (
  <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
);

// ── AI Context Panel ────────────────────────────────────────────
export const AIContextPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col h-full bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border-l border-white/[0.07] overflow-y-auto"
    >
      {/* Panel Header */}
      <div className="px-4 pt-5 pb-4 border-b border-white/[0.05] flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} className="text-violet-400" />
          <h3 className="text-sm font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">
            AI Context
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(76,215,246,0.7)]"
          />
          <p className="text-[10px] text-white/30 font-mono tracking-wide">
            Syncing with your progress...
          </p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 px-4 py-4 space-y-5 overflow-y-auto">

        {/* ── Active Learning Context ─────────────────────── */}
        <Section title="Active Learning Context" accent="violet" delay={0.1}>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2.5">
            <div className="flex items-center gap-2">
              <Map size={12} className="text-cyan-400 flex-shrink-0" />
              <span className="text-[12px] text-white/60 font-['Inter',_sans-serif]">
                Cloud Infrastructure
              </span>
              <span className="ml-auto text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded-full">
                Active
              </span>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[10px] text-white/30 font-mono">Docker Module</span>
                <span className="text-[10px] text-violet-300 font-mono font-bold">85%</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_8px_rgba(192,193,255,0.4)]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-white/25 font-mono">
              <span>Est. completion</span>
              <span className="text-white/40">~3 days</span>
            </div>
          </div>
        </Section>

        <Divider />

        {/* ── Active Roadmap Node ─────────────────────────── */}
        <Section title="Active Node" accent="fuchsia" delay={0.15}>
          <div className="p-3 rounded-xl bg-white/[0.03] border-l-2 border-violet-500 border border-white/[0.05] space-y-3">
            <div className="flex items-start gap-2.5">
              <CircleDot size={14} className="text-violet-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[13px] font-semibold text-white/85 font-['Hanken_Grotesk',_sans-serif] leading-tight">
                  Container Orchestration
                </p>
                <p className="text-[10px] text-white/30 mt-0.5 font-mono">
                  Status: In Progress
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-1.5 bg-white/[0.04] hover:bg-white/[0.07] rounded-lg
                text-[11px] text-violet-300 flex items-center justify-center gap-1.5
                border border-white/[0.05] hover:border-violet-400/20 transition-all"
            >
              <ExternalLink size={10} />
              View Node Details
            </motion.button>
          </div>
        </Section>

        <Divider />

        {/* ── Core Skills ─────────────────────────────────── */}
        <Section title="Core Skills" accent="cyan" delay={0.2}>
          <SkillInsightCard
            delay={0.25}
            skills={[
              { label: "Cloud Architecture", value: 85, color: "violet" },
              { label: "Docker / K8s", value: 62, color: "cyan" },
              { label: "System Design", value: 58, color: "fuchsia" },
            ]}
          />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <p className="text-[9px] text-white/25 font-mono uppercase tracking-wider mb-0.5">Strength</p>
              <p className="text-[11px] text-cyan-400 font-semibold">Cloud Arch.</p>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <p className="text-[9px] text-white/25 font-mono uppercase tracking-wider mb-0.5">Focus Area</p>
              <p className="text-[11px] text-violet-300 font-semibold">Sys Design</p>
            </div>
          </div>
        </Section>

        <Divider />

        {/* ── AI Sync Status ───────────────────────────────── */}
        <Section title="AI Sync Status" accent="neutral" delay={0.25}>
          <div className="space-y-2">
            {syncItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center gap-2"
              >
                {item.synced ? (
                  <CheckCircle2 size={11} className="text-cyan-400 flex-shrink-0" />
                ) : (
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2.5 h-2.5 rounded-full border border-amber-400/60 flex-shrink-0"
                  />
                )}
                <span
                  className={`text-[11px] font-['Inter',_sans-serif] ${
                    item.synced ? "text-white/50" : "text-amber-400/60"
                  }`}
                >
                  {item.label}
                </span>
                {item.synced ? (
                  <span className="ml-auto text-[9px] font-mono text-cyan-400/50">LIVE</span>
                ) : (
                  <span className="ml-auto text-[9px] font-mono text-amber-400/40">PENDING</span>
                )}
              </motion.div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* ── Quick Resources ──────────────────────────────── */}
        <Section title="Quick Resources" accent="neutral" delay={0.3}>
          <div>
            {quickResources.map((resource, i) => (
              <ResourceCard key={resource.id} resource={resource} delay={0.35 + i * 0.05} />
            ))}
          </div>
        </Section>

        <Divider />

        {/* ── Learning Insights ────────────────────────────── */}
        <Section title="Learning Insights" accent="fuchsia" delay={0.4}>
          <div className="space-y-2">
            {[
              { icon: <TrendingUp size={11} />, text: "Learning velocity 34% above cohort", color: "text-cyan-400" },
              { icon: <Brain size={11} />, text: "Strong recall on distributed systems topics", color: "text-violet-300" },
              { icon: <Zap size={11} />, text: "Suggested: 2 mock sessions this week", color: "text-fuchsia-300" },
            ].map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.07 }}
                className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]"
              >
                <span className={`mt-0.5 flex-shrink-0 ${insight.color}`}>{insight.icon}</span>
                <p className="text-[11px] text-white/40 font-['Inter',_sans-serif] leading-relaxed">
                  {insight.text}
                </p>
              </motion.div>
            ))}
          </div>
        </Section>

      </div>

      {/* Panel Footer */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-white/[0.05] bg-[rgba(255,255,255,0.01)]">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-mono font-bold text-violet-400/60 tracking-widest">LEARNPATH AI</p>
          <p className="text-[9px] text-white/15 font-mono">© 2024</p>
        </div>
      </div>
    </motion.div>
  );
};
