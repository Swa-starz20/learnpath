import { useState, useRef, useCallback, useEffect } from "react";
import { AssistantOrb } from "./AssistantOrb";
import { motion, AnimatePresence } from "framer-motion";

import ChatMessage from "./ChatMessage";
import type { ChatMessageData } from "./ChatMessage";

import { SuggestionChips } from "./SuggestionChips";
import { MentorInput } from "./MentorInput";

const INITIAL_MESSAGES: ChatMessageData[] = [
  {
    id: "ai-welcome",
    role: "ai",
    content:
      "Hello Alex! I've been monitoring your progress on the **Cloud Infrastructure** roadmap. You've completed 85% of the Docker module.\n\nHow can I assist you today? We could review your resume for the upcoming internships or dive into the next chapter of **Kubernetes orchestration**.",
    timestamp: "10:41 PM",
  },
  {
    id: "user-1",
    role: "user",
    content:
      "Can you explain the main difference between Docker Swarm and Kubernetes in simple terms?",
    timestamp: "10:43 PM",
  },
  {
    id: "ai-1",
    role: "ai",
    content:
      "Great question! Think of it this way:\n\n**Docker Swarm** is simpler, native to Docker, and great for smaller deployments. It's like a street-smart coordinator — quick to set up, but less powerful at scale.\n\n**Kubernetes** is a full container orchestration platform — more complex, but highly resilient, with advanced scheduling, auto-scaling, and a massive ecosystem. It's the industry standard for production workloads.\n\nFor your current roadmap, mastering **K8s** will give you a significant edge in system design interviews at top-tier companies.",
    timestamp: "10:43 PM",
  },
];

const TYPING_RESPONSES: Record<string, string> = {
  default:
    "That's a great question! Let me analyze your current skill profile and roadmap context to give you the most relevant guidance...\n\nBased on your progress, I'd recommend focusing on **practical projects** alongside theoretical concepts. This will solidify your understanding and give you concrete examples for interviews.",
  "Explain System Design":
    "System Design is about designing large-scale distributed systems. Key pillars include: **scalability, reliability, availability, and consistency**.\n\nFor your stage, I recommend starting with: Load Balancers → Caching (Redis) → Message Queues → Database Sharding. Want me to walk through any of these in depth?",
  "Review my Resume":
    "I'll need you to paste your resume content, but here are key things I typically look for:\n\n**Impact metrics** — quantify every achievement. **Project descriptions** — emphasize scale, tech stack, and your role. **Skills section** — align with the JD keywords of your target companies like Google, Stripe, or Zepto.",
  "Debug Python Script":
    "Share your Python script and the error you're getting! Common issues I help debug: **async/await mismatches**, **scope issues with closures**, **type errors with dynamic typing**, and **performance bottlenecks** in loops or data processing.",
  "Suggest next roadmap step":
    "Based on your 85% Docker completion and current System Design focus, your **ideal next step** is: Container Orchestration → Kubernetes Core → Helm Charts → CI/CD with GitHub Actions.\n\nThis sequence will prepare you for **SRE and DevOps-facing** engineering roles at top companies.",
};

export const MentorChatArea = () => {
  const [messages, setMessages] = useState<ChatMessageData[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const simulateAIResponse = useCallback((userMessage: string) => {
    setIsTyping(true);
    setShowSuggestions(false);

    const typingMsg: ChatMessageData = {
      id: "typing",
      role: "ai",
      content: "",
      timestamp: "",
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMsg]);

    const delay = 1400 + Math.random() * 800;
    setTimeout(() => {
      const responseText =
        TYPING_RESPONSES[userMessage] || TYPING_RESPONSES["default"];

      const aiResponse: ChatMessageData = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "typing"),
        aiResponse,
      ]);
      setIsTyping(false);
    }, delay);
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      const userMsg: ChatMessageData = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, userMsg]);
      simulateAIResponse(text);
    },
    [simulateAIResponse]
  );

  const handleSuggestionSelect = useCallback(
    (label: string) => {
      handleSend(label);
    },
    [handleSend]
  );

  return (
    <div className="flex flex-col h-full relative">
      {/* Atmospheric glow blob */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40%] h-[40%] bg-violet-600/[0.04] blur-[80px] rounded-full pointer-events-none" />

      {/* Chat header bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05] bg-[rgba(255,255,255,0.01)] backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <AssistantOrb size="sm" pulse />
          <div>
            <h2 className="text-sm font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif]">
              AI Mentor
            </h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(76,215,246,0.7)]" />
              <span className="text-[10px] text-cyan-400/70 font-mono tracking-widest">
                ACTIVE · Context Synced
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-white/20 hidden sm:block tracking-wider">
            Resume Prep Session
          </span>
          <div className="px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[9px] font-mono text-violet-400/70 tracking-widest">
            GPT-4o
          </div>
        </div>
      </div>

      {/* Messages scroll area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              index={i}
              userInitials="AR"
            />
          ))}
        </AnimatePresence>

        {/* Suggestion chips — shown after welcome */}
        <AnimatePresence>
          {showSuggestions && messages.length <= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="pl-11"
            >
              <SuggestionChips onSelect={handleSuggestionSelect} />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input area — sticky at bottom */}
      <div className="flex-shrink-0 px-4 md:px-6 pb-4 pt-3 bg-gradient-to-t from-[#0b1326] via-[#0b1326]/95 to-transparent">
        <div className="max-w-3xl mx-auto">
          <MentorInput onSend={handleSend} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
};
