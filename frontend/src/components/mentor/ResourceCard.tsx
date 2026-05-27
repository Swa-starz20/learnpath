import { motion } from "framer-motion";
import { FileText, Video, Code2, Bookmark, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type ResourceType = "article" | "video" | "exercise" | "bookmark";

interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  source?: string;
}

const typeMap: Record<ResourceType, { icon: React.ReactNode; color: string }> = {
  article: { icon: <FileText size={12} />, color: "text-cyan-400" },
  video: { icon: <Video size={12} />, color: "text-violet-400" },
  exercise: { icon: <Code2 size={12} />, color: "text-fuchsia-400" },
  bookmark: { icon: <Bookmark size={12} />, color: "text-amber-400" },
};

interface ResourceCardProps {
  resource: Resource;
  delay?: number;
}

export const ResourceCard = ({ resource, delay = 0 }: ResourceCardProps) => {
  const { icon, color } = typeMap[resource.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ x: 2 }}
      className="group flex items-center gap-2.5 py-2 px-2 rounded-lg cursor-pointer
        hover:bg-white/[0.04] transition-all duration-150"
    >
      <div className={cn("flex-shrink-0", color)}>{icon}</div>
      <span className="text-[12px] text-white/45 group-hover:text-white/70 transition-colors truncate flex-1 font-['Inter',_sans-serif]">
        {resource.title}
      </span>
      <ExternalLink
        size={10}
        className="flex-shrink-0 text-white/15 group-hover:text-white/35 opacity-0 group-hover:opacity-100 transition-all"
      />
    </motion.div>
  );
};

// Exported resources data for use in context panel
export const quickResources: Resource[] = [
  { id: "1", type: "article", title: "Swarm vs K8s Docs", source: "Kubernetes.io" },
  { id: "2", type: "video", title: "Video: Pod Lifecycle", source: "YouTube" },
  { id: "3", type: "exercise", title: "K8s Hands-on Lab", source: "KillerCoda" },
  { id: "4", type: "bookmark", title: "Resume Template — SWE", source: "overleaf.com" },
  { id: "5", type: "article", title: "System Design Primer", source: "GitHub" },
];
