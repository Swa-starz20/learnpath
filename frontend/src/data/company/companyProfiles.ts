import type { DomainId } from '../engineeringDomains';

export interface CompanyProfile {
  id: string;
  name: string;
  category: 'Software / IT' | 'Engineering';
  description: string;
  logo: string; // Emoji representing the company
  salaryRange: string;
  preferredDomains: DomainId[];
  hiringRoles: string[];
  rounds: string[];
  website: string;
}

export const COMPANY_PROFILES: CompanyProfile[] = [
  // Software / IT Companies
  {
    id: 'tcs',
    name: 'TCS',
    category: 'Software / IT',
    description: 'Tata Consultancy Services is a global leader in IT services, consulting, and business solutions.',
    logo: '🌐',
    salaryRange: '₹3.6 - ₹9.0 LPA',
    preferredDomains: ['computer', 'aiml', 'electronics', 'electrical', 'mechatronics'],
    hiringRoles: ['Ninja Developer', 'Digital Engineer', 'Prime Developer'],
    rounds: ['Cognitive Test', 'Coding Round', 'Technical Interview', 'HR Interview'],
    website: 'https://www.tcs.com'
  },
  {
    id: 'infosys',
    name: 'Infosys',
    category: 'Software / IT',
    description: 'Infosys is a global leader in next-generation digital services and consulting.',
    logo: '🔷',
    salaryRange: '₹3.6 - ₹9.5 LPA',
    preferredDomains: ['computer', 'aiml', 'electronics', 'electrical', 'information-tech' as DomainId], // support safety if needed
    hiringRoles: ['System Engineer', 'Specialist Programmer', 'Digital Specialist Engineer'],
    rounds: ['Aptitude & Logical Round', 'Coding Assessment', 'Technical + HR Interview'],
    website: 'https://www.infosys.com'
  },
  {
    id: 'accenture',
    name: 'Accenture',
    category: 'Software / IT',
    description: 'Accenture is a professional services company with leading capabilities in digital, cloud, and security.',
    logo: '🔺',
    salaryRange: '₹4.5 - ₹12.0 LPA',
    preferredDomains: ['computer', 'aiml', 'electronics', 'electrical', 'biomedical', 'mechanical'],
    hiringRoles: ['Associate Software Engineer', 'Advanced App Engineering Analyst'],
    rounds: ['Cognitive Assessment', 'Technical + Coding Test', 'Communication Assessment', 'HR Interview'],
    website: 'https://www.accenture.com'
  },
  {
    id: 'capgemini',
    name: 'Capgemini',
    category: 'Software / IT',
    description: 'Capgemini is a global leader in partnering with companies to transform and manage their business.',
    logo: '♠️',
    salaryRange: '₹4.0 - ₹10.0 LPA',
    preferredDomains: ['computer', 'aiml', 'electronics', 'electrical', 'mechatronics'],
    hiringRoles: ['Analyst', 'Senior Analyst', 'A4 Software Engineer'],
    rounds: ['Pseudo-code Round', 'Behavioral Profiling', 'Technical Interview', 'HR Interview'],
    website: 'https://www.capgemini.com'
  },
  {
    id: 'cognizant',
    name: 'Cognizant',
    category: 'Software / IT',
    description: 'Cognizant engineers modern businesses to improve everyday life.',
    logo: '🟢',
    salaryRange: '₹4.0 - ₹12.0 LPA',
    preferredDomains: ['computer', 'aiml', 'electronics', 'electrical', 'mechatronics'],
    hiringRoles: ['Programmer Analyst Trainee', 'GenC Developer', 'GenC Pro Programmer'],
    rounds: ['Aptitude & Critical Thinking', 'Programming & Debugging', 'Technical Interview', 'HR Interview'],
    website: 'https://www.cognizant.com'
  },
  {
    id: 'wipro',
    name: 'Wipro',
    category: 'Software / IT',
    description: 'Wipro is a leading technology services and consulting company focused on building innovative solutions.',
    logo: '🌈',
    salaryRange: '₹3.6 - ₹8.5 LPA',
    preferredDomains: ['computer', 'aiml', 'electronics', 'electrical'],
    hiringRoles: ['Project Engineer', 'Wipro Turbo Engineer'],
    rounds: ['Aptitude Assessment', 'Coding & Essay Writing', 'Technical + HR Interview'],
    website: 'https://www.wipro.com'
  },
  {
    id: 'ibm',
    name: 'IBM',
    category: 'Software / IT',
    description: 'IBM integrates technology and expertise, providing infrastructure, software, and cognitive services.',
    logo: '🔵',
    salaryRange: '₹7.0 - ₹18.0 LPA',
    preferredDomains: ['computer', 'aiml', 'electronics', 'electrical', 'robotics'],
    hiringRoles: ['Associate System Engineer', 'Cloud Developer', 'AI Analyst'],
    rounds: ['Cognitive Ability Assessment', 'Coding Proficiency Test', 'Technical Interview', 'HR Interview'],
    website: 'https://www.ibm.com'
  },
  {
    id: 'oracle',
    name: 'Oracle',
    category: 'Software / IT',
    description: 'Oracle provides enterprise database servers, cloud application suites, and cloud platform services.',
    logo: '🔴',
    salaryRange: '₹9.0 - ₹24.0 LPA',
    preferredDomains: ['computer', 'aiml', 'electronics'],
    hiringRoles: ['Associate Software Engineer', 'Member of Technical Staff'],
    rounds: ['Aptitude & Reasoning', 'Coding Round (DS & Algo)', 'Technical Interview 1', 'Technical Interview 2', 'HR Interview'],
    website: 'https://www.oracle.com'
  },

  // Engineering Companies
  {
    id: 'bosch',
    name: 'Bosch',
    category: 'Engineering',
    description: 'Bosch is a leading global supplier of technology and services, spanning mobility, industrial, and consumer goods.',
    logo: '🚗',
    salaryRange: '₹5.5 - ₹14.0 LPA',
    preferredDomains: ['mechanical', 'automobile', 'electronics', 'electrical', 'robotics', 'mechatronics'],
    hiringRoles: ['Graduate Engineer Trainee', 'Embedded Systems Engineer', 'Vehicle Dynamics Analyst'],
    rounds: ['Aptitude Test', 'Technical Test (Domain Specific)', 'Technical Interview', 'HR Interview'],
    website: 'https://www.bosch.com'
  },
  {
    id: 'siemens',
    name: 'Siemens',
    category: 'Engineering',
    description: 'Siemens is a technology company focused on industry, infrastructure, transport, and healthcare.',
    logo: '⚡',
    salaryRange: '₹6.0 - ₹15.0 LPA',
    preferredDomains: ['electrical', 'electronics', 'mechatronics', 'robotics', 'mechanical', 'computer'],
    hiringRoles: ['Graduate Engineer Trainee', 'Automation Engineer', 'Systems Engineer'],
    rounds: ['Aptitude & Technical MCQ', 'Domain Technical Round', 'Management Interview', 'HR Round'],
    website: 'https://www.siemens.com'
  },
  {
    id: 'l-and-t',
    name: 'L&T',
    category: 'Engineering',
    description: 'Larsen & Toubro is an Indian multinational conglomerate engaged in technology, engineering, construction, and manufacturing.',
    logo: '🏗️',
    salaryRange: '₹5.0 - ₹10.0 LPA',
    preferredDomains: ['civil', 'mechanical', 'electrical', 'chemical', 'mechatronics'],
    hiringRoles: ['Graduate Engineer Trainee (GET)', 'Structural Design Assistant'],
    rounds: ['Aptitude & Verbal Test', 'Technical Domain Test', 'Group Discussion', 'Panel Interview'],
    website: 'https://www.larsentoubro.com'
  },
  {
    id: 'tata-technologies',
    name: 'Tata Technologies',
    category: 'Engineering',
    description: 'Tata Technologies is a global engineering services company that provides product development and digital transformation.',
    logo: '🚘',
    salaryRange: '₹4.5 - ₹11.0 LPA',
    preferredDomains: ['mechanical', 'automobile', 'mechatronics', 'aerospace', 'robotics'],
    hiringRoles: ['Graduate Engineer Trainee', 'CAD Engineer', 'CAE Simulation Analyst'],
    rounds: ['Aptitude & Reasoning Test', 'Technical Interview (CAD/CAM)', 'HR Interview'],
    website: 'https://www.tatatechnologies.com'
  },
  {
    id: 'abb',
    name: 'ABB',
    category: 'Engineering',
    description: 'ABB is a leading global technology company that energizes the transformation of society and industry.',
    logo: '🦾',
    salaryRange: '₹6.5 - ₹16.0 LPA',
    preferredDomains: ['robotics', 'electrical', 'mechatronics', 'electronics', 'mechanical'],
    hiringRoles: ['Graduate Engineer Trainee', 'Control Systems Engineer', 'Robotics Application Engineer'],
    rounds: ['Aptitude & Core Technical Test', 'Technical Discussion (ROS/PLC)', 'Behavioral Panel', 'HR Interview'],
    website: 'https://global.abb'
  }
];

export const getCompanyProfile = (id: string): CompanyProfile | undefined =>
  COMPANY_PROFILES.find(c => c.id === id);
