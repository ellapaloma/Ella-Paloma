/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Graduate, SurveyNotificationState, EmailLogEntry } from '../types';

const RAW_INITIAL_GRADUATES = [
  {
    id: 'G01',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    degree: 'B.S. Computer Science',
    gradYear: 2023,
    employmentStatus: 'Employed Full-time',
    jobTitle: 'Frontend Engineer',
    employer: 'FinTech Solutions Corp',
    industry: 'Technology',
    monthlySalary: 3800,
    yearOfEmploymentStart: 2023,
    skillsUsed: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    surveyResponse: {
      usefulSkills: 'The Web Programming and Software Engineering courses were incredibly valuable. Working in Agile teams during senior year prepared me for actual company sprints.',
      obsoleteSkills: 'Learning SVN (Subversion) in systems administration was outdated. The industry uses Git exclusively.',
      curriculumGaps: 'There was very little training on modern cloud deployment, Serverless platforms, or CI/CD pipelines.',
      relevanceRating: 4,
      lastUpdated: '2026-02-15T09:30:00Z'
    },
    alignmentAnalysis: {
      alignmentCategory: 'Vertical',
      alignmentScore: 95,
      geminiExplanation: 'The graduate degree in Computer Science is a direct prerequisite and provides the foundational technical training for a Frontend Engineering role, demonstrating direct vertical alignment.',
      keyFactors: [
        'Rigorous capstone project using real software workflows',
        'Academic focus on engineering structures',
        'Direct connection between coursework and professional frameworks'
      ],
      analyzedAt: '2026-02-15T09:35:00Z'
    }
  },
  {
    id: 'G02',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    degree: 'B.S. Computer Science',
    gradYear: 2024,
    employmentStatus: 'Employed Full-time',
    jobTitle: 'Machine Learning Specialist',
    employer: 'BioHealth Intelligence',
    industry: 'Healthcare / AI',
    monthlySalary: 4500,
    yearOfEmploymentStart: 2024,
    skillsUsed: ['Python', 'PyTorch', 'Numpy', 'SQL', 'Data Analytics'],
    surveyResponse: {
      usefulSkills: 'Linear Algebra, Advanced Statistics, and Basic Python scripts we did in Machine Learning electives.',
      obsoleteSkills: 'Desktop programming with old Java Swing templates felt highly detached from industry trends.',
      curriculumGaps: 'Needs stronger focus on Vector Databases, handling large datasets in Pandas, and model fine-tuning.',
      relevanceRating: 5,
      lastUpdated: '2026-03-10T14:20:00Z'
    },
    alignmentAnalysis: {
      alignmentCategory: 'Vertical',
      alignmentScore: 98,
      geminiExplanation: 'The CS specialization elective in machine learning coupled with deep algebraic programming maps natively to ML Specialist roles.',
      keyFactors: [
        'Advanced math requirements in curriculum',
        'Senior industry electives in Applied AI and Python',
        'Practical neural network coding sessions'
      ],
      analyzedAt: '2026-03-10T14:22:00Z'
    }
  },
  {
    id: 'G03',
    name: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    degree: 'B.S. Business Administration',
    gradYear: 2022,
    employmentStatus: 'Employed Full-time',
    jobTitle: 'Senior Product Marketing Associate',
    employer: 'CloudRetail Brands',
    industry: 'E-commerce',
    monthlySalary: 3200,
    yearOfEmploymentStart: 2022,
    skillsUsed: ['Market Research', 'SEO', 'Data Studio', 'Brand Strategy'],
    surveyResponse: {
      usefulSkills: 'Consumer Behavior lectures and the digital marketing campaign simulations during the marketing management module.',
      obsoleteSkills: 'Manual bookkeeping entries on paper ledgers instead of using accounting suites or ERP setups.',
      curriculumGaps: 'Hard metrics analysis, programmatic ad purchasing, and utilizing automated CRM funnels (like Salesforce/HubSpot) were missing.',
      relevanceRating: 4,
      lastUpdated: '2025-11-05T10:15:00Z'
    },
    alignmentAnalysis: {
      alignmentCategory: 'Vertical',
      alignmentScore: 90,
      geminiExplanation: 'A Business Administration major focusing on professional marketing aligns vertical with product marketing roles, leveraging strategic planning frameworks.',
      keyFactors: [
        'Solid grounding in consumer metrics and behavior strategies',
        'Frequent presentation assignments boosting communication skills',
        'Business model prototyping experiences'
      ],
      analyzedAt: '2025-11-05T11:00:00Z'
    }
  },
  {
    id: 'G04',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    degree: 'B.S. Nursing',
    gradYear: 2021,
    employmentStatus: 'Employed Full-time',
    jobTitle: 'Registered Nurse (NICU)',
    employer: 'St. Jude Metropolitan Hospital',
    industry: 'Healthcare',
    monthlySalary: 4100,
    yearOfEmploymentStart: 2021,
    skillsUsed: ['Patient Care', 'Neonatal Support', 'IV Therapy', 'Crisis Care'],
    surveyResponse: {
      usefulSkills: 'The hands-on clinical rotations and the advanced pharmacology laboratories were absolute lifesavers.',
      obsoleteSkills: 'Paper-based charting methods. Virtually every hospital uses robust electronic medical records systems (like Epic).',
      curriculumGaps: 'Medical Spanish or medical interpretation skills, and advanced stress-management/burnout mitigation guidelines.',
      relevanceRating: 5,
      lastUpdated: '2026-01-20T16:45:00Z'
    },
    alignmentAnalysis: {
      alignmentCategory: 'Vertical',
      alignmentScore: 100,
      geminiExplanation: 'Nursing degree to Registered Nurse transition represents absolute direct alignment. Technical skills, academic credentialing, and clinical residency are fully mapped.',
      keyFactors: [
        'Prerequisite licensure alignment',
        'Direct hands-on clinical rotations mandatory in academic program',
        'Pharmacology and patient-safety labs'
      ],
      analyzedAt: '2026-01-20T16:50:00Z'
    }
  },
  {
    id: 'G05',
    name: 'David Kim',
    email: 'david.kim@example.com',
    degree: 'B.S. Mechanical Engineering',
    gradYear: 2023,
    employmentStatus: 'Employed Full-time',
    jobTitle: 'CAD Design Engineer',
    employer: 'AutoCore Propulsion',
    industry: 'Automotive / Manufacturing',
    monthlySalary: 3900,
    yearOfEmploymentStart: 2024,
    skillsUsed: ['SolidWorks', 'ANSYS', '3D Printing', 'Material Fatigue'],
    surveyResponse: {
      usefulSkills: 'Computer-Aided Design course and Fluid Dynamics. The practical lab projects testing stress models was highly relevant.',
      obsoleteSkills: 'Manual drafting on heavy boards. While good for conceptualizing, it occupied a massive portion of freshman year that could be spent on CAD/FEA.',
      curriculumGaps: 'Additive manufacturing technologies (like high-grade 3D printers) and basic IoT hardware integration.',
      relevanceRating: 4,
      lastUpdated: '2026-04-02T11:05:00Z'
    },
    alignmentAnalysis: {
      alignmentCategory: 'Vertical',
      alignmentScore: 92,
      geminiExplanation: 'The Mechanical Engineering scope maps perfectly to structural CAD design roles emphasizing fluidics and materials stress limits.',
      keyFactors: [
        'Heavy instruction in numerical tools and SolidWorks modeling',
        'Materials fatigue labs testing physical boundaries',
        'Cooperative design team assignments'
      ],
      analyzedAt: '2026-04-02T11:15:00Z'
    }
  },
  {
    id: 'G06',
    name: 'Chloe Fontaine',
    email: 'chloe.fontaine@example.com',
    degree: 'B.S. Business Administration',
    gradYear: 2023,
    employmentStatus: 'Employed Full-time',
    jobTitle: 'Technical Recruiter',
    employer: 'Alpha Talent Partners',
    industry: 'Human Resources / Tech recruiting',
    monthlySalary: 2900,
    yearOfEmploymentStart: 2023,
    skillsUsed: ['Negotiation', 'Candidate Sourcing', 'LinkedIn Recruiter', 'Onboarding'],
    surveyResponse: {
      usefulSkills: 'Human Behavior in Organizations and Business Communications courses. Learning how to pitch, resolve conflicts, and negotiate metrics was key.',
      obsoleteSkills: 'Classic old-school filing paper templates, manual ledger records.',
      curriculumGaps: 'Data-driven recruitment metrics, digital applicant tracking systems (ATS), and technological domain basics (understanding what devs actually do).',
      relevanceRating: 3,
      lastUpdated: '2026-05-01T08:12:00Z'
    },
    alignmentAnalysis: {
      alignmentCategory: 'Horizontal',
      alignmentScore: 70,
      geminiExplanation: 'The graduate uses general business, behavioral management, and organizational skills representing adjacent industry utility (Horizontal alignment) rather than a direct mathematical recruitment degree.',
      keyFactors: [
        'Organizational behavior strategies taught in the business core',
        'Strong communication and professional writing projects',
        'Self-motivated career pivot based on interpersonal skills'
      ],
      analyzedAt: '2026-05-01T08:15:00Z'
    }
  },
  {
    id: 'G07',
    name: 'James Henderson',
    email: 'james.h@example.com',
    degree: 'B.S. Computer Science',
    gradYear: 2020,
    employmentStatus: 'Self-employed',
    jobTitle: 'Independent Indie Game Dev',
    employer: 'PixelForge Studio (Solo)',
    industry: 'Entertainment / Game Dev',
    monthlySalary: 2600,
    yearOfEmploymentStart: 2020,
    skillsUsed: ['C#', 'Unity', 'Blender', 'Digital Marketing'],
    surveyResponse: {
      usefulSkills: 'Data Structures & Algorithms helped me optimize rendering loops, math-intensive subjects gave me the formulas for custom visual matrices.',
      obsoleteSkills: 'Very legacy database architectures using pre-relational formats or ancient SQL setups.',
      curriculumGaps: 'Game engine paradigms, design patterns for complex interactive media, and game asset monetization structures.',
      relevanceRating: 3,
      lastUpdated: '2025-08-14T17:30:00Z'
    },
    alignmentAnalysis: {
      alignmentCategory: 'Horizontal',
      alignmentScore: 78,
      geminiExplanation: 'A general CS degree provides high-quality logic training used to build software. However, game development involves non-trivial art, sound design, and niche engine frameworks not standard in CS.',
      keyFactors: [
        'Logical code design and algorithm optimization',
        'Linear algebra applied to 3D matrix mathematics',
        'Heavy self-taught game engine mechanics built on CS foundations'
      ],
      analyzedAt: '2025-08-14T18:00:00Z'
    }
  },
  {
    id: 'G08',
    name: 'Maria Santos',
    email: 'm.santos@example.com',
    degree: 'B.S. Nursing',
    gradYear: 2022,
    employmentStatus: 'Employed Full-time',
    jobTitle: 'Health Insurance Claims Auditor',
    employer: 'GlobalCare Insurance',
    industry: 'Finance / Health Tech',
    monthlySalary: 3500,
    yearOfEmploymentStart: 2023,
    skillsUsed: ['Medical Coding', 'Claims Auditing', 'Risk Assessment', 'Compliance'],
    surveyResponse: {
      usefulSkills: 'Pathophysiology, pharmacology, and terminology courses which allow me to inspect files and determine if surgery criteria align with codes.',
      obsoleteSkills: 'Manual vital-monitoring machinery, as clinical charts are integrated via sensor networks.',
      curriculumGaps: 'Medical policy guidelines, corporate insurance frameworks, and basic informatics databases.',
      relevanceRating: 4,
      lastUpdated: '2026-02-28T13:40:00Z'
    },
    alignmentAnalysis: {
      alignmentCategory: 'Horizontal',
      alignmentScore: 75,
      geminiExplanation: 'Nursing credential utilized in corporate auditing and insurance. Not active bedside care, but relies extensively on medical expertise for clinical evaluations.',
      keyFactors: [
        'Deep medical jargon and pharmacological training',
        'Clinical triage logic applied to claim analysis',
        'Quality assurance mindset developed in nursing safety modules'
      ],
      analyzedAt: '2026-02-28T14:10:00Z'
    }
  },
  {
    id: 'G09',
    name: 'Samuel Wright',
    email: 'sam.wright@example.com',
    degree: 'B.S. Mechanical Engineering',
    gradYear: 2021,
    employmentStatus: 'Employed Full-time',
    jobTitle: 'Logistics Operations Supervisor',
    employer: 'Speedway Logistics',
    industry: 'Supply Chain',
    monthlySalary: 3100,
    yearOfEmploymentStart: 2022,
    skillsUsed: ['Warehouse Management', 'Process Optimization', 'Route Tracking', 'Safety Compliance'],
    surveyResponse: {
      usefulSkills: 'Systems dynamics, operations research parameters, and general scientific methodology to diagnose bottlenecks.',
      obsoleteSkills: 'Manual materials resistance calculations that are now processed in online libraries.',
      curriculumGaps: 'Supply chain management theories, Enterprise Resource Planning (ERP) tools, and commercial telematics.',
      relevanceRating: 2,
      lastUpdated: '2025-10-12T09:25:00Z'
    },
    alignmentAnalysis: {
      alignmentCategory: 'Lateral/Non-aligned',
      alignmentScore: 40,
      geminiExplanation: 'Mechanical engineering focuses on thermal-fluidics and machine designs. Supervising transport logistic schedules represents a non-aligned lateral shift, though quantitative logic is useful.',
      keyFactors: [
        'Logical workflow diagnostics and root-cause analytical training',
        'Shift in career intent due to regional manufacturing shortages',
        'Strong optimization metrics used in daily management'
      ],
      analyzedAt: '2025-10-12T10:00:00Z'
    }
  },
  {
    id: 'G10',
    name: 'Fatima Al-Jamil',
    email: 'fatima.alj@example.com',
    degree: 'B.S. Business Administration',
    gradYear: 2025,
    employmentStatus: 'Unemployed',
    jobTitle: 'None (Actively Seeking)',
    employer: 'N/A',
    industry: 'N/A',
    monthlySalary: 0,
    yearOfEmploymentStart: 0,
    skillsUsed: [],
    surveyResponse: null,
    alignmentAnalysis: null
  },
  {
    id: 'G11',
    name: 'Arthur Pendelton',
    email: 'arthur.p@example.com',
    degree: 'B.S. Computer Science',
    gradYear: 2025,
    employmentStatus: 'Employed Part-time',
    jobTitle: 'Technical Support Specialist',
    employer: 'Local College IT Services',
    industry: 'Education',
    monthlySalary: 1400,
    yearOfEmploymentStart: 2025,
    skillsUsed: ['Network Configuration', 'Troubleshooting', 'Active Directory', 'Hardware Maintenance'],
    surveyResponse: null,
    alignmentAnalysis: null
  },
  {
    id: 'G12',
    name: 'Nisha Pillai',
    email: 'nisha.pillai@example.com',
    degree: 'B.S. Nursing',
    gradYear: 2024,
    employmentStatus: 'Pursuing Higher Education',
    jobTitle: 'M.S. Nurse Practitioner Candidate',
    employer: 'University Medical Science',
    industry: 'Education',
    monthlySalary: 0,
    yearOfEmploymentStart: 0,
    skillsUsed: ['Admissions', 'Advanced Health Assessment', 'Research Methods'],
    surveyResponse: null,
    alignmentAnalysis: null
  }
];

export const INITIAL_GRADUATES: Graduate[] = RAW_INITIAL_GRADUATES.map((g) => {
  const finalDegree = 'Bachelor of Science in Information Technology (BSIT)';

  // Provide robust IT-related specializations
  let undergraduateMajor = 'Information Technology & Systems Enterprise';
  let location = 'San Fernando, Romblon';
  let relevantCoursework = ['Web Development & Design', 'Database Management Systems', 'Computer Networks', 'Systems Analysis & Design'];
  let extracurricularActivities = ['RSU Guild of IT Students (GITS)', 'Alliance of Young Technologists'];
  let honorsAwards = ["Dean's List"];
  let selfReportedSkills = (g.skillsUsed || []).map(skill => ({
    skillName: skill,
    proficiencyLevel: 'Expert' as const
  }));

  if (g.jobTitle.toLowerCase().includes('engineer') || g.jobTitle.toLowerCase().includes('developer') || g.jobTitle.toLowerCase().includes('specialist')) {
    undergraduateMajor = 'Software Engineering & Web Technologies';
    relevantCoursework = ['Advanced Web Programming', 'Mobile Application Development', 'Object-Oriented Programming', 'Information Assurance & Security'];
  } else if (g.jobTitle.toLowerCase().includes('nurse') || g.jobTitle.toLowerCase().includes('clinical') || g.jobTitle.toLowerCase().includes('auditor')) {
    undergraduateMajor = 'Healthcare Informatics & Clinical Systems';
    relevantCoursework = ['Healthcare Database Admin', 'Clinical Information Systems', 'Systems Analysis for Hospital Operations'];
  } else if (g.jobTitle.toLowerCase().includes('manager') || g.jobTitle.toLowerCase().includes('advisor') || g.jobTitle.toLowerCase().includes('associate') || g.jobTitle.toLowerCase().includes('recruiter')) {
    undergraduateMajor = 'Enterprise Tech Management & Digital Solutions';
    relevantCoursework = ['IT Project Management', 'Information Technology Auditing', 'Enterprise Systems Architecture', 'Customer Relationship Management'];
  }

  return {
    ...g,
    degree: finalDegree,
    undergraduateMajor,
    relevantCoursework,
    extracurricularActivities,
    honorsAwards,
    selfReportedSkills,
    location,
  } as Graduate;
});

export const INITIAL_EMAIL_TEMPLATE: SurveyNotificationState = {
  emailSubject: 'Alumni Career Tracking — Help Enhance our Curriculum!',
  emailTemplate: `Dear {AlumniName},

We hope you are doing well and thriving in your career path!

As a proud graduate of our {GradDegree} program (Class of {GradYear}), your professional experience is extremely valuable to us. We are currently conducting our annual Tracer Study to understand alumni career structures and gather feedback on how to improve our courses.

Please spare 5 minutes to complete our feedback survey. Your inputs will directly assist our academic departments in updating curriculums, training programs, and lab resources to meet modern industry needs.

Access Your Custom Survey Form:
https://alumni.rsu.edu.ph/tracer-survey/form?token=auth_token_{AlumniID}

Thank you for your ongoing commitment to building academic excellence and guiding current students towards success!

Warm regards,

Office of Alumni Affairs & Academic Quality Assurance
Romblon State University-San Fernando Campus`,
  sendingFrequency: 'Quarterly',
  nextAutoTrigger: new Date(Date.now() + 24 * 60 * 60 * 1000 * 25).toISOString(), // 25 days from now
  isActive: true
};

export const INITIAL_EMAIL_LOGS: EmailLogEntry[] = [
  {
    id: 'LOG001',
    graduateId: 'G01',
    graduateName: 'Alex Rivera',
    graduateEmail: 'alex.rivera@example.com',
    subject: 'Alumni Career Tracking — Help Enhance our Curriculum!',
    body: `Dear Alex Rivera...`,
    sentAt: '2026-02-14T08:00:00Z',
    status: 'Opened'
  },
  {
    id: 'LOG002',
    graduateId: 'G02',
    graduateName: 'Sarah Chen',
    graduateEmail: 'sarah.chen@example.com',
    subject: 'Alumni Career Tracking — Help Enhance our Curriculum!',
    body: `Dear Sarah Chen...`,
    sentAt: '2026-03-09T08:00:00Z',
    status: 'Opened'
  },
  {
    id: 'LOG003',
    graduateId: 'G03',
    graduateName: 'Marcus Vance',
    graduateEmail: 'marcus.vance@example.com',
    subject: 'Alumni Career Tracking — Help Enhance our Curriculum!',
    body: `Dear Marcus Vance...`,
    sentAt: '2025-11-04T08:00:00Z',
    status: 'Opened'
  }
];
