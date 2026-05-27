import { motion } from "framer-motion";

export const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 0.18, 0.36].map((delay, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -4, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.2,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-[5px] h-[5px] rounded-full bg-violet-400"
          style={{ boxShadow: "0 0 6px rgba(192,193,255,0.7)" }}
        />
      ))}
    </div>
  );
};
