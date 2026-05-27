import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const skillData = [
  { subject: "Core Eng", A: 88, fullMark: 100 },
  { subject: "Coding", A: 75, fullMark: 100 },
  { subject: "Aptitude", A: 52, fullMark: 100 },
  { subject: "Comm.", A: 70, fullMark: 100 },
  { subject: "Sys Design", A: 63, fullMark: 100 },
];

interface TooltipPayloadItem {
  value: number;
  payload: { subject: string };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-slate-900/90 border border-cyan-400/20 rounded-xl px-3 py-2 backdrop-blur-lg text-xs">
        <p className="text-white/60">{item.payload.subject}</p>
        <p className="text-cyan-400 font-bold text-base">{item.value}%</p>
      </div>
    );
  }
  return null;
};

export const SkillProficiencyPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative overflow-hidden rounded-[28px] p-6 flex flex-col h-full
        bg-[rgba(255,255,255,0.02)] backdrop-blur-xl
        border border-white/[0.07]"
    >
      {/* Corner glow */}
      <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-violet-500/8 blur-3xl" />

      <div className="relative z-10 flex flex-col h-full">
        <h3 className="text-lg font-bold text-white/90 font-['Hanken_Grotesk',_sans-serif] mb-6">
          Skill Proficiency
        </h3>

        {/* Radar Chart */}
        <div className="flex-1 flex items-center justify-center min-h-[220px]">
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="75%"
              data={skillData}
            >
              <PolarGrid
                gridType="polygon"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
              <PolarAngleAxis
                dataKey="subject"
                tick={{
                  fill: "rgba(76,215,246,0.8)",
                  fontSize: 9,
                  fontFamily: "JetBrains Mono, monospace",
                  letterSpacing: "0.08em",
                  fontWeight: 500,
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Radar
                name="Skills"
                dataKey="A"
                stroke="#4cd7f6"
                strokeWidth={2}
                fill="rgba(76,215,246,0.12)"
                dot={{ r: 3, fill: "#4cd7f6", strokeWidth: 0 }}
                style={{ filter: "drop-shadow(0 0 6px rgba(76,215,246,0.4))" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Strength/Weakness Cards */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/[0.06]">
            <p className="text-[10px] text-white/35 tracking-wider mb-1 font-mono uppercase">
              Top Strength
            </p>
            <p className="font-bold text-cyan-400 text-sm font-['Hanken_Grotesk',_sans-serif]">
              Core Eng
            </p>
          </div>
          <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/[0.06]">
            <p className="text-[10px] text-white/35 tracking-wider mb-1 font-mono uppercase">
              To Improve
            </p>
            <p className="font-bold text-violet-400 text-sm font-['Hanken_Grotesk',_sans-serif]">
              Aptitude
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
