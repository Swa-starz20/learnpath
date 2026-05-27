import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: ReactNode;
  badge?: string;
  badgeVariant?: "cyan" | "purple" | "red" | "primary";
  value: string;
  label: string;
  accent?: "cyan" | "purple" | "error";
  glowColor?: string;
  children?: ReactNode;
  className?: string;
  delay?: number;
}

const accentMap = {
  cyan: "text-cyan-400",
  purple: "text-violet-400",
  error: "text-red-400",
};

const badgeMap = {
  cyan: "text-cyan-400 bg-cyan-400/10 border border-cyan-400/20",
  purple: "text-violet-400 bg-violet-400/10 border border-violet-400/20",
  red: "text-red-400 bg-red-400/10 border border-red-400/20",
  primary: "text-indigo-300 bg-indigo-400/10 border border-indigo-400/20",
};

export const StatsCard = ({
  icon,
  badge,
  badgeVariant = "primary",
  value,
  label,
  accent = "purple",
  className,
  delay = 0,
}: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        "relative overflow-hidden rounded-3xl p-5",
        "bg-[rgba(255,255,255,0.03)] backdrop-blur-xl",
        "border border-white/[0.08]",
        "shadow-[0_0_40px_rgba(192,193,255,0.04)]",
        "group cursor-default",
        className
      )}
    >
      {/* Background ambient glow */}
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-violet-500/10 blur-2xl group-hover:bg-violet-500/20 transition-all duration-700" />

      <div className="relative z-10">
        {/* Top row */}
        <div className="flex justify-between items-start mb-4">
          <div className={cn("text-xl", accentMap[accent])}>{icon}</div>
          {badge && (
            <span className={cn("text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full", badgeMap[badgeVariant])}>
              {badge}
            </span>
          )}
        </div>

        {/* Value */}
        <p className="text-2xl font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] tracking-tight mb-1">
          {value}
        </p>
        <p className="text-xs text-white/40 tracking-wide">{label}</p>
      </div>
    </motion.div>
  );
};
