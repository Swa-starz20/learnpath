import type { DomainId } from './engineeringDomains';

export interface RoleDefinition {
  id: string;              // kebab-case unique role ID
  title: string;           // Display name
  requiredSkills: string[]; // key skill IDs needed
  /** 0-100: minimum overall readiness to be "compatible" */
  minReadiness: number;
  /** Icon or emoji for display */
  icon: string;
  /** Short descriptor */
  description: string;
  /** Salary range string */
  salaryRange: string;
  /** Domain this role belongs to */
  domainId: DomainId;
}

export interface DomainRoleGroup {
  domainId: DomainId;
  groupLabel: string;
  roles: RoleDefinition[];
}

export const DOMAIN_ROLE_GROUPS: DomainRoleGroup[] = [
  {
    domainId: 'computer',
    groupLabel: 'Software & Cloud Engineering',
    roles: [
      {
        id: 'software-engineer',
        title: 'Software Engineer',
        requiredSkills: ['dsa', 'os-concepts', 'databases'],
        minReadiness: 60,
        icon: '💻',
        description: 'Build scalable software systems and full-stack applications.',
        salaryRange: '₹12–28 LPA',
        domainId: 'computer',
      },
      {
        id: 'backend-engineer',
        title: 'Backend Engineer',
        requiredSkills: ['dsa', 'databases', 'system-design'],
        minReadiness: 65,
        icon: '⚙️',
        description: 'Design high-performance APIs, microservices, and data pipelines.',
        salaryRange: '₹14–32 LPA',
        domainId: 'computer',
      },
      {
        id: 'cloud-engineer',
        title: 'Cloud Engineer',
        requiredSkills: ['cloud-basics', 'system-design', 'os-concepts'],
        minReadiness: 68,
        icon: '☁️',
        description: 'Architect and manage cloud-native infrastructure on AWS/GCP/Azure.',
        salaryRange: '₹18–45 LPA',
        domainId: 'computer',
      },
    ],
  },
  {
    domainId: 'aiml',
    groupLabel: 'AI & Machine Learning',
    roles: [
      {
        id: 'ml-engineer',
        title: 'ML Engineer',
        requiredSkills: ['ml-fundamentals', 'python', 'statistics'],
        minReadiness: 65,
        icon: '🤖',
        description: 'Build and deploy production-grade machine learning models.',
        salaryRange: '₹16–35 LPA',
        domainId: 'aiml',
      },
      {
        id: 'ai-research-engineer',
        title: 'AI Research Engineer',
        requiredSkills: ['deep-learning', 'ml-fundamentals', 'statistics'],
        minReadiness: 75,
        icon: '🧠',
        description: 'Conduct applied research on neural architectures and LLMs.',
        salaryRange: '₹22–60 LPA',
        domainId: 'aiml',
      },
      {
        id: 'mlops-engineer',
        title: 'MLOps Engineer',
        requiredSkills: ['mlops', 'python', 'cloud-basics'],
        minReadiness: 65,
        icon: '🔄',
        description: 'Operationalise ML pipelines with CI/CD and model monitoring.',
        salaryRange: '₹18–40 LPA',
        domainId: 'aiml',
      },
    ],
  },
  {
    domainId: 'robotics',
    groupLabel: 'Robotics & Autonomous Systems',
    roles: [
      {
        id: 'robotics-engineer',
        title: 'Robotics Engineer',
        requiredSkills: ['ros2', 'kinematics', 'embedded-c'],
        minReadiness: 60,
        icon: '🦾',
        description: 'Design and integrate robotic systems using ROS2 and C++.',
        salaryRange: '₹10–22 LPA',
        domainId: 'robotics',
      },
      {
        id: 'autonomous-systems-engineer',
        title: 'Autonomous Systems Engineer',
        requiredSkills: ['sensor-fusion', 'ros2', 'control-theory'],
        minReadiness: 68,
        icon: '🚗',
        description: 'Develop perception, planning, and control for autonomous platforms.',
        salaryRange: '₹14–30 LPA',
        domainId: 'robotics',
      },
      {
        id: 'controls-engineer',
        title: 'Controls Engineer',
        requiredSkills: ['control-theory', 'kinematics', 'embedded-c'],
        minReadiness: 65,
        icon: '🎛️',
        description: 'Implement PID, MPC, and state-space controllers for robotic actuators.',
        salaryRange: '₹12–25 LPA',
        domainId: 'robotics',
      },
    ],
  },
  {
    domainId: 'mechatronics',
    groupLabel: 'Mechatronics & Automation',
    roles: [
      {
        id: 'mechatronics-engineer',
        title: 'Mechatronics Engineer',
        requiredSkills: ['embedded-systems', 'cad', 'control-systems'],
        minReadiness: 60,
        icon: '🔧',
        description: 'Integrate mechanical, electrical, and software subsystems.',
        salaryRange: '₹7–16 LPA',
        domainId: 'mechatronics',
      },
      {
        id: 'automation-engineer',
        title: 'Automation Engineer',
        requiredSkills: ['plc-programming', 'control-systems', 'pneumatics'],
        minReadiness: 62,
        icon: '🏭',
        description: 'Program PLCs and design automated production workflows.',
        salaryRange: '₹8–20 LPA',
        domainId: 'mechatronics',
      },
      {
        id: 'industrial-iot-engineer',
        title: 'Industrial IoT Engineer',
        requiredSkills: ['embedded-systems', 'plc-programming', 'control-systems'],
        minReadiness: 65,
        icon: '📡',
        description: 'Connect industrial machines to cloud platforms via IIoT protocols.',
        salaryRange: '₹10–22 LPA',
        domainId: 'mechatronics',
      },
    ],
  },
  {
    domainId: 'electrical',
    groupLabel: 'Power & Grid Engineering',
    roles: [
      {
        id: 'power-systems-engineer',
        title: 'Power Systems Engineer',
        requiredSkills: ['power-systems', 'circuit-analysis', 'load-flow'],
        minReadiness: 58,
        icon: '⚡',
        description: 'Analyse and optimise electrical power transmission networks.',
        salaryRange: '₹5–14 LPA',
        domainId: 'electrical',
      },
      {
        id: 'protection-engineer',
        title: 'Protection Engineer',
        requiredSkills: ['protection-relaying', 'power-systems', 'circuit-analysis'],
        minReadiness: 63,
        icon: '🛡️',
        description: 'Design protective relay schemes for substation and grid assets.',
        salaryRange: '₹7–18 LPA',
        domainId: 'electrical',
      },
      {
        id: 'scada-engineer',
        title: 'SCADA Engineer',
        requiredSkills: ['scada', 'power-systems', 'plc-programming'],
        minReadiness: 65,
        icon: '🖥️',
        description: 'Implement and maintain SCADA systems for energy monitoring.',
        salaryRange: '₹8–20 LPA',
        domainId: 'electrical',
      },
    ],
  },
  {
    domainId: 'electronics',
    groupLabel: 'VLSI & Embedded Electronics',
    roles: [
      {
        id: 'vlsi-design-engineer',
        title: 'VLSI Design Engineer',
        requiredSkills: ['vlsi-design', 'vhdl-verilog', 'signal-processing'],
        minReadiness: 68,
        icon: '🔲',
        description: 'Design digital and mixed-signal integrated circuits.',
        salaryRange: '₹10–25 LPA',
        domainId: 'electronics',
      },
      {
        id: 'embedded-systems-engineer',
        title: 'Embedded Systems Engineer',
        requiredSkills: ['embedded-c', 'signal-processing', 'pcb-design'],
        minReadiness: 63,
        icon: '📟',
        description: 'Develop firmware and low-level drivers for embedded targets.',
        salaryRange: '₹8–20 LPA',
        domainId: 'electronics',
      },
      {
        id: 'pcb-design-engineer',
        title: 'PCB Design Engineer',
        requiredSkills: ['pcb-design', 'vlsi-design', 'signal-processing'],
        minReadiness: 60,
        icon: '🟩',
        description: 'Create multi-layer PCB layouts for electronic assemblies.',
        salaryRange: '₹6–16 LPA',
        domainId: 'electronics',
      },
    ],
  },
  {
    domainId: 'mechanical',
    groupLabel: 'Mechanical Design & Manufacturing',
    roles: [
      {
        id: 'design-engineer',
        title: 'Design Engineer',
        requiredSkills: ['cad-solidworks', 'gd-t', 'manufacturing-processes'],
        minReadiness: 58,
        icon: '📐',
        description: 'Create detailed 3D models and engineering drawings for products.',
        salaryRange: '₹5–14 LPA',
        domainId: 'mechanical',
      },
      {
        id: 'fea-simulation-engineer',
        title: 'FEA Simulation Engineer',
        requiredSkills: ['fea-ansys', 'cad-solidworks', 'thermodynamics'],
        minReadiness: 65,
        icon: '🔬',
        description: 'Perform structural, thermal, and fatigue simulations using ANSYS.',
        salaryRange: '₹7–18 LPA',
        domainId: 'mechanical',
      },
      {
        id: 'manufacturing-engineer',
        title: 'Manufacturing Engineer',
        requiredSkills: ['manufacturing-processes', 'gd-t', 'cad-solidworks'],
        minReadiness: 60,
        icon: '🏗️',
        description: 'Optimise production processes and implement lean manufacturing.',
        salaryRange: '₹6–16 LPA',
        domainId: 'mechanical',
      },
    ],
  },
  {
    domainId: 'civil',
    groupLabel: 'Structural & Urban Engineering',
    roles: [
      {
        id: 'structural-engineer',
        title: 'Structural Engineer',
        requiredSkills: ['structural-analysis', 'staad-pro', 'soil-mechanics'],
        minReadiness: 60,
        icon: '🏛️',
        description: 'Analyse and design load-bearing structures for buildings and bridges.',
        salaryRange: '₹5–14 LPA',
        domainId: 'civil',
      },
      {
        id: 'site-engineer',
        title: 'Site Engineer',
        requiredSkills: ['project-management', 'autocad', 'structural-analysis'],
        minReadiness: 55,
        icon: '🏚️',
        description: 'Supervise construction activities and ensure quality on-site.',
        salaryRange: '₹4–10 LPA',
        domainId: 'civil',
      },
      {
        id: 'urban-planning-engineer',
        title: 'Urban Planning Engineer',
        requiredSkills: ['autocad', 'project-management', 'soil-mechanics'],
        minReadiness: 60,
        icon: '🏙️',
        description: 'Design sustainable urban layouts and infrastructure master plans.',
        salaryRange: '₹6–14 LPA',
        domainId: 'civil',
      },
    ],
  },
  {
    domainId: 'aerospace',
    groupLabel: 'Aerospace & Space Systems',
    roles: [
      {
        id: 'aeronautical-engineer',
        title: 'Aeronautical Engineer',
        requiredSkills: ['aerodynamics', 'cfd', 'matlab-simulink'],
        minReadiness: 65,
        icon: '✈️',
        description: 'Design and test aircraft aerodynamic surfaces and structures.',
        salaryRange: '₹10–24 LPA',
        domainId: 'aerospace',
      },
      {
        id: 'propulsion-systems-engineer',
        title: 'Propulsion Systems Engineer',
        requiredSkills: ['propulsion', 'thermodynamics', 'matlab-simulink'],
        minReadiness: 70,
        icon: '🚀',
        description: 'Develop jet and rocket propulsion systems for air and space vehicles.',
        salaryRange: '₹12–28 LPA',
        domainId: 'aerospace',
      },
      {
        id: 'gnc-engineer',
        title: 'GNC Engineer',
        requiredSkills: ['gnc', 'matlab-simulink', 'aerodynamics'],
        minReadiness: 72,
        icon: '🛸',
        description: 'Design guidance, navigation, and control algorithms for spacecraft.',
        salaryRange: '₹14–30 LPA',
        domainId: 'aerospace',
      },
    ],
  },
  {
    domainId: 'biomedical',
    groupLabel: 'Biomedical & Clinical Engineering',
    roles: [
      {
        id: 'medical-device-engineer',
        title: 'Medical Device Engineer',
        requiredSkills: ['medical-device-standards', 'signal-processing', 'regulatory-compliance'],
        minReadiness: 65,
        icon: '🩺',
        description: 'Design and validate FDA/CE-compliant medical devices.',
        salaryRange: '₹8–20 LPA',
        domainId: 'biomedical',
      },
      {
        id: 'clinical-systems-engineer',
        title: 'Clinical Systems Engineer',
        requiredSkills: ['signal-processing', 'matlab', 'regulatory-compliance'],
        minReadiness: 62,
        icon: '🏥',
        description: 'Integrate and maintain clinical equipment and hospital IT systems.',
        salaryRange: '₹7–18 LPA',
        domainId: 'biomedical',
      },
      {
        id: 'bioinformatics-engineer',
        title: 'Bioinformatics Engineer',
        requiredSkills: ['bioinformatics', 'signal-processing', 'matlab'],
        minReadiness: 68,
        icon: '🧬',
        description: 'Analyse genomics and proteomics data using computational biology tools.',
        salaryRange: '₹10–22 LPA',
        domainId: 'biomedical',
      },
    ],
  },
  {
    domainId: 'automobile',
    groupLabel: 'Automotive & EV Engineering',
    roles: [
      {
        id: 'vehicle-dynamics-engineer',
        title: 'Vehicle Dynamics Engineer',
        requiredSkills: ['vehicle-dynamics', 'matlab-simulink', 'autosar'],
        minReadiness: 63,
        icon: '🚙',
        description: 'Model and optimise suspension, handling, and ride comfort.',
        salaryRange: '₹7–18 LPA',
        domainId: 'automobile',
      },
      {
        id: 'adas-engineer',
        title: 'ADAS Engineer',
        requiredSkills: ['adas-algorithms', 'sensor-fusion', 'autosar'],
        minReadiness: 70,
        icon: '🛞',
        description: 'Develop advanced driver-assistance features and safety systems.',
        salaryRange: '₹14–30 LPA',
        domainId: 'automobile',
      },
      {
        id: 'ev-powertrain-engineer',
        title: 'EV Powertrain Engineer',
        requiredSkills: ['ev-powertrain', 'matlab-simulink', 'vehicle-dynamics'],
        minReadiness: 68,
        icon: '🔋',
        description: 'Design battery management and electric motor drive systems.',
        salaryRange: '₹12–28 LPA',
        domainId: 'automobile',
      },
    ],
  },
  {
    domainId: 'chemical',
    groupLabel: 'Process & Materials Engineering',
    roles: [
      {
        id: 'process-design-engineer',
        title: 'Process Design Engineer',
        requiredSkills: ['process-simulation', 'aspen-hysys', 'thermodynamics'],
        minReadiness: 60,
        icon: '🧪',
        description: 'Design chemical plant flowsheets and optimise unit operations.',
        salaryRange: '₹6–14 LPA',
        domainId: 'chemical',
      },
      {
        id: 'reaction-engineer',
        title: 'Reaction Engineer',
        requiredSkills: ['reaction-engineering', 'thermodynamics', 'process-simulation'],
        minReadiness: 63,
        icon: '⚗️',
        description: 'Model and scale up chemical reactors for industrial production.',
        salaryRange: '₹7–16 LPA',
        domainId: 'chemical',
      },
      {
        id: 'materials-scientist',
        title: 'Materials Scientist',
        requiredSkills: ['reaction-engineering', 'thermodynamics', 'hse'],
        minReadiness: 65,
        icon: '🔩',
        description: 'Research and characterise advanced materials for industrial applications.',
        salaryRange: '₹8–18 LPA',
        domainId: 'chemical',
      },
    ],
  },
];

export const getRolesForDomain = (domainId: DomainId): RoleDefinition[] => {
  const group = DOMAIN_ROLE_GROUPS.find((g) => g.domainId === domainId);
  return group ? group.roles : [];
};

/**
 * Computes 0-100 compatibility score for a role given current readiness and weak skills.
 * Base = readinessPct
 * Penalty = 8 points per weak skill matching requiredSkills (max 40 penalty)
 */
export const computeRoleCompatibility = (
  role: RoleDefinition,
  readinessPct: number,
  weakSkillIds: string[],
): number => {
  const weakSet = new Set(weakSkillIds);
  const matches = role.requiredSkills.filter((s) => weakSet.has(s)).length;
  const penalty = Math.min(40, matches * 8);
  return Math.max(0, Math.min(100, readinessPct - penalty));
};
