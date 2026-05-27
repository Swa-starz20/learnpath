import { motion } from "framer-motion";
import { CheckCircle2, Play, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type NodeStatus = "completed" | "active" | "upcoming";

interface RoadmapNode {
  id: string;
  status: NodeStatus;
  title: string;
  category: string;
}

const roadmapData: RoadmapNode[] = [
  {
    id: "1",
    status: "completed",
    title: "Data Structures & Algo",
    category: "COMPLETED",
  },
  {
    id: "2",
    status: "active",
    title: "System Design Fundamentals",
    category: "IN PROGRESS",
  },
  {
    id: "3",
    status: "upcoming",
    title: "Microservices Architecture",
    category: "UPCOMING",
  },
  {
    id: "4",
    status: "upcoming",
    title: "Distributed Databases",
    category: "UPCOMING",
  },
];

const nodeStyles: Record<
  NodeStatus,
  {
    card: string;
    label: string;
    nodeColor: string;
    nodeIcon: React.ReactNode;
    opacity: string;
  }
> = {
  completed: {
    card: "border-2 border-cyan-400/80 bg-cyan-400/10 shadow-[0_0_20px_rgba(76,215,246,0.15)]",
    label: "text-cyan-400",
    nodeColor: "bg-cyan-400 text-slate-900 shadow-[0_0_16px_rgba(76,215,246,0.6)]",
    nodeIcon: <CheckCircle2 size={14} />,
    opacity: "opacity-100",
  },
  active: {
    card: "border border-violet-400/60 bg-white/[0.04] shadow-[0_0_24px_rgba(192,193,255,0.15)]",
    label: "text-violet-400",
    nodeColor: "bg-violet-500 text-white shadow-[0_0_24px_rgba(192,193,255,0.5)]",
    nodeIcon: <Play size={14} className="fill-white" />,
    opacity: "opacity-100",
  },
  upcoming: {
    card: "border border-white/[0.06] bg-white/[0.02]",
    label: "text-white/30",
    nodeColor: "bg-slate-800 border border-white/10 text-white/40",
    nodeIcon: <Lock size={12} />,
    opacity: "opacity-50",
  },
};

interface RoadmapNodeCardProps {
  node: RoadmapNode;
  index: number;
}

const RoadmapNodeCard = ({ node, index }: RoadmapNodeCardProps) => {
  const styles = nodeStyles[node.status];
  const isPulse = node.status === "active";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
      className={cn("relative z-10 flex-1 min-w-[220px] flex flex-col items-center", styles.opacity)}
    >
      {/* Card */}
      <div
        className={cn(
          "w-full rounded-2xl p-4 mb-5",
          styles.card,
          isPulse && "animate-pulse-border"
        )}
      >
        <p className={cn("text-[10px] font-mono tracking-widest mb-2 uppercase", styles.label)}>
          {node.category}
        </p>
        <p className="font-semibold text-white/90 text-sm leading-snug font-['Hanken_Grotesk',_sans-serif]">
          {node.title}
        </p>
      </div>

      {/* Node circle */}
      <div
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center",
          styles.nodeColor
        )}
      >
        {styles.nodeIcon}
      </div>
    </motion.div>
  );
};

export const EngineeringRoadmap = () => {
  const completedCount = roadmapData.filter((n) => n.status === "completed").length;
  const progressPercent = Math.round((completedCount / roadmapData.length) * 100);

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] flex items-center gap-3">
          Engineering Roadmap
          <span className="px-2.5 py-0.5 bg-violet-500/20 text-violet-300 text-[10px] rounded-full font-mono tracking-widest border border-violet-500/20">
            Q3 TARGET
          </span>
        </h2>
        <motion.button
          whileHover={{ x: 2 }}
          className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium"
        >
          View Detailed Path →
        </motion.button>
      </div>

      {/* Roadmap Panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative overflow-hidden rounded-[28px] p-8
          bg-[rgba(255,255,255,0.02)] backdrop-blur-xl
          border border-white/[0.07]"
      >
        {/* Overflow scroll container */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-8 min-w-[900px] relative py-2">
            {/* Background track line */}
            <div className="absolute top-[60%] left-0 w-full h-px bg-white/[0.06]" />

            {/* Progress line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              className="absolute top-[60%] left-0 h-px bg-gradient-to-r from-cyan-400 via-violet-400 to-violet-600"
              style={{ filter: "drop-shadow(0 0 4px rgba(76,215,246,0.6))" }}
            />

            {roadmapData.map((node, index) => (
              <RoadmapNodeCard
                key={node.id}
                node={node}
                index={index}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
