import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Activity, Brain, Users, Zap, Target, TrendingUp, Shield,
  MessageSquare, BarChart2
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip
} from "recharts";
import { behavioralRadarData } from "@/data/assessmentData";
import  AnimatedMetricCard  from "@/components/assessments/AnimatedMetricCard";
import { AIInsightPanel } from "@/components/assessments/AIInsightPanel";
import { NeuralInsightWidget } from "@/components/assessments/NeuralInsightWidget";

// ── Custom Tooltip ───────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number; name: string }[] }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 border border-cyan-400/20 rounded-xl px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="text-[10px] font-mono tracking-widest text-white/40 uppercase mb-0.5">{payload[0].name}</p>
      <p className="text-sm font-bold text-cyan-300">{payload[0].value}%</p>
    </div>
  );
};

// ── Strength/Weakness item ───────────────────────────────────────────────
interface TraitItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "violet" | "cyan" | "fuchsia" | "amber";
  delay?: number;
}

const colorConfig = {
  violet: { bar: "bg-violet-400", text: "text-violet-300", glow: "shadow-[0_0_8px_rgba(192,193,255,0.5)]" },
  cyan: { bar: "bg-cyan-400", text: "text-cyan-300", glow: "shadow-[0_0_8px_rgba(76,215,246,0.5)]" },
  fuchsia: { bar: "bg-fuchsia-400", text: "text-fuchsia-300", glow: "shadow-[0_0_8px_rgba(217,70,239,0.5)]" },
  amber: { bar: "bg-amber-400", text: "text-amber-300", glow: "shadow-[0_0_8px_rgba(245,158,11,0.5)]" },
};

const TraitItem = ({ icon, label, value, color, delay = 0 }: TraitItemProps) => {
  const c = colorConfig[color];
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-3"
    >
      <div className={cn("w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0", c.text)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[11px] text-white/55 font-['Inter',_sans-serif]">{label}</span>
          <span className={cn("text-[11px] font-mono font-bold", c.text)}>{value}%</span>
        </div>
        <div className="h-1 w-full bg-white/[0.05] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.8, delay: delay + 0.1, ease: "easeOut" }}
            className={cn("h-full rounded-full", c.bar, c.glow)}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ── Score Ring ───────────────────────────────────────────────────────────
const ScoreRing = ({ score, label, color = "#4cd7f6", size = 80 }: {
  score: number; label: string; color?: string; size?: number;
}) => {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ - (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="-rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r}
            stroke={color} strokeWidth="8" fill="none" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: dash }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 6px ${color}99)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold font-mono" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className="text-[9px] font-mono tracking-widest text-white/25 uppercase text-center">{label}</span>
    </div>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────
const BehavioralAnalysis = () => {
  return (
    <div className="relative space-y-6">
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-1/3 w-[50%] h-[40%] bg-fuchsia-600/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/4 w-[40%] h-[40%] bg-violet-600/[0.04] blur-[100px] rounded-full" />
      </div>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-fuchsia-500/15 border border-fuchsia-500/25 flex items-center justify-center text-fuchsia-400">
            <Activity size={18} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">
              Behavioral Analysis
            </h1>
            <p className="text-[9px] font-mono tracking-widest text-fuchsia-400/60 uppercase">
              AI Behavioral Intelligence Engine
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/[0.08] border border-fuchsia-500/20">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-fuchsia-400"
          />
          <span className="text-[10px] font-mono text-fuchsia-300/70 tracking-widest">ANALYSIS COMPLETE</span>
        </div>
      </motion.div>

      {/* Score metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AnimatedMetricCard label="Leadership Index" value={79} unit="%" color="violet" icon={<Users size={14} />} trend="up" trendValue="+6%" delay={0.1} />
        <AnimatedMetricCard label="Collaboration" value={85} unit="%" color="cyan" icon={<MessageSquare size={14} />} trend="up" trendValue="+3%" delay={0.17} />
        <AnimatedMetricCard label="Adaptability" value={77} unit="%" color="fuchsia" icon={<Zap size={14} />} trend="neutral" delay={0.24} />
        <AnimatedMetricCard label="Cognitive Flex" value={88} unit="%" color="amber" icon={<Brain size={14} />} trend="up" trendValue="+11%" delay={0.31} />
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: Radar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            "lg:col-span-2 relative overflow-hidden rounded-[28px] p-6",
            "bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/[0.07]"
          )}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-cyan-500/[0.05] blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">
                Cognitive Personality Radar
              </h3>
              <p className="text-[9px] font-mono text-white/25 tracking-widest uppercase mt-0.5">
                6-axis behavioral profile · AI calibrated
              </p>
            </div>
            <div className="flex gap-3">
              <ScoreRing score={84} label="Overall" color="#4cd7f6" size={64} />
              <ScoreRing score={91} label="Strategic" color="#c0c1ff" size={64} />
              <ScoreRing score={79} label="Leader" color="#e879f9" size={64} />
            </div>
          </div>

          {/* Radar */}
          <div className="w-full" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={behavioralRadarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid
                  gridType="polygon"
                  stroke="rgba(255,255,255,0.06)"
                />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "rgba(76,215,246,0.7)", fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#4cd7f6"
                  fill="rgba(76,215,246,0.12)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#4cd7f6", strokeWidth: 0 }}
                  style={{ filter: "drop-shadow(0 0 8px rgba(76,215,246,0.4))" }}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend dots */}
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(76,215,246,0.6)]" />
              <span className="text-[9px] font-mono text-white/30 tracking-wider">Your Profile</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white/15" />
              <span className="text-[9px] font-mono text-white/20 tracking-wider">Cohort Avg</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT: Neural widget */}
        <NeuralInsightWidget
          profileLabel="Engineering Persona"
          profileType="Visionary Architect"
          readinessScore={84}
          metrics={[
            { label: "Stress Handling", value: 82, color: "violet" },
            { label: "Decision Speed", value: 74, color: "cyan" },
            { label: "Risk Appetite", value: 68, color: "fuchsia" },
            { label: "Empathy Index", value: 85, color: "amber" },
          ]}
          insightText="Your behavioral signature aligns with exceptional systems architects who excel in ambiguous, high-stakes environments. Strategic empathy is a rare differentiator."
        />
      </div>

      {/* Strengths vs Growth Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={cn(
            "relative overflow-hidden rounded-[28px] p-6",
            "bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-cyan-500/[0.10]"
          )}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-cyan-500/[0.05] blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={14} className="text-cyan-400" />
            <h4 className="text-sm font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">Core Strengths</h4>
            <span className="ml-auto text-[9px] font-mono text-cyan-400/50 tracking-widest">TOP TIER</span>
          </div>
          <div className="space-y-3.5">
            <TraitItem icon={<Brain size={11} />} label="Analytical Thinking" value={88} color="cyan" delay={0.5} />
            <TraitItem icon={<Target size={11} />} label="Strategic Planning" value={91} color="violet" delay={0.57} />
            <TraitItem icon={<Shield size={11} />} label="Stress Resilience" value={82} color="cyan" delay={0.64} />
            <TraitItem icon={<Users size={11} />} label="Empathetic Leadership" value={85} color="fuchsia" delay={0.71} />
          </div>
        </motion.div>

        {/* Growth Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={cn(
            "relative overflow-hidden rounded-[28px] p-6",
            "bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-amber-500/[0.10]"
          )}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-500/[0.05] blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-5">
            <Zap size={14} className="text-amber-400" />
            <h4 className="text-sm font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">Growth Areas</h4>
            <span className="ml-auto text-[9px] font-mono text-amber-400/50 tracking-widest">FOCUS</span>
          </div>
          <div className="space-y-3.5">
            <TraitItem icon={<MessageSquare size={11} />} label="Verbal Communication" value={64} color="amber" delay={0.55} />
            <TraitItem icon={<Activity size={11} />} label="Conflict Navigation" value={61} color="amber" delay={0.62} />
            <TraitItem icon={<BarChart2 size={11} />} label="Risk Tolerance" value={68} color="violet" delay={0.69} />
            <TraitItem icon={<Zap size={11} />} label="Rapid Prototyping" value={72} color="cyan" delay={0.76} />
          </div>
        </motion.div>
      </div>

      {/* AI Insight Panel */}
      <AIInsightPanel
        title="Behavioral Intelligence Engine"
        insights={[
          { icon: <Brain size={13} />, title: "Engineering Mindset", body: "Strongly aligned with systems thinking and long-horizon architectural planning. Rare combination in early-career engineers.", accent: "violet", badge: "SIGNAL" },
          { icon: <Users size={13} />, title: "Collaboration Signature", body: "Collaborative-but-decisive pattern detected. You naturally lead by consensus while maintaining directional clarity.", accent: "cyan" },
          { icon: <Zap size={13} />, title: "Stress Response", body: "Calm under systemic pressure. Slight tendency toward analysis paralysis in rapid-iteration environments.", accent: "amber", badge: "GROWTH" },
          { icon: <TrendingUp size={13} />, title: "Growth Trajectory", body: "Behavioral indicators suggest Senior/Staff Engineer readiness within 16 months with focused system design exposure.", accent: "fuchsia" },
        ]}
      />
    </div>
  );
};

export default BehavioralAnalysis;
