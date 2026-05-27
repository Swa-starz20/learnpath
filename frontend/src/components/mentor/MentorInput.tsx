import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { Paperclip, Mic, Send, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface MentorInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const MentorInput = ({ onSend, disabled }: MentorInputProps) => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-resize
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="space-y-3">
      {/* Input container */}
      <motion.div
        animate={{
          borderColor: focused
            ? "rgba(192,193,255,0.3)"
            : "rgba(255,255,255,0.08)",
          boxShadow: focused
            ? "0 0 0 1px rgba(192,193,255,0.15), 0 0 30px rgba(192,193,255,0.08)"
            : "none",
        }}
        transition={{ duration: 0.25 }}
        className={cn(
          "relative rounded-2xl overflow-hidden",
          "bg-[rgba(255,255,255,0.03)] backdrop-blur-xl",
          "border border-white/[0.08]"
        )}
      >
        {/* Focus glow line */}
        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent origin-center"
            />
          )}
        </AnimatePresence>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask your AI mentor anything about learning, coding, interviews, or career growth..."
          disabled={disabled}
          rows={1}
          className={cn(
            "w-full resize-none bg-transparent px-4 pt-3.5 pb-2",
            "text-sm text-white/80 placeholder:text-white/20",
            "focus:outline-none font-['Inter',_sans-serif]",
            "min-h-[52px] max-h-[160px]",
            "scrollbar-thin scrollbar-thumb-white/10"
          )}
          style={{ lineHeight: "1.6" }}
        />

        {/* Action row */}
        <div className="flex items-center justify-between px-3 pb-2.5">
          <div className="flex items-center gap-1">
            {/* Attach */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/25 hover:text-white/50 hover:bg-white/5 transition-all"
            >
              <Paperclip size={14} />
            </motion.button>

            {/* Voice */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsRecording((r) => !r)}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                isRecording
                  ? "text-red-400 bg-red-400/10 animate-pulse"
                  : "text-white/25 hover:text-white/50 hover:bg-white/5"
              )}
            >
              <Mic size={14} />
            </motion.button>

            {/* Keyboard hint */}
            <span className="hidden sm:flex items-center gap-1 ml-2 text-[9px] text-white/15 font-mono">
              <Keyboard size={9} />
              ↵ Send · Shift+↵ Newline
            </span>
          </div>

          {/* Send button */}
          <motion.button
            onClick={handleSubmit}
            disabled={!canSend}
            whileHover={canSend ? { scale: 1.06 } : {}}
            whileTap={canSend ? { scale: 0.94 } : {}}
            animate={{
              backgroundColor: canSend
                ? "rgba(128,131,255,1)"
                : "rgba(255,255,255,0.05)",
              boxShadow: canSend
                ? "0 0 20px rgba(192,193,255,0.4)"
                : "none",
            }}
            transition={{ duration: 0.2 }}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
              canSend ? "text-white cursor-pointer" : "text-white/20 cursor-not-allowed"
            )}
          >
            <Send size={14} />
          </motion.button>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <p className="text-center text-[10px] text-white/15 font-mono tracking-wide">
        LearnPath AI can make mistakes. Verify important information.
      </p>
    </div>
  );
};
