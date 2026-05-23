/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EmploymentStatus =
  | 'Employed Full-time'
  | 'Employed Part-time'
  | 'Unemployed'
  | 'Self-employed'
  | 'Pursuing Higher Education';

export interface AlignmentAnalysis {
  alignmentCategory: 'Vertical' | 'Horizontal' | 'Lateral/Non-aligned';
  alignmentScore: number; // 0 - 100
  geminiExplanation: string;
  keyFactors: string[];
  analyzedAt: string;
}

export interface SurveyResponse {
  usefulSkills: string;
  obsoleteSkills: string;
  curriculumGaps: string;
  relevanceRating: number; // 1 to 5
  lastUpdated: string;
}

export interface SelfReportedSkill {
  skillName: string;
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface Graduate {
  id: string;
  name: string;
  email: string;
  degree: string; // e.g. "B.S. Computer Science", "B.S. Nursing", "B.S. Mechanical Engineering", "B.S. Business Administration"
  undergraduateMajor: string; // expanded major descriptor
  relevantCoursework: string[]; // key classes attended
  extracurricularActivities: string[]; // clubs, societies
  honorsAwards: string[]; // awards received
  selfReportedSkills: SelfReportedSkill[]; // self-reported proficiency skill matrix
  location: string; // geographic tracking locator
  gradYear: number;
  employmentStatus: EmploymentStatus;
  jobTitle: string;
  employer: string;
  industry: string;
  monthlySalary: number;
  yearOfEmploymentStart: number;
  skillsUsed: string[];
  surveyResponse: SurveyResponse | null;
  alignmentAnalysis: AlignmentAnalysis | null;
}

export interface SurveyNotificationState {
  emailSubject: string;
  emailTemplate: string;
  sendingFrequency: 'Monthly' | 'Quarterly' | 'Bi-Annually' | 'Annually';
  nextAutoTrigger: string;
  isActive: boolean;
}

export interface EmailLogEntry {
  id: string;
  graduateId: string;
  graduateName: string;
  graduateEmail: string;
  subject: string;
  body: string;
  sentAt: string;
  status: 'Delivered' | 'Failed' | 'Opened';
}

export interface CurriculumEnhancementReport {
  id: string;
  generatedAt: string;
  generalMetrics: {
    totalAlumniAnalyzed: number;
    averageRelevanceRating: number;
    verticalPercentage: number;
  };
  keyFindings: string[];
  skillsInHighDemand: { name: string; importanceScore: number }[];
  curriculumGaps: string[];
  recommendations: {
    department: string;
    curriculumAction: string; // "Add Course", "Revise Module", "Retire content", "Industry linkage"
    details: string;
    priority: 'High' | 'Medium' | 'Low';
  }[];
}

export interface InDemandJob {
  id: string;
  title: string;
  industry: string; // e.g. "Technology", "Healthcare", "Finance / Insurance", "Manufacturing / Automotive"
  requiredSkills: string[];
  demandLevel: 'High' | 'Very High' | 'Critical';
  salaryRange?: string;
  source: 'Employer Survey' | 'Market Trend API' | 'Alumni Referral' | 'Manual Input';
  description?: string;
  addedAt: string;
}

export interface FutureCurriculumInsight {
  id: string;
  generatedAt: string;
  visionOverview: string;
  suggestedOfferings: {
    courseTitle: string;
    industrySector: string;
    targetDegreeProgram: string;
    timelineYears: string; // e.g., "Next 1-2 years", "Next 3-5 years"
    coreSyllabusModules: string[];
    expectedVerticalityImpact: string;
    contributingInDemandJobs: string[];
  }[];
  strategicPillars: {
    pillarName: string;
    actionsRequired: string;
    verticalityKPIEffect: string;
  }[];
}

