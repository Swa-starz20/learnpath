import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Award, Download, Share2, Sparkles, TrendingUp, Brain,
  Target, CheckCircle2, ChevronRight, BarChart2, Zap, Users, Star
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, Cell
} from "recharts";
import { careerCompatibility, behavioralRadarData } from "@/data/assessmentData";
import  CompatibilityCard  from "@/components/assessments/CompatibilityCard";
import  AnimatedMetricCard  from "@/components/assessments/AnimatedMetricCard";
import { AIInsightPanel } from "@/components/assessments/AIInsightPanel";

// ── Radar tooltip ─────────────────────────────────────────────────────────
const RadarTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number }[] }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 border border-violet-400/20 rounded-xl px-3 py-2 text-xs shadow-xl backdrop-blur-sm">
      <span className="font-mono font-bold text-violet-300">{payload[0].value}%</span>
    </div>
  );
};

// ── Bar tooltip ───────────────────────────────────────────────────────────
const BarTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 border border-cyan-400/20 rounded-xl px-3 py-2 text-xs shadow-xl backdrop-blur-sm">
      <p className="font-mono text-white/40 mb-0.5">{label}</p>
      <p className="font-bold text-cyan-300">{payload[0].value}%</p>
    </div>
  );
};

// ── Aptitude section bar data ─────────────────────────────────────────────
const aptitudeSections = [
  { name: "Logical", score: 88, color: "#c0c1ff" },
  { name: "Quantitative", score: 75, color: "#4cd7f6" },
  { name: "Analytical", score: 82, color: "#e879f9" },
  { name: "Verbal", score: 64, color: "#f59e0b" },
];

// ── Strength tag ──────────────────────────────────────────────────────────
const StrengthTag = ({ label, icon, delay = 0 }: { label: string; icon: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.88 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.35, delay, type: "spring", stiffness: 200 }}
    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/[0.09] border border-violet-500/20 text-violet-300"
  >
    <span className="text-violet-400">{icon}</span>
    <span className="text-[11px] font-mono tracking-wide">{label}</span>
  </motion.div>
);

// ── Section wrapper ───────────────────────────────────────────────────────
const Section = ({ title, subtitle, children, delay = 0 }: {
  title: string; subtitle?: string; children: React.ReactNode; delay?: number;
}) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="mb-4 flex items-end gap-3">
      <div>
        <h2 className="text-base font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">{title}</h2>
        {subtitle && <p className="text-[10px] font-mono text-white/25 tracking-widest uppercase mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex-1 h-px bg-white/[0.05]" />
    </div>
    {children}
  </motion.section>
);

// ── Page ──────────────────────────────────────────────────────────────────
const AssessmentResults = () => {
  return (
    <div className="relative space-y-8">
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-1/3 w-[50%] h-[45%] bg-violet-600/[0.05] blur-[130px] rounded-full" />
        <div className="absolute bottom-1/4 left-0 w-[40%] h-[40%] bg-cyan-500/[0.03] blur-[110px] rounded-full" />
        <div className="absolute top-1/2 right-0 w-[30%] h-[30%] bg-fuchsia-600/[0.04] blur-[100px] rounded-full" />
      </div>

      {/* ── HERO HEADER ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative overflow-hidden rounded-[28px] p-8",
          "bg-[rgba(255,255,255,0.03)] backdrop-blur-xl",
          "border border-white/[0.08]"
        )}
      >
        {/* Background sweep */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/[0.08] via-transparent to-cyan-900/[0.05] pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-violet-500/[0.06] blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Left: Profile badge */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600/40 to-indigo-700/40 border border-violet-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(192,193,255,0.2)]">
              <span className="text-3xl font-black text-white/90 font-['Hanken_Grotesk',_sans-serif]">AR</span>
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] text-violet-400/60 uppercase mb-0.5">AI Assessment Report</p>
              <h1 className="text-2xl font-extrabold text-white/95 font-['Hanken_Grotesk',_sans-serif] tracking-tight">
                Alex Rivera
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-400/25 text-[10px] font-mono text-violet-300 tracking-wide">
                  Visionary Architect
                </div>
                <div className="px-2.5 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-[10px] font-mono text-cyan-300 tracking-wide">
                  Top 12%
                </div>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right: Overall score + actions */}
          <div className="flex items-center gap-4">
            {/* Score ring */}
            <div className="relative w-20 h-20">
              <svg className="-rotate-90 w-20 h-20" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
                <motion.circle
                  cx="40" cy="40" r="34"
                  stroke="url(#resultsGrad)" strokeWidth="6" fill="none" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 34}
                  initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - 0.847) }}
                  transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
                />
                <defs>
                  <linearGradient id="resultsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c0c1ff" />
                    <stop offset="100%" stopColor="#4cd7f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-extrabold text-white/90 font-mono leading-none">847</span>
                <span className="text-[8px] font-mono text-white/25 tracking-wider">SCORE</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/15 border border-violet-500/25 text-violet-300 text-[11px] font-mono hover:bg-violet-500/25 transition-all"
              >
                <Download size={12} /> Export PDF
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/40 text-[11px] font-mono hover:bg-white/[0.06] transition-all"
              >
                <Share2 size={12} /> Share
              </motion.button>
            </div>
          </div>
        </div>

        {/* Completion stats row */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.05]">
          {[
            { label: "Assessments Completed", value: "3/5", color: "text-cyan-300" },
            { label: "Questions Answered", value: "75", color: "text-violet-300" },
            { label: "AI Confidence", value: "94%", color: "text-fuchsia-300" },
            { label: "Percentile Rank", value: "Top 12%", color: "text-amber-300" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              <p className="text-[9px] font-mono tracking-widest text-white/25 uppercase mb-0.5">{stat.label}</p>
              <p className={cn("text-lg font-extrabold font-['Hanken_Grotesk',_sans-serif]", stat.color)}>{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── METRIC CARDS ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AnimatedMetricCard label="Overall Score" value={847} color="violet" icon={<Award size={14} />} trend="up" trendValue="+94" delay={0.1} />
        <AnimatedMetricCard label="AI Readiness" value={73} unit="%" color="cyan" icon={<Sparkles size={14} />} trend="up" trendValue="+12%" delay={0.17} />
        <AnimatedMetricCard label="Career Match" value={94} unit="%" color="fuchsia" icon={<Target size={14} />} trend="up" trendValue="Cloud Arch" delay={0.24} />
        <AnimatedMetricCard label="Behavioral IQ" value={84} unit="%" color="amber" icon={<Brain size={14} />} trend="up" trendValue="+8%" delay={0.31} />
      </div>

      {/* ── TOP STRENGTHS ──────────────────────────────────────────────── */}
      <Section title="Top Strengths" subtitle="AI identified · Sorted by uniqueness" delay={0.3}>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Systems Thinking", icon: <BarChart2 size={10} /> },
            { label: "Strategic Empathy", icon: <Users size={10} /> },
            { label: "Adaptive Cognition", icon: <Zap size={10} /> },
            { label: "Architectural Vision", icon: <Brain size={10} /> },
            { label: "Collaborative Leadership", icon: <Star size={10} /> },
            { label: "Analytical Depth", icon: <TrendingUp size={10} /> },
          ].map((s, i) => (
            <StrengthTag key={s.label} label={s.label} icon={s.icon} delay={0.35 + i * 0.06} />
          ))}
        </div>
      </Section>

      {/* ── CHARTS ROW ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={cn(
            "relative overflow-hidden rounded-[28px] p-6",
            "bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/[0.07]"
          )}
        >
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">Cognitive Profile Radar</h3>
            <p className="text-[9px] font-mono text-white/20 tracking-widest uppercase mt-0.5">6-axis personality map</p>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={behavioralRadarData}>
                <PolarGrid gridType="polygon" stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(192,193,255,0.7)", fontSize: 9, fontFamily: "JetBrains Mono, monospace" }} />
                <Radar name="Score" dataKey="value" stroke="#c0c1ff" fill="rgba(192,193,255,0.10)" strokeWidth={2}
                  dot={{ r: 3, fill: "#c0c1ff", strokeWidth: 0 }}
                  style={{ filter: "drop-shadow(0 0 6px rgba(192,193,255,0.4))" }} />
                <Tooltip content={<RadarTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Aptitude bars */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className={cn(
            "relative overflow-hidden rounded-[28px] p-6",
            "bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/[0.07]"
          )}
        >
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">Aptitude Breakdown</h3>
            <p className="text-[9px] font-mono text-white/20 tracking-widest uppercase mt-0.5">Section-wise performance</p>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aptitudeSections} layout="vertical" barSize={14}
                margin={{ top: 4, right: 20, bottom: 4, left: 10 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9, fontFamily: "monospace" }}
                  axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={80}
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}
                  axisLine={false} tickLine={false} />
                <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {aptitudeSections.map((entry) => (
                    <Cell key={entry.name} fill={entry.color}
                      style={{ filter: `drop-shadow(0 0 6px ${entry.color}88)` }} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ── CAREER COMPATIBILITY ───────────────────────────────────────── */}
      <Section title="Career Compatibility Matrix" subtitle="AI-generated · Updated in real-time" delay={0.5}>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {careerCompatibility.map((role, i) => (
            <CompatibilityCard
              key={role.role}
              role={role.role}
              compatibility={role.compatibility}
              personalityMatch={role.personalityMatch}
              growthPotential={role.growthPotential}
              learningPath={role.learningPath}
              aiConfidence={role.aiConfidence}
              color={role.color}
              rank={i + 1}
              delay={0.55 + i * 0.08}
            />
          ))}
        </div>
      </Section>

      {/* ── AI INSIGHT PANEL ──────────────────────────────────────────── */}
      <Section title="AI-Generated Career Report" subtitle="Personalized intelligence analysis" delay={0.7}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className={cn(
              "lg:col-span-2 relative overflow-hidden rounded-[28px] p-7",
              "bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-violet-500/[0.12]"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/[0.08] to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={14} className="text-violet-400" />
                <span className="text-[10px] font-mono tracking-widest text-violet-400/70 uppercase">AI Personality Summary</span>
              </div>
              <h3 className="text-xl font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] mb-3">
                You excel at complex systems thinking.
              </h3>
              <p className="text-sm text-white/45 font-['Inter',_sans-serif] leading-relaxed mb-5">
                Your assessment profile reveals a rare combination of <strong className="text-white/70">Systematic Analytical Depth</strong> paired with <strong className="text-white/70">Strategic Empathetic Leadership</strong>. Engineers with this profile naturally gravitate toward roles that require balancing long-term architectural vision with team enablement — making you exceptionally well-suited for Cloud Architecture and Platform Engineering leadership tracks.
              </p>
              <p className="text-sm text-white/40 font-['Inter',_sans-serif] leading-relaxed mb-6">
                Your decision-making patterns indicate a preference for data-driven consensus building, which places you in the top 5% of engineers for "Collaborative Strategic Thinking" within our cohort database.
              </p>
              {/* Learning style */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Learning Style", value: "Systematic → Hands-On", icon: <Brain size={12} /> },
                  { label: "Ideal Environment", value: "High-complexity, Async-first", icon: <Zap size={12} /> },
                  { label: "Communication Style", value: "Written-depth + Visual", icon: <CheckCircle2 size={12} /> },
                  { label: "Optimal Team Size", value: "6–12 engineers", icon: <Users size={12} /> },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.85 + i * 0.07 }}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                  >
                    <div className="flex items-center gap-1.5 text-violet-400 mb-1">{item.icon}
                      <span className="text-[9px] font-mono tracking-widest text-white/25 uppercase">{item.label}</span>
                    </div>
                    <p className="text-[12px] font-semibold text-white/70 font-['Inter',_sans-serif]">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-bold font-['Hanken_Grotesk',_sans-serif] shadow-[0_0_24px_rgba(192,193,255,0.25)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={14} />
                View Personalized Learning Roadmap
                <ChevronRight size={14} />
              </motion.button>
            </div>
          </motion.div>

          {/* Right: AI Insight panel */}
          <AIInsightPanel
            title="Intelligence Report"
            insights={[
              { icon: <TrendingUp size={13} />, title: "Growth Prediction", body: "Senior Engineer readiness projected within 14 months at current learning velocity.", accent: "violet", badge: "AI" },
              { icon: <Target size={13} />, title: "Ideal Domain", body: "Cloud Architecture + Platform Engineering is your highest-alignment career path.", accent: "cyan" },
              { icon: <Brain size={13} />, title: "Cognitive Edge", body: "Exceptional systems thinking + strategic empathy. Rare and high-demand combination.", accent: "fuchsia", badge: "RARE" },
              { icon: <Zap size={13} />, title: "Skill Priority", body: "System Design is your highest-leverage next focus area to unlock Staff+ roles.", accent: "amber" },
            ]}
          />
        </div>
      </Section>
    </div>
  );
};

export default AssessmentResults;
