import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen, SidebarClose, SidebarOpen } from "lucide-react";
import { ChatHistoryPanel } from "@/components/mentor/ChatHistoryPanel";
import { MentorChatArea } from "@/components/mentor/MentorChatArea";
import { AIContextPanel } from "@/components/mentor/AIContextPanel";
import { cn } from "@/lib/utils";

const MentorPage = () => {
  const [activeSession, setActiveSession] = useState("1");
  const [historyOpen, setHistoryOpen] = useState(true);
  const [contextOpen, setContextOpen] = useState(true);

  const handleNewSession = () => {
    setActiveSession(`new-${Date.now()}`);
  };

  return (
    <div className="relative flex h-full overflow-hidden">
      {/* ── Atmospheric background ── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-[30%] w-[45%] h-[45%] bg-violet-600/[0.05] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-[20%] w-[35%] h-[40%] bg-cyan-500/[0.04] blur-[100px] rounded-full" />
        <div className="absolute top-[40%] left-[40%] w-[25%] h-[25%] bg-indigo-600/[0.03] blur-[80px] rounded-full" />
      </div>

      {/* ── LEFT: Chat History Panel ─────────────────── */}
      <AnimatePresence initial={false}>
        {historyOpen && (
          <motion.div
            key="history-panel"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-shrink-0 overflow-hidden"
            style={{ minWidth: 0 }}
          >
            <div className="w-64 h-full">
              <ChatHistoryPanel
                activeSessionId={activeSession}
                onSessionSelect={setActiveSession}
                onNewSession={handleNewSession}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CENTER: Main Chat Area ───────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Toggle buttons overlay */}
        <div className="absolute top-3 left-3 z-20 flex gap-1.5">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setHistoryOpen((o) => !o)}
            title={historyOpen ? "Collapse history" : "Expand history"}
            className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
              "bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08]",
              "text-white/30 hover:text-white/60"
            )}
          >
            {historyOpen ? <PanelLeftClose size={13} /> : <PanelLeftOpen size={13} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setContextOpen((o) => !o)}
            title={contextOpen ? "Collapse context" : "Expand context"}
            className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
              "bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08]",
              "text-white/30 hover:text-white/60",
              "xl:hidden"
            )}
          >
            {contextOpen ? <SidebarClose size={13} /> : <SidebarOpen size={13} />}
          </motion.button>
        </div>

        <MentorChatArea />
      </div>

      {/* ── RIGHT: AI Context Panel ──────────────────── */}
      <AnimatePresence initial={false}>
        {contextOpen && (
          <motion.div
            key="context-panel"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-shrink-0 overflow-hidden hidden xl:block"
            style={{ minWidth: 0 }}
          >
            <div className="w-[280px] h-full">
              <AIContextPanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MentorPage;
