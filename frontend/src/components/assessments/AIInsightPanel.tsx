import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, TrendingUp, Zap, Target, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightItem {
  icon: React.ReactNode;
  title: string;
  body: string;
  accent: "violet" | "cyan" | "fuchsia" | "amber";
  badge?: string;
}

const accentMap = {
  violet: {
    icon: "text-violet-400",
    border: "border-violet-500/20",
    bg: "bg-violet-500/[0.06]",
    badge: "bg-violet-500/10 text-violet-300 border-violet-400/20",
    dot: "bg-violet-400",
  },
  cyan: {
    icon: "text-cyan-400",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/[0.04]",
    badge: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20",
    dot: "bg-cyan-400",
  },
  fuchsia: {
    icon: "text-fuchsia-400",
    border: "border-fuchsia-500/20",
    bg: "bg-fuchsia-500/[0.05]",
    badge: "bg-fuchsia-400/10 text-fuchsia-300 border-fuchsia-400/20",
    dot: "bg-fuchsia-400",
  },
  amber: {
    icon: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/[0.05]",
    badge: "bg-amber-400/10 text-amber-300 border-amber-400/20",
    dot: "bg-amber-400",
  },
};

const defaultInsights: InsightItem[] = [
  {
    icon: <Brain size={13} />,
    title: "Cognitive Profile",
    body: "Highly analytical thinker with strong systematic problem-solving tendency. Top 8% in logical sequencing.",
    accent: "violet",
    badge: "LIVE",
  },
  {
    icon: <TrendingUp size={13} />,
    title: "Learning Velocity",
    body: "Absorbs new technical concepts 42% faster than average cohort. Pattern recognition is a key strength.",
    accent: "cyan",
  },
  {
    icon: <Target size={13} />,
    title: "Career Alignment",
    body: "Strongest affinity for Cloud Architecture and Systems Design roles based on decision patterns.",
    accent: "fuchsia",
    badge: "AI MATCH",
  },
  {
    icon: <Zap size={13} />,
    title: "Adaptability Score",
    body: "Exceptional stress-handling under uncertainty. Well-suited for fast-paced, ambiguous environments.",
    accent: "amber",
  },
  {
    icon: <BarChart2 size={13} />,
    title: "Growth Prediction",
    body: "Projected to reach Senior Engineering readiness within 14 months at current trajectory.",
    accent: "violet",
  },
];

interface AIInsightPanelProps {
  insights?: InsightItem[];
  compact?: boolean;
  title?: string;
}

export const AIInsightPanel = ({
  insights = defaultInsights,
  compact = false,
  title = "AI Intelligence Panel",
}: AIInsightPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-[28px]",
        "bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-violet-500/[0.12]",
        compact ? "p-5" : "p-6"
      )}
    >
      {/* Ambient glow blobs */}
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-violet-600/[0.07] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-cyan-500/[0.05] blur-2xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/[0.06] to-transparent pointer-events-none" />

      {/* Pulse border */}
      <div className="absolute inset-0 rounded-[28px] border border-violet-500/[0.08] animate-pulse pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 mb-5">
        <div className="w-7 h-7 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
          <Sparkles size={13} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">
            {title}
          </h3>
          <p className="text-[9px] font-mono tracking-widest text-white/25 uppercase">
            Adaptive Intelligence · Real-time
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(76,215,246,0.7)]"
          />
          <span className="text-[9px] text-cyan-400/70 font-mono tracking-widest">LIVE</span>
        </div>
      </div>

      {/* Insight cards */}
      <div className={cn("relative z-10 space-y-3")}>
        <AnimatePresence>
          {insights.map((insight, i) => {
            const colors = accentMap[insight.accent];
            return (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.4 + i * 0.08 }}
                whileHover={{ x: 2 }}
                className={cn(
                  "group relative p-4 rounded-2xl transition-all duration-200",
                  "border hover:bg-white/[0.03]",
                  colors.bg,
                  colors.border
                )}
              >
                <div className={cn("flex items-center gap-2 mb-1.5", colors.icon)}>
                  {insight.icon}
                  <span className="text-[10px] font-mono tracking-[0.15em] uppercase">
                    {insight.title}
                  </span>
                  {insight.badge && (
                    <span
                      className={cn(
                        "ml-auto text-[8px] font-mono tracking-widest px-1.5 py-0.5 rounded-full border",
                        colors.badge
                      )}
                    >
                      {insight.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/40 leading-relaxed font-['Inter',_sans-serif]">
                  {insight.body}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
