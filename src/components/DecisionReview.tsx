/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Award,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  BookMarked,
  Layers,
  Activity,
  HeartCrack
} from 'lucide-react';
import { CurriculumEnhancementReport, Graduate } from '../types';
import FutureCurriculumView from './FutureCurriculumView';

interface DecisionReviewProps {
  id: string;
  graduates: Graduate[];
  onGenerateReport: () => Promise<CurriculumEnhancementReport>;
}

export default function DecisionReview({ id, graduates, onGenerateReport }: DecisionReviewProps) {
  const [subTab, setSubTab] = useState<'proposals' | 'future'>('proposals');
  const [report, setReport] = useState<CurriculumEnhancementReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Active survey responders list
  const respondersList = graduates.filter((g) => g.surveyResponse !== null);

  const handleCreateDSSReport = async () => {
    setLoading(true);
    setErrorText(null);
    try {
      const generated = await onGenerateReport();
      setReport(generated);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'QA synthesis failed. Please record active alumni tracer survey responses first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id={id} className="space-y-6">
      {/* Intro block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight font-display text-white">Curriculum Enhancement Decision Suite (DSS)</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Collects qualitative alumni feedback and runs structured Gemini synthesis to formulate priority curriculum restructuring proposals.
          </p>
        </div>

        {/* Sub-tab segment selector */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 self-start shrink-0 select-none">
          <button
            onClick={() => setSubTab('proposals')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold font-display uppercase tracking-widest transition-all cursor-pointer ${
              subTab === 'proposals'
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Alumni QA Proposals
          </button>
          <button
            onClick={() => setSubTab('future')}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold font-display uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'future'
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${subTab === 'future' ? 'text-slate-950' : 'text-purple-400'}`} />
            3-5 Yr Curriculum Vision
          </button>
        </div>
      </div>

      {subTab === 'future' ? (
        <FutureCurriculumView id="dss-future-curriculum" graduates={graduates} />
      ) : (
        <>
          <div className="flex justify-between items-center py-2 border-b border-slate-900 gap-4">
            <span className="text-xs text-slate-400">Current Scope: Student Surveys Synthesis Matrix</span>
            <button
              onClick={handleCreateDSSReport}
              disabled={loading || respondersList.length === 0}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-purple-750 animate-spin" />
              {loading ? 'Generating Strategy...' : 'Synthesize AI Curriculum Proposal'}
            </button>
          </div>

          {/* Grid: Left Column data feeding status, Right Column AI recommendations report */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left: Input parameters database summary */}
            <div className="xl:col-span-4 space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3.5">
                <div>
                  <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-400">
                    Lending Active Data Feeds
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Active tracer surveys feeding the evaluation matrix:
                  </p>
                </div>

                {/* Micro stats counter */}
                <div className="grid grid-cols-2 gap-3.5 font-display text-center">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                    <span className="text-slate-400 text-[10px] font-semibold block uppercase font-mono">Total Responders</span>
                    <span className="text-lg font-bold text-white block mt-1">{respondersList.length}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                    <span className="text-slate-400 text-[10px] font-semibold block uppercase font-mono">Pending Outreach</span>
                    <span className="text-lg font-bold text-slate-500 block mt-1">
                      {graduates.length - respondersList.length}
                    </span>
                  </div>
                </div>

                {/* List of feeding comments */}
                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {respondersList.map((g) => (
                    <div key={g.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 text-[11px] leading-snug space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-slate-200">{g.name}</span>
                        <span className="font-semibold text-slate-500">{g.degree.replace('B.S. ', '')}</span>
                      </div>
                      <p className="text-slate-400 line-clamp-2 italic">
                        &ldquo;{g.surveyResponse?.curriculumGaps}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prompting instruction card */}
              <div className="p-4 rounded-xl border border-slate-800/65 bg-slate-900/60 leading-normal text-xs text-slate-400 space-y-2">
                <span className="font-bold text-slate-200 block font-display">Academic QA Synthesis Rules:</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  When clicked, the backend collects all available text blocks (<em>Gaps, Obsolete content, Useful skill sets</em>) and passes them to our Gemini framework. Correct structural mapping ensures 0% fake recommendations and focuses heavily on high priority adjustments.
                </p>
              </div>
            </div>

            {/* Right: Recommendation proposals log */}
            <div className="xl:col-span-8">
              {errorText && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex gap-2 mb-4 leading-normal">
                  <HeartCrack className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-bold">QA Decision Engine Error</p>
                    <p className="mt-1">{errorText}</p>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="p-16 rounded-xl border border-slate-800 bg-slate-900 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="relative">
                    <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <Sparkles className="w-4 h-4 text-purple-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold font-display">Gemini Decision Engines are Active</p>
                    <p className="text-slate-500 text-[11px] mt-1 max-w-sm mx-auto">
                      Aggregating student diagnostic comments, categorizing departmental gaps, and formatting actionable curriculum enhancements.
                    </p>
                  </div>
                </div>
              ) : report ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  {/* Proposal Header */}
                  <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-850">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold font-mono tracking-wider">
                          Proposal Registry — {report.id}
                        </span>
                        <h2 className="text-base font-bold text-white font-display mt-1.5 flex items-center gap-1.5">
                          Curriculum QA Assessment Report
                        </h2>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Synthesized: {new Date(report.generatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Grid stats */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase font-mono">Alumni Analyzed</span>
                        <span className="text-sm font-bold text-white font-mono mt-1 block">
                          {report.generalMetrics.totalAlumniAnalyzed} records
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase font-mono">Degree Relevance Index</span>
                        <span className="text-sm font-bold text-emerald-400 font-mono mt-1 block">
                          {report.generalMetrics.averageRelevanceRating} / 5.0
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase font-mono">Verticality Match</span>
                        <span className="text-sm font-bold text-purple-400 font-mono mt-1 block">
                          {report.generalMetrics.verticalPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* General Findings & High Demands Bento Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Key Findings */}
                    <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
                      <h3 className="text-xs font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5 font-display">
                        <BookMarked className="w-4 h-4 text-emerald-400" />
                        General Thematic Findings
                      </h3>
                      <ul className="space-y-2.5">
                        {report.keyFindings.map((find, fidx) => (
                          <li key={fidx} className="flex gap-2 text-xs text-slate-300 leading-normal mb-1">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{find}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* High demand tech / skills */}
                    <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
                      <h3 className="text-xs font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5 font-display">
                        <Activity className="w-4 h-4 text-sky-400" />
                        Market-Driven High-Demand Skills
                      </h3>
                      <div className="space-y-3.5">
                        {report.skillsInHighDemand.map((skill, sidx) => (
                          <div key={sidx} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-slate-300">{skill.name}</span>
                              <span className="font-mono text-emerald-400">{skill.importanceScore} / 100</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-sky-400"
                                style={{ width: `${skill.importanceScore}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Departmental Suggestions list */}
                  <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
                    <h3 className="text-xs font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5 font-display">
                      <Layers className="w-4 h-4 text-purple-400 animate-pulse" />
                      Proposed Departmental Curriculum Adjustments
                    </h3>

                    <div className="space-y-3">
                      {report.recommendations.map((rec, rids) => (
                        <div
                          key={rids}
                          className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2.5 hover:border-slate-750 transition-colors shadow-inner"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-white font-display">
                                {rec.department}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 font-semibold text-[10px] tracking-tight">
                                {rec.curriculumAction}
                              </span>
                            </div>

                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider uppercase ${
                                rec.priority === 'High'
                                  ? 'text-rose-400 bg-rose-500/10'
                                  : rec.priority === 'Medium'
                                    ? 'text-amber-400 bg-amber-500/10'
                                    : 'text-slate-400 bg-slate-800'
                              }`}
                            >
                              {rec.priority} Priority
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed font-sans">{rec.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="p-16 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col items-center justify-center space-y-4 text-center">
                  <BookOpen className="w-12 h-12 text-slate-700 mx-auto" />
                  <div className="max-w-md">
                    <h3 className="text-sm font-bold text-slate-300 font-display">Decision recommendations engine is silent</h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      No synthesis is currently active. Click the button above to have Gemini inspect all recorded alumni survey comments and formulate curricular improvements.
                    </p>
                  </div>
                  <button
                    onClick={handleCreateDSSReport}
                    disabled={respondersList.length === 0}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-purple-700" />
                    Initialize QA Curriculum Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
