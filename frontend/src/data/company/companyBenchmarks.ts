export interface CompanyWeights {
  technical: number;
  problemSolving: number;
  domainExpertise: number;
  communication: number;
  practicalExperience: number;
}

export interface CompanyBenchmark {
  companyId: string;
  minTechnical: number;
  minProblemSolving: number;
  minDomainExpertise: number;
  minCommunication: number;
  minPracticalExperience: number;
  minOverallReadiness: number;
  weights: CompanyWeights;
}

export const COMPANY_BENCHMARKS: Record<string, CompanyBenchmark> = {
  // Software / IT
  tcs: {
    companyId: 'tcs',
    minTechnical: 55,
    minProblemSolving: 55,
    minDomainExpertise: 50,
    minCommunication: 50,
    minPracticalExperience: 45,
    minOverallReadiness: 55,
    weights: {
      technical: 0.25,
      problemSolving: 0.25,
      domainExpertise: 0.20,
      communication: 0.20,
      practicalExperience: 0.10,
    }
  },
  infosys: {
    companyId: 'infosys',
    minTechnical: 58,
    minProblemSolving: 58,
    minDomainExpertise: 50,
    minCommunication: 50,
    minPracticalExperience: 45,
    minOverallReadiness: 56,
    weights: {
      technical: 0.25,
      problemSolving: 0.25,
      domainExpertise: 0.20,
      communication: 0.15,
      practicalExperience: 0.15,
    }
  },
  accenture: {
    companyId: 'accenture',
    minTechnical: 65,
    minProblemSolving: 65,
    minDomainExpertise: 60,
    minCommunication: 60,
    minPracticalExperience: 55,
    minOverallReadiness: 62,
    weights: {
      technical: 0.30,
      problemSolving: 0.20,
      domainExpertise: 0.20,
      communication: 0.20,
      practicalExperience: 0.10,
    }
  },
  capgemini: {
    companyId: 'capgemini',
    minTechnical: 62,
    minProblemSolving: 62,
    minDomainExpertise: 55,
    minCommunication: 60,
    minPracticalExperience: 50,
    minOverallReadiness: 60,
    weights: {
      technical: 0.28,
      problemSolving: 0.22,
      domainExpertise: 0.20,
      communication: 0.18,
      practicalExperience: 0.12,
    }
  },
  cognizant: {
    companyId: 'cognizant',
    minTechnical: 60,
    minProblemSolving: 62,
    minDomainExpertise: 58,
    minCommunication: 55,
    minPracticalExperience: 50,
    minOverallReadiness: 58,
    weights: {
      technical: 0.25,
      problemSolving: 0.25,
      domainExpertise: 0.20,
      communication: 0.15,
      practicalExperience: 0.15,
    }
  },
  wipro: {
    companyId: 'wipro',
    minTechnical: 55,
    minProblemSolving: 55,
    minDomainExpertise: 50,
    minCommunication: 50,
    minPracticalExperience: 45,
    minOverallReadiness: 54,
    weights: {
      technical: 0.25,
      problemSolving: 0.25,
      domainExpertise: 0.20,
      communication: 0.20,
      practicalExperience: 0.10,
    }
  },
  ibm: {
    companyId: 'ibm',
    minTechnical: 75,
    minProblemSolving: 75,
    minDomainExpertise: 70,
    minCommunication: 65,
    minPracticalExperience: 65,
    minOverallReadiness: 72,
    weights: {
      technical: 0.35,
      problemSolving: 0.25,
      domainExpertise: 0.15,
      communication: 0.15,
      practicalExperience: 0.10,
    }
  },
  oracle: {
    companyId: 'oracle',
    minTechnical: 85,
    minProblemSolving: 85,
    minDomainExpertise: 80,
    minCommunication: 70,
    minPracticalExperience: 70,
    minOverallReadiness: 80,
    weights: {
      technical: 0.40,
      problemSolving: 0.30,
      domainExpertise: 0.10,
      communication: 0.10,
      practicalExperience: 0.10,
    }
  },

  // Engineering
  bosch: {
    companyId: 'bosch',
    minTechnical: 72,
    minProblemSolving: 70,
    minDomainExpertise: 75,
    minCommunication: 60,
    minPracticalExperience: 68,
    minOverallReadiness: 70,
    weights: {
      technical: 0.25,
      problemSolving: 0.20,
      domainExpertise: 0.30,
      communication: 0.10,
      practicalExperience: 0.15,
    }
  },
  siemens: {
    companyId: 'siemens',
    minTechnical: 75,
    minProblemSolving: 68,
    minDomainExpertise: 78,
    minCommunication: 60,
    minPracticalExperience: 70,
    minOverallReadiness: 72,
    weights: {
      technical: 0.25,
      problemSolving: 0.15,
      domainExpertise: 0.35,
      communication: 0.10,
      practicalExperience: 0.15,
    }
  },
  'l-and-t': {
    companyId: 'l-and-t',
    minTechnical: 65,
    minProblemSolving: 60,
    minDomainExpertise: 70,
    minCommunication: 55,
    minPracticalExperience: 65,
    minOverallReadiness: 64,
    weights: {
      technical: 0.20,
      problemSolving: 0.10,
      domainExpertise: 0.35,
      communication: 0.10,
      practicalExperience: 0.25,
    }
  },
  'tata-technologies': {
    companyId: 'tata-technologies',
    minTechnical: 68,
    minProblemSolving: 62,
    minDomainExpertise: 72,
    minCommunication: 58,
    minPracticalExperience: 60,
    minOverallReadiness: 66,
    weights: {
      technical: 0.22,
      problemSolving: 0.12,
      domainExpertise: 0.30,
      communication: 0.11,
      practicalExperience: 0.25,
    }
  },
  abb: {
    companyId: 'abb',
    minTechnical: 78,
    minProblemSolving: 72,
    minDomainExpertise: 80,
    minCommunication: 65,
    minPracticalExperience: 75,
    minOverallReadiness: 75,
    weights: {
      technical: 0.25,
      problemSolving: 0.20,
      domainExpertise: 0.30,
      communication: 0.10,
      practicalExperience: 0.15,
    }
  }
};

export const getCompanyBenchmark = (id: string): CompanyBenchmark | undefined =>
  COMPANY_BENCHMARKS[id];

/**
 * Calculates the company-specific readiness score (0-100) using custom weights.
 */
export const calculateCompanyReadinessScore = (
  benchmark: CompanyBenchmark,
  profile: {
    technical: number;
    problemSolving: number;
    domainExpertise: number;
    communication: number;
    practicalExperience: number;
  }
): number => {
  const { technical, problemSolving, domainExpertise, communication, practicalExperience } = profile;
  const { weights } = benchmark;

  const score =
    technical           * weights.technical +
    problemSolving      * weights.problemSolving +
    domainExpertise     * weights.domainExpertise +
    communication       * weights.communication +
    practicalExperience * weights.practicalExperience;

  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Calculates a match score (0-100) representing how close the user is to meeting or exceeding
 * the company's minimum benchmarks. Meet/exceed all = 100%.
 */
export const calculateCompanyMatchScore = (
  benchmark: CompanyBenchmark,
  profile: {
    technical: number;
    problemSolving: number;
    domainExpertise: number;
    communication: number;
    practicalExperience: number;
  }
): number => {
  const { technical, problemSolving, domainExpertise, communication, practicalExperience } = profile;

  // Percentage of benchmark achieved per category, capped at 100%
  const techPct = benchmark.minTechnical > 0 ? Math.min(1, technical / benchmark.minTechnical) : 1;
  const probPct = benchmark.minProblemSolving > 0 ? Math.min(1, problemSolving / benchmark.minProblemSolving) : 1;
  const domPct  = benchmark.minDomainExpertise > 0 ? Math.min(1, domainExpertise / benchmark.minDomainExpertise) : 1;
  const commPct = benchmark.minCommunication > 0 ? Math.min(1, communication / benchmark.minCommunication) : 1;
  const pracPct = benchmark.minPracticalExperience > 0 ? Math.min(1, practicalExperience / benchmark.minPracticalExperience) : 1;

  // Average of pcts, scale to 0-100
  const match = ((techPct + probPct + domPct + commPct + pracPct) / 5) * 100;
  return Math.max(0, Math.min(100, Math.round(match)));
};
