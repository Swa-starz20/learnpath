// ── Interview Tracks Configuration ───────────────────────────────────────────
// Config-driven, domain-agnostic. Zero CS-only assumptions.
// Supports: Technical | Aptitude | HR | Domain for all 12 engineering disciplines.

import type { DomainId } from '../engineeringDomains';

// ── Interview Type ────────────────────────────────────────────────────────────

export type InterviewType = 'technical' | 'aptitude' | 'hr' | 'domain';

export type InterviewDifficulty = 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert';

export type InterviewStatus = 'locked' | 'available' | 'in_progress' | 'completed';

// ── Interview Track Definition ────────────────────────────────────────────────

export interface InterviewTrack {
  id: InterviewType;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  color: 'violet' | 'cyan' | 'fuchsia' | 'amber';
  /** Minimum readiness % to unlock this track */
  minReadiness: number;
  /** Categories tested in this track */
  evaluationAreas: string[];
  /** Typical duration in minutes */
  durationMinutes: number;
  /** Number of simulated rounds */
  rounds: number;
}

export const INTERVIEW_TRACKS: InterviewTrack[] = [
  {
    id: 'technical',
    label: 'Technical Interview',
    shortLabel: 'Technical',
    description: 'Domain-specific engineering problems, design challenges, and system reasoning.',
    icon: '⚙️',
    color: 'violet',
    minReadiness: 50,
    evaluationAreas: ['Core Engineering', 'Problem Design', 'Calculations', 'System Thinking'],
    durationMinutes: 60,
    rounds: 3,
  },
  {
    id: 'aptitude',
    label: 'Aptitude Interview',
    shortLabel: 'Aptitude',
    description: 'Quantitative reasoning, logical deduction, and engineering mathematics.',
    icon: '🧩',
    color: 'cyan',
    minReadiness: 30,
    evaluationAreas: ['Quantitative', 'Logical Reasoning', 'Verbal', 'Spatial Reasoning'],
    durationMinutes: 45,
    rounds: 2,
  },
  {
    id: 'hr',
    label: 'HR Interview',
    shortLabel: 'HR',
    description: 'Behavioural competencies, cultural fit, and professional communication.',
    icon: '💬',
    color: 'amber',
    minReadiness: 20,
    evaluationAreas: ['Behavioural', 'Leadership', 'Teamwork', 'Communication'],
    durationMinutes: 30,
    rounds: 1,
  },
  {
    id: 'domain',
    label: 'Domain Interview',
    shortLabel: 'Domain',
    description: 'Deep specialization knowledge, standards, tools, and advanced concepts.',
    icon: '🎓',
    color: 'fuchsia',
    minReadiness: 65,
    evaluationAreas: ['Specialization', 'Industry Standards', 'Tools & Methods', 'Research Depth'],
    durationMinutes: 75,
    rounds: 3,
  },
];

// ── Domain-specific Technical Focus Areas ────────────────────────────────────
// Defines what "Technical Interview" means for each engineering domain.
// Ensures zero CS-only assumptions.

export interface DomainInterviewFocus {
  domainId: DomainId;
  technicalAreas: string[];   // what's evaluated in technical round
  domainAreas: string[];      // what's evaluated in domain round
  aptitudeAreas: string[];    // domain-specific aptitude topics
  /** Representative question categories */
  sampleTopics: string[];
}

export const DOMAIN_INTERVIEW_FOCUS: Record<DomainId, DomainInterviewFocus> = {
  computer: {
    domainId: 'computer',
    technicalAreas: ['Data Structures', 'Algorithms', 'System Design', 'OS Fundamentals', 'Networks'],
    domainAreas: ['Distributed Systems', 'Cloud Architecture', 'Database Design', 'Security'],
    aptitudeAreas: ['Coding Logic', 'Complexity Analysis', 'Math Reasoning'],
    sampleTopics: ['Array manipulation', 'Tree traversal', 'REST API design', 'Scalability'],
  },
  aiml: {
    domainId: 'aiml',
    technicalAreas: ['Linear Algebra', 'Probability', 'ML Fundamentals', 'Neural Networks', 'Optimization'],
    domainAreas: ['LLM Architecture', 'MLOps', 'Model Evaluation', 'Feature Engineering'],
    aptitudeAreas: ['Statistics', 'Matrix Operations', 'Probability Reasoning'],
    sampleTopics: ['Backpropagation', 'Attention mechanisms', 'Overfitting', 'Bias-variance tradeoff'],
  },
  robotics: {
    domainId: 'robotics',
    technicalAreas: ['Control Theory', 'Kinematics', 'Sensor Fusion', 'ROS2', 'Embedded C'],
    domainAreas: ['Path Planning', 'SLAM', 'Actuator Design', 'Perception Pipelines'],
    aptitudeAreas: ['Spatial Reasoning', 'Physics', 'Matrix Transformations'],
    sampleTopics: ['PID tuning', 'Forward kinematics', 'Kalman filter', 'ROS2 topics'],
  },
  mechanical: {
    domainId: 'mechanical',
    technicalAreas: ['Statics', 'Dynamics', 'Thermodynamics', 'Fluid Mechanics', 'Material Science'],
    domainAreas: ['FEA/CAE', 'CAD Design', 'Manufacturing Processes', 'Tolerance Analysis'],
    aptitudeAreas: ['Engineering Maths', 'Physics', 'Spatial Reasoning'],
    sampleTopics: ['Stress-strain curves', 'Heat transfer', 'Gear design', 'GD&T'],
  },
  electrical: {
    domainId: 'electrical',
    technicalAreas: ['Circuit Analysis', 'Power Systems', 'Machines', 'Control Systems', 'Electromagnetics'],
    domainAreas: ['Grid Design', 'Protection Systems', 'SCADA', 'Transformer Design'],
    aptitudeAreas: ['Electrical Maths', 'Physics', 'Numerical Reasoning'],
    sampleTopics: ['Fault analysis', 'Load flow', 'Motor drives', 'Per-unit systems'],
  },
  electronics: {
    domainId: 'electronics',
    technicalAreas: ['Analog Circuits', 'Digital Logic', 'Signal Processing', 'VLSI', 'Microcontrollers'],
    domainAreas: ['PCB Layout', 'RF Design', 'FPGA Programming', 'Embedded Systems'],
    aptitudeAreas: ['Circuit Math', 'Boolean Algebra', 'Signal Analysis'],
    sampleTopics: ['Op-amp design', 'Flip-flop design', 'FFT', 'CMOS logic'],
  },
  civil: {
    domainId: 'civil',
    technicalAreas: ['Structural Analysis', 'Geotechnics', 'Fluid Mechanics', 'Surveying', 'Construction'],
    domainAreas: ['BIM Software', 'IS/IRC Codes', 'Urban Planning', 'Infrastructure Design'],
    aptitudeAreas: ['Engineering Maths', 'Estimation', 'Spatial Reasoning'],
    sampleTopics: ['Beam design', 'Soil bearing capacity', 'SFD/BMD', 'Project scheduling'],
  },
  aerospace: {
    domainId: 'aerospace',
    technicalAreas: ['Aerodynamics', 'Flight Mechanics', 'Propulsion', 'Structures', 'Avionics'],
    domainAreas: ['GNC Systems', 'Spacecraft Design', 'CFD Analysis', 'Mission Planning'],
    aptitudeAreas: ['Physics', 'Differential Equations', 'Vector Math'],
    sampleTopics: ['Lift-drag ratio', 'Orbital mechanics', 'Nozzle design', 'Control surfaces'],
  },
  biomedical: {
    domainId: 'biomedical',
    technicalAreas: ['Bioinstrumentation', 'Signal Processing', 'Biomechanics', 'Physiology', 'Medical Devices'],
    domainAreas: ['Regulatory (FDA/CE)', 'Bioinformatics', 'Imaging Systems', 'Clinical Trials'],
    aptitudeAreas: ['Statistics', 'Biology Basics', 'Signal Math'],
    sampleTopics: ['ECG signal analysis', 'Implant materials', 'DICOM standards', 'ISO 13485'],
  },
  automobile: {
    domainId: 'automobile',
    technicalAreas: ['Vehicle Dynamics', 'Engine Design', 'ADAS Systems', 'EV Technology', 'CAD'],
    domainAreas: ['Powertrain Systems', 'Chassis Engineering', 'Automotive Software', 'AUTOSAR'],
    aptitudeAreas: ['Mechanics', 'Thermodynamics', 'Numerical Reasoning'],
    sampleTopics: ['Torque curves', 'Battery management', 'Suspension design', 'CAN protocol'],
  },
  chemical: {
    domainId: 'chemical',
    technicalAreas: ['Thermodynamics', 'Mass Transfer', 'Reaction Engineering', 'Process Control', 'Safety'],
    domainAreas: ['Process Simulation', 'HAZOP', 'Materials Science', 'Plant Design'],
    aptitudeAreas: ['Chemistry', 'Engineering Math', 'Process Reasoning'],
    sampleTopics: ['Heat exchanger design', 'Distillation', 'PFD/P&ID', 'Process optimization'],
  },
  mechatronics: {
    domainId: 'mechatronics',
    technicalAreas: ['Control Systems', 'Sensors & Actuators', 'Embedded Systems', 'Mechanical Design', 'PLCs'],
    domainAreas: ['Industrial Automation', 'SCADA Integration', 'IoT Systems', 'Motion Control'],
    aptitudeAreas: ['Physics', 'Control Math', 'Logic Reasoning'],
    sampleTopics: ['PLC ladder logic', 'Servo tuning', 'Sensor integration', 'State machines'],
  },
};

// ── Mock Session Definition ───────────────────────────────────────────────────

export interface MockInterviewSession {
  id: string;
  trackId: InterviewType;
  domainId: DomainId;
  difficulty: InterviewDifficulty;
  label: string;
  /** Minimum readiness score to attempt */
  minReadiness: number;
  /** What skills / topics this session focuses on */
  focusAreas: string[];
  durationMinutes: number;
  /** Whether this session is AI-evaluated */
  aiEvaluated: boolean;
}

/** Generate mock sessions for a domain and track type. */
export const getMockSessions = (
  domainId: DomainId,
  trackId: InterviewType,
): MockInterviewSession[] => {
  const focus = DOMAIN_INTERVIEW_FOCUS[domainId];
  const track = INTERVIEW_TRACKS.find(t => t.id === trackId)!;

  const areas =
    trackId === 'technical' ? focus.technicalAreas :
    trackId === 'domain'    ? focus.domainAreas :
    trackId === 'aptitude'  ? focus.aptitudeAreas :
    track.evaluationAreas;

  const difficulties: InterviewDifficulty[] = ['Foundational', 'Intermediate', 'Advanced'];
  const minReadiness = [25, 50, 70];

  return difficulties.map((difficulty, i) => ({
    id: `${domainId}-${trackId}-${difficulty.toLowerCase()}`,
    trackId,
    domainId,
    difficulty,
    label: `${difficulty} ${track.shortLabel} Simulation`,
    minReadiness: minReadiness[i],
    focusAreas: areas.slice(0, 3),
    durationMinutes: Math.round(track.durationMinutes * (0.7 + i * 0.2)),
    aiEvaluated: true,
  }));
};
