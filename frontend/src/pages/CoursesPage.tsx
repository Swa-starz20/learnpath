import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, BookOpen, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

// Data
import { ENGINEERING_DOMAINS, DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';
import type { DomainId } from '@/data/engineeringDomains';
import { COURSE_CATALOG } from '@/data/courseCatalog';
import { getFeaturedCourse } from '@/data/engineeringCourses';

// Components
import { DomainSelector } from '@/components/roadmap/DomainSelector';
import { LearningModuleCard } from '@/components/courses/LearningModuleCard';


// Filter tabs
const FILTER_TABS = ['All', 'In Progress', 'Roadmap Synced', 'Expert'];

const CoursesPage = () => {
  const navigate = useNavigate();
  const [domainId, setDomainId] = useState<DomainId>('computer');
  const [domainDropOpen, setDomainDropOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const domain = ENGINEERING_DOMAINS.find(d => d.id === domainId)!;
  const accent = DOMAIN_ACCENT_CLASSES[domain.color];

  // Featured course (full data)
  const featuredCourse = getFeaturedCourse(domainId);

  // Filter catalog for domain
  const domainCatalog = useMemo(() => {
    let items = COURSE_CATALOG.filter(c => c.domainId === domainId);
    if (activeFilter === 'Roadmap Synced') items = items.filter(c => c.roadmapSync);
    if (activeFilter === 'Expert') items = items.filter(c => c.difficulty === 'Expert');
    return items;
  }, [domainId, activeFilter]);



  return (
    <div className="relative min-h-full">
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[55%] h-[40%] bg-violet-600/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/3 w-[40%] h-[35%] bg-cyan-500/[0.03] blur-[100px] rounded-full" />
      </div>

      <div className="space-y-5">
        {/* ── Toolbar ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 flex-wrap"
        >
          <DomainSelector
            selectedDomain={domainId}
            onSelect={(id) => { setDomainId(id); setActiveFilter('All'); }}
            isOpen={domainDropOpen}
            onToggle={() => setDomainDropOpen(p => !p)}
          />

          <div className="w-px h-8 bg-white/[0.08] hidden sm:block" />

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-[11px] font-mono border transition-all duration-150',
                  activeFilter === tab
                    ? cn(accent.bg, accent.border, accent.text)
                    : 'bg-white/[0.02] border-white/[0.07] text-white/40 hover:text-white/70 hover:border-white/[0.12]'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className={cn(
              'hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-mono',
              'bg-[rgba(255,255,255,0.03)] border border-white/[0.07] text-white/30'
            )}>
              <Filter size={9} />
              {domainCatalog.length} courses
            </span>
          </div>
        </motion.div>

        {/* ── Page header ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={cn('w-1.5 h-1.5 rounded-full', accent.text)}
              style={{ backgroundColor: 'currentColor', boxShadow: '0 0 6px currentColor' }}
            />
            <span className={cn('text-[10px] font-mono tracking-widest uppercase', accent.text)}>
              AI-Curated · {domain.label}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white/95 font-['Hanken_Grotesk',_sans-serif]">
            Courses for Your Path
          </h1>
          <p className="text-sm text-white/40 font-['Inter',_sans-serif] mt-1">
            AI-selected based on your assessment profile, roadmap stage, and learning velocity.
          </p>
        </motion.div>

        {/* ── Featured course ───────────────────────────────────────────── */}
        {featuredCourse && (
          <AnimatePresence mode="wait">
            <motion.div
              key={featuredCourse.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => navigate(`/courses/${featuredCourse.id}`)}
              className={cn(
                'relative rounded-[28px] p-6 overflow-hidden border cursor-pointer group transition-all duration-300',
                'bg-[rgba(255,255,255,0.02)] backdrop-blur-xl',
                accent.border, accent.glow,
                'hover:brightness-105'
              )}
            >
              {/* Orbs */}
              <div className={cn('absolute -top-16 -left-16 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-20', accent.bg)} />
              <div className="absolute -bottom-10 right-1/4 w-40 h-40 bg-cyan-400/[0.04] rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1">
                  {/* Featured badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono border',
                      accent.bg, accent.border, accent.text
                    )}>
                      <Sparkles size={8} />
                      {featuredCourse.matchScore}% AI MATCH · CONTINUE LEARNING
                    </span>
                    {featuredCourse.roadmapSync && (
                      <span className="text-[9px] font-mono text-violet-400/70 border border-violet-500/20 px-2 py-0.5 rounded-full bg-violet-500/5">
                        ◈ Roadmap Synced
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-white/95 font-['Hanken_Grotesk',_sans-serif] mb-1 group-hover:text-white transition-colors">
                    {featuredCourse.title}
                  </h2>
                  <p className={cn('text-sm font-mono mb-2', accent.text)}>{featuredCourse.subtitle}</p>
                  <p className="text-sm text-white/40 font-['Inter',_sans-serif] leading-relaxed max-w-xl">
                    {featuredCourse.description}
                  </p>

                  {/* Skill chips */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {featuredCourse.skills.slice(0, 5).map(s => (
                      <span key={s} className={cn('px-2 py-0.5 rounded text-[9px] font-mono border', accent.bg, accent.border, accent.text)}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats column */}
                <div className="grid grid-cols-2 gap-2.5 lg:w-48 shrink-0">
                  {[
                    { label: 'Difficulty', value: featuredCourse.difficulty, icon: TrendingUp },
                    { label: 'Duration', value: `${featuredCourse.totalHours}h`, icon: BookOpen },
                    { label: 'Modules', value: `${featuredCourse.modules.length}`, icon: BookOpen },
                    { label: 'Total XP', value: featuredCourse.totalXP.toLocaleString(), icon: Sparkles },
                  ].map((st) => {
                    const Icon = st.icon;
                    return (
                      <div key={st.label} className="p-3 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-white/[0.07]">
                        <div className="flex items-center gap-1 mb-1">
                          <Icon size={9} className={accent.text} />
                          <span className="text-[8px] font-mono text-white/25 uppercase">{st.label}</span>
                        </div>
                        <p className={cn('text-sm font-bold font-[\'Hanken_Grotesk\',_sans-serif]', accent.text)}>{st.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Catalog grid ─────────────────────────────────────────────── */}
        <div>
          <p className={cn('text-[9px] font-mono tracking-widest uppercase mb-3', 'text-white/25')}>
            {activeFilter === 'All' ? 'All Courses' : activeFilter} · {domainCatalog.length} available
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${domainId}-${activeFilter}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              {domainCatalog.length === 0 ? (
                <div className="col-span-3 text-center py-12">
                  <p className="text-white/30 font-mono text-sm">No courses match this filter</p>
                </div>
              ) : (
                domainCatalog.map((entry, i) => (
                  <LearningModuleCard
                    key={entry.id}
                    entry={entry}
                    index={i}
                    isActive={i === 0}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
