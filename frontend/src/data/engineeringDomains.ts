export type DomainId =
  | 'computer'
  | 'mechanical'
  | 'civil'
  | 'electrical'
  | 'electronics'
  | 'aiml'
  | 'robotics'
  | 'chemical'
  | 'aerospace'
  | 'biomedical'
  | 'automobile'
  | 'mechatronics';

export type AccentColor = 'violet' | 'cyan' | 'fuchsia' | 'amber' | 'emerald' | 'rose' | 'indigo' | 'sky';

export interface EngineeringDomain {
  id: DomainId;
  label: string;
  shortLabel: string;
  icon: string;          // emoji icon
  color: AccentColor;
  description: string;
  marketDemand: 'High' | 'Very High' | 'Exceptional';
  avgSalary: string;
  jobRoles: string[];
}

export const ENGINEERING_DOMAINS: EngineeringDomain[] = [
  {
    id: 'computer',
    label: 'Computer Engineering',
    shortLabel: 'CS/CE',
    icon: '⬡',
    color: 'violet',
    description: 'Software systems, distributed computing, and cloud-native architecture.',
    marketDemand: 'Exceptional',
    avgSalary: '₹18–45 LPA',
    jobRoles: ['SWE', 'Cloud Architect', 'SRE', 'DevOps', 'Data Engineer'],
  },
  {
    id: 'aiml',
    label: 'AI / ML Engineering',
    shortLabel: 'AI/ML',
    icon: '◈',
    color: 'fuchsia',
    description: 'Neural networks, LLMs, MLOps, and high-performance inference pipelines.',
    marketDemand: 'Exceptional',
    avgSalary: '₹20–60 LPA',
    jobRoles: ['ML Engineer', 'AI Researcher', 'MLOps', 'Data Scientist', 'NLP Engineer'],
  },
  {
    id: 'robotics',
    label: 'Robotics Engineering',
    shortLabel: 'Robotics',
    icon: '◉',
    color: 'cyan',
    description: 'Embedded systems, ROS2, sensor fusion, and autonomous navigation.',
    marketDemand: 'Very High',
    avgSalary: '₹12–30 LPA',
    jobRoles: ['Robotics Engineer', 'Perception Engineer', 'Controls Engineer', 'Embedded Dev'],
  },
  {
    id: 'mechatronics',
    label: 'Mechatronics',
    shortLabel: 'Mechatronics',
    icon: '◧',
    color: 'sky',
    description: 'Integration of mechanical, electrical, and software systems.',
    marketDemand: 'High',
    avgSalary: '₹8–22 LPA',
    jobRoles: ['Mechatronics Engineer', 'Automation Engineer', 'PLC Developer'],
  },
  {
    id: 'electrical',
    label: 'Electrical Engineering',
    shortLabel: 'EE',
    icon: '⬢',
    color: 'amber',
    description: 'Power systems, high-voltage design, and smart grid infrastructure.',
    marketDemand: 'High',
    avgSalary: '₹6–18 LPA',
    jobRoles: ['Power Engineer', 'Grid Engineer', 'SCADA Engineer', 'HV Designer'],
  },
  {
    id: 'electronics',
    label: 'Electronics Engineering',
    shortLabel: 'ECE',
    icon: '◆',
    color: 'indigo',
    description: 'VLSI, PCB design, signal processing, and embedded hardware.',
    marketDemand: 'Very High',
    avgSalary: '₹8–25 LPA',
    jobRoles: ['VLSI Engineer', 'PCB Designer', 'Embedded Engineer', 'RF Engineer'],
  },
  {
    id: 'mechanical',
    label: 'Mechanical Engineering',
    shortLabel: 'ME',
    icon: '⬟',
    color: 'emerald',
    description: 'CAD/CAE, thermodynamics, manufacturing, and product design.',
    marketDemand: 'High',
    avgSalary: '₹5–16 LPA',
    jobRoles: ['Design Engineer', 'FEA Engineer', 'Manufacturing', 'Product Designer'],
  },
  {
    id: 'civil',
    label: 'Civil Engineering',
    shortLabel: 'Civil',
    icon: '▲',
    color: 'emerald',
    description: 'Structural analysis, urban planning, and infrastructure development.',
    marketDemand: 'High',
    avgSalary: '₹4–14 LPA',
    jobRoles: ['Structural Engineer', 'Site Engineer', 'Urban Planner', 'BIM Specialist'],
  },
  {
    id: 'aerospace',
    label: 'Aerospace Engineering',
    shortLabel: 'Aero',
    icon: '◁',
    color: 'sky',
    description: 'Aerodynamics, propulsion systems, and spacecraft design.',
    marketDemand: 'Very High',
    avgSalary: '₹10–28 LPA',
    jobRoles: ['Aeronautical Engineer', 'Propulsion Engineer', 'Avionics', 'GNC Engineer'],
  },
  {
    id: 'biomedical',
    label: 'Biomedical Engineering',
    shortLabel: 'BME',
    icon: '◌',
    color: 'rose',
    description: 'Medical device design, bioinformatics, and clinical systems.',
    marketDemand: 'Very High',
    avgSalary: '₹8–22 LPA',
    jobRoles: ['Medical Device Engineer', 'Bioinformatics', 'Clinical Engineer', 'R&D'],
  },
  {
    id: 'automobile',
    label: 'Automobile Engineering',
    shortLabel: 'Auto',
    icon: '⬥',
    color: 'amber',
    description: 'Vehicle dynamics, EV systems, ADAS, and automotive software.',
    marketDemand: 'High',
    avgSalary: '₹7–20 LPA',
    jobRoles: ['Vehicle Dynamics', 'ADAS Engineer', 'EV Engineer', 'Powertrain Engineer'],
  },
  {
    id: 'chemical',
    label: 'Chemical Engineering',
    shortLabel: 'Chem',
    icon: '◎',
    color: 'fuchsia',
    description: 'Process design, reaction engineering, and material science.',
    marketDemand: 'High',
    avgSalary: '₹6–16 LPA',
    jobRoles: ['Process Engineer', 'R&D Engineer', 'Materials Scientist', 'Safety Engineer'],
  },
];

export const DOMAIN_ACCENT_CLASSES: Record<AccentColor, {
  text: string; bg: string; border: string; glow: string; buttonBg: string;
}> = {
  violet: {
    text: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/25',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.25)]',
    buttonBg: 'bg-gradient-to-r from-violet-600 to-indigo-500',
  },
  cyan: {
    text: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/25',
    glow: 'shadow-[0_0_20px_rgba(76,215,246,0.2)]',
    buttonBg: 'bg-gradient-to-r from-cyan-500 to-teal-400',
  },
  fuchsia: {
    text: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/25',
    glow: 'shadow-[0_0_20px_rgba(217,70,239,0.2)]',
    buttonBg: 'bg-gradient-to-r from-fuchsia-600 to-violet-500',
  },
  amber: {
    text: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/25',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.2)]',
    buttonBg: 'bg-gradient-to-r from-amber-500 to-orange-400',
  },
  emerald: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/25',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.2)]',
    buttonBg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
  },
  rose: {
    text: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/25',
    glow: 'shadow-[0_0_20px_rgba(251,113,133,0.2)]',
    buttonBg: 'bg-gradient-to-r from-rose-500 to-pink-400',
  },
  indigo: {
    text: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/25',
    glow: 'shadow-[0_0_20px_rgba(129,140,248,0.2)]',
    buttonBg: 'bg-gradient-to-r from-indigo-600 to-violet-500',
  },
  sky: {
    text: 'text-sky-400',
    bg: 'bg-sky-400/10',
    border: 'border-sky-400/25',
    glow: 'shadow-[0_0_20px_rgba(56,189,248,0.2)]',
    buttonBg: 'bg-gradient-to-r from-sky-500 to-cyan-400',
  },
};
