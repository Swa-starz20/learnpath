import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Lock, Activity } from "lucide-react";

interface NeuralInsightWidgetProps {
  profileLabel: string;
  profileType: string;
  metrics: { label: string; value: number; color: "violet" | "cyan" | "fuchsia" | "amber" }[];
  insightText: string;
  readinessScore: number;
}

const colorGradMap = {
  violet: {
    bar: "bg-violet-400",
    glow: "shadow-[0_0_8px_rgba(192,193,255,0.6)]",
    text: "text-violet-300",
    icon: "text-violet-400",
  },
  cyan: {
    bar: "bg-cyan-400",
    glow: "shadow-[0_0_8px_rgba(76,215,246,0.6)]",
    text: "text-cyan-300",
    icon: "text-cyan-400",
  },
  fuchsia: {
    bar: "bg-fuchsia-400",
    glow: "shadow-[0_0_8px_rgba(217,70,239,0.6)]",
    text: "text-fuchsia-300",
    icon: "text-fuchsia-400",
  },
  amber: {
    bar: "bg-amber-400",
    glow: "shadow-[0_0_8px_rgba(245,158,11,0.6)]",
    text: "text-amber-300",
    icon: "text-amber-400",
  },
};

export const NeuralInsightWidget = ({
  profileLabel,
  profileType,
  metrics,
  insightText,
  readinessScore,
}: NeuralInsightWidgetProps) => {
  // Circular readiness arc
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (readinessScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        "relative overflow-hidden rounded-[28px] p-6",
        "bg-[rgba(255,255,255,0.02)] backdrop-blur-xl",
        "border border-cyan-500/[0.12]"
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/[0.06] to-violet-900/[0.04] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-4 mb-5">
        {/* Readiness ring */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
            <motion.circle
              cx="36"
              cy="36"
              r={radius}
              stroke="#4cd7f6"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              style={{ filter: "drop-shadow(0 0 6px rgba(76,215,246,0.6))" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[13px] font-bold text-cyan-300 font-mono">{readinessScore}%</span>
          </div>
        </div>

        <div>
          <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/25 mb-0.5">
            {profileLabel}
          </p>
          <h4 className="text-base font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">
            {profileType}
          </h4>
          <div className="flex items-center gap-1.5 mt-1">
            <Activity size={9} className="text-cyan-400" />
            <span className="text-[9px] text-cyan-400/70 font-mono tracking-wider">AI ANALYZED</span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="relative z-10 space-y-2.5 mb-4">
        {metrics.map((metric, i) => {
          const c = colorGradMap[metric.color];
          return (
            <div key={metric.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] text-white/45 font-['Inter',_sans-serif]">{metric.label}</span>
                <span className={cn("text-[11px] font-mono font-bold", c.text)}>{metric.value}%</span>
              </div>
              <div className="h-1 w-full bg-white/[0.05] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.07, ease: "easeOut" }}
                  className={cn("h-full rounded-full", c.bar, c.glow)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Insight text */}
      <div className="relative z-10 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
        <p className="text-[11px] text-white/40 leading-relaxed font-['Inter',_sans-serif] italic">
          {insightText}
        </p>
      </div>

      {/* Floating icons */}
      <div className="absolute top-4 right-4 opacity-[0.08]">
        <Lock size={28} className="text-cyan-400" />
      </div>
    </motion.div>
  );
};
