import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Target, Bot } from "lucide-react";

interface InsightItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
}

const insights: InsightItem[] = [
  {
    icon: <Target size={14} />,
    title: "Career Trajectory",
    description:
      "You are on pace for a Senior Engineer role within 18 months. Focus on System Design to accelerate.",
    accent: "text-cyan-400",
  },
  {
    icon: <TrendingUp size={14} />,
    title: "Skill Velocity",
    description:
      "Your learning velocity is 34% above peers in your cohort. Coding skills improved 12 pts this week.",
    accent: "text-violet-400",
  },
  {
    icon: <Bot size={14} />,
    title: "AI Mentor Suggestion",
    description:
      "Schedule a mock interview this week. Your System Design readiness score just crossed 65%.",
    accent: "text-fuchsia-400",
  },
];

export const AIInsightPanel = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="relative overflow-hidden rounded-[28px] p-6
        bg-[rgba(255,255,255,0.02)] backdrop-blur-xl
        border border-violet-500/[0.12]"
    >
      {/* Ambient glow blobs */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-violet-600/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-cyan-500/6 blur-2xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full rounded-[28px] bg-gradient-to-br from-violet-900/[0.06] to-transparent pointer-events-none" />

      {/* Pulsing border animation */}
      <div className="absolute inset-0 rounded-[28px] border border-violet-500/10 animate-pulse" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
          <Sparkles size={14} />
        </div>
        <div>
          <h3 className="font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] text-sm">
            AI Intelligence Panel
          </h3>
          <p className="text-[10px] text-white/30 font-mono tracking-widest uppercase">
            Adaptive recommendations · Updated 2m ago
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(76,215,246,0.6)]" />
          <span className="text-[10px] text-cyan-400/70 font-mono tracking-widest">LIVE</span>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
            whileHover={{ y: -2 }}
            className="group p-4 rounded-2xl 
              bg-white/[0.03] border border-white/[0.06]
              hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300"
          >
            <div className={`flex items-center gap-2 mb-2 ${item.accent}`}>
              {item.icon}
              <span className="text-[10px] font-mono tracking-widest uppercase">
                {item.title}
              </span>
            </div>
            <p className="text-xs text-white/45 leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
