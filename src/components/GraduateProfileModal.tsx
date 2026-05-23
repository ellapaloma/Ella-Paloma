/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Send, Save, BookOpen, Sparkles, Building, Briefcase, Mail, Plus, Trash2 } from 'lucide-react';
import { Graduate, EmploymentStatus, SelfReportedSkill } from '../types';

interface GraduateProfileModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Graduate, 'id'>) => Promise<void>;
  graduate?: Graduate | null;
  onSimulateSurvey?: (
    usefulSkills: string,
    obsoleteSkills: string,
    curriculumGaps: string,
    relevanceRating: number
  ) => Promise<void>;
  programs?: string[];
}

const DEGREES = [
  'Bachelor of Science in Information Technology (BSIT)'
];

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance / Insurance',
  'Manufacturing / Automotive',
  'Supply Chain',
  'Education',
  'Entertainment / Game Dev',
  'Hospitality'
];

const EMPLOYMENT_STATUSES: EmploymentStatus[] = [
  'Employed Full-time',
  'Employed Part-time',
  'Unemployed',
  'Self-employed',
  'Pursuing Higher Education'
];

export default function GraduateProfileModal({
  id,
  isOpen,
  onClose,
  onSubmit,
  graduate,
  onSimulateSurvey,
  programs
}: GraduateProfileModalProps) {
  const activePrograms = programs && programs.length > 0 ? programs : DEGREES;
  const [activeTab, setActiveTab] = useState<'profile' | 'survey'>('profile');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [degree, setDegree] = useState(activePrograms[0]);
  const [gradYear, setGradYear] = useState(2025);
  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus>('Employed Full-time');
  const [jobTitle, setJobTitle] = useState('');
  const [employer, setEmployer] = useState('');
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [yearOfEmploymentStart, setYearOfEmploymentStart] = useState(2025);
  const [skillsText, setSkillsText] = useState('');
  const [loading, setLoading] = useState(false);

  // Expanded profiling fields
  const [undergraduateMajor, setUndergraduateMajor] = useState('');
  const [locationText, setLocationText] = useState('');
  const [courseworkText, setCourseworkText] = useState('');
  const [extracurricularsText, setExtracurricularsText] = useState('');
  const [honorsText, setHonorsText] = useState('');
  const [selfReportedSkills, setSelfReportedSkills] = useState<SelfReportedSkill[]>([]);
  
  // Local addition parameters
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Intermediate');

  // Survey responses fields
  const [usefulSkills, setUsefulSkills] = useState('');
  const [obsoleteSkills, setObsoleteSkills] = useState('');
  const [curriculumGaps, setCurriculumGaps] = useState('');
  const [relevanceRating, setRelevanceRating] = useState(4);

  useEffect(() => {
    if (graduate) {
      setName(graduate.name || '');
      setEmail(graduate.email || '');
      setDegree(graduate.degree || activePrograms[0]);
      setGradYear(graduate.gradYear || 2025);
      setEmploymentStatus(graduate.employmentStatus || 'Employed Full-time');
      setJobTitle(graduate.jobTitle || '');
      setEmployer(graduate.employer || '');
      setIndustry(graduate.industry || INDUSTRIES[0]);
      setMonthlySalary(graduate.monthlySalary || 0);
      setYearOfEmploymentStart(graduate.yearOfEmploymentStart || 2025);
      setSkillsText(graduate.skillsUsed ? graduate.skillsUsed.join(', ') : '');

      // Bind expanded profiling values safely
      setUndergraduateMajor(graduate.undergraduateMajor || '');
      setLocationText(graduate.location || '');
      setCourseworkText(graduate.relevantCoursework ? graduate.relevantCoursework.join(', ') : '');
      setExtracurricularsText(graduate.extracurricularActivities ? graduate.extracurricularActivities.join(', ') : '');
      setHonorsText(graduate.honorsAwards ? graduate.honorsAwards.join(', ') : '');
      setSelfReportedSkills(graduate.selfReportedSkills || []);

      if (graduate.surveyResponse) {
        setUsefulSkills(graduate.surveyResponse.usefulSkills || '');
        setObsoleteSkills(graduate.surveyResponse.obsoleteSkills || '');
        setCurriculumGaps(graduate.surveyResponse.curriculumGaps || '');
        setRelevanceRating(graduate.surveyResponse.relevanceRating || 4);
      } else {
        setUsefulSkills('');
        setObsoleteSkills('');
        setCurriculumGaps('');
        setRelevanceRating(4);
      }
    } else {
      setName('');
      setEmail('');
      setDegree(activePrograms[0]);
      setGradYear(2025);
      setEmploymentStatus('Employed Full-time');
      setJobTitle('');
      setEmployer('');
      setIndustry(INDUSTRIES[0]);
      setMonthlySalary(0);
      setYearOfEmploymentStart(2025);
      setSkillsText('');

      // Clear expanded profiling values
      setUndergraduateMajor('');
      setLocationText('');
      setCourseworkText('');
      setExtracurricularsText('');
      setHonorsText('');
      setSelfReportedSkills([]);

      setUsefulSkills('');
      setObsoleteSkills('');
      setCurriculumGaps('');
      setRelevanceRating(4);
    }
    setNewSkillName('');
    setNewSkillLevel('Intermediate');
    setActiveTab('profile');
  }, [graduate, isOpen]);

  if (!isOpen) return null;

  async function handleCoreSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsArray = skillsText
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const courseworkArray = courseworkText
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const extracurricularsArray = extracurricularsText
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const honorsArray = honorsText
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await onSubmit({
        name,
        email,
        degree,
        undergraduateMajor: undergraduateMajor || degree,
        relevantCoursework: courseworkArray,
        extracurricularActivities: extracurricularsArray,
        honorsAwards: honorsArray,
        selfReportedSkills,
        location: locationText || 'Unknown Location',
        gradYear: Number(gradYear),
        employmentStatus,
        jobTitle: employmentStatus === 'Unemployed' ? 'None (Actively Seeking)' : jobTitle,
        employer: employmentStatus === 'Unemployed' ? 'N/A' : employer,
        industry: employmentStatus === 'Unemployed' ? 'N/A' : industry,
        monthlySalary: employmentStatus === 'Unemployed' ? 0 : Number(monthlySalary),
        yearOfEmploymentStart: employmentStatus === 'Unemployed' ? 0 : Number(yearOfEmploymentStart),
        skillsUsed: skillsArray,
        surveyResponse: graduate?.surveyResponse || null,
        alignmentAnalysis: graduate?.alignmentAnalysis || null
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSimulateFeedback() {
    if (!onSimulateSurvey || !graduate) return;
    setLoading(true);
    try {
      await onSimulateSurvey(usefulSkills, obsoleteSkills, curriculumGaps, relevanceRating);
      setActiveTab('profile');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const isUnemployed = employmentStatus === 'Unemployed';

  return (
    <div id={id} className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-display text-white">
              {graduate ? `Configure Profile: ${graduate.name}` : 'Register New Graduate Alumni'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Insert demographic and current employment tracking parameters.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        {graduate && (
          <div className="flex border-b border-slate-800 bg-slate-900/50">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 text-xs font-semibold tracking-wide uppercase flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              General Profile
            </button>
            <button
              onClick={() => setActiveTab('survey')}
              className={`flex-1 py-3 text-xs font-semibold tracking-wide uppercase flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'survey'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Survey Tracer Feedback {graduate.surveyResponse ? '✓' : '(Simulate reply)'}
            </button>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'profile' ? (
            <form onSubmit={handleCoreSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Liam Sterling"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. liam@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Degree */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Degree Program Level</label>
                  <select
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {activePrograms.map((deg) => (
                      <option key={deg} value={deg}>
                        {deg}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Graduation Year */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Graduation Year</label>
                  <input
                    type="number"
                    min="2010"
                    max="2030"
                    required
                    value={gradYear}
                    onChange={(e) => setGradYear(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Advanced Profiling Section */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-4 pt-4">
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800 text-xs font-bold text-slate-400 tracking-wide uppercase">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Academic Profile & Skills Catalog
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Specialized Focus Major */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-slate-300">Specialized Major / Concentration</label>
                    <input
                      type="text"
                      value={undergraduateMajor}
                      onChange={(e) => setUndergraduateMajor(e.target.value)}
                      placeholder="e.g. AI & Big Data Science"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Location */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-slate-300">Geographic Location (City, State/Country)</label>
                    <input
                      type="text"
                      placeholder="e.g. San Francisco, CA"
                      value={locationText}
                      onChange={(e) => setLocationText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Honors Awards */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-slate-300">Honors & Academic Awards (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Dean's List, Magna Cum Laude"
                      value={honorsText}
                      onChange={(e) => setHonorsText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Relevant Coursework */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-slate-300">Relevant Coursework (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Machine Learning, Neural Networks"
                      value={courseworkText}
                      onChange={(e) => setCourseworkText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Extracurricular Activities */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-slate-300">Extracurricular Activities (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Women in Science Association, CS Club"
                      value={extracurricularsText}
                      onChange={(e) => setExtracurricularsText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Self reported skills & proficiency */}
                <div className="p-3 border border-slate-800 bg-slate-950/60 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">Self-Reported Skill Portfolio</span>
                    <span className="text-[9px] text-slate-550">Direct Proficiency Levels</span>
                  </div>
                  
                  {selfReportedSkills.length === 0 ? (
                    <p className="text-[10px] text-slate-500 italic pb-1">No self-reported skills registered yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 pb-1">
                      {selfReportedSkills.map((sk, index) => (
                        <span key={index} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                          <strong>{sk.skillName}</strong>
                          <span className={`px-1 rounded-full text-[8px] font-bold ${
                            sk.proficiencyLevel === 'Expert' ? 'bg-purple-950/50 text-purple-400 border border-purple-800/40' :
                            sk.proficiencyLevel === 'Intermediate' ? 'bg-indigo-950/50 text-indigo-400 border border-indigo-800/40' :
                            'bg-slate-950 text-slate-400 border border-slate-800'
                          }`}>
                            {sk.proficiencyLevel}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelfReportedSkills(selfReportedSkills.filter((_, idx) => idx !== index))}
                            className="hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 pt-2.5 border-t border-slate-800/50">
                    <div className="sm:col-span-6">
                      <input
                        type="text"
                        placeholder="Add skill, e.g. AWS Deployment"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <select
                        value={newSkillLevel}
                        onChange={(e) => setNewSkillLevel(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!newSkillName.trim()) return;
                          if (selfReportedSkills.some(x => x.skillName.toLowerCase() === newSkillName.trim().toLowerCase())) {
                            return;
                          }
                          setSelfReportedSkills([...selfReportedSkills, { skillName: newSkillName.trim(), proficiencyLevel: newSkillLevel }]);
                          setNewSkillName('');
                        }}
                        className="w-full py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-[10px] hover:bg-emerald-400 flex items-center justify-center gap-0.5 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Put
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Employment Status</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EMPLOYMENT_STATUSES.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setEmploymentStatus(status)}
                      className={`text-xs px-2.5 py-2 rounded-lg border text-left font-medium transition-colors ${
                        employmentStatus === status
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {!isUnemployed && (
                <div className="space-y-4 pt-2 border-t border-slate-800/60">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Job Title */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">Job Title</label>
                      <input
                        type="text"
                        required={!isUnemployed}
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Logistics Analyst"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    {/* Employer */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">Employer Name</label>
                      <input
                        type="text"
                        required={!isUnemployed}
                        value={employer}
                        onChange={(e) => setEmployer(e.target.value)}
                        placeholder="e.g. Intel Corp"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Industry */}
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">Business Sector / Industry</label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      >
                        {INDUSTRIES.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Monthly Salary */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">Monthly Income ($USD)</label>
                      <input
                        type="number"
                        min="0"
                        required={!isUnemployed}
                        value={monthlySalary}
                        onChange={(e) => setMonthlySalary(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Start Year */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">Year Employment Started</label>
                      <input
                        type="number"
                        min="2010"
                        max="2030"
                        required={!isUnemployed}
                        value={yearOfEmploymentStart}
                        onChange={(e) => setYearOfEmploymentStart(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Professional Skills Used */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">Skills Used (comma-separated)</label>
                      <input
                        type="text"
                        value={skillsText}
                        onChange={(e) => setSkillsText(e.target.value)}
                        placeholder="e.g. AutoCAD, CNC, Materials Testing"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/60 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <p className="font-semibold text-emerald-400">Tracer Survey Feedback Simulator</p>
                  <p className="mt-1">
                    Record educational diagnostics on behalf of this graduate. This registers the survey feedback required by the 
                    <strong> Decision Support System (DSS)</strong> to synthesize curriculum quality and detect obsolete skills!
                  </p>
                </div>
              </div>

              {/* Relevance Score */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Curriculum Relevance Rating: <span className="text-emerald-400 font-bold">{relevanceRating} / 5</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setRelevanceRating(score)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-display font-bold transition-all ${
                        relevanceRating === score
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950 ring-2 ring-emerald-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  How well did the university degree prepare this alumnus for their real-world jobs? (1 = Irrelevant, 5 = Extemely Aligned)
                </span>
              </div>

              {/* Useful skills */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Most Useful Academic Skills/Courses</label>
                <textarea
                  required
                  rows={2}
                  value={usefulSkills}
                  onChange={(e) => setUsefulSkills(e.target.value)}
                  placeholder="e.g. The laboratory sessions on IV insertion, clinical pharmacokinetics logs, and hospital emergency triage simulation modules during senior project."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Obsolete elements */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Obsolete or Outdated Elements</label>
                <textarea
                  required
                  rows={2}
                  value={obsoleteSkills}
                  onChange={(e) => setObsoleteSkills(e.target.value)}
                  placeholder="e.g. Filling out tedious paper clinical summary sheets that occupy half of our shifts. Hospital systems use paperless electronic records exclusively now."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Curriculum Gaps */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Key Gaps in the Curriculum</label>
                <textarea
                  required
                  rows={2}
                  value={curriculumGaps}
                  onChange={(e) => setCurriculumGaps(e.target.value)}
                  placeholder="e.g. Pediatric-specific dosage charting, advanced critical-care monitor readings, and stress burn-out resilience methods."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Back to Profile
                </button>
                <button
                  type="button"
                  disabled={loading || !usefulSkills || !obsoleteSkills || !curriculumGaps}
                  onClick={handleSimulateFeedback}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Recording...' : 'Record Simulated Response'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
