/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  UserPlus,
  Trash2,
  Edit,
  Mail,
  Sparkles,
  Award,
  CheckCircle,
  HelpCircle,
  FolderSync,
  Building,
  RotateCcw,
  GraduationCap,
  Plus,
  X
} from 'lucide-react';
import { Graduate, EmploymentStatus } from '../types';

interface GraduateTrackerProps {
  id: string;
  graduates: Graduate[];
  onAddOrEdit: (grad?: Graduate) => void;
  onDeleteProfile: (id: string) => Promise<void>;
  onTriggerSurvey: (id: string) => Promise<void>;
  onTriggerBulkSurveys: (ids: string[]) => Promise<void>;
  onTriggerAnalyze: (id: string) => Promise<void>;
  onResetDatabase: () => Promise<void>;
  programs?: string[];
  onAddProgram?: (name: string) => Promise<void>;
  onDeleteProgram?: (name: string) => Promise<void>;
}

export default function GraduateTracker({
  id,
  graduates,
  onAddOrEdit,
  onDeleteProfile,
  onTriggerSurvey,
  onTriggerBulkSurveys,
  onTriggerAnalyze,
  onResetDatabase,
  programs = ['Bachelor of Science in Information Technology (BSIT)'],
  onAddProgram,
  onDeleteProgram
}: GraduateTrackerProps) {
  const [search, setSearch] = useState('');
  const [degreeFilter, setDegreeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [surveyFilter, setSurveyFilter] = useState('');
  const [alignmentFilter, setAlignmentFilter] = useState('');

  // Programs management panel state
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const [newProgramName, setNewProgramName] = useState('');
  const [actingProgram, setActingProgram] = useState(false);

  // Bulk selections
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Extract unique filter dropdown values
  const degrees = useMemo(() => {
    return Array.from(new Set(graduates.map((g) => g.degree))).filter(Boolean);
  }, [graduates]);

  const filteredGraduates = useMemo(() => {
    return graduates.filter((g) => {
      const gName = g.name.toLowerCase();
      const gTitle = g.jobTitle.toLowerCase();
      const gEmployer = g.employer.toLowerCase();
      const gEmail = g.email.toLowerCase();
      const query = search.toLowerCase();

      const matchesSearch =
        gName.includes(query) ||
        gTitle.includes(query) ||
        gEmployer.includes(query) ||
        gEmail.includes(query);

      const matchesDegree = !degreeFilter || g.degree === degreeFilter;
      const matchesStatus = !statusFilter || g.employmentStatus === statusFilter;

      let matchesSurvey = true;
      if (surveyFilter === 'submitted') {
        matchesSurvey = g.surveyResponse !== null;
      } else if (surveyFilter === 'pending') {
        matchesSurvey = g.surveyResponse === null;
      }

      let matchesAlignment = true;
      if (alignmentFilter === 'unanalyzed') {
        matchesAlignment = g.alignmentAnalysis === null;
      } else if (alignmentFilter) {
        matchesAlignment = g.alignmentAnalysis?.alignmentCategory === alignmentFilter;
      }

      return matchesSearch && matchesDegree && matchesStatus && matchesSurvey && matchesAlignment;
    });
  }, [graduates, search, degreeFilter, statusFilter, surveyFilter, alignmentFilter]);

  // Bulk action handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredGraduates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredGraduates.map((g) => g.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  async function handleSendBulk() {
    if (selectedIds.length === 0) return;
    setBulkLoading(true);
    try {
      await onTriggerBulkSurveys(selectedIds);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
    } finally {
      setBulkLoading(false);
    }
  }

  return (
    <div id={id} className="space-y-6">
      {/* Tracker Intro Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight font-display text-white">Alumni Profiles & Employment</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Add profile registries, query labor tracks, and launch survey actions.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => onResetDatabase()}
            title="Reset data store to default preloaded state"
            className="p-2 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Data
          </button>
          <button
            onClick={() => setIsProgramsOpen(true)}
            title="Manage institutional IT program offerings"
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            Manage Programs
          </button>
          <button
            onClick={() => onAddOrEdit()}
            className="flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Register Graduate
          </button>
        </div>
      </div>

      {/* Structured Filter Workspace */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 shadow-lg">
        {/* Search Input */}
        <div className="md:col-span-4 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, employer, or job title..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700 transition-colors"
          />
        </div>

        {/* Degree filter */}
        <div className="md:col-span-2">
          <select
            value={degreeFilter}
            onChange={(e) => setDegreeFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="">All Degrees</option>
            {degrees.map((deg) => (
              <option key={deg} value={deg}>
                {deg.replace('B.S. ', '')}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="md:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Employed Full-time">Full-time</option>
            <option value="Employed Part-time">Part-time</option>
            <option value="Self-employed">Self-employed</option>
            <option value="Pursuing Higher Education">Higher Ed</option>
            <option value="Unemployed">Unemployed</option>
          </select>
        </div>

        {/* Survey filter */}
        <div className="md:col-span-2">
          <select
            value={surveyFilter}
            onChange={(e) => setSurveyFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="">Any Feedback State</option>
            <option value="submitted">Survey Completed</option>
            <option value="pending">Survey Outstanding</option>
          </select>
        </div>

        {/* Alignment filter */}
        <div className="md:col-span-2">
          <select
            value={alignmentFilter}
            onChange={(e) => setAlignmentFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="">Any Alignment focus</option>
            <option value="Vertical">Vertical Match</option>
            <option value="Horizontal">Horizontal Match</option>
            <option value="Lateral/Non-aligned">Lateral Match</option>
            <option value="unanalyzed">Unanalyzed</option>
          </select>
        </div>
      </div>

      {/* Bulk triggers toolbar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{selectedIds.length} graduate(s) chosen for outreach</span>
            </div>
            <button
              onClick={handleSendBulk}
              disabled={bulkLoading}
              className="px-3 py-1.5 rounded bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Mail className="w-4 h-4" />
              {bulkLoading ? 'Sending Out...' : 'Send Survey Templates'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table block */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                <th className="p-4 w-12">
                  <input
                    type="checkbox"
                    checked={
                      filteredGraduates.length > 0 &&
                      selectedIds.length === filteredGraduates.length
                    }
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-800 bg-slate-900 accent-emerald-500 cursor-pointer"
                  />
                </th>
                <th className="p-4">Alumni Profile</th>
                <th className="p-4">Academic Background</th>
                <th className="p-4">Labor Force Status</th>
                <th className="p-4">Workplace Anchor</th>
                <th className="p-4">Tracer Survey</th>
                <th className="p-4">AI Degree Alignment</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredGraduates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-slate-500 font-medium">
                    No alumni registry found matching filters. Adjust or reset filter bars.
                  </td>
                </tr>
              ) : (
                filteredGraduates.map((grad) => {
                  const hasSurvey = grad.surveyResponse !== null;
                  const isUnemployed = grad.employmentStatus === 'Unemployed';

                  // Dynamic Alignment display helper
                  const alignment = grad.alignmentAnalysis;

                  return (
                    <tr
                      key={grad.id}
                      className="hover:bg-slate-850/40 transition-colors text-[12px] group"
                    >
                      {/* Checkbox columns */}
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(grad.id)}
                          onChange={() => handleToggleSelect(grad.id)}
                          className="rounded border-slate-800 bg-slate-900 accent-emerald-500 cursor-pointer"
                        />
                      </td>

                      {/* Profile info block */}
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {grad.name}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-600" />
                            {grad.email}
                          </span>
                        </div>
                      </td>

                      {/* Degree Program & year */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-300">
                            {grad.degree.replace('B.S. ', '')}
                          </span>
                          <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1.5">
                            Class of {grad.gradYear}
                          </span>
                          {grad.undergraduateMajor && grad.undergraduateMajor !== grad.degree && (
                            <span className="text-[10px] text-slate-400 italic mt-0.5 block max-w-[150px] truncate" title={grad.undergraduateMajor}>
                              Focus: {grad.undergraduateMajor}
                            </span>
                          )}
                          {grad.location && (
                            <span className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">
                              📍 {grad.location}
                            </span>
                          )}
                          {grad.selfReportedSkills && grad.selfReportedSkills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1 max-w-[160px]">
                              {grad.selfReportedSkills.slice(0, 3).map((sk, idx) => (
                                <span key={idx} className="text-[9px] px-1 py-0.2 rounded border border-slate-800 bg-slate-950 text-slate-400 truncate max-w-[60px]" title={`${sk.skillName} (${sk.proficiencyLevel})`}>
                                  {sk.skillName}
                                </span>
                              ))}
                              {grad.selfReportedSkills.length > 3 && (
                                <span className="text-[8px] text-slate-600 font-mono">+{grad.selfReportedSkills.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Employment State Badge */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            grad.employmentStatus === 'Employed Full-time'
                              ? 'text-sky-400 bg-sky-400/10'
                              : grad.employmentStatus === 'Employed Part-time'
                                ? 'text-emerald-400 bg-emerald-400/10'
                                : grad.employmentStatus === 'Self-employed'
                                  ? 'text-indigo-400 bg-indigo-400/10'
                                  : grad.employmentStatus === 'Pursuing Higher Education'
                                    ? 'text-purple-400 bg-purple-400/10'
                                    : 'text-slate-400 bg-slate-800/60'
                          }`}
                        >
                          {grad.employmentStatus.replace('Employed ', '')}
                        </span>
                      </td>

                      {/* Work detail columns */}
                      <td className="p-4">
                        {isUnemployed ? (
                          <span className="text-slate-500 italic">Unemployed</span>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-200">{grad.jobTitle}</span>
                            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                              <Building className="w-3.5 h-3.5 text-slate-500" />
                              {grad.employer}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Survey Response badge */}
                      <td className="p-4">
                        {hasSurvey ? (
                          <div className="flex items-center gap-1.5 text-emerald-400">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                            <div className="flex flex-col">
                              <span className="font-semibold text-[11px]">Submitted</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                Rating: {grad.surveyResponse?.relevanceRating}/5
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <HelpCircle className="w-4 h-4 text-slate-600 shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-[11px]">Outstanding</span>
                              <button
                                onClick={async () => {
                                  setActionLoadingId(grad.id);
                                  await onTriggerSurvey(grad.id);
                                  setActionLoadingId(null);
                                }}
                                disabled={actionLoadingId === grad.id}
                                className="text-[10px] font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer underline text-left mt-0.5"
                              >
                                {actionLoadingId === grad.id ? 'Sending...' : 'Dispatch email'}
                              </button>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* AI integration Alignment Columns */}
                      <td className="p-4">
                        {isUnemployed ? (
                          <span className="text-slate-600">-</span>
                        ) : alignment ? (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="inline-flex flex-col gap-0.5 cursor-pointer max-w-[130px]"
                          >
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                alignment.alignmentCategory === 'Vertical'
                                  ? 'text-purple-400 bg-purple-400/10'
                                  : alignment.alignmentCategory === 'Horizontal'
                                    ? 'text-emerald-400 bg-emerald-400/10'
                                    : 'text-amber-400 bg-amber-400/10'
                              }`}
                            >
                              <Award className="w-3.5 h-3.5" />
                              {alignment.alignmentCategory}
                            </span>
                            <span className="text-[10px] font-mono font-medium text-slate-500 ml-1">
                              Match: {alignment.alignmentScore}%
                            </span>
                          </motion.div>
                        ) : (
                          <button
                            onClick={async () => {
                              setActionLoadingId(grad.id);
                              await onTriggerAnalyze(grad.id);
                              setActionLoadingId(null);
                            }}
                            disabled={actionLoadingId === grad.id}
                            className="px-2 py-1 rounded border border-slate-800 bg-slate-950 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors flex items-center gap-1 text-[10px] font-semibold cursor-pointer disabled:opacity-50"
                          >
                            <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                            {actionLoadingId === grad.id ? 'Analyzing...' : 'Analyze Align'}
                          </button>
                        )}
                      </td>

                      {/* Action buttons columns */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => onAddOrEdit(grad)}
                            title="Edit general metrics or write responses"
                            className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteProfile(grad.id)}
                            title="Delete graduate records"
                            className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Programs Modal Overlay */}
      <AnimatePresence>
        {isProgramsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl font-sans"
            >
              <div className="border-b border-slate-800 p-4 flex justify-between items-center bg-slate-900">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white font-display">Manage Program Offerings</h3>
                </div>
                <button
                  onClick={() => {
                    setIsProgramsOpen(false);
                    setNewProgramName('');
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Add dynamic program input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Add Program Of Study</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Bachelor of Science in Entrepreneurship (BSE)"
                      value={newProgramName}
                      onChange={(e) => setNewProgramName(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-slate-700"
                    />
                    <button
                      onClick={async () => {
                        if (!newProgramName.trim()) return;
                        setActingProgram(true);
                        if (onAddProgram) {
                          await onAddProgram(newProgramName);
                        }
                        setNewProgramName('');
                        setActingProgram(false);
                      }}
                      disabled={actingProgram || !newProgramName.trim()}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all text-xs flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  <div className="border-b border-slate-800 pb-1 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Offerings</span>
                    <span className="text-[10px] text-slate-500 font-medium">Link Status</span>
                  </div>
                  {programs.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">No active programs defined.</p>
                  ) : (
                    programs.map((prog) => {
                      const associatedCount = graduates.filter(g => g.degree === prog).length;
                      return (
                        <div
                          key={prog}
                          className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800/50 rounded-lg"
                        >
                          <div className="max-w-[75%]">
                            <p className="text-xs font-semibold text-white break-words">{prog}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                              {associatedCount} associated {associatedCount === 1 ? 'record' : 'records'}
                            </p>
                          </div>
                          <button
                            onClick={async () => {
                              if (associatedCount > 0) {
                                if (!window.confirm(`Warning: Delete "${prog}"? This will unlink it from ${associatedCount} alumni profile records. Continue?`)) {
                                  return;
                                }
                              }
                              setActingProgram(true);
                              if (onDeleteProgram) {
                                await onDeleteProgram(prog);
                              }
                              setActingProgram(false);
                            }}
                            disabled={actingProgram}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-all cursor-pointer disabled:opacity-40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="border-t border-slate-800 p-3 bg-slate-950/40 text-[10px] text-slate-500 flex justify-between items-center">
                <span>RSU-SFC Academic CRM System</span>
                <button
                  onClick={() => setIsProgramsOpen(false)}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold border border-slate-800 rounded transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
