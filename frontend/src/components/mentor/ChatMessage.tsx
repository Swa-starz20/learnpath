import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AssistantOrb } from "./AssistantOrb";
import { TypingIndicator } from "./TypingIndicator";

export type MessageRole = "ai" | "user";

export interface ChatMessageData {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isTyping?: boolean;
  highlights?: { text: string; replacement: string }[];
}

interface ChatMessageProps {
  message: ChatMessageData;
  index: number;
  userInitials?: string;
}

// Render message content with bold highlights
const renderContent = (content: string) => {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white/90">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={i}>{part}</span>;
  });
};

const ChatMessage = ({
  message,
  index,
  userInitials = "AR",
}: ChatMessageProps) => {
  const isAI = message.role === "ai";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{
          duration: 0.4,
          delay: index * 0.06,
          ease: "easeOut",
        }}
        className={cn(
          "flex max-w-[85%] gap-3",
          isAI ? "flex-row" : "ml-auto flex-row-reverse"
        )}
      >
        {/* Avatar */}
        {isAI ? (
          <AssistantOrb size="sm" pulse={false} />
        ) : (
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-violet-600 to-indigo-700 shadow-[0_0_12px_rgba(192,193,255,0.2)]">
            <span className="font-mono text-[10px] font-bold tracking-wider text-white">
              {userInitials}
            </span>
          </div>
        )}

        {/* Bubble */}
        <div
          className={cn(
            "relative rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isAI
              ? cn(
                  "rounded-tl-sm",
                  "border border-white/[0.08]",
                  "bg-[rgba(255,255,255,0.04)] backdrop-blur-sm",
                  message.isTyping && "border-violet-500/20"
                )
              : cn(
                  "rounded-tr-sm",
                  "border border-violet-500/25 bg-violet-900/30",
                  "shadow-[0_0_20px_rgba(192,193,255,0.06)]"
                )
          )}
        >
          {/* AI Glow Layer */}
          {isAI && (
            <div className="pointer-events-none absolute inset-0 rounded-2xl rounded-tl-sm bg-gradient-to-br from-violet-500/[0.04] to-transparent" />
          )}

          {message.isTyping ? (
            <TypingIndicator />
          ) : (
            <p className="relative z-10 font-['Inter',_sans-serif] text-white/75">
              {renderContent(message.content)}
            </p>
          )}

          {/* Timestamp */}
          {!message.isTyping && (
            <span
              className={cn(
                "mt-2 block font-mono text-[9px] tracking-wider",
                isAI
                  ? "text-white/20"
                  : "text-right text-violet-300/30"
              )}
            >
              {message.timestamp}
            </span>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatMessage;