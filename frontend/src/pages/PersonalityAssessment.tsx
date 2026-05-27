import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { personalityQuestions } from '@/data/assessmentData';
import { QuestionCard } from '@/components/assessments/QuestionCard';
import AssessmentTimer from '@/components/assessments/AssessmentTimer';
import { AIInsightPanel } from '@/components/assessments/AIInsightPanel';

// ── AI insight items for the live sidebar ───────────────────────────────────

const liveInsights = [
  {
    icon: <Sparkles size={13} />,
    title: 'Pattern Detected',
    body: 'Strong Empathetic Leadership tendency emerging from your responses.',
    accent: 'violet' as const,
    badge: 'LIVE',
  },
  {
    icon: <Brain size={13} />,
    title: 'Predictive Signal',
    body: 'Your answers align with Top 15% Collaborative Strategic Thinkers.',
    accent: 'cyan' as const,
  },
  {
    icon: <Sparkles size={13} />,
    title: 'Adaptive Note',
    body: 'Questions are adapting based on your response pattern in real-time.',
    accent: 'fuchsia' as const,
    badge: 'AI',
  },
];

// ── Tentative profile progress bars ─────────────────────────────────────────

const profileBars = [
  { label: 'Analytical', value: 88, color: 'from-violet-500 to-violet-400' },
  { label: 'Empathy',    value: 85, color: 'from-cyan-500 to-cyan-400' },
  { label: 'Strategic',  value: 91, color: 'from-fuchsia-500 to-fuchsia-400' },
  { label: 'Creative',   value: 72, color: 'from-indigo-500 to-violet-400' },
];

// ── Dot pagination helper ────────────────────────────────────────────────────

interface DotsProps {
  total: number;
  current: number; // 0-indexed
  answered: Set<string>;
  questionIds: string[];
}

const PaginationDots = ({ total, current, answered, questionIds }: DotsProps) => {
  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(0, current - half);
  const end = Math.min(total - 1, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(0, end - maxVisible + 1);
  const visible = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex items-center gap-2">
      {visible.map((idx) => {
        const isAnswered = answered.has(questionIds[idx]);
        const isCurrent = idx === current;
        return (
          <motion.div
            key={idx}
            animate={isCurrent ? { scale: [1, 1.25, 1] } : { scale: 1 }}
            transition={isCurrent ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : {}}
            className={cn(
              'rounded-full transition-all duration-300',
              isCurrent
                ? 'w-3.5 h-3.5 bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]'
                : isAnswered
                ? 'w-2.5 h-2.5 bg-violet-500/70'
                : 'w-2.5 h-2.5 border border-white/20 bg-transparent'
            )}
          />
        );
      })}
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────

const PersonalityAssessment = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [showResultsBtn, setShowResultsBtn] = useState(false);

  const question = personalityQuestions[currentIndex];
  const total = personalityQuestions.length;
  const answeredSet = new Set(
    Object.entries(answers)
      .filter(([, v]) => v)
      .map(([k]) => k)
  );
  const answeredCount = answeredSet.size;
  const currentAnswered = !!answers[question?.id];
  const isLast = currentIndex === total - 1;

  // Show results button 2s after completion
  useEffect(() => {
    if (!isComplete) return;
    const t = setTimeout(() => setShowResultsBtn(true), 2000);
    return () => clearTimeout(t);
  }, [isComplete]);

  const handleSelect = useCallback(
    (optionId: string) => {
      setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
    },
    [question?.id]
  );

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleNext = () => {
    if (isLast) {
      setIsComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleExit = () => {
    console.log('Exit assessment');
  };

  // ── AI insight stripe text per question ──────────────────────────────────
  const insightStripes = [
    'This question evaluates Collaborative Intelligence — a key predictor of engineering leadership readiness.',
    'This question measures Cognitive Flexibility — critical for adapting to emerging tech paradigms.',
    'This question uncovers your Persuasion & Influence style — essential in cross-functional teams.',
    'This question reveals Growth Mindset orientation — correlated with 3× faster skill acquisition.',
    'This question profiles Crisis Decision-Making — a strong signal for high-stakes leadership potential.',
  ];

  return (
    <div
      className="min-h-screen w-full font-['Inter',_sans-serif]"
      style={{ backgroundColor: '#0b1326' }}
    >
      {/* ── Atmospheric background ──────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60%] h-[50%] bg-violet-600/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[40%] h-[30%] bg-cyan-500/[0.03] blur-[100px] rounded-full" />
      </div>

      {/* ── Completion overlay ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            key="completion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ backgroundColor: 'rgba(11,19,38,0.92)', backdropFilter: 'blur(24px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'relative overflow-hidden rounded-[28px] p-10 max-w-lg w-full text-center',
                'bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/[0.08]',
                'shadow-[0_0_60px_rgba(139,92,246,0.15)]'
              )}
            >
              {/* Ambient glows */}
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-violet-600/[0.08] rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-500/[0.05] rounded-full blur-2xl pointer-events-none" />

              {/* Animated checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
                className="relative z-10 mx-auto mb-7 w-20 h-20 rounded-full bg-violet-500/15 border border-violet-400/30 flex items-center justify-center"
              >
                <CheckCircle2 size={40} className="text-violet-400" style={{ filter: 'drop-shadow(0 0 12px rgba(167,139,250,0.8))' }} />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.45 }}
                className="relative z-10 text-3xl font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] mb-3"
              >
                Assessment Complete!
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.45 }}
                className="relative z-10 text-sm text-white/50 font-['Inter',_sans-serif] mb-6 leading-relaxed"
              >
                Your cognitive profile is being analyzed by our AI engine...
              </motion.p>

              {/* Summary stat */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-400/20 mb-8"
              >
                <span className="text-xs font-mono tracking-widest text-violet-300">
                  {answeredCount}/{total} QUESTIONS ANSWERED
                </span>
              </motion.div>

              {/* Pulsing dots loader */}
              <AnimatePresence>
                {!showResultsBtn && (
                  <motion.div
                    key="loader"
                    exit={{ opacity: 0 }}
                    className="relative z-10 flex items-center justify-center gap-2 mb-8"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.22, ease: 'easeInOut' }}
                        className="w-2 h-2 rounded-full bg-violet-400"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results button */}
              <AnimatePresence>
                {showResultsBtn && (
                  <motion.button
                    key="results-btn"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => console.log('View Full Results')}
                    className={cn(
                      'relative z-10 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white',
                      'bg-gradient-to-r from-violet-600 to-indigo-500',
                      'shadow-[0_0_24px_rgba(139,92,246,0.45)]',
                      'transition-shadow hover:shadow-[0_0_32px_rgba(139,92,246,0.6)]'
                    )}
                  >
                    View Full Results
                    <ChevronRight size={16} />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main layout ──────────────────────────────────────────────────── */}
      <div className="flex gap-6 min-h-screen p-6 xl:p-8">

        {/* ── LEFT COLUMN (main area) ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">

          {/* Top bar */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
              'flex items-center justify-between gap-4 px-5 py-3.5 rounded-2xl',
              'bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/[0.08]'
            )}
          >
            {/* Left: brand + badge */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Brain size={17} />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] leading-none mb-0.5">
                  Personality Profiling
                </h1>
                <p className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
                  Cognitive Assessment
                </p>
              </div>
              <span className="ml-1 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-[9px] font-mono tracking-widest text-violet-400 uppercase">
                AI Adaptive
              </span>
            </div>

            {/* Center: timer */}
            <div className="hidden sm:flex items-center">
              <AssessmentTimer totalSeconds={1080} warningThreshold={180} variant="compact" />
            </div>

            {/* Right: exit */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleExit}
              className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.08] transition-all"
              aria-label="Exit assessment"
            >
              <X size={15} />
            </motion.button>
          </motion.div>

          {/* Question area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl mx-auto w-full"
          >
            <QuestionCard
              question={question}
              selectedOption={answers[question.id] ?? null}
              onSelect={handleSelect}
              currentIndex={currentIndex + 1}
              total={total}
            />
          </motion.div>

          {/* AI Insight stripe */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className={cn(
              'max-w-2xl mx-auto w-full',
              'flex items-start gap-3 px-5 py-3.5 rounded-2xl',
              'bg-violet-500/[0.05] border border-l-[3px] border-l-violet-500/60 border-white/[0.06]'
            )}
          >
            <Sparkles size={14} className="text-violet-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-white/50 font-['Inter',_sans-serif] leading-relaxed">
              <span className="text-violet-400 font-mono tracking-widest text-[10px] uppercase mr-1.5">
                AI Analysis:
              </span>
              {insightStripes[currentIndex] ?? insightStripes[0]}
            </p>
          </motion.div>

          {/* Navigation footer */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto w-full flex items-center justify-between gap-4 mt-auto"
          >
            {/* Previous */}
            <motion.button
              whileHover={currentIndex > 0 ? { x: -2 } : {}}
              whileTap={currentIndex > 0 ? { scale: 0.95 } : {}}
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={cn(
                'flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                'border',
                currentIndex === 0
                  ? 'border-white/[0.05] text-white/20 cursor-not-allowed bg-transparent'
                  : 'border-white/[0.1] text-white/60 hover:text-white/90 hover:bg-white/[0.04] hover:border-white/[0.15]'
              )}
            >
              <ChevronLeft size={16} />
              Previous
            </motion.button>

            {/* Dots */}
            <PaginationDots
              total={total}
              current={currentIndex}
              answered={answeredSet}
              questionIds={personalityQuestions.map((q) => q.id)}
            />

            {/* Next / Complete */}
            <motion.button
              whileHover={currentAnswered ? { scale: 1.03 } : {}}
              whileTap={currentAnswered ? { scale: 0.97 } : {}}
              onClick={handleNext}
              disabled={!currentAnswered}
              className={cn(
                'flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all',
                currentAnswered
                  ? [
                      'bg-gradient-to-r from-violet-600 to-indigo-500 text-white',
                      'shadow-[0_0_20px_rgba(192,193,255,0.3)]',
                      'hover:shadow-[0_0_28px_rgba(192,193,255,0.45)]',
                    ]
                  : 'bg-white/[0.03] border border-white/[0.06] text-white/25 cursor-not-allowed'
              )}
            >
              {isLast ? 'Complete Assessment' : 'Next Step'}
              <ChevronRight size={16} />
            </motion.button>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN (xl only) ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.25 }}
          className="hidden xl:flex flex-col gap-5 w-72 flex-shrink-0"
        >
          {/* Live Analysis panel */}
          <div
            className={cn(
              'relative overflow-hidden rounded-[28px] p-5',
              'bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/[0.08]'
            )}
          >
            {/* Ambient blobs */}
            <div className="absolute -top-10 -left-8 w-36 h-36 bg-violet-600/[0.07] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -right-6 w-28 h-28 bg-cyan-500/[0.05] rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">
                Live Analysis
              </h3>
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]"
                />
                <span className="text-[9px] font-mono tracking-widest text-cyan-400/80 uppercase">Live</span>
              </div>
            </div>

            {/* AIInsightPanel with custom insights */}
            <div className="relative z-10 -mx-1">
              <AIInsightPanel compact insights={liveInsights} title="" />
            </div>
          </div>

          {/* Tentative Profile Preview */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={cn(
              'relative overflow-hidden rounded-[28px] p-5',
              'bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/[0.08]'
            )}
          >
            {/* Ambient */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-fuchsia-600/[0.06] rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Profile header */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-mono tracking-widest text-white/25 uppercase">Tentative Profile</span>
              </div>
              <h4 className="text-base font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] mb-1">
                Visionary Architect
              </h4>
              <p className="text-[11px] text-white/35 font-['Inter',_sans-serif] mb-5 leading-relaxed">
                Systems thinker with high empathy and strategic foresight. Thrives in complex, ambiguous environments.
              </p>

              {/* Progress bars */}
              <div className="space-y-3">
                {profileBars.map((bar, i) => (
                  <motion.div
                    key={bar.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                        {bar.label}
                      </span>
                      <span className="text-[10px] font-mono text-white/50">{bar.value}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${bar.value}%` }}
                        transition={{ duration: 0.9, delay: 0.6 + i * 0.1, ease: 'easeOut' }}
                        className={cn('h-full rounded-full bg-gradient-to-r', bar.color)}
                        style={{ boxShadow: '0 0 6px rgba(192,193,255,0.3)' }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom badge */}
              <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center gap-2">
                <Sparkles size={11} className="text-fuchsia-400" />
                <span className="text-[10px] font-mono tracking-widest text-fuchsia-400/70 uppercase">
                  AI Confidence: 94%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Question progress chip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className={cn(
              'flex items-center justify-between px-4 py-3 rounded-2xl',
              'bg-[rgba(255,255,255,0.02)] border border-white/[0.07]'
            )}
          >
            <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
              Progress
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white/70 font-mono">
                {answeredCount}
                <span className="text-white/25">/{total}</span>
              </span>
              <div className="w-16 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${(answeredCount / total) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PersonalityAssessment;
