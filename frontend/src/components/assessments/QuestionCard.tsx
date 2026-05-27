import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface QuestionOption {
  id: string;
  letter: "A" | "B" | "C" | "D" | "E";
  title: string;
  description?: string;
}

export interface Question {
  id: string;
  text: string;
  subtitle?: string;
  options: QuestionOption[];
  type?: "choice" | "scale";
}

interface QuestionCardProps {
  question: Question;
  selectedOption: string | null;
  onSelect: (optionId: string) => void;
  currentIndex: number;
  total: number;
}

export const QuestionCard = ({
  question,
  selectedOption,
  onSelect,
  currentIndex,
  total,
}: QuestionCardProps) => {
  const pct = Math.round((currentIndex / total) * 100);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.97 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative overflow-hidden rounded-[28px] p-7 md:p-10",
          "bg-[rgba(255,255,255,0.03)] backdrop-blur-xl",
          "border border-white/[0.08]"
        )}
      >
        {/* Ambient glow blobs */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-violet-600/[0.06] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-cyan-500/[0.04] blur-2xl pointer-events-none" />

        {/* Progress header */}
        <div className="relative z-10 mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-violet-400">
              Question {currentIndex} of {total}
            </span>
            <span className="text-[11px] font-mono text-white/30">
              {pct}% Completed
            </span>
          </div>
          {/* Gradient progress bar */}
          <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
              style={{ boxShadow: "0 0 10px rgba(192,193,255,0.5)" }}
            />
          </div>
        </div>

        {/* Question text */}
        <div className="relative z-10 mb-8 space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] leading-snug tracking-tight">
            {question.text}
          </h2>
          {question.subtitle && (
            <p className="text-sm text-white/40 font-['Inter',_sans-serif]">
              {question.subtitle}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="relative z-10 space-y-3">
          {question.options.map((opt, i) => {
            const isSelected = selectedOption === opt.id;
            return (
              <motion.button
                key={opt.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelect(opt.id)}
                className={cn(
                  "w-full text-left flex items-start gap-4 p-5 rounded-2xl",
                  "border transition-all duration-300 group",
                  isSelected
                    ? "bg-violet-500/[0.10] border-violet-400/50 shadow-[0_0_20px_rgba(192,193,255,0.12)]"
                    : "bg-[rgba(255,255,255,0.02)] border-white/[0.06] hover:bg-white/[0.05] hover:border-violet-400/25"
                )}
              >
                {/* Letter badge */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center",
                    "text-[12px] font-mono font-bold tracking-wide transition-all duration-300",
                    isSelected
                      ? "bg-violet-500 text-white shadow-[0_0_12px_rgba(192,193,255,0.5)] border border-violet-400/60"
                      : "border border-white/[0.15] text-white/40 group-hover:border-violet-400/30 group-hover:text-violet-300"
                  )}
                >
                  {opt.letter}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "font-semibold text-sm font-['Hanken_Grotesk',_sans-serif] mb-1 transition-colors",
                      isSelected ? "text-white/90" : "text-white/70 group-hover:text-white/85"
                    )}
                  >
                    {opt.title}
                  </p>
                  {opt.description && (
                    <p className="text-xs text-white/35 font-['Inter',_sans-serif] leading-relaxed">
                      {opt.description}
                    </p>
                  )}
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 rounded-full bg-violet-400 flex-shrink-0 mt-0.5 shadow-[0_0_8px_rgba(192,193,255,0.7)]"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
