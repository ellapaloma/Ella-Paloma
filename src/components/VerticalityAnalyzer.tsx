/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Award,
  AlertCircle,
  TrendingUp,
  Fingerprint,
  Layers,
  ChevronRight,
  BrainCircuit,
  Search,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { Graduate, AlignmentAnalysis } from '../types';

interface VerticalityAnalyzerProps {
  id: string;
  graduates: Graduate[];
  onTriggerAnalyze: (id: string) => Promise<void>;
  apiKeyProvided: boolean;
}

export default function VerticalityAnalyzer({
  id,
  graduates,
  onTriggerAnalyze,
  apiKeyProvided
}: VerticalityAnalyzerProps) {
  const [selectedGradId, setSelectedGradId] = useState<string>('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sift only employed grads
  const employedGraduates = useMemo(() => {
    return graduates.filter(
      (g) => g.employmentStatus !== 'Unemployed' && g.employmentStatus !== 'Pursuing Higher Education'
    );
  }, [graduates]);

  const filteredGraduates = useMemo(() => {
    if (!searchQuery) return employedGraduates;
    const query = searchQuery.toLowerCase();
    return employedGraduates.filter(
      (g) => g.name.toLowerCase().includes(query) || g.degree.toLowerCase().includes(query)
    );
  }, [employedGraduates, searchQuery]);

  // Set default selected graduate index if not yet set
  const activeGraduate = useMemo(() => {
    if (selectedGradId) {
      return employedGraduates.find((g) => g.id === selectedGradId) || employedGraduates[0];
    }
    return employedGraduates[0];
  }, [employedGraduates, selectedGradId]);

  // General Alignment factors statistics
  const alignmentStats = useMemo(() => {
    const analyzed = employedGraduates.filter((g) => g.alignmentAnalysis !== null);
    const totals = { Vertical: 0, Horizontal: 0, Lateral: 0 };
    let scoreSum = 0;

    // Collect all factors
    const factorCounts: Record<string, number> = {};

    analyzed.forEach((g) => {
      const cat = g.alignmentAnalysis!.alignmentCategory;
      scoreSum += g.alignmentAnalysis!.alignmentScore;
      if (cat === 'Vertical') totals.Vertical++;
      else if (cat === 'Horizontal') totals.Horizontal++;
      else totals.Lateral++;

      g.alignmentAnalysis!.keyFactors.forEach((f) => {
        // Uniform parsing of factors for charting
        let normalized = f;
        if (f.toLowerCase().includes('capstone') || f.toLowerCase().includes('senior design')) normalized = 'Capstone & Project Portfolios';
        else if (f.toLowerCase().includes('clinical') || f.toLowerCase().includes('hospital')) normalized = 'Required Clinical Residency';
        else if (f.toLowerCase().includes('licensure') || f.toLowerCase().includes('certif')) normalized = 'Professional Credentialing';
        else if (f.toLowerCase().includes('math') || f.toLowerCase().includes('technical instruction') || f.toLowerCase().includes('rigorous')) normalized = 'Technical Depth & Academic Core';
        else if (f.toLowerCase().includes('communication') || f.toLowerCase().includes('organizational')) normalized = 'Soft Skills & Organizational Core';
        else if (f.toLowerCase().includes('cooperative') || f.toLowerCase().includes('internship') || f.toLowerCase().includes('network')) normalized = 'Cooperative Internships & Placement Networks';
        else normalized = 'Market-Driven Focus / Personal Pivot';

        factorCounts[normalized] = (factorCounts[normalized] || 0) + 1;
      });
    });

    const factorList = Object.keys(factorCounts).map((f) => ({
      name: f,
      count: factorCounts[f]
    })).sort((a, b) => b.count - a.count);

    return {
      totalAnalyzed: analyzed.length,
      averageScore: analyzed.length ? Math.round(scoreSum / analyzed.length) : 0,
      breakdown: totals,
      topFactors: factorList
    };
  }, [employedGraduates]);

  const handleRunAnalysis = async (id: string) => {
    setLoadingId(id);
    setErrorText(null);
    try {
      await onTriggerAnalyze(id);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'Analysis interface failed. Ensure your server is active and secrets are configured.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div id={id} className="space-y-6">
      {/* Intro Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight font-display text-white">Degree Verticality & Factor Analyzer</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Evaluate how closely academic majors match technical roles. Employs large language model categorization and maps critical employment indicators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Alumni Select List */}
        <div className="lg:col-span-4 rounded-xl bg-slate-900 border border-slate-800 p-4 flex flex-col space-y-4">
          <div>
            <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-400">
              Alumni roster
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Select any employed graduate below to inspect or run AI alignment analysis.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query employed graduate name..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none"
            />
          </div>

          {/* List items scrollbox */}
          <div className="space-y-1.5 overflow-y-auto max-h-[420px] pr-1">
            {filteredGraduates.length === 0 ? (
              <span className="text-xs text-slate-500 block text-center py-6">
                No active matching records.
              </span>
            ) : (
              filteredGraduates.map((g) => {
                const isActive = activeGraduate?.id === g.id;
                const alignment = g.alignmentAnalysis;

                return (
                  <button
                    key={g.id}
                    onClick={() => {
                      setSelectedGradId(g.id);
                      setErrorText(null);
                    }}
                    className={`w-full p-2.5 rounded-lg border text-left flex items-start justify-between gap-2.5 transition-all text-xs cursor-pointer ${
                      isActive
                        ? 'bg-slate-800 border-emerald-500/50 text-white'
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-bold truncate text-slate-200">{g.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">{g.degree.replace('B.S. ', '')}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold truncate">{g.jobTitle}</p>
                    </div>

                    <div className="shrink-0 pt-0.5">
                      {alignment ? (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase ${
                            alignment.alignmentCategory === 'Vertical'
                              ? 'text-purple-400 bg-purple-500/15'
                              : alignment.alignmentCategory === 'Horizontal'
                                ? 'text-emerald-400 bg-emerald-500/15'
                                : 'text-amber-400 bg-amber-500/15'
                          }`}
                        >
                          {alignment.alignmentCategory.slice(0, 3)}.
                        </span>
                      ) : (
                        <HelpCircle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: AI Core Analyzer Studio */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {activeGraduate ? (
              <motion.div
                key={activeGraduate.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-5"
              >
                {/* Header profile cards */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-base font-bold font-display text-white">{activeGraduate.name}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Degree: <strong>{activeGraduate.degree}</strong> (Class {activeGraduate.gradYear})
                    </p>
                  </div>
                  <div className="text-left sm:text-right font-display text-slate-300">
                    <p className="font-bold text-xs text-slate-200">{activeGraduate.jobTitle}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{activeGraduate.employer} • {activeGraduate.industry}</p>
                  </div>
                </div>

                {errorText && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2 text-xs text-rose-400 shadow-inner">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorText}</span>
                  </div>
                )}

                {/* Sub-block analysis results */}
                {activeGraduate.alignmentAnalysis ? (
                  <div className="space-y-5">
                    {/* Gauge score breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Metric Category */}
                      <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl text-center flex flex-col justify-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-display">
                          Vertical Class
                        </span>
                        <span
                          className={`text-lg font-bold font-display tracking-tight mt-1.5 block ${
                            activeGraduate.alignmentAnalysis.alignmentCategory === 'Vertical'
                              ? 'text-purple-400'
                              : activeGraduate.alignmentAnalysis.alignmentCategory === 'Horizontal'
                                ? 'text-emerald-400'
                                : 'text-amber-400'
                          }`}
                        >
                          {activeGraduate.alignmentAnalysis.alignmentCategory}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-1">
                          Semantic job mapping
                        </span>
                      </div>

                      {/* Alignment Score progress gauge */}
                      <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl text-center flex flex-col justify-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-display">
                          Alignment Index
                        </span>
                        <div className="flex items-center justify-center gap-1.5 mt-1.5">
                          <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-xl font-mono font-bold text-white">
                            {activeGraduate.alignmentAnalysis.alignmentScore}%
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">
                          Out of 100 benchmark
                        </span>
                      </div>

                      {/* Analysis Timestamp */}
                      <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl text-center flex flex-col justify-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-display">
                          Verified Stamp
                        </span>
                        <span className="text-xs text-white font-mono font-medium block mt-1.5">
                          {new Date(activeGraduate.alignmentAnalysis.analyzedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-1">
                          Gemini-3.5-flash AI engine
                        </span>
                      </div>
                    </div>

                    {/* AI Narrative Breakdown */}
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-display">
                        <BrainCircuit className="w-4 h-4 text-purple-400" />
                        Professional Narrative & Diagnostics
                      </h3>
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 leading-relaxed font-sans">
                        {activeGraduate.alignmentAnalysis.geminiExplanation}
                      </div>
                    </div>

                    {/* Contributing Career Factors */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-display">
                        <Fingerprint className="w-4 h-4 text-emerald-400" />
                        Core Employment Factors (AI Extracted)
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {activeGraduate.alignmentAnalysis.keyFactors.map((fact, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg border border-slate-850 bg-slate-950 flex gap-2.5 items-start text-xs"
                          >
                            <span className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 font-mono mt-0.5">
                              0{idx + 1}
                            </span>
                            <span className="text-slate-300 leading-snug">{fact}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Re-trigger options */}
                    <div className="flex justify-end pt-3">
                      <button
                        onClick={() => handleRunAnalysis(activeGraduate.id)}
                        disabled={loadingId === activeGraduate.id}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-750 text-slate-300 hover:text-white hover:bg-slate-750 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        {loadingId === activeGraduate.id ? 'Re-analyzing...' : 'Refresh Alignment Analysis'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-4 bg-slate-950 border border-slate-850 rounded-xl shadow-inner">
                    <BrainCircuit className="w-12 h-12 text-slate-700 mx-auto animate-pulse" />
                    <div>
                      <h3 className="text-sm font-bold text-white font-display">Alignment Analysis Pending</h3>
                      <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto leading-relaxed">
                        This graduate (Employed as <strong>{activeGraduate.jobTitle}</strong>) has not yet been processed for degree verticality. 
                        Let Gemini-3.5-flash evaluate their curriculum-job mapping.
                      </p>
                    </div>
                    <button
                      onClick={() => handleRunAnalysis(activeGraduate.id)}
                      disabled={loadingId === activeGraduate.id}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      {loadingId === activeGraduate.id ? 'Triggering AI Engine...' : 'Run Gemini Alignment Analytics'}
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <span className="text-xs text-slate-500 block text-center py-10">Select an active alumni to display parameters.</span>
            )}
          </AnimatePresence>

          {/* Factor distribution aggregate metrics */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 font-display mb-4">
              <Layers className="w-4 h-4 text-sky-400" />
              Aggregate Employment Drivers & Factors Graph
            </h3>

            {alignmentStats.topFactors.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">Run verticality analyses above to populate aggregate employment drivers metrics.</p>
            ) : (
              <div className="space-y-3.5">
                {alignmentStats.topFactors.map((factor, fidx) => {
                  const maxCount = Math.max(...alignmentStats.topFactors.map((f) => f.count));
                  const percentage = Math.round((factor.count / maxCount) * 100);

                  return (
                    <div key={fidx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{factor.name}</span>
                        <span className="font-bold text-white font-mono">{factor.count} times cited</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sky-400 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <span className="text-[10px] text-slate-500 block mt-2 text-right">Factors extracted programmatically via Gemini NLP semantic tags.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
