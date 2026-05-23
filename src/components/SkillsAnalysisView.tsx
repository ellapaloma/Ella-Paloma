/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Graduate } from '../types';
import {
  AlertCircle,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  FileBadge,
  Activity,
  Briefcase
} from 'lucide-react';

interface SkillsAnalysisViewProps {
  id: string;
  graduates: Graduate[];
}

interface InDemandSkillTemplate {
  name: string;
  demandPercentage: number;
  description: string;
  employerFeedback: string;
}

const IN_DEMAND_MAP: Record<string, InDemandSkillTemplate[]> = {
  'Technology': [
    {
      name: 'React',
      demandPercentage: 95,
      description: 'Component-driven front-end interface engineering.',
      employerFeedback: 'Essential prerequisite. Some graduates know basic HTML but struggle with React state hooks and API rendering.'
    },
    {
      name: 'TypeScript',
      demandPercentage: 90,
      description: 'Strict typing structures for corporate SaaS stacks.',
      employerFeedback: 'Required flag. Standard JS is obsolete in high-scale projects. Graduates must master typed interfaces.'
    },
    {
      name: 'Python',
      demandPercentage: 88,
      description: 'Algorithmic prototyping, AI model scripts, and backend servers.',
      employerFeedback: 'Strong foundational utility. Mostly adequate, though data scraping and cleaning skills could be faster.'
    },
    {
      name: 'Docker',
      demandPercentage: 82,
      description: 'Containerized microservices orchestration.',
      employerFeedback: 'High gap item. Graduates frequently fail to compile Dockerfiles or deploy nodes to container networks.'
    },
    {
      name: 'CI/CD & Cloud Deployment',
      demandPercentage: 85,
      description: 'GitHub Actions, AWS infrastructure, and pipeline testing.',
      employerFeedback: 'Critical deficit. Very high friction where new hires struggle with Git branching workflows and automated pipelines.'
    },
    {
      name: 'PyTorch',
      demandPercentage: 78,
      description: 'Neural networks, tensor computation, and ML modeling.',
      employerFeedback: 'Elective gap. General math is good, but specialized training on LLM prompting and vector DB embeddings is needed.'
    }
  ],
  'Healthcare': [
    {
      name: 'Patient Care',
      demandPercentage: 100,
      description: 'Humble clinical bedside treatment and patient safety protocols.',
      employerFeedback: 'Outstanding proficiency. Graduates display excellent patient empathy and core clinical practices.'
    },
    {
      name: 'IV Therapy',
      demandPercentage: 92,
      description: 'Intravenous catheter insertion and fluid regulation.',
      employerFeedback: 'Requires practice. Bedside simulation was useful, but physical clinical dexterity demands additional field hours.'
    },
    {
      name: 'Crisis Care',
      demandPercentage: 85,
      description: 'Adrenaline trauma response and critical-care triage.',
      employerFeedback: 'Stress vulnerability. Academic tests are fine, but virtual coping labs are needed to prepare students for ICU trauma levels.'
    },
    {
      name: 'Epic Electronic Records (EMR)',
      demandPercentage: 95,
      description: 'Centralized health informatics and paperless charts.',
      employerFeedback: 'Tedious transition. Learning outdated ledger systems means hospital onboarding of Epic software requires expensive training.'
    }
  ],
  'Finance / Insurance': [
    {
      name: 'Financial Analysis',
      demandPercentage: 90,
      description: 'Corporate balance audits and revenue projection.',
      employerFeedback: 'Adequate grounding. Basic modeling is solid, but multi-variable scenario stress tests need work.'
    },
    {
      name: 'Risk Assessment',
      demandPercentage: 88,
      description: 'Risk metrics and credit eligibility profiling.',
      employerFeedback: 'Solid logical patterns. Quantitative reasoning is superb.'
    },
    {
      name: 'Claims Auditing',
      demandPercentage: 85,
      description: 'Evaluating medicine claim codes against protocols.',
      employerFeedback: 'Clinical interface gap. Finance majors lack clinical pathways, while nurse auditors are deficient in corporate logistics.'
    },
    {
      name: 'Compliance',
      demandPercentage: 92,
      description: 'Fiduciary regulations and consumer data security.',
      employerFeedback: 'Statute comprehension. Standard understanding is good, but automated compliance audit suites are new to them.'
    }
  ],
  'Manufacturing / Automotive': [
    {
      name: 'SolidWorks (CAD)',
      demandPercentage: 95,
      description: 'Component modeling and material extrusion diagrams.',
      employerFeedback: 'Superb. Capstone design projects render very high caliber parametric draft models.'
    },
    {
      name: 'ANSYS (FEA)',
      demandPercentage: 88,
      description: 'Finite Element Analysis for thermal and mechanical stress limits.',
      employerFeedback: 'High modeling gap. Numerical modeling of material fatigue is rarely practiced before employment.'
    },
    {
      name: '3D Printing',
      demandPercentage: 80,
      description: 'Additive manufacturing fabrication prototypes.',
      employerFeedback: 'Emerging tech. Good basic awareness, but physical extruder calibration requires additional workshop labs.'
    },
    {
      name: 'Process Optimization',
      demandPercentage: 85,
      description: 'Industrial assembly line routing and Six Sigma logic.',
      employerFeedback: 'Moderate skill levels. Basic parameters are applied adequately.'
    }
  ]
};

export default function SkillsAnalysisView({ id, graduates }: SkillsAnalysisViewProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('Technology');

  const analysisReport = useMemo(() => {
    const templatedSkills = IN_DEMAND_MAP[selectedIndustry] || [];
    
    // Filter graduates relevant to this sector:
    // Tech maps to Computer Science, Healthcare to Nursing, Finance to Business, Manufacturing to Mechanical Engineering
    const relevantGrads = graduates.filter(g => {
      if (selectedIndustry === 'Technology') return g.industry === 'Technology' || g.degree.includes('Computer Science') || g.degree.includes('Information Technology') || g.degree.includes('BSIT');
      if (selectedIndustry === 'Healthcare') return g.industry === 'Healthcare' || g.degree.includes('Nursing');
      if (selectedIndustry === 'Finance / Insurance') return g.industry === 'Finance / Insurance' || g.degree.includes('Business') || g.degree.includes('Accountancy');
      if (selectedIndustry === 'Manufacturing / Automotive') return g.industry === 'Manufacturing / Automotive' || g.degree.includes('Mechanical') || g.degree.includes('Electrical');
      return true;
    });

    const totalCount = relevantGrads.length || 1;

    const analyzedSkills = templatedSkills.map(template => {
      // Find how many alumni have self-reported this skill (Intermediate or Expert)
      // or match skillsUsed case-insensitively
      const matchingAlumni = relevantGrads.filter(g => {
        const matchesSelfReported = g.selfReportedSkills?.some(sk => 
          sk.skillName.toLowerCase() === template.name.toLowerCase() && 
          (sk.proficiencyLevel === 'Expert' || sk.proficiencyLevel === 'Intermediate')
        );
        const matchesSkillsUsed = g.skillsUsed?.some(sk => 
          sk.toLowerCase() === template.name.toLowerCase()
        );
        return matchesSelfReported || matchesSkillsUsed;
      });

      const supplyCount = matchingAlumni.length;
      // Synthesize realistic supply percentage
      const baselineSupplies: Record<string, number> = {
        'React': 45, 'TypeScript': 35, 'Python': 55, 'Docker': 15, 'CI/CD & Cloud Deployment': 10, 'PyTorch': 20,
        'Patient Care': 90, 'IV Therapy': 60, 'Crisis Care': 45, 'Epic Electronic Records (EMR)': 25,
        'Financial Analysis': 75, 'Risk Assessment': 65, 'Claims Auditing': 30, 'Compliance': 50,
        'SolidWorks (CAD)': 85, 'ANSYS (FEA)': 40, '3D Printing': 50, 'Process Optimization': 60
      };

      const baseWeight = baselineSupplies[template.name] || 40;
      // If we added or modified graduates with these skills, raise the supply!
      const supplyPercentage = Math.min(100, Math.round(baseWeight + (supplyCount * 12)));
      
      const gapPercentage = Math.max(0, template.demandPercentage - supplyPercentage);

      let status: 'Critical Deficit' | 'Moderate Shortage' | 'Aligned' = 'Aligned';
      if (gapPercentage > 45) {
        status = 'Critical Deficit';
      } else if (gapPercentage > 15) {
        status = 'Moderate Shortage';
      }

      return {
        name: template.name,
        demand: template.demandPercentage,
        supply: supplyPercentage,
        gap: gapPercentage,
        status,
        description: template.description,
        feedback: template.employerFeedback,
        representedCount: supplyCount
      };
    });

    // Overall summary parameters
    const averageGap = Math.round(analyzedSkills.reduce((sum, s) => sum + s.gap, 0) / (analyzedSkills.length || 1));
    const deficitsCount = analyzedSkills.filter(s => s.status === 'Critical Deficit').length;

    return {
      skills: analyzedSkills,
      averageGap,
      deficitsCount,
      relevantCohortSize: relevantGrads.length
    };
  }, [selectedIndustry, graduates]);

  return (
    <div id={id} className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight font-display text-white">Skills Gap Intelligence</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Compares curricula learning outcomes against employer feedback and real-time market trends.
          </p>
        </div>

        {/* Industry switcher rail */}
        <div className="flex flex-wrap gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {Object.keys(IN_DEMAND_MAP).map(ind => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3 py-1.5 rounded text-xs font-semibold select-none cursor-pointer transition-all ${
                selectedIndustry === ind
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {ind.split(' / ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* KPI summaries row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider block">Target Specialty Group</span>
            <span className="text-lg font-bold text-white font-display mt-1 block">
              {selectedIndustry} Sector
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {analysisReport.relevantCohortSize} tracked graduates analyzed
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider block">Average Curricular Deficit</span>
            <span className="text-lg font-bold text-white font-mono mt-1 block h-fit flex items-baseline gap-1.5">
              {analysisReport.averageGap}%
              <span className="text-[10px] font-sans font-medium text-amber-400">Shortfall</span>
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Gap between employer needs & alumni ratings
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider block">Detected Critical Gaps</span>
            <span className="text-lg font-bold text-rose-400 font-display mt-1 block">
              {analysisReport.deficitsCount} Skill Shortages
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Requires immediate curriculum enhancement
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: SVG Comparison Chart */}
        <div className="lg:col-span-12 xl:col-span-5 p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Proficiency Gap Index Mapping
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Visualizes the match between critical market requirement indices (gray outer) vs localized alumni supply capability (inner).
            </p>
          </div>

          {/* SVG radar-like or segment-like compare mapping */}
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="space-y-4 w-full max-w-sm">
              {analysisReport.skills.map((sk, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-300">{sk.name}</span>
                    <span className="font-mono text-[11px] text-slate-500">
                      Demand: <span className="text-white font-semibold">{sk.demand}%</span> • Supply: <span className="text-emerald-400 font-semibold">{sk.supply}%</span>
                    </span>
                  </div>

                  <div className="h-3 w-full bg-slate-950 rounded-md overflow-hidden relative border border-slate-800/80">
                    {/* Market Demand Marker bar */}
                    <div 
                      className="absolute top-0 bottom-0 bg-slate-800 border-r border-slate-650"
                      style={{ width: `${sk.demand}%` }}
                    />
                    {/* Alumn Supply bar overlay */}
                    <div 
                      className={`absolute top-0 bottom-0 rounded shadow-sm opacity-95 transition-all duration-500 bg-gradient-to-r ${
                        sk.status === 'Critical Deficit' 
                          ? 'from-rose-600 to-rose-400' 
                          : sk.status === 'Moderate Shortage'
                            ? 'from-amber-500 to-amber-300'
                            : 'from-emerald-600 to-emerald-400'
                      }`}
                      style={{ width: `${sk.supply}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center gap-4 pt-4 mt-4 border-t border-slate-800 w-full text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span>Well Aligned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                <span>Moderate Shortage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                <span>Critical Deficit (&gt;45% Gap)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-[11px] text-slate-400 leading-relaxed text-center">
            💡 <strong>Dynamic tracking</strong>: Editing graduate profiles, registering technical skill sets or proficiency levels immediately updates the alumni supply percentages here.
          </div>
        </div>

        {/* Right column: Detailed Gaps list */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-4">
          <h2 className="text-sm font-bold font-display text-white uppercase tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Employer Feedback & Curricular Interventions
          </h2>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {analysisReport.skills.map((sk, index) => {
              const Icon = sk.status === 'Aligned' ? CheckCircle : AlertTriangle;
              return (
                <div 
                  key={index} 
                  className={`p-4 rounded-xl border transition-all ${
                    sk.status === 'Critical Deficit'
                      ? 'border-red-500/20 bg-red-500/5'
                      : sk.status === 'Moderate Shortage'
                        ? 'border-amber-500/20 bg-amber-500/5'
                        : 'border-slate-800 bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg shrink-0 ${
                        sk.status === 'Critical Deficit'
                          ? 'bg-rose-500/10 text-rose-400'
                          : sk.status === 'Moderate Shortage'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{sk.name}</h4>
                        <span className="text-[10px] text-slate-500 font-sans tracking-wide">
                          {sk.description}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase shrink-0 ${
                      sk.status === 'Critical Deficit'
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        : sk.status === 'Moderate Shortage'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {sk.status}
                    </span>
                  </div>

                  {/* Employer review text */}
                  <div className="mt-3 pl-8 border-l border-slate-800 space-y-1.5">
                    <p className="text-[11px] text-slate-350 italic leading-normal">
                      <strong className="text-slate-400 block font-sans not-italic text-[9px] uppercase font-bold tracking-wider mb-0.5">Employer Feedback Audit:</strong>
                      "{sk.feedback}"
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1.5">
                      <span>Curricular Priority Gap index: <strong className="text-white font-mono">{sk.gap}% shortfall</strong></span>
                      <span>Analyzed registry: {sk.representedCount} active mentions</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
