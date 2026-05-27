import { motion } from "framer-motion";
import { ClipboardList, Map, Bot, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: "cyan" | "violet" | "fuchsia";
}

const actions: QuickAction[] = [
  {
    id: "assessment",
    icon: <ClipboardList size={16} />,
    label: "Start Assessment",
    description: "Test your skills now",
    color: "cyan",
  },
  {
    id: "roadmap",
    icon: <Map size={16} />,
    label: "Continue Roadmap",
    description: "System Design → next",
    color: "violet",
  },
  {
    id: "mentor",
    icon: <Bot size={16} />,
    label: "Ask AI Mentor",
    description: "Get personalized guidance",
    color: "fuchsia",
  },
];

const colorMap = {
  cyan: {
    button: "border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:border-cyan-400/60",
    glow: "group-hover:shadow-[0_0_20px_rgba(76,215,246,0.3)]",
    icon: "text-cyan-400",
    desc: "text-cyan-400/50",
    arrow: "group-hover:text-cyan-400",
  },
  violet: {
    button: "border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 hover:border-violet-400/60",
    glow: "group-hover:shadow-[0_0_20px_rgba(192,193,255,0.3)]",
    icon: "text-violet-400",
    desc: "text-violet-400/50",
    arrow: "group-hover:text-violet-400",
  },
  fuchsia: {
    button: "border-fuchsia-500/30 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400 hover:border-fuchsia-400/60",
    glow: "group-hover:shadow-[0_0_20px_rgba(217,70,239,0.3)]",
    icon: "text-fuchsia-400",
    desc: "text-fuchsia-400/50",
    arrow: "group-hover:text-fuchsia-400",
  },
};

export const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {actions.map((action, i) => {
        const colors = colorMap[action.color];
        return (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 + i * 0.08 }}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "group relative flex items-center justify-between gap-3 px-5 py-4 rounded-2xl",
              "border backdrop-blur-sm transition-all duration-300 text-left",
              colors.button,
              colors.glow
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn("flex-shrink-0", colors.icon)}>
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white/90 font-['Hanken_Grotesk',_sans-serif]">
                  {action.label}
                </p>
                <p className={cn("text-[10px] font-mono mt-0.5 tracking-wide", colors.desc)}>
                  {action.description}
                </p>
              </div>
            </div>
            <ArrowRight
              size={14}
              className={cn(
                "flex-shrink-0 text-white/20 transition-all duration-300 group-hover:translate-x-1",
                colors.arrow
              )}
            />
          </motion.button>
        );
      })}
    </div>
  );
};
