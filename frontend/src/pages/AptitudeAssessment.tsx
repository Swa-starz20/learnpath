import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronLeft, ChevronRight, Clock, BarChart2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { aptitudeQuestions } from "@/data/assessmentData";
import { QuestionCard } from "@/components/assessments/QuestionCard";
import AssessmentTimer from "@/components/assessments/AssessmentTimer";

// ── Section metadata ────────────────────────────────────────────────────
const sections = [
  { id: "logical", label: "Logical Reasoning", questions: [0, 1], color: "violet" as const, icon: <BarChart2 size={12} /> },
  { id: "quantitative", label: "Quantitative", questions: [2, 3], color: "cyan" as const, icon: <Zap size={12} /> },
];

const sectionColorMap = {
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/25", text: "text-violet-300", active: "bg-violet-500/20 border-violet-400/40" },
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/25", text: "text-cyan-300", active: "bg-cyan-400/20 border-cyan-400/40" },
};

// ── Page ────────────────────────────────────────────────────────────────
const AptitudeAssessment = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const question = aptitudeQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const total = aptitudeQuestions.length;
  const currentAnswer = answers[question?.id] ?? null;

  const currentSection = sections.find((s) => s.questions.includes(currentIndex));

  const handleSelect = useCallback((optionId: string) => {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  }, [question]);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsComplete(true);
      setTimeout(() => setShowResults(true), 2200);
    }
  };

  // ── Completion screen ───────────────────────────────────────────────
  if (isComplete) {
    return (
      <div className="relative min-h-full flex items-center justify-center p-8">
        {/* Atmospheric bg */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60%] h-[50%] bg-cyan-600/[0.05] blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[40%] h-[30%] bg-violet-500/[0.04] blur-[100px] rounded-full" />
        </div>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "max-w-lg w-full text-center p-12 rounded-[28px]",
              "bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/[0.08]",
              "relative overflow-hidden"
            )}
          >
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-cyan-500/[0.06] blur-3xl pointer-events-none" />

            {/* Check icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(76,215,246,0.3)]"
            >
              <CheckCircle2 size={36} className="text-cyan-400" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] mb-2"
            >
              Aptitude Analysis Complete
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-white/40 font-['Inter',_sans-serif] mb-8"
            >
              {answeredCount} of {total} questions answered · AI scoring in progress
            </motion.p>

            {/* Score breakdown preview */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 gap-3 mb-8"
            >
              {[
                { label: "Logical Reasoning", value: "88%", color: "text-violet-300" },
                { label: "Quantitative", value: "75%", color: "text-cyan-300" },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-[9px] font-mono tracking-widest text-white/25 uppercase mb-1">{s.label}</p>
                  <p className={cn("text-xl font-bold font-['Hanken_Grotesk',_sans-serif]", s.color)}>{s.value}</p>
                </div>
              ))}
            </motion.div>

            {/* Loading / CTA */}
            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center gap-2"
                >
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                      transition={{ duration: 1.2, delay, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-cyan-400"
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.a
                  key="cta"
                  href="/assessments/results"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="block w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold font-['Hanken_Grotesk',_sans-serif] shadow-[0_0_20px_rgba(76,215,246,0.3)] hover:brightness-110 transition-all"
                >
                  View Full Results →
                </motion.a>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Atmospheric bg */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 right-1/3 w-[45%] h-[45%] bg-cyan-600/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[35%] h-[35%] bg-violet-500/[0.03] blur-[100px] rounded-full" />
      </div>

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
            <Zap size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">Aptitude Analysis</h2>
            <p className="text-[9px] font-mono tracking-widest text-cyan-400/60 uppercase">Engineering Intelligence · Timed</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Section indicator */}
          {currentSection && (
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wide border",
              sectionColorMap[currentSection.color].active,
              sectionColorMap[currentSection.color].text
            )}>
              {currentSection.icon}
              {currentSection.label}
            </div>
          )}
          <AssessmentTimer totalSeconds={2100} warningThreshold={300} variant="compact" />
        </div>
      </motion.div>

      {/* Section tabs */}
      <div className="flex gap-2 mb-6">
        {sections.map((s) => {
          const isActive = currentSection?.id === s.id;
          const isDone = s.questions.every((qi) => answers[aptitudeQuestions[qi]?.id]);
          return (
            <button
              key={s.id}
              onClick={() => setCurrentIndex(s.questions[0])}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-mono tracking-wide border transition-all duration-200",
                isActive
                  ? cn(sectionColorMap[s.color].active, sectionColorMap[s.color].text)
                  : "bg-white/[0.03] border-white/[0.06] text-white/35 hover:text-white/60"
              )}
            >
              {isDone && <CheckCircle2 size={10} className="text-cyan-400" />}
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto">
        {/* Performance tracker stripe */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-4 px-4 py-2.5 mb-5 rounded-xl bg-white/[0.02] border border-white/[0.05]"
        >
          <div className="flex items-center gap-1.5">
            <Clock size={10} className="text-white/25" />
            <span className="text-[10px] font-mono text-white/25">ADAPTIVE DIFFICULTY</span>
          </div>
          <div className="flex-1 h-px bg-white/[0.05]" />
          <div className="flex items-center gap-3">
            {["Beginner", "Intermediate", "Advanced"].map((level, i) => (
              <div key={level} className="flex items-center gap-1">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  i <= 1 ? "bg-cyan-400 shadow-[0_0_4px_rgba(76,215,246,0.6)]" : "bg-white/10"
                )} />
                <span className={cn("text-[9px] font-mono", i <= 1 ? "text-cyan-400/70" : "text-white/20")}>{level}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Question card */}
        <QuestionCard
          question={question}
          selectedOption={currentAnswer}
          onSelect={handleSelect}
          currentIndex={currentIndex + 1}
          total={total}
        />

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mt-6"
        >
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-xl text-sm transition-all",
              currentIndex === 0
                ? "text-white/20 cursor-not-allowed"
                : "text-white/50 hover:text-white/80 hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08]"
            )}
          >
            <ChevronLeft size={16} />
            Previous
          </motion.button>

          {/* Question dots */}
          <div className="flex items-center gap-1.5">
            {aptitudeQuestions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "rounded-full transition-all duration-200",
                  i === currentIndex
                    ? "w-4 h-2.5 bg-cyan-400 shadow-[0_0_6px_rgba(76,215,246,0.6)]"
                    : answers[q.id]
                    ? "w-2.5 h-2.5 bg-violet-400/60"
                    : "w-2.5 h-2.5 bg-white/10 hover:bg-white/20"
                )}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            disabled={!currentAnswer}
            className={cn(
              "flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold font-['Hanken_Grotesk',_sans-serif] transition-all",
              currentAnswer
                ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-[0_0_20px_rgba(76,215,246,0.3)] hover:brightness-110"
                : "bg-white/[0.05] text-white/25 cursor-not-allowed"
            )}
          >
            {currentIndex < total - 1 ? "Next Step" : "Submit Assessment"}
            <ChevronRight size={16} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default AptitudeAssessment;
