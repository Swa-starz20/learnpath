// Assessment mock data and types for the entire assessment module
// Used across AssessmentsPage, PersonalityAssessment, AptitudeAssessment, 
// BehavioralAnalysis, and AssessmentResults



// ── Types ─────────────────────────────────────────────────────────────────

export type AssessmentColor = "violet" | "cyan" | "fuchsia" | "amber";
export type AssessmentStatus = "not_started" | "in_progress" | "completed";
export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export interface AssessmentMeta {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: DifficultyLevel;
  status: AssessmentStatus;
  progress?: number;
  color: AssessmentColor;
  iconName: string; // lucide icon name
  questions: number;
  type: "personality" | "aptitude" | "behavioral" | "technical" | "career";
}

export interface QuestionData {
  id: string;
  text: string;
  subtitle?: string;
  options: {
    id: string;
    letter: "A" | "B" | "C" | "D";
    title: string;
    description: string;
  }[];
}

export interface CareerRoleCompatibility {
  role: string;
  compatibility: number;
  personalityMatch: string;
  growthPotential: "High" | "Very High" | "Exceptional";
  learningPath: string;
  aiConfidence: number;
  color: AssessmentColor;
}

export interface BehavioralMetric {
  subject: string;
  value: number;
  fullMark: number;
}

// ── Assessment Cards Data ─────────────────────────────────────────────────

export const assessmentCatalog: AssessmentMeta[] = [
  {
    id: "personality",
    title: "Personality Profiling",
    description: "Discover your cognitive patterns, decision-making style, and behavioral tendencies.",
    category: "Cognitive Science",
    duration: "18 min",
    difficulty: "Beginner",
    status: "in_progress",
    progress: 64,
    color: "violet",
    iconName: "brain",
    questions: 25,
    type: "personality",
  },
  {
    id: "aptitude",
    title: "Aptitude Analysis",
    description: "Evaluate logical reasoning, quantitative skills, and analytical thinking depth.",
    category: "Engineering Intelligence",
    duration: "35 min",
    difficulty: "Intermediate",
    status: "not_started",
    color: "cyan",
    iconName: "zap",
    questions: 40,
    type: "aptitude",
  },
  {
    id: "behavioral",
    title: "Behavioral Intelligence",
    description: "AI-powered analysis of your collaboration, leadership, and adaptability patterns.",
    category: "Behavioral Science",
    duration: "22 min",
    difficulty: "Intermediate",
    status: "completed",
    progress: 100,
    color: "fuchsia",
    iconName: "activity",
    questions: 30,
    type: "behavioral",
  },
  {
    id: "technical",
    title: "Technical Readiness",
    description: "Measure your engineering aptitude across algorithms, system design, and CS fundamentals.",
    category: "Technical Engineering",
    duration: "45 min",
    difficulty: "Advanced",
    status: "not_started",
    color: "amber",
    iconName: "code2",
    questions: 50,
    type: "technical",
  },
  {
    id: "career",
    title: "Career Alignment",
    description: "AI aligns your unique profile with the optimal engineering career trajectories.",
    category: "Career Intelligence",
    duration: "12 min",
    difficulty: "Beginner",
    status: "not_started",
    color: "cyan",
    iconName: "target",
    questions: 20,
    type: "career",
  },
];

// ── Personality Questions ─────────────────────────────────────────────────

export const personalityQuestions: QuestionData[] = [
  {
    id: "p1",
    text: "You are leading a project where a critical team member has just missed a key deadline due to personal reasons. How do you navigate the situation?",
    subtitle: "Select the response that most closely aligns with your natural approach.",
    options: [
      {
        id: "p1a", letter: "A", title: "Empathetic Adjustment",
        description: "Offer support for their personal situation and redistribute their tasks among the team temporarily to maintain momentum.",
      },
      {
        id: "p1b", letter: "B", title: "Process Optimization",
        description: "Analyze why the process didn't flag the delay earlier and implement a new automated tracking system to prevent future lapses.",
      },
      {
        id: "p1c", letter: "C", title: "Performance-First Directive",
        description: "Request a catch-up plan from the member immediately and clearly communicate the downstream impact on the project timeline.",
      },
      {
        id: "p1d", letter: "D", title: "Collaborative Recovery",
        description: "Convene a team retrospective to collectively identify solutions that address both the immediate gap and team morale.",
      },
    ],
  },
  {
    id: "p2",
    text: "When presented with a completely new complex technology, what is your instinctive first step?",
    subtitle: "Choose the approach that most accurately reflects your learning style.",
    options: [
      {
        id: "p2a", letter: "A", title: "Deep Documentation Dive",
        description: "Read the official documentation thoroughly before writing a single line of code.",
      },
      {
        id: "p2b", letter: "B", title: "Hands-On Exploration",
        description: "Build a small proof-of-concept immediately to understand the practical behavior.",
      },
      {
        id: "p2c", letter: "C", title: "Community Research",
        description: "Search forums, blog posts, and expert opinions to gather diverse perspectives first.",
      },
      {
        id: "p2d", letter: "D", title: "Structured Decomposition",
        description: "Break the technology into its core components and study each subsystem independently.",
      },
    ],
  },
  {
    id: "p3",
    text: "A stakeholder insists on a technical approach you believe is fundamentally flawed. How do you respond?",
    subtitle: "Select your most authentic response pattern.",
    options: [
      {
        id: "p3a", letter: "A", title: "Data-Driven Persuasion",
        description: "Prepare a detailed technical analysis with benchmarks and present the evidence diplomatically.",
      },
      {
        id: "p3b", letter: "B", title: "Prototype Proof",
        description: "Build a quick prototype demonstrating both approaches side-by-side to let the results speak.",
      },
      {
        id: "p3c", letter: "C", title: "Collaborative Consensus",
        description: "Organize a technical review session with multiple senior engineers to reach an objective decision.",
      },
      {
        id: "p3d", letter: "D", title: "Pragmatic Compliance",
        description: "Implement the requested approach while documenting concerns and proposing a future review milestone.",
      },
    ],
  },
  {
    id: "p4",
    text: "How do you typically respond when your code receives significant critical feedback in a review?",
    subtitle: "Choose the response that resonates most naturally with you.",
    options: [
      {
        id: "p4a", letter: "A", title: "Analytical Reflection",
        description: "Review each comment systematically, question any feedback that seems unclear, and implement improvements thoughtfully.",
      },
      {
        id: "p4b", letter: "B", title: "Immediate Action",
        description: "Address all critical feedback in the next commit cycle and treat it as a checklist to complete efficiently.",
      },
      {
        id: "p4c", letter: "C", title: "Learning Opportunity",
        description: "Schedule a discussion with the reviewer to deeply understand the architectural principles behind the feedback.",
      },
      {
        id: "p4d", letter: "D", title: "Pattern Recognition",
        description: "Identify the underlying patterns in the feedback and update your mental model and personal coding standards.",
      },
    ],
  },
  {
    id: "p5",
    text: "You discover a critical security vulnerability in a production system late on a Friday evening. What do you do?",
    subtitle: "Select the approach that most closely mirrors how you would actually act.",
    options: [
      {
        id: "p5a", letter: "A", title: "Immediate Escalation",
        description: "Alert the on-call team and senior leadership immediately, even outside business hours.",
      },
      {
        id: "p5b", letter: "B", title: "Rapid Containment",
        description: "Implement a temporary hotfix to contain the vulnerability first, then escalate with a full report.",
      },
      {
        id: "p5c", letter: "C", title: "Severity Assessment",
        description: "Assess the actual risk exposure before escalating to avoid unnecessary panic if impact is minimal.",
      },
      {
        id: "p5d", letter: "D", title: "Protocol Adherence",
        description: "Follow the established incident response procedure exactly as documented, involving all required stakeholders.",
      },
    ],
  },
];

// ── Aptitude Questions ────────────────────────────────────────────────────

export const aptitudeQuestions: QuestionData[] = [
  {
    id: "a1",
    text: "If a sequence follows the pattern: 2, 6, 18, 54, __, what is the next number?",
    subtitle: "Identify the underlying mathematical pattern.",
    options: [
      { id: "a1a", letter: "A", title: "108", description: "Multiply by 3 each time: 54 × 3 = 162" },
      { id: "a1b", letter: "B", title: "162", description: "The ratio is consistently ×3" },
      { id: "a1c", letter: "C", title: "144", description: "Adding increasing multiples" },
      { id: "a1d", letter: "D", title: "216", description: "Power series: 2×3^n" },
    ],
  },
  {
    id: "a2",
    text: "A distributed system processes 10,000 requests/sec. If each request takes 50ms to process, what is the minimum number of parallel workers needed to sustain the load?",
    subtitle: "Apply engineering systems thinking to solve this problem.",
    options: [
      { id: "a2a", letter: "A", title: "200 workers", description: "10,000 × 0.05s = 500 concurrent, but 200 minimum baseline" },
      { id: "a2b", letter: "B", title: "500 workers", description: "10,000 req/s × 50ms = 500 concurrent requests in flight" },
      { id: "a2c", letter: "C", title: "1,000 workers", description: "With redundancy buffer added" },
      { id: "a2d", letter: "D", title: "250 workers", description: "With 50% efficiency factor" },
    ],
  },
  {
    id: "a3",
    text: "Which Big-O complexity represents the most efficient algorithm for searching a sorted array of 1 million elements?",
    subtitle: "Select the optimal time complexity for this operation.",
    options: [
      { id: "a3a", letter: "A", title: "O(n) — Linear Search", description: "Checks each element sequentially" },
      { id: "a3b", letter: "B", title: "O(log n) — Binary Search", description: "Halves the search space each iteration" },
      { id: "a3c", letter: "C", title: "O(n log n) — Merge Sort", description: "Sorting complexity, not searching" },
      { id: "a3d", letter: "D", title: "O(1) — Hash Lookup", description: "Constant time with pre-built hash map" },
    ],
  },
  {
    id: "a4",
    text: "Which architectural pattern best handles high write-throughput for an analytics platform processing 500GB of data per day?",
    subtitle: "Choose the most appropriate system design approach.",
    options: [
      { id: "a4a", letter: "A", title: "OLTP with Sharding", description: "Relational database sharded across nodes" },
      { id: "a4b", letter: "B", title: "Lambda Architecture", description: "Combines batch and stream processing layers" },
      { id: "a4c", letter: "C", title: "CQRS + Event Sourcing", description: "Separates reads and writes with event log" },
      { id: "a4d", letter: "D", title: "Columnar Data Warehouse", description: "Optimized for analytical read patterns" },
    ],
  },
];

// ── Behavioral Analysis Data ──────────────────────────────────────────────

export const behavioralRadarData: BehavioralMetric[] = [
  { subject: "Analytical", value: 88, fullMark: 100 },
  { subject: "Creative", value: 72, fullMark: 100 },
  { subject: "Leadership", value: 79, fullMark: 100 },
  { subject: "Empathy", value: 85, fullMark: 100 },
  { subject: "Strategic", value: 91, fullMark: 100 },
  { subject: "Adaptability", value: 77, fullMark: 100 },
];

// ── Career Compatibility Data ─────────────────────────────────────────────

export const careerCompatibility: CareerRoleCompatibility[] = [
  {
    role: "Cloud Architect", compatibility: 94, personalityMatch: "Visionary Systems Thinker",
    growthPotential: "Exceptional", learningPath: "Kubernetes → Terraform → AWS Solutions Architect",
    aiConfidence: 97, color: "cyan",
  },
  {
    role: "Backend Engineer", compatibility: 88, personalityMatch: "Systematic Problem Solver",
    growthPotential: "Very High", learningPath: "Go/Rust → Distributed Systems → Database Internals",
    aiConfidence: 92, color: "violet",
  },
  {
    role: "AI/ML Engineer", compatibility: 82, personalityMatch: "Analytical Innovator",
    growthPotential: "Exceptional", learningPath: "Python ML → Neural Networks → MLOps",
    aiConfidence: 88, color: "fuchsia",
  },
  {
    role: "DevOps Engineer", compatibility: 78, personalityMatch: "Process-Driven Optimizer",
    growthPotential: "High", learningPath: "CI/CD → Infrastructure as Code → Observability",
    aiConfidence: 85, color: "amber",
  },
  {
    role: "Full Stack Engineer", compatibility: 75, personalityMatch: "Collaborative Builder",
    growthPotential: "High", learningPath: "React → Node.js → System Design",
    aiConfidence: 82, color: "cyan",
  },
  {
    role: "Cybersecurity Analyst", compatibility: 69, personalityMatch: "Detail-Oriented Defender",
    growthPotential: "Very High", learningPath: "Network Security → Penetration Testing → SIEM",
    aiConfidence: 78, color: "violet",
  },
];

// ── Summary Stats for Dashboard ───────────────────────────────────────────

export const assessmentStats = {
  completed: 1,
  inProgress: 1,
  totalScore: 847,
  aiReadiness: 73,
  streak: 7,
  rank: "Top 12%",
};
