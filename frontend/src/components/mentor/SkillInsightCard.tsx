import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkillBar {
  label: string;
  value: number;
  color: "violet" | "cyan" | "fuchsia";
}

const colorMap = {
  violet: {
    bar: "bg-violet-400 shadow-[0_0_8px_rgba(192,193,255,0.6)]",
    text: "text-violet-300",
  },
  cyan: {
    bar: "bg-cyan-400 shadow-[0_0_8px_rgba(76,215,246,0.6)]",
    text: "text-cyan-300",
  },
  fuchsia: {
    bar: "bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.6)]",
    text: "text-fuchsia-300",
  },
};

interface SkillInsightCardProps {
  skills: SkillBar[];
  delay?: number;
}

export const SkillInsightCard = ({ skills, delay = 0 }: SkillInsightCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="space-y-3"
    >
      {skills.map((skill, i) => (
        <div key={skill.label}>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[12px] text-white/60 font-['Inter',_sans-serif]">
              {skill.label}
            </span>
            <span className={cn("text-[12px] font-mono font-bold", colorMap[skill.color].text)}>
              {skill.value}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill.value}%` }}
              transition={{ duration: 0.9, delay: delay + i * 0.08, ease: "easeOut" }}
              className={cn("h-full rounded-full", colorMap[skill.color].bar)}
            />
          </div>
        </div>
      ))}
    </motion.div>
  );
};
