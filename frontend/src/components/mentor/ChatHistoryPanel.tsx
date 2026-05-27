import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatSession {
  id: string;
  title: string;
  category: "career" | "learning" | "coding" | "system";
  updatedAt: string;
  isActive?: boolean;
}

const categoryConfig = {
  career: { label: "Career Prep", color: "text-violet-400/60" },
  learning: { label: "Learning", color: "text-cyan-400/60" },
  coding: { label: "Coding", color: "text-fuchsia-400/60" },
  system: { label: "System Design", color: "text-amber-400/60" },
};

const sessions: ChatSession[] = [
  { id: "1", title: "Resume Prep", category: "career", updatedAt: "2h ago", isActive: true },
  { id: "2", title: "Mock Interview: Frontend", category: "career", updatedAt: "Yesterday" },
  { id: "3", title: "Kubernetes Guidance", category: "coding", updatedAt: "2d ago" },
  { id: "4", title: "System Design Review", category: "system", updatedAt: "3d ago" },
  { id: "5", title: "Math Help: Calculus II", category: "learning", updatedAt: "3d ago" },
  { id: "6", title: "Roadmap Review", category: "learning", updatedAt: "5d ago" },
  { id: "7", title: "Python Debugging", category: "coding", updatedAt: "1w ago" },
  { id: "8", title: "DSA Preparation", category: "coding", updatedAt: "1w ago" },
  { id: "9", title: "Career Roadmap Review", category: "career", updatedAt: "2w ago" },
];

// Group sessions by category
const groupByCategory = (items: ChatSession[]) => {
  const grouped: Record<string, ChatSession[]> = {};
  for (const item of items) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }
  return grouped;
};

interface ChatSessionItemProps {
  session: ChatSession;
  onSelect: (id: string) => void;
  delay?: number;
}

export const ChatSessionItem = ({ session, onSelect, delay = 0 }: ChatSessionItemProps) => (
  <motion.div
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay, ease: "easeOut" }}
    whileHover={{ x: 2 }}
    onClick={() => onSelect(session.id)}
    className={cn(
      "group relative px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200",
      session.isActive
        ? "bg-violet-500/[0.12] border border-violet-500/25 shadow-[0_0_12px_rgba(192,193,255,0.06)]"
        : "hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06]"
    )}
  >
    {/* Active left accent bar */}
    {session.isActive && (
      <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(192,193,255,0.8)]" />
    )}

    <p
      className={cn(
        "text-[13px] truncate transition-colors font-['Inter',_sans-serif]",
        session.isActive
          ? "text-white/90 font-medium"
          : "text-white/45 group-hover:text-white/70"
      )}
    >
      {session.title}
    </p>
    <p className="text-[10px] text-white/20 mt-0.5 font-mono">
      {session.updatedAt}
    </p>
  </motion.div>
);

interface ChatHistoryPanelProps {
  activeSessionId?: string;
  onSessionSelect: (id: string) => void;
  onNewSession: () => void;
}

export const ChatHistoryPanel = ({
  activeSessionId = "1",
  onSessionSelect,
  onNewSession,
}: ChatHistoryPanelProps) => {
  const grouped = groupByCategory(sessions);
  const orderedCategories: Array<ChatSession["category"]> = [
    "career",
    "coding",
    "learning",
    "system",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col h-full bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border-r border-white/[0.07]"
    >
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-white/[0.05]">
        <h3 className="text-base font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] mb-4">
          Chat History
        </h3>

        {/* New Session */}
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewSession}
          className="w-full py-2.5 px-4 rounded-xl
            border border-dashed border-violet-500/30
            text-violet-400 text-[12px] font-mono tracking-wide
            hover:bg-violet-500/[0.07] hover:border-violet-400/50
            flex items-center justify-center gap-2 transition-all duration-200
            shadow-[0_0_0_0_rgba(192,193,255,0)] hover:shadow-[0_0_16px_rgba(192,193,255,0.08)]"
        >
          <Plus size={13} />
          New Session
        </motion.button>

        {/* Search */}
        <div className="relative mt-3">
          <Search
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
          />
          <input
            type="text"
            placeholder="Search sessions..."
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg
              pl-8 pr-3 py-2 text-[12px] text-white/50 placeholder:text-white/20
              focus:outline-none focus:border-violet-400/30 transition-colors font-mono"
          />
        </div>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {orderedCategories.map((cat) => {
          const catSessions = grouped[cat];
          if (!catSessions?.length) return null;
          const config = categoryConfig[cat];

          return (
            <div key={cat}>
              <span
                className={cn(
                  "text-[10px] font-mono tracking-[0.15em] uppercase block mb-2 px-2",
                  config.color
                )}
              >
                {config.label}
              </span>
              <div className="space-y-0.5">
                {catSessions.map((session, i) => (
                  <ChatSessionItem
                    key={session.id}
                    session={{ ...session, isActive: session.id === activeSessionId }}
                    onSelect={onSessionSelect}
                    delay={i * 0.04}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
