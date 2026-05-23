/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InDemandJob, FutureCurriculumInsight, Graduate } from '../types';
import {
  Sparkles,
  TrendingUp,
  AlertCircle,
  Briefcase,
  Layers,
  GraduationCap,
  Plus,
  Trash2,
  BookmarkCheck,
  Calendar,
  DollarSign,
  Award,
  BookOpen,
  LineChart,
  Grid,
  CheckCircle2,
  FolderPlus,
  X
} from 'lucide-react';

interface FutureCurriculumViewProps {
  id: string;
  graduates: Graduate[];
}

export default function FutureCurriculumView({ id, graduates }: FutureCurriculumViewProps) {
  const [jobs, setJobs] = useState<InDemandJob[]>([]);
  const [insight, setInsight] = useState<FutureCurriculumInsight | null>(null);
  
  // Loading & State
  const [jobsLoading, setJobsLoading] = useState(false);
  const [insightLoading, setInsightLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  
  // Add job modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newIndustry, setNewIndustry] = useState('Technology');
  const [newSkillsStr, setNewSkillsStr] = useState('');
  const [newDemandLevel, setNewDemandLevel] = useState<'High' | 'Very High' | 'Critical'>('Very High');
  const [newSalary, setNewSalary] = useState('');
  const [newSource, setNewSource] = useState<'Employer Survey' | 'Market Trend API' | 'Alumni Referral' | 'Manual Input'>('Employer Survey');
  const [newDesc, setNewDesc] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch jobs
  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const res = await fetch('/api/in-demand-jobs');
      if (!res.ok) throw new Error('Failed to retrieve in-demand jobs database');
      const data = await res.json();
      setJobs(data);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'Error loading job trends data');
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // Retrieve cached insight from localStorage if it exists
    const cached = localStorage.getItem('tracer_curriculum_insight');
    if (cached) {
      try {
        setInsight(JSON.parse(cached));
      } catch (e) {
        console.error('Failed to parse cached insight', e);
      }
    }
  }, []);

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newTitle.trim()) {
      setFormError('Please define a precise job role title (e.g. Kubernetes Administrator)');
      return;
    }

    const skills = newSkillsStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (skills.length === 0) {
      setFormError('Describe at least one key technology or skill required at entry level');
      return;
    }

    try {
      const res = await fetch('/api/in-demand-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          industry: newIndustry,
          requiredSkills: skills,
          demandLevel: newDemandLevel,
          salaryRange: newSalary.trim() || 'TBD',
          source: newSource,
          description: newDesc.trim()
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to register job requirement');
      }

      const added = await res.json();
      setJobs(prev => [added, ...prev]);
      
      // Clean up & Close
      setIsAddOpen(false);
      setNewTitle('');
      setNewSkillsStr('');
      setNewSalary('');
      setNewDesc('');
    } catch (err: any) {
      setFormError(err.message || 'System fault registering requirement');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      const res = await fetch(`/api/in-demand-jobs/${jobId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setJobs(prev => prev.filter(j => j.id !== jobId));
      } else {
        throw new Error('Failed to delete job profile');
      }
    } catch (err: any) {
      setErrorText(err.message || 'Error deleting job requirement');
    }
  };

  const handleGenerateCurriculumVisions = async () => {
    setInsightLoading(true);
    setErrorText(null);
    try {
      const res = await fetch('/api/curriculum-insights/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to prompt academic review session');
      }

      const data = await res.json();
      setInsight(data);
      localStorage.setItem('tracer_curriculum_insight', JSON.stringify(data));
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'Gemini model returned a parsing exception. Verify your keys.');
    } finally {
      setInsightLoading(false);
    }
  };

  return (
    <div id={id} className="space-y-6">
      {/* Dynamic Error Status header */}
      {errorText && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 rounded-xl flex gap-3 items-start shadow-inner">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold font-display">Service Communication Notice</p>
            <p className="mt-0.5 text-slate-400">{errorText}</p>
          </div>
          <button onClick={() => setErrorText(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid: Industry job demands catalog and AI generation vision */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: In-demand jobs collection tracker (4 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col h-full space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  Industry Job Catalog
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Active positions and required skills currently reported by employers.
                </p>
              </div>
              <button
                onClick={() => {
                  setFormError(null);
                  setIsAddOpen(true);
                }}
                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 cursor-pointer transition-colors shrink-0"
                title="Add job requirement"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Catalog list block */}
            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1 flex-1">
              {jobsLoading ? (
                <div className="py-20 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <span className="text-[11px] text-slate-500 font-mono">Synchronizing market index...</span>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl p-4">
                  <FolderPlus className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-400">Empty Industry Catalog</p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    No active job trends have been collected yet. Use the plus button above to document industry requirements.
                  </p>
                </div>
              ) : (
                jobs.map(job => (
                  <div
                    key={job.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-2.5 relative group hover:border-slate-750 transition-all shadow-md"
                  >
                    {/* Delete handler */}
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="absolute top-3 right-3 text-slate-600 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove from feed"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="pr-4 space-y-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[9px] font-bold">
                        {job.id}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-1 leading-tight font-display">{job.title}</h4>
                      <p className="text-[10px] text-slate-400">{job.industry}</p>
                    </div>

                    {job.description && (
                      <p className="text-[10px] text-slate-500 leading-relaxed italic border-l-2 border-slate-800 pl-2">
                        {job.description}
                      </p>
                    )}

                    {/* Skill labels */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.requiredSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 shrink-0"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-[9px] pt-1 border-t border-slate-900 font-medium text-slate-500">
                      <span className="font-mono text-emerald-400 font-semibold">{job.salaryRange}</span>
                      <span
                        className={`font-semibold uppercase tracking-wider ${
                          job.demandLevel === 'Critical'
                            ? 'text-rose-400'
                            : job.demandLevel === 'Very High'
                              ? 'text-amber-400'
                              : 'text-indigo-400'
                        }`}
                      >
                        {job.demandLevel} Demand
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">How it works:</span>
              <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                By maintaining a curated catalog of standard job role titles, core requirements, and desired skill stacks, the curriculum QA team establishes an active alignment reference.
              </p>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                The Gemini model processes these items as curriculum inputs to suggest optimized, industry-aligned course visions.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Generation and Suggestion vision panel (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8">
          {insightLoading ? (
            <div className="p-20 rounded-xl border border-slate-800 bg-slate-900 flex flex-col items-center justify-center space-y-4 text-center h-full min-h-[450px]">
              <div className="relative">
                <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <Sparkles className="w-5 h-5 text-purple-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-1 max-w-sm">
                <p className="text-white text-xs font-bold font-display uppercase tracking-widest">Compiling 3-5 Year Curricular Roadmap</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Interpreting current alumni placement deficits, mapping recorded industry skill demands, and synthesizing high-impact curriculum proposals via Gemini.
                </p>
              </div>
            </div>
          ) : insight ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Strategic overview header card */}
              <div className="p-5 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 space-y-4 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-bold tracking-widest uppercase">
                        Strategic Foresight
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">ID: {insight.id}</span>
                    </div>
                    <h2 className="text-base font-bold text-white font-display">
                      Academic Verticality Alignment Vision (3-5 Years)
                    </h2>
                  </div>

                  <button
                    onClick={handleGenerateCurriculumVisions}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold font-display text-[11px] transition-all flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Re-Synthesize Vision
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Strategic Framework:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {insight.visionOverview}
                  </p>
                </div>
              </div>

              {/* Course suggestions cards */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-display">
                    <GraduationCap className="w-4 h-4 text-purple-400" />
                    Suggested Course Curriculum Offerings
                  </h3>
                  <span className="text-[10px] text-slate-500">Launch Timeline Target</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insight.suggestedOfferings?.map((course, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all space-y-3.5 relative overflow-hidden group shadow-md"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2.5">
                          <div>
                            <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono text-[9px] font-bold uppercase tracking-wider">
                              {course.targetDegreeProgram.replace('B.S. ', '') || 'Academic Elective'}
                            </span>
                            <h4 className="text-xs font-bold font-display text-white mt-1 leading-snug group-hover:text-emerald-400 transition-colors">
                              {course.courseTitle}
                            </h4>
                          </div>

                          <span className="px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase shrink-0 text-amber-400 bg-amber-500/10">
                            {course.timelineYears}
                          </span>
                        </div>

                        {/* Modules bullets */}
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Proposed Core Modules</span>
                          <div className="grid grid-cols-1 gap-1">
                            {course.coreSyllabusModules?.slice(0, 3).map((mod, midx) => (
                              <div key={midx} className="flex items-center gap-2 text-[10px] text-slate-400">
                                <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                                <span className="truncate" title={mod}>{mod}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Impact justification */}
                        <div className="pt-2 border-t border-slate-950 space-y-1">
                          <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest block">Expected Verticality Lift</span>
                          <p className="text-[10.5px] text-slate-400 leading-relaxed leading-normal line-clamp-3">
                            {course.expectedVerticalityImpact}
                          </p>
                        </div>
                      </div>

                      {/* Contributing Jobs */}
                      {course.contributingInDemandJobs && course.contributingInDemandJobs.length > 0 && (
                        <div className="pt-2 border-t border-slate-950 flex flex-wrap gap-1 items-center">
                          <span className="text-[8.5px] font-mono font-semibold text-slate-500 mr-1 shrink-0">Responds to:</span>
                          {course.contributingInDemandJobs.map((it, iidx) => (
                            <span
                              key={iidx}
                              className="px-1.5 py-0.2 rounded-full bg-slate-950 text-slate-400 text-[8.5px] font-mono border border-slate-850 truncate max-w-[130px] inline-block mt-0.5 shrink-0"
                              title={it}
                            >
                              {it}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic execution pillars card */}
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-display">
                  <Layers className="w-4 h-4 text-purple-400" />
                  Futuristic strategic implementation Pillars
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {insight.strategicPillars?.map((pillar, pidx) => (
                    <div key={pidx} className="p-3.5 rounded-lg bg-slate-950 border border-slate-850 space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="p-1 rounded bg-purple-500/10 text-purple-400 font-mono text-[10px] font-bold">
                          0{pidx + 1}
                        </span>
                        <div>
                          <strong className="text-xs text-white block leading-tight font-display">{pillar.pillarName}</strong>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal pl-7">
                        {pillar.actionsRequired}
                      </p>
                      <div className="pt-1.5 border-t border-slate-900 pl-7 flex items-center gap-1 text-[9px] text-emerald-400 font-semibold uppercase font-mono">
                        <TrendingUp className="w-3 h-3 shrink-0" />
                        <span>KPI Target: {pillar.verticalityKPIEffect}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-16 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 flex flex-col items-center justify-center space-y-4 text-center h-full min-h-[440px]">
              <div className="p-3 rounded-full bg-slate-950 border border-slate-850">
                <LineChart className="w-8 h-8 text-slate-500 animate-pulse" />
              </div>
              <div className="max-w-md space-y-1">
                <h3 className="text-sm font-bold text-slate-300 font-display uppercase tracking-wider">Uninitialized Roadmap Framework</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generate optimized 3-5 Year curriculum projections designed directly to intercept collected in-demand market jobs and guarantee robust degree-to-employer verticality matching rates.
                </p>
              </div>
              <button
                onClick={handleGenerateCurriculumVisions}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold font-display text-xs transition-transform flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4 text-slate-900 font-extrabold" />
                Initialize 3-5 Yr Projections
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add job demand modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative z-10 p-5 space-y-4"
            >
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-display">
                    <FolderPlus className="w-4 h-4 text-emerald-400" />
                    Collect In-Demand Employer Job
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Document current job openings inside the industry to adapt curricular standards.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="text-slate-500 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-400 rounded-lg font-medium">
                  {formError}
                </div>
              )}

              <form onSubmit={handleAddJob} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Job Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lead Devops Systems Specialist"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Industry Domain */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Industry Field</label>
                    <select
                      value={newIndustry}
                      onChange={e => setNewIndustry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance / Insurance">Finance / Insurance</option>
                      <option value="Manufacturing / Automotive">Manufacturing / Automotive</option>
                    </select>
                  </div>
                </div>

                {/* Comma-separated required skills */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Required Stack & Skills (Comma-separated)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Python, PyTorch, Docker, Kubernetes"
                    value={newSkillsStr}
                    onChange={e => setNewSkillsStr(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  />
                  <p className="text-[9px] text-slate-500 mt-0.5">Separate multiple technologies or qualifications with a comma (e.g. Git, REST APIs)</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Demand Magnitude */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Demand Threshold</label>
                    <select
                      value={newDemandLevel}
                      onChange={e => setNewDemandLevel(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="High">High Demand</option>
                      <option value="Very High">Very High Demand</option>
                      <option value="Critical">Critical Demand</option>
                    </select>
                  </div>

                  {/* Starting Compensation */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est Compensation Range</label>
                    <input
                      type="text"
                      placeholder="e.g. $4,500 - $6,000/mo"
                      value={newSalary}
                      onChange={e => setNewSalary(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                    />
                  </div>
                </div>

                {/* Data Source & Desc */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Information Source</label>
                    <select
                      value={newSource}
                      onChange={e => setNewSource(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="Employer Survey">Employer Survey / Placement Partners</option>
                      <option value="Market Trend API">Market Trend Analysis API</option>
                      <option value="Alumni Referral">Alumni / Advisor Placement Report</option>
                      <option value="Manual Input">Manual Board Entry</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Brief Description / Project Context</label>
                    <textarea
                      placeholder="Brief details about daily tasks or company expectations..."
                      value={newDesc}
                      rows={2}
                      onChange={e => setNewDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors font-sans leading-normal"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                    Record Demand
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
