import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ENGINEERING_DOMAINS, DOMAIN_ACCENT_CLASSES } from '@/data/engineeringDomains';
import type { DomainId } from '@/data/engineeringDomains';

interface DomainSelectorProps {
  selectedDomain: DomainId;
  onSelect: (id: DomainId) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const DomainSelector = ({
  selectedDomain,
  onSelect,
  isOpen,
  onToggle,
}: DomainSelectorProps) => {
  const selected = ENGINEERING_DOMAINS.find((d) => d.id === selectedDomain)!;
  const accent = DOMAIN_ACCENT_CLASSES[selected.color];

  return (
    <div className="relative">
      {/* Trigger */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        className={cn(
          'flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200',
          'bg-[rgba(255,255,255,0.04)] backdrop-blur-sm border',
          isOpen ? cn(accent.border) : 'border-white/[0.09]',
          'hover:border-white/[0.15]'
        )}
      >
        <span className={cn('text-base leading-none', accent.text)}>{selected.icon}</span>
        <div className="text-left">
          <p className="text-[10px] font-mono tracking-widest text-white/30 uppercase">Domain</p>
          <p className="text-sm font-semibold text-white/90 font-['Hanken_Grotesk',_sans-serif] leading-none mt-0.5">
            {selected.shortLabel}
          </p>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} className="text-white/30" />
        </motion.div>
      </motion.button>

      {/* Dropdown panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'absolute top-full left-0 mt-2 z-50 w-72',
            'bg-[#111827] backdrop-blur-2xl border border-white/[0.1] rounded-2xl p-2',
            'shadow-[0_24px_60px_rgba(0,0,0,0.6)]'
          )}
        >
          <p className="px-3 py-1.5 text-[9px] font-mono tracking-widest text-white/25 uppercase">
            Select Engineering Domain
          </p>
          <div className="grid grid-cols-2 gap-1 max-h-72 overflow-y-auto scrollbar-none">
            {ENGINEERING_DOMAINS.map((domain) => {
              const a = DOMAIN_ACCENT_CLASSES[domain.color];
              const isSelected = domain.id === selectedDomain;
              return (
                <button
                  key={domain.id}
                  onClick={() => { onSelect(domain.id); onToggle(); }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all duration-150',
                    isSelected
                      ? cn(a.bg, a.border, 'border')
                      : 'hover:bg-white/[0.04] border border-transparent'
                  )}
                >
                  <span className={cn('text-sm', a.text)}>{domain.icon}</span>
                  <div className="min-w-0">
                    <p className={cn(
                      'text-[11px] font-semibold truncate font-[\'Hanken_Grotesk\',_sans-serif]',
                      isSelected ? a.text : 'text-white/70'
                    )}>
                      {domain.shortLabel}
                    </p>
                    <p className="text-[9px] font-mono text-white/25 truncate">{domain.marketDemand}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};
