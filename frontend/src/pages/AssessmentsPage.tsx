import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Brain,
  Zap,
  Activity,
  Target,
  Code2,
  Sparkles,
  CheckCircle2,
  Award,
  Flame,
  ChevronRight,
  Play,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { assessmentCatalog, assessmentStats } from '@/data/assessmentData';
import { AssessmentCard } from '@/components/assessments';
import { AnimatedMetricCard } from '@/components/assessments';
import { AIInsightPanel } from '@/components/assessments/AIInsightPanel';

// ── Types ──────────────────────────────────────────────────────────────────

type FilterCategory = 'All' | 'Cognitive' | 'Technical' | 'Behavioral' | 'Career';

const FILTERS: FilterCategory[] = ['All', 'Cognitive', 'Technical', 'Behavioral', 'Career'];

// Map assessment type → filter category
const TYPE_TO_FILTER: Record<string, FilterCategory> = {
  personality: 'Cognitive',
  aptitude: 'Cognitive',
  behavioral: 'Behavioral',
  technical: 'Technical',
  career: 'Career',
};

// Map assessment type → icon
const TYPE_ICON: Record<string, React.ReactNode> = {
  personality: <Brain size={20} />,
  aptitude: <Zap size={20} />,
  behavioral: <Activity size={20} />,
  technical: <Code2 size={20} />,
  career: <Target size={20} />,
};

// ── Animated Readiness Ring ────────────────────────────────────────────────

interface ReadinessRingProps {
  score: number; // 0-100
}

const ReadinessRing: React.FC<ReadinessRingProps> = ({ score }) => {
  const size = 56;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Track ring */}
        <svg
          width={size}
          height={size}
          className="rotate-[-90deg]"
          style={{ position: 'absolute', inset: 0 }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
        </svg>
        {/* Animated fill ring */}
        <svg
          width={size}
          height={size}
          className="rotate-[-90deg]"
          style={{ position: 'absolute', inset: 0 }}
        >
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgb(34,211,238)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - dash }}
            transition={{ duration: 1.4, delay: 0.5, ease: 'easeOut' }}
            style={{
              filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.7))',
            }}
          />
        </svg>
        {/* Score label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-base font-bold text-cyan-300 font-['Hanken_Grotesk',_sans-serif] leading-none"
          >
            {score}
          </motion.span>
          <span className="text-[7px] font-mono text-white/25 leading-none mt-0.5">/100</span>
        </div>
      </div>
      <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase text-center">
        Cognitive Readiness
      </span>
    </div>
  );
};

// ── Recommendation Card ────────────────────────────────────────────────────

interface Recommendation {
  title: string;
  category: string;
  desc: string;
  time: string;
  categoryColor: 'violet' | 'cyan' | 'amber' | 'fuchsia';
}

const RECOMMENDATIONS: Recommendation[] = [
  {
    title: 'Complete Aptitude Assessment',
    category: 'Priority',
    desc: 'Your Career Alignment report requires aptitude data. 40 questions, timed.',
    time: '35 min',
    categoryColor: 'violet',
  },
  {
    title: 'Retake Behavioral Module',
    category: 'AI Suggested',
    desc: 'New questions added. Retaking may improve your compatibility score by ~8%.',
    time: '22 min',
    categoryColor: 'cyan',
  },
  {
    title: 'System Design Deep Dive',
    category: 'Growth Area',
    desc: 'Based on your profile, system design is your highest-leverage skill gap.',
    time: '45 min',
    categoryColor: 'amber',
  },
];

const categoryColorMap = {
  violet: {
    chip: 'bg-violet-500/10 border-violet-500/25 text-violet-400',
    hover: 'hover:border-violet-500/30',
    btn: 'bg-violet-500/15 hover:bg-violet-500/25 border-violet-500/30 text-violet-300',
    dot: 'bg-violet-400',
  },
  cyan: {
    chip: 'bg-cyan-400/10 border-cyan-400/25 text-cyan-400',
    hover: 'hover:border-cyan-400/30',
    btn: 'bg-cyan-400/10 hover:bg-cyan-400/20 border-cyan-400/30 text-cyan-300',
    dot: 'bg-cyan-400',
  },
  amber: {
    chip: 'bg-amber-400/10 border-amber-400/25 text-amber-400',
    hover: 'hover:border-amber-400/30',
    btn: 'bg-amber-400/10 hover:bg-amber-400/20 border-amber-400/30 text-amber-300',
    dot: 'bg-amber-400',
  },
  fuchsia: {
    chip: 'bg-fuchsia-500/10 border-fuchsia-500/25 text-fuchsia-400',
    hover: 'hover:border-fuchsia-500/30',
    btn: 'bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border-fuchsia-500/30 text-fuchsia-300',
    dot: 'bg-fuchsia-400',
  },
};

const RecommendationItem: React.FC<{ rec: Recommendation; index: number }> = ({
  rec,
  index,
}) => {
  const c = categoryColorMap[rec.categoryColor];
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
      whileHover={{ x: 3 }}
      className={cn(
        'group relative flex items-start gap-4 p-4 rounded-2xl',
        'bg-[rgba(255,255,255,0.02)] border border-white/[0.06]',
        'transition-all duration-200',
        c.hover,
      )}
    >
      {/* Left accent dot */}
      <div className={cn('mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 shadow-[0_0_6px_currentColor]', c.dot)} />

      <div className="flex-1 min-w-0 space-y-2">
        {/* Category chip */}
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full border text-[9px] font-mono tracking-widest uppercase',
            c.chip,
          )}
        >
          {rec.category}
        </span>
        {/* Title */}
        <h4 className="text-sm font-semibold text-white/85 font-['Hanken_Grotesk',_sans-serif] leading-snug">
          {rec.title}
        </h4>
        {/* Description */}
        <p className="text-xs text-white/40 leading-relaxed font-['Inter',_sans-serif]">
          {rec.desc}
        </p>
        {/* Footer row */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-white/30 uppercase">
            <Clock size={10} className="text-white/25" />
            {rec.time}
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-semibold',
              'font-mono tracking-widest uppercase transition-all duration-200',
              c.btn,
            )}
          >
            <Play size={9} />
            Start
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────

const AssessmentsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const gridRef = useRef<HTMLDivElement>(null);
  const isGridInView = useInView(gridRef, { once: true, margin: '-60px' });

  const filteredAssessments = assessmentCatalog.filter((a) => {
    if (activeFilter === 'All') return true;
    return TYPE_TO_FILTER[a.type] === activeFilter;
  });

  const metricCards = [
    {
      label: 'Assessments Done',
      value: assessmentStats.completed,
      color: 'cyan' as const,
      icon: <CheckCircle2 size={16} />,
      delay: 0.1,
    },
    {
      label: 'In Progress',
      value: assessmentStats.inProgress,
      color: 'violet' as const,
      icon: <Activity size={16} />,
      delay: 0.18,
    },
    {
      label: 'Total Score',
      value: assessmentStats.totalScore,
      color: 'fuchsia' as const,
      icon: <Award size={16} />,
      delay: 0.26,
    },
    {
      label: 'Day Streak',
      value: assessmentStats.streak,
      color: 'amber' as const,
      icon: <Flame size={16} />,
      delay: 0.34,
    },
  ];

  return (
    <div className="relative min-h-screen font-['Inter',_sans-serif] text-white">
      {/* ── Atmospheric Background ── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[50%] h-[40%] bg-violet-600/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[40%] h-[40%] bg-cyan-500/[0.03] blur-[100px] rounded-full" />
        {/* Extra subtle cross-accent */}
        <div className="absolute top-1/2 left-0 w-[25%] h-[30%] bg-fuchsia-600/[0.025] blur-[90px] rounded-full -translate-y-1/2" />
      </div>

      {/* ── Page Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ═══════════════════════════════════════════════════════════════════
            Section 1 — Hero Header
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className={cn(
            'relative overflow-hidden rounded-[28px] px-8 py-7',
            'bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/[0.08]',
          )}
        >
          {/* Panel inner glow */}
          <div className="absolute -top-16 -left-8 w-72 h-72 bg-violet-600/[0.05] blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 right-10 w-48 h-48 bg-cyan-400/[0.04] blur-2xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Left: Title block */}
            <div className="space-y-2">
              {/* Eyebrow */}
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.8)]"
                />
                <span className="text-[10px] font-mono tracking-widest text-violet-400/70 uppercase">
                  AI Psychometric Engine · Active
                </span>
              </div>

              {/* Main heading */}
              <h1 className="text-2xl sm:text-3xl font-bold text-white/95 font-['Hanken_Grotesk',_sans-serif] leading-tight tracking-tight">
                Assessment Hub
              </h1>

              {/* Subtitle */}
              <p className="text-[11px] font-mono tracking-widest text-cyan-400/60 uppercase">
                AI-Powered Psychometric Engine
              </p>

              {/* Description */}
              <p className="text-sm text-white/40 font-['Inter',_sans-serif] max-w-md leading-relaxed mt-1">
                Deep cognitive analysis and behavioral profiling to align your unique potential
                with the optimal engineering trajectory.
              </p>
            </div>

            {/* Right: Readiness score + ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={cn(
                'flex items-center gap-5 px-6 py-4 rounded-2xl shrink-0',
                'bg-[rgba(255,255,255,0.03)] border border-cyan-400/[0.12]',
                'shadow-[0_0_30px_rgba(34,211,238,0.07)]',
              )}
            >
              <ReadinessRing score={assessmentStats.aiReadiness} />
              <div className="space-y-1 border-l border-white/[0.07] pl-5">
                <p className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
                  AI Readiness Score
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-cyan-300 font-['Hanken_Grotesk',_sans-serif]">
                    {assessmentStats.aiReadiness}
                  </span>
                  <span className="text-xs text-white/25 font-mono">/100</span>
                </div>
                <p className="text-[10px] font-mono text-white/25">
                  Top <span className="text-violet-400">{assessmentStats.rank}</span> of cohort
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Metric Cards Row ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {metricCards.map((m) => (
            <AnimatedMetricCard
              key={m.label}
              label={m.label}
              value={m.value}
              color={m.color}
              icon={m.icon}
              delay={m.delay}
            />
          ))}
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            Section 2 — Filter Bar
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
        >
          <span className="text-[10px] font-mono tracking-widest text-white/25 uppercase shrink-0 mr-2">
            Filter:
          </span>
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <motion.button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'shrink-0 px-4 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200',
                  'font-mono tracking-widest uppercase',
                  isActive
                    ? 'bg-violet-500/20 border-violet-400/40 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.2)]'
                    : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/70 hover:border-white/[0.12]',
                )}
              >
                {filter}
              </motion.button>
            );
          })}
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            Section 3 — Assessment Cards Grid
        ═══════════════════════════════════════════════════════════════════ */}
        <div ref={gridRef} className="space-y-5">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400/60 uppercase">
              ◈ Active Assessments
            </span>
            <span className="text-[10px] font-mono text-white/25">
              {filteredAssessments.length} module{filteredAssessments.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Grid */}
          <motion.div
            initial="hidden"
            animate={isGridInView ? 'visible' : 'hidden'}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {filteredAssessments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-16 gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/20">
                  <Target size={20} />
                </div>
                <p className="text-sm text-white/30 font-mono tracking-widest uppercase">
                  No assessments in this category
                </p>
              </motion.div>
            ) : (
              filteredAssessments.map((assessment, i) => (
                <motion.div
                  key={assessment.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, delay: i * 0.08 },
                    },
                  }}
                >
                  <AssessmentCard
                    id={assessment.id}
                    title={assessment.title}
                    description={assessment.description}
                    category={assessment.category}
                    duration={assessment.duration}
                    difficulty={assessment.difficulty}
                    status={assessment.status}
                    progress={assessment.progress}
                    color={assessment.color}
                    icon={TYPE_ICON[assessment.type]}
                    onStart={() => {
                      console.log('navigate to', assessment.id);
                    }}
                  />
                </motion.div>
              ))
            )}
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            Section 4 — Bottom Two-Column
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

          {/* ── Left: AI Adaptive Recommendations (2/3 width) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.55 }}
            className={cn(
              'lg:col-span-2 relative overflow-hidden rounded-[28px] p-6',
              'bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/[0.08]',
            )}
          >
            {/* Panel ambient glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-violet-600/[0.06] blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-400/[0.03] blur-2xl rounded-full pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-400">
                <Sparkles size={14} />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">
                  AI Adaptive Recommendations
                </h2>
                <p className="text-[9px] font-mono tracking-widest text-white/25 uppercase">
                  Personalized to your cognitive profile
                </p>
              </div>
              {/* ADAPTIVE badge */}
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[9px] font-mono tracking-widest uppercase">
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1 h-1 rounded-full bg-cyan-400"
                />
                Adaptive
              </span>
            </div>

            {/* Recommendations */}
            <div className="relative z-10 space-y-3">
              {RECOMMENDATIONS.map((rec, i) => (
                <RecommendationItem key={rec.title} rec={rec} index={i} />
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="relative z-10 mt-5 pt-5 border-t border-white/[0.05] flex items-center justify-between"
            >
              <p className="text-xs text-white/25 font-mono">
                Recommendations refresh after each assessment
              </p>
              <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-violet-400/70 hover:text-violet-400 uppercase transition-colors"
              >
                View All
                <ChevronRight size={12} />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* ── Right: AI Insight Panel (1/3 width) ── */}
          <div className="lg:col-span-1">
            <AIInsightPanel compact={true} title="Your AI Profile" />
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-6" />
      </div>
    </div>
  );
};

export default AssessmentsPage;
