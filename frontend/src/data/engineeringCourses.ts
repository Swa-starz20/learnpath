import type { DomainId, AccentColor } from './engineeringDomains';

// ── Types ─────────────────────────────────────────────────────────────────────

export type LessonType = 'concept' | 'lab' | 'quiz' | 'assignment' | 'project';
export type LessonStatus = 'completed' | 'active' | 'locked';
export type DifficultyLevel = 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  durationMin: number;
  status: LessonStatus;
  xp: number;
  synopsis: string;
}

export interface CourseModule {
  id: string;
  title: string;
  subtitle: string;
  status: LessonStatus;
  lessons: Lesson[];
  totalXP: number;
  estimatedHours: number;
  skills: string[];
}

export interface PracticeLab {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  durationMin: number;
  tools: string[];
  xp: number;
  status: LessonStatus;
}

export interface EngineeringCourse {
  id: string;
  domainId: DomainId;
  title: string;
  subtitle: string;
  description: string;
  color: AccentColor;
  difficulty: DifficultyLevel;
  totalHours: number;
  totalXP: number;
  matchScore: number;        // 0-100 AI match
  roadmapSync: boolean;
  assessmentLinked: boolean;
  modules: CourseModule[];
  labs: PracticeLab[];
  skills: string[];
  tags: string[];
}

// ── Lesson factory ─────────────────────────────────────────────────────────────
const mkLesson = (
  id: string, title: string, type: LessonType,
  durationMin: number, status: LessonStatus, xp: number, synopsis: string
): Lesson => ({ id, title, type, durationMin, status, xp, synopsis });

// ── Computer Engineering Courses ──────────────────────────────────────────────
export const COMPUTER_COURSES: EngineeringCourse[] = [
  {
    id: 'cs-dsa-mastery',
    domainId: 'computer',
    title: 'DSA Mastery for Engineers',
    subtitle: 'Arrays · Trees · Graphs · DP · Competitive',
    description: 'Master data structures and algorithms from first principles to advanced patterns. Build the problem-solving foundation for senior engineering interviews.',
    color: 'violet',
    difficulty: 'Intermediate',
    totalHours: 32,
    totalXP: 4800,
    matchScore: 98,
    roadmapSync: true,
    assessmentLinked: true,
    skills: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'DP', 'Greedy', 'Binary Search'],
    tags: ['SWE', 'Interviews', 'Algorithms'],
    modules: [
      {
        id: 'cs-dsa-m1', title: 'Linear Structures', subtitle: 'Arrays, Strings, LinkedLists',
        status: 'completed', totalXP: 1200, estimatedHours: 6,
        skills: ['Arrays', 'Two Pointers', 'Sliding Window', 'Linked Lists'],
        lessons: [
          mkLesson('cs-l1', 'Array Internals & Complexity', 'concept', 25, 'completed', 150, 'Memory layout, cache lines, amortized analysis.'),
          mkLesson('cs-l2', 'Two Pointer Patterns', 'concept', 30, 'completed', 180, 'Meet-in-middle, fast/slow pointer patterns.'),
          mkLesson('cs-l3', 'Sliding Window Lab', 'lab', 45, 'completed', 220, 'Implement 6 classic sliding window problems.'),
          mkLesson('cs-l4', 'Linked List Reversal Patterns', 'concept', 35, 'completed', 200, 'Iterative & recursive reversal with variants.'),
          mkLesson('cs-l5', 'Module 1 Quiz', 'quiz', 20, 'completed', 150, 'Timed assessment covering all linear structures.'),
        ],
      },
      {
        id: 'cs-dsa-m2', title: 'Trees & Recursion', subtitle: 'BST, Traversal, Recursion Depth',
        status: 'active', totalXP: 1400, estimatedHours: 8,
        skills: ['BST', 'DFS', 'BFS', 'Recursion', 'Backtracking'],
        lessons: [
          mkLesson('cs-l6', 'Binary Tree Traversals', 'concept', 30, 'completed', 180, 'Inorder, preorder, postorder — iterative & recursive.'),
          mkLesson('cs-l7', 'BST Properties & Operations', 'concept', 35, 'active', 200, 'Insert, delete, search with complexity guarantees.'),
          mkLesson('cs-l8', 'Tree DP Patterns', 'lab', 50, 'locked', 280, 'Diameter, max path sum, LCA with memoization.'),
          mkLesson('cs-l9', 'Backtracking Blueprint', 'concept', 40, 'locked', 240, 'N-Queens, permutations, subsets framework.'),
          mkLesson('cs-l10', 'Tree Lab: 8 Problems', 'lab', 60, 'locked', 300, 'Mixed difficulty tree problems with AI hints.'),
        ],
      },
      {
        id: 'cs-dsa-m3', title: 'Graphs & Shortest Paths', subtitle: 'BFS, DFS, Dijkstra, Topological Sort',
        status: 'locked', totalXP: 1600, estimatedHours: 10,
        skills: ['Graph BFS', 'Graph DFS', 'Dijkstra', 'Bellman-Ford', 'Topological Sort'],
        lessons: [
          mkLesson('cs-l11', 'Graph Representations', 'concept', 25, 'locked', 150, 'Adjacency list vs matrix, space-time tradeoffs.'),
          mkLesson('cs-l12', 'BFS & Shortest Path', 'concept', 35, 'locked', 200, 'Level-order BFS, 0-1 BFS, multi-source BFS.'),
          mkLesson('cs-l13', 'Dijkstra & Heap Optimization', 'lab', 55, 'locked', 300, 'Priority queue Dijkstra with 5 problem variants.'),
          mkLesson('cs-l14', 'Topological Sort & DAGs', 'concept', 30, 'locked', 180, 'Kahn\'s algorithm, cycle detection, course schedule.'),
          mkLesson('cs-l15', 'Graph Final Project', 'project', 90, 'locked', 350, 'Design a route optimizer using weighted graph algorithms.'),
        ],
      },
    ],
    labs: [
      { id: 'cs-lab1', title: 'LeetCode Sprint: Arrays', description: '20 curated array problems with AI difficulty adaptation.', difficulty: 'Intermediate', durationMin: 90, tools: ['Python', 'LeetCode'], xp: 500, status: 'completed' },
      { id: 'cs-lab2', title: 'System Design Sketch', description: 'Design a URL shortener from scratch with capacity estimates.', difficulty: 'Advanced', durationMin: 120, tools: ['Diagrams', 'Excalidraw'], xp: 700, status: 'active' },
      { id: 'cs-lab3', title: 'Graph Challenge Arena', description: 'Competitive 60-min graph problem set.', difficulty: 'Expert', durationMin: 60, tools: ['Python', 'C++'], xp: 900, status: 'locked' },
    ],
  },
  {
    id: 'cs-system-design',
    domainId: 'computer',
    title: 'System Design Deep Dive',
    subtitle: 'Distributed Systems · Scalability · Architecture',
    description: 'Master scalable system architecture. Design systems that handle millions of users — load balancers, caches, databases, message queues, and observability.',
    color: 'cyan',
    difficulty: 'Advanced',
    totalHours: 28,
    totalXP: 5200,
    matchScore: 94,
    roadmapSync: true,
    assessmentLinked: false,
    skills: ['Load Balancing', 'Caching', 'Microservices', 'Kafka', 'CDNs', 'Sharding'],
    tags: ['Architecture', 'Senior SWE', 'Interviews'],
    modules: [
      {
        id: 'cs-sd-m1', title: 'Scalability Fundamentals', subtitle: 'Horizontal vs Vertical, CAP Theorem',
        status: 'active', totalXP: 1600, estimatedHours: 8,
        skills: ['CAP Theorem', 'Load Balancing', 'Rate Limiting', 'API Gateway'],
        lessons: [
          mkLesson('sd-l1', 'Scalability Mental Models', 'concept', 30, 'completed', 180, 'Vertical vs horizontal, stateless vs stateful services.'),
          mkLesson('sd-l2', 'CAP Theorem in Practice', 'concept', 35, 'active', 200, 'CP vs AP systems with real-world examples.'),
          mkLesson('sd-l3', 'Load Balancer Design Lab', 'lab', 50, 'locked', 280, 'Design a round-robin LB with health checks.'),
          mkLesson('sd-l4', 'Caching Strategies', 'concept', 40, 'locked', 240, 'Write-through, write-back, cache eviction policies.'),
        ],
      },
    ],
    labs: [
      { id: 'sd-lab1', title: 'Design Twitter Feed', description: 'End-to-end system design of a social feed at scale.', difficulty: 'Expert', durationMin: 120, tools: ['Excalidraw', 'Notion'], xp: 800, status: 'active' },
    ],
  },
];

// ── AI/ML Engineering Courses ─────────────────────────────────────────────────
export const AIML_COURSES: EngineeringCourse[] = [
  {
    id: 'aiml-deep-learning',
    domainId: 'aiml',
    title: 'Deep Learning Engineering',
    subtitle: 'CNNs · RNNs · Transformers · PyTorch',
    description: 'Build neural networks from scratch. Master PyTorch, implement transformers, and deploy models in production. From backpropagation to LLM fine-tuning.',
    color: 'fuchsia',
    difficulty: 'Advanced',
    totalHours: 40,
    totalXP: 6000,
    matchScore: 95,
    roadmapSync: true,
    assessmentLinked: true,
    skills: ['PyTorch', 'CNNs', 'RNNs', 'Transformers', 'Backpropagation', 'MLOps'],
    tags: ['AI Research', 'ML Engineer', 'LLMs'],
    modules: [
      {
        id: 'aiml-dl-m1', title: 'Neural Network Foundations', subtitle: 'Forward pass, Backprop, Activation Fns',
        status: 'completed', totalXP: 1500, estimatedHours: 8,
        skills: ['Perceptrons', 'Backpropagation', 'Activation Functions', 'Loss Functions'],
        lessons: [
          mkLesson('aiml-l1', 'The Perceptron & Gradient Flow', 'concept', 35, 'completed', 200, 'Forward pass, loss landscape, gradient intuition.'),
          mkLesson('aiml-l2', 'Backprop from Scratch', 'lab', 60, 'completed', 320, 'Implement backprop in NumPy without autograd.'),
          mkLesson('aiml-l3', 'Activation Functions Deep Dive', 'concept', 25, 'completed', 150, 'ReLU, GELU, Swish — pros/cons per architecture.'),
          mkLesson('aiml-l4', 'Build a 2-Layer MLP', 'lab', 50, 'completed', 280, 'Train MNIST classifier using raw PyTorch.'),
        ],
      },
      {
        id: 'aiml-dl-m2', title: 'Convolutional Networks', subtitle: 'CNNs, ResNets, Vision Transformers',
        status: 'active', totalXP: 1800, estimatedHours: 10,
        skills: ['Convolutions', 'Pooling', 'ResNet', 'ViT', 'Transfer Learning'],
        lessons: [
          mkLesson('aiml-l5', 'Convolution Mechanics', 'concept', 40, 'completed', 220, 'Kernels, receptive field, feature maps explained.'),
          mkLesson('aiml-l6', 'ResNet & Skip Connections', 'concept', 35, 'active', 200, 'Why residuals solve vanishing gradients.'),
          mkLesson('aiml-l7', 'Transfer Learning Lab', 'lab', 70, 'locked', 380, 'Fine-tune ResNet50 on custom dataset with PyTorch.'),
          mkLesson('aiml-l8', 'Vision Transformers (ViT)', 'concept', 45, 'locked', 260, 'Patch embeddings, attention maps, position encoding.'),
        ],
      },
      {
        id: 'aiml-dl-m3', title: 'Transformer Architecture', subtitle: 'Attention, BERT, GPT, Fine-tuning',
        status: 'locked', totalXP: 2200, estimatedHours: 12,
        skills: ['Self-Attention', 'Multi-Head Attention', 'BERT', 'GPT', 'RLHF'],
        lessons: [
          mkLesson('aiml-l9', 'Attention is All You Need', 'concept', 50, 'locked', 280, 'Query, Key, Value mechanics with complexity analysis.'),
          mkLesson('aiml-l10', 'Implement Transformer from Scratch', 'lab', 90, 'locked', 480, 'Build a mini-GPT in PyTorch (Andrej Karpathy style).'),
          mkLesson('aiml-l11', 'BERT Fine-tuning for NLP', 'lab', 60, 'locked', 340, 'Sentiment classification with HuggingFace BERT.'),
          mkLesson('aiml-l12', 'LLM Capstone Project', 'project', 120, 'locked', 600, 'Build a domain-specific QA system using RAG + LLM.'),
        ],
      },
    ],
    labs: [
      { id: 'aiml-lab1', title: 'MNIST from Scratch', description: 'Full training pipeline: data → model → evaluation → visualization.', difficulty: 'Intermediate', durationMin: 90, tools: ['PyTorch', 'Matplotlib'], xp: 600, status: 'completed' },
      { id: 'aiml-lab2', title: 'Fine-tune GPT-2', description: 'Fine-tune GPT-2 on domain-specific text using HuggingFace Trainer.', difficulty: 'Expert', durationMin: 120, tools: ['HuggingFace', 'Google Colab'], xp: 900, status: 'active' },
    ],
  },
];

// ── Mechanical Engineering Courses ─────────────────────────────────────────────
export const MECHANICAL_COURSES: EngineeringCourse[] = [
  {
    id: 'mech-fea-mastery',
    domainId: 'mechanical',
    title: 'FEA & Structural Analysis',
    subtitle: 'ANSYS · Meshing · Stress Analysis · CFD',
    description: 'Master finite element analysis for structural and thermal problems. Build simulation workflows used in aerospace, automotive, and industrial design.',
    color: 'emerald',
    difficulty: 'Advanced',
    totalHours: 30,
    totalXP: 4400,
    matchScore: 92,
    roadmapSync: true,
    assessmentLinked: true,
    skills: ['ANSYS', 'Meshing', 'Static Analysis', 'Thermal', 'CFD', 'Post-processing'],
    tags: ['FEA', 'Simulation', 'ANSYS', 'CAE'],
    modules: [
      {
        id: 'mech-fea-m1', title: 'FEA Fundamentals', subtitle: 'Elements, Meshing, Boundary Conditions',
        status: 'completed', totalXP: 1200, estimatedHours: 6,
        skills: ['Element Types', 'Meshing Strategy', 'Material Properties', 'BCs'],
        lessons: [
          mkLesson('mech-l1', 'FEA Theory & Element Types', 'concept', 40, 'completed', 220, 'Beam, shell, solid elements — when to use what.'),
          mkLesson('mech-l2', 'Meshing Best Practices', 'lab', 55, 'completed', 280, 'Mesh convergence study on a bracket geometry.'),
          mkLesson('mech-l3', 'Static Structural Analysis', 'lab', 60, 'completed', 300, 'Analyze a cantilever beam with ANSYS Mechanical.'),
          mkLesson('mech-l4', 'Module 1 Assessment', 'quiz', 25, 'completed', 150, 'Theory + practical questions on FEA setup.'),
        ],
      },
      {
        id: 'mech-fea-m2', title: 'Advanced Simulation', subtitle: 'Nonlinear, Thermal, Modal Analysis',
        status: 'active', totalXP: 1600, estimatedHours: 10,
        skills: ['Nonlinear Analysis', 'Thermal Coupling', 'Modal Analysis', 'Fatigue'],
        lessons: [
          mkLesson('mech-l5', 'Nonlinear Material Models', 'concept', 45, 'completed', 240, 'Plasticity, hyperelasticity — solver convergence.'),
          mkLesson('mech-l6', 'Thermal-Structural Coupling', 'lab', 65, 'active', 340, 'Solve a heat-induced stress problem in ANSYS.'),
          mkLesson('mech-l7', 'Modal & Harmonic Analysis', 'lab', 55, 'locked', 300, 'Natural frequencies and mode shapes of a turbine blade.'),
          mkLesson('mech-l8', 'Fatigue Life Prediction', 'concept', 40, 'locked', 220, 'S-N curves, Goodman diagram, safety factors.'),
        ],
      },
    ],
    labs: [
      { id: 'mech-lab1', title: 'Bracket Optimization', description: 'Topological optimization of a structural bracket using ANSYS.', difficulty: 'Advanced', durationMin: 90, tools: ['ANSYS Mechanical'], xp: 600, status: 'completed' },
      { id: 'mech-lab2', title: 'CFD Pipe Flow', description: 'Simulate internal pipe flow with turbulence modeling in Fluent.', difficulty: 'Expert', durationMin: 120, tools: ['ANSYS Fluent'], xp: 800, status: 'active' },
    ],
  },
];

// ── Robotics Courses ──────────────────────────────────────────────────────────
export const ROBOTICS_COURSES: EngineeringCourse[] = [
  {
    id: 'rob-ros2-mastery',
    domainId: 'robotics',
    title: 'ROS2 & Autonomous Systems',
    subtitle: 'Nodes · Topics · Navigation · SLAM',
    description: 'Build production-grade robotics systems with ROS2. From basic pub/sub to autonomous navigation with Nav2, SLAM, and real robot deployment.',
    color: 'cyan',
    difficulty: 'Advanced',
    totalHours: 36,
    totalXP: 5200,
    matchScore: 90,
    roadmapSync: true,
    assessmentLinked: false,
    skills: ['ROS2 Humble', 'Nodes', 'tf2', 'Nav2', 'SLAM', 'Gazebo', 'URDF'],
    tags: ['Robotics', 'Autonomous', 'Navigation'],
    modules: [
      {
        id: 'rob-ros2-m1', title: 'ROS2 Architecture', subtitle: 'Nodes, Topics, Services, Actions',
        status: 'completed', totalXP: 1400, estimatedHours: 8,
        skills: ['Nodes', 'Topics', 'Services', 'Actions', 'DDS', 'rclpy'],
        lessons: [
          mkLesson('rob-l1', 'ROS2 vs ROS1 Architecture', 'concept', 30, 'completed', 180, 'DDS middleware, quality of service, discovery.'),
          mkLesson('rob-l2', 'Publisher/Subscriber Lab', 'lab', 50, 'completed', 260, 'Build a sensor publisher and data processor subscriber.'),
          mkLesson('rob-l3', 'Services & Custom Messages', 'lab', 45, 'completed', 240, 'Create a custom service for robot state queries.'),
          mkLesson('rob-l4', 'Action Servers & Clients', 'concept', 35, 'completed', 200, 'Long-running tasks with feedback and cancellation.'),
        ],
      },
      {
        id: 'rob-ros2-m2', title: 'Navigation & SLAM', subtitle: 'Nav2, AMCL, Costmaps',
        status: 'active', totalXP: 1800, estimatedHours: 10,
        skills: ['Nav2', 'AMCL', 'Costmaps', 'Path Planning', 'SLAM Toolbox'],
        lessons: [
          mkLesson('rob-l5', 'Nav2 Architecture Overview', 'concept', 35, 'completed', 200, 'Planner server, controller server, BT navigator.'),
          mkLesson('rob-l6', 'SLAM Toolbox Integration', 'lab', 60, 'active', 320, 'Build a 2D map of a simulated environment.'),
          mkLesson('rob-l7', 'Custom Costmap Plugins', 'lab', 55, 'locked', 300, 'Implement a social force field costmap layer.'),
          mkLesson('rob-l8', 'Full Navigation Stack', 'project', 90, 'locked', 420, 'Deploy autonomous navigation on TurtleBot3 in Gazebo.'),
        ],
      },
    ],
    labs: [
      { id: 'rob-lab1', title: 'Gazebo Simulation', description: 'Spawn, control, and sense a differential drive robot in Gazebo.', difficulty: 'Intermediate', durationMin: 90, tools: ['Gazebo', 'ROS2'], xp: 550, status: 'completed' },
      { id: 'rob-lab2', title: 'Perception Pipeline', description: 'Object detection + depth estimation from stereo camera in ROS2.', difficulty: 'Expert', durationMin: 120, tools: ['OpenCV', 'ROS2', 'YOLO'], xp: 850, status: 'locked' },
    ],
  },
];

// ── Domain → Courses map ──────────────────────────────────────────────────────
export const DOMAIN_COURSES: Partial<Record<DomainId, EngineeringCourse[]>> = {
  computer:   COMPUTER_COURSES,
  aiml:       AIML_COURSES,
  mechanical: MECHANICAL_COURSES,
  robotics:   ROBOTICS_COURSES,
};

// ── Stub course factory ───────────────────────────────────────────────────────
// For domains without full module data, generate a lightweight EngineeringCourse
// from catalog metadata so the workspace resolver never falls back to CS.
const buildStubCourse = (
  id: string,
  domainId: DomainId,
  title: string,
  subtitle: string,
  description: string,
  color: AccentColor,
  difficulty: DifficultyLevel,
  totalHours: number,
  matchScore: number,
  skills: string[],
  tags: string[],
  roadmapSync: boolean
): EngineeringCourse => ({
  id,
  domainId,
  title,
  subtitle,
  description,
  color,
  difficulty,
  totalHours,
  totalXP: Math.round(totalHours * 120),
  matchScore,
  roadmapSync,
  assessmentLinked: roadmapSync,
  skills,
  tags,
  modules: [
    {
      id: `${id}-m1`,
      title: 'Foundations',
      subtitle: 'Core principles and theory',
      status: 'completed',
      totalXP: Math.round(totalHours * 40),
      estimatedHours: Math.round(totalHours * 0.35),
      skills: skills.slice(0, 3),
      lessons: [
        mkLesson(`${id}-l1`, 'Introduction & Overview', 'concept', 30, 'completed', 180, 'Foundational concepts and scope.'),
        mkLesson(`${id}-l2`, 'Core Theory', 'concept', 40, 'completed', 220, 'Theoretical underpinning of the domain.'),
        mkLesson(`${id}-l3`, 'Practical Foundations Lab', 'lab', 60, 'completed', 300, 'Hands-on fundamentals exercise.'),
      ],
    },
    {
      id: `${id}-m2`,
      title: 'Applied Techniques',
      subtitle: 'Tools, methods, workflows',
      status: 'active',
      totalXP: Math.round(totalHours * 50),
      estimatedHours: Math.round(totalHours * 0.40),
      skills: skills.slice(1, 4),
      lessons: [
        mkLesson(`${id}-l4`, 'Tool Mastery', 'concept', 35, 'completed', 200, 'Primary toolchain and workflows.'),
        mkLesson(`${id}-l5`, 'Applied Lab', 'lab', 55, 'active', 280, 'Guided project applying core techniques.'),
        mkLesson(`${id}-l6`, 'Case Study Analysis', 'concept', 40, 'locked', 240, 'Real-world case study breakdown.'),
      ],
    },
    {
      id: `${id}-m3`,
      title: 'Advanced Mastery',
      subtitle: 'Expert-level applications',
      status: 'locked',
      totalXP: Math.round(totalHours * 30),
      estimatedHours: Math.round(totalHours * 0.25),
      skills: skills.slice(2),
      lessons: [
        mkLesson(`${id}-l7`, 'Advanced Concepts', 'concept', 50, 'locked', 280, 'Expert-level theory and patterns.'),
        mkLesson(`${id}-l8`, 'Capstone Project', 'project', 90, 'locked', 450, 'End-to-end domain project.'),
      ],
    },
  ],
  labs: [
    {
      id: `${id}-lab1`,
      title: `${title} Lab`,
      description: `Hands-on practical lab for ${title}.`,
      difficulty,
      durationMin: 90,
      tools: skills.slice(0, 2),
      xp: 600,
      status: 'active',
    },
  ],
});

// ── Stub courses for the 8 remaining domains ──────────────────────────────────
const STUB_COURSES: EngineeringCourse[] = [
  buildStubCourse('civ-structural', 'civil', 'Structural Analysis', 'STAAD · ETABS · IS 456', 'Master structural analysis for buildings and infrastructure using STAAD.Pro, ETABS, and Indian standards. Build skills for civil design practice.', 'emerald', 'Intermediate', 26, 88, ['STAAD.Pro', 'ETABS', 'Load Cases', 'IS 456', 'BIM'], ['Structural'], true),
  buildStubCourse('civ-bim', 'civil', 'BIM & Revit Mastery', 'Revit · Navisworks · Coordination', 'Learn Building Information Modelling using Revit and Navisworks. From 3D modelling to clash detection and construction coordination.', 'sky', 'Intermediate', 18, 82, ['Revit', 'BIM', 'Navisworks', 'AutoCAD'], ['BIM'], false),
  buildStubCourse('elec-power-sys', 'electrical', 'Power Systems Engineering', 'Load Flow · Protection · SCADA', 'Understand power systems from generation to distribution. Covers load flow, fault analysis, protection relays, and SCADA integration.', 'amber', 'Advanced', 28, 88, ['Power Flow', 'Protection', 'SCADA', 'ETAP', 'Fault Analysis'], ['Power Systems'], true),
  buildStubCourse('elec-drives', 'electrical', 'Electric Drives & PE', 'Inverters · VFDs · Motor Control', 'Master power electronics and electric drives: DC-DC converters, VFDs, motor control, MPPT, and grid-connected inverter design.', 'amber', 'Advanced', 22, 84, ['Inverters', 'VFD', 'MPPT', 'PSIM', 'Motor Control'], ['Power Electronics'], false),
  buildStubCourse('ece-vlsi', 'electronics', 'VLSI Design', 'Verilog · CMOS · Physical Design', 'From RTL to GDSII: master Verilog, CMOS circuit design, layout, DRC/LVS, and timing closure for semiconductor design.', 'indigo', 'Expert', 32, 90, ['Verilog', 'CMOS', 'DRC/LVS', 'Synopsys', 'Timing Closure'], ['VLSI'], true),
  buildStubCourse('ece-embedded', 'electronics', 'Embedded Systems', 'ARM · RTOS · PCB Design', 'Build embedded systems from bare-metal C to RTOS. Covers ARM Cortex, FreeRTOS, peripheral drivers, and PCB design workflow.', 'violet', 'Intermediate', 24, 85, ['STM32', 'FreeRTOS', 'UART/SPI', 'Keil', 'PCB Layout'], ['Embedded'], false),
  buildStubCourse('aero-aero', 'aerospace', 'Aerodynamics & CFD', 'XFOIL · OpenFOAM · CFD Workflows', 'Study aerodynamic theory and apply it with XFOIL, ANSYS Fluent, and OpenFOAM. Covers lift, drag, turbulence modelling, and CFD meshing.', 'sky', 'Advanced', 28, 89, ['CFD', 'XFOIL', 'Mesh Generation', 'OpenFOAM', 'Drag Polar'], ['Aerodynamics'], true),
  buildStubCourse('aero-gnc', 'aerospace', 'GNC Systems', 'Kalman Filter · MATLAB · Simulink', 'Design guidance, navigation, and control systems for aerospace vehicles. Covers Kalman filter, state-space, MATLAB/Simulink modelling.', 'violet', 'Expert', 34, 83, ['Kalman Filter', 'Simulink', 'State Space', 'MATLAB', 'Control Theory'], ['GNC'], true),
  buildStubCourse('bme-signals', 'biomedical', 'Biomedical Signal Processing', 'ECG · EEG · MATLAB · Python', 'Process and analyse physiological signals. Covers ECG, EEG, EMG analysis, digital filters, and classification using Python and MATLAB.', 'rose', 'Intermediate', 22, 87, ['ECG Analysis', 'Filters', 'Python', 'MATLAB', 'Signal Processing'], ['Biomedical'], true),
  buildStubCourse('bme-device', 'biomedical', 'Medical Device Design', 'FDA · ISO 13485 · Risk Mgmt', 'Design safe medical devices following FDA 21 CFR Part 820 and ISO 13485. Covers design controls, FMEA, usability, and regulatory submissions.', 'fuchsia', 'Advanced', 26, 82, ['Design Controls', 'FMEA', 'Validation', 'ISO 13485', 'Risk Management'], ['Regulatory'], false),
  buildStubCourse('auto-adas', 'automobile', 'ADAS & Autonomous Driving', 'Radar · LiDAR · MISRA C', 'Build advanced driver-assistance systems. Covers sensor fusion (Radar/LiDAR/Camera), object detection, MISRA C, and autonomous stack architecture.', 'amber', 'Expert', 36, 88, ['ADAS', 'Sensor Fusion', 'ROS', 'MISRA C', 'Camera Fusion'], ['Autonomous Vehicle'], true),
  buildStubCourse('auto-can', 'automobile', 'CAN Bus & AUTOSAR', 'CAN FD · UDS · ECU Development', 'Master automotive communication protocols and AUTOSAR architecture. Build ECU software, configure CAN FD, implement UDS diagnostics.', 'sky', 'Advanced', 22, 83, ['CAN FD', 'UDS', 'AUTOSAR', 'Vector CANalyzer', 'Diagnostics'], ['Automotive SW'], false),
  buildStubCourse('mecha-plc', 'mechatronics', 'PLC & Industrial Automation', 'Siemens · Ladder Logic · SCADA', 'Program industrial PLCs using TIA Portal and ladder logic. Integrate SCADA systems, HMI panels, and fieldbus communication for factory automation.', 'sky', 'Intermediate', 24, 91, ['PLC', 'SCADA', 'HMI', 'Modbus', 'Siemens S7'], ['Automation'], true),
  buildStubCourse('mecha-iiot', 'mechatronics', 'IIoT & Industry 4.0', 'MQTT · OPC-UA · Digital Twin', 'Connect factory equipment to the cloud. Covers MQTT, OPC-UA, edge computing, digital twin design, and smart manufacturing dashboards.', 'cyan', 'Advanced', 20, 86, ['MQTT', 'OPC-UA', 'Edge Computing', 'Node-RED', 'Digital Twin'], ['Industry 4.0'], false),
  buildStubCourse('chem-aspen', 'chemical', 'Process Simulation', 'Aspen Plus · HYSYS · P&ID', 'Simulate chemical processes using Aspen Plus and HYSYS. Covers thermodynamic packages, distillation, heat exchangers, and P&ID reading.', 'fuchsia', 'Intermediate', 26, 90, ['Aspen Plus', 'HYSYS', 'P&ID', 'Distillation', 'Heat Exchangers'], ['Process Eng'], true),
  buildStubCourse('chem-safety', 'chemical', 'Process Safety & HAZOP', 'HAZOP · SIL · LOPA', 'Conduct HAZOP studies, SIL assessments, and LOPA for process safety. Covers PSM regulations, emergency response planning, and safeguard design.', 'amber', 'Advanced', 18, 84, ['HAZOP', 'SIL', 'LOPA', 'PSM', 'Bow-Tie Analysis'], ['HSE'], false),
];

// ── Unified resolvers (covers all 12 domains) ─────────────────────────────────

/** Get full-data courses for a domain. Includes stubs for domains without rich module data. */
export const getCoursesForDomain = (domainId: DomainId): EngineeringCourse[] => {
  const rich = DOMAIN_COURSES[domainId];
  if (rich && rich.length > 0) return rich;
  return STUB_COURSES.filter(c => c.domainId === domainId);
};

/** All courses across all 12 domains — used by CourseWorkspace for slug resolution. */
export const getAllCourses = (): EngineeringCourse[] => [
  ...COMPUTER_COURSES,
  ...AIML_COURSES,
  ...MECHANICAL_COURSES,
  ...ROBOTICS_COURSES,
  ...STUB_COURSES,
];

/** Featured course for a domain — always returns a valid course, never null for any domain. */
export const getFeaturedCourse = (domainId: DomainId): EngineeringCourse | null => {
  const courses = getCoursesForDomain(domainId);
  if (courses.length === 0) return null;
  const active = courses.find(c => c.modules.some(m => m.status === 'active'));
  return active ?? courses[0];
};
