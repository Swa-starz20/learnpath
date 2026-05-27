import { motion } from "framer-motion";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface RecommendationCard {
  id: string;
  title: string;
  type: "course" | "internship" | "project";
  matchPercent?: number;
  skillGap?: "HIGH" | "MEDIUM" | "LOW";
  duration: string;
  tags: { label: string; color: "cyan" | "purple" | "violet" }[];
  highlight: string;
  bgGradient: string;
}

const recommendations: RecommendationCard[] = [
  {
    id: "1",
    title: "Advanced Docker & Kubernetes",
    type: "course",
    matchPercent: 94,
    duration: "12h total",
    tags: [
      { label: "DEVOPS", color: "cyan" },
      { label: "INFRASTRUCTURE", color: "purple" },
    ],
    highlight: "Resume Project Included",
    bgGradient: "from-indigo-900/80 via-violet-900/60 to-cyan-900/40",
  },
  {
    id: "2",
    title: "Scalable Backend Systems",
    type: "course",
    skillGap: "HIGH",
    duration: "8.5h total",
    tags: [
      { label: "SYSTEM DESIGN", color: "violet" },
      { label: "SCALABILITY", color: "cyan" },
    ],
    highlight: "Masterclass",
    bgGradient: "from-violet-900/80 via-fuchsia-900/50 to-slate-900/60",
  },
  {
    id: "3",
    title: "React Performance Patterns",
    type: "course",
    matchPercent: 89,
    duration: "6h total",
    tags: [
      { label: "FRONTEND", color: "cyan" },
      { label: "REACT", color: "violet" },
    ],
    highlight: "Certificate Included",
    bgGradient: "from-cyan-900/70 via-blue-900/60 to-slate-900/60",
  },
  {
    id: "4",
    title: "ML Internship at TechCorp",
    type: "internship",
    matchPercent: 87,
    duration: "3 months",
    tags: [
      { label: "ML", color: "purple" },
      { label: "INTERNSHIP", color: "cyan" },
    ],
    highlight: "Paid Position",
    bgGradient: "from-emerald-900/60 via-teal-900/60 to-slate-900/60",
  },
];

const tagColorMap = {
  cyan: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
  purple: "bg-violet-400/10 text-violet-300 border-violet-400/20",
  violet: "bg-fuchsia-400/10 text-fuchsia-300 border-fuchsia-400/20",
};

const VisualBanner = ({ gradient }: { gradient: string }) => (
  <div className={cn("w-full h-32 bg-gradient-to-br relative overflow-hidden", gradient)}>
    {/* Animated grid lines */}
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(rgba(76,215,246,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(76,215,246,0.3) 1px, transparent 1px)
        `,
        backgroundSize: "24px 24px",
      }}
    />
    {/* Glowing orbs */}
    <div className="absolute top-4 right-8 w-16 h-16 rounded-full bg-violet-500/30 blur-xl" />
    <div className="absolute bottom-2 left-6 w-12 h-12 rounded-full bg-cyan-400/20 blur-lg" />
    {/* Bottom fade */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
  </div>
);

interface RecommendationCardItemProps {
  card: RecommendationCard;
  index: number;
}

const RecommendationCardItem = ({ card, index }: RecommendationCardItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.08 + 0.4 }}
    whileHover={{ y: -4, scale: 1.02 }}
    className="group relative rounded-2xl overflow-hidden cursor-pointer
      bg-[rgba(255,255,255,0.03)] border border-white/[0.07]
      hover:border-violet-400/40 transition-all duration-500"
  >
    {/* Hover glow */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl shadow-[inset_0_0_30px_rgba(192,193,255,0.06)]" />

    <div className="relative">
      <VisualBanner gradient={card.bgGradient} />

      {/* Badge */}
      {card.matchPercent && (
        <span className="absolute top-3 left-3 px-2 py-0.5 bg-violet-500 text-white text-[9px] font-bold rounded font-mono tracking-widest">
          AI MATCH {card.matchPercent}%
        </span>
      )}
      {card.skillGap && (
        <span className="absolute top-3 left-3 px-2 py-0.5 bg-violet-900 text-violet-200 border border-violet-400/30 text-[9px] font-bold rounded font-mono tracking-widest">
          SKILL GAP: {card.skillGap}
        </span>
      )}
    </div>

    <div className="p-4">
      <h4 className="font-semibold text-white/90 mb-2 text-sm font-['Hanken_Grotesk',_sans-serif] leading-snug">
        {card.title}
      </h4>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {card.tags.map((tag) => (
          <span
            key={tag.label}
            className={cn(
              "px-2 py-0.5 text-[9px] rounded border font-mono tracking-widest",
              tagColorMap[tag.color]
            )}
          >
            {tag.label}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-[11px] text-white/30">
        <span className="flex items-center gap-1.5">
          <Clock size={10} className="text-white/25" />
          {card.duration}
        </span>
        <span className="text-violet-400 font-semibold">{card.highlight}</span>
      </div>
    </div>
  </motion.div>
);

export const RecommendationsPanel = () => {
  const [page, setPage] = useState(0);
  const pageSize = 2;
  const totalPages = Math.ceil(recommendations.length / pageSize);
  const visible = recommendations.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.35 }}
      className="relative overflow-hidden rounded-[28px] p-6 flex flex-col space-y-5
        bg-[rgba(255,255,255,0.02)] backdrop-blur-xl
        border border-white/[0.07]"
    >
      {/* Corner ambient */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-violet-500/8 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">
            Recommended for You
          </h3>
          <span className="text-violet-400 text-base">✦</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] 
              hover:bg-white/10 transition-colors flex items-center justify-center text-white/50"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] 
              hover:bg-white/10 transition-colors flex items-center justify-center text-white/50"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Cards grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visible.map((card, index) => (
          <RecommendationCardItem key={card.id} card={card} index={index} />
        ))}
      </div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="relative z-10 flex items-start gap-3 p-4 rounded-2xl 
          bg-violet-500/[0.05] border border-violet-500/[0.12]"
      >
        <div className="mt-0.5 w-5 h-5 flex-shrink-0 text-violet-400">💡</div>
        <p className="text-xs text-white/45 leading-relaxed">
          <span className="text-violet-400 font-semibold">AI Insight: </span>
          Your performance in the last coding round suggests you're ready for{" "}
          <span className="text-white/70 underline cursor-pointer hover:text-violet-400 transition-colors">
            Level 2 System Design
          </span>
          . Completing 'Scalable Backend Systems' will increase your career readiness score by{" "}
          <span className="text-cyan-400 font-semibold">~4%</span>.
        </p>
      </motion.div>
    </motion.div>
  );
};
