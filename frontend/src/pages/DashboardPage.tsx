import { motion } from "framer-motion";
import { Flame, ShieldCheck, CalendarClock, Brain } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EngineeringRoadmap } from "@/components/dashboard/EngineeringRoadmap";
import { SkillProficiencyPanel } from "@/components/dashboard/SkillProficiencyPanel";
import { RecommendationsPanel } from "@/components/dashboard/RecommendationsPanel";
import { AIInsightPanel } from "@/components/dashboard/AIInsightPanel";
import { QuickActions } from "@/components/dashboard/QuickActions";

// ----- Page-level container animation -----
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const sectionVariant = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

// ----- AI Insight Stat Card content -----
const AIInsightContent = () => (
  <div className="relative z-10">
    <div className="flex justify-between items-start mb-4">
      <div className="text-violet-400 text-xl">
        <Brain size={20} />
      </div>
      <span className="text-[10px] font-mono tracking-widest text-violet-300/70">✦</span>
    </div>
    <p className="text-sm italic text-violet-300/80 leading-relaxed mb-1 font-light">
      "Focus on System Design today to hit 80%."
    </p>
    <p className="text-[10px] text-white/30 font-mono tracking-widest uppercase">AI Daily Insight</p>
  </div>
);

const DashboardPage = () => {
  return (
    <div className="relative min-h-screen">
      {/* ── Atmospheric background blobs ── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-1/4 right-0 w-[55%] h-[55%] bg-violet-600/[0.06] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 -left-1/4 w-[45%] h-[45%] bg-cyan-500/[0.05] blur-[100px] rounded-full" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-indigo-600/[0.04] blur-[80px] rounded-full" />
      </div>

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 max-w-[1400px] mx-auto"
      >
        {/* ── Page Header ── */}
        <motion.div variants={sectionVariant} className="mb-2">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mb-1">
                Engineering Command Center
              </p>
              <h1 className="text-2xl font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] tracking-tight">
                Welcome back, Alex{" "}
                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Rivera
                </span>
              </h1>
            </div>
            {/* Live indicator */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-white/25 tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(76,215,246,0.7)]" />
              AI PULSE ACTIVE
            </div>
          </div>
          {/* Thin separator */}
          <div className="mt-4 h-px bg-gradient-to-r from-violet-500/20 via-white/5 to-transparent" />
        </motion.div>

        {/* ── Quick Actions ── */}
        <motion.div variants={sectionVariant}>
          <QuickActions />
        </motion.div>

        {/* ── Stats Cards Row ── */}
        <motion.section
          variants={sectionVariant}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatsCard
            icon={<Flame size={20} />}
            badge="+2 today"
            badgeVariant="cyan"
            value="14 Days"
            label="Learning Streak"
            accent="cyan"
            delay={0.05}
          />

          <StatsCard
            icon={<ShieldCheck size={20} />}
            badge="Top 15%"
            badgeVariant="primary"
            value="78%"
            label="Career Readiness"
            accent="purple"
            delay={0.1}
          />

          <StatsCard
            icon={<CalendarClock size={20} />}
            badge="⬤ LIVE"
            badgeVariant="red"
            value="In 2 Days"
            label="Amazon Mock Interview"
            accent="error"
            delay={0.15}
          />

          {/* AI Insight card – custom layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="relative overflow-hidden rounded-3xl p-5
              bg-violet-900/[0.12] backdrop-blur-xl
              border border-violet-500/[0.2]
              shadow-[0_0_30px_rgba(192,193,255,0.06)]
              animate-pulse-border group cursor-default"
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-violet-500/15 blur-xl group-hover:bg-violet-500/25 transition-all duration-700" />
            <AIInsightContent />
          </motion.div>
        </motion.section>

        {/* ── Engineering Roadmap ── */}
        <motion.div variants={sectionVariant}>
          <EngineeringRoadmap />
        </motion.div>

        {/* ── Bento Grid: Skill Panel + Recommendations ── */}
        <motion.div
          variants={sectionVariant}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Skill Proficiency — 1/3 width */}
          <div className="lg:col-span-1">
            <SkillProficiencyPanel />
          </div>

          {/* Recommendations — 2/3 width */}
          <div className="lg:col-span-2">
            <RecommendationsPanel />
          </div>
        </motion.div>

        {/* ── AI Intelligence Panel ── */}
        <motion.div variants={sectionVariant}>
          <AIInsightPanel />
        </motion.div>

        {/* ── Footer ── */}
        <motion.footer
          variants={sectionVariant}
          className="flex flex-col sm:flex-row justify-between items-center gap-3 py-5 border-t border-white/[0.05]"
        >
          <div className="flex items-center gap-4">
            <p className="text-[11px] font-mono font-bold text-violet-400 tracking-widest">
              LEARNPATH AI
            </p>
            <span className="text-white/15 text-xs">·</span>
            <p className="text-[11px] text-white/25 font-mono">© 2024 LearnPath AI Engineering</p>
          </div>
          <div className="flex gap-5">
            {["Industry Trends", "Privacy", "Support"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-[11px] font-mono text-white/25 hover:text-cyan-400 transition-colors tracking-wider"
              >
                {link}
              </a>
            ))}
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default DashboardPage;