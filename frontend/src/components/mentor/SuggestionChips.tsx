import { motion } from "framer-motion";
import { Brain, Cpu, Code2, FileText, Terminal, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

interface Suggestion {
  icon: React.ReactNode;
  label: string;
  color: "cyan" | "violet" | "fuchsia";
}

const suggestions: Suggestion[] = [
  { icon: <Brain size={12} />, label: "Explain System Design", color: "violet" },
  { icon: <FileText size={12} />, label: "Review my Resume", color: "cyan" },
  { icon: <Terminal size={12} />, label: "Debug Python Script", color: "cyan" },
  { icon: <Cpu size={12} />, label: "Prepare React Interviews", color: "violet" },
  { icon: <Compass size={12} />, label: "Suggest next roadmap step", color: "fuchsia" },
  { icon: <Code2 size={12} />, label: "Help me learn Kubernetes", color: "cyan" },
];

const colorMap = {
  cyan: "text-cyan-400 border-cyan-400/20 bg-cyan-400/[0.06] hover:bg-cyan-400/[0.12] hover:border-cyan-400/40",
  violet: "text-violet-300 border-violet-400/20 bg-violet-500/[0.06] hover:bg-violet-500/[0.12] hover:border-violet-400/40",
  fuchsia: "text-fuchsia-300 border-fuchsia-400/20 bg-fuchsia-500/[0.06] hover:bg-fuchsia-500/[0.12] hover:border-fuchsia-400/40",
};

interface SuggestionChipsProps {
  onSelect?: (label: string) => void;
}

export const SuggestionChips = ({ onSelect }: SuggestionChipsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((s, i) => (
        <motion.button
          key={s.label}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, delay: i * 0.06 + 0.2, ease: "easeOut" }}
          whileHover={{ y: -2, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect?.(s.label)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full",
            "border text-[11px] font-mono tracking-wide",
            "backdrop-blur-sm transition-all duration-200",
            colorMap[s.color]
          )}
        >
          {s.icon}
          {s.label}
        </motion.button>
      ))}
    </div>
  );
};
