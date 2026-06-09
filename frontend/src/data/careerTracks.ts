import type { DomainId } from './engineeringDomains';

export type CareerLevel = 'Fresher' | 'Junior' | 'Mid-Level' | 'Senior' | 'Lead';

export interface CareerTrack {
  domainId: DomainId;
  /** Entry-level role for a fresh graduate */
  entryRole: string;
  /** Typical next role (1-3 years) */
  midRole: string;
  /** Target senior role (4-7 years) */
  seniorRole: string;
  /** Minimum readiness % to be considered placement-ready */
  readinessThreshold: number; // 0-100
  /** Key skills evaluated during placement */
  coreEvaluationSkills: string[];
  /** Estimated time to placement-ready at average velocity (weeks) */
  avgWeeksToReadiness: number;
}

export const CAREER_TRACKS: Record<DomainId, CareerTrack> = {
  computer: {
    domainId: 'computer',
    entryRole: 'Associate Software Engineer',
    midRole: 'Software Engineer II',
    seniorRole: 'Senior Software Engineer',
    readinessThreshold: 72,
    coreEvaluationSkills: ['dsa', 'system-design', 'os-concepts', 'databases', 'cloud-basics'],
    avgWeeksToReadiness: 20,
  },
  aiml: {
    domainId: 'aiml',
    entryRole: 'Junior ML Engineer',
    midRole: 'ML Engineer',
    seniorRole: 'Senior AI/ML Engineer',
    readinessThreshold: 75,
    coreEvaluationSkills: ['ml-fundamentals', 'deep-learning', 'python', 'mlops', 'statistics'],
    avgWeeksToReadiness: 24,
  },
  robotics: {
    domainId: 'robotics',
    entryRole: 'Robotics Systems Engineer I',
    midRole: 'Robotics Engineer',
    seniorRole: 'Senior Robotics Engineer',
    readinessThreshold: 70,
    coreEvaluationSkills: ['ros2', 'sensor-fusion', 'kinematics', 'embedded-c', 'control-theory'],
    avgWeeksToReadiness: 26,
  },
  mechatronics: {
    domainId: 'mechatronics',
    entryRole: 'Junior Mechatronics Engineer',
    midRole: 'Mechatronics Engineer',
    seniorRole: 'Senior Automation Engineer',
    readinessThreshold: 68,
    coreEvaluationSkills: ['plc-programming', 'embedded-systems', 'cad', 'control-systems', 'pneumatics'],
    avgWeeksToReadiness: 22,
  },
  electrical: {
    domainId: 'electrical',
    entryRole: 'Graduate Engineer Trainee (EE)',
    midRole: 'Electrical Engineer',
    seniorRole: 'Senior Power Systems Engineer',
    readinessThreshold: 65,
    coreEvaluationSkills: ['power-systems', 'circuit-analysis', 'protection-relaying', 'scada', 'load-flow'],
    avgWeeksToReadiness: 18,
  },
  electronics: {
    domainId: 'electronics',
    entryRole: 'Junior Design Engineer',
    midRole: 'Electronics Design Engineer',
    seniorRole: 'Senior VLSI Engineer',
    readinessThreshold: 70,
    coreEvaluationSkills: ['vlsi-design', 'pcb-design', 'vhdl-verilog', 'signal-processing', 'embedded-c'],
    avgWeeksToReadiness: 22,
  },
  mechanical: {
    domainId: 'mechanical',
    entryRole: 'Graduate Engineer Trainee (ME)',
    midRole: 'Mechanical Design Engineer',
    seniorRole: 'Senior Mechanical Engineer',
    readinessThreshold: 65,
    coreEvaluationSkills: ['cad-solidworks', 'fea-ansys', 'thermodynamics', 'gd-t', 'manufacturing-processes'],
    avgWeeksToReadiness: 18,
  },
  civil: {
    domainId: 'civil',
    entryRole: 'Junior Site Engineer',
    midRole: 'Civil Engineer',
    seniorRole: 'Senior Structural Engineer',
    readinessThreshold: 63,
    coreEvaluationSkills: ['structural-analysis', 'staad-pro', 'autocad', 'soil-mechanics', 'project-management'],
    avgWeeksToReadiness: 16,
  },
  aerospace: {
    domainId: 'aerospace',
    entryRole: 'Junior Aerospace Engineer',
    midRole: 'Aerospace Systems Engineer',
    seniorRole: 'Senior Aerospace Engineer',
    readinessThreshold: 73,
    coreEvaluationSkills: ['aerodynamics', 'cfd', 'propulsion', 'gnc', 'matlab-simulink'],
    avgWeeksToReadiness: 28,
  },
  biomedical: {
    domainId: 'biomedical',
    entryRole: 'Junior Biomedical Engineer',
    midRole: 'Biomedical Systems Engineer',
    seniorRole: 'Senior Medical Device Engineer',
    readinessThreshold: 68,
    coreEvaluationSkills: ['medical-device-standards', 'signal-processing', 'bioinformatics', 'regulatory-compliance', 'matlab'],
    avgWeeksToReadiness: 22,
  },
  automobile: {
    domainId: 'automobile',
    entryRole: 'Graduate Engineer Trainee (Auto)',
    midRole: 'Automotive Engineer',
    seniorRole: 'Senior Vehicle Systems Engineer',
    readinessThreshold: 68,
    coreEvaluationSkills: ['vehicle-dynamics', 'adas-algorithms', 'ev-powertrain', 'autosar', 'matlab-simulink'],
    avgWeeksToReadiness: 22,
  },
  chemical: {
    domainId: 'chemical',
    entryRole: 'Junior Process Engineer',
    midRole: 'Process Engineer',
    seniorRole: 'Senior Chemical Engineer',
    readinessThreshold: 65,
    coreEvaluationSkills: ['process-simulation', 'aspen-hysys', 'reaction-engineering', 'thermodynamics', 'hse'],
    avgWeeksToReadiness: 18,
  },
};

export const getCareerTrack = (domainId: DomainId): CareerTrack =>
  CAREER_TRACKS[domainId];

/**
 * Maps an absolute score against a domain threshold to a career level.
 * Thresholds are relative to the domain's readinessThreshold:
 *   < 40% of threshold → Fresher
 *   40–60% of threshold → Junior
 *   60–75% of threshold → Mid-Level
 *   75–90% of threshold → Senior
 *   ≥ 90% of threshold → Lead
 */
export const getReadinessLevel = (score: number, threshold: number): CareerLevel => {
  const pct = threshold > 0 ? (score / threshold) * 100 : 0;
  if (pct < 40) return 'Fresher';
  if (pct < 60) return 'Junior';
  if (pct < 75) return 'Mid-Level';
  if (pct < 90) return 'Senior';
  return 'Lead';
};
