import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssistantOrbProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  pulse?: boolean;
}

const sizeMap = {
  sm: { outer: "w-8 h-8", icon: 14 },
  md: { outer: "w-10 h-10", icon: 18 },
  lg: { outer: "w-14 h-14", icon: 22 },
};

export const AssistantOrb = ({
  size = "md",
  className,
  pulse = true,
}: AssistantOrbProps) => {
  const { outer, icon } = sizeMap[size];

  return (
    <div className={cn("relative flex-shrink-0", outer, className)}>
      {/* Outer glow ring */}
      {pulse && (
        <motion.div
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, #c0c1ff, #ddb7ff, #4cd7f6, #c0c1ff)",
            filter: "blur(6px)",
          }}
        />
      )}

      {/* Core orb */}
      <div
        className={cn(
          "relative z-10 rounded-full flex items-center justify-center w-full h-full",
          "bg-[#171f33] border border-white/10",
          "shadow-[inset_0_0_20px_rgba(192,193,255,0.08)]"
        )}
      >
        {/* Inner gradient shimmer */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-500/10" />

        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 60%, rgba(192,193,255,0.15) 100%)",
          }}
        />

        <Sparkles
          size={icon}
          className="relative z-10 text-violet-300"
          style={{ filter: "drop-shadow(0 0 6px rgba(192,193,255,0.8))" }}
        />
      </div>
    </div>
  );
};
