// Lightweight supplement catalog — stub entries for domains not in engineeringCourses.ts
// These are rendered in the CoursesPage domain-switching UI.
// Full module data lives in engineeringCourses.ts for CS/AI/Mech/Robotics.

import type { DomainId, AccentColor } from './engineeringDomains';
import type { DifficultyLevel } from './engineeringCourses';

export interface CourseCatalogEntry {
  id: string;
  domainId: DomainId;
  title: string;
  subtitle: string;
  color: AccentColor;
  difficulty: DifficultyLevel;
  totalHours: number;
  matchScore: number;
  skills: string[];
  tags: string[];
  roadmapSync: boolean;
}

export const COURSE_CATALOG: CourseCatalogEntry[] = [
  // ── Computer Engineering ──────────────────────────────────────────────
  { id: 'cs-dsa-mastery',     domainId: 'computer',     title: 'DSA Mastery',               subtitle: 'Algorithms & Data Structures',       color: 'violet',  difficulty: 'Intermediate', totalHours: 32, matchScore: 98, skills: ['Arrays', 'Trees', 'DP', 'Graphs'],        tags: ['SWE', 'Interviews'],    roadmapSync: true },
  { id: 'cs-system-design',   domainId: 'computer',     title: 'System Design Deep Dive',    subtitle: 'Distributed Systems · Architecture',  color: 'cyan',    difficulty: 'Advanced',     totalHours: 28, matchScore: 94, skills: ['Microservices', 'Kafka', 'Caching'],      tags: ['Senior SWE'],           roadmapSync: true },
  { id: 'cs-react-ts',        domainId: 'computer',     title: 'React & TypeScript',         subtitle: 'Modern Frontend Engineering',         color: 'indigo',  difficulty: 'Intermediate', totalHours: 20, matchScore: 88, skills: ['React', 'TypeScript', 'Testing'],         tags: ['Frontend'],             roadmapSync: false },
  // ── AI/ML ──────────────────────────────────────────────────────────────
  { id: 'aiml-deep-learning', domainId: 'aiml',         title: 'Deep Learning Engineering',  subtitle: 'CNNs · Transformers · PyTorch',       color: 'fuchsia', difficulty: 'Advanced',     totalHours: 40, matchScore: 95, skills: ['PyTorch', 'CNNs', 'Transformers'],        tags: ['AI Research'],          roadmapSync: true },
  { id: 'aiml-mlops',         domainId: 'aiml',         title: 'MLOps & Production AI',      subtitle: 'MLflow · Kubeflow · Feature Stores',  color: 'violet',  difficulty: 'Expert',       totalHours: 24, matchScore: 87, skills: ['MLflow', 'Docker', 'A/B Testing'],        tags: ['MLOps'],                roadmapSync: true },
  // ── Robotics ───────────────────────────────────────────────────────────
  { id: 'rob-ros2-mastery',   domainId: 'robotics',     title: 'ROS2 & Autonomous Systems',  subtitle: 'Navigation · SLAM · Gazebo',         color: 'cyan',    difficulty: 'Advanced',     totalHours: 36, matchScore: 90, skills: ['ROS2', 'Nav2', 'SLAM'],                  tags: ['Autonomous'],           roadmapSync: true },
  { id: 'rob-perception',     domainId: 'robotics',     title: 'Robot Perception',           subtitle: 'OpenCV · Point Clouds · YOLO',        color: 'sky',     difficulty: 'Advanced',     totalHours: 28, matchScore: 84, skills: ['OpenCV', 'LiDAR', 'YOLO'],               tags: ['Perception'],           roadmapSync: false },
  // ── Mechanical ─────────────────────────────────────────────────────────
  { id: 'mech-fea-mastery',   domainId: 'mechanical',   title: 'FEA & Structural Analysis',  subtitle: 'ANSYS · Meshing · Thermal · CFD',    color: 'emerald', difficulty: 'Advanced',     totalHours: 30, matchScore: 92, skills: ['ANSYS', 'FEA', 'CFD'],                   tags: ['Simulation'],           roadmapSync: true },
  { id: 'mech-cad',           domainId: 'mechanical',   title: 'CAD Mastery',                subtitle: 'SolidWorks · GD&T · Assemblies',     color: 'emerald', difficulty: 'Intermediate', totalHours: 22, matchScore: 89, skills: ['SolidWorks', 'GD&T', 'Sheet Metal'],      tags: ['Design'],               roadmapSync: true },
  // ── Civil ──────────────────────────────────────────────────────────────
  { id: 'civ-structural',     domainId: 'civil',        title: 'Structural Analysis',        subtitle: 'STAAD · ETABS · IS 456',             color: 'emerald', difficulty: 'Intermediate', totalHours: 26, matchScore: 88, skills: ['STAAD.Pro', 'ETABS', 'Load Cases'],       tags: ['Structural'],           roadmapSync: true },
  { id: 'civ-bim',            domainId: 'civil',        title: 'BIM & Revit Mastery',        subtitle: 'Revit · Navisworks · Coordination',  color: 'sky',     difficulty: 'Intermediate', totalHours: 18, matchScore: 82, skills: ['Revit', 'BIM', 'Navisworks'],             tags: ['BIM'],                  roadmapSync: false },
  // ── Electrical ─────────────────────────────────────────────────────────
  { id: 'elec-power-sys',     domainId: 'electrical',   title: 'Power Systems Engineering',  subtitle: 'Load Flow · Protection · SCADA',     color: 'amber',   difficulty: 'Advanced',     totalHours: 28, matchScore: 88, skills: ['Power Flow', 'Protection', 'SCADA'],      tags: ['Power Systems'],        roadmapSync: true },
  { id: 'elec-drives',        domainId: 'electrical',   title: 'Electric Drives & PE',       subtitle: 'Inverters · VFDs · Motor Control',   color: 'amber',   difficulty: 'Advanced',     totalHours: 22, matchScore: 84, skills: ['Inverters', 'VFD', 'MPPT'],               tags: ['Power Electronics'],    roadmapSync: false },
  // ── Electronics ────────────────────────────────────────────────────────
  { id: 'ece-vlsi',           domainId: 'electronics',  title: 'VLSI Design',                subtitle: 'Verilog · CMOS · Physical Design',   color: 'indigo',  difficulty: 'Expert',       totalHours: 32, matchScore: 90, skills: ['Verilog', 'CMOS', 'DRC/LVS'],            tags: ['VLSI'],                 roadmapSync: true },
  { id: 'ece-embedded',       domainId: 'electronics',  title: 'Embedded Systems',           subtitle: 'ARM · RTOS · PCB Design',            color: 'violet',  difficulty: 'Intermediate', totalHours: 24, matchScore: 85, skills: ['STM32', 'FreeRTOS', 'UART/SPI'],          tags: ['Embedded'],             roadmapSync: false },
  // ── Aerospace ──────────────────────────────────────────────────────────
  { id: 'aero-aero',          domainId: 'aerospace',    title: 'Aerodynamics & CFD',         subtitle: 'XFOIL · OpenFOAM · CFD Workflows',   color: 'sky',     difficulty: 'Advanced',     totalHours: 28, matchScore: 89, skills: ['CFD', 'XFOIL', 'Mesh Generation'],        tags: ['Aerodynamics'],         roadmapSync: true },
  { id: 'aero-gnc',           domainId: 'aerospace',    title: 'GNC Systems',                subtitle: 'Kalman Filter · MATLAB · Simulink',  color: 'violet',  difficulty: 'Expert',       totalHours: 34, matchScore: 83, skills: ['Kalman Filter', 'Simulink', 'State Space'], tags: ['GNC'],                 roadmapSync: true },
  // ── Biomedical ─────────────────────────────────────────────────────────
  { id: 'bme-signals',        domainId: 'biomedical',   title: 'Biomedical Signal Processing', subtitle: 'ECG · EEG · MATLAB · Python',      color: 'rose',    difficulty: 'Intermediate', totalHours: 22, matchScore: 87, skills: ['ECG Analysis', 'Filters', 'Python'],      tags: ['Biomedical'],           roadmapSync: true },
  { id: 'bme-device',         domainId: 'biomedical',   title: 'Medical Device Design',      subtitle: 'FDA · ISO 13485 · Risk Mgmt',        color: 'fuchsia', difficulty: 'Advanced',     totalHours: 26, matchScore: 82, skills: ['Design Controls', 'FMEA', 'Validation'],  tags: ['Regulatory'],           roadmapSync: false },
  // ── Automobile ─────────────────────────────────────────────────────────
  { id: 'auto-adas',          domainId: 'automobile',   title: 'ADAS & Autonomous Driving',  subtitle: 'Radar · LiDAR · MISRA C',            color: 'amber',   difficulty: 'Expert',       totalHours: 36, matchScore: 88, skills: ['ADAS', 'Sensor Fusion', 'ROS'],           tags: ['Autonomous Vehicle'],   roadmapSync: true },
  { id: 'auto-can',           domainId: 'automobile',   title: 'CAN Bus & AUTOSAR',          subtitle: 'CAN FD · UDS · ECU Development',     color: 'sky',     difficulty: 'Advanced',     totalHours: 22, matchScore: 83, skills: ['CAN FD', 'UDS', 'AUTOSAR'],               tags: ['Automotive SW'],        roadmapSync: false },
  // ── Mechatronics ───────────────────────────────────────────────────────
  { id: 'mecha-plc',          domainId: 'mechatronics', title: 'PLC & Industrial Automation', subtitle: 'Siemens · Ladder Logic · SCADA',     color: 'sky',     difficulty: 'Intermediate', totalHours: 24, matchScore: 91, skills: ['PLC', 'SCADA', 'HMI', 'Modbus'],         tags: ['Automation'],           roadmapSync: true },
  { id: 'mecha-iiot',         domainId: 'mechatronics', title: 'IIoT & Industry 4.0',        subtitle: 'MQTT · OPC-UA · Digital Twin',        color: 'cyan',    difficulty: 'Advanced',     totalHours: 20, matchScore: 86, skills: ['MQTT', 'OPC-UA', 'Edge Computing'],       tags: ['Industry 4.0'],         roadmapSync: false },
  // ── Chemical ───────────────────────────────────────────────────────────
  { id: 'chem-aspen',         domainId: 'chemical',     title: 'Process Simulation',         subtitle: 'Aspen Plus · HYSYS · P&ID',          color: 'fuchsia', difficulty: 'Intermediate', totalHours: 26, matchScore: 90, skills: ['Aspen Plus', 'HYSYS', 'P&ID'],            tags: ['Process Eng'],          roadmapSync: true },
  { id: 'chem-safety',        domainId: 'chemical',     title: 'Process Safety & HAZOP',     subtitle: 'HAZOP · SIL · LOPA',                 color: 'amber',   difficulty: 'Advanced',     totalHours: 18, matchScore: 84, skills: ['HAZOP', 'SIL', 'LOPA', 'PSM'],           tags: ['HSE'],                  roadmapSync: false },
];
