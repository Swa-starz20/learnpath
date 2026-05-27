import type { DomainId } from './engineeringDomains';

export type NodeStatus = 'completed' | 'active' | 'locked';

export interface RoadmapNode {
  id: string;
  title: string;
  subtitle: string;
  status: NodeStatus;
  xpReward: number;
  estimatedWeeks: number;
  skills: string[];
  aiConfidence: number;  // 0-100
  dependencies: string[]; // node ids
  resources?: string[];
  isKeyMilestone?: boolean;
}

export interface CareerTrack {
  id: string;
  label: string;
  targetRole: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  nodes: RoadmapNode[];
  totalXP: number;
}

export interface DomainRoadmapConfig {
  domainId: DomainId;
  tracks: CareerTrack[];
}

// ── Computer Engineering ──────────────────────────────────────────────────────
const COMPUTER_TRACKS: CareerTrack[] = [
  {
    id: 'fullstack-swe',
    label: 'Full-Stack SWE',
    targetRole: 'Senior Software Engineer',
    duration: '12–16 months',
    difficulty: 'Intermediate',
    totalXP: 9400,
    nodes: [
      { id: 'cs-dsa', title: 'Data Structures & Algorithms', subtitle: 'Core Foundations', status: 'completed', xpReward: 1200, estimatedWeeks: 6, aiConfidence: 98, dependencies: [], skills: ['Arrays', 'Trees', 'Graphs', 'DP', 'Sorting'], isKeyMilestone: true },
      { id: 'cs-webfund', title: 'Web Fundamentals', subtitle: 'HTML · CSS · JS', status: 'completed', xpReward: 800, estimatedWeeks: 4, aiConfidence: 95, dependencies: ['cs-dsa'], skills: ['HTML5', 'CSS3', 'JavaScript ES2024', 'Browser APIs'] },
      { id: 'cs-react', title: 'React & TypeScript', subtitle: 'Modern Frontend', status: 'active', xpReward: 1000, estimatedWeeks: 5, aiConfidence: 87, dependencies: ['cs-webfund'], skills: ['React 19', 'TypeScript', 'State Management', 'Testing'], isKeyMilestone: true },
      { id: 'cs-node', title: 'Node.js & REST APIs', subtitle: 'Backend Engineering', status: 'locked', xpReward: 900, estimatedWeeks: 4, aiConfidence: 0, dependencies: ['cs-react'], skills: ['Express', 'REST', 'Auth', 'JWT'] },
      { id: 'cs-db', title: 'Databases & SQL', subtitle: 'Postgres · MongoDB', status: 'locked', xpReward: 800, estimatedWeeks: 3, aiConfidence: 0, dependencies: ['cs-node'], skills: ['PostgreSQL', 'MongoDB', 'Redis', 'Indexing'] },
      { id: 'cs-sysdes', title: 'System Design', subtitle: 'Architecture Patterns', status: 'locked', xpReward: 1400, estimatedWeeks: 8, aiConfidence: 0, dependencies: ['cs-db'], skills: ['Load Balancing', 'Caching', 'CAP Theorem', 'Microservices'], isKeyMilestone: true },
      { id: 'cs-devops', title: 'DevOps & Cloud', subtitle: 'AWS · Docker · K8s', status: 'locked', xpReward: 1200, estimatedWeeks: 6, aiConfidence: 0, dependencies: ['cs-sysdes'], skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'] },
      { id: 'cs-dist', title: 'Distributed Systems', subtitle: 'Senior-Level Mastery', status: 'locked', xpReward: 2100, estimatedWeeks: 10, aiConfidence: 0, dependencies: ['cs-devops'], skills: ['Kafka', 'CRDT', 'Consensus', 'Observability'], isKeyMilestone: true },
    ],
  },
  {
    id: 'ml-engineer',
    label: 'ML Engineer',
    targetRole: 'Machine Learning Engineer',
    duration: '14–18 months',
    difficulty: 'Advanced',
    totalXP: 10800,
    nodes: [
      { id: 'ml-python', title: 'Python & Math', subtitle: 'Core Foundations', status: 'completed', xpReward: 900, estimatedWeeks: 4, aiConfidence: 95, dependencies: [], skills: ['Python', 'NumPy', 'Linear Algebra', 'Probability'], isKeyMilestone: true },
      { id: 'ml-ml', title: 'Classical ML', subtitle: 'Scikit-Learn · Stats', status: 'active', xpReward: 1100, estimatedWeeks: 5, aiConfidence: 82, dependencies: ['ml-python'], skills: ['Regression', 'SVM', 'Random Forests', 'Feature Engineering'] },
      { id: 'ml-dl', title: 'Deep Learning', subtitle: 'Neural Architectures', status: 'locked', xpReward: 1500, estimatedWeeks: 7, aiConfidence: 0, dependencies: ['ml-ml'], skills: ['CNNs', 'RNNs', 'Transformers', 'PyTorch'], isKeyMilestone: true },
      { id: 'ml-nlp', title: 'NLP & LLMs', subtitle: 'Language Models', status: 'locked', xpReward: 1600, estimatedWeeks: 8, aiConfidence: 0, dependencies: ['ml-dl'], skills: ['BERT', 'GPT', 'Fine-tuning', 'RAG', 'LangChain'] },
      { id: 'ml-mlops', title: 'MLOps & Production', subtitle: 'Deploy & Monitor', status: 'locked', xpReward: 1400, estimatedWeeks: 6, aiConfidence: 0, dependencies: ['ml-nlp'], skills: ['MLflow', 'Kubeflow', 'Feature Stores', 'A/B Testing'], isKeyMilestone: true },
    ],
  },
];

// ── AI/ML Engineering ─────────────────────────────────────────────────────────
const AIML_TRACKS: CareerTrack[] = [
  {
    id: 'aiml-researcher',
    label: 'AI Researcher',
    targetRole: 'AI Research Engineer',
    duration: '18–24 months',
    difficulty: 'Expert',
    totalXP: 14000,
    nodes: [
      { id: 'aiml-math', title: 'Mathematics for AI', subtitle: 'Calculus · LA · Prob', status: 'completed', xpReward: 1200, estimatedWeeks: 6, aiConfidence: 97, dependencies: [], skills: ['Calculus', 'Linear Algebra', 'Probability', 'Statistics'], isKeyMilestone: true },
      { id: 'aiml-ml', title: 'Machine Learning', subtitle: 'Core Algorithms', status: 'active', xpReward: 1400, estimatedWeeks: 6, aiConfidence: 85, dependencies: ['aiml-math'], skills: ['Supervised', 'Unsupervised', 'RL', 'Model Evaluation'] },
      { id: 'aiml-dl', title: 'Deep Learning', subtitle: 'Neural Architecture', status: 'locked', xpReward: 1800, estimatedWeeks: 8, aiConfidence: 0, dependencies: ['aiml-ml'], skills: ['CNNs', 'RNNs', 'Attention', 'Diffusion'], isKeyMilestone: true },
      { id: 'aiml-llm', title: 'LLM Engineering', subtitle: 'Foundation Models', status: 'locked', xpReward: 2000, estimatedWeeks: 10, aiConfidence: 0, dependencies: ['aiml-dl'], skills: ['Transformers', 'RLHF', 'Fine-tuning', 'Alignment'], isKeyMilestone: true },
      { id: 'aiml-research', title: 'Research & Papers', subtitle: 'arXiv · Publish', status: 'locked', xpReward: 2400, estimatedWeeks: 12, aiConfidence: 0, dependencies: ['aiml-llm'], skills: ['Paper Reading', 'Experiment Design', 'Ablations', 'LaTeX'] },
    ],
  },
];

// ── Robotics ──────────────────────────────────────────────────────────────────
const ROBOTICS_TRACKS: CareerTrack[] = [
  {
    id: 'robotics-engineer',
    label: 'Robotics Engineer',
    targetRole: 'Autonomous Systems Engineer',
    duration: '14–20 months',
    difficulty: 'Advanced',
    totalXP: 11200,
    nodes: [
      { id: 'rob-prog', title: 'C++ & Python', subtitle: 'Robotics Languages', status: 'completed', xpReward: 900, estimatedWeeks: 5, aiConfidence: 94, dependencies: [], skills: ['C++17', 'Python', 'CMake', 'OpenCV'], isKeyMilestone: true },
      { id: 'rob-ros', title: 'ROS2 & Middleware', subtitle: 'Robot Framework', status: 'active', xpReward: 1400, estimatedWeeks: 6, aiConfidence: 78, dependencies: ['rob-prog'], skills: ['ROS2', 'DDS', 'tf2', 'URDF', 'Gazebo'], isKeyMilestone: true },
      { id: 'rob-perception', title: 'Perception & CV', subtitle: 'Sensors & Vision', status: 'locked', xpReward: 1600, estimatedWeeks: 7, aiConfidence: 0, dependencies: ['rob-ros'], skills: ['SLAM', 'Point Clouds', 'YOLO', 'Depth Estimation'] },
      { id: 'rob-control', title: 'Control Systems', subtitle: 'Dynamics & Control', status: 'locked', xpReward: 1400, estimatedWeeks: 6, aiConfidence: 0, dependencies: ['rob-perception'], skills: ['PID', 'MPC', 'State Estimation', 'Kalman Filter'] },
      { id: 'rob-nav', title: 'Navigation & Planning', subtitle: 'Autonomous Motion', status: 'locked', xpReward: 1800, estimatedWeeks: 8, aiConfidence: 0, dependencies: ['rob-control'], skills: ['A*', 'RRT', 'Nav2', 'Behavior Trees'], isKeyMilestone: true },
    ],
  },
];

// ── Mechanical Engineering ────────────────────────────────────────────────────
const MECHANICAL_TRACKS: CareerTrack[] = [
  {
    id: 'mech-design',
    label: 'Design Engineer',
    targetRole: 'Senior Design & FEA Engineer',
    duration: '10–14 months',
    difficulty: 'Intermediate',
    totalXP: 8200,
    nodes: [
      { id: 'mech-cad', title: 'CAD Mastery', subtitle: 'SolidWorks · CATIA', status: 'completed', xpReward: 1000, estimatedWeeks: 5, aiConfidence: 93, dependencies: [], skills: ['SolidWorks', 'CATIA', 'GD&T', 'Assemblies'], isKeyMilestone: true },
      { id: 'mech-fea', title: 'FEA & Simulation', subtitle: 'ANSYS · Abaqus', status: 'active', xpReward: 1200, estimatedWeeks: 5, aiConfidence: 80, dependencies: ['mech-cad'], skills: ['ANSYS', 'Meshing', 'Structural Analysis', 'CFD'] },
      { id: 'mech-thermo', title: 'Thermodynamics & Fluids', subtitle: 'Heat Transfer · CFD', status: 'locked', xpReward: 1000, estimatedWeeks: 4, aiConfidence: 0, dependencies: ['mech-fea'], skills: ['Heat Transfer', 'Fluid Dynamics', 'CFD', 'HVAC'] },
      { id: 'mech-mfg', title: 'Manufacturing & DFM', subtitle: 'Production Methods', status: 'locked', xpReward: 900, estimatedWeeks: 4, aiConfidence: 0, dependencies: ['mech-thermo'], skills: ['CNC', 'DFM', 'Lean', 'Additive Manufacturing'], isKeyMilestone: true },
      { id: 'mech-pm', title: 'Project & Product Mgmt', subtitle: 'Engineering Leadership', status: 'locked', xpReward: 800, estimatedWeeks: 3, aiConfidence: 0, dependencies: ['mech-mfg'], skills: ['DFMEA', 'PLM', 'Agile', 'Cross-functional Leadership'] },
    ],
  },
];

// ── Civil Engineering ─────────────────────────────────────────────────────────
const CIVIL_TRACKS: CareerTrack[] = [
  {
    id: 'civil-structural',
    label: 'Structural Engineer',
    targetRole: 'Senior Structural Engineer',
    duration: '10–14 months',
    difficulty: 'Intermediate',
    totalXP: 7800,
    nodes: [
      { id: 'civ-autocad', title: 'AutoCAD & BIM', subtitle: 'Revit · Navisworks', status: 'completed', xpReward: 900, estimatedWeeks: 4, aiConfidence: 92, dependencies: [], skills: ['AutoCAD', 'Revit', 'BIM', '3D Modeling'], isKeyMilestone: true },
      { id: 'civ-structural', title: 'Structural Analysis', subtitle: 'STAAD · ETABS', status: 'active', xpReward: 1100, estimatedWeeks: 5, aiConfidence: 76, dependencies: ['civ-autocad'], skills: ['STAAD.Pro', 'ETABS', 'Loads', 'IS 456'] },
      { id: 'civ-geotech', title: 'Geotechnical Engineering', subtitle: 'Soil & Foundation', status: 'locked', xpReward: 900, estimatedWeeks: 4, aiConfidence: 0, dependencies: ['civ-structural'], skills: ['Soil Testing', 'Foundation Design', 'Retaining Walls'] },
      { id: 'civ-project', title: 'Project Management', subtitle: 'Site & Contracts', status: 'locked', xpReward: 800, estimatedWeeks: 3, aiConfidence: 0, dependencies: ['civ-geotech'], skills: ['MS Project', 'Quantity Estimation', 'Contracts', 'Safety'], isKeyMilestone: true },
    ],
  },
];

// ── Electrical Engineering ────────────────────────────────────────────────────
const ELECTRICAL_TRACKS: CareerTrack[] = [
  {
    id: 'elec-power',
    label: 'Power Systems Engineer',
    targetRole: 'Senior Power Systems Engineer',
    duration: '12–16 months',
    difficulty: 'Advanced',
    totalXP: 9000,
    nodes: [
      { id: 'elec-circuits', title: 'Circuit Theory', subtitle: 'AC · DC Fundamentals', status: 'completed', xpReward: 900, estimatedWeeks: 5, aiConfidence: 95, dependencies: [], skills: ['KVL/KCL', 'Thevenin', 'Filters', 'Phasors'], isKeyMilestone: true },
      { id: 'elec-machines', title: 'Electrical Machines', subtitle: 'Motors · Transformers', status: 'active', xpReward: 1100, estimatedWeeks: 5, aiConfidence: 80, dependencies: ['elec-circuits'], skills: ['Transformers', 'Induction Motors', 'Drives', 'Efficiency'] },
      { id: 'elec-power', title: 'Power Systems', subtitle: 'Grid · Protection', status: 'locked', xpReward: 1300, estimatedWeeks: 6, aiConfidence: 0, dependencies: ['elec-machines'], skills: ['Load Flow', 'Fault Analysis', 'Protection', 'SCADA'], isKeyMilestone: true },
      { id: 'elec-pe', title: 'Power Electronics', subtitle: 'Converters & Inverters', status: 'locked', xpReward: 1200, estimatedWeeks: 5, aiConfidence: 0, dependencies: ['elec-power'], skills: ['DC-DC', 'Inverters', 'MPPT', 'Motor Drives'] },
    ],
  },
];

// ── Electronics Engineering ───────────────────────────────────────────────────
const ELECTRONICS_TRACKS: CareerTrack[] = [
  {
    id: 'ece-vlsi',
    label: 'VLSI Engineer',
    targetRole: 'Senior VLSI/RTL Design Engineer',
    duration: '12–16 months',
    difficulty: 'Expert',
    totalXP: 9600,
    nodes: [
      { id: 'ece-digital', title: 'Digital Electronics', subtitle: 'Logic Design', status: 'completed', xpReward: 900, estimatedWeeks: 4, aiConfidence: 94, dependencies: [], skills: ['Logic Gates', 'FSM', 'Sequential', 'Karnaugh Map'], isKeyMilestone: true },
      { id: 'ece-hdl', title: 'Verilog / VHDL', subtitle: 'Hardware Description', status: 'active', xpReward: 1200, estimatedWeeks: 6, aiConfidence: 83, dependencies: ['ece-digital'], skills: ['Verilog', 'VHDL', 'Testbenches', 'ModelSim'], isKeyMilestone: true },
      { id: 'ece-vlsi', title: 'VLSI Design', subtitle: 'CMOS · Physical', status: 'locked', xpReward: 1600, estimatedWeeks: 7, aiConfidence: 0, dependencies: ['ece-hdl'], skills: ['CMOS', 'Layout', 'DRC/LVS', 'Timing Closure'] },
      { id: 'ece-fpga', title: 'FPGA & Prototyping', subtitle: 'Xilinx · Intel', status: 'locked', xpReward: 1400, estimatedWeeks: 6, aiConfidence: 0, dependencies: ['ece-vlsi'], skills: ['Vivado', 'Quartus', 'IP Cores', 'Embedded'], isKeyMilestone: true },
    ],
  },
];

// ── Aerospace Engineering ─────────────────────────────────────────────────────
const AEROSPACE_TRACKS: CareerTrack[] = [
  {
    id: 'aero-flight',
    label: 'Flight Systems Engineer',
    targetRole: 'Aerospace Systems Engineer',
    duration: '14–18 months',
    difficulty: 'Expert',
    totalXP: 10400,
    nodes: [
      { id: 'aero-aero', title: 'Aerodynamics', subtitle: 'Lift · Drag · CFD', status: 'completed', xpReward: 1100, estimatedWeeks: 5, aiConfidence: 90, dependencies: [], skills: ['Bernoulli', 'Drag Polar', 'XFOIL', 'CFD Basics'], isKeyMilestone: true },
      { id: 'aero-prop', title: 'Propulsion Systems', subtitle: 'Jet · Rocket Engines', status: 'active', xpReward: 1300, estimatedWeeks: 6, aiConfidence: 77, dependencies: ['aero-aero'], skills: ['Thermodynamic Cycles', 'Nozzle Design', 'Turbomachinery'] },
      { id: 'aero-struct', title: 'Aero Structures', subtitle: 'Stress & Fatigue', status: 'locked', xpReward: 1400, estimatedWeeks: 6, aiConfidence: 0, dependencies: ['aero-prop'], skills: ['Composites', 'Fatigue', 'FEA', 'Material Selection'] },
      { id: 'aero-gnc', title: 'GNC Systems', subtitle: 'Guidance · Navigation', status: 'locked', xpReward: 2000, estimatedWeeks: 9, aiConfidence: 0, dependencies: ['aero-struct'], skills: ['Kalman Filter', 'Control Theory', 'MATLAB', 'Simulink'], isKeyMilestone: true },
    ],
  },
];

// ── Biomedical Engineering ────────────────────────────────────────────────────
const BIOMEDICAL_TRACKS: CareerTrack[] = [
  {
    id: 'bme-device',
    label: 'Medical Device Engineer',
    targetRole: 'Medical Device R&D Engineer',
    duration: '12–16 months',
    difficulty: 'Advanced',
    totalXP: 8800,
    nodes: [
      { id: 'bme-bio', title: 'Biomedical Sciences', subtitle: 'Anatomy · Physiology', status: 'completed', xpReward: 800, estimatedWeeks: 4, aiConfidence: 92, dependencies: [], skills: ['Anatomy', 'Physiology', 'Biophysics', 'Cell Biology'], isKeyMilestone: true },
      { id: 'bme-signals', title: 'Biomedical Signals', subtitle: 'ECG · EEG · EMG', status: 'active', xpReward: 1100, estimatedWeeks: 5, aiConfidence: 79, dependencies: ['bme-bio'], skills: ['Signal Processing', 'ECG Analysis', 'Python', 'MATLAB'] },
      { id: 'bme-device', title: 'Medical Device Design', subtitle: 'FDA · ISO 13485', status: 'locked', xpReward: 1400, estimatedWeeks: 6, aiConfidence: 0, dependencies: ['bme-signals'], skills: ['Design Controls', 'Risk Management', 'Validation', 'FMEA'], isKeyMilestone: true },
      { id: 'bme-regulatory', title: 'Regulatory Affairs', subtitle: 'FDA · CE Marking', status: 'locked', xpReward: 1000, estimatedWeeks: 4, aiConfidence: 0, dependencies: ['bme-device'], skills: ['510(k)', 'PMA', 'CE Mark', 'Post-Market Surveillance'] },
    ],
  },
];

// ── Automobile Engineering ────────────────────────────────────────────────────
const AUTOMOBILE_TRACKS: CareerTrack[] = [
  {
    id: 'auto-adas',
    label: 'ADAS Engineer',
    targetRole: 'Autonomous Vehicle Software Engineer',
    duration: '14–18 months',
    difficulty: 'Expert',
    totalXP: 10600,
    nodes: [
      { id: 'auto-vehicle', title: 'Vehicle Dynamics', subtitle: 'Chassis · Powertrain', status: 'completed', xpReward: 1000, estimatedWeeks: 5, aiConfidence: 91, dependencies: [], skills: ['Vehicle Dynamics', 'Suspension', 'Powertrain', 'Braking'], isKeyMilestone: true },
      { id: 'auto-can', title: 'CAN & Automotive Protocols', subtitle: 'LIN · FlexRay · Ethernet', status: 'active', xpReward: 1200, estimatedWeeks: 5, aiConfidence: 78, dependencies: ['auto-vehicle'], skills: ['CAN FD', 'UDS', 'AUTOSAR', 'Diagnostics'] },
      { id: 'auto-adas', title: 'ADAS Systems', subtitle: 'Perception · Fusion', status: 'locked', xpReward: 1600, estimatedWeeks: 7, aiConfidence: 0, dependencies: ['auto-can'], skills: ['Radar', 'LiDAR', 'Camera Fusion', 'MISRA C'], isKeyMilestone: true },
      { id: 'auto-av', title: 'Autonomous Driving Stack', subtitle: 'Planning · Control', status: 'locked', xpReward: 2000, estimatedWeeks: 9, aiConfidence: 0, dependencies: ['auto-adas'], skills: ['ROS', 'Path Planning', 'V2X', 'Safety Standards'], isKeyMilestone: true },
    ],
  },
];

// ── Mechatronics ──────────────────────────────────────────────────────────────
const MECHATRONICS_TRACKS: CareerTrack[] = [
  {
    id: 'mecha-automation',
    label: 'Automation Engineer',
    targetRole: 'Industrial Automation Engineer',
    duration: '10–14 months',
    difficulty: 'Intermediate',
    totalXP: 8400,
    nodes: [
      { id: 'mecha-plc', title: 'PLC & SCADA', subtitle: 'Industrial Automation', status: 'completed', xpReward: 1000, estimatedWeeks: 5, aiConfidence: 93, dependencies: [], skills: ['Siemens PLC', 'Ladder Logic', 'SCADA', 'HMI'], isKeyMilestone: true },
      { id: 'mecha-robotics', title: 'Industrial Robotics', subtitle: 'ABB · FANUC · KUKA', status: 'active', xpReward: 1200, estimatedWeeks: 5, aiConfidence: 81, dependencies: ['mecha-plc'], skills: ['Robot Programming', 'End-Effectors', 'Safety', 'Pick & Place'] },
      { id: 'mecha-control', title: 'Control Engineering', subtitle: 'PID · State Space', status: 'locked', xpReward: 1100, estimatedWeeks: 5, aiConfidence: 0, dependencies: ['mecha-robotics'], skills: ['PID', 'State Space', 'MATLAB/Simulink', 'Model-Based Design'] },
      { id: 'mecha-iiot', title: 'IIoT & Industry 4.0', subtitle: 'Smart Manufacturing', status: 'locked', xpReward: 1400, estimatedWeeks: 6, aiConfidence: 0, dependencies: ['mecha-control'], skills: ['MQTT', 'OPC-UA', 'Edge Computing', 'Digital Twin'], isKeyMilestone: true },
    ],
  },
];

// ── Chemical Engineering ──────────────────────────────────────────────────────
const CHEMICAL_TRACKS: CareerTrack[] = [
  {
    id: 'chem-process',
    label: 'Process Engineer',
    targetRole: 'Senior Process Engineer',
    duration: '10–14 months',
    difficulty: 'Intermediate',
    totalXP: 7600,
    nodes: [
      { id: 'chem-thermo', title: 'Thermodynamics', subtitle: 'Phase Equilibria', status: 'completed', xpReward: 900, estimatedWeeks: 4, aiConfidence: 92, dependencies: [], skills: ['Heat Engines', 'Phase Diagrams', 'Equations of State'], isKeyMilestone: true },
      { id: 'chem-reaction', title: 'Reaction Engineering', subtitle: 'Kinetics · Reactors', status: 'active', xpReward: 1100, estimatedWeeks: 5, aiConfidence: 78, dependencies: ['chem-thermo'], skills: ['CSTR', 'PFR', 'Kinetics', 'Selectivity'] },
      { id: 'chem-process', title: 'Process Simulation', subtitle: 'Aspen Plus · HYSYS', status: 'locked', xpReward: 1200, estimatedWeeks: 5, aiConfidence: 0, dependencies: ['chem-reaction'], skills: ['Aspen Plus', 'HYSYS', 'P&ID', 'HAZOP'], isKeyMilestone: true },
      { id: 'chem-safety', title: 'Process Safety & HSE', subtitle: 'HAZOP · SIL', status: 'locked', xpReward: 900, estimatedWeeks: 4, aiConfidence: 0, dependencies: ['chem-process'], skills: ['HAZOP', 'SIL Assessment', 'LOPA', 'Emergency Response'] },
    ],
  },
];

// ── Master Config ─────────────────────────────────────────────────────────────
export const DOMAIN_ROADMAP_CONFIGS: Record<DomainId, DomainRoadmapConfig> = {
  computer:    { domainId: 'computer',    tracks: COMPUTER_TRACKS },
  aiml:        { domainId: 'aiml',        tracks: AIML_TRACKS },
  robotics:    { domainId: 'robotics',    tracks: ROBOTICS_TRACKS },
  mechanical:  { domainId: 'mechanical',  tracks: MECHANICAL_TRACKS },
  civil:       { domainId: 'civil',       tracks: CIVIL_TRACKS },
  electrical:  { domainId: 'electrical',  tracks: ELECTRICAL_TRACKS },
  electronics: { domainId: 'electronics', tracks: ELECTRONICS_TRACKS },
  aerospace:   { domainId: 'aerospace',   tracks: AEROSPACE_TRACKS },
  biomedical:  { domainId: 'biomedical',  tracks: BIOMEDICAL_TRACKS },
  automobile:  { domainId: 'automobile',  tracks: AUTOMOBILE_TRACKS },
  mechatronics:{ domainId: 'mechatronics',tracks: MECHATRONICS_TRACKS },
  chemical:    { domainId: 'chemical',    tracks: CHEMICAL_TRACKS },
};

export type { NodeStatus, RoadmapNode, CareerTrack, DomainRoadmapConfig };
